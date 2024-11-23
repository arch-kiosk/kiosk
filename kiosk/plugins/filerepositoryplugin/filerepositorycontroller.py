import logging
import os
from pprint import pprint

from flask import make_response, Blueprint, abort, request, render_template, jsonify, \
    send_from_directory, current_app, session, send_file, redirect, url_for
from flask_login import current_user
from flask_wtf import FlaskForm
from werkzeug.datastructures import MultiDict
from werkzeug.utils import secure_filename
from wtforms import StringField, SelectField

import kioskdatetimelib
import kioskglobals
import kiosklib
import kioskstdlib
import synchronization
from authorization import full_login_required, get_local_authorization_strings, MODIFY_DATA, DOWNLOAD_FILE
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from core.kioskcontrollerplugin import get_plugin_for_controller
from core.kioskwtforms import KioskStringField, KioskLabeledBooleanField
from dsd.dsd3singleton import Dsd3Singleton
from kioskconfig import KioskConfig
from kioskcontextualfile import KioskContextualFile
from kioskrepresentationtype import KioskRepresentationType, KioskRepresentations
from kioskresult import KioskResult
from kiosksqldb import KioskSQLDb
from plugins.filerepositoryplugin.ModelFileRepository import ModelFileRepository, FileRepositoryFile
from plugins.filerepositoryplugin.filerepositorylib import get_std_file_images
from plugins.filerepositoryplugin.forms.editform import ModalFileEditForm
from sync.core.filerepository import FileRepository

_plugin_name_ = "filerepositoryplugin"
_controller_name_ = "filerepository"
_url_prefix_ = '/' + _controller_name_
plugin_version = 2.0

MAX_IMAGES_PER_PAGE = 100

BROWSER_SUPPORTED_IMAGE_EXTENSIONS = ["jpg", "png", "bmp", "svg", "gif"]

filerepository = Blueprint(_controller_name_, __name__,
                           template_folder='templates',
                           static_folder="static",
                           url_prefix=_url_prefix_)

LOCAL_FILE_REPOSITORY_PRIVILEGES = {
    DOWNLOAD_FILE: "download file",
    MODIFY_DATA: "modify data",
}


#  refactor: try to move this not DRY method into the plugin.
@filerepository.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


def get_stdfile_for_fileext(file_extension, only_if_unsupported=False):
    plugin = get_plugin_for_controller(_plugin_name_)
    file_images = {}
    try:
        file_images = get_std_file_images(plugin)
    except Exception as e:
        logging.error("Exception calling ctl.get_std_file_images():" + repr(e))

    ext = file_extension.lower()
    if (not only_if_unsupported) or (ext not in BROWSER_SUPPORTED_IMAGE_EXTENSIONS):
        if ext in file_images:
            return file_images[ext]
        else:
            if ext not in BROWSER_SUPPORTED_IMAGE_EXTENSIONS:
                if "general" in file_images:
                    return file_images["general"]
    return None


@filerepository.route('/fetch_tile/<string:uuid>', defaults={'force_reload': 0}, methods=['POST'])
@filerepository.route('/fetch_tile/<string:uuid>/force_reload=<int:force_reload>', methods=['POST'])
@full_login_required
# @nocache
def repository_fetch_image(uuid, force_reload):
    """ This fetches a single div for a file in the file-repository, not the file itself! """
    print(f"\n*************** file_repository/fetch_tile/{uuid} with force_reload={force_reload} ")
    cfg = kioskglobals.cfg
    m_file_repos = ModelFileRepository(cfg, _plugin_name_)
    img = m_file_repos.get_image(uuid)
    return (render_template('file_repository_image.html',
                            img=img, force_reload=bool(force_reload)))


@filerepository.route('/fetch/<path:file_uuid>/<string:resolution>')
@full_login_required
def fetch_repository_file(file_uuid, resolution):
    """ This fetches the url to a file from the
        file-repository to be displayed in the browser.
        :todo needs refactoring and presumably a redesign    """
    # print(f"************* fetching {file_uuid} in resolution {resolution}")
    filename = None
    ctx_file = None
    # just to test the error handling within javascript if an image cannot be loaded:
    # if str(file_uuid) == "9a2a7f7c-5b28-4424-9227-33c21dbb4b56":
    #     logging.error("32ef2cf5-6b77-483c-b85c-f88c3de0ef6b suppressed")
    #     abort(404)
    try:
        if not kioskstdlib.check_uuid(file_uuid, accept_filemaker_too=True):
            abort(400)

        if file_uuid:
            file_repos = FileRepository(kioskglobals.cfg,
                                        event_manager=None,
                                        type_repository=kioskglobals.type_repository,
                                        plugin_loader=current_app
                                        )
            ctx_file = file_repos.get_contextual_file(file_uuid)
            if ctx_file:
                filename = ctx_file.get()

        if filename and ctx_file.file_exists():

            representation_type = KioskRepresentationType(resolution)
            thumbnail_file = ctx_file.get(representation_type)

            if thumbnail_file and kioskstdlib.get_file_size(thumbnail_file) > 0:
                response = make_response(send_from_directory(kioskstdlib.get_file_path(thumbnail_file),
                                                             kioskstdlib.get_filename(thumbnail_file)))
            else:
                # there is a main file but no thumbnail. Could be a svg.
                # todo: This needs a redesign. It is too hardcoded
                extension = kioskstdlib.get_file_extension(filename).lower()
                # if extension == "svg":
                #     response = make_response(send_from_directory(kioskstdlib.get_file_path(filename),
                #                                                  kioskstdlib.get_filename(filename)))
                # else:
                # The browser may cache the standard image placeholders as long as it wants,
                # so no add_caching_headers_to_response is necessary
                return get_standard_image_response(extension, filename)
        else:
            #  no file with that uid can be found in the repository
            return make_response(send_from_directory(current_app.static_folder, "assets/images/no_file.svg"))

        return add_caching_headers_to_response(response, etag=str(ctx_file.ts_file))

    except BaseException as e:
        logging.error(f"filerepositorycontroller.fetch_repository_file: An Exception occurred: {repr(e)}")

    try:
        return make_response(send_from_directory(current_app.static_folder, "assets/images/no_file.svg"))
    except BaseException as e:
        logging.error(f"filerepositorycontroller.fetch_repository_file: Another Exception occurred: {repr(e)}")
        abort(500)


