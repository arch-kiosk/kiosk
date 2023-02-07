from dsd.dsd3 import DataSetDefinition
from .kioskqueryresult import KioskQueryResult
from .kioskqueryui import KioskQueryUI


class KioskQuery:
    _id: str
    _name: str
    _description: str

    def __init__(self, query_definition: dict, dsd: DataSetDefinition):
        raise NotImplementedError

    @property
    def query_definition(self):
        raise NotImplementedError

    def get_query_ui(self) -> KioskQueryUI:
        raise NotImplementedError

    def execute(self, *args, **kwargs) -> KioskQueryResult:
        raise NotImplementedError
