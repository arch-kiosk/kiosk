import datetime
import logging
import os
import time
import uuid

import pytest

from test.testhelpers import KioskPyTestHelper
from typerepository import TypeRepository

from generalstore.generalstore import GeneralStore
from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore
from core.generalstore import generalstorekeys
from sync_config import SyncConfig
from syncrepositorytypes import TYPE_GENERALSTORE
from semantic_version import Version

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "test_redisgeneralstore_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestRedisGeneralStore(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    def test_make_key(self):
        assert RedisGeneralStore.make_key(generalstorekeys.sync_core_threaded_job_manager_job, 1) == \
               f"sync_core_threaded_job_manager_job_1"

    @pytest.fixture(scope="module")
    def uid(self):
        return str(uuid.uuid4())

    def test_init(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        assert rgs._check_redis()

    def test_redis_version(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        assert Version(rgs.get_redis_version()).major == 6

    def test_put_string(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        assert rgs.put_string(rgs.make_key(generalstorekeys.test, "key", 1), "")
        assert rgs.get_string(rgs.make_key(generalstorekeys.test, "key", 1)) == ""
        assert rgs.put_string(rgs.make_key(generalstorekeys.test, "key", 1), "Some Text")
        assert rgs.get_string(rgs.make_key(generalstorekeys.test, "key", 1)) == "Some Text"

        with pytest.raises(TypeError):
            rgs.put_string(rgs.make_key(generalstorekeys.test, "key", 1), 12)

    def test_delete_key(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        assert rgs.put_string(rgs.make_key(generalstorekeys.test, "key", 1), "")
        assert rgs.delete_key(rgs.make_key(generalstorekeys.test, "key", 1))
        with pytest.raises(KeyError):
            assert rgs.get_string(rgs.make_key(generalstorekeys.test, "key", 1)) != ""

    def test_put_int(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        assert rgs.put_int(rgs.make_key(generalstorekeys.test, "key", 1), 0)
        assert rgs.get_int(rgs.make_key(generalstorekeys.test, "key", 1)) == 0
        assert rgs.put_int(rgs.make_key(generalstorekeys.test, "key", 1), 12)
        assert rgs.get_int(rgs.make_key(generalstorekeys.test, "key", 1)) == 12

        assert rgs.put_string(rgs.make_key(generalstorekeys.test, "strkey"), "13")
        assert rgs.get_int(rgs.make_key(generalstorekeys.test, "strkey")) == 13

        assert rgs.put_string(rgs.make_key(generalstorekeys.test, "strkey"), "no int")
        with pytest.raises(ValueError):
            assert rgs.get_int(rgs.make_key(generalstorekeys.test, "strkey")) == "no int"

        with pytest.raises(TypeError):
            rgs.put_int(rgs.make_key(generalstorekeys.test, "key", 1), "12")

    def test_put_dict(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        rgs.delete_key(rgs.make_key(generalstorekeys.test, "dict", 1))
        assert rgs.put_dict(rgs.make_key(generalstorekeys.test, "dict", 1), [], {})
        assert rgs.get_dict(rgs.make_key(generalstorekeys.test, "dict", 1)) == {}

        assert rgs.put_dict(rgs.make_key(generalstorekeys.test, "dict", 1), [], {'item1': 1, 'item2': '2'})
        assert rgs.get_dict(rgs.make_key(generalstorekeys.test, "dict", 1)) == {'item1': 1, 'item2': '2'}

        assert rgs.put_dict(rgs.make_key(generalstorekeys.test, "dict", 1), ["item1"], {'sub_item_1': 'new_value'})
        assert rgs.get_dict(rgs.make_key(generalstorekeys.test, "dict", 1)) == {'item1': {'sub_item_1': 'new_value'},
                                                                                'item2': '2'}

    def test_put_dict_value(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        rgs.delete_key(rgs.make_key(generalstorekeys.test, "dict", 1))
        assert rgs.put_dict(rgs.make_key(generalstorekeys.test, "dict", 1), [], {'item1': 1, 'item2': '2'})
        assert rgs.get_dict(rgs.make_key(generalstorekeys.test, "dict", 1), []) == {'item1': 1, 'item2': '2'}

        assert rgs.put_dict_value(rgs.make_key(generalstorekeys.test, "dict", 1), ['item2'], '3')
        assert rgs.put_dict_value(rgs.make_key(generalstorekeys.test, "dict", 1), ['item1'], 'put_value')
        assert rgs.get_dict(rgs.make_key(generalstorekeys.test, "dict", 1), []) == {'item1': 'put_value', 'item2': '3'}

    def test_inc_int(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        key = rgs.make_key(generalstorekeys.test, "my_int", 1)
        rgs.delete_key(key)
        assert rgs.inc_int(key) == 1
        assert rgs.inc_int(key) == 2
        assert rgs.inc_int(key, 2) == 4
        with pytest.raises(ValueError):
            assert rgs.inc_int(key, -1) == 4

    def test_dec_int(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        key = rgs.make_key(generalstorekeys.test, "my_int", 1)
        rgs.delete_key(key)
        assert rgs.dec_int(key) == -1
        assert rgs.dec_int(key) == -2
        assert rgs.dec_int(key, 2) == -4
        with pytest.raises(ValueError):
            assert rgs.dec_int(key, -1) == -5

    def test_append_to_array(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        key = rgs.make_key(generalstorekeys.test, "my_array", 1)
        rgs.delete_key(key)
        assert rgs.append_to_array(key, "first") == 1
        assert rgs.append_to_array(key, "2nd") == 2
        assert rgs.append_to_array(key, "3rd") == 3
        assert rgs.get_array_count(key) == 3

    def test_delete_value_from_array(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        key = rgs.make_key(generalstorekeys.test, "my_array", 1)
        rgs.delete_key(key)
        assert rgs.append_to_array(key, "first") == 1
        assert rgs.append_to_array(key, "2nd") == 2
        assert rgs.append_to_array(key, "duplicate") == 3
        assert rgs.append_to_array(key, "duplicate") == 4

        assert rgs.delete_value_from_array(key, "duplicate")
        assert rgs.get_array_count(key)

    def test_get_array_element(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        key = rgs.make_key(generalstorekeys.test, "my_array", 1)
        rgs.delete_key(key)
        assert rgs.append_to_array(key, "first") == 1
        assert rgs.append_to_array(key, "2nd") == 2
        assert rgs.get_array_count(key) == 2

        assert rgs.get_array_element(key, 0) == "first"
        assert rgs.delete_value_from_array(key, "first")
        assert rgs.get_array_element(key, 0) == "2nd"

    def test_get_array(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        key = rgs.make_key(generalstorekeys.test, "my_array", 1)
        rgs.delete_key(key)
        assert rgs.append_to_array(key, "first") == 1
        assert rgs.append_to_array(key, "2nd") == 2
        assert rgs.get_array(key) == ["first", "2nd"]

    def test_in_array(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        key = rgs.make_key(generalstorekeys.test, "my_array", 1)
        rgs.delete_key(key)
        assert not rgs.in_array(key, "2nd")
        assert rgs.append_to_array(key, "first") == 1
        assert not rgs.in_array(key, "2nd")
        assert rgs.append_to_array(key, "2nd") == 2
        assert rgs.in_array(key, "2nd")

    def test_register(self, cfg):
        type_repos = TypeRepository()

        assert RedisGeneralStore.register(type_repos)
        general_store_class_name = cfg["config"]["general_store_class"]
        assert general_store_class_name

        GeneralStoreClass = type_repos.get_type(TYPE_GENERALSTORE, general_store_class_name)
        assert GeneralStoreClass

        rgs: GeneralStore = GeneralStoreClass(cfg)
        key = rgs.make_key(generalstorekeys.test, "my_int", 1)
        rgs.delete_key(key)
        assert rgs.dec_int(key) == -1

        with pytest.raises(Exception):
            GeneralStore.register(type_repos)

    def test_append_values_to_array(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        key = rgs.make_key(generalstorekeys.test, "my_array", 1)
        rgs.delete_key(key)
        assert rgs.append_values_to_array(key, ["first", "2nd", "3rd"]) == 3
        assert rgs.get_array_count(key) == 3

        lst = []
        for i in range(500):
            lst.append("value" + str(i))
        assert rgs.append_values_to_array(key, lst) == 503
        assert rgs.get_array_count(key) == 503
        rgs.delete_key(key)

    def test_register_scripts(self, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        assert rgs.call_script("lua_scripts_loaded") == "ok"

    def test_set_if_keys_dont_exists(self, uid, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        assert rgs.call_script("lua_scripts_loaded") == "ok"
        uid2 = str(uuid.uuid4())

        required_keys = [rgs.make_key(generalstorekeys.sync_core, "test_lock", "1"),
                         rgs.make_key(generalstorekeys.sync_core, "test_lock", "2"),
                         ]
        assert rgs.set_if_keys_dont_exists(prefixes_to_check=required_keys,
                                           prefixes_to_set=required_keys,
                                           value=str(datetime.datetime.now()),
                                           uid=uid,
                                           timeout=10
                                           )

        assert not rgs.set_if_keys_dont_exists(prefixes_to_check=required_keys,
                                               prefixes_to_set=required_keys,
                                               value=str(datetime.datetime.now()),
                                               uid=uid2,
                                               timeout=10
                                               )
        time.sleep(11)
        assert rgs.set_if_keys_dont_exists(prefixes_to_check=required_keys,
                                           prefixes_to_set=required_keys,
                                           value=str(datetime.datetime.now()),
                                           uid=uid,
                                           timeout=1
                                           )
        time.sleep(2)
        # check that no keys are set if only prefixes_to_set is not given
        assert rgs.set_if_keys_dont_exists(prefixes_to_check=required_keys,
                                           value=str(datetime.datetime.now()),
                                           uid=uid2,
                                           timeout=10
                                           )
        assert rgs.set_if_keys_dont_exists(prefixes_to_check=required_keys,
                                           value=str(datetime.datetime.now()),
                                           uid=uid,
                                           timeout=1
                                           )

    def test_delete_keys(self, uid, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        assert rgs.call_script("lua_scripts_loaded") == "ok"
        required_keys = [rgs.make_key(generalstorekeys.sync_core, "test_lock", "1"),
                         rgs.make_key(generalstorekeys.sync_core, "test_lock", "2"),
                         ]
        rgs.delete_keys(required_keys, uid)

        assert rgs.set_if_keys_dont_exists(prefixes_to_check=required_keys,
                                           prefixes_to_set=required_keys,
                                           value=str(datetime.datetime.now()),
                                           uid=uid,
                                           timeout=10
                                           )

        assert rgs.delete_keys(required_keys, uid) == 2

        assert rgs.set_if_keys_dont_exists(prefixes_to_check=required_keys,
                                           prefixes_to_set=required_keys,
                                           value=str(datetime.datetime.now()),
                                           uid=uid,
                                           timeout=10
                                           )

    def test_idle_time(self, uid, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        rgs.delete_key("akey")
        rgs.put_string("akey", "avalue")
        assert rgs.get_string("akey") == "avalue"
        time.sleep(1)
        assert rgs.get_key_idle_time("akey") >= 1

    def test_red_lock(self, uid, cfg):
        rgs = RedisGeneralStore(cfg, gs_id="MCP2_")
        lock = rgs.red_lock_lock("something")
        assert lock
        lock2 = rgs.red_lock_lock("something", wait_seconds=2)
        assert not lock2
        rgs.red_lock_unlock(lock)
        time.sleep(1)
        lock2 = rgs.red_lock_lock("something")
        assert lock2
        rgs.red_lock_unlock(lock2)

    def test_check_redis(self):
        from tools.unpackkiosk import check_redis
        assert check_redis()

    def test_json_unicode(self, cfg):
        rgs = RedisGeneralStore(cfg, always_decode_responses=False, gs_id="MCP2_")
        rgs.delete_key(rgs.make_key(generalstorekeys.test, "dict", 1))
        assert rgs.put_dict(rgs.make_key(generalstorekeys.test, "dict", 1), [], {})
        assert rgs.put_dict(rgs.make_key(generalstorekeys.test, "dict", 1), [], {'item1': 'luiza´s'})
        assert rgs.get_dict(rgs.make_key(generalstorekeys.test, "dict", 1)) == {'item1': 'luiza´s'}
