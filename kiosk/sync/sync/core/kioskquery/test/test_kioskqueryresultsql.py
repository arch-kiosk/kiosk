import os

import pytest

import datetime

import yaml

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskqueryresultsql import KioskQueryResultSQL
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

    def test_init(self, config, dsd):
        simple_query = yaml.load("""
        type: 'SQL'
        query: "
            select arch_context from {{locus}} locus
            where locus.type='{{#locus_type}}'
            "
        output_type: 'list'
        """, yaml.BaseLoader)

        query_result = KioskQueryResultSQL(dsd, {"type": "KioskQuerySQL"},
                                           "select" + """arch_context from locus "locus" where 
        locus.type='dp'""", simple_query)

        assert query_result

    def test_column_information_dsd(self, config, dsd):
        simple_query = yaml.load("""
        type: 'SQL'
        query: |
            select arch_context, type "locus_type" from {{locus}} locus
            where locus.type='{{#locus_type}}'
        output_type: 'list'
        column_information:
            arch_context: DSD('locus')
            locus_type: DSD('locus','type')
        """, yaml.BaseLoader)

        query_result = KioskQueryResultSQL(dsd, {"type": "KioskQuerySQL"},
                                           "select " + """arch_context from locus "locus" where 
        locus.type='dp'""", simple_query)

        assert query_result
        assert len(query_result._column_information) == 2
        assert 'identifier()' in query_result._column_information["arch_context"]
        assert 'datatype(VARCHAR)' in query_result._column_information["arch_context"]
        assert 'datatype(VARCHAR)' in query_result._column_information["locus_type"]
        assert "locus" in query_result._included_dsd_tables

    def test_column_information_without_dsd(self, config, dsd):
        simple_query = yaml.load("""
        type: 'SQL'
        query: |
            select arch_context, type "locus_type" from {{locus}} locus
            where locus.type='{{#locus_type}}'
        output_type: 'list'
        column_information:
            arch_context: [datatype(VARCHAR), identifier()]
            locus_type: [datatype(VARCHAR)]
        dsd_includes:
            - locus
        """, yaml.BaseLoader)

        query_result = KioskQueryResultSQL(dsd, {"type": "KioskQuerySQL"},
                                           "select " + """arch_context from locus "locus" where 
        locus.type='dp'""", simple_query)

        assert query_result
        assert len(query_result._column_information) == 2
        assert 'identifier()' in query_result._column_information["arch_context"]
        assert 'datatype(VARCHAR)' in query_result._column_information["arch_context"]
        assert 'datatype(VARCHAR)' in query_result._column_information["locus_type"]
        assert "locus" in query_result._included_dsd_tables

    def test_get_DSD_information(self, config, dsd):
        simple_query = yaml.load("""
        type: 'SQL'
        query: |
            select distinct locus.arch_context, collected_material.type "collected_material_type" from {{locus}} locus 
                inner join {{collected_material}} collected_material on locus.uid = collected_material.uid_locus  
            where locus.type='{{#locus_type}} order by locus.arch_context'
        output_type: 'list'
        column_information:
            arch_context: DSD("locus")
            collected_material_type: DSD("collected_material", "type")
        """, yaml.BaseLoader)

        query_result = KioskQueryResultSQL(dsd, {"type": "KioskQuerySQL"}, "select" + """"
         distinct locus.arch_context, collected_material.type "collected_material_type" from "locus" locus
                inner join "collected_material" collected_material on locus.uid = collected_material.uid_locus
            where locus.type='dp' order by arch_context""", simple_query)

        assert query_result
        assert len(query_result._column_information) == 2
        assert 'identifier()' in query_result._column_information["arch_context"]
        assert 'datatype(VARCHAR)' in query_result._column_information["collected_material_type"]
        assert "locus" in query_result._included_dsd_tables
        assert "collected_material" in query_result._included_dsd_tables

        dsd_information = query_result.get_DSD_information()
        assert dsd_information
        assert "locus" in dsd_information
        assert "collected_material" in dsd_information

    def test_get_document_information(self, config, dsd):
        simple_query = yaml.load("""
        type: 'SQL'
        query: |
            select distinct locus.arch_context, collected_material.type "collected_material_type" from {{locus}} locus 
                inner join {{collected_material}} collected_material on locus.uid = collected_material.uid_locus  
            where locus.type='{{#locus_type}} order by locus.arch_context'
        output_type: 'list'
        column_information:
            arch_context: DSD("locus")
            collected_material_type: DSD("collected_material", "type")
        """, yaml.BaseLoader)

        query_result = KioskQueryResultSQL(dsd, {"type": "KioskQuerySQL"},"select" + """"
         distinct locus.arch_context, collected_material.type "collected_material_type" from "locus" locus
                inner join "collected_material" collected_material on locus.uid = collected_material.uid_locus
            where locus.type='dp' order by arch_context""", simple_query)

        assert query_result
        assert len(query_result._column_information) == 2
        assert 'identifier()' in query_result._column_information["arch_context"]
        assert 'datatype(VARCHAR)' in query_result._column_information["collected_material_type"]
        assert "locus" in query_result._included_dsd_tables
        assert "collected_material" in query_result._included_dsd_tables

        doc_information = query_result.get_document_information()
        assert "collected_material_type" in doc_information["columns"].keys()
        assert "arch_context" in doc_information["columns"].keys()
        assert doc_information["columns"]["collected_material_type"] == {'datatype': 'VARCHAR', 'identifier': False}
        assert doc_information["columns"]["arch_context"] == {'datatype': 'VARCHAR', 'identifier': True}
        assert doc_information["query"] == {"type": "KioskQuerySQL"}

    def test_execute_1(self, config, urapdb, dsd):
            simple_query = yaml.load("""
        type: 'SQL'
        query: |
            select arch_context, "type" "locus_type" from {{locus}} locus
            where locus.type='{{#locus_type}}'
        output_type: 'list'
        column_information:
            arch_context: DSD(locus)
            locus_type: DSD(locus, type)
        """, yaml.BaseLoader)

            query_result = KioskQueryResultSQL(dsd, {"type": "KioskQuerySQL"},
                                               "select " + """arch_context, "type" "locus_type" from locus "locus" where 
        locus.type='dp'""", simple_query)

            assert query_result
            assert len(query_result._column_information) == 2

            docs = list(query_result.get_documents())
            assert query_result.overall_record_count == 0

            KioskSQLDb.run_sql_script(records_sql)

            docs = list(query_result.get_documents())
            assert query_result.overall_record_count == 2
            assert query_result.page_count == 1
