from copy import deepcopy
from typing import Union

import kioskstdlib
from kioskquery.kioskquerydefinition import KioskQueryDefinition
from kioskquery.kioskqueryvariables import KioskQueryVariables
from kioskquery.kioskquerylib import *
from kiosksqldb import KioskSQLDb
from stringinjector import StringInjector


class StructuredKioskQueryDefinition(KioskQueryDefinition):
    CURRENT_DEF_VERSION: int = 1

    def __init__(self, query_definition: dict):
        self.version = 0
        self._raw_query_definition = {}
        self._variables: Union[KioskQueryVariables, None] = None
        self._name = ""
        self._id = ""
        self._description = ""

        if "header" not in query_definition:
            raise KioskQueryException("no header found.")

        if "version" not in query_definition["header"] \
                or int(query_definition["header"]["version"]) != self.CURRENT_DEF_VERSION:
            raise KioskQueryException(f"the file's version is not {self.CURRENT_DEF_VERSION}")
        self.version: int = query_definition["header"]["version"]

        if "variables" in query_definition:
            self._variables = KioskQueryVariables(query_definition["variables"])
        if "settings" in query_definition:
            if not self._variables:
                self._variables = KioskQueryVariables(variable_definitions={})
            self._variables.add_constants(query_definition["settings"])

        if "queries" in query_definition:
            self._raw_query_definition = deepcopy(query_definition)
            self.queries = self._raw_query_definition["queries"]
        else:
            raise KioskQueryException(f"{self.__class__.__name__}: the query query definition lacks a query section")

    def _retrieve_query_description(self):
        if not self._id:
            try:
                list_query = [q for q, v in self.queries.items() if v["output_type"] == "list"]
            except BaseException as e:
                raise KioskQueryException(f"{self.__class__.__name__}._retrieve_query_description: "
                                          f"Error finding list query: {repr(e)}")
            if len(list_query) != 1:
                raise KioskQueryException(f"{self.__class__.__name__}._retrieve_query_description: "
                                          f"query definition must have exactly one query of output_type 'list'")
            self._id = list_query[0]
            self._description = kioskstdlib.try_get_dict_entry(self.queries[self._id], "description",
                                                               "", null_defaults=True)
            self._name = kioskstdlib.try_get_dict_entry(self.queries[self._id], "name",
                                                        "", null_defaults=True)

    @property
    def raw_query_definition(self):
        return self._raw_query_definition

    @property
    def query_id(self):
        self._retrieve_query_description()
        return self._id

    @property
    def query_name(self):
        self._retrieve_query_description()
        return self._name

    @property
    def query_description(self):
        self._retrieve_query_description()
        return self._description

    @staticmethod
    def translate_variable_terms(s, translation_function) -> str:
        injector = StringInjector(translation_function)
        return injector.inject_variables(s)

    def get_variables(self):
        return self._variables
