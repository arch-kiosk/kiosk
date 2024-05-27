import collections.abc
import copy
import logging
import os

from dicttools import dict_merge
from yamlconfigreader import YAMLConfigReader


class PLDException(Exception):
    pass


class PresentationLayerDefinition:
    SUPPORTED_FORMAT_VERSION = 1

    def __init__(self, file_reader_class=YAMLConfigReader):
        self.pld_path_and_filename: str = ""
        self._pld = {}
        self._file_reader_class = file_reader_class
        self.file_reader = None

    def load(self, pld_path_and_filename: str, filename_resolver: collections.abc.Callable[[str, str], str]):
        """
        loads a presentation layer definition file.

        This works exactly like a kiosk config file: First it loads all the imported files and only then it applies the
        content of the file itself. The result is that a file's content (everything except 'imports') overrides what
        has been loaded by the imports. This is also recursive.

        :param pld_path_and_filename: the name of the pld (without a file extension!).
        :param filename_resolver: a callable that accepts a reference to a pld file and resolves it to path and filename
        """

        # if not os.path.isfile(pld_path_and_filename):
        #     raise FileNotFoundError(f"{self.__class__.__name__}.load_pld: "
        #                             f"Definition {pld_path_and_filename} not found.")

        self.pld_path_and_filename = pld_path_and_filename

        self.file_reader = self._file_reader_class(basefile=self.pld_path_and_filename)
        self._load(self.pld_path_and_filename, filename_resolver)
        self._validate()

    def _load(self, pld_path_and_filename, filename_resolver: collections.abc.Callable[[str, str], str]):
        if not self.file_reader:
            raise Exception(f"{self.__class__.__name__}._load: "
                            f"no file_reader instance available.")

        new_pld: dict = self.file_reader.read_file(pld_path_and_filename)
        format_version = 0
        if "config" in new_pld:
            if "format_version" in new_pld["config"]:
                format_version = new_pld["config"]["format_version"]
        if format_version == 0:
            raise PLDException(f"{self.__class__.__name__}._load: "
                               f"pld {pld_path_and_filename} without format_version information")

        if format_version > self.__class__.SUPPORTED_FORMAT_VERSION:
            raise PLDException(f"{self.__class__.__name__}._load: "
                               f"pld {pld_path_and_filename} has unsupported format_version {format_version}.")

        if "imports" in new_pld:
            pld_imports = new_pld.pop('imports')

            for pld_import in pld_imports:
                import_path_and_filename = filename_resolver(pld_path_and_filename, pld_import)
                if import_path_and_filename:
                    self._load(import_path_and_filename, filename_resolver)

        dict_merge(self._pld, new_pld)

    def _validate(self):
        if "compilations" not in self._pld:
            raise PLDException(f"{self.__class__.__name__}._validate: "
                               f"pld has no 'compilations'")

    def get_compilations(self):
        return self._pld["compilations"]

    def get_compilations_by_record_type(self, record_type: str) -> list:
        """
        returns a compilation for a record type
        :param record_type:
        :return: list[dict]
        """
        try:
            compilations: dict = self._pld["compilations"]
            return [compilation for compilation in compilations.values() if compilation["record_type"] == record_type]
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_compilations_by_record_type: {repr(e)}")
            raise e

    def get_parts(self, compilation: dict) -> list[str]:
        """
        returns the available part ids for the compilation
        :param compilation:
        :return: list[str]
        """
        parts = []
        for group in compilation["groups"].values():
            for part in group["parts"].keys():
                parts.append(part)
        return parts

    def get_part(self, part_id: str) -> dict:
        """
        returns a part from the PLD
        :param part_id: the id of the part
        :return: dict
        """
        if part_id not in self._pld:
            raise ValueError(f"{self.__class__.__name__}.get_part: "
                             f"Part {part_id} not defined in pld file {self.pld_path_and_filename}")
        return self._pld[part_id]
