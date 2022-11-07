import logging
import os
import shutil
import sys

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from dsd.dsdinmemorystore import DSDInMemoryStore
from dsd.dsdyamlloader import DSDYamlLoader
from kioskfilecache import KioskFileCache
from sync_config import SyncConfig
from kiosksqldb import KioskSQLDb


class TransformFileCache:
    def __init__(self, config_file=""):
        self.c_warnings = 0
        self.c_moved = 0
        self.c_files = 0
        self.console = False

        if config_file:
            # noinspection PyProtectedMember
            SyncConfig._release_config()
            self.config = SyncConfig.get_config({"config_file": config_file})
        else:
            self.config = SyncConfig.get_config()

        if not self.config.get_file_repository():
            raise Exception(f"{self.__class__.__name__}.__init__: no access to file repository. Config not loaded.")

    def transform(self):
        """ Transforms an older file cache that stores all files in one base directory
            to the new structure using subdirectories.
        """

        cache_dir = os.path.join(self.config.get_file_repository(create_if_non_existant=True), "cache")
        if "cache" in self.config.file_repository:
            cache_dir = self.config.resolve_symbols(self.config.file_repository["cache"])
        else:
            logging.warning(f"file_repository_cache not set: Defaulting to {self._cache_dir}")

        file_cache = KioskFileCache(cache_base_dir=cache_dir)
        db = KioskSQLDb()
        file_repository_path = self.config.get_file_repository()

        dsd = DataSetDefinition(DSDInMemoryStore())
        dsd.register_loader(DSDLoaderClass=DSDYamlLoader, file_ext="yml")
        dsd.append_file(self.config.get_dsdfile())
        files_table = dsd.files_table
        assert files_table
        sql = f"select uid from {files_table}"
        cur = db.execute_return_cursor(sql)
        if not cur:
            logging.error(f"{self.__class__.__name__}.transform: select went wrong: {sql}")
            return False
        self.c_warnings = 0
        self.c_files = 0
        self.c_moved = 0

        r = cur.fetchone()
        if not r:
            logging.error(f"{self.__class__.__name__}.transform: {sql} returned an empty set.")
            cur.close()
            return False
        while r:
            if self.console:
                print(".", end="", flush=True)
                if self.c_files % 80 == 0:
                    print("\r\n", flush=True)
            self.c_files += 1
            uid = r["uid"]
            if uid:
                rc = file_cache.transform_cache_file(uid, commit=True, test_mode=False)
                if rc > 0:
                    self.c_moved += 1
                elif rc == 0:
                    self.c_warnings += 1

            r = cur.fetchone()

        if self.console:
            print("\r\n", flush=True)
        cur.close()
        return True

    def get_errors(self):
        return self.c_files - self.c_moved - self.c_warnings


def usage():
    print("""
    Usage of transformfilecache.py:
    ===================
      transformfilecache <kiosk-dir>
      <kiosk-dir> is required and must point to the base directory 
                  (in which a config\kiosk_config.yml is expected)

    """)
    sys.exit(0)


if __name__ == '__main__':

    if len(sys.argv) != 2:
        usage()

    kiosk_dir = sys.argv[1]
    if kiosk_dir and not os.path.isdir(kiosk_dir):
        logging.error(f"kiosk directory {kiosk_dir} does not seem to exist or is not a valid directory.")
        usage()

    cfg_file = os.path.join(kiosk_dir, r'config\kiosk_config.yml')
    if not os.path.isfile(cfg_file):
        logging.error(f"no kiosk_config.yml found. ")
        usage()

    transform = TransformFileCache(cfg_file)

    logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    logging.info(f"Starting transformation of file cache. Hold on...")
    transform.console = True
    if transform.transform():
        logging.info(f"Transformation succeeded: {transform.c_files} processed, {transform.c_moved} moved, "
                     f"{transform.get_errors()} errors.")
    else:
        logging.info(f"Transform failed.")