def get_standard_image_response(extension, filename):
    std_file_image = get_stdfile_for_fileext(extension, only_if_unsupported=False)
    if std_file_image:
        response = make_response(
            send_from_directory(current_app.static_folder, "assets/images/{}".format(std_file_image)))
    else:
        # print("###### still no thumbnail file for " + filename)
        response = make_response(send_from_directory(current_app.static_folder,
                                                     "assets/images/dummyfile.svg"))
    return response


def add_caching_headers_to_response(response, timestamp=None, etag=None):
    """
    adds headers that configures the browser's caching behaviour.
    If neither ETag nor timestamp are set, the browser is ordered not to cache anything at all.
    Otherwise caching will be allowed for an hour.

    :param response: a response object
    :param timestamp: used to tell the browser when this element has been modified last.
    :param etag: a http ETag header that passes a version value along with the resource. If used, timestamp is ignored.
    :return: for convenience the response object is returned.
    """
    cache_control = "max-age=3600,must-revalidate,no-cache"
    if etag:
        # logging.debug(f"add_caching_headers_to_response: adding ETAG {etag}")
        response.headers['ETag'] = etag
    else:
        if not timestamp:
            # no etag and not timestamp = no caching at all.
            timestamp = kioskdatetimelib.get_utc_now(no_tz_info=True)
            cache_control = 'no-store,no-cache,must-revalidate,post-check=0,' \
                            'pre-check=0,max-age=0'
            # response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '-1'

        response.headers['Last-Modified'] = timestamp

    response.headers['Cache-control'] = cache_control

    return response


class FilterForm(FlaskForm):
    context = StringField(id="frf-context", label='context')
    no_context = KioskLabeledBooleanField(id="frf-no-context", label="no context")
    recording_context = SelectField(id="frf-recording-context", label='record type')
    tags = KioskStringField(id="frf-tags", label="tags")
    description = StringField(id="frf-description", label='description')
    from_date = StringField(id="frf-from-date", label='from')
    to_date = StringField(id="frf-to-date", label='to')


#  **************************************************************
#  ****    /file-repository redirecting index
#  *****************************************************************/
@filerepository.route('_redirect', methods=['GET'])
@full_login_required
def file_repository_index():
    print("------------- redirecting")
    return redirect(url_for("filerepository.file_repository_show"))


