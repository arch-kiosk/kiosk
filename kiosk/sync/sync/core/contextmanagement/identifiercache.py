from dsd.dsd3 import DataSetDefinition
from dsd.dsdconstants import KEY_INSTRUCTION_IDENTIFIER, KEY_INSTRUCTION_REPLFIELD_UUID, KEY_INSTRUCTION_SKIP_INDEX_ON
from dsd.dsderrors import DSDError, DSDSemanticError
from kiosksqldb import KioskSQLDb


class IdentifierCache:

    # constants ot address the values in an _identifiers tuple
    IDENTIFIER_TABLE = 0
    IDENTIFIER_ID_FIELD = 1
    IDENTIFIER_UID_FIELD = 2

    def __init__(self, dsd):
        """
        inits the identifier cache on the basis of the dsd
        :param dsd: the dsd
        """
        if not dsd:
            raise Exception("no dsd given to IdentifierCache.__init__")

        self._dsd: DataSetDefinition = dsd
        self._identifiers: list = self._get_identifiers_from_dsd()

    def _get_identifiers_from_dsd(self) -> list:
        """
        returns a list of tuples (table, field with identifier, field with replfield_uuid)
        :return: list [(table, field with identifier, field with replfield_uuid), ...]
        """
        identifiers = []
        tables = self._dsd.list_tables_with_instructions([KEY_INSTRUCTION_IDENTIFIER])
        tables.sort()
        for t in tables:
            fields = self._dsd.list_fields_with_instruction(t, KEY_INSTRUCTION_IDENTIFIER)
            fields.sort()
            if fields:
                uid_field = self._dsd.list_fields_with_instruction(t, KEY_INSTRUCTION_REPLFIELD_UUID)[0]
                for f in fields:
                    identifiers.append((t, f, uid_field))

        return identifiers

    def _get_sql(self, identifier: tuple, id_index: int, additional_select: str = ""):
        additional_where: str = ""
        table = identifier[self.IDENTIFIER_TABLE]
        field = identifier[self.IDENTIFIER_ID_FIELD]
        instructions = self._dsd.get_field_instructions(table, field)
        if KEY_INSTRUCTION_SKIP_INDEX_ON in instructions.keys():
            parameters = instructions[KEY_INSTRUCTION_SKIP_INDEX_ON]
            for p in parameters:
                if additional_where != "":
                    additional_where += " and "
                additional_where += f"coalesce({KioskSQLDb.sql_safe_ident('type')}, \'\') <> \'{p}\'"

        uid_field = identifier[self.IDENTIFIER_UID_FIELD]
        sql = "select" + f" upper({KioskSQLDb.sql_safe_ident(field)}) identifier," \
                         f" {KioskSQLDb.sql_safe_ident(uid_field)} uid," \
                         f" {id_index} \"idx_identifier\""
        if additional_select:
            sql += " " + additional_select

        sql += f" from {KioskSQLDb.sql_safe_namespaced_table('', table)} " \
               f"where coalesce({KioskSQLDb.sql_safe_ident(field)}, \'\') <> \'\'"
        if additional_where:
            sql += f" and {additional_where}"
        return sql

    def rebuild_cache(self):
        raise NotImplementedError

    def has_identifier(self, identifier: str) -> bool:
        raise NotImplementedError

    def get_recording_contexts(self, identifier: str) -> list:
        """
        returns the recording contexts (record types) of an identifier as a list of 4-tuples:
        (table, name of identifier()-field, name of replfield_uid()-field, uid of the record containing the identifier)
        :param identifier: an actual identifier
        :return: list of record types as a 4-tuple (see above) or empty list.
        :exception: throws exceptions, e.G. KeyError if the identifier does not exist at all.
        """
        raise NotImplementedError

    def delete_identifier(self, identifier: str, recording_context: str = ""):
        raise NotImplementedError
