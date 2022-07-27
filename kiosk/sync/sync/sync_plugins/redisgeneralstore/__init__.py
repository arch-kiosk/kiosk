from .redisgeneralstore import PluginRedisGeneralStore


_plugin_ = None


def init_app(app):
    # this is a hybrid plugin. It will be loaded by sync and kiosk
    pass


def instantiate_plugin_object(plugin_candidate, package):
    return PluginRedisGeneralStore(plugin_candidate, package)
