import inspect
import logging
import json
import os
import time
from functools import reduce

from redis.commands.json.path import Path
from redis import Redis as Client

import kioskstdlib
from config import Config
from generalstore.generalstore import GeneralStore
from synchronizationplugin import SynchronizationPlugin
from synchronization import Synchronization
# from .redisredlock import Redlock
from redis_lock import Lock, NotAcquired

GENERAL_LOCK_NAME = "KIOSK_GENERAL_LOCK"


# ************************************************************************
# Plugin code for PluginRedisGeneralStore
# ***********************************************************************
class PluginRedisGeneralStore(SynchronizationPlugin):
    _plugin_version = 0.1

    def init_app(self, app):
        # from .redisthreadedjobgarbagecollector import RedisThreadedJobGarbageCollector
        super(PluginRedisGeneralStore, self).init_app(app)
        if self.app:
            RedisGeneralStore.register(self.app.type_repository)
            # RedisThreadedJobGarbageCollector.register(self.app.type_repository)

    @staticmethod
    def register_type(type_repository):
        # from .redisthreadedjobgarbagecollector import RedisThreadedJobGarbageCollector
        if type_repository:
            RedisGeneralStore.register(type_repository)
            # RedisThreadedJobGarbageCollector.register(type_repository)

    # def all_plugins_ready(self):
    #     app = self.app
    #     if app:
    #         if app.type_repository.
    #         RedisGeneralStore.register(self.app.type_repository)
    #         logging.debug("PluginRedisGeneralStore ready.")
    #     else:
    #         logging.error("PluginRedisGeneralStore: plugin could not be registered due to no app.")
    #         return False
    #
    #     return True


