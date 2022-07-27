import datetime
from pprint import pprint

import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from fileexportworkstation.fileexport import FileExport
from fileexportworkstation.fileexporttargettest import FileExportTargetTest
from fileexportworkstation.fileexporttargetzip import FileExportTargetZip
from qualitycontrol.qualitycontrol import QualityControl, QualityControlMessage
from test.testhelpers import KioskPyTestHelper
from sync_plugins.simpleqcengine.pluginsimpleqcengine import SimpleQCEngine, QCError
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFileExportCSVDriver(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        config = self.get_config(config_file, log_file=log_file)
        config.config["file_repository"] = os.path.join(test_path, "file_repository")
        config._file_repository = config.config["file_repository"]
        return config

    @pytest.fixture(scope="module")
    def db(self, config):
        db = self.get_urapdb(config)
        KioskSQLDb.run_sql_script(sql_data)
        return db

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, config, dsd):
        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)
        assert file_export

        drivers = file_export.get_drivers()
        assert drivers

        drivers = [d.driver_id for d in drivers.values()]
        assert 'FileExportCSVDriver' in drivers

        targets = file_export.get_file_export_targets()
        assert targets

        assert list(targets.values())[0].target_id == "FileExportTargetZip"

    def test_export(self, config, dsd):
        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)
        assert file_export
        driver = file_export.get_drivers()["FileExportCSVDriver"]
        target = file_export.get_file_export_targets()["FileExportTargetTest"]

        assert file_export.export(driver, target)
        assert self.file_exists(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "unit.csv"))
        assert self.file_exists(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "locus.csv"))
        assert self.file_exists(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "workflow_requests.csv"))
        assert self.file_exists(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "pottery.csv"))

        with open(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "locus.csv"), "r",
                  encoding="utf-8") as file:
            headline = file.readline()
            assert headline.strip() == 'uid_unit,type,opening elevations,closing elevations,description,date_defined,date_closed,interpretation,colour,formation_process,elevation_opening_nw,elevation_opening_ne,elevation_opening_se,elevation_opening_sw,elevation_opening_ct,elevation_closing_nw,elevation_closing_ne,elevation_closing_se,elevation_closing_sw,elevation_closing_ct,width,length,depth,volume,id,arch_domain,arch_context,uid,created,modified,modified_by,recorded_by'

            firstline = file.readline()
            assert firstline.strip() == 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339,ac,,,,,,,,,,,,,,,,,,,,,,,1,,FA-001,c50df3cb-e68b-4ce7-b456-9ea3d636d933,2019-01-17 11:50:54,2019-01-17 11:58:16,anm,'

            secondline = file.readline()
            assert secondline.strip() == 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339,,,,,,,,,,,,,,,,,,,,,,,,2,,FA-002,a1fc642f-468b-45e1-a368-d9c452c5df7f,2019-01-01 12:24:36,2019-01-15 11:55:08,Lrl’s iPad,'

            line = file.readline()
            assert line.strip() == 'c109e19c-c73c-cc49-9f58-4ba0a3ad1339,,,,,,,,,,,,,,,,,,,,,,,,3,,FA-003,adbef66e-f8fd-422d-b20b-c2d0f09309a5,2019-01-17 07:33:00,2019-01-17 07:50:13,anm,'

        with open(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "images.csv"), "r",
                  encoding="utf-8") as file:
            line = file.readline()
            assert line.strip() == 'description,img_proxy,ref_uid,file_datetime,filename,export_filename,image_attributes,md5_hash,original_md5,tags,uid,created,modified,modified_by'

            c_images = -1
            while line:
                c_images += 1
                line = file.readline()

            assert c_images == 14

        for table in ["unit.csv", "locus.csv", "images.csv", "workflow_requests.csv", "pottery.csv"]:
            assert table in target.files.keys()

    def test_export_files_no_resolver(self, config, dsd):
        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)
        assert file_export
        driver = file_export.get_drivers()["FileExportCSVDriver"]
        target = file_export.get_file_export_targets()["FileExportTargetTest"]

        file_export.include_files = True
        assert file_export.export(driver, target)
        with open(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "images.csv"), "r",
                  encoding="utf-8") as file:
            line = file.readline()
            assert line.strip() == 'description,img_proxy,ref_uid,file_datetime,filename,export_filename,image_attributes,md5_hash,original_md5,tags,uid,created,modified,modified_by,exported_filename'

            c_images = -1
            while line:
                c_images += 1
                line = file.readline()
                if line and "0f723370-196c-4efd-b6ac-45056d529ec8" in line:
                    assert line.strip() == r''',2020-07-13 13:42:44,,2020-07-13 13:42:44,0f723370-196c-4efd-b6ac-45056d529ec8.png,,"{'width': 2000, 'format': 'PNG', 'height': 2667}",162496802414a2187b79192b354dc17a,162496802414A2187B79192B354DC17A,"""TURTLE""",0f723370-196c-4efd-b6ac-45056d529ec8,2020-07-13 13:42:44,2021-07-06 18:33:05.523949,lkh,0f723370-196c-4efd-b6ac-45056d529ec8.png'''

            assert c_images == 14

        for table in ["unit.csv", "locus.csv", "images.csv", "workflow_requests.csv", "pottery.csv",
                      "0f723370-196c-4efd-b6ac-45056d529ec8.png"]:
            assert table in target.files.keys()

    def test_export_files_with_resolver(self, config, dsd):

        def resolve_file_request(uid: str) -> str:
            if uid == "0f723370-196c-4efd-b6ac-45056d529ec8":
                return os.path.join(test_path, "not_in_the_file_repos",
                                    "smaller_0f723370-196c-4efd-b6ac-45056d529ec8.png")
            if uid == "009ff417-5982-4c0c-94d3-c7ce2d4baf2e":
                return os.path.join(test_path, "file_repository", "00",
                                    "009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png")
            return ""

        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)
        assert file_export
        driver = file_export.get_drivers()["FileExportCSVDriver"]
        target = file_export.get_file_export_targets()["FileExportTargetTest"]

        file_export.include_files = True
        file_export.register_file_resolver(resolve_file_request)
        assert file_export.export(driver, target)
        temp_dir = config.get_temp_dir()
        with open(os.path.join(temp_dir, "fileexportcsvdriver", "images.csv"), "r",
                  encoding="utf-8") as file:
            line = file.readline()
            assert line.strip() == 'description,img_proxy,ref_uid,file_datetime,filename,export_filename,image_attributes,md5_hash,original_md5,tags,uid,created,modified,modified_by,exported_filename'

            c_images = -1
            while line:
                c_images += 1
                line = file.readline()
                if line and "0f723370-196c-4efd-b6ac-45056d529ec8" in line:
                    assert line.strip() == r''',2020-07-13 13:42:44,,2020-07-13 13:42:44,0f723370-196c-4efd-b6ac-45056d529ec8.png,,"{'width': 2000, 'format': 'PNG', 'height': 2667}",162496802414a2187b79192b354dc17a,162496802414A2187B79192B354DC17A,"""TURTLE""",0f723370-196c-4efd-b6ac-45056d529ec8,2020-07-13 13:42:44,2021-07-06 18:33:05.523949,lkh,smaller_0f723370-196c-4efd-b6ac-45056d529ec8.png'''
                if line and "0194cba9d6a800cce8eea57814657d23" in line:
                    assert line.strip() == r''',2020-07-23 12:33:16,,2020-07-23 12:33:16,0194cba9d6a800cce8eea57814657d23.jpg,,"{'width': 2048, 'format': 'JPEG', 'height': 1536}",0194cba9d6a800cce8eea57814657d23,0194CBA9D6A800CCE8EEA57814657D23,"""BROKEN_FILE""",949a8761-c17b-47c2-ba92-b521731d8271,2020-07-23 12:33:16,2021-07-06 18:33:05.460450,sgk,'''
                if line and "009ff417-5982-4c0c-94d3-c7ce2d4baf2e" in line:
                    assert line.strip() == r''',2020-08-03 18:13:46,,2020-08-03 18:13:46,009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png,,"{'width': 444, 'format': 'PNG', 'height': 512}",0ca8cf01d6b21c64a5649aa06064f340,0CA8CF01D6B21C64A5649AA06064F340,"""BROKEN_FILE""",009ff417-5982-4c0c-94d3-c7ce2d4baf2e,2020-08-03 18:13:46,2021-07-06 18:33:05.457464,nvd,009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png'''

            assert c_images == 14

        for table in ["unit.csv", "locus.csv", "images.csv", "workflow_requests.csv", "pottery.csv",
                      "smaller_0f723370-196c-4efd-b6ac-45056d529ec8.png",
                      "009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png"
                      ]:
            assert table in target.files.keys()

        for table in [
            "0194cba9d6a800cce8eea57814657d23.jpg"
        ]:
            assert table not in target.files.keys()

    def test_export_files_with_all_resolvers(self, config, dsd):

        def resolve_file_request(uid: str) -> str:
            if uid == "0f723370-196c-4efd-b6ac-45056d529ec8":
                return os.path.join(test_path, "not_in_the_file_repos",
                                    "smaller_0f723370-196c-4efd-b6ac-45056d529ec8.png")
            if uid == "009ff417-5982-4c0c-94d3-c7ce2d4baf2e":
                return os.path.join(test_path, "file_repository", "00",
                                    "009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png")
            return ""

        def resolve_filename(uid: str, file_repos) -> str:
            if uid == "0f723370-196c-4efd-b6ac-45056d529ec8":
                return "A yummy turtle"
            if uid == "009ff417-5982-4c0c-94d3-c7ce2d4baf2e":
                return "Another:\\Yummy\\Turtle"
            return ""

        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)
        assert file_export
        driver = file_export.get_drivers()["FileExportCSVDriver"]
        target = file_export.get_file_export_targets()["FileExportTargetTest"]

        file_export.include_files = True
        file_export.register_file_resolver(resolve_file_request)
        file_export.register_filename_resolver(resolve_filename)

        assert file_export.export(driver, target)
        with open(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "images.csv"), "r",
                  encoding="utf-8") as file:
            line = file.readline()
            assert line.strip() == 'description,img_proxy,ref_uid,file_datetime,filename,export_filename,image_attributes,md5_hash,original_md5,tags,uid,created,modified,modified_by,exported_filename'

            c_images = -1
            while line:
                c_images += 1
                line = file.readline()
                if line and "0f723370-196c-4efd-b6ac-45056d529ec8" in line:
                    assert line.strip() == r''',2020-07-13 13:42:44,,2020-07-13 13:42:44,0f723370-196c-4efd-b6ac-45056d529ec8.png,,"{'width': 2000, 'format': 'PNG', 'height': 2667}",162496802414a2187b79192b354dc17a,162496802414A2187B79192B354DC17A,"""TURTLE""",0f723370-196c-4efd-b6ac-45056d529ec8,2020-07-13 13:42:44,2021-07-06 18:33:05.523949,lkh,A_yummy_turtle.png'''
                if line and "0194cba9d6a800cce8eea57814657d23" in line:
                    assert line.strip() == r''',2020-07-23 12:33:16,,2020-07-23 12:33:16,0194cba9d6a800cce8eea57814657d23.jpg,,"{'width': 2048, 'format': 'JPEG', 'height': 1536}",0194cba9d6a800cce8eea57814657d23,0194CBA9D6A800CCE8EEA57814657D23,"""BROKEN_FILE""",949a8761-c17b-47c2-ba92-b521731d8271,2020-07-23 12:33:16,2021-07-06 18:33:05.460450,sgk,'''
                if line and "009ff417-5982-4c0c-94d3-c7ce2d4baf2e" in line:
                    assert line.strip() == r''',2020-08-03 18:13:46,,2020-08-03 18:13:46,009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png,,"{'width': 444, 'format': 'PNG', 'height': 512}",0ca8cf01d6b21c64a5649aa06064f340,0CA8CF01D6B21C64A5649AA06064F340,"""BROKEN_FILE""",009ff417-5982-4c0c-94d3-c7ce2d4baf2e,2020-08-03 18:13:46,2021-07-06 18:33:05.457464,nvd,AnotherYummyTurtle.png'''

            assert c_images == 14

        for table in ["unit.csv", "locus.csv", "images.csv", "workflow_requests.csv", "pottery.csv"]:
            assert table in target.files.keys()

        for table in ["unit.csv", "locus.csv", "images.csv", "workflow_requests.csv", "pottery.csv",
                      "A_yummy_turtle.png",
                      "AnotherYummyTurtle.png",
                      ]:
            assert table in target.files.keys()

        for table in ["smaller_0f723370-196c-4efd-b6ac-45056d529ec8.png",
                      "0194cba9d6a800cce8eea57814657d23.jpg",
                      "009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png"
                      ]:
            assert table not in target.files.keys()

    def test_export_to_zip(self, config, dsd):

        def resolve_file_request(uid: str) -> str:
            if uid == "0f723370-196c-4efd-b6ac-45056d529ec8":
                return os.path.join(test_path, "not_in_the_file_repos",
                                    "smaller_0f723370-196c-4efd-b6ac-45056d529ec8.png")
            if uid == "009ff417-5982-4c0c-94d3-c7ce2d4baf2e":
                return os.path.join(test_path, "file_repository", "00",
                                    "009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png")
            return ""

        def resolve_filename(uid: str, file_repos) -> str:
            if uid == "0f723370-196c-4efd-b6ac-45056d529ec8":
                return "A yummy turtle"
            if uid == "009ff417-5982-4c0c-94d3-c7ce2d4baf2e":
                return "Another:\\Yummy\\Turtle"
            return ""

        sync = Synchronization()
        file_export = FileExport(config, sync.events, sync.type_repository, sync)
        assert file_export
        driver = file_export.get_drivers()["FileExportCSVDriver"]
        # noinspection PyTypeChecker
        target: FileExportTargetZip = file_export.get_file_export_targets()["FileExportTargetZip"]
        assert target
        dest_file = os.path.join(test_path, "export", "kiosk-export.zip")
        target.set_export_path_and_filename_for_test(os.path.join(test_path, "export"), "kiosk-export.zip")

        file_export.include_files = True
        file_export.register_file_resolver(resolve_file_request)
        file_export.register_filename_resolver(resolve_filename)
        assert file_export.export(driver, target)
        with open(os.path.join(config.get_temp_dir(), "fileexportcsvdriver", "images.csv"), "r",
                  encoding="utf-8") as file:
            line = file.readline()
            assert line.strip() == 'description,img_proxy,ref_uid,file_datetime,filename,export_filename,image_attributes,md5_hash,original_md5,tags,uid,created,modified,modified_by,exported_filename'

            c_images = -1
            while line:
                c_images += 1
                line = file.readline()
                if line and "0f723370-196c-4efd-b6ac-45056d529ec8" in line:
                    assert line.strip() == r''',2020-07-13 13:42:44,,2020-07-13 13:42:44,0f723370-196c-4efd-b6ac-45056d529ec8.png,,"{'width': 2000, 'format': 'PNG', 'height': 2667}",162496802414a2187b79192b354dc17a,162496802414A2187B79192B354DC17A,"""TURTLE""",0f723370-196c-4efd-b6ac-45056d529ec8,2020-07-13 13:42:44,2021-07-06 18:33:05.523949,lkh,A_yummy_turtle.png'''
                if line and "0194cba9d6a800cce8eea57814657d23" in line:
                    assert line.strip() == r''',2020-07-23 12:33:16,,2020-07-23 12:33:16,0194cba9d6a800cce8eea57814657d23.jpg,,"{'width': 2048, 'format': 'JPEG', 'height': 1536}",0194cba9d6a800cce8eea57814657d23,0194CBA9D6A800CCE8EEA57814657D23,"""BROKEN_FILE""",949a8761-c17b-47c2-ba92-b521731d8271,2020-07-23 12:33:16,2021-07-06 18:33:05.460450,sgk,'''
                if line and "009ff417-5982-4c0c-94d3-c7ce2d4baf2e" in line:
                    assert line.strip() == r''',2020-08-03 18:13:46,,2020-08-03 18:13:46,009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png,,"{'width': 444, 'format': 'PNG', 'height': 512}",0ca8cf01d6b21c64a5649aa06064f340,0CA8CF01D6B21C64A5649AA06064F340,"""BROKEN_FILE""",009ff417-5982-4c0c-94d3-c7ce2d4baf2e,2020-08-03 18:13:46,2021-07-06 18:33:05.457464,nvd,AnotherYummyTurtle.png'''

            assert c_images == 14

        for table in ["unit.csv", "locus.csv", "images.csv", "workflow_requests.csv", "pottery.csv"]:
            assert table in target.files.keys()

        for table in ["unit.csv", "locus.csv", "images.csv", "workflow_requests.csv", "pottery.csv",
                      "A_yummy_turtle.png",
                      "AnotherYummyTurtle.png",
                      ]:
            assert table in target.files.keys()

        for table in ["smaller_0f723370-196c-4efd-b6ac-45056d529ec8.png",
                      "0194cba9d6a800cce8eea57814657d23.jpg",
                      "009ff417-5982-4c0c-94d3-c7ce2d4baf2e.png"
                      ]:
            assert table not in target.files.keys()

        assert os.path.isfile(dest_file)
