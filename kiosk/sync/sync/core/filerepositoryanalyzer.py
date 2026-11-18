import datetime
import json
import logging
import os
import pprint
import shutil
import uuid
from os.path import basename
from pathlib import Path

import filerepository
import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from filerepository import FileRepository
from plugins.filerepositoryplugin.filerepositoryarchive import FileRepositoryArchive, FR_ARCHIVE_NAMESPACE


class FileRepositoryAnalyzer:
    """
    A utility class for analyzing the file repository.
    It simply sums up the size of all files it finds in sub-directories.
    It does that again for each sub-directory of the cache directory.

    Attributes:
        cfg: the Kiosk Config
        file_repository: The path to the file repository
    """

    def __init__(self,
                 cfg):
        self.cfg = cfg
        self.result = {}


    @staticmethod
    def get_dir_info(path: str):
        count_files = 0
        size_files = 0

        for entry in Path(path).iterdir():
            # Check for subdirectories with exactly 2-character alphanumeric names
            if entry.is_dir() and len(entry.name) == 2 and entry.name.isalnum():
                for file in entry.iterdir():
                    if file.is_file():
                        count_files += 1
                        size_files += file.stat().st_size

        return {
            "count": count_files,
            "size": size_files,
            "MByte": size_files / 1024**2,
            "GBytes": size_files / 1024 ** 3
        }

    def run(self):
        self.result["root"] = self.get_dir_info(self.cfg.get_file_repository())
        filerepository = FileRepository(self.cfg)
        cache_dir = filerepository.get_cache_dir()
        for entry in Path(cache_dir).iterdir():
            if entry.is_dir():
                self.result[entry.name] = self.get_dir_info(str(entry.absolute()))
        pprint.pprint(self.result)

    def write_to_file(self, out_file: str):
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(self.result, f, indent=4)