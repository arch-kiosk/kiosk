from collections import OrderedDict

import pytest
import datetime
import os

import kioskstdlib
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
        moved_files = []

        def _delete(_, filename):
            deleted_files.append(filename)
            return True

        def _move(_, filename):
            moved_files.append(filename)
            return True

        files = [os.path.join(test_path, "data", 'beset.png'),
                 os.path.join(test_path, "data", "Dunham's plan of room 5.JPG"),
                 os.path.join(test_path, "data", 'filter github issues in projects.png'),
                 os.path.join(test_path, "data", 'logo.png'),
                 os.path.join(test_path, "data", 'migration class hierarchy.png'),
                 os.path.join(test_path, "data",
                              'Screenshot_2020-04-28 file-import now with new context management · Issue #570 · urapadmin kiosk.png'),
                 os.path.join(test_path, "data",
                              'Screenshot_2020-05-20 Edit Images Free Online - Father and son Shutterstock Editor.png'),
                 os.path.join(test_path, "data", 'Varieties_of_emergentism.pdf'),
                 os.path.join(test_path, "data", 'WinCacheGrind.ini')]
        for f in files:
            kioskstdlib.set_file_date_and_time(f, datetime.datetime.now())

        cleaner = KioskCleanup(now=datetime.datetime.fromisoformat("2020-01-31T21:32:00"))
        monkeypatch.setattr(KioskCleanup, "_delete_file", _delete)
        cleaner.add_dir(os.path.join(test_path, "data"))
        assert cleaner.cleanup()
        assert deleted_files == []

        deleted_files = []
        file_to_delete = os.path.join(test_path, "data", 'migration class hierarchy.png')
        kioskstdlib.set_file_date_and_time(file_to_delete, datetime.datetime.fromisoformat("2021-01-01T21:31:00"))
        cleaner = KioskCleanup(now=datetime.datetime.fromisoformat("2021-03-01T21:32:00"))
        monkeypatch.setattr(KioskCleanup, "_delete_file", _delete)
        cleaner.add_dir(os.path.join(test_path, "data"))
        assert cleaner.cleanup()
        assert deleted_files == [file_to_delete]

        monkeypatch.setattr(KioskCleanup, "_delete_file", _delete)
        deleted_files = []
        for f in files:
            kioskstdlib.set_file_date_and_time(f, datetime.datetime.fromisoformat("2021-01-01T21:31:00"))
        cleaner = KioskCleanup(now=datetime.datetime.fromisoformat("2021-03-20T21:32:00"))
        monkeypatch.setattr(KioskCleanup, "_delete_file", _delete)
        cleaner.add_dir(os.path.join(test_path, "data"))
        assert cleaner.cleanup()
        assert deleted_files == files

        deleted_files = []
        moved_files = []
        for f in files:
            kioskstdlib.set_file_date_and_time(f, datetime.datetime.fromisoformat("2021-01-01T21:31:00"))
        cleaner = KioskCleanup(now=datetime.datetime.fromisoformat("2021-03-20T21:32:00"),
                               move_to=os.path.join(test_path, "data", "target"))
        monkeypatch.setattr(KioskCleanup, "_delete_file", _delete)
        monkeypatch.setattr(KioskCleanup, "_move_file", _move)
        cleaner.add_dir(os.path.join(test_path, "data"))
        assert cleaner.cleanup()
        assert moved_files == files
        assert deleted_files == []
