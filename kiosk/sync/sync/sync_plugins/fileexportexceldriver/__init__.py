import logging
from core.synchronization import Synchronization
from core.synchronizationplugin import SynchronizationPlugin
from sync_plugins.fileexportexceldriver.fileexportexceldriver import PluginFileExportExcelDriver


_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    return PluginFileExportExcelDriver(plugin_candidate, package)


def get_plugin_version():
    return PluginFileExportExcelDriver.get_plugin_version()


