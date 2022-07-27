# *******************************************
# fileimportplugin.__init__.py
#
# Last update LK, 20.XI.2018
#
# ********************************************

from core.kioskcontrollerplugin import KioskControllerPlugin
from kioskmenuitem import KioskMenuItem
from .fileimportcontroller import fileimport
from .fileimportcontroller import plugin_version

fileimport_plugin: KioskControllerPlugin = None


def instantiate_plugin_object(name, package):
    return KioskControllerPlugin(name, package, plugin_version=plugin_version)


def init_app(app):
    app.register_blueprint(fileimport)
    print("init_app on file_import called")


def register_plugin_instance(plugin_to_register):
    global fileimport_plugin
    fileimport_plugin = plugin_to_register


def all_plugins_ready():
    global plugin

    print("All the plugins are ready. This here is plugin {}".format(fileimport_plugin.name))


def register_menus():
    global fileimport_plugin
    print("registering menu for fileimport")
    return [KioskMenuItem(name="import files",
                          onclick="fileImportDialog('fileimport.dialog')",
                          endpoint="fileimport.dialog",
                          menu_cfg=fileimport_plugin.get_menu_config(),
                          parent_menu="main")]


def register_global_scripts():
    return {"fileimportplugin": ["fileimport.static", "scripts/fileimport.js", "async"]}

