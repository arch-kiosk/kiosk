import shutil

import pytest
import tempfile
import os
import logging
import datetime

import kioskstdlib
from collections import namedtuple

from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
data_dir = os.path.join(test_path, "data")


# @pytest.mark.skip
class TestStandardLibrary(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    def test_calc_image_rect_to_fit_in(self):
        Rect = namedtuple("Rect", ["width", "height"])

        img = Rect(100, 50)
        rect = Rect(50, 50)
        result = kioskstdlib.calc_image_rect_to_fit_in(img.width, img.height, rect.width, rect.height)
        assert result[0] == 50
        assert result[1] == 25

        img = Rect(100, 100)
        rect = Rect(100, 100)
        result = kioskstdlib.calc_image_rect_to_fit_in(img.width, img.height, rect.width, rect.height)
        assert result[0] == 100
        assert result[1] == 100

        img = Rect(50, 100)
        rect = Rect(50, 50)
        result = kioskstdlib.calc_image_rect_to_fit_in(img.width, img.height, rect.width, rect.height)
        assert result[0] == 25
        assert result[1] == 50

        img = Rect(50, 55)
        rect = Rect(50, 50)
        result = kioskstdlib.calc_image_rect_to_fit_in(img.width, img.height, rect.width, rect.height)
        print(result[0])
        assert result[0] == 45
        assert result[1] == 50

    def test_compare_datetimes(self):

        test_cases = [
            (None, datetime.datetime(2019, 1, 1, 8, 0, 0, 0), -2),
            (datetime.datetime(2019, 1, 1, 8, 0, 0, 0), None, -2),
            ("01.02.2019", "01.02.2019", -2),
            (datetime.datetime(2019, 1, 1, 8, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 1, 7, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), -1),
            (datetime.datetime(2019, 1, 1, 9, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), 1),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 0), datetime.datetime(2019, 1, 1, 23, 59, 59, 999999), 1),
            (datetime.datetime(2019, 1, 1, 23, 59, 59, 999999), datetime.datetime(2019, 1, 2, 0, 0, 0, 0), -1),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 1), datetime.datetime(2019, 1, 2, 0, 0, 0, 0), 1),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 0), datetime.datetime(2019, 1, 2, 0, 0, 0, 1), -1)
        ]
        for case in test_cases:
            assert kioskstdlib.compare_datetimes(case[0], case[1]) == case[2], f"Test case {case} failed."

        test_cases = [
            (None, datetime.datetime(2019, 1, 1, 8, 0, 0, 0), -2),
            (datetime.datetime(2019, 1, 1, 8, 0, 0, 0), None, -2),
            ("01.02.2019", "01.02.2019", -2),
            (datetime.datetime(2019, 1, 1, 8, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 1, 7, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), -1),
            (datetime.datetime(2019, 1, 1, 9, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), 1),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 0), datetime.datetime(2019, 1, 1, 23, 59, 59, 999999), 1),
            (datetime.datetime(2019, 1, 1, 23, 59, 59, 999999), datetime.datetime(2019, 1, 2, 0, 0, 0, 0), -1),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 1), datetime.datetime(2019, 1, 2, 0, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 0), datetime.datetime(2019, 1, 2, 0, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 0), datetime.datetime(2019, 1, 2, 0, 0, 0, 1), 0)
        ]
        for case in test_cases:
            assert kioskstdlib.compare_datetimes(case[0], case[1], compare_microseconds=False) == case[
                2], f"Test case {case} failed."

        test_cases = [
            (None, datetime.datetime(2019, 1, 1, 8, 0, 0, 0), -2),
            (datetime.datetime(2019, 1, 1, 8, 0, 0, 0), None, -2),
            ("01.02.2019", "01.02.2019", -2),
            (datetime.datetime(2019, 1, 1, 8, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 1, 7, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 1, 8, 0, 0, 0), datetime.datetime(2019, 1, 1, 7, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 1, 7, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 8, 0, 0, 0, 0), datetime.datetime(2019, 1, 7, 0, 0, 0, 0), 1),
            (datetime.datetime(2019, 1, 7, 0, 0, 0, 0), datetime.datetime(2019, 1, 8, 0, 0, 0, 0), -1),
            (datetime.datetime(2019, 1, 1, 9, 0, 0, 0), datetime.datetime(2019, 1, 1, 8, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 0), datetime.datetime(2019, 1, 1, 23, 59, 59, 999999), 1),
            (datetime.datetime(2019, 1, 1, 23, 59, 59, 999999), datetime.datetime(2019, 1, 2, 0, 0, 0, 0), -1),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 1), datetime.datetime(2019, 1, 2, 0, 0, 0, 0), 0),
            (datetime.datetime(2019, 1, 2, 0, 0, 0, 0), datetime.datetime(2019, 1, 2, 0, 0, 0, 1), 0)
        ]
        for case in test_cases:
            assert kioskstdlib.compare_datetimes(case[0], case[1], compare_time=False) == case[
                2], f"Test case {case} failed."

    def test_get_valid_filename(self):
        assert kioskstdlib.get_valid_filename("john's portrait in 2004.jpg") == "johns_portrait_in_2004.jpg"
        assert kioskstdlib.get_valid_filename("Some.ltz") == "Some.ltz"
        assert kioskstdlib.get_valid_filename("?Some.ltz?") == "Some.ltz"
        assert kioskstdlib.get_valid_filename("Some Some.ltz") == "Some_Some.ltz"
        assert kioskstdlib.get_valid_filename("Some;Some.ltz") == "Some;Some.ltz"
        filename128 = 'a' * 128 + ".ltz"
        assert kioskstdlib.get_valid_filename(filename128) == 'a' * 124 + ".ltz"

    def test_get_unique_filename(self):
        assert kioskstdlib.get_unique_filename("c:\\")[0:3] == "c:\\"
        assert kioskstdlib.get_unique_filename("c:\\", filename="somefile.txt") == "c:\\somefile.txt"
        assert kioskstdlib.get_unique_filename("c:\\temp", file_extension="txt")[-4:] == ".txt"
        assert kioskstdlib.get_unique_filename("c:\\temp", file_extension=".txt")[-4:] == ".txt"

    def test_remove_kiosk_subtree(self, config, monkeypatch):
        _remove_dir: str = ""

        def _rmtree(dir_to_remove):
            nonlocal _remove_dir
            _remove_dir = dir_to_remove

        assert config.base_path

        # make sure that shutil.rmtree is properly mocked
        monkeypatch.setattr(shutil, "rmtree", _rmtree)
        shutil.rmtree(os.path.join(test_path, "remove_me"))
        assert _remove_dir == os.path.join(test_path, "remove_me")

        # try removing a directory that is not in the kiosk tree
        kiosk_parent_dir = kioskstdlib.get_parent_dir(config.base_path)
        test_dir = os.path.join(kiosk_parent_dir, "test_remove_kiosk_subtree")
        try:
            os.mkdir(test_dir)
        except BaseException as e:
            pass
        assert os.path.isdir(test_dir)

        _remove_dir = ""
        with pytest.raises(Exception):
            kioskstdlib.remove_kiosk_subtree(test_dir)
        assert not _remove_dir

        os.rmdir(test_dir)

        # try remove a kiosk sub directory
        test_dir = os.path.join(config.temp_dir, "test_remove_kiosk_subtree")
        try:
            os.mkdir(test_dir)
        except BaseException as e:
            pass
        assert os.path.isdir(test_dir)

        _remove_dir = ""
        kioskstdlib.remove_kiosk_subtree(test_dir)
        assert _remove_dir == test_dir

        os.rmdir(test_dir)

    def test_get_file_age_since_epoch(self):
        image_a = os.path.join(data_dir, "imageA.png")
        image_b = os.path.join(data_dir, "imageB.png")
        assert kioskstdlib.get_file_date_since_epoch(image_a) == 1643342654692.58
        assert kioskstdlib.get_file_date_since_epoch(image_b) == 1643342624091.7612

        assert kioskstdlib.get_file_date_since_epoch(image_a, use_most_recent_date=False) == 1589680600013.0
        assert kioskstdlib.get_file_date_since_epoch(image_b, use_most_recent_date=False) == 1595530937379.0

    def test_find_files(self):

        files = kioskstdlib.find_files(data_dir, file_pattern="*.txt", include_path=False)
        assert files == []

        files = kioskstdlib.find_files(data_dir, file_pattern="*.*", include_path=False)
        assert files == ['imageA.png', 'imageB.png', 'imageC.png', 'imageD.png']

        files = kioskstdlib.find_files(data_dir, file_pattern="*.*", include_path=False, order_by_time=True)
        assert files == ['imageB.png', 'imageA.png', 'imageD.png', 'imageC.png']

        files = kioskstdlib.find_files(data_dir, file_pattern="*.*", include_path=True, order_by_time=True)
        assert files == [os.path.join(data_dir, f) for f in ['imageB.png', 'imageA.png', 'imageD.png', 'imageC.png']]

    def test_force_positive_int_from_string(self):
        assert kioskstdlib.force_positive_int_from_string("") == -1
        assert kioskstdlib.force_positive_int_from_string("123") == 123
        assert kioskstdlib.force_positive_int_from_string("123 123") == 123123
        assert kioskstdlib.force_positive_int_from_string("000 001") == 1
