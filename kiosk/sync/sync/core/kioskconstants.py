from typing import List, Callable, Iterable, Dict, Union, Optional, TypeAlias, Any, Protocol

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


# ApiAddMethod: TypeAlias = Callable[[List[str], str, str, Optional[Any], Optional[str]], Any]

class ApiAddMethod(Protocol):
    def __call__(
            self,
            path: List[str],
            key: str,
            value: str,
            constants: Optional[Any],
            path_separator: str = "/"
    ) -> Any:
        pass


class KioskProjectConstants:
    def __init__(self,
                 add_method: Optional[ApiAddMethod] = None,
                 path_separator="/"):
        self._add_method: ApiAddMethod = add_method if add_method else self.add_method_api
        self._path_separator = path_separator

    @staticmethod
    def add_method_api(path: List[str], key: str, value: str, constants: Optional[List] = None,
                       path_separator: str = "/") -> List:
        constant = ApiResultConstant()
        constant.path = path_separator.join(path)
        constant.key = key
        constant.value = value
        if not constants:
            constants = []
        constants.append(constant)
        return constants

    def add_method_path_dict(path: List[str], key: str, value: str, constants: Optional[Dict] = None,
                             path_separator: str = "/") -> Dict:
        str_path = path_separator.join(path)
        str_path = (str_path + path_separator if str_path else "") + key
        if not constants:
            constants = {}
        constants[str_path] = value
        return constants

    @staticmethod
    def add_method_dict(path: List[str], key: str, value: str, constants: Optional[Dict] = None,
                        path_separator: Optional[str] = "/") -> Dict:
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

    def add_recording_context_aliases(self, config, constants):
        for key in config["file_repository"]["recording_context_aliases"].keys():
            constants = self._add_method(["file_repository", "recording_context_aliases"],
                                         key,
                                         config["file_repository"]["recording_context_aliases"][key],
                                         constants,
                                         self._path_separator)

            # constant = ApiResultConstant()
            # constant.path = "file_repository/recording_context_aliases"
            # constant.key = key
            # constant.value = config["file_repository"]["recording_context_aliases"][key]
            # constants.append(constant)
        return constants

    def add_collected_material_type_names(self, constants):
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

    def add_labels(self, constants):
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

    def add_extras(self, constants: Optional[Union[dict, List]]):
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
        constants = None
        constants = self.add_recording_context_aliases(cfg, constants)
        constants = self.add_labels(constants)
        constants = self.add_collected_material_type_names(constants)
        constants = self.add_glossary(cfg, constants=constants)
        constants = self.add_extras(constants)

        return constants
