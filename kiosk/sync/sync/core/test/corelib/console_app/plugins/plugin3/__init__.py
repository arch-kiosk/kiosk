from plugin import Plugin


class MyPlugin(Plugin):

    def __init__(self, name, package, init_plugin_configuration={}):
        self.config = init_plugin_configuration
        super().__init__(name, package)


def instantiate_plugin_object(name, package, init_plugin_configuration={}):

    return MyPlugin(name, package, init_plugin_configuration)


def init():
    return True

