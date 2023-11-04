import logging

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskglossary import KioskGlossary
from kioskquery.kioskquerylib import *
from kioskquery.kioskqueryui import KioskQueryUI
from kioskquery.kioskqueryvariables import KioskQueryVariables
from simplefunctionparser import SimpleFunctionParser
from sync_config import SyncConfig
from uic.uicfinder import UICFinder
from uic.uicstream import UICStream, UICKioskFile
from uic.uictree import UICTree


class StructuredKioskQueryUI(KioskQueryUI):

    def __init__(self, variables: KioskQueryVariables, uic_tree: UICTree):
        super().__init__(variables, uic_tree)
        self._glossary = KioskGlossary(SyncConfig.get_config())

    def get_label_from_instruction(self, label_instruction):
        parser = SimpleFunctionParser()
        parser.parse(label_instruction)
        try:
            return self._glossary.get_term(parser.parameters[0], 1, auto_plural=False)
        except:
            return None

    def get_label_from_dsd(self, dsd_instruction: str):
        parser = SimpleFunctionParser()
        parser.parse(dsd_instruction)
        # noinspection PyBroadException
        try:
            return Dsd3Singleton.get_dsd3().get_field_label(parser.parameters[0], parser.parameters[1],
                                                            glossary=self._glossary)
        except BaseException:
            return ""

    def get_record_type_from_dsd(self, dsd_instruction: str):
        parser = SimpleFunctionParser()
        parser.parse(dsd_instruction)
        # noinspection PyBroadException
        try:
            return parser.parameters[0]
        except BaseException:
            return ""

    def render_input_request(self, uic_literals: list[str] = None) -> dict:
        """
        returns a dictionary with instruction on the input that is requested by a query.
        :returns: {}
        """
        if not uic_literals:
            uic_literals = []
        if not self._uic_tree:
            logging.error(f"{self.__class__.__name__}.render_input_request: no UIC Tree set. Can't render ui elements.")
            raise KioskQueryException(
                f"{self.__class__.__name__}.render_input_request: no UIC Tree set. Can't render ui elements.")
        variable_definitions = self._variables.get_variable_definitions()
        result = {"ui_elements": {}}
        ui_elements = result["ui_elements"]
        for variable, definition in list(variable_definitions.items()):
            definition: list[str]
            text = ""
            is_dsd_element, dsd_element = kioskstdlib.has_element_that_starts_with("dsd(", definition)
            if is_dsd_element:
                definition.append(self.get_record_type_from_dsd(dsd_element))

            _, element = kioskstdlib.has_element_that_starts_with("label(", definition)
            if element:
                text = self.get_label_from_instruction(element)
            else:
                if is_dsd_element:
                    text = self.get_label_from_dsd(dsd_element)

            if not text:
                text = variable

            ui_elements[variable] = UICFinder(self._uic_tree).get_ui_definition_from_selector(definition + uic_literals)
            if "text" not in ui_elements[variable]["element_type"]:
                ui_elements[variable]["element_type"]["text"] = text
            ui_elements[variable]["binding"] = {"field_name": variable}
            result["dsd"] = variable_definitions
        return result

    def process_input(self, input_data: dict):
        """
        expects a dict with variables and values
        :param input_data: dict {"variable name": value}
        """
        for key, value in input_data.items():
            self._variables.set_variable(key, value)
