import inspect


class Plugin:
    def __init__(self, name, package):
        self._name = name
        self._package = package
        if hasattr(self._package, "register_plugin_instance"):
            self._package.register_plugin_instance(self)

    @property
    def name(self):
        return self._name

    @property
    def package(self):
        return self._package

    def all_plugins_ready(self, **kwargs):
        """
        calls "all_plugins_ready" on all plugins with the given kwargs.
        If the package does not support named arguments it will be called without.

        @param kwargs:
        """
        if hasattr(self._package, "all_plugins_ready"):
            sig = inspect.signature(self._package.all_plugins_ready)
            if len(sig.parameters) > 0:
                self._package.all_plugins_ready(**kwargs)
            else:
                self._package.all_plugins_ready()


    @classmethod
    def create_plugin(cls, name, package, init_plugin_configuration={}):
        if hasattr(package, "instantiate_plugin_object"):
            specs = inspect.getfullargspec(package.instantiate_plugin_object)
            if "init_plugin_configuration" in specs.args:
                return package.instantiate_plugin_object(name, package,
                                                         init_plugin_configuration=init_plugin_configuration)
            else:
                return package.instantiate_plugin_object(name, package)
        else:
            print(f"Instantiating {name} as {cls.__name__}")
            return cls(name, package)
