import datetime
import logging
import os

import kiosklib
import urapdatetimelib

from flask_login import current_user

from contextmanagement.memoryidentifiercache import MemoryIdentifierCache

import win32api
from flask import Blueprint, request, render_template, jsonify, \
    session, make_response
from flask_wtf import FlaskForm
from werkzeug.datastructures import ImmutableMultiDict

import kioskglobals
import kioskstdlib
from authorization import full_login_required, MODIFY_DATA, get_local_authorization_strings
from core.kioskconfig import KioskConfig
from core.kioskcontrollerplugin import get_plugin_for_controller
from core.kioskresult import KioskResult
from filesequenceimport import FileSequenceImport
from image_manipulation.imagemanipulationstrategyfactory import ImageManipulationStrategyFactory
from kioskcleanup import KioskCleanup
from mcpinterface.mcpjob import MCPJob
from sync.core.fileimport import FileImport
from sync.core.filerepository import FileRepository
from sync.core.synchronization import Synchronization
from kiosklogger import KioskLogger
from kioskstdlib import urap_secure_filename
from userconfig import UserConfig
from .forms.fileimportdialogidentifiersubstitutionform import IdentifierSubstitutionForm
from .forms.fileimportdialoglocalimportform1 import LocalImportForm1
from .forms.fileimportdialoglocalimportform2 import LocalImportForm2
from .forms.fileimportdialogsequenceform1 import SequenceImportForm1
from .forms.fileimportdialoguploadform1 import UploadForm1

_plugin_name_ = "fileimportplugin"
_controller_name_ = "fileimport"
_url_prefix_ = '/' + _controller_name_
plugin_version = 1.1

fileimport = Blueprint(_controller_name_, __name__,
                       template_folder='templates',
                       static_folder="static",
                       url_prefix=_url_prefix_)

LOCAL_FILE_IMPORT_PRIVILEGES = {
    MODIFY_DATA: "modify data",
}


# todo: refactor: try to move this not DRY method into the plugin.
@fileimport.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


#  **************************************************************
#  ****    import-dialog frame
#  *****************************************************************/
@full_login_required
@fileimport.route('/dialog', methods=['GET'])
def dialog():
    for s in ["dialoglocalimport1", "dialoglocalimport2", "dialogupload1", "dialogupload2",
              "dialogsequence1", "dialogsequence2"]:
        if s in session:
            session.pop(s)

    return render_template(r"fileimportdialog.html")


def get_secure_filename(param_filename):
    filename = urap_secure_filename(param_filename)
    if not filename:
        raise Exception(f"Cannot create a secure filename based on filename {param_filename}")
    # logging.info(f"repository_upload_image: Received filename {param_filename} is now {filename}. ")
    return filename


#  **************************************************************
#  ****    import-dialog method selection
#  *****************************************************************/
@full_login_required
@fileimport.route('/dialogmethodselection', methods=['GET', 'POST'])
def dialogmethodselection():
    cfg: KioskConfig = kioskglobals.cfg
    max_file_uploads = kioskstdlib.try_get_dict_entry(cfg.file_import, "max_file_uploads", 10)
    return render_template(r"fileimportdialogmethodselection.html",
                           repl_user_id=current_user.repl_user_id,
                           max_file_uploads=max_file_uploads)


def get_pathlist(cfg):
    try_path_list = []
    try:
        rc_path_list = cfg.get_local_importpaths()
        if isinstance(rc_path_list, str):
            rc_path_list = [rc_path_list]

        if not kioskstdlib.to_bool(kioskstdlib.try_get_dict_entry(cfg.kiosk, "limit_import_to_paths", "false")):
            try:
                drives = win32api.GetLogicalDriveStrings()
                if drives:
                    drives = list(map(lambda d: d.lower()[:1], drives.split('\000')))
                    drives = [d for d in drives if d and d.lower()[:1] not in ['b', 'a']]
                else:
                    drives = []
            except BaseException as e:
                logging.error(f"fileimportcontroller.get_pathlist: Exception when listing drives: {repr(e)}. "
                              f"drives is '{drives}'")
                logging.error(f"fileimportcontroller.get_pathlist: Exception when listing drives: {repr(e)}")
            try_path_list = list(filter(lambda p: p.lower()[0] in drives, rc_path_list))
            try_path_list.extend(filter(lambda p: p not in try_path_list, list(map(lambda d: d + ":\\", drives))))
        else:
            try_path_list = rc_path_list
    except BaseException as e:
        logging.error(f"fileimportcontroller.get_pathlist: get_pathlist exception {repr(e)}")
    try_path_list.sort()
    # print(try_path_list)
    rc_path_list = []
    for p in try_path_list:
        try:
            if os.path.isdir(p):
                rc_path_list.append(p)
        except:
            pass

    return rc_path_list


