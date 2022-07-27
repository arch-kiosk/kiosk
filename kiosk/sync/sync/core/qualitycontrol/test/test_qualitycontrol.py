import datetime
import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from core.qualitycontrol.qualitycontrol import QualityControl, QualityControlMessage
from test.testhelpers import KioskPyTestHelper
from core.qualitycontrol.qcengine import QCEngine
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "loci.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestQualityControl(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture(scope="module")
    def db_with_data(self, config, db):
        KioskSQLDb.run_sql_script(sql_data)
        return db

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    @pytest.fixture()
    def empty_flags(self, db):
        KioskSQLDb.truncate_table("qc_flags")
        return db

    def test_init(self, dsd, config, db_with_data):
        sync = Synchronization()
        self.assert_record_exists("locus", "c50df3cb-e68b-4ce7-b456-9ea3d636d933")
        qc = QualityControl(dsd, sync.type_repository)
        qc._load_engines()
        assert qc.engine_count == 1

    def test_set_drop_message(self, dsd, config, db_with_data):
        sync = Synchronization()
        qc = QualityControl(dsd, sync.type_repository)
        qc._load_engines()
        msg = QualityControlMessage()
        msg.message = "message"
        msg.severity = "hint"
        msg.data_context = "95d361e7-3095-4a15-b0b3-9046544f6d06"
        msg.flag_id = "lc_1_1"
        msg.fields_involved = []
        self.assert_record_missing("qc_message_cache", "lc_1_1|95d361e7-3095-4a15-b0b3-9046544f6d06",
                                   field="flag_id_data_context")
        qc.set_message(msg)
        qc.flush_to_db()
        self.assert_record_exists("qc_message_cache", "lc_1_1|95d361e7-3095-4a15-b0b3-9046544f6d06",
                                  field="flag_id_data_context")

        qc.set_message(msg)
        qc.flush_to_db()

        self.assert_record_exists("qc_message_cache", "lc_1_1|95d361e7-3095-4a15-b0b3-9046544f6d06",
                                  field="flag_id_data_context")

        qc.drop_message(msg.flag_id, msg.data_context)
        qc.flush_to_db()
        self.assert_record_missing("qc_message_cache", "lc_1_1|95d361e7-3095-4a15-b0b3-9046544f6d06",
                                   field="flag_id_data_context")

    def test_has_messages(self, dsd, config, db_with_data):
        sync = Synchronization()
        qc = QualityControl(dsd, sync.type_repository)
        qc._load_engines()
        msg = QualityControlMessage()
        msg.message = "message"
        msg.severity = "hint"
        msg.data_context = "95d361e7-3095-4a15-b0b3-9046544f6d06"
        msg.flag_id = "lc_1_1"
        msg.fields_involved = []
        self.assert_record_missing("qc_message_cache", "lc_1_1|95d361e7-3095-4a15-b0b3-9046544f6d06",
                                   field="flag_id_data_context")
        qc.set_message(msg)
        qc.flush_to_db()
        assert qc.has_messages(flag_group="lc_1_1")
        assert qc.has_messages(flag_group="lc")
        assert not qc.has_messages(flag_group="lc_1_4")

        assert qc.has_messages(flag_group="lc_1_1", data_context="95d361e7-3095-4a15-b0b3-9046544f6d06")
        assert qc.has_messages(data_context="95d361e7-3095-4a15-b0b3-9046544f6d06")
        assert qc.has_messages(data_context="95d361e7-3095-4a15-b0b3-9046544f6d06", severity="hint")
        assert not qc.has_messages(data_context="95d361e7-3095-4a15-b0b3-9046544f6d06", severity="warning")

        msg = QualityControlMessage()
        msg.message = "message 2"
        msg.severity = "warning"
        msg.data_context = "95d361e7-3095-4a15-b0b3-9046544f6d06"
        msg.flag_id = "lc_1_2"
        msg.fields_involved = []
        qc.set_message(msg)

        assert qc.has_messages(data_context="95d361e7-3095-4a15-b0b3-9046544f6d06", severity="warning")


    def test_get_messages(self, dsd, config, db_with_data):
        KioskSQLDb.truncate_table("qc_message_cache")
        sync = Synchronization()
        qc = QualityControl(dsd, sync.type_repository)
        qc._load_engines()
        msg = QualityControlMessage()
        msg.message = "message"
        msg.severity = "hint"
        msg.data_context = "95d361e7-3095-4a15-b0b3-9046544f6d06"
        msg.flag_id = "lc_1_1"
        msg.fields_involved = []
        self.assert_record_missing("qc_message_cache", "lc_1_1|95d361e7-3095-4a15-b0b3-9046544f6d06",
                                   field="flag_id_data_context")
        qc.set_message(msg)

        msg = QualityControlMessage()
        msg.message = "message 2"
        msg.severity = "warning"
        msg.data_context = "95d361e7-3095-4a15-b0b3-9046544f6d06"
        msg.flag_id = "lc_1_2"
        msg.fields_involved = []
        qc.set_message(msg)

        messages = [msg["flag_id"] for msg in qc.get_messages(data_context="95d361e7-3095-4a15-b0b3-9046544f6d06")]
        messages.sort()
        assert messages == ['lc_1_1', 'lc_1_2']

        messages = [msg["flag_id"] for msg in qc.get_messages(flag_group="lc_1_2")]
        messages.sort()
        assert messages == ['lc_1_2']