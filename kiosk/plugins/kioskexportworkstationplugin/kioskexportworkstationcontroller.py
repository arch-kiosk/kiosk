import datetime
import logging
from http import HTTPStatus
from pprint import pprint

from flask import Blueprint, request, render_template, session, redirect, url_for, abort
from flask_allows import requires
from flask_login import current_user
from werkzeug.exceptions import HTTPException

from authorization import full_login_required, IsAuthorized, INSTALL_PLUGIN
from authorization import get_local_authorization_strings, EDIT_WORKSTATION_PRIVILEGE, \
    SYNCHRONIZE, PREPARE_WORKSTATIONS, DOWNLOAD_WORKSTATION, UPLOAD_WORKSTATION, CREATE_WORKSTATION
import kioskstdlib

import kioskglobals

from core.kioskcontrollerplugin import get_plugin_for_controller
from fileexportworkstation import FileExportWorkstation
from fileexportworkstation.fileexport import FileExport
from kioskfilemanagerbridge import KioskFileManagerBridge
from kioskresult import KioskResult
from kioskwtforms import kiosk_validate
from mcpinterface.mcpjob import MCPJob
from plugins.kioskexportworkstationplugin import KioskExportWorkstation
from plugins.kioskexportworkstationplugin.forms.kioskfileexportworkstationform import KioskFileExportWorkstationForm
from plugins.kioskfilemakerworkstationplugin.kioskfilemakerworkstationcontroller import check_ajax
from plugins.syncmanagerplugin.kioskworkstationjobs import MCP_SUFFIX_WORKSTATION, JOB_META_TAG_WORKSTATION, \
    JOB_META_TAG_DELETED
from synchronization import Synchronization

_plugin_name_ = "kioskexportworkstationplugin"
_controller_name_ = "kioskexportworkstation"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.1

kioskexportworkstation = Blueprint(_controller_name_, __name__,
                                   template_folder='templates',
                                   static_folder="static",
                                   url_prefix=_url_prefix_)

LOCAL_PRIVILEGES = {
    EDIT_WORKSTATION_PRIVILEGE: "edit workstation",
    CREATE_WORKSTATION: "create workstation",
    PREPARE_WORKSTATIONS: "prepare workstation",
    DOWNLOAD_WORKSTATION: "download workstation",
    UPLOAD_WORKSTATION: "upload workstation",
    SYNCHRONIZE: "synchronize"
}


class UserError(Exception):
    pass


print(f"{_controller_name_} module loaded")


@kioskexportworkstation.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


def init_controller():
    # kioskglobals.csrf.exempt(".".join([__name__, "workstation_actions"]))
    if kioskglobals.get_development_option("webapp_development").lower() == "true":
        kioskglobals.csrf.exempt(kioskexportworkstation)


@kioskexportworkstation.route('create_kiosk_workstation', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(CREATE_WORKSTATION))
def create_kiosk_workstation():
    recording_groups = KioskExportWorkstation.get_recording_groups()
    sync = Synchronization()
    file_export = FileExport(kioskglobals.get_config(), sync.events, sync.type_repository, sync)
    export_formats = [(driver.driver_id, f"{driver.name} ({driver.description})") for driver in
                      file_export.get_drivers().values()]
    filename_renderings = [("uid", "use unique id as filename"), ("descriptive", "render descriptive filenames")]
    new_ws_form = KioskFileExportWorkstationForm("new",
                                                 export_formats=export_formats,
                                                 filename_renderings=filename_renderings)
    general_errors = []

    if request.method == "POST":
        general_errors += kiosk_validate(new_ws_form)
        if not general_errors:
            # give some positive feedback!
            if create_file_export_workstation(new_ws_form, general_errors):
                return redirect(url_for("syncmanager.sync_manager_show"))
            else:
                general_errors += ["The file export workstation could not be created for unknown reasons."]
    else:
        try:
            if kioskglobals.get_config().default_recording_group:
                new_ws_form.recording_group.data = kioskglobals.get_config().default_recording_group

        except:
            pass

    return render_template('kioskfileexportworkstation.html',
                           new_ws_form=new_ws_form,
                           mode="new",
                           general_errors=general_errors,
                           recording_groups=recording_groups)