#  **************************************************************
#  ****    import-dialog local import page 1
#  *****************************************************************/
@full_login_required
@fileimport.route('/dialoglocalimport1', methods=['GET', 'POST'])
def dialoglocalimport1():
    cfg: KioskConfig = kioskglobals.cfg
    path_list = get_pathlist(cfg)
    sync = Synchronization()

    user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
    test_cfg = user_config.get_config("file_import")
    logging.debug(f"fileimportcontroller.dialoglocalimport1: user config: {test_cfg}")

    file_import = FileImport(cfg, sync, user_config=user_config)
    general_message = ""

    substitute_identifiers = False
    if request.method == 'POST':
        localimportform1 = LocalImportForm1(request.form)
        if localimportform1.validate():
            if len(str(localimportform1.tags.data)) == 0:
                form_data = dict(request.form)
                form_data["tags"] = "import_" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                import_tags = form_data["tags"]
                logging.info(
                    "dialoglocalimport1: Files will be automatically tagged as " + import_tags)
                session["dialoglocalimport1"] = form_data
            else:
                session["dialoglocalimport1"] = request.form
    else:
        if 'dialoglocalimport1' in session:
            localimportform1 = LocalImportForm1(ImmutableMultiDict(session["dialoglocalimport1"]))
        else:
            config = file_import.get_wtform_values()
            localimportform1 = LocalImportForm1(ImmutableMultiDict(config))
        try:
            if localimportform1.mif_local_path.data is None or localimportform1.mif_local_path.data.strip() == "":
                localimportform1.mif_local_path.data = path_list[0]
        except BaseException as e:
            logging.debug(f"fileimportcontroller.dialoglocalimport1: "
                          f"Benign Xception when setting default import path: {repr(e)}")

    if 'dialoglocalimport1' in session and "substitute_identifiers" in session["dialoglocalimport1"]:
        substitute_identifiers = session["dialoglocalimport1"]["substitute_identifiers"] == "on"

    general_errors = []
    if not file_import.sort_import_filters():
        general_errors += ["There are no context filters installed. Please talk to your admin."]

    resp = make_response(render_template(r"fileimportdialoglocalimport1.html",
                                         localimportform1=localimportform1,
                                         general_errors=general_errors,
                                         path_list=path_list))

    resp.set_cookie('substitute_identifiers', str(substitute_identifiers))
    resp.set_cookie('import_type', "local")
    return resp


#  **************************************************************
#  ****    import-dialog local import page 2: Filters and options
#  *****************************************************************/
@full_login_required
@fileimport.route('/dialoglocalimport2', methods=['GET', 'POST'])
def dialoglocalimport2():
    sync = Synchronization()
    cfg: KioskConfig = kioskglobals.cfg

    user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
    test_cfg = user_config.get_config("file_import")
    logging.debug(f"fileimportcontroller.dialoglocalimport2: user config: {test_cfg}")
    file_import = FileImport(cfg, sync, user_config=user_config)

    sorted_names = file_import.sort_import_filters()
    context_filters = [file_import.get_file_import_filter(x) for x in sorted_names]

    if request.method == 'POST':
        is_valid = True
        localimportform2 = LocalImportForm2(request.form)
        for context_filter in context_filters:
            context_filter.init_form(request.form)
            frm = context_filter.get_form()
            rc = frm.validate()
            is_valid = is_valid & rc

        is_valid = is_valid & localimportform2.validate()
        if is_valid:
            session["dialoglocalimport2"] = request.form
    else:
        if 'dialoglocalimport2' in session:
            localimportform2 = LocalImportForm2(ImmutableMultiDict(session["dialoglocalimport2"]))
            for context_filter in context_filters:
                context_filter.init_form(ImmutableMultiDict(session["dialoglocalimport2"]))
        else:
            localimportform2 = LocalImportForm2()
            for context_filter in context_filters:
                context_filter.init_form({})
    general_errors = localimportform2.get_general_form_errors()

    for context_filter in context_filters:
        general_errors += context_filter.get_form().get_general_form_errors()

    return render_template(r"fileimportdialoglocalimport2.html",
                           localimportform2=localimportform2,
                           context_filters=context_filters,
                           general_errors=general_errors)


