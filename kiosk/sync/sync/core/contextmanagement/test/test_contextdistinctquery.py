import datetime
import logging
import os
from pprint import pprint

import pytest

from contextmanagement.contextquery import ContextQuery
from contextmanagement.kioskcontext import KioskContext, \
    KioskContextDuplicateInstructionError
from contextmanagement.sqlsourcecached import SqlSourceCached
from contextmanagement.sqlsourceinmemory import SqlSourceInMemory
from contextmanagement.sqlsourcetempcache import SqlSourceTempCache
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")

sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")


# this is not using the old ContextDistinctQuery class anymore but the distinct attribute.
class TestKioskContextQueryDistinct(KioskPyTestHelper):

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
        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type", "primary_identifier", 'primary_identifier_uuid']
        c = 0
        for r in query.records():
            c = c + 1
        assert c == 4
        query.close()

        context = KioskContext("context_name", dsd)
        context.from_dict(context_data["context_name"])
        query = ContextQuery(context.select("CC", "uid_file()", sql_source_class=SqlSourceInMemory))
        query.distinct = True
        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type",
                                            'primary_identifier', 'primary_identifier_uuid']
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
        query.distinct = True

        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type",
                                            'primary_identifier', 'primary_identifier_uuid', "description", "created"]
        assert isinstance(query._selects, SqlSourceCached)
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
            '"primary",\'dayplan\' "record_type","unit"."arch_context" "primary_identifier"'
            ',"unit"."uid" "primary_identifier_uuid","dayplan"."image_description" '
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
        query.distinct = True

        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type",
                                            'primary_identifier', 'primary_identifier_uuid', "description", "created"]
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
        query.distinct = True
        assert not isinstance(query._selects, SqlSourceTempCache)

        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type", "primary_identifier", 'primary_identifier_uuid',
                                            "description",
                                            "created"]

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
        query.distinct = True

        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type",
                                            'primary_identifier', 'primary_identifier_uuid', "description", "created"]
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
            pprint(r)
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
        query.distinct = True

        with pytest.raises(KioskContextDuplicateInstructionError):
            query = ContextQuery(context.select("FA", "uid_file()",
                                                sql_source_class=SqlSourceInMemory,
                                                additional_fields=[("test_duplicate()", "test", "")]))
        query.distinct = True

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
        query.distinct = True
        selects.invalidate_cache()
        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type", "primary_identifier", 'primary_identifier_uuid',
                                            "description",
                                            "created"]

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
        query = ContextQuery(context.select_all("modified",
                                                sql_source_class=SqlSourceInMemory,
                                                additional_fields=[("identifier()", "arch_context", "null")]))
        query.distinct = True

        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type", "primary_identifier", 'primary_identifier_uuid',
                                            "arch_context"]

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
        query.distinct = True
        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type", 'primary_identifier', 'primary_identifier_uuid',
                                            "arch_context"]

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
        query.distinct = True
        assert query.get_column_names() == ["identifier", "id_uuid", "data", "data_uuid",
                                            "primary", "record_type",
                                            "primary_identifier", 'primary_identifier_uuid']

        result = list(query.records(formatter=formatter))
        for r in result:
            print(r, end="\n")
        assert len(result) == 25

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
        query.distinct = True

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
        query.distinct = True

        query.add_conditions({"?": "isnotnull('data')"})
        result = list(query.records(formatter=formatter))
        assert len(result) == 4

        # And now let's get only the two loci:
        query = ContextQuery(unit_context.select_all(field_or_instruction="locus.type",
                                                     sql_source_class=SqlSourceInMemory
                                                     ))
        query.distinct = True

        query.add_conditions({"?": "isnotnull('data')"})
        result = list(query.records(formatter=formatter))
        pprint(result)
        assert len(result) == 3

        # Now let's get back only one field, which should reduce the types to architecture and deposit.
        query = ContextQuery(unit_context.select_all(field_or_instruction="locus.type",
                                                     sql_source_class=SqlSourceInMemory
                                                     ))
        query.distinct = True
        query.columns = {"data": {"source_field": "data"}}
        query.add_conditions({"?": "isnotnull('data')"})
        result = list(query.records(formatter=formatter))
        pprint(result)
        assert len(result) == 2
