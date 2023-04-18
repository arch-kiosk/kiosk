import os

import pytest
import config
import logging

from yamlconfigreader import YAMLConfigReader


class TestConfig:

    @pytest.fixture(autouse=True)
    def init_test(self):
        pass

    def test_singleton(self):
        cfg = config.Config()
        cfg.dummy = "dummy"
        cfg2 = config.Config()
        assert cfg == cfg2
        assert cfg2.dummy == "dummy"

        cfg2.dummy = "different"
        assert cfg2.dummy == "different"
        assert cfg.dummy == "different"

    def test_logging(self):
        def on_log(level, msg):
            self.last_level = level
            self.last_msg = msg

        self.last_level = None
        self.last_msg = None

        cfg = config.Config()

        cfg.debug("errormessage")
        assert self.last_level == None
        assert self.last_msg == None

        cfg.on_logging(on_log)

        cfg.error("errormessage")
        assert self.last_level == logging.ERROR
        assert self.last_msg == 'errormessage'

    def test_read_config(self):
        def get_config(config_id):
            if config_id == "empty_config": return {}
            if config_id == "first_config": return {"testkey": "testvalue"}
            if config_id == "second_config": return {"testkey2": "testvalue2"}

            return None

        cfg = config.Config()
        with pytest.raises(Exception) as excinfo:
            cfg.read_config("empty_config")
        assert "no reader" in str(excinfo.value)

        cfg.on_read_config(get_config)

        with pytest.raises(Exception) as excinfo:
            cfg.read_config("nonexistant_config")
        assert "not found" in str(excinfo.value)
        assert "nonexistant_config" in str(excinfo.value)

        cfg.read_config("empty_config")
        assert len(cfg._config) == 0

        cfg.read_config("first_config")
        assert len(cfg._config) == 1
        assert cfg.testkey == "testvalue"

        # we do that again to make sure that keys are not duplicated
        cfg.read_config("first_config")
        assert len(cfg._config) == 1
        assert cfg.testkey == "testvalue"

        cfg.read_config("second_config")
        assert len(cfg._config) == 2
        assert cfg.testkey == "testvalue"
        assert cfg.testkey2 == "testvalue2"

        # make sure that setting a configuration key works
        cfg["testkey"] = "new test value"
        assert cfg.testkey == "new test value"

    def test_import_config(self):
        def get_config(config_id):
            if config_id == "first_config": return {"import_configurations": {"config1": "import_config_1",
                                                                              "config2": "import_config_2"},
                                                    "test": {
                                                        "testkey": "testvalue",
                                                        "shared_key": "first value"},
                                                    }
            if config_id == "import_config_1": return {"test": {
                "testkey2": "testvalue2",
                "shared_key": "second value"}
            }
            if config_id == "import_config_2": return {"test": {
                "testkey3": "testvalue3",
                "shared_key": "third value"}
            }

            return None

        cfg = config.Config(import_mode=config.Config.IMPORT_MODE_FIRST_WINS)
        cfg.on_read_config(get_config)
        cfg.read_config("first_config")

        assert cfg.test["testkey"] == "testvalue"
        assert cfg.test["testkey2"] == "testvalue2"
        assert cfg.test["shared_key"] == "first value"

        with pytest.raises(KeyError) as excinfo:
            print(cfg.import_configurations)

        with pytest.raises(KeyError) as excinfo:
            print(cfg.config1)

    def test_import_config_2(self):
        # this time the second config should win with the shared key
        def get_config(config_id):
            if config_id == "first_config": return {"import_configurations": ["import_config_1",
                                                                              "import_config_2"],
                                                    "test": {
                                                        "testkey": "testvalue"},
                                                    }
            if config_id == "import_config_1": return {"test": {
                "testkey2": "testvalue2",
                "shared_key": "second value"}
            }
            if config_id == "import_config_2": return {"test": {
                "testkey3": "testvalue3",
                "shared_key": "third value"}
            }

            return None

        cfg = config.Config(import_mode=config.Config.IMPORT_MODE_FIRST_WINS)
        cfg.on_read_config(get_config)
        cfg.read_config("first_config")

        assert cfg.test["testkey"] == "testvalue"
        assert cfg.test["testkey2"] == "testvalue2"
        assert cfg.test["shared_key"] == "third value"

        with pytest.raises(KeyError) as excinfo:
            print(cfg.import_configurations)

        with pytest.raises(KeyError) as excinfo:
            print(cfg.config1)

    def test_import_config_with_override_mode(self):
        def get_config(config_id):
            if config_id == "first_config": return {"testkey": "testvalue",
                                                    "shared_key": "first value",
                                                    "import_configurations": {"config1": "import_config_1"}}
            if config_id == "import_config_1": return {"testkey2": "testvalue2",
                                                       "shared_key": "second value", }

            return None

        cfg = config.Config(import_mode=config.Config.IMPORT_MODE_OVERRIDE)
        cfg.on_read_config(get_config)
        cfg.read_config("first_config")

        assert cfg.testkey == "testvalue"
        assert cfg.testkey2 == "testvalue2"
        assert cfg.shared_key == "second value"

        with pytest.raises(KeyError) as excinfo:
            print(cfg.import_configurations)

        with pytest.raises(KeyError) as excinfo:
            print(cfg.config1)

    def test_resolve_symbols(self):
        cfg = config.Config()
        assert cfg._resolve_symbols("%PATH%", {"PATH": "resolved path"}) == "resolved path"
        assert cfg._resolve_symbols("%NOPATH%", {"PATH": "resolved path"}) == "!NOPATH!"
        assert cfg._resolve_symbols(r"%PATH1%\%PATH2%\%PATH3%",
                                    {"PATH1": "resolved path1",
                                     "PATH2": "resolved path2"}) == r"resolved path1\resolved path2\!PATH3!"

        cfg["SOMEPATH"] = "c:\\some_path"
        cfg["SOMEFILE"] = "%SOMEPATH%\\some_file"
        assert cfg.resolve_symbols(cfg["SOMEFILE"]) == "c:\\some_path\\some_file"

    def test_resolve_symbols_recursive(self):
        cfg = config.Config()

        cfg["SOMEMODULE"] = {"SOMEPATH1": "NOTING", "SOMEPATH2": "c:\\some_path"}
        cfg["SOMEOTHERMODULE"] = {"SOMEPATH3": "NOTING", "SOMEPATH4": "c:\\some_other_path"}
        cfg["SOMEFILE1"] = "%SOMEPATH2%\\some_file"
        cfg["SOMEFILE2"] = "%SOMEPATH4%\\some_other_file"
        assert cfg.resolve_symbols(cfg["SOMEFILE1"]) == "c:\\some_path\\some_file"
        assert cfg.resolve_symbols(cfg["SOMEFILE2"]) == "c:\\some_other_path\\some_other_file"

    def test_import_config_with_resolved_symbols(self):
        def get_config(config_id):
            if config_id == "first_config":
                return {"symbol1": "import_config_1",
                        "symbol2": "resolved symbol 2",
                        "import_configurations": ["%symbol1%"]}
            if config_id == "import_config_1":
                return {"testkey2": "testvalue2", "testkey3": "%symbol2%"}

            return None

        cfg = config.Config()
        cfg.on_read_config(get_config)
        cfg.read_config("first_config")

        assert cfg.symbol1 == "import_config_1"
        assert cfg.testkey2 == "testvalue2"
        assert cfg.testkey3 == "%symbol2%"
        assert cfg.resolve_symbols(cfg.testkey3) == "resolved symbol 2"

    def test_register_aliases(self):
        def get_config(config_id):
            if config_id == "config": return {"symbol1": "symbol1_value",
                                              "symbol2": "resolved symbol 2",
                                              "symbol3": "_%symbol1%_"}

            return None

        cfg = config.Config()
        cfg.on_read_config(get_config)
        cfg.read_config("config")

        assert cfg.symbol1 == "symbol1_value"

        with pytest.raises(KeyError) as excinfo:
            print(cfg.has_symbol3)

        cfg.register_aliases({"has_symbol3": "symbol3"})
        assert cfg.resolve_symbols(cfg.has_symbol3) == "_symbol1_value_"

    def test_add_to_config(self):
        def get_config(config_id):
            if config_id == "config":
                return {"base_key_1": {},
                        "base_key_2": {}
                        }

            return None

        cfg = config.Config()
        cfg.on_read_config(get_config)
        cfg.read_config("config")

        assert cfg.base_key_1 == {}

        cfg.set_base_key("FileFormats", {})
        assert cfg.FileFormats == {}

        cfg.set_base_key("FileFormats", {})
        assert cfg.FileFormats == {}

        cfg.FileFormats["NEF"] = {"id": "NEF", "title": "Nikon SLR raw file format"}
        assert cfg.FileFormats["NEF"]["title"] == "Nikon SLR raw file format"

    def test_base_custom_yml_config(self, shared_datadir):
        custom_config = os.path.join(shared_datadir, "custom_config.yml")
        yamlreader = YAMLConfigReader(custom_config)
        cfg = config.Config()
        cfg.base_path = shared_datadir
        cfg.on_read_config(yamlreader)
        cfg.read_config(custom_config)

        assert "some_path" in cfg.config
        # make clear that base path is resolved properly.
        assert cfg.base_path == str(shared_datadir)
        assert cfg.config["some_path"] == r'%base_path%\subpath'
        assert cfg.resolve_symbols(cfg.config["some_path"]) == str(os.path.join(shared_datadir, "subpath"))

        assert cfg.config["some_other_path"] == r'%custom_path%\subpath'
        assert cfg.resolve_symbols(cfg.config["some_other_path"]) == str(
            os.path.join(shared_datadir, r"custom\subpath"))

        assert cfg.config["some_value"] == "custom"
        assert cfg.config["some_default_value"] == "default"
