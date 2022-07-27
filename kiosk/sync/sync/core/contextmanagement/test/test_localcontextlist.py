import os

import pytest

from contextmanagement.localcontextlist import LocalContextList
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records.sql")


class TestLocalContextList(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @staticmethod
    def _context_fetcher_none():
        return list()

    @staticmethod
    def _context_fetcher():
        return [("PLG", "site"),
                ("PG", "unit")]

    def test_init(self):
        cl = LocalContextList(self._context_fetcher_none)
        assert cl

    def test__fetch_context(self):
        cl = LocalContextList(self._context_fetcher_none)
        assert cl
        assert len(cl._fetch_contexts()) == 0

        cl = LocalContextList(self._context_fetcher)
        assert len(cl._fetch_contexts()) == 2
        assert cl._fetch_contexts() == [("PLG", "site"), ("PG", "unit")]

    def test_add_context(self):
        cl = LocalContextList(self._context_fetcher_none)
        assert cl.get_contexts() == []
        cl.add_context("FA-001", "locus")
        assert cl.get_contexts() == [("FA-001", "locus")]
        cl.add_context("FA-002", "locus")
        assert cl.get_contexts() == [("FA-001", "locus"), ("FA-002", "locus")]

    def test_add_context_2(self):
        cl = LocalContextList(self._context_fetcher)
        assert cl.get_contexts() == [("PLG", "site"), ("PG", "unit")]
        cl.add_context("FA-001", "locus")
        assert cl.get_contexts() == [("PLG", "site"), ("PG", "unit"), ("FA-001", "locus")]
        cl.add_context("FA-002", "locus")
        assert cl.get_contexts() == [("PLG", "site"), ("PG", "unit"), ("FA-001", "locus"), ("FA-002", "locus")]

    def test_clear_context(self):
        cl = LocalContextList(self._context_fetcher)
        assert cl.get_contexts() == [("PLG", "site"), ("PG", "unit")]
        cl.clear_contexts()
        assert cl.get_contexts() == []

        cl.add_context("FA-001", "locus")
        assert cl.get_contexts() == [("FA-001", "locus")]
        cl.add_context("FA-002", "locus")
        assert cl.get_contexts() == [("FA-001", "locus"), ("FA-002", "locus")]
        assert cl._contexts == [(None, None), ("FA-001", "locus"), ("FA-002", "locus")]

    def test_get_dropped_contexts(self):
        cl = LocalContextList(self._context_fetcher)
        assert cl.get_contexts() == [("PLG", "site"), ("PG", "unit")]
        cl.clear_contexts()
        assert cl.get_contexts() == []
        assert cl.get_dropped_contexts() == [("PLG", "site"), ("PG", "unit")]
        assert cl.get_added_contexts() == []

    def test_get_added_contexts(self):
        cl = LocalContextList(self._context_fetcher_none)
        assert cl.get_contexts() == []
        assert cl.get_added_contexts() == []
        cl.add_context("FA", "dayplan")
        cl.add_context("CC", "dayplan")
        assert cl.get_added_contexts() == [("FA", "dayplan"), ("CC", "dayplan")]
        assert cl.get_dropped_contexts() == []

        cl = LocalContextList(self._context_fetcher)
        cl.add_context("CC", "dayplan")
        assert cl.get_added_contexts() == [("CC", "dayplan")]
        assert cl.get_contexts() == [("PLG", "site"), ("PG", "unit"), ("CC", "dayplan")]
