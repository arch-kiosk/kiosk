"""
    Plugin and FileImportFilter to retrieve information from the exif parpart of an image.
"""
import copy
import logging
from uuid import uuid4

from kioskfileconverter import KioskFileConverter
from kioskrepresentationtype import KioskRepresentationType
from sync_config import SyncConfig
from syncrepositorytypes import TYPE_FILEIMPORTFILTER
from synchronizationplugin import SynchronizationPlugin
from core.synchronization import Synchronization
from core.fileimportfilter import FileImportFilter
from filecontextutils import FileContextUtils
from .qrcodedfile import QRCodedFile
from .qrcodetester import QRCodeTester
from image_manipulation.imagemanipulationstrategyfactory import ImageManipulationStrategyFactory

try:
    from werkzeug.datastructures import ImmutableMultiDict
    from kioskconfig import KioskConfig
    from flask_wtf import FlaskForm
    from wtforms.validators import DataRequired, Length, EqualTo, ValidationError
    from kioskwtforms import KioskLabeledBooleanField, KioskStringField, is_checked, always_error, \
        KioskGeneralFormErrors, KioskLabeledStringField, KioskLabeledSelectField

    FLAG_FORMS_PRESENT = True
except:
    FLAG_FORMS_PRESENT = False


# ************************************************************************
# Plugin code for PluginFileImportQRCodeFilter
# ************************************************************************
class PluginFileImportQRCodeFilter(SynchronizationPlugin):
    _plugin_version = 1.0

    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            FileImportQRCodeFilter.register_type(app)
            # logging.debug("PluginFileImportQRCodeFilter: FileImportQRCodeFilter has been registered")
        else:
            logging.error("PluginFileImportQRCodeFilter: FileImportQRCodeFilter could not be registered due to no app.")
            return False

        # logging.debug("plugin PluginFileImportQRCodeFilter ready")
        return True


