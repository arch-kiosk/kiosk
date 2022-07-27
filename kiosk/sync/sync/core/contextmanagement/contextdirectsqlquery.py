import logging
from kiosksqldb import KioskSQLDb
from .contextquery import ContextQuery
from .cqlconstants import CqlError
from .sqlsource import ColumnsDontMatchError


class ContextDirectSqlQuery(ContextQuery):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._sql = ""
        self._column_names = []
        self._auto_cache_query()

    def define_from_dict(self, params: dict) -> None:
        if "sql" in params:
            sql: str = params["sql"]
            if sql.find("{base}") == -1:
                raise CqlError("'DirectSqlQuery': sql does not refer to {base}")
            if sql.lower().strip().startswith("select"):
                raise CqlError("'DirectSqlQuery': sql must not have the select key word. "
                               "It will be added automatically.")
            self._sql = sql
        else:
            raise CqlError("query type 'DirectSqlQuery' needs attribute sql. Sql not found")

    def get_column_names(self) -> list:
        return self._column_names

    def qualify(self, column_name: str, sql_compare: str):
        raise CqlError("DirectSqlQuery: qualify not supported.")

    def add_conditions(self, conditions: dict):
        raise CqlError("DirectSqlQuery: conditions not supported.")

    def _get_next_cursor(self):
        inner_sql = self._selects.get_next_sql()
        if not inner_sql:
            return None

        sql = f"select {self._sql}"
        sql = sql.replace("{base}", "(" + inner_sql + ") records")
        # pprint(sql)

        cur = None
        try:
            cur = KioskSQLDb.execute_return_cursor(sql)
            columns = [desc[0] for desc in cur.description]
            if not self._column_names:
                self._column_names = columns
            else:
                if not self.get_column_names() == columns:
                    raise ColumnsDontMatchError(
                        f"ContextQuery._get_next_cursor: Columns don't match first select: {sql}. ")
        except Exception as e:
            logging.error(f"{self.__class__.__name__}._get_next_cursor: {repr(e)}")
            if cur:
                cur.close()
            raise e

        return cur
