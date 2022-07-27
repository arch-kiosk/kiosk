import os
import importlib
import sys
import logging
import stat

from plugin import Plugin


# yup, that is not DRY
def register_core_paths(paths):
    absolute_paths = [os.path.abspath(p) for p in paths]
    for p in absolute_paths:
        if p not in sys.path:
            sys.path.append(p)


class PluginManager:

    def __init__(self, plugin_dir=None):
        self.plugins = {}
        self._plugin_dir = plugin_dir
        self.is_plugin_active = None

        if plugin_dir:
            self.load_plugins(plugin_dir)

    @staticmethod
    def get_available_plugins(plugin_dir):
        if not os.path.isdir(plugin_dir):
            raise Exception(f"pluginmanager.get_available_plugins: plugin_dir {plugin_dir} is not a directory")

        plugin_candidates = [name
                             for name in os.listdir(plugin_dir)
                             if os.path.isdir(os.path.join(plugin_dir, name)) and
                             not (os.stat(
                                 os.path.join(plugin_dir, name)).st_file_attributes & stat.FILE_ATTRIBUTE_HIDDEN) and
                             not name[0] == "."
                             ]
        return plugin_candidates

    # just loads the plugin-modules, but does not call init_app on them.
    # returns only the loaded plugins in an array.
    # the restrict_to_plugins array wants the foldernames of the plugins that should be loaded.
    # If it is empty, a l l found plugins will be loaded.
    # LK, 11/10/2018: Added the restriction to plugins and the return of the loaded plugins
    #                 Not any longer a private method, plugins cannot accidentally be loaded twice.
    def load_plugins(self, plugin_dir, restrict_to_plugins=[], init_plugin_configuration={}):
        plugins_loaded = []

        if not os.path.isdir(plugin_dir):
            raise Exception("plugin_dir {} is not a directory".format(plugin_dir))

        register_core_paths([plugin_dir])
        plugin_candidates = [name
                             for name in self.get_available_plugins(plugin_dir) if
                             (
                                     ((not restrict_to_plugins) or (name in restrict_to_plugins))
                                     and
                                     ((not self.is_plugin_active) or (self.is_plugin_active(name)))
                             )
                             ]

        mcpworker_present = "mcpcore.mcpworker" in sys.modules
        for plugin_candidate in plugin_candidates:
            if plugin_candidate not in self.plugins:
                package = importlib.import_module(plugin_candidate)
                if not mcpworker_present and "mcpcore.mcpworker" in sys.modules:
                    logging.error(f"PluginManager.load_plugins: Detected mcpcore.mcpworker "
                                  f"in plugin candidate {plugin_candidate}")
                    mcpworker_present = True
                plugin = self._get_plugin(Plugin, plugin_candidate, package, init_plugin_configuration)
                if plugin:
                    self.plugins[plugin_candidate] = plugin
                    plugins_loaded.append(plugin)
            else:
                logging.debug(
                    f"PluginManager.load_plugins: "
                    f"Attempt to load plugin {plugin_candidate} again. Not allowed! ")

        return plugins_loaded

    def _get_plugin(self, cls, plugin_candidate, package, init_plugin_configuration={}):
        return cls.create_plugin(plugin_candidate, package, init_plugin_configuration)

    # calls init_app on all plugins
    def all_plugins_ready(self, **kwargs):
        c = 0
        for plugin in self.plugins:
            self.plugins[plugin].all_plugins_ready(**kwargs)
            c += 1

        return c

    # calls init_app on a list of plugin-objects or plugin names
    def plugins_ready(self, plugins=[]):
        c = 0
        for plugin in plugins:
            if isinstance(plugin, str):
                try:
                    plugin = self.plugins[plugin]
                except Exception as e:
                    logging.error(f"Exception in PluginManager.plugins_ready on plugin {plugin}: {repr(e)}")
                    plugin = None

            if plugin:
                plugin.all_plugins_ready()
                c += 1

        return c

    def plugin_count(self):
        return len(self.plugins)

    def get_plugin_by_name(self, plugin_name):
        if plugin_name in self.plugins:
            return self.plugins[plugin_name]
        return None