def create_file_export_workstation(form: KioskFileExportWorkstationForm, general_errors: [str]) -> str:
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
        if KioskExportWorkstation.workstation_id_exists(workstation_id):
            general_errors.append(f"a workstation with the id '{workstation_id}' already exists. "
                                  f"Please chose a different id.")
            return result

        try:
            export_format = form.export_format.data
            sync = Synchronization()
            file_export = FileExport(kioskglobals.get_config(), sync.events, sync.type_repository, sync)

            # todo: This assumes that we use FileExportTargetZip only! As soon as the user can select different targets
            #       this needs to be changed
            if not assert_export_directory(file_export.get_file_export_targets()['FileExportTargetZip'].target_id,
                                           file_export):
                raise Exception("assert_export_directory returned False")

            job = MCPJob(kioskglobals.general_store, job_type_suffix=MCP_SUFFIX_WORKSTATION)
            job.set_worker("plugins.kioskexportworkstationplugin.workers.createworkstationworker",
                           "CreateWorkstationWorker")
            job.job_data = {"workstation_id": workstation_id,
                            "description": form.description.data,
                            "recording_group": form.recording_group.data,
                            "include_files": form.include_files.data,
                            "filename_rendering": form.filename_rendering.data,
                            "export_format": form.export_format.data
                            }
            job.meta_data = [JOB_META_TAG_WORKSTATION]
            job.queue()
            result = job.job_id
        except BaseException as e:
            logging.error(f"kioskexportworkstationcontroller.ws_create: inner exception {repr(e)}")
            general_errors.append(f"Unexpected error when creating workstation '{workstation_id}': {repr(e)}."
                                  f"Please try at least once again.")
    except Exception as e:
        logging.error(f"kioskexportworkstationcontroller.ws_create: outer exception {repr(e)}")
        general_errors.append(f"Unexpected error when creating workstation '{workstation_id}': {repr(e)}."
                              f"Please try at least once again.")

    return result


def assert_export_directory(target_id: str, file_export: FileExport) -> bool:
    bridge: KioskFileManagerBridge = KioskFileManagerBridge.instantiate()
    assert bridge
    targets = [(target.target_id, target.name, target.get_export_directory())
               for target in file_export.get_file_export_targets().values()
               if target.target_id == target_id]
    if len(targets) != 1:
        raise Exception(f"kioskexportworkstationcontroller.assert_export_directory: "
                        f"No target with id {target_id}.")

    target = targets[0]
    return bridge.assert_file_transfer_directory(target[0].lower(),
                                                 f"files exported with packing method '{target[1]}'",
                                                 target[2])


