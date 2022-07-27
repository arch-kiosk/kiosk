import os

import pytest
import yaml

from dsd.dsd3singleton import Dsd3Singleton
from filehandlingsets import FileHandlingSet, FileHandlingError, get_file_handling_set
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFileHandlingSet(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        cfg = self.get_config(config_file, log_file=log_file)
        cfg.file_handling_definition = os.path.join(test_path, "config", "file_handling.yml")
        return cfg

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, cfg):
        assert cfg
        FileHandlingSet.EXPECTED_VERSION = FileHandlingSet.EXPECTED_VERSION + 1

        with pytest.raises(FileHandlingError):
            fh_set = FileHandlingSet("default", cfg)

        FileHandlingSet.EXPECTED_VERSION = FileHandlingSet.EXPECTED_VERSION - 1

        with pytest.raises(FileHandlingError):
            fh_set = FileHandlingSet("unknown", cfg)

        fh_set = FileHandlingSet("default", cfg)
        assert fh_set

    def test_list_file_handling_sets(self, cfg):
        fh_set = FileHandlingSet("default", cfg)
        file_handling_sets = fh_set.list_file_handling_sets(cfg)
        file_handling_sets.sort()
        assert file_handling_sets == ["ceramicists", "default", "trench-ipads"]

    def test_supported_file_extensions(self, cfg):
        fh_set = FileHandlingSet("default", cfg)
        file_extensions = fh_set.get_supported_file_extensions()
        assert file_extensions == ["nef", "tiff", "tif", "jpg", "jpeg", "gif", "png", "bmp", "raw", "pcx", "cr2"]

        assert fh_set.is_file_type_supported("my_file.nef")
        assert fh_set.is_file_type_supported("c:\\asdfasfd\\asdsadf\\my_file.cr2")
        assert not fh_set.is_file_type_supported("c:\\asdfasfd\\asdsadf\\my_file.heic")

    def test__get_matching_file_handling_rule(self, cfg):
        # a default rule (1) and a file extension rule (2)
        rules = yaml.load("""
            1:
                storage:
                    representation: none
            2:
                filter:
                    extensions: JPG, NEF, TIF, TIFF, RAW, CR2
                storage:
                    representation: 1024x768
        """, Loader=yaml.FullLoader)
        assert FileHandlingSet._get_matching_file_handling_rule("avi", 100, rules) == 1
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 100, rules) == 2

        # a default rule (1) and a scale rule (2)
        rules = yaml.load("""
            1:
                storage:
                    representation: none
            2:
                filter:
                    max_scale: 10,10
                storage:
                    representation: 1024x768
        """, Loader=yaml.FullLoader)
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 20 * 10, rules) == 2
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 10 * 10, rules) == 1

        # a default rule (1) and two scale rules (2), (3)
        rules = yaml.load("""
            1:
                storage:
                    representation: none
            2:
                filter:
                    max_scale: 10,10
                storage:
                    representation: 10x10
            3:
                filter:
                    max_scale: 5,10
                storage:
                    representation: 5x10
        """, Loader=yaml.FullLoader)

        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 20 * 10, rules) == 2
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 10 * 10, rules) == 3
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 5 * 10, rules) == 1

        # a default rule (1) and two scale rules (2), (3) and a type rule without max_scale (4)
        rules = yaml.load("""
            1:
                storage:
                    representation: none
            2:
                filter:
                    max_scale: 10,10
                storage:
                    representation: 10x10
            3:
                filter:
                    max_scale: 5,10
                storage:
                    representation: 5x10
            4:
                filter:
                    extensions: jpg, png
                storage:
                    representation: 5x10
        """, Loader=yaml.FullLoader)
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 20 * 10, rules) == 4
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 10 * 10, rules) == 4
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 5 * 10, rules) == 4

        # a default rule (1) and two scale rules (2), (3) and a type rule without max_scale that does not match (4)
        rules = yaml.load("""
            1:
                storage:
                    representation: none
            2:
                filter:
                    max_scale: 10,10
                storage:
                    representation: 10x10
            3:
                filter:
                    max_scale: 5,10
                storage:
                    representation: 5x10
            4:
                filter:
                    extensions: png
                storage:
                    representation: 5x10
        """, Loader=yaml.FullLoader)
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 20 * 10, rules) == 2
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 10 * 10, rules) == 3
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 5 * 10, rules) == 1
        assert FileHandlingSet._get_matching_file_handling_rule("png", 20 * 10, rules) == 4
        assert FileHandlingSet._get_matching_file_handling_rule("png", 10 * 10, rules) == 4
        assert FileHandlingSet._get_matching_file_handling_rule("png", 5 * 10, rules) == 4

        # a default rule (1) and two scale rules (2), (3) and a type rule with max_scale set (4)
        rules = yaml.load("""
            1:
                storage:
                    representation: none
            2:
                filter:
                    max_scale: 10,10
                storage:
                    representation: 10x10
            3:
                filter:
                    max_scale: 5,10
                storage:
                    representation: 5x10
            4:
                filter:
                    extensions: png
                    max_scale: 10, 10
                storage:
                    representation: 5x10
        """, Loader=yaml.FullLoader)
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 20 * 10, rules) == 2
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 10 * 10, rules) == 3
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 5 * 10, rules) == 1
        assert FileHandlingSet._get_matching_file_handling_rule("png", 20 * 10, rules) == 4
        assert FileHandlingSet._get_matching_file_handling_rule("png", 10 * 10, rules) == 3
        assert FileHandlingSet._get_matching_file_handling_rule("png", 5 * 10, rules) == 1

        # a default rule (1) and two scale rules (2), (3) and a type rule with max_scale set (4)
        rules = yaml.load("""
            1:
                storage:
                    representation: none
            2:
                filter:
                    max_scale: 10,10
                storage:
                    representation: 10x10
            3:
                filter:
                    max_scale: 5,10
                storage:
                    representation: 5x10
            4:
                filter:
                    extensions: png
                    max_scale: 10, 10
                storage:
                    representation: 5x10
            5:
                filter:
                    extensions: png
                storage:
                    representation: 5x10
        """, Loader=yaml.FullLoader)

        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 20 * 10, rules) == 2
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 10 * 10, rules) == 3
        assert FileHandlingSet._get_matching_file_handling_rule("jpg", 5 * 10, rules) == 1
        assert FileHandlingSet._get_matching_file_handling_rule("png", 20 * 10, rules) == 4
        assert FileHandlingSet._get_matching_file_handling_rule("png", 10 * 10, rules) == 5
        assert FileHandlingSet._get_matching_file_handling_rule("png", 5 * 10, rules) == 5

    def test_get_file_handling(self, cfg):
        fh_set = FileHandlingSet("default", cfg)
        handling = fh_set.get_file_handling("my_file.jpg", 50, 50, "low")
        assert handling == {"location": "internal",
                            "disable": False,
                            "representation": "none"}

        handling = fh_set.get_file_handling("my_file.avi", 0, 0, "low")
        assert handling == {"location": "internal",
                            "disable": False,
                            "representation": "none"}

        handling = fh_set.get_file_handling("my_file.nef", 0, 0, "low")
        assert handling == {"location": "internal",
                            "disable": False,
                            "representation": "1024x768"}

        handling = fh_set.get_file_handling("my_file.jpg", 2048, 912, "low")
        assert handling == {"location": "internal",
                            "disable": False,
                            "representation": "1024x768"}

        handling = fh_set.get_file_handling("my_file.jpg", 2048, 912, "high")
        assert handling == {"location": "internal",
                            "disable": False,
                            "representation": "none"}

        handling = fh_set.get_file_handling("my_file.nef", 0, 0, "high")
        assert handling == {"location": "internal",
                            "disable": False,
                            "representation": "RAW2400x2500"}

        handling = fh_set.get_file_handling("my_file.jpg", 2048, 912, "dummy")
        assert handling == {"location": "internal",
                            "disable": True,
                            "representation": "dummy"}

    def test_max_file_size_kbyte(self, cfg):
        fh_set = FileHandlingSet("default", cfg)
        assert fh_set.max_file_size_kbytes == 0

        handling = fh_set.get_file_handling("my_file.jpg", 50, 50, "low")
        assert handling == {"location": "internal",
                            "disable": False,
                            "representation": "none"}

        cfg.file_handling_definition = os.path.join(test_path, "config", "file_handling_with_max_size.yml")
        fh_set = FileHandlingSet("default", cfg)
        assert fh_set.max_file_size_kbytes == 50000

        handling = fh_set.get_file_handling("my_file.jpg", 50, 50, "high")
        assert handling == {"location": "internal",
                            "disable": False,
                            "max_file_size_kbytes": 50000,
                            "representation": "none"}

        handling = fh_set.get_file_handling("my_file.jpg", 50, 50, "low")
        assert handling == {"location": "internal",
                            "disable": False,
                            "max_file_size_kbytes": 20000,
                            "representation": "none"}

        handling = fh_set.get_file_handling("my_file.nef", 0, 0, "low")
        assert handling == {"location": "internal",
                            "disable": False,
                            "max_file_size_kbytes": 20000,
                            "representation": "1024x768"}

        handling = fh_set.get_file_handling("my_file.nef", 0, 0, "high")
        assert handling == {"location": "internal",
                            "disable": False,
                            "max_file_size_kbytes": 100000,
                            "representation": "RAW2400x2500"}

    def test_get_default_set(self, cfg):
        fh_set = get_file_handling_set("potterer", cfg)
        assert not fh_set

        cfg.file_handling_definition = os.path.join(test_path, "config", "file_handling_with_default.yml")
        assert FileHandlingSet.get_default_set(cfg) == "the_default"

        fh_set = get_file_handling_set("potterer", cfg)
        assert fh_set
        assert fh_set.id == "the_default"


