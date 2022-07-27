import pytest
import os
from dsd.dsd3 import DataSetDefinition, Join
from dsd.dsdinmemorystore import DSDInMemoryStore
from dsd.dsdyamlloader import DSDYamlLoader
from dsd.dsd3 import DSDWrongVersionError, DSDFileError, DSDTableDropped, DSDSemanticError
from dsd.dsdconstants import *
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")

data_path = os.path.join(test_path, "data")
dsd3_test_file = os.path.join(data_path, "dsd3_import_test.yml")


# @pytest.mark.test_run1
class TestDSD3ImportTests(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    def test_init(self):
        dsd = DataSetDefinition()
        assert dsd

    def test_register_yaml_loader(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)

    @pytest.fixture()
    def dsd_dsd3(self, cfg):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_test_file)
        return dsd

    def test_list_tables(self, dsd_dsd3):
        dsd: DataSetDefinition = dsd_dsd3
        tables = dsd.list_tables(include_dropped_tables=False)
        assert "test" in tables
        assert len(tables) == 1

    def test_import_migration_scripts(self, dsd_dsd3):
        dsd: DataSetDefinition = dsd_dsd3
        scripts = dsd.get_migration_scripts("urap")
        assert "test_1" in scripts
        assert "test_2" in scripts
        store: DSDInMemoryStore = dsd._dsd_data
        assert "test_1" in store._dsd_data["config"]["migration_scripts"]
