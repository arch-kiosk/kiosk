import logging
import os
from http import HTTPStatus

from flask import Blueprint, request, render_template, redirect, url_for, abort, jsonify, render_template_string
from flask_allows import requires
from flask_cors import CORS
from flask_login import current_user
from werkzeug.exceptions import HTTPException

import kioskglobals
import kioskstdlib
from authorization import full_login_required, IsAuthorized, MANAGE_REPORTING, OPERATE_REPORTING
from authorization import get_local_authorization_strings
from core.kioskcontrollerplugin import get_plugin_for_controller
from kioskfilemanagerbridge import KioskFileManagerBridge
from kiosklib import is_ajax_request
from kioskresult import KioskResult
from kioskwtforms import kiosk_validate
from mcpinterface.mcpjob import MCPJob
from plugins.filerepositoryplugin.ModelFileRepository import FileRepositoryFile
from plugins.kioskreportingdockplugin import kioskreportingdock, KioskReportingDock
from plugins.kioskreportingdockplugin.forms.kioskreportingvariablesform import KioskReportingVariablesForm
from plugins.kioskreportingdockplugin.forms.kioskreportingdockform import KioskReportingDockForm
from plugins.syncmanagerplugin.kioskworkstationjobs import MCP_SUFFIX_WORKSTATION, JOB_META_TAG_WORKSTATION, \
    JOB_META_TAG_DELETED
from reportingdock import ReportingDock
from reportingdock.reportingengine import ReportingEngine
from synchronization import Synchronization

_plugin_name_ = "kioskreportingdockplugin"
_controller_name_ = "kioskreportingdock"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.1

kioskreportingdock = Blueprint(_controller_name_, __name__,
                               template_folder='templates',
                               static_folder="static",
                               url_prefix=_url_prefix_)

if kioskglobals.get_development_option("webapp_development").lower() == "true":
    CORS(kioskreportingdock)

LOCAL_PRIVILEGES = {
    MANAGE_REPORTING: "manage reporting",
    OPERATE_REPORTING: "operate reporting",
}

print(f"{_controller_name_} module loaded")


class UserError(Exception):
    pass


def init_controller():
    if kioskglobals.get_development_option("webapp_development").lower() == "true":
        kioskglobals.csrf.exempt(kioskreportingdock)


@kioskreportingdock.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


def check_ajax():
    if not (kioskglobals.get_development_option("webapp_development").lower() == "true" or is_ajax_request()):
        logging.error(f"kioskreportingdockcontroller: "
                      f"attempt to access endpoint other than by ajax")


@kioskreportingdock.route('create_kiosk_workstation', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(OPERATE_REPORTING))
def create_kiosk_workstation():
    try:
        definition_filenames = []
        template_files = []
        for f in kioskstdlib.find_files(ReportingEngine.get_reporting_path(),
                                        "*.*", include_path=False, order_by_time=False):
            if kioskstdlib.get_file_extension(f) == "yml":
                definition_filenames.append(f)
            else:
                template_files.append(f)

        new_dock_form = KioskReportingDockForm("new",
                                               query_definition_filenames=definition_filenames,
                                               mapping_definition_filenames=definition_filenames,
                                               template_files=template_files)
        general_errors = []

        if request.method == "POST":
            if "refresh" not in request.form:
                general_errors += kiosk_validate(new_dock_form)
                if not general_errors:

                    # give some positive feedback!
                    if create_reporting_dock(new_dock_form, general_errors):
                        return redirect(url_for("syncmanager.sync_manager_show"))

        return render_template('kioskreportingdock.html',
                               new_fm_ws_form=new_dock_form,
                               mode="new",
                               general_errors=general_errors)

    except BaseException as e:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, repr(e))