#  **************************************************************
#  ****    import-dialog local import page 3: Progress page
#  *****************************************************************/
@full_login_required
@fileimport.route('/dialoglocalimport3', methods=['GET', 'POST'])
def dialoglocalimport3():
    import_tags = session["dialoglocalimport1"]["tags"]
    return render_template(r"fileimportdialoglocalimport3.html",
                           import_tags=import_tags)


#  **************************************************************
#  ****    import-dialog local import page 2: Filters and options
#  *****************************************************************/
@full_login_required
@fileimport.route('/localimport', methods=['POST'])
def localimport():
    json_message = "unknown error"
    cfg: KioskConfig = kioskglobals.cfg

    def worker(file_import: FileImport, worker_queue, t):
        def report_progress(prg):
            if "progress" in prg:
                new_progress = 0
                if "topic" in prg:
                    if prg["topic"].find("import-local-files"):
                        new_progress = int(prg["progress"])
                    if "extended_progress" in prg:
                        t.extended_progress = prg["extended_progress"]
                if new_progress > t.thread_progress:
                    t.thread_progress = new_progress
            rc = True
            try:
                kioskglobals.general_store.get_int("STOPTHREAD")
                rc = False
            except ValueError:
                rc = False
            except BaseException as e:
                pass

            return rc

        try:
            print("Import - worker starts")
            file_repos = FileRepository(cfg, sync.events, sync.type_repository, sync)
            file_import.file_repository = file_repos
            file_import.callback_progress = report_progress
            ic = MemoryIdentifierCache(kioskglobals.master_view.dsd)
            file_import.identifier_evaluator = ic.has_identifier
            file_import.move_finished_files = True
            rc = file_import.execute()
            try:
                kiosklib.run_quality_control()
            except BaseException as e:
                logging.warning(f"fileimportcontroller.localimport.worker: Error running quality control: {repr(e)}. "
                                f"Please use Housekeeping if you want to rerun quality control rules after the import.")

            t.thread_progress = 100
            if rc:
                json_msg = "ok"
            else:
                json_msg = "error importing local files"
        except Exception as exc:
            logging.error("Exception in fileimportcontroller.localimport.worker: " + repr(exc))
            json_msg = "Exception in fileimportcontroller.localimport.worker: " + repr(exc)
            t.thread_progress = 100

        worker_queue.put(("json_message", json_msg))

    # localimport main function
    try:
        sync = Synchronization()

        user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
        test_cfg = user_config.get_config("file_import")
        logging.debug(f"fileimportcontroller.localimport: user config: {test_cfg}")
        kioskglobals.general_store.delete_key("STOPTHREAD")
        file_import = FileImport(cfg, sync, user_config=user_config)

        sorted_names = file_import.sort_import_filters()
        context_filters = [file_import.get_file_import_filter(x) for x in sorted_names]

        localimportform1 = LocalImportForm1(ImmutableMultiDict(session["dialoglocalimport1"]))

        for context_filter in context_filters:
            context_filter.init_form(ImmutableMultiDict(session["dialoglocalimport2"]))
            context_filter.form_to_config()

        file_import.form_to_config(localimportform1)

        # for context_filter in context_filters:
        #     print(context_filter.__dict__)

        authorized_to = get_local_authorization_strings(LOCAL_FILE_IMPORT_PRIVILEGES)
        if "modify data" not in authorized_to:
            return jsonify(result="You do not have the necessary privilege to import files.")

        if localimportform1.substitute_identifiers.data and 'identifiersubstitutionform' in session:
            if 'search_pattern' in session['identifiersubstitutionform'] and \
                    session['identifiersubstitutionform']['search_pattern']:
                identifier_substitutions = [(session['identifiersubstitutionform']['search_pattern'],
                                             session['identifiersubstitutionform']['replace_with'])]
                file_import.set_identifier_substitutions(identifier_substitutions)

        # kioskglobals.kiosk_thread
        print(" \n**** import local files\n")

        local_path = file_import.pathname
        if not os.path.isdir(local_path):
            json_message = '"' + local_path + '" is not a valid local directory on machine ' + os.environ[
                'COMPUTERNAME']
        else:
            try:
                gotit = kioskglobals.kiosk_thread.lock()
                if gotit:
                    file_import.modified_by = current_user.repl_user_id
                    if kioskglobals.kiosk_thread.execute(target=worker, args=(file_import,),
                                                         self_unlock=True, wait=False):
                        json_message = "ok"
                    else:
                        json_message = "Could not initiate the urap-thread"
                        raise Exception(json_message)
                else:
                    json_message = "locked"
            except Exception as e:
                logging.error("Exception in repository_import_local_images: " + repr(e))
                try:
                    kioskglobals.kiosk_thread.unlock
                finally:
                    pass
    except Exception as e:
        json_message = "Exception in repository_import_local_images: " + repr(e)
        logging.error(json_message)

    return jsonify(result=json_message)


