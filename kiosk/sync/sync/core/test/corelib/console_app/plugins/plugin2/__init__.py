from plugin import Plugin


def instantiate_plugin_object(name, package):
    return Plugin(name, package)


def init():
    return True
