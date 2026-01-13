class KioskDSLException (Exception):
    pass

class KioskDSL:
    def __init__(self):
        pass

    @property
    def on_get(self):
        raise NotImplementedError

    @on_get.setter
    def on_get(self, value):
        raise NotImplementedError

    def eval(self, expression: str):
        raise NotImplementedError

    def run(self, script: str):
        raise NotImplementedError
