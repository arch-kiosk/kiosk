import logging

from typerepository import TypeRepository
from typing import Dict, Union, Optional, List

from kioskabstractclasses import PluginLoader
from syncrepositorytypes import TYPE_QC_ENGINE
from kiosksqldb import KioskSQLDb
from .qcmessagecachemodel import QCMessageCacheModel


# **************************************************************
# helper method
# **************************************************************
def run_quality_control(data_context: Optional[str] = None):
    from synchronization import Synchronization
    from dsd.dsd3singleton import Dsd3Singleton

    sync = Synchronization()
    dsd = Dsd3Singleton.get_dsd3()
    qc = QualityControl(dsd, sync.type_repository)
    qc.trigger_qc("rtl", data_context=data_context)


# **************************************************************
# Quality Control classes
# **************************************************************
class QCError(Exception):
    pass


class QCNoFlag(Exception):
    pass


class QualityControlMessage:
    message: str
    trigger: str
    flag_id: str
    data_context: Optional[str]
    severity: str
    fields_involved: []

    def __init__(self):
        self.message = ""
        self.flag_id = ""
        self.severity = ""
        self.fields_involved = []
        self.trigger = ""
        self.data_context = None

    def __repr__(self):
        return f"{self.flag_id}, {self.severity}: {self.message}"

    @property
    def flag_id_data_context(self):
        return self.flag_id + "|" + self.data_context


class QualityControl:

    def __init__(self, dsd=None, type_repos: TypeRepository = None):
        from .qcengine import QCEngine
        self.qc_engines: Dict[str, QCEngine] = {}
        self._dsd = dsd
        self._updates: Dict[str, Optional[QualityControlMessage]] = {}
        self._type_repos = type_repos

    @property
    def engine_count(self):
        return len(self.qc_engines)

    def _load_engines(self):
        if not self._type_repos or not self._dsd:
            raise QCError('Cannot load engines because _type_repos or _dsd is not given.')

        for engine_type in self._type_repos.list_types(TYPE_QC_ENGINE):
            engine_factory = self._type_repos.get_type(TYPE_QC_ENGINE, engine_type)
            engine = engine_factory(self._dsd, self)
            self._add_qc_engine(engine_type, engine)

    def _add_qc_engine(self, engine_id: str, qc_engine):
        self.qc_engines[engine_id] = qc_engine

    def trigger_qc(self, trigger_id: str, data_context: Optional[str] = None, dont_flush=False):
        """
        triggers quality control.
        :param trigger_id: the kind of trigger. e.g. "rtl" to trigger locus rules
        :param data_context: optional of you want the rules to operate on a single data context
        :param dont_flush: just for testing: Suppresses the final flush to the database. Default is False.
        """
        if self.engine_count == 0:
            self._load_engines()

        for engine in self.qc_engines.values():
            engine.trigger_qc(trigger_id, data_context)
        if not dont_flush:
            self.flush_to_db()

    def set_message(self, msg: QualityControlMessage) -> None:
        self._updates[msg.flag_id_data_context] = msg
        if len(self._updates) > 100:
            self.flush_to_db()

    def drop_message(self, flag_id: str, data_context: str) -> None:
        self._updates[flag_id + "|" + data_context] = None
        if len(self._updates) > 100:
            self.flush_to_db()

    def flush_to_db(self) -> None:
        if not self._updates:
            return

        cur = KioskSQLDb.get_dict_cursor()
        try:
            sql_insert = "INSERT INTO " + f"{KioskSQLDb.sql_safe_ident('qc_message_cache')} ("
            sql_insert += ",".join([KioskSQLDb.sql_safe_ident(x)
                                    for x in ["flag_id_data_context",
                                              "flag_id",
                                              "data_context",
                                              "severity",
                                              "message",
                                              "fields_involved"]])
            sql_insert += ") VALUES(%s,%s,%s,%s,%s,%s)"
            sql_delete = "DELETE FROM " + f"{KioskSQLDb.sql_safe_ident('qc_message_cache')} " \
                                          f"where {KioskSQLDb.sql_safe_ident('flag_id_data_context')}=%s"

            for msg_id, msg in self._updates.items():
                cur.execute(sql_delete, [msg_id])
                if msg:
                    cur.execute(sql_insert, [msg_id, msg.flag_id,
                                             msg.data_context,
                                             msg.severity,
                                             msg.message,
                                             ",".join(msg.fields_involved)])

            cur.close()
            KioskSQLDb.commit()
            self._updates.clear()
        except BaseException as e:
            try:
                cur.close()
            except:
                pass
            logging.error(f"{self.__class__.__name__}.flush_to_db: {repr(e)}")
            KioskSQLDb.rollback()

    def get_messages(self, flag_group="", data_context="", severity=""):
        if not flag_group and not data_context:
            raise QCError("too many messages at once. Please filter by either flag_group or data_context.")
        self.flush_to_db()
        sql, params = self._query_messages(data_context, flag_group, severity)
        cur = KioskSQLDb.execute_return_cursor(sql, params)
        try:
            r = cur.fetchone()
            while r:
                yield r
                r = cur.fetchone()
        finally:
            if cur:
                cur.close()

    def has_messages(self, flag_group="", data_context="", severity=""):
        self.flush_to_db()
        sql, params = self._query_messages(data_context, flag_group, severity,
                                           select_fields=KioskSQLDb.sql_safe_ident("flag_id_data_context"))
        return KioskSQLDb.get_first_record_from_sql(sql, params)

    def _query_messages(self, data_context, flag_group, severity, select_fields="*"):
        sql = "select " + f" {select_fields} from qc_message_cache "
        params = []
        if flag_group or data_context or severity:
            sql += " where "
            sql_where = f"{KioskSQLDb.sql_safe_ident('flag_id')} ilike %s" if flag_group else ""
            if sql_where:
                params = [flag_group + "%"]

            if data_context:
                if sql_where:
                    sql_where += " and "
                sql_where += f"{KioskSQLDb.sql_safe_ident('data_context')} = %s"
                params.append(data_context)

            if severity:
                if sql_where:
                    sql_where += " and "
                sql_where += f"{KioskSQLDb.sql_safe_ident('severity')} ilike %s"
                params.append(severity)

            sql += sql_where
        return sql, params
