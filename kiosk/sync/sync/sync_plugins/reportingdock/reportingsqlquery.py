import logging
import pprint

from kiosksqldb import KioskSQLDb
from stringinjector import StringInjector
from .reportinglib import *
from .reportingquery import ReportingQuery
from .reportingvariables import ReportingVariables


class ReportingSqlQuery(ReportingQuery):
    def __init__(self, query_dict: dict, variables: ReportingVariables, namespace):
        if "type" not in query_dict or query_dict["type"].lower() != "sql":
            raise ReportingException(f"{self.__class__.__name__}: Call with wrong type of definition")
        if "query" not in query_dict:
            raise ReportingException(f"{self.__class__.__name__}: 'query' missing in query dict")
        if "output_type" not in query_dict:
            raise ReportingException(f"{self.__class__.__name__}: Call without output_type")

        super().__init__(query_dict, variables, namespace)

    def _translate_variable_term(self, term) -> str:
        if term[0] == '#':
            result = self._variables.get_variable_sql(term[1:])
        else:
            result = KioskSQLDb.sql_safe_ident(term)

        return result

    def _translate_variable_terms(self, s) -> str:
        injector = StringInjector(self._translate_variable_term)
        return injector.inject_variables(s)

    def _prepare_key_value_output_table(self, prepare_first_run=False):
        """
        creates the output table if needed.
        """
        KioskSQLDb.create_namespace(self._namespace)
        if prepare_first_run:
            KioskSQLDb.drop_table_if_exists(namespace=self._namespace, tablename='reporting_values')
        sql = "CREATE TABLE IF NOT EXISTS " + \
              f"""{KioskSQLDb.sql_safe_namespaced_table(namespace=self._namespace, db_table='reporting_values')} (
                {KioskSQLDb.sql_safe_ident('context_identifier')} VARCHAR NOT NULL,
                {KioskSQLDb.sql_safe_ident('key')} VARCHAR NOT NULL,
                {KioskSQLDb.sql_safe_ident('value')} VARCHAR,
                PRIMARY KEY ({KioskSQLDb.sql_safe_ident('context_identifier')}, {KioskSQLDb.sql_safe_ident('key')})
              )
              """
        KioskSQLDb.execute(sql)

    def _check_required_variables(self):
        """
        checks whether a base query requires variables and if they are declared and present.
        :param query_dict: the whole reporting query definition
        :exception ReportingException: Throws this if a variable is not defined.
        """
        if "required_variables" in self._query_dict:
            for var in self._query_dict["required_variables"]:
                if not self._variables.has_variable(var):
                    raise ReportingException(f"Variable {var} is required but missing.")

    def execute_base_query(self):
        """
        executes a base query
        :return: a List of identifiers
        """
        if self._query_dict["output_type"] != "base_query":
            raise ReportingException(f"{self.__class__.__name__}.execute_base_query: output_type is not 'base_query'.")

        self._check_required_variables()

        sql = self._translate_variable_terms(self._query_dict["query"])
        result = []
        cur = KioskSQLDb.execute_return_cursor(sql)
        try:
            r = cur.fetchone()
            while r:
                result.append(r[0])
                r = cur.fetchone()
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.execute_base_query: {repr(e)}")
            raise e
        finally:
            cur.close()
        return result

    def execute(self, prepare_first_run=False):
        if not self._variables.has_variable(IDENTIFIER_VARIABLE_NAME):
            raise ReportingException(f"{self.__class__.__name__}.execute: no value for {IDENTIFIER_VARIABLE_NAME} "
                                     f"among variables given to query.")

        sql = self._translate_variable_terms(self._query_dict["query"])

        output_type = self._query_dict["output_type"].lower()
        if output_type == "key-value":
            try:
                self._prepare_key_value_output_table(prepare_first_run=prepare_first_run)
                self._execute_key_value_query(sql)
                KioskSQLDb.commit()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._execute: {repr(e)}")
                KioskSQLDb.rollback()
                logging.error(f"{self.__class__.__name__}.execute: "
                              f"Database rolled back because of former error.")
                raise e
        elif output_type == "list":
            if "output_table" not in self._query_dict:
                raise ReportingException(f"{self.__class__.__name__}.execute: "
                                         f"output_type 'list' needs an output_table, too.")
            try:
                self._execute_list_query(sql, self._query_dict["output_table"])
                KioskSQLDb.commit()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._execute: {repr(e)}")
                KioskSQLDb.rollback()
                logging.error(f"{self.__class__.__name__}.execute: "
                              f"Database rolled back because of former error in query")
                raise e
        else:
            raise ReportingException(f"{self.__class__.__name__}.execute: Unknown output type {output_type}"
                                     f"in query.")

    def _execute_key_value_query(self, sql):
        cur = KioskSQLDb.execute_return_cursor(sql)
        try:
            r = cur.fetchone()
            if not r:
                raise ReportingException(f"{self.__class__.__name__}._execute_key_value_query: "
                                         f"no results by query {sql}.")

            keys = [desc[0] for desc in cur.description]
            insert_template = "INSERT " + \
                              f"INTO {KioskSQLDb.sql_safe_namespaced_table(self._namespace, 'reporting_values')}" \
                              f"({KioskSQLDb.sql_safe_ident(IDENTIFIER_VARIABLE_NAME)}," \
                              f"{KioskSQLDb.sql_safe_ident('key')}, " \
                              f"{KioskSQLDb.sql_safe_ident('value')}) "

            for k in keys:
                insert = insert_template + "VALUES(%s,%s,%s)"
                KioskSQLDb.execute(insert, [self._variables.get_variable_raw(IDENTIFIER_VARIABLE_NAME), k, r[k]])

            r = cur.fetchone()
            if r:
                raise ReportingException(f"{self.__class__.__name__}._execute_key_value_query: "
                                         f"More than one row returned by key-value query {sql}.")
        finally:
            cur.close()

    def _execute_list_query(self, sql, output_table):

        KioskSQLDb.create_namespace(self._namespace)
        output_table = 'reporting_' + output_table

        KioskSQLDb.drop_table_if_exists(tablename=output_table, namespace=self._namespace)
        sql_create_as = f"CREATE " + \
                        "TABLE " \
                        f"{KioskSQLDb.sql_safe_namespaced_table(namespace=self._namespace, db_table=output_table)} " \
                        f"AS {sql}"

        if self.debug:
            logging.debug(f"{self.__class__.__name__}._execute_list_query: creating table {output_table} as: ")
            # pretty_sql = pprint.pformat(sql)
            logging.debug(sql)

        KioskSQLDb.execute(sql_create_as, [self._variables.get_variable_raw(IDENTIFIER_VARIABLE_NAME)])
