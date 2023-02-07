import logging

import json

from contextmanagement.contextquerybakery import ContextQueryBakery
from dsd.dsd3 import DataSetDefinition
from kioskquery.kioskquery import KioskQuery
from kioskquery.kioskqueryresult import KioskQueryResult
from kioskquery.kioskqueryresultcql import KioskQueryResultCQL
from kioskquery.kioskqueryresultsql import KioskQueryResultSQL
from kioskquery.kioskqueryui import KioskQueryUI
from kioskquery.structuredkioskquerydefinition import StructuredKioskQueryDefinition
from kioskquery.kioskquerylib import *
from kioskquery.structuredkioskqueryui import StructuredKioskQueryUI
from kiosksqldb import KioskSQLDb


class StructuredKioskQuery(KioskQuery):

    def __init__(self, query_definition: dict, dsd: DataSetDefinition):
        self._dsd = dsd
        self._definition = StructuredKioskQueryDefinition(query_definition)
        self._variables = self._definition.get_variables()

    @property
    def query_definition(self):
        return self._definition

    def get_query_catalog(self):
        """
        lists all queries found in the definition
        :return:
        """
        return [name for name, q in self._definition.queries.items() if
                "output_type" in q and q["output_type"] == "list"]

    def get_query_ui(self) -> KioskQueryUI:
        return StructuredKioskQueryUI(self._definition.get_variables())

    def execute(self, query_name: str) -> KioskQueryResult:
        try:
            try:
                query = self._definition.queries[query_name]
            except KeyError as e:
                raise KioskQueryException(f"Query {query_name} does not exist in query definition ({repr(e)}.")
            if "type" not in query or query["type"].lower() not in ["sql", "cql"]:
                raise KioskQueryException(f"Query {query_name} has no attribute \"type\" or type is not sql or cql")

            if query["type"].lower() == "sql":
                return self._execute_sql_query(query)
            if query["type"].lower() == "cql":
                return self._execute_cql_query(query)
            raise KioskQueryException(f"StructuredKioskQuery: Query type {query['type']} unknown.")
        except KioskQueryException as e:
            raise e
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.execute : {repr(e)}")
            raise KioskQueryException(f"{self.__class__.__name__}.execute : Query \"{query_name}\" "
                                      f"threw exception{repr(e)}.")

    def _translate_variable_term_sql(self, term) -> str:
        if term[0] == '#':
            result = self._variables.get_variable_sql(term[1:])
        else:
            result = KioskSQLDb.sql_safe_ident(term)

        return result

    def _translate_variable_term_cql(self, term) -> str:
        if term[0] == '#':
            result = self._variables.get_variable_raw(term[1:])
        else:
            result = term

        return result

    def _execute_sql_query(self, query_def: dict):
        sql = query_def["query"]
        sql = self._definition.translate_variable_terms(sql, self._translate_variable_term_sql)

        return KioskQueryResultSQL(self._dsd, {"type": __class__.__name__}, sql, query_def)

    def _execute_cql_query(self, query_def: dict):
        cql = {"cql": query_def["query"]}
        cql["cql"]["meta"] = {"version": "0.1"}
        query_as_string = json.dumps(cql)
        new_cql = self._definition.translate_variable_terms(query_as_string, self._translate_variable_term_cql)
        cql = json.loads(new_cql)
        bakery = ContextQueryBakery(self._dsd)
        cql_query = bakery.get_query(cql)
        return KioskQueryResultCQL(self._dsd, {"type": __class__.__name__}, cql_query, query_def)
