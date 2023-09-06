import copy
import logging
import os

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from dsd.dsdyamlloader import DSDYamlLoader
from kioskglossary import KioskGlossary
from presentationlayer.pldloader import PLDLoader
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
        self._cfg = cfg
        self._pld = None
        self._pld_loader_class = pld_loader_class
        self._master_dsd: DataSetDefinition = Dsd3Singleton.get_dsd3()
        self._uic_tree = uic_tree
        self._glossary = KioskGlossary(cfg)

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
            self.uic_literals.append("view_type:" + view_type)
            view_part_class = self._get_view_part_class(view_type)
            try:
                view_part = view_part_class(part, dsd, self._uic_tree, self.uic_literals, self, self._glossary)
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

    def get_compilation(self):
        compilations = self._pld.get_compilations_by_record_type(self.record_type)
        if len(compilations) != 1:
            raise KeyError(f"{self.__class__.__name__}.render: "
                           f"No or more than one compilation for record type {self.record_type}")
        return compilations[0]

    def _get_view_part_class(self, view_type):
        if view_type == "sheet":
            return ViewPartSheet
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
