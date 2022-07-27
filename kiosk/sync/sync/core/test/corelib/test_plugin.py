from core.plugin import Plugin
import pytest


class TestPlugin:

    @pytest.fixture(autouse=True)
    def init_test(self):
        yield

    @pytest.mark.parametrize('plugin,plugin_name',
                             [
                                 (Plugin('Name1', 'Package1'), 'Name1'),
                                 (Plugin('Name2', 'Package2'), 'Name2'),
                                 (Plugin('Name3', 'Package2'), 'Name3'),
                             ]
                             )
    def test_name(self, plugin, plugin_name):
        assert plugin.name == plugin_name


    @pytest.mark.parametrize('plugin,package_name',
                             [
                                 (Plugin('Name1', 'Package1'), 'Package1'),
                                 (Plugin('Name2', 'Package2'), 'Package2'),
                                 (Plugin('Name3', 'Package3'), 'Package3'),
                             ]
                             )
    def test_package(self, plugin,package_name):
        assert plugin.package == package_name
