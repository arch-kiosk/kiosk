import os

import pytest

from contextmanagement.sqlsourcecached import CONTEXT_CACHE_NAMESPACE
from dsd.dsd3singleton import Dsd3Singleton
from fileidentifiercache import FileIdentifierCache
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")
records_for_pattern_test = os.path.join(test_path, "sql", "records_for_pattern_test.sql")
more_sql_records = os.path.join(test_path, "sql", "more_records.sql")

sql_some_more_images = os.path.join(test_path, "sql", "records_kiosk_context_more_images.sql")
sql_another_image = os.path.join(test_path, "sql", "another_image.sql")


class TestFileIdentifierCache(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture()
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)

    @pytest.fixture()
    def urapdb_with_some_more_records(self, urapdb_with_records):
        KioskSQLDb.run_sql_script(sql_some_more_images)

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

    def test_build_file_identifier_cache_from_contexts(self, dsd, urapdb_with_records):
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 12

    def test_file_identifier_cache_get_contexts(self, dsd, urapdb_with_records):
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()

    def test_get_contexts_for_file(self, dsd, urapdb_with_some_more_records):
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 13
        contexts = fic.get_contexts_for_file('27002a9f-b2df-46fc-9150-56397ebc8870')
        contexts.sort()
        assert contexts == [('CC', 'dayplan'), ('FA', 'dayplan')]

        contexts = fic.get_contexts_for_file('0f44aa68-64a8-4312-a46a-99f87ec4ac21')
        contexts.sort()
        assert contexts == [("FA", "dayplan")]

        contexts = fic.get_contexts_for_file('dd26f0ec-bc94-554f-93df-2a3fe91dbc38')
        assert contexts == []

        contexts = fic.get_contexts_for_file('dd26f0ec-bc94-554f-93df-2a3fe91dbc38', primary_only=False)
        contexts.sort()
        assert contexts == [('CC', 'locus_photo'), ('FA', 'locus_photo')]

    def test_update_file(self, dsd, urapdb_with_some_more_records):
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 13
        contexts = fic.get_contexts_for_file('27002a9f-b2df-46fc-9150-56397ebc8870')
        self.sort_structure(contexts) == self.sort_structure([('CC', 'dayplan'), ('FA', 'dayplan')])

        KioskSQLDb.run_sql_script(more_sql_records)
        KioskSQLDb.run_sql_script(sql_another_image)

        fic.update_file("27002a9f-b2df-46fc-9150-56397ebc8870", commit=True)
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 14
        contexts = fic.get_contexts_for_file('27002a9f-b2df-46fc-9150-56397ebc8870')
        assert self.sort_structure(contexts) == self.sort_structure([('FI', 'dayplan'), ('CC', 'dayplan'),
                                                                     ('FA', 'dayplan')])

    def test_get_files_with_context(self, cfg, dsd, urapdb_with_some_more_records):
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()
        KioskSQLDb.commit()
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 13
        files = fic.get_files_with_context()
        files.sort()
        expected = ['dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8'
                    ]
        expected.sort()
        assert files == expected

        files = fic.get_files_with_context(context="CC")
        files.sort()
        expected = ['14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

    def test_get_files_with_patterned_context(self, cfg, dsd, urapdb_with_some_more_records):
        KioskSQLDb.run_sql_script(records_for_pattern_test)
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()
        KioskSQLDb.commit()
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 15
        files = fic.get_files_with_context()
        files.sort()
        expected = ['dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '96e1f92c-d569-4a00-9173-3d4850925cfd',  # CA Image
                    '49cb3085-0603-4f38-b7f0-02307abc89e6',  # FC image
                    ]
        expected.sort()
        assert files == expected

        files = fic.get_files_with_context(context="CC", compare_as_part=True)
        files.sort()
        expected = ['14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    'dd26f0ec-bc94-554f-93df-2a3fe91dbc38']
        expected.sort()
        assert files == expected

        files = fic.get_files_with_context(context="F", compare_as_part=True)
        files.sort()
        expected = ["0f44aa68-64a8-4312-a46a-99f87ec4ac21",
                    "14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700",
                    "27002a9f-b2df-46fc-9150-56397ebc8870",
                    "49cb3085-0603-4f38-b7f0-02307abc89e6",
                    "54a88243-ee06-46f3-90a1-8b7a648f99b8",
                    "ca77c27f-bbca-434e-ba20-4f289a562173",
                    "dd26f0ec-bc94-554f-93df-2a3fe91dbc38",
                    ]
        expected.sort()
        assert files == expected

        files = fic.get_files_with_context(context="C", compare_as_part=True)
        files.sort()
        expected = ["14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700",
                    "27002a9f-b2df-46fc-9150-56397ebc8870",
                    "2e4ff3be-86c2-704c-8dec-8695a571ac59",
                    "49cb3085-0603-4f38-b7f0-02307abc89e6",
                    "71b1f2b3-0e93-bf4d-b9a8-989700159beb",
                    "96e1f92c-d569-4a00-9173-3d4850925cfd",
                    "dd26f0ec-bc94-554f-93df-2a3fe91dbc38",
                    ]
        expected.sort()
        assert files == expected

    def test_get_files_with_record_type(self, cfg, dsd, urapdb_with_some_more_records):
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()
        KioskSQLDb.commit()
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 13

        files = fic.get_files_with_record_type("locus_photo")
        files.sort()
        expected = ['dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    ]
        expected.sort()
        assert files == expected

        files = fic.get_files_with_record_type("dayplan")
        files.sort()
        expected = ['71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59'
                    ]
        expected.sort()
        assert files == expected

    def test_get_files_without_context(self, cfg, dsd, urapdb_with_some_more_records):
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()
        KioskSQLDb.commit()
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 13
        files = fic.get_files_with_context(equals=False)
        expected = []
        assert files == expected

        files = fic.get_files_with_context(context="CC", equals=False)
        files.sort()
        expected = ['0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    'ca77c27f-bbca-434e-ba20-4f289a562173']

        expected.sort()
        assert files == expected

    def test_get_files_without_patterned_context(self, cfg, dsd, urapdb_with_some_more_records):
        KioskSQLDb.run_sql_script(records_for_pattern_test)
        fic = FileIdentifierCache(dsd)
        fic.build_file_identifier_cache_from_contexts()
        KioskSQLDb.commit()
        assert KioskSQLDb.get_record_count("file_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 15
        files = fic.get_files_with_context()
        files.sort()
        expected = ['dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8',
                    '96e1f92c-d569-4a00-9173-3d4850925cfd',  # CA Image
                    '49cb3085-0603-4f38-b7f0-02307abc89e6',  # FC image
                    ]
        expected.sort()
        assert files == expected

        files = fic.get_files_with_context(context="F", equals=False, compare_as_part=True)
        files.sort()
        not_expected = ["0f44aa68-64a8-4312-a46a-99f87ec4ac21",
                        "14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700",
                        "27002a9f-b2df-46fc-9150-56397ebc8870",
                        "49cb3085-0603-4f38-b7f0-02307abc89e6",
                        "54a88243-ee06-46f3-90a1-8b7a648f99b8",
                        "ca77c27f-bbca-434e-ba20-4f289a562173",
                        "dd26f0ec-bc94-554f-93df-2a3fe91dbc38",
                        ]
        for f in files:
            assert f not in not_expected

        expected = ["2e4ff3be-86c2-704c-8dec-8695a571ac59",
                    "71b1f2b3-0e93-bf4d-b9a8-989700159beb",
                    "96e1f92c-d569-4a00-9173-3d4850925cfd",
                    ]
        expected.sort()
        assert files == expected

    def test_extra_context_get_files(self, cfg, dsd, urapdb_with_some_more_records):
        fic = FileIdentifierCache(dsd, context_type="site_identifier")
        assert fic.build_file_identifier_cache_from_contexts()
        KioskSQLDb.commit()
        assert KioskSQLDb.get_record_count("site_identifier_cache", "identifier",
                                           namespace=CONTEXT_CACHE_NAMESPACE) == 13
        files = fic.get_files_with_context()
        files.sort()
        expected = ['dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8'
                    ]
        expected.sort()
        assert files == expected

        files = fic.get_files_with_context(context="FRT")
        files.sort()
        expected = ['dd26f0ec-bc94-554f-93df-2a3fe91dbc38',
                    '27002a9f-b2df-46fc-9150-56397ebc8870',
                    '14ca0f7b-6f65-8f48-b2c3-d64a4b2f9700',
                    '71b1f2b3-0e93-bf4d-b9a8-989700159beb',
                    '0f44aa68-64a8-4312-a46a-99f87ec4ac21',
                    'ca77c27f-bbca-434e-ba20-4f289a562173',
                    '2e4ff3be-86c2-704c-8dec-8695a571ac59',
                    '54a88243-ee06-46f3-90a1-8b7a648f99b8'
                    ]
        expected.sort()
        assert files == expected
