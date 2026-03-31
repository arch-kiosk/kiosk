import logging
import pprint
import typing

from dsd.dsd3 import DataSetDefinition
from dsd.dsdgraph import DsdGraph


class SQL2EmbeddedJSON:
    def __init__(self, config, dsd):
        self._config = config
        self._dsd = dsd
        self._dsd_graph = DsdGraph(self._dsd)
        self._dsd_graph.auto_scope(add_files_table_references=True)

    def _r_generate_nested_sql(self, table_name):
        """
        Recursively builds a JSONB SQL string based on the table relationships of the dsd.


        """
        # table_info = metadata.get(table_name)
        # if not table_info:
        #     return "NULL"

        # 1. Get standard columns for this table
        cols = self._dsd.list_fields(table_name)
        hidden = self._dsd.get_fields_with_instruction(table_name, "hide")
        json_fields = []

        for col in cols:
            if col not in hidden:
                json_fields.append(f"'{col}', t_{table_name}.{col}")

        # 2. Check for child relationships in the DDL
        children = self._dsd_graph.get_dependent_tables(table_name)
        for child in children:
            child_table = child
            join = self._dsd_graph.get_join(table_name, child)
            foreign_key = join.related_field
            parent_key = join.root_field

            # Recursive call to handle the next level deep (The "Russian Doll")
            child_sql = self._r_generate_nested_sql(child_table)

            # Wrap the child in an aggregation
            nested_query = f"""(
                SELECT jsonb_agg({child_sql})
                FROM {child_table} t_{child_table}
                WHERE t_{child_table}.{foreign_key} = t_{table_name}.{parent_key}
            )"""

            json_fields.append(f"'{child_table}', {nested_query}")

        # 3. Combine into the final jsonb_build_object string
        fields_str = ", ".join(json_fields)
        return f"jsonb_build_object({fields_str})"

    def generate_nested_sqls(self) -> typing.List[typing.Tuple[str, str]]:
        # Generate the queries for the root tables
        root_tables = self._dsd_graph.get_root_tables()
        sqls = []
        for table in root_tables:
            final_sql = f"SELECT {self._r_generate_nested_sql(table)} FROM {table} t_{table};"
            # logging.debug(f"{self.__class__.__name__}.generate_nested_sqls: {table}: {pprint.pformat(final_sql)}")
            sqls.append((table, final_sql))

        return sqls

