import datetime

from flask import Blueprint, request, render_template, session, redirect, url_for

from authorization import full_login_required
import kioskstdlib

import kioskglobals

from core.kioskcontrollerplugin import get_plugin_for_controller

_plugin_name_ = "directorsviewplugin"
_controller_name_ = "directorsview"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.9

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
    conf = kioskglobals.cfg
    model_daily_review = None

    print("\n*************** directorsview / ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    return render_template('directorsview.html')