def create_reporting_dock(form, general_errors: [str]) -> str:
    """
    starts the job to create the dock and returns the job-id in case the start succeeded.
    :param form:
    :param general_errors:
    :return: the job-id or "" in case of error.
    """
    result = ""
    workstation_id = "?"
    try:

        workstation_id = form.workstation_id.data
        if KioskReportingDock.workstation_id_exists(workstation_id):
            general_errors.append(f"a dock with the id '{workstation_id}' already exists. "
                                  f"Please chose a different id.")
            return result

        try:
            job = MCPJob(kioskglobals.general_store, job_type_suffix=MCP_SUFFIX_WORKSTATION)
            job.set_worker("plugins.kioskreportingdockplugin.workers.createworkstationworker",
                           "CreateWorkstationWorker")
            job.job_data = {"workstation_id": workstation_id,
                            "description": form.description.data,
                            "query_definition_filename": form.query_definition_filename.data,
                            "mapping_definition_filename": form.mapping_definition_filename.data,
                            "template_file": form.template_file.data,
                            "output_file_prefix": form.output_file_prefix.data
                            }
            job.meta_data = [JOB_META_TAG_WORKSTATION]
            job.queue()
            result = job.job_id
        except BaseException as e:
            logging.error(f"kioskreportingdockcontroller.ws_create: inner exception {repr(e)}")
            general_errors.append(f"Unexpected error when creating dock '{workstation_id}': {repr(e)}."
                                  f"Please try at least once again.")
    except Exception as e:
        logging.error(f"kioskreportingdockcontroller.ws_create: outer exception {repr(e)}")
        general_errors.append(f"Unexpected error when creating dock '{workstation_id}': {repr(e)}."
                              f"Please try at least once again.")

    return result


#  **************************************************************
#  ****    UPLOAD NEW reporting files
#  *****************************************************************/
@kioskreportingdock.route('/trigger_upload', methods=['POST'])
@full_login_required
def trigger_upload():
    """
        files uploaded to a reporting dock are always stored together in the reporting folder.
    """

    reporting_path = ReportingEngine.get_reporting_path()

    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if MANAGE_REPORTING not in authorized_to:
            logging.warning(f"Unauthorized access to kioskreportingdock/trigger_upload "
                            f"by user {current_user.user_id}")
            abort(HTTPStatus.UNAUTHORIZED)

        result = KioskResult(message="Unknown error after upload")
        logging.info(f"kioskreportingdockcontroller: Received new file for reporting from user {current_user.user_id}")

        try:
            if 'file' in request.files:
                file = request.files['file']
                cfg = kioskglobals.get_config()
                if file and file.filename:
                    logging.info("kioskreportingdockcontroller: Received file " + file.filename)
                    filename = kioskstdlib.urap_secure_filename(kioskstdlib.get_filename(file.filename))
                    file.save(os.path.join(reporting_path, filename))
                    result.success = True
                    result.message = f"The file {filename} was successfully uploadeded to reporting."
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
        logging.error(f"kioskreportingdockcontroller.trigger_upload: {repr(e)}")
        result = KioskResult(message=repr(e))
        result.message = f"{repr(e)}"
        result.success = False
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskreportingdockcontroller.trigger_upload: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskreportingdockcontroller.trigger_upload: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


