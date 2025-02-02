import logging

import kioskstdlib
from kioskquery.kioskquerylib import *
from kioskquery.kioskqueryui import KioskQueryUI
from kioskquery.kioskqueryvariables import KioskQueryVariables
from simplefunctionparser import SimpleFunctionParser
from uic.uicfinder import UICFinder
from uic.uicstream import UICStream, UICKioskFile
from uic.uictree import UICTree


class StructuredKioskQueryUI(KioskQueryUI):

    def __init__(self, variables: KioskQueryVariables, uic_tree: UICTree):
        super().__init__(variables, uic_tree)

    def render_input_request(self, uic_literals: list[str] = None) -> dict:
        """
        returns a dictionary with instruction on the input that is requested by a query.
        :returns: {}
        """
        return self._render_input_request(uic_literals)

    def process_input(self, input_data: dict):
        """
        expects a dict with variables and values
        :param input_data: dict {"variable name": value}
        """
        for key, value in input_data.items():
            self._variables.set_variable(key, value)
