# *******************************************
# bugsandfeaturesplugin.__init__.py
#
# Last update LK, 08.XII.2018
#
# ********************************************

from core.kioskcontrollerplugin import KioskControllerPlugin
from kioskmenuitem import KioskMenuItem
from .bugsandfeaturescontroller import bugsandfeatures
from .bugsandfeaturescontroller import bugs_and_features_index
from .bugsandfeaturescontroller import plugin_version

plugin: KioskControllerPlugin = None
plugin_version =0.1


def instantiate_plugin_object(name, package):
    plugin = KioskControllerPlugin(name, package)
    plugin._plugin_version = plugin_version
    return plugin


def init_app(app):
    app.register_blueprint(bugsandfeatures)
    print("init_app on bugsandfeatures called")


def register_plugin_instance(plugin_to_register):
    global plugin
    plugin = plugin_to_register


def all_plugins_ready():
    global plugin
    if plugin.is_main_index:
        asterisk = "*"
    else:
        asterisk = ""

    print(f"{plugin.name} initialized.")


def register_index(app):
    app.add_url_rule('/', 'get_index', bugs_and_features_index)
    # app.view_functions['get_index'] = workstations_index


def register_menus():
    global plugin
    return [KioskMenuItem(name="bugs and features",
                          onclick="triggerBugsAndFeatures('bugsandfeatures.bugs_and_features_show')",
                          endpoint="bugsandfeatures.bugs_and_features_show",
                          menu_cfg=plugin.get_menu_config())]


def register_global_scripts():
    return {"bugsandfeatures": ["bugsandfeatures.static", "scripts/bugsandfeatures.js", "async"]}




