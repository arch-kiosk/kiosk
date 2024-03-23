import logging
from functools import reduce

from kiosksqldb import KioskSQLDb
from dsd.dsd3 import DataSetDefinition
from fts.ftstableindexer import FTSTableIndexer
from fts.ftsview import FTSView
from sync_config import SyncConfig


class FTSHit:
    id: str
    identifier: str
    identifier_uuid: str
    identifier_record_type: str
    record_type: str
    excerpt: str
    rank: float


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

    @staticmethod
    def ready():
        return FTSView.exists()

    def _get_excerpts(self, hits: list[FTSHit], search_prompt: str):
        """
        gets the excerpts for a list of hits. Changes the list in place.
        :param hits: a list of FTSHit objects
        :return: This works in place: It changes hits. No return.
        """
        record_types = {x.record_type for x in hits}
        for record_type in record_types:
            rt_hits = [x for x in hits if x.record_type == record_type]
            self._get_excerpts_for_record_type(record_type, rt_hits, search_prompt)

    def _get_excerpts_for_record_type(self, record_type, rt_hits: list, search_prompt: str):
        """
        gets the excerpts for a list of hits of a certain record type.
        Changes the list in place.
        :param record_type: the record type all of the rt_hits belong to
        :param rt_hits: a list of FTSHit objects
        :return: This works in place: It changes rt_hits. No return.
        """

        indexer = FTSTableIndexer(self.dsd)
        rt_hits.sort(key=lambda x: x.id)
        doc_col_sql = indexer.get_sql_document_column_from_table(record_type)
        if not doc_col_sql:
            return

        sql_uid_list = ",".join(["%s" for _ in rt_hits])
        params = [x.id for x in rt_hits]
        sql = "select " + (f"uid, ts_headline({doc_col_sql}, websearch_to_tsquery('english', '{search_prompt}'), "
                           f"'MaxFragments=3,StartSel=<span>,StopSel=</span>') doc "
                           f"from {KioskSQLDb.sql_safe_ident(record_type)} "
                           f"where uid in ({sql_uid_list}) order by uid")
        try:
            cur = KioskSQLDb.execute_return_cursor(sql, params)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._get_excerpts_for_record_type: {repr(e)}")
            print(cur.query)
            return

        c = -1
        while True:
            r = cur.fetchone()
            if not r:
                break
            c += 1
            if r["uid"] != rt_hits[c].id:
                try:
                    c = rt_hits.index(r["uid"])
                except ValueError as e:
                    logging.error(f"{self.__class__.__name__}._get_excerpts_for_record_type: {repr(e)}")
                    continue
            rt_hits[c].excerpt = r["doc"]

    def search(self, search_prompt: str, limit: int = 100, with_excerpts=False) -> list[FTSHit]:
        """
        searches the full text search system and yields hits.
        :param search_prompt: a search prompt that complies with postgres's websearch_to_query syntax
        :param limit: the maximum number of hits to return. Default is 100.
        :param with_excerpts: True to allow the rather costly excerpt generation.
        :return: yields the hits as FTSHit objects
        """

        sql = "SELECT " + ("record_type, "
                           "primary_identifier identifier, "
                           "primary_identifier_uuid identifier_uuid,"
                           "primary_record_type identifier_record_type,"
                           "data_uuid, "
                           "ts_rank_cd(data, websearch_to_tsquery('english', %s)) rank "
                           "FROM kiosk_fts_view "
                           "where data @@ websearch_to_tsquery('english', %s) "
                           "order by rank desc, record_type asc, primary_identifier asc limit %s;")
        cur = KioskSQLDb.execute_return_cursor(sql, [search_prompt, search_prompt, limit])
        print(cur.query)
        hits = []
        try:
            while True:
                r = cur.fetchone()
                if not r:
                    break
                hit = FTSHit()
                hit.id = r["data_uuid"]
                hit.identifier = r["identifier"]
                hit.identifier_uuid = r["identifier_uuid"]
                hit.rank = r["rank"]
                hit.record_type = r["record_type"]
                hit.identifier_record_type = r["identifier_record_type"]
                hit.excerpt = ""
                hits.append(hit)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.search: {repr(e)}")
        finally:
            cur.close()
        if with_excerpts:
            self._get_excerpts(hits, search_prompt)
        return hits
