import logging
from .jp2filehandling import Pluginjp2FileHandling

_plugin_version_ = 0.1
_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return Pluginjp2FileHandling(plugin_candidate, package)


