import datetime
import os

import pytest

from core.filepicking.kioskfilepicking import KioskFilePicking
from dsd.dsd3singleton import Dsd3Singleton
from fileidentifiercache import FileIdentifierCache
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")

rules_set_1 = os.path.join(test_path, r"sql", "rule_set_1.sql")
rules_set_2 = os.path.join(test_path, r"sql", "rule_set_2.sql")
rules_set_3 = os.path.join(test_path, r"sql", "rule_set_3.sql")
rules_set_all = os.path.join(test_path, r"sql", "rule_set_all.sql")
rules_set_xin = os.path.join(test_path, r"sql", "rule_set_XIN.sql")
rules_set_by_date = os.path.join(test_path, r"sql", "rule_set_by_date.sql")

rules_set_tag_complementary = os.path.join(test_path, r"sql", "rule_set_1_tag_complementary.sql")
records_sql = os.path.join(test_path, r"sql", "records_kiosk_context.sql")
more_records_sql = os.path.join(test_path, r"sql", "more_records.sql")
records_for_xin_test = os.path.join(test_path, r"sql", "records_kiosk_context_xin_test.sql")


# noinspection DuplicatedCode
class TestContextKioskFilePicking(KioskPyTestHelper):

    @pytest.fixture(scope="class")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    # todo: This is very slow but turning it to scope="module" makes one test fail when they all run together.
    #  Needs optimization.
    @pytest.fixture()
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    @pytest.fixture()
    def insert_ruleset_1(self):
        KioskSQLDb.run_sql_script(rules_set_1)

    @pytest.fixture()
    def insert_ruleset_tag_complementary(self):
        KioskSQLDb.run_sql_script(rules_set_tag_complementary)

    @pytest.fixture()
    def insert_ruleset_2(self):
        KioskSQLDb.run_sql_script(rules_set_2)

    @pytest.fixture()
    def insert_ruleset_3(self):
        KioskSQLDb.run_sql_script(rules_set_3)

    @pytest.fixture()
    def insert_data_xin(self):
        KioskSQLDb.run_sql_script(records_for_xin_test)
        KioskSQLDb.run_sql_script(rules_set_xin)

    @pytest.fixture()
    def records(self, urapdb):
        KioskSQLDb.run_sql_script(records_sql)
        KioskSQLDb.run_sql_script(more_records_sql)

    def test_init(self, cfg, urapdb, dsd):
        assert cfg
        assert urapdb
        assert dsd
        fid = FileIdentifierCache(dsd)
        fpr = KioskFilePicking("filemakerworkstation", FileIdentifierCache(fid), dsd)
        fpr.on_get_files_with_tags = lambda x, y: []
        assert fpr._recording_group == "default"

    def test_get_file_picking_rule(self, cfg, urapdb, dsd, records, insert_ruleset_1):
        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()
        expected = ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '54e828b3-a28a-1941-a385-f62fc6b430b7',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    'd7374deb-39d8-a648-9dac-fa62cf033c69',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd)
        fpr.on_get_files_with_tags = lambda x, y: []
        rule = fpr.get_file_picking_rule("0f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "contextuals"
        assert rule.resolution == "low"

        # some other file
        rule = fpr.get_file_picking_rule("1f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # pottery
        rule = fpr.get_file_picking_rule("d7374deb-39d8-a648-9dac-fa62cf033c69")
        assert rule.order == 0
        assert rule.rule_type == "contextuals"
        assert rule.resolution == "low"

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd, recording_group="ceramicists")
        fpr.on_get_files_with_tags = lambda x, y: []
        rule = fpr.get_file_picking_rule("0f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # pottery
        rule = fpr.get_file_picking_rule("d7374deb-39d8-a648-9dac-fa62cf033c69")
        assert rule.order == 1
        assert rule.rule_type == "record_type"
        assert rule.resolution == "high"

    def test__on_translate_record_type_alias(self, cfg, urapdb, dsd, records, insert_ruleset_2):
        def translate_record_types(t: str) -> str:
            if t == "photos of sherds":
                return "pottery_images"
            else:
                return ""

        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()
        expected = ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '54e828b3-a28a-1941-a385-f62fc6b430b7',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    'd7374deb-39d8-a648-9dac-fa62cf033c69',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd, recording_group="ceramicists")
        fpr.on_get_files_with_tags = lambda x, y: []
        fpr.on_translate_record_type_alias = translate_record_types
        rule = fpr.get_file_picking_rule("0f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # pottery
        rule = fpr.get_file_picking_rule("d7374deb-39d8-a648-9dac-fa62cf033c69")
        assert rule.order == 1
        assert rule.rule_type == "record_type"
        assert rule.resolution == "high"

    def test__on_record_type_not_in(self, cfg, urapdb, dsd, records, insert_ruleset_2):
        def translate_record_types(t: str) -> str:
            if t == "photos of sherds":
                return "pottery_images"
            else:
                return ""

        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()
        expected = ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '54e828b3-a28a-1941-a385-f62fc6b430b7',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    'd7374deb-39d8-a648-9dac-fa62cf033c69',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd, recording_group="notin")
        fpr.on_get_files_with_tags = lambda x, y: []
        fpr.on_translate_record_type_alias = translate_record_types
        rule = fpr.get_file_picking_rule("0f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 1
        assert rule.rule_type == "record_type"
        assert rule.operator == "!IN"
        assert rule.resolution == "dummy"

        # pottery
        rule = fpr.get_file_picking_rule("d7374deb-39d8-a648-9dac-fa62cf033c69")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "low"

    def test_on_get_files_with_tags(self, cfg, urapdb, dsd, records, insert_ruleset_1):
        def get_files_with_tags(tags: [str], operator: str) -> [str]:
            if operator == "=":
                return ['2e4ff3be-86c2-704c-8dec-8695a571ac59']
            else:
                return ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                        '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                        '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                        '27002a9f-b2df-46fc-9150-56397ebc8870',
                        '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                        '54e828b3-a28a-1941-a385-f62fc6b430b7',
                        '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                        'ca77c27f-bbca-434e-ba20-4f289a562173',
                        'd7374deb-39d8-a648-9dac-fa62cf033c69',
                        'dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
                        'ffca0f7b-6f65-8f48-b2c3-d64a4b2f9700']  # an assumed file without a context

        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()
        expected = ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',  # that's the one that will have high resolution
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '54e828b3-a28a-1941-a385-f62fc6b430b7',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    'd7374deb-39d8-a648-9dac-fa62cf033c69',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd, recording_group="ceramicists")
        fpr.on_get_files_with_tags = lambda x, y: []
        rule = fpr.get_file_picking_rule("0f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # pottery
        rule = fpr.get_file_picking_rule("d7374deb-39d8-a648-9dac-fa62cf033c69")
        assert rule.order == 1
        assert rule.rule_type == "record_type"
        assert rule.resolution == "high"

        # the site-map
        rule = fpr.get_file_picking_rule("2e4ff3be-86c2-704c-8dec-8695a571ac59")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # the file without context
        rule = fpr.get_file_picking_rule('ffca0f7b-6f65-8f48-b2c3-d64a4b2f9700')
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd, recording_group="ceramicists")
        fpr.on_get_files_with_tags = get_files_with_tags
        rule = fpr.get_file_picking_rule("0f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # pottery
        rule = fpr.get_file_picking_rule("d7374deb-39d8-a648-9dac-fa62cf033c69")
        assert rule.order == 1
        assert rule.rule_type == "record_type"
        assert rule.resolution == "high"

        # the site-map
        rule = fpr.get_file_picking_rule("2e4ff3be-86c2-704c-8dec-8695a571ac59")
        assert rule.order == 2
        assert rule.rule_type == "tag"
        assert rule.resolution == "high"

        # the file without context
        rule = fpr.get_file_picking_rule('ffca0f7b-6f65-8f48-b2c3-d64a4b2f9700')
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

    def test_on_get_files_with_tags_complement(self, cfg, urapdb, dsd, records, insert_ruleset_tag_complementary):
        def get_files_with_tags(tags: [str], operator: str) -> [str]:
            if tags[0] == "site-map":
                if operator == "=":
                    return ['2e4ff3be-86c2-704c-8dec-8695a571ac59']
                else:
                    return ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                            '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                            '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                            '27002a9f-b2df-46fc-9150-56397ebc8870',
                            '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                            '54e828b3-a28a-1941-a385-f62fc6b430b7',
                            '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                            'ca77c27f-bbca-434e-ba20-4f289a562173',
                            'd7374deb-39d8-a648-9dac-fa62cf033c69',
                            'dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
                            'ffca0f7b-6f65-8f48-b2c3-d64a4b2f9700']  # an assumed file without a context
            else:
                raise Exception("wrong tag")

        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()
        expected = ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',  # that's the one that will have high resolution
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '54e828b3-a28a-1941-a385-f62fc6b430b7',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    'd7374deb-39d8-a648-9dac-fa62cf033c69',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd, recording_group="ceramicists")
        fpr.on_get_files_with_tags = lambda x, y: []
        rule = fpr.get_file_picking_rule("0f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # pottery
        rule = fpr.get_file_picking_rule("d7374deb-39d8-a648-9dac-fa62cf033c69")
        assert rule.order == 1
        assert rule.rule_type == "record_type"
        assert rule.resolution == "high"

        # the site-map
        rule = fpr.get_file_picking_rule("2e4ff3be-86c2-704c-8dec-8695a571ac59")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # the file without context
        rule = fpr.get_file_picking_rule('ffca0f7b-6f65-8f48-b2c3-d64a4b2f9700')
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd, recording_group="ceramicists")
        fpr.on_get_files_with_tags = get_files_with_tags
        rule = fpr.get_file_picking_rule("0f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 2
        assert rule.rule_type == "tag"
        assert rule.resolution == "medium"

        # pottery
        rule = fpr.get_file_picking_rule("d7374deb-39d8-a648-9dac-fa62cf033c69")
        assert rule.order == 2
        assert rule.rule_type == "tag"
        assert rule.resolution == "medium"

        # the site-map
        rule = fpr.get_file_picking_rule("2e4ff3be-86c2-704c-8dec-8695a571ac59")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"

        # the file without context
        rule = fpr.get_file_picking_rule('ffca0f7b-6f65-8f48-b2c3-d64a4b2f9700')
        assert rule.order == 2
        assert rule.rule_type == "tag"
        assert rule.resolution == "medium"

    def test_NOT_IN_context(self, cfg, urapdb, dsd, records, insert_ruleset_3):
        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()
        expected = [('2e4ff3be-86c2-704c-8dec-8695a571ac59', 'context', 'dummy'),
                    ('71b1f2b3-0e93-bf4d-b9a8-989700159beb', 'context', 'dummy'),
                    ('dd26f0ec-bc94-554f-93df-2a3fe91dbc38', 'contextuals', 'low'),
                    ('ca77c27f-bbca-434e-ba20-4f289a562173', 'contextuals', 'low'),
                    ('27002a9f-b2df-46fc-9150-56397ebc8870', 'contextuals', 'low'),
                    ('14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700', 'contextuals', 'low'),
                    ('0f44aa68-64a8-4312-a46a-99f87ec4ac21', 'contextuals', 'low')]

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd)
        fpr.on_get_files_with_tags = lambda x, y: []

        for case in expected:
            rule = fpr.get_file_picking_rule(case[0])
            assert rule.rule_type == case[1]
            assert rule.resolution == case[2]

    def test_X_IN_context(self, cfg, urapdb, dsd, records, insert_data_xin):
        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()

        expected = [('2e4ff3be-86c2-704c-8dec-8695a571ac59', 'context', 'dummy'),  # that is exclusively in CC
                    ('780affa7-4ff9-4b42-9f5d-040235581ec9', 'context', 'dummy'),  # in CC-001 and so also in CC
                    ('14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700', 'contextuals', 'low'),
                    # that is in CC-001, CC and FA-001, FA
                    ('27002a9f-b2df-46fc-9150-56397ebc8870', 'contextuals', 'low'),  # exclusively in FA
                    ]
        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd)
        fpr.on_get_files_with_tags = lambda x, y: []

        for case in expected:
            rule = fpr.get_file_picking_rule(case[0])
            assert rule.rule_type == case[1], f" {case[0]} failed"
            assert rule.resolution == case[2], f" {case[0]} failed"

    def test_on_get_files_by_date(self, cfg, urapdb, dsd, records):
        def get_files_by_date(operator: str, dates: [datetime.datetime]) -> [str]:
            if operator == "<":
                return ['2e4ff3be-86c2-704c-8dec-8695a571ac59']
            elif operator == ">":
                return ['54a88243-ee06-46f3-90a1-8b7a648f99b8']
            elif operator == "within":
                return ['71b1f2b3-0e93-bf4d-b9a8-989700159beb']
            elif operator == "!within":
                return ['dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
            else:
                raise Exception("wrong operator")

        KioskSQLDb.run_sql_script(rules_set_by_date)
        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()
        expected = ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',  # that's the one that will have high resolution
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '54e828b3-a28a-1941-a385-f62fc6b430b7',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    'd7374deb-39d8-a648-9dac-fa62cf033c69',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd, recording_group="default")
        fpr.on_get_files_by_date = get_files_by_date

        rule = fpr.get_file_picking_rule("71b1f2b3-0e93-bf4d-b9a8-989700159beb")
        assert rule.order == 1
        assert rule.rule_type == "date"
        assert rule.resolution == "dummy"

        rule = fpr.get_file_picking_rule("dd26f0ec-bc94-554f-93df-2a3fe91dbc38")
        assert rule.order == 2
        assert rule.rule_type == "date"
        assert rule.resolution == "low1"

        rule = fpr.get_file_picking_rule("2e4ff3be-86c2-704c-8dec-8695a571ac59")
        assert rule.order == 3
        assert rule.rule_type == "date"
        assert rule.resolution == "low2"

        rule = fpr.get_file_picking_rule("54a88243-ee06-46f3-90a1-8b7a648f99b8")
        assert rule.order == 4
        assert rule.rule_type == "date"
        assert rule.resolution == "low3"

    def test_file_picking_rule_all(self, cfg, urapdb, dsd, records):

        KioskSQLDb.execute('''truncate table public.repl_file_picking_rules; INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
        VALUES ('FileMakerWorkstation', 'default', 0, 'all', null, null, 'high', false, null,
                'c2ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');
        ''')

        fid = FileIdentifierCache(dsd)
        files = fid.get_files_with_context()
        files.sort()
        expected = ['01d6a2e3-b510-dd4f-9f6a-e04a5f0032bb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '54e828b3-a28a-1941-a385-f62fc6b430b7',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    'd7374deb-39d8-a648-9dac-fa62cf033c69',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd)
        fpr.on_get_files_with_tags = lambda x, y: []
        for f in expected:
            rule = fpr.get_file_picking_rule(f)
            assert rule.order == 0
            assert rule.rule_type == "all"
            assert rule.resolution == "high"

        rule = fpr.get_file_picking_rule("1f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "high"

        KioskSQLDb.execute('''
            truncate table public.repl_file_picking_rules; 
            INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                                        disable_changes, misc, uid, created, modified, modified_by)
            VALUES ('FileMakerWorkstation', 'default', 0, 'contextuals', null, null, 'low', false, null,
                    'c1ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');
            INSERT INTO public.repl_file_picking_rules (workstation_type, recording_group, "order", rule_type, operator, value, resolution,
                                            disable_changes, misc, uid, created, modified, modified_by)
            VALUES ('FileMakerWorkstation', 'default', 1, 'all', null, null, 'high', false, null,
                'c2ad70a6-1e08-44ed-9f2c-bccb8be30fbd', '2021-02-18 17:41:31.281323', '2021-02-18 17:41:31.281323', 'sys');
        ''')

        fpr = KioskFilePicking("FileMakerWorkstation", fid, dsd)
        fpr.on_get_files_with_tags = lambda x, y: []
        for f in expected:
            rule = fpr.get_file_picking_rule(f)
            assert rule.order == 0
            assert rule.rule_type == "contextuals"
            assert rule.resolution == "low"

        rule = fpr.get_file_picking_rule("1f44aa68-64a8-4312-a46a-99f87ec4ac21")
        assert rule.order == 0
        assert rule.rule_type == "all"
        assert rule.resolution == "dummy"  # it is dummy because on level 1 the "ALL" rule is completely ignored,
        # so the default kicks in
