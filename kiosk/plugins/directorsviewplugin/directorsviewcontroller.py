import datetime
from pprint import pprint

from flask import Blueprint, request, render_template, session, redirect, url_for

from authorization import full_login_required
import kioskstdlib

import kioskglobals
from kioskrepresentationtype import KioskRepresentations

from core.kioskcontrollerplugin import get_plugin_for_controller

_plugin_name_ = "directorsviewplugin"
_controller_name_ = "directorsview"
_url_prefix_ = '/' + _controller_name_
plugin_version = 1.0

directorsview = Blueprint(_controller_name_, __name__,
                          template_folder='templates',
                          static_folder="static",
                          url_prefix=_url_prefix_)
print(f"{_controller_name_} module loaded")


@directorsview.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


#  **************************************************************
#  ****    /redirecting index
#  **************************************************************
@directorsview.route('_redirect', methods=['GET'])
@full_login_required
def directors_view_index():
    print("------------- redirecting")
    return redirect(url_for("directorsview.directors_view_show"))


#  **************************************************************
#  ****    /directors_view
#  *****************************************************************/
@directorsview.route('', methods=['GET', 'POST'])
@full_login_required
# @nocache
def directors_view_show():
    cfg = kioskglobals.cfg

    main_module = False
    try:
        pprint(request)
        if request.method == "POST":
            main_module = request.form['mainModule']
            if main_module:
                print("client is requesting main module")
    except KeyError:
        pass


    print("\n*************** directorsview / ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    conf = kioskglobals.get_config()

    fullscreen_representation_id = conf.file_repository["fullscreen_representation"]
    representations = [f"{x[0]},{x[1]}" for x in KioskRepresentations.get_representation_labels_and_ids(conf)]

    load_dynamic_app = {
        "controller_name": _controller_name_,
        "load_from_address": "directors_view_show"
    }
    if not main_module:
        return render_template('directorsview.html',
                               fullscreen_representation_id=fullscreen_representation_id,
                               resolutions=",".join(representations),
                               load_dynamic_app=load_dynamic_app)
    else:
        return render_template('directorsview_main.html',
                               fullscreen_representation_id=fullscreen_representation_id,
                               resolutions=",".join(representations),
                               load_dynamic_app=load_dynamic_app)


