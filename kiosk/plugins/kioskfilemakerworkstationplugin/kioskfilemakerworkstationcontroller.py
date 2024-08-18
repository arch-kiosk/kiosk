import datetime
import logging
import flake8

from http import HTTPStatus

import flask_login
from flask import Blueprint, current_app, request, render_template, redirect, url_for, abort, make_response, \
    send_file
from flask_allows import requires, exempt_from_requirements
from flask_cors import CORS
from flask_login import current_user
from werkzeug.exceptions import HTTPException
from werkzeug.utils import secure_filename

import kioskglobals
import kioskstdlib
from authorization import full_login_required, IsAuthorized, INSTALL_PLUGIN
from authorization import get_local_authorization_strings, EDIT_WORKSTATION_PRIVILEGE, \
    SYNCHRONIZE, PREPARE_WORKSTATIONS, DOWNLOAD_WORKSTATION, UPLOAD_WORKSTATION, CREATE_WORKSTATION
from core.kioskcontrollerplugin import get_plugin_for_controller
from core.kiosklib import nocache
from filemakerrecording.filemakerworkstation import FileMakerWorkstation
from kiosklib import is_ajax_request
from kioskresult import KioskResult
from kioskuser import KioskUser
from kioskwtforms import kiosk_validate
from mcpinterface.mcpconstants import MCPJobStatus
from mcpinterface.mcpjob import MCPJob
from plugins.kioskfilemakerworkstationplugin import KioskFileMakerWorkstation
from plugins.kioskfilemakerworkstationplugin.forms.kioskfilemakerworkstationform import KioskFileMakerWorkstationForm
from plugins.kioskfilemakerworkstationplugin.forms.selectrecordinggroupform import SelectRecordingGroupForm
from plugins.syncmanagerplugin.kiosksyncmanager import KioskSyncManager
from plugins.syncmanagerplugin.kioskworkstationjobs import MCP_SUFFIX_WORKSTATION, JOB_META_TAG_WORKSTATION, \
    JOB_META_TAG_DELETED, KioskWorkstationJobs
from synchronization import Synchronization

_plugin_name_ = "kioskfilemakerworkstationplugin"
_controller_name_ = "kioskfilemakerworkstation"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.1

kioskfilemakerworkstation = Blueprint(_controller_name_, __name__,
                                      template_folder='templates',
                                      static_folder="static",
                                      url_prefix=_url_prefix_)

if kioskglobals.get_development_option("webapp_development").lower() == "true":
    CORS(kioskfilemakerworkstation)

LOCAL_PRIVILEGES = {
    EDIT_WORKSTATION_PRIVILEGE: "edit workstation",
    CREATE_WORKSTATION: "create workstation",
    PREPARE_WORKSTATIONS: "prepare workstation",
    DOWNLOAD_WORKSTATION: "download workstation",
    UPLOAD_WORKSTATION: "upload workstation",
    SYNCHRONIZE: "synchronize",
    INSTALL_PLUGIN: INSTALL_PLUGIN
}

workers = {"fork": ("plugins.kioskfilemakerworkstationplugin.workers.forkworkstationworker",
                    "ForkWorkstationWorker", PREPARE_WORKSTATIONS, False),
           "export": ("plugins.kioskfilemakerworkstationplugin.workers.exportworkstationworker",
                      "ExportWorkstationWorker", PREPARE_WORKSTATIONS, False),
           "import": ("plugins.kioskfilemakerworkstationplugin.workers.importworkstationworker",
                      "ImportWorkstationWorker", PREPARE_WORKSTATIONS, False),
           "fix_import": ("plugins.kioskfilemakerworkstationplugin.workers.importworkstationworker",
                          "ImportWorkstationWorker", PREPARE_WORKSTATIONS, False),
           "reset": ("plugins.kioskfilemakerworkstationplugin.workers.resetworkstationworker",
                     "ResetWorkstationWorker", PREPARE_WORKSTATIONS, False),
           "renew": ("plugins.kioskfilemakerworkstationplugin.workers.resetworkstationworker",
                     "ResetWorkstationWorker", PREPARE_WORKSTATIONS, False),
           "delete": ("plugins.kioskfilemakerworkstationplugin.workers.deleteworkstationworker",
                      "DeleteWorkstationWorker", EDIT_WORKSTATION_PRIVILEGE, False),
           "forknexport": ("plugins.kioskfilemakerworkstationplugin.workers.forknexportworkstationworker",
                           "ForkNExportWorkstationWorker", PREPARE_WORKSTATIONS, False)
           }

print(f"{_controller_name_} module loaded")


class UserError(Exception):
    pass


