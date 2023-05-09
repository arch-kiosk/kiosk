"""
    config.py: universal singleton configuration class

    Requires a reader function that actually produces a dictionary with configuration key/value pairs:
    config.on_read_config(config_reader: function ->dict)

    Values can be fetched either by dictionary notation or by attribute notation.
        value = config.some_key / value = config["some_key"]
    They should be set only by dictionary notation:
        config["some_key"] = "some value"

    by default symbols in %% - pairs are tried to be resolved against the dictionary:
        config["PATH"] = "c:\\some_path"
        config["FILE"] = "%PATH%\\some_file"
        assert config["FILE"] == "c:\\some_path\\some_file" results in true
    if that behaviour is not requested, hook in a None-handler:
        config.on_resolve_symbols_handler(None)
    or register your own symbol resolver:
        def my_own_resolver(key, dict):
            if key in dict:
                return(dict[key])
            else:
                return(key)

        config.on_resolve_symbols(my_own_resolver)

    Any configuration that has an "import_configurations" key is supposed to
    provide an array of references to further configurations under that key:
        {"import_configurations": ["another_configuration"]}
    Instead of an array it is also allowed to pass another dictionary:
        {"import_configurations": {"import1": "another_configuration"}}

    symbols are supported within the values in import_configurations.

"""

import logging
import os
import logginglib
import re
from dicttools import dict_merge
from dicttools import dict_search


