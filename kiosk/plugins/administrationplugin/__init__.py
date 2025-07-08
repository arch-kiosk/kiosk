import logging
import sys

# that might be rather a hack, but it keeps the imports from happening if the workers are imported by
# the mcpworker. They are supposed to run only when this is loaded as a plugin.
from typing import List, Union, Tuple

if "mcpcore.mcpworker" not in sys.modules:
    from flask_login import current_user
    from flaskadminkiosk import init_flask_admin

    from kioskmenuitem import KioskMenuItem
    from core.kioskcontrollerplugin import KioskControllerPlugin

    from .administrationcontroller import administration
    from .administrationcontroller import administration_index
    from .administrationcontroller import plugin_version
    from authorization import ENTER_ADMINISTRATION_PRIVILEGE, BACKUP_PRIVILEGE, MANAGE_USERS, MANAGE_SERVER_PRIVILEGE, \
    MANAGE_PORTS
    from kioskconfig import KioskConfig

    plugin: KioskControllerPlugin = None


    def instantiate_plugin_object(name, package, init_plugin_configuration={}):
        return KioskControllerPlugin(name, package, plugin_version)


    def init_app(app):
        app.register_blueprint(administration)
        print("init_app on login controller called")

        cfg = KioskConfig.get_config()
        # init flask admin
        init_flask_admin(cfg, app)


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
        app.add_url_rule('/', 'get_index', administration_index)


    def register_menus():
        global plugin
        logging.debug("AdministrationPlugin: Registering menus")
        return [KioskMenuItem(name="administration",
                              onclick="triggerAdministration('administration.administration_show')",
                              endpoint="administration.administration_show",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda: current_user.fulfills_requirement(
                                  ENTER_ADMINISTRATION_PRIVILEGE) if hasattr(current_user, "fulfills_requirement") else True
                              ),
                KioskMenuItem(name="process management",
                              onclick="triggerAdministration('administration.processes_show')",
                              endpoint="administration.processes_show",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda: current_user.fulfills_requirement(
                                  ENTER_ADMINISTRATION_PRIVILEGE) if hasattr(current_user, "fulfills_requirement") else True,
                              parent_menu='administration'
                              ),
                KioskMenuItem(name="backup",
                              onclick="triggerBackup()",
                              endpoint="administration.administration_show",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda:
                                  current_user.fulfills_requirement(BACKUP_PRIVILEGE)
                                      if hasattr(current_user, "fulfills_requirement") else True,
                              parent_menu='administration'
                              ),
                KioskMenuItem(name="install patch",
                              onclick="triggerUploadPatch('administration.patch')",
                              endpoint="administration.patch",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda:
                                  current_user.fulfills_requirement(MANAGE_SERVER_PRIVILEGE)
                                      if hasattr(current_user, "fulfills_requirement") else True,
                              parent_menu='administration'
                              ),
                # KioskMenuItem(name="users",
                #               onclick="triggerAdminInterface('kioskuser.index_view')",
                #               endpoint="kioskuser.index_view",
                #               menu_cfg=plugin.get_menu_config(),
                #               is_active=lambda:
                #                   current_user.fulfills_requirement(MANAGE_USERS)
                #                       if hasattr(current_user, "fulfills_requirement") else False,
                #               parent_menu='administration'
                #               ),
                # KioskMenuItem(name="privileges",
                #               onclick="triggerAdminInterface('kioskprivilege.index_view')",
                #               endpoint="kioskprivilege.index_view",
                #               menu_cfg=plugin.get_menu_config(),
                #               is_active=lambda:
                #                   current_user.fulfills_requirement(MANAGE_USERS)
                #                       if hasattr(current_user, "fulfills_requirement") else False,
                #               parent_menu='administration'
                #               ),
                KioskMenuItem(name="settings",
                              onclick="triggerAdminInterface('kioskuser.index_view')",
                              endpoint="kioskuser.index_view",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda:
                                  current_user.fulfills_requirement(MANAGE_USERS)
                                      if hasattr(current_user, "fulfills_requirement") else False,
                              parent_menu='administration'
                              ),
                KioskMenuItem(name="file picking rules",
                              onclick="triggerAdminInterface('kioskfilepickingrules.index_view')",
                              endpoint="kioskfilepickingrules.index_view",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda:
                                  current_user.fulfills_requirement(MANAGE_SERVER_PRIVILEGE)
                                      if hasattr(current_user, "fulfills_requirement") else False,
                              parent_menu='administration'
                              ),
                # KioskMenuItem(name="ports",
                #               onclick="triggerAdminInterface('kioskports.index_view')",
                #               endpoint="kioskports.index_view",
                #               menu_cfg=plugin.get_menu_config(),
                #               is_active=lambda:
                #                   current_user.fulfills_requirement(MANAGE_PORTS)
                #                       if hasattr(current_user, "fulfills_requirement") else False,
                #               parent_menu='administration'
                #               ),
                # KioskMenuItem(name="quality control rules",
                #               onclick="triggerAdminInterface('kioskqcrules.index_view')",
                #               endpoint="kioskqcrules.index_view",
                #               menu_cfg=plugin.get_menu_config(),
                #               is_active=lambda:
                #                   current_user.fulfills_requirement(MANAGE_SERVER_PRIVILEGE)
                #                       if hasattr(current_user, "fulfills_requirement") else False,
                #               parent_menu='administration'
                #               ),
                # KioskMenuItem(name="kiosk queries",
                #               onclick="triggerAdminInterface('kioskqueries.index_view')",
                #               endpoint="kioskqueries.index_view",
                #               menu_cfg=plugin.get_menu_config(),
                #               is_active=lambda:
                #                   current_user.fulfills_requirement(MANAGE_SERVER_PRIVILEGE)
                #                       if hasattr(current_user, "fulfills_requirement") else False,
                #               parent_menu='administration'
                #               ),
                KioskMenuItem(name="logs",
                              onclick="triggerAdminInterface('administration.show_logs')",
                              endpoint="administration.show_logs",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda:
                              current_user.fulfills_requirement(ENTER_ADMINISTRATION_PRIVILEGE)
                              if hasattr(current_user, "fulfills_requirement") else False,
                              parent_menu='administration'
                              ),
                KioskMenuItem(name="download transfer catalog",
                              onclick="triggerDownloadTransferCatalog('administration.download_transfer_catalog')",
                              endpoint="administration.download_transfer_catalog",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda:
                              current_user.fulfills_requirement(ENTER_ADMINISTRATION_PRIVILEGE)
                              if hasattr(current_user, "fulfills_requirement") else False,
                              parent_menu='administration'
                              ),

                ]

    def register_global_routes() -> List[Union[str, Tuple[str, str]]]:
        global plugin
        return ["administration.trigger_patch",
                "administration.upload_catalog",
                "administration.download_transfer_catalog"
                ]

    def register_global_scripts():
        return {"administration": ["administration.static", "scripts/administration.js", "async"]}