#  **************************************************************
#  ****    /file-repository index / form request
#  *****************************************************************/
@filerepository.route('', methods=['GET', 'POST'])
# @nocache
@full_login_required
def file_repository_show():
    pages = 1
    current_page = 1

    filter_form = FilterForm()

    m_file_repository = ModelFileRepository(kioskglobals.cfg, _plugin_name_)

    if "frf-resolution-select" in request.form:
        session["kiosk_fr_resolution"] = m_file_repository.get_thumbnail_types()[request.form["frf-resolution-select"]]
    if "frf-sorting" in request.form:
        session["kiosk_fr_sorting"] = request.form["frf-sorting"]
    if "frf-current-page" in request.form:
        session["kiosk_current_page"] = request.form["frf-current-page"]
    else:
        session["kiosk_current_page"] = 1

    if request.method == "POST":
        options = {"context": str(filter_form.context.data).upper(),
                   "no_context": filter_form.no_context.data,
                   "recording_context": m_file_repository.get_recording_context_from_alias(
                       filter_form.recording_context.data),
                   "description": filter_form.description.data,
                   "from_date": filter_form.from_date.data,
                   "to_date": filter_form.to_date.data,
                   "tags": filter_form.tags.data
                   }
        try:
            m_file_repository.set_filter_values(options)
        except ValueError as e:
            return jsonify(result=f"{str(e)}")

    tag_list = m_file_repository.get_tags()
    sorting_options = m_file_repository.get_sorting_options()
    # image_field_tables = ModelFileRepository.get_aliased_recording_contexts(
    #     m_file_repository.file_repos.get_file_field_tables().keys())
    image_field_tables = ModelFileRepository.get_aliased_recording_contexts()
    filter_form.recording_context.choices = [("", "")]
    filter_form.recording_context.choices.extend([(t, t) for t in image_field_tables])
    if "kiosk_fr_resolution" not in session:
        session["kiosk_fr_resolution"] = list(m_file_repository.get_thumbnail_types().values())[0]
    if "kiosk_fr_sorting" not in session:
        session["kiosk_fr_sorting"] = sorting_options[0]

    image_resolutions = m_file_repository.get_thumbnail_types()

    if "ajax" in request.form:
        if not options["no_context"] and options["context"]:
            identifier = options["context"]
            try:
                logging.debug(f"filerepositorycontroller.file_repository_show: Before MemoryIdentifierCache ")
                # cache = MemoryIdentifierCache(kioskglobals.master_view.dsd)
                cache = kioskglobals.identifier_cache
                logging.debug(f"filerepositorycontroller.file_repository_show: After MemoryIdentifierCache ")
                if not cache.has_identifier(identifier):
                    return jsonify(result=f"The identifier {identifier} is unknown.")
            except BaseException as e:
                logging.error(f"filerepositorycontroller.file_repository_show: {repr(e)}")
                return jsonify(result=repr(e))

        logging.debug(f"filerepositorycontroller.file_repository_show: Before query_image_count ")
        c = m_file_repository.query_image_count()
        logging.debug(f"filerepositorycontroller.file_repository_show: After query_image_count ")
        return jsonify(result=c)
    else:

        img_list = None
        authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
        if request.method == "POST":
            m_file_repository.sorting_option = session["kiosk_fr_sorting"]
            img_list = m_file_repository.query_images()
            # if len(img_list) > MAX_IMAGES_PER_PAGE:
            #     img_list = None
            pages, rest = divmod(len(img_list), MAX_IMAGES_PER_PAGE)
            logging.debug(f"filerepositorycontroller.file_repository_show: "
                          f"divmod returned {pages},{rest}")
            pages = pages + 1 if rest else pages
            current_page = int(session["kiosk_current_page"])
            if current_page > pages:
                current_page = 1
                session["kiosk_current_page"] = 1

            img_list = img_list[((current_page - 1) * MAX_IMAGES_PER_PAGE):current_page * MAX_IMAGES_PER_PAGE]
            logging.debug(f"filerepositorycontroller.file_repository_show: "
                          f"showing images {(current_page - 1) * MAX_IMAGES_PER_PAGE}:{current_page * MAX_IMAGES_PER_PAGE}"
                          f" = {len(img_list)}")

        return render_template('file_repository.html',
                               filter_form=filter_form,
                               image_list=img_list,
                               image_resolutions=image_resolutions,
                               sorting_options=sorting_options,
                               tag_list=tag_list,
                               max_images_per_page=MAX_IMAGES_PER_PAGE,
                               pages=pages,
                               current_page=current_page,
                               sorting_option=session["kiosk_fr_sorting"],
                               authorized_to=authorized_to)


#  **************************************************************
#  ****    edit image dialog
#  *****************************************************************/

