import datetime
import logging

from flask import Blueprint, request, render_template, session, redirect, url_for, abort
from flask_login import current_user
from werkzeug.datastructures import ImmutableMultiDict
from http import HTTPStatus

from authorization import full_login_required
from authorization import get_local_authorization_strings, EDIT_WORKSTATION_PRIVILEGE, \
    SYNCHRONIZE, PREPARE_WORKSTATIONS, DOWNLOAD_WORKSTATION, UPLOAD_WORKSTATION, CREATE_WORKSTATION
import kioskstdlib

import kioskglobals
from backupreminder import BackupReminder

from core.kioskcontrollerplugin import get_plugin_for_controller
from kiosklib import is_ajax_request
from kioskresult import KioskResult
from kioskworkstation import KioskWorkstation
from kioskwtforms import kiosk_validate
from mcpinterface.mcpconstants import MCPJobStatus
from mcpinterface.mcpjob import MCPJob
from synchronization import Synchronization
from .forms.newworkstationdefaultform import NewWorkstationDefaultForm
from .forms.syncoptionsform import SyncOptionsForm
from .kiosksyncmanager import KioskSyncManager
from .kioskworkstationjobs import JOB_META_TAG_WORKSTATION, JOB_META_TAG_SYNCHRONIZATION

_plugin_name_ = "syncmanagerplugin"
_controller_name_ = "syncmanager"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.1

LOCAL_PRIVILEGES = {
    EDIT_WORKSTATION_PRIVILEGE: "edit workstation",
    CREATE_WORKSTATION: "create workstation",
    PREPARE_WORKSTATIONS: "prepare workstation",
    DOWNLOAD_WORKSTATION: "download workstation",
    UPLOAD_WORKSTATION: "upload workstation",
    SYNCHRONIZE: "synchronize"
}

syncmanager = Blueprint(_controller_name_, __name__,
                        template_folder='templates',
                        static_folder="static",
                        url_prefix=_url_prefix_)
print(f"{_controller_name_} module loaded")


@syncmanager.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


#  **************************************************************
#  ****    /redirecting index
#  **************************************************************
@syncmanager.route('_redirect', methods=['GET'])
@full_login_required
def sync_manager_index():
    print("------------- redirecting")
    return redirect(url_for("syncmanager.sync_manager_show"))


