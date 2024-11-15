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

    def __init__(self, **kwargs):
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
        super().__init__(**kwargs)

    @property
    def uid(self):
        return getattr(self, "_uid")

    @uid.setter
    def uid(self, value):
        setattr(self, "_uid", str(value))







