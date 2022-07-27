# *******************************************
# directorsview.__init__.py
#
# ********************************************
import logging
import sys

if "mcpcore.mcpworker" not in sys.modules:
    from flask_allows import guard_entire

    from core.authorization import IsAuthorized, ENTER_ADMINISTRATION_PRIVILEGE
    from core.kioskcontrollerplugin import KioskControllerPlugin
    from kioskmenuitem import KioskMenuItem
    from .directorsviewapi import register_resources
    from .directorsviewcontroller import directorsview
    from .directorsviewcontroller import directors_view_index
    from .directorsviewcontroller import plugin_version

    from flask_login import current_user

    plugin: KioskControllerPlugin = None


    def instantiate_plugin_object(name, package, init_plugin_configuration={}):
        return KioskControllerPlugin(name, package, plugin_version=plugin_version)


    def init_app(app, api=None):
        directorsview.before_request(guard_entire([IsAuthorized(ENTER_ADMINISTRATION_PRIVILEGE)]))
        app.register_blueprint(directorsview)
        print("init_app on directorsview called")

        if api:
            register_api(api)
            return True
        else:
            logging.error("directorsview/package.init_app: api is None.")
            print("directorsview/package.init_app - Error: api is None.")
            return False


    def register_api(api):
        # api.add_namespace(api_ns_director_v1)
        register_resources(api)
        print(f"api /api/director initialized.")


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
        app.add_url_rule('/', 'get_index', directors_view_index)


    def register_menus():
        global plugin
        return [KioskMenuItem(name="director's view",
                              onclick="triggerDirectorsView('directorsview.directors_view_show')",
                              endpoint="directorsview.directors_view_show",
                              is_active=lambda: current_user.fulfills_requirement(
                                  ENTER_ADMINISTRATION_PRIVILEGE) if hasattr(current_user,
                                                                             "fulfills_requirement") else False,
                              menu_cfg=plugin.get_menu_config())]


    def register_global_routes():
        global plugin
        return ["directorsview.static"]


    def register_global_scripts():
        return {"directorsview": ["directorsview.static", "scripts/directorsview.js", "async",
                                  lambda: current_user.fulfills_requirement(
                                      ENTER_ADMINISTRATION_PRIVILEGE) if hasattr(current_user,
                                                                                 "fulfills_requirement") else False]}
