""" contains FileImportFilter: The abstract base class
    all fileimport filters are supposed to inherit from.
    FileImportFilters do not actually import a file but
    extract database information like context identifier,
    record type from it.
"""

import sys
import os
import logging


class FileImportFilter:
    """ Abstract base class for FileImportFilters"""

    _filter_configuration: dict = {}
    path_and_filename = None
    _form = None

    def __init__(self, cfg):
        self._cfg = cfg
        self._id_evaluator = None
        self._plugin_loader = None
        self._type_repository = None
        self.needs_type_repository = False

    @property
    def has_identifier_evaluator(self) -> bool:
        return self._id_evaluator is not None

    """ sets path and filename of the file to be imported """
    def set_path_and_filename(self, path_and_filename):
        self.path_and_filename = path_and_filename

    def set_filter_configuration(self, filter_configuration: dict):
        """
          sets the configuration values for the filter. Replaces the complete
          current configuration.

        :param filter_configuration: dict
        :return: none

        """
        self._filter_configuration = filter_configuration
        # print(self._filter_configuration)

    @staticmethod
    def get_display_name():
        raise Exception(
            f"FileImportFilter.get_display_name called."
            f"This method is abstract and should have been overridden.")

    def set_filter_configuration_values(self, filter_configuration: dict):
        """
          copies the configuration values given onto the internal _filter_configuration dictionary.
          Replaces/adds only keys that are in the given dict.

        :param filter_configuration: dict
        :return: none

        """
        for key in filter_configuration:
            self._filter_configuration[key] = filter_configuration[key]

        # print(self._filter_configuration)

    def get_filter_configuration(self) -> dict:
        """returns the complete filter config as a dict """
        return self._filter_configuration

    def get_filter_configuration_value(self, key: str):
        """returns the value of a configuration key or None """
        try:
            return self._filter_configuration[key]
        except:
            return None

    def get_filter_priority(self):
        """returns the value of the configuration key 'priority' """
        return self.get_filter_configuration_value("priority")

    def is_active(self):
        """returns the value of the configuration key 'active' """
        return self.get_filter_configuration_value("active")

    def activate(self):
        """sets the configuration key 'active' to 'True' """
        self.set_filter_configuration_values({"active": True})

    def deactivate(self):
        """sets the configuration key 'active' to 'False' """
        self.set_filter_configuration_values({"active": False})

    def get_file_information(self, context: dict) -> dict:
        """
        :param: context: dict with file information that has been gathered by other filters before
                this one got called. Should be the basis for the file information gathered by this filter.

        :attention:
                Although the context is also returned, the returned context is the same as the
                context given by parameter. In other words: The parameter is not by value but by reference!
                Modification made to the context dict show in the context dict given by the caller.

                If this filter does not produce any new file information, this parameter must be returned
                to the caller, else it must be updated with the new file information and then returned.

        :return: A dict with file information that the method extracted from the file. (but see param context)
                 The key is a field name that must match a fieldname in the file_repository table
                 (as of July 2018 that would be images), usually record type, identifier
                 or description.
                 It can contain "import: False" if the filter has a reason to suppress importing the
                 file entirely. Import: True is always given as the first standard value.
        """
        raise Exception(
            f"FileImportFilter.get_file_information called for {self.path_and_filename}."
            f"This method is abstract and should have been overridden.")

    def get_file_path(self):
        current_module = sys.modules[self.__class__.__module__]
        file_path = os.path.dirname(current_module.__file__)

        return file_path

    def init_form(self, request_form):
        raise Exception(
            f"FileImportFilter.init_form called. "
            f"This method is abstract and should have been overridden.")

    def get_form(self):
        return self._form

    def form_to_config(self):
        if not self._form:
            raise Exception("no form in FileImportStandardValuesFilter")
        logging.error("FileImportFilter.form_to_config called. This method should have been overridden")

    @staticmethod
    def get_description():
        return ""

    def register_identifier_evaluator(self, identifier_evaluator):
        """
        registers a function that evaluates if a string is a proper identifier
        :param identifier_evaluator: a callable that takes a string and returns True or False
        """
        self._id_evaluator = identifier_evaluator

    def evaluate_identifier(self, identifier: str, default=True):
        """
        evaluates whether the given identifier is a correct identifier using the registered identifier_evaluator.
        if not evaluator is registered this returns the default value (which is True, if not set otherwise)
        :param identifier:
        :param default: the value that is returned if no evaluator is registered.
        :return: True or False
        """
        if self._id_evaluator:
            return self._id_evaluator(identifier)
        else:
            return default

    def register_type_repository(self, type_repository, plugin_loader):
        """
        Some fileimport filters need access to the type repository to load plugins.
        Those filters must set needs_type_repository to True, which is not the default.
        :param type_repository:
        :param plugin_loader:
        """
        self._type_repository = type_repository
        self._plugin_loader = plugin_loader
