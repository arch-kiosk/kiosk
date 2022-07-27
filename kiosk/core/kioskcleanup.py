import logging
import os
import datetime
from kioskconfig import KioskConfig
from kioskstdlib import get_file_age_days


class KioskCleanup:
    def __init__(self, max_age_days: int = 30, now=None):
        """

        :param max_age_days:
        :param now: for testing purposes only: sets now to a specific datetime.
        """
        self.paths = set()
        self.max_age_days = max_age_days
        self.now = now

    def add_dir(self, path):
        """
        adds a directory to be cleaned up
        :param path: a valid directory
        :raises ValueError: if the directory is not valid
        """
        if os.path.isdir(path):
            self.paths.add(path)
        else:
            raise ValueError(f"KioskCleanup._add_dir: {path} is not a valid directory.")

    def add_temp_dirs(self, config: KioskConfig):
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

    def cleanup(self) -> bool:
        rc = True
        for p in self.paths:
            files = [os.path.join(p, x) for x in os.listdir(p)]
            for f in files:
                file_age = get_file_age_days(f, now=self.now, use_most_recent_date=True)
                if file_age > self.max_age_days:
                    logging.info(f"Cleaning up temporary file {f}.")
                    rc = rc and self._delete_file(f)

        return rc
