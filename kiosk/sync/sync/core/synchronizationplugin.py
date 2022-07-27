from plugin import Plugin
import logging


class SynchronizationPlugin(Plugin):
    app = None

    _plugin_version = 0

    def init_app(self, app):
        self.app = app

    @classmethod
    def get_plugin_version(cls):
        return cls._plugin_version

