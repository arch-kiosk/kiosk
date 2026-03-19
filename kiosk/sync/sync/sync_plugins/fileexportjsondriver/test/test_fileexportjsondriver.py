import os
import typing

import pytest

from dsd.dsd3singleton import Dsd3Singleton
from fileexportjsondriver.fileexportjsondocdriver import FileExportJSONDocDriver
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper
from sync_plugins.fileexportworkstation.fileexport import FileExport


test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFileExportJSONDriver(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, config, dsd):
        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)
        assert file_export

        drivers = file_export.get_drivers()
        assert drivers

        drivers = [d.driver_id for d in drivers.values()]
        assert 'FileExportJSONDocDriver' in drivers
        assert 'FileExportJSONTableDriver' in drivers

        driver = typing.cast(FileExportJSONDocDriver, file_export.get_drivers()["FileExportJSONDocDriver"])
        assert driver._dsd_view_dsd
        assert "narrative_file_association" not in driver._dsd_view_dsd.list_tables()

        driver = typing.cast(FileExportJSONDocDriver, file_export.get_drivers()["FileExportJSONTableDriver"])
        assert driver._dsd_view_dsd
        assert "narrative_file_association" in driver._dsd_view_dsd.list_tables()

        targets = file_export.get_file_export_targets()
        assert targets

        assert list(targets.values())[0].target_id == "FileExportTargetZip"


