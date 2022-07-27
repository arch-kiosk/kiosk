import logging


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    """ just returns an object of the PluginFileMakerRecording class """
    from .pluginfilemakerrecording import PluginFileMakerRecording
    return PluginFileMakerRecording(plugin_candidate, package)

