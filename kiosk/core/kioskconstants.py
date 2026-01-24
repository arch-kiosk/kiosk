from marshmallow import Schema, fields
import kioskglobals
import kioskstdlib
from kioskglossary import KioskGlossary
from kiosksqldb import KioskSQLDb


class ApiResultConstant(Schema):
    class Meta:
        fields = ("path", "key", "value")

    path = fields.Str()
    key = fields.Str()
    value = fields.Raw()


class KioskProjectConstants:
    def get_all_constants(self):
        cfg = kioskglobals.get_config()
        constants = []
        self.add_recording_context_aliases(cfg, constants)
        self.add_labels(constants)
        self.add_collected_material_type_names(constants)
        self.add_glossary(constants)
        self.add_extras(constants)

        return constants

    def add_recording_context_aliases(self, config, constants=None):
        if constants is None:
            constants = list()
        for key in config["file_repository"]["recording_context_aliases"].keys():
            constant = ApiResultConstant()
            constant.path = "file_repository/recording_context_aliases"
            constant.key = key
            constant.value = config["file_repository"]["recording_context_aliases"][key]
            constants.append(constant)
        return constants

    def add_collected_material_type_names(self, constants=None):
        # todo: this is not structure agnostic. While we accept that the constants table is an integral part of Kiosk,
        #  collected_material_types for sure is not. For now I just check if the table exists.
        #  But a more general solution here would be to have a hook in order for projects to add
        #  project-specific data to the constants.

        if constants is None:
            constants = list()
        if KioskSQLDb.does_table_exist("collected_material_types"):
            cur = KioskSQLDb.execute_return_cursor("select id, \"name\" from collected_material_types")
            r = cur.fetchone()
            while r:
                constant = ApiResultConstant()
                constant.path = "constants/collected_material_types"
                constant.key = r["id"]
                constant.value = kioskstdlib.null_val(r["name"], "")
                constants.append(constant)
                r = cur.fetchone()

        return constants

    def add_labels(self, constants=None):
        if constants is None:
            constants = list()
        cur = KioskSQLDb.execute_return_cursor("select id, value from constants where category=%s", ["labels"])
        r = cur.fetchone()
        while r:
            constant = ApiResultConstant()
            constant.path = "constants/labels"
            constant.key = r["id"]
            constant.value = kioskstdlib.null_val(r["value"], "")
            constants.append(constant)
            r = cur.fetchone()

        return constants

    def add_extras(self, constants=None):
        if constants is None:
            constants = list()
        cur = KioskSQLDb.execute_return_cursor("select id, value from constants where id in (%s)", ["use_lots"])
        r = cur.fetchone()
        while r:
            constant = ApiResultConstant()
            constant.path = "constants/settings"
            constant.key = r["id"]
            constant.value = kioskstdlib.null_val(r["value"], "")
            constants.append(constant)
            r = cur.fetchone()

        return constants

    def add_glossary(self, constants=None):
        if constants is None:
            constants = list()
        glossary = KioskGlossary(kioskglobals.get_config()).get_all()

        for key, value in glossary:
            constant = ApiResultConstant()
            constant.path = "glossary"
            constant.key = key
            constant.value = value
            constants.append(constant)

        return constants
