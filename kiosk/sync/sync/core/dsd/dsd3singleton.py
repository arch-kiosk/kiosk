from dsd.dsd3 import DataSetDefinition
from dsd.dsdinmemorystore import DSDInMemoryStore
from dsd.dsdyamlloader import DSDYamlLoader
from threading import Lock
import logging


class Dsd3Singleton:
    __dsd3__ = None
    _lock = Lock()

    @classmethod
    def get_dsd3(cls) -> DataSetDefinition:
        if not cls.__dsd3__:
            if cls._lock.acquire(blocking=True, timeout=60):
                try:
                    if not cls.__dsd3__:
                        cls.__dsd3__ = DataSetDefinition(DSDInMemoryStore())
                        cls.__dsd3__.register_loader("yml", DSDYamlLoader)
                finally:
                    cls._lock.release()
            else:
                logging.error(
                    f"{cls.__name__}.get_thread_con: the DSD3 could not be initialized because "
                    f"the creation process could not be locked.")
                raise Exception(
                    f"{cls.__name__}.get_thread_con: the DSD3 could not be initialized because "
                    f"the creation process could not be locked.")

        return cls.__dsd3__

    @classmethod
    def release_dsd3(cls):
        cls.__dsd3__ = None