@kioskexportworkstation.route('actions/<string:ws_id>', methods=['GET', 'POST'])
@full_login_required
def workstation_actions(ws_id: str):
    print(f"# actions for KioskExporWorkstation {ws_id}")
    try:
        check_ajax()

        if not ws_id.strip():
            logging.error(f"kioskexportworkstationcontroller.workstation_actions: "
                          f"attempt to access endpoint with empty workstation")
            abort(HTTPStatus.BAD_REQUEST, f"There was an attempt to access an endpoint with empty workstation")

        workstation = KioskExportWorkstation(ws_id)
        workstation.load_workstation()
        if not workstation.exists:
            abort(HTTPStatus.BAD_REQUEST, "Attempt to load a workstation that does not exist")

        options = workstation.get_options()
        return render_template('kioskexportworkstationactions.html', ws=workstation, options=options)

    except HTTPException as e:
        logging.error(f"kioskexportworkstationcontroller.workstation_actions: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskexportworkstationcontroller.workstation_actions: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    trigger action
#  *****************************************************************/
def mcp_workstation_action(worker_module, worker_class, ws_id, privilege="",
                           system_lock=True, meta_data=None) -> KioskResult:
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
        job.user_data = {"uuid": current_user.get_id()}
        job.meta_data = [*meta_data, JOB_META_TAG_WORKSTATION]
        job.capture_log = True
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
    workers = {"delete": ("plugins.kioskexportworkstationplugin.workers.deleteworkstationworker",
                          "DeleteWorkstationWorker", EDIT_WORKSTATION_PRIVILEGE, False),
               "start": ("plugins.kioskexportworkstationplugin.workers.fileexportworkstationworker",
                         "FileExportWorkstationWorker", PREPARE_WORKSTATIONS, False)
               }
    if action not in workers.keys():
        raise UserError("Attempt to trigger an unknown action.")
    return workers[action]


@kioskexportworkstation.route('trigger/<string:action>/<string:ws_id>', methods=['POST'])
@full_login_required
def trigger_action(action: str, ws_id: str):
    try:
        check_ajax()

        worker_settings = get_worker_setting(action)
        meta_data = []
        if action == "delete":
            meta_data = [JOB_META_TAG_DELETED]
        return mcp_workstation_action(worker_settings[0],
                                      worker_settings[1], ws_id,
                                      privilege=worker_settings[2],
                                      system_lock=worker_settings[3],
                                      meta_data=meta_data).jsonify()
    except UserError as e:
        logging.error(f"kioskexportworkstationcontroller.workstation_actions: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskexportworkstationcontroller.workstation_actions: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskexportworkstationcontroller.workstation_actions: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    EDIT
#  *****************************************************************/
@kioskexportworkstation.route('/workstation/<ws_id>/edit', methods=['GET', 'POST'])
@full_login_required
def kew_edit(ws_id):
    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if "edit workstation" not in authorized_to:
            abort(HTTPStatus.UNAUTHORIZED)

        if not ws_id:
            abort(HTTPStatus.BAD_REQUEST)
        sync = Synchronization()
        ws = KioskExportWorkstation(ws_id, sync)
        if not ws.load_workstation():
            logging.error(f"kioskexportworkstationcontroller.kew_edit: Attempt to edit a workstation {ws_id} "
                          f"that does not exist")
            abort(HTTPStatus.BAD_REQUEST, f"Attempt to edit a workstation {ws_id} "
                                          f"that does not exist")

        recording_groups = KioskExportWorkstation.get_recording_groups()
        sync = Synchronization()
        file_export = FileExport(kioskglobals.get_config(), sync.events, sync.type_repository, sync)
        export_formats = [(driver.driver_id, f"{driver.name} ({driver.description})") for driver in
                          file_export.get_drivers().values()]
        filename_renderings = [("uid", "use unique id as filename"), ("descriptive", "render descriptive filenames")]
        kfe_form = KioskFileExportWorkstationForm("edit",
                                                  export_formats=export_formats,
                                                  filename_renderings=filename_renderings)

        general_errors = []

        if request.method == "POST":
            sync_ws: FileExportWorkstation = ws.sync_ws
            kfe_form.workstation_id.data = sync_ws.get_id()
            general_errors += kiosk_validate(kfe_form)
            if not general_errors:
                sync_ws.description = kfe_form.description.data
                sync_ws.recording_group = kfe_form.recording_group.data
                sync_ws.export_file_format = kfe_form.export_format.data
                sync_ws.include_files = kfe_form.include_files.data
                sync_ws.filename_rendering = kfe_form.filename_rendering.data if kfe_form.filename_rendering.data else ""

                if sync_ws.save():
                    # todo: This assumes that we use FileExportTargetZip only! As soon as the user can
                    #       select different targets this needs to be changed
                    if not assert_export_directory(
                            file_export.get_file_export_targets()['FileExportTargetZip'].target_id,
                            file_export):
                        raise Exception("assert_export_directory returned False")
                    return redirect(url_for("syncmanager.sync_manager_show"))
                else:
                    general_errors.append("It was not possible to save your changes. Please try again.")
        else:
            sync_ws: FileExportWorkstation = ws.sync_ws
            kfe_form.recording_group.data = sync_ws.recording_group
            kfe_form.workstation_id.data = sync_ws.get_id()
            kfe_form.description.data = sync_ws.description
            kfe_form.include_files.data = sync_ws.include_files
            kfe_form.export_format.data = sync_ws.export_file_format
            kfe_form.filename_rendering.data = sync_ws.filename_rendering if sync_ws.filename_rendering else ""

        return render_template('kioskfileexportworkstation.html',
                               new_ws_form=kfe_form,
                               mode="edit",
                               general_errors=general_errors,
                               recording_groups=recording_groups)

    except UserError as e:
        logging.error(f"kioskexportworkstationcontroller.kew_edit: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskexportworkstationcontroller.kew_edit: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskexportworkstationcontroller.kew_edit: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)