@filerepository.route('/editdialog/<uid>', methods=['GET', 'POST'])
@full_login_required
def filerepository_editdialog(uid):
    # todo: refactor. This is too long.

    cfg = kioskglobals.cfg
    m_file_repos = ModelFileRepository(cfg, _plugin_name_)
    file_repos = FileRepository(kioskglobals.cfg,
                                event_manager=None,
                                type_repository=kioskglobals.type_repository,
                                plugin_loader=current_app
                                )

    img = m_file_repos.get_image(uid)
    # reference_tables = [x[0] for x in file_repos.get_actual_file_references(uid)]
    # reference_tables_str = ", ".join(reference_tables)
    # image_field_tables = file_repos.get_file_field_tables()
    recorded_description = img.get_description_summary(include_image_description=False)

    file_extension = "?"
    file_size = "?"
    try:
        ctx_file = file_repos.get_contextual_file(uid)
        if ctx_file:
            file_name = ctx_file.get()
            file_extension = kioskstdlib.get_file_extension(file_name)
            byte_size = kioskstdlib.get_file_size(file_name)
            file_size = kioskstdlib.byte_size_to_string(byte_size) if byte_size > 0 else "?"
    except BaseException as e:
        logging.error(f"filerepositorycontroller.filerepository_editdialog: "
                      f"Error when accessing file size of {file_name}: {repr(e)}. Byte_size is {byte_size}.")

    if request.method == "GET":
        print("\n*************** Edit file dialog for image {} requested".format(uid))
        ef_form = ModalFileEditForm(file_repos)
        # ef_form.ef_recording_context.choices = [("", "")]
        # ef_form.ef_recording_context.choices.extend([(t, t) for t in image_field_tables])

        ef_form.ef_description.data = img.get_value("description")
        ef_form.ef_file_datetime.data = kioskstdlib.latin_date(img.get_value("file_datetime"))
        ef_form.ef_tags.data = img.get_value("tags")
        ef_form.ef_export_filename.data = img.get_value("export_filename")

        modified_utc = kioskstdlib.latin_date(img.get_value("modified"))
        modified_tz = kioskglobals.kiosk_time_zones.get_long_time_zone(img.get_value("modified_tz"))
        modified_ww = img.get_value("modified_ww")
        modified_ww = kioskstdlib.latin_date(modified_ww) if modified_ww else modified_utc
        created_latin = kioskstdlib.latin_date(img.get_value("created"))

        authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
        read_only = request.args.get('read_only')
        if read_only:
            try:
                authorized_to.remove("modify data")
            except BaseException as e:
                pass

        representations = KioskRepresentations.get_representation_labels_and_ids(cfg)
        fullscreen_representation_id = cfg.file_repository["fullscreen_representation"]
        print("\n*************** now rendering".format(uid))
        print(f"[{img.get_indirect_contexts()}]")
        return render_template('editfiledialog.html',
                               title="edit file" if "modify data" in authorized_to else "view file",
                               img=img, ef_form=ef_form,
                               authorized_to=authorized_to,
                               contexts=img.get_arch_identifier(),
                               fullscreen_representation_id=fullscreen_representation_id,
                               recorded_description=recorded_description,
                               file_extension=file_extension,
                               file_size=file_size,
                               representations=representations,
                               created_latin=created_latin,
                               modified_tz=modified_tz,
                               modified_utc=modified_utc if \
                                   kioskglobals.get_development_option("test_time_zone_support") else None,
                               modified_ww=modified_ww,
                               )

    elif request.method == "POST":
        print("\n*************** Edit file dialog for image {} sent".format(uid))
        # if the image record is connected to recording data not all form fields are present
        # so they need to be initialized with the current data before saving the image again.
        authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
        if "modify data" not in authorized_to:
            return jsonify(result="exception",
                           msg="you do not have the necessary privileges to modify images and their data.")

        form_data = MultiDict(request.form)
        if "ef_file_datetime" not in form_data.keys():
            form_data["ef_file_datetime"] = kioskstdlib.latin_date(img.get_value("file_datetime"))

        ef_form = ModalFileEditForm(file_repos, formdata=form_data)

        if not ef_form.validate():
            return jsonify(result=ef_form.errors)
        else:
            errors = validate_identifiers(img, form_data)
            if form_data["ef_export_filename"]:
                uid_file = file_repos.export_filename_exists(form_data["ef_export_filename"])
                if uid_file and uid != uid_file:
                    errors["ef_export_filename"] = ["This filename is already in use by another file."]
            if errors:
                return jsonify(result=errors)

            rc = False
            try:
                recording_user = current_user.repl_user_id if current_user.repl_user_id else current_user.user_id
                file_datetime, msg = kioskstdlib.check_urap_date_time(ef_form.ef_file_datetime.data, True)

                do_update = -1
                if img.get_value("description") != ef_form.ef_description.data:
                    do_update = int(img.set_value("description", ef_form.ef_description.data))
                img_file_datetime = img.get_value("file_datetime")
                if do_update != 0 and img_file_datetime != file_datetime:
                    if img_file_datetime or file_datetime:  # they can have different kinds false values
                        do_update = int(img.set_value("file_datetime", file_datetime))
                if do_update != 0:
                    if img.get_value("tags") != ef_form.ef_tags.data:
                        do_update = int(img.set_value("tags", ef_form.ef_tags.data))
                    if img.get_value("export_filename") != ef_form.ef_export_filename.data:
                        do_update = int(img.set_value("export_filename", ef_form.ef_export_filename.data))

                if do_update == 1:
                    logging.info(f"User {current_user.repl_user_id} modified image record {img.r['uid']}")
                    rc = img.update(recording_user, current_user.get_active_tz_index())
                elif do_update == -1:
                    rc = True
                else:
                    rc = False

                if rc:
                    err_str = update_contexts(img, file_repos, form_data)
                    if err_str:
                        return jsonify(result={"ef-context-list": [err_str]})
                else:
                    raise Exception("file data or context changes could not be saved.")
            except Exception as e:
                logging.error("Exception in repository_edit_dialog: " + repr(e))
                return jsonify(result="exception", msg=repr(e))

            return jsonify(result="ok")


def validate_identifiers(img: FileRepositoryFile, form_data: dict) -> dict:
    x: str
    try:
        errors = {}
        fic = MemoryIdentifierCache(dsd=kioskglobals.master_view.dsd)
        contexts = [form_data[x] for x in form_data.keys()]
        for field in form_data.keys():
            if field.startswith("new-context-"):
                context = form_data[field]
                if not fic.has_identifier(context):
                    errors[field] = [f"The context {context} is unknown."]
                else:
                    if context.upper() in img.get_arch_identifier().split(", "):
                        errors[field] = [f"Context already assigned"]
    except BaseException as e:
        logging.error(f"filerepositorycontroller.validate_identifiers : {repr(e)}")
        errors = {"ef-context-list": ['Validation error: ' + repr(e)]}

    return errors


def update_contexts(img: FileRepositoryFile, file_repos: FileRepository, form_data: dict) -> str:
    ctx: KioskContextualFile = file_repos.get_contextual_file(img.uid)
    contexts = [form_data[x] for x in form_data.keys() if x.startswith("new-context-")]
    dropped = 0
    added = 0
    for context in contexts:
        ctx.contexts.add_context(context)
        added += 1

    for x in form_data.keys():
        if x.startswith("drop-context-"):
            context = x.replace("drop-context-", "")
            record_type = form_data[x]
            try:
                ctx.contexts.drop_context(context, ModelFileRepository.get_recording_context_from_alias(record_type))
            except BaseException as e:
                logging.error(f"filerepositorycontroller.update_contexts: cannot drop context: {repr(e)}")
                return f"error dropping context {context} from {record_type}: " + repr(e)
            dropped += 1

    if added or dropped:
        # time zone relevant
        utc_ts, tz_index, ww_ts = kioskglobals.kiosk_time_zones.get_modified_components_from_now(
            current_user.get_active_tz_index())
        ctx.set_modified(utc_ts, tz_index, ww_ts)
        ctx.modified_by = current_user.repl_user_id
        if not ctx.push_contexts(True):
            return f"error pushing contexts: {ctx.last_error}"
    return ""


