import logging

import kioskstdlib
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskqueryvariables import KioskQueryVariables
from uic.uicfinder import UICFinder
from uic.uictree import UICTree


class KioskQueryUI:
    def __init__(self, variables: KioskQueryVariables, uic_tree: UICTree):
        self._uic_tree = uic_tree
        self._variables = variables

    def _render_input_request(self, uic_literals: list[str]):
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

    def render_input_request(self, uic_literals: list[str] = None) -> dict:
        raise NotImplementedError

    def process_input(self, input_data):
        raise NotImplementedError