class FileImportQRCodeFilter(FileImportFilter):
    if FLAG_FORMS_PRESENT:
        class FileImportQRCodeFilterForm(FlaskForm, KioskGeneralFormErrors):

            qrcode_filter = KioskLabeledBooleanField(label="get context information from qr code",
                                                     class_="kiosk-dialog-checkbox",
                                                     labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")

            recognition_strategy = KioskLabeledSelectField(label="strategy",
                                                           class_="kiosk-dialog-selectfield",
                                                           labelclass="kiosk-dialog-label")

            get_identifier = KioskLabeledBooleanField(label="get identifier",
                                                      class_="kiosk-dialog-checkbox",
                                                      labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")
            get_date = KioskLabeledBooleanField(label="get date",
                                                class_="kiosk-dialog-checkbox",
                                                labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")

            # recognition_strategy = KioskLabeledStringField(id="qrcode-recognition-strategy",
            #                                                label="strategy",
            #                                                class_="kiosk-dialog-text",
            #                                                labelclass="kiosk-dialog-label")

            def __init__(self, formdata, strategies=[], **kwargs):
                super().__init__(formdata, **kwargs)
                self.recognition_strategy.choices = strategies

            def get_use_filter_field(self):
                return self.qrcode_filter

        def init_form(self, request_form):
            if not request_form:
                request_form = {
                    "qrcode_filter": "true" if self.get_filter_configuration_value("active") else "false",
                    "get_identifier": self.get_filter_configuration_value("get_identifier"),
                    "get_date": self.get_filter_configuration_value("get_date"),
                    "recognition_strategy": self.get_filter_configuration_value("recognition_strategy")
                }
            strategies = self._get_strategies()
            self._form = self.FileImportQRCodeFilterForm(ImmutableMultiDict(request_form), strategies)

        def _get_strategies(self):
            image_manipulation_sets = ImageManipulationStrategyFactory.get_image_manipulation_set_descriptors()
            qr_strategies = self.get_filter_configuration_value("image_manipulation_sets")
            strategies = list([(x["id"], f"{x['name']}: {x['description']}") for x in image_manipulation_sets
                               if x["id"] in qr_strategies])
            strategies.sort()
            return strategies

        def form_to_config(self):
            if not self._form:
                raise Exception("no form in FileImportQRCodeFilter")

            if not self._form.qrcode_filter.data:
                self.deactivate()
                print("QRCode Filter deactivated")
            else:
                self.activate()

            conf = {"get_identifier": self._form.get_identifier.data,
                    "get_date": self._form.get_date.data,
                    "recognition_strategy": self._form.recognition_strategy.data}
            self.set_filter_configuration_values(conf)

    @staticmethod
    def get_display_name():
        return "get data from embedded QR-Code"

    @staticmethod
    def get_description():
        return "retrieves information from a QR Code embedded in the image."

    @classmethod
    def register_type(cls, app):
        app.type_repository.register_type(TYPE_FILEIMPORTFILTER, "FileImportQRCodeFilter", cls)

    def __init__(self, cfg: SyncConfig):
        super().__init__(cfg)
        self.needs_type_repository = True
        self.context_utils = FileContextUtils(self._cfg.get_project_id())
        self.context_utils.init_standard_rgx(cfg)
        self.image_manipulation_set = ""
        self.cfg: SyncConfig = cfg
        self.qr_code_data = {}
        # logging.debug("FileImportQRCodeFilter instantiated")

    def get_file_information(self, context) -> dict:
        self.qr_code_data = {}
        if not (self.get_filter_configuration_value("get_identifier") or
                self.get_filter_configuration_value("get_date")
                ) or \
                not self.get_filter_configuration_value("recognition_strategy"):
            self.deactivate()
            return context

        if not (self._type_repository and self._plugin_loader):
            self.deactivate()
            logging.error(
                f"{self.__class__.__name__}.get_file_information: no access to type_repository or plugin_loader.")
            return context

        self.image_manipulation_set = self.get_filter_configuration_value("recognition_strategy")

        qr_code_tester = self._get_and_prepare_qr_code_tester()
        if not qr_code_tester:
            self.deactivate()
            return context

        fc = KioskFileConverter(type_repository=self._type_repository, plugin_loader=self._plugin_loader)
        representation = KioskRepresentationType("Tojpg")
        representation.format_request = {"*": "JPEG"}
        path_and_filename = fc.convert(self.path_and_filename,
                                       representation_type=representation,
                                       dst_path=self.cfg.get_temp_dir(), dst_filename=str(uuid4()))
        if not path_and_filename:
            logging.error(f"FileImportQRCodeFilter.get_file_information: "
                          f"could not convert file {self.path_and_filename} to {self.cfg.temp_dir}")
            return context

        if qr_code_tester.quick_decode(path_and_filename):
            self.qr_code_data = {"timestamp": qr_code_tester.qr_code_recognized.timestamp,
                                 "identifier": qr_code_tester.qr_code_recognized.data,
                                 "type": qr_code_tester.qr_code_recognized.qr_code_type,
                                 "raw": qr_code_tester.qr_code_recognized.raw_data}
            if self.get_filter_configuration_value("get_identifier") and qr_code_tester.qr_code_recognized:
                identifier = qr_code_tester.qr_code_recognized.data
                if identifier:
                    context["identifier"] = identifier
                else:
                    logging.warning(f"identifier {qr_code_tester.qr_code_recognized.data} in qr code of "
                                    f"image {self.path_and_filename} is invalid.")

            if self.get_filter_configuration_value("get_date") and qr_code_tester.qr_code_recognized:
                ts = qr_code_tester.qr_code_recognized.timestamp
                if ts:
                    context["day"] = ts.day
                    context["month"] = ts.month
                    context["year"] = ts.year
                else:
                    logging.warning(f"no proper date in qr code of "
                                    f"image {self.path_and_filename}.")
        else:
            logging.info(f"no qr code detected in image {self.path_and_filename}")

        return context

    def _get_and_prepare_qr_code_tester(self):
        if not self.image_manipulation_set:
            logging.error(f"{self.__class__.__name__}._get_and_prepare_qr_code_tester: "
                          f"call with self.image_manipulaton_set==None")
            return None

        qr_code_tester = QRCodeTester()
        strategies = ImageManipulationStrategyFactory.image_manipulation_set_strategies(self.image_manipulation_set)
        if not strategies or \
                ImageManipulationStrategyFactory.get_image_manipulation_set_strategy_count(
                    self.image_manipulation_set) == 0:
            return None
        qr_code_tester.register_strategies(strategies)
        return qr_code_tester

    def _get_identifier(self, data: str):
        identifier = ""

        if data:
            identifier = self.context_utils.get_identifier_from_string(data, "")

        return identifier

    def set_image_manipulation_set(self, image_manipulation_set):
        """ deprecated: don't use, will go one day. Use set_filter_configuration_values instead! """
        # todo: eliminate
        self.image_manipulation_set = image_manipulation_set
