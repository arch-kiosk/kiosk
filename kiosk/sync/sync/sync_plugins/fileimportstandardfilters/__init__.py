import logging
from .fileimportstandardfilters import PluginFileImportStandardFilters
from .fileimportstandardfilters import FileImportStandardFileFilter
from .fileimportstandardfilters import FileImportStandardFolderFilter
from .fileimportstandardfilters import FileImportStandardValuesFilter

_plugin_version_ = 0.1
_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginFileImportStandardFilters(plugin_candidate, package)


def get_plugin_version():
    return _plugin_version_

