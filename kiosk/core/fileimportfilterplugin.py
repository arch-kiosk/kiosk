from flaskappplugin import FlaskAppPlugin
import logging
import kioskglobals


class FileImportFilterPlugin(FlaskAppPlugin):
    #
    # class declarations
    #


    #
    # object declarations
    #

    def all_plugins_ready(self):
        super().all_plugins_ready()

    def init_app(self, app):
        super().init_app(app)

    def __init__(self, name, package):
        print(f"Instantiated a FileImportFilterPlugin for {name}")
        super().__init__(name, package)

    def __getattr__(self, name):
        """
        any method or attribute that is not in the plugin class itself might be defined in the package.
        This method here forwards the caller to that package item if available.

        :param name: name of attribute or function the call to which is being forwarded to the package
        :return: The method or attribute of the package or None if not accessible. Note that calling "None"
                 leads to an Exception

        """
        logging.warning(f"FileImportFilterPlugin.__get_attr__ triggered with {name}. This technique is not encouraged.")
        if hasattr(self.package, name):
            return getattr(self.package, name)
        else:
            return None

    def register_menus(self):
        if hasattr(self.package, "register_menus"):
            return self.package.register_menus()
        else:
            logging.debug(f"FileImportFilterPlugin({self.name}): no method register_menus")

    def register_global_scripts(self):
        if hasattr(self.package, "register_global_scripts"):
            logging.debug(f"FileImportFilterPlugin({self.name}): Registering global scripts")
            return self.package.register_global_scripts()
        else:
            logging.debug(f"FileImportFilterPlugin({self.name}): no method register_global_scripts")

    def plugin_config(self, key):
        try:
            if kioskglobals.cfg.kiosk[self.name]:
                return kioskglobals.cfg.kiosk[self.name][key]
        except Exception as e:
            logging.error("Exception in FileImportFilterPlugin.plugin_config: " + repr(e))
        return None
