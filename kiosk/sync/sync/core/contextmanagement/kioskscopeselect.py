from dsd.dsd3 import DataSetDefinition
from dsd.dsdgraph import DsdGraph
from kiosksqldb import KioskSQLDb


class KioskScopeSelect:
    def __init__(self):
        self._graph: DsdGraph = None
        self._type: str = ""
        self._dsd: DataSetDefinition = None

    def set_dsd(self, dsd):
        if dsd:
            self._dsd = dsd

    def from_dict(self, context_data: dict, scope_only=False) -> None:
        """
        reads a context definition from the dict and creates the graph to navigate the context's structure.
        Necessary preparatory step before the context can be used for anything.
        :param context_data: dictionary with the context data (the name of the context not included)
        :param scope_only: optional. If set the context definition is expected to be a scope,
                so "type" and "scope" keywords are skipped.
        :returns: Nothing. Throws exceptions if things go wrong
        """

        # main function
        self._graph = DsdGraph(self._dsd)
        if scope_only:
            self._type = ""
            self._graph.add_tables(context_data)
        else:
            self._type = context_data["type"]
            self._graph.add_tables(context_data["scope"])

    def has_no_scope(self):
        return self._graph.is_empty() if self._graph else True

    def read_from_dsd(self):
        """
        reads the context from the dsd.
        :returns: Noting. Throws exceptions if things go wrong
        """
        context_data = self._dsd.get_context(self.name)
        self.from_dict(context_data)

    def _auto_context(self, origin: str = "") -> None:
        context_def = {origin: "browse()"}
        self.from_dict(context_def, scope_only=True)

    def _get_from_for_path(self, path: list) -> str:
        sql = "from"
        root_table = ""
        for table in path:
            if root_table:
                join = self._graph.get_join(root_table, table)
                sql += join.get_sql()
            else:
                sql += " " + table

            root_table = table

        return sql

    def _get_select_fields_from_dsd(self, table: str) -> str:
        sql = ""
        for f in self._dsd.list_fields(table):
            sql += f"{',' if sql else ''}{KioskSQLDb.sql_safe_ident(table)}.{KioskSQLDb.sql_safe_ident(f)}"
        return sql

    def get_selects(self, record_type: str, target_types: list[str]) -> list[tuple[str, str]]:
        """
        returns a list of select statements each of which consumes a PsycoPG2 parameter %(identifier)s.
        So there has to be a variable "identifier" in the parameter dict when running the sql statement.

        :param record_type: the origin of all the sql statements.
                            This is also the record type which will be queried by the given identifier.
        :param target_types: a list of target record types.
        :return: a list of tuples of (record_type, select statement).
        """

        if self.has_no_scope():
            self._auto_context(record_type)
            if self.has_no_scope():
                raise Exception(f"{self.__class__.__name__}.get_selects: auto scoping failed")

        key_fields = self._dsd.get_fields_with_instructions(record_type, ["identifier"])

        paths = []
        for t in target_types:
            if record_type == t:
                paths.append([t])
            else:
                for p in self._graph.get_paths_to_table(t, record_type):
                    paths.append(p)

        where_sql = f" where "
        where_or = ""
        for k in key_fields:
            where_sql += where_or + (f"{KioskSQLDb.sql_safe_ident(record_type)}."
                                     f"{KioskSQLDb.sql_safe_ident(k)}=%(identifier)s")
            where_or = " or "

        sqls = []
        for p in paths:
            dest_table = p[-1]
            select_fields = self._get_select_fields_from_dsd(dest_table)
            sql = self._get_from_for_path(p)

            sqls.append((dest_table, "select " + select_fields + " " + sql + where_sql))

        return sqls
