import datetime
import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from qualitycontrol.qualitycontrol import QualityControl, QualityControlMessage
from test.testhelpers import KioskPyTestHelper
from core.qualitycontrol.qcengine import QCEngine
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "loci.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestQCEngine(KioskPyTestHelper):
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

    # @pytest.fixture()
    # def qc_engine(self, db, dsd):
    #     sync = Synchronization()
    #     qc_engine_class: SimpleQCEngine.__class__ = sync.type_repository.get_type("QCEngine", "SimpleQCEngine")
    #     assert qc_engine_class
    #     qc_engine: SimpleQCEngine = qc_engine_class(dsd)
    #     assert qc_engine
    #     return qc_engine

    @pytest.fixture()
    def empty_flags(self, db):
        KioskSQLDb.truncate_table("qc_flags")
        return db

    def test_init(self, dsd, config, db_with_data):
        sync = Synchronization()
        self.assert_record_exists("locus", "c50df3cb-e68b-4ce7-b456-9ea3d636d933")
        qc_engine = QCEngine(dsd, QualityControl(dsd, sync.type_repository))
        assert qc_engine

    def test_flag(self, dsd, db_with_data, monkeypatch):
        mock_msg: QualityControlMessage = None

        def mock_set_message(self, msg):
            nonlocal mock_msg
            mock_msg = msg
            return

        monkeypatch.setattr(QualityControl, "set_message", mock_set_message)
        sync = Synchronization()
        qc_engine = QCEngine(dsd, QualityControl(dsd, sync.type_repository))
        KioskSQLDb.run_sql_script(os.path.join(test_path, r"sql", "rules_and_flags1.sql"))
        qc_engine.flag("rtl", "c50df3cb-e68b-4ce7-b456-9ea3d636d933",
                              {"uid": "c50df3cb-e68b-4ce7-b456-9ea3d636d933",
                               "arch_context": "CC-001"}, "lc_1_1")
        assert mock_msg
        assert mock_msg.data_context == 'c50df3cb-e68b-4ce7-b456-9ea3d636d933'