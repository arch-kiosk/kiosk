import os
from io import StringIO

import pytest

from test.testhelpers import KioskPyTestHelper
from uic.uictree import UICTree, compare_selectors

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestUICTree(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def dsd(self, config):
        return self.get_dsd(config)

    def test_compare_selectors(self, config):
        assert compare_selectors([], []) == 0
        assert compare_selectors([1], [1]) == 0
        assert compare_selectors([1], [2]) == -1
        assert compare_selectors([2], [1]) == 1
        assert compare_selectors([1, 2], [2]) == -1
        assert compare_selectors([1, 2], [1]) == 1
        assert compare_selectors([1, 2], [1, 2]) == 0
        assert compare_selectors([1], [1, 2]) == -1
        assert compare_selectors([1, 2, 3], [1, 2, 4]) == -1
        assert compare_selectors([1, 2, 4], [1, 2, 3]) == 1

    def test_simple_uic_tree(self, config):
        tree = UICTree()
        assert tree.to_dict() == {'__selector': [], 'children': []}
        tree.add_data_chunk([1], {"yaml": "some data"})
        assert tree.to_dict() == {'__selector': [], 'children': [{'__selector': [1], 'children': []}]}
        tree.add_data_chunk([1, 2], {"yaml": "data 2"})
        assert tree.to_dict() == {'__selector': [],
                                  'children': [
                                      {'__selector': [1],
                                       'children': [
                                           {'__selector': [1, 2],
                                            'children': []}
                                       ]}
                                  ]}
        tree.add_data_chunk([1, 1], {"yaml": "data 2"})
        assert tree.to_dict() == {'__selector': [],
                                  'children': [
                                      {'__selector': [1],
                                       'children': [
                                           {'__selector': [1, 1],
                                            'children': []},
                                           {'__selector': [1, 2],
                                            'children': []}
                                       ]}
                                  ]}

    def test_flatten_uic_tree(self, config):
        tree = UICTree()
        tree.add_data_chunk([1], {"data": "A"})
        tree.add_data_chunk([1, 2], {"data": "B"})
        tree.add_data_chunk([2], {"data": "C"})
        tree.add_data_chunk([2, 3], {"data": "D"})
        tree.add_data_chunk([1, 3], {"data": "E"})
        tree.add_data_chunk([3, 4], {"data": "E"})
        assert tree.flatten(only_with_payload=False) == [[1], [1, 2], [1, 3], [2], [2, 3], [3], [3, 4]]

        tree = UICTree()
        tree.add_data_chunk([1], {"data": "1"})
        tree.add_data_chunk([1, 2], {"data": "1 2"})
        tree.add_data_chunk([2, 3], {"data": "2 3"})
        tree.add_data_chunk([4], {"data": "4"})
        tree.add_data_chunk([1, 4], {"data": "1 4"})
        tree.add_data_chunk([1, 2, 4], {"data": "1 2 4"})
        assert tree.flatten(only_with_payload=True) == [[1], [1, 2], [1, 2, 4], [1, 4], [2, 3], [4]]

        tree = UICTree()
        tree.add_data_chunk([1], {"data": "1"})
        tree.add_data_chunk([1, 2], {"data": "1 2"})
        tree.add_data_chunk([2, 3], {"data": "2 3"})
        tree.add_data_chunk([4], {"data": "4"})
        tree.add_data_chunk([1, 4], {"data": "1 4"})
        tree.add_data_chunk([1, 2, 4], {"data": "1 2 4"})
        assert tree.flatten(include_payload=True) == [([1], {"data": "1"}),
                                                      ([1, 2], {"data": "1 2"}),
                                                      ([1, 2, 4], {"data": "1 2 4"}),
                                                      ([1, 4], {"data": "1 4"}),
                                                      ([2, 3], {"data": "2 3"}),
                                                      ([4], {"data": "4"})]



