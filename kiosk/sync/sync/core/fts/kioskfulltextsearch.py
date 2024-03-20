import logging

from dsd.dsd3 import DataSetDefinition
from fts.ftstableindexer import FTSTableIndexer
from fts.ftsview import FTSView
from sync_config import SyncConfig


class FTS:
    def __init__(self, dsd: DataSetDefinition, cfg: SyncConfig):
        self.dsd = dsd
        self.cfg = cfg

    def rebuild_fts(self, console_output=False):
        """
        rebuilds the full text search system. This is necessary whenever the underlying data structure changes.

        :param console_output: if True, print progress to the console
        :return: bool
        :raises no Exceptions. All exceptions are caught and logged.
        """

        try:
            self._to_console(console_output, f"Refreshing full text search system ", end=".")
            indexer = FTSTableIndexer(self.dsd)

            FTSView.drop()
            self._to_console(console_output, f"", end=".")

            indexer.create_or_refresh_fts_column_for_tables(commit=True)
            self._to_console(console_output, f"", end=".")

            FTSView.create_or_replace_fts_view(self.dsd)
            self._to_console(console_output, f"", end="\n")

            FTSView.refresh()
            self._to_console(console_output, f"Ok", end="\n")
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.rebuild_fts: {repr(e)}")
            return False

    @staticmethod
    def _to_console(console_output: bool, str_print, end=""):
        if console_output:
            print(str_print, end=end)
