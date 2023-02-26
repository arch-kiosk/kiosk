import logging

from kioskquery.kioskquerylib import *
from kioskquery.kioskqueryui import KioskQueryUI
from kioskquery.kioskqueryvariables import KioskQueryVariables
from uic.uicfinder import UICFinder
from uic.uicstream import UICStream, UICKioskFile


class StructuredKioskQueryUI(KioskQueryUI):

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
            ui_elements[variable] = UICFinder(self._uic_tree).get_ui_definition_from_selector(definition + uic_literals)
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
