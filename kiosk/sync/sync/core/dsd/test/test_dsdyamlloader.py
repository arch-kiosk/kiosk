from dsd.dsdyamlloader import DSDYamlLoader
import os

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")

data_dir = os.path.join(test_path, "data")


class TestDsdYamlLoader:
    def test_load_some_yaml(self):
        loader = DSDYamlLoader(os.path.join(data_dir, "test_contexts.yml"))
        yml = loader.read_dsd_file()
        assert yml
        print(yml)
