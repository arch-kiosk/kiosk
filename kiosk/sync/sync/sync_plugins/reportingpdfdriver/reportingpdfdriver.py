import logging
import os
import shutil
from typing import Union, Callable, List, Iterator, Tuple

import kioskstdlib
from sync_plugins.reportingpdfdriver.reportingmapperpdf import ReportingMapperPDF
from sync_plugins.reportingdock.reportingoutputdriver import ReportingOutputDriver
from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin
from pdfrw import PdfReader, PdfWriter, PdfObject, PdfDict, PdfName
from datetime import date


# ************************************************************************
# Plugin code for ReportingPDFDriver
# ************************************************************************
class PluginReportingPDFDriver(SynchronizationPlugin):
    _plugin_version = 0.1

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            ReportingPDFDriver.register(app.type_repository)
            logging.debug("PluginReportingPDFDriver: plugin and driver type registered")
        else:
            logging.error("PluginReportingPDFDriver: plugin and driver type could not be registered due to no app.")
            return False

        return True


# ************************************************************************
# ReportingPDFDriver
# ************************************************************************
class ReportingPDFDriver(ReportingOutputDriver):

    ANNOT_KEY = '/Annots'
    ANNOT_FIELD_KEY = '/T'
    ANNOT_VAL_KEY = '/V'
    ANNOT_RECT_KEY = '/Rect'
    SUBTYPE_KEY = '/Subtype'
    WIDGET_SUBTYPE_KEY = '/Widget'

    can_view = False
    can_download = True
    can_zip = True

    @classmethod
    def get_supported_file_extensions(cls):
        return ["pdf"]

    def _get_mapper_class(self):
        return ReportingMapperPDF

    def _prepare_file(self):
        if not os.path.exists(self.target_dir):
            os.mkdir(self.target_dir)
        target_filename = os.path.join(self.target_dir, self.target_file_name_without_extension + ".pdf")
        shutil.copyfile(self.template_file, target_filename)
        logging.info(f"ReportingPDFDriver._prepare_file: creating new pdf {self.template_file}")
        return target_filename

    def execute(self, _on_load_records: Union[Callable[[str, List[str]], Iterator[Tuple]], None]) -> str:
        """
        executes the report
        :param _on_load_records: a callable which gets the table_name and the "columns" list and
                                 returns a generator that returns a new row (a tuple with values)
                                 on each iteration
        :returns the path and filename of the target file
        """
        self.check_premisses()

        target_filename = self._prepare_file()
        pdf = PdfReader(target_filename)
        pdf.Root.AcroForm.update(PdfDict(NeedAppearances=PdfObject('true')))
        p = 0
        for page in pdf.pages:
            p += 1
            annotations = page[self.ANNOT_KEY]
            if annotations:
                for annotation in annotations:
                    if annotation[self.SUBTYPE_KEY] == self.WIDGET_SUBTYPE_KEY:
                        if annotation[self.ANNOT_FIELD_KEY]:
                            key = annotation[self.ANNOT_FIELD_KEY][1:-1]
                            if key in self._mapped_values.keys():
                                annotation.update(
                                    PdfDict(V='{}'.format(self._mapped_values[key]))
                                )
                                annotation.update(PdfDict(AP=''))
                            else:
                                logging.info(f"{self.__class__.__name__}.execute: no value for PDF Field {key}")

        PdfWriter().write(target_filename, pdf)
        return target_filename



