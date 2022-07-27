import pytest
import os

from kioskuser import KioskUser
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb


test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_user.yml")
sql = os.path.join(test_path, "sql", "add_users.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskUser(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        cfg = self.get_config(config_file)
        assert cfg.database_name == "urap_test"
        cfg.kiosk["system_messages"] = dict()
        cfg.kiosk["system_messages"]["thresholds"] = dict()
        return cfg

    @pytest.fixture(scope="module")
    def db(self, cfg):
        assert cfg.database_name == "urap_test"
        cur = self.get_urapdb(cfg)
        cur.close()
        KioskSQLDb.run_sql_script(sql)
        return True

    def test_init(self, cfg, db):
        assert cfg.kiosk
        assert cfg.kiosk["system_messages"]["thresholds"] is not None
        user = KioskUser(user_uuid="8aa2cd40-4eb0-47f4-b3f7-9baaabfcbeee", check_token=False)
        assert user

    def test__load_message_thresholds(self, cfg, db):
        # "admins": -5
        # "operators": -5
        # "*": 5
        # "~": 0

        thresholds: dict = cfg.kiosk["system_messages"]["thresholds"]
        thresholds.clear()
        user = KioskUser(user_uuid="8aa2cd40-4eb0-47f4-b3f7-9baaabfcbeee", check_token=False)
        assert user.user_id == "admin"
        assert user.message_threshold == (0, 0)

        thresholds: dict = cfg.kiosk["system_messages"]["thresholds"]
        thresholds.clear()
        thresholds["admins"] = -5
        user = KioskUser(user_uuid="8aa2cd40-4eb0-47f4-b3f7-9baaabfcbeee", check_token=False)
        assert user.user_id == "admin"
        assert user.message_threshold == (-5, 0)

        thresholds: dict = cfg.kiosk["system_messages"]["thresholds"]
        thresholds.clear()
        thresholds["*"] = 2
        user = KioskUser(user_uuid="8aa2cd40-4eb0-47f4-b3f7-9baaabfcbeee", check_token=False)
        assert user.user_id == "admin"
        assert user.message_threshold == (2, 0)

        thresholds: dict = cfg.kiosk["system_messages"]["thresholds"]
        thresholds.clear()
        thresholds["admins"] = -5
        thresholds["*"] = 2
        user = KioskUser(user_uuid="8aa2cd40-4eb0-47f4-b3f7-9baaabfcbeee", check_token=False)
        assert user.user_id == "admin"
        assert user.message_threshold == (-5, 0)

        thresholds: dict = cfg.kiosk["system_messages"]["thresholds"]
        thresholds.clear()
        thresholds["admins"] = -5
        thresholds["operators"] = 1
        thresholds["*"] = 2
        user = KioskUser(user_uuid="8ba2cd40-4eb0-47f4-b3f7-9baaabfcbeee", check_token=False)
        assert user.user_id == "test"
        assert user.message_threshold == (2, 0)

        user = KioskUser(user_uuid="8ca2cd40-4eb0-47f4-b3f7-9baaabfcbeee", check_token=False)
        assert user.user_id == "operator"
        assert user.message_threshold == (1, 0)

        user = KioskUser(user_uuid="8aa2cd40-4eb0-47f4-b3f7-9baaabfcbeee", check_token=False)
        assert user.user_id == "admin"
        assert user.message_threshold == (-5, 0)
