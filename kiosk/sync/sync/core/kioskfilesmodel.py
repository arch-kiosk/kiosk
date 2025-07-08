from kiosksqldb import KioskSQLDb
from orm.table import Table
from uuid import uuid4, UUID
import json


class KioskFilesModel(Table):

    _table_name = "images"

    _fields = [("uid", ",".join([Table.ATTRIBUTE_KEY, Table.ATTRIBUTE_DONT_UPDATE])),
               ("created", ",".join([Table.ATTRIBUTE_DONT_UPDATE])),
               ("modified", ),
               ("modified_tz", ),
               ("modified_ww", ),
               ("modified_by", ),
               ("description",),
               ("export_filename",),
               ("img_proxy",),
               ("md5_hash",),
               ("ref_uid",),
               ("file_datetime",),
               ("tags",),
               ("image_attributes",),
               ("filename",),
               ]

    # noinspection PyMissingConstructor
    def __init__(self, table_name=None, **kwargs):
        # todo needs refactoring
        # A hack: This is usually done by the Table constructor. But in this particular
        # sub-class I need the chance to set a different table name. So I skip the constructor. Bad.
        # Just because of the table_name being set on the instance the whole mini ORM needs a thorough refactoring.

        self._r = {}
        self._fields = []
        self._table_name = ""
        self._sql_insert_values = ""
        self._sql_insert_columns = ""
        self._sql_update = ""
        self._sql_select_columns = ""
        self._key_fields_names = []
        self._key_fields_columns_str = ""

        self.uid = ""
        self.created = None
        self.modified = None
        # time zone relevance
        self.modified_tz = None
        self.modified_ww = None
        self.modified_by = ""
        self.description = ""
        self.export_filename = ""
        self.img_proxy = None
        self.md5_hash = ""
        self.ref_uid = None
        self.file_datetime = None
        self.tags = ""
        self.image_attributes = {}
        self.filename = ""
        self._table_name = table_name if table_name else "images"
        self._init_instance(**kwargs)

    @property
    def uid(self):
        return getattr(self, "_uid")

    @uid.setter
    def uid(self, value):
        setattr(self, "_uid", str(value))

    def remove_outer_quotes(self, table_name: str):
        """
        terrible hack: If tablename has a schema name, it must come as "schemanme"."tablename". By removing the outer quotes
        it can be handled like an unquoted table. Hopefully. Horrible idea.
        :param table_name:
        :return:
        """
        if table_name.startswith("\""):
            table_name = table_name[1:]
        if table_name.endswith("\""):
            table_name = table_name[:-1]
        return table_name






