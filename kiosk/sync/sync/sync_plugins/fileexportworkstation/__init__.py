import logging

import logging
from core.synchronization import Synchronization
from core.synchronizationplugin import SynchronizationPlugin
from sync_plugins.fileexportworkstation.fileexportworkstation import FileExportWorkstation


class PluginFileExportWorkstation(SynchronizationPlugin):
    _plugin_version = 0.1

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            app.type_repository.register_type("Workstation", "FileExportWorkstation", FileExportWorkstation)
        else:
            logging.error("Plugin {} can't connect to app.")
            return False

        # logging.debug("plugin for FileMaker Recording ready")
        return True


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    """ just returns an object of the PluginFileMakerRecording class """
    return PluginFileExportWorkstation(plugin_candidate, package)
