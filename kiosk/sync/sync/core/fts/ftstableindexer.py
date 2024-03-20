from typing import List, Tuple

import kioskstdlib
import logging
from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig


class FTSTableIndexer:
    def __init__(self, dsd=None):
        self.cfg = SyncConfig.get_config()
        self.fts_config = self.cfg.get_fts_config()
        self.dsd = dsd if dsd else Dsd3Singleton.get_dsd3()
        self.exclude_instructions = ["replfield_modified_by", "id_domain"]
        if "skip_by_instruction" in self.fts_config:
            self.exclude_instructions.extend(self.fts_config["skip_by_instruction"])
        if "default_weight" not in self.fts_config:
            self.fts_config["default_weight"] = "B"

    def _get_fts_fields(self, table):
        """
        yields a tuple of fieldname and weight for all fields that should be included in the full text search index
        :param table: the table to get the fields for
        :return: a tuple of fieldname and weight
        """
        for f in self.dsd.list_fields(table):
            instructions = self.dsd.get_unparsed_field_instructions(table, f)
            is_text_datatype = self.dsd.get_field_datatype(table, f) in ["text", "varchar"]
            include_field = is_text_datatype

            if include_field:
                include_field = not self._exclude_field(instructions)

            weight = self._get_weight(table, f)
            if weight == "-":
                include_field = False
            elif weight != "":
                include_field = True

            if include_field:
                weight = weight if weight else self.fts_config["default_weight"]
                yield f, weight

    #
    def _get_weight(self, table, f):
        """
        get the explicitly set weight for a dsd field
        :param table: the table that contains the field
        :param f: the name of the field
        :return: the weight or an empty string if no weight is set on the field
        """
        fts_instruction = self.dsd.get_instruction_parameters(table, f, "fts")
        if fts_instruction:
            if fts_instruction[0].upper() in ["A", "B", "C", "D", "-"]:
                return fts_instruction[0].upper()
        return ""

    def _exclude_field(self, instructions):
        """
        check if a field should be excluded from the full text search index
        :param instructions: the list of instructions for the field
        :return: True if the field should be excluded
        """
        for i in instructions:
            for x in self.exclude_instructions:
                if i.startswith(x):
                    return True

        return False

    def _get_language(self):
        """
            get the language to use for the full text search index
            :return: the language as a string. Defaults to "english"
        """
        return kioskstdlib.try_get_dict_entry(self.fts_config, "language", "english", True)

    def _get_fts_sql_and_params(self, table: str) -> Tuple[str, List]:
        """

        get the sql and parameters to create the fts field for a table.
        Note that this does not drop the field first.
        :param table:
        :return: a tuple with the sql statement and the parameters
                 if there is no field that can be added to the fts index, the sql statement will be an empty string and
                 the parameters empty.
        """
        sql_columns = ""
        lang = self._get_language()
        fields_and_weights = self._get_fts_fields(table)
        params = []
        for f, w in fields_and_weights:
            sql_columns += ((" || " if sql_columns else "") +
                            f"setweight(to_tsvector('{lang}', coalesce({KioskSQLDb.sql_safe_ident(f)}, '')), %s)")
            params.append(w)

        if sql_columns:
            sql = "alter table " + f"""{KioskSQLDb.sql_safe_ident(table)} add column fts tsvector generated always as ({
                    sql_columns}) stored;"""
            return (sql, params)
        else:
            return "", []

    @staticmethod
    def _get_drop_fts_column_sql(table):
        return f"alter table {KioskSQLDb.sql_safe_ident(table)} drop column if exists fts;"

    def _excluded_from_fts(self, table):
        """
        check if a table is excluded from the full text search index.
        This is the case if the table has one of the meta flags "no_fts", "system_table", "not_in_master" or
        if the table is not supposed to be synced (lacking a replfield_uuid)

        :param table:
        :return: boolean
        :raises all kinds of exceptions if something goes wrong
        """
        return self.dsd.table_has_meta_flag(table, "no_fts") or self.dsd.table_has_meta_flag(table, "system_table") \
            or self.dsd.table_has_meta_flag(table, "not_in_master") or not self.dsd.table_can_sync(table)

    def table_has_fts(self, table: str):
        """
        check if a table should have a full text search index (this is not actually checking the database)
        :param table: the table to check
        :return: True or false
        """
        if not self._excluded_from_fts(table):
            for _ in self._get_fts_fields(table):
                return True

        return False

    def create_or_refresh_fts_column_for_table(self, table: str, commit: bool = False) -> bool:
        """
        create or refresh an existing fts column for an existing table.
        This succeeds only for tables that are supposed to be indexed.
        If the table is not supposed to be indexed, this returns false
        Note that tables that have a fts column but are not supposed to be indexed will have their fts column dropped.

        :param commit: if True, the transaction will be committed after the operation.
        :param table: table name
        :return: True if the table got indexed, False if the table is explicitly excluded from indexing
        :raises all kinds of exceptions if something goes wrong
        """

        sql_drop = self._get_drop_fts_column_sql(table)
        sql_alter = ""
        try:
            params = []
            if not self._excluded_from_fts(table):
                sql_alter, params = self._get_fts_sql_and_params(table)

            KioskSQLDb.execute(sql_drop + sql_alter, params, commit)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.create_or_refresh_fts_column_for_table: {repr(e)}")
            logging.error(f"{self.__class__.__name__}.create_or_refresh_fts_column_for_table: "
                          f"sql was {sql_drop + sql_alter}")
            raise Exception(f"create_or_refresh_fts_column_for_table failed for for table {table}.")
        return True

    def create_or_refresh_fts_column_for_tables(self, tables: List[str] = None, commit: bool = False):
        """
        create or refresh an existing fts column for all existing tables that are supposed to be indexed.

        :param tables: optional list of tables to create or refresh the fts column for.
                       If empty, all tables will be processed.
        :param commit: if True, the transaction will be committed after the operation
        :raises all kinds of exceptions if something goes wrong
        """
        tables = tables if tables else []

        for table in self.dsd.list_tables():
            if tables and table not in tables:
                continue
            self.create_or_refresh_fts_column_for_table(table, commit)
