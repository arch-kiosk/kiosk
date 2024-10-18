import json
import logging
import datetime

from pprint import pprint
from typing import Optional

# import yappi

import kioskstdlib
from kiosksqldb import KioskSQLDb
from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin
from core.qualitycontrol.qcengine import QCEngine
from core.qualitycontrol.qualitycontrol import QCError, QCNoFlag
from core.qualitycontrol.qcrulemodel import QCRuleModel
from syncrepositorytypes import TYPE_QC_ENGINE


class PluginSimpleQCEngine(SynchronizationPlugin):
    _plugin_version = 0.1
    def all_plugins_ready(self):
        try:
            app: Synchronization = self.app
            if app:
                app.type_repository.register_type(TYPE_QC_ENGINE, "SimpleQCEngine", SimpleQCEngine)
            else:
                logging.error(f"Plugin {self.__class__.__name__} can't connect to app.")
                return False

            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.all_plugins_ready: {repr(e)}")
        return False


class SimpleQCEngine(QCEngine):
    def trigger_qc(self, trigger_id: str, data_context_str: Optional[str]) -> None:
        # yappi.start()
        data_contexts = self._get_data_contexts(trigger_id, data_context_str)
        warnings = 0
        if data_contexts:
            rules = self._get_rules_for_trigger(trigger_id)
            if rules:
                for data_context in data_contexts:
                    logging.debug(f"SimpleQCEngine.trigger_qc: data_context {data_context['arch_context']}")
                    for rule in rules:
                        try:
                            self._execute_rule(trigger_id, rule, data_context)
                        except BaseException as e:
                            warnings += 1
                            if warnings < 10:
                                logging.warning(f"{self.__class__.__name__}.trigger_qc: error executing rule {rule.id}: {repr(e)}")
                            elif warnings == 10:
                                logging.warning(f"{self.__class__.__name__}.trigger_qc: Too many warnings")
        if warnings > 0:
            logging.warning(f"{self.__class__.__name__}.trigger_qc: quality control rules lead to {warnings} warnings.")

    def _get_rules_for_trigger(self, trigger_id: str):
        rule_model = QCRuleModel()
        result = []
        rules: rule_model = rule_model.get_many("trigger like %s", [trigger_id], )
        for r in rules:
            if r.enabled and 'kiosk' in kioskstdlib.null_val(r.hosts, 'kiosk').lower():
                result.append(r)
        return result

    def _get_data_contexts(self, trigger_id: str, data_context: Optional[str]):
        try:
            if trigger_id.startswith("rt"):
                record_type = self._get_record_type_from_trigger(trigger_id)
                return self._get_data_from_record_type(record_type, data_context)
            else:
                logging.info(f"{self.__class__.__name__}._get_data_contexts: Trigger '{trigger_id}' "
                             f"not supported by simple qc engine.")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._get_data_contexts: {repr(e)}")
        return []

    def _get_data_from_record_type(self, record_type: str, data_context: Optional[str]):
        sql = "select " + f"* from {record_type}"
        cur = None
        try:
            if data_context:
                sql += " where uid=%s"
                cur = KioskSQLDb.execute_return_cursor(sql, [data_context])
            else:
                cur = KioskSQLDb.execute_return_cursor(sql)

            r = cur.fetchone()
            while r:
                yield r
                r = cur.fetchone()

        finally:
            if cur:
                # print("closed!")
                cur.close()

    def _execute_rule(self, trigger_id, rule: QCRuleModel, data_context):
        flag = False
        rule_type = rule.type.lower()
        if rule_type not in ["empty", "!empty", "gt0", "is0"]:
            return

        try:
            value = self._get_input_value(trigger_id, rule, data_context)
            if rule_type == "empty":
                flag = kioskstdlib.null_val(value, "") == ""
            elif rule_type == "!empty":
                flag = kioskstdlib.null_val(value, "") != ""
            elif rule_type == "is0":
                flag = kioskstdlib.null_val(value, 0) == 0
            elif rule_type == "gt0":
                flag = kioskstdlib.null_val(value, 0) > 0
        except QCNoFlag:
            # if the field of a related record cannot be checked because the related record isn't there
            # in the first place, a QCNoFlag would occur
            flag = False

        trigger_record_type = self._get_record_type_from_trigger(trigger_id)
        uid_field = self._dsd.get_uuid_field(trigger_record_type)
        record_type_uuid = data_context[uid_field]
        if flag:
            self.flag(trigger_id, record_type_uuid, data_context, rule.flag)
        else:
            self.unflag(rule.flag, data_context_str=record_type_uuid)

    @staticmethod
    def _get_record_type_from_trigger(trigger_id: str):
        if trigger_id == "rtl":
            return "locus"
        else:
            raise QCError(f"record type for trigger {trigger_id} unknown")

    def _get_input_value(self, trigger_id, rule: QCRuleModel, data_context, input_nr=0):
        if len(rule.input_dict) - 1 > input_nr:
            raise QCError(f"rule {rule.id} does not have as many as {input_nr + 1} inputs")
        rule_input = rule.input_dict[input_nr]
        if rule_input["type"] == "field_value":
            return self._get_input_field_value(trigger_id, rule_input, data_context)
        elif rule_input["type"] == "record_count":
            return self._get_input_record_count(trigger_id, rule_input, data_context)
        else:
            raise QCError(f"rule {rule.id} has unknown input type {rule_input['input_type']}")

    def _get_input_record_count(self, trigger_id: str, rule_input: dict, data_context):
        input_record_type = rule_input["record_type"]
        trigger_record_type = self._get_record_type_from_trigger(trigger_id)
        if trigger_record_type == input_record_type:
            raise QCError("counting the trigger record itself is strange and thus not implemented")

        join = self._graph.get_join(trigger_record_type, input_record_type)
        if join:
            sql_join = join.get_sql()
            sql_group_by = join.get_group_by()
            sql_record_type = KioskSQLDb.sql_safe_ident(trigger_record_type)
            sql_input_record_type = KioskSQLDb.sql_safe_ident(input_record_type)
            uid_field = self._dsd.get_uuid_field(trigger_record_type)
            count_field = KioskSQLDb.sql_safe_ident(self._dsd.get_uuid_field(input_record_type))
            record_type_uuid = data_context[uid_field]
            sql = "select"
            sql += f" count({sql_input_record_type}.{count_field}) as c"
            sql += f" from {sql_record_type} "
            sql += sql_join
            sql += f" where {sql_record_type}.{KioskSQLDb.sql_safe_ident(uid_field)}=%s"
            sql += sql_group_by
            # pprint(sql)
            value = kioskstdlib.null_val(KioskSQLDb.get_field_value_from_sql("c", sql, [record_type_uuid]), 0)
            return value
        else:
            raise QCError(f"rule can't find a path from table {trigger_record_type} to {input_record_type} ")

    def _get_input_field_value(self, trigger_id: str, rule_input: dict, data_context):
        try:
            input_record_type = rule_input["record_type"]
            trigger_record_type = self._get_record_type_from_trigger(trigger_id)
            if trigger_record_type == input_record_type:
                return data_context[rule_input["field"]]
            else:

                sql_join = self._graph.get_join(trigger_record_type, input_record_type).get_sql()
                if sql_join:
                    record_type = KioskSQLDb.sql_safe_ident(trigger_record_type)
                    uid_field = self._dsd.get_uuid_field(trigger_record_type)
                    record_type_uuid = data_context[uid_field]
                    sql = "select " + (f"{input_record_type}."
                                       f"{KioskSQLDb.sql_safe_ident(rule_input['field'])}")
                    sql += f" as {KioskSQLDb.sql_safe_ident('value')}"
                    sql += f" from {record_type} "
                    sql += sql_join
                    sql += f" where {record_type}.{KioskSQLDb.sql_safe_ident(uid_field)}=%s"
                    try:
                        value = KioskSQLDb.get_field_value_from_sql("value", sql, [record_type_uuid],
                                                                    exception_on_no_record=True)
                        if value is None:
                            logging.debug(f"{self.__class__.__name__}._get_input_field_value: None value occured in sql"
                                          f"{sql}")
                    except KeyError:
                        # a related record was not even there, so the rule can't be checked in the first place
                        raise QCNoFlag()
                    return value
                else:
                    raise QCError(f"rule can't find a path from table {trigger_record_type} to {input_record_type} ")
        except BaseException as e:
            logging.debug(f"{self.__class__.__name__}._get_input_field_value: {repr(e)}")
            raise e
