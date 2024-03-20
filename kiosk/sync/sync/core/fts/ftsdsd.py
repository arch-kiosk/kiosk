from dsd.dsd3 import DataSetDefinition
from fts.ftstableindexer import FTSTableIndexer


class FTSDSD:
    def __init__(self, dsd: DataSetDefinition):
        """
        :param dsd: The underlying data set definition to clone
        """
        assert dsd.assert_raw(["config"])
        self._dsd = dsd.clone()
        indexer = FTSTableIndexer()
        for t in self._dsd.list_tables():
            if indexer.table_has_fts(t):
                self._dsd.append_field(t, "fts", ["datatype(VARCHAR)"])

    @property
    def dsd(self) -> DataSetDefinition:
        return self._dsd
