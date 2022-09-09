# *******************************************
# syncmanager.__init__.py
#
# ********************************************
import logging
import sys

import kioskglobals

if "mcpcore.mcpworker" not in sys.modules:
    from flask_allows import guard_entire

    from core.authorization import IsAuthorized, ENTER_ADMINISTRATION_PRIVILEGE, DOWNLOAD_WORKSTATION, \
        SYNCHRONIZE, CREATE_WORKSTATION
    from core.kioskcontrollerplugin import KioskControllerPlugin
    from kioskmenuitem import KioskMenuItem
    from .syncmanagerapi import register_resources
    from .syncmanagercontroller import syncmanager
    from .syncmanagercontroller import sync_manager_index
    from .syncmanagercontroller import plugin_version

    from flask_login import current_user

    plugin: KioskControllerPlugin = None


    def instantiate_plugin_object(name, package, init_plugin_configuration={}):
        return KioskControllerPlugin(name, package, plugin_version=plugin_version)


    def init_app(app, api=None):
        if not kioskglobals.get_development_option("webapp_development"):
            syncmanager.before_request(guard_entire([IsAuthorized(DOWNLOAD_WORKSTATION)]))

        app.register_blueprint(syncmanager)
        print("init_app on syncmanager called")

        if api:
            register_api(api)
            return True
        else:
            logging.error("syncmanager/package.init_app: api is None.")
            print("syncmanager/package.init_app - Error: api is None.")
            return False


    def register_api(api):
        register_resources(api)
        print(f"api /api/syncmanager initialized.")


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
        app.add_url_rule('/', 'get_index', sync_manager_index)


    def register_menus():
        global plugin
        return [KioskMenuItem(name="Hub",
                              onclick="triggerSyncManager('syncmanager.sync_manager_show')",
                              endpoint="syncmanager.sync_manager_show",
                              # is_active=lambda: current_user.fulfills_requirement(
                              #     ENTER_ADMINISTRATION_PRIVILEGE) if hasattr(current_user,
                              #                                                "fulfills_requirement") else True,
                              menu_cfg=plugin.get_menu_config()),
                KioskMenuItem(name="new dock",
                              onclick="triggerNewWorkstation('syncmanager.create_workstation')",
                              endpoint="syncmanager.sync_manager_show",
                              order="1010",
                              is_active=lambda: current_user.fulfills_requirement(
                                  CREATE_WORKSTATION) if hasattr(current_user,
                                                                 "fulfills_requirement") else True,
                              menu_cfg=plugin.get_menu_config(),
                              parent_menu="main"),
                KioskMenuItem(name="synchronize",
                              onclick="syncManagerSynchronize('syncmanager.synchronize_check')",
                              endpoint="syncmanager.synchronize_check",
                              is_active=lambda: current_user.fulfills_requirement(
                                  SYNCHRONIZE) if hasattr(current_user,
                                                          "fulfills_requirement") else True,
                              menu_cfg=plugin.get_menu_config(),
                              parent_menu="main", order="3010")
                ]


    def register_global_routes():
        global plugin
        return ["syncmanager.static", "syncmanager.synchronization_progress"]


    def register_global_scripts():
        return {"syncmanager": ["syncmanager.static", "scripts/syncmanager.js", "async"]}
