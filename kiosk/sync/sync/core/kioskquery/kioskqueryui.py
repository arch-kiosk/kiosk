from kioskquery.kioskqueryvariables import KioskQueryVariables
from uic.uictree import UICTree


class KioskQueryUI:
    def __init__(self, variables: KioskQueryVariables, uic_tree: UICTree):
        self._uic_tree = uic_tree
        self._variables = variables

    def render_input_request(self, uic_literals: list[str] = None) -> dict:
        raise NotImplementedError

    def process_input(self, input_data):
        raise NotImplementedError