#  **************************************************************
#  ****    import-dialog local import: cancel running thread
#  *****************************************************************/

@full_login_required
@fileimport.route('/cancel', methods=['GET'])
def local_import_cancel():
    print("Import - worker cancelled")
    logging.info(f"fileimport.local_import_cancel: Request to cancel file import worker.")
    result = KioskResult(False)
    try:
        kioskglobals.general_store.put_int("STOPTHREAD", 1)
        result.success = True

    except BaseException as e:
        result.message = repr(e)
        logging.error(f"fileimport.local_import_cancel: {repr(e)}")

    return result.jsonify()


#  **************************************************************
#  ****    import-dialog upload page 1: Filters
#  **************************************************************/
@full_login_required
@fileimport.route('/dialogupload1', methods=['GET', 'POST'])
def dialogupload1():
    sync = Synchronization()
    cfg: KioskConfig = kioskglobals.cfg
    user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
    test_cfg = user_config.get_config("file_import")
    logging.debug(f"fileimportcontroller.dialogupload1: user config: {test_cfg}")
    file_import = FileImport(cfg, sync, method="upload", user_config=user_config)
    sorted_names = file_import.sort_import_filters()
    context_filters = [file_import.get_file_import_filter(x) for x in sorted_names]
    general_message = ""

    import_tags = ""
    substitute_identifiers = False
    if request.method == 'POST':
        is_valid = True
        for context_filter in context_filters:
            context_filter.init_form(request.form)
            frm = context_filter.get_form()
            rc = frm.validate()
            is_valid = is_valid & rc

        uploadform1 = UploadForm1(request.form)
        is_valid = is_valid & uploadform1.validate()

        if is_valid:
            if len(str(uploadform1.tags.data)) == 0:
                form_data = dict(request.form)
                form_data["tags"] = "import_" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                import_tags = form_data["tags"]
                general_message = "Files will be automatically tagged as " + import_tags
                logging.info(
                    "dialogupload1: Files will be automatically tagged as " + import_tags)
                session["dialogupload1"] = form_data
            else:
                session["dialogupload1"] = request.form
    else:
        if 'dialogupload1' in session:
            for context_filter in context_filters:
                context_filter.init_form(ImmutableMultiDict(session["dialogupload1"]))
            uploadform1 = UploadForm1(ImmutableMultiDict(session["dialogupload1"]))
        else:
            for context_filter in context_filters:
                context_filter.init_form({})
            config = file_import.get_wtform_values()
            uploadform1 = UploadForm1(ImmutableMultiDict(config))

    if "dialogupload1" in session:
        if "tags" in session["dialogupload1"]:
            import_tags = session["dialogupload1"]["tags"]
        if "substitute_identifiers" in session["dialogupload1"]:
            substitute_identifiers = session["dialogupload1"]["substitute_identifiers"] == "on"

    general_errors = uploadform1.get_general_form_errors()
    if not context_filters:
        general_errors += ["There are no context filters installed. Please talk to your admin."]

    for context_filter in context_filters:
        general_errors += context_filter.get_form().get_general_form_errors()

    resp = make_response(render_template(r"fileimportdialogupload1.html",
                                         uploadform1=uploadform1,
                                         context_filters=context_filters,
                                         general_errors=general_errors,
                                         general_message=general_message))

    resp.set_cookie('import_tags', import_tags)
    resp.set_cookie('substitute_identifiers', str(substitute_identifiers))
    resp.set_cookie('import_type', "upload")

    return resp


