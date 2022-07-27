def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    """ just returns an object of the PluginFileMakerRecording class """
    from .pluginsimpleqcengine import PluginSimpleQCEngine
    return PluginSimpleQCEngine(plugin_candidate, package)

