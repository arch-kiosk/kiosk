import datetime
import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from qualitycontrol.qualitycontrol import QualityControl, QualityControlMessage
from test.testhelpers import KioskPyTestHelper
from sync_plugins.simpleqcengine.pluginsimpleqcengine import SimpleQCEngine, QCError
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "loci.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestSimpleQCEngine(KioskPyTestHelper):
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
    def qc_engine(self, db, dsd):
        sync = Synchronization()
        self.quality_control = QualityControl(dsd=dsd, type_repos=sync.type_repository)
        qc_engine_class: SimpleQCEngine.__class__ = sync.type_repository.get_type("QCEngine", "SimpleQCEngine")
        assert qc_engine_class
        qc_engine: SimpleQCEngine = qc_engine_class(dsd, self.quality_control)
        assert qc_engine
        return qc_engine

    @pytest.fixture()
    def empty_rules(self, db):
        KioskSQLDb.truncate_table("qc_rules")
        KioskSQLDb.truncate_table("qc_flags")
        return db

    def test_init(self, config, db_with_data, qc_engine):
        sync = Synchronization()
        self.assert_record_exists("locus", "c50df3cb-e68b-4ce7-b456-9ea3d636d933")
        assert qc_engine

    def test__get_input_field_value(self, db_with_data, qc_engine):
        assert qc_engine._get_input_field_value("rtl", {"type": "field_value",
                                                        "record_type": "locus",
                                                        "field": "date_defined"},
                                                {"date_defined": "2021-05-05"}) == "2021-05-05"

        assert qc_engine._get_input_field_value("rtl", {"type": "field_value",
                                                        "record_type": "locus_architecture",
                                                        "field": "material"},
                                                {"uid": "c50df3cb-e68b-4ce7-b456-9ea3d636d933"}) == "brick"

    def test__get_input_record_count(self, db_with_data, qc_engine):
        with pytest.raises(QCError):
            qc_engine._get_input_record_count("rtl", {"type": "record_count",
                                                      "record_type": "locus"},
                                              {"date_defined": "2021-05-05"})

        assert qc_engine._get_input_record_count("rtl", {"type": "record_count",
                                                         "record_type": "locus_photo"},
                                                 {"uid": "c50df3cb-e68b-4ce7-b456-9ea3d636d933"}) == 2

        assert qc_engine._get_input_record_count("rtl", {"type": "record_count",
                                                         "record_type": "locus_photo"},
                                                 {"uid": "a1fc642f-468b-45e1-a368-d9c452c5df7f"}) == 1

        assert qc_engine._get_input_record_count("rtl", {"type": "record_count",
                                                         "record_type": "locus_photo"},
                                                 {"uid": "a1fc642f-168b-45e1-a368-d9c452c5df7f"}) == 0

    def test_trigger_qc(self, db_with_data, qc_engine, monkeypatch):
        mock_msg: QualityControlMessage = None

        def mock_set_message(self, msg):
            nonlocal mock_msg
            mock_msg = msg
            return

        monkeypatch.setattr(QualityControl, "set_message", mock_set_message)
        rules_sql = os.path.join(test_path, r"sql", "rules_and_flags1.sql")
        KioskSQLDb.run_sql_script(rules_sql)
        qc_engine.trigger_qc("rtl", "c50df3cb-e68b-4ce7-b456-9ea3d636d933")
        assert mock_msg
        assert mock_msg.flag_id == 'lc_1_1'
        assert mock_msg.data_context == 'c50df3cb-e68b-4ce7-b456-9ea3d636d933'

    def test_trigger_qc_2(self, db_with_data, qc_engine, monkeypatch):
        mock_msg: QualityControlMessage = None
        mock_flag_id: str = ""
        mock_data_context: str = ""

        def mock_set_message(self, msg):
            nonlocal mock_msg
            if msg.flag_id == "lc_2_1":
                mock_msg = msg
            return

        def mock_drop_message(self, flag_id, data_context):
            nonlocal mock_msg
            nonlocal mock_flag_id
            nonlocal mock_data_context
            if flag_id == "lc_2_1":
                mock_flag_id = flag_id
                mock_data_context = data_context
            return

        monkeypatch.setattr(QualityControl, "set_message", mock_set_message)
        monkeypatch.setattr(QualityControl, "drop_message", mock_drop_message)

        rules_sql = os.path.join(test_path, r"sql", "rules_and_flags1.sql")
        KioskSQLDb.truncate_table("qc_rules")
        KioskSQLDb.truncate_table("qc_flags")
        KioskSQLDb.run_sql_script(rules_sql)

        # this checks if locus_architecture.material is empty for the locus
        qc_engine.trigger_qc("rtl", "adbef66e-f8fd-422d-b20b-c2d0f09309a5")
        assert mock_msg
        assert mock_msg.data_context == "adbef66e-f8fd-422d-b20b-c2d0f09309a5"

        # here the flag should be down because there is a material:
        qc_engine.trigger_qc("rtl", "c50df3cb-e68b-4ce7-b456-9ea3d636d933")
        assert mock_flag_id == "lc_2_1"
        assert mock_data_context == "c50df3cb-e68b-4ce7-b456-9ea3d636d933"

    def test_quality_control_1(self, db_with_data, qc_engine, monkeypatch):
        rules_sql = os.path.join(test_path, r"sql", "rules_and_flags1.sql")
        KioskSQLDb.truncate_table("qc_rules")
        KioskSQLDb.truncate_table("qc_flags")
        KioskSQLDb.truncate_table("qc_message_cache")
        KioskSQLDb.run_sql_script(rules_sql)

        assert not self.quality_control.has_messages("lc_2_1", "adbef66e-f8fd-422d-b20b-c2d0f09309a5")
        self.quality_control.trigger_qc("rtl",dont_flush=True)
        # assert self.quality_control.has_messages("lc_2_1", "adbef66e-f8fd-422d-b20b-c2d0f09309a5")
        assert "lc_2_1|adbef66e-f8fd-422d-b20b-c2d0f09309a5" in self.quality_control._updates
        assert self.quality_control._updates["lc_2_1|adbef66e-f8fd-422d-b20b-c2d0f09309a5"]
        assert list(self.quality_control._updates.keys()) == ['lc_1_1|c50df3cb-e68b-4ce7-b456-9ea3d636d933',
                                                              'lc_2_1|c50df3cb-e68b-4ce7-b456-9ea3d636d933',
                                                              'lc_1_1|a1fc642f-468b-45e1-a368-d9c452c5df7f',
                                                              'lc_2_1|a1fc642f-468b-45e1-a368-d9c452c5df7f',
                                                              'lc_1_1|adbef66e-f8fd-422d-b20b-c2d0f09309a5',
                                                              'lc_2_1|adbef66e-f8fd-422d-b20b-c2d0f09309a5',
                                                              'lc_1_1|fc182ca8-3f35-49f7-a43a-f64c6383aa35',
                                                              'lc_2_1|fc182ca8-3f35-49f7-a43a-f64c6383aa35'
                                                              ]

    def test_quality_control_2(self, db_with_data, qc_engine, monkeypatch):
        rules_sql = os.path.join(test_path, r"sql", "rules_and_flags2.sql")
        KioskSQLDb.truncate_table("qc_rules")
        KioskSQLDb.truncate_table("qc_flags")
        KioskSQLDb.truncate_table("qc_message_cache")
        KioskSQLDb.run_sql_script(rules_sql)

        self.quality_control.trigger_qc("rtl", dont_flush=True)
        result = [msg_id + "|" + ("1" if msg else "0") for msg_id, msg in self.quality_control._updates.items()]
        result.sort()
        check = ['lc_3_1|a1fc642f-468b-45e1-a368-d9c452c5df7f|1',
                 'lc_3_1|adbef66e-f8fd-422d-b20b-c2d0f09309a5|0',
                 'lc_3_1|c50df3cb-e68b-4ce7-b456-9ea3d636d933|0',
                 'lc_4_1|a1fc642f-468b-45e1-a368-d9c452c5df7f|0',
                 'lc_4_1|adbef66e-f8fd-422d-b20b-c2d0f09309a5|0',
                 'lc_4_1|c50df3cb-e68b-4ce7-b456-9ea3d636d933|0',
                 'lc_3_1|fc182ca8-3f35-49f7-a43a-f64c6383aa35|1',
                 'lc_4_1|fc182ca8-3f35-49f7-a43a-f64c6383aa35|1']
        check.sort()
        assert result == check
