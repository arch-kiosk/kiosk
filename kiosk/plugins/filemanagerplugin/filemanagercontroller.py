import datetime
import logging
import os
from collections import namedtuple
from http import HTTPStatus

from flask import Blueprint, redirect, render_template, url_for, request, session, abort, make_response, send_file, \
    jsonify
from flask_allows import requires
from flask_login import current_user

import kioskdatetimelib
import kioskglobals
import kioskstdlib
from authorization import ENTER_ADMINISTRATION_PRIVILEGE, MANAGE_SERVER_PRIVILEGE, \
    IsAuthorized, is_authorized, get_local_authorization_strings
from authorization import full_login_required
from core.kioskcontrollerplugin import get_plugin_for_controller
from kiosklib import is_ajax_request
from kioskresult import KioskResult
from plugins.filemanagerplugin.filemanagerdirectory import FileManagerDirectory
from plugins.kioskfilemakerworkstationplugin.kioskfilemakerworkstationcontroller import check_ajax

_plugin_name_ = "filemanagerplugin"
_controller_name_ = "filemanager"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.1

LOCAL_PRIVILEGES = {
    ENTER_ADMINISTRATION_PRIVILEGE: "enter administration",
    MANAGE_SERVER_PRIVILEGE: "manage server",
}

filemanager = Blueprint(_controller_name_, __name__,
                        template_folder='templates',
                        static_folder="static",
                        url_prefix=_url_prefix_)
print(f"{_controller_name_} module loaded")

filemanager_controller = Blueprint(_controller_name_, __name__)
print(f"{_controller_name_} loaded")


@filemanager.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


def get_plugin_config():
    return kioskglobals.cfg.get_plugin_config(_plugin_name_)


#  **************************************************************
#  ****    redirecting index
#  *****************************************************************/

