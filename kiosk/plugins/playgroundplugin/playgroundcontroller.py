import datetime
from http import HTTPStatus

from flask import Blueprint, request, redirect, render_template, jsonify, \
    url_for, abort
from flask_allows import requires
from werkzeug.exceptions import BadRequest

import kioskglobals
from authorization import DEVELOP_PRIVILEGE, IsAuthorized, IsExplicitlyAuthorized, get_local_authorization_strings
from authorization import full_login_required
from core.kioskcontrollerplugin import get_plugin_for_controller
from kiosklib import nocache
from kiosklogicalfile import KioskLogicalFile
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

_plugin_name_ = "playgroundplugin"
_controller_name_ = "playground"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.1

LOCAL_PLAYGROUND_PRIVILEGES = {
    DEVELOP_PRIVILEGE: "develop",
}

playground = Blueprint(_controller_name_, __name__,
                       template_folder='templates',
                       static_folder="static",
                       url_prefix=_url_prefix_)
print(f"{_controller_name_} module loaded")

playground_controller = Blueprint(_controller_name_, __name__)
print(f"{_controller_name_} loaded")


@playground.context_processor
def inject_current_plugin_controller():
    return dict(current_plugin_controller=get_plugin_for_controller(_plugin_name_))


def get_plugin_config():
    return kioskglobals.cfg.get_plugin_config(_plugin_name_)


#  **************************************************************
#  ****    /playground/test route
#  *****************************************************************/
@playground.route('/test', methods=['POST'])
@requires(IsExplicitlyAuthorized(DEVELOP_PRIVILEGE))
@full_login_required
# @nocache
def test():
    result = {}
    print("\n*************** playground/test")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    try:
        print(request)
        print(request.headers)
        json = {"result": "ok"}
    except Exception as e:
        result = repr(e)

    return jsonify(json)

#  **************************************************************
#  ****    /playground/test route
#  *****************************************************************/
@playground.route('/x260lk', methods=['POST'])
@requires(IsExplicitlyAuthorized(DEVELOP_PRIVILEGE))
@full_login_required
# @nocache
def x260lk():
    result = {}
    print("\n*************** playground/x260lk")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    try:
        json = {"result": "ok"}
        sync = Synchronization()
        ws = sync.get_workstation("FileMakerWorkstation", "x260lk")
        if ws:
            json = {"result": "ok",
                    "ws_state": ws.get_state()}
            if not ws._set_state("BACK_FROM_FIELD"):
                json = {"result": "false"}
        else:
            json = {"result": "false"}

    except Exception as e:
        result = repr(e)

    return jsonify(json)

#  **************************************************************
#  ****    /playground/test route
#  *****************************************************************/
@playground.route('/test_get_partial', methods=['POST'])
@full_login_required
@requires(IsExplicitlyAuthorized(DEVELOP_PRIVILEGE))
# @nocache
def test_get_partial():
    result = {}
    print("\n*************** playground/test_get_partial")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")

    try:
        print(request)
        print(request.headers)
    except Exception as e:
        result = repr(e)

    authorized_to = get_local_authorization_strings(LOCAL_PLAYGROUND_PRIVILEGES)

    return render_template('playground.html',
                           authorized_to=authorized_to,
                           config=kioskglobals.cfg,
                           ajax_data=request.form["data"]
                           )

#  **************************************************************
#  ****    /playground/test-err-500
#  *****************************************************************/
@playground.route('/test-err-500', methods=['GET'])
@full_login_required
@requires(IsExplicitlyAuthorized(DEVELOP_PRIVILEGE))
# @nocache
def test_get_err_500():
    result = {}
    print("\n*************** playground/test-err-500")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
    print(f"\nBUMMS")
    raise Exception("bumms")

    try:
        print(request)
        print(request.headers)
    except Exception as e:
        result = repr(e)

    authorized_to = get_local_authorization_strings(LOCAL_PLAYGROUND_PRIVILEGES)
    return render_template('playground.html',
                           authorized_to=authorized_to,
                           config=kioskglobals.cfg,
                           ajax_data=request.form["data"]
                           )


# @playground.route('/test_sqlalchemy', methods=['POST'])
# @full_login_required
# @requires(IsExplicitlyAuthorized(DEVELOP_PRIVILEGE))
# # @nocache
# def test_sqlalchemy():
#     result = {}
#     print("\n*************** playground/test_sqlalchemy")
#     print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
#     print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
#
#     try:
#         print(request)
#         print(request.headers)
#     except Exception as e:
#         result = repr(e)
#
#     authorized_to = get_local_authorization_strings(LOCAL_PLAYGROUND_PRIVILEGES)
#
#     c = KioskSQLDb.get_first_record_from_sql("select count(uid) from images")[0]
#     json = {"result": c}
#     print(json)
#     return jsonify(json)


#  **************************************************************
#  ****    redirecting index
#  *****************************************************************/

@playground.route('_redirect', methods=['GET'])
@full_login_required
@requires(IsExplicitlyAuthorized(DEVELOP_PRIVILEGE))
def playground_index():
    print("------------- redirecting")
    return redirect(url_for("playground.playground_show"))


#  **************************************************************
#  ****    /playground index
#  *****************************************************************/

@playground.route('', methods=['GET'])
@full_login_required
@requires(IsExplicitlyAuthorized(DEVELOP_PRIVILEGE))
# @nocache
def playground_show():
    conf = kioskglobals.cfg
    print("\n*************** playground/ ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
    print(request.accept_languages)


    authorized_to = get_local_authorization_strings(LOCAL_PLAYGROUND_PRIVILEGES)

    return render_template('playground.html',
                           authorized_to=authorized_to,
                           config=kioskglobals.cfg,
                           )

#  **************************************************************
#  ****    /playground/testtextareabug
#  *****************************************************************/

@playground.route('/testtextareabug', methods=['GET'])
@full_login_required
@requires(IsExplicitlyAuthorized(DEVELOP_PRIVILEGE))
@nocache
def test_textarea_bug():
    conf = kioskglobals.cfg
    print("\n*************** playground/testtextareabug ")
    print(f"\nGET: get_plugin_for_controller returns {get_plugin_for_controller(_plugin_name_)}")
    print(f"\nGET: plugin.name returns {get_plugin_for_controller(_plugin_name_).name}")
    print(request.accept_languages)

    authorized_to = get_local_authorization_strings(LOCAL_PLAYGROUND_PRIVILEGES)

    return render_template('test_textarea_bug.html',
                           authorized_to=authorized_to,
                           config=kioskglobals.cfg,
                           now=str(datetime.datetime.now())
                           )
