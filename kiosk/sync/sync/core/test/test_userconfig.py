import datetime
import logging
import time
import uuid
import os

import pytest

from test.testhelpers import KioskPyTestHelper
from typerepository import TypeRepository

from generalstore.generalstore import GeneralStore
from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore
from core.generalstore import generalstorekeys
from sync_config import SyncConfig
from userconfig import UserConfig

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestUserConfig(KioskPyTestHelper):


    @pytest.fixture(scope="module")
    def rgs(self):
        config = self.get_config(config_file, log_file=log_file)

        rgs = RedisGeneralStore(config)
        return rgs

    def test_init(self, rgs):
        assert rgs._check_redis()

    @pytest.fixture()
    def clean_rgs(self, rgs):
        keys = rgs.get_keys(generalstorekeys.gs_key_user_config + "#lkh#test_")
        if keys:
            rgs.delete_keys(keys)
        return rgs

    def test_init_topic(self, clean_rgs):
        uc = UserConfig(clean_rgs, "lkh")
        assert not uc.get_config("test_some_config")
        rc = uc.init_topic("test_some_config", {"key1": "value 1", "key2": "value 2"})
        assert rc == {"key1": "value 1", "key2": "value 2"}
        rc = uc.init_topic("test_some_config", {"key1": "value 1", "key2": "value 3"})
        assert rc == {"key1": "value 1", "key2": "value 2"}
        rc = uc.init_topic("test_some_config", {"key1": "value 1", "key2": "value 3"}, force_init=True)
        assert rc == {"key1": "value 1", "key2": "value 3"}

    def test_get_topic(self, clean_rgs):
        uc = UserConfig(clean_rgs, "lkh")
        assert not uc.get_config("test_some_other_config")
        assert uc.init_topic("test_some_other_config", {"akey": "value 1", "anotherkey": "value 2"})
        cfg = uc.get_config("test_some_other_config")
        assert cfg == {"akey": "value 1", "anotherkey": "value 2"}


