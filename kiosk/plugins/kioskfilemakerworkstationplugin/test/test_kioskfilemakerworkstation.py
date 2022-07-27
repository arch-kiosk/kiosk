import os
from pathlib import Path

import pytest

import kioskglobals
from kioskappfactory import KioskAppFactory
from pluggableflaskapp import PluggableFlaskApp
from plugins.kioskfilemakerworkstationplugin import KioskFileMakerWorkstation
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
kiosk_root_path = Path(test_path).parent.parent.parent


# log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskFileMakerWorkstation(KioskPyTestHelper):
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
    def the_test_client(self, kiosk_app):
        with kiosk_app.test_client() as client:
            with kiosk_app.app_context():
                yield client

    @staticmethod
    def drop_workstations():
        KioskSQLDb.truncate_table("repl_workstation")
        KioskSQLDb.truncate_table("kiosk_workstation")
        KioskSQLDb.truncate_table("repl_workstation_filemaker")

    def test_get_kiosk_workstation_type_names(self, kiosk_app: PluggableFlaskApp):
        assert kioskglobals.type_repository
        sync = Synchronization()
        self.drop_workstations()
        ws = KioskFileMakerWorkstation(workstation_id="test_ws", sync=sync)
        assert not ws.exists
        ws.create_workstation(ws_name="Test Workstation", recording_group="default")
        assert ws.exists

    def test__calc_status_text(self, kiosk_app: PluggableFlaskApp):
        sync = Synchronization()
        self.drop_workstations()
        ws = KioskFileMakerWorkstation(workstation_id="test_ws", sync=sync)
        ws.create_workstation(ws_name="Test Workstation", recording_group="default")
        assert ws.exists

        assert ws.state_text == "synchronized - needs preparation"
        assert not ws._allow_upload
        assert not ws._allow_download
        assert not ws._upload_has_priority
        assert not ws._download_has_priority

        # IN: state, download_state OUT: _state_text, (allow_upload, allow_download, upload is next, download_is next)
        cases = [("IDLE", FileMakerWorkstation.NOT_SET, "synchronized - needs preparation", (False, False, False, False)),
                 ("IDLE", FileMakerWorkstation.DOWNLOAD, "synchronized - needs preparation", (False, False, False, False)),
                 ("IDLE", FileMakerWorkstation.UPLOAD, "synchronized - needs preparation", (False, False, False, False)),
                 ("READY_FOR_EXPORT", FileMakerWorkstation.NOT_SET, "forked - needs export", (False, False, False, False)),
                 ("READY_FOR_EXPORT", FileMakerWorkstation.DOWNLOAD, "forked - needs export", (False, False, False, False)),
                 ("READY_FOR_EXPORT", FileMakerWorkstation.UPLOAD, "forked - needs export", (False, False, False, False)),
                 ("IN_THE_FIELD", FileMakerWorkstation.NOT_SET, "prepared for download", (False, True, False, True)),
                 ("IN_THE_FIELD", FileMakerWorkstation.DOWNLOAD, "in the field", (True, True, True, False)),
                 ("IN_THE_FIELD", FileMakerWorkstation.UPLOAD, "uploaded - needs import", (True, False, False, False)),
                 ("BACK_FROM_FIELD", FileMakerWorkstation.NOT_SET, "waiting for synchronization", (False, False, False, False)),
                 ("BACK_FROM_FIELD", FileMakerWorkstation.DOWNLOAD, "waiting for synchronization", (False, False, False, False)),
                 ("BACK_FROM_FIELD", FileMakerWorkstation.UPLOAD, "waiting for synchronization", (False, False, False, False)),
                 ]
        for case in cases:
            print(case)
            ws._calc_status_text(case[0], case[1])
            assert ws._state_text == case[2]
            assert ws._allow_upload == case[3][0]
            assert ws._allow_download == case[3][1]
            assert ws._upload_has_priority == case[3][2]
            assert ws._download_has_priority == case[3][3]

