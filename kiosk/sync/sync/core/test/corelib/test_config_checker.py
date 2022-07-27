import pytest
from config import Config
from configchecker import ConfigChecker


class TestConfigChecker:
    def test_register_config_checker(self):
        cfg = Config()
        checker = ConfigChecker(cfg)
        assert checker.check_config()

        checker.register_config_checker(lambda x: (False, {"Nothing is ok"}))
        assert not checker.check_config()

    def test_check_config(self):
        cfg = Config()
        checker = ConfigChecker(cfg)

        checker.register_config_checker(lambda x: (True, {"Still everything is ok"}))
        assert checker.check_config()

        checker.register_config_checker(lambda x: (ConfigChecker.CONFIG_WARNING, {"A Warning, but still awesome"}))
        assert checker.check_config()

        checker.register_config_checker(lambda x: (ConfigChecker.CONFIG_ERROR, {"Blast."}))
        assert not checker.check_config()

        checker.register_config_checker(lambda x: (True, {"Does not help."}))
        assert not checker.check_config()

        with pytest.raises(TypeError) as excinfo:
            checker.register_config_checker("Not a function")

    def test_get_config_report(self):
        cfg = Config()
        checker = ConfigChecker(cfg)

        lst = checker.get_report()
        assert (not lst)

        checker.register_config_checker(lambda x: (True, {"Everything is ok"}))
        checker.register_config_checker(lambda x: (ConfigChecker.CONFIG_WARNING, {"Warning"}))
        checker.register_config_checker(lambda x: (ConfigChecker.CONFIG_ERROR, {"Error"}))
        assert not checker.check_config()
        assert len(checker.get_report()) == 3
        assert len(checker.get_report(ConfigChecker.CONFIG_OK)) == 3
        assert len(checker.get_report(ConfigChecker.CONFIG_WARNING)) == 2
        assert len(checker.get_report(ConfigChecker.CONFIG_ERROR)) == 1

        assert "ERROR" in str(checker.get_report(ConfigChecker.CONFIG_ERROR))
        assert "WARNING" not in str(checker.get_report(ConfigChecker.CONFIG_ERROR))
        assert "OK" not in str(checker.get_report(ConfigChecker.CONFIG_ERROR))

        assert "ERROR" in str(checker.get_report(ConfigChecker.CONFIG_WARNING))
        assert "WARNING" in str(checker.get_report(ConfigChecker.CONFIG_WARNING))
        assert "OK" not in str(checker.get_report(ConfigChecker.CONFIG_WARNING))

        assert "ERROR" in str(checker.get_report(ConfigChecker.CONFIG_OK))
        assert "WARNING" in str(checker.get_report(ConfigChecker.CONFIG_OK))
        assert "OK" not in str(checker.get_report(ConfigChecker.CONFIG_OK))

    def test_config_checker_config(self):
        def read_config(config_id):
            return {"key1": "value1",
                    "key2": "value2"}

        def checker_key1(cfg):
            if cfg.has_key("key1"):
                if cfg["key1"] == "value1":
                    return (ConfigChecker.CONFIG_OK, "OK")
                return (ConfigChecker.CONFIG_WARNING, "key1 has the wrong value.")
            return (ConfigChecker.CONFIG_ERROR, "key1 does not exist")

        def checker_key2(cfg):
            if cfg.has_key("key2"):
                if cfg["key2"] == "value2":
                    return (ConfigChecker.CONFIG_OK, "OK")
                return (ConfigChecker.CONFIG_WARNING, "key2 has the wrong value.")
            return (ConfigChecker.CONFIG_ERROR, "key2 does not exist")

        cfg = Config()
        cfg.on_read_config(read_config)
        cfg.read_config("")
        assert cfg.key1 == "value1"

        config_checker = ConfigChecker(cfg)
        config_checker.register_config_checker(checker_key1)
        config_checker.register_config_checker(checker_key2)
        assert config_checker.check_config()
        assert len(config_checker.get_report(ConfigChecker.CONFIG_ERROR)) == 0

        cfg["key1"] = "not key1"
        assert config_checker.check_config()
        assert len(config_checker.get_report(ConfigChecker.CONFIG_ERROR)) == 0
        assert len(config_checker.get_report(ConfigChecker.CONFIG_WARNING)) == 1
        cfg._config.pop("key1")
        assert len(config_checker.get_report(ConfigChecker.CONFIG_ERROR)) == 1

# test = TestConfigChecker()
# test.test_config_checker_config()
