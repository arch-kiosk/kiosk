import pytest
import os

import kioskstdlib
from kioskconfig import KioskConfig
from config import Config

from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")
base_config_file = os.path.join(test_path, r"config", "test_base_config.yml")
project_config_file = os.path.join(test_path, r"config", "test_project_config.yml")

log_file = os.path.join(test_path, r"log", "test_log.log")


# @pytest.mark.skip
class TestSyncConfig(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file,
                               log_file=log_file)

    def test_instantiation(self, config):
        assert config.config

    def test_some_more_config_keys(self, config):
        kiosk_config = config
        print("\n")
        print(kiosk_config.get_logfile())
        assert "filemakerrecording" in kiosk_config.autoload_plugins
        assert kiosk_config.sync_plugin_directory.lower() == os.path.join(
            self.get_kiosk_base_path_from_test_path(test_path),
            'sync', 'sync', 'sync_plugins').lower()
        assert kiosk_config.resolve_symbols(
            kiosk_config.config["dataset_definition"]).lower() == os.path.join(
            self.get_kiosk_base_path_from_test_path(test_path),
            'config', 'dsd', 'default_dsd3.yml').lower()

    def test_kiosk_section(self, config):
        kiosk_config = config
        print("\n")
        print(kiosk_config.get_logfile())
        assert kiosk_config.kiosk
        assert kiosk_config.kiosk["base_path"].lower() == os.path.join(
            self.get_kiosk_base_path_from_test_path(test_path)).lower()
        assert kiosk_config.get_project_id() == "test"
        assert kiosk_config.file_import

    def test_base_and_project_config(self):
        kiosk_config = self.get_config(config_file=project_config_file)
        assert kiosk_config.kiosk
        assert kiosk_config.get_file_repository().lower() == os.path.join(
            self.get_kiosk_base_path_from_test_path(test_path),
            'test', 'core', 'sync', 'file_repository').lower()
        assert kiosk_config.get_project_id() == "test"
        assert kiosk_config.file_import

    def test_get_transfer_dir(self, shared_datadir):
        kiosk_config = self.get_config(config_file=project_config_file)
        error_msg, transfer_dir = kiosk_config.get_transfer_dir(check_unpack_kiosk=False)
        assert error_msg == "transfer_dir not configured."
        expected_transfer_dir = os.path.join(shared_datadir, "transfer")
        kiosk_config.config["transfer_dir"] = expected_transfer_dir
        error_msg, transfer_dir = kiosk_config.get_transfer_dir(check_unpack_kiosk=False)
        assert error_msg == f"Transfer directory {expected_transfer_dir} does not exist."
        os.mkdir(expected_transfer_dir)
        error_msg, transfer_dir = kiosk_config.get_transfer_dir(check_unpack_kiosk=False)
        assert error_msg == ""
        error_msg, transfer_dir = kiosk_config.get_transfer_dir(check_unpack_kiosk=True)
        assert error_msg == f"No unpackkiosk directory installed in {expected_transfer_dir}"

    def test_get_create_transfer_dir(self, shared_datadir):
        kiosk_config = self.get_config(config_file=project_config_file)
        transfer_dir = kiosk_config.get_create_transfer_dir()
        assert transfer_dir == os.path.join(kioskstdlib.get_parent_dir(kiosk_config.base_path), "transfer")
