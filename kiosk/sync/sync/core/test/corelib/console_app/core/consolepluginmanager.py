from pluginmanager import PluginManager
from plugin import Plugin

class ConsolePluginManager(PluginManager):
    def _get_plugin(self, plugin_candidate, package):
        print("trying to import plugin {}".format(plugin_candidate))
        if hasattr(package, "init"):
            if not package.init():
                print("initialization failed, Plugin ignored.")
                return(None)
        print("Plugin1 initialized!")
        return(Plugin(plugin_candidate, package))
