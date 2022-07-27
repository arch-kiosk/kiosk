from __future__ import annotations

import copy

import nanoid

from .contexttypeinfo import ContextTypeInfo
from kiosksqldb import KioskSQLDb


class ColumnsDontMatchError(Exception):
    pass


class SqlSource:
    def __init__(self, selects=None, type_info=None, name="", name_prefix=""):
        """
        Abstract class that stores source sql statements returned from KioskContext and returns them
        on get_next_sql. That is the central method that needs to be overridden by concrete child classes.

        :param selects: list of source selects. This will simply trust that they share a set of columns.
        :param type_info: the ContextTypeInformation applying to some columns of the select statement
        :param name: a name for the SqlSource. Some child classes will utilize this according to their needs.
                     if not set, a random unique nano-id will be generated.
        :param name_prefix: if a random unique nano-id will be used as name, the name will be prefixed with this.
        """
        if selects is None:
            selects = []
        self._type_info: ContextTypeInfo = type_info
        self._selects = selects
        self._columns = []
        if name == "":
            if name_prefix:
                self._name = "cache_" + name_prefix + "_" + nanoid.generate("abcdefghijklmnopqrstuvwxyz1234567890")
            else:
                self._name = "cache_" + nanoid.generate("abcdefghijklmnopqrstuvwxyz1234567890")
        else:
            self._name = name

    @property
    def name(self):
        return self._name

    def get_type_info(self) -> ContextTypeInfo:
        return copy.deepcopy(self._type_info)

    def get_source_selects(self) -> [str]:
        """
        returns the source sql statements (not necessarily the statements get_next_sql() returns).
        :return: a list of select statements
        """
        return list(self._selects)

    def get_column_names(self) -> list:
        """
        returns a list with the column names
        :return: list
        """
        if not self._columns:
            cur = KioskSQLDb.execute_return_cursor(self._selects[0] + " limit 0")
            self._columns = [desc[0] for desc in cur.description]
            cur.close()

        return list(self._columns)

    def add_source(self, source: SqlSource):
        """
        adds the source sqls from one query to another
        :return: nothing. But throws Exceptions in case of failure.
        :exception ColumnsDontMatchError: the source cannot be added because it has different columns.
        """

        if not self._selects:
            self._selects = source.get_source_selects()
        else:
            col1 = list(self.get_column_names())
            # col1.sort()
            col2 = list(source.get_column_names())
            # col2.sort()
            if col1 == col2:
                self._selects.extend(source.get_source_selects())
            else:
                raise ColumnsDontMatchError

        new_type_info: ContextTypeInfo = source.get_type_info()
        if not self._type_info:
            self._type_info = new_type_info
        else:
            new_type_info.append_to(self._type_info)

    def get_next_sql(self, reset=False) -> str:
        """
        Abstract.
        Returns the next sql statement to use.
        must be implemented by child classes.
        :param reset: if set the instance will be reset first and return the first sql statement.
        :returns either the next sql statement or an empty string if there are no more
        """
        raise NotImplementedError

    def reset(self):
        """
        Abstract.
        Makes sure that next time get_next_sql is called it will start at the beginning.
        """
        raise NotImplementedError
