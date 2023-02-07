import os

import pytest

import datetime

import yaml

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.kioskqueryresultsql import KioskQueryResultSQL
from kioskquery.structuredkioskquery import StructuredKioskQuery
from kiosksqldb import KioskSQLDb
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
records_sql = os.path.join(test_path, r"sql", "records.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestStructuredKioskQuerySQL(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        try:
            os.remove(log_file)
        except BaseException as e:
            pass
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def urapdb(self, config):
        return self.get_urapdb(config)

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(records_sql)
        return urapdb

    @pytest.fixture()
    def urapdb_without_migration(self, config):
        return self.get_urapdb(config, migration=False)

    @pytest.fixture()
    def dsd(self, urapdb_without_migration):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, config, dsd, urapdb_with_records):
        query_def = yaml.load("""
        header:
            version: 1
        variables:
            locus_type: [datatype(VARCHAR)]
        queries:
            'loci_and_material_types':
                type: 'SQL'
                query: |
                    select distinct collected_material.uid, locus.arch_context, 
                    collected_material.type "collected_material_type" 
                    from {{locus}} locus 
                        inner join {{collected_material}} collected_material on locus.uid = collected_material.uid_locus  
                    where coalesce(locus.type,'')={{#locus_type}} and collected_material.type is not null 
                    order by locus.arch_context
                output_type: 'list'
                column_information:
                    arch_context: DSD("locus")
                    collected_material_type: DSD("collected_material", "type")
        """, yaml.BaseLoader)

        query = StructuredKioskQuery(query_def, dsd)
        ui = query.get_query_ui()
        ui.process_input({"locus_type": "dp"})

        query_result = query.execute("loci_and_material_types")
        assert query_result
        records = list(query_result.get_documents())

        assert len(records) == 5
        records.sort(key=lambda x: x["uid"])
        assert records == [{'arch_context': 'FA-059',
                            'collected_material_type': 'ceramic',
                            'uid': '0000e3eb-1919-4605-8a6f-3c94eee1c295'},
                           {'arch_context': '24-5-17',
                            'collected_material_type': 'faience',
                            'uid': '6605397e-0bb6-4848-bd4a-4042673cb25a'},
                           {'arch_context': 'FA-059',
                            'collected_material_type': 'stone',
                            'uid': '99f1dc56-09e4-4a88-b32e-060885825ed2'},
                           {'arch_context': '24-5-17',
                            'collected_material_type': 'mud',
                            'uid': 'c2e5b22d-ef58-40c6-9db3-aaaeb367924b'},
                           {'arch_context': 'FA-059',
                            'collected_material_type': 'ceramic',
                            'uid': 'dfba68fe-d261-4167-9523-6dc8c3ba18fd'}]

        assert query_result.get_document_information()["query"]["type"] == "StructuredKioskQuery"
        assert query_result.get_document_information()["columns"] == {
            'arch_context': {'datatype': 'VARCHAR', 'identifier': True},
            'collected_material_type': {'datatype': 'VARCHAR', 'identifier': False}
        }
        assert len(records) > 0

        dsd_info = list(query_result.get_DSD_information().keys())
        dsd_info.sort()
        assert dsd_info == ["collected_material", "locus"]
