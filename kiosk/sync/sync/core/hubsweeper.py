import datetime
import logging
import os
import shutil
import uuid
from os.path import basename
from pathlib import Path
from typing import Tuple

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from filerepository import FileRepository
from kiosksqldb import KioskSQLDb
from plugins.filerepositoryplugin.filerepositoryarchive import FileRepositoryArchive, FR_ARCHIVE_NAMESPACE
from sync_config import SyncConfig
from workstation import Workstation, Dock


class HubSweeper:
    """
    A utility class for removing physical remains of deleted docks,
    which is not necessarily being done automatically on deleting a dock. The reason for that is
    that the remains might still prove useful as a resource to debug and solve problems in the future.

    """

    def __init__(self,
                 cfg: SyncConfig,
                 test_run=False):
        self.test_run = test_run
        self.cfg = cfg
        self.c_files = 0
        self.c_deleted = 0
        self.bytes_freed = 0

    # def move_file_to_dir(self, file_path, target_path):
    #     try:
    #         try:
    #             self.bytes_freed += int(kioskstdlib.get_file_size(file_path))
    #         except BaseException as e:
    #             logging.warning(f"{self.__class__.__name__}.move_file_to_dir: {repr(e)}")
    #         suffix = 0
    #         ok = False
    #         dest_file_name = ""
    #         while not ok:
    #             if suffix > 10:
    #                 logging.error(f"{self.__class__.__name__}.move_file_to_dir: {dest_file_name} "
    #                               f"exists even after the {suffix - 1} attempt. Something is up. Aborting.")
    #                 raise Exception("Aborting")
    #             dest_file_name = os.path.join(target_path, kioskstdlib.get_valid_filename(
    #                 f"{self.run_prefix}_{basename(str(file_path))}{'_' + str(suffix) if suffix else ''}"))
    #             if os.path.exists(dest_file_name):
    #                 suffix += 1
    #             else:
    #                 ok = True
    #         logging.debug(f"moving {file_path} to {dest_file_name}")
    #         if self.test_run:
    #             return
    #         shutil.move(file_path, dest_file_name)
    #     except BaseException as e:
    #         logging.error(f"{self.__class__.__name__}.move_file_to_dir: move failed {repr(e)}. Aborting.")
    #         raise e
    #
    # def remove_file(self, file_path, uuid):
    #     self.move_file_to_dir(file_path, self.history_path)
    #
    # def force_remove_file(self, file_path):
    #     try:
    #         self.bytes_freed += int(kioskstdlib.get_file_size(file_path))
    #     except BaseException as e:
    #         logging.warning(f"{self.__class__.__name__}.move_file_to_dir: {repr(e)}")
    #     logging.debug(f"physically deleting file {file_path}")
    #     if not self.test_run:
    #         os.remove(file_path)
    #
    # def check_file(self, file_path, force_remove=False):
    #     """
    #     Logic for processing each individual file.
    #     """
    #     file_name = kioskstdlib.get_filename_without_extension(file_path.name)
    #
    #     try:
    #         # 1. Parse the filename to ensure it's a valid UUID
    #         u_obj = uuid.UUID(file_name)
    #         # 2. Create the normalized string (lowercase, no dashes)
    #         normalized_file_uuid = str(u_obj).replace('-', '')
    #         # 3. Create the standard string (with dashes) if the repository object needs it
    #         standard_uuid_str = str(u_obj)
    #     except ValueError:
    #         logging.warning(f"The file {file_path} is not a valid file repository file. Moving to history.")
    #         self.move_file_to_dir(file_path, self.history_path)
    #         return False
    #
    #     try:
    #         # Use the standard format for the FileRepository object check
    #         file_exists = True  # safety catch: Just assuming it exists, so prove me wrong ...
    #         for files_table in ([None] + self.file_repos_archive_tables):
    #             try:
    #                 file_exists = self.file_repository.file_exists(standard_uuid_str, files_table)
    #                 if not file_exists:
    #                     file_exists = self.file_repository.file_exists(standard_uuid_str.upper(), files_table)
    #                 if file_exists:
    #                     logging.debug(f"{self.__class__.__name__}.check_file: Found file {standard_uuid_str} in "
    #                                   f"'{files_table}'")
    #                     break
    #             except BaseException as e:
    #                 logging.error(f"{self.__class__.__name__}.check_file: Error checking file {standard_uuid_str} in "
    #                                   f"'{files_table}': {repr(e)}")
    #                 raise Exception("aborting")
    #
    #         # Use the normalized format for the snapshot set check
    #         in_snapshot = normalized_file_uuid in self.file_uuids
    #
    #         # The Safety Catch
    #         if file_exists != in_snapshot:
    #             logging.error(
    #                 f"Safety catch failed for {standard_uuid_str}. "
    #                 f"Repo says {file_exists}, Snapshot says {in_snapshot}. Aborting."
    #             )
    #             raise Exception("aborting")
    #
    #         if not file_exists:
    #             if force_remove:
    #                 self.force_remove_file(file_path)
    #             else:
    #                 self.remove_file(file_path, standard_uuid_str)
    #             return True
    #
    #     except BaseException as e:
    #         logging.error(f"{self.__class__.__name__}.check_file: {repr(e)}")
    #         if "abort" in repr(e).lower():
    #             raise e
    #
    #     return False
    #
    # def run(self):
    #     """
    #     Orchestrates the directory traversal and filtering.
    #     """
    #     self.run_prefix = f"swept_{datetime.datetime.now().replace(microsecond=0)}"
    #     if not self.target_path.is_dir():
    #         logging.error(f"Error: {self.target_path} is not a valid directory.")
    #         return
    #
    #     cache_dir = self.file_repository.get_cache_dir()
    #     if not os.path.isdir(cache_dir):
    #         logging.error(f"Error: {cache_dir} is not a valid directory.")
    #         return
    #
    #     try:
    #         self.file_uuids = self.load_file_uuids()
    #         if (not self.file_uuids or len(self.file_uuids) < 100) and not self.small_file_repository:
    #             logging.error(
    #                 f"Error: Only {len(self.file_uuids)} images in the file respository? "
    #                 f"Please set the small_file_repository parameter")
    #             return
    #     except BaseException as e:
    #         logging.error(f"{self.__class__.__name__}.run: {repr(e)}")
    #         return
    #
    #     print(f"**********************************")
    #     print(f"Kiosk File Repository Sweeper v1.0")
    #     print(f"**********************************")
    #     print(f"Found {len(self.file_uuids)} images in the file respository? ")
    #
    #     logging.info(f"Kiosk File Repository Sweeper v1.0")
    #     logging.info(f"Found {len(self.file_uuids)} images in the file respository? ")
    #
    #     if self.test_run:
    #         logging.info(f"--- just playing in {self.target_path} --- ")
    #     else:
    #         logging.info(f"--- Starting Sweep in: {self.target_path} ---")
    #
    #     self.c_files = 0
    #     self.c_deleted = 0
    #     self.bytes_freed = 0
    #
    #     self.check_base_dir(self.target_path, force_delete=self.force_delete)
    #     cache_dir_path = Path(cache_dir)
    #     for file_or_dir in cache_dir_path.iterdir():
    #         # Filter: Is a file AND is not hidden
    #         if file_or_dir.is_dir() and not file_or_dir.name.startswith('.'):
    #             # orphans in cache directories are always removed
    #             self.check_base_dir(file_or_dir, force_delete=True)
    #         else:
    #             if file_or_dir.is_file() and not file_or_dir.name.startswith('.'):
    #                 logging.warning(f"{file_or_dir} is in the root of the cache directory. "
    #                                 f"Not touching it.")
    #
    #     logging.info(f"Operation complete: {self.c_files} checked, {self.c_deleted} files deleted, "
    #                  f"{int(self.bytes_freed / 1024 / 1024)} MBytes removed.")
    #     print(f"{os.linesep}--- Sweep Complete {self.c_files} checked, {self.c_deleted} files deleted, "
    #           f"{int(self.bytes_freed / 1024 / 1024)} MBytes removed. ---")
    #
    # def check_base_dir(self, target_path, force_delete=False):
    #     for file_or_dir in target_path.iterdir():
    #         # Filter: Is a file AND is not hidden
    #         if file_or_dir.is_dir() and not file_or_dir.name.startswith('.'):
    #             if len(file_or_dir.name) == 2:
    #                 self.sweep_files_from_dir(file_or_dir, force_delete=force_delete)
    #         else:
    #             if file_or_dir.is_file() and not file_or_dir.name.startswith('.'):
    #                 logging.warning(f"{file_or_dir} is in the root of the file repository. Not touching it.")
    #                 # if self.check_file(file_or_dir):
    #                 #     c_deleted += 1
    #
    # def sweep_files_from_dir(self, sub_path, force_delete=False):
    #     sub_dir = Path(sub_path)
    #     c = 0
    #     c_del = 0
    #     if not sub_dir.is_dir():
    #         logging.error(f"Error: {sub_dir} is not a valid directory.")
    #         return
    #     print(f"sweeping {sub_dir}: ", end="", flush=True)
    #
    #     for file_or_dir in sub_dir.iterdir():
    #         if not (file_or_dir.is_dir() or file_or_dir.name.startswith(".")):
    #             if c % 10 == 0: print(".", end="", flush=True)
    #             c += 1
    #             if self.check_file(file_or_dir, force_remove=force_delete):
    #                 self.c_deleted += 1
    #                 c_del += 1
    #     print(f"OK ({c} files checked. {c_del} files removed)", end=os.linesep, flush=True)
    #     logging.info(f"{sub_path}: ({c} files checked. {c_del} files removed)")
    #     self.c_files += c
    #
    # def load_file_uuids(self):
    #     if not self.dsd.files_table:
    #         raise Exception("DSD not correctly loaded.")
    #     raw_records = set()
    #     archives = [None] + self.file_repos_archive_tables
    #     try:
    #
    #         for archive in archives:
    #             try:
    #                 if archive:
    #                     files_table = archive
    #                 else:
    #                     files_table = self.dsd.files_table
    #                 raw_records.update(set([str(uuid.UUID(str(x[0]))).replace('-', '') for x in
    #                                         KioskSQLDb.get_records(f"select uid from {files_table}",
    #                                                                raise_exception=True)]))
    #             except BaseException as e:
    #                 logging.error(f"{self.__class__.__name__}.load_file_uuids: "
    #                               f"Error searching archive '{archive}': {repr(e)}")
    #                 raise Exception("aborting")
    #         return raw_records
    #     except BaseException as e:
    #         logging.error(f"{self.__class__.__name__}.load_file_uuids: {repr(e)}. Aborting.")
    #         raise Exception("aborting")

    def list_deleted_docks(self):
        return [(dock_id, FileMakerWorkstation) for dock_id in FileMakerWorkstation.list_deleted_workstations(self.cfg)]

    def delete_dock(self, dock: Tuple[str, type[Dock]]):
        dock[1].delete_physical_files(self.cfg, dock[0], test_mode=self.test_run)

    def run(self, only_delete: list[str]):
        deleted_docks = self.list_deleted_docks()
        for dock in deleted_docks:
            if (not only_delete) or dock[0] in only_delete:
                logging.info(f"{self.__class__.__name__}.run: trying to delete remains of {dock[0]}")
                self.delete_dock(dock)






