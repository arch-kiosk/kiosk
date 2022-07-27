import logging
from .heicfilehandling import PluginHeicFileHandling

_plugin_version_ = 0.1
_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginHeicFileHandling(plugin_candidate, package)


