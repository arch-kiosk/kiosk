# *******************************************
# kioskfilemakerworkstationplugin.__init__.py
#
# ********************************************
import logging
import sys
from typing import List, Union, Tuple

import kioskglobals
from .kioskfilemakerworkstation import KioskFileMakerWorkstation

if "mcpcore.mcpworker" not in sys.modules:
    from flask_allows import guard_entire

    from core.authorization import IsAuthorized, ENTER_ADMINISTRATION_PRIVILEGE, DOWNLOAD_WORKSTATION, \
        PREPARE_WORKSTATIONS, EDIT_WORKSTATION_PRIVILEGE, INSTALL_PLUGIN
    from core.kioskcontrollerplugin import KioskControllerPlugin
    from kioskmenuitem import KioskMenuItem
    from .kioskfilemakerworkstationcontroller import kioskfilemakerworkstation
    from .kioskfilemakerworkstationcontroller import plugin_version, init_controller
    from flask_login import current_user

    plugin: KioskControllerPlugin = None


    def instantiate_plugin_object(name, package, init_plugin_configuration={}):
        return KioskControllerPlugin(name, package, plugin_version=plugin_version)


    def init_app(app, api=None):
        if not kioskglobals.get_development_option("webapp_development"):
            kioskfilemakerworkstation.before_request(guard_entire([IsAuthorized(DOWNLOAD_WORKSTATION)]))
        app.register_blueprint(kioskfilemakerworkstation)
        KioskFileMakerWorkstation.register_types(app.type_repository)
        KioskFileMakerWorkstation.register_class_events(app.events)
        init_controller()

        print("init_app on kioskfilemakerworkstation called")
        return True

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
        pass
        # app.add_url_rule('/', 'get_index', sync_manager_index)


    def register_menus():
        global plugin
        return [KioskMenuItem(name="prepare filemaker workstations",
                              onclick="kfwGroupAction('kioskfilemakerworkstation.prepare_all')",
                              endpoint="kioskfilemakerworkstation.prepare_all",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda: current_user.fulfills_requirement(
                                  PREPARE_WORKSTATIONS) if hasattr(current_user,
                                                                   "fulfills_requirement") else True,
                              parent_menu="Hub",
                              order="2010"),
                KioskMenuItem(name="import filemaker workstations",
                              onclick="kfwGroupAction('kioskfilemakerworkstation.import_all')",
                              endpoint="kioskfilemakerworkstation.import_all",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda: current_user.fulfills_requirement(
                                  PREPARE_WORKSTATIONS) if hasattr(current_user,
                                                                   "fulfills_requirement") else True,
                              parent_menu="Hub",
                              order="2020"),
                KioskMenuItem(name="reset all filemaker workstations",
                              onclick="kfwGroupAction('kioskfilemakerworkstation.reset_all')",
                              endpoint="kioskfilemakerworkstation.reset_all",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda: current_user.fulfills_requirement(
                                  EDIT_WORKSTATION_PRIVILEGE) if hasattr(current_user,
                                                                         "fulfills_requirement") else True,
                              parent_menu="Hub",
                              order="2005"),
                KioskMenuItem(name="update recording software",
                              onclick="kfwInstallUpdate('kioskfilemakerworkstation.install_update')",
                              endpoint="kioskfilemakerworkstation.install_update",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda: current_user.fulfills_requirement(
                                  INSTALL_PLUGIN) if hasattr(current_user,
                                                                         "fulfills_requirement") else True,
                              parent_menu="Hub",
                              order="2009")

                ]


    def register_global_routes() -> List[Union[str, Tuple[str, str]]]:
        global plugin
        return ["kioskfilemakerworkstation.create_kiosk_workstation",
                ("kioskfilemakerworkstation.workstation_actions", "/kioskfilemakerworkstation/actions"),
                "kioskfilemakerworkstation.prepare_all",
                "kioskfilemakerworkstation.import_all",
                ("kioskfilemakerworkstation.edit", "/kioskfilemakerworkstation/workstation"),
                "kioskfilemakerworkstation.install_update",
                "kioskfilemakerworkstation.trigger_install",
                ]


    def register_global_scripts():
        return {"kioskfilemakerworkstation": ["kioskfilemakerworkstation.static",
                                              "scripts/kioskfilemakerworkstationglobal.js", "async"]}
