from pprint import pprint
from time import sleep

import pytest
from pathlib import Path
import os

from pluggableflaskapp import PluggableFlaskApp
from typerepository import TypeRepository

from kioskfilemanagerbridge import KioskFileManagerBridge
from plugins.filemanagerplugin.filemanagerdirectory import FileManagerDirectory
from test.testhelpers import KioskPyTestHelper
from kioskappfactory import KioskAppFactory
import kioskglobals
from kiosksqldb import KioskSQLDb

from plugins.filemanagerplugin.kioskfilemanagerinterface import KioskFileManagerInterface
from kioskrepositorytypes import TYPE_FILE_MANAGER_INTERFACE

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
kiosk_root_path = Path(test_path).parent.parent.parent

log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskFileManagerInterface(KioskPyTestHelper):
    @pytest.fixture(scope='module')
    def cfg(self):
        cfg = self.get_standard_test_config(__file__, test_config_file=config_file)

    @pytest.fixture
    def kiosk_app(self, cfg):
        print(f"config_file: {config_file}, root_path: {kiosk_root_path}")
        kiosk_app = KioskAppFactory.create_app(config_file, root_path=kiosk_root_path)
        kiosk_app.config["TESTING"] = True
        kiosk_app.config["SERVER_NAME"] = "localhost"
        assert "emergency_mode" not in kiosk_app.config
        KioskSQLDb.truncate_table("kiosk_filemanager_directories")
        yield kiosk_app

    @pytest.fixture
    def test_client(self, kiosk_app):
        with kiosk_app.test_client() as client:
            with kiosk_app.app_context():
                yield client

    def test_init(self, kiosk_app):
        bridge: KioskFileManagerBridge = KioskFileManagerBridge.instantiate()
        assert bridge

    def test_assert_file_transfer_directory(self, kiosk_app):
        bridge: KioskFileManagerBridge = KioskFileManagerBridge.instantiate()
        assert bridge

        fdir = FileManagerDirectory()
        if fdir.get("export"):
            fdir.delete()
        assert not fdir.get("export")

        assert bridge.assert_file_transfer_directory("export", "this is a test alias",
                                                     "%base_path%\\plugins\\filemanagerplugin\\test", True)
        assert fdir.get("export")

        assert fdir.alias == "export"
        assert fdir.physical_directory == test_path
        assert fdir.description == "this is a test alias"
        assert fdir.server_restart

        fdir = FileManagerDirectory()
        assert fdir.get("export")

        # changing description and restart_server should not lead to a change
        # (because it might have been configured by the admin)
        assert bridge.assert_file_transfer_directory("export", "this is a new description",
                                                     "%base_path%\\plugins\\filemanagerplugin\\test", False)

        assert fdir.get("export")

        assert fdir.alias == "export"
        assert fdir.physical_directory == test_path
        assert fdir.description == "this is a test alias"
        assert fdir.server_restart

        # changing the path should also change the description and restart_server
        assert bridge.assert_file_transfer_directory("export", "this is a new description",
                                                     "%base_path%\\plugins\\filemanagerplugin\\test\\log", False)

        assert fdir.get("export")

        assert fdir.alias == "export"
        assert fdir.physical_directory == os.path.join(test_path, "log")
        assert fdir.description == "this is a new description"
        assert not fdir.server_restart

    def test_url_for_directory(self, kiosk_app, test_client):
        bridge: KioskFileManagerBridge = KioskFileManagerBridge.instantiate()
        assert bridge
        assert bridge.url_for_directory("export") == "http://localhost/filemanager/export"
