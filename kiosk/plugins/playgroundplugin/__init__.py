from flask_login import current_user

import logging
from kioskmenuitem import KioskMenuItem
from core.kioskcontrollerplugin import KioskControllerPlugin

from .playgroundcontroller import playground
from .playgroundcontroller import playground_index
from .playgroundcontroller import plugin_version
from authorization import DEVELOP_PRIVILEGE

plugin: KioskControllerPlugin = None


def instantiate_plugin_object(name, package, init_plugin_configuration={}):
    return KioskControllerPlugin(name, package, plugin_version=plugin_version)


def init_app(app):
    app.register_blueprint(playground)
    print("init_app on playgroundplugin called")


def register_plugin_instance(plugin_to_register):
    global plugin
    plugin = plugin_to_register


def all_plugins_ready():
    global plugin
    if plugin.is_main_index:
        asterisk = "*"
    else:
        asterisk = ""

    print("All the plugins are ready. This here is plugin {}{}".format(asterisk, plugin.name))


def register_index(app):
    app.add_url_rule('/', 'get_index', playground_index)


def register_menus():
    global plugin
    logging.debug("AdministrationPlugin: Registering menus")
    return [KioskMenuItem(name="developer's playground",
                          onclick="triggerPlayground('playground.playground_show')",
                          endpoint="playground.playground_show",
                          menu_cfg=plugin.get_menu_config(),
                          is_active=lambda: current_user.fulfills_requirement(DEVELOP_PRIVILEGE) if hasattr(
                              current_user,
                              "fulfills_requirement") else True
                          ),
            ]


def register_global_scripts():
    return {"playground": ["playground.static", "scripts/playground.js", "async",
                           lambda: current_user.fulfills_requirement(DEVELOP_PRIVILEGE) if hasattr(
                               current_user,
                               "fulfills_requirement") else True
                           ]}
