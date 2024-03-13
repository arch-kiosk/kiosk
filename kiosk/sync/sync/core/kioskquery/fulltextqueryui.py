import logging

from kioskglossary import KioskGlossary
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskqueryui import KioskQueryUI
from kioskquery.kioskqueryvariables import KioskQueryVariables
from sync_config import SyncConfig
from uic.uictree import UICTree


class FullTextQueryUI(KioskQueryUI):
    def render_input_request(self, uic_literals: list[str] = None) -> dict:
        return self._render_input_request(uic_literals)

    def process_input(self, input_data):
        pass

    def __init__(self, variables: KioskQueryVariables, uic_tree: UICTree):
        super().__init__(variables, uic_tree)
        self._glossary = KioskGlossary(SyncConfig.get_config())
