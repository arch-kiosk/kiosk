import copy
from collections import namedtuple

from dsd.dsd3 import DataSetDefinition, Join
from igraph import *
from dsd.dsderrors import DSDError
from simplefunctionparser import SimpleFunctionParser


class DsdGraphError(Exception):
    pass


class DsdGraph:
    '''
        DsdGraph is a bit like a view on the dsd. It allows to join tables together (using dsd information)
        and get analytic information from the so established graph.
    '''

    class CurrentSearch:
        def __init__(self):
            # noinspection PyTypeChecker
            self.instruction: SimpleFunctionParser = SimpleFunctionParser()
            self.search_term: str = ""
            self.table: str = ""

    def __init__(self, dsd: DataSetDefinition, roots: list = None):
        self.current_search = self.CurrentSearch()
        self._dsd = dsd
        self._graph = Graph(directed=True)
        self.parser = SimpleFunctionParser()
        self._dsd_joins = {}

    def _parse_join(self, join_statement, root_table, table) -> Join:
        if not root_table:
            raise DsdGraphError(f"KioskContext.from_dict: \"join\" used without root table in {table}")

        self.parser.parse(join_statement)
        if not self.parser.ok:
            raise DsdGraphError(f"KioskContext.from_dict: Error in \"join\" {join_statement} "
                                f"between {root_table} and {table}")

        return Join(_type=self.parser.instruction,
                    root_table=root_table,
                    related_table=table,
                    root_field=self.parser.parameters[0],
                    related_field=self.parser.parameters[1])

    def is_empty(self):
        return len(self._graph.vs) == 0

    def get_root_tables(self) -> list:
        """
        returns all tables at the root of the context
        :return:
        """
        indegrees = self._graph.indegree()
        root_tables = []
        root_indexes = [idx for idx in range(0, len(indegrees)) if not indegrees[idx]]
        for idx in root_indexes:
            root_tables.append(self._graph.vs[idx]["name"])
        return root_tables

    def get_root_identifiers(self) -> list:
        """
        returns all tables that are at the root of the context and have an identifier() instruction
        :return: a list
        """
        root_tables = self.get_root_tables()
        return [t for t in root_tables
                if self.table_has_instruction(t, "identifier")]

    def get_identifier_tables(self) -> list:
        """
        returns all tables of the context that have an identifier() instruction
        :return: a list of table names
        """
        identifier_tables = self._dsd.list_tables_with_instructions(["identifier"])
        result = []
        for vertex in self._graph.vs:
            if vertex["name"] in identifier_tables:
                result.append(vertex["name"])

        return result

    def _browse_table_scope(self, table: str, exclude_tables: list = None) -> dict:
        """
        creates an automatic scope dict starting with the table of origin
        :param table: the table of origin
        :param exclude_tables: don't include those tables and tables joining them
        :return: a scope dict or {}
        """

        def __browse_table_scope(_table: str, level=0):
            if level > 10:
                raise DsdGraphError("DsdGraph._browse_table_scope: maximum recursion level exceeded.")

            scope = {}
            if _table in self._dsd_joins:
                # if _table not in scope:
                #     scope[_table] = {}
                for join in self._dsd_joins[_table]:
                    join: Join
                    if join.related_table not in exclude_tables:
                        new_scope = __browse_table_scope(join.related_table, level + 1)
                        scope[join.related_table] = new_scope

            return scope

        if exclude_tables is None:
            exclude_tables = []

        self._get_dsd_joins()

        if table not in self._dsd.list_tables():
            raise DsdGraphError(f"DsdGraph._browse_table_scope: root table {table} unknown.")

        return __browse_table_scope(_table=table)

    def _get_dsd_joins(self, refresh=False) -> None:
        """
        a little helper to fetch the dsd joins as soon as needed but only once.
        They can be accessed using self._dsd_joins afterwards.

        :param refresh: set to True if you want to force refresh the _dsd_joins.
        """
        if not self._dsd_joins or refresh:
            self._dsd_joins = self._dsd.list_default_joins()

    def _parse_scope_instruction(self, command: str, table: str = "") -> dict:
        """

        :param command: the instruction.
        :param table: the table on which the instruction occurred.
                      if not given all root tables will be used.
        :return: dict: a scope dictionary or an empty dict.
        """
        instruction = SimpleFunctionParser()
        instruction.parse(command=command)
        if instruction.ok:
            if instruction.instruction == "browse":
                if table:
                    return self._browse_table_scope(table, exclude_tables=instruction.parameters)
                else:
                    if isinstance(instruction.parameters, list):
                        exclude_tables = instruction.parameters
                    else:
                        exclude_tables = []
                    tables = self._dsd.list_root_tables()
                    scope = {}
                    for table in tables:
                        if table not in instruction.parameters:
                            new_scope = self._browse_table_scope(table, exclude_tables=instruction.parameters)
                            scope[table] = new_scope
                    return scope
            else:
                raise DsdGraphError(f"Parsing error of scope instruction {command}: Unknown instruction.")
        else:
            raise DsdGraphError(f"Parsing error of scope instruction {command}: {instruction.get_error()}")

    def auto_scope(self, tables=None, exclude_tables: list = None) -> None:
        """
        creates an automatic scope either starting with a given table or
        with all root tables having an identifier in the dsd.
        :param tables: an optional list of root tables. If not given,
                       all root tables of the dsd having an identifier will be used.
        :param exclude_tables: an optional list of tables not to browse when auto scoping
        """
        if tables is None:
            tables = []
        if exclude_tables is None:
            exclude_tables = []

        if not tables:
            tables = self._dsd.list_root_tables()

        self._get_dsd_joins()
        scope = {}
        for t in tables:
            scope[t] = self._browse_table_scope(t, exclude_tables=exclude_tables)

        self.add_tables(scope)

    # def auto_index(self, tables=None, exclude_tables: list = None) -> None:
    #     """
    #     creates a scope for an index (instead of for a context). That means that all tables in the context
    #     with an identifier are additionally added to the scope as a root table and then auto-scoped (except for
    #     the original root table or tables themselves)
    #     :param tables: a list of root tables to start with. If not given, all root tables will be fetched from the dsd
    #     :param exclude_tables: a list of tables to ignore (which also ignores the tables joining them)
    #     """
    #     if tables is None:
    #         tables = self._dsd.list_root_tables()
    #     self.auto_scope(tables=tables, exclude_tables=exclude_tables)
    #     identifier_tables = [t for t in self.get_identifier_tables() if t not in tables]
    #     self.auto_scope(tables=identifier_tables, exclude_tables=exclude_tables)

    def add_tables(self, scope_statement):
        """
        add a scope of tables. The scope dictionary follows the syntax of a context definition.
        :param scope: a dictionary with a context definition.
        :exception DsdGraphError: Thrown under different circumstances given by the exception's message.
        """

        def _add_tables(_scope: dict, r_depth=0, root_table=""):
            if r_depth > 10:
                raise DsdGraphError("Too deep recursion in KioskContext.from_dict/_add_tables.")

            for t in _scope:
                # noinspection PyTypeChecker
                join: Join = None
                new_scope = None
                if isinstance(_scope[t], str):
                    new_scope = self._parse_scope_instruction(_scope[t], table=t)
                    # implicit join
                    if r_depth > 0 and root_table:
                        join = self._dsd.get_default_join(root_table, t)
                else:
                    if "auto-scope" in _scope[t]:
                        if "relates_to" in _scope[t]:
                            raise DsdGraphError(f"'auto-scope' and 'relates to' are mutually exclusive. "
                                                f"Error in scope definition for table {t}")
                        new_scope = self._parse_scope_instruction(_scope[t]["auto-scope"], table=t)
                    elif "relates_to" in _scope[t]:
                        new_scope = _scope[t]["relates_to"]

                    if "join" in _scope[t]:
                        # explicit join
                        if not r_depth:
                            raise DsdGraphError(f"KioskContext.from_dict: \"join\" used in root table in {t}")
                        join = self._parse_join(_scope[t]["join"], root_table, t)
                    else:
                        # implicit join
                        if r_depth > 0 and root_table:
                            join = self._dsd.get_default_join(root_table, t)
                        if "relates_to" in _scope[t]:
                            new_scope = _scope[t]["relates_to"]

                    if not ("auto-scope" in _scope[t] or "relates_to" in _scope[t] or "join" in _scope[t]):
                        new_scope = _scope[t]

                if (not join) and (root_table != "" or r_depth > 0):
                    raise DsdGraphError(f"KioskContext.from_dict: Missing \"join\" or unclear "
                                        f"default join between {root_table} and {t}")

                self.add_table(t)
                if join:
                    self.add_join(join)
                if new_scope:
                    _add_tables(_scope=new_scope, r_depth=r_depth + 1, root_table=t)

        if isinstance(scope_statement, str):
            scope = self._parse_scope_instruction(scope_statement)
            _add_tables(_scope=scope)
        else:
            if isinstance(scope_statement, dict):
                scope = scope_statement
                _add_tables(_scope=scope)

    def add_table(self, table_name: str) -> None:
        """
        adds a table to the graph if it does not already exist
        :param table_name: name of the table
        :exception: throws exceptions if something goes wrong.
        """
        if table_name not in self._dsd.list_tables():
            raise DSDError(f"DsdGraph.add_table: table {table_name} not in dsd.")
        try:
            self._graph.vs.find(name=table_name)
            return
        except ValueError:
            pass

        v = self._graph.add_vertex(name=table_name)
        fields = self._dsd.list_fields(table_name)
        v["fields"] = list(fields)
        table_instructions = list()
        for f in fields:
            table_instructions.extend(self._dsd.get_field_instructions(table_name, f))
        v["instructions"] = list(set(table_instructions))

    def add_join(self, join: Join) -> None:
        """
        adds a relation between a table and a joined table.
        Note that this is a directed graph, so the relation works only in the direction towards the
        joined table!
        :param join: a Join tuple
        returns: Nothing. Throws exceptions.
        """
        edge = self._graph.add_edge(join.root_table, join.related_table)
        edge["join"] = copy.copy(join)

    def get_paths_to_table(self, table_name: str, start_table="") -> list:
        """
        returns a list with all paths that lead to a table
        :param table_name:
        :return: a list with tables that lead to the target table. e.G. ["table1", "table2", "target table"]
        :exception: throws exceptions
        """
        paths = []
        try:
            vs = self._graph.vs.find(name=table_name)
        except ValueError as e:
            raise DsdGraphError(f"DsdGraph.get_paths_to_table: table {table_name} not in context definition: {repr(e)}")
        if not vs.indegree():
            return [[table_name]]

        if not start_table:
            root_tables = self.get_root_tables()
        else:
            root_tables = [start_table]

        for root_table in root_tables:
            all_paths = self._graph.get_all_simple_paths(root_table, table_name)
            if all_paths and all_paths[0]:
                p = all_paths[0]
                this_path = []
                for t in p:
                    table = self._graph.vs(t)["name"][0]
                    this_path.append(table)
                paths.append(this_path)
        return paths

    def _check_vertex(self, vertex: Vertex) -> bool:
        if self.current_search.table:
            if self.current_search.table != vertex["name"]:
                return False

        if self.current_search.instruction.ok:
            for instruction in vertex["instructions"]:
                instruction: str
                if instruction.lower().startswith(self.current_search.instruction.instruction):
                    return True
        else:
            if self.current_search.search_term in vertex["fields"]:
                return True
        return False

    def find_paths(self, search_term):
        """
        finds all paths to all tables that match the search term.
        :param search_term: either a field name or an instruction.
                currently instructions are searched only according to their name.
                parameters of the instruction are ignored in either the search term and
                the instruction in the dsd.
                the search_term can be prefixed with a table, like locus.type or locus.identifier(), in which case
                the search will only result in paths that lead to the particular table.
        :return: a list with tables that lead to the target table. e.G. ["table1", "table2", "target table"]
        :exception: throws exceptions
        """

        self._prepare_search(search_term)

        vertices = self._graph.vs.select(self._check_vertex)
        paths = []
        for v in vertices:
            paths.extend(self.get_paths_to_table(v["name"]))

        return paths

    def _prepare_search(self, search_term):
        search_term = search_term.split(".")
        if len(search_term) == 2:
            self.current_search.table = search_term[0]
            field_or_instruction = search_term[1]
        else:
            self.current_search.table = ""
            field_or_instruction = search_term[0]

        self.current_search.instruction.parse(field_or_instruction)
        if self.current_search.instruction.ok:
            self.current_search.instruction.instruction = self.current_search.instruction.instruction.lower()
        else:
            self.current_search.search_term = field_or_instruction

    def find_closest(self, paths, search_term) -> (str, int):
        """
        finds the closest table backwards matching the search term.
        E.G. if table1 has an identifier() instruction and neither table2 nor table3 do,
        and the graph is table1->table2->table3 then find_closest([table1, table2, table3], "identifier()")
        results in table1.
        :param paths: list of paths [[table, table, table], ...] leading to the same target table. That is
                      the table from the perspective of which the closest identifier is searched.
        :param search_term: either a field name or an instruction.
                currently instructions are searched only according to their name.
                parameters of the instruction are ignored in either the search term and
                the instruction in the dsd.

        returns: a tuple with the name of the first closest table that matches the search term
                 and the distance.
        """

        target_table = set()
        distance = 0
        for path in paths:
            target_table.add(path[len(path) - 1])
            if len(path) > distance:
                distance = len(path)

        if len(target_table) != 1:
            raise DsdGraphError(f"There are {len(target_table)} target tables given. Only one is allowed.")

        self._prepare_search(search_term)
        nearest_table: str = ""

        for path in paths:
            for idx in range(len(path) - 1, -1, -1):
                vertex = self._graph.vs.find(path[idx])
                if self._check_vertex(vertex):
                    new_distance = len(path) - 1 - idx
                    if new_distance == 0:
                        return path[idx], 0
                    else:
                        if new_distance < distance:
                            distance = new_distance
                            nearest_table = path[idx]

        return nearest_table, distance

    def find_closest_identifier(self, target_table: str) -> str:
        """
        finds the identifier that's closest to the target table.
        E.G. if table1 has an identifier() instruction and neither table2 or table3 does,
        and the graph is table1->table2->table3 then find_closest_identifier("table3")
        results in table1.
        :param target_table: a table name

        returns: the name of the closest table with an identifier() field.
        """

        paths = self.get_paths_to_table(target_table)
        return self.find_closest(paths, "identifier()")[0]

    def get_join(self, root_table: str, target_table: str) -> Join:
        """
        returns a Join object for the first link between root_table and target_table
        :param root_table:
        :param target_table:
        :return: a Join object.
        :except: throws all kinds of exceptions in case of an error.
        """
        r_idx = self._graph.vs.find(root_table).index
        t_idx = self._graph.vs.find(target_table).index
        edge = self._graph.es[self._graph.get_eid(r_idx, t_idx)]
        return edge["join"]

    def table_has_instruction(self, table: str, instruction: str):
        """
        checks if a table has at least one field including the given instruction.
        :param table: the table
        :param instruction: the instruction in question
        :return: true if table structure has instruction, otherwise false.
        :exception: can throw exceptions.
        """
        vertex = self._graph.vs.find(table)
        return instruction in vertex["instructions"]

    def table_has_field(self, table: str, field: str):
        """
        checks if a table has a field with the given field name.
        :param table: the table
        :param field: the field name in question
        :return: true if table structure has the field, otherwise false.
        :exception: can throw exceptions.
        """
        return field in self._graph.vs.find(table)["fields"]
