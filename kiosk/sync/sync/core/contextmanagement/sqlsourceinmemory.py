from contextmanagement.sqlsource import SqlSource


class SqlSourceInMemory(SqlSource):
    def __init__(self, selects=None, type_info=None, name="", name_prefix=""):
        super().__init__(selects=selects, type_info=type_info, name=name, name_prefix=name_prefix)
        self._current_sql = 0

    def get_next_sql(self, reset=False) -> str:
        """
        Returns the next sql statement to use. The sql statements returned are exactly the sql statements added before.
        :param reset: if set the instance will be reset first and return the first sql statement.
        :returns either the next sql statement or an empty string if there are no more
        """
        if reset:
            self._current_sql = 0

        if self._current_sql < len(self._selects):
            self._current_sql += 1
            return self._selects[self._current_sql - 1]
        else:
            return ""

    def reset(self):
        """
        Makes sure that next time get_next_sql is called it will start at the beginning.
        """
        self._current_sql = 0