#  **************************************************************
#  ****    import-dialog upload page 2: Upload
#  *****************************************************************/
@full_login_required
@fileimport.route('/dialogupload2', methods=['GET', 'POST'])
def dialogupload2():
    # just to get the csrf token
    class UploadForm2(FlaskForm):
        pass

    cfg: KioskConfig = kioskglobals.cfg
    max_file_uploads = kioskstdlib.try_get_dict_entry(cfg.file_import, "max_file_uploads", 5)
    sync = Synchronization()
    user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
    file_import = FileImport(cfg, sync, method="upload", user_config=user_config)

    uploadform2 = UploadForm2()

    general_errors = []
    return render_template(r"fileimportdialogupload2.html",
                           uploadform2=uploadform2,
                           general_errors=general_errors,
                           max_file_uploads=max_file_uploads,
                           import_tags=session["dialogupload1"]["tags"])


#  **************************************************************
#  ****    import-dialog shared page for pattern substitution
#  *****************************************************************/
@full_login_required
@fileimport.route('/identifiersubstitution', methods=['GET', 'POST'])
def identifiersubstitution():
    # just to get the csrf token
    cfg: KioskConfig = kioskglobals.cfg
    sync = Synchronization()
    user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
    # file_import = FileImport(cfg, sync, method="upload", user_config=user_config)

    if request.method == 'POST':
        is_valid = True
        identifier_substitution_form = IdentifierSubstitutionForm(request.form)
        is_valid = is_valid & identifier_substitution_form.validate()

        if is_valid:
            session["identifiersubstitutionform"] = request.form
    else:
        if 'identifiersubstitutionform' in session:
            identifier_substitution_form = IdentifierSubstitutionForm(
                ImmutableMultiDict(session["identifiersubstitutionform"]))
        else:
            identifier_substitution_form = IdentifierSubstitutionForm()

    general_errors = []
    return render_template(r"fileimportdialogidentifiersubstitution.html",
                           identifier_substitution_form=identifier_substitution_form,
                           general_errors=general_errors)


