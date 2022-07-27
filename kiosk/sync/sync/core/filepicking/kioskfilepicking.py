import logging
from pprint import pprint
from typing import List, Callable
from .kioskfilepickingrules import FilePickingRuleError, KioskFilePickingRule, KioskFilePickingRules
import kioskstdlib
from kiosksqldb import KioskSQLDb
from core.fileidentifiercache import FileIdentifierCache
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache


# *****************************************************************************************************************
#    KioskFilePicking
# *****************************************************************************************************************


class KioskFilePicking:
    # noinspection PyTypeChecker
    def __init__(self, workstation_type: str, file_identifier_cache: FileIdentifierCache, dsd,
                 recording_group: str = "default"):
        self._workstation_type = workstation_type
        self._recording_group = recording_group
        self._dsd = dsd
        self._fid = file_identifier_cache
        self._identifiers = MemoryIdentifierCache(self._dsd)
        self._rules = KioskFilePickingRules(workstation_type=self._workstation_type,
                                            recording_group=self._recording_group).get_rules()
        self._all_rule = KioskFilePickingRule(
            {
                "workstation_type": self._workstation_type,
                "recording_group": self._recording_group,
                "order": 0,
                "rule_type": "all",
                "resolution": "dummy",
                "disable_changes": True})
        self._files = {}
        self._rules_processed = False
        self._on_translate_record_type_alias: Callable[[str], str] = None
        self._on_get_files_with_tags: Callable[[List[str], str], List[str]] = None
        self._on_get_files_by_date: Callable[[str, List[str]], List[str]] = None

    @property
    def on_get_files_with_tags(self) -> Callable:
        return self._on_get_files_with_tags

    @on_get_files_with_tags.setter
    def on_get_files_with_tags(self, value: Callable[[List[str], str], List[str]]):
        """
        sets the callback function that returns a list of files that match a tag comparison.

        :param value: the callback:
                        The signature of the callback is (tags: List[str], operator: str) -> List[str] with
                        tags being the list of tags and
                        operator the kind of comparison requested.
                        operator should at least support "=" or "<>" currently.
                        "=" equals to the file picking operator "IN"
                        "<>" equals to the fp operator "!IN"
                        The return value is a list of files represented by their UID.
        """
        self._on_get_files_with_tags = value

    @property
    def on_get_files_by_date(self) -> Callable:
        return self._on_get_files_by_date

    @on_get_files_by_date.setter
    def on_get_files_by_date(self, value: Callable[[str, List[str]], List[str]]):
        """
        sets the callback function that returns a list of files that result from a date comparison

        :param value: the callback:
                        The signature of the callback is (operator: str, values: [datetime.datetime]) -> List[str] with
                        operator: one of the operators the FileRepository.get_files_by_date method accepts
                        values: a list of datetime.datetime values depending on the operator
                        The return value is a list of files represented by their UID.
        """
        self._on_get_files_by_date = value

    @property
    def on_translate_record_type_alias(self):
        return self._on_translate_record_type_alias

    @on_translate_record_type_alias.setter
    def on_translate_record_type_alias(self, value: callable):
        self._on_translate_record_type_alias = value

    def process_rules(self):
        self._files.clear()
        for r in self._rules:
            rt = r.rule_type.lower()
            if rt == "all":
                if r.order == 0:
                    self._all_rule = r
                else:
                    logging.warning(f"{self.__class__.__name__}.process_rules: rule set has 'ALL' rule on higher order. Ignored.")
            elif rt == "contextuals":
                self._rule_contextuals(r)
            elif rt == "context":
                self._rule_context(r)
            elif rt == "record_type":
                self._rule_record_type(r)
            elif rt == "tag":
                self._rule_tag(r)
            elif rt == "date":
                self._rule_date(r)

        self._rules_processed = True

    def _rule_contextuals(self, rule: KioskFilePickingRule):
        contextuals = self._fid.get_files_with_context()
        for c in contextuals:
            self._files[c] = rule

    def _rule_context(self, rule: KioskFilePickingRule):
        operator = rule.operator.lower()
        if operator in ["in", "not in", "!in"]:
            files = self._fid.get_files_with_context(context=rule.value,
                                                     equals=operator == "in")
            for c in files:
                self._files[c] = rule
        elif operator in ["has", "has not", "!has"]:
            files = self._fid.get_files_with_context(context=rule.value,
                                                     equals=operator == "has",
                                                     compare_as_part=True)
            for c in files:
                self._files[c] = rule
        elif operator == "xin":
            self._rule_exclusively_in_context(rule)
        else:
            raise FilePickingRuleError(f"operator {operator} unknown in file picking rule context")

    def _rule_record_type(self, rule: KioskFilePickingRule):
        operator = rule.operator.lower()
        record_type = ""
        if self._on_translate_record_type_alias:
            record_type = self._on_translate_record_type_alias(rule.value)
        if not record_type:
            record_type = rule.value

        if operator in ["=", "in", "not in", "!in"]:
            files = self._fid.get_files_with_record_type(record_type=record_type,
                                                         equals=operator in ["=", "in"])
        else:
            raise FilePickingRuleError(f"operator {operator} unknown in file picking rule context")

        for c in files:
            self._files[c] = rule

    def _rule_tag(self, rule: KioskFilePickingRule):
        if not self._on_get_files_with_tags:
            raise FilePickingRuleError("No handler for the rule TAG set. Assign something to on_get_files_with_tags")

        operator = rule.operator.lower()
        if operator in ["=", "in"]:
            operator = "="
        elif operator in ["<>", "!in", "not in"]:
            operator = "<>"
        else:
            raise FilePickingRuleError(f"rule_type TAG has wrong operator {rule.operator} in rule {rule.readable_id}.")

        if not rule.value:
            raise FilePickingRuleError(f"rule_type TAG has no value in rule {rule.readable_id}.")

        files = list(set(self._on_get_files_with_tags([rule.value], operator)))
        self._set_rule(files, rule)

    def _rule_date(self, rule: KioskFilePickingRule):

        if not self._on_get_files_by_date:
            raise FilePickingRuleError("No handler for the rule DATE set. Assign something to on_get_files_by_date")

        operator = rule.operator.lower()
        values = []
        if not rule.value:
            raise FilePickingRuleError(f"rule_type TAG has no value in rule {rule.readable_id}.")

        if operator in ["within", "not within", "!within"]:
            operator = "within" if operator == "within" else "!within"
            values = rule.value.split(",")
            if len(values) != 2:
                raise FilePickingRuleError(
                    f"rule_type DATE in rule {rule.readable_id} uses operator {rule.operator} "
                    f"but the value does not have two iso8601 dates separated by comma")
        elif operator in ["<", "before"]:
            operator = "<"
            values = [rule.value]
        elif operator in [">", "after"]:
            operator = ">"
            values = [rule.value]
        else:
            raise FilePickingRuleError(f"rule_type DATE has wrong operator {rule.operator} in rule {rule.readable_id}.")

        try:
            values = [kioskstdlib.str_to_iso8601(value) for value in values]

        except BaseException as e:
            raise FilePickingRuleError(
                f"rule_type DATE in rule {rule.readable_id} uses operator {rule.operator} "
                f"but at least one of the dates isn't a proper iso8601 date")

        files = list(set(self._on_get_files_by_date(operator, values)))
        self._set_rule(files, rule)


    def _rule_exclusively_in_context(self, rule: KioskFilePickingRule):
        try:
            record_type = self._identifiers.get_recording_context(rule.value, fail_on_multiple=True)[0]
        except BaseException as e:
            raise FilePickingRuleError(f"rule_type XIN compares a context identifier {rule.value} "
                                       f"in rule {rule.readable_id} that has no record type information "
                                       f"or too many: {repr(e)}")

        files = self._fid.get_files_with_context(context=rule.value)
        for c in files:
            ctx_information = self._fid.get_contexts_for_file(c, primary_only=False)
            # unfortunately the record type in the file-identifier-cache is the record type that links the image.
            # that could be "dayplan" although we have a unit identifier
            # we need the record type where the identifier is at home: unit.

            contexts = []
            for context in ctx_information:
                ass_record_type = self._identifiers.get_recording_context(context[0], fail_on_multiple=False)
                if ass_record_type[0] == record_type:
                    contexts.append(context[0])

            if len(contexts) == 0:
                raise FilePickingRuleError(f"file picking XIN rule {rule.readable_id}: "
                                           f"file {c} is in context {rule.value} "
                                           f"but does not have a record type {record_type} "
                                           f"in the file identifier cache for that context.")

            if len(contexts) == 1:
                self._files[c] = rule

    def _set_rule(self, files: [str], rule: KioskFilePickingRule, complement=False):
        if not complement:
            for c in files:
                self._files[c] = rule
        else:
            for f in self._files.keys():
                if f not in files:
                    self._files[f] = rule

    def get_file_picking_rule(self, file_uid: str) -> KioskFilePickingRule:
        if not self._rules_processed:
            self.process_rules()

        rule = self._all_rule
        other_rule = kioskstdlib.try_get_dict_entry(self._files, file_uid, None)
        if other_rule:
            rule = other_rule

        # just to make extra sure:
        if rule.resolution == "dummy":
            rule.disable_changes = True

        return rule
