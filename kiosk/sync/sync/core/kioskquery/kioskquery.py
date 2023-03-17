from dsd.dsd3 import DataSetDefinition
from uic.uictree import UICTree
from .kioskquerydefinition import KioskQueryDefinition
from .kioskqueryresult import KioskQueryResult
from .kioskqueryui import KioskQueryUI


class KioskQuery:
    _id: str
    _name: str
    _description: str

    def __init__(self, query_definition: dict, dsd: DataSetDefinition):
        self._dsd = dsd

    @property
    def query_definition(self) -> KioskQueryDefinition:
        raise NotImplementedError

    def get_query_ui(self, uic_tree: UICTree) -> KioskQueryUI:
        raise NotImplementedError

    def execute(self, *args, **kwargs) -> KioskQueryResult:
        raise NotImplementedError
