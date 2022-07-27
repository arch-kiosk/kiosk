import pytest
import os
import datetime
from pprint import pprint
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from core.filepicking.kioskfilepickingrules import KioskFilePickingRules, KioskFilePickingRule, FilePickingRuleError
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")

rules_set_1 = os.path.join(test_path, r"sql", "rule_set_1.sql")


class TestContextKioskFilePickingRules(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, cfg, urapdb, dsd):
        assert cfg
        assert urapdb
        assert dsd
        fpr = KioskFilePickingRules("filemakerworkstation")
        assert fpr.recording_group == "default"

    @pytest.fixture()
    def insert_ruleset_1(self, urapdb):
        KioskSQLDb.run_sql_script(rules_set_1)

    def test_get_rules(self, cfg, urapdb, dsd, insert_ruleset_1):
        fpr = KioskFilePickingRules("")
        with pytest.raises(FilePickingRuleError):
            fpr.get_rules()
        fpr.workstation_type = "filemakerworkstation"
        rules = fpr.get_rules()
        assert rules
        assert fpr.serialize_rules(rules) == [{'created': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'disable_changes': False,
                                               'misc': None,
                                               'modified': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'modified_by': 'sys',
                                               'operator': None,
                                               'order': 0,
                                               'recording_group': 'default',
                                               'resolution': 'low',
                                               'rule_type': 'contextuals',
                                               'uid': 'c1ad70a6-1e08-44ed-9f2c-bccb8be30fbd',
                                               'value': None,
                                               'workstation_type': 'FileMakerWorkstation'},
                                              {'created': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'disable_changes': False,
                                               'misc': None,
                                               'modified': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'modified_by': 'sys',
                                               'operator': '=',
                                               'order': 1,
                                               'recording_group': 'default',
                                               'resolution': 'low',
                                               'rule_type': 'tag',
                                               'uid': 'c2ad70a6-1e08-44ed-9f2c-bccb8be30fbd',
                                               'value': 'site-map',
                                               'workstation_type': 'FileMakerWorkstation'}]

        fpr.recording_group = "ceramicists"
        rules = fpr.get_rules()

        assert fpr.serialize_rules(rules) == [{'created': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'disable_changes': False,
                                               'misc': None,
                                               'modified': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'modified_by': 'sys',
                                               'operator': None,
                                               'order': 0,
                                               'recording_group': 'ceramicists',
                                               'resolution': 'dummy',
                                               'rule_type': 'all',
                                               'uid': 'c3ad70a6-1e08-44ed-9f2c-bccb8be30fbd',
                                               'value': None,
                                               'workstation_type': 'FileMakerWorkstation'},
                                              {'created': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'disable_changes': False,
                                               'misc': None,
                                               'modified': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'modified_by': 'sys',
                                               'operator': '=',
                                               'order': 1,
                                               'recording_group': 'ceramicists',
                                               'resolution': 'high',
                                               'rule_type': 'record_type',
                                               'uid': 'c4ad70a6-1e08-44ed-9f2c-bccb8be30fbd',
                                               'value': 'pottery_images',
                                               'workstation_type': 'FileMakerWorkstation'},
                                              {'created': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'disable_changes': False,
                                               'misc': None,
                                               'modified': datetime.datetime(2021, 2, 18, 17, 41, 31, 281323),
                                               'modified_by': 'sys',
                                               'operator': '=',
                                               'order': 2,
                                               'recording_group': 'ceramicists',
                                               'resolution': 'high',
                                               'rule_type': 'tag',
                                               'uid': 'c5ad70a6-1e08-44ed-9f2c-bccb8be30fbd',
                                               'value': 'site-map',
                                               'workstation_type': 'FileMakerWorkstation'}]

    def test_validate_rules(self, cfg, urapdb, dsd, insert_ruleset_1):
        fpr = KioskFilePickingRules("")
        with pytest.raises(FilePickingRuleError):
            fpr.get_rules()
        fpr.workstation_type = "filemakerworkstation"
        fpr.recording_group = "ceramicists"
        rules = fpr.get_rules()

        for r in rules:
            r.validate()