#  **************************************************************
#  ****    /sync_manager_view
#  *****************************************************************/
@syncmanager.route('', methods=['GET', 'POST'])
@full_login_required
# @nocache
def sync_manager_show():
    conf = kioskglobals.get_config()
    model_daily_review = None
    try:
        BackupReminder.check_last_backup(conf)
    except BaseException as e:
        logging.error(f"syncmanagercontroller.sync_manager_show: {repr(e)}")
    print("\n*************** syncmanager / ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    return render_template('syncmanager.html')


@syncmanager.route('create_workstation', methods=['GET', 'POST'])
@full_login_required
def create_kiosk_workstation():
    sync_manager = KioskSyncManager(kioskglobals.type_repository)
    workstation_types = [(x, sync_manager.get_kiosk_workstation_class(x).get_readable_name())
                         for x in sync_manager.get_kiosk_workstation_type_names()
                         if sync_manager.is_kiosk_workstation_class_available(x, current_user=current_user)]

    new_workstation_form = NewWorkstationDefaultForm(workstation_types)
    general_errors = []

    if request.method == 'POST':
        workstation_type = new_workstation_form.workstation_type.data
        # print(f"Workstation type {workstation_type} selected")
        general_errors += kiosk_validate(new_workstation_form)
        if workstation_type not in sync_manager.get_kiosk_workstation_type_names():
            general_errors.append(f"The workstation type '{workstation_type}' is unknown.")
        else:
            session["new_workstation_type"] = workstation_type
    elif request.method == 'GET':
        if "default_workstation_type" in kioskglobals.cfg.kiosk["syncmanagerplugin"]:
            default_workstation_type = \
                kioskglobals.cfg.kiosk["syncmanagerplugin"]["default_workstation_type"]
            for ws_types in workstation_types:
                if ws_types[1].lower() == default_workstation_type:
                    default_workstation_type = ws_types[0]
                    break
            if default_workstation_type:
                new_workstation_form.workstation_type.data = default_workstation_type
    else:
        abort(500)
        return

    return render_template('createworkstationdialog.html',
                           new_workstation_form=new_workstation_form,
                           general_errors=general_errors)


@syncmanager.route('workstations/<string:ws_id>/log', methods=['GET', 'POST'])
@full_login_required
def workstation_log(ws_id):
    sync_manager = KioskSyncManager(kioskglobals.type_repository)
    ws = None
    ws = sync_manager.get_workstation(ws_id)
    log = []
    has_errors = False
    msg = ""
    if ws:
        job = sync_manager.get_latest_workstation_job(ws_id)
        if job:
            log = job.mcp_job.get_log_lines()
            if "success" in job.mcp_job.result and not job.mcp_job.result["success"]:
                if "message" in job.mcp_job.result:
                    msg = job.mcp_job.result["message"]
                    has_errors = True
            if not msg:
                if "has_warnings" in job.mcp_job.result:
                    msg = "The last action was successful but returned warnings"
    return render_template('workstationlog.html', ws=ws, log=log, has_errors=has_errors, msg=msg)


#  **************************************************************
#  ****    synchronize/check
#  *****************************************************************/
@syncmanager.route('/synchronize/check', methods=['GET', 'POST'])
@full_login_required
def synchronize_check():
    print("\n*************** synchronize / check ")

    authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
    if "synchronize" not in authorized_to:
        return render_template('no_sync.html',
                               sync_msg="You do not have the necessary privileges to start this process.")
    else:
        sync_options_form = SyncOptionsForm()

        sync = Synchronization()
        sync.list_workstations()
        sync_job = KioskSyncManager.get_current_synchronization_job()
        allow = True
        if sync_job and sync_job.status < MCPJobStatus.JOB_STATUS_DONE:
            sync_msg = "There is already a synchronization process running. You cannot start a second one."
            logging.info("Attempt to start a second synchronization blocked.")
            allow = False
        else:
            if sync.all_workstations_back():
                sync_msg = "Synchronization can run now. Are you sure you want to start it?"
                logging.info("Synchronization can run, all workstations are ready.")
            else:
                logging.info("Information given, that not all workstations are ready.")
                sync_msg = "Not all workstations are back from the field. It is always better " \
                           "to synchronize all workstations together. " \
                           "However, if you want to proceed, go for it and press ok."

        return render_template('confirm_sync.html', sync_msg=sync_msg, sync_options_form=sync_options_form,
                               allow=allow)


#  **************************************************************
#  ****    start_synchronization
#  **************************************************************/
@syncmanager.route('/synchronization/start', methods=['POST'])
@full_login_required
def start_synchronization():
    # main method
    authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
    if "synchronize" not in authorized_to:
        abort(HTTPStatus.UNAUTHORIZED)
    else:
        try:
            if is_ajax_request():
                sync_options_form = SyncOptionsForm()
                # print(sync_options_form.so_ignore_file_issues.data)
                # print(sync_options_form.so_drop_duplicates.data)
                # print(sync_options_form.so_rewire_duplicates.data)
                job = MCPJob(kioskglobals.general_store)
                job.set_worker("plugins.syncmanagerplugin.workers.synchronizationworker",
                               "SynchronizationWorker")
                job.job_data = {"ignore_file_issues": bool(sync_options_form.so_ignore_file_issues.data),
                                "rewire_duplicates": bool(sync_options_form.so_rewire_duplicates.data),
                                "drop_duplicates": bool(sync_options_form.so_drop_duplicates.data),
                                "safe_mode": bool(sync_options_form.so_safe_mode.data),
                                "housekeeping": bool(sync_options_form.so_housekeeping.data),
                                }
                job.meta_data = [JOB_META_TAG_SYNCHRONIZATION]
                job.user_data = {"uuid": current_user.get_id()}
                job.system_lock = False
                job.queue()
                job_uid = job.job_id
                if job_uid:
                    result = KioskResult(success=True)
                    result.set_data("job_uid", job_uid)
                else:
                    result = KioskResult(message=f"The server denied to start the SynchronizationWorker job")

                return result.jsonify()

            else:
                abort(HTTPStatus.BAD_REQUEST)
        except BaseException as e:
            s = f"Exception in syncmanager.synchronize: {repr(e)}"
            logging.error(s)
            result = KioskResult(message=s)
            return result.jsonify()


#  **************************************************************
#  ****    synchronization index
#  *****************************************************************/
@syncmanager.route('/synchronization/<job_uid>', methods=['GET', 'POST'])
@full_login_required
def sychronization(job_uid):
    authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
    if "synchronize" not in authorized_to:
        abort(HTTPStatus.UNAUTHORIZED)
    else:
        return render_template('synchronization.html', job_uid=job_uid)

#  **************************************************************
#  ****    synchronization progress
#  *****************************************************************/
@syncmanager.route('/synchronization/progress', methods=['GET', 'POST'])
@full_login_required
def synchronization_progress():
    print("\n*************** synchronization_progress ")
    authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
    if "synchronize" not in authorized_to:
        abort(HTTPStatus.UNAUTHORIZED)
    else:
        syncmanager = KioskSyncManager(kioskglobals.type_repository)
        sync_job = syncmanager.get_current_synchronization_job()
        if not sync_job:
            abort(HTTPStatus.NOT_FOUND)
        else:
            return render_template('synchronization.html', job_uid=sync_job.job_id)
