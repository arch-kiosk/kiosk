import json
import os
import datetime
from pprint import pprint

import pytest
import yaml

from contextmanagement.contextquery import ContextQuery
from contextmanagement.contextquerybakery import ContextQueryBakery, CqlError
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")
sql_narrative_records = os.path.join(test_path, "sql", "records_unit_narrative.sql")


class TestKioskContextQueryBakery(KioskPyTestHelper):

    @staticmethod
    def formatter(r: dict):
        values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
        return ",".join(values)

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb

    def test_check_meta(self, config, dsd):
        cql = yaml.load("""not cql:""", yaml.FullLoader)
        with pytest.raises(CqlError):
            query = ContextQueryBakery(dsd).get_query(cql)

        cql = yaml.load("""
            cql:
                meta:
                    version: 1
                base:
                    something: asdf
                query:
                    something: asdf
        """, yaml.FullLoader)
        with pytest.raises(CqlError):
            query = ContextQueryBakery(dsd).get_query(cql)

        cql = yaml.load("""
            cql:
                meta:
                    version: 0.1
                base:
                    something: asdf
                query:
                    something: asdf
        """, yaml.FullLoader)

        query = ContextQueryBakery(dsd)
        query._set_cql(cql)
        assert query._check_meta()

    def test_check_bake_base(self, dsd):
        cql = yaml.load("""
            cql:
                meta:
                    version: 1
                base:
                    scope: unit_images
                    target:
                        something: nothing                    
                query: something
                
                    
        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        with pytest.raises(CqlError):
            bakery._set_cql(cql)
            query = bakery._prepare_base()

        cql = yaml.load("""
            cql:
                meta:
                    version: 1
                base:
                    scope: unit_images
                    target: 
                        field_or_instruction: modified()
                        format: datetime(date)                   
                query: something


        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        bakery._set_cql(cql)
        query = bakery._prepare_base()
        assert bakery._target_field_or_instruction == "modified()"
        assert bakery._target_format == "datetime(date)"

    def test_check_additional_fields(self, dsd):
        cql = yaml.load("""
            cql:
                meta:
                    version: 1
                base:
                    scope: unit_images
                    target:
                        field_or_instruction: modified()
                        format: datetime(date)
                    additional_fields: 
                        year: 
                           format: datetime(year)
                                               
                query: something


        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        with pytest.raises(CqlError):
            bakery._set_cql(cql)
            bakery._prepare_base()

        cql["cql"]["base"]["additional_fields"]["year"]["field_or_instruction"] = "modified()"
        with pytest.raises(CqlError):
            bakery._set_cql(cql)
            bakery._prepare_base()

        cql["cql"]["base"]["additional_fields"]["year"]["default"] = "\"\""
        bakery._set_cql(cql)
        bakery._prepare_base()

        cql = yaml.load("""
            cql:
                meta:
                    version: 1
                base:
                    scope: unit_images
                    target: 
                        field_or_instruction: modified()
                        format: datetime(date)
                    additional_fields:
                        year:
                            field_or_instruction: modified()
                            default: 1900
                            format: datetime(year)                   
                        month:
                            field_or_instruction: modified()
                            default: 1
                            format: datetime(month)                   
                        day:
                            field_or_instruction: modified()
                            default: 1
                            format: datetime(day)                   
                query: something


        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        bakery._set_cql(cql)
        bakery._prepare_base()
        assert bakery._additional_fields == [('modified()', 'year', 1900, 'datetime(year)'),
                                             ('modified()', 'month', 1, 'datetime(month)'),
                                             ('modified()', 'day', 1, 'datetime(day)')]

    def test_check_scope(self, dsd):
        cql = yaml.load("""
            cql:
                meta:
                    version: 1
                base:
                    scope: unknown_scope
                    target:
                        field_or_instruction: modified()
                        format: datetime(date)
                    additional_fields: 
                        year:
                            field_or_instruction: modified()
                            default: 1900
                            format: datetime(year)                   

                query: something


        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        with pytest.raises(CqlError):
            bakery._set_cql(cql)
            bakery._prepare_base()

        cql["cql"]["base"]["scope"] = "unit_images"
        bakery._set_cql(cql)
        bakery._prepare_base()
        assert bakery._kiosk_context
        assert bakery._kiosk_context.name == "unit_images"
        assert bakery._kiosk_context._graph.get_identifier_tables() == ["unit", "locus", "collected_material"]

        cql["cql"]["base"]["scope"] = {"unit": {"locus": {}, "dayplan": {}}}
        bakery._set_cql(cql)
        bakery._prepare_base()
        assert bakery._kiosk_context
        assert bakery._kiosk_context._graph.get_identifier_tables() == ["unit", "locus"]

    def test_check_get_query_class(self, dsd):
        cql = yaml.load("""
            cql:
                meta:
                    version: 1
                base:
                    scope: unknown_scope
                    target:
                        field_or_instruction: modified()
                        format: datetime(date)
                    additional_fields: 
                        year:
                            field_or_instruction: modified()
                            default: 1900
                            format: datetime(year)
                query:
                    something: useless                    
                


        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        with pytest.raises(CqlError):
            bakery._set_cql(cql)
            bakery._get_query_type()

        cql["cql"]["query"]["type"] = "raw"
        bakery = ContextQueryBakery(dsd)
        bakery._set_cql(cql)
        assert bakery._get_query_type() == ContextQuery

    def test_check_get_query(self, dsd, urapdb_with_records):
        cql = yaml.load("""
            cql:
                meta:
                    version: 0.1
                base:
                    scope: 
                        unit: browse()
                    target:
                        field_or_instruction: replfield_modified()
                        format: datetime(date)
                    additional_fields: 
                        year:
                            field_or_instruction: modified
                            default: 1900
                            format: datetime(year)
                query:
                    type: raw                    



        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        query = bakery.get_query(cql)
        assert query
        assert not query.distinct
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'year']
        try:
            records = list(query.records(formatter=self.formatter))
            assert len(records) == 25
        finally:
            query.close()

    def test_check_get_raw_query(self, dsd, urapdb_with_records):
        cql = yaml.load("""
            cql:
                meta:
                    version: 0.1
                base:
                    scope: 
                        unit: browse()
                    target:
                        field_or_instruction: replfield_modified()
                        format: datetime(date)
                    additional_fields: 
                        year:
                            field_or_instruction: modified
                            default: 1900
                            format: datetime(year)
                query:
                    type: raw
                    distinct: true
                    columns:
                      date:
                        source_field: data
                      year:
                        source_field: year
        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        query = bakery.get_query(cql)
        assert query
        assert query.distinct
        assert query.get_column_names() == ['date', 'year']
        try:
            records = list(query.records(formatter=self.formatter))
            assert len(records) == 8
        finally:
            query.close()

    def test_bake_raw_query_with_conditions(self, dsd, urapdb_with_records):
        cql = yaml.load("""
        cql:
            meta:
                version: 0.1
            base:
                scope: "browse()"
                target:
                    field_or_instruction: replfield_modified()
                    format: datetime(date)
                additional_fields:
                    year:
                        field_or_instruction: replfield_modified()
                        format: datetime(year)
                        default: 0
            query:
                type: raw
                distinct: true
                columns:
                  date:
                    source_field: data
                  year:
                    source_field: year
                conditions:
                    ?: inrange(year, 2019, 2019)    
                
        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        query = bakery.get_query(cql)
        assert query
        assert query.distinct
        try:
            records = list(query.records(formatter=self.formatter))
            pprint(records)
            assert len(records) == 6
        finally:
            query.close()

    def test_query_real_test_case_1(self, dsd, urapdb_with_records):
        # there is an issue with TEXT and VARCHAR types in the dsd. It should not make a difference if a type is text
        # or varchar for comparison. So if there is a modified_by field "text" and a modified_by field "varchar" in the
        # dsd, one must be able to use "modified_by" as an additional field. In the test_dsd3 dayplan and locus have "TEXT"
        # while the others have "varchar"
        cql = json.loads("""
{
  "cql": {
    "meta": {
      "version": 0.1
    },
    "base": {
      "scope": {
        "unit": "browse()"
      },
      "target": {
        "field_or_instruction": "modified",
        "format": "datetime(date)"
      },
      "additional_fields": {
        "year": {
          "field_or_instruction": "modified",
          "default": 0,
          "format": "datetime(year)"
        },
        "by": {
          "field_or_instruction": "modified_by",
          "default": "?"
        }
      }
    },
    "query": {
      "type": "Raw",
      "distinct": true,
      "columns": {
        "identifier": {
          "source_field": "identifier"
        },
        "modified": {
          "source_field": "data"
        },
        "by": {
          "source_field": "by"
        }
      },
      "conditions":{
              "?": "equals(year, 2019)"
      }
    }
  }
}
        """)
        bakery = ContextQueryBakery(dsd)
        query = bakery.get_query(cql)
        assert query
        assert query.distinct
        try:
            records = list(query.records(formatter=self.formatter))
            assert len(records) > 0
            pprint(records)
        finally:
            query.close()

    def test_check_get_direct_sql_query(self, dsd, urapdb_with_records):
        cql = yaml.load("""
            cql:
                meta:
                    version: 0.1
                base:
                    scope: 
                        unit: browse()
                    target:
                        field_or_instruction: replfield_modified()
                        format: datetime(date)
                    additional_fields: 
                        year:
                            field_or_instruction: modified
                            default: 1900
                            format: datetime(year)
                query:
                    type: DirectSqlQuery
                    sql: count(data) date_count from {base} where year = 2019
        """, yaml.FullLoader)
        bakery = ContextQueryBakery(dsd)
        query = bakery.get_query(cql)
        assert query
        try:
            records = list(query.records(formatter=self.formatter))
            assert query.get_column_names() == ['date_count']
            assert len(records) == 1
            assert records[0] == '16'
        finally:
            query.close()

    def test_query_real_test_case_2(self, dsd, urapdb_with_records):
        # The "identifier" field does not seem to have the right type attached to it. At least a condition for "identifier"
        # lacks the quotes around the string.

        KioskSQLDb.run_sql_script(sql_narrative_records)

        cql = json.loads("""
{
  "cql": {
    "base": {
      "scope": {
        "unit": {
          "unit_narrative": {
            "join": "inner(uid, uid_unit)"
          }
        }
      },
      "target": {
        "field_or_instruction": "narrative"
      },
      "additional_fields": {
        "modified": {
          "field_or_instruction": "modified",
          "default": "",
          "format": "datetime(date)"
        },
        "modified_by": {
          "field_or_instruction": "modified_by",
          "default": ""
        }
      }
    },
    "meta": {
      "version": 0.1
    },
    "query": {
      "columns": {
        "identifier": {
          "source_field": "identifier"
        },
        "modified": {
          "source_field": "modified"
        },
        "modified_by": {
          "source_field": "modified_by"
        },
        "narrative": {
          "source_field": "data"
        }
      },
       "conditions": {
        "AND":  [
          "equals(modified, '2019-01-10')",
          "equals(identifier, 'XX')"
        ]
      },
      "distinct": "True",
      "type": "Raw"
    }
  }
}
        """)
        bakery = ContextQueryBakery(dsd)
        query = bakery.get_query(cql)
        assert query
        assert query.distinct
        try:
            records = list(query.records(formatter=self.formatter))
            assert len(records) == 2
            pprint(records)
        finally:
            query.close()
