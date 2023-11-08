from pprint import pprint
from typing import List

from dsd.dsd3 import DataSetDefinition, Join
from dsd.dsdgraph import DsdGraph
from kiosksqldb import KioskSQLDb


class KioskScopeSelect:
    def __init__(self, include_lookups=False):
        self._lookup_key_fields = {}
        self._graph: DsdGraph = None
        self._type: str = ""
        self._dsd: DataSetDefinition = None
        self._include_lookups = include_lookups

    @property
    def lookup_key_fields(self):
        return self._lookup_key_fields

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
        self._graph.include_lookups = self._include_lookups

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
        if origin:
            context_def = {origin: "browse()"}
        else:
            context_def = "browse()"

        self.from_dict(context_def, scope_only=True)

    def _get_join(self, root_table, table):
        return self._graph.get_join(root_table, table)

    def _add_lookup_key_field(self, related_table, related_field):
        if related_table in self._lookup_key_fields:
            if self._lookup_key_fields[related_table] != related_field:
                self._lookup_key_fields[related_table] = "?"
        else:
            self._lookup_key_fields[related_table] = related_field

    def _get_from_for_path(self, path: list) -> str:
        sql = "from"
        root_table = ""
        root_alias = ""
        alias = ""
        alias_count = 0
        for index, table in enumerate(path):
            if table in path[index + 1:]:
                # the table will occur again in the SQL, so the earlier version needs to be aliased
                alias_count += 1
                alias = f"{table}{alias_count}"

            if root_table:
                join = self._get_join(root_table, table)

                # That is so hacky. It avoids an outcome like
                # "from locus_types
                # inner join locus_types on "locus"."type" = "locus_types"."id".
                # But I am not sure that suffices in all cases.
                if join.related_table == root_table:
                    join = Join(root_table=join.related_table,
                                related_table=join.root_table,
                                _type=join.type,
                                root_field=join.related_field,
                                related_field=join.root_field,
                                quantifier=join.quantifier)

                if join.type == "lookup":
                    self._add_lookup_key_field(join.related_table, join.related_field)
                join.root_alias = root_alias
                join.related_alias = alias
                sql += join.get_sql()
            else:
                sql += " " + KioskSQLDb.sql_safe_ident(table)
                if alias:
                    sql += " as " + KioskSQLDb.sql_safe_ident(alias)

            root_table = table
            root_alias = alias
            alias = ""

        return sql

    def _get_select_fields_from_dsd(self, table: str) -> str:
        sql = ""
        for f in self._dsd.list_fields(table):
            sql += f"{',' if sql else ''}{KioskSQLDb.sql_safe_ident(table)}.{KioskSQLDb.sql_safe_ident(f)}"
        return sql

    def _get_additional_lookup_paths(self, source_table: str, trail=None, recursive=False) -> [[str]]:
        """
        returns the paths from a table to its lookup tables. Recursive.
        :param source_table: the table with the "lookup" reference(s)
        :return: a list of path lists
        """
        if not trail:
            trail = []

        result = []
        lookup_joins = self._dsd.get_lookup_joins(source_table)
        for join in lookup_joins:
            if join.related_table not in trail and join.related_table != source_table:
                result.append([*trail, join.related_table])
                if recursive:
                    result.extend(self._get_additional_lookup_paths(join.related_table,
                                                                    trail=[*trail, join.related_table],
                                                                    recursive=True))

        return result

    def get_selects(self, record_type: str, target_types: list[str], add_lore: bool, only_lookups=False) -> list[
        tuple[str, str]]:
        """
        returns a list of select statements each of which consumes a PsycoPG2 parameter %(identifier)s.
        So there has to be a variable "identifier" in the parameter dict when running the sql statement.

        NOTE that the where clauses will include an identifier and expect the value for that where clause
        to be UPPERCASE when the selects are actually executed later!

        :param record_type: the origin of all the sql statements.
                            This is also the record type which will be queried by the given identifier.
        :param target_types: a list of target record types.
        :param add_lore: adds the select statements that reveal the lore of the record_type:
                         Tables the record_type itself joins back to.
        :param only_lookups: returns only selects that connect lookup tables
        :return: a list of tuples of (record_type, select statement).
        """

        if self.has_no_scope():
            self._auto_context()
            if self.has_no_scope():
                raise Exception(f"{self.__class__.__name__}.get_selects: auto scoping failed")

        key_fields = self._dsd.get_fields_with_instructions(record_type, ["identifier"])

        paths = self._get_target_paths(record_type, target_types)

        sqls = []
        lookup_tables = set()
        for p in paths:
            dest_table = p[-1]
            # add a path for every lookup relation (should be recursive) that starts from the source table
            if self._include_lookups:
                for lookup_path in self._get_additional_lookup_paths(dest_table):
                    paths.append([*p, *lookup_path])
                    lookup_tables.add(lookup_path[0])

            if not only_lookups or dest_table in lookup_tables:
                select_fields = self._get_select_fields_from_dsd(dest_table)
                sql = self._get_from_for_path(p)
                where_sql = self._get_selects_where(key_fields, p, record_type)

                sqls.append((dest_table, "select distinct " + select_fields + " " + sql + where_sql))

        if add_lore:
            lookup_tables = set()
            paths = self._get_lore_paths(record_type)
            for p in paths:
                src_table = p[0]
                # add a path for every lookup relation (should be recursive) that starts from the source table
                if self._include_lookups:
                    for lookup_path in self._get_additional_lookup_paths(src_table):
                        paths.append([*lookup_path, *p])
                        lookup_tables.add(lookup_path[0])

                if not only_lookups or p[0] in lookup_tables:
                    select_fields = self._get_select_fields_from_dsd(src_table)
                    sql = self._get_from_for_path(p)
                    where_sql = self._get_selects_where(key_fields, p, record_type)

                    sqls.append((src_table, "select distinct " + select_fields + " " + sql + where_sql))

        return sqls

    def _get_selects_where(self, key_fields: dict, path: List[str], base_record_type):
        where_sql = f" where "
        where_or = ""
        root_table = base_record_type
        if path.count(root_table) > 1:
            root_table = root_table + "1"

        for k in key_fields:
            where_sql += where_or + (f"UPPER({KioskSQLDb.sql_safe_ident(root_table)}."
                                     f"{KioskSQLDb.sql_safe_ident(k)})=%(identifier)s")
            where_or = " or "
        return where_sql

    def _get_target_paths(self, record_type, target_types):
        paths = []
        for t in target_types:
            if record_type == t:
                paths.append([t])
            else:
                for p in self._graph.get_paths_to_table(t, record_type):
                    paths.append(p)
        return paths

    def _get_lore_paths(self, record_type):
        """
        returns the paths from the record_type to all the record_types it joins back to
        :param record_type:
        :return:
        """

        def r_get_lookup_tables(tables: List[str]):
            return ["locus_types"]

        def r_get_joined_tables(record_type) -> []:
            result = []
            paths = self._graph.get_joined_tables(record_type)
            for p in paths:
                result.append(p)
                result.extend(r_get_joined_tables(p))
            return result

        paths = []
        lore_tables = r_get_joined_tables(record_type)
        for t in lore_tables:
            for p in self._graph.get_paths_to_table(record_type, t):
                paths.append(p)
        return paths
