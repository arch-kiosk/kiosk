import os
import shutil

import pytest

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from filehandlingsets import get_file_handling_set
from fileidentifiercache import FileIdentifierCache
from filemakerrecording.filemakercontrolwindows import FileMakerControlWindows
from kiosksqldb import KioskSQLDb
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper

test_dir = os.path.dirname(os.path.abspath(__file__))
parent_test_dir = kioskstdlib.get_parent_dir(test_dir)
config_file = os.path.join(test_dir, r"data\config\config_test.yml")
log_file = os.path.join(test_dir, r"log\test.log")


# @pytest.mark.skip
class TestFilemakerWorkstation(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture(scope="class")
    def urapdb(self, cfg):
        assert KioskSQLDb.drop_database()
        assert KioskSQLDb.create_database()
        dsd = Dsd3Singleton.get_dsd3()
        dsd.append_file(cfg.dsdfile)
        migration = Migration(dsd, PostgresDbMigration(dsd, KioskSQLDb.get_con()))
        migration.self_check()
        migration.migrate_dataset()
        KioskSQLDb.commit()
        cur = KioskSQLDb.get_dict_cursor()
        return cur

    def test_connections(self, config, urapdb):
        assert config
        assert urapdb

    def test_create_load_workstation(self, config, urapdb):
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        assert not ws.exists()
        ws.recording_group = "default"
        ws.add_option("option1")
        ws.add_option("option2")
        ws.save()
        assert ws.exists()

        ws = FileMakerWorkstation("test_id")
        assert ws.exists()
        assert ws.description == "test_description"
        assert ws.get_id() == "test_id"
        assert ws.recording_group == "default"
        assert ws.has_option("option1")
        assert ws.has_option("option2")

        assert ws.delete(commit=True)

        ws = FileMakerWorkstation("test_id", "test_description",
                                  recording_group="local_computer")
        assert ws
        assert not ws.exists()
        assert ws.save()
        assert ws.exists()

        ws = FileMakerWorkstation("test_id")
        assert ws.exists()
        assert ws.description == "test_description"
        assert ws.get_id() == "test_id"
        assert ws.recording_group == "local_computer"
        assert ws.delete(commit=True)

    def test_create_delete_workstation(self, config, urapdb):
        helper = KioskPyTestHelper()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        ws.recording_group = "default"
        ws.save()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.exists()
        helper.assert_table("test_id_locus", schema="test_id")
        helper.assert_table("test_id_fm_image_transfer", schema="test_id")

        assert ws.delete(True)
        ws = FileMakerWorkstation("test_id", "test_description")
        assert not ws.exists()

        helper.assert_table_missing("test_id_locus", schema="test_id")
        helper.assert_table_missing("test_id_fm_image_transfer", schema="test_id")

    def test_update_workstation(self, config, urapdb):
        helper = KioskPyTestHelper()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        ws.recording_group = "default"
        ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.exists()
        assert ws.recording_group == "default"
        assert ws.description == "test_description"
        assert not ws.has_option("option1")
        ws.add_option("option1")
        ws.add_option("option2")
        assert ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.recording_group == "default"
        assert ws.description == "test_description"
        assert ws.has_option("option1")
        assert ws.has_option("option2")
        ws.drop_option("option1")

        ws.recording_group = "local_computer"
        assert ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.description == "test_description"
        assert ws.recording_group == "local_computer"
        assert not ws.has_option("option1")
        assert ws.has_option("option2")

        ws.description = "new description"
        assert ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.description == "new description"
        assert ws.recording_group == "local_computer"

        # will use default file handling if a file handling set is not there
        ws.recording_group = "no file handling"
        assert ws.save()

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.description == "new description"
        assert ws.recording_group == "no file handling"
        assert get_file_handling_set(ws.recording_group, config).id == "default"

        assert ws.delete(True)
        ws = FileMakerWorkstation("test_id", "test_description")
        assert not ws.exists()

    def test_get_template_filepath_and_name(self, config, urapdb, shared_datadir):

        self.activate_template("recording_v12_template.fmp12", shared_datadir, config)
        self.set_file_repos_dir(config, shared_datadir)

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        ws.recording_group = "default"
        # ws.save()
        assert ws.get_template_filepath_and_name() == os.path.join(kioskstdlib.get_file_path(config.filemaker_template),
                                                                   "recording_groups", "default",
                                                                   kioskstdlib.get_filename(config.filemaker_template))
        assert os.path.isfile(ws.get_template_filepath_and_name())

        dest_path = os.path.join(shared_datadir,
                                 "filemaker",
                                 "recording_groups",
                                 "group1",
                                 kioskstdlib.get_filename(config.filemaker_template))
        print(dest_path)
        # ws.delete(commit=True)

        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        ws.recording_group = "group1"
        assert os.path.isfile(ws.get_template_filepath_and_name("group1"))
        assert ws.get_template_filepath_and_name("group1") == dest_path

    def test__transfer_file_identifier_cache(self, config, urapdb, shared_datadir):

        class MockFm:
            def transfer_table_data_to_filemaker(*argv):
                return True

            def _start_fm_script_and_wait(*argv):
                return True

            def truncate_table(*argv):
                return True

        fic = FileIdentifierCache(Dsd3Singleton.get_dsd3())
        fic.build_file_identifier_cache_from_contexts(True)
        ws = FileMakerWorkstation("test1", "some description")
        ws.callback_progress = lambda *argv: True
        assert ws.save()
        assert ws._transfer_file_identifier_cache(MockFm())

    def test_export_to_correct_template(self, config, urapdb, shared_datadir, monkeypatch):

        def mock_export_check_machine_state(*argv):
            return True

        def mock_start_fm_database(*args, **kwargs):
            nonlocal called_path_and_filename
            called_path_and_filename = kwargs["pathandfilename"]
            raise InterruptedError("ok")

        self.activate_template("recording_v12_template.fmp12", shared_datadir, config)
        self.set_file_repos_dir(config, shared_datadir)

        called_path_and_filename = ""
        monkeypatch.setattr(FileMakerWorkstation, "_export_check_machine_state", mock_export_check_machine_state)
        monkeypatch.setattr(FileMakerControlWindows,
                            "start_fm_database", mock_start_fm_database)

        ws = FileMakerWorkstation("test1", "some description")
        ws.callback_progress = lambda *argv: True
        assert ws.save()
        assert not ws.export()
        assert called_path_and_filename == os.path.join(kioskstdlib.get_file_path(config.filemaker_template),
                                                        "recording_groups", "default",
                                                        kioskstdlib.get_filename(config.filemaker_template))

        ws.recording_group = "local_computer"
        assert ws.save()
        assert not ws.export()
        dest_path = os.path.join(shared_datadir,
                                 "filemaker",
                                 "recording_groups",
                                 kioskstdlib.get_valid_filename("local_computer"),
                                 kioskstdlib.get_filename(config.filemaker_template))
        assert called_path_and_filename == dest_path
        assert ws.delete(True)
        ws = FileMakerWorkstation("test1", "test_description")
        assert not ws.exists()

    @staticmethod
    def activate_template(template_name, shared_datadir, config, recording_group=""):
        src_file = os.path.join(shared_datadir, template_name)
        if recording_group:
            dst_file = os.path.join(shared_datadir,
                                    "filemaker",
                                    "recording_groups",
                                    recording_group,
                                    kioskstdlib.get_filename(config.filemaker_template))
        else:
            dst_file = os.path.join(shared_datadir,
                                    "filemaker",
                                    kioskstdlib.get_filename(config.filemaker_template))

        shutil.copyfile(src_file, dst_file)

    def test_fork(self, config, urapdb, shared_datadir):
        assert config.database_name == "urap_test"
        # KioskSQLDb.run_sql_script(os.path.join(test_dir,
        #                                       "create_database_sqls",
        #                                       "create_master_tables.sql"))

        self.activate_template("recording_v12_template.fmp12", shared_datadir, config)
        ws = FileMakerWorkstation("test1", "some description", sync=Synchronization())

        ws.callback_progress = lambda *argv: True
        assert ws.save()
        assert ws.transition("fork", param_callback_progress=lambda *args: True, commit=True)
        assert ws.get_state() == "READY_FOR_EXPORT"
        assert ws.delete(commit=True)

    def test_export_to_filemaker(self, config, urapdb, shared_datadir, monkeypatch):

        def mock_export_check_machine_state(*argv):
            return True

        # prepare data
        #
        self.set_file_repos_dir(config, shared_datadir)
        assert config.database_name == "urap_test"
        # KioskSQLDb.run_sql_script(os.path.join(test_dir,
        #                                       "create_database_sqls",
        #                                       "create_master_tables.sql"))

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_unit_fa.sql"))

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_fa_dayplans.sql"))

        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "insert_images.sql"),
                                  substitute_variables=config._config["config"])
        KioskSQLDb.run_sql_script(os.path.join(test_dir,
                                              "sqls",
                                              "file_picking_rule_set_1.sql"))

        for f in [('32d4db7e-ef19-4465-90de-5714c413638e', "32d4db7e-ef19-4465-90de-5714c413638e.JPG"),
                  ('21e9156c-c6a2-4229-9d9e-bd712323c4f1', "21e9156c-c6a2-4229-9d9e-bd712323c4f1.NEF"),
                  ('c5107d70-a9c2-4bde-945a-f41c2f11dfd6', "c5107d70-a9c2-4bde-945a-f41c2f11dfd6.SVG")]:
            r = KioskSQLDb.get_first_record_from_sql(f"select filename from images "
                                                    f"where uid = '{f[0]}'")
            assert r["filename"].lower() == os.path.join(shared_datadir, "file_repository", f[1]).lower()

        self.activate_template("recording_v12_template.fmp12", shared_datadir, config)

        # test
        #

        ws = FileMakerWorkstation("test1",
                                  "some description",
                                  sync=Synchronization())

        ws.callback_progress = lambda *argv: True
        assert ws.save()
        assert ws.transition("fork", param_callback_progress=lambda *args: True, commit=True)
        assert ws.get_state() == "READY_FOR_EXPORT"
        assert ws.transition("export_to_filemaker", param_callback_progress=lambda *args: True, commit=True)
        monkeypatch.setattr(FileMakerWorkstation, "_export_check_machine_state", mock_export_check_machine_state)
        assert ws.transition("export_to_filemaker", param_callback_progress=lambda *args: True, commit=True)
        assert os.path.isfile(os.path.join(shared_datadir,
                                           "filemaker",
                                           "to_work_station",
                                           "test1",
                                           "recording_v12.fmp12"))
        assert ws.delete(commit=True)

    def test_renew_workstation(self, config, urapdb):
        helper = KioskPyTestHelper()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws
        ws.recording_group = "default"
        ws.save()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.exists()
        helper.assert_table("test_id_locus", schema="test_id")
        helper.assert_table("test_id_fm_image_transfer", schema="test_id")
        helper.assert_table("test_id_locus", schema="test_id")
        urapdb.execute('INSERT ' +
                       'INTO test_id.test_id_locus (uid_unit, id, type, "opening elevations", "closing elevations", '
                       'description, date_defined, date_closed, interpretation, colour, uid, created, modified, '
                       'modified_by, repl_deleted, repl_tag, formation_process, arch_domain, arch_context, '
                       'recorded_by, elevation_opening_nw, elevation_opening_ne, elevation_opening_sw, '
                       'elevation_opening_se, elevation_closing_nw, elevation_closing_ne, elevation_closing_sw, '
                       'elevation_closing_se, elevation_opening_ct, elevation_closing_ct, width, length, depth, '
                       'volume, datum_point_elevation)' +
                       "VALUES ('d041335f-85ff-4ac0-97c4-291fe739f100', 13, 'dp', '(1) 10.03', '(6) 9.82', 'Material "
                       "found under G10.1-010 and part of G10.1-009 after it was removed. Includes burnt mudbrick, "
                       "light tan, and grey mudbrick. This was a quickly finished locus; once we removed the burnt "
                       "mudbrick, the mudbricks of G10.1-016 became apparent. ', '2018-07-28', '2018-07-28', null, "
                       "'Brown', '8efe5428-1e04-42a3-a934-84b86807983b', '2018-07-28 09:57:42.000000', '2018-08-03 "
                       "22:21:57.000000', 'Rob''s iPad', false, null, null, 'G10.1', 'G10.1-013', 'Rob''s iPad', "
                       "null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);")
        helper.assert_record_exists("test_id_locus", "d041335f-85ff-4ac0-97c4-291fe739f100", "uid_unit", "test_id")
        assert ws.renew()
        ws = FileMakerWorkstation("test_id", "test_description")
        assert ws.exists()
        helper.assert_record_missing("test_id_locus", "d041335f-85ff-4ac0-97c4-291fe739f100", "uid_unit", "test_id")
        helper.assert_table("test_id_locus", schema="test_id")
        helper.assert_table("test_id_fm_image_transfer", schema="test_id")
        helper.assert_table("test_id_locus", schema="test_id")
