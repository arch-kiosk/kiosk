import sys

from pluggableflaskapp import PluggableFlaskApp
import flaskapppluginmanager
from config import Config
from yamlconfigreader import YAMLConfigReader


class AppFactory:
    #Just a helper that translates a the keys of a dictionary into an object with attributes
    class FlaskConfigObject:
        def __init__(self, key_value_pairs):
            self.__dict__ = {**self.__dict__, **key_value_pairs}


    @classmethod
    def create_app(cls, config_name: str=None, root_path=None) -> object:
        if not config_name:
            raise Exception("AppFactory.create_app method was called without a configuration file.")

        return cls._create_std_app(config_name, root_path=root_path)

    @classmethod
    def _create_std_app(cls, config_file, root_path=None):
        # loads all the plugins in the plugin directory
        cfg = cls._load_config_from_yaml_file(config_file)

        plugin_manager = flaskapppluginmanager.FlaskAppPluginManager(cfg.plugin_directory)

        app = PluggableFlaskApp(__name__, root_path=root_path)
        # the configuration for Flask itself is expected in the key "Flask" in our config file
        app.config.from_object(cls.FlaskConfigObject(cfg["Flask"]))

        # registeres the plugin manager with the app and
        # initializes all the plugins with the app object
        plugin_manager.init_app(app)

        if "mcpcore.mcpworker" in sys.modules:
            print("mcpcore.mcpworker in sys.modules. THAT IS NOT ALLOWED!")
            raise Exception("AppFactory.create_std_app: Detected mcpcore.mcpworker in sys.modules. That is not allowed.")

        return app

    @classmethod
    def _load_config_from_yaml_file(cls, filename):
        cfg = Config()
        cfg.on_read_config(YAMLConfigReader(None))
        cfg.read_config(filename)
        return cfg

