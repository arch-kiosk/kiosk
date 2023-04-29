from kiosksqldb import KioskSQLDb
from orm.table import Table
from uuid import uuid4, UUID
import json


class KioskQueryStoreModel(Table):

    _table_name = "kiosk_queries"

    _fields = [("id",),
               ("name",),
               ("description",),
               ("query_type",),
               ("privilege_read",),
               ("privilege_write",),
               ("query",),
               ("created", ",".join([Table.ATTRIBUTE_DONT_UPDATE])),
               ("modified", ),
               ("modified_by", ),
               ("uid", ",".join([Table.ATTRIBUTE_KEY, Table.ATTRIBUTE_DONT_UPDATE, Table.ATTRIBUTE_DONT_INSERT])),
               ]

    def __init__(self, **kwargs):
        self.uid = ""
        self.created = None
        self.modified = None
        self.modified_by = ""
        self.description = ""
        self.name = ""
        self.id = ""
        self.query_type = ""
        self.privilege_read = ""
        self.privilege_write = ""
        self.query = None
        super().__init__(**kwargs)

    @property
    def uid(self):
        return getattr(self, "_uid")

    @uid.setter
    def uid(self, value):
        setattr(self, "_uid", str(value))







