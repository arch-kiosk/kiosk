import pytest
import datetime

import kiosklib
import kioskstdlib
from backupreminder import BackupReminder
from kioskuser import KioskUser
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
from kioskstdlib import *
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")
sql = os.path.join(test_path, "sql", "add_users.sql")

log_file = os.path.join(test_path, r"log", "test_log.log")


class Testkioskstdlib(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        cfg = self.get_config(config_file, log_file=log_file)
        return cfg

    def test_init(self, cfg):
        assert cfg.kiosk

    def test_check_last_backup(self, cfg, monkeypatch):
        mock_msg: str = ""

        def mock_dispatch_system_message(headline: str = "",
                            message_id: str = "",
                            severity: int = -11,
                            body: str = "",
                            addressee: str = "*",
                            sender="system",
                            dont_log=False,
                            project_id=None):
            nonlocal mock_msg
            mock_msg = headline

        monkeypatch.setattr(kiosklib, "dispatch_system_message", mock_dispatch_system_message)

        reminder_file = os.path.join(cfg.base_path, 'backup.reminder')
        if os.path.isfile(reminder_file):
            os.remove(reminder_file)
        cfg.kiosk["backup_reminder_days"] = 0
        BackupReminder.check_last_backup(cfg)
        assert not mock_msg
        cfg.kiosk["backup_reminder_days"] = 1
        assert not mock_msg
        BackupReminder.check_last_backup(cfg)
        BackupReminder.set_backup_reminder(cfg, datetime.datetime.now() - datetime.timedelta(days=2))
        BackupReminder.check_last_backup(cfg)
        assert mock_msg
        assert "at all" in mock_msg
        BackupReminder.set_backup_datetime(cfg, datetime.datetime.now() - datetime.timedelta(days=2))
        mock_msg = None
        BackupReminder.check_last_backup(cfg)
        assert mock_msg
        assert "at all" not in mock_msg

    # @pytest.mark.skip()
    def test_manipulate_backup_time(self, cfg, monkeypatch):
        BackupReminder.set_backup_datetime(cfg, datetime.datetime.now() - datetime.timedelta(days=2))

