import datetime
import logging
import os
import shutil
from typing import Callable

import kioskstdlib
from kioskstdlib import get_file_age_days
from sync_config import SyncConfig


class KioskCleanup:
    def __init__(self, max_age_days: int = 30, now=None, move_to=""):
        """

        :param max_age_days: max days a file can be old before it gets moved or deleted
        :param now: for testing purposes only: sets now to a specific datetime.
                     If not set now will be set to the local now
        :param move_to: if set files will be moved to this directory intead of deleted
        """
        self.paths = set()
        self.max_age_days = max_age_days
        self.now = now if now else datetime.datetime.now()
        self.move_to = move_to

    def add_dir(self, path, force=False):
        """
        adds a directory to be cleaned up
        :param force: if True this allows to add a non-Kiosk path. Normally this method is only allowed to accept
                      Kiosk subdirectories
        :param path: a valid directory
        :raises ValueError: if the directory is not valid
        """
        config = SyncConfig.get_config()
        if os.path.isdir(path):
            if force or (config.base_path in str(path) and config.base_path.lower() != str(path).lower()):
                self.paths.add(path)
            else:
                raise ValueError(f"KioskCleanup._add_dir: {path} is not a Kiosk directory.")
        else:
            raise ValueError(f"KioskCleanup._add_dir: {path} is not a valid directory.")

    def add_temp_dirs(self, config: SyncConfig):
        """
        adds the temporary directories of kiosk to the clean up
        """
        self.add_dir(config.get_temp_dir())
        self.add_dir(config.get_temporary_upload_path())

    def _delete_file(self, filename: str):
        try:
            os.remove(filename)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}. : {repr(e)}")
            return False

    def _move_file(self, filename: str):
        try:
            shutil.move(filename, os.path.join(self.move_to, kioskstdlib.get_filename(filename)))
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._move_file: {repr(e)}")
            return False

    def cleanup(self, on_check_file: Callable = None) -> bool:
        if self.move_to and not os.path.exists(self.move_to):
            raise Exception(f"{self.__class__.__name__}.cleanup: target directory does not exist: {self.move_to}")
        rc = True
        for p in self.paths:
            if len(str(p)) < 4:
                logging.error(f"{self.__class__.__name__}.cleanup: Not willing to operate in a path like {p}")
                continue
            files = [os.path.join(p, x) for x in os.listdir(p)]
            for f in files:
                file_age = get_file_age_days(f, now=self.now, use_most_recent_date=True)
                if file_age > self.max_age_days:
                    if not on_check_file or on_check_file(f):
                        logging.info(f"Cleaning up temporary file {f}.")
                        if self.move_to:
                            self._move_file(f)
                        else:
                            rc = rc and self._delete_file(f)
                    else:
                        logging.debug(f"{self.__class__.__name__}.cleanup: File {f} skipped.")
        return rc
