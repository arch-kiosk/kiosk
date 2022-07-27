import logging

from kiosksqldb import KioskSQLDb
from orm.table import Table
from uuid import uuid4, UUID
import json


class QCFlagModel(Table):

    _table_name = "qc_flags"

    # todo: should be taken from the dsd information
    _fields = [("uid", ",".join([Table.ATTRIBUTE_KEY, Table.ATTRIBUTE_DONT_UPDATE])),
               ("created", ",".join([Table.ATTRIBUTE_DONT_UPDATE])),
               ("modified", ),
               ("modified_by", ),
               ("id",),
               ("severity",),
               ("message",),
               ("params",),
               ("fields_involved",),
               ]

    def __init__(self, **kwargs):
        self.uid = ""
        self.created = None
        self.modified = None
        self.modified_by = ""
        self.id = ""
        self.severity = ""
        self.message = ""
        self.params = ""
        self.fields_involved = ""
        super().__init__(**kwargs)

    @property
    def uid(self):
        return getattr(self, "_uid")

    @uid.setter
    def uid(self, value):
        setattr(self, "_uid", str(value))

