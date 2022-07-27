from .reportinglib import *
from copy import copy, deepcopy


class ReportingQueryDefinition:
    CURRENT_DEF_VERSION = "1.0"

    def __init__(self, definition: dict):
        self.variable_definitions = {}
        self.output_driver = ""

        if "header" not in definition:
            raise ReportingException("no header found.")
        if "version" not in definition["header"] \
                or str(definition["header"]["version"]) != self.CURRENT_DEF_VERSION:
            raise ReportingException(f"the file's version is not {self.CURRENT_DEF_VERSION}")
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
