import os
from typing import Callable, Union, List, Iterator, Tuple

import kioskstdlib
import syncrepositorytypes
from typerepository import TypeRepository
from .reportinglib import *
from .reportingmapper import ReportingMapper


class ReportingOutputDriver:
    def __init__(self):
        self._mapped_values = {}
        self.template_file = ""
        self.mapping_definition = {}
        self.target_dir = ""
        self.target_file_name_without_extension = ""
        self._mapper = None

    @classmethod
    def get_supported_file_extensions(cls):
        raise NotImplementedError

    def _get_mapper_class(self):
        """
        abstract method. Must return a specific mapper class for the OutputDriver
        """
        raise NotImplementedError

    @classmethod
    def register(cls, type_repository: TypeRepository):
        type_repository.register_type(syncrepositorytypes.TYPE_REPORTING_OUTPUT_DRIVER, cls.__name__, cls)

    @property
    def mapping_results(self) -> dict:
        return self._mapped_values

    def check_premisses(self):
        if not self.template_file:
            raise ReportingException(f"{self.__class__.__name__}.execute: No template file assigned.")

        if not kioskstdlib.file_exists(self.template_file):
            raise ReportingException(
                f"{self.__class__.__name__}.execute: Template file {self.template_file} does not exist.")

        if not self.target_dir:
            raise ReportingException(f"{self.__class__.__name__}.execute: No target_dir assigned.")

        if not self.target_file_name_without_extension:
            raise ReportingException(f"{self.__class__.__name__}.execute: not target filename assigned.")

        if not self.mapping_definition:
            raise ReportingException(f"{self.__class__.__name__}.execute: no mapping definition present.")

    def map(self, mapping_definition: dict, key_values: dict, _on_load_list_for_mapper: Callable,
            _on_render_filename: Union[Callable[[str, str], str], None] = None):
        """
        instantiates the mapper for the concrete output driver and executes the mapping.
        The results are stored within the output driver for a subsequent call of "execute".
        """

        Mapper = self._get_mapper_class()
        self._mapper: ReportingMapper = Mapper(mapping_definition, key_values,
                                               _on_load_list_for_mapper,
                                               _on_render_filename)
        self._mapped_values = self._mapper.map()

    def execute(self, _on_load_records: Union[Callable[[str, List[str]], Iterator[Tuple]], None]) -> str:
        """
        executes the report
        :param _on_load_records: a callable which gets the table_name and the "columns" list and
                                 returns a generator that returns a new row (a tuple with values)
                                 on each iteration
        :returns the path and filename of the target file
        """
        raise NotImplementedError
