from dsd.dsd3 import DataSetDefinition
from dsd.dsdgraph import DsdGraph, DsdGraphError, Join
import os
import pytest

from dsd.dsdyamlloader import DSDYamlLoader
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")

data_dir = os.path.join(test_path, "data")
dsd_file = os.path.join(data_dir, "urap_dsd3.yml")


# @pytest.mark.test_run1
class TestDsdGraph(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def dsd(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd_file)
        return dsd

    def test__parse_join(self, dsd):
        graph = DsdGraph(dsd)
        assert graph._parse_join("inner(uid, uid_site)", "site", "site_notes") == Join(root_table="site",
                                                                                       related_table="site_notes",
                                                                                       _type="inner",
                                                                                       related_field="uid_site",
                                                                                       root_field="uid")

    @pytest.fixture
    def graph1(self, dsd):
        graph = DsdGraph(dsd)
        graph.add_table("unit")
        graph.add_table("dayplan")
        graph.add_join(Join(root_table="unit", related_table="dayplan"))

        graph.add_table("locus")
        graph.add_join(Join(root_table="unit", related_table="locus"))

        graph.add_table("locus_photo")
        graph.add_join(Join(root_table="locus", related_table="locus_photo"))

        graph.add_table("collected_material")
        graph.add_join(Join(root_table="locus", related_table="collected_material"))

        graph.add_table("collected_material_photo")
        graph.add_join(Join(root_table="collected_material", related_table="collected_material_photo"))

        graph.add_table("locus_relations")
        graph.add_join(Join(root_table="locus", related_table="locus_relations"))

        graph.add_table("tagging")
        graph.add_join(Join(root_table="tagging", related_table="locus"))

        return graph

    @pytest.fixture
    def graph2(self, dsd):
        graph = DsdGraph(dsd)
        graph.add_table("site")
        graph.add_table("site_notes")
        graph.add_table("site_note_photo")
        graph.add_join(Join(root_table="site", related_table="site_notes", root_field="id", related_field="site_id"))
        graph.add_join(Join(root_table="site_notes", _type="left outer", related_table="site_note_photo",
                            root_field="uid",
                            related_field="uid_site_note"))
        return graph

    def test_get_root_tables(self, graph1: DsdGraph, graph2):
        assert len(graph1._graph.vs) == 8
        assert len(graph1._graph.es) == 7
        assert graph1.get_root_tables() == ["unit", "tagging"]
        assert graph2.get_root_tables() == ["site"]

    def test_paths_to_table(self, graph1: DsdGraph):
        assert len(graph1._graph.vs) == 8
        assert len(graph1._graph.es) == 7
        print(graph1._graph)

        assert graph1.get_paths_to_table("unit") == [["unit"]]
        assert graph1.get_paths_to_table("tagging") == [["tagging"]]
        assert graph1.get_paths_to_table("dayplan") == [["unit", "dayplan"]]
        assert graph1.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]
        assert graph1.get_paths_to_table("locus_relations") == [["unit", "locus", "locus_relations"],
                                                                ["tagging", "locus", "locus_relations"]]
        assert graph1.get_paths_to_table("locus_photo") == [["unit", "locus", "locus_photo"],
                                                            ["tagging", "locus", "locus_photo"]]
        assert graph1.get_paths_to_table("collected_material_photo") == [["unit", "locus",
                                                                          "collected_material",
                                                                          "collected_material_photo"],
                                                                         ["tagging", "locus",
                                                                          "collected_material",
                                                                          "collected_material_photo"]]

    def test_find_paths_by_field(self, graph1: DsdGraph):
        assert len(graph1._graph.vs) == 8
        assert len(graph1._graph.es) == 7

        paths = graph1.find_paths("uid")
        print(graph1._graph)
        print(paths)
        assert len(paths) == 13
        assert ["unit"] in paths
        assert ["tagging"] in paths
        assert ["unit", "locus", "collected_material", "collected_material_photo"] in paths

        paths = graph1.find_paths("uid_photo")
        assert paths == [["unit", "locus", "collected_material", "collected_material_photo"],
                         ["tagging", "locus", "collected_material", "collected_material_photo"]]

        paths = graph1.find_paths("uid_image")
        assert paths == [["unit", "dayplan"],
                         ["unit", "locus", "locus_photo"],
                         ["tagging", "locus", "locus_photo"]
                         ]

    def test_find_paths_by_identifier(self, graph1: DsdGraph):
        assert len(graph1._graph.vs) == 8
        assert len(graph1._graph.es) == 7

        paths = graph1.find_paths("replfield_uuid()")
        print(graph1._graph)
        print(paths)
        assert len(paths) == 13

        paths = graph1.find_paths("identifier()")
        print(graph1._graph)
        print(paths)
        assert len(paths) == 6

        paths = graph1.find_paths("uid_file()")
        print(graph1._graph)
        print(paths)
        assert len(paths) == 7
        assert ["tagging", "locus", "locus_relations"] in paths
        assert ["unit", "locus", "locus_relations"] in paths
        assert ["tagging", "locus", "collected_material", "collected_material_photo"] in paths
        assert ["unit", "locus", "collected_material", "collected_material_photo"] in paths

        paths = graph1.find_paths("describes_file()")
        print(graph1._graph)
        print(paths)
        assert len(paths) == 7

        paths = graph1.find_paths("describes_file(\"no matter what\")")
        print(graph1._graph)
        print(paths)
        assert len(paths) == 7

    def test_find_closest(self, graph1, graph2):
        with pytest.raises(DsdGraphError):
            assert graph1.find_closest(["unit", "locus"], ["locus", "collected_material"])

        assert graph1.find_closest([["unit", "locus", "collected_material"]],
                                   "identifier()") == ("collected_material", 0)

        assert graph1.find_closest([["unit", "locus", "collected_material", "collected_material_photo"]],
                                   "identifier()") == ("collected_material", 1)

        paths = graph1.find_paths("uid_photo")
        assert paths == [["unit", "locus", "collected_material", "collected_material_photo"],
                         ["tagging", "locus", "collected_material", "collected_material_photo"]]

        assert graph1.find_closest(paths,
                                   "identifier()") == ("collected_material", 1)

        paths = graph1.get_paths_to_table("locus_relations")
        assert graph1.find_closest(paths,
                                   "identifier()") == ("locus", 1)

        paths = graph1.get_paths_to_table("dayplan")
        assert graph1.find_closest(paths,
                                   "identifier()") == ("unit", 1)

        paths = graph2.get_paths_to_table("site_note_photo")
        assert paths == [["site", "site_notes", "site_note_photo"]]
        assert graph2.find_closest(paths,
                                   "identifier()") == ("site", 2)

        paths = graph1.find_paths("uid_photo")
        assert paths == [["unit", "locus", "collected_material", "collected_material_photo"],
                         ["tagging", "locus", "collected_material", "collected_material_photo"]]

        assert graph1.find_closest(paths,
                                   "tag") == ("tagging", 3)

    def test_find_closest_identifier(self, graph1, graph2):
        assert graph1.find_closest_identifier("collected_material_photo") == "collected_material"
        assert graph1.find_closest_identifier("locus_relations") == "locus"
        assert graph1.find_closest_identifier("locus") == "locus"
        assert graph1.find_closest_identifier("unit") == "unit"

        assert graph2.find_closest_identifier("site_note_photo") == "site"

    def test_join(self, graph2):
        assert graph2.get_join("site", "site_notes") == Join(root_table="site",
                                                             related_table="site_notes", root_field="id",
                                                             related_field="site_id")
        assert graph2.get_join("site_notes", "site_note_photo") == Join(root_table="site_notes",
                                                                        _type="left outer",
                                                                        related_table="site_note_photo",
                                                                        root_field="uid",
                                                                        related_field="uid_site_note")

    def test_table_has_instruction(self, graph1):
        assert graph1.table_has_instruction("unit", "identifier")
        assert graph1.table_has_instruction("locus", "identifier")
        assert graph1.table_has_instruction("collected_material", "identifier")
        assert not graph1.table_has_instruction("collected_material_photo", "identifier")
        assert not graph1.table_has_instruction("locus_photo", "identifier")

    def test_table_has_field(self, graph1):
        assert graph1.table_has_field("unit", "arch_context")
        assert graph1.table_has_field("locus", "arch_context")
        assert graph1.table_has_field("collected_material", "arch_context")
        assert not graph1.table_has_field("collected_material_photo", "arch_context")
        assert not graph1.table_has_field("locus_photo", "arch_context")

    def test_read_full_scope_from_dict(self, dsd):
        context_data = {
            "scope": {
                "unit": {
                    "locus": {
                        "join": "inner(uid, uid_unit)"
                    }
                },
                "tagging": {
                    "locus": {
                        "join": "inner(uid, uid_unit)"
                    }
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]

    def test_read_abbreviated_scope_from_dict(self, dsd):
        context_data = {
            "scope": {
                "unit": {
                    "locus": {}
                },
                "tagging": {
                    "locus": {}
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]

    def test_get_root_identifiers(self, dsd):
        context_data = {
            "context_name": {
                "type": "some type",
                "scope": {
                    "unit": {
                        "locus": {}
                    },
                    "tagging": {
                        "locus": {}
                    },
                    "test": {
                        "test_photo": {}
                    }
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["context_name"]["scope"])
        assert graph.get_root_identifiers() == ["unit", "tagging"]

    def test__browse_table_scope(self, dsd):
        graph = DsdGraph(dsd)
        scope = graph._browse_table_scope("unit")
        assert scope == {
            "locus": {
                "collected_material":
                    {
                        "pottery": {}
                    },
                "locus_relations": {}
            }
        }
        scope = graph._browse_table_scope("tagging")
        assert scope == {
            "locus": {
                "collected_material":
                    {
                        "pottery": {}
                    },
                "locus_relations": {}
            }
        }
        scope = graph._browse_table_scope("test")
        assert scope == {
            "test_photo": {}
        }
        scope = graph._browse_table_scope("locus")
        assert scope == {
            "collected_material":
                {
                    "pottery": {}
                },
            "locus_relations": {}
        }
        scope = graph._browse_table_scope("pottery")
        assert scope == {}

        with pytest.raises(DsdGraphError):
            scope = graph._browse_table_scope("unknown")

        scope = graph._browse_table_scope("unit", exclude_tables=["pottery"])
        assert scope == {
            "locus": {
                "collected_material": {},
                "locus_relations": {}
            }
        }

        scope = graph._browse_table_scope("unit", exclude_tables=["locus"])
        assert scope == {}

    def test_read_browse_scope_from_dict(self, dsd):
        # Let's try a browse that should return an empty scope first:
        context_data = {
            "scope": {
                "unit": {
                    "locus": {
                        "collected_material":
                            {
                                "pottery": "browse()"
                            }
                    }
                },
                "tagging": {
                    "locus": {}
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]
        assert graph.get_paths_to_table("pottery") == [["unit", "locus", "collected_material", "pottery"],
                                                       ["tagging", "locus", "collected_material", "pottery"]]

        context_data = {
            "scope": {
                "unit": "browse()",
                "tagging": {
                    "locus": {}
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]
        assert graph.get_paths_to_table("pottery") == [["unit", "locus", "collected_material", "pottery"],
                                                       ["tagging", "locus", "collected_material", "pottery"]]

        # test excluding a table
        context_data = {
            "scope": {
                "unit": "browse('pottery')",
                "tagging": {
                    "locus": {}
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]
        assert graph.get_paths_to_table("collected_material") == [["unit", "locus", "collected_material"],
                                                                  ["tagging", "locus", "collected_material"]]
        with pytest.raises(DsdGraphError):
            assert graph.get_paths_to_table("pottery") == [["unit", "locus", "collected_material", "pottery"],
                                                           ["tagging", "locus", "collected_material", "pottery"]]

        # test excluding a table in between
        context_data = {
            "scope": {
                "unit": "browse('locus')",
                "tagging": {
                    "locus": {}
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["tagging", "locus"]]
        with pytest.raises(DsdGraphError):
            assert graph.get_paths_to_table("collected_material") == [["unit", "locus", "collected_material"],
                                                                      ["tagging", "locus", "collected_material"]]
        with pytest.raises(DsdGraphError):
            assert graph.get_paths_to_table("pottery") == [["unit", "locus", "collected_material", "pottery"],
                                                           ["tagging", "locus", "collected_material", "pottery"]]

        # instead of browse as value, let's use it in combination with join:
        context_data = {
            "scope": {
                "unit": {
                    "locus": {
                        "collected_material":
                            {
                                "join": "inner(uid, locus_uid)",
                                "auto-scope": "browse()"
                            }
                    }
                },
                "tagging": {
                    "locus": {}
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]
        assert graph.get_paths_to_table("pottery") == [["unit", "locus", "collected_material", "pottery"],
                                                       ["tagging", "locus", "collected_material", "pottery"]]

        # another one
        context_data = {
            "scope": {
                "unit":
                    {
                        "auto-scope": "browse()"
                    },
                "tagging": {
                    "locus": {}
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]
        assert graph.get_paths_to_table("pottery") == [["unit", "locus", "collected_material", "pottery"],
                                                       ["tagging", "locus", "collected_material", "pottery"]]

        # last one of that kind
        context_data = {
            "scope": {
                "unit": {
                    "locus": {
                        "join": "inner(uid, uid_unit)",
                        "auto-scope": "browse()"
                    }
                },
                "tagging": {
                    "locus": {}
                }
            }
        }
        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]
        assert graph.get_paths_to_table("pottery") == [["unit", "locus", "collected_material", "pottery"],
                                                       ["tagging", "locus", "collected_material", "pottery"]]

    def test_auto_scope(self, dsd):
        graph = DsdGraph(dsd)
        graph.auto_scope(["unit", "tagging"])
        assert graph.get_paths_to_table("locus") == [["unit", "locus"], ["tagging", "locus"]]
        assert graph.get_paths_to_table("pottery") == [["unit", "locus", "collected_material", "pottery"],
                                                       ["tagging", "locus", "collected_material", "pottery"]]

        graph = DsdGraph(dsd)
        graph.auto_scope()
        assert graph.get_paths_to_table("locus").sort() == [["unit", "locus"], ["tagging", "locus"]].sort()
        assert graph.get_paths_to_table("pottery").sort() == [["unit", "locus", "collected_material", "pottery"],
                                                              ["tagging", "locus", "collected_material",
                                                               "pottery"]].sort()

        assert graph.get_paths_to_table("site_note_photo").sort() == [["site", "site_note", "site_note_photo"]].sort()

    def test_get_identifier_tables(self, dsd):
        graph = DsdGraph(dsd)
        graph.auto_scope(["unit"])
        assert graph.get_identifier_tables() == ["unit", "locus", "collected_material", "pottery"]

        graph = DsdGraph(dsd)
        graph.auto_scope()
        assert graph.get_identifier_tables().sort() == ["site", "unit", "locus", "collected_material", "pottery",
                                                        "tagging"].sort()

    def test_find_paths_by_table_and_field(self, graph1: DsdGraph):
        assert len(graph1._graph.vs) == 8
        assert len(graph1._graph.es) == 7

        paths = graph1.find_paths("collected_material_photo.uid")
        print(graph1._graph)
        print(paths)
        assert len(paths) == 2
        assert ["unit"] not in paths
        assert ["tagging"] not in paths
        assert paths == [["unit", "locus", "collected_material", "collected_material_photo"],
                         ["tagging", "locus", "collected_material", "collected_material_photo"]]

    def test_root_auto_scope(self, dsd):
        # Let's try a browse that should return an empty scope first:
        context_data = {
            "scope": "browse()"
        }

        graph = DsdGraph(dsd)
        graph.add_tables(context_data["scope"])
        assert self.sort_structure(graph.get_paths_to_table("locus")) == self.sort_structure([["unit", "locus"],
                                                                                              ["tagging", "locus"]])
        assert self.sort_structure(graph.get_paths_to_table("pottery")) == self.sort_structure(
            [["unit", "locus", "collected_material", "pottery"],
             ["tagging", "locus", "collected_material", "pottery"]])
