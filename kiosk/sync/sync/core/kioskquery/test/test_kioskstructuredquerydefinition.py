import os

import pytest
import yaml

import datetime

import kioskstdlib
from kioskquery.kioskquerylib import KioskQueryException
from kioskquery.structuredkioskquerydefinition import StructuredKioskQueryDefinition
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestStructuredKioskQueryDefinition(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    def test_init(self, config):

        # check that empty query fails
        with pytest.raises(KioskQueryException):
            query: StructuredKioskQueryDefinition = StructuredKioskQueryDefinition(query_definition={})

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
        query: StructuredKioskQueryDefinition = StructuredKioskQueryDefinition(query_definition=query_definition)
        assert query

    def test_init_with_variables(self, config):

        query_definition = yaml.load("""
        header:
            version: 1
        variables: 
            locus_type: [datatype(VARCHAR)]
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
        query: StructuredKioskQueryDefinition = StructuredKioskQueryDefinition(query_definition=query_definition)
        assert query
        assert query._variables.has_variable_declaration('locus_type')
        assert query._variables.get_variable_type('locus_type').lower() == 'varchar'

    def test_init_with_settings(self, config):

        query_definition = yaml.load("""
        header:
            version: 1
        settings: 
            locus_type: 'dp'
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
        query: StructuredKioskQueryDefinition = StructuredKioskQueryDefinition(query_definition=query_definition)
        assert query
        assert query._variables.has_variable_declaration('locus_type')
        assert query._variables.has_variable('locus_type')
        assert query._variables.get_variable_type('locus_type').lower() == 'varchar'

