import logging
from synchronizationplugin import SynchronizationPlugin
from .fileimportexiffilter import PluginFileImportExifFilter

_plugin_version_ = 0.1
_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginFileImportExifFilter(plugin_candidate, package)


def get_plugin_version():
    return _plugin_version_

