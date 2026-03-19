import logging
from sync_plugins.fileexportjsondriver.fileexportjsontabledriver import FileExportJSONTableDriver
from sync_plugins.fileexportjsondriver.fileexportjsondocdriver import FileExportJSONDocDriver


from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin

# ************************************************************************
# Plugin code for PluginFileExportExcelDriver
# ************************************************************************
class PluginFileExportJSONDriver(SynchronizationPlugin):

    _plugin_version = 0.1

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            FileExportJSONTableDriver.register(app.type_repository)
            FileExportJSONDocDriver.register(app.type_repository)
            logging.debug("PluginFileExportJSONDriver: plugin and driver type registered")
        else:
            logging.error("PluginFileExportJSONDriver: plugin and driver type could not be registered due to no app.")
            return False

        return True
