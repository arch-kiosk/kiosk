from plugin import Plugin
from pluginmanager import PluginManager
from core.synchronizationplugin import SynchronizationPlugin
import inspect
import logging


class SynchronizationPluginManager(PluginManager):
    app = None

    # this piece of code seemed to be entirely superfluous:
    # from now on Synchronization plugins simply use the same method instantiate_plugin_object like other plugins.
    # The only difference here was that instead init was used.
    #
    # I keep this for a while just in case I overlooked something
    #
    # def _get_plugin(self, cls, plugin_candidate, package, init_plugin_configuration={}):
    #     """
    #
    #     :param plugin_candidate:
    #     :param package:
    #     :return: a plugin instance (of type Plugin or subclass)
    #
    #     :todo: the super class uses the parameter cls, while here it seems to be superfluous. That does not look right
    #     """
    #
    #     print("trying to import plugin {}".format(plugin_candidate))
    #     if hasattr(package, "init"):
    #         specs = inspect.getfullargspec(package.init)
    #         if "init_plugin_configuration" in specs.args:
    #             plugin = package.init(plugin_candidate, package, init_plugin_configuration=init_plugin_configuration)
    #         else:
    #             plugin = package.init(plugin_candidate, package)
    #         if not plugin:
    #             print("initialization failed, Plugin ignored.")
    #             return None
    #         print("Plugin {} initialized!".format(plugin_candidate))
    #         return plugin
    #     else:
    #         return None

    def init_app(self, app, plugins_loaded=[]):
        rc = 0
        self.app = app
        if plugins_loaded:
            plugin_list = plugins_loaded
        else:
            plugin_list = self.plugins

        for plugin in plugin_list:
            if isinstance(plugin, str):
                plugin = self.plugins[plugin]
            if isinstance(plugin, Plugin):
                if hasattr(plugin, "init_app"):
                    plugin.init_app(self.app)
                else:
                    if hasattr(plugin, "name"):
                        self.plugins.pop(plugin.name)
                        logging.error(f"{self.__class__.__name__}.init_app: "
                                      f"{plugin.name} has no init_app method: Not a proper plugin -> removed.")
            else:
                logging.error(f"{self.__class__.__name__}.init_app: "
                              f"{plugin} is no Plugin.")

            rc += 1

        return rc

    def all_plugins_ready(self):
        for plugin in self.plugins:
            self.plugins[plugin].all_plugins_ready()

