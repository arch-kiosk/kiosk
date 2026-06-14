from typing import List, Callable, Iterable, Dict, Union

from marshmallow import Schema, fields
import kioskstdlib
from dicttools import dict_merge
from kioskglossary import KioskGlossary
from kiosksqldb import KioskSQLDb


class ApiResultConstant(Schema):
    class Meta:
        fields = ("path", "key", "value")

    path = fields.Str()
    key = fields.Str()
    value = fields.Raw()


class KioskProjectConstants:
    def __init__(self, add_method: Callable[[List[str], str, str, Union[List, Dict]], Union[List, Dict]] = None):
        self. _add_method = add_method if add_method else self.add_method_api

    @staticmethod
    def add_method_api(path: List[str], key: str, value: str, constants: List) -> List:
        constant = ApiResultConstant()
        constant.path = "/".join(path)
        constant.key = key
        constant.value = value
        if not constants:
            constants = []
        constants.append(constant)
        return constants

    @staticmethod
    def add_method_dict(path: List[str], key: str, value: str, constants: Dict) -> Dict:
        if not constants:
            constants = {}

        current_branch = constants
        for p in path:
            if p not in current_branch:
                current_branch[p] = {}
            current_branch = current_branch[p]

        dict_merge(current_branch, {key: value})
        return constants

    def add_glossary(self, cfg, constants=None):
        glossary = KioskGlossary(cfg).get_all()
        for key, value in glossary:
            constants = self._add_method(["glossary"], key, value, constants)

        return constants

    def add_recording_context_aliases(self, config, constants=None):
        for key in config["file_repository"]["recording_context_aliases"].keys():
            constants = self._add_method(["file_repository", "recording_context_aliases"],
                                         key,
                                         config["file_repository"]["recording_context_aliases"][key],
                                         constants)

            # constant = ApiResultConstant()
            # constant.path = "file_repository/recording_context_aliases"
            # constant.key = key
            # constant.value = config["file_repository"]["recording_context_aliases"][key]
            # constants.append(constant)
        return constants

    def add_collected_material_type_names(self, constants=None):
        # todo: this is not structure agnostic. While we accept that the constants table is an integral part of Kiosk,
        #  collected_material_types for sure is not. For now I just check if the table exists.
        #  But a more general solution here would be to have a hook in order for projects to add
        #  project-specific data to the constants.

        if KioskSQLDb.does_table_exist("collected_material_types"):
            cur = KioskSQLDb.execute_return_cursor("select id, \"name\" from collected_material_types")
            r = cur.fetchone()
            while r:
                constants = self._add_method(["constants", "collected_material_types"],
                                             r["id"],
                                             kioskstdlib.null_val(r["name"], ""),
                                             constants)
                # constant = ApiResultConstant()
                # constant.path = "constants/collected_material_types"
                # constant.key = r["id"]
                # constant.value = kioskstdlib.null_val(r["name"], "")
                # constants.append(constant)
                r = cur.fetchone()

        return constants

    def add_labels(self, constants=None):
        cur = KioskSQLDb.execute_return_cursor("select id, value from constants where category=%s", ["labels"])
        r = cur.fetchone()
        while r:
            constants = self._add_method(["constants", "labels"],
                                         r["id"],
                                         kioskstdlib.null_val(r["value"], ""),
                                         constants)
            # constant = ApiResultConstant()
            # constant.path = "constants/labels"
            # constant.key = r["id"]
            # constant.value = kioskstdlib.null_val(r["value"], "")
            # constants.append(constant)
            r = cur.fetchone()

        return constants

    def add_extras(self, constants=None):
        cur = KioskSQLDb.execute_return_cursor("select id, value from constants where id in (%s,%s)", ["use_lots",
                                                                                                    "ceramic_module"])
        r = cur.fetchone()

        while r:
            constants = self._add_method(["constants", "settings"],
                                         r["id"],
                                         kioskstdlib.null_val(r["value"], ""),
                                         constants)
            # constant = ApiResultConstant()
            # constant.path = "constants/settings"
            # constant.key = r["id"]
            # constant.value = kioskstdlib.null_val(r["value"], "")
            # constants.append(constant)
            r = cur.fetchone()

        return constants

    def get_all_constants(self, cfg):
        constants = []
        constants = self.add_recording_context_aliases(cfg, constants)
        constants = self.add_labels(constants)
        constants = self.add_collected_material_type_names(constants)
        constants = self.add_glossary(cfg, constants=constants)
        constants = self.add_extras(constants)

        return constants
