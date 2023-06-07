import logging
from core.synchronization import Synchronization
from core.synchronizationplugin import SynchronizationPlugin
from .filemakerworkstation import FileMakerWorkstation


class PluginFileMakerRecording(SynchronizationPlugin):
    _plugin_version = 0.1

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            app.type_repository.register_type("Workstation", "FileMakerWorkstation", FileMakerWorkstation)
        else:
            logging.error("Plugin {} can't connect to app.")
            return False

        # logging.debug("plugin for FileMaker Recording ready")
        return True
