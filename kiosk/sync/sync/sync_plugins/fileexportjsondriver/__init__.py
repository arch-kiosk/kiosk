from sync_plugins.fileexportjsondriver.pluginfileexportjsondriver import PluginFileExportJSONDriver


_plugin_ = None

def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginFileExportJSONDriver(plugin_candidate, package)


def get_plugin_version():
    return PluginFileExportJSONDriver.get_plugin_version()


