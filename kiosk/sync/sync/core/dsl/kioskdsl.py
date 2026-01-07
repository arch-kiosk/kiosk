class KioskDSLException (Exception):
    pass

class KioskDSL:
    def __init__(self):
        pass

    def eval(self, expression: str):
        raise NotImplementedError

    def run(self, script: str):
        raise NotImplementedError
