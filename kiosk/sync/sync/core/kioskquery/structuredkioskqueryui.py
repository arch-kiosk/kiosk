from kioskquery.kioskquerylib import *
from kioskquery.kioskqueryui import KioskQueryUI
from kioskquery.kioskqueryvariables import KioskQueryVariables


class StructuredKioskQueryUI(KioskQueryUI):

    def render_input_request(self) -> dict:
        """
        returns a dictionary with instruction on the input that is requested by a query.
        :returns: {}
        """
        return self._variables.get_variable_definitions()

    def process_input(self, input_data: dict):
        """
        expects a dict with variables and values
        :param input_data: dict {"variable name": value}
        """
        for key, value in input_data.items():
            self._variables.set_variable(key, value)
