import datetime
import logging
from pprint import pprint

from flask import Blueprint, request, render_template, session, redirect, url_for, abort
from flask_login import current_user
from http import HTTPStatus

from authorization import full_login_required
from authorization import get_local_authorization_strings, EDIT_WORKSTATION_PRIVILEGE, \
    SYNCHRONIZE, PREPARE_WORKSTATIONS, DOWNLOAD_WORKSTATION, UPLOAD_WORKSTATION, CREATE_WORKSTATION
import kioskstdlib

import kioskglobals
from backupreminder import BackupReminder

from core.kioskcontrollerplugin import get_plugin_for_controller
from kiosklib import is_ajax_request, nocache
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
    SYNCHRONIZE: "synchronize"
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
    load_dynamic_app = {
            "controller_name": _controller_name_,
            "load_from_address": "query_and_view_show"
        }
    if not main_module:
        return render_template('queryandview.html', load_dynamic_app=load_dynamic_app)
    else:
        return render_template('queryandview_main.html', load_dynamic_app=load_dynamic_app)
