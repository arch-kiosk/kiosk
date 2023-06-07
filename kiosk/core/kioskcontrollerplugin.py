from typing import List, Union, Tuple

from flaskappplugin import FlaskAppPlugin
import logging
import kioskglobals
from kioskmenuitem import KioskMenuItem


class KioskControllerPlugin(FlaskAppPlugin):
    #
    # class declarations
    #

    _controller_plugins_ = {}
    _plugin_version = 0

    def get_plugin_version(self):
        return self._plugin_version

    @classmethod
    def add_to_controller_plugins(cls, plugin):
        cls._controller_plugins_[plugin.name] = plugin

    @classmethod
    def get_plugin_for_controller(cls, controller_name):
        try:
            return cls._controller_plugins_[controller_name]
        except:
            return None

    #
    # object declarations
    #

    allowed_operations = {}
    is_main_index = False

    def all_plugins_ready(self):
        if self.plugin_config("is_main_index"):
            try:
                self.package.register_index(self._app)
                self.is_main_index = True
            except Exception as e:
                logging.error("Exception in ControllerPlugin._init_ when calling register_index: " + repr(e))
        super().all_plugins_ready()

    def init_app(self, app, **kwargs):
        super().init_app(app, **kwargs)
        self.add_to_controller_plugins(self)

    def __init__(self, name, package, plugin_version=0):
        # print(f"Instantiated a KioskControllerPlugin for {name}")
        if plugin_version:
            self._plugin_version = plugin_version
        super().__init__(name, package)

    def __getattr__(self, name):
        """
        any method or attribute that is not in the plugin class itself might be defined in the package.
        This method here forwards the caller to that package item if available.

        change 08.01.2021: so far this returned None if not accessible. That is not what python wants.
                           now I am raising an AttributeError. That's what python expects and only then
                           does the hasAttr function work properly on the instance. I expect side effects ...

        :param name: name of attribute or function the call to which is being forwarded to the package
        :return: The method or attribute of the package.

        """
        if hasattr(self.package, name):
            logging.warning(f"kioskcontrollerplugin.__get_attr__: triggered with {name}. "
                            f"Rerouting a call from the plugin instance to the package like this is not encouraged.")
            return getattr(self.package, name)
        else:
            raise AttributeError (f"{self.__class__.__name__}.__get_attr__: unknown attribute {name}")

    def register_menus(self):
        if hasattr(self.package, "register_menus"):
            try:
                logging.debug("KioskControllerPlugin: Registering menus")
                return self.package.register_menus()
            except BaseException as e:
                logging.error(f"KioskControllerPlugin.register_menus: "
                              f"Exception in {self.package}.register_menus: {repr(e)}")
        else:
            logging.debug(f"KioskControllerPlugin({self.name}): no method register_menus")

        return None

    def register_global_scripts(self):
        if hasattr(self.package,"register_global_scripts"):
            logging.debug(f"KioskControllerPlugin({self.name}): Registering global scripts")
            return self.package.register_global_scripts()
        else:
            logging.debug(f"KioskControllerPlugin({self.name}): no method register_global_scripts")

    def register_global_routes(self) -> List[Union[str, Tuple[str, str]]]:
        if hasattr(self.package, "register_global_routes"):
            logging.debug(f"KioskControllerPlugin({self.name}): Registering global routes")
            return self.package.register_global_routes()
        else:
            return None

    def is_operation_allowed(self, operation):
        if not self.allowed_operations:
            self.allowed_operations = self.plugin_config("allow_operations")
        if self.allowed_operations:
            return operation.lower() in self.allowed_operations
        else:
            return True

    def is_any_operation_allowed(self):
        allowed_operations = self.plugin_config("allow_operations")
        if not allowed_operations:
            return False
        else:
            return True

    def plugin_config(self, key):
        try:
            if kioskglobals.cfg.kiosk[self.name]:
                if key in kioskglobals.cfg.kiosk[self.name]:
                    return kioskglobals.cfg.kiosk[self.name][key]
                # else:
                #     logging.debug(f"KioskControllerPlugin.plugin_config. Config of plugin {self.name}: "
                #                   f"Key {key} not configured "
                #                   f"- might be an noteworthy.")
            else:
                logging.debug(f"KioskControllerPlugin.plugin_config. Config of plugin {self.name}: "
                              f"no entry in config at all."
                              f"- might be an error.")
        except Exception as e:
            logging.error(f"Exception in KioskControllerPlugin.plugin_config for plugin {self.name}: {repr(e)}.")
        return None

    # def __init__(self, app, name, blueprint):
    #     self.app = app
    #     self.name = name
    #     self.app.register_blueprint(blueprint)
    #     if self.plugin_config("is_main_index"):
    #         try:
    #             self.register_index()
    #             self.is_main_index = True
    #         except Exception as e:
    #             logging.error("Exception in ControllerPlugin._init_ when calling register_index: " + repr(e))

    def get_menu_config(self):
        try:
            menu_cfg = self.plugin_config("menu")
        except:
            menu_cfg = {}
            logging.warning(f"Menu configuration for { self.name } not found.")
        return menu_cfg

    def show_menu_entry(self, menu_entry: KioskMenuItem):
        rc = menu_entry.allow_in_all_plugins ^ (self.name in menu_entry.plugin_exceptions)
        # print(menu_entry.name, menu_entry.allow_in_all_plugins, self.name in menu_entry.plugin_exceptions, rc)
        return rc


def get_plugin_for_controller(name):
    plugin = KioskControllerPlugin.get_plugin_for_controller(name)
    # print("############# get_plugin from controller {}".format(name) + ": ", plugin)
    return plugin

