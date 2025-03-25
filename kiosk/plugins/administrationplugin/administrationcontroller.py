import logging
import os
import pprint
import string
import sys
import time
import zipfile
from collections import namedtuple
from http import HTTPStatus
from os import path

from flask import Blueprint, request, redirect, render_template, jsonify, \
    url_for, abort, make_response, send_file, __version__
from flask_allows import requires
from flask_login import current_user
from werkzeug.exceptions import HTTPException

import core.kioskuser
import kioskdatetimelib
import kioskglobals
import kiosklib
import kiosksqlalchemy
import kioskstdlib
import mcpinterface.mcpqueue
from authorization import BACKUP_PRIVILEGE, RESTORE_PRIVILEGE, \
    ENTER_ADMINISTRATION_PRIVILEGE, MANAGE_SERVER_PRIVILEGE, \
    IsAuthorized, get_local_authorization_strings, is_explicitly_authorized
from authorization import full_login_required
from core.kioskcontrollerplugin import get_plugin_for_controller
# from core.threadedjobmanagement.kioskthreadedjobmanager import KioskThreadedJobManager
# from sync.core.threadedjobmanagement.kioskthreadedjob import KioskThreadedJob
# from kioskthread import KioskThread
from dsd.dsd3singleton import Dsd3Singleton
from generalstore.generalstorekeys import JOB_SUFFIX_REFRESH_FID_CACHE, JOB_SUFFIX_REFRESH_CACHE_FILE
from kioskconfig import KioskConfig
from kioskpatcher import KioskPatcher
from kioskquery.kioskquerystore import install_default_kiosk_queries
from kioskrestore import KioskRestore
from kioskresult import KioskResult
from kiosksqldb import KioskSQLDb
from kioskstdlib import id_generator
from kioskwtforms import kiosk_validate
from mcpinterface.mcpconstants import MCPJobStatus
from mcpinterface.mcpjob import MCPJob, find_running_job
from mcpinterface.mcpqueue import MCPQueue, assert_mcp
from messaging.systemmessagecatalog import SYS_MSG_ID_BEFORE_RESTORE_FAILED
from pluggableflaskapp import current_app
from plugins.filerepositoryplugin.filerepositorylib import trigger_fid_refresh_if_needed
from sqlalchemy_models.adminmodel import KioskUser
from synchronization import Synchronization
from tz.kiosktimezones import KioskTimeZones
from .forms.backupform import BackupForm
from .forms.housekeepingform import HousekeepingForm
from .forms.restoreform import RestoreForm
from .forms.transferform import TransferForm

_plugin_name_ = "administrationplugin"
_controller_name_ = "administration"
_url_prefix_ = '/' + _controller_name_
plugin_version = 1.1

LOCAL_ADMINISTRATION_PRIVILEGES = {
    ENTER_ADMINISTRATION_PRIVILEGE: "enter administration",
    MANAGE_SERVER_PRIVILEGE: "manage server",
    BACKUP_PRIVILEGE: "backup",
    RESTORE_PRIVILEGE: "restore"
}

administration = Blueprint(_controller_name_, __name__,
                           template_folder='templates',
                           static_folder="static",
                           url_prefix=_url_prefix_)
print(f"{_controller_name_} module loaded")

administration_controller = Blueprint(_controller_name_, __name__)
print(f"{_controller_name_} loaded")

SysInfo = namedtuple('SysInfo', ['kiosk_ver', 'kiosk_date', 'kiosk_name', 'dsd_format', 'python_ver',
                                 'flask_ver', "postgresql_ver"])



class UserError(Exception):
    pass


@administration.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


def get_plugin_config():
    return kioskglobals.cfg.get_plugin_config(_plugin_name_)


