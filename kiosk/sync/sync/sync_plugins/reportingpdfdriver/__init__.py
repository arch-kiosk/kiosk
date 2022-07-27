import logging
from core.synchronization import Synchronization
from core.synchronizationplugin import SynchronizationPlugin
from .reportingpdfdriver import PluginReportingPDFDriver


_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginReportingPDFDriver(plugin_candidate, package)


