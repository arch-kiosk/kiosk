import sys

# that might be rather a hack, but it keeps the imports from happening if the workers are imported by
# the mcpworker. They are supposed to run only when this is loaded as a plugin.
from kioskglobals import type_repository
from kioskrepositorytypes import TYPE_FILE_MANAGER_INTERFACE

if "mcpcore.mcpworker" not in sys.modules:
    from flask_login import current_user

    from kioskmenuitem import KioskMenuItem
    from core.kioskcontrollerplugin import KioskControllerPlugin

    from .kioskfilemanagerinterface import KioskFileManagerInterface
    from .filemanagercontroller import filemanager
    from .filemanagercontroller import filemanager_index
    from .filemanagercontroller import plugin_version
    from authorization import ENTER_ADMINISTRATION_PRIVILEGE, MANAGE_SERVER_PRIVILEGE

    plugin: KioskControllerPlugin = None



    def instantiate_plugin_object(name, package, init_plugin_configuration={}):
        return KioskControllerPlugin(name, package, plugin_version=plugin_version)


    def init_app(app):
        app.register_blueprint(filemanager)
        type_repository.register_type(TYPE_FILE_MANAGER_INTERFACE,
                                      TYPE_FILE_MANAGER_INTERFACE,
                                      KioskFileManagerInterface)

    def register_plugin_instance(plugin_to_register):
        global plugin
        plugin = plugin_to_register


    def all_plugins_ready():
        global plugin
        return


    def register_index(app):
        app.add_url_rule('/', 'get_index', filemanager_index)


    def register_menus():
        global plugin
        return [KioskMenuItem(name="file manager",
                              onclick="triggerModule('filemanager.filemanager_show')",
                              endpoint="filemanager.filemanager_show",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda: current_user.fulfills_requirement(
                                  ENTER_ADMINISTRATION_PRIVILEGE) if hasattr(current_user,
                                                                             "fulfills_requirement") else True,
                              parent_menu='administration'
                              ),
                KioskMenuItem(name="topic configuration",
                              onclick="triggerModule('kioskfilemanagerdirectories.index_view')",
                              endpoint="kioskfilemanagerdirectories.index_view",
                              menu_cfg=plugin.get_menu_config(),
                              is_active=lambda:
                              current_user.fulfills_requirement(MANAGE_SERVER_PRIVILEGE)
                              if hasattr(current_user, "fulfills_requirement") else False,
                              parent_menu='administration'
                              ),
                ]


    def register_global_scripts():
        return {}
        # return {"filemanager": ["filemanager.static", "scripts/filemanager.js", "async"]}