#  **************************************************************
#  ****    import-dialog - import upload images
#  *****************************************************************/
@full_login_required
@fileimport.route('/uploadimage', methods=['POST'])
def uploadimage():
    result = KioskResult(False)
    cfg: KioskConfig = kioskglobals.cfg
    try:
        file_utc_datetimes = {}
        for t in request.form:
            file_utc_datetimes[t] = datetime.datetime.fromisoformat(
                urapdatetimelib.js_to_python_utc_datetime_str(request.form[t]))

        if 'file' not in request.files:
            logging.error('repository_upload_image: No file part')
            raise Exception("file transfer failed")

        authorized_to = get_local_authorization_strings(LOCAL_FILE_IMPORT_PRIVILEGES)
        if "modify data" not in authorized_to:
            raise Exception("You are not authorized to import files.")

        f = request.files['file']
        try:
            if f.filename:
                filename = get_secure_filename(f.filename)
                sync = Synchronization()
                user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
                file_import = FileImport(cfg, sync, method="upload", user_config=user_config)
                sorted_names = file_import.sort_import_filters()
                context_filters = [file_import.get_file_import_filter(x) for x in sorted_names]
                if 'dialogupload1' in session:
                    for context_filter in context_filters:
                        context_filter.init_form(ImmutableMultiDict(session["dialogupload1"]))
                        context_filter.form_to_config()

                    upload_form1 = UploadForm1(ImmutableMultiDict(session["dialogupload1"]))
                    file_import.form_to_config(upload_form1)
                    file_import.save_user_filter_configuration()
                else:
                    raise Exception("Exception: Dialog data not complete. Please try again.")

                if upload_form1.substitute_identifiers.data and 'identifiersubstitutionform' in session:
                    if 'search_pattern' in session['identifiersubstitutionform'] and \
                            session['identifiersubstitutionform']['search_pattern']:
                        identifier_substitutions = [(session['identifiersubstitutionform']['search_pattern'],
                                                     session['identifiersubstitutionform']['replace_with'])]
                        file_import.set_identifier_substitutions(identifier_substitutions)

                dest_file = os.path.join(cfg.get_temporary_upload_path(), filename)
                # logging.debug(f"fileimportcontroller.upload_image: dest_file is {dest_file}")
                f.save(dest_file)

                # this sets the modification date of the file so that it can be used by a file import filter.
                seconds = file_utc_datetimes[f.filename].timestamp()
                os.utime(dest_file, times=(seconds, seconds))

                if kioskstdlib.file_exists(dest_file):
                    logging.info("repository_upload_image: Received file {} saved as {}".format(filename, dest_file))
                else:
                    raise Exception(f"Exception in repository_upload_image: {dest_file} could not be saved.")

                file_repos = FileRepository(cfg, sync.events, sync.type_repository, sync)
                file_import.file_repository = file_repos
                ic = MemoryIdentifierCache(kioskglobals.master_view.dsd)
                file_import.identifier_evaluator = ic.has_identifier
                file_import.modified_by = current_user.repl_user_id

                with KioskLogger(log_level=logging.WARNING) as kiosk_logger:
                    rc = file_import.import_single_file_to_repository(dest_file)

                    if rc:
                        result.success = True
                        result.message = "success"
                        if upload_form1.add_needs_context.data:
                            try:
                                kiosklib.run_quality_control()
                            except BaseException as e:
                                logging.warning(
                                    f"fileimportcontroller.localimport.worker: Error running quality control: {repr(e)}. "
                                    f"Please use Housekeeping if you want to rerun quality control rules after the import.")
                    else:
                        if kiosk_logger.has_new_errors() or kiosk_logger.has_new_warnings():
                            log = kiosk_logger.get_log()
                            last_error: str = log.pop()
                            # last_error = kiosk_logger.peek_last_error()
                            # noinspection PyBroadException
                            try:
                                result.message = ""
                                while last_error:
                                    is_err = last_error.lower().find("error") > -1
                                    is_warning = last_error.lower().find("warning") > -1
                                    if is_err or is_warning:
                                        if last_error.find(dest_file) > -1:
                                            if is_err or result.message.lower().find("error") < 0:
                                                result.message = last_error.replace(dest_file, "") + "\n" + \
                                                                 f"For more information see the log " \
                                                                 f"{kioskstdlib.get_filename(kioskglobals.current_log_file)}"
                                    last_error: str = log.pop()
                            except Exception as e:
                                pass
                            if not result.message:
                                result.message = "Unknown error. Please look at the log."
                        else:
                            result.message = "Unknown error. Please look at the log."
            else:
                result.message = "Error in repository_upload_image: no filename given with uploaded file"
                logging.error(result.message)
        except Exception as e:
            result.message = "Inner exception in repository_upload_image: " + repr(e)
            logging.error(result.message)
    except Exception as e:
        err_msg = "Outer exception in repository_upload_image: " + repr(e)
        logging.error(err_msg)
        result.message = repr(e)
    finally:
        try:

            file_max_age_days = kioskstdlib.try_get_dict_entry(cfg.kiosk, "temp_file_max_age_days", 30)
            cleaner = KioskCleanup(max_age_days=file_max_age_days)
            cleaner.add_temp_dirs(cfg)
            if not cleaner.cleanup():
                raise Exception("cleanup failed.")
        except BaseException as e:
            logging.error(f"fileimportcontroller.upload_image: {repr(e)}")

    return result.jsonify()