def init_controller():
    cfg = kioskglobals.get_config()
    try:
        no_csrf_defense = kioskstdlib.to_bool(
            kioskstdlib.try_get_dict_entry(cfg["kiosk"]["kioskfilemakerworkstationplugin"],
                                           "no_csrf_defense", "false"))
    except BaseException as e:
        no_csrf_defense = False
        logging.error(f"{repr(e)}")

    if no_csrf_defense:
        logging.warning(f"*************+ CSRF DEFENSE DEACTIVATED "
                        f"(kiosk/kioskfilemakerworkstationplugin/no_csrf_defense *****************")

    if kioskglobals.get_development_option("webapp_development").lower() == "true" or \
            no_csrf_defense:
        kioskglobals.csrf.exempt(kioskfilemakerworkstation)


@kioskfilemakerworkstation.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


def check_ajax():
    if not (kioskglobals.get_development_option("webapp_development").lower() == "true" or is_ajax_request()):
        logging.error(f"kioskfilemakerworkstationcontroller.workstation_actions: "
                      f"attempt to access endpoint other than by ajax")


@kioskfilemakerworkstation.route('create_kiosk_workstation', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(CREATE_WORKSTATION))
def create_kiosk_workstation():
    recording_groups = KioskFileMakerWorkstation.get_recording_groups()
    new_fm_ws_form = KioskFileMakerWorkstationForm("new")
    general_errors = []

    if request.method == "POST":
        general_errors += kiosk_validate(new_fm_ws_form)
        if not general_errors:
            # give some positive feedback!
            if create_filemaker_workstation(new_fm_ws_form, general_errors):
                return redirect(url_for("syncmanager.sync_manager_show"))
    else:
        try:
            if kioskglobals.get_config().default_recording_group:
                new_fm_ws_form.recording_group.data = kioskglobals.get_config().default_recording_group
        except:
            pass

    return render_template('kioskfilemakerworkstation.html',
                           new_fm_ws_form=new_fm_ws_form,
                           mode="new",
                           general_errors=general_errors,
                           recording_groups=recording_groups)


def create_filemaker_workstation(form: KioskFileMakerWorkstationForm, general_errors: [str]) -> str:
    """
    starts the job to create the workstation and returns the job-id in case the start succeeded.
    :param form:
    :param general_errors:
    :return: the job-id or "" in case of error.
    """
    result = ""
    workstation_id = "?"
    try:
        workstation_id = form.workstation_id.data
        if KioskFileMakerWorkstation.workstation_id_exists(workstation_id):
            general_errors.append(f"a workstation with the id '{workstation_id}' already exists. "
                                  f"Please chose a different id.")
            return result

        try:
            job = MCPJob(kioskglobals.general_store, job_type_suffix=MCP_SUFFIX_WORKSTATION)
            job.set_worker("plugins.kioskfilemakerworkstationplugin.workers.createworkstationworker",
                           "CreateWorkstationWorker")
            job.job_data = {"workstation_id": kioskstdlib.delete_any_of(workstation_id, " *%\"'"),
                            "description": form.description.data,
                            "recording_group": form.recording_group.data,
                            "user_time_zone_index": form.user_time_zone_index.data,
                            "recording_time_zone_index": form.recording_time_zone_index.data,
                            "grant_access_to": form.grant_access_to.data,
                            "options": form.options.data
                            }
            job.meta_data = [JOB_META_TAG_WORKSTATION]
            job.queue()
            result = job.job_id
        except BaseException as e:
            logging.error(f"kioskfilemakerworkstationcontroller.ws_create: inner exception {repr(e)}")
            general_errors.append(f"Unexpected error when creating workstation '{workstation_id}': {repr(e)}."
                                  f"Please try at least once again.")
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.ws_create: outer exception {repr(e)}")
        general_errors.append(f"Unexpected error when creating workstation '{workstation_id}': {repr(e)}."
                              f"Please try at least once again.")

    return result


@kioskfilemakerworkstation.route('actions/<string:ws_id>', methods=['GET', 'POST'])
@full_login_required
def workstation_actions(ws_id: str):
    print(f"# actions for {ws_id}")
    try:
        check_ajax()

        if not ws_id.strip():
            logging.error(f"kioskfilemakerworkstationcontroller.workstation_actions: "
                          f"attempt to access endpoint with empty workstation")
            abort(HTTPStatus.BAD_REQUEST, f"There was an attempt to access an endpoint with empty workstation")

        workstation = KioskFileMakerWorkstation(ws_id)
        workstation.load_workstation()
        if not workstation.exists:
            abort(HTTPStatus.BAD_REQUEST, "Attempt to load a workstation that does not exist")

        return render_template('kioskfilemakerworkstationactions.html', ws=workstation)

    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.workstation_actions: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.workstation_actions: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


