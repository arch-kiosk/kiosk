import os
from io import StringIO, TextIOBase

import pytest

from presentationlayer.pldloader import PLDLoader
from presentationlayer.presentationlayerdefinition import PresentationLayerDefinition, PLDException
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
def_path = os.path.join(test_path, r"def")


class MockPLDLoader(PLDLoader):
    @classmethod
    def load_pld(cls, pld_name: str, cfg: SyncConfig) -> PresentationLayerDefinition:
        def _filename_resolver(filename: str) -> str:
            return os.path.join(def_path, filename)

        path_and_filename = os.path.join(def_path, pld_name + ".pld")
        pld = PresentationLayerDefinition()
        pld.load(path_and_filename, _filename_resolver)
        return pld


class TestPresentationLayerDefinition(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def dsd(self, config):
        return self.get_dsd(config)

    def test_instantiation(self, config):
        class DummyReader:
            test_dict = {"something": "something"}

            def __init__(self, basefile=""):
                pass

            def read_file(self, file_path_and_name):
                return self.__class__.test_dict

        pld = PresentationLayerDefinition(file_reader_class=DummyReader)
        with pytest.raises(PLDException, match="without format_version"):
            pld.load("something", lambda x: x)

        DummyReader.test_dict = {
            "config": {
                "format_version": 2
            }}

        with pytest.raises(PLDException, match="unsupported format_versio"):
            pld.load("something", lambda x: x)

        DummyReader.test_dict = {
            "config": {
                "format_version": 1
            },
            "compilations": {

            }
        }

        pld.load("something", lambda x: x)
        assert "compilations" in pld._pld

        DummyReader.test_dict = {
            "config": {
                "format_version": 1
            },
        }

        pld = PresentationLayerDefinition(file_reader_class=DummyReader)
        with pytest.raises(PLDException, match="no 'compilations'"):
            pld.load("something", lambda x: x)

    def test_imports_1(self, config):
        class DummyReader:
            test_dicts = {}

            def __init__(self, basefile=""):
                pass

            def read_file(self, file_path_and_name):
                return self.__class__.test_dict[file_path_and_name]

        DummyReader.test_dict = {
            "default": {
                "config": {
                    "format_version": 1
                },
                "imports": ["import_one"],
                "compilations": {
                    "collected_material_compilation": {
                        "name": "cm_view"
                    },
                    "locus_compilation": {
                        "name": "locus_view_2"
                    }

                }
            },
            "import_one": {
                "config": {
                    "format_version": 1
                },
                "compilations": {
                    "locus_compilation": {
                        "name": "locus_view",
                        "record_type": "locus"
                    }
                }
            }
        }

        pld = PresentationLayerDefinition(file_reader_class=DummyReader)
        pld.load("default", lambda x: x)
        assert pld._pld == {'compilations': {'collected_material_compilation': {'name': 'cm_view'},
                                             'locus_compilation': {'name': 'locus_view_2', "record_type": "locus"}},
                            'config': {'format_version': 1}}

    def test_imports_2(self, config):
        class DummyReader:
            test_dicts = {}

            def __init__(self, basefile=""):
                pass

            def read_file(self, file_path_and_name):
                return self.__class__.test_dict[file_path_and_name]

        DummyReader.test_dict = {
            "default": {
                "config": {
                    "format_version": 1
                },
                "imports": ["import_one", "import_two"],
                "compilations": {
                    "collected_material_compilation": {
                        "name": "cm_view"
                    },
                    "locus_compilation": {
                        "name": "locus_view_2",
                        "should_be_default": "default",
                    }

                }
            },
            "import_one": {
                "config": {
                    "format_version": 1
                },
                "compilations": {
                    "locus_compilation": {
                        "name": "locus_view",
                        "record_type": "locus",
                        "should_be_import_two": "import_one",
                        "should_be_import_one": "import_one",
                        "should_be_default": "import_one",
                    }
                }
            },
            "import_two": {
                "config": {
                    "format_version": 1
                },
                "compilations": {
                    "locus_compilation": {
                        "name": "locus_view",
                        "record_type": "locus",
                        "should_be_import_two": "import_two",
                    }
                }
            }
        }

        pld = PresentationLayerDefinition(file_reader_class=DummyReader)
        pld.load("default", lambda x: x)
        assert pld._pld == {'compilations': {'collected_material_compilation': {'name': 'cm_view'},
                                             'locus_compilation': {'name': 'locus_view_2',
                                                                   "record_type": "locus",
                                                                   "should_be_import_two": "import_two",
                                                                   "should_be_import_one": "import_one",
                                                                   "should_be_default": "default"
                                                                   }},
                            'config': {'format_version': 1}}

    def test_imports_3(self, config):
        class DummyReader:
            test_dicts = {}

            def __init__(self, basefile=""):
                pass

            def read_file(self, file_path_and_name):
                return self.__class__.test_dict[file_path_and_name]

        DummyReader.test_dict = {
            "default": {
                "config": {
                    "format_version": 1
                },
                "imports": ["import_one", "import_two"],
                "compilations": {
                    "collected_material_compilation": {
                        "name": "cm_view"
                    },
                    "locus_compilation": {
                        "name": "locus_view_2",
                        "should_be_default": "default"
                    }

                }
            },
            "import_one": {
                "config": {
                    "format_version": 1
                },
                "imports": ["import_one_one"],
                "compilations": {
                    "locus_compilation": {
                        "name": "locus_view",
                        "record_type": "locus",
                        "should_be_import_two": "import_one",
                        "should_be_import_one": "import_one",
                        "should_be_default": "import_one"
                    }
                }
            },
            "import_two": {
                "config": {
                    "format_version": 1
                },
                "imports": ["import_two_one"],
                "compilations": {
                    "locus_compilation": {
                        "name": "locus_view",
                        "record_type": "locus",
                        "should_be_import_two": "import_two",
                        "should_be_import_two_again": "import_two_again",
                    }
                }
            },
            "import_one_one": {
                "config": {
                    "format_version": 1
                },
                "compilations": {
                    "locus_compilation": {
                        "should_be_import_one_one": "import_one_one",
                        "should_be_import_two_one": "import_one_one",
                        "should_be_import_two_again": "import_one_one",
                    }
                }
            },
            "import_two_one": {
                "config": {
                    "format_version": 1
                },
                "compilations": {
                    "locus_compilation": {
                        "should_be_import_two_one": "import_two_one",
                        "should_be_import_two_again": "import_two_one",
                    }
                }
            },
        }

        pld = PresentationLayerDefinition(file_reader_class=DummyReader)
        pld.load("default", lambda x: x)
        assert pld._pld == {'compilations': {'collected_material_compilation': {'name': 'cm_view'},
                                             'locus_compilation': {'name': 'locus_view_2',
                                                                   "record_type": "locus",
                                                                   "should_be_import_two": "import_two",
                                                                   "should_be_import_one": "import_one",
                                                                   "should_be_default": "default",
                                                                   "should_be_import_one_one": "import_one_one",
                                                                   "should_be_import_two_one": "import_two_one",
                                                                   "should_be_import_two_again": "import_two_again",
                                                                   }},
                            'config': {'format_version': 1}}

    def test_get_compilations(self, config):
        pld = PresentationLayerDefinition()
        pld.load(os.path.join(def_path, "test.pld"), lambda x: x)
        assert list(pld.get_compilations().keys()) == ["locus_compilation"]

    def test_get_compilations_by_record_type(self, config):
        pld = PresentationLayerDefinition()
        pld.load(os.path.join(def_path, "test.pld"), lambda x: x)
        assert len(pld.get_compilations_by_record_type("locus")) == 1

    def test_get_parts(self, config):
        pld = PresentationLayerDefinition()
        pld.load(os.path.join(def_path, "test.pld"), lambda x: x)
        compilation = pld.get_compilations_by_record_type("locus")[0]
        parts = pld.get_parts(compilation)
        assert parts == ['locus.sheet']