@filerepository.route('/delete/<uid>/<string:force>', methods=['POST'])
@full_login_required
def repository_delete_file(uid, force):
    """
    deletes a file from the repository. Checks first if there are references and if so the user
    will be asked first. Only of force is True those references will be removed as well.

    :param uid:
    :param force:
    :return:
    """
    if force == "true":
        force = True
    else:
        force = False

    print("\n*************** Request to delete file %s sent with force set to %s" % (uid, force))
    authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
    if "modify data" not in authorized_to:
        logging.warning(f"Unauthorized attempt to delete image {uid} by user {current_user.user_id}")
        return jsonify(result="you do not have the necessary privileges to delete images.")

    file_repos = FileRepository(kioskglobals.cfg,
                                event_manager=None,
                                type_repository=kioskglobals.type_repository,
                                plugin_loader=current_app
                                )
    rc = file_repos.delete_file_from_repository(uid, clear_referencing_records=force, commit=True)
    if rc is True or (rc == -1 and force):
        try:
            # todo: This is too coarse. The qc processing should be limited to the
            #       actual contexts and triggers necessary. But the required uuid of the contect's identifier
            #       is not easily available here. And qc is currently just triggering rtl, anyhow.
            #       see #1160
            kiosklib.run_quality_control()
            logging.debug(f"filerepositorycontroller.repository_delete_file: QC ran for deleted file {uid}.")
        except BaseException as e:
            logging.debug(f"filerepositorycontroller.repository_delete_file: Exception when running QC "
                          f"ran for deleted file {uid}: {repr(e)}")

        return jsonify(result="ok")
    else:
        if rc == -1:
            reference_tables = ", ".join([x[0] for x in file_repos.get_actual_file_references(uid)])
            return jsonify(result=f"Sorry, the file is still referenced in the recording system ({reference_tables})."
                                  f"<br><br>So I have to ask again. Do you still want to delete it?",
                           ask_for_force=True)
        else:
            return jsonify(result="Sorry, some error prevented the deletion of the file."
                                  " Consult the log for details.")


@filerepository.route('/bulkdelete', methods=['POST'])
@full_login_required
def repository_bulk_delete_files():
    """
    deletes a list of files from the repository. References will be removed as well.

    :return:
    """

    print("\n*************** Request to delete files *************************++")
    files = request.json["files"]
    print(f"\n*************** {len(files)} about to be deleted *************************++")
    logging.info(f"filerepositorycontroller.repository_bulk_delete_files: request to delete {len(files)} files.")

    authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
    if "modify data" not in authorized_to:
        logging.warning(f"Unauthorized attempt to delete files by user {current_user.user_id}")
        return jsonify(result="you do not have the privilege to delete images.")

    file_repos = FileRepository(kioskglobals.cfg,
                                event_manager=None,
                                type_repository=kioskglobals.type_repository,
                                plugin_loader=current_app
                                )

    try:
        deleted_files = []
        for uid in files:
            if file_repos.delete_file_from_repository(uid, clear_referencing_records=True, commit=True) == True:
                deleted_files.append(uid)
            else:
                logging.info(f"filerepositorycontroller.repository_bulk_delete_files: File {uid} was not deleted.")
        try:
            kiosklib.run_quality_control()
            logging.debug(f"filerepositorycontroller.repository_bulk_delete_files: QC ran.")
        except BaseException as e:
            logging.debug(f"filerepositorycontroller.repository_bulk_delete_files: Exception when running QC "
                          f": {repr(e)}")
        return jsonify(result="ok", deleted_files=deleted_files)
    except BaseException as e:
        logging.error(f"filerepositorycontroller.repository_bulk_delete_files: {repr(e)}")
        return jsonify(result=f"Sorry, some error prevented the deletion of the file."
                              f" Consult the log for details. The error was {repr(e)}")


