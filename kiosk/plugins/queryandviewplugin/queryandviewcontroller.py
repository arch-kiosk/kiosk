import datetime
import logging
import os.path
import shutil
from pprint import pprint

from flask import Blueprint, request, render_template, session, redirect, url_for, abort
from flask_login import current_user
from http import HTTPStatus

from werkzeug.exceptions import HTTPException

import kiosklib
from authorization import full_login_required, MANAGE_SERVER_PRIVILEGE
from authorization import get_local_authorization_strings, EDIT_WORKSTATION_PRIVILEGE, \
    SYNCHRONIZE, PREPARE_WORKSTATIONS, DOWNLOAD_WORKSTATION, UPLOAD_WORKSTATION, CREATE_WORKSTATION
import kioskstdlib

import kioskglobals
from backupreminder import BackupReminder

from core.kioskcontrollerplugin import get_plugin_for_controller
from kioskconfig import KioskConfig
from kiosklib import is_ajax_request, nocache, UserError
from kioskquery.kioskquerystore import KioskQueryStore
from kioskrepresentationtype import KioskRepresentations
from kioskresult import KioskResult
from kioskwtforms import kiosk_validate
from mcpinterface.mcpconstants import MCPJobStatus
from mcpinterface.mcpjob import MCPJob
from synchronization import Synchronization

_plugin_name_ = "queryandviewplugin"
_controller_name_ = "queryandview"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.1

LOCAL_PRIVILEGES = {
    EDIT_WORKSTATION_PRIVILEGE: "edit workstation",
    CREATE_WORKSTATION: "create workstation",
    PREPARE_WORKSTATIONS: "prepare workstation",
    DOWNLOAD_WORKSTATION: "download workstation",
    UPLOAD_WORKSTATION: "upload workstation",
    SYNCHRONIZE: "synchronize",
    MANAGE_SERVER_PRIVILEGE: "manage server"
}

queryandview = Blueprint(_controller_name_, __name__,
                         template_folder='templates',
                         static_folder="static",
                         url_prefix=_url_prefix_)
print(f"{_controller_name_} module loaded")


@queryandview.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


#  **************************************************************
#  ****    /redirecting index
#  **************************************************************
@queryandview.route('_redirect', methods=['GET'])
@full_login_required
def query_and_view_index():
    print("------------- redirecting")
    return redirect(url_for("queryandview.query_and_view_show"))


