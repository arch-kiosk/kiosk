from yamlconfigreader import YAMLConfigReader
import os
import pytest


class TestYAMLConfigReader():
    @pytest.fixture(autouse=True)
    def init_test(self):
        current_file = os.path.abspath(__file__)
        self.yaml_file = os.path.join(os.path.dirname(current_file), "test.yml")
        pass

    def test_read_file(self):
        reader = YAMLConfigReader(None)
        rc = reader(self.yaml_file)

        assert "urap_repl" in rc
        assert rc["urap_repl"] == "just a test key"
        assert "local_importpaths" in rc
        assert "d:\\" in rc["local_importpaths"]
        assert isinstance(rc, dict)


