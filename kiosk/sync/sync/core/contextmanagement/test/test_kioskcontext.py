import datetime
import logging
import os
from pprint import pprint

import pytest

import kioskstdlib
from contextmanagement.sqlfieldformatters import SqlFieldFormatterDateTime, SqlFieldFormatterLookupType
from contextmanagement.contextquery import ContextQuery
from contextmanagement.kioskcontext import KioskContext, \
    KioskContextDuplicateInstructionError, ContextTypeInfo, KioskContextError, KioskContextTypeError
from contextmanagement.sqlsourcecached import SqlSourceCached
from contextmanagement.sqlsourceinmemory import SqlSourceInMemory
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")


class TestKioskContext(KioskPyTestHelper):

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

    def test_type_info(self, config, dsd):
        type_info = ContextTypeInfo(dsd.get_field_datatype)
        assert type_info.get_type("type") == ""
        type_info.add_type("type", "locus")
        assert type_info.get_type("type") == "varchar"
        type_info.add_type("type", "unit")
        assert type_info.get_type("type") == "varchar"

        type_info.add_type("id", "locus_types")
        assert type_info.get_type("id") == "varchar"

        with pytest.raises(TypeError):
            type_info.add_type("id", "locus")

        another_type_info = ContextTypeInfo(dsd.get_field_datatype)
        another_type_info.add_type("type", "locus")
        another_type_info.add_type("type", "unit")
        another_type_info.add_type("brick_size", "locus_architecture")
        another_type_info.append_to(type_info)
        assert type_info.get_type("brick_size") == "varchar"

        another_type_info.append_to(type_info)
        assert type_info.get_type("brick_size") == "varchar"
        assert type_info._types == {'brick_size': 'varchar', 'id': 'varchar', 'type': 'varchar'}

        another_type_info._types["type"] = 'int'
        with pytest.raises(TypeError):
            another_type_info.append_to(type_info)

    def test_type_info_with_alias(self, config, dsd):
        type_info = ContextTypeInfo(dsd.get_field_datatype)
        assert type_info.get_type("alias_type") == ""
        type_info.add_type("type", "locus", field_alias="alias_type")
        assert type_info.get_type("alias_type") == "varchar"
        type_info.add_type("type", "unit", field_alias="alias_type")
        assert type_info.get_type("alias_type") == "varchar"

        type_info.add_type("id", "locus_types", field_alias="alias_id")
        assert type_info.get_type("alias_id") == "varchar"

        with pytest.raises(TypeError):
            type_info.add_type("id", "locus", field_alias="alias_id")

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb

    def test__get_field_or_instruction(self, dsd):
        context = KioskContext("some name", dsd)
        assert context._get_field_or_instructions("unit", "uid") == ["uid"]
        assert context._get_field_or_instructions("unit", "nope") == []
        assert context._get_field_or_instructions("unit", "identifier()") == ["arch_context"]
        assert context._get_field_or_instructions("unit", "nonsense()") == []

    def test__get_table_and_field(self):
        assert KioskContext._get_table_and_field("locus") == ("", "locus")
        assert KioskContext._get_table_and_field("locus.uid") == ("locus", "uid")
        assert KioskContext._get_table_and_field("locus.some_function(\"something else\")") == (
            "locus", "some_function(\"something else\")")
        assert KioskContext._get_table_and_field("some_function(locus.data)") == ("", "some_function(locus.data)")

    def test__get_selects(self, dsd):
        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    }
                }
            }
        }
        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        sql = context._get_selects('FA', 'uid_file()')
        assert sql == ['select distinct "unit"."arch_context" "identifier","unit"."uid" '
                       '"id_uuid","locus_photo"."uid_image" "data","locus_photo"."uid" '
                       '"data_uuid",false "primary",\'locus_photo\' '
                       '"record_type","locus"."arch_context" "primary_identifier","locus"."uid" '
                       '"primary_identifier_uuid" from unit inner join "locus" on '
                       '"unit"."uid"="locus"."uid_unit" inner join "locus_photo" on '
                       '"locus"."uid"="locus_photo"."uid_locus" where coalesce( '
                       '"unit"."arch_context", \'\') ilike \'FA\' AND "locus_photo"."uid_image" is '
                       'not null',
                       'select distinct "unit"."arch_context" "identifier","unit"."uid" '
                       '"id_uuid","dayplan"."uid_image" "data","dayplan"."uid" "data_uuid",true '
                       '"primary",\'dayplan\' "record_type","unit"."arch_context" '
                       '"primary_identifier","unit"."uid" "primary_identifier_uuid" from unit inner '
                       'join "dayplan" on "unit"."uid"="dayplan"."uid_unit" where coalesce( '
                       '"unit"."arch_context", \'\') ilike \'FA\' AND "dayplan"."uid_image" is not '
                       'null']
        cur = KioskSQLDb.execute_return_cursor(sql[0])
        cur.close()
        cur = KioskSQLDb.execute_return_cursor(sql[1])
        cur.close()

    def test__get_selects_with_additional_fields(self, dsd):
        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    }
                }
            }
        }
        context = KioskContext("context_name", dsd)
        context._additional_fields = [("describes_file()", "description", "''"),
                                      ("created", "created", "null")]
        context.from_dict(context_data["context_name"])
        sql = context._get_selects('FA', 'uid_file()')
        assert sql == ['select distinct "unit"."arch_context" "identifier","unit"."uid" '
                       '"id_uuid","locus_photo"."uid_image" "data","locus_photo"."uid" '
                       '"data_uuid",false "primary",\'locus_photo\' '
                       '"record_type","locus"."arch_context" "primary_identifier","locus"."uid" '
                       '"primary_identifier_uuid","locus_photo"."description" '
                       '"description","locus_photo"."created" "created" from unit inner join "locus" '
                       'on "unit"."uid"="locus"."uid_unit" inner join "locus_photo" on '
                       '"locus"."uid"="locus_photo"."uid_locus" where coalesce( '
                       '"unit"."arch_context", \'\') ilike \'FA\' AND "locus_photo"."uid_image" is '
                       'not null',
                       'select distinct "unit"."arch_context" "identifier","unit"."uid" '
                       '"id_uuid","dayplan"."uid_image" "data","dayplan"."uid" "data_uuid",true '
                       '"primary",\'dayplan\' "record_type","unit"."arch_context" '
                       '"primary_identifier","unit"."uid" '
                       '"primary_identifier_uuid","dayplan"."image_description" '
                       '"description","dayplan"."created" "created" from unit inner join "dayplan" '
                       'on "unit"."uid"="dayplan"."uid_unit" where coalesce( "unit"."arch_context", '
                       '\'\') ilike \'FA\' AND "dayplan"."uid_image" is not null']
        cur = KioskSQLDb.execute_return_cursor(sql[0])
        cur.close()
        cur = KioskSQLDb.execute_return_cursor(sql[1])
        cur.close()

    def test_select_query_in_memory(self, dsd, urapdb_with_records):
        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        }
                    }
                }
            }
        }
        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        sql_source = context.select(identifier="FA", field_or_instruction="uid_file()",
                                    sql_source_class=SqlSourceInMemory)
        query = ContextQuery(sql_source)
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid']
        c = 0
        for r in query.records():
            c = c + 1
        assert c == 4
        query.close()

        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        query = ContextQuery(context.select("CC", "uid_file()", sql_source_class=SqlSourceInMemory))
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid']
        c = 0
        for r in query.records():
            c = c + 1
        assert c == 2

    def test_select_query_in_memory_with_additional_fields(self, dsd, urapdb_with_records):
        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    }
                }
            }
        }
        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        query = ContextQuery(context.select("FA", "uid_file()",
                                            sql_source_class=SqlSourceInMemory,
                                            additional_fields=[("describes_file()", "description", "''"),
                                                               ("created", "created", "null")]))

        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'description',
                                            'created']
        assert query._selects.get_source_selects() == [
            'select distinct "unit"."arch_context" "identifier","unit"."uid" '
            '"id_uuid","locus_photo"."uid_image" "data","locus_photo"."uid" '
            '"data_uuid",false "primary",\'locus_photo\' '
            '"record_type","locus"."arch_context" "primary_identifier","locus"."uid" '
            '"primary_identifier_uuid","locus_photo"."description" '
            '"description","locus_photo"."created" "created" from unit inner join "locus" '
            'on "unit"."uid"="locus"."uid_unit" inner join "locus_photo" on '
            '"locus"."uid"="locus_photo"."uid_locus" where coalesce( '
            '"unit"."arch_context", \'\') ilike \'FA\' AND "locus_photo"."uid_image" is '
            'not null',
            'select distinct "unit"."arch_context" "identifier","unit"."uid" '
            '"id_uuid","dayplan"."uid_image" "data","dayplan"."uid" "data_uuid",true '
            '"primary",\'dayplan\' "record_type","unit"."arch_context" '
            '"primary_identifier","unit"."uid" '
            '"primary_identifier_uuid","dayplan"."image_description" '
            '"description","dayplan"."created" "created" from unit inner join "dayplan" '
            'on "unit"."uid"="dayplan"."uid_unit" where coalesce( "unit"."arch_context", '
            '\'\') ilike \'FA\' AND "dayplan"."uid_image" is not null']
        c = 0
        for r in query.records():
            assert r["created"]
            assert "description" in r
            c = c + 1
        assert c == 7
        query.close()

        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        query = ContextQuery(context.select("CC", "uid_file()",
                                            sql_source_class=SqlSourceInMemory,
                                            additional_fields=[("describes_file()", "description", "''"),
                                                               ("created", "created", "null")]))

        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'description',
                                            'created']
        assert query._selects.get_source_selects() == [
            'select distinct "unit"."arch_context" "identifier","unit"."uid" '
            '"id_uuid","locus_photo"."uid_image" "data","locus_photo"."uid" '
            '"data_uuid",false "primary",\'locus_photo\' '
            '"record_type","locus"."arch_context" "primary_identifier","locus"."uid" '
            '"primary_identifier_uuid","locus_photo"."description" '
            '"description","locus_photo"."created" "created" from unit inner join "locus" '
            'on "unit"."uid"="locus"."uid_unit" inner join "locus_photo" on '
            '"locus"."uid"="locus_photo"."uid_locus" where coalesce( '
            '"unit"."arch_context", \'\') ilike \'CC\' AND "locus_photo"."uid_image" is '
            'not null',
            'select distinct "unit"."arch_context" "identifier","unit"."uid" '
            '"id_uuid","dayplan"."uid_image" "data","dayplan"."uid" "data_uuid",true '
            '"primary",\'dayplan\' "record_type","unit"."arch_context" '
            '"primary_identifier","unit"."uid" '
            '"primary_identifier_uuid","dayplan"."image_description" '
            '"description","dayplan"."created" "created" from unit inner join "dayplan" '
            'on "unit"."uid"="dayplan"."uid_unit" where coalesce( "unit"."arch_context", '
            '\'\') ilike \'CC\' AND "dayplan"."uid_image" is not null']
        c = 0
        for r in query.records():
            assert r["created"]
            if r["record_type"] == "dayplan":
                assert r["description"]
            c = c + 1
        assert c == 4

    def test_select_query_cached(self, dsd, urapdb_with_records):
        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    }
                }
            }
        }
        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        # noinspection PyTypeChecker
        selects: SqlSourceCached = context.select("FA", "uid_file()",
                                                  sql_source_class=SqlSourceCached,
                                                  additional_fields=[("describes_file()", "description", "''"),
                                                                     ("created", "created", "null")])
        query = ContextQuery(selects)

        selects.invalidate_cache()
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'description',
                                            'created']

        c = 0
        for r in query.records():
            assert r["created"]
            assert "description" in r
            c = c + 1
        assert c == 7
        selects.invalidate_cache()
        query.close()

        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        query = ContextQuery(context.select("CC", "uid_file()",
                                            sql_source_class=SqlSourceCached,
                                            additional_fields=[("describes_file()", "description", "''"),
                                                               ("created", "created", "null")]))
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'description',
                                            'created']
        assert query._selects.get_source_selects() == [
            'select distinct "unit"."arch_context" "identifier","unit"."uid" '
            '"id_uuid","locus_photo"."uid_image" "data","locus_photo"."uid" '
            '"data_uuid",false "primary",\'locus_photo\' '
            '"record_type","locus"."arch_context" "primary_identifier","locus"."uid" '
            '"primary_identifier_uuid","locus_photo"."description" '
            '"description","locus_photo"."created" "created" from unit inner join "locus" '
            'on "unit"."uid"="locus"."uid_unit" inner join "locus_photo" on '
            '"locus"."uid"="locus_photo"."uid_locus" where coalesce( '
            '"unit"."arch_context", \'\') ilike \'CC\' AND "locus_photo"."uid_image" is '
            'not null',
            'select distinct "unit"."arch_context" "identifier","unit"."uid" '
            '"id_uuid","dayplan"."uid_image" "data","dayplan"."uid" "data_uuid",true '
            '"primary",\'dayplan\' "record_type","unit"."arch_context" '
            '"primary_identifier","unit"."uid" '
            '"primary_identifier_uuid","dayplan"."image_description" '
            '"description","dayplan"."created" "created" from unit inner join "dayplan" '
            'on "unit"."uid"="dayplan"."uid_unit" where coalesce( "unit"."arch_context", '
            '\'\') ilike \'CC\' AND "dayplan"."uid_image" is not null']
        c = 0
        for r in query.records():
            assert r["created"]
            if r["record_type"] == "dayplan":
                assert r["description"]
            c = c + 1
        assert c == 4

    def test_select_query_in_memory_duplicate_instruction(self, dsd, urapdb_with_records):
        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    }
                }
            }
        }
        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        logging.warning(f"Test")
        with pytest.raises(KioskContextDuplicateInstructionError):
            query = ContextQuery(context.select("FA", "test_duplicate()",
                                                sql_source_class=SqlSourceInMemory))

        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    }
                }
            }
        }
        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        logging.warning(f"Test")
        query = ContextQuery(context.select("FA", "uid_file()",
                                            sql_source_class=SqlSourceInMemory))

        with pytest.raises(KioskContextDuplicateInstructionError):
            query = ContextQuery(context.select("FA", "uid_file()",
                                                sql_source_class=SqlSourceInMemory,
                                                additional_fields=[("test_duplicate()", "test", "")]))

    def test_select_all_query_cached(self, dsd, urapdb_with_records):
        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    }
                }
            }
        }
        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        # noinspection PyTypeChecker
        selects: SqlSourceCached = context.select_all("uid_file()",
                                                      sql_source_class=SqlSourceCached,
                                                      additional_fields=[("describes_file()", "description", "''"),
                                                                         ("created", "created", "null")])
        query = ContextQuery(selects)
        selects.invalidate_cache()
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'description',
                                            'created']

        c = 0
        for r in query.records():
            assert r["created"]
            assert "description" in r
            c = c + 1
        assert c == 11

    def test_select_all_modified_records(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        context_data = {
            "context_name": {
                "type": "modified records",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    },
                }
            }
        }

        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        # noinspection PyTypeChecker
        context.register_output_formatter("lookup_type", SqlFieldFormatterLookupType(dsd))
        query = ContextQuery(context.select_all("modified",
                                                sql_source_class=SqlSourceInMemory,
                                                additional_fields=[
                                                    ("identifier()", "arch_context", "null", "lookup_type(unit)")]))

        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'arch_context']

        result = list(query.records(formatter=formatter))
        assert len(result) == 19
        for r in result:
            print(r, end="\n")

    def test_select_all_modified_records_from_several_origins(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        unit_context_def = {
            "unit_context": {
                "type": "modified records",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {},
                        },
                        "dayplan": {}
                    },
                }
            }
        }
        locus_context_def = {
            "locus_context": {
                "type": "modified records",
                "scope": {
                    "locus": {
                        "locus_photo": {}
                    },
                }
            }
        }
        unit_context = KioskContext("unit_context", dsd)
        unit_context.from_dict(unit_context_def["unit_context"])
        locus_context = KioskContext("locus_context", dsd)
        locus_context.from_dict(locus_context_def["locus_context"])
        result = unit_context.select_all("identifier()",
                                         sql_source_class=SqlSourceInMemory,
                                         additional_fields=[("modified", "arch_context", "null")])
        result.add_source(locus_context.select_all("identifier()",
                                                   sql_source_class=SqlSourceInMemory,
                                                   additional_fields=[("modified", "arch_context", "null")]))
        query = ContextQuery(result)
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'arch_context']

        result = list(query.records(formatter=formatter))
        for r in result:
            print(r, end="\n")
        assert len(result) == 14

    def test_select_all_modified_records_from_auto_scope(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        unit_context_def = {
            "unit_context": {
                "type": "modified records",
                "scope": {
                    "unit": "browse()"
                }
            }
        }

        unit_context = KioskContext("unit_context", dsd)
        unit_context.from_dict(unit_context_def["unit_context"])
        result = unit_context.select_all("modified",
                                         sql_source_class=SqlSourceInMemory,
                                         )

        query = ContextQuery(result)
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid']

        result = list(query.records(formatter=formatter))
        for r in result:
            print(r, end="\n")
        assert len(result) == 25

    def test_auto_scope_and_conditions(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        unit_context_def = {
            "unit_context": {
                "type": "modified records",
                "scope": {
                    "unit": "browse()"
                }
            }
        }

        unit_context = KioskContext("unit_context", dsd)
        unit_context.from_dict(unit_context_def["unit_context"])
        unit_context.register_output_formatter("lookup_type", SqlFieldFormatterLookupType(dsd))
        sources = unit_context.select_all("modified",
                                          sql_source_class=SqlSourceInMemory,
                                          additional_fields=[("type", "type", "", "lookup_type(unit)")]
                                          )
        query = ContextQuery(sources)

        query.add_conditions({"?": "equals(type, deposit)"})
        result = list(query.records(formatter=formatter))
        for r in result:
            print(r, end="\n")
        assert len(result) == 1

    def test_query_particular_field(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        unit_context_def = {
            "unit_context": {
                "type": "modified records",
                "scope": {
                    "unit": "browse()"
                }
            }
        }

        unit_context = KioskContext("unit_context", dsd)
        unit_context.from_dict(unit_context_def["unit_context"])
        query = ContextQuery(unit_context.select_all(field_or_instruction="locus.type",
                                                     sql_source_class=SqlSourceInMemory
                                                     ))

        query.add_conditions({"?": "equals('data', 'deposit')"})
        result = list(query.records(formatter=formatter))
        for r in result:
            print(r, end="\n")
        assert len(result) == 1

        # test if querying "type" in all of the context is indeed different than querying
        # type only from locus. There are only two loci with a type but also a unit with a type

        # Let's make sure first the unit and the two loci are both being found:
        query = ContextQuery(unit_context.select_all(field_or_instruction="type",
                                                     sql_source_class=SqlSourceInMemory
                                                     ))

        query.add_conditions({"?": "isnotnull('data')"})
        result = list(query.records(formatter=formatter))
        assert len(result) == 4

        # And now let's get only the two loci:
        query = ContextQuery(unit_context.select_all(field_or_instruction="locus.type",
                                                     sql_source_class=SqlSourceInMemory
                                                     ))

        query.add_conditions({"?": "isnotnull('data')"})
        result = list(query.records(formatter=formatter))
        assert len(result) == 3

    def test_something(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        unit_context_def = {
            "unit_context": {
                "type": "image_search",
                "scope": {
                    "unit": {
                        "locus": {
                            "locus_photo": {}
                        },
                        "dayplan": {}
                    },
                }
            }
        }
        locus_context_def = {
            "locus_context": {
                "type": "image_search",
                "scope": {
                    "locus": {
                        "locus_photo": {}
                    },
                }
            }
        }

        unit_context = KioskContext("unit_context", dsd)
        unit_context.from_dict(unit_context_def["unit_context"])

        locus_context = KioskContext("locus_context", dsd)
        locus_context.from_dict(locus_context_def["locus_context"])

        result = unit_context.select_all("identifier()",
                                         sql_source_class=SqlSourceInMemory,
                                         additional_fields=[("type", "type", "")])
        result.add_source(locus_context.select_all("identifier()",
                                                   sql_source_class=SqlSourceInMemory,
                                                   additional_fields=[("type", "type", "")]))

        query = ContextQuery(result)
        records = list(query.records(formatter=formatter))
        for r in records:
            print(r, end="\n")
        pprint(result.get_type_info()._types)

    def test_select_all_modified_records_with_date_formatter(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        unit_context_def = {
            "unit_context": {
                "type": "modified records",
                "scope": {
                    "unit": "browse()"
                }
            }
        }

        unit_context = KioskContext("unit_context", dsd)
        unit_context.from_dict(unit_context_def["unit_context"])
        with pytest.raises(KioskContextError):
            result = unit_context.select_all("modified",
                                             sql_source_class=SqlSourceInMemory,
                                             output_format="datetime(date)",
                                             )

        unit_context.register_output_formatter("datetime", SqlFieldFormatterDateTime(dsd))
        result = unit_context.select_all("modified",
                                         sql_source_class=SqlSourceInMemory,
                                         output_format="datetime(date)",
                                         additional_fields=[("modified", "format_year", "", "datetime(!DDMMYYYY)"),
                                                            ("modified", "year", "", "datetime(YEAR)"),
                                                            ("modified", "month", "", "datetime(MONTH)"),
                                                            ("modified", "day", "", "datetime(DAY)")]
                                         )

        assert result.get_type_info().get_type("format_year") == "varchar"
        assert result.get_type_info().get_type("year") == "int"
        assert result.get_type_info().get_type("day") == "int"
        assert result.get_type_info().get_type("month") == "int"
        assert result.get_type_info().get_type("data") == "date"
        query = ContextQuery(result)
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'format_year',
                                            'year',
                                            'month',
                                            'day']

        try:
            records = query.records()
            r = next(records)
            assert kioskstdlib.iso8601_to_str(r["data"]) == "2019-08-18"
            assert r["format_year"] == "18082019"
            assert r["year"] == 2019
            assert r["month"] == 8
            assert r["day"] == 18
        finally:
            records.close()

    def test_select_all_modified_records_with_date_formatter_and_condition(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        unit_context_def = {
            "unit_context": {
                "type": "modified records",
                "scope": {
                    "unit": "browse()"
                }
            }
        }

        unit_context = KioskContext("unit_context", dsd)
        unit_context.from_dict(unit_context_def["unit_context"])
        with pytest.raises(KioskContextError):
            result = unit_context.select_all("modified",
                                             sql_source_class=SqlSourceInMemory,
                                             output_format="datetime(date)",
                                             )

        unit_context.register_output_formatter("datetime", SqlFieldFormatterDateTime(dsd))
        result = unit_context.select_all("modified",
                                         sql_source_class=SqlSourceInMemory,
                                         output_format="datetime(date)",
                                         additional_fields=[("modified", "format_year", "", "datetime(!DDMMYYYY)"),
                                                            ("modified", "year", "", "datetime(YEAR)"),
                                                            ("modified", "month", "", "datetime(MONTH)"),
                                                            ("modified", "day", "", "datetime(DAY)")]
                                         )

        assert result.get_type_info().get_type("format_year") == "varchar"
        assert result.get_type_info().get_type("year") == "int"
        assert result.get_type_info().get_type("day") == "int"
        assert result.get_type_info().get_type("month") == "int"
        assert result.get_type_info().get_type("data") == "date"
        query = ContextQuery(result)
        query.add_conditions({"?": "equals(format_year, 17012019)"})
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'format_year',
                                            'year',
                                            'month',
                                            'day']

        try:
            records = query.records()
            c = 0
            for r in records:
                assert kioskstdlib.iso8601_to_str(r["data"]) == "2019-01-17"
                assert r["format_year"] == "17012019"
                assert r["year"] == 2019
                assert r["month"] == 1
                assert r["day"] == 17
                c = c + 1
                pprint(r)
            assert c == 5

        finally:
            records.close()

    def test_select_records_with_default_additional_fields(self, dsd, urapdb_with_records):
        def formatter(r: dict):
            values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
            return ",".join(values)

        unit_context_def = {
            "unit_context": {
                "type": "modified records",
                "scope": {"unit": {
                    "locus": {
                        "collected_material": {
                            "collected_material_photo": {}
                        },
                    }
                }
                },

            }
        }

        unit_context = KioskContext("unit_context", dsd)
        unit_context.from_dict(unit_context_def["unit_context"])
        unit_context.register_output_formatter("datetime", SqlFieldFormatterDateTime(dsd))
        unit_context.register_output_formatter("lookup_type", SqlFieldFormatterLookupType(dsd))
        with pytest.raises(KioskContextTypeError):
            result = unit_context.select_all("modified",
                                             sql_source_class=SqlSourceInMemory,
                                             output_format="datetime(date)",
                                             additional_fields=[
                                                 ("isobject", "small_find", "0", ""),
                                             ]
                                             )

        result = unit_context.select_all("modified",
                                         sql_source_class=SqlSourceInMemory,
                                         output_format="datetime(date)",
                                         additional_fields=[
                                             ("isobject", "small_find", "0", "lookup_type(collected_material)"),
                                         ]
                                         )
        assert result.get_type_info().get_type("small_find") == "int"

        query = ContextQuery(result)
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid',
                                            'small_find']

        try:
            records = query.records()
            cYes = 0
            cNo = 0
            for r in records:
                if r["record_type"] == "collected_material":
                    if r["small_find"] == 1:
                        cYes += 1
                    else:
                        cNo += 1
                else:
                    assert r["small_find"] == 0
            assert cYes == 1
            assert cNo == 5
        finally:
            records.close()