@kioskreportingdock.route('actions/<string:ws_id>', methods=['GET', 'POST'])
@full_login_required
def dock_actions(ws_id: str):
    try:
        check_ajax()

        if not ws_id.strip():
            logging.error(f"kioskreportingdockcontroller.dock_actions: "
                          f"attempt to access endpoint with empty reporting dock")
            abort(HTTPStatus.BAD_REQUEST, f"There was an attempt to access an endpoint with empty reporting dock")

        sync = Synchronization()
        workstation = KioskReportingDock(ws_id, sync)
        workstation.load_workstation()
        if not workstation.exists:
            abort(HTTPStatus.BAD_REQUEST, "Attempt to load a reporting dock that does not exist")

        return render_template('kioskreportingdockactions.html', ws=workstation)

    except HTTPException as e:
        logging.error(f"kioskreportingdockcontroller.dock_actions: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskreportingdockcontroller.dock_actions: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


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
    workers = {
        "run": ("plugins.kioskreportingdockplugin.workers.runreportingdockworker",
                "RunReportingDockWorker", OPERATE_REPORTING, False),
        "delete": ("plugins.kioskreportingdockplugin.workers.deletereportingdockworker",
                   "DeleteReportingDockWorker", MANAGE_REPORTING, False),
    }
    if action not in workers.keys():
        raise UserError("Attempt to trigger an unknown action.")
    return workers[action]


#  **************************************************************
#  ****    trigger action
#  *****************************************************************/
@kioskreportingdock.route('trigger/<string:action>/<string:ws_id>', methods=['POST'])
@full_login_required
def trigger_action(action: str, ws_id: str):
    try:
        print(f"triggered action {action} for dock {ws_id}")
        check_ajax()

        ws = KioskReportingDock(ws_id)
        ws.load_workstation()
        if not ws.exists:
            abort(HTTPStatus.BAD_REQUEST, f"Unknown dock id '{ws_id}'")

        if not ws.is_option_available(action, current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
            abort(HTTPStatus.BAD_REQUEST, "The triggered option is not available.")

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
        logging.error(f"kioskreportingdockcontroller.workstation_actions: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskreportingdockcontroller.workstation_actions: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskreportingdockcontroller.workstation_actions: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


#  **************************************************************
#  ****    EDIT
#  *****************************************************************/
@kioskreportingdock.route('/reportingdock/<ws_id>/edit', methods=['GET', 'POST'])
@full_login_required
def krd_edit(ws_id):
    try:
        authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
        if MANAGE_REPORTING not in authorized_to:
            abort(HTTPStatus.UNAUTHORIZED)

        if not ws_id:
            abort(HTTPStatus.BAD_REQUEST)

        definition_filenames = []
        template_files = []
        for f in kioskstdlib.find_files(ReportingEngine.get_reporting_path(),
                                        "*.*", include_path=False, order_by_time=False):
            if kioskstdlib.get_file_extension(f) == "yml":
                definition_filenames.append(f)
            else:
                template_files.append(f)

        sync = Synchronization()
        ws = KioskReportingDock(ws_id, sync)
        if not ws.load_workstation():
            logging.error(f"kioskreportingdock.kfw_edit: Attempt to edit a workstation {ws_id} "
                          f"that does not exist")
            abort(HTTPStatus.BAD_REQUEST, f"Attempt to edit a workstation {ws_id} "
                                          f"that does not exist")

        if not ws.is_option_available("edit", current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
            abort(HTTPStatus.BAD_REQUEST, "The triggered option is not available.")

        dock_form = KioskReportingDockForm("edit",
                                           query_definition_filenames=definition_filenames,
                                           mapping_definition_filenames=definition_filenames,
                                           template_files=template_files)
        general_errors = []
        sync_dock: ReportingDock = ws.sync_dock
        dock_form.workstation_id.data = sync_dock.get_id()
        if request.method == "POST":
            if "refresh" not in request.form:
                general_errors += kiosk_validate(dock_form)
                if not general_errors:
                    sync_dock.description = dock_form.description.data
                    sync_dock.template_file = dock_form.template_file.data
                    sync_dock.query_definition_filename = dock_form.query_definition_filename.data
                    sync_dock.mapping_definition_filename = dock_form.mapping_definition_filename.data
                    sync_dock.template_file = dock_form.template_file.data
                    sync_dock.output_file_prefix = dock_form.output_file_prefix.data

                    if sync_dock.save():
                        return redirect(url_for("syncmanager.sync_manager_show"))
                    else:
                        general_errors.append("It was not possible to save your changes. Please try again.")
        else:
            dock_form.description.data = sync_dock.description
            dock_form.template_file.data = sync_dock.template_file
            dock_form.query_definition_filename.data = sync_dock.query_definition_filename
            dock_form.mapping_definition_filename.data = sync_dock.mapping_definition_filename
            dock_form.template_file.data = sync_dock.template_file
            dock_form.output_file_prefix.data = sync_dock.output_file_prefix

        return render_template('kioskreportingdock.html',
                               new_fm_ws_form=dock_form,
                               mode="edit",
                               general_errors=general_errors)

    except UserError as e:
        logging.error(f"kioskreportingdockcontroller.kfw_edit: {repr(e)}")
        result = KioskResult(message=repr(e))
        return result.jsonify()
    except HTTPException as e:
        logging.error(f"kioskreportingdockcontroller.kfw_edit: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskreportingdockcontroller.kfw_edit: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


@kioskreportingdock.route('run/<string:dock_id>', methods=['GET', 'POST'])
@full_login_required
def run(dock_id: str):
    try:
        check_ajax()
        general_errors = []

        if not dock_id.strip():
            logging.error(f"kioskreportingdockcontroller.run: "
                          f"attempt to access endpoint with empty reporting dock")
            abort(HTTPStatus.BAD_REQUEST, f"There was an attempt to access an endpoint with empty reporting dock")

        sync = Synchronization()
        reporting_dock = KioskReportingDock(dock_id, sync)
        reporting_dock.load_workstation()
        if not reporting_dock.exists:
            abort(HTTPStatus.BAD_REQUEST, "Attempt to load a reporting dock that does not exist")
        if not reporting_dock.is_option_available("run",
                                                  current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
            abort(HTTPStatus.BAD_REQUEST, "The triggered option is not available.")

        reporting_engine = ReportingEngine(dock_id)
        reporting_engine.load_query_definition(reporting_dock.sync_dock.query_definition_filename)
        base_queries = reporting_engine.get_base_query_info()

        return render_template('reportingdockrunoptions.html',
                               general_errors=general_errors,
                               ws=reporting_dock,
                               dock_id=dock_id,
                               base_query_names=base_queries)

    except HTTPException as e:
        logging.error(f"kioskreportingdockcontroller.run: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskreportingdockcontroller.dock_actions: {repr(e)}")
        response = jsonify({'message': repr(e)})
        response.status_code = HTTPStatus.BAD_REQUEST
        return response
        # abort(HTTPStatus.INTERNAL_SERVER_ERROR, repr(e))


@kioskreportingdock.route('run/<string:dock_id>/<string:base_query>', methods=['GET', 'POST'])
@full_login_required
def variables(dock_id: str, base_query: str):
    try:
        check_ajax()
        general_errors = []

        if not dock_id.strip():
            logging.error(f"kioskreportingdockcontroller.run: "
                          f"attempt to access endpoint with empty reporting dock")
            abort(HTTPStatus.BAD_REQUEST, f"There was an attempt to access an endpoint with empty reporting dock")

        sync = Synchronization()
        reporting_dock = KioskReportingDock(dock_id, sync)
        reporting_dock.load_workstation()
        if not reporting_dock.exists:
            abort(HTTPStatus.BAD_REQUEST, "Attempt to load a reporting dock that does not exist")
        if not reporting_dock.is_option_available("run",
                                                  current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
            abort(HTTPStatus.BAD_REQUEST, "The triggered option is not available.")

        reporting_engine = ReportingEngine(dock_id)
        reporting_engine.load_query_definition(reporting_dock.sync_dock.query_definition_filename)

        variable_dict = {}

        variable_errors = {}
        rdv_form = None
        variable_definitions = reporting_engine.variable_definitions
        if request.method == 'POST':
            form_variables = request.form.to_dict()
            for variable in reporting_engine.get_required_variables(base_query):
                if variable_definitions.get_variable_type(variable) == "BOOLEAN":
                    variable_dict[variable] = (variable in form_variables and form_variables[variable].lower() == "on")
                else:
                    if variable not in form_variables or not form_variables[variable]:
                        variable_errors[variable] = f"Please enter a value for '{variable_definitions.get_variable_label(variable)}'."
                        variable_dict[variable] = ""
                    else:
                        err = reporting_engine.get_variable_error(variable, form_variables[variable])
                        if err:
                            variable_errors[variable] = err
                        variable_dict[variable] = form_variables[variable]

            if not general_errors and not variable_errors:
                rdv_form = KioskReportingVariablesForm()
                general_errors += run_report(dock_id, base_query, variable_dict,
                                             rdv_form.zip_output_files.data)

        elif request.method == 'GET':
            for variable in reporting_engine.get_required_variables(base_query):
                variable_dict[variable] = ""

        if not rdv_form:
            rdv_form = KioskReportingVariablesForm()
            rdv_form.zip_output_files.data = False

        if variable_errors and not general_errors:
            general_errors.append("Please check your inputs")

        try:
            can_zip = reporting_dock.sync_dock.get_reporting_dock_capabilities()["can_zip"]
        except BaseException as e:
            logging.error(f"kioskreportingdockcontroller.variables: Exception when checking can_zip status: {repr(e)}")
            can_zip = False
        can_zip = can_zip and reporting_engine.allows_zip(base_query)

        return render_template('reportingdockrunvariables.html',
                               general_errors=general_errors,
                               variable_errors=variable_errors,
                               can_zip_output_files=can_zip,
                               ws=reporting_dock,
                               base_query=base_query,
                               dock_id=dock_id,
                               variables=variable_dict,
                               variable_definitions=reporting_engine.variable_definitions,
                               rdv_form=rdv_form)

    except HTTPException as e:
        logging.error(f"kioskreportingdockcontroller.variables: {repr(e)}")
        raise e
    except Exception as e:
        logging.error(f"kioskreportingdockcontroller.variables: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


def run_report(dock_id: str, base_query: str, variables: dict, zip_output_files: bool) -> list:
    """
    executes the report with the input variable values
    :return:
    """
    try:
        assert_export_directory()
        job = MCPJob(kioskglobals.general_store, job_type_suffix=MCP_SUFFIX_WORKSTATION)
        worker_settings = get_worker_setting("run")
        job.set_worker(worker_settings[0], worker_settings[1])
        job.job_data = {"workstation_id": dock_id,
                        "base_query": base_query,
                        "variables": variables,
                        "zip_output_files": zip_output_files
                        }
        job.meta_data = [JOB_META_TAG_WORKSTATION]
        job.queue()
        return []
    except BaseException as e:
        logging.error(f"kioskreportingdockcontroller.run_report: inner exception {repr(e)}")
        return [f"Unexpected error when running report '{dock_id}': {repr(e)}."
                f"Perhaps try again with a fresh login?"]


def assert_export_directory() -> bool:
    bridge: KioskFileManagerBridge = KioskFileManagerBridge.instantiate()
    assert bridge
    return bridge.assert_file_transfer_directory("reporting",
                                                 f"reports ",
                                                 ReportingEngine.get_reporting_path(resolve_symbols=False))


@kioskreportingdock.route('view/<string:dock_id>', methods=['GET'])
@full_login_required
def view(dock_id: str):
    try:
        if not dock_id.strip():
            logging.error(f"kioskreportingdockcontroller.run: "
                          f"attempt to access endpoint with empty reporting dock")
            abort(HTTPStatus.BAD_REQUEST, f"There was an attempt to access an endpoint with empty reporting dock")

        sync = Synchronization()
        reporting_dock = KioskReportingDock(dock_id, sync)
        reporting_dock.load_workstation()
        if not reporting_dock.exists:
            abort(HTTPStatus.BAD_REQUEST, "Attempt to load a reporting dock that does not exist")
        if not reporting_dock.is_option_available("view",
                                                  current_plugin_controller=get_plugin_for_controller(_plugin_name_)):
            abort(HTTPStatus.BAD_REQUEST, "The triggered option is not available.")

        template_file = reporting_dock.sync_dock.get_report_file_for_view()
        if not template_file:
            abort(HTTPStatus.BAD_REQUEST, "Attempt to load a report that does not exist")
        with open(template_file, 'r') as f:
            template_str = f.read()

        return render_template_string(template_str)

    except Exception as e:
        logging.error(f"kioskreportingdockcontroller.view: {repr(e)}")
        try:
            if hasattr(e, "description"):
                error_message = e.description
            else:
                error_message = repr(e)
            return render_template('reportviewerror.html',
                                   error_message=error_message)
        except BaseException as e:
            logging.error(f"kioskreportingdockcontroller.view: {repr(e)}")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