def mcp_workstation_action(worker_module, worker_class, ws_id, privilege="",
                           system_lock=True, meta_data=None, additional_job_data=None) -> KioskResult:
    if meta_data is None:
        meta_data = []
    job_type_name = ".".join([worker_module, worker_class])
    if privilege:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if privilege not in authorized_to:
            abort(HTTPStatus.UNAUTHORIZED)

    print(f" \n***** {job_type_name} workstation {ws_id} *****")
    try:
        job = MCPJob(kioskglobals.general_store, job_type_suffix=MCP_SUFFIX_WORKSTATION)
        job.set_worker(worker_module, worker_class)
        job.system_lock = system_lock
        job.job_data = {"workstation_id": ws_id}
        if additional_job_data:
            job.job_data = job.job_data | additional_job_data
        job.user_data = {"uuid": current_user.get_id()}
        job.meta_data = [*meta_data, JOB_META_TAG_WORKSTATION]
        job.queue()
        if job.job_id:
            return KioskResult(success=True)
        else:
            result = KioskResult(message=f"It was not possible to queue the job \"{job_type_name}\"")
            return result
    except BaseException as e:
        s = f"Exception in workstationmanagercontroller.mcp_workstation_action for job type {job_type_name}: {repr(e)}"
        logging.error(s)
        result = KioskResult(message=s)
        return result


def get_worker_setting(action: str):
    """
    get the necessary parameters for the worker for a given action
    :param action: a valid action
    :returns a tuple with worker information:
            (module with worker, class name of the worker in that file, needed privilege, lock system?)

    """
    action = action.lower()
    if action not in workers.keys():
        raise UserError("Attempt to trigger an unknown action.")
    return workers[action]


