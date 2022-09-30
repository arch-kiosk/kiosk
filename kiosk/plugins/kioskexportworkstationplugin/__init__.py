# *******************************************
# kioskexportworkstationplugin.__init__.py
#
# ********************************************
import logging
import sys
from typing import List, Union, Tuple

import kioskglobals
from .kioskexportworkstation import KioskExportWorkstation

if "mcpcore.mcpworker" not in sys.modules:
    from flask_allows import guard_entire

    from core.authorization import IsAuthorized, ENTER_ADMINISTRATION_PRIVILEGE, DOWNLOAD_WORKSTATION
    from core.kioskcontrollerplugin import KioskControllerPlugin
    from .kioskexportworkstationcontroller import kioskexportworkstation
    from .kioskexportworkstationcontroller import plugin_version, init_controller

    from flask_login import current_user

    plugin: KioskControllerPlugin = None


    def instantiate_plugin_object(name, package, init_plugin_configuration={}):
        return KioskControllerPlugin(name, package,plugin_version=plugin_version)


    def init_app(app, api=None):
        if not kioskglobals.get_development_option("webapp_development").lower() == "true":
            kioskexportworkstation.before_request(guard_entire([IsAuthorized(DOWNLOAD_WORKSTATION)]))
        app.register_blueprint(kioskexportworkstation)
        KioskExportWorkstation.register_types(app.type_repository)
        init_controller()

        print("init_app on kioskexportworkstation called")
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
        return []

    def register_global_routes() -> List[Union[str, Tuple[str, str]]]:
        global plugin
        return ["kioskexportworkstation.create_kiosk_workstation",
                ("kioskexportworkstation.workstation_actions", "/kioskexportworkstation/actions"),
                ("kioskexportworkstation.edit", "/kioskexportworkstation/workstation")
                ]


    def register_global_scripts():
        return {}
        # return {"syncmanager": ["syncmanager.static", "scripts/syncmanager.js", "async"]}
