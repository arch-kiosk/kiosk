"""
    Plugin and FileImportFilter to retrieve information from the exif part of an image.
"""
import logging
import kioskpiexif
import piexif.helper

import kioskstdlib
import datetime

from sync_config import SyncConfig
from syncrepositorytypes import TYPE_FILEIMPORTFILTER
from synchronizationplugin import SynchronizationPlugin
from synchronization import Synchronization
from fileimportfilter import FileImportFilter
from filecontextutils import FileContextUtils

try:
    from werkzeug.datastructures import ImmutableMultiDict

    from flask_wtf import FlaskForm
    from wtforms.validators import DataRequired, Length, EqualTo, ValidationError
    from kioskwtforms import KioskLabeledBooleanField, KioskStringField, is_checked, always_error, \
        KioskGeneralFormErrors, KioskLabeledStringField

    FLAG_FORMS_PRESENT = True
except:
    FLAG_FORMS_PRESENT = False


# ************************************************************************
# Plugin code for PluginFileImportExifFilter
# ************************************************************************
class PluginFileImportExifFilter(SynchronizationPlugin):
    """ The short plugin part registers the Filters as types in the app's type repository.
        All FileImportFilters have to be registered under the topic syncrepositorytypes.TYPE_FILEIMPORTFILTER
        to be found by the file repository's file import class.
    """
    _plugin_version = 1.0
    def all_plugins_ready(self):
        app: Synchronization = self.app
        if app:
            FileImportExifFilter.register_type(app)
            # logging.debug("PluginFileImportExifFilter: FileImportExifFilter has been registered")
        else:
            logging.error("PluginFileImportExifFilter: FileImportExifFilter could not be registered due to no app.")
            return False

        # logging.debug("plugin PluginFileImportExifFilter ready")
        return True


# ************************************************************************
# FileImportExifFilter
# ************************************************************************

