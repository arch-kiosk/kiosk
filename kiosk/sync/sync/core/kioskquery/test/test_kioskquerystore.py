import os

import pytest

import datetime

import yaml

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskquerystore import KioskQueryStore
from kioskquery.structuredkioskquery import StructuredKioskQuery
from kiosksqldb import KioskSQLDb
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
records_sql = os.path.join(test_path, r"sql", "records.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestKioskQueryResultSQL(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def urapdb(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def urapdb_without_migration(self, config):
        return self.get_urapdb(config, migration=False)

    @pytest.fixture()
    def dsd(self, urapdb_without_migration):
        return Dsd3Singleton.get_dsd3()

    def test_add_and_update(self, config, dsd, urapdb):
        KioskSQLDb.execute("delete from kiosk_queries")
        query_def = yaml.load("""
        header:
            version: 1
        meta:
            query_type: StructuredKioskQuery
        variables:
            locus_type: [datatype(VARCHAR)]
        queries:
            'loci_and_material_types':
                name: 'loci and material types'
                description: 'description of loci and material types'
                type: 'CQL'
                output_type: 'list'
                query: 
                    base: 
                        scope: 
                            locus: browse()
                        target:
                            field_or_instruction: collected_material.type
                        additional_fields: 
                            locus_type:
                                field_or_instruction: locus.type
                                default: ""
                            locus_identifier:
                                field_or_instruction: locus.identifier()
                                default: ""
                    query:
                        type: raw
                        distinct: true
                        columns:
                            "arch_context": 
                                source_field: locus_identifier
                            "collected_material_type": 
                                source_field: data
                            "uid": 
                                source_field: data_uuid
                        conditions:
                            ?: equals(locus_type, {{#locus_type}})
        """, yaml.BaseLoader)

        query = StructuredKioskQuery(query_def, dsd)
        KioskQueryStore.add(query)
        query_loaded = KioskQueryStore.get("loci_and_material_types")
        assert query_loaded
        assert query_loaded.query_definition.raw_query_definition == query.query_definition.raw_query_definition
        assert KioskQueryStore.list() == [
            ('loci_and_material_types', 'loci and material types', 'description of loci and material types')]

        query_def_2 = yaml.load("""
        header:
            version: 1
        meta:
            query_type: StructuredKioskQuery
        variables:
            locus_type: [datatype(VARCHAR)]
        queries:
            'loci_and_material_types':
                name: 'loci and material types updated'
                description: 'description of loci and material types updated'
                type: 'CQL'
                output_type: 'list'
                query: 
                    base: 
                        scope: 
                            locus: browse()
                        target:
                            field_or_instruction: collected_material.type
                        additional_fields: 
                            locus_type:
                                field_or_instruction: locus.type
                                default: ""
                            locus_identifier:
                                field_or_instruction: locus.identifier()
                                default: ""
                    query:
                        type: raw
                        distinct: true
                        columns:
                            "arch_context": 
                                source_field: locus_identifier
                            "collected_material_type": 
                                source_field: data
                            "uid": 
                                source_field: data_uuid
                        conditions:
                            ?: equals(locus_type, {{#locus_type}})
        """, yaml.BaseLoader)

        query2 = StructuredKioskQuery(query_def_2, dsd)
        KioskQueryStore.add_or_update(query2)
        query_loaded = KioskQueryStore.get("loci_and_material_types")
        assert query_loaded

        assert query_loaded.query_definition.query_name == 'loci and material types updated'
        assert query_loaded.query_definition.query_description == 'description of loci and material types updated'

    def test_add_and_update_from_file(self, config, dsd, urapdb):
        KioskSQLDb.execute("delete from kiosk_queries")
        query_def_1 = os.path.join(test_path, r"defs", "query_def_1.yml")
        query_def_1_update = os.path.join(test_path, r"defs", "query_def_1_update.yml")

        query = KioskQueryStore.add_or_update_from_file(query_def_1)
        query_loaded = KioskQueryStore.get("loci_and_material_types")
        assert query_loaded
        assert query_loaded.query_definition.raw_query_definition == query.query_definition.raw_query_definition
        assert KioskQueryStore.list() == [
            ('loci_and_material_types', 'loci and material types', 'description of loci and material types')]

        KioskQueryStore.add_or_update_from_file(query_def_1_update)
        query_loaded = KioskQueryStore.get("loci_and_material_types")
        assert query_loaded

        assert query_loaded.query_definition.query_name == 'loci and material types updated'
        assert query_loaded.query_definition.query_description == 'description of loci and material types updated'

    def test_add_and_update_from_path(self, config, dsd, urapdb):
        KioskSQLDb.execute("delete from kiosk_queries")
        KioskQueryStore.add_or_update_from_path(os.path.join(test_path, r"defs"), "query_def_1*.yml")
        query_loaded = KioskQueryStore.get("loci_and_material_types")
        assert query_loaded

        assert query_loaded.query_definition.query_name == 'loci and material types updated'
        assert query_loaded.query_definition.query_description == 'description of loci and material types updated'
