from kiosksqldb import KioskSQLDb
from orm.table import Table
from uuid import uuid4, UUID
import json


class KioskFileCacheModel(Table):

    _table_name = "kiosk_file_cache"

    _fields = [("uid", ",".join([Table.ATTRIBUTE_KEY, Table.ATTRIBUTE_DONT_INSERT, Table.ATTRIBUTE_DONT_UPDATE])),
               ("uid_file",),
               ("representation_type",),
               ("invalid",),
               ("created", ",".join([Table.ATTRIBUTE_DONT_UPDATE, Table.ATTRIBUTE_DONT_INSERT])),
               ("modified", ",".join([Table.ATTRIBUTE_DONT_INSERT])),
               ("image_attributes",),
               ("path_and_filename",)]

    def __init__(self, **kwargs):
        if "test" in kwargs:
            self.uid = ""
            self.uid_file = None
            self.representation_type = ""
            self.invalid = False
            self.created = None
            self.modified = None
        else:
            self.uid = ""
            self.uid_file = None
            self.representation_type = ""
            self.image_attributes = {}
            self.invalid = False
            self.created = None
            self.modified = None
            self.path_and_filename = ""
        super().__init__(**kwargs)

    @property
    def uid(self):
        return getattr(self, "_uid")

    @uid.setter
    def uid(self, value):
        setattr(self, "_uid", str(value))

    @property
    def uid_file(self):
        return getattr(self, "_uid_file")

    @uid_file.setter
    def uid_file(self, value):
        if isinstance(value, UUID):
            setattr(self, "_uid_file", str(value))
        else:
            setattr(self, "_uid_file", value)







