import sys

from flaskappplugin import FlaskAppPlugin
from pluggableflaskapp import PluggableFlaskApp
from pluginmanager import PluginManager
from inspect import signature
import logging


class FlaskAppPluginManager(PluginManager):
    _app: PluggableFlaskApp = None

    def _get_plugin(self, cls, plugin_candidate, package, init_plugin_configuration={}):

        print("trying to import {}".format(plugin_candidate))
        if hasattr(package, "init_app"):
            print("importing plugin {}".format(plugin_candidate))
            return super()._get_plugin(FlaskAppPlugin, plugin_candidate, package,
                                       init_plugin_configuration=init_plugin_configuration)
        print("plugin candidate {} has no init_app".format(plugin_candidate))
        logging.error(f"{self.__class__.__name__}._get_plugin: {plugin_candidate} has no init_app")
        return None

    def init_app(self, app, **kwargs):
        """
        initializes all plugins by calling init_app on every plugin instance.
        The named arguments in kwargs are only included in the call if the
        init_app method accepts more than the parameter "app".

        :param app: the flaks app object
        :param kwargs: named arguments. Plugins have the option to receive them.
        """
        if not self._app:
            self._app = app
            self._app.register_plugin_manager(self)

        for plugin in self.plugins:
            sig = signature(self.plugins[plugin].init_app)
            if len(sig.parameters) > 1:
                self.plugins[plugin].init_app(self._app, **kwargs)
            else:
                self.plugins[plugin].init_app(self._app)

        self.all_plugins_ready()
