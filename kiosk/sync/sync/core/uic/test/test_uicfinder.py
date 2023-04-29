import os
from io import StringIO

import pytest

from test.testhelpers import KioskPyTestHelper
from uic.uictree import UICTree, compare_selectors, UICError
from uic.uicfinder import UICFinder
from uic.uicstream import UICStream

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestUICFinder(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def dsd(self, config):
        return self.get_dsd(config)

    def test_make_permutations(self):
        assert UICFinder.make_permutations([[1, 2]], [1, 2, 3]) == [[1, 2, 3]]
        assert UICFinder.make_permutations([[1]], [1, 2, 3]) == [[1, 2], [1, 3]]
        assert UICFinder.make_permutations([[1], [2]], [1, 2, 3]) == [[1, 2], [1, 3], [2, 3]]
        assert UICFinder.make_permutations([[2]], [1, 2, 3]) == [[2, 3]]
        assert UICFinder.make_permutations([[3]], [1, 2, 3]) == []
        assert UICFinder.make_permutations([[1, 2]], [1, 2, 3, 4]) == [[1, 2, 3], [1, 2, 4]]
        assert UICFinder.make_permutations([[1, 2], [2, 3]], [1, 2, 3, 4]) == [[1, 2, 3], [1, 2, 4], [2, 3, 4]]
        assert UICFinder.make_permutations([[1, 2, 3]], [1, 2, 3, 4]) == [[1, 2, 3, 4]]
        assert UICFinder.make_permutations([[1, 3]], [1, 2, 3, 4]) == [[1, 3, 4]]
        assert UICFinder.make_permutations([[2], [3]], [1, 2, 3, 4]) == [[2, 3], [2, 4], [3, 4]]

        assert UICFinder.make_permutations([[1], [2]], [1, 2]) == [[1, 2]]
        assert UICFinder.make_permutations([[2]], [1, 2]) == []
        assert UICFinder.make_permutations([[1]], [1]) == []

        assert UICFinder.make_permutations([[2], [4]], [2, 4]) == [[2, 4]]
        assert UICFinder.make_permutations([[2], [8]], [2, 4, 8, 15]) == [[2, 4], [2, 8], [2, 15], [8, 15]]

    def test__get_ui_definition_from_selector(self, config):
        tree = UICTree()
        tree.add_data_chunk([1], {"data_1": "1"})
        tree.add_data_chunk([1, 2], {"data_1_2": "1 2"})
        tree.add_data_chunk([2, 3], {"data_2_3": "2 3"})
        tree.add_data_chunk([4], {"data_4": "4"})
        tree.add_data_chunk([1, 4], {"data_1_4": "1 4"})
        tree.add_data_chunk([1, 2, 4], {"data_1_2_4": "1 2 4"})
        finder = UICFinder(tree)
        ui_definition = finder._get_ui_definition_from_selector([1, 2, 3])
        assert ui_definition == {'data_1': '1', 'data_1_2': '1 2', 'data_2_3': '2 3'}

        tree.add_data_chunk([1, 2, 3], {"data_1_2_3": "1 2 3"})
        finder = UICFinder(tree)
        ui_definition = finder._get_ui_definition_from_selector([1, 2, 3])
        assert ui_definition == {'data_1': '1', 'data_1_2': '1 2', 'data_2_3': '2 3', 'data_1_2_3': "1 2 3"}

    def test_get_ui_definition_from_selector(self, config):
        stream = UICStream(StringIO("""
        # header
          version: 1
        # sel_1
        data_1: 1
        # sel_1 && sel_2
        data_1_2: 1 2
        # sel_2 && sel_3
        data_2_3: 2 3
        # sel_4
        data_4: 4
        # sel_1 && sel_4
        data_1_4: 1 4
        # sel_1 && sel_2 && sel_4 
        data_1_2_4: 1 2 4
        
        """))
        finder = UICFinder(stream.tree)
        assert stream.tree.selectors == ['sel_1', 'sel_2', 'sel_3', 'sel_4']
        ui_definition = finder._get_ui_definition_from_selector([0, 1, 2])
        assert ui_definition == {'data_1': '1', 'data_1_2': '1 2', 'data_2_3': '2 3'}
        ui_definition = finder.get_ui_definition_from_selector(["sel_1", "sel_2", "sel_3"])
        assert ui_definition == {'data_1': '1', 'data_1_2': '1 2', 'data_2_3': '2 3'}
        ui_definition = finder.get_ui_definition_from_selector(["sel_1", "sel_2", "sel_4"])
        assert ui_definition == {'data_1': '1', 'data_1_2': '1 2', 'data_1_2_4': '1 2 4',
                                 'data_1_4': '1 4', 'data_4': '4'}

    def test_real_world_example(self, config, dsd):
        stream = UICStream(StringIO("""
            # header
              version: 1
            # datatype(VARCHAR)
            element_type: TextField
            # datatype(TIMESTAMP) || datetype(DATE)
            element_type: DateField
            # datatype(DATE)
            "DateField": 
                date_format: date_only
            # identifier()
            "%element_type%":
                isIdentifier: True
            # ui_input && identifier()
            "%element_type%":
                isIdentifier: False
            """))

        finder = UICFinder(stream.tree)

        dsd_fields = dsd.get_unparsed_field_instructions("locus", "modified")
        ui_definition = finder.get_ui_definition_from_selector(dsd_fields)
        assert ui_definition == {'element_type': 'DateField'}

        finder = UICFinder(stream.tree)
        dsd_fields = dsd.get_unparsed_field_instructions("locus", "arch_context")
        ui_definition = finder.get_ui_definition_from_selector(dsd_fields)
        assert ui_definition == {'%element_type%': {'isIdentifier': 'True'}, 'element_type': 'TextField'}

        selectors = dsd.get_unparsed_field_instructions("locus", "arch_context")
        selectors.append("ui_input")
        ui_definition = finder.get_ui_definition_from_selector(selectors)
        assert ui_definition == {'%element_type%': {'isIdentifier': 'False'}, 'element_type': 'TextField'}

    def test_get_ui_definition_from_selector_with_masked_selectors(self, config):
        stream = UICStream(StringIO("""
        # header
          version: 1
        # label("a masked ||")
        data_1: 1
        """))

        assert stream.tree.selectors == ['label("a masked', '")']

        stream = UICStream(StringIO("""
        # header
          version: 1
        # label("a masked |\\|")
        data_1: 1
        """))

        assert stream.tree.selectors == ['label("a masked ||")']

        finder = UICFinder(stream.tree)
        assert finder.get_ui_definition_from_selector(['label("a masked ||")']) == {"data_1": "1"}

        finder = UICFinder(stream.tree)
        assert finder.get_ui_definition_from_selector(['label("a masked |\\|")']) == {"data_1": "1"}

    def test_uic_stream_imports(self, config):
        stream = StringIO(r"""
        # header
        version: 1

        # datatype(VARCHAR) || datatype(TEXT)
        element_type:
          name: TextField

        # datatype(timestamp) || datatype(datetime)
        element_type:
          name: DateTimeField

        # datatype(time)
        element_type:
          name: TimeField
          datetime_format: time

        # datatype(date)
        element_type:
          name: DateField
          datetime_format: date

        # identifier()
        element_type:
          isIdentifier: True

        """)

        uic = UICStream(stream)
        assert uic._tree.selectors == ['datatype(varchar)',
                                       'datatype(text)',
                                       'datatype(timestamp)',
                                       'datatype(datetime)',
                                       'datatype(time)',
                                       'datatype(date)',
                                       'identifier()']
        assert uic._tree.to_dict(include_data=True)["children"][0] == {'__selector': [0],
                                                                       '_data': {'element_type': {"name": 'TextField'}},
                                                                       'children': []}
        assert uic._tree.flatten(True, True) == [([0], {'element_type': {'name': 'TextField'}}),
                                                 ([1], {'element_type': {'name': 'TextField'}}),
                                                 ([2], {'element_type': {'name': 'DateTimeField'}}),
                                                 ([3], {'element_type': {'name': 'DateTimeField'}}),
                                                 ([4],
                                                  {'element_type': {'datetime_format': 'time', 'name': 'TimeField'}}),
                                                 ([5],
                                                  {'element_type': {'datetime_format': 'date', 'name': 'DateField'}}),
                                                 ([6], {'element_type': {'isIdentifier': 'True'}})]

        finder = UICFinder(uic.tree)
        assert finder.get_ui_definition_from_selector(['datatype(varchar)']) == {'element_type': {'name': 'TextField'}}

        finder = UICFinder(uic.tree)
        assert finder.get_ui_definition_from_selector(['datatype(varchar)', 'identifier()']) == {
            'element_type': {'name': 'TextField', 'isIdentifier': 'True'}}

        assert uic._tree.flatten(True, True) == [([0], {'element_type': {'name': 'TextField'}}),
                                                 ([1], {'element_type': {'name': 'TextField'}}),
                                                 ([2], {'element_type': {'name': 'DateTimeField'}}),
                                                 ([3], {'element_type': {'name': 'DateTimeField'}}),
                                                 ([4],
                                                  {'element_type': {'datetime_format': 'time', 'name': 'TimeField'}}),
                                                 ([5],
                                                  {'element_type': {'datetime_format': 'date', 'name': 'DateField'}}),
                                                 ([6], {'element_type': {'isIdentifier': 'True'}})]
