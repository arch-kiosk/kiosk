from copy import deepcopy

from kioskquery.kioskquerydefinition import KioskQueryDefinition
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskqueryvariables import KioskQueryVariables


class FullTextKioskQueryDefinition(KioskQueryDefinition):
    CURRENT_DEF_VERSION: int = 1

    def __init__(self, query_definition: dict):
        self.version = 0
        self._raw_query_definition = {}
        self._name = ""
        self._id = ""
        self._description = ""

        if "header" not in query_definition:
            raise KioskQueryException("no header found.")

        if "version" not in query_definition["header"] \
                or int(query_definition["header"]["version"]) != self.CURRENT_DEF_VERSION:
            raise KioskQueryException(f"the file's version is not {self.CURRENT_DEF_VERSION}")
        self.version: int = query_definition["header"]["version"]
        self._raw_query_definition = deepcopy(query_definition)
        self._variables = KioskQueryVariables({
            "query": ["datatype(VARCHAR)"]
        })

        # if "queries" in query_definition:
        #     self.queries = self._raw_query_definition["queries"]
        #     if len(self.queries) > 1:
        #         raise KioskQueryException(f"{self.__class__.__name__}: "
        #                                   f"A Full Text Query Definition must not have more than one query")
        # else:
        #     raise KioskQueryException(f"{self.__class__.__name__}: the query definition lacks a query section")

    @property
    def raw_query_definition(self):
        return self._raw_query_definition

    @property
    def query_id(self):
        return "fulltextquery"

    @property
    def query_name(self):
        return "Full Text Search"

    @property
    def query_description(self):
        return ("Query all places in the archaeological record that match a text or statement "
                "and have them sorted by relevance")

    @property
    def variables(self):
        return self._variables
