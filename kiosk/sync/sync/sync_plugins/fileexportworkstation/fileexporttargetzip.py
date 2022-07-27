import logging
import os
import zlib
import lzma
import bz2
import zipfile
from zipfile import ZipFile
import kioskstdlib
from .fileexportlib import FileExportError
from .fileexporttarget import FileExportTarget
from sync_config import SyncConfig


class FileExportTargetZip(FileExportTarget):

    def __init__(self, config):
        self._export_path_and_filename = ""
        self._export_directory = ""
        self._compression_method = None
        super().__init__(config)

    def set_export_name(self, value):
        super().set_export_name(value)
        self._export_path_and_filename = os.path.join(self._export_directory,
                                                      kioskstdlib.get_valid_filename(".".join([self.export_name,
                                                                                               "zip"])))
        logging.debug(f"{self.__class__.__name__}.set_export_name: "
                      f"file export will export to {self._export_path_and_filename}")

    def _load_target(self):
        self.name = "Zip File"
        self.description = "Export to a single zipped file"
        compression_method = "DEFLATED"
        export_filename = "kiosk-export.zip"
        try:
            target_config = self._config.fileexportworkstation["FileExportTargetZip"]
            export_filename = kioskstdlib.try_get_dict_entry(target_config, "export_filename", "")
            compression_method = kioskstdlib.try_get_dict_entry(target_config, "compression_method", "")
        except KeyError as e:
            logging.error(f"{self.__class__.__name__}._load_target: {repr(e)}")

        self._export_directory = self.get_export_directory(resolve_symbols=True)
        self._export_path_and_filename = os.path.join(self._export_directory, export_filename)
        self._compression_method = kioskstdlib.get_zip_compression_method(compression_method)

    def get_export_directory(self, resolve_symbols: bool = False):
        export_directory = "%base_path%\\export"
        try:
            target_config = self._config.config["fileexportworkstation"]["FileExportTargetZip"]
            export_directory = kioskstdlib.try_get_dict_entry(target_config, "export_directory", "")
        except KeyError:
            pass

        if resolve_symbols:
            return self._config.resolve_symbols(export_directory)
        else:
            return export_directory

    def set_export_path_and_filename_for_test(self, export_path: str, filename: str):
        """
        This overrides the current export directory. Do not use outside of tests because
        it has side effects in combination with get_export_directory.

        """
        self._export_directory = export_path
        self._export_path_and_filename = os.path.join(export_path, filename)

    def store(self, callback_progress=None):
        super().store(callback_progress=callback_progress)

        logging.info(f"{self.__class__.__name__}.store: Now zipping files to {self._export_path_and_filename}")
        logging.info(f"{self.__class__.__name__}.store: using compression method {self._compression_method}")

        if not os.path.isdir(self._export_directory):
            os.mkdir(self._export_directory)

        if os.path.isfile(self._export_path_and_filename):
            os.remove(self._export_path_and_filename)

        try:
            c_files = 0
            with ZipFile(self._export_path_and_filename, "x", compression=self._compression_method) as f_zip:
                for dest_filename, source_path_and_filename in self._files.items():
                    logging.debug(f"Zipping {source_path_and_filename}")
                    c_files += 1
                    progress = c_files * 100 / len(self._files)
                    self._interruptable_callback_progress(progress=progress, message=f"compressing {dest_filename}.")
                    f_zip.write(filename=source_path_and_filename, arcname=dest_filename)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.store: {repr(e)}")
            raise e
