import psycopg2
import pytest
from migration.postgresmigrationfieldinstructions import *
from dsd.dsderrors import *
from test.testhelpers import KioskPyTestHelper


class TestPostgresFieldMigrationInstructions(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def db(self):
        config = self.get_standard_test_config(__file__)

        con = psycopg2.connect(f"dbname=urap_test user={config.database_usr_name} password={config.database_usr_pwd}")
        con.autocommit = True
        yield con
        con.close()

    def test_MiPgDataType(self):
        assert MiPgDataType.execute_during_creation("", ["VARCHAR"]) == "VARCHAR"
        assert MiPgDataType.execute_during_creation("", ["VARCHAR", 10]) == "VARCHAR(10)"
        assert MiPgDataType.execute_during_creation("", ["TEXT"]) == "TEXT"
        assert MiPgDataType.execute_during_creation("", ["INT"]) == "INTEGER"
        assert MiPgDataType.execute_during_creation("", ["DATETIME"]) == "TIMESTAMP"

        with pytest.raises(DSDDataTypeError):
            assert MiPgDataType.execute_during_creation("", ["NOTKNOWN"]) == "NOTKNOWN"

        assert MiPgDataType.execute_during_migration("description", ["INT"], ["TEXT"]) == [
            "ALTER \"description\" TYPE TEXT"]
        assert MiPgDataType.execute_during_migration("description", ["VARCHAR", 10], ["VARCHAR", 15]) == [
            "ALTER \"description\" TYPE VARCHAR(15)"]

        with pytest.raises(DSDDataTypeError):
            assert MiPgDataType.execute_during_migration("description", ["VARCHAR", 10], ["NOTKNOWN", 15]) == [
                "ALTER \"description\" TYPE VARCHAR(15)"]

        with pytest.raises(DSDFeatureNotSupported):
            assert MiPgDataType.execute_drop("description", ["VARCHAR", 10]) == ""

        assert MiPgDataType.execute_during_migration("sync", ["BOOLEAN"], ["NUMBER"]) == [
            "ALTER \"sync\" TYPE INTEGER using sync::INTEGER"]


    def test_MiPgDefault(self):
        assert MiPgDefault.execute_during_creation("", ["''"]) == "DEFAULT ''"
        assert MiPgDefault.execute_during_creation("", ["2"]) == "DEFAULT 2"
        assert MiPgDefault.execute_during_creation("", ["'2'"]) == "DEFAULT '2'"

        assert MiPgDefault.execute_during_migration("description", ["''"], ["'2'"]) == [
            "ALTER \"description\" SET DEFAULT '2'"]
        assert MiPgDefault.execute_during_migration("description", ["'2'"], ["2"]) == [
            "ALTER \"description\" SET DEFAULT 2"]
        assert MiPgDefault.execute_during_migration("description", ["'2'"], ["''"]) == [
            "ALTER \"description\" SET DEFAULT ''"]

        assert MiPgDefault.execute_drop("description", ['']) == ["ALTER \"description\" DROP DEFAULT"]

        assert MiPgDefault.execute_during_migration("description", ["'null'"], ["null"]) == [
            "ALTER \"description\" SET DEFAULT null"]
        assert MiPgDefault.execute_during_migration("description", ["'null'"], ["$$Null$$"]) == [
            "ALTER \"description\" SET DEFAULT 'Null'"]


    def test_MiPgNotNull(self):
        assert MiPgNotNull.execute_during_creation("", []) == "NOT NULL"

        assert MiPgNotNull.execute_during_migration("description", [], []) == ["ALTER \"description\" SET NOT NULL"]

        assert MiPgNotNull.execute_drop("description", []) == ["ALTER \"description\" DROP NOT NULL"]
