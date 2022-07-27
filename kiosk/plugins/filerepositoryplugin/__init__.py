# *******************************************
# filerepositoryplugin.__init__.py
#
# Last update LK, 20.XI.2018
#
# ********************************************

from core.kioskcontrollerplugin import KioskControllerPlugin
from kioskmenuitem import KioskMenuItem
from .filerepositorycontroller import filerepository
from .filerepositorycontroller import file_repository_index
from .filerepositorycontroller import plugin_version

plugin: KioskControllerPlugin = None


def instantiate_plugin_object(name, package):
    return KioskControllerPlugin(name, package, plugin_version=plugin_version)


def init_app(app):
    app.register_blueprint(filerepository)
    print("init_app on filerepository called")


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
    app.add_url_rule('/', 'get_index', file_repository_index)
    # app.view_functions['get_index'] = workstations_index


def register_menus():
    global plugin
    return [KioskMenuItem(name="file repository",
                          onclick="triggerFileRepository('filerepository.file_repository_show')",
                          endpoint="filerepository.file_repository_show",
                          menu_cfg=plugin.get_menu_config())]


def register_global_scripts():
    return {"filerepository": ["filerepository.static", "scripts/filerepository.js", "async"]}