@filerepository.route('/bulktag', methods=['POST'])
@full_login_required
def repository_bulk_tag_files():
    """
    asks for a dialog to tag a list of files

    :return:
    """

    print("\n*************** Request to tag files *************************++")
    if hasattr(request, 'json') and request.json and 'files' in request.json:
        files = request.json["files"]
    else:
        files = []

    print(f"\n*************** {len(files)} about to be in the bulk tag dialog *************************++")
    logging.info(f"filerepositorycontroller.repository_bulk_tag_files: request to tag {len(files)} files.")

    authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
    if "modify data" not in authorized_to:
        logging.warning(f"Unauthorized attempt to delete files by user {current_user.user_id}")
        return jsonify(result="you do not have the privilege to delete images.")

    false_tags = []
    true_tags = []
    undefined_tags = []

    file_repos = FileRepository(kioskglobals.cfg,
                                event_manager=None,
                                type_repository=kioskglobals.type_repository,
                                plugin_loader=current_app
                                )
    m_file_repository = ModelFileRepository(kioskglobals.cfg, _plugin_name_)

    tag_ids = m_file_repository.get_tags()
    tags = {}
    for t in tag_ids:
        tags[t] = 0

    images_and_tags = m_file_repository.get_image_tags(files)
    for img_tags in images_and_tags.values():
        for t in img_tags:
            try:
                tags[t] += 1
            except BaseException as e:
                print(t)

    for t in tags.keys():
        if tags[t] > 0:
            if tags[t] == len(files):
                true_tags.append(t)
            else:
                undefined_tags.append(t)
        else:
            false_tags.append(t)

    return render_template('bulktagdialog.html', false_tags=false_tags, true_tags=true_tags,
                           undefined_tags=undefined_tags)
    # try:
    # except BaseException as e:
    #     logging.error(f"filerepositorycontroller.repository_bulk_delete_files: {repr(e)}")
    #     return jsonify(result=f"Sorry, some error prevented the deletion of the file."
    #                           f" Consult the log for details. The error was {repr(e)}")


@filerepository.route('/bulktag/execute', methods=['POST'])
@full_login_required
def repository_bulk_tag_execute():
    """
    applies tag changes to a list of files

    :return:
    """

    result = KioskResult()
    try:
        print("\n*************** Request to tag files *************************++")
        if hasattr(request, 'json') and request.json and 'files' in request.json:
            files = request.json["files"]
        else:
            files = []

        if hasattr(request, 'json') and request.json and 'tag_changes' in request.json:
            try:
                tag_changes = request.json["tag_changes"]
            except BaseException as e:
                pprint(request.json["tag_changes"])
                raise e
        else:
            tag_changes = {}

        if hasattr(request, 'json') and request.json and 'new_tags' in request.json:
            try:
                s: str = request.json["new_tags"].strip()
                if s:
                    new_tags = request.json["new_tags"].split(",")
                    for t in new_tags:
                        tag_changes[t.strip()] = "tag"

            except BaseException as e:
                pprint(request.json["tag_changes"])
                raise e
        else:
            tag_changes = {}

        print(
            f"\n*************** {len(tag_changes.keys())} changes about to be applied to {len(files)} files  ********")
        logging.info(
            f"filerepositorycontroller.repository_bulk_tag_execute: {len(tag_changes.keys())} changes "
            f"about to be applied to {len(files)} files")

        authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
        if "modify data" not in authorized_to:
            logging.warning(f"Unauthorized attempt to delete files by user {current_user.user_id}")
            return jsonify(result="you do not have the privilege to delete images.")

        file_repos = FileRepository(kioskglobals.cfg,
                                    event_manager=None,
                                    type_repository=kioskglobals.type_repository,
                                    plugin_loader=current_app
                                    )
        try:
            for file_uid in files:
                f = file_repos.get_contextual_file(file_uid)
                update = False
                for tag in tag_changes:
                    if tag_changes[tag] == 'tag':
                        if not f.has_tag(tag):
                            f.add_tag(tag)
                            update = True
                    elif tag_changes[tag] == 'untag' and f.has_tag(tag):
                        f.drop_tag(tag)
                        update = True
                if update:
                    # time zone relevant
                    utc_ts, tz_index, ww_ts = kioskglobals.kiosk_time_zones.get_modified_components_from_now(
                        current_user.get_active_tz_index())

                    f.set_modified(
                        utc_ts,
                        tz_index,
                        ww_ts
                    )
                    f.update(commit=False)
            KioskSQLDb.commit()
            result.success = True
        except BaseException as e:
            logging.error(
                f"filerepositorycontroller.repository_bulk_tag_execute: Exception when applying tags: {repr(e)}")
            result.message = f"Exception when applying tags: {repr(e)}"
            try:
                KioskSQLDb.rollback()
            except:
                pass
    except BaseException as e:
        logging.error(f"filerepositorycontroller.repository_bulk_tag_execute: Error in preparation: {repr(e)}")
        result.message = f"Exception when preparing bulk operation: {repr(e)}"

    return result.jsonify()


# @filerepository.route('/bulklink', methods=['POST'])
# @full_login_required
# def repository_bulk_link_files():
#     """
#     asks for a dialog to tag a list of files
#
#     :return:
#     """
#
#     print("\n*************** Request to link files  in bulk *************************++")
#     if hasattr(request, 'json') and request.json and 'files' in request.json:
#         files = request.json["files"]
#     else:
#         files = []
#
#     print(f"\n*************** {len(files)} about to be linked with the bulk link dialog *************************++")
#     logging.info(f"filerepositorycontroller.repository_bulk_link_files: request to link {len(files)} files.")
#
#     authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
#     if "modify data" not in authorized_to:
#         logging.warning(f"Unauthorized attempt to link files by user {current_user.user_id}")
#         return jsonify(result="you do not have the privilege to modify any data.")
#
#     false_tags = []
#     true_tags = []
#     undefined_tags = []
#
#     # noinspection PyTypeChecker
#     file_repos = FileRepository(kioskglobals.cfg,
#                                 event_manager=None,
#                                 type_repository=kioskglobals.type_repository,
#                                 plugin_loader=current_app
#                                 )
#
#     m_file_repository = ModelFileRepository(kioskglobals.cfg, _plugin_name_)
#
#     return render_template('bulklinkdialog.html', file_repository=m_file_repository)

