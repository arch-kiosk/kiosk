import pytest
from dicttools import dict_search
from dicttools import dict_recursive_substitute
import config
import logging


class TestConfig():

    dict = None

    @pytest.fixture(autouse=True)
    def init_test(self):
        self.dict = {"key1": "value1", "key2": {"subkey1": "subvalue1"}, "key3": "value3",
                     "key4": {"subkey2": "subvalue2"}, }

    def test_dict_search(self):
        assert dict_search(self.dict, "key3") == "value3"
        assert dict_search(self.dict, "key1") == "value1"
        assert not dict_search(self.dict, "key2")
        assert dict_search(self.dict, "subkey1") == "subvalue1"
        assert dict_search(self.dict, "subkey2") == "subvalue2"

    def test_recurse_dict(self):
        subst_key = ""

        def substitute_method(key, s: str):
            if key == subst_key:
                return "replaced"
            else:
                return None

        subst_key = "subkey1"
        dict_recursive_substitute(self.dict, substitute_method)
        assert self.dict["key1"] == "value1"
        assert self.dict["key2"]["subkey1"] == "replaced"
        assert self.dict["key3"] == "value3"

        subst_key = "key1"
        dict_recursive_substitute(self.dict, substitute_method)
        assert self.dict["key1"] == "replaced"
        assert self.dict["key2"]["subkey1"] == "replaced"
        assert self.dict["key3"] == "value3"

        subst_key = "key3"
        dict_recursive_substitute(self.dict, substitute_method)
        assert self.dict["key1"] == "replaced"
        assert self.dict["key2"]["subkey1"] == "replaced"
        assert self.dict["key3"] == "replaced"
