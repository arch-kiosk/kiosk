from copy import deepcopy

from dsd.dsd3 import DataSetDefinition
from kioskquery.fulltextkioskquerydefinition import FullTextKioskQueryDefinition
from kioskquery.fulltextqueryui import FullTextQueryUI
from kioskquery.kioskquery import KioskQuery
from kioskquery.kioskquerydefinition import KioskQueryDefinition
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskqueryresult import KioskQueryResult
from kioskquery.kioskqueryui import KioskQueryUI
from kioskquery.kioskqueryvariables import KioskQueryVariables
from uic.uictree import UICTree


class FullTextKioskQuery(KioskQuery):
    def __init__(self, query_definition: dict, dsd: DataSetDefinition):
        super().__init__(query_definition, dsd)
        self._definition = FullTextKioskQueryDefinition(query_definition)
        self._variables = self._definition.variables

    @property
    def query_definition(self) -> KioskQueryDefinition:
        return self._definition

    def get_query_ui(self, uic_tree: UICTree) -> KioskQueryUI:
        return FullTextQueryUI(self._variables, uic_tree)

    def execute(self, *args, **kwargs) -> KioskQueryResult:
        pass