@filerepository.route('/bulklink/execute', methods=['POST'])
@full_login_required
def repository_bulk_link_execute():
    """
    adds links between archaeological identifiers and selected images

    :return:
    """

    result = KioskResult()
    result.set_data('updated', [])
    try:
        if hasattr(request, 'json') and request.json and 'files' in request.json:
            files = request.json["files"]
        else:
            files = []

        identifier = ""
        if hasattr(request, 'json') and request.json and 'context_info' in request.json:
            context_info = request.json["context_info"]
            identifier = context_info["identifier"]
        else:
            context_info = {}

        authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
        if "modify data" not in authorized_to:
            logging.warning(f"Unauthorized attempt to modify data by user {current_user.user_id}")
            return jsonify(result="you do not have the privilege to modify data.")

        if not context_info or not identifier:
            return jsonify(result="Wrong arguments")


        print(f"\n*************** Request to link {len(files)} files to identifier {context_info['identifier']} ****************++")

        logging.info(
            f"filerepositorycontroller.repository_bulk_link_execute: {len(files)} about to be "
            f"linked to {context_info['identifier']}.")


        file_repos = FileRepository(kioskglobals.cfg,
                                    event_manager=None,
                                    type_repository=kioskglobals.type_repository,
                                    plugin_loader=current_app
                                    )

        dsd = Dsd3Singleton.get_dsd3()
        idc = MemoryIdentifierCache(dsd)

        if not idc.has_identifier(identifier):
            raise Exception(f"The identifier '{identifier}' is unknown")

        record_types = [x[0] for x in idc.get_recording_contexts(identifier)]

        # remove all identifiers that do not have a default file location.
        default_location = None
        for rt in list(record_types):
            default_location = dsd.get_default_file_location_for(rt)
            if default_location:
                break

        if not default_location:
            raise Exception(f"Files cannot be linked automatically to identifier '{identifier}'. "
                            f"Kiosk would ont know where to put them (missing default record type for "
                            f"{context_info['record_type']}).")
        else:
            default_location = default_location[0]
        try:

            c_added = 0
            c_error = 0
            updated = {}
            for file_uid in files:
                f = file_repos.get_contextual_file(file_uid)
                contexts = f.contexts.get_contexts()
                if (identifier, default_location) not in contexts:
                    try:
                        f.contexts.add_context(identifier, context_info["record_type"])
                        f.push_contexts(commit_on_change=False, idc=idc)
                        updated[file_uid] = ", ".join([x[0] for x in f.contexts.get_contexts()])
                        logging.debug(f"filerepositorycontroller._repository_bulk_link_execute: "
                                          f"Linked file {file_uid} "
                                          f"to context {identifier}")
                        c_added += 1
                    except BaseException as e:
                        c_error += 1
                        if c_error < 10:
                            logging.error(f"filerepositorycontroller._repository_bulk_link_execute: "
                                          f"Error linking file {file_uid} "
                                          f"to context {identifier}{repr(e)}")

            result.set_data('updated', updated)
            if c_added > 0:
                KioskSQLDb.commit()
                result.success = True
                if c_error > 0:
                    result.message = (f"Only {c_added} files could be linked to identifier "
                                      f"{identifier}. \n"
                                      f"{c_error} files could not be linked because of errors. "
                                      f"Please look at the logs for details or ask your admin.")
                else:
                    result.message = (f"{c_added} files got successfully linked "
                                      f"to identifier {identifier}.")
            else:
                if c_error > 0:
                    result.success = False
                    result.message = (f"No file could be linked to identifier {identifier} "
                                      f"because errors occurred with all of them. Please look at the logs "
                                      f"for details or ask your admin.")
                else:
                    result.success = False
                    result.message = (f"No file could be linked to identifier {identifier} "
                                      f"presumably because they were all already linked to that identifier. ")

        except BaseException as e:
            logging.error(
                f"filerepositorycontroller.repository_bulk_link_execute: Exception when linking files: {repr(e)}")
            result.message = f"Exception when linking files: {repr(e)}"
            try:
                KioskSQLDb.rollback()
            except:
                pass
    except BaseException as e:
        logging.error(f"filerepositorycontroller.repository_bulk_link_execute: Error in preparation: {repr(e)}")
        result.message = f"Exception when preparing bulk operation: {repr(e)}."

    return result.jsonify()

