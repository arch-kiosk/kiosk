import logging
from .defaultfilehandling import PluginDefaultFileHandling

_plugin_version_ = 1.1
_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginDefaultFileHandling(plugin_candidate, package)


def get_plugin_version():
    return _plugin_version_

