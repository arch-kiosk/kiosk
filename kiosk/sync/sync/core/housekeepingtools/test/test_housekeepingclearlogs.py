from collections import OrderedDict

import pytest
import datetime
import os

import kioskstdlib
from kioskcleanup import KioskCleanup
from kioskuser import KioskUser
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
from housekeepingtools.housekeepingclearlog import clear_log

test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")

log_file = os.path.join(test_path, r"log", "test_log.log")


class TestHouseKeepingClearLogs(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        cfg = self.get_config(config_file, log_file=log_file)
        return cfg

    def test_init(self, cfg):
        assert cfg.kiosk
        assert clear_log(cfg, test_mode=True) == (True, "delete", 30)

        cfg["housekeeping"] = {"clear_log": {"max_days": 30, "mode": "move"}}
        assert clear_log(cfg, test_mode=True) == (True, "move", 30)

        cfg["housekeeping"] = {"clear_log": {"max_days": 30, "mode": "delete"}}
        assert clear_log(cfg, test_mode=True) == (True, "delete", 30)

        cfg["housekeeping"] = {"clear_log": {"max_days": "30", "mode": "delete"}}
        assert clear_log(cfg, test_mode=True) == (True, "delete", 30)

        cfg["housekeeping"] = {"clear_log": {"max_days": "30A", "mode": "delete"}}
        assert clear_log(cfg, test_mode=True) == False

        cfg["housekeeping"] = {"clear_log": {"max_days": "30", "mode": "wrong"}}
        assert clear_log(cfg, test_mode=True) == False

        cfg["housekeeping"] = {}

    def test_cleanup_delete(self, cfg, shared_datadir):

        files = [
            os.path.join(shared_datadir, 'test1.txt'),
            os.path.join(shared_datadir, 'test2.txt'),
            os.path.join(shared_datadir, 'test3.txt')
        ]
        for f in files:
            kioskstdlib.set_file_date_and_time(f, datetime.datetime.now())

        assert os.path.isfile(files[2])
        kioskstdlib.set_file_date_and_time(files[2], datetime.datetime.now() - datetime.timedelta(days=31))

        # pretty horrible, but all I can think of is manipulating the base_path to get around the safety check in
        # KioskCleanup.add_path:
        old_base_path = cfg.base_path
        cfg.base_path = kioskstdlib.get_parent_dir(str(shared_datadir))

        assert clear_log(cfg, override_logdir=shared_datadir)
        cfg.base_path = old_base_path
        assert not os.path.isfile(files[2])
        assert os.path.isfile(files[1])
        assert os.path.isfile(files[0])

    def test_cleanup_move(self, cfg, shared_datadir):

        files = [
            os.path.join(shared_datadir, 'test1.txt'),
            os.path.join(shared_datadir, 'test2.txt'),
            os.path.join(shared_datadir, 'test3.txt')
        ]
        for f in files:
            kioskstdlib.set_file_date_and_time(f, datetime.datetime.now())

        assert os.path.isfile(files[2])
        kioskstdlib.set_file_date_and_time(files[2], datetime.datetime.now() - datetime.timedelta(days=11))
        kioskstdlib.set_file_date_and_time(files[1], datetime.datetime.now() - datetime.timedelta(days=11))

        cfg["housekeeping"] = {"clear_log": {"max_days": 10, "mode": "move"}}

        old_base_path = cfg.base_path
        cfg.base_path = kioskstdlib.get_parent_dir(str(shared_datadir))

        assert clear_log(cfg, override_logdir=shared_datadir)
        cfg.base_path = old_base_path
        assert not os.path.isfile(files[2])
        assert not os.path.isfile(files[1])
        assert os.path.isfile(files[0])