@filerepository.route('/replace/<string:uuid>', methods=['POST'])
@full_login_required
def repository_replace_file(uuid):
    """
    replaces a file in the file repository with an uploaded file.
    :param uuid:
    :return: json

    """
    print(f"\n*************** Request to replace file {uuid} sent. ")
    logging.info(f"\n*************** Request to replace file {uuid} sent. ")
    cfg: KioskConfig = kioskglobals.cfg

    authorized_to = get_local_authorization_strings(LOCAL_FILE_REPOSITORY_PRIVILEGES)
    if "modify data" not in authorized_to:
        logging.warning(f"Unauthorized attempt to delete image {uuid} by user {current_user.user_id}")
        return jsonify(result="you do not have the necessary privileges to replace images.")

    if not current_user.repl_user_id:
        return jsonify(result=f"No recording user id assigned to {current_user.user_id}. Please ask your admin"
                              f"to assign one.")

    temp_file_path_and_name = None
    f = request.files['file']
    sec_filename = ""
    try:
        if f.filename:
            if f.filename:
                sec_filename = secure_filename(f.filename)
                temp_file_path_and_name = os.path.join(cfg.get_temporary_upload_path(), sec_filename)
                f.save(temp_file_path_and_name)
                if kioskstdlib.file_exists(temp_file_path_and_name):
                    logging.debug(f"filerepository.repository_replace_file: Received file {sec_filename} "
                                  f"temporarily saved as {temp_file_path_and_name}")
                else:
                    logging.error(f"filerepository.repository_replace_file: Received file {sec_filename} "
                                  f"COULD NOT BE temporarily saved as {temp_file_path_and_name}")
    except Exception as e:
        logging.error(f"filerepository.repository_replace_file: Received file {sec_filename} "
                      f"COULD NOT BE temporarily saved as {temp_file_path_and_name} because of Exception: "
                      f"{repr(e)}")

    if temp_file_path_and_name:
        sync = synchronization.Synchronization()
        file_repos = FileRepository(kioskglobals.cfg,
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync
                                    )
        try:
            rc, msg = file_repos.replace_file_in_repository(uuid, file_path_and_name=temp_file_path_and_name,
                                                            recording_user=current_user.repl_user_id,
                                                            tz_index=current_user.get_active_tz_index())
            if rc:
                logging.debug(f"filerepository.repository_replace_file: Received file {sec_filename} "
                              f"replaced old one as {rc} in the file repository")
                return jsonify(result="ok")
            else:
                if msg == "Duplicate":
                    return jsonify(result=f"file could not be replaced because the file to replace it with is already "
                                          f"in the file repository. Duplicates are not allowed.")
                else:
                    return jsonify(result=f"file could not be replaced ({msg}). Please ask your admin.")
        except Exception as e:
            logging.error(f"filerepository.repository_replace_file: Received file {sec_filename} "
                          f"caused error {repr(e)}.")
            return jsonify(result=f"Sorry, some error prevented replacing the file: "
                                  f"{repr(e)} Consult the log for details.")
    else:
        jsonify(result="Unexpected internal server error when saving the file. Check the logs.")


#  **************************************************************
#  ****    DOWNLOAD
#  *****************************************************************/
@filerepository.route('/download/<img>/<cmd>', methods=['GET'])
@full_login_required
# @nocache
def file_repository_download_file(img, cmd):
    """
    :param img: either just a uuid, in which case the raw file is requested or uuid:resolution to get a thumbnail
    :param cmd: start / response
    :return:
    """
    print("\n*************** Request to download file %s (command is %s)" % (img, cmd), flush=True)
    logging.debug(f"/download {img}: {cmd}")
    if cmd == "start":
        logging.info(f"file_repository_download_file: request to download {img}")
    else:
        logging.info("Download of file " + img + " successfully initiated -> response requested.")

    try:
        sync = synchronization.Synchronization()
        file_repos = FileRepository(kioskglobals.cfg,
                                    event_manager=None,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync
                                    )
        img_args = img.split(":")
        uuid = img_args[0]
        representation = ""
        try:
            representation = img_args[1]
        except:
            pass
        ctx_file = file_repos.get_contextual_file(uuid)
        if ctx_file:

            if representation:
                # representation_type = KioskRepresentationType(representation)
                representation_type = KioskRepresentations.instantiate_representation_from_config(representation)
                filename = ctx_file.get(representation_type, create=True)
                if not filename:
                    raise Exception(f"No representation '{representation}' for file '{uuid}'")
                dest_filename = ctx_file.get_descriptive_filename(
                    file_extension=kioskstdlib.get_file_extension(filename))
            else:
                filename = ctx_file.get()
                dest_filename = ctx_file.get_descriptive_filename()

            # a super dirty quick hack to figure out the correct mimetype:
            dest_extension = kioskstdlib.get_file_extension(dest_filename).lower()
            if dest_extension == 'pdf':
                mime_type = 'application/pdf'
            elif dest_extension == 'zip':
                mime_type = 'application/zip'
            elif 'xls' in dest_extension:
                mime_type = 'application/vnd.ms-excel'
            else:
                mime_type = 'application/octet-stream'

            if cmd == "response":
                return jsonify(result="ok")

            resp = make_response(send_file(filename,
                                           mimetype=mime_type,
                                           download_name=dest_filename,
                                           as_attachment=True,
                                           etag=str(kioskdatetimelib.get_utc_now(no_tz_info=True).timestamp())))
            resp.set_cookie('fileDownload', 'true')
            resp.headers['Last-Modified'] = str(kioskdatetimelib.get_utc_now(no_tz_info=True).timestamp())
            resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, ' \
                                            'pre-check=0, max-age=0'
            resp.headers['Pragma'] = 'no-cache'
            resp.headers['Expires'] = '-1'
            logging.info("Starting download of file " + filename)
            return resp
        else:
            raise Exception(f'File {img} not found.')
    except BaseException as e:
        # if cmd == "response":
        return jsonify(result=f"filerepositorycontroller.file_repository_download_file: {repr(e)}")
