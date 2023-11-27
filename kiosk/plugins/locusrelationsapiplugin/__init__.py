import logging
import sys

import kioskglobals

if "mcpcore.mcpworker" not in sys.modules:
    from flask_allows import guard_entire

    from core.authorization import IsAuthorized, ENTER_ADMINISTRATION_PRIVILEGE, DOWNLOAD_WORKSTATION, \
        SYNCHRONIZE, CREATE_WORKSTATION
    from core.kioskcontrollerplugin import KioskControllerPlugin
    from kioskmenuitem import KioskMenuItem
    from .locusrelationsapi import register_resources
    from .locusrelationsapi import plugin_version

    from flask_login import current_user

    plugin: KioskControllerPlugin = None

    def instantiate_plugin_object(name, package, init_plugin_configuration={}):
        return KioskControllerPlugin(name, package, plugin_version=plugin_version)


    def init_app(app, api=None):
        if api:
            register_api(api)
            return True
        else:
            logging.error("locusrelationsapi/package.init_app: api is None.")
            return False


    def register_api(api):
        register_resources(api)


    def register_plugin_instance(plugin_to_register):
        global plugin
        plugin = plugin_to_register


    def all_plugins_ready():
        global plugin
        if plugin.is_main_index:
            asterisk = "*"
        else:
            asterisk = ""


    def register_index(app):
        pass


    def register_menus():
        pass

    def register_global_routes():
        pass

    def register_global_scripts():
        pass