@filemanager.route('_redirect', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
def filemanager_index():
    print("------------- redirecting")
    return redirect(url_for("filemanager.filemanager_show"))


#  **************************************************************
#  ****    /filemanager index
#  *****************************************************************/

@filemanager.route('', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def filemanager_show():
    conf = kioskglobals.cfg
    print("\n*************** filemanager/ ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
    directories = FileManagerDirectory().list_directories()
    return render_template('filemanager.html',
                           authorized_to=authorized_to,
                           directories=directories
                           )


#  **************************************************************
#  ****    /filemanager/<topic>
#  *****************************************************************/

@filemanager.route('/<string:topic>', methods=['GET', 'POST'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def filemanager_topic(topic: str):
    class Header:
        def __init__(self, caption, sort, extra_caption=""):
            self.caption = caption
            self.extra_caption = extra_caption
            self.sort = sort

    conf = kioskglobals.cfg
    print(f"\n*************** filemanager/{topic} ")
    cfg = get_plugin_config()
    max_upload_size_mb = int(kioskstdlib.try_get_dict_entry(cfg, "max_upload_size_mb", "10"))

    if request.method == 'GET':
        sort_by = 'filename'
        sort_order = 'asc'
    else:
        sort_by = request.form["sort-by"]
        sort_order = request.form["sort-order"]

    authorized_to = get_local_authorization_strings(LOCAL_PRIVILEGES)
    full_topic = topic
    sub_dir, topic = split_topic(topic)

    directory = FileManagerDirectory()
    directory.get(topic, sub_dir=sub_dir)
    if not directory.path:
        abort(HTTPStatus.BAD_REQUEST)

    if directory.privilege_read and not is_authorized(directory.privilege_read):
        abort(HTTPStatus.UNAUTHORIZED)

    modify_privilege = (not directory.privilege_modify) or is_authorized(directory.privilege_modify)

    files = directory.list_files(sort_by, sort_order)
    headers = [Header('actions', ''),
               Header('filename', ''),
               Header('date', ''),
               Header('size', '', ' (kbytes)')
               ]
    for header in headers:
        if header.caption == sort_by:
            header.sort = "fa-sort-up" if sort_order == "asc" else "fa-sort-down"
    back_url = request.cookies.get('kiosk_fm_back_url', default="")
    if back_url:
        headline = request.cookies.get('kiosk_fm_back_name', default="")
    else:
        back_url = 'filemanager.filemanager_show'
        headline = topic

    return render_template('filemanager_topic.html',
                           authorized_to=authorized_to,
                           topic=full_topic,
                           back_url=back_url,
                           headline=headline,
                           files=files,
                           headers=headers,
                           sort_by=sort_by,
                           sort_order=sort_order,
                           modify_privilege=modify_privilege,
                           max_upload_size_mb=max_upload_size_mb)


def split_topic(topic):
    _ = topic.split("$$")
    topic = _[0]
    if len(_) > 1:
        sub_dir = _[1]
    else:
        sub_dir = ""
    return sub_dir, topic


#  **************************************************************
#  ****    /filemanager/download/<string:file>
#  *****************************************************************/

@filemanager.route('/download/<string:topic>/<string:file>', methods=['GET'])
@full_login_required
@requires(IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE))
# @nocache
def filemanager_download(topic: str, file: str):
    print(f"\n*************** filemanager/download/{topic}/{file} ")
    logging.info(f"filemanagercontroller.download: fetching file {topic}/{file}")

    directory = FileManagerDirectory()
    sub_dir, topic = split_topic(topic)
    directory.get(topic, sub_dir=sub_dir)

    if directory.privilege_read and not is_authorized(directory.privilege_read):
        abort(HTTPStatus.UNAUTHORIZED)

    files = directory.list_files()

    download_file = ""
    for f in files:
        if f.filename == file:
            download_file = os.path.join(directory.physical_directory, f.filename)

    if download_file:
        # a super dirty quick hack to figure out the correct mimetype:
        dest_extension = kioskstdlib.get_file_extension(download_file).lower()
        if dest_extension == 'pdf':
            mime_type = 'application/pdf'
        elif dest_extension == 'zip':
            mime_type = 'application/zip'
        elif 'xls' in dest_extension:
            mime_type = 'application/vnd.ms-excel'
        else:
            mime_type = 'text/plain'

        resp = make_response(send_file(download_file,
                                       mimetype=mime_type,
                                       download_name=file,
                                       as_attachment=True,
                                       etag=str(datetime.datetime.now().timestamp())))
        resp.headers['Last-Modified'] = str(kioskdatetimelib.get_utc_now().timestamp())
        resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, ' \
                                        'pre-check=0, max-age=0'
        resp.headers['Pragma'] = 'no-cache'
        resp.headers['Expires'] = '-1'
        return resp
    else:
        abort(HTTPStatus.BAD_REQUEST)


#  **************************************************************
#  ****    /filemanager/delete/<string:file>
#  *****************************************************************/

@filemanager.route('/delete/<string:topic>/<string:file>', methods=['POST'])
@full_login_required
@requires(IsAuthorized(MANAGE_SERVER_PRIVILEGE))
# @nocache
def filemanager_delete(topic: str, file: str):
    print(f"\n*************** filemanager/delete/{topic}/{file} ")
    logging.info(f"filemanagercontroller.delete: attempt to delete file {topic}/{file}")
    if not is_ajax_request():
        abort(HTTPStatus.BAD_REQUEST)

    directory = FileManagerDirectory()
    sub_dir, topic = split_topic(topic)
    directory.get(topic, sub_dir=sub_dir)

    if directory.privilege_read and not is_authorized(directory.privilege_read):
        abort(HTTPStatus.UNAUTHORIZED)

    files = directory.list_files()

    file_to_delete = None
    for f in files:
        if f.filename == file:
            file_to_delete = f

    result = KioskResult(message="Unknown error on delete")
    if file_to_delete:
        if directory.backup_file(file_to_delete):
            if directory.delete_file(file_to_delete):
                result.success = True
                result.messages = ""
                logging.info(f"filemanagercontroller.restore: file {topic}/{file} deleted.")
            else:
                result.message = "File could not be deleted."
        else:
            result.message = "File could not be backed up"
        if not result.success:
            logging.info(f"filemanagercontroller.delete: {result.message}")

        return result.jsonify()
    else:
        abort(HTTPStatus.BAD_REQUEST, 'File not found.')


#  **************************************************************
#  ****    /filemanager/restore/<string:file>
#  *****************************************************************/

@filemanager.route('/restore/<string:topic>/<string:file>', methods=['POST'])
@full_login_required
@requires(IsAuthorized(MANAGE_SERVER_PRIVILEGE))
# @nocache
def filemanager_restore(topic: str, file: str):
    print(f"\n*************** filemanager/restore/{topic}/{file} ")
    logging.info(f"filemanagercontroller.restore: attempt to restore file {topic}/{file}")
    if not is_ajax_request():
        abort(HTTPStatus.BAD_REQUEST)

    directory = FileManagerDirectory()
    sub_dir, topic = split_topic(topic)
    directory.get(topic, sub_dir=sub_dir)

    if directory.privilege_read and not is_authorized(directory.privilege_read):
        abort(HTTPStatus.UNAUTHORIZED)

    files = directory.list_files()
    file_to_restore = None
    for f in files:
        if f.filename == file:
            file_to_restore = f
    result = KioskResult(message="Unknown error on restore")
    if file_to_restore:
        if directory.restore_file(file_to_restore):
            logging.info(f"filemanagercontroller.restore: file {topic}/{file} restored.")
            result.success = True
            result.messages = ""
        else:
            result.messages = "Error restoring file. The file could not be restored."

        if not result.success:
            logging.info(f"filemanagercontroller.restore: {result.message}")

        return result.jsonify()
    else:
        abort(HTTPStatus.BAD_REQUEST, 'File not found.')


#  **************************************************************
#  ****    UPLOAD FILE
#  *****************************************************************/
@filemanager.route('/upload/<string:topic>', methods=['POST'])
@full_login_required
@requires(IsAuthorized(MANAGE_SERVER_PRIVILEGE))
def filemanager_upload(topic: str):
    print(f"\n*************** filemanager/upload/{topic} ")
    logging.info(f"filemanagercontroller.filemanager_upload: attempt to upload file for topic {topic}")
    try:
        directory = FileManagerDirectory()
        sub_dir, topic = split_topic(topic)
        directory.get(topic, sub_dir=sub_dir)
        directory.get(topic)

        if directory.privilege_read and not is_authorized(directory.privilege_read):
            abort(HTTPStatus.UNAUTHORIZED)

        result = KioskResult(message="Unknown error after upload")
        logging.info(f"Received file from user {current_user.user_id}")

        if 'file' in request.files:
            file = request.files['file']
            if file and file.filename:
                logging.info(f"Received file {file.filename} for topic {topic}")
                file_name = kioskstdlib.get_filename(file.filename)

                if not directory.upload_file(file, file_name):
                    result.message = f'The file {file_name} was uploaded correctly but an error occurred ' \
                                     f'when saving the file under {topic}.'
                else:
                    result.success = True
                    result.message = "file successfully uploaded."
            else:
                result.success = False
                result.message = "Either file or filename is empty."
        else:
            result.success = False
            result.message = "No uploaded file detected."

        return result.jsonify()
    except Exception as e:
        logging.error(f"filemanager.filemanager_upload: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, repr(e))
