import logging

from kiosksqldb import KioskSQLDb
from orm.table import Table
from uuid import uuid4, UUID
import json


class QCRuleModel(Table):

    _table_name = "qc_rules"

    # todo: should be taken from the dsd information
    _fields = [("uid", ",".join([Table.ATTRIBUTE_KEY, Table.ATTRIBUTE_DONT_UPDATE])),
               ("created", ",".join([Table.ATTRIBUTE_DONT_UPDATE])),
               ("modified", ),
               ("modified_by", ),
               ("id",),
               ("type",),
               ("type_param",),
               ("trigger",),
               ("hosts",),
               ("flag",),
               ("enabled",),
               ("inputs",),
               ]

    def __init__(self, **kwargs):
        self.uid = ""
        self.created = None
        self.modified = None
        self.modified_by = ""
        self.id = ""
        self.type = ""
        self.type_param = ""
        self.trigger = ""
        self.hosts = ""
        self.flag = ""
        self.inputs = ""
        self.enabled = False
        self._inputs = {}
        super().__init__(**kwargs)

    @property
    def uid(self):
        return getattr(self, "_uid")

    @uid.setter
    def uid(self, value):
        setattr(self, "_uid", str(value))

    @property
    def input_dict(self):
        if not self._inputs:
            try:
                self._inputs = json.loads("{ \"inputs\": [" + self.inputs + "]}")["inputs"]
                for c in range(0, len(self._inputs)):
                    input = self._inputs[c]
                    input["type"] = input["type"].lower()
                    input["record_type"] = input["record_type"].lower()
                    if "field" in input:
                        input["field"] = input["field"].lower()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.input_dict: {repr(e)}")
        return self._inputs






