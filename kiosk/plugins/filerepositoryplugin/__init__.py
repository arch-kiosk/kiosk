# *******************************************
# filerepositoryplugin.__init__.py
#
# Last update LK, 20.XI.2018
#
# ********************************************
from flask_login import current_user

import kioskglobals
from authorization import ENTER_FILE_ARCHIVES
from core.kioskcontrollerplugin import KioskControllerPlugin
from kioskconfig import KioskConfig
from kiosklib import is_local_server
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
    cfg = KioskConfig.get_config()
    return [KioskMenuItem(name="file repository",
                          onclick="triggerFileRepository('filerepository.file_repository_show')",
                          endpoint="filerepository.file_repository_show",
                          menu_cfg=plugin.get_menu_config()),
            KioskMenuItem(name="limit to site",
                          onclick="fr_limitToSite()",
                          endpoint="filerepository.site_filter_dialog",
                          menu_cfg=plugin.get_menu_config(),
                          parent_menu="file repository"),
            KioskMenuItem(name="switch to archive",
                          onclick="fr_switchToArchive()",
                          is_active=lambda:
                          (current_user.fulfills_requirement(ENTER_FILE_ARCHIVES) and (not is_local_server(cfg) or
                            kioskglobals.is_development_system()))
                          if hasattr(current_user, "fulfills_requirement") else False,
                          endpoint="filerepository.archive_selector_dialog",
                          menu_cfg=plugin.get_menu_config(),
                          parent_menu="file repository"),
            ]


def register_global_scripts():
    return {"filerepository": ["filerepository.static", "scripts/filerepository.js", "async"]}




