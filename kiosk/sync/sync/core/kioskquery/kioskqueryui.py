import logging

import kioskstdlib
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskqueryvariables import KioskQueryVariables
from uic.uicfinder import UICFinder
from uic.uictree import UICTree
from simplefunctionparser import SimpleFunctionParser
from kioskglossary import KioskGlossary
from sync_config import SyncConfig
from dsd.dsd3singleton import Dsd3Singleton


class KioskQueryUI:
    def __init__(self, variables: KioskQueryVariables, uic_tree: UICTree):
        self._uic_tree = uic_tree
        self._variables = variables
        self._glossary = KioskGlossary(SyncConfig.get_config())

    @staticmethod
    def get_record_type_from_dsd(dsd_instruction: str):
        parser = SimpleFunctionParser()
        parser.parse(dsd_instruction)
        # noinspection PyBroadException
        try:
            return parser.parameters[0]
        except BaseException:
            return ""

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

    def _render_input_request(self, uic_literals: list[str]):
        """
        returns a dictionary with instruction on the input that is requested by a query.
        :returns: {}
        """
        if not self._variables:
            return {}

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

    def render_input_request(self, uic_literals: list[str] = None) -> dict:
        raise NotImplementedError

    def process_input(self, input_data):
        raise NotImplementedError

