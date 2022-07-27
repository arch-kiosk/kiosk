import logging

from kiosksqldb import KioskSQLDb
from orm.table import Table
from uuid import uuid4, UUID
import json


class QCMessageCacheModel(Table):

    _table_name = "qc_message_cache"

    # todo: should be taken from the dsd information
    _fields = [("flag_id_data_context",),
               ("flag_id",),
               ("data_context",),
               ("severity",),
               ("message",),
               ("fields_involved",),
               ]

    def __init__(self, **kwargs):
        self.flag_id_data_context = ""
        self.flag_id = ""
        self.data_context = ""
        self.severity = ""
        self.message = ""
        self.fields_involved = ""
        super().__init__(**kwargs)

    @property
    def uid(self):
        return getattr(self, "_uid")

    @uid.setter
    def uid(self, value):
        setattr(self, "_uid", str(value))

