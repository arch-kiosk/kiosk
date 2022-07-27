import logging
import os

import pytest

from dsd.dsd3singleton import Dsd3Singleton
from reportingdock import ReportingDock
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestReportingDock(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    def test_dock(self, config, dsd):
        sync = Synchronization()
        reporting_dock = ReportingDock("rep_dock_1", "a reporting dock",
                                       mapping_definition_filename="mapping_definition",
                                       query_definition_filename="query_definition",
                                       report_file_type="PDf",
                                       template_file="template_file.pdf",
                                       output_file_prefix="output_file_prefix",
                                       variables={"variable1": "value 1",
                                                  "variable2": "value 2"}
                                       )
        assert reporting_dock.save()

        reporting_dock = ReportingDock("rep_dock_1", "")
        assert reporting_dock.exists()
        assert reporting_dock.mapping_definition_filename == "mapping_definition"
        assert reporting_dock.query_definition_filename == "query_definition"
        assert reporting_dock.report_file_type == "PDf"
        assert reporting_dock.template_file == "template_file.pdf"
        assert reporting_dock.output_file_prefix == "output_file_prefix"
        assert reporting_dock.variables == {"variable1": "value 1",
                                            "variable2": "value 2"}

        assert reporting_dock.delete(commit=True)
        reporting_dock = ReportingDock("rep_dock_1", "")
        assert not reporting_dock.exists()
