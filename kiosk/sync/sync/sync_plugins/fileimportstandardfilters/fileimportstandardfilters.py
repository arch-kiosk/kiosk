"""
    Plugin and FileImportFilters for Standard Filters.
    StandardFilters are the StandardValuesFilter,
    a filter which retrieves information from the folders in the folder structure of a file and
    a filter which retrieves information from the file as handled by the operating system itself.
"""

import logging
import os
import datetime
from sync_config import SyncConfig
import kioskstdlib

from syncrepositorytypes import TYPE_FILEIMPORTFILTER
from synchronizationplugin import SynchronizationPlugin
from core.synchronization import Synchronization
from core.fileimportfilter import FileImportFilter
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
# Plugin: PluginFileImportStandardFilters
# ************************************************************************
class PluginFileImportStandardFilters(SynchronizationPlugin):
    """ The short plugin part registers the Filters as types in the app's type repository.
        All FileImportFilters have to be registered under the topic syncrepositorytypes.TYPE_FILEIMPORTFILTER
        to be found by the file repository's file import class.
    """
    _plugin_version = 1.0
    def all_plugins_ready(self):
        # logging.debug("activating plugin for FileMaker Recording ...")
        app: Synchronization = self.app
        if app:
            FileImportStandardValuesFilter.register_type(app)
            FileImportStandardFolderFilter.register_type(app)
            FileImportStandardFileFilter.register_type(app)
            # logging.debug("PluginFileImportStandardFilters: All the standard filters for "
            #               "the file import have been registered")
        else:
            logging.error("Plugin PluginFileImportStandardFilters can't connect to app.")
            return False

        # logging.debug("plugin PluginFileImportStandardFilters ready")
        return True


# ************************************************************************
# FileImportFilter: FileImportStandardValuesFilter
# ************************************************************************
class FileImportStandardValuesFilter(FileImportFilter):
    """
       This filter defines the standard values of those context keys that will no be
       retrieved from a file by one of the more specific filters.
       It should be configured in the config.yml to have the lowest priority 0.
       The filter receives a special treatment by the file_repository's fileimport class,
       since it's special methods get_standard_values and set_standard_values are called
       explicitly by whoever initiates the file import.
    """
    if FLAG_FORMS_PRESENT:
        class FileImportStandardValuesFilterForm(FlaskForm, KioskGeneralFormErrors):
            standard_values_filter = KioskLabeledBooleanField(label="defaults")
            default_context = KioskLabeledStringField(label="default identifier",
                                                      class_="kiosk-dialog-textfield",
                                                      labelclass="kiosk-dialog-label",
                                                      errclass="kiosk-err-border")
            default_timestamp = KioskLabeledStringField(label="default date and time",
                                                        class_="kiosk-dialog-textfield",
                                                        labelclass="kiosk-dialog-label",
                                                        errclass="kiosk-err-border")

            def validate_default_context(form, field):
                if form.standard_values_filter.data:
                    if not field.data and not form.default_timestamp.data:
                        form.add_general_form_error(
                            "If you activate default values, you should supply information in at least one of the fields.")
                        raise ValidationError("Please enter something either here ...")

            def validate_default_timestamp(form, field):
                if form.standard_values_filter.data:
                    if not field.data and not form.default_context.data:
                        raise ValidationError("... or here.")
                    if field.data:
                        if not kioskstdlib.guess_datetime(field.data):
                            raise ValidationError("what kind of date is that?")

            def get_use_filter_field(self):
                return self.standard_values_filter

        def init_form(self, request_form):
            if not request_form:
                request_form = {
                    "standard_values_filter": "true" if self.get_filter_configuration_value("active") else "false"
                }
            self._form = self.FileImportStandardValuesFilterForm(ImmutableMultiDict(request_form))

        def form_to_config(self):
            if not self._form:
                raise Exception("no form in FileImportStandardValuesFilter")
            if not self._form.standard_values_filter.data:
                self.deactivate()
                print("StandardValuesFilter deactivated")
            else:
                self.activate()

            conf = {"identifier": self._form.default_context.data}

            thedate: datetime.datetime = kioskstdlib.guess_datetime(self._form.default_timestamp.data)
            if thedate:
                conf["day"] = thedate.day
                conf["month"] = thedate.month
                conf["year"] = thedate.year

            self.set_filter_configuration_values({"values": conf})

    @staticmethod
    def get_display_name():
        return "default context"

    @staticmethod
    def get_description():
        return "The standard values apply only if no other filter succeeds."

    @classmethod
    def register_type(cls, app):
        app.type_repository.register_type(TYPE_FILEIMPORTFILTER, "FileImportStandardValuesFilter", cls)

    def __init__(self, cfg: SyncConfig):
        super().__init__(cfg)
        # logging.debug("FileImportStandardValuesFilter instantiated")

    def get_standard_values(self):
        """
            returns the internal standard values that must have been set
            before by the caller who initiated the file import.
        """
        return self.get_filter_configuration_value("values")

    def set_standard_values(self, standard_values):
        """
        replaces a current set of standard values with the given new set
        Used by the method that initiates the file import
        before file import starts. Otherwise there simply won't be
        standard values to fall back to if no other filter yiels any
        specific value.

        :param standard_values: dictionary with standard values that will be returned as file information,
                regardless of the file
        :return: Nothing
        """
        self.set_filter_configuration_values({"values": standard_values})

    def get_file_information(self, context) -> dict:
        """
        implements the FileImportFilter method and so
        returns the standard values set before by set_standard_values to the
        file importer.

        :param context: the file information given so far.
        :return: The file information given so far
                 plus the added or updated information from the set standard values
        """
        if not self.get_filter_configuration_value("values"):
            self.deactivate()
            return context

        context = {**context, **self.get_filter_configuration_value("values")}
        if "identifier" in context:
            if not self.evaluate_identifier(context["identifier"]):
                context.pop("identifier")

        print(f"FileImportStandardValuesFilter: File {self.path_and_filename} processed.")
        return context


