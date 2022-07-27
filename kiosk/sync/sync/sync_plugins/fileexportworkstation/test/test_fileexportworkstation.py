import datetime
import logging
from pprint import pprint

import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from fileexportworkstation import FileExportWorkstation
from fileexportworkstation.fileexport import FileExport
from qualitycontrol.qualitycontrol import QualityControl, QualityControlMessage
from test.testhelpers import KioskPyTestHelper
from sync_plugins.simpleqcengine.pluginsimpleqcengine import SimpleQCEngine, QCError
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


# most of the file export tests are located in the fileexportcsv driver!
class TestFileExportWorkstation(KioskPyTestHelper):
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
        assert 'FileExportCSVDriver' in drivers
        assert 'FileExportExcelDriver' in drivers

        targets = file_export.get_file_export_targets()
        assert targets

        assert list(targets.values())[0].target_id == "FileExportTargetZip"

    def test_export(self, config, dsd):
        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)
        assert file_export

        driver = file_export.get_drivers()["FileExportCSVDriver"]
        target = file_export.get_file_export_targets()["FileExportTargetZip"]

        file_export_tables = list(file_export.get_export_tables())
        assert "unit" in file_export_tables
        assert "repl_workstations" not in file_export_tables
        assert "repl_file_picking_rules" not in file_export_tables
        assert "qc_message_cache" not in file_export_tables
        assert "repl_file_picking_rules" not in file_export_tables
        assert "qc_flags" not in file_export_tables
        assert "qc_rules" not in file_export_tables

    def test_no_file_picking_rules(self, config, dsd, db, monkeypatch):
        mock_called = False

        def mock__error(msg):
            nonlocal mock_called
            if "no file picking rules of type 'FileExportWorkstation'" in msg:
                mock_called = True

        sync = Synchronization()
        ws = FileExportWorkstation("export", "some description", sync, )
        ws.include_files = True
        ws.recording_group = "export"
        ws.export_file_format = "FileExportCSVDriver"
        ws.save()
        ws.callback_progress = lambda v: True

        monkeypatch.setattr(logging, "error", mock__error)

        assert ws.fork()
        ws.export()
        assert mock_called

        mock_called = False
        ws.include_files = False
        ws.export()
        assert not mock_called

