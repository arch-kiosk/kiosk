from kioskquery.kioskqueryvariables import KioskQueryVariables


class KioskQueryUI:
    def __init__(self, variables: KioskQueryVariables):
        self._variables = variables

    def render_input_request(self) -> dict:
        raise NotImplementedError

    def process_input(self, input_data):
        raise NotImplementedError
