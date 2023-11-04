import os
from io import StringIO, TextIOBase

import pytest

from test.testhelpers import KioskPyTestHelper
from uic.uicstream import UICStream, UICKioskFile
from uic.uictree import UICError

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestUICStream(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def dsd(self, config):
        return self.get_dsd(config)

    def test_simple_uic_stream(self, config):
        stream = StringIO("""
        # header
          version: 1
        # selector 1
        yaml:
            key: value
        """)
        uic = UICStream(stream)
        assert uic._tree.to_dict(include_data=True)["children"] == [{'__selector': [0],
                                                                     '_data': {'yaml': {'key': 'value'}},
                                                                     'children': []}]

    def test_parse_selector(self, config):
        stream = StringIO("""
        # header
          version: 1
        """)
        uic = UICStream(stream)
        for _ in [1, 3]:
            uic._parse_selector(" datatype(varchar) ", {"yaml": "snippet 1"})
            assert uic._tree.selectors == ["datatype(varchar)"]
            assert len(uic._tree.flatten(only_with_payload=True)) == 1
            assert len(uic._tree.selectors) == 1
            assert uic._tree.to_dict(include_data=True)["children"] == [
                {'__selector': [0], '_data': {'yaml': 'snippet 1'}, 'children': []}]

        for _ in [1, 3]:
            uic._parse_selector(" identifier() ", {"yaml": "snippet 2"})
            assert uic._tree.selectors == ["datatype(varchar)", "identifier()"]
            assert uic._tree.to_dict(include_data=True)["children"] == [
                {'__selector': [0], '_data': {'yaml': 'snippet 1'}, 'children': []},
                {'__selector': [1], '_data': {'yaml': 'snippet 2'}, 'children': []}]

        for _ in [1, 3]:
            uic._parse_selector(" identifier() &&  datatype(varchar)", {"yaml": "snippet and"})
            assert uic._tree.selectors == ["datatype(varchar)", "identifier()"]
            assert uic._tree.to_dict(include_data=True)["children"] == [
                {'__selector': [0], '_data': {'yaml': 'snippet 1'}, 'children': [
                    {'__selector': [0, 1], '_data': {'yaml': 'snippet and'}, 'children': []}]},
                {'__selector': [1], '_data': {'yaml': 'snippet 2'}, 'children': []}]

        for _ in [1, 3]:
            uic._parse_selector(" identifier() || datatype(varchar)", {"yaml": "snippet or"})
            assert uic._tree.selectors == ["datatype(varchar)", "identifier()"]
            assert uic._tree.to_dict(include_data=True)["children"] == [
                {'__selector': [0], '_data': {'yaml': 'snippet or'}, 'children': [
                    {'__selector': [0, 1], '_data': {'yaml': 'snippet and'}, 'children': []}]},
                {'__selector': [1], '_data': {'yaml': 'snippet or'}, 'children': []}]

        for _ in [1, 3]:
            uic._parse_selector(" identifier() || datatype(varchar)", {"yaml_2": "snippet or"})
            assert uic._tree.selectors == ["datatype(varchar)", "identifier()"]
            assert uic._tree.to_dict(include_data=True)["children"] == [
                {'__selector': [0], '_data': {'yaml': 'snippet or', 'yaml_2': 'snippet or'}, 'children': [
                    {'__selector': [0, 1], '_data': {'yaml': 'snippet and'}, 'children': []}]},
                {'__selector': [1], '_data': {'yaml': 'snippet or', 'yaml_2': 'snippet or'}, 'children': []}]

        for _ in [1, 3]:
            uic._parse_selector(" datatype(varchar) || datatype(varchar)  && identifier()",
                                {"yaml_2": {"more_yaml": "deeper yaml"}})
            assert uic._tree.selectors == ["datatype(varchar)", "identifier()"]
            assert uic._tree.to_dict(include_data=True)["children"] == [
                {'__selector': [0], '_data': {'yaml': 'snippet or', 'yaml_2': {"more_yaml": "deeper yaml"}},
                 'children': [
                     {'__selector': [0, 1], '_data': {'yaml': 'snippet and', 'yaml_2': {"more_yaml": "deeper yaml"}},
                      'children': []}]},
                {'__selector': [1], '_data': {'yaml': 'snippet or', 'yaml_2': 'snippet or'}, 'children': []}]

        for _ in [1, 3]:
            uic._parse_selector(" datatype(varchar) &&  datatype(number)  &&"
                                " identifier()",
                                {"yaml_3": {"more_yaml": "deeper yaml"}})

            assert uic._tree.selectors == ["datatype(varchar)", "identifier()", "datatype(number)"]
            assert uic._tree.to_dict(include_data=True)["children"] == [
                {'__selector': [0], '_data': {'yaml': 'snippet or', 'yaml_2': {"more_yaml": "deeper yaml"}},
                 'children': [
                     {'__selector': [0, 1], '_data': {'yaml': 'snippet and', 'yaml_2': {"more_yaml": "deeper yaml"}},
                      'children': [
                          {'__selector': [0, 1, 2],
                           '_data': {'yaml_3': {"more_yaml": "deeper yaml"}},
                           'children': []}
                      ]}]},
                {'__selector': [1], '_data': {'yaml': 'snippet or', 'yaml_2': 'snippet or'}, 'children': []}]

    def test_simple_uic_stream_imports(self, config):
        stream = StringIO("""
        # header
          version: 1
          imports:
            - some_import.uic
        # selector 1
        yaml:
            key: value
        """)
        try:
            uic = UICStream(stream)
            assert uic._tree.to_dict(include_data=True)["children"] == [{'__selector': [0],
                                                                         '_data': {'yaml': {'key': 'value'}},
                                                                         'children': []}]
        except UICError as e:
            assert f"{repr(e)}".find('no callback for imports') > -1

        stream = StringIO("""
        # header
          version: 1
          imports:
            - some_import.uic
        # selector 1
        yaml:
            key: value
        """)

        def _get_import_stream(path_and_filename: str) -> TextIOBase:
            assert path_and_filename == 'some_import.uic'
            return StringIO("""
            # header
              version: 1
            # selector 2
            yaml:
                key_2: value_2"
            """)

        uic = UICStream(stream, get_import_stream=_get_import_stream)
        assert uic._tree.to_dict(include_data=True)["children"] == [
            {'__selector': [0], '_data': {'yaml': {'key_2': 'value_2"'}}, 'children': []},
            {'__selector': [1], '_data': {'yaml': {'key': 'value'}}, 'children': []}]

    def test_uic_stream_imports(self, config):
        stream = StringIO(r"""
        # header
          version: 1
          imports:
            required:
                - def\import_1.uic
            optional: 
                - def\import_2.uic
        # selector 1
        yaml:
            key: value
        # selector override
        yaml:
            override: true    
        """)

        def _get_file_stream(file_name: str):
            return UICKioskFile.get_file_stream(file_name, base_path=test_path)

        uic = UICStream(stream, get_import_stream=_get_file_stream)
        assert set(uic._tree.selectors) == {"selector 1", "selector 2", "selector override"}
        assert uic._tree.to_dict(include_data=True)["children"] == [
            {'__selector': [0], '_data': {'yaml': {'key_2': 'value_2'}}, 'children': []},
            {'__selector': [1], '_data': {'yaml': {'override': 'true'}}, 'children': []},
            {'__selector': [2], '_data': {'yaml': {'key': 'value'}}, 'children': []}
        ]

    def test_uic_apply_uic_literals(self, config):
        stream = StringIO(r"""
        # header
          version: 1
          apply_uic_literals: selector 3
          imports:
            required:
                - an_import.uic
        # selector 1
        yaml:
            key1: value1
        """)

        def _get_import_stream(path_and_filename: str) -> TextIOBase:
            assert path_and_filename == 'an_import.uic'
            return StringIO("""
            # header
              version: 1
            # selector 1
            yaml:
              key2: value2
            """)

        uic = UICStream(stream, get_import_stream=_get_import_stream)
        assert set(uic._tree.selectors) == {"selector 1", "selector 3"}
        assert uic._tree.to_dict(include_data=True)["children"] == [
            {'__selector': [0],
             '_data': {'yaml': {'key2': 'value2'}},
             'children': [{'__selector': [0, 1],
                           '_data': {'yaml': {'key1': 'value1'}},
                           'children': []}]}
        ]

    def test_uic_apply_uic_literals_2(self, config):
        stream = StringIO(r"""
        # header
          version: 1
          imports:
            required:
                - an_import.uic
        # selector 1
        yaml:
            key1: value1
        """)

        def _get_import_stream(path_and_filename: str) -> TextIOBase:
            assert path_and_filename == 'an_import.uic'
            return StringIO("""
            # header
              version: 1
              apply_uic_literals: selector 3
            # selector 1
            yaml:
              key2: value2
            """)

        uic = UICStream(stream, get_import_stream=_get_import_stream)
        assert set(uic._tree.selectors) == {"selector 1", "selector 3"}
        assert uic._tree.to_dict(include_data=True)["children"] == [
            {'__selector': [0],
             '_data': {'yaml': {'key1': 'value1'}},
             'children': [{'__selector': [0, 1],
                           '_data': {'yaml': {'key2': 'value2'}},
                           'children': []}]}
        ]
