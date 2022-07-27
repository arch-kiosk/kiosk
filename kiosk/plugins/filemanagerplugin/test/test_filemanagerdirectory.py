from time import sleep

import pytest
from pathlib import Path
import os

from pluggableflaskapp import PluggableFlaskApp

from test.testhelpers import KioskPyTestHelper
from kioskappfactory import KioskAppFactory
import kioskglobals
from kiosksqldb import KioskSQLDb

from plugins.filemanagerplugin.filemanagerdirectory import FileManagerDirectory

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
kiosk_root_path = Path(test_path).parent.parent.parent

log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFileManagerDirectory(KioskPyTestHelper):
    @pytest.fixture(scope='module')
    def cfg(self):
        cfg = self.get_standard_test_config(__file__, test_config_file=config_file)
        return cfg

    @pytest.fixture
    def kiosk_app(self, cfg):
        print(f"config_file: {config_file}, root_path: {kiosk_root_path}")
        cur = self.get_urapdb(cfg)
        cur.close()
        kiosk_app = KioskAppFactory.create_app(config_file, root_path=kiosk_root_path)
        kiosk_app.config["TESTING"] = True
        assert "emergency_mode" not in kiosk_app.config
        KioskSQLDb.truncate_table("kiosk_filemanager_directories")
        yield kiosk_app

    @pytest.fixture
    def test_client(self, kiosk_app):
        with kiosk_app.test_client() as client:
            with kiosk_app.app_context():
                yield client

    def test_add_and_get_directory(self, kiosk_app: PluggableFlaskApp):
        fdir = FileManagerDirectory()
        fdir.alias = "test_1"
        fdir.description = "description 1"
        fdir.path = "kiosk"
        assert fdir.add()
        fdir2 = FileManagerDirectory()
        assert fdir2.get("test_1")
        assert fdir2.description == "description 1"

    def test_interprete_path(self, kiosk_app: PluggableFlaskApp):
        fdir = FileManagerDirectory()

        fdir.path = r"kiosk"
        assert fdir.physical_directory == os.path.join(kiosk_root_path, r"kiosk")

        fdir.path = r"config\dsd"
        assert fdir.physical_directory == os.path.join(kiosk_root_path, r"config\dsd")

        fdir.path = r"\config\dsd"
        assert fdir.physical_directory == os.path.join(kiosk_root_path, r"config\dsd")

        fdir.path = r"%backup_directory%"
        assert fdir.physical_directory == os.path.join(kiosk_root_path, r"test_backup")

        with pytest.raises(ValueError):
            fdir.path = os.path.join(kiosk_root_path, "config", "dsd")
            s = fdir.physical_directory

