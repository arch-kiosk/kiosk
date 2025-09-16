import logging

from contextmanagement.contextindex import ContextIndex
from contextmanagement.sqlsourceinmemory import SqlSourceInMemory
from dsd.dsd3 import DataSetDefinition
from fts.ftsdsd import FTSDSD
from kiosksqldb import KioskSQLDb


class FTSView:
    """
    This class is used to create and manage the kiosk_fts_view materialized view.
    Don't instantiate it. All methods are static.
    """

    @staticmethod
    def create_or_replace_fts_view(master_dsd: DataSetDefinition, commit=True):
        """
        creates or refreshes kiosk_fts_view, which is used for full text search.
        This is necessary whenever the fts structure or any data changes.
        By default, this will commit the current transaction!

        :param master_dsd: the master data set definition.
        :param commit: set to False in order to keep the current transaction from being committed.

        :raises all kinds of exceptions if something goes wrong
        """

        dsd = FTSDSD(master_dsd).dsd  # that dsd only has tables with fts columns
        context = ContextIndex(dsd, include_primary_record_type=True)
        context.add_context_type("full_text_search")
        store = context.select_all(field_or_instruction="fts", sql_source_class=SqlSourceInMemory)
        union_sql = ""
        while True:
            sql = store.get_next_sql()
            if not sql:
                break
            union_sql += ("\n UNION " if union_sql else "") + sql

        FTSView.drop(commit)
        sql += "CREATE " + f"MATERIALIZED VIEW kiosk_fts_view AS select record_type, primary_identifier, " \
                           f"primary_identifier_uuid, primary_record_type, data, data_uuid from ({union_sql}) " \
                           f"as records;"
        KioskSQLDb.execute(sql, commit=commit)
        sql = "CREATE " + " INDEX kiosk_fts_view_idx on kiosk_fts_view using gin(\"data\");"
        KioskSQLDb.execute(sql, commit=commit)

    @staticmethod
    def drop(commit=True):
        """
        drops the kiosk_fts_view materialized view.
        :param commit: set to False in order to keep the current transaction from being committed.
        :raises all kinds of exceptions if something goes wrong
        """
        sql = "DROP INDEX IF EXISTS kiosk_view_fts_idx;"
        KioskSQLDb.execute(sql, commit=commit)
        sql = "DROP MATERIALIZED VIEW IF EXISTS kiosk_fts_view;"
        KioskSQLDb.execute(sql, commit=commit)

    @staticmethod
    def refresh(throw: bool=False):
        """
        refreshes the kiosk_fts_view materialized view. This is necessary after recording data changed.
        If the database changed structurally use create_or_replace_fts_view instead.
        This will fail if the view does not exist.
        throw: set to True if you want this to throw an exception instead of logging the error
        :return: boolean
        """
        try:
            KioskSQLDb.execute("REFRESH MATERIALIZED VIEW kiosk_fts_view;")
            return True
        except BaseException as e:
            if throw:
                raise Exception(f"FTSView.refresh: {repr(e)}")
            logging.error(f"FTSView.refresh: {repr(e)}")
            return False

    @staticmethod
    def exists():
        """
        checks if the full text search view exists.
        :return: bool
        """
        return KioskSQLDb.does_view_exist("kiosk_fts_view", materialized_view=True)
