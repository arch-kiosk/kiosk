# *******************************************
# queryandview.__init__.py
#
# ********************************************
import logging
import sys

import kioskglobals

if "mcpcore.mcpworker" not in sys.modules:
    from flask_allows import guard_entire

    from core.authorization import IsAuthorized, ENTER_ADMINISTRATION_PRIVILEGE, DOWNLOAD_WORKSTATION, \
        SYNCHRONIZE, CREATE_WORKSTATION, MANAGE_SERVER_PRIVILEGE
    from core.kioskcontrollerplugin import KioskControllerPlugin
    from kioskmenuitem import KioskMenuItem
    from .queryandviewapi import register_resources
    from .queryandviewcontroller import queryandview
    from .queryandviewcontroller import query_and_view_index
    from .queryandviewcontroller import plugin_version

    from flask_login import current_user

    plugin: KioskControllerPlugin = None


    def instantiate_plugin_object(name, package, init_plugin_configuration={}):
        return KioskControllerPlugin(name, package, plugin_version=plugin_version)


    def init_app(app, api=None):
        if not kioskglobals.get_development_option("webapp_development").lower() == "true":
            queryandview.before_request(guard_entire([IsAuthorized(DOWNLOAD_WORKSTATION)]))

        app.register_blueprint(queryandview)

        print("init_app on queryandview called")

        if api:
            register_api(api)
            return True
        else:
            logging.error("queryandview/package.init_app: api is None.")
            print("queryandview/package.init_app - Error: api is None.")
            return False


    def register_api(api):
        register_resources(api)
        print(f"api /api/queryandview initialized.")


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
        app.add_url_rule('/', 'get_index', query_and_view_index)


    def register_menus():
        global plugin
        return [KioskMenuItem(name="query and view data",
                              onclick="triggerModule('queryandview.query_and_view_show')",
                              endpoint="queryandview.query_and_view_show",
                              # is_active=lambda: current_user.fulfills_requirement(
                              #     ENTER_ADMINISTRATION_PRIVILEGE) if hasattr(current_user,
                              #                                                "fulfills_requirement") else True,
                              menu_cfg=plugin.get_menu_config()),
                KioskMenuItem(name="install or update queries",
                              onclick="triggerUploadPatch('queryandview.update_query')",
                              endpoint="queryandview.update_query",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda: current_user.fulfills_requirement(
                                  MANAGE_SERVER_PRIVILEGE) if hasattr(current_user,
                                                                      "fulfills_requirement") else True,
                              parent_menu='query and view data'
                              ),
                ]


    def register_global_routes():
        global plugin
        return ["queryandview.static",
                "queryandview.update_query",
                "queryandview.upload_query",
                "queryandview.install_queries"]


    def register_global_scripts():
        return {"queryandview": ["queryandview.static", "scripts/queryandview.js", "async"]}