class RedisGeneralStore(GeneralStore):
    """
    todo: document RedisGeneralStore
    """

    LUA_SCRIPTS = [os.path.join("lua", "lua_scripts_loaded.lua"),
                   os.path.join("lua", "set_if_keys_dont_exist.lua")
                   ]

    # redis_lock = Lock()

    def __init__(self, config: Config, always_decode_responses=True, gs_id=""):
        self._scripts = {}
        self.address = ""
        self.port = None
        self.gs_id = gs_id.replace("_", "+").lower()
        # self._red_lock: Redlock = None
        # self._red_lock: Lock = None

        self._always_decode_responses = always_decode_responses

        self.redis: Client = None
        self._read_config(config)
        self._register_lua_scripts()
        red_lock_logger = logging.getLogger('redis_lock')
        red_lock_logger.setLevel(logging.WARNING)

    def register_lua_file(self, filename):
        self._connect()
        with open(filename, "r") as lua_file:
            lua_code_list = lua_file.readlines()
        lua_code = "".join(lua_code_list)
        return self.redis.register_script(lua_code)

    def _read_config(self, config: Config):
        self.address = config["config"]["redis_address"]
        self.port = int(config["config"]["redis_port"])
        self._use_process_lock_on_dicts = kioskstdlib.to_bool(kioskstdlib.try_get_dict_entry(config["config"],"use_process_lock_on_dicts",True, True))
        if self._use_process_lock_on_dicts:
            logging.debug(f"{self.__class__.__name__}._read_config: use_process_lock_on_dicts is on")
        else:
            logging.debug(f"{self.__class__.__name__}._read_config: NOTE: use_process_lock_on_dicts is turned off")

    def _connect(self, force=False) -> Client:
        if (not self.redis or force) and isinstance(self.port, int):
            self.redis = Client(host=self.address, port=self.port, encoding='utf-8',
                                decode_responses=self._always_decode_responses)
            # self._red_lock = Redlock([self.redis])
        return self.redis

    def _check_redis(self):
        redis = self._connect()

        if not redis.ping():
            raise RuntimeError(f"redis is not responding at {self.address}:{self.port}.")
        return True

    def is_running(self):
        try:
            if self._check_redis():
                return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.is_running: {repr(e)}")
        return False

    @staticmethod
    def make_key(*args):
        """
        creates a key to store something in the general store.
        :param args: a list of elements that can be represented as a string.
        :return: returns a key that is just a concatenation of the parameters.
        """
        return "_".join([str(s) for s in args])

    def get_redis_version(self) -> str:
        """
        returns the version of the running redis instance as a string
        :return: version as string
        """
        self._connect()
        return self.redis.execute_command('INFO')["redis_version"]

    def get_keys(self, prefix=""):
        """

        :param prefix:
        :return:
        todo: test, particularly with gs_id
        """
        self._connect()
        gs_id_len = len(self.gs_id)
        keys = self.gs_id + prefix + "*"
        return [k[gs_id_len:] for k in self.redis.keys(keys)]

    def put_string(self, key, value: str):
        key = self.gs_id + key
        if isinstance(value, str):
            self._connect()
            return self.redis.set(key, value)
        else:
            raise TypeError(f"{value} is not a string.")

    def get_string(self, key):
        self._connect()
        key = self.gs_id + key
        rc = self.redis.get(key)
        if rc is None:
            raise KeyError(f"Key {key} not found")

        return rc

    # todo: unit test!
    def set_timeout(self, key, seconds):
        self._connect()
        key = self.gs_id + key
        rc = self.redis.expire(key, seconds)
        if not rc:
            raise KeyError(f"Key {key} not found")

    def put_int(self, key, value: int):
        key = self.gs_id + key
        if isinstance(value, int):
            self._connect()
            return self.redis.set(key, str(value))
        else:
            raise TypeError(f"{value} is not an int!")

    def get_int(self, key):
        """

        :param key: a valid key to lookup a value
        :return: the integer value stored in that key
        :raises ValueError: a value was returned but it was not an int
        :raises KeyError: if the key is unknown
        """
        key = self.gs_id + key
        self._connect()
        rc = self.redis.get(key)
        if rc is None:
            raise KeyError(f"Key {key} not found")

        return int(rc)

    def inc_int(self, key, value=1):
        key = self.gs_id + key
        if isinstance(value, int) and value > 0:
            self._connect()
            if value == 1:
                return self.redis.incr(key)
            else:
                return self.redis.incrby(key, value)
        else:
            if value < 1:
                raise ValueError(f"{value} must not be <= 0.")
            else:
                raise TypeError(f"{value} is not an int!")

    def dec_int(self, key, value=1):
        key = self.gs_id + key
        if isinstance(value, int) and value > 0:
            self._connect()
            if value == 1:
                return self.redis.decr(key)
            else:
                return self.redis.decrby(key, value)
        else:
            if value < 1:
                raise ValueError(f"{value} must not be <= 0.")
            else:
                raise TypeError(f"{value} is not an int!")

    def put_dict(self, key, path: [], value: object):
        key = self.gs_id + key
        json_path = self._make_json_path(path)

        if isinstance(value, dict):
            self._connect()
            return self.redis.json().set(key, json_path, value)
        else:
            raise TypeError(f"{value} is not a dict!")

    def put_dict_value(self, key, path: [], value):
        """
        todo: why using a lock here?
        :param key:
        :param path:
        :param value:
        :return:
        """
        key = self.gs_id + key
        if not path:
            raise TypeError("put_dict_value needs a path!")

        json_path = self._make_json_path(path)
        self._connect()

        try:
            # What is the point of a process lock here? Shouldn't REDIS be handling concurrency?
            # And if it is really needed, why not use the red_lock_lock method?
            lock = Lock(self.redis, name=self.gs_id + GENERAL_LOCK_NAME, expire=10)
            if not lock.acquire(timeout=10):
                raise NotAcquired()
        except NotAcquired:
            caller = "?"
            try:
                caller = inspect.currentframe().f_back.f_code.co_name
            except:
                pass
            if self._use_process_lock_on_dicts:
                raise Exception(f"redisgeneralstore.put_dict_value: Called by [{caller}]: Lock not acquired")
            else:
                logging.debug(f"{self.__class__.__name__}.put_dict_value: Issues with a lock "
                              f"(_use_process_lock_on_dicts is False!) - called by [{caller}]: Lock not acquired")

        try:
            rc = self.redis.json().set(key, json_path, value)
        finally:
            try:
                lock.release()
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}.put_dict_value: trouble when releasing lock: {repr(e)}")

        return rc

    def get_dict(self, key, path: [] = None):
        """
        todo: why using a lock here?

        :param key:
        :param path:
        :return:
        """
        key = self.gs_id + key
        json_path = self._make_json_path(path)

        try:
            # What is the point of a process lock here? Shouldn't REDIS be handling concurrency?
            # And if it is really needed, why not use the red_lock_lock method?
            lock = Lock(self.redis, name=self.gs_id + GENERAL_LOCK_NAME, expire=10)
            if not lock.acquire(timeout=10):
                raise NotAcquired()
        except NotAcquired:
            caller = "?"
            try:
                caller = inspect.currentframe().f_back.f_code.co_name
            except:
                pass
            if self._use_process_lock_on_dicts:
                raise Exception(f"redisgeneralstore.get_dict: Called by [{caller}]: Red-Lock not acquired")
            else:
                logging.debug(f"{self.__class__.__name__}.get_dict_value: Issues with a lock "
                              f"(_use_process_lock_on_dicts is False!) - called by [{caller}]: Lock not acquired")

        try:
            # note the no_escape parameter! see https://github.com/RedisJSON/redisjson-py/pull/26
            rc = self.redis.json().get(key, json_path, no_escape=True)
        except BaseException as e:
            logging.debug(f"{self.__class__.__name__}.get_dict: {repr(e)}")
        finally:
            try:
                lock.release()
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}.get_dict_value: trouble when releasing lock: {repr(e)}")

        if rc is None:
            raise KeyError(f"Key {key} not found")

        return rc

    def append_to_array(self, key, value) -> int:
        self._connect()
        key = self.gs_id + key
        return self.redis.rpush(key, value)

    def append_values_to_array(self, key, value: []) -> int:
        self._connect()
        key = self.gs_id + key
        return self.redis.rpush(key, *value)

    def delete_value_from_array(self, key, value):
        self._connect()
        key = self.gs_id + key
        return self.redis.lrem(key, 0, value)

    def get_array_count(self, key):
        self._connect()
        key = self.gs_id + key
        return self.redis.llen(key)

    def get_array_element(self, key, index):
        self._connect()
        key = self.gs_id + key
        return self.redis.lindex(key, index)

    def get_array(self, key) -> []:
        self._connect()
        key = self.gs_id + key
        return self.redis.lrange(key, 0, -1)

    def in_array(self, key, value):
        self._connect()
        all_elements = self.get_array(key)
        return value in all_elements

    def set_if_keys_dont_exists(self, prefixes_to_check: [str], value: str, uid="",
                                prefixes_to_set: [str] = [], timeout=0) -> bool:
        """
        An atomic operation that checks if keys with any of the given prefixes exist. Only if that is NOT the case
        those keys will be set to the given value. An optional uid will be added to the prefix. Additionally a
        separate list of keys will be set in the same manner (prefix+optional uid = value) if given.
        All keys will be created with a timeout, if one is given, that is.

        :param prefixes_to_check: a list of prefixes that will be checked and, if no such keys exist, created.
        :param value: that's the value all the keys will be set to.
        :param uid: optional. if given, the keys will be created as prefix+uid.
        :param prefixes_to_set: optional. If given, these keys will be set, too.
        :param timeout: optional. If given, it will be applied to all keys.

        :returns bool: If True, the keys are created. If False, they are not.
        """
        required_prefixes_str = "$".join([self.gs_id + key for key in prefixes_to_check])
        prefixes_to_set_str = "$".join([self.gs_id + key for key in prefixes_to_set])

        rc = self.call_script("set_if_keys_dont_exist", keys=[required_prefixes_str, prefixes_to_set_str],
                              params=[value, uid, timeout])
        if rc == "ok":
            return True
        else:
            if rc.find("key already exists") > -1:
                return False
            else:
                raise Exception(rc)

    @staticmethod
    def _make_json_path(path):
        if not path:
            try:
                json_path = Path.root_path()
            except:
                json_path = Path.rootPath()

        else:
            json_path = Path("." + ".".join([str(s) for s in path]))
        return json_path

    def delete_key(self, key):
        self._connect()
        key = self.gs_id + key
        return self.redis.delete(key)

    def get_key_idle_time(self, key) -> int:
        self._connect()
        key = self.gs_id + key
        return self.redis.object("idletime", key)

    def delete_keys(self, prefixes: [str], uid="") -> int:
        if uid:
            keys = ["".join([x, uid]) for x in prefixes]
        else:
            keys = prefixes
        keys = [self.gs_id + key for key in keys]
        logging.debug(f"deleting {keys}")
        return self.redis.delete(*keys)

    def _register_lua_scripts(self):

        module_path = os.path.dirname(os.path.realpath(__file__))
        print(module_path)
        for script in self.LUA_SCRIPTS:
            script_file = str(os.path.join(module_path, script))
            print(script_file)
            script_name = kioskstdlib.get_filename_without_extension(str(os.path.basename(script)))
            print(script_name)
            script = self.register_lua_file(script_file)
            if not script:
                raise Exception("Lua script {script_file} could not be registered with redis.")
            else:
                self._scripts[script_name] = script

    def call_script(self, script_name, keys=[], params=[]):
        script = self._scripts[script_name]
        return script(keys=keys, args=params)

    def red_lock_lock(self, ressource, wait_seconds=60, expire_seconds=60):
        """
        todo: documentation

        :param ressource: string with system-wide lock name
        :param seconds: number of seconds to wait for the lock until locking fails
        :return: the lock or False
        """
        self._connect()
        lock = Lock(self.redis, name=self.gs_id + ressource, expire=expire_seconds)
        if lock.acquire(timeout=wait_seconds):
            return lock
        else:
            return False

    @staticmethod
    def red_lock_unlock(lock):
        """
        todo: documentation

        :param lock: a lock returned by red_lock_lock
        :return: True. Will raise Exception otherwise
        """
        lock.release()
        return True

    def acquire_process_lock(self, key, timeout=60, expire_seconds=0):
        """
        acquires a process-wide lock. Only one process at a time can hold it.
        :param key: the name of the lock
        :param timeout: if given a timeout in seconds. 60 is the default timeout.
        :param expire_seconds: if given and > 0: number of seconds until the lock expires automatically.
        :returns: the lock or False. Can raise Exceptions, too.
        """
        return self.red_lock_lock(ressource=self.gs_id + key, wait_seconds=timeout, expire_seconds=expire_seconds)

    def release_process_lock(self, lock):
        """
        releases a formerly acquired process-wide lock. Only one process at a time can hold it.
        :param lock: the formerly acquired lock
        :returns: no returns, raises Exceptions in case of trouble
        """
        try:
            self.red_lock_unlock(lock)
        except NotAcquired as e:
            pass

    def is_cache_valid(self, key) -> bool:
        """
        returns True if a cache is valid
        :param key:
        :return: bool
        """
        try:
            return self.get_int(key) < 1
        except KeyError:
            return True


    def validate_cache(self, key) -> None:
        """
        validates a cache. It usually reduces the key's int value by its initial number.
        If no parallel process interferes during the operation that would be 0.
        If this sets the cache key below zero, the key will be deleted.
        :param key: the name of the key
        :return: nothing
        """

        # yup, the whole thing has a race condition. I accept it here.
        # todo: refactor and solve the race condition
        try:
            current_value = self.get_int(key)
        except KeyError:
            current_value = 1

        if self.dec_int(key, current_value) < 0:
            self.delete_key(key)

    def invalidate_cache(self, key) -> None:
        """
        increments the cache value by 1
        :param key: the name of the key
        :return: nothing
        """
        self.inc_int(key)
