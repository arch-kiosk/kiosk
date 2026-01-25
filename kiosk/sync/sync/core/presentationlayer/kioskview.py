import copy
import logging
import os
from typing import List

import kioskstdlib
from dicttools import dict_merge
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from dsd.dsdyamlloader import DSDYamlLoader
from dsl.kioskdsllupa import KioskDSLLua, LazyResolverContinue, LazyResolverStop, KioskDSLLuaResolver
from kioskconstants import KioskProjectConstants
from kioskglossary import KioskGlossary
from presentationlayer.pldloader import PLDLoader
from presentationlayer.viewpartlist import ViewPartList
from sync_config import SyncConfig
from uic.uictree import UICTree
from presentationlayer.viewpart import ViewPart
from presentationlayer.viewpartsheet import ViewPartSheet


class KioskView:
    def __init__(self, cfg: SyncConfig, pld_name: str, uic_tree: UICTree, pld_loader_class=PLDLoader):
        self._parts = []
        self.pld_name = pld_name
        self.uic_literals = []
        self.record_type = ""
        self.identifier_field = ""
        self.identifier = ""
        self.identifier_record = {}
        self._cfg = cfg
        self._pld = None
        self._pld_loader_class = pld_loader_class
        self._master_dsd: DataSetDefinition = Dsd3Singleton.get_dsd3()
        self._uic_tree = uic_tree
        self._glossary = KioskGlossary(cfg)
        self.dsl = KioskDSLLua()
        self.dsl.on_get = self.DSLResolver()
        self.dsl.on_get.append("__kiosk", {"config": cfg.config_dict})
        self.dsl.on_get.append("__kiosk", KioskProjectConstants(
            add_method=KioskProjectConstants.add_method_dict).get_all_constants(cfg))

    class DSLResolver(KioskDSLLuaResolver):
        def __init__(self):
            self.data = {}

        def append(self, key, data):
            if key in self.data:
                dict_merge(self.data[key], data)
            else:
                self.data[key] = data

        def resolve_kiosk_path(self, path_elements):
            print(f"resolving {path_elements}")
            if len(path_elements) > 2:
                kiosk_path = path_elements[1:]
                section = kiosk_path[0]
                if section in self.data["__kiosk"]:
                    try:
                        v = kioskstdlib.get_nested_dict_value_by_path(self.data, path_elements)
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.resolve_kiosk_path: "
                                      f"Exception in KioskView when resolving {'.'.join(path_elements)}: {repr(e)}")
                        raise LazyResolverStop
                    if v is None:
                        raise LazyResolverContinue
                    else:
                        return v
                else:
                    logging.error(f"{self.__class__.__name__}.resolve_kiosk_path: "
                                  f"Unknown section in KioskView when resolving {'.'.join(path_elements)}")
                    raise LazyResolverStop
            else:
                raise LazyResolverContinue

        def resolve(self, path_elements: List):
            if path_elements:
                if path_elements[0] in self.data.keys():
                    if path_elements[0] == "__kiosk":
                        return self.resolve_kiosk_path(path_elements)
                    if type(self.data[path_elements[0]]) == dict:
                        if len(path_elements) == 2:
                            if path_elements[1] in self.data[path_elements[0]]:
                                return self.data[path_elements[0]][path_elements[1]]
                        else:
                            raise LazyResolverContinue
                    else:
                        return self.data[path_elements[0]]
            raise LazyResolverStop

    def _validate(self):
        if not self.pld_name:
            raise ValueError(f"{self.__class__.__name__}._validate: No pld name given")

        if not self.record_type:
            raise ValueError(f"{self.__class__.__name__}._validate: No record type given for pld {self.pld_name}")

        if not self.identifier_field:
            raise ValueError(f"{self.__class__.__name__}._validate: No identifier_field given for pld {self.pld_name}")

        if not self.identifier:
            raise ValueError(f"{self.__class__.__name__}._validate: No identifier given for pld {self.pld_name}")

        if not self._uic_tree:
            raise ValueError(f"{self.__class__.__name__}._validate: No uic tree given")

        if not self._master_dsd or not "config" in self._master_dsd._dsd_data.get([]):
            raise ValueError(f"{self.__class__.__name__}._validate: No master dsd given or master dsd not up to snuff")

    def _render_part(self, part_id: str):
        try:
            part = self._pld.get_part(part_id)
            view_type = part["view_type"]
            dsd = None
            try:
                if "dsd_view" in part:
                    dsd = self._get_dsd_view(part["dsd_view"])
                else:
                    dsd = self._get_dsd_view()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._render_part: {repr(e)}")
                raise Exception(f"{self.__class__.__name__}._render_part: Cannot load dsd_view")

            if not dsd:
                raise Exception(f"{self.__class__.__name__}._render_part: Loading dsd failed")

            dsd.register_glossary(self._glossary)
            uic_literals = [*self.uic_literals, "view_type:" + view_type]
            view_part_class = self._get_view_part_class(view_type)
            try:
                view_part = view_part_class(part, dsd, self._uic_tree, uic_literals, self, self._glossary)
                return view_part.render()
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}._render_part: Exception {repr(e)} "
                              f"creating view_part from class '{view_part_class.__name__} for part {part_id}'")
                raise e
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._render_part: {repr(e)}")
            raise e

    def render(self):
        try:
            self._validate()
            self._pld = self._pld_loader_class.load_pld(self.pld_name, self._cfg)
            self.uic_literals.append("view-ui")
            compilation = self.get_compilation()
            result = {}
            result["compilation"] = copy.deepcopy(compilation)
            self._parts = self._pld.get_parts(compilation)
            for part in self._parts:
                result[part] = self._render_part(part)

            return result
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.render: {repr(e)}")
            raise e

    def get_parts(self):
        return self._parts

    def get_part_definition(self, part_id: str):
        return self._pld.get_part(part_id)

    def get_compilation(self):
        default_view = ""
        compilations = self._pld.get_compilations_by_record_type(self.record_type)
        if self.identifier_record:
            self.dsl.on_get.append(self.record_type, dict(self.identifier_record))
        # if len(compilations) == 1:
        #     return compilations[0]
        if len(compilations) == 0:
            raise KeyError(f"{self.__class__.__name__}.render: "
                           f"No compilation for record type {self.record_type}")
        else:
            for c in compilations:
                condition = ""
                if "use_this_only_if" in c:
                    condition = c["use_this_only_if"]
                else:
                    # this is just for compatibility with the pre-LUA era
                    if self.record_type == "unit":
                        condition = f'unit.type == "{kioskstdlib.try_get_dict_entry(c, "unit_type", "excavation")}"'

                if condition:
                    result = self.dsl.eval(condition)
                    logging.debug(f"{self.__class__.__name__}.get_compilation: "
                                  f"condition '{condition}' evaluated to {result}")
                    if result:
                        return c
                else:
                    default_view = c
                # else:
                #     logging.warning(f"{self.__class__.__name__}.get_compilation: compilation "
                #                     f"{kioskstdlib.try_get_dict_entry(c, 'name', '?')} "
                #                     f"for record type {self.record_type} will never be selected "
                #                     f"because it has no condition")
            if default_view:
                return default_view
            raise Exception(f"None of the view compilations for record_type {self.record_type} "
                            f"feels responsible for this record.")

    def _get_view_part_class(self, view_type):
        if view_type == "sheet":
            return ViewPartSheet
        elif view_type == "list":
            return ViewPartList
        else:
            raise ValueError(f"{self.__class__.__name__}._get_view_part_class: View type {view_type} unknown.")

    def _get_dsd_view(self, dsd_view="") -> DataSetDefinition:
        if not dsd_view:
            return self._master_dsd

        if not dsd_view.strip().lower().endswith(".yml"):
            dsd_view = dsd_view + ".yml"
        dsd_view_file = os.path.join(self._cfg.get_dsd_path(), dsd_view)
        if not os.path.isfile(dsd_view_file):
            raise FileNotFoundError(f"{self.__class__.__name__}._get_dsd_view: "
                                    f"dsd view file {dsd_view_file} not found.")

        dsd_view = DSDView(self._master_dsd)
        if dsd_view.apply_view_instructions(DSDYamlLoader().read_view_file(dsd_view_file)):
            return dsd_view.dsd
        else:
            raise Exception(f"{self.__class__.__name__}._get_dsd_view: "
                            f"dsd view file {dsd_view_file} could not be applied to master dsd.")
