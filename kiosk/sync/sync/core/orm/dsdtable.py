from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb
from orm.table import Table


class DSDTable(Table):

    def __init__(self, dsd: DataSetDefinition, table_name, **kwargs):
        self._dsd_table_name = table_name
        self._dsd = dsd
        super().__init__(**kwargs)

    def _get_table_name(self):
        return self._dsd_table_name

    def _get_fields(self):
        orm_fields = []
        key_field = ""
        select_fields = self._dsd.get_fields_with_instruction(self._table_name, "replfield_uuid")
        if select_fields:
            key_field = select_fields[0]
        else:
            select_fields = self._dsd.get_fields_with_instructions(self._table_name, ["primary", "uuid_key"])
            if select_fields:
                key_field = select_fields.values()[0][0]

        for field_name in self._dsd.list_fields(self._table_name):
            orm_flags = []
            if field_name.upper() == key_field.upper():
                orm_flags.append(self.ATTRIBUTE_KEY)
            instructions = self._dsd.get_field_instructions(self._table_name, field_name)
            if "replfield_uuid" in instructions or "replfield_created" in instructions:
                orm_flags.append(self.ATTRIBUTE_DONT_UPDATE)

            orm_fields.append((field_name, ",".join(orm_flags)))
            setattr(self, field_name, None)
        self._fields = orm_fields
        return self._fields

    def _get_new_instance(self, **kwargs):
        return self.__class__(self._dsd, self._dsd_table_name, **kwargs)


