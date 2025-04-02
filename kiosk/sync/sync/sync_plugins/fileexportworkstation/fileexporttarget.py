import logging

import kioskstdlib
from .fileexportlib import FileExportError
from sync_config import SyncConfig
from sync_constants import UserCancelledError


class FileExportTarget:
    def __init__(self, config):
        self._config: SyncConfig = config
        self.name = ""
        self._target_id = self.__class__.__name__
        self.description = ""
        self._files = {}
        self._export_name = ""
        self._callback_progress = None
        self._load_target()

    def _load_target(self):
        pass


    @property
    def target_id(self):
        return self._target_id

    @property
    def files(self):
        return self._files

    @property
    def export_name(self):
        return self._export_name

    # can't use a property here because of inheritance
    def set_export_name(self, value):
        logging.info(f"export_name set to {value}")
        self._export_name = value

    def start_export(self):
        pass

    def end_export(self, success: bool):
        pass

    def _interruptable_callback_progress(self, *args, **kwargs):
        if self._callback_progress and not self._callback_progress(*args, **kwargs):
            raise UserCancelledError

    def get_export_directory(self, resolve_symbols: bool = False) -> str:
        """
        returns the directory where the exported files will be stored.
        :param resolve_symbols: If set to true symbolic path statements like %base_path% will be resolved
        :returns: the path

        """
        raise NotImplementedError

    def store(self, callback_progress=None):
        """
        stores the zip file finally. It is this method only that will take long. That is why
        you can give it a callback_progress method getting the filename as text and a percentage.

        :param callback_progress: a method taking these parameters:
                                  progress: float, message: str

        """
        self._callback_progress = callback_progress


    def has_file(self, dest_filename: str):
        return dest_filename in self._files.keys()

    def get_new_filename(self, dest_filename: str):
        """
        returns a filename based on the given dest_filename that is not yet in the file list.
        if dest_filename is not in the file-list to begin with, it will be returned.
        The method will add a number to the filename until a filename is reached that is not in the file list.

        :param dest_filename: the dest_filename to start with
        :returns:
        """
        if dest_filename == "":
            dest_filename = "f_"
        filename_without_extension = kioskstdlib.get_filename_without_extension(dest_filename)
        file_extension = kioskstdlib.get_file_extension(dest_filename)
        if file_extension:
            file_extension = "." + file_extension
        c = 0
        while dest_filename in self._files:
            c += 1
            dest_filename = f"{filename_without_extension}{c}{file_extension}"
            if c > 1000:
                raise FileExportError(f"{self.__class__.__name__}.get_new_filename stopped after 1000 iterations.")

        return dest_filename

    def add_file(self, source_path_and_filename: str, dest_filename: str):
        """
        adds a file to the export target.
        :param source_path_and_filename: the full path and filename to the source file
        :param dest_filename: The dest_filename is expected to be unique within an export run.
        """
        if dest_filename in self._files.keys():
            raise FileExportError(f"FileExportTarget: dest-file {dest_filename} duplicate.")
        self._files[dest_filename] = source_path_and_filename



