from time import sleep

import pytest
from pathlib import Path
import os

from kioskuser import KioskUser
from pluggableflaskapp import PluggableFlaskApp

from mcpinterface.mcpjob import MCPJob
from mcpinterface.mcpqueue import MCPQueue
from plugins.kioskexportworkstationplugin import KioskExportWorkstation
from plugins.kioskfilemakerworkstationplugin import KioskFileMakerWorkstation
from plugins.syncmanagerplugin.kiosksyncmanager import KioskSyncManager
from plugins.syncmanagerplugin.kioskworkstationjobs import MCP_SUFFIX_WORKSTATION, JOB_META_TAG_WORKSTATION
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper
from kioskappfactory import KioskAppFactory
import kioskglobals
from kiosksqldb import KioskSQLDb
import flask_login

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
kiosk_root_path = Path(test_path).parent.parent.parent


# log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskSyncManager(KioskPyTestHelper):
    @pytest.fixture(scope='module')
    def cfg(self):
        cfg = self.get_standard_test_config(__file__, test_config_file=config_file)

    @pytest.fixture
    def kiosk_app(self, cfg):
        print(f"config_file: {config_file}, root_path: {kiosk_root_path}")
        kiosk_app = KioskAppFactory.create_app(config_file, root_path=kiosk_root_path)
        kiosk_app.config["TESTING"] = True
        assert "emergency_mode" not in kiosk_app.config
        yield kiosk_app

    @pytest.fixture
    def test_client(self, kiosk_app):
        with kiosk_app.test_client() as client:
            with kiosk_app.app_context():
                yield client

    def test_get_kiosk_workstation_type_names(self, kiosk_app: PluggableFlaskApp):
        assert kioskglobals.type_repository
        sync_manager = KioskSyncManager(kioskglobals.type_repository)
        assert sync_manager
        assert kiosk_app.plugin_manager.get_plugin_by_name("kioskfilemakerworkstationplugin")
        assert "KioskFileMakerWorkstation" in sync_manager.get_kiosk_workstation_type_names()
        assert "KioskExportWorkstation" in sync_manager.get_kiosk_workstation_type_names()

    def test_get_kiosk_workstation_class(self, kiosk_app: PluggableFlaskApp):
        assert kioskglobals.type_repository
        sync_manager = KioskSyncManager(kioskglobals.type_repository)
        assert sync_manager
        assert kiosk_app.plugin_manager.get_plugin_by_name("kioskfilemakerworkstationplugin")
        cls = sync_manager.get_kiosk_workstation_class("KioskFileMakerWorkstation")
        assert cls
        assert cls.get_kiosk_workstation_type() == "KioskFileMakerWorkstation"

        cls = sync_manager.get_kiosk_workstation_class("KioskExportWorkstation")
        assert cls
        assert cls.get_kiosk_workstation_type() == "KioskExportWorkstation"

    def test_get_kiosk_workstation_type_from_sync_type_name(self, kiosk_app: PluggableFlaskApp):
        assert kioskglobals.type_repository
        sync_manager = KioskSyncManager(kioskglobals.type_repository)
        assert sync_manager.get_kiosk_workstation_type_from_sync_type_name(
            "FileMakerWorkstation").__name__ == KioskFileMakerWorkstation.__name__
        assert sync_manager.get_kiosk_workstation_type_from_sync_type_name(
            "FileExportWorkstation").__name__ == KioskExportWorkstation.__name__
        assert not sync_manager.get_kiosk_workstation_type_from_sync_type_name(
            "KioskUnknownWorkstation")


    def test_list_workstations(self, kiosk_app: PluggableFlaskApp, monkeypatch):
        class FakeKioskUser:
            def __init__(self):
                print("sadfasdfafds")
                pass
            def fulfills_requirement(self, requirement: str):
                return True

        def mock_get_user():
            return FakeKioskUser()

        monkeypatch.setattr("flask_login.utils._get_user", mock_get_user)
        assert kioskglobals.type_repository
        sync = Synchronization()
        sync_manager = KioskSyncManager(kioskglobals.type_repository)
        KioskSQLDb.truncate_table("repl_workstation")
        KioskSQLDb.truncate_table("kiosk_workstation")
        KioskSQLDb.truncate_table("repl_workstation_filemaker")
        KioskSQLDb.truncate_table("repl_workstation_file_export")
        assert len(sync.list_workstations()) == 0
        assert not sync_manager.list_workstations()

        fmw = KioskFileMakerWorkstation(workstation_id="test_ws", sync=sync)
        fmw.create_workstation("Test Description", "default")
        assert len(sync.list_workstations()) == 1
        workstations = sync_manager.list_workstations()
        assert len(workstations) == 1
        assert workstations[list(workstations.keys())[0]].__class__.__name__ == "KioskFileMakerWorkstation"

        fmw = KioskFileMakerWorkstation(workstation_id="test_ws_2", sync=sync)
        fmw.create_workstation("Test Description 2", "default")
        assert len(sync.list_workstations()) == 2
        workstations = sync_manager.list_workstations()
        assert len(workstations) == 2
        assert workstations["test_ws_2"].__class__.__name__ == "KioskFileMakerWorkstation"

        kew = KioskExportWorkstation(workstation_id="test_ws_3", sync=sync)
        kew.create_workstation("Test Export Workstation", recording_group="", export_file_format="Excel",
                               include_files=False,
                               filename_rendering="")
        workstations = sync_manager.list_workstations()
        assert len(workstations) == 3
        ws_ids = [x.id for x in workstations.values()]
        ws_ids.sort()
        assert ws_ids == ["test_ws", "test_ws_2", "test_ws_3"]

    def create_fm_workstation_job(self, workstation_id, description, recording_group):
        job = MCPJob(kioskglobals.general_store, job_type_suffix=MCP_SUFFIX_WORKSTATION)
        job.set_worker("plugins.kioskfilemakerworkstationplugin.workers.createworkstationworker",
                       "CreateWorkstationWorker")
        job.job_data = {"workstation_id": workstation_id,
                        "description": description,
                        "recording_group": recording_group}
        job.meta_data = [JOB_META_TAG_WORKSTATION]
        job.queue()
        result = job.job_id

    @staticmethod
    def drop_workstations():
        KioskSQLDb.truncate_table("repl_workstation")
        KioskSQLDb.truncate_table("kiosk_workstation")
        KioskSQLDb.truncate_table("repl_workstation_filemaker")

    def test_list_latest_workstation_jobs(self, kiosk_app: PluggableFlaskApp):
        assert kioskglobals.type_repository
        sync = Synchronization()
        self.drop_workstations()
        sync_manager = KioskSyncManager(kioskglobals.type_repository)
        queue = MCPQueue(kioskglobals.general_store)
        queue.force_flush()
        sleep(1)
        assert len(sync.list_workstations()) == 0
        assert not sync_manager.list_workstations()
        assert not sync_manager.list_latest_workstation_jobs()

        self.create_fm_workstation_job("test_ws", "Test Description", "default")
        self.create_fm_workstation_job("test_ws-2", "Test Description 2", "default")
        sleep(5)
        jobs = sync_manager.list_latest_workstation_jobs()
        job_ws_ids = [x.workstation_id for x in jobs]
        job_ws_ids.sort()
        assert len(job_ws_ids) == 2
        assert job_ws_ids == ["test_ws", "test_ws-2"]
        for job in jobs:
            assert job.meta_data == ["WS"]
