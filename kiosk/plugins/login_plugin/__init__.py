import kioskglobals
from kioskglobals import httpauth
import logging
from kioskuser import KioskUser
# from flask import request
from flask_login import LoginManager, current_user

from kioskcontrollerplugin import KioskControllerPlugin
from flask_allows import Allows
from .login_controller import login_plugin

plugin: KioskControllerPlugin = None
plugin_version = 0.2


def instantiate_plugin_object(name, package, init_plugin_configuration={}):
    return KioskControllerPlugin(name, package, plugin_version=plugin_version)


def register_plugin_instance(plugin_to_register):
    global plugin
    plugin = plugin_to_register


def init_app(app):
    app.register_blueprint(login_plugin)
    print("init_app on login controller called")
    kioskglobals.login_manager = LoginManager(app)
    kioskglobals.login_manager.login_view = "/login"
    kioskglobals.login_manager.user_loader(load_user)
    if kioskglobals.get_development_option("webapp_development"):
        logging.warning("login_plugin.init_app: installing request_loader")
        kioskglobals.login_manager.request_loader(load_user_from_request)
    allows = Allows(app)
    allows.identity_loader(lambda: current_user)


def all_plugins_ready():
    global plugin
    print("login plugin: All the plugins are ready. This here is plugin {}".format(plugin.name))


def load_user(_id):
    try:
        user = KioskUser(_id)
        return user
    except Exception as e:
        logging.error("Exception in @LoginManager user loader " + repr(e))

    return None


def load_user_from_request(request):
    try:
        if request.headers.has_key("webapp-user-id"):
            user_id = request.headers.get("webapp-user-id")
            user_pwd = request.headers.get("webapp-user-pwd")
            logging.warning(f"Logging in user {user_id} for a webapp.")
            user = KioskUser.authenticate(user_id, user_pwd)
        else:
            raise Exception("Attempt to use the webapp login interface without the "
                            "appropriate headers!")
        return user
    except Exception as e:
        logging.error("Exception in @LoginManager request loader " + repr(e))

    return None


@httpauth.verify_token
def verify_token(token):
    logging.debug(f"login_plugin.verifying_token: verifying {token}")
    user_uuid = KioskUser.check_token(token)
    if user_uuid:
        return load_user(user_uuid)
    else:
        return None
