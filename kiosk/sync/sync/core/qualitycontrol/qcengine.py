import logging
from pprint import pprint
from typing import Optional

import kioskstdlib
from dsd.dsd3 import DataSetDefinition
from dsd.dsdgraph import DsdGraph
from sync_config import SyncConfig
from .qcflagmodel import QCFlagModel
from .qualitycontrol import QualityControl, QualityControlMessage, QCError, QCNoFlag
from kiosksqldb import KioskSQLDb


class QCEngine:
    def __init__(self, dsd, quality_control: QualityControl):
        self._dsd: DataSetDefinition = dsd
        self._quality_control = quality_control
        self._graph = DsdGraph(dsd)
        self._graph.add_tables("browse()")
        sync_config = SyncConfig.get_config()
        self._term_for_locus = sync_config.get_recording_context_alias('locus')
        self._term_for_unit = sync_config.get_recording_context_alias('unit')
        self._report_progress = None

    def trigger_qc(self, trigger_id: str, data_context: Optional[str]):
        raise NotImplementedError

    def report_progress(self, percentage: int, msg: Optional[str]):
        if self._report_progress:
            self._report_progress(percentage, msg)

    def _get_message_param_from_variable(self, param: str):
        param = param.lower()
        if param in ["$$locus_term", "$$locus_term_plural", "$$general_locus_term"]:
            return self._term_for_locus
        if param in ["$$unit_term", "$$unit_term_plural", "$$general_unit_term"]:
            return self._term_for_unit

        return ""

    def flag(self, trigger_id: str, data_context_str: str, data_context: {}, flag_id: str):
        flag = QCFlagModel()
        if not flag.get_one(f"id=%s", [flag_id]):
            raise QCError(f"Attempt to set unknown flag {flag_id}")
        params = flag.params.split(",")
        c = 0
        message = flag.message
        for param in params:
            c += 1
            try:
                param = param.strip()
                if param.startswith("$$"):
                    param_value = self._get_message_param_from_variable(param)
                elif param.startswith("##"):
                    param_value = "?"
                    logging.warning(f"attempt to use a configuration value {param} by flag {flag_id}")
                else:
                    param_value = data_context[param]
            except BaseException as e:
                logging.warning(f"{self.__class__.__name__}.flag: Error when raising flag {flag_id}: {repr(e)}")
                param_value = ""
            message = message.replace("{" + f"{c}" + "}", param_value, 1)

        msg = QualityControlMessage()
        msg.message = message
        msg.flag_id = flag_id
        msg.data_context = data_context_str
        msg.severity = flag.severity
        msg.fields_involved = [x.strip() for x in kioskstdlib.null_val(flag.fields_involved, "").split(",")]

        self._quality_control.set_message(msg)

    def unflag(self, flag_id: str, data_context_str: str):
        self._quality_control.drop_message(flag_id, data_context_str)
