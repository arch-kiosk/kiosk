import os

import pytest
import yaml

import datetime

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.structuredkioskquery import StructuredKioskQuery
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestStructuredKioskQuery(KioskPyTestHelper):
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

        # check that empty query fails
        with pytest.raises(KioskQueryException):
            query: StructuredKioskQuery = StructuredKioskQuery(query_definition={}, dsd=dsd)

        # check that simple query instantiates
        query_definition = yaml.load("""
        header:
            version: 1
        queries:
            'all loci of type x':
                type: 'CQL'
                query: 
                    base:
                        scope:
                            locus
                        target:
                            field_or_instruction: locus.type
                        query:
                            type: Raw
                            conditions:
                                "?": equals('data', '{{#locus_type}}') 
                output_type: 'list'
        """, yaml.FullLoader)
        query: StructuredKioskQuery = StructuredKioskQuery(query_definition=query_definition, dsd=dsd)
        assert query

    def test_get_query_catalog(self, config, dsd):
        query_definition = yaml.load("""
        header:
            version: 1
        queries:
            'all loci of type x':
                type: 'CQL'
                query: 
                    cheating: yes 
                output_type: 'list'
            'all collected material of type y':
                type: 'CQL'
                query: 
                    cheating: yes 
                output_type: 'list'
            'some db variables':
                type: 'CQL'
                query: 
                    cheating: yes 
                output_type: 'key-value'
        """, yaml.FullLoader)
        query: StructuredKioskQuery = StructuredKioskQuery(query_definition=query_definition, dsd=dsd)
        assert query
        cat = query.get_query_catalog()
        assert len(cat) == 2
        assert cat[0] == 'all loci of type x'
        assert cat[1] == 'all collected material of type y'