#  **************************************************************
#  ****    /administration/test route
#  *****************************************************************/
@administration.route('/test', methods=['POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def test():
    result = {}
    print("\n*************** administration/test")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")


#  **************************************************************
#  ****    /administration/clear-db route
#  *****************************************************************/
@administration.route('/cleardb', methods=['POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def cleardb():
    result = {}
    print("\n*************** administration/clear-db")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    try:
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        sync.empty_master_tables(ask=False, special_tables=False)
        result = "ok"

    except Exception as e:
        logging.error(f"/cleardb : {repr(e)}")
        result = repr(e)

    return jsonify(result=result)


#  **************************************************************
#  ****    /administration/restart route
#  *****************************************************************/
@administration.route('/restart', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
def restart():
    result = {}
    logging.info("\n *************** administration/restart")

    try:
        cfg = kioskglobals.get_config()
        kiosklib.write_reset_file(cfg)

        result = "ok"
    except Exception as e:
        result = repr(e)

    return jsonify(result=result)


#  **************************************************************
#  ****    /administration.data-integrity
#  *****************************************************************/
# @administration.route('/data-integrity', methods=['GET', "POST"])
# @full_login_required
# @requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# # @nocache
# def admin_data_integrity():
#     result = {}
#     conf = kioskglobals.cfg
#     print("\n*************** administration/data_integrity ")
#     print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
#     print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
#     print(request.accept_languages)
#
#     try:
#         kiosklib.run_quality_control()
#         # integrity_check = KioskDatabaseIntegrity(conf)
#         # integrity_check.update_default_fields()
#         result = "ok"
#     except Exception as e:
#         result = repr(e)
#
#     return jsonify(result=result)


#  **************************************************************
#  ****    redirecting index
#  *****************************************************************/

@administration.route('_redirect', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
def administration_index():
    print("------------- redirecting")
    return redirect(url_for("administration.administration_show"))


@administration.route('', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def administration_show():
    def class_or_str(v):
        if isinstance(v, type):
            return v.__name__
        else:
            return v

    try:
        conf = kioskglobals.cfg
        print("\n*************** administration/ ")
        print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
        print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
        print(request.accept_languages)
        try:
            sysinfo = SysInfo(kiosk_ver=kioskglobals.kiosk_version,
                              kiosk_name=kioskglobals.kiosk_version_name,
                              kiosk_date=kioskglobals.kiosk_date.date(),
                              dsd_format=Dsd3Singleton.get_dsd3().format,
                              python_ver=sys.version.split(' ')[0],
                              flask_ver=__version__,
                              postgresql_ver=KioskSQLDb.get_postgres_version())
            dsd = Dsd3Singleton.get_dsd3()
            plugin_manager = current_app.plugin_manager
            plugins = [{"subsystem": "kiosk", "name": p.name, "type": type(p).__name__,
                        "plugin_version": p.get_plugin_version() if hasattr(p, "get_plugin_version") else "-"} for k, p in
                       plugin_manager.plugins.items()]
            sync = Synchronization()
            try:
                sync.load_plugins([], is_plugin_active=lambda x: True)
            except BaseException as e:
                logging.error(f"administrationcontroller.administration_show: {repr(e)}")
            plugins.extend([{"subsystem": "synchronization", "name": p.name, "type": type(p).__name__,
                             "plugin_version": p.get_plugin_version()} for k, p in
                            sync.plugins.plugins.items()])

            type_repository_types = []
            for interface_type in kioskglobals.type_repository.repository:
                try:
                    type_repository_types.extend([{"subsystem": "kiosk",
                                                   "interface_type": interface_type,
                                                   "type": t,
                                                   "class": repr(kioskglobals.type_repository.get_type(
                                                       interface_type, t)) if kioskglobals.type_repository.get_type(
                                                       interface_type, t) else "ERROR!"
                                                   }
                                                  for t in kioskglobals.type_repository.list_types(interface_type)])
                except BaseException as e:
                    logging.error(
                        f"administrationcontroller.administration_show: listing kiosk types {interface_type} {repr(e)}")

            for interface_type in sync.type_repository.repository:
                try:
                    type_repository_types.extend([{"subsystem": "synchronization",
                                                   "interface_type": interface_type,
                                                   "type": t,
                                                   "class": repr(sync.type_repository.get_type(interface_type, t))}
                                                  for t in sync.type_repository.list_types(interface_type)])
                except BaseException as e:
                    logging.error(
                        f"administrationcontroller.administration_show: listing sync types {interface_type} {repr(e)}")

            events = []
            for topic in sync.events._events:
                events.extend([{"subsystem": "sync subsystem",
                                "topic": topic,
                                "event_id": e,
                                "subscriber_count": len(sync.events.get_event_handler(topic, e)._observers)
                                }
                               for e in sync.events._events[topic]])
            for topic in current_app.events._events:
                events.extend([{"subsystem": "Kiosk",
                                "topic": topic,
                                "event_id": e,
                                "subscriber_count": len(current_app.events.get_event_handler(topic, e)._observers)
                                }
                               for e in current_app.events._events[topic]])

            users = KioskUser.query.all()

            mcp_alive = "NOT running"
            try:
                mcpinterface.mcpqueue.assert_mcp(kioskglobals.general_store)
                mcp_alive = "running"
            except BaseException as e:
                pass

            mcp_version = mcpinterface.mcpqueue.get_mcp_version(kioskglobals.general_store)
            if not mcp_version:
                mcp_version = "?"

            try:
                # this works only with redis
                # noinspection PyUnresolvedReferences
                redis_version = kioskglobals.general_store.get_redis_version()
            except BaseException as e:
                redis_version = ""
                logging.error(f"administrationcontroller.administration_show : {repr(e)}")

            gs_id = kioskstdlib.try_get_dict_entry(conf.config,"gs_id","",True)

            authorized_to = get_local_authorization_strings(LOCAL_ADMINISTRATION_PRIVILEGES)
            if kioskglobals.get_development_option("suppress_system_messages").lower() == 'true':
                messages = []
            else:
                messages = kioskglobals.system_messages.get_messages(-10).all_messages()

            local_server = kiosklib.is_local_server(conf)

            file_cache_refresh_running = is_file_cache_refresh_running()

            patch_list = {}
            try:
                p = KioskPatcher(kioskglobals.cfg, kioskglobals.cfg.get_transfer_dir()[1])
                patch_list = p.list_logged_patches()
            except BaseException as e:
                logging.error(f"administrationcontroller.administration_show: "
                              f"Error reading patch log:{repr(e)}")

            return render_template('administration.html',
                                   authorized_to=authorized_to,
                                   config=kioskglobals.cfg,
                                   sysinfo=sysinfo,
                                   dsd=dsd,
                                   plugins=plugins,
                                   types=type_repository_types,
                                   events=events,
                                   all_sys_messages=messages,
                                   users=users,
                                   mcp_version=mcp_version,
                                   mcp_alive=mcp_alive,
                                   redis_version=redis_version,
                                   is_local_server=local_server,
                                   file_cache_refresh_running=file_cache_refresh_running,
                                   fid_cache_refresh_running=find_running_job(kioskglobals.general_store,
                                                                              JOB_SUFFIX_REFRESH_FID_CACHE),
                                   gs_id=gs_id,
                                   patch_list=patch_list)
        except BaseException as e:
            emergency_administration = repr(e)
            logging.error(f"administrationcontroller.administration_show : Administration "
                          f"in emergency mode due to {repr(e)}")
            return render_template('administration.html', emergency_administration=emergency_administration)

    except BaseException as e:
        logging.error(f"administrationcontroller.administration_show : {repr(e)}")
        abort(500, repr(e))


#  **************************************************************
#  ****    /administration/resetpassword route
#  *****************************************************************/
@administration.route('/resetpassword', methods=['POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def resetpassword():
    result = {}
    print("\n*************** administration/resetpassword")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    try:
        json = request.get_json()
        if "uid" in json:
            uid = json["uid"]
            user = KioskUser.query.filter_by(uid=uid).first()
            if user:
                result["user_name"] = user.user_name
                user.must_change_pwd = True
                kiosksqlalchemy.sqlalchemy_db.session.commit()
                result["result"] = "ok"
                password = id_generator(chars=string.ascii_lowercase)
                flaskloginkioskuser = core.kioskuser.KioskUser(uid, check_token=False)
                if flaskloginkioskuser.set_password(password, commit=True, temporary=True):
                    result["message"] = f"The temporary password for user {flaskloginkioskuser.user_id} is {password}. "
                else:
                    result["message"] = f"The user {flaskloginkioskuser.user_id} has to change the " \
                                        f"password on next login, <br> but the password has not been reset to anything!"
            else:
                result["result"] = "Password not reset since the user could not be found."
        else:
            result["result"] = "call to resetpassword without a proper unique identifier"
    except Exception as e:
        logging.error(f"resetpassword: Exception when handling administration/resetpassword : {repr(e)}")
        result["result"] = "Exception thrown. Please consult the logs."

    return jsonify(**result)


#  **************************************************************
#  ****    /backup index / form request
#  *****************************************************************/
@administration.route('/backup', methods=['POST', 'GET'])
@full_login_required
@requires(IsAuthorized(BACKUP_PRIVILEGE))
# @nocache
def backup():
    print("\n*************** administration/backup ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
    if not kiosklib.is_ajax_request():
        logging.error(f"administrationcontroller.backup: Attempt to GET it without AJAX.")
        abort(HTTPStatus.BAD_REQUEST)

    backup_form = BackupForm()
    general_errors = []
    job_uid = ""
    if request.method == 'POST':
        general_errors += kiosk_validate(backup_form)

        if not general_errors:
            try:
                assert_mcp(kioskglobals.general_store)
                errors, job = start_mcp_backup(backup_form.backup_dir.data,
                                               False,
                                               backup_form.backup_file_repository.data
                                               )
                general_errors += errors
                if job:
                    job_uid = job.job_id
            except BaseException as e:
                logging.error(f"administrationcontroller.backup: {repr(e)}")
                general_errors.append(repr(e))
    else:
        cfg = get_plugin_config()
        try:
            backup_form.backup_dir.data = kioskglobals.cfg.resolve_symbols(cfg["defaults"]["backup_directory"])
            # backup_form.backup_workstation_files.data = cfg["defaults"]["backup_workstation_directories"]
            backup_form.backup_file_repository.data = cfg["defaults"]["backup_file_repository"]
        except (TypeError, KeyError) as e:
            logging.warning(f"administrationcontroller: defaults not configured: {repr(e)} ")

    return render_template('backupdialog.html',
                           config=kioskglobals.cfg, backup_form=backup_form,
                           general_errors=general_errors, job_uid=job_uid)


def start_mcp_backup(backup_dir: str, backup_workstations: bool, backup_file_repos: bool):
    errors = []
    job = None
    try:
        if not path.isdir(backup_dir):
            errors.append('"' + backup_dir + '" is not a valid local directory on machine ' + os.environ[
                'COMPUTERNAME'])
        else:
            try:
                job = MCPJob(kioskglobals.general_store)
                job.job_data = {"backup_dir": backup_dir,
                                "backup_workstations": backup_workstations,
                                "backup_file_repository": backup_file_repos}
                job.set_worker(module_name="plugins.administrationplugin.backupworker", class_name="BackupJob")
                job.system_lock = True
                job.queue()
            except Exception as e:
                logging.error("Exception in administrationcontroller.start_mcp_backup: " + repr(e))
                errors.append("Could not start the backup: " + repr(e))
    except Exception as e:
        errors.append("Could not start the backup: " + repr(e))
        logging.error("Could not start the backup: " + repr(e))

    return errors, job


#  **************************************************************
#  ****    /transfer index / form request
#  *****************************************************************/
@administration.route('/transfer', methods=['POST', 'GET'])
@full_login_required
@requires(IsAuthorized(BACKUP_PRIVILEGE))
# @nocache
def transfer():
    print("\n*************** administration/transfer ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
    if not kiosklib.is_ajax_request():
        logging.error(f"administrationcontroller.transfer: Attempt to GET it without AJAX.")
        abort(HTTPStatus.BAD_REQUEST)

    transfer_form = TransferForm()
    general_errors = []
    job_uid = ""
    if request.method == 'POST':
        general_errors += kiosk_validate(transfer_form)

        if not general_errors:
            try:
                assert_mcp(kioskglobals.general_store)
                job = None
                filename = kioskstdlib.urap_secure_filename(transfer_form.catalog_file.data)
                cfg = kioskglobals.get_config()
                catalog_file = os.path.join(cfg.get_temp_dir(), filename)
                errors, job = start_mcp_transfer(transfer_form.transfer_dir.data,
                                                 catalog_file,
                                                 )
                general_errors += errors
                if job:
                    job_uid = job.job_id
            except BaseException as e:
                logging.error(f"administrationcontroller.transfer: {repr(e)}")
                general_errors.append(repr(e))
    else:
        cfg = get_plugin_config()
        try:
            backup_directory = kioskglobals.cfg.resolve_symbols(cfg["defaults"]["backup_directory"])
            transfer_directory = os.path.join(kioskstdlib.get_parent_dir(backup_directory), "transfer")
            transfer_form.transfer_dir.data = transfer_directory
        except (TypeError, KeyError) as e:
            logging.warning(f"administrationcontroller.transfer: defaults not configured: {repr(e)} ")

    return render_template('transferdialog.html',
                           config=kioskglobals.cfg, transfer_form=transfer_form,
                           general_errors=general_errors, job_uid=job_uid)


#  **************************************************************
#  ****    upload catalog file for transfer
#  *****************************************************************/
@administration.route('/upload_catalog', methods=['POST'])
@full_login_required
def upload_catalog():
    """
        todo: document
    """
    print("administrationcontroller.upload_catalog called.")
    logging.info(f"administrationcontroller.upload_catalog called.")
    try:
        authorized_to = get_local_authorization_strings(LOCAL_ADMINISTRATION_PRIVILEGES)
        if "backup" not in authorized_to:
            logging.warning(f"Unauthorized access to kioskfilemakerworkstation/upload_catalog "
                            f"by user {current_user.user_id}")
            abort(HTTPStatus.UNAUTHORIZED)

        result = KioskResult(message="Unknown error after uploading a transfer catalog")
        logging.info(f"Received new transfer catalog from user {current_user.user_id}")

        try:
            cfg = kioskglobals.get_config()
            if not kiosklib.is_local_server(cfg):
                raise HTTPException('This feature is only available on local servers.')

            temp_dir = cfg.get_temp_dir()
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    logging.info("Received file " + file.filename)
                    uploaded_file_name = kioskstdlib.get_filename(file.filename)
                    if kioskstdlib.get_file_extension(uploaded_file_name).lower() != 'json':
                        raise UserError(
                            f"The uploaded file {uploaded_file_name} does not have the expected extension JSON.")

                    secure_filename = kioskstdlib.get_filename(kioskstdlib.get_unique_filename(
                        temp_dir,
                        kioskstdlib.get_datetime_template_filename('cat_#a_#d#m#y-#H#M.json'),
                        file_extension='json'))

                    cat_file = os.path.join(temp_dir, secure_filename)
                    if os.path.isfile(cat_file):
                        os.remove(cat_file)
                    file.save(cat_file)
                    logging.info(f"administrationcontroller.upload_catalog: Catalog file saved as "
                                 f"{secure_filename}.")
                    result.success = True
                    result.set_data("filename", secure_filename)
                    result.message = "The catalog got successfully uploaded"
                else:
                    result.success = False
                    result.message = "Either file or filename is empty."
            else:
                result.success = False
                result.message = "No uploaded file detected."
        except UserError as e:
            raise e
        except BaseException as e:
            raise UserError(repr(e))

        return result.jsonify()
    except UserError as e:
        logging.error(f"administrationcontroller.upload_catalog: {repr(e)}")
        result = KioskResult(message=repr(e))
        result.message = f"{repr(e)}"
        result.success = False
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"administrationcontroller.upload_catalog: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"administrationcontroller.upload_catalog: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


def start_mcp_transfer(transfer_dir: str, catalog_file: str):
    errors = []
    job = None
    try:
        if not path.isfile(catalog_file):
            errors.append("The catalog file was not uploaded correctly. Please try again.")
        else:
            try:
                job = MCPJob(kioskglobals.general_store)
                job.job_data = args = {'transfer_dir': transfer_dir,
                                       'catalog_file': catalog_file}
                job.set_worker(module_name="plugins.administrationplugin.transferworker", class_name="TransferJob")
                job.system_lock = True
                KioskSQLDb.close_connection()
                job.queue()
            except Exception as e:
                logging.error("Exception in administrationcontroller.start_mcp_transfer: " + repr(e))
                errors.append("Could not start the transfer process: " + repr(e))
    except Exception as e:
        errors.append("Could not start the transfer process: " + repr(e))
        logging.error("Could not start the transfer process: " + repr(e))

    return errors, job


#  **************************************************************
#  ****    /restore index / form request
#  **************************************************************/
@administration.route('/restore', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(RESTORE_PRIVILEGE))
# @nocache
def restore():
    job_uid = None
    print("\n*************** administration/restore ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
    if not kiosklib.is_ajax_request():
        logging.error(f"administrationcontroller.restore: Attempt to GET it without AJAX.")
        abort(HTTPStatus.BAD_REQUEST)

    restore_form = RestoreForm()
    general_errors = []
    cfg = get_plugin_config()
    restore_path = ""
    if "restore_directory" in cfg["defaults"]:
        restore_path = kioskglobals.cfg.resolve_symbols(cfg["defaults"]["restore_directory"])
    else:
        if "backup_directory" in cfg["defaults"]:
            restore_path = kioskglobals.cfg.resolve_symbols(cfg["defaults"]["backup_directory"])

    restore_files = []
    if request.method == 'POST':
        filename = restore_form.restore_file.data
        if not os.path.isfile(filename):
            filename = os.path.join(restore_path, filename)
        general_errors += kiosk_validate(restore_form)

        if not general_errors:
            if not path.isfile(filename):
                general_errors.append(f"Sorry, but the file {filename} does not exist on the server.")
            else:
                try:
                    assert_mcp(kioskglobals.general_store)
                except BaseException as e:
                    general_errors.append(f"Sorry, but the Master Control Program is not running. "
                                          f"Please ask your administrator to start it.")

                if not general_errors:
                    if not restore_form.keep_users_and_privileges.data:
                        restore_users = KioskRestore.RESTORE_USERS_ALL
                    elif restore_form.restore_new_users.data:
                        restore_users = KioskRestore.RESTORE_USERS_NEW
                    else:
                        restore_users = KioskRestore.RESTORE_USERS_NONE

                    restore_workstations = not restore_form.keep_workstations.data
                    errors, job = start_mcp_restore(filename, restore_form.restore_file_repository.data,
                                                    restore_users, restore_workstations)
                    general_errors += errors
                    if job:
                        job_uid = job.job_id
    else:
        restore_form.restore_file_repository.data = kioskstdlib.to_bool(
            kioskstdlib.try_get_dict_entry(cfg["defaults"], "restore_files_too", "false"))
        restore_form.keep_users_and_privileges.data = kioskstdlib.to_bool(
            kioskstdlib.try_get_dict_entry(cfg["defaults"], "keep_users_and_privileges", "true"))
        restore_form.restore_new_users.data = kioskstdlib.to_bool(
            kioskstdlib.try_get_dict_entry(cfg["defaults"], "restore_new_users", "true"))
        restore_form.keep_workstations.data = kioskstdlib.to_bool(
            kioskstdlib.try_get_dict_entry(cfg["defaults"], "keep_workstations", "true"))

    if restore_path:
        restore_files = kioskstdlib.find_files(restore_path, "*.dmp", order_by_time=True, include_path=False)
    else:
        logging.warning(f"administrationcontroller: defaults not configured (restore_path).")

    return render_template('restoredialog.html',
                           config=kioskglobals.cfg, restore_form=restore_form,
                           general_errors=general_errors, job_uid=job_uid,
                           restore_files=restore_files)


def before_restore(backup_file: str) -> bool:
    """
    basically just triggers the administration.before_restore event
    :param backup_file: parameter to the event
    :return: bool
    """

    before_restore_event = current_app.events.get_event_handler("administration", "before_restore")
    try:
        if before_restore_event:
            before_restore_event.fire_fifs({"backup_file": backup_file})
        return True
    except BaseException as e:
        logging.error(f"administration.before_restore: {repr(e)}")

    return False


def start_mcp_restore(backup_file: str, restore_file_repos: bool, restore_users: int, restore_workstations: bool):
    errors = []
    job = None
    try:
        if not path.isfile(backup_file):
            errors.append('"' + backup_file + '" is not a valid local file on machine ' + os.environ[
                'COMPUTERNAME'])
        else:
            try:
                if not before_restore(backup_file):
                    kiosklib.dispatch_system_message("preparing restore failed",
                                                     SYS_MSG_ID_BEFORE_RESTORE_FAILED,
                                                     body="Could not properly prepare the restore. "
                                                          "The restore proceeded nonetheless but further manual "
                                                          "actions might be required by the admin now.")

                job = MCPJob(kioskglobals.general_store)
                job.job_data = args = {'backup_file': backup_file,
                                       'restore_file_repository': restore_file_repos,
                                       'restore_users': restore_users,
                                       'restore_workstations': restore_workstations
                                       }
                job.set_worker(module_name="plugins.administrationplugin.restoreworker", class_name="RestoreJob")
                job.system_lock = True
                KioskSQLDb.close_connection()
                job.queue()
            except Exception as e:
                logging.error("Exception in administrationcontroller.start_mcp_restore: " + repr(e))
                errors.append("Could not start the restore process: " + repr(e))
    except Exception as e:
        errors.append("Could not start the restore process: " + repr(e))
        logging.error("Could not start the restore process: " + repr(e))

    return errors, job




def shutdown_local_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('werkzeug.server.shutdown not available')
    func()


#  **************************************************************
#  ****    /shutdown
#  *****************************************************************/
@administration.route('/shutdown', methods=['GET'])
@full_login_required
@requires(IsAuthorized(MANAGE_SERVER_PRIVILEGE))
# @nocache
def shutdown():
    cfg = kioskglobals.get_config()
    if kiosklib.is_local_server(cfg):
        logging.info(f"administrationcontroller.shutdown: Attempt to shutdown the local server")
        job = shutdown_mcp()
        if not job:
            abort(HTTPStatus.INTERNAL_SERVER_ERROR, "cannot create the cancel job.")
        else:
            try:
                shutdown_local_server()
            except BaseException as e:
                abort(HTTPStatus.INTERNAL_SERVER_ERROR,
                      f"The local Kiosk Server did not shut down ({repr(e)}). "
                      f"Please close it manually and make sure MCP is closed.")

            abort(HTTPStatus.SERVICE_UNAVAILABLE, "Server shut down by user")

    abort(HTTPStatus.BAD_REQUEST)


def shutdown_mcp():
    job = None
    try:
        job = MCPJob(kioskglobals.general_store)
        job.set_worker(module_name="MCP", class_name="CANCEL")
        job.system_lock = True
        job.queue()
    except Exception as e:
        logging.error("Exception in administrationcontroller.shutdown_mcp: " + repr(e))

    return job


@administration.route('/housekeeping', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def housekeeping():
    print("\n*************** administration/housekeeping ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    if not kiosklib.is_ajax_request():
        logging.error(f"administrationcontroller.housekeeping: Attempt to GET it without AJAX.")
        abort(HTTPStatus.BAD_REQUEST)

    housekeeping_form = HousekeepingForm()
    general_errors = []
    job_uid = ""
    if request.method == 'POST':
        general_errors += kiosk_validate(housekeeping_form)

        if not general_errors:
            # if MCPQueue(kioskglobals.general_store).is_mcp_alive():
            errors, job_uid = start_mcp_housekeeping(housekeeping_form)
            # else:
            #     errors, job_uid = start_threaded_housekeeping(housekeeping_form)
            general_errors += errors
    else:
        housekeeping_form.hk_complete_file_meta_data.data = True
        housekeeping_form.hk_create_representations.data = True
        housekeeping_form.hk_mark_broken_images.data = True
        housekeeping_form.hk_rewrite_images_record.data = False
        housekeeping_form.hk_lowercase_filenames.data = False
        housekeeping_form.hk_quality_check.data = False
        housekeeping_form.hk_fts.data = False
        housekeeping_form.clear_logs.data = True

    return render_template('housekeepingdialog.html',
                           config=kioskglobals.cfg, housekeeping_form=housekeeping_form,
                           general_errors=general_errors, job_uid=job_uid)


def start_mcp_housekeeping(params):
    #
    # main function
    #
    errors = []
    job_uid = ""
    try:
        job_data = {"tasks": []}
        if params.hk_complete_file_meta_data.data:
            job_data["tasks"].append("housekeeping_check_file_meta_data")
        if params.hk_create_representations.data:
            job_data["tasks"].append("housekeeping_check_cache_files")
        if params.hk_mark_broken_images.data:
            job_data["tasks"].append("housekeeping_check_broken_files")
        if params.hk_rewrite_images_record.data:
            job_data["tasks"].append("housekeeping_rewrite_image_record")
        if params.hk_lowercase_filenames.data:
            job_data["tasks"].append("housekeeping_lowercase_filenames")
        if params.hk_quality_check.data:
            job_data["tasks"].append("housekeeping_quality_check")
        if params.hk_fts.data:
            job_data["tasks"].append("housekeeping_fts")
        if params.clear_logs.data:
            job_data["tasks"].append("housekeeping_clear_log")

        job = MCPJob(kioskglobals.general_store)
        job.set_worker("plugins.administrationplugin.housekeepingworker", "HouseKeepingWorker")
        job.job_data = job_data
        job.queue()
        job_uid = job.job_id

    except Exception as e:
        logging.error("Exception in administrationcontroller.start_housekeeping: " + repr(e))
        errors.append("Lazy server refuses housekeeping: " + repr(e))
        job_uid = ""

    return errors, job_uid


#  **************************************************************
#  ****    /administration.processes_show
#  *****************************************************************/
@administration.route('/processes', methods=['GET', "POST"])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def processes_show():
    conf = kioskglobals.cfg
    if not ("X-Requested-With" in request.headers and request.headers["X-Requested-With"] == "XMLHttpRequest"):
        print("\n*************** administration/processes ")
        print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
        print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
        print(request.accept_languages)

    authorized_to = get_local_authorization_strings(LOCAL_ADMINISTRATION_PRIVILEGES)
    Process = namedtuple("Process", ["job_id", "job_status", "type", "str_status", "data", "progress", "result",
                                     "project_id"])
    processes = []
    general_error = ""
    if kioskglobals.general_store:
        # old threaded version:
        # jobmanager = KioskThreadedJobManager.get_jobmanager(kioskglobals.general_store)
        # for job in jobmanager.list_jobs():
        #     job: KioskThreadedJob
        #     processes.append(Process(job.job_id,
        #                              job.type,
        #                              job.STATUS_TO_STR[job.status],
        #                              job.data,
        #                              str(job.progress.get_progress()) + "%",
        #                              job))

        queue = MCPQueue(kioskglobals.general_store)
        is_server_admin = is_explicitly_authorized(MANAGE_SERVER_PRIVILEGE)
        if queue.is_mcp_alive():
            for job_id in queue.list_jobs():
                try:
                    job = MCPJob(kioskglobals.general_store, job_id)
                    if job:
                        cfg: KioskConfig = kioskglobals.cfg
                        if job.project_id == cfg.get_project_id() or is_server_admin:
                            processes.append(Process(job.job_id,
                                                     job.status,
                                                     job.get_worker()[1],
                                                     job.status_text,
                                                     job.job_data,
                                                     str(job.progress.get_progress()) + "%",
                                                     f"success: {kioskstdlib.try_get_dict_entry(job.result, 'success', '?')}",
                                                     job.project_id if is_server_admin else ""))
                    else:
                        logging.error(f"administration/processes_show: Can't load job {job_id}.")
                except BaseException as e:
                    logging.error(f"administration/processes_show: {repr(e)}")
        else:
            general_error = "The Master Control Program is not running!"
    else:
        general_error = "Redis is not running!"

    return render_template('processes.html',
                           authorized_to=authorized_to,
                           config=kioskglobals.cfg,
                           processes=processes,
                           general_error=general_error,
                           states=MCPJobStatus
                           )


#  **************************************************************
#  ****    administration.process_action
#  *****************************************************************/
@administration.route('/processes/action', methods=["POST"])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def process_action():
    try:
        json_rc = "ok"
        action = request.form["action"]
        uid = request.form["uid"]
        print(f"Process action: {action} {uid}")
        # if is_mcp_job(uid):
        job = MCPJob(kioskglobals.general_store, uid)
        # else:
        #     jobmanager = KioskThreadedJobManager.get_jobmanager(kioskglobals.general_store)
        #     job = KioskThreadedJob(kioskglobals.general_store, None, job_uid=uid)

        if action == "kill":
            job: MCPJob
            queue = MCPQueue(kioskglobals.general_store)

            try:
                if not queue.pop(uid):
                    json_rc = "Server cannot delete job: Job was already gone."
            except BaseException as e:
                logging.error(f"administrationcontroller.process_action: Can't delete job due to"
                              f"exception {repr(e)}")
                json_rc = f"Server cannot delete job due to exception {repr(e)}"
        elif action == "cancel":
            if job.set_status_to(MCPJobStatus.JOB_STATUS_CANCELLING):
                logging.info(f"administrationcontroller.process_action: cancelling mcp job {uid}.")
            else:
                logging.error(f"administrationcontroller.process_action: cannot cancel mcp job {uid}.")

        else:
            logging.error(f"administrationcontroller.process_action: cannot process command{action}.")
            json_rc = "unknown command"

    except BaseException as e:
        logging.error(f"administrationcontroller.process_action: Exception {repr(e)}")
        json_rc = f"administrationcontroller.process_action: Exception {repr(e)}"

    return jsonify(json_rc)


#  **************************************************************
#  ****    /administration.show_logs
#  *****************************************************************/
@administration.route('/show_logs', methods=['GET', "POST"])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def show_logs():
    conf: KioskConfig = kioskglobals.cfg
    if not ("X-Requested-With" in request.headers and request.headers["X-Requested-With"] == "XMLHttpRequest"):
        print("\n*************** administration/processes ")
        print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
        print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
        print(request.accept_languages)

    authorized_to = get_local_authorization_strings(LOCAL_ADMINISTRATION_PRIVILEGES)
    Log = namedtuple("Log", ["name", "created", "modified", "size", "sort", "url"])
    files = kioskstdlib.find_files(kioskstdlib.get_file_path(conf.get_logfile()), "*.log")

    show_log_event = current_app.events.get_event_handler("administration", "show_log")

    logs = []
    for f in files:
        filename = kioskstdlib.get_filename(f)
        logs.append(Log(filename,
                        time.strftime("%d %b %H:%M:%S", time.gmtime(os.path.getctime(f))),
                        time.strftime("%d %b %H:%M:%S", time.gmtime(os.path.getmtime(f))),
                        os.path.getsize(f), os.path.getmtime(f),
                        show_log_event.fire_last_in_only(filename) if show_log_event else ""))
    logs.sort(key=lambda elem: elem.sort, reverse=True)

    return render_template('logs.html',
                           authorized_to=authorized_to,
                           config=kioskglobals.cfg,
                           logs=logs,
                           general_error=[],
                           cfg=conf,
                           MAX_FILES=100
                           )


#  **************************************************************
#  ****    /administration.show_logs
#  *****************************************************************/
@administration.route('/log_action/<action>/<log_id>', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def log_action(action, log_id):
    conf: KioskConfig = kioskglobals.cfg
    # if not ("X-Requested-With" in request.headers and request.headers["X-Requested-With"] == "XMLHttpRequest"):
    print(f"\n*************** administration/{action}/{log_id} ")

    authorized_to = get_local_authorization_strings(LOCAL_ADMINISTRATION_PRIVILEGES)
    Log = namedtuple("Log", ["name", "created", "modified", "size"])
    files = kioskstdlib.find_files(kioskstdlib.get_file_path(conf.get_logfile()), log_id, include_path=True)
    if len(files) == 1:
        logging.info(f"administration_controller.log_action/download: fetching log-file {log_id}")
        resp = make_response(send_file(files[0],
                                       mimetype='text/plain',
                                       download_name=kioskstdlib.get_filename(files[0]),
                                       as_attachment=True, max_age=0,
                                       etag=str(kioskdatetimelib.get_utc_now(no_tz_info=True).timestamp())))
        return resp
    else:
        logging.info(f"administration_controller.log_action/download: attempt to fetch unknown log-file {log_id}")
        abort(400)


#  **************************************************************
#  ****    /administration/dsd
#  *****************************************************************/
@administration.route('/dsd', defaults={'table': None}, methods=['GET'])
@administration.route('/dsd/<table>', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def get_dsd(table: str):
    dsd = Dsd3Singleton.get_dsd3()
    authorized_to = get_local_authorization_strings(LOCAL_ADMINISTRATION_PRIVILEGES)

    dsd_lines = dsd.pprint(key=table)
    return render_template('dsd.html',
                           authorized_to=authorized_to,
                           config=kioskglobals.cfg,
                           dsd_lines=dsd_lines
                           )


#  **************************************************************
#  ****    /administration/config
#  *****************************************************************/
@administration.route('/config', defaults={'key': None}, methods=['GET'])
@administration.route('/config/<key>', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def get_config(key: str):
    dsd = Dsd3Singleton.get_dsd3()
    authorized_to = get_local_authorization_strings(LOCAL_ADMINISTRATION_PRIVILEGES)

    config = kioskglobals.cfg
    pp = pprint.PrettyPrinter(width=200)
    cfg_dict = config._config
    if key:
        cfg_dict = {key: cfg_dict[key]}

    cfg_dict = kioskstdlib.replace_keys(cfg_dict, ["SECRET_KEY",
                                                   "SQLALCHEMY_DATABASE_URI",
                                                   "database_usr_pwd",
                                                   "filemaker_db_usr_pwd"], "###")
    cfg_lines = pp.pformat(cfg_dict)
    return render_template('config.html',
                           authorized_to=authorized_to,
                           config=kioskglobals.cfg,
                           config_lines=cfg_lines
                           )


#  **************************************************************
#  ****    patch
#  *****************************************************************/
@administration.route('patch', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(MANAGE_SERVER_PRIVILEGE))
def patch():
    logging.info(f"administrationcontroller.patch triggered.")
    try:
        general_errors = []

        if not (kioskglobals.get_development_option(
                "webapp_development").lower() == "true" or kiosklib.is_ajax_request()):
            err = f"administrationcontroller.check_ajax: attempt to access endpoint other than by ajax"
            logging.error(err)
            abort(HTTPStatus.BAD_REQUEST, err)

        sync = Synchronization()
        error_msg = ""
        cfg = kioskglobals.get_config()
        if kiosklib.is_local_server(cfg):
            transfer_dir = cfg.get_create_transfer_dir()
            if not transfer_dir:
                error_msg = 'Cannot find, access or create the local transfer directory.'

        else:
            error_msg = 'The feature is only available on local servers.'

        if error_msg:
            general_errors.append(f"An unexpected error renders this feature inaccessible: <br><br>{error_msg} <br><br>"
                                  f"Please get in contact with a developer about this.")

        return render_template('uploadpatch.html',
                               general_errors=general_errors,
                               error_msg=error_msg)

    except HTTPException as e:
        logging.error(f"administrationcontroller.install_update: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, repr(e))
    except Exception as e:
        logging.error(f"administrationcontroller.install_update: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, repr(e))


#  **************************************************************
#  ****    upload and install patch
#  **************************************************************/
@administration.route('/trigger_patch', methods=['POST'])
@full_login_required
def trigger_patch():
    """
        todo: document
    """
    logging.info(f"administrationcontroller.trigger_patch called.")
    try:
        authorized_to = get_local_authorization_strings(LOCAL_ADMINISTRATION_PRIVILEGES)
        if "manage server" not in authorized_to:
            logging.warning(f"Unauthorized access to kioskfilemakerworkstation/trigger_patch "
                            f"by user {current_user.user_id}")
            abort(HTTPStatus.UNAUTHORIZED)

        result = KioskResult(message="Unknown error after uploading a patch")
        logging.info(f"Received new patch from user {current_user.user_id}")

        try:
            cfg = kioskglobals.get_config()
            if not kiosklib.is_local_server(cfg):
                raise HTTPException('This feature is only available on local servers.')

            transfer_dir = cfg.get_create_transfer_dir()
            if not transfer_dir:
                abort(HTTPStatus.INTERNAL_SERVER_ERROR, "transfer_dir not properly configured.")
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    logging.info("Received file " + file.filename)
                    uploaded_file_name = kioskstdlib.get_filename(file.filename)
                    if kioskstdlib.get_file_extension(uploaded_file_name).lower() != 'zip':
                        raise UserError(
                            f"The uploaded file {uploaded_file_name} does not have the expected extension ZIP.")

                    secure_filename = kioskstdlib.get_unique_filename(
                        transfer_dir,
                        kioskstdlib.get_datetime_template_filename('patch_#a_#d#m#y-#H#M.zip'),
                        file_extension='zip')
                    patch_file = os.path.join(transfer_dir, secure_filename)
                    if os.path.isfile(patch_file):
                        os.remove(patch_file)
                    file.save(patch_file)
                    logging.info(f"administrationcontroller.trigger_patch: Patch file saved as "
                                 f"{secure_filename}.")
                    try:
                        with zipfile.ZipFile(patch_file, 'r') as zip_ref:
                            zip_ref.extractall(transfer_dir)
                    except BaseException as e:
                        logging.error(f"administrationcontroller.trigger_patch: Exception when unzipping"
                                      f"{patch_file} to {transfer_dir}: {repr(e)}")
                        raise e
                    try:
                        os.remove(patch_file)
                    except BaseException as e:
                        logging.warning(f"administrationcontroller.trigger_patch: Could not delete {patch_file} "
                                        f"because: {repr(e)}")
                    kiosk_patcher = KioskPatcher(cfg, transfer_dir)
                    rc, err_msg = kiosk_patcher.read_patch_file()
                    if rc:
                        rc, err_msg = kiosk_patcher.patch_can_run()

                    if rc:
                        if kiosk_patcher.needs_restart():
                            try:
                                if kiosk_patcher.is_close_mcp_requested():
                                    shutdown_mcp()
                            except BaseException as e:
                                logging.warning(f"administrationcontroller.trigger_patch: "
                                                f"Noncritical Exception when handling mcp shutdown: {repr(e)}")

                            result.success = True
                            result.message = f"The patch has been successfully prepared but in order to apply it " \
                                             f"Kiosk needs to be restarted. " \
                                             f"Please restart the computer or virtual machine"
                        else:
                            rc, err_msg = kiosk_patcher.apply_patch()
                            if rc:
                                result.success = True
                                result.message = "The patch has been successfully applied."
                            else:
                                result.success = False
                                result.message = f"The patch had been successfully prepared but " \
                                                 f"failed during application.<br>Reason: {err_msg}"
                    else:
                        result.success = False
                        result.message = f"The patch had been saved and extracted successfully but it" \
                                         f"cannot be installed.<br>Reason: {err_msg}"
                else:
                    result.success = False
                    result.message = "Either file or filename is empty."
            else:
                result.success = False
                result.message = "No uploaded file detected."

        except UserError as e:
            raise e
        except BaseException as e:
            raise UserError(repr(e))

        return result.jsonify()
    except UserError as e:
        logging.error(f"administrationcontroller.trigger_patch: {repr(e)}")
        result = KioskResult(message=repr(e))
        result.message = f"{repr(e)}"
        result.success = False
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"administrationcontroller.trigger_patch: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"administrationcontroller.trigger_patch: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    /administration/after_synchronization route
#  *****************************************************************/
@administration.route('/after_synchronization', methods=['POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def after_synchronization():
    result = {}
    print("\n*************** administration/after_synchronization")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    try:
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        # sync.load_plugins([])
        if not sync.fire_event("after_synchronization"):
            logging.error(f"after_synchronization: fire_event returned False")
    except Exception as e:
        logging.error(f"after_synchronization: Exception when handling "
                      f"administration/after_synchronization : {repr(e)}")
        result["result"] = "Exception thrown. Please consult the logs."

    return jsonify(**result)


#  **************************************************************
#  ****    /administration/refresh_file_cache route
#  *****************************************************************/
@administration.route('/refresh_file_cache', methods=['POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def refresh_file_cache():
    result = {}
    print("\n*************** administration/refresh_file_cache")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    try:
        assert_mcp(kioskglobals.general_store)
        errors, job = start_mcp_refresh_file_cache()

        if not errors:
            if job:
                result["result"] = "ok"
                result["message"] = ("The refresh process was successfully started. "
                                     "You can monitor it in process management.")
            else:
                raise Exception("The job was not started correctly.")
        else:
            raise Exception(errors[0])

    except Exception as e:
        logging.error(f"refresh_file_cache: Exception when handling "
                      f"administration/refresh_file_cache : {repr(e)}")
        result["result"] = repr(e)

    return jsonify(**result)

def start_mcp_refresh_file_cache():
    #
    # main function
    #
    errors = []
    job_uid = ""
    try:
        job_data = {}
        job = MCPJob(kioskglobals.general_store, job_type_suffix=JOB_SUFFIX_REFRESH_CACHE_FILE)
        job.set_worker("plugins.administrationplugin.refreshfilecacheworker", "RefreshFileCacheWorker")
        job.background_job = True
        job.job_data = job_data
        job.queue()
        job_uid = job.job_id

    except Exception as e:
        logging.error("Exception in administrationcontroller.start_mcp_refresh_file_cache: " + repr(e))
        errors.append("The server wouldn't start the refresh process: " + repr(e))
        job_uid = ""

    return errors, job_uid

def is_file_cache_refresh_running():
    return find_running_job(kioskglobals.general_store, JOB_SUFFIX_REFRESH_CACHE_FILE)

#  **************************************************************
#  ****    /administration/refresh_file_identifier_cache route
#  *****************************************************************/
@administration.route('/refresh_file_identifier_cache', methods=['POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def refresh_file_identifier_cache():
    result = {}
    print("\n*************** administration/refresh_file_identifier_cache")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    try:
        assert_mcp(kioskglobals.general_store)

        errors, job = start_mcp_refresh_fid_cache()

        if not errors:
            if job:
                result["result"] = "ok"
                result["message"] = ("The process was successfully queued. It will run as soon as it is possible."
                                     "You can monitor it in process management.")
            else:
                raise Exception("The job was not started correctly.")
        else:
            raise Exception(errors[0])

    except Exception as e:
        logging.error(f"refresh_file_cache: Exception when handling "
                      f"administration/refresh_file_cache : {repr(e)}")
        result["result"] = repr(e)

    return jsonify(**result)


def start_mcp_refresh_fid_cache():
    #
    # main function
    #
    errors = []
    job_uid = ""
    try:
        job_uid = trigger_fid_refresh_if_needed(kioskglobals.general_store, force=True)
    except Exception as e:
        logging.error("Exception in administrationcontroller.start_mcp_refresh_fid_cache: " + repr(e))
        errors.append("The server wouldn't start the process: " + repr(e))
        job_uid = ""

    return errors, job_uid

#  **************************************************************
#  ****    /administration/reload_all_kiosk_queries route
#  *****************************************************************/
@administration.route('/reload_all_kiosk_queries', methods=['POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def reload_all_kiosk_queries():
    result = {}
    print("\n*************** administration/reload_all_kiosk_queries")

    try:
        install_default_kiosk_queries(kioskglobals.get_config())
        result["result"] = "ok"
        result["message"] = "Kiosk Queries have been successfully reloaded."
    except Exception as e:
        logging.error(f"reload_all_kiosk_queries: Exception when handling "
                      f"administration/reload_all_kiosk_queries : {repr(e)}")
        result["result"] = "Exception thrown. Please consult the logs."

    return jsonify(**result)


#  **************************************************************
#  ****    /administration/import_kiosk_tz route
#  *****************************************************************/
@administration.route('/import_kiosk_tz', methods=['POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def import_kiosk_tz():
    result = {}
    logging.info("\nadministrationcontroller.import_kiosk_tz triggered")

    try:
        tz_dir = os.path.join(kioskglobals.get_config().base_path, "tools", "tz")
        kiosk_tz = KioskTimeZones()
        c_time_zones = kiosk_tz.update_local_kiosk_time_zones(os.path.join(tz_dir, "kiosk_tz.json"))

        result["result"] = "ok"
        result["message"] = f"{c_time_zones} Time Zones have been successfully imported."
    except Exception as e:
        logging.error(f"import_kiosk_tz: Exception when importing "
                      f"time zones : {repr(e)}")
        result["result"] = "Exception thrown. Please consult the logs."

    return jsonify(**result)
