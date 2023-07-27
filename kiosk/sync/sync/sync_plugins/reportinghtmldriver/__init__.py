import logging
from core.synchronization import Synchronization
from core.synchronizationplugin import SynchronizationPlugin
from .reportinghtmldriver import PluginReportingHTMLDriver


_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginReportingHTMLDriver(plugin_candidate, package)


