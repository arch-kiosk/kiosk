import logging

from contextmanagement.sqlsource import SqlSource
from contextmanagement.sqlsourcecached import SqlSourceCached, CONTEXT_CACHE_NAMESPACE
from kiosksqldb import KioskSQLDb


class SqlSourceTempCache(SqlSourceCached):
    def __init__(self, selects=None, type_info=None, name="", name_prefix=""):
        """

        :param selects:
        :param type_info:
        :param name: will be ignored because temporary caches have random names.
        """
        super().__init__(selects=selects, type_info=type_info, name=name, name_prefix=name_prefix)
        self.cache_table_name = KioskSQLDb.sql_safe_namespaced_table(namespace="", db_table=self._name)

    @property
    def schema_name(self):
        return ""

    def reset(self):
        super().reset()
        super().destroy()

    def _get_create_table_statement(self):
        return f"CREATE TEMP TABLE IF NOT EXISTS {self.cache_table_name} AS "

    def _create_schema(self):
        pass