class Config(logginglib.LoggingFeature):
    _instance = None  # Keep instance reference
    IMPORT_MODE_FIRST_WINS = 1  # when importing a value that is already there, keep the original value
    IMPORT_MODE_OVERRIDE = 2  # when importing a value that is already there, override the original value

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, import_mode=IMPORT_MODE_FIRST_WINS):
        self._on_read_config_handler = None
        self._symbol_cache = {}
        self._on_resolve_symbols_handler = self._resolve_symbols_recursive
        self._aliases = {}
        self._import_mode = import_mode
        self._base_path = ""
        # this made #875 go away but I have to understand why
        self._config = {}
        pass

    def __getattr__(self, item):
        if "_config" in self.__dict__:
            return self[item]

    @property
    def import_mode(self):
        return self._import_mode

    @import_mode.setter
    def import_mode(self, value):
        if value in [self.IMPORT_MODE_FIRST_WINS, self.IMPORT_MODE_OVERRIDE]:
            self._import_mode = value
        else:
            raise ValueError("import_mode must be Config.IMPORT_MODE_FIRST_WINS or Config.IMPORT_MODE_OVERRIDE")

    @property
    def base_path(self):
        if "base_path" in self._symbol_cache:
            return self._symbol_cache["base_path"]
        else:
            return ""

    @base_path.setter
    def base_path(self, value):
        self._symbol_cache["base_path"] = str(value)

    def __getitem__(self, item):
        if item not in self._config:
            if item in self._aliases:
                item = self._aliases[item]

        if item in self._config:
            value = self._config[item]
            return value
        else:
            raise KeyError("KeyError: {} does not exist.".format(item))

    def __setitem__(self, key, value):
        self._config[key] = value

    def has_key(self, key):
        """
        it is better to use this instead of x in cfg (which does not work)
        or has_attr, which raises exceptions if the key cannot be found.
        """
        return key in self._config

    def on_resolve_symbols(self, resolve_symbols_handler):
        """
        sets a handler that resolves symbols in strings
        """
        self._on_resolve_symbols_handler = resolve_symbols_handler

    def resolve_symbols(self, value):
        """
        resolves symbols in a string or list of strings and returns the result.
        If not handler to resolve symbols is active, value will just be returned as it is
        """
        if isinstance(value, str) and self._on_resolve_symbols_handler:
            return self._on_resolve_symbols_handler(value, self._config)
        elif isinstance(value, list) and self._on_resolve_symbols_handler:
            result = []
            for s in value:
                result.append(self._on_resolve_symbols_handler(s, self._config))
            return result
        else:
            return value

    @staticmethod
    def _resolve_symbols(config_str, current_config):
        c = 0
        if config_str:
            rx_symbol = re.compile(r"(%.*?%)", re.I)
            next_symbol = rx_symbol.search(config_str)
            while next_symbol:
                c += 1
                if c > 10:
                    logging.error("resolve_symbols_in_string exceed depth of 10")
                    return None

                key = next_symbol.group(0)[1:-1]
                if key in current_config:
                    value = current_config[key]
                else:
                    value = "!" + next_symbol.group(0)[1:-1] + "!"

                config_str = config_str.replace(next_symbol.group(0), value)
                next_symbol = rx_symbol.search(config_str)
        return config_str

    def _resolve_symbols_recursive(self, config_str, current_config):
        c = 0
        if config_str:
            rx_symbol = re.compile(r"(%.*?%)", re.I)
            next_symbol = rx_symbol.search(config_str)
            while next_symbol:
                c += 1
                if c > 10:
                    logging.error("resolve_symbols_in_string exceed depth of 10")
                    return None

                key = next_symbol.group(0)[1:-1]
                value = dict_search(current_config, key, self._symbol_cache)
                if not value:
                    value = "!" + next_symbol.group(0)[1:-1] + "!"

                config_str = config_str.replace(next_symbol.group(0), value)
                next_symbol = rx_symbol.search(config_str)
        return config_str

    def on_read_config(self, get_config_dict):
        self._on_read_config_handler = get_config_dict

    def reset_config(self):
        self._config = {}

    def read_config(self, config_to_add, import_mode=None):
        if not import_mode:
            import_mode = self.import_mode

        if not self._on_read_config_handler:
            raise Exception("no reader registered: use get_config_dict_handler")

        new_config = self._on_read_config_handler(config_to_add)
        if isinstance(new_config, dict):
            if "import_configurations" in new_config:
                import_cfg = new_config.pop("import_configurations")
            else:
                import_cfg = None

            if import_mode == self.IMPORT_MODE_FIRST_WINS:
                #  self._config = {**new_config, **self._config}
                dict_merge(new_config, self._config)
                self._config = new_config

            elif import_mode == self.IMPORT_MODE_OVERRIDE:
                #  self._config = {**self._config, **new_config}
                dict_merge(self._config, new_config)
            else:
                logging.warning(f"{self.__class__.__name__}.read_config: unknown import_mode {import_mode} "
                                f"when merging configs.")

            if import_cfg:
                # I do not like this solution, but it is the quickest way to solve #2037 without a major
                # overhaul of the config source code. The issue is that I load the config keys of the config
                # that import other configs FIRST. Then I merge those other configs with the already existing
                # config. That's why I must use import_mode_first_wins. BUT if two configs are imported I expect
                # the second to win over the first. And that was not the case with 'for cfg in import_cfg'.
                # a better solution would be to separate the config that impors from its own keys.

                for cfg in reversed(import_cfg):
                    if isinstance(import_cfg, dict):
                        import_config: str = import_cfg[cfg]
                    else:
                        import_config: str = cfg

                    if self._on_resolve_symbols_handler:
                        import_config = self._on_resolve_symbols_handler(config_str=import_config,
                                                                         current_config=self._config)
                    if not os.path.dirname(import_config):
                        base_dir = os.path.dirname(config_to_add)
                        import_config = os.path.join(base_dir, import_config)
                    self.read_config(import_config)

        else:
            raise Exception("Config {} not found.".format(config_to_add))

    def register_aliases(self, aliases: dict):
        """ registers alias attribute names for config keys.
            e.G. an existing config key config["test_mode"] can be addressed as
                config.is_test_mode if an alias {"is_test_mode": "test_mode"} is registered for it.
        """
        self._aliases = {**self._aliases, **aliases}

    def set_base_key(self, key, value):
        """
        sets a configuration key at runtime. Purpose is to add runtime configuration keys that are not
        stored in a file and set by the user. This way the configuration acts like the registry.
        This can only work for the first level keys that are addressed by config.key directly.
        If you want to add a subkey, just use it as a dict:
        config.sync["fileformats"] = {"NEF": {id="NEF", title: "RAW FILE FORMAT"}}
        :param key: first level config key
        :param value: usually a dict. But can be everything.
        """
        self._config[key] = value
