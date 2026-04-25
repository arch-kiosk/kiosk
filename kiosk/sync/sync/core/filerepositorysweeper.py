import datetime
import logging
import os
import shutil
import uuid
from os.path import basename
from pathlib import Path

import kioskstdlib
from filerepository import FileRepository
from kiosksqldb import KioskSQLDb


class FileRepositorySweeper:
    """
    A utility class for sweeping a file repository by checking files against a database of valid UUIDs.
    Files that do not match any valid UUID or fail existence checks are either moved to a history directory or deleted.

    Assumptions:
    - No parallelism: This class is not thread-safe and assumes no concurrent access to the file repository.
    - No other operations with files are allowed while this is running. So rather run it as part of the setup than
      while Kiosk is running.
    - Broad exception handling: All exceptions are caught and logged, and the process stops or skips files on any error.
    - File operations are irreversible: Moved or deleted files are not recoverable through this class.

    Key Behaviors:
    - Files with invalid UUIDs or missing database records are moved to the history directory by default.
    - If `force_delete` is True, files are deleted instead of moved.
    -  Note that orphaned cache files are ALWAYS deleted for good.
    - If `test_run` is True, no actual file operations are performed (dry run mode).
    - Hidden files and directories (starting with '.') are skipped.
    - UUIDs are normalized (lowercase, no dashes) for internal checks but compared in both normalized and standard formats.

    Attributes:
        target_path (Path): The root directory to sweep.
        force_delete (bool): If True, files are deleted instead of moved.
        test_run (bool): If True, no file operations are performed (dry run).
        history_path (str): Directory where files are moved if not deleted. hard coded to be file-repos + \history
    """

    def __init__(self, target_path, cfg, force_delete=False, test_run=False, small_file_repositories=False):
        self.target_path = Path(target_path)
        self.force_delete = force_delete
        self.test_run = test_run
        self.cfg = cfg
        self.file_repository = FileRepository(self.cfg)
        self.history_path = os.path.join(cfg.get_file_repository(), "history")
        self.run_prefix = ""
        self.c_files = 0
        self.c_deleted = 0
        self.bytes_freed = 0
        self.file_uuids = []  # as a safety measure I also load all uuids in here from the file table directly
        self.small_file_repository = small_file_repositories
        if not test_run:
            os.makedirs(self.history_path, exist_ok=True)

    def move_file_to_dir(self, file_path, target_path):
        try:
            try:
                self.bytes_freed += int(kioskstdlib.get_file_size(file_path))
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}.move_file_to_dir: {repr(e)}")
            suffix = 0
            ok = False
            dest_file_name = ""
            while not ok:
                if suffix > 10:
                    logging.error(f"{self.__class__.__name__}.move_file_to_dir: {dest_file_name} "
                                  f"exists even after the {suffix-1} attempt. Something is up. Aborting.")
                    raise Exception("Aborting")
                dest_file_name = os.path.join(target_path, kioskstdlib.get_valid_filename(
                    f"{self.run_prefix}_{basename(str(file_path))}{'_'+str(suffix) if suffix else ''}"))
                if os.path.exists(dest_file_name):
                    suffix += 1
                else:
                    ok = True
            logging.debug(f"moving {file_path} to {dest_file_name}")
            if self.test_run:
                return
            shutil.move(file_path, dest_file_name)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.move_file_to_dir: move failed {repr(e)}. Aborting.")
            raise e

    def remove_file(self, file_path, uuid):
        self.move_file_to_dir(file_path, self.history_path)

    def force_remove_file(self, file_path):
        try:
            self.bytes_freed += int(kioskstdlib.get_file_size(file_path))
        except BaseException as e:
            logging.warning(f"{self.__class__.__name__}.move_file_to_dir: {repr(e)}")
        logging.debug(f"physically deleting file {file_path}")
        if not self.test_run:
            os.remove(file_path)

    def check_file(self, file_path, force_remove=False):
        """
        Logic for processing each individual file.
        """
        file_name = kioskstdlib.get_filename_without_extension(file_path.name)

        try:
            # 1. Parse the filename to ensure it's a valid UUID
            u_obj = uuid.UUID(file_name)
            # 2. Create the normalized string (lowercase, no dashes)
            normalized_file_uuid = str(u_obj).replace('-', '')
            # 3. Create the standard string (with dashes) if the repository object needs it
            standard_uuid_str = str(u_obj)
        except ValueError:
            logging.warning(f"The file {file_path} is not a valid file repository file. Moving to history.")
            self.move_file_to_dir(file_path, self.history_path)
            return False

        try:
            # Use the standard format for the FileRepository object check
            file_exists = self.file_repository.file_exists(standard_uuid_str)
            if not file_exists:
                file_exists = self.file_repository.file_exists(standard_uuid_str.upper())

            # Use the normalized format for the snapshot set check
            in_snapshot = normalized_file_uuid in self.file_uuids

            # The Safety Catch
            if file_exists != in_snapshot:
                logging.error(
                    f"Safety catch failed for {standard_uuid_str}. "
                    f"Repo says {file_exists}, Snapshot says {in_snapshot}. Aborting."
                )
                raise Exception("aborting")

            if not file_exists:
                if force_remove:
                    self.force_remove_file(file_path)
                else:
                    self.remove_file(file_path, standard_uuid_str)
                return True

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.check_file: {repr(e)}")
            if "abort" in repr(e).lower():
                raise e

        return False

    def run(self):
        """
        Orchestrates the directory traversal and filtering.
        """
        self.run_prefix = f"swept_{datetime.datetime.now().replace(microsecond=0)}"
        if not self.target_path.is_dir():
            logging.error(f"Error: {self.target_path} is not a valid directory.")
            return

        cache_dir = self.file_repository.get_cache_dir()
        if not os.path.isdir(cache_dir):
            logging.error(f"Error: {cache_dir} is not a valid directory.")
            return

        self.file_uuids = self.load_file_uuids()
        if (not self.file_uuids or len(self.file_uuids) < 100) and not self.small_file_repository:
            logging.error(
                f"Error: Only {len(self.file_uuids)} images in the file respository? "
                f"Please set the small_file_repository parameter")
            return


        print(f"**********************************")
        print(f"Kiosk File Repository Sweeper v1.0")
        print(f"**********************************")
        print(f"Found {len(self.file_uuids)} images in the file respository? ")

        logging.info(f"Kiosk File Repository Sweeper v1.0")
        logging.info(f"Found {len(self.file_uuids)} images in the file respository? ")

        if self.test_run:
            logging.info(f"--- just playing in {self.target_path} --- ")
        else:
            logging.info(f"--- Starting Sweep in: {self.target_path} ---")

        self.c_files = 0
        self.c_deleted = 0
        self.bytes_freed = 0

        self.check_base_dir(self.target_path, force_delete=self.force_delete)
        cache_dir_path = Path(cache_dir)
        for file_or_dir in cache_dir_path.iterdir():
            # Filter: Is a file AND is not hidden
            if file_or_dir.is_dir() and not file_or_dir.name.startswith('.'):
                # orphans in cache directories are always removed
                self.check_base_dir(file_or_dir, force_delete=True)
            else:
                if file_or_dir.is_file() and not file_or_dir.name.startswith('.'):
                    logging.warning(f"{file_or_dir} is in the root of the cache directory. "
                                    f"Not touching it.")

        logging.info(f"Operation complete: {self.c_files} checked, {self.c_deleted} files deleted, "
                     f"{int(self.bytes_freed / 1024 / 1024)} MBytes removed.")
        print(f"{os.linesep}--- Sweep Complete {self.c_files} checked, {self.c_deleted} files deleted, "
              f"{int(self.bytes_freed / 1024 / 1024)} MBytes removed. ---")

    def check_base_dir(self, target_path, force_delete=False):
        for file_or_dir in target_path.iterdir():
            # Filter: Is a file AND is not hidden
            if file_or_dir.is_dir() and not file_or_dir.name.startswith('.'):
                if len(file_or_dir.name) == 2:
                    self.sweep_files_from_dir(file_or_dir, force_delete=force_delete)
            else:
                if file_or_dir.is_file() and not file_or_dir.name.startswith('.'):
                    logging.warning(f"{file_or_dir} is in the root of the file repository. Not touching it.")
                    # if self.check_file(file_or_dir):
                    #     c_deleted += 1

    def sweep_files_from_dir(self, sub_path, force_delete=False):
        sub_dir = Path(sub_path)
        c = 0
        c_del = 0
        if not sub_dir.is_dir():
            logging.error(f"Error: {sub_dir} is not a valid directory.")
            return
        print(f"sweeping {sub_dir}: ", end="", flush=True)

        for file_or_dir in sub_dir.iterdir():
            if not (file_or_dir.is_dir() or file_or_dir.name.startswith(".")):
                if c % 10 == 0: print(".", end="", flush=True)
                c += 1
                if self.check_file(file_or_dir, force_remove=force_delete):
                    self.c_deleted += 1
                    c_del += 1
        print(f"OK ({c} files checked. {c_del} files removed)", end=os.linesep, flush=True)
        logging.info(f"{sub_path}: ({c} files checked. {c_del} files removed)")
        self.c_files += c

    def load_file_uuids(self):
        try:
            raw_records = [x[0] for x in KioskSQLDb.get_records("select uid from images")]
            return set(str(uuid.UUID(str(x))).replace('-', '') for x in raw_records)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.load_file_uuids: {repr(e)}. Aborting.")
            raise Exception("aborting")
