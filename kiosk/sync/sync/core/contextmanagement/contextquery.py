from transpile.sqlconditiontranspiler import SqlConditionTranspiler
from kiosksqldb import KioskSQLDb
from .sqlsource import SqlSource, ColumnsDontMatchError
from .sqlsourcecached import SqlSourceCached
from .sqlsourcetempcache import SqlSourceTempCache
from pprint import pprint


class ContextQueryInUseError(Exception):
    pass


class ContextQueryColumnNameError(Exception):
    pass


class ContextQuery:
    DEFAULT_PAGE_SIZE = 100

    def __init__(self, selects: SqlSource):
        self._qualifications = {}
        self._query_active = False
        self._conditions = None
        self._sort_order = None
        self._page_size: int = self.DEFAULT_PAGE_SIZE
        self._page_count: int = 0
        self._overall_record_count = 0
        self._selects = selects
        self._cur = None
        self._columns = {}
        self._distinct = False

    @property
    def page_count(self):
        return self._page_count

    @property
    def page_size(self):
        return self._page_size

    @property
    def overall_record_count(self):
        return self._overall_record_count

    @property
    def query_active(self):
        return self._query_active

    @property
    def distinct(self):
        return self._distinct

    @property
    def type_info(self):
        return self._selects.get_type_info()

    @distinct.setter
    def distinct(self, value):
        if self._query_active:
            raise ContextQueryInUseError("distinct value cannot be set if query already fetches records.")

        if not self._distinct:
            self._distinct = value
            if self._distinct:
                self._auto_cache_query()

    def _add_qualification(self, column_name: str, sql_compare: str):
        if column_name not in self._qualifications:
            self._qualifications[column_name] = [sql_compare]
        else:
            self._qualifications[column_name].append(sql_compare)

    def _add_conditions(self, conditions: dict):
        """
        only saves CQL conditions for later use.
        :param conditions: regular CQL conditions
        """
        self._conditions = conditions

    def _add_sort_order(self, sort_order: list):
        """
        only saves sort order for later use. Parses the single list elements and turns them into
        tuples of type (field, sort-direction).
        :param sort_order: SQL sort order. Something like ['field:asc']
        """
        self._sort_order = []
        for o in sort_order:
            try:
                field, direction = [x.strip() for x in o.split(":")]
            except ValueError:
                direction = "asc"
                field = o.strip()
            if direction in ["asc", "desc"]:
                self._sort_order.append((field, direction))
            else:
                raise Exception(f"{self.__class__.__name__}._add_sort_order: "
                                f"wrong sort direction {direction} for field {field}.")

    @property
    def columns(self):
        """
        returns the user-defined columns
        :return:
        """
        return self._columns

    @columns.setter
    def columns(self, columns):
        self._columns = columns

    def _get_where_from_qualifications(self):
        sql_where = ""
        if self._qualifications:
            columns = self.get_column_names()
            for q in self._qualifications:
                if q in columns:
                    for c in self._qualifications[q]:
                        if sql_where:
                            sql_where += " AND "
                        sql_where += f"({KioskSQLDb.sql_safe_ident(q)} {c})"
                else:
                    raise ContextQueryColumnNameError(
                        f"ContextQuery._get_sql: Unknown column {q} in qualification.")
        return sql_where

    def _get_where_from_conditions(self):
        stp = SqlConditionTranspiler(KioskSQLDb)
        stp.type_info = self._selects.get_type_info()
        stp.output_field_information = self.columns
        sql_where = stp.run(self._conditions)
        # print(sql_where)
        return sql_where

    def _get_where(self):
        if self._conditions:
            if self._qualifications:
                raise Exception("_get_where discovered that both conditions and qualifications are applied. "
                                "They are mutually exclusive.")
            return self._get_where_from_conditions()
        else:
            return self._get_where_from_qualifications()

    def _get_order(self):
        sql_order = ""
        for o in self._sort_order:
            field = o[0]
            direction = o[1]
            if field in self.columns:
                field = self.columns[field]["source_field"]
            sql_order += ("," if sql_order else "") + field + " " + direction
        return sql_order

    def close(self):
        """
        makes sure that the query's cursor is closed. Should be called as soon as the query is not needed any longer.
        """
        if self._cur:
            self._cur.close()
        self._selects.reset()

    def get_column_names(self) -> list:
        if self._columns:
            return list(self._columns.keys())
        else:
            return self._selects.get_column_names()

    def qualify(self, column_name: str, sql_compare: str):
        """
        adds a condition to the query. Specific to the SQL-dialect.
        It is recommended to use "add_conditions" instead.
        example: qualify("brick_size", "=12")

        :param column_name: the name of the column to compare
        :param sql_compare: the comparison
        """
        if self.query_active:
            raise ContextQueryInUseError("ContextQuery.qualify called during open query.")
        self._add_qualification(column_name, sql_compare)

    def add_conditions(self, conditions: dict):
        """
        stores conditions according to the Context Query DSL (CQL).
        Note that they are not parsed at this point.

        example: add_conditions({"condition": isequal("brick_size", 12)})

        :param conditions: a dict with regular CQL conditions
        """
        if self.query_active:
            raise ContextQueryInUseError("ContextQuery.add_conditions called during open query.")
        self._add_conditions(conditions)

    def add_sort_order(self, sort_order: list):
        """
        stores a sort order according to the Context Query DSL (CQL).
        Note that they are not parsed at this point.

        example: add_sort_order(['field:asc',])

        :param sort_order: a list with regular CQL sort order elements
        """
        if self.query_active:
            raise ContextQueryInUseError("ContextQuery.add_sort_order called during open query.")
        self._add_sort_order(sort_order=sort_order)

    def _get_column_sql(self, output_field_name: str) -> str:
        if "source_field" not in self._columns[output_field_name]:
            raise KeyError(f"field {output_field_name} must define a source_field. "
                           f"attribute missing in query definition")
        source_field = self._columns[output_field_name]["source_field"].lower()
        if output_field_name.lower() == source_field.lower():
            col_sql = KioskSQLDb.sql_safe_ident(source_field)
        else:
            col_sql = f"{KioskSQLDb.sql_safe_ident(source_field)} {KioskSQLDb.sql_safe_ident(output_field_name)}"

        return col_sql

    def _get_select(self):
        if self._distinct:
            sql = "distinct "
        else:
            sql = ""

        if self._columns:
            comma = ""
            for col in self._columns.keys():
                sql += comma + self._get_column_sql(col)
                comma = ","

            return sql
        else:
            return f"{sql} * "

    def _get_next_cursor(self):
        sql = self._selects.get_next_sql()
        if not sql:
            return None

        sql = f"select {self._get_select()} from " + f"({sql}) " \
                                                     f"{KioskSQLDb.sql_safe_ident('records')}"
        # pprint(sql)

        if self._qualifications or self._conditions:
            sql_where = self._get_where()
            if sql_where:
                sql = sql + " where " + sql_where

        if self._sort_order:
            sql_order = self._get_order()
            if sql_order:
                sql = sql + " order by " + sql_order
        cur = KioskSQLDb.execute_return_cursor(sql)
        try:
            columns = [desc[0] for desc in cur.description]
            # columns.sort()
            if not self.get_column_names() == columns:
                raise ColumnsDontMatchError(
                    f"ContextQuery._get_next_cursor: Columns don't match first select: {sql}. ")
        except Exception as e:
            if cur:
                cur.close()
            raise e

        return cur

    def _get_next_record(self):
        stop = False
        while not stop:
            r = None
            if self._cur:
                r = self._cur.fetchone()
            if r:
                return r
            else:
                if self._cur:
                    self._cur.close()
                self._cur = self._get_next_cursor()
                if not self._cur:
                    return None

    def define_from_dict(self, params: dict) -> None:
        """
        reads its own definition from a dictionary.

        :param params: ContextQuery expects a dict with these params:
          columns: a dictionary with column definitions
          conditions: a dictionary with condition definitions

        Different sub-classes might expect different keys or none at all in the dict.

        :exception: Can throw all kinds of exceptions.
        """
        if "distinct" in params:
            self.distinct = bool(params["distinct"])
        if "columns" in params:
            self._read_columns_from_dict(params)
        if "conditions" in params:
            self._read_conditions_from_dict(params)
        if "sort" in params:
            self._read_sort_order_from_dict(params)

    def _read_columns_from_dict(self, params: dict):
        self.columns = params["columns"]

    def _read_conditions_from_dict(self, params: dict):
        conditions = params["conditions"]
        self._add_conditions(conditions)

    def _read_sort_order_from_dict(self, params: dict):
        sort_order = params["sort"]
        self._add_sort_order(sort_order)

    def _auto_cache_query(self):
        if not isinstance(self._selects, SqlSourceCached):
            cached_selects = SqlSourceTempCache()
            cached_selects.add_source(self._selects)
            self._selects = cached_selects

    def records(self, formatter=None, page=1, new_page_size=0):
        """
        a generator: returns a new row with data from the context selection per iteration.
        Once started, page_count will be set to the actual number of pages available.
        todo: The handling of pages is very inefficient. Think about a more efficient way and
              perhaps introduce a version that does not count all records at all.
        :param formatter: Optional. A function that will be called with the record and
                          must return a formatted version of the record.
        :param page:      the number of the page, starting with 1.
                          If page exceeds the number of pages an error will occur.
        :param new_page_size: optional. how many records should be returned per page?
                              Default is defined by DEFAULT_PAGE_SIZE.
                              if -1 than no pagination will occur and ALL records will be returned at once.
        :returns: yields either a dict with data or an empty list as eof.
                  If a formatter is given, the return value depends on the return code of the formatter.
                  If and ONLY IF page 1 is requested, page_count will be set.
                  And that only after the generator for page one has been consumed!

        :exception: throws all kinds of exceptions
        """
        if new_page_size > 0:
            self._page_size = new_page_size

        stop = False
        self._query_active = True
        record_count = 0
        try:
            while not stop:
                r = self._get_next_record()
                if not r:
                    stop = True
                else:
                    record_count += 1
                    if new_page_size == -1 or ((page - 1) * self._page_size < record_count <= page * self._page_size):
                        if formatter:
                            yield formatter(dict(r))
                        else:
                            yield dict(r)
                    else:
                        if record_count > page * self._page_size:
                            if page > 1:
                                break

            if page == 1 and self._page_size > 0:
                self._page_count = record_count // self._page_size + 1 if record_count % self._page_size > 0 else 0
                self._overall_record_count = record_count

        finally:
            self._query_active = False
            self.close()
            self._cur = None
