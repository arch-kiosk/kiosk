import os

import pytest

import datetime

import kioskstdlib
import kioskdatetimelib
from dsd.dsd3singleton import Dsd3Singleton
from reportingdock import ReportingDock
from reportingdock.reportinglib import ReportingException
from sync_plugins.reportingpdfdriver.reportingpdfdriver import ReportingPDFDriver
from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestReportingOutputDriverPDF(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    def test_driver(self, config, shared_datadir):
        data_dict = {
            'site_code': 'VAC1',
            'trench': 'TR1',
            'conftext': '123-2',
            'created': '2012-03-12',
            'modified_by': 'lkh',
            'description': """Äußerst umlautlastiges Gewürzmöbel. Muro SW de la trinchera LA. También enyesado y pintado como los demás.
            La ventana comienza aproximadamente a un tercio del camino hacia arriba desde el piso y continúa hasta justo debajo del techo.
            La pared está oscurecida en su lado derecho por una cosa de ubicación de estantes (sin número de contexto todavía, agréguelo más tarde cuando lo tenga).
            Incluye en outlet. 15.5 pasos de LOGS de largo. Conectado a las paredes LA-001 y LA-003 (no está claro cómo). SW wall of trench LA. Also plastered and painted like the others. 
            Window starts about a third of the way up from the floor and continues until just below the ceiling. 
            The wall is obscured on its right side by a shelf emplacement thing (no context number yet, add later when you have it). 
            Includes an outlet. 15.5 LOGS steps long. Connected to walls LA-001 and LA-003 (unclear how)."""
        }

        driver = ReportingPDFDriver()
        driver.template_file = os.path.join(shared_datadir, "template.pdf")
        driver._mapped_values = data_dict
        driver.target_file_name_without_extension = "output"
        driver.target_dir = shared_datadir
        driver.mapping_definition = {'dummy': True}
        assert driver
        driver.execute(_on_load_records=lambda x: {})
        print(os.path.join(driver.target_dir, 'output.pdf'))
        assert self.file_exists(os.path.join(driver.target_dir, 'output.pdf'))


