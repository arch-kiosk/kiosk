import pytest
import os
from dsd.dsdinmemorystore import DSDInMemoryStore
from dsd.dsdyamlloader import DSDYamlLoader

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")

data_dir = os.path.join(test_path, "data")
dsd3_test_file = os.path.join(data_dir, "dsd3_test.yml")


class TestDSDInMemoryStore:
    def test_simple_set_get(self):
        store = DSDInMemoryStore()
        store.set(["config"], {"format_version": 3})
        assert store.get(["config", "format_version"]) == 3

    def test_base(self):
        store = DSDInMemoryStore()
        with pytest.raises(IndexError):
            store.set([], "something")
        assert store.set([],{"something": "somevalue"})
        assert store.get([]) == {"something": "somevalue"}

    def test_load_yaml(self):
        store = DSDInMemoryStore()
        loader = DSDYamlLoader()
        yml = loader.read_dsd_file(dsd3_test_file)
        assert store.set([], yml)
        assert store.get(["config", "format_version"]) == 3

    def test_merge(self):
        store = DSDInMemoryStore()
        loader = DSDYamlLoader()
        store.set(["config"], {"format_version": 2})
        store.set(["config"], {"own_config_value": "something"})
        assert store.get(["config", "own_config_value"]) == "something"
        
        yml = loader.read_dsd_file(dsd3_test_file)
        assert store.merge([], yml)
        assert store.get(["config", "format_version"]) == 3
        assert store.get(["config", "own_config_value"]) == "something"
        assert store.get(["test", "structure", 3, "name"]) == ['datatype("VARCHAR")']

    def test_get_keys(self):
        store=DSDInMemoryStore()    
        loader = DSDYamlLoader()
        yml = loader.read_dsd_file(dsd3_test_file)
        assert store.merge([], yml)
        keys = store.get_keys([])
        assert len(keys) == 4
        assert "config" in keys
        assert "test" in keys

        keys = store.get_keys(["test", "structure"])
        assert len(keys) == 3
    
    def test_delete(self):
        store=DSDInMemoryStore()    
        loader = DSDYamlLoader()
        yml = loader.read_dsd_file(dsd3_test_file)
        assert store.set([], yml)
        assert "test" in store.get_keys([])
        test  = store.get(["test"])
        test_deleted = store.delete(["test"])
        assert test == test_deleted
        assert "test" not in store.get_keys([])