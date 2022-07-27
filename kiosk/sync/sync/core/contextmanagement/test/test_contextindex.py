import datetime
import os
from pprint import pprint

import pytest

from contextmanagement.contextindex import ContextIndex
from contextmanagement.contextquery import ContextQuery
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb


test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")
sql_site_note_photos_records = os.path.join(test_path, "sql", "records_site_note_photos.sql")


class TestContextIndex(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)
        KioskSQLDb.run_sql_script(sql_site_note_photos_records)

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

    @staticmethod
    def formatter(r: dict):
        values = [f"{val}" if isinstance(val, datetime.datetime) else f"{val}" for val in r.values()]
        return ",".join(values)

    def test_read_from_dict(self, urapdb_with_records, dsd):
        idx = ContextIndex(dsd)
        idx.from_dict({"contexts": [
            {
                "unit": {
                    "locus": {
                        "locus_photo": {}
                    },
                    "dayplan": {}
                }
            },
            {
                "site": {
                    "site_notes": {
                        "site_note_photo": {}
                    }
                }
            }
        ]})
        assert len(idx._contexts) == 2
        query = ContextQuery(idx.select_all("uid_file()"))
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid']
        records = list(query.records(formatter=self.formatter))
        pprint(records)

        assert len(records) == 17
        query.close()

    def test_manual_cascade(self, urapdb_with_records, dsd):
        idx = ContextIndex(dsd)
        idx.from_dict({"contexts": [
            {
                "unit": {
                    "locus": {
                        "locus_photo": {}
                    },
                    "dayplan": {}
                }
            },
            {
                "locus": {
                    "locus_photo": {}
                }
            },
            {
                "site": {
                    "site_notes": {
                        "site_note_photo": {}
                    }
                }
            }
        ]})
        assert len(idx._contexts) == 3
        query = ContextQuery(idx.select_all("uid_file()"))
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid']
        records = list(query.records(formatter=self.formatter))
        pprint(records)

        assert len(records) == 23
        query.close()

    def test_read_from_dict_named_contexts(self, urapdb_with_records, dsd):
        idx = ContextIndex(dsd)
        idx.from_dict({"contexts": [
            "unit_images",
            "site_images"
        ]})
        assert len(idx._contexts) == 2
        query = ContextQuery(idx.select_all("uid_file()"))
        assert query.get_column_names() == ['identifier',
                                            'id_uuid',
                                            'data',
                                            'data_uuid',
                                            'primary',
                                            'record_type',
                                            'primary_identifier',
                                            'primary_identifier_uuid']
        records = list(query.records(formatter=self.formatter))
        pprint(records)

        assert len(records) == 17
        query.close()

    def test_read_from_dict_context_type(self, urapdb_with_records, dsd):
        idx = ContextIndex(dsd)
        idx.from_dict({"contexts": [
            ":file_search",
        ]})
        assert len(idx._contexts) == 2
        query = ContextQuery(idx.select_all("uid_file()"))
        assert query.get_column_names().sort() == ["identifier", "id_uuid", "data", "data_uuid",
                                                   "primary", "record_type", "primary_identifier"].sort()
        records = list(query.records(formatter=self.formatter))
        pprint(records)

        assert len(records) == 17
        query.close()
