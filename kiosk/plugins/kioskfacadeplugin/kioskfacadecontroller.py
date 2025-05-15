import datetime
import logging
import os.path
import shutil
from pprint import pprint

from flask import Blueprint, request, render_template, session, redirect, url_for, abort, render_template_string
from flask_login import current_user
from http import HTTPStatus

from werkzeug.exceptions import HTTPException

import kiosklib
import synchronization
from authorization import full_login_required, MANAGE_SERVER_PRIVILEGE
from authorization import get_local_authorization_strings, EDIT_WORKSTATION_PRIVILEGE, \
    SYNCHRONIZE, PREPARE_WORKSTATIONS, DOWNLOAD_WORKSTATION, UPLOAD_WORKSTATION, CREATE_WORKSTATION
import kioskstdlib

import kioskglobals
from backupreminder import BackupReminder

from core.kioskcontrollerplugin import get_plugin_for_controller
from filerepository import FileRepository
from kioskconfig import KioskConfig
from kioskcontextualfile import KioskContextualFile
from kiosklib import is_ajax_request, nocache, UserError
from kioskquery.kioskquerystore import KioskQueryStore
from kioskrepresentationtype import KioskRepresentations
from kioskresult import KioskResult
from kioskwtforms import kiosk_validate
from mcpinterface.mcpconstants import MCPJobStatus
from mcpinterface.mcpjob import MCPJob
from synchronization import Synchronization

_plugin_name_ = "kioskfacadeplugin"
_controller_name_ = "kioskfacade"
_url_prefix_ = '/' + _controller_name_
_url_prefix_ = '/' + 'welcome'
plugin_version = 0.1

LOCAL_PRIVILEGES = {
}

kioskfacade = Blueprint(_controller_name_, __name__,
                        template_folder='templates',
                        static_folder="static",
                        url_prefix=_url_prefix_)
print(f"{_controller_name_} module loaded")


@kioskfacade.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


#  **************************************************************
#  ****    /redirecting index
#  **************************************************************
@kioskfacade.route('_redirect', methods=['GET'])
@full_login_required
def kiosk_facade_index():
    print("------------- redirecting")
    return redirect(url_for("kioskfacade.kiosk_facade_show"))


#  **************************************************************
#  ****    /kiosk_facade_show
#  *****************************************************************/
@kioskfacade.route('', methods=['GET', 'POST'])
@full_login_required
@nocache
def kiosk_facade_show():
    print("\n*************** kioskfacade / ")
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
    plugin_cfg = kioskglobals.cfg.get_plugin_config(_plugin_name_)
    fullscreen_representation_id = kioskstdlib.try_get_dict_entry(plugin_cfg, "hero_representation",
                                                                  None, False)
    if not fullscreen_representation_id:
        fullscreen_representation_id = kioskstdlib.try_get_dict_entry(conf.file_repository, "fullscreen_representation",
                                                                  "best", True)
    representations = [f"{x[0]},{x[1]}" for x in KioskRepresentations.get_representation_labels_and_ids(conf)]
    file_repos = FileRepository(kioskglobals.cfg,
                                event_manager=None
                                )
    kiosk_facade_hero_image = None
    kiosk_facade_hero_width = None
    kiosk_facade_hero_uuid = None
    kiosk_facade_hero_height = None
    uids = file_repos.get_files_with_tags(["kiosk_hero"], "=")
    if uids:
        f = file_repos.get_contextual_file(uids[0])
        if f:
            kiosk_facade_hero_image = url_for('filerepository.fetch_repository_file', file_uuid=uids[0],
                                              resolution=fullscreen_representation_id)
            kiosk_facade_hero_uuid = f.uid
            dimensions = f.get_dimensions()
            if dimensions:
                kiosk_facade_hero_width = dimensions[0]
                kiosk_facade_hero_height = dimensions[1]

    load_dynamic_app = {
        "controller_name": _controller_name_,
        "load_from_address": "kiosk_facade_show"
    }
    if not main_module:
        return render_template('kioskfacade.html', full_screen=True, load_dynamic_app=load_dynamic_app)
    else:
        custom_facade = os.path.join(conf.custom_path, "customfacade.html")
        if os.path.isfile(custom_facade):
            print(f"loading custom template {custom_facade}")
            with open(custom_facade, 'r', encoding="utf8") as f:
                template_str = f.read()

            return render_template_string(template_str,
                                          fullscreen_representation_id=fullscreen_representation_id,
                                          kiosk_facade_hero_image=kiosk_facade_hero_image,
                                          resolutions=",".join(representations),
                                          kiosk_facade_hero_width=kiosk_facade_hero_width,
                                          kiosk_facade_hero_uuid=kiosk_facade_hero_uuid,
                                          kiosk_facade_hero_height=kiosk_facade_hero_height,
                                          load_dynamic_app=load_dynamic_app)
        else:
            return render_template('kioskfacade_main.html',
                                   fullscreen_representation_id=fullscreen_representation_id,
                                   kiosk_facade_hero_image=kiosk_facade_hero_image,
                                   kiosk_facade_hero_width=kiosk_facade_hero_width,
                                   kiosk_facade_hero_uuid=kiosk_facade_hero_uuid,
                                   kiosk_facade_hero_height=kiosk_facade_hero_height,
                                   resolutions=",".join(representations),
                                   load_dynamic_app=load_dynamic_app)