#  **************************************************************
#  ****    import-dialog sequence import page 1
#  *****************************************************************/
@full_login_required
@fileimport.route('/dialogsequence1', methods=['GET', 'POST'])
def dialogsequence1():
    cfg: KioskConfig = kioskglobals.cfg
    path_list = get_pathlist(cfg)
    sync = Synchronization()

    print("fileimportcontroller.dialogsequence1")

    user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
    file_import = FileSequenceImport(cfg, sync, user_config=user_config)
    # test_cfg = user_config.get_config("file_import")
    # logging.debug(f"fileimportcontroller.dialogsequence1: user config: {test_cfg}")
    general_errors = []
    image_manipulation_sets = []
    filter_cfg = []
    try:
        filter_cfg = file_import.get_filter_config("filesequence_import", "FileImportQRCodeFilter")

        image_manipulation_sets = [(strategy["id"], strategy["name"]) for strategy in
                                   ImageManipulationStrategyFactory.get_image_manipulation_set_descriptors()
                                   if strategy["id"] in filter_cfg["image_manipulation_sets"]]

    except BaseException as e:
        logging.error(f'fileimportcontroller.dialogsequence1: Error accessing image manipulation sets: {repr(e)}')
        general_errors += ["Access to file import strategies failed"]

    sort_options = [("FILE_CREATION_TIME", "file's creation time"),
                    ("FILE_NUM_PART", "numerical part of file name")]


    import_tags = ""
    if request.method == 'POST':
        sequenceform1 = SequenceImportForm1(sort_options, image_manipulation_sets, formdata=request.form)
        # sequenceform1.init_lists()
        if sequenceform1.validate():
            if len(str(sequenceform1.tags.data)) == 0:
                form_data = dict(request.form)
                form_data["tags"] = "import_" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                import_tags = form_data["tags"]
                logging.info(
                    "dialogsequence1: Files will be automatically tagged as " + import_tags)
                session["dialogsequence1"] = form_data
            else:
                session["dialogsequence1"] = request.form
                import_tags = session["dialogsequence1"]["tags"]
    else:
        if 'dialogsequence1' in session:
            sequenceform1 = SequenceImportForm1(sort_options, image_manipulation_sets,
                                                formdata=ImmutableMultiDict(session["dialogsequence1"]))
        else:
            config = file_import.get_wtform_values()
            if not kioskstdlib.try_get_dict_entry(config, "image_manipulation_set", "", True):
                config["image_manipulation_set"] = kioskstdlib.try_get_dict_entry(filter_cfg, "recognition_strategy",
                                                                                  "", True)
            sequenceform1 = SequenceImportForm1(sort_options, image_manipulation_sets,
                                                formdata=ImmutableMultiDict(config))
        try:
            if sequenceform1.mif_local_path.data is None or sequenceform1.mif_local_path.data.strip() == "":
                sequenceform1.mif_local_path.data = path_list[0]
        except BaseException as e:
            logging.debug(f"fileimportcontroller.dialogsequence1: "
                          f"Benign Xception when setting default import path: {repr(e)}")
        # sequenceform1.init_lists(sort_options, image_manipulation_sets)

    if not file_import.sort_import_filters():
        general_errors += ["There are no context filters installed. Please talk to your admin."]

    resp = make_response(render_template(r"fileimportdialogsequence1.html",
                                         sequenceimportform1=sequenceform1,
                                         general_errors=general_errors,
                                         path_list=path_list))
    resp.set_cookie('import_tags', import_tags)

    return resp


#  **************************************************************
#  ****    import-dialog local import page 3: Progress page
#  *****************************************************************/
@full_login_required
@fileimport.route('/sequenceimport', methods=['GET', "POST"])
def sequence_import():
    if request.method == 'GET':
        import_tags = session["dialogsequence1"]["tags"]
        return render_template(r"fileimportdialogsequence2.html",
                               import_tags=import_tags)
    else:
        return run_sequence_import()


#  **************************************************************
#  ****    import-dialog sequence import: Start the import
#  *****************************************************************/
def run_sequence_import():
    json_message = "unknown error"
    cfg: KioskConfig = kioskglobals.cfg

    # localimport main function
    try:
        authorized_to = get_local_authorization_strings(LOCAL_FILE_IMPORT_PRIVILEGES)
        if "modify data" not in authorized_to:
            return jsonify(result="You do not have the necessary privilege to import files.")

        sync = Synchronization()

        user_config = UserConfig(kioskglobals.general_store, current_user.user_id, cfg.get_project_id())
        test_cfg = user_config.get_config("file_import")
        logging.debug(f"fileimportcontroller.localimport: user config: {test_cfg}")
        kioskglobals.general_store.delete_key("STOPTHREAD")
        sort_options = [("FILE_CREATION_TIME", "file's creation time"),
                        ("FILE_NUM_PART", "numerical part of file name")]

        image_manipulation_sets = [(strategy["id"], strategy["name"]) for strategy in
                                   ImageManipulationStrategyFactory.get_image_manipulation_set_descriptors()]
        sequenceimportform1 = SequenceImportForm1(sort_options, image_manipulation_sets,
                                                  formdata=ImmutableMultiDict(session["dialogsequence1"]))
        file_import = FileSequenceImport(cfg, sync, user_config=user_config)
        file_import.form_to_config(sequenceimportform1)

        errors = []

        job = MCPJob(kioskglobals.general_store)
        job.set_worker("plugins.fileimportplugin.workers.filesequenceimportworker", "FileSequenceImportWorker")
        job.job_data = file_import.get_wtform_values()
        job.user_data = {"uuid": current_user.get_id()}
        job.queue()
        job_uid = job.job_id
        json_message = "ok"

    except Exception as e:
        job_uid = ""
        json_message = "Exception in FileImport/sequence_import: " + repr(e)
        logging.error(json_message)

    return jsonify(result=json_message, job_uid=job_uid)