class FileImportExifFilter(FileImportFilter):
    if FLAG_FORMS_PRESENT:
        class FileImportExifFilterForm(FlaskForm, KioskGeneralFormErrors):
            exif_filter = KioskLabeledBooleanField(label="get context information from exif data",
                                                   class_="kiosk-dialog-checkbox",
                                                   labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")

            get_identifier_exif = KioskLabeledBooleanField(label="get identifier from exif data",
                                                           class_="kiosk-dialog-checkbox",
                                                           labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")
            get_date_from_exif = KioskLabeledBooleanField(label="get date from exif data",
                                                          class_="kiosk-dialog-checkbox",
                                                          labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")
            get_description_from_exif = KioskLabeledBooleanField(label="get image description from exif data",
                                                                 class_="kiosk-dialog-checkbox",
                                                                 labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")
            @staticmethod
            def validate_get_context_from_exif(form, field):
                if form.exif_filter.data:
                    if field.data and form.get_description_from_exif.data:
                        form.add_general_form_error(
                            "Please interpret the exif data either as identifier or as image description.")
                        raise ValidationError("Uncheck this or ...")

            @staticmethod
            def validate_get_description_from_exif(form, field):
                if form.exif_filter.data:
                    if field.data and form.get_identifier_exif.data:
                        raise ValidationError("... this.")

            def get_use_filter_field(self):
                return self.exif_filter

        def init_form(self, request_form):
            if not request_form:
                get_description = self.get_filter_configuration_value("get_description_from_exif")
                request_form = {
                    "exif_filter": "true" if self.get_filter_configuration_value("active") else "false",
                    "get_identifier_exif": self.get_filter_configuration_value("get_context_from_exif"),
                    "get_date_from_exif": self.get_filter_configuration_value("get_date_from_exif"),
                    "get_description_from_exif": get_description
                }
            d = ImmutableMultiDict(request_form)
            self._form = self.FileImportExifFilterForm(d)

        def form_to_config(self):
            if not self._form:
                raise Exception("no form in FileImportExifFilter")
            if not self._form.exif_filter.data:
                self.deactivate()
                print("ExifFilter deactivated")
            else:
                self.activate()

            conf = {"get_context_from_exif": self._form.get_identifier_exif.data,
                    "get_description_from_exif": self._form.get_description_from_exif.data,
                    "get_date_from_exif": self._form.get_date_from_exif.data}
            self.set_filter_configuration_values(conf)

    @staticmethod
    def get_display_name():
        return "exif data"

    @staticmethod
    def get_description():
        return "retrieves information from the exif data that the camera has included in the image when it was shot."

    @classmethod
    def register_type(cls, app):
        app.type_repository.register_type(TYPE_FILEIMPORTFILTER, "FileImportExifFilter", cls)

    def __init__(self, cfg: SyncConfig):
        super().__init__(cfg)
        self.context_utils = FileContextUtils(self._cfg.get_project_id())
        self.context_utils.init_standard_rgx(cfg)
        self._exif_dict = {}
        self._exif_data_read = False
        #logging.debug("FileImportExifFilter instantiated")

    def get_file_information(self, context) -> dict:

        if not (self.get_filter_configuration_value("get_context_from_exif") or
                self.get_filter_configuration_value("get_description_from_exif") or
                self.get_filter_configuration_value("get_date_from_exif")):
            self.deactivate()
            return context

        if not self._exif_data_read:
            if not self._get_exif_dict():
                return context

        if self.get_filter_configuration_value("get_context_from_exif"):
            s = self._get_identifier_from_user_comment()
            if s:
                context["identifier"] = s

        if self.get_filter_configuration_value("get_date_from_exif"):
            ts: datetime.datetime = self._get_date_from_exif()
            if ts:
                context["day"] = ts.day
                context["month"] = ts.month
                context["year"] = ts.year

        if self.get_filter_configuration_value("get_description_from_exif"):
            s = self._get_user_comment_from_exif()
            if s:
                context["description"] = s
        return context

    def _get_exif_dict(self):
        self._exif_dict = {}
        try:
            self._exif_dict = kioskstdlib.get_exif_data(self.path_and_filename)
        except Exception as e:
            logging.error(f"FileImportExifFilter._get_exif_dict: {repr(e)}")

        return self._exif_dict

    def _get_user_comment_from_exif(self):
        user_comment = ""
        if self._exif_dict:
            try:
                # yaml_filename = filename + ".yaml"
                # ff = open(yaml_filename, 'w')
                # for k, v in exif_dict.items():
                #     ff.write(str(k) + ' >>> ' + str(v) + '\n\n')
                # ff.close()
                if "Exif" in self._exif_dict:
                    user_comment = str(
                        piexif.helper.UserComment.load(self._exif_dict["Exif"][kioskpiexif.ExifIFD.UserComment]))
                    if user_comment.find("\x00") > -1:
                        user_comment = user_comment[0:user_comment.find("\x00")]

            except Exception as e:
                logging.debug(
                    f"Non fatal exception in FileImportExifFilter._get_user_comment_from_exif "
                    f"for file {self.path_and_filename}: {repr(e)}")

        return user_comment.strip()

    def _get_identifier_from_user_comment(self):
        identifier = ""

        user_comment = self._get_user_comment_from_exif()

        if user_comment:
            identifier = self.context_utils.get_identifier_from_string(user_comment, "")
            if not identifier:
                logging.info(
                    f"user_comment {user_comment} in file {self.path_and_filename} cannot be read "
                    "as an identifier.")

        return identifier

    # old exif part:
    def _get_date_from_exif(self):
        ts = None
        if self._exif_dict:
            try:
                # yaml_filename = filename + ".yaml"
                # ff = open(yaml_filename, 'w')
                # for k, v in exif_dict.items():
                #     ff.write(str(k) + ' >>> ' + str(v) + '\n\n')
                # ff.close()
                if "Exif" in self._exif_dict:
                    date_and_time = str(self._exif_dict["Exif"][kioskpiexif.ExifIFD.DateTimeOriginal])[2:-1]
                    d, m, y = self.context_utils.get_date_from_string(date_and_time, "")
                    if d and m and y:
                        return datetime.datetime(year=y, day=d, month=m)
                    ts = datetime.datetime.strptime(date_and_time, "%Y:%m:%d %H:%M:%S")
                    if ts:
                        return ts

            except Exception as e:
                logging.debug(
                    f"Non fatal exception in _get_date_from_exif for file {self.path_and_filename}: " + repr(e))
        return ts

    def set_path_and_filename(self, path_and_filename):
        if path_and_filename != self.path_and_filename:
            self._exif_data_read = False
            self._exif_dict = {}
        super().set_path_and_filename(path_and_filename)
