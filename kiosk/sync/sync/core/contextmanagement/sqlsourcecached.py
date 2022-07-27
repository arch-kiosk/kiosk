import logging

from contextmanagement.sqlsource import SqlSource
from kiosksqldb import KioskSQLDb
import nanoid

CONTEXT_CACHE_NAMESPACE = "context_cache"


class SqlSourceCached(SqlSource):
    def __init__(self, selects=None, type_info=None, name="", name_prefix=""):
        super().__init__(selects=selects, type_info=type_info, name=name, name_prefix=name_prefix)
        self._current_sql = 0
        self.cache_table_name = KioskSQLDb.sql_safe_namespaced_table(self.schema_name, self._name)
        self._on_select_from_cache = None

    @property
    def schema_name(self):
        return CONTEXT_CACHE_NAMESPACE

    def _get_create_table_statement(self):
        return f"CREATE TABLE IF NOT EXISTS {self.cache_table_name} AS "

    def _create_schema(self):
        KioskSQLDb.execute(f"CREATE SCHEMA IF NOT EXISTS {KioskSQLDb.sql_safe_ident(self.schema_name)}")

    @property
    def on_select_from_cache(self):
        return self._on_select_from_cache

    @on_select_from_cache.setter
    def on_select_from_cache(self, callback):
        self._on_select_from_cache = callback

    def build_cache(self, commit=True, condition_field="", condition=""):
        """
        builds the cache (uses namespace context_cache)

        :return: throws all kinds of exceptions
        """

        sql_select = self._get_union_select()

        # column_names = self.get_column_names()
        # sql_columns = ",".join(KioskSQLDb.sql_safe_ident(column_names))
        self._create_schema()
        sql_insert = self._get_create_table_statement()
        sql = sql_insert + sql_select
        c = KioskSQLDb.execute(sql, commit=commit)
        if c == -1:
            # in this case the table was there. We have to use insert.
            if condition_field:
                self.invalidate_cache(condition_field=condition_field, condition=condition)
            else:
                self.invalidate_cache()

            logging.debug(f"{self.__class__.__name__}.build_cache: {self.cache_table_name} present, needs inserts")
            sql = f"INSERT INTO {self.cache_table_name} select * from ("
            sql += sql_select + ") cache"
            if condition_field:
                sql += self._get_where(condition_field, condition)

            c = KioskSQLDb.execute(sql, commit=commit)
        if c < 1:
            logging.debug(f"{self.__class__.__name__}.build_cache: No records added to {self.cache_table_name}")
            logging.debug(f"{self.__class__.__name__}.build_cache: {sql}")
        else:
            logging.debug(f"{self.__class__.__name__}.build_cache: Added {c} record to {self.cache_table_name}")

    # noinspection SqlWithoutWhere
    def invalidate_cache(self, condition_field="", condition="") -> int:
        """
        invalidates the whole cache or parts of it. But only if the cache actually already exists.
        :param condition_field: if only parts of the cache are to be invalidated, this is the field to qualify the part
        :param condition: in case of a partial invalidation this is the where clause including the comparator
                          e.g. "='a string'"
        :return: the number of cache entries that have been eliminated.
                 in case of 0 the cache did not exist in the first place.
        :exception: Can throw all kinds of exceptions.
        """
        # KioskSQLDb.execute(f"DROP TABLE IF EXISTS {self.cache_table_name}")
        try:
            savepoint = ""
            if KioskSQLDb.does_table_exist(tablename=self._name, schema=self.schema_name):
                savepoint = KioskSQLDb.begin_savepoint(savepoint_prefix="sscinv")
                try:
                    if condition_field:
                        sql = f" DELETE FROM {self.cache_table_name} {self._get_where(condition_field, condition)}"
                    else:
                        sql = f" DELETE FROM {self.cache_table_name}"
                    c = KioskSQLDb.execute(sql)
                    logging.debug(f"{self.__class__.__name__}.invalidate_cache: invalidated {c} cache entries.")
                    KioskSQLDb.commit_savepoint(savepoint)
                except BaseException as e:
                    KioskSQLDb.rollback_savepoint(savepoint)
                    raise e
                return c
            else:
                return 0
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.invalidate_cache : {repr(e)}")
            raise e

    def _get_union_select(self):
        sql = ""
        for s in self._selects:
            if sql != "":
                sql += " UNION "
            sql += s
        return sql

    def _get_select_from_cache(self):
        if self.on_select_from_cache:
            return self.on_select_from_cache(self.cache_table_name)
        else:
            return f"select * from {self.cache_table_name}"

    def get_next_sql(self, reset=False) -> str:
        """
        Returns the next sql statement to use. The sql statements returned are exactly the sql statements added before.
        :param reset: if set the instance will be reset first and return the first sql statement.
        :returns either the next sql statement or an empty string if there are no more
        """
        if len(self._selects) == 0:
            return ""

        if reset:
            self._current_sql = 0

        if (not KioskSQLDb.does_table_exist(tablename=self._name, schema=self.schema_name)) \
                or KioskSQLDb.is_empty(self._name, schema=self.schema_name):
            self.build_cache()

        if self._current_sql == 0:
            self._current_sql = 1
            return self._get_select_from_cache()
        else:
            return ""

    def reset(self):
        """
        Makes sure that next time get_next_sql is called it will start at the beginning.
        """
        self._current_sql = 0

    @staticmethod
    def _get_where(condition_field, condition) -> str:
        if condition_field and condition:
            return f" WHERE {KioskSQLDb.sql_safe_ident(condition_field)} {condition}"
        else:
            raise Exception("invalidate_entries called without qualification.")

    def destroy(self):
        try:
            sql = f" DROP TABLE IF EXISTS {self.cache_table_name}"
            c = KioskSQLDb.execute(sql)
            return c
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.destroy : {repr(e)}")
            return 0