#  **************************************************************
#  ****    /query_and_view_show
#  *****************************************************************/
@queryandview.route('', methods=['GET', 'POST'])
@full_login_required
@nocache
def query_and_view_show():
    print("\n*************** queryandview / ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    main_module = False
    try:
        pprint(request)
        if request.method == "POST":
            main_module = request.form['mainModule']
            if main_module:
                print("client is requesting main module")
    except KeyError:
        pass

    conf = kioskglobals.get_config()

    fullscreen_representation_id = conf.file_repository["fullscreen_representation"]
    representations = [f"{x[0]},{x[1]}" for x in KioskRepresentations.get_representation_labels_and_ids(conf)]

    load_dynamic_app = {
        "controller_name": _controller_name_,
        "load_from_address": "query_and_view_show"
    }
    if not main_module:
        return render_template('queryandview.html', load_dynamic_app=load_dynamic_app)
    else:
        return render_template('queryandview_main.html',
                               fullscreen_representation_id=fullscreen_representation_id,
                               resolutions=",".join(representations),
                               load_dynamic_app=load_dynamic_app)


#  **************************************************************
#  ****    initiate update query dialog
#  **************************************************************/
@queryandview.route('/update_query', methods=['GET'])
@full_login_required
def update_query():
    """
        sends the template for the update query dialog.
        This needs to be called via AJAX.
    """
    logging.info(f"queryandview.update_query called.")
    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if "manage server" not in authorized_to:
            logging.warning(f"Unauthorized access to queryandviewcontroller/update_query "
                            f"by user {current_user.user_id}")
            abort(HTTPStatus.UNAUTHORIZED)

        general_errors = []
        if not (kioskglobals.get_development_option(
                "webapp_development").lower() == "true" or kiosklib.is_ajax_request()):
            err = f"queryandview.update_query: attempt to access endpoint other than by ajax"
            logging.error(err)
            abort(HTTPStatus.BAD_REQUEST, err)

        cfg = kioskglobals.get_config()

        return render_template('uploadquery.html',
                               general_errors=general_errors)

    except HTTPException as e:
        logging.error(f"queryandview.update_query: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"queryandview.update_query: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    UPLOAD query files
#  *****************************************************************/
@queryandview.route('/upload_query', methods=['POST'])
@full_login_required
def upload_query():
    """
        uploaded queries are first stored in Kiosk's temp upload folder
    """

    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if MANAGE_SERVER_PRIVILEGE not in authorized_to:
            logging.warning(f"Unauthorized access to queryandview/upload_query "
                            f"by user {current_user.user_id}")
            abort(HTTPStatus.UNAUTHORIZED)

        result = KioskResult(message="Unknown error on upload")
        logging.info(f"queryandviewcontroller: Received new file for reporting from user {current_user.user_id}")

        try:
            cfg: KioskConfig = kioskglobals.get_config()
            temp_dir = cfg.get_temporary_upload_path()
            if not os.path.exists(temp_dir):
                raise UserError(
                    f"The Kiosk Server is not properly configured. It lacks a temporary upload path. "
                    f"Please talk to your admin.")

            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    uploaded_file_name = kioskstdlib.get_filename(file.filename)
                    if kioskstdlib.get_file_extension(uploaded_file_name).lower() != 'yml':
                        raise UserError(
                            f"The uploaded file {uploaded_file_name} does not have the extension YML"
                            f", which is expected for kiosk queries")

                    secure_filename = os.path.join(temp_dir, kioskstdlib.urap_secure_filename(uploaded_file_name))
                    if os.path.isfile(secure_filename):
                        os.remove(secure_filename)
                    file.save(secure_filename)
                    logging.info(f"queryandviewcontroller.upload_query: Query definition temporarily saved as "
                                 f"{secure_filename}.")
                    result.success = True
                else:
                    result.success = False
                    result.message = "Either file or filename is empty. This should really never be the case."

        except UserError as e:
            raise e
        except BaseException as e:
            raise UserError(repr(e))

        return result.jsonify()
    except UserError as e:
        logging.error(f"queryandviewcontroller.upload_query: {repr(e)}")
        result = KioskResult(message=repr(e))
        result.message = f"{repr(e)}"
        result.success = False
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"queryandviewcontroller.upload_query: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"queryandviewcontroller.upload_query: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    INSTALL uploaded queries
#  *****************************************************************/
@queryandview.route('/install_queries', methods=['POST'])
@full_login_required
def install_queries():
    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if MANAGE_SERVER_PRIVILEGE not in authorized_to:
            logging.warning(f"Unauthorized access to queryandview/install_queries "
                            f"by user {current_user.user_id}")
            abort(HTTPStatus.UNAUTHORIZED)

        result = KioskResult(message="Unknown error on install_queries")
        logging.info(f"queryandviewcontroller.install_queries: {current_user.user_id} initiates query installation")

        try:
            cfg: KioskConfig = kioskglobals.get_config()
            temp_dir = cfg.get_temporary_upload_path()
            def_base_path = cfg.default_kiosk_queries
            def_project_path = str(os.path.join(def_base_path, cfg.get_project_id()))
            if not os.path.exists(def_base_path):
                os.mkdir(def_base_path)
            if not os.path.exists(def_project_path):
                os.mkdir(def_project_path)

            if not os.path.exists(temp_dir):
                raise UserError(
                    f"The Kiosk Server is not properly configured. It lacks a temporary upload path. "
                    f"Please talk to your admin.")

            files = request.json["files"]
            if len(files) == 0:
                raise UserError("The request asks for no files to install. That should not happen.")

            all_files_success = True
            result.message = ""
            for file_name in files.values():
                query_file = str(os.path.join(temp_dir, file_name))
                if os.path.isfile(query_file):
                    try:
                        if KioskQueryStore.add_or_update_from_file(query_file):
                            result.message += f"Query definition {file_name} successfully installed."
                            project_specific = False
                            target_file = str(os.path.join(def_base_path, file_name))
                            project_target_file = str(os.path.join(def_project_path, file_name))

                            if os.path.isfile(project_target_file) or not os.path.isfile(target_file):
                                project_specific = True

                            kioskstdlib.delete_files([target_file, project_target_file], False)
                            if project_specific:
                                target_file = project_target_file

                            shutil.copy(query_file, target_file)

                        else:
                            raise Exception("add_or_update_from_file did not return a query object. "
                                            "That should not happen.")
                    except BaseException as e:
                        all_files_success = False
                        logging.error(f"queryandview.install_queries: "
                                      f"Query definition {file_name} caused an error: {repr(e)}")
                        result.message += f"Query definition {file_name} caused an error: {repr(e)}<br>"
                else:
                    result.message += f"file {file_name} was not successfully uploaded.<br>"
            result.success = all_files_success
        except UserError as e:
            raise e
        except BaseException as e:
            raise UserError(repr(e))

        return result.jsonify()
    except UserError as e:
        logging.error(f"queryandviewcontroller.install_queries: {repr(e)}")
        result = KioskResult(message=repr(e))
        result.message = f"{repr(e)}"
        result.success = False
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"queryandviewcontroller.install_queries: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"queryandviewcontroller.install_queries: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)