#  **************************************************************
#  ****    trigger action
#  *****************************************************************/
@kioskfilemakerworkstation.route('trigger/<string:action>/<string:ws_id>', methods=['POST'])
@full_login_required
def trigger_action(action: str, ws_id: str):
    try:
        logging.info(f"Triggered workstation action {action} for {ws_id}")
        check_ajax()

        ws = KioskFileMakerWorkstation(ws_id)
        ws.load_workstation()
        if not ws.exists:
            abort(HTTPStatus.BAD_REQUEST, f"Unknown workstation id '{ws_id}'")

        if not ws.is_option_available(action, current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
            abort(HTTPStatus.BAD_REQUEST, "The triggered option is not available.")

        if action == "reset_recording_group":
            return reset_recording_group(ws_id)

        if action == "disable":
            return disable_workstation(ws_id)

        worker_settings = get_worker_setting(action)
        meta_data = []
        if action == "delete":
            meta_data = [JOB_META_TAG_DELETED]
        additional_job_data = None
        if action == "fix_import":
            additional_job_data = {"fix": True}
        if action == "renew":
            additional_job_data = {"renew": True}

        return mcp_workstation_action(worker_settings[0],
                                      worker_settings[1], ws_id,
                                      privilege=worker_settings[2],
                                      system_lock=worker_settings[3],
                                      meta_data=meta_data,
                                      additional_job_data=additional_job_data).jsonify()
    except UserError as e:
        logging.error(f"kioskfilemakerworkstationcontroller.workstation_actions: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.workstation_actions: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.workstation_actions: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


def check_all_workstations_idle(recording_group="") -> bool:
    """
    checks if all workstation (of a certain recording group)
    are IDLE and don't have a pending or running job
    :param recording_group: if given only workstation of that group will be checked.
                            Otherwise all FileMakerWorkstation will be checked
    :return: boolean
    :except: Can throw exceptions
    """

    sync = Synchronization()
    recording_group = recording_group.lower()
    sync_manager = KioskSyncManager(kioskglobals.type_repository, sync)
    workstations = sync_manager.list_workstations("KioskFileMakerWorkstation")
    result = KioskResult(success=False, message="")
    doit = True
    for ws in workstations.values():
        ws: KioskFileMakerWorkstation
        if not recording_group or (ws.sync_ws.recording_group.lower() == recording_group):
            if ws.status != FileMakerWorkstation.IDLE:
                doit = False
                break
            job_info = sync_manager.get_latest_workstation_job(ws.id)
            if job_info and job_info.mcp_job.status < MCPJobStatus.JOB_STATUS_DONE:
                doit = False
                break

    return doit


def check_all_workstations_jobless(recording_group="") -> bool:
    """
    checks that none of the workstation (of a certain recording group)
    have a pending or running job
    :param recording_group: if given only workstation of that group will be checked.
                            Otherwise all FileMakerWorkstation will be checked
    :return: boolean
    :except: Can throw exceptions
    """

    sync = Synchronization()
    recording_group = recording_group.lower()
    sync_manager = KioskSyncManager(kioskglobals.type_repository, sync)
    workstations = sync_manager.list_workstations("KioskFileMakerWorkstation")
    jobless = True
    for ws in workstations.values():
        ws: KioskFileMakerWorkstation
        if not recording_group or (ws.sync_ws.recording_group.lower() == recording_group):
            job_info = sync_manager.get_latest_workstation_job(ws.id)
            if job_info and job_info.mcp_job.status < MCPJobStatus.JOB_STATUS_DONE:
                jobless = False
                break

    return jobless


def reset_recording_group(ws_id: str) -> object:
    """
    resets the template file of the workstation's recording group
    :param ws_id: the workstation id
    :return: a json response
    :except: throws Errors in case something goes wrong
    """
    synchronization = Synchronization()
    workstation: FileMakerWorkstation = synchronization.get_workstation("FileMakerWorkstation", ws_id)
    if workstation.exists() and workstation.recording_group:
        if check_all_workstations_jobless(workstation.recording_group):
            try:
                workstation.reset_template(workstation.recording_group)
            except BaseException as e:
                raise UserError(f"It was not possible to reset the template due to an error: {repr(e)}.")
        else:
            raise UserError(f"At least one dock of type 'FileMakerWorkstation' in recording group "
                            f"'{workstation.recording_group}' is"
                            f"part of a running job."
                            f"<br><br>You can only reset the template of a recording group if there "
                            f"are no running jobs related to any of its 'FileMakerWorkstation' docks.")
    else:
        raise UserError(f"It was not possible to reset the template because either the workstation {ws_id}"
                        f"could not be found or it has no recording group assigned to it.")

    result = KioskResult(success=True, message=f"Template file of recording group {workstation.recording_group} "
                                               f"successfully reset.")
    return result.jsonify()


#  **************************************************************
#  ****    DISABLE
#  *****************************************************************/
def disable_workstation(ws_id: str) -> object:
    """
    disables or enables a workstation
    :param ws_id: the workstation id. Uses also the disable key of request's json data
    :return: a json response
    :except: throws Errors in case something goes wrong
    """
    synchronization = Synchronization()
    # noinspection PyTypeChecker
    workstation: FileMakerWorkstation = synchronization.get_workstation("FileMakerWorkstation", ws_id)
    if "disable" not in request.json:
        raise Exception(f"Missing disabled argument in json data when disabling workstation {ws_id}.")

    if workstation.exists():

        try:
            workstation.disabled = request.json["disable"]
        except BaseException as e:
            raise UserError(f"It was not possible to set the activation status of workstation {ws_id}: {repr(e)}.")
    else:
        raise UserError(f"It was not possible to set the activation status of workstation {ws_id} because "
                        f"it could not be found or it has no recording group assigned to it.")

    if workstation.disabled:
        result = KioskResult(success=True, message=f"Workstation successfully disabled.")
    else:
        result = KioskResult(success=True, message=f"Workstation successfully enabled.")

    return result.jsonify()


#  **************************************************************
#  ****    DOWNLOAD
#  *****************************************************************/
@kioskfilemakerworkstation.route('/workstation/<ws_id>/download/<cmd>', methods=['GET', 'POST'])
# @full_login_required # This can also be triggered as an api route, so login requirements
# are checked in the body of the method
@exempt_from_requirements
@nocache
def ws_download(ws_id, cmd):
    """
        todo: document
    """

    api_call = False
    if not current_user.is_authenticated:
        # this just activates login_required (usually a wrapper) so that we have a httpauth.current_user.
        # The mindless lambda just serves as a function to wrap
        f = kioskglobals.httpauth.login_required(lambda: True)()
        httpauth_user = kioskglobals.httpauth.current_user()
        if httpauth_user:
            api_call = True
            flask_login.login_user(httpauth_user)
        else:
            return current_app.login_manager.unauthorized()

    # From here on we have a logged in flask_login.current_user

    print(f"kioskfilemakerworkstationcontroller.ws_download: {ws_id} {cmd}")
    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        authorized = "download workstation" in authorized_to

        if not authorized:
            print("NOT AUTHORIZED to download workstation")
            abort(HTTPStatus.UNAUTHORIZED)
        else:
            if cmd == "start":
                if api_call:
                    logging.debug(f"kioskfilemakerworkstationcontroller.ws_download: "
                                  f"download of workstation {ws_id} via api call.")

                sync = Synchronization()
                ws = KioskFileMakerWorkstation(ws_id, sync=sync)
                if not ws.load_workstation():
                    abort(HTTPStatus.NOT_FOUND, f"Workstation {ws_id} not found.")

                if not ws.is_option_available("download",
                                              current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
                    abort(HTTPStatus.BAD_REQUEST, "The triggered download option is not available.")

                fm_filename = ws.sync_ws.get_export_path_and_filename()
                dest_filename = kioskglobals.cfg.filemaker_db_filename
                resp = make_response(send_file(fm_filename,
                                               mimetype='application/octet-stream',
                                               download_name=dest_filename,
                                               as_attachment=True,
                                               last_modified=0,
                                               max_age=0,
                                               etag=str(datetime.datetime.now().timestamp())))

                resp = send_file(fm_filename,
                                 mimetype='application/octet-stream',
                                 download_name=dest_filename,
                                 as_attachment=True,
                                 last_modified=datetime.datetime.now().timestamp(),
                                 max_age=0,
                                 etag=str(datetime.datetime.now().timestamp()))

                # resp.headers['Last-Modified'] = str(datetime.datetime.now().timestamp())
                # resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, ' \
                #                                 'pre-check=0, public, max-age=0'
                resp.cache_control.no_store = True
                resp.cache_control.no_cache = True
                resp.cache_control.max_age = 0
                resp.cache_control.must_revalidate = True
                resp.cache_control.proxy_revalidate = True
                resp.cache_control.public = True
                resp.expires = 0
                resp.headers['Pragma'] = 'no-cache'
                # according to mdn, this is ignored:
                # resp.headers['Expires'] = '0'
                logging.info("Starting download of file " + fm_filename)
                resp.set_cookie('fileDownload', 'true')
                logging.info("Starting download of workstation file " + fm_filename)
                return resp
            elif cmd == "response":
                logging.info("Download for workstation " + ws_id + " should be successful.")
                sync = Synchronization()
                ws = KioskFileMakerWorkstation(ws_id, sync=sync)
                if not ws.load_workstation():
                    abort(HTTPStatus.NOT_FOUND, f"Workstation {ws_id} not found.")
                if not ws.is_option_available("download",
                                              current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
                    abort(HTTPStatus.BAD_REQUEST, "The triggered download option is not available.")
                ws.sync_ws.set_download_upload_status(ws.sync_ws.DOWNLOAD, user=current_user.user_id)
                return KioskResult(success=True).jsonify()
            else:
                abort(HTTPStatus.BAD_REQUEST)
    except UserError as e:
        logging.error(f"kioskfilemakerworkstationcontroller.ws_download: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.ws_download: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.ws_download: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    UPLOAD
#  *****************************************************************/
# @full_login_required # This can also be triggered as an api route, so login requirements
# are checked in the body of the method
@kioskfilemakerworkstation.route('/workstation/<ws_id>/upload', methods=['POST'])
@exempt_from_requirements
def upload_file(ws_id):
    """
        todo: document
    """
    api_call = False
    if not current_user.is_authenticated:
        logging.debug(f"kioskfilemakerworkstationcontroller.ws_upload: "
                      f"No current user. Trying httpauth user to upload workstation {ws_id}")
        # this just activates login_required (usually a wrapper) so that we have a httpauth.current_user.
        # The mindless lambda just serves as a function to wrap
        f = kioskglobals.httpauth.login_required(lambda: True)()
        httpauth_user = kioskglobals.httpauth.current_user()
        if httpauth_user:
            api_call = True
            flask_login.login_user(httpauth_user)
        else:
            logging.info(f"kioskfilemakerworkstationcontroller.ws_upload: "
                         f"No current user in attempt to upload workstation {ws_id}")
            return current_app.login_manager.unauthorized()

    try:
        if api_call:
            logging.debug(f"kioskfilemakerworkstationcontroller.ws_upload: "
                          f"upload of workstation {ws_id} via api call.")
        else:
            logging.debug(f"kioskfilemakerworkstationcontroller.ws_upload: "
                          f"upload of workstation {ws_id} via Kiosk UI")

        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if "upload workstation" not in authorized_to:
            logging.info(f"kioskfilemakerworkstationcontroller.ws_upload: "
                         f"{current_user.user_id} is lacking privileges required to upload workstation {ws_id}")
            abort(HTTPStatus.UNAUTHORIZED)

        result = KioskResult(message="Unknown error after upload")
        logging.info("Received file upload")
        if not ws_id:
            abort(HTTPStatus.BAD_REQUEST)

        try:
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    logging.info("Received file " + file.filename + " for workstation " + ws_id)
                    sync = Synchronization()
                    ws = KioskFileMakerWorkstation(ws_id, sync=sync)
                    if not ws.load_workstation():
                        abort(HTTPStatus.NOT_FOUND, f"Workstation {ws_id} not found.")
                    if not ws.is_option_available("upload",
                                                  current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
                        abort(HTTPStatus.BAD_REQUEST, "The triggered upload option is not available.")
                    if ws.sync_ws.upload_file(file):
                        ws.sync_ws.set_download_upload_status(ws.sync_ws.UPLOAD, user=current_user.user_id)
                        result.success = True
                        jobs = KioskWorkstationJobs(kioskglobals.general_store,
                                                    kioskglobals.get_config().get_project_id())
                        try:
                            jobs.release_workstation_jobs(ws.id)
                        except BaseException as e:
                            logging.error(f"kioskfilemakerworkstationcontroller.upload_file: "
                                          f"Exception in release_workstation_jobs{repr(e)}")

                        filename = secure_filename(file.filename)
                        if filename.lower() != kioskglobals.cfg.filemaker_db_filename.lower():
                            s = f"The file {filename} did not have the expected filename " \
                                f"{kioskglobals.cfg.filemaker_db_filename}. The file " \
                                f"has been uploaded but please make sure that it was the right one!"
                            result.add_log_line(s)
                            logging.warning(s)
                        else:
                            print(f"Received {filename.lower} from {current_user}")
                    else:
                        result.success = False
                        result.message = "Strangely, the target filename could not " \
                                         "be acquired, so the uploaded file was removed."
                else:
                    result.success = False
                    result.message = "Either file or filename is empty."
            else:
                result.success = False
                result.message = "No uploaded file detected."
        except BaseException as e:
            if isinstance(e, HTTPException):
                raise UserError(e.description)
            else:
                raise UserError(e)

        if not result.success:
            logging.info(f"kioskfilemakerworkstationcontroller.upload_file failed: {result.message}")
        return result.jsonify()
    except UserError as e:
        logging.error(f"kioskfilemakerworkstationcontroller.upload_file: {repr(e)}")
        print(repr(e))
        result = KioskResult(message=repr(e))
        result.message = f"{repr(e)}"
        result.success = False
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.ws_upload: {repr(e)}")
        print(repr(e))
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.ws_upload: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


def get_recording_group_dialog(action, dialog_title, dialog_text):
    recording_groups = [('all', 'all')]
    recording_groups.extend([(x, x) for x in KioskFileMakerWorkstation.get_recording_groups()])
    select_recording_group_form = SelectRecordingGroupForm(recording_groups)
    general_errors = []
    select_recording_group_form.recording_group.data = 'all'
    return render_template('selectrecordinggroupform.html',
                           select_recording_group_form=select_recording_group_form,
                           general_errors=general_errors,
                           dialog_title=dialog_title,
                           dialog_text=dialog_text,
                           route=url_for(request.endpoint),
                           action=action)


#  **************************************************************
#  ****    prepare_all
#  *****************************************************************/
@kioskfilemakerworkstation.route('prepare_all', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(PREPARE_WORKSTATIONS))
def prepare_all():
    try:
        logging.info(f"kioskfilemakerworkstationcontroller.prepare_all triggered.")

        check_ajax()
        if request.method == 'GET':
            return get_recording_group_dialog("prepare_all", "Prepare FileMaker Workstations",
                                              "Please select the recording group you want to prepare or 'all' "
                                              "if you want to prepare all workstations regardless "
                                              "of their recording group.")
        else:
            recording_group = kioskstdlib.try_get_dict_entry(request.json, 'recording_group', 'all')
            sync = Synchronization()
            sync_manager = KioskSyncManager(kioskglobals.type_repository, sync)
            workstations = sync_manager.list_workstations("KioskFileMakerWorkstation")
            result = KioskResult(success=False, message="")
            for ws in workstations.values():
                ws: KioskFileMakerWorkstation
                action = ""
                if not ws.disabled and \
                        (recording_group == 'all' or ws.recording_group == recording_group):
                    if ws.status == FileMakerWorkstation.IDLE:
                        action = "forknexport"
                    if ws.status == FileMakerWorkstation.READY_FOR_EXPORT:
                        action = "export"
                    job_info = sync_manager.get_latest_workstation_job(ws.id)
                    if job_info and job_info.mcp_job.status < MCPJobStatus.JOB_STATUS_DONE:
                        logging.debug(f"kioskfilemakerworkstationcontroller.prepare_all: workstation {ws.id}"
                                      f"not prepared because it has a running job.")
                        action = ""

                if action:
                    worker_settings = get_worker_setting(action)
                    ws_result = mcp_workstation_action(worker_settings[0],
                                                       worker_settings[1], ws.id,
                                                       privilege=worker_settings[2],
                                                       system_lock=worker_settings[3])
                    if not ws_result.success:
                        if result.message == "":
                            result.message = "<ul>"
                        result.message += f"<li>workstation {ws.id} could not be prepared: {ws_result.message}"
                    if ws_result.success:
                        result.success = True
            if not result.message:
                if not result.success:
                    result.message = "No workstation was eligible for preparation."

            return result.jsonify()
    except UserError as e:
        logging.error(f"kioskfilemakerworkstationcontroller.prepare_all: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.prepare_all: {repr(e)}")
        raise e
    # except Exception as e:
    #     logging.error(f"kioskfilemakerworkstationcontroller.prepare_all: {repr(e)}")
    #     abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    import_all
#  *****************************************************************/
@kioskfilemakerworkstation.route('import_all', methods=['POST', 'GET'])
@full_login_required
@requires(IsAuthorized(PREPARE_WORKSTATIONS))
def import_all():
    try:
        check_ajax()
        if request.method == 'GET':
            return get_recording_group_dialog("import_all", "Import FileMaker Workstations",
                                              "Please select the recording group you want to import or 'all' "
                                              "if you want to import all eligible workstations.")
        else:
            sync = Synchronization()
            sync_manager = KioskSyncManager(kioskglobals.type_repository, sync)
            recording_group = kioskstdlib.try_get_dict_entry(request.json, 'recording_group', 'all')
            workstations = sync_manager.list_workstations("KioskFileMakerWorkstation")
            result = KioskResult(success=False, message="")
            for ws in workstations.values():
                ws: KioskFileMakerWorkstation
                action = ""
                if not ws.disabled and \
                        (recording_group == 'all' or ws.recording_group == recording_group):
                    if ws.status == FileMakerWorkstation.IN_THE_FIELD and \
                            ws.sync_ws.download_upload_status == ws.sync_ws.UPLOAD:
                        action = "import"
                    job_info = sync_manager.get_latest_workstation_job(ws.id)
                    if job_info and job_info.mcp_job.status < MCPJobStatus.JOB_STATUS_DONE:
                        logging.debug(f"kioskfilemakerworkstationcontroller.import_all: workstation {ws.id}"
                                      f"not prepared because it has a running job.")
                        action = ""

                if action:
                    worker_settings = get_worker_setting(action)
                    ws_result = mcp_workstation_action(worker_settings[0],
                                                       worker_settings[1], ws.id,
                                                       privilege=worker_settings[2],
                                                       system_lock=worker_settings[3])
                    if not ws_result.success:
                        if result.message == "":
                            result.message = "<ul>"
                        result.message += f"<li>FileMaker database for workstation {ws.id} could not be imported:" \
                                          f" {ws_result.message}"
                    if ws_result.success:
                        result.success = True
            if not result.message:
                if not result.success:
                    result.message = "No workstation was eligible for import. Are any workstations uploaded " \
                                     "and ready for import?"

            return result.jsonify()
    except UserError as e:
        logging.error(f"kioskfilemakerworkstationcontroller.import_all: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.import_all: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.import_all: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    reset_all
#  *****************************************************************/
@kioskfilemakerworkstation.route('reset_all', methods=['POST', 'GET'])
@full_login_required
@requires(IsAuthorized(PREPARE_WORKSTATIONS))
def reset_all():
    try:
        check_ajax()
        if request.method == 'GET':
            return get_recording_group_dialog("reset_all", "Reset FileMaker Workstations",
                                              "Please select the recording group the workstations of which you "
                                              "want to reset or 'all' if you want to reset all workstations.")
        else:
            sync = Synchronization()
            sync_manager = KioskSyncManager(kioskglobals.type_repository, sync)
            recording_group = kioskstdlib.try_get_dict_entry(request.json, 'recording_group', 'all')
            workstations = sync_manager.list_workstations("KioskFileMakerWorkstation")
            result = KioskResult(success=False, message="")
            for ws in workstations.values():
                ws: KioskFileMakerWorkstation
                action = ""
                if not ws.disabled and \
                        (recording_group == 'all' or ws.recording_group == recording_group):
                    if ws.status != FileMakerWorkstation.IDLE:
                        action = "reset"
                    job_info = sync_manager.get_latest_workstation_job(ws.id)
                    if job_info and job_info.mcp_job.status < MCPJobStatus.JOB_STATUS_DONE:
                        logging.debug(f"kioskfilemakerworkstationcontroller.reset_all: workstation {ws.id}"
                                      f"not prepared because it has a running job.")
                        action = ""

                if action:
                    worker_settings = get_worker_setting(action)
                    ws_result = mcp_workstation_action(worker_settings[0],
                                                       worker_settings[1], ws.id,
                                                       privilege=worker_settings[2],
                                                       system_lock=worker_settings[3])
                    if not ws_result.success:
                        if result.message == "":
                            result.message = "<ul>"
                        result.message += f"<li>FileMaker database for workstation {ws.id} could not be reset:" \
                                          f" {ws_result.message}"
                    if ws_result.success:
                        result.success = True
            if not result.message:
                if not result.success:
                    result.message = "No workstation was eligible for a reset. Are they all running something?"

            return result.jsonify()
    except UserError as e:
        logging.error(f"kioskfilemakerworkstationcontroller.reset_all: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.reset_all: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.reset_all: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    EDIT
#  *****************************************************************/
@kioskfilemakerworkstation.route('/workstation/<ws_id>/edit', methods=['GET', 'POST'])
@full_login_required
def kfw_edit(ws_id):
    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if "edit workstation" not in authorized_to:
            abort(HTTPStatus.UNAUTHORIZED)

        if not ws_id:
            abort(HTTPStatus.BAD_REQUEST)
        sync = Synchronization()
        ws = KioskFileMakerWorkstation(ws_id, sync)
        if not ws.load_workstation():
            logging.error(f"kioskfilemakerworkstation.kfw_edit: Attempt to edit a workstation {ws_id} "
                          f"that does not exist")
            abort(HTTPStatus.BAD_REQUEST, f"Attempt to edit a workstation {ws_id} "
                                          f"that does not exist")

        if not ws.is_option_available("edit",
                                      current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
            abort(HTTPStatus.BAD_REQUEST, "The triggered edit option is not available.")

        recording_groups = KioskFileMakerWorkstation.get_recording_groups()
        kfw_form = KioskFileMakerWorkstationForm("edit")
        general_errors = []

        if request.method == "POST":
            sync_ws: FileMakerWorkstation = ws.sync_ws
            kfw_form.workstation_id.data = sync_ws.get_id()
            general_errors += kiosk_validate(kfw_form)
            if not general_errors:
                sync_ws.description = kfw_form.description.data
                sync_ws.recording_group = kfw_form.recording_group.data
                sync_ws.user_time_zone_index = kfw_form.user_time_zone_index.data
                sync_ws.recording_time_zone_index = kfw_form.recording_time_zone_index.data
                sync_ws.grant_access_to = kfw_form.grant_access_to.data
                sync_ws.options = kfw_form.options.data
                if sync_ws.save():
                    return redirect(url_for("syncmanager.sync_manager_show"))
                else:
                    general_errors.append("It was not possible to save your changes. Please try again.")
        else:
            sync_ws: FileMakerWorkstation = ws.sync_ws
            kfw_form.recording_group.data = sync_ws.recording_group
            kfw_form.workstation_id.data = sync_ws.get_id()
            kfw_form.description.data = sync_ws.description
            kfw_form.user_time_zone_index.data = sync_ws.user_time_zone_index
            kfw_form.recording_time_zone_index.data = sync_ws.recording_time_zone_index
            kfw_form.grant_access_to.data = sync_ws.grant_access_to
            kfw_form.options.data = sync_ws.options

        return render_template('kioskfilemakerworkstation.html',
                               new_fm_ws_form=kfw_form,
                               mode="edit",
                               general_errors=general_errors,
                               recording_groups=recording_groups)

    except UserError as e:
        logging.error(f"kioskfilemakerworkstationcontroller.kfw_edit: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.kfw_edit: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.kfw_edit: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    install_update
#  *****************************************************************/
@kioskfilemakerworkstation.route('install_update', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(INSTALL_PLUGIN))
def install_update():
    print('kioskfilemakerworkstation/install_update')
    try:
        check_ajax()
        sync = Synchronization()
        general_errors = []
        if not check_all_workstations_jobless():
            general_errors = [f"Some workstations have pending or running jobs."
                              f"Please wait for those jobs to finish before updating "
                              f"the filemaker recording software"]

        return render_template('kioskfilemakerworkstationinstaller.html',
                               general_errors=general_errors)

    except UserError as e:
        logging.error(f"kioskfilemakerworkstationcontroller.reset_all: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.reset_all: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.reset_all: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    UPLOAD NEW FILEMAKER TEMPLATE
#  *****************************************************************/
@kioskfilemakerworkstation.route('/trigger_install', methods=['POST'])
@full_login_required
def trigger_install():
    """
        todo: document
    """
    print('kioskfilemakerworkstation/trigger_install')
    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if INSTALL_PLUGIN not in authorized_to:
            logging.warning(f"Unauthorized access to kioskfilemakerworkstation/trigger_install "
                            f"by user {current_user.user_id}")
            abort(HTTPStatus.UNAUTHORIZED)

        result = KioskResult(message="Unknown error after upload")
        logging.info(f"Received new filemaker template from user {current_user.user_id}")

        try:
            if 'file' in request.files:
                file = request.files['file']
                cfg = kioskglobals.get_config()
                if file and file.filename:
                    logging.info("Received file " + file.filename)
                    if not check_all_workstations_jobless():
                        raise UserError(f"Some workstations have pending or running jobs."
                                        f"Please wait for those jobs to finish before updating "
                                        f"the filemaker recording software")

                    template_file_name = kioskstdlib.get_filename(file.filename)
                    if template_file_name != KioskFileMakerWorkstation.get_master_template_filename(cfg):
                        raise UserError(
                            f"The uploaded file does not have the expected filename for a filemaker template."
                            f"{template_file_name} does not match "
                            f"{KioskFileMakerWorkstation.get_master_template_filename(cfg)}")

                    try:
                        KioskFileMakerWorkstation.reset_all_recording_groups()
                    except BaseException as e:
                        raise UserError(f"It was not possible to reset all recording groups due to error {repr(e)}")

                    if not KioskFileMakerWorkstation.upload_template_file(cfg, file):
                        raise UserError(f'The file {template_file_name} was uploaded correctly but an error occurred'
                                        f' when replacing the current template with this file.')
                    else:
                        result.success = True
                        result.message = "The new filemaker template is installed and active. <br><br>" \
                                         "Note that preparing the first workstation per recording group " \
                                         "will take more time."
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
        logging.error(f"kioskfilemakerworkstationcontroller.trigger_install: {repr(e)}")
        result = KioskResult(message=repr(e))
        result.message = f"{repr(e)}"
        result.success = False
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskfilemakerworkstationcontroller.trigger_install: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskfilemakerworkstationcontroller.trigger_install: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)
