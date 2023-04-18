import pytest
import datetime

import kioskstdlib
from kioskuser import KioskUser
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
from kioskstdlib import *
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))

config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")
sql = os.path.join(test_path, "sql", "add_users.sql")

log_file = os.path.join(test_path, r"log", "test_log.log")


class Testkioskstdlib(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        cfg = self.get_config(config_file, log_file=log_file)
        return cfg

    def test_init(self, cfg):
        assert cfg.kiosk

    def test_get_file_age_days(self, cfg):
        files = [(os.path.join(test_path, "data", "Varieties_of_emergentism.pdf"), -16),
                 (os.path.join(test_path, "data", "migration class hierarchy.png"), 350)]
        d = datetime.datetime.fromisoformat("2021-01-31T23:37:15")
        for f, age in files:
            assert get_file_age_days(f, d) == age

    def test_local_time_offset_str(self, cfg):
        assert local_time_offset_str("01:00") == "01:00:00"
        assert local_time_offset_str("+01:00") == "01:00:00"
        assert local_time_offset_str("GMT+01:00") == "01:00:00"
        assert local_time_offset_str("GMT+02:05") == "02:05:00"
        assert local_time_offset_str("GMT-02:05") == "-02:05:00"
        assert local_time_offset_str("UTC-03:05") == "-03:05:00"
        assert local_time_offset_str("-02:30") == "-02:30:00"

    def test_byte_size_to_string(self, cfg):
        assert byte_size_to_string(100) == "100 bytes"
        assert byte_size_to_string(1024) == "1 KB"
        assert byte_size_to_string(2040) == "1.99 KB"
        assert byte_size_to_string(2048) == "2 KB"
        assert byte_size_to_string(2048 * 1024) == "2 MB"
        assert byte_size_to_string(2048 * 1024 * 1024) == "2 GB"
        assert byte_size_to_string(2048 * 1024 * 1024 * 1024) == "2048 GB"
        assert byte_size_to_string(2048 * 1024 * 1024 + 100000000) == "2.09 GB"

    def test_get_datetime_template_filename(self, cfg):
        dt = datetime.datetime(year=2022, month=3, day=15, hour=5, minute=4, second=3)
        assert get_datetime_template_filename("kiosk_#a_#d#m#y-#H#M.log", dt) == "kiosk_Tue_150322-0504.log"
        assert get_datetime_template_filename("urap_#a_#d#m#y-#H#M#S.dmp", dt) == "urap_Tue_150322-050403.dmp"

    def test_copy_tree_with_different_dates(self, cfg, shared_datadir):
        dest_sub_dir = os.path.join(shared_datadir, "sub")
        kioskstdlib.clear_dir(shared_datadir)
        kioskstdlib.clear_dir(dest_sub_dir)
        os.rmdir(dest_sub_dir)
        assert os.listdir(shared_datadir) == []
        src_path = os.path.join(test_path, "data")
        src_sub_dir = os.path.join(src_path, "sub")
        kioskstdlib.clear_dir(src_sub_dir)

        assert kioskstdlib.copytree(src_path, shared_datadir, True) == 9
        files = os.listdir(shared_datadir)
        files.sort()
        assert files == ["Dunham's plan of room 5.JPG",
                         'Screenshot_2020-04-28 file-import now with new context management · Issue '
                         '#570 · urapadmin kiosk.png',
                         'Screenshot_2020-05-20 Edit Images Free Online - Father and son Shutterstock '
                         'Editor.png',
                         'Varieties_of_emergentism.pdf',
                         'WinCacheGrind.ini',
                         'beset.png',
                         'filter github issues in projects.png',
                         'logo.png',
                         'migration class hierarchy.png',
                         'sub']

        with open(os.path.join(src_sub_dir, "file1.txt"), "w") as file:
            file.write("first file")
        with open(os.path.join(src_sub_dir, "file2.txt"), "w") as file:
            file.write("second file")

        assert kioskstdlib.copytree(src_path, shared_datadir, True) == 2
        files = os.listdir(dest_sub_dir)
        files.sort()
        assert files == ['file1.txt',
                         'file2.txt']

        assert kioskstdlib.copytree(src_path, shared_datadir, True) == 0

        time.sleep(.2)
        with open(os.path.join(src_sub_dir, "file2.txt"), "w") as file:
            file.write("second file modified")
        assert kioskstdlib.copytree(src_path, shared_datadir, True) == 1
        with open(os.path.join(src_sub_dir, "file2.txt"), "r") as file:
            assert file.readline() == "second file modified"

    def test_copy_tree_with_different_sizes(self, cfg, shared_datadir):
        dest_sub_dir = os.path.join(shared_datadir, "sub")
        kioskstdlib.clear_dir(shared_datadir)
        kioskstdlib.clear_dir(dest_sub_dir)
        os.rmdir(dest_sub_dir)
        assert os.listdir(shared_datadir) == []
        src_path = os.path.join(test_path, "data")
        src_sub_dir = os.path.join(src_path, "sub")
        kioskstdlib.clear_dir(src_sub_dir)

        assert kioskstdlib.copytree(src_path, shared_datadir, False, True) == 9
        files = os.listdir(shared_datadir)
        files.sort()
        assert files == ["Dunham's plan of room 5.JPG",
                         'Screenshot_2020-04-28 file-import now with new context management · Issue '
                         '#570 · urapadmin kiosk.png',
                         'Screenshot_2020-05-20 Edit Images Free Online - Father and son Shutterstock '
                         'Editor.png',
                         'Varieties_of_emergentism.pdf',
                         'WinCacheGrind.ini',
                         'beset.png',
                         'filter github issues in projects.png',
                         'logo.png',
                         'migration class hierarchy.png',
                         'sub']

        with open(os.path.join(src_sub_dir, "file1.txt"), "w") as file:
            file.write("first file")
        with open(os.path.join(src_sub_dir, "file2.txt"), "w") as file:
            file.write("second file")

        assert kioskstdlib.copytree(src_path, shared_datadir, False, True) == 2
        files = os.listdir(dest_sub_dir)
        files.sort()
        assert files == ['file1.txt',
                         'file2.txt']

        assert kioskstdlib.copytree(src_path, shared_datadir, False, True) == 0

        time.sleep(.2)
        with open(os.path.join(src_sub_dir, "file2.txt"), "w") as file:
            file.write("second file modified")
        assert kioskstdlib.copytree(src_path, shared_datadir, False, True) == 1
        with open(os.path.join(src_sub_dir, "file2.txt"), "r") as file:
            assert file.readline() == "second file modified"

    def test_get_ip_addresses(self):
        assert kioskstdlib.get_ip_addresses()
        for address in kioskstdlib.get_ip_addresses():
            assert address.startswith('192.168.')

    def test_delete_any_of(self):
        assert kioskstdlib.delete_any_of("Me in.Stri ng%mit.:Son,de*rzeichen",
                                         " .,:!%*") == "MeinStringmitSonderzeichen"

    def test_adjust_tuple(self):
        assert kioskstdlib.adjust_tuple((1, 2, 3), 5, 0) == (1, 2, 3, 0, 0)
        assert kioskstdlib.adjust_tuple((), 5, "") == ("", "", "", "", "",)
        assert kioskstdlib.adjust_tuple((1, 2, 3, 4, 5), 5, "") == (1, 2, 3, 4, 5)
        assert kioskstdlib.adjust_tuple((1, 2, 3, 4, 5), 3, "") == (1, 2, 3)

    def test_trim_pathsep(self):
        paths = [("c:\\done", "c:\\done"),
                 ("c:\\done\\", "c:\\done"),
                 ("c:\\", "c:\\")
                 ]
        for p in paths:
            assert kioskstdlib.trim_pathsep(p[0]) == p[1]

    def test_get_secure_windows_sub_path(self):
        assert kioskstdlib.get_secure_windows_sub_path(r"e:\my_path") == r"my_path"
        assert kioskstdlib.get_secure_windows_sub_path(r"e:\my_path\another_path") == r"my_path\another_path"
        assert kioskstdlib.get_secure_windows_sub_path(r"\my_path\another_path") == r"my_path\another_path"
        assert kioskstdlib.get_secure_windows_sub_path(r"e:\\ \ \e:\my_path\another_path") == r"my_path\another_path"

    def test_get_kiosk_semantic_version(self):
        assert kioskstdlib.get_kiosk_semantic_version("0.1.1.1") == ("0", "1.1.1")
        assert kioskstdlib.get_kiosk_semantic_version("0.1.1") == ("0", "1.1.0")
        assert kioskstdlib.get_kiosk_semantic_version("1.0.0") == ("1", "0.0.0")

    def test_cmp_semantic_version(self):
        assert kioskstdlib.cmp_semantic_version("1.0.0", "1.1.1") == -1
        assert kioskstdlib.cmp_semantic_version("1.0.0", "1.0.0") == 0
        assert kioskstdlib.cmp_semantic_version("1.1.0", "1.0.0") == 1

        assert kioskstdlib.cmp_semantic_version("1.0.0.0", "1.0.0.1") == -1
        assert kioskstdlib.cmp_semantic_version("1.0.0.0", "1.0.0.0") == 0
        assert kioskstdlib.cmp_semantic_version("1.0.0.1", "1.0.0.0") == 1

        assert kioskstdlib.cmp_semantic_version("1.1.0.0", "2.0.0.0") == -1
        assert kioskstdlib.cmp_semantic_version("2.1.0.0", "2.1.0.0") == 0
        assert kioskstdlib.cmp_semantic_version("2.0.0.0", "1.2.0.0") == 1

        assert kioskstdlib.cmp_semantic_version("2.1.0.0", "2.0.0.0") == 1
        assert kioskstdlib.cmp_semantic_version("2.0.0.0", "2.2.0.0") == -1
