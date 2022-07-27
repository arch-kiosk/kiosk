from .svgfilehandling import PluginSvgFileHandling

_plugin_version_ = 0.1
_plugin_ = None


def instantiate_plugin_object(plugin_candidate, package):
    return PluginSvgFileHandling(plugin_candidate, package)


def get_plugin_version():
    return _plugin_version_