# ************************************************************************
# FileImportFilter: FileImportStandardFolderFilter
# ************************************************************************

class FileImportStandardFolderFilter(FileImportFilter):
    """
        This filter tries to extract the date and identifier from the path in which a file is stored.
        The file needs to be set using set_path_and_filename before calling get_file_information.

        configuration-settings for this filter:
          get_date_from_folder: True,
          get_identifier_from_folder: True,
    """

    if FLAG_FORMS_PRESENT:
        class FileImportStandardFolderFilterForm(FlaskForm, KioskGeneralFormErrors):
            standard_folder_filter = KioskLabeledBooleanField(label="identifier from operating system folder")
            get_identifier_from_folder = KioskLabeledBooleanField(label="get identifier from folder",
                                                                  class_="kiosk-dialog-checkbox",
                                                                  labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")
            get_date_from_folder = KioskLabeledBooleanField(label="get date from folder",
                                                            class_="kiosk-dialog-checkbox",
                                                            labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")

            def get_use_filter_field(self):
                return self.standard_folder_filter

        def init_form(self, request_form):
            if not request_form:
                request_form = {
                    "standard_folder_filter": "true" if self.get_filter_configuration_value("active") else "false",
                    "get_identifier_from_folder": self.get_filter_configuration_value("get_identifier_from_folder"),
                    "get_date_from_folder": self.get_filter_configuration_value("get_date_from_folder")
                }
            self._form = self.FileImportStandardFolderFilterForm(ImmutableMultiDict(request_form))

        def form_to_config(self):
            if not self._form:
                raise Exception("no form in FileImportStandardFolderFilter")
            if not self._form.standard_folder_filter.data:
                self.deactivate()
            else:
                self.activate()
            conf = {"get_identifier_from_folder": self._form.get_identifier_from_folder.data,
                    "get_date_from_folder": self._form.get_date_from_folder.data}
            self.set_filter_configuration_values(conf)

    @staticmethod
    def get_display_name():
        return "identifier from operating system folder"

    @staticmethod
    def get_description():
        return "Tries to guess the identifier and date from a file's folder hierarchy."

    @classmethod
    def register_type(cls, app):
        app.type_repository.register_type(TYPE_FILEIMPORTFILTER, "FileImportStandardFolderFilter", cls)

    def __init__(self, cfg: SyncConfig):
        super().__init__(cfg)
        # logging.debug("FileImportStandardFolderFilter instantiated")
        self.context_utils = FileContextUtils(self._cfg.get_project_id())
        self.context_utils.init_standard_rgx(cfg)

    def get_file_information(self, context) -> dict:
        if not (self.get_filter_configuration_value("get_date_from_folder") or
                self.get_filter_configuration_value("get_identifier_from_folder") or
                self.get_filter_configuration_value("get_categories_from_folder_description")):
            logging.debug("FileImportStandardFolderFilter: deactivated because non of the services are requested.")
            self.deactivate()
            return context

        path = os.path.normpath(self.path_and_filename).lstrip(os.sep)
        paths = path.split(os.sep)
        base_paths = os.path.normpath(self._base_path).lstrip(os.sep).split(os.sep)
        paths = kioskstdlib.substract_leading_list(paths, base_paths)
        categories = set()
        for current_dir in paths[:-1]:
            this_identifier = ""
            if self.get_filter_configuration_value("get_identifier_from_folder"):
                fmt = self.get_filter_configuration_value("folder_encodings")
                context_info = self.context_utils.get_identifier_from_string(current_dir, fmt)
                if context_info:
                    if self.evaluate_identifier(context_info):
                        context["identifier"] = context_info
                        this_identifier = context_info

            if self.get_filter_configuration_value("get_categories_from_folder_description"):
                if this_identifier:
                    description = self.context_utils.get_description_from_string(current_dir)
                else:
                    description = current_dir
                if description:
                    categories.add(description)

            if self.get_filter_configuration_value("get_date_from_folder"):
                fmt = self.get_filter_configuration_value("folder_encodings")
                d, m, y = self.context_utils.get_date_from_string(current_dir, fmt)
                if d:
                    context["day"] = d
                if m:
                    context["month"] = m
                if y:
                    context["year"] = y
                if d or m or y:
                    try:
                        logging.debug(
                            "context date from folder is now {}.{}.{}".format(context.get("day"), context.get("month"),
                                                                              context.get("year")))
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.get_file_information: {repr(e)}")
                        context.pop("day")
                        context.pop("month")
                        context.pop("year")
        if categories:
            context["categories"] = list(categories)
        print(f"FileImportStandardFolderFilter: File {self.path_and_filename} processed.")
        return context


# ************************************************************************
# FileImportFilter: FileImportStandardFileFilter
# ************************************************************************
class FileImportStandardFileFilter(FileImportFilter):
    """
        This filter tries to extract the date and identifier of the file as stored by the
        operating system. This uses the creation / modification date of the file and
        the filename only to get the identifier.

        configuration-settings for this filter:
           get_date_from_file: True/False,
           get_identifier_from_filename: True/False
    """

    if FLAG_FORMS_PRESENT:
        class FileImportStandardFileFilterForm(FlaskForm, KioskGeneralFormErrors):
            standard_file_filter = KioskLabeledBooleanField(label="context from operating system file")
            get_identifier_from_filename = KioskLabeledBooleanField(label="get identifier from filename",
                                                                    class_="kiosk-dialog-checkbox",
                                                                    labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")

            get_description_from_filename = KioskLabeledBooleanField(label="get description from filename",
                                                                     class_="kiosk-dialog-checkbox",
                                                                     labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")

            get_date_from_file = KioskLabeledBooleanField(label="get date from file",
                                                          class_="kiosk-dialog-checkbox",
                                                          labelclass="kiosk-dialog-label kiosk-dialog-checkbox-label")

            def get_use_filter_field(self):
                return self.standard_file_filter

        def init_form(self, request_form):
            if not request_form:
                request_form = {
                    "standard_file_filter": "true" if self.get_filter_configuration_value("active") else "false",
                    "get_identifier_from_filename": self.get_filter_configuration_value("get_identifier_from_filename"),
                    "get_description_from_filename": self.get_filter_configuration_value(
                        "get_description_from_filename"),
                    "get_date_from_file": self.get_filter_configuration_value("get_date_from_file")
                }
            self._form = self.FileImportStandardFileFilterForm(ImmutableMultiDict(request_form))

        def form_to_config(self):
            if not self._form:
                raise Exception("no form in FileImportStandardFileFilter")
            if not self._form.standard_file_filter.data:
                self.deactivate()
            else:
                self.activate()
            conf = {"get_identifier_from_filename": self._form.get_identifier_from_filename.data,
                    "get_description_from_filename": self._form.get_description_from_filename.data,
                    "get_date_from_file": self._form.get_date_from_file.data}
            self.set_filter_configuration_values(conf)

    @staticmethod
    def get_display_name():
        return "context from operating system file"

    @staticmethod
    def get_description():
        return "Tries to guess identifier, description and date from the filename and the operating" \
               " system's file information."

    @classmethod
    def register_type(cls, app):
        app.type_repository.register_type(TYPE_FILEIMPORTFILTER, "FileImportStandardFileFilter", cls)

    def __init__(self, cfg: SyncConfig):
        super().__init__(cfg)
        self.context_utils = FileContextUtils(self._cfg.get_project_id())
        self.context_utils.init_standard_rgx(cfg)
        # logging.debug("FileImportStandardFileFilter instantiated")

    def get_file_information(self, context) -> dict:
        if not (self.get_filter_configuration_value("get_date_from_file") or
                self.get_filter_configuration_value("get_identifier_from_filename") or
                self.get_filter_configuration_value("get_description_from_filename")):
            logging.debug("FileImportStandardFileFilter: deactivated due to missing configuration values")
            self.deactivate()
            return context

        file_ts: datetime.datetime = None

        if self.get_filter_configuration_value("get_date_from_file"):
            ts = self.context_utils.get_date_from_file(self.path_and_filename)
            if ts:
                file_ts = ts
            if file_ts:
                context["day"] = file_ts.day
                context["month"] = file_ts.month
                context["year"] = file_ts.year
                context["hour"] = file_ts.hour
                context["minute"] = file_ts.minute
                context["second"] = file_ts.second
                logging.debug(f"FileImportStandardFileFilter: date set to {file_ts}")

        if self.get_filter_configuration_value("get_identifier_from_filename"):
            filename = kioskstdlib.get_filename_without_extension(self.path_and_filename)
            context_info = self.context_utils.get_identifier_from_string(filename)
            if context_info:
                identifier = ""
                if self.evaluate_identifier(context_info):
                    identifier = context_info
                    context["identifier"] = identifier
                    logging.debug(f"FileImportStandardFileFilter: identifier set to {context_info}")
                else:
                    logging.debug(f"FileImportStandardFileFilter: identifier {context_info} failed evaluation.")

                if self.get_filter_configuration_value("get_description_from_filename"):
                    if identifier:
                        description = self.context_utils.get_description_from_string(filename)
                    else:
                        description = filename

                    if description:
                        context["description"] = description
                        print(description)
                        logging.debug(f"FileImportStandardFileFilter: description set to {description}")
            else:
                logging.debug(f"FileImportStandardFileFilter: no identifier in {filename}")
                if self.get_filter_configuration_value("get_description_from_filename"):
                    context["description"] = filename
                    print(f"description is {context['description']}")
        else:
            if self.get_filter_configuration_value("get_description_from_filename"):
                context["description"] = kioskstdlib.get_filename_without_extension(self.path_and_filename)
                print(f"description is {context['description']}")

        print(f"FileImportStandardFileFilter: File {self.path_and_filename} processed.")
        return context
