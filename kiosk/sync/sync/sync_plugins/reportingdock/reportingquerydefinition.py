import logging

import kioskstdlib
from .reportinglib import *
from copy import copy, deepcopy


class ReportingQueryDefinition:
    CURRENT_DEF_VERSION = "1.1"

    def __init__(self, definition: dict):
        self.variable_definitions = {}
        self.output_driver = ""

        if "header" not in definition:
            raise ReportingException("report definition: no header found.")
        if "version" not in definition["header"] \
                or kioskstdlib.cmp_semantic_version(str(definition["header"]["version"]), self.CURRENT_DEF_VERSION) > 0:
            raise ReportingException(f"report definition: the report's definition is not compatible with version "
                                     f"{self.CURRENT_DEF_VERSION}")
        self.version: int = definition["header"]["version"]
        if "variables" in definition:
            self.variable_definitions = deepcopy(definition["variables"])
        if "settings" in definition:
            self.settings = definition["settings"]
        if "base_queries" in definition:
            self.base_queries = deepcopy(definition["base_queries"])
        else:
            raise ReportingException(f"{self.__class__.__name__}: the query definition lacks a base_queries section")
        if "queries" in definition:
            self.queries = deepcopy(definition["queries"])
        else:
            raise ReportingException(f"{self.__class__.__name__}: the query definition lacks a query section")

    def get_required_variables(self, base_query_name):
        """
        returns the names of the variables that are required to run a report on the base_query
        :returns: list [str]
        """
        result = []
        base_query = self.base_queries[base_query_name]
        if "required_variables" in base_query:
            return copy(base_query["required_variables"])
        else:
            return []

    def get_template_strings(self, base_query_name) -> dict:
        """
        returns a dictionary with all the sql templates for a base_query
        :returns: dict
            """
        try:
            result = []
            logging.debug(f"{self.__class__.__name__}.get_template_strings: loading template strings for "
                          f"{base_query_name}")
            base_query = self.base_queries[base_query_name]
            if "template_strings" in base_query:
                return deepcopy(base_query["template_strings"])
            else:
                return {}
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_template_strings: {repr(e)}")
            raise e
