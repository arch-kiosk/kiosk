import os

import pytest
import logging

from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper

from fts.ftstableindexer import FTSTableIndexer
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFTSTableIndexer(KioskPyTestHelper):

    @pytest.fixture(scope="function")
    def cfg(self):
        return self.get_standard_test_config(__file__, test_config_file="test_kiosk_config.yml")

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="function")
    def dsd(self, cfg):
        Dsd3Singleton.release_dsd3()
        return self.get_dsd(cfg)

    def test_init(self, dsd):
        indexer = FTSTableIndexer()
        assert indexer

    def test__exclude_field(self, cfg):
        indexer = FTSTableIndexer()
        assert indexer._exclude_field(["datatype(varchar)", "replfield_modified_by()"])
        assert indexer._exclude_field(["datatype(varchar)", "id_domain()"])
        assert not indexer._exclude_field(["datatype(varchar)", "replfield_uuid()"])

    def test__get_ft_fields(self, dsd):
        indexer = FTSTableIndexer()
        fields = list(indexer._get_fts_fields("collected_material"))
        assert fields == [('external_id', 'B'),
                          ('type', 'B'),
                          ('material_specified', 'B'),
                          ('cm_type', 'B'),
                          ('description', 'B'),
                          ('storage', 'B'),
                          ('pottery_remarks', 'B'),
                          ('status_done', 'B'),
                          ('status_todo', 'B'),
                          ('dearregistrar', 'B'),
                          ('period', 'B'),
                          ('collection_method', 'B'),
                          ('analysis_method', 'B'),
                          ('arch_context', 'B')]

    def test__get_ft_fields_exclude_some(self, dsd):
        instructions: list = dsd._dsd_data.get(["collected_material", "structure", 7, "status_todo"])
        instructions.append("fts('-')")
        dsd._dsd_data.set(["collected_material", "structure", 7, "status_todo"], instructions)
        dsd._dsd_data.set(["collected_material", "structure", 7, "status_done"], instructions)
        assert dsd._dsd_data.get(["collected_material", "structure", 7, "status_done"]) == ["datatype(VARCHAR)",
                                                                                            "fts('-')"]
        indexer = FTSTableIndexer()
        fields = list(indexer._get_fts_fields("collected_material"))
        assert fields == [('external_id', 'B'),
                          ('type', 'B'),
                          ('material_specified', 'B'),
                          ('cm_type', 'B'),
                          ('description', 'B'),
                          ('storage', 'B'),
                          ('pottery_remarks', 'B'),
                          ('dearregistrar', 'B'),
                          ('period', 'B'),
                          ('collection_method', 'B'),
                          ('analysis_method', 'B'),
                          ('arch_context', 'B')]

    def test__get_ft_fields_exclude_additional_defaults(self, dsd, cfg):
        cfg.kiosk["queryandviewplugin"]["fts"] = {"language": "english", "default_weight": "B",
                                                  "skip_by_instruction": ['identifier("additional']}
        indexer = FTSTableIndexer()
        fields = list(indexer._get_fts_fields("collected_material"))
        assert fields == [
            ('type', 'B'),
            ('material_specified', 'B'),
            ('cm_type', 'B'),
            ('description', 'B'),
            ('storage', 'B'),
            ('pottery_remarks', 'B'),
            ('status_done', 'B'),
            ('status_todo', 'B'),
            ('dearregistrar', 'B'),
            ('period', 'B'),
            ('collection_method', 'B'),
            ('analysis_method', 'B'),
            ('arch_context', 'B')]

    def test__get_fts_sql_and_params(self, dsd, cfg):
        indexer = FTSTableIndexer()
        sql, params = indexer._get_fts_sql_and_params("collected_material")
        assert sql == "alter table \"collected_material\" add column fts tsvector generated always as " \
                      "(setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s')) stored;"
        assert params == ['external_id',
                          'B',
                          'type',
                          'B',
                          'material_specified',
                          'B',
                          'cm_type',
                          'B',
                          'description',
                          'B',
                          'storage',
                          'B',
                          'pottery_remarks',
                          'B',
                          'status_done',
                          'B',
                          'status_todo',
                          'B',
                          'dearregistrar',
                          'B',
                          'period',
                          'B',
                          'collection_method',
                          'B',
                          'analysis_method',
                          'B',
                          'arch_context',
                          'B']

    def test__get_fts_sql_and_params_with_different_weights(self, dsd, cfg):
        instructions: list = dsd._dsd_data.get(["collected_material", "structure", 7, "status_todo"])
        instructions.append("fts('-')")
        dsd._dsd_data.set(["collected_material", "structure", 7, "status_todo"], instructions)
        dsd._dsd_data.set(["collected_material", "structure", 7, "status_done"], instructions)

        instructions: list = dsd._dsd_data.get(["collected_material", "structure", 7, "description"])
        instructions.append("fts('A')")
        dsd._dsd_data.set(["collected_material", "structure", 7, "description"], instructions)

        indexer = FTSTableIndexer()
        sql, params = indexer._get_fts_sql_and_params("collected_material")
        assert sql == "alter table \"collected_material\" add column fts tsvector generated always as " \
                      "(setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s') || " \
                      "setweight(to_tsvector('english', coalesce(%s, '')), '%s')) stored;"
        assert params == ['external_id',
                          'B',
                          'type',
                          'B',
                          'material_specified',
                          'B',
                          'cm_type',
                          'B',
                          'description',
                          'A',
                          'storage',
                          'B',
                          'pottery_remarks',
                          'B',
                          'dearregistrar',
                          'B',
                          'period',
                          'B',
                          'collection_method',
                          'B',
                          'analysis_method',
                          'B',
                          'arch_context',
                          'B']

    def test_table_has_fts(self, dsd):
        indexer = FTSTableIndexer()
        assert indexer.table_has_fts("collected_material")
        assert indexer.table_has_fts("locus")
        assert not indexer.table_has_fts("kiosk_user")

        v = dsd.get_current_version("tagging")
        instructions: list = dsd._dsd_data.get(["tagging", "structure", v, "tag"])
        instructions.append("fts('-')")
        dsd._dsd_data.set(["tagging", "structure", v, "tag"], instructions)

        instructions: list = dsd._dsd_data.get(["tagging", "structure", v, "description"])
        instructions.append("fts('-')")
        dsd._dsd_data.set(["tagging", "structure", v, "description"], instructions)

        instructions: list = dsd._dsd_data.get(["tagging", "structure", v, "source_table"])
        instructions.append("fts('-')")
        dsd._dsd_data.set(["tagging", "structure", v, "source_table"], instructions)

        assert not indexer.table_has_fts("tagging")

    def test_get_sql_document_column_from_table(self, dsd):
        indexer = FTSTableIndexer()
        sql = indexer.get_sql_document_column_from_table("collected_material")
        assert sql == ('coalesce("external_id", \'\') || coalesce("type", \'\') || '
                       'coalesce("material_specified", \'\') || coalesce("cm_type", \'\') || '
                       'coalesce("description", \'\') || coalesce("storage", \'\') || '
                       'coalesce("pottery_remarks", \'\') || coalesce("status_done", \'\') || '
                       'coalesce("status_todo", \'\') || coalesce("dearregistrar", \'\') || '
                       'coalesce("period", \'\') || coalesce("collection_method", \'\') || '
                       'coalesce("analysis_method", \'\') || coalesce("arch_context", \'\') doc')
