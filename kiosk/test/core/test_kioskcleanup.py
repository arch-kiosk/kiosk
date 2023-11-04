from collections import OrderedDict

import pytest
import datetime
import os

from kioskcleanup import KioskCleanup
from kioskuser import KioskUser
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")
sql = os.path.join(test_path, "sql", "add_users.sql")

log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskCleanup(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        cfg = self.get_config(config_file, log_file=log_file)
        return cfg

    def test_init(self, cfg):
        assert cfg.kiosk

    def test_cleanup(self, monkeypatch):
        deleted_files = []

        def _delete(_, filename):
            deleted_files.append(filename)
            return True

        cleaner = KioskCleanup(now=datetime.datetime.fromisoformat("2020-01-31T21:32:00"))
        monkeypatch.setattr(KioskCleanup, "_delete_file", _delete)
        cleaner.add_dir(os.path.join(test_path, "data"))
        assert cleaner.cleanup()
        assert deleted_files == []

        deleted_files = []
        cleaner = KioskCleanup(now=datetime.datetime.fromisoformat("2021-03-01T21:32:00"))
        monkeypatch.setattr(KioskCleanup, "_delete_file", _delete)
        cleaner.add_dir(os.path.join(test_path, "data"))
        assert cleaner.cleanup()
        assert deleted_files == [os.path.join(test_path, "data", 'migration class hierarchy.png')]

        deleted_files = []
        cleaner = KioskCleanup(now=datetime.datetime.fromisoformat("2021-03-20T21:32:00"))
        monkeypatch.setattr(KioskCleanup, "_delete_file", _delete)
        cleaner.add_dir(os.path.join(test_path, "data"))
        assert cleaner.cleanup()
        assert deleted_files == [os.path.join(test_path, "data", 'beset.png'),
                                 os.path.join(test_path, "data", "Dunham's plan of room 5.JPG"),
                                 os.path.join(test_path, "data", 'filter github issues in projects.png'),
                                 os.path.join(test_path, "data", 'logo.png'),
                                 os.path.join(test_path, "data", 'migration class hierarchy.png'),
                                 os.path.join(test_path, "data", 'Screenshot_2020-04-28 file-import now with new context management · Issue #570 · urapadmin kiosk.png'),
                                 os.path.join(test_path, "data", 'Screenshot_2020-05-20 Edit Images Free Online - Father and son Shutterstock Editor.png'),
                                 os.path.join(test_path, "data", 'Varieties_of_emergentism.pdf'),
                                 os.path.join(test_path, "data", 'WinCacheGrind.ini')]
