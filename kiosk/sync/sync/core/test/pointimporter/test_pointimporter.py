import os
import pprint

import pytest

from pointimporter import PointImporter, PointImportError
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestPointImporter(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        cfg = self.get_config(config_file, log_file=log_file)
        return cfg

    def test_init(self, cfg):
        point_importer = PointImporter("somewhere\\strange_file.zzz", {})
        with pytest.raises(PointImportError, match="not supported"):
            point_importer.load(lambda x: x)

    def test_load_csv(self, datadir, cfg):

        def db_writer(row: dict):
            result_dict.append(row)

        print("\n-------------------------\n")
        csv_file = os.path.join(test_path, r"data", "points_1.csv")
        point_importer = PointImporter(csv_file, {
            "csv": {
                "columns": ["point_name", "latitude", "longitude", "elevation"],
                "skip_lines": 1,
                "category_line": 1}
        })
        result_dict = []
        point_importer.load(db_writer)
        assert result_dict == [
            {'category': 'points_1',
             'elevation': '12.123456',
             'latitude': '12.887876761236',
             'longitude': '1234.989873747',
             'point_name': 'p_1'},
            {'category': 'points_1',
             'elevation': '22.123456',
             'latitude': '22.887876761236',
             'longitude': '0.00003747',
             'point_name': 'p_2'},
            {'category': 'points_1',
             'elevation': '32.123456',
             'latitude': '33.887876761236',
             'longitude': '3234.989873747',
             'point_name': 'p_3'}
        ]

    def test_load_sample_points(self, datadir, cfg):

        def db_writer(row: dict):
            result.append([row["category"],
                           row["point_name"],
                           float(row["latitude"]),
                           float(row["longitude"]),
                           float(row["elevation"])
                           ])

        print("\n-------------------------\n")
        csv_file = os.path.join(test_path, r"data", "Sample.GNSS.Points.csv")
        point_importer = PointImporter(csv_file, {
            "csv": {
                "columns": ["point_name", "latitude", "longitude", "elevation"],
                "skip_lines": 1,
                "category_line": 0}
        })
        result = []
        point_importer.load(db_writer)
        assert result == [
            ['Sample.GNSS.Points', "Q3", 460791.479, 2846704.055, 105.691],
            ['Sample.GNSS.Points', "Q3_b", 460791.463, 2846704.068, 105.702],
            ['Sample.GNSS.Points', "Q3_c", 460791.473, 2846704.046, 105.716],
            ['Sample.GNSS.Points', "Q3_d", 460791.449, 2846704.058, 105.727],
            ['Sample.GNSS.Points', "Q3_e", 460791.469, 2846704.067, 105.708],
            ['Sample.GNSS.Points', "Q3_f", 460791.468, 2846704.076, 105.673],
            ['Sample.GNSS.Points', "Q3_g", 460791.478, 2846704.062, 105.682],
            ['Sample.GNSS.Points', "Q3_h", 460791.468, 2846704.057, 105.693]
        ]

    def test_load_excel_sample_points(self, datadir, cfg):

        def db_writer(row: dict):
            result.append([row["category"],
                           row["point_name"],
                           float(row["latitude"]),
                           float(row["longitude"]),
                           float(row["elevation"])
                           ])

        print("\n-------------------------\n")
        csv_file = os.path.join(test_path, r"data", "Sample.GNSS.Points.xlsx")
        point_importer = PointImporter(csv_file, {
            "excel": {
                "columns": ["point_name", "latitude", "longitude", "elevation"],
                "skip_lines": 1,
                "category_line": 0}
        })
        result = []
        point_importer.load(db_writer)
        assert result == [
            ['Sample.GNSS.Points', "Q3", 460791.479, 2846704.055, 105.691],
            ['Sample.GNSS.Points', "Q3_b", 460791.463, 2846704.068, 105.702],
            ['Sample.GNSS.Points', "Q3_c", 460791.473, 2846704.046, 105.716],
            ['Sample.GNSS.Points', "Q3_d", 460791.449, 2846704.058, 105.727],
            ['Sample.GNSS.Points', "Q3_e", 460791.469, 2846704.067, 105.708],
            ['Sample.GNSS.Points', "Q3_f", 460791.468, 2846704.076, 105.673],
            ['Sample.GNSS.Points', "Q3_g", 460791.478, 2846704.062, 105.682],
            ['Sample.GNSS.Points', "Q3_h", 460791.468, 2846704.057, 105.693]
        ]
