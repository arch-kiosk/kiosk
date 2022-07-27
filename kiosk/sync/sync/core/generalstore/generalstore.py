from config import Config
from typerepository import TypeRepository

from syncrepositorytypes import TYPE_GENERALSTORE


class GeneralStore:
    @staticmethod
    def make_key(*args):
        """
        creates a key to store something in the general store.
        Abstract: Needs to be implemented by every subclass.

        :param args: a list of elements that can be represented as a string.
        :return: returns a key that is syntactically valid for the given general store.
        """
        raise NotImplementedError

    @classmethod
    def register(cls, type_repos: TypeRepository):
        if cls.__name__ != "GeneralStore":
            type_repos.register_type(TYPE_GENERALSTORE, cls.__name__, cls)
            return True
        else:
            raise Exception("Attempt to register base class GeneralStore in the type repository.")

    def __init__(self, config: Config):
        raise NotImplementedError

    def is_running(self):
        """
        checks whether the general store is up and running.
        """
        raise NotImplementedError

    def get_keys(self, prefix="") -> []:
        """
        retrieves a list of keys with the given prefix
        :param prefix: if set the keys must start with this prefix
        :returns a list
        """
        raise NotImplementedError

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
        raise NotImplementedError

    def put_string(self, key, value):
        raise NotImplementedError

    def get_string(self, key):
        """
        sets a key in the general store
        :param key: the key (a string)
        :return a Trueish value. Otherwise an exception will occur
        :exception KeyError if the key does not exist.
        """
        raise NotImplementedError

    def set_timeout(self, key, seconds):
        """
        :param key: a valid key to lookup a value
        :param seconds: number of seconds the key may live
        :raises KeyError: if the key is unknown
        """

    def put_int(self, key, value):
        raise NotImplementedError

    def get_int(self, key):
        """
        :param key: a valid key to lookup a value
        :return: the integer value stored in that key
        :raises ValueError: a value was returned but it was not an int
        :raises KeyError: if the key is unknown
        """
        raise NotImplementedError

    def inc_int(self, key, value=1):
        """
        :param key: a valid key for this general store. If the key does not exist it will be intialized with 0.
        :param value: if given, the int will be increased by this number. Otherwise by 1.
        :return: the integer value after the increase.
        :raises ValueError: a value was returned but it was not an int, or the given value parameter was < 1
        """
        raise NotImplementedError

    def dec_int(self, key, value=1):
        """
        :param key: a valid key for this general store. If the key does not exist it will be intialized with 0.
        :param value: if given, the int will be decreased by this number. Otherwise by 1.
        :return: the integer value after the decrease.
        :raises ValueError: a value was returned but it was not an int, or the given value parameter was < 1
        """
        raise NotImplementedError

    def put_dict(self, key, path: [], value) -> bool:
        """
        stores a dictionary under the given key. Parts of the stored dictionary are manipulated via path.
        :param key: a valid key for this general store
        :param path: if not [], the elements of the list are interpreted as an attribute path of the stored dict.
                    e.G. ["attributes", 1] points to <value> in {attributes{ 1: <value>}}.
        :param value: the dict to store.
        :returns bool
        """
        raise NotImplementedError

    def put_dict_value(self, key, path: [], value):
        """
        updates only a part of a dictionary under the given key.
        :param key: a valid key for this general store
        :param path: Elements of this list are interpreted as an attribute path of the stored dict.
                    e.G. ["attributes", 1] points to <value> in {attributes{ 1: <value>}}.
        :param value: the value to store.
        :returns bool
        """
        raise NotImplementedError

    def get_dict(self, key, path: [] = None):
        """
        retrieves a dictionary from the given key. If only parts of the stored dictionary are needed, you can use path
        to specify a path into the dict.
        :param key: a valid key for this general store
        :param path: if not [], the elements of the list are interpreted as an attribute path of the stored dict.
                    e.G. ["attributes", 1] points to <value> in {attributes{ 1: <value>}}.
        """
        raise NotImplementedError

    def append_to_array(self, key, value) -> int:
        """
        Appends an element value to the end an array referred to by key.
        :param key: a valid key for this general store
        :param value: the value to append
        :returns number of elements in the array after the append
        """
        raise NotImplementedError

    def append_values_to_array(self, key, value: []) -> int:
        """
        Appends a list of elements to the end an array referred to by key.
        :param key: a valid key for this general store
        :param value: a list
        :returns number of elements in the array after the append
        """
        raise NotImplementedError

    def get_array_count(self, key):
        """
        Returns how many elements are in an array.
        :param key: a valid key for this general store
        """
        raise NotImplementedError

    def get_array_element(self, key, index):
        """
        Returns the element at the given index from an array
        :param key: a valid key for this general store
        :param index: the index of the element
        """
        raise NotImplementedError

    def get_array(self, key) -> []:
        """
        Returns the complete array as a list.
        :param key: a valid key for this general store
        """
        raise NotImplementedError

    def in_array(self, key, value):
        """
        Checks if a value is an element of an array
        :param key: a valid key for this general store
        :param value: the value to check
        """
        raise NotImplementedError

    def delete_value_from_array(self, key, value):
        """
        removes all elements with the given value from the array
        :param key: a valid key for this general store
        :param value: the value to delete
        :returns number of deleted elements
        """
        raise NotImplementedError

    def delete_key(self, key):
        raise NotImplementedError

    def delete_keys(self, prefixes: [str], uid="") -> bool:
        """
        Deletes a bunch of keys in one stroke. A key is either the mere prefix or, if given, the prefix + uid.
        :param prefixes: a list of prefixes (or keys, should uid be empty)
        :param uid: optional. Will be added to the prefix when deleting.
        :returns number of deletions.
        """
        raise NotImplementedError

    def get_key_idle_time(self, key) -> int:
        """
        :param key: the key
        :return: the seconds since the key was last touched.
        """
        raise NotImplementedError

    def acquire_process_lock(self, key, timeout=60, expire_seconds=0):
        """
        acquires a process-wide lock. Only one process at a time can hold it.
        :param key: the name of the lock
        :param timeout: if given a timeout in seconds. 60 is the default timeout.
        :param expire_seconds: if given and > 0: number of seconds until the lock expires automatically.
        :returns: the lock or False. Can raise Exceptions, too.
        """
        raise NotImplementedError

    def release_process_lock(self, lock):
        """
        releases a formerly acquired process-wide lock. Only one process at a time can hold it.
        :param lock: the formerly acquired lock
        :returns: no returns, raises Exceptions in case of trouble
        """
        raise NotImplementedError
