import copy
import logging
import os

import kioskstdlib
from fileimport import FileImport
from fileimportfilter import FileImportFilter
from fileimportqrcodefilter.fileimportqrcodefilter import FileImportQRCodeFilter
from kioskstdlib import report_progress
from sync_config import SyncConfig
from userconfig import UserConfig


class FileSequenceImport(FileImport):
    """
      :todo: refactor _app towards separate TypeRepository/EventManager/PluginLoader classes
    """
    SEQUENCE_SORT_OPTIONS = {"FILE_CREATION_TIME": 0, "NUMERICAL_FILENAME": 1}

    def __init__(self, cfg: SyncConfig, app, method="filesequence_import", user_config: UserConfig = None):
        if method != "filesequence_import":
            raise Exception(f"{self.__class__.__name__}.__init__: "
                            f"Instantiation of FileSequenceImport with method {method} not possible. "
                            f"Use FileImport instead.")
        super().__init__(cfg, app, method, user_config)
        self._exif_filter_present = False
        self.skip_qrcodes_proper = True
        self.use_coded_filenames = False
        self.sort_sequence_by = self.SEQUENCE_SORT_OPTIONS["FILE_CREATION_TIME"]
        self.use_exif_time = False
        self.image_manipulation_set = ""
        self._initialize_filters()

    def _initialize_filters(self):

        try:
            std_filter = self.get_file_import_filter("FileImportStandardFileFilter")
            assert std_filter
            std_filter.activate()
            std_filter.set_filter_configuration_values({"get_identifier_from_filename": True})
            std_filter.set_filter_configuration_values({"get_date_from_file": True})
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._initialize_filters: "
                          f"Error when initializing StandardFileFilter: {repr(e)}")
            raise e

        try:
            std_filter = self.get_file_import_filter("FileImportQRCodeFilter")
            assert std_filter
            std_filter.activate()
            std_filter.set_filter_configuration_values({"get_identifier": True})
            std_filter.set_filter_configuration_values({"get_date": True})
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._initialize_filters: "
                          f"Error when initializing FileImportQRCodeFilter: {repr(e)}")
            raise e

        try:
            std_filter = self.get_file_import_filter("FileImportExifFilter")
            if std_filter:
                std_filter.activate()
                std_filter.set_filter_configuration_values({"get_context_from_exif": False})
                std_filter.set_filter_configuration_values({"get_date_from_exif": True})
                std_filter.set_filter_configuration_values({"get_description_from_exif": False})
                self._exif_filter_present = True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._initialize_filters: "
                          f"Error when initializing FileImportQRCodeFilter: {repr(e)}")
            raise e

    def get_wtform_values(self):
        values = super().get_wtform_values()
        values["skip_qrcodes_proper"] = self.skip_qrcodes_proper
        values["use_coded_filenames"] = self.use_coded_filenames
        values["sort_sequence_by"] = self.sort_sequence_by
        values["use_exif_time"] = self.use_exif_time
        values["image_manipulation_set"] = self.image_manipulation_set
        return values

    def form_to_config(self, form):
        if not form:
            raise Exception(f"{self.__class__.__name__}.form_to_config: No form given.")

        if hasattr(form, "skip_qrcodes_proper"):
            self.skip_qrcodes_proper = form.skip_qrcodes_proper.data
            self._config["skip_qrcodes_proper"] = self.skip_qrcodes_proper
        if hasattr(form, "use_coded_filenames"):
            self.use_coded_filenames = form.use_coded_filenames.data
            self._config["skip_qrcodes_proper"] = self.use_coded_filenames
        if hasattr(form, "sort_sequence_by"):
            self.sort_sequence_by = form.sort_sequence_by.data
            self._config["sort_sequence_by"] = self.sort_sequence_by
        if hasattr(form, "use_exif_time"):
            self.use_exif_time = form.use_exif_time.data
            self._config["use_exif_time"] = self.use_exif_time
        if hasattr(form, "image_manipulation_set"):
            self.image_manipulation_set = form.image_manipulation_set.data
            self._config["image_manipulation_set"] = self.image_manipulation_set

        super().form_to_config(form)

    def set_from_dict(self, d: dict):
        super().set_from_dict(d)

        if "skip_qrcodes_proper" in d:
            self.skip_qrcodes_proper = d["skip_qrcodes_proper"]
            self._config["skip_qrcodes_proper"] = self.skip_qrcodes_proper

        if "use_coded_filenames" in d:
            self.use_coded_filenames = d["use_coded_filenames"]
            self._config["use_coded_filenames"] = self.use_coded_filenames

        if "sort_sequence_by" in d:
            self.sort_sequence_by = d["sort_sequence_by"]
            self._config["sort_sequence_by"] = self.sort_sequence_by

        if "use_exif_time" in d:
            self.use_exif_time = d["use_exif_time"]
            self._config["use_exif_time"] = self.use_exif_time

        if "image_manipulation_set" in d:
            self.image_manipulation_set = d["image_manipulation_set"]
            self._config["image_manipulation_set"] = self.image_manipulation_set

    def check_more_import_requirements(self):
        return self.check_sequence_import_requirements()

    def check_sequence_import_requirements(self):
        std_filter: FileImportFilter = self.get_file_import_filter("FileImportStandardFileFilter")
        if not std_filter or not std_filter.is_active():
            logging.error("FileSequenceImport.check_sequence_import_requirements: "
                          "FileImportStandardFileFilter not available")
            return False

        qr_filter: FileImportFilter = self.get_file_import_filter("FileImportQRCodeFilter")
        if not qr_filter or not qr_filter.is_active():
            logging.error("FileSequenceImport.check_sequence_import_requirements: FileImportQRCodeFilter not available")
            return False

        if self.use_exif_time:
            std_filter: FileImportFilter = self.get_file_import_filter("FileImportExifFilter")
            if not std_filter or not std_filter.is_active():
                logging.error("FileSequenceImport.check_sequence_import_requirements: "
                              "FileImportExifFilter not available")
                return False
        if not self.image_manipulation_set:
            logging.error("FileSequenceImport.check_sequence_import_requirements: no image manipulation set given")
            return False
        else:
            qr_filter.set_filter_configuration_values({"recognition_strategy": self.image_manipulation_set})

        return True

    def _r_add_files_to_repository(self, pathname, level=0) -> bool:
        """

        :param pathname: the pathname for this level of recursion
        :param level: just to be on the safe side: More than 10 levels of recursion will not be allowed.
        :return: boolean. If false, recursion will stop.
        """
        logging.info(f"{self.__class__.__name__}._r_add_files_to_repository: searching directory " + pathname)
        subdir = kioskstdlib.get_filename(kioskstdlib.trim_pathsep(pathname))
        if subdir.lower() == "done":
            logging.debug(f"{self.__class__.__name__}._r_add_files_to_repository: Path {pathname} skipped because "
                          f"it is supposed to contain"
                          f"already processed files.")
            return True

        if level > 10:
            logging.error(f"{self.__class__.__name__}._r_add_files_to_repository: Recursion went deeper than level 10.")
            return False

        try:
            content = [os.path.join(pathname, x) for x in os.listdir(pathname)]
        except Exception as e:
            logging.error(f"{self.__class__.__name__}._r_add_files_to_repository: "
                          f"Exception in _r_add_files_to_repository: " + repr(e))
            return False

        files = self._get_sorted_files(content)

        self._context = {}
        current_context = {}
        current_sequence = []

        for f in files:
            if self.callback_progress and \
                    not report_progress(self.callback_progress,
                                        progress=0,
                                        topic="import-local-files",
                                        extended_progress=[self.files_processed, self.files_added]):
                logging.error("FileImport._r_add_files_to_repository: process aborted from outside")
                return False

            new_context = self.get_context_from_qr_code(f)
            self.files_processed += 1

            if "import" in new_context and not new_context["import"]:
                continue

            if current_context:
                #  there is a current context
                if new_context and "identifier" in new_context:
                    #  That's the end of the sequence or the start of a new one (because the old one was not closed)
                    if new_context["identifier"] == current_context["identifier"]:
                        # sequence closed: Import it
                        logging.debug(f"{self.__class__.__name__}._r_add_files_to_repository: "
                                      f"Sequence '{current_context['identifier']} "
                                      f"closing with file {kioskstdlib.get_filename(f)}.")
                        if not self.skip_qrcodes_proper:
                            current_sequence.append(f)
                        self._context = current_context
                        self._import_sequence(current_sequence)
                        self._context = {}
                        current_context = {}
                        current_sequence = []
                    else:
                        # sequence not properly closed but new sequence starts.
                        logging.warning(f"Sequence '{current_context['identifier']} not properly closed.")
                        logging.warning(f"  -> {len(current_sequence)} files were not imported.")
                        current_context = new_context
                        current_sequence = []
                        if not self.skip_qrcodes_proper:
                            current_sequence.append(f)
                else:
                    # no new context but an open sequence
                    logging.debug(f"{self.__class__.__name__}._r_add_files_to_repository: "
                                  f"Adding file {kioskstdlib.get_filename(f)}."
                                  f"to sequence '{current_context['identifier']} ")
                    current_sequence.append(f)
            else:
                # no current context
                if new_context and "identifier" in new_context:
                    # but a new context was found:
                    current_context = new_context
                    current_sequence = []
                    if not self.skip_qrcodes_proper:
                        current_sequence.append(f)
                    logging.debug(f"{self.__class__.__name__}._r_add_files_to_repository: "
                                  f"Sequence '{current_context['identifier']} "
                                  f"started with file {kioskstdlib.get_filename(f)}.")
                else:
                    # import an image without identifier
                    if not self.add_needs_context:
                        self._context = {}
                        logging.debug(f"{self.__class__.__name__}._r_add_files_to_repository: "
                                      f"imported context-independent {kioskstdlib.get_filename(f)}.")
                        if self._import_single_file_to_repository(f):
                            self.files_added += 1

        if current_sequence:
            # sequence not properly closed but new sequence starts.
            logging.warning(f"Sequence '{current_context['identifier']} not properly closed.")
            logging.warning(f"  -> {len(current_sequence)} files were not imported.")
            self._context = {}

        if self.recursive:
            dirs = sorted([x for x in content if os.path.isdir(x) and not kioskstdlib.is_dir_hidden(x)])
            for d in dirs:
                if not os.path.islink(d):
                    if not self._r_add_files_to_repository(d, level + 1):
                        return False

        return True

    def _import_sequence(self, sequence: list):
        for f in sequence:
            if self._import_single_file_to_repository(f):
                self.files_added += 1

    def _get_sorted_files(self, content):
        if self._file_extensions:
            self._file_extensions = [x.strip() for x in self._file_extensions]
            # print(f"file_extensions is {self._file_extensions}")
            files = [x for x in content if os.path.isfile(x) and
                     (kioskstdlib.get_file_extension(x)) and
                     (kioskstdlib.get_file_extension(x).lower() in self._file_extensions)
                     ]
        else:
            # print(f"self._file_extensions is null")
            files = [x for x in content if os.path.isfile(x)]

        if self.sort_sequence_by == self.SEQUENCE_SORT_OPTIONS["FILE_CREATION_TIME"]:
            for idx, file_path_and_name in enumerate(files):
                files[idx] = (file_path_and_name, kioskstdlib.get_earliest_date_from_file(file_path_and_name))
        elif self.sort_sequence_by == self.SEQUENCE_SORT_OPTIONS["NUMERICAL_FILENAME"]:
            for idx, file_path_and_name in enumerate(files):
                files[idx] = (file_path_and_name,
                              kioskstdlib.force_positive_int_from_string(file_path_and_name,
                                                                         ignore_non_digit_strings=False))

        files = [x[0] for x in sorted(files, key=lambda x: x[1])]
        return files

    def has_stop_code(self, path_and_filename: str):
        return False

    def get_context_from_qr_code(self, f):
        # noinspection PyTypeChecker
        qr_filter: FileImportQRCodeFilter = self.get_file_import_filter("FileImportQRCodeFilter")
        if not qr_filter.is_active():
            raise Exception(f"{self.__class__.__name__}.build_context : QR Code Filter got deactivated")

        qr_filter.set_path_and_filename(f)
        new_context = {}
        new_context = qr_filter.get_file_information(new_context)
        if new_context:
            if "type" in qr_filter.qr_code_data and qr_filter.qr_code_data["type"] == "M":
                return new_context
            else:
                logging.info(f"{self.__class__.__name__}.get_context_from_qr_code : "
                             f"file {kioskstdlib.get_filename(f)} has a QR Code but it is not a sequence marker: "
                             f"The file is skipped entirely.")
                return {"import": False}
        return {}

    def build_context(self, f):
        new_context = copy.deepcopy(self._context)
        new_context["import"] = True

        file_filters = []
        if self.use_exif_time:
            file_filters.append("FileImportEXIFFilter")
        file_filters.append("FileImportStandardFileFilter")
        for file_filter_name in file_filters:
            file_filter: FileImportFilter = self.get_file_import_filter(file_filter_name)
            if not file_filter.is_active():
                raise Exception(f"{self.__class__.__name__}.build_context : {file_filter_name} got deactivated")

            # get timestamp from exif or file filter
            file_filter.set_path_and_filename(f)
            more_context = file_filter.get_file_information({})
            if "year" in more_context:
                for x in ["day", "month", "year", "hour", "minute", "second"]:
                    if x in more_context:
                        new_context[x] = more_context[x]
                break

        return new_context
