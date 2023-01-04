import logging
from .webpfilehandling import PluginWebPFileHandling

_plugin_version_ = 0.1
_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginWebPFileHandling(plugin_candidate, package)


