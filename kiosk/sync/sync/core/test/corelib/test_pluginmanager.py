from plugin import Plugin
from pluginmanager import PluginManager
from unittest import mock as mock
from unittest.mock import call
import os

import pytest

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
plugin_path = os.path.join(test_path, r"console_app", "plugins")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestPluginManager:

    @pytest.fixture(autouse=True)
    def init_test(self):
        yield

    def test_basic_instantiation(self):
        plugin_manager = PluginManager(plugin_path)
        assert plugin_manager
        assert plugin_manager.plugin_count() == 3
        plugin_names = [x for x in plugin_manager.plugins]
        assert "plugin1" in plugin_names
        assert "plugin2" in plugin_names

    def test_delayed_instantiation(self):
        plugin_manager = PluginManager("")
        assert plugin_manager

        plugins = plugin_manager.load_plugins(plugin_path)
        assert len(plugins) == 3
        plugin_names = [x.name for x in plugins]
        assert "plugin1" in plugin_names
        assert "plugin2" in plugin_names

    def test_limited_instantiation(self):
        plugin_manager = PluginManager("")
        assert plugin_manager

        plugins = plugin_manager.load_plugins(plugin_path,
                                              ["plugin1"])
        assert len(plugins) == 1
        plugin_names = [x.name for x in plugins]
        assert "plugin1" in plugin_names

        plugins = plugin_manager.load_plugins(plugin_path,
                                              ["plugin2"])
        assert len(plugins) == 1
        plugin_names = [x.name for x in plugins]
        assert "plugin2" in plugin_names

        assert plugin_manager.plugin_count() == 2
        assert "plugin1" in plugin_manager.plugins
        assert "plugin2" in plugin_manager.plugins

    def test_plugins_ready(self):
        plugin_manager = PluginManager("")
        plugins = plugin_manager.load_plugins(plugin_path)
        assert plugin_manager.all_plugins_ready() == 3
        assert plugin_manager.plugins_ready(plugins) == 3
        assert plugin_manager.plugins_ready(["plugin1"]) == 1
        assert plugin_manager.plugins_ready(["plugin2"]) == 1

    def test_plugins_ready_with_args(self):
        plugin_manager = PluginManager("")
        plugins = plugin_manager.load_plugins(plugin_path)
        assert plugin_manager.all_plugins_ready(something=1) == 3
        assert plugin_manager.plugins_ready(plugins) == 3
        assert plugin_manager.plugins_ready(["plugin1"]) == 1
        assert plugin_manager.plugins_ready(["plugin2"]) == 1

    def test_is_plugin_active(self):
        def test_if_plugin_is_active(plugin_name):
            return plugin_name.lower() == "plugin1"

        plugin_manager = PluginManager("")
        assert plugin_manager

        plugin_manager.is_plugin_active = test_if_plugin_is_active
        plugins = plugin_manager.load_plugins(plugin_path)
        assert len(plugins) == 1
        plugin_names = [x.name for x in plugins]
        assert "plugin1" in plugin_names
        assert "plugin2" not in plugin_names

    def test_init_with_plugin_configuration(self):
        plugin_manager = PluginManager("")
        assert plugin_manager

        plugins = plugin_manager.load_plugins(plugin_path,
                                              init_plugin_configuration={"test": "correct result"})
        assert len(plugins) == 3
        plugin_names = [x.name for x in plugins]
        assert "plugin1" in plugin_names
        assert "plugin2" in plugin_names
        assert "plugin3" in plugin_names
        assert plugin_manager.get_plugin_by_name("plugin3").config["test"] == "correct result"
