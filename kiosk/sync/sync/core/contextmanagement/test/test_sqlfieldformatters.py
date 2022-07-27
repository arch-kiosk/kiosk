import os

import pytest

from contextmanagement.sqlfieldformatters import SqlFieldFormatterDateTime, SqlFieldFormatterError, SqlFieldFormatterLookupType

from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")


class TestKioskOutputFormatters(KioskPyTestHelper):

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

    def test_datetime(self, config, urapdb, dsd):
        fmt = SqlFieldFormatterDateTime(dsd)
        with pytest.raises(SqlFieldFormatterError):
            assert fmt("locus", "modified", ["datetime", "wrong parameter"]) == "\"locus\".\"modified\"::date"

        with pytest.raises(SqlFieldFormatterError):
            assert fmt("locus", "modified", ["unknown format"]) == "\"locus\".\"modified\"::date"

        assert fmt("locus", "modified", ["date"]) == ("\"locus\".\"modified\"::date", "date")
        assert fmt("locus", "modified", ["time"]) == ("\"locus\".\"modified\"::time", "time")
        assert fmt("locus", "modified", ["timestamp"]) == ("\"locus\".\"modified\"::timestamp", "timestamp")
        assert fmt("locus", "modified", ["year"]) == ("extract(YEAR from \"locus\".\"modified\")::int", "int")
        assert fmt("locus", "modified", ["day"]) == ("extract(DAY from \"locus\".\"modified\")::int", "int")
        assert fmt("locus", "modified", ["month"]) == ("extract(MONTH from \"locus\".\"modified\")::int", "int")
        assert fmt("locus", "modified", ["!YYYYMMTT"]) == ("to_char(\"locus\".\"modified\",'YYYYMMTT')", "varchar")
        assert fmt("locus", "modified", ["!YYYYMMTT"], default_value='null') == ("null::varchar", "varchar")
        assert fmt("locus", "modified", ["date"], "null") == ("null::date", "date")
        assert fmt("locus", "modified", ["time"], "null") == ("null::time", "time")

    def test_lookuptype(self, config, urapdb, dsd):
        fmt = SqlFieldFormatterLookupType(dsd)
        with pytest.raises(SqlFieldFormatterError):
            assert fmt("locus", "modified", ["locus"], "") == "\"locus\".\"modified\"::date"

        assert fmt("", "modified", ["locus"], "2019-01-01") == ("'2019-01-01'", 'timestamp')
