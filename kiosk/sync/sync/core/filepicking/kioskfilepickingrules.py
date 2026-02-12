import logging
from typing import List

import kioskstdlib
from kiosksqldb import KioskSQLDb


class FilePickingRuleError(Exception):
    pass


# *****************************************************************************************************************
#    KioskFilePickingRule
# *****************************************************************************************************************


class KioskFilePickingRule:
    def __init__(self, init_values: dict = None):
        self.workstation_type: str = ""
        self.recording_group: str = ""
        self.order: str = ""
        self.rule_type: str = ""
        self.operator: str = ""
        self.value: str = ""
        self.resolution: str = ""
        self.disable_changes: bool = False
        self.misc: str = ""
        self.uid = None
        self.modified_by = None
        self.modified = None
        self.created = None

        if init_values:
            self.set_by_dict(init_values)

    @property
    def readable_id(self):
        """
        returns an id consisting of workstation_type, recording_group and order
        :return:
        """
        return f"{self.workstation_type}_{self.recording_group}_{self.order}"

    def as_dict(self) -> {}:
        """
        returns the rule's attributes as a dictionary for testing purposes.
        :return: a dict with the rule's attributes
        """
        return self.__dict__

    def as_str(self):
        return (f"workstation_type: {self.workstation_type}, "
                f"recording_group: {self.recording_group},"
                f"order: {self.order},"
                f"rule_type: {self.rule_type},"
                f"operator: {self.operator},"
                f"value: {self.value},"
                f"resolution: {self.resolution}")

    def set_by_dict(self, values: dict):
        """
        sets the rule's attributes from the given dict
        :param values: a dict
        """
        self.workstation_type: str = values["workstation_type"]
        self.recording_group: str = values["recording_group"]
        self.order: str = values["order"]
        self.rule_type: str = values["rule_type"]
        self.operator: str = kioskstdlib.try_get_dict_entry(values, "operator", "")
        self.value: str = kioskstdlib.try_get_dict_entry(values, "value", "")
        self.resolution: str = kioskstdlib.try_get_dict_entry(values, "resolution", "")
        self.disable_changes: str = kioskstdlib.try_get_dict_entry(values, "disable_changes", False)
        self.misc: str = kioskstdlib.try_get_dict_entry(values, "misc", "")
        self.uid: str = kioskstdlib.try_get_dict_entry(values, "uid", None)
        self.modified_by = kioskstdlib.try_get_dict_entry(values, "modified_by", None)
        self.modified = kioskstdlib.try_get_dict_entry(values, "modified", None)
        self.created = kioskstdlib.try_get_dict_entry(values, "created", None)

    def validate(self):
        """
        checks if it is a valid rule.
        :raises FilePickingRuleError if not.
        """
        not_empty = ["workstation_type", "recording_group", "order", "rule_type", "resolution"]
        for f in not_empty:
            if self.__getattribute__(f) is None:
                raise FilePickingRuleError(f"rule attribute \"{f}\" not set for rule {self.readable_id}")


# *****************************************************************************************************************
#    KioskFilePickingRules
# *****************************************************************************************************************


class KioskFilePickingRules:

    def __init__(self, workstation_type: str, recording_group: str = "default"):
        self.workstation_type = workstation_type
        self.recording_group = recording_group

    def copy_from_group(self, from_file_picking_group, commit=True)->bool:
        try:
            if self.has_rules():
                logging.debug(f"{self.__class__.__name__}.copy_from_group: "
                              f"recording group {self.recording_group} already had file picking rules")
                return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.copy_from_group: {repr(e)}")
            return False

        sql = f"""
            insert into repl_file_picking_rules (
                workstation_type, recording_group, "order", rule_type, operator, "value",
                resolution, disable_changes, misc, modified_by)
            select workstation_type, %s, "order", rule_type, operator, "value",
                resolution, disable_changes, misc, %s
                from repl_file_picking_rules where {KioskSQLDb.sql_safe_ident('workstation_type')} ilike %s
                  and {KioskSQLDb.sql_safe_ident('recording_group')} = %s
        """
        sp = KioskSQLDb.begin_savepoint()
        try:
            c_rules = KioskSQLDb.execute(sql, parameters=[self.recording_group, "sys",
                                                self.workstation_type,
                                                from_file_picking_group])
            logging.info(f"Recording group {self.recording_group} got {c_rules} file picking rules "
                         f"from recording group {from_file_picking_group}")
            KioskSQLDb.commit_savepoint(sp)
            if commit:
                KioskSQLDb.commit()

        except BaseException as e:
            KioskSQLDb.rollback_savepoint(sp)
            logging.error(f"{self.__class__.__name__}.copy_from_group: Error copying groups from "
                          f"{from_file_picking_group} to {self.recording_group}:{repr(e)}")

        return True


    def has_rules(self) -> bool:
        """
        Checks if the recording group already has file picking rules.
        :return: boolean
        :raises all kinds of Exceptions
        """
        if not self.workstation_type:
            raise FilePickingRuleError("No workstation_type available in KioskFilePickingRules.has_rules.")

        sql = "select " + f""" uid
              from {KioskSQLDb.sql_safe_ident('repl_file_picking_rules')}
              where {KioskSQLDb.sql_safe_ident('workstation_type')} ilike %s
              and {KioskSQLDb.sql_safe_ident('recording_group')} = %s"""

        if KioskSQLDb.get_first_record_from_sql(sql=sql, params=[self.workstation_type, self.recording_group]):
            return True

        return False

    def get_rules(self) -> List[KioskFilePickingRule]:
        """
        returns an order list of file picking rules for the set recording group.
        :return: a list
        """
        if not self.workstation_type:
            raise FilePickingRuleError("No workstation_type available in KioskFilePickingRules.get_rules.")

        result = []
        sql = f"""
              select * from {KioskSQLDb.sql_safe_ident('repl_file_picking_rules')}
              where {KioskSQLDb.sql_safe_ident('workstation_type')} ilike %s
              and {KioskSQLDb.sql_safe_ident('recording_group')} = %s
              order by {KioskSQLDb.sql_safe_ident('order')}"""

        cur = KioskSQLDb.execute_return_cursor(sql=sql, parameters=[self.workstation_type, self.recording_group])
        logging.debug(f"{self.__class__.__name__}.get_rules: sql is {cur.query}")

        r = cur.fetchone()
        while r:
            result.append(KioskFilePickingRule(r))
            r = cur.fetchone()
        logging.info(f"{self.__class__.__name__}.get_rules: {len(result)} file picking rules found "
                     f"for workstation type {self.workstation_type} and recording group {self.recording_group}")
        return result

    @staticmethod
    def serialize_rules(rules: List[KioskFilePickingRule]) -> [dict]:
        """
        simple converter from a list of KioskFilePickingRule objects to a list of
        dictionaries.
        :param rules: a list of KioskFilePickingRule objects
        :return: a list of dictionaries
        """
        return [r.as_dict() for r in rules]
