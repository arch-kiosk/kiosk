import datetime
import logging
import os

from config import Config
from typerepository import TypeRepository

import kioskstdlib
from filecontextutils import FileContextUtils
from fileimportfilter import FileImportFilter
from filerepository import FileRepository
from sync_config import SyncConfig
from syncrepositorytypes import TYPE_FILEIMPORTFILTER
from kioskstdlib import report_progress
from kioskstdlib import split_or_empty_list
from fileidentifiercache import FileIdentifierCache
from userconfig import UserConfig


class FileImport:
    """
      :todo: refactor _app towards separate TypeRepository/EventManager/PluginLoader classes
    """

    def __init__(self, cfg: SyncConfig, app, method="local_import", user_config: UserConfig = None):
        self._config = {}
        self._user_config: UserConfig = user_config
        self._sync_config = None
        self._file_repository: FileRepository = None
        self.files_processed = 0
        self.files_added = 0
        self.callback_progress = None
        self.pathname = ""
        self.tags = []
        self._file_extensions = []
        self._import_filters: dict = {}
        self._method = method
        self._import_filters_sorted = []
        self._app = app
        self.context_utils = FileContextUtils(cfg.get_project_id())
        self._init_from_config(cfg)
        self._ensure_filter_plugins()
        self._instantiate_filters()
        self._check_identifier = None
        self._modified_by = "sys"

    @property
    def file_repository(self):
        return self._file_repository

    @file_repository.setter
    def file_repository(self, value):
        self._file_repository = value

    @property
    def modified_by(self):
        return self._modified_by

    @modified_by.setter
    def modified_by(self, value):
        self._modified_by = value

    @property
    def identifier_evaluator(self):
        return self._check_identifier

    @identifier_evaluator.setter
    def identifier_evaluator(self, value):
        self._check_identifier = value

    @property
    def file_extensions(self):
        if "file_extensions" in self._config:
            return self._config["file_extensions"]
        else:
            return ["*"]

    @file_extensions.setter
    def file_extensions(self, value):
        self._config["file_extensions"] = value

    @property
    def recursive(self):
        if "recursive" in self._config:
            return self._config["recursive"]
        else:
            return False

    @recursive.setter
    def recursive(self, value):
        self._config["recursive"] = value

    @property
    def add_needs_context(self):
        """
        returns the value of the configuration key "add_needs_context"

        :return: True/False according to the value of the configuration key.
                 If the key is missing, the default is True
        """
        if "add_needs_context" in self._config:
            return self._config["add_needs_context"]
        else:
            return True

    def _ensure_filter_plugins(self):
        if not self._config:
            logging.error(f"FileImport_ensure_filter_plugin: No configuration set.")
            return False
        if not self._app:
            logging.error(f"FileImport_ensure_filter_plugin: No app object set.")
            return False

        plugins_to_load = kioskstdlib.try_get_dict_entry(self._config, "load_plugins", [])
        plugins_to_load = list(set(plugins_to_load))

        if plugins_to_load:
            self._app.load_plugins(plugins_to_load)
        else:
            logging.error("FileImport._ensure_filter_plugins: No plugins configured to load "
                          "under file_import/load_plugins")
        return False

    def get_wtform_values(self):
        values = {"mif_local_path": self.pathname,
                  "recursive": "true" if self.recursive else "false",
                  "add_needs_context": "true" if self.add_needs_context else "false",
                  "file_extensions": ",".join([x.strip() for x in self.file_extensions if x != "*"]),
                  "tags": ",".join(self.tags)
                  }
        return values

    def form_to_config(self, form):
        if not form:
            raise Exception("no form in FileImportStandardValuesFilter")
        if hasattr(form, "mif_local_path"):
            self.pathname = form.mif_local_path.data
            self._config["pathname"] = self.pathname
        if hasattr(form, "recursive"):
            self._config["recursive"] = form.recursive.data
        if hasattr(form, "add_needs_context"):
            self._config["add_needs_context"] = form.add_needs_context.data
        if hasattr(form, "file_extensions"):
            self._config["file_extensions"] = split_or_empty_list(form.file_extensions.data, ",")
        if self._user_config:
            self._user_config.init_topic("file_import", self._config, force_init=True)
        if hasattr(form, "tags"):
            self.tags = split_or_empty_list(form.tags.data, ",")

    def get_file_import_filter_class_names(self) -> list:
        """

        :return: a list of all registered file filters
        """
        return [x for x in self._import_filters]

    def get_file_import_filter(self, import_filter_class_name: str) -> FileImportFilter:
        """
        get a file import filter from the file import (for instance to apply configuration
        values to it)
        :param import_filter_class_name:
        :return: the FileFilter object registered under the given name
        """
        if import_filter_class_name in self._import_filters:
            return self._import_filters[import_filter_class_name]
        else:
            return None

    def _init_from_config(self, config):
        if isinstance(config, Config):
            if self._user_config:
                self._config = self._user_config.init_topic("file_import", config.file_import)
            else:
                self._config = config.file_import

            if 'pathname' in self._config:
                self.pathname = self._config['pathname']

            self._sync_config = config
            if "tags" in self._config:
                self.tags = self._config["tags"]
        else:
            raise DeprecationWarning("fileimport._init_from_config: Obsolete way to call _init_from_config")

    def _instantiate_filters(self):
        if not self._app:
            raise Exception("FileImport._instantiate_filters: No app.")
        type_repos: TypeRepository = self._app.type_repository
        filter_types = type_repos.list_types(TYPE_FILEIMPORTFILTER)

        for filter_type_name in filter_types:
            filter_type = type_repos.get_type(TYPE_FILEIMPORTFILTER, filter_type_name)
            file_import_filter: FileImportFilter = filter_type(self._sync_config)
            if "file_import_filters" in self._config:
                if self._method in self._config["file_import_filters"]:
                    if file_import_filter.__class__.__name__ in self._config["file_import_filters"][self._method]:
                        file_import_filter.set_filter_configuration(
                            self._config["file_import_filters"][self._method][file_import_filter.__class__.__name__])
                        self._import_filters[file_import_filter.__class__.__name__] = file_import_filter
                    else:
                        logging.warning(
                            f"FileImport._instantiate_filters: filter {file_import_filter.__class__.__name__} not "
                            f"configured under method {self._method} in config file!")
                else:
                    logging.warning(
                        f"FileImport._instantiate_filters: method {self._method} not configured in config file!")
            else:
                logging.warning(
                    "FileImport._instantiate_filters: no configuration section 'file_import_filters' "
                    "in config file!")
            if file_import_filter.needs_type_repository:
                file_import_filter.register_type_repository(type_repository=self._app.type_repository,
                                                            plugin_loader=self._app)

    def save_user_filter_configuration(self):
        if self._user_config and self._import_filters:
            for import_filter_name in self._import_filters:
                import_filter: FileImportFilter = self._import_filters[import_filter_name]
                cfg = import_filter.get_filter_configuration()
                if cfg:
                    self._config["file_import_filters"][self._method][import_filter.__class__.__name__] = cfg


    def sort_import_filters(self):
        sorted_filters = list(self._import_filters)
        sorted_filters.sort(key=lambda x: self._import_filters[x].get_filter_priority())
        return sorted_filters

    def execute(self, identifier_evaluator=None) -> bool:
        """
        starts the file import.

        :return: true or false
        """

        if not self.file_repository:
            logging.error("FileImport.execute: No file_repository given")
            return False

        if not os.path.isdir(self.pathname):
            logging.error("FileImport.execute: " + self.pathname + " is not a directory.")
            return False

        if not self.tags:
            self.tags = ["import_" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
            logging.info("FileImport.execute: import run automatically tagged " + self.tags[0])

        self.files_processed = 0
        self.files_added = 0

        report_progress(self.callback_progress,
                        progress=0,
                        topic="import-local-files",
                        extended_progress=[self.files_processed, self.files_added])

        self._file_extensions = kioskstdlib.try_get_dict_entry(self._config, "file_extensions", [])
        self._import_filters_sorted = self.sort_import_filters()

        for context_filter_name in self._import_filters_sorted:
            context_filter: FileImportFilter = self._import_filters[context_filter_name]
            if context_filter.is_active():
                logging.info(f"using filter {context_filter.get_display_name()}")
                if identifier_evaluator:
                    context_filter.register_identifier_evaluator(identifier_evaluator)

        return self._r_add_files_to_repository(self.pathname)

    def _r_add_files_to_repository(self, pathname, level=0) -> bool:
        """

        :param pathname: the pathname for this level of recursion
        :param level: just to be on the safe side: More than 10 levels of recursion will not be allowed.
        :return: boolean. If false, recursion will stop.
        """

        if level > 10:
            logging.error("FileImport._r_add_files_to_repository: Recursion went deeper than level 10.")
            return False

        logging.info("searching directory " + pathname)

        try:
            content = [os.path.join(pathname, x) for x in os.listdir(pathname)]
        except Exception as e:
            logging.error("FileImport.Exception in _r_add_files_to_repository: " + repr(e))
            return False

        if self._file_extensions:
            self._file_extensions = [x.strip() for x in self._file_extensions]
            # print(f"file_extensions is {self._file_extensions}")
            files = sorted([x for x in content if os.path.isfile(x) and
                            (kioskstdlib.get_file_extension(x)) and
                            (kioskstdlib.get_file_extension(x).lower() in self._file_extensions)])
        else:
            # print(f"self._file_extensions is null")
            files = sorted([x for x in content if os.path.isfile(x)])

        for f in files:
            self.files_processed += 1

            # todo: topic should be the class or method name, not something new.
            report_progress(self.callback_progress,
                            progress=0,
                            topic="import-local-files",
                            extended_progress=[self.files_processed, self.files_added])

            if self._import_single_file_to_repository(f):
                self.files_added += 1

            report_progress(self.callback_progress, progress=0, topic="import-local-files",
                            extended_progress=[self.files_processed, self.files_added])

        if self.recursive:
            dirs = sorted([x for x in content if os.path.isdir(x) and not kioskstdlib.is_dir_hidden(x)])
            for d in dirs:
                if not os.path.islink(d):
                    if not self._r_add_files_to_repository(d, level + 1):
                        return False

        return True

    def build_context(self, f):
        context = {"import": True}
        for import_filter_name in self._import_filters_sorted:
            import_filter: FileImportFilter = self._import_filters[import_filter_name]
            if not import_filter.has_identifier_evaluator:
                import_filter.register_identifier_evaluator(self._check_identifier)
            if import_filter.is_active():
                logging.debug(f"trying filter '{import_filter.get_display_name()}' on file {f}")
                import_filter.set_path_and_filename(f)
                new_context = import_filter.get_file_information(context)
                context = new_context
        return context

    def _import_single_file_to_repository(self, f):
        """
        :todo: former return_status_msg needs a new concept. The texts are still in here in comments

        :param f: path and filename of the fie
        :return: Boolean
        """
        try:
            file_description = ""
            if os.path.islink(f) or kioskstdlib.is_file_hidden(f):
                logging.warning("import_single_file_to_repository: file {} hidden or a link -> skipped.".format(f))
                return False

            context = self.build_context(f)

            if not kioskstdlib.try_get_dict_entry(context, "import", True):
                logging.error(f"file {f} has been suppressed by some earlier file import filter")
                return False

            identifier = kioskstdlib.try_get_dict_entry(context, "identifier", "")

            file_ts = None
            if any(x in context for x in ["day", "month", "year"]):
                if any(x in context for x in ["hour", "minute", "second"]):
                    file_ts = datetime.datetime(day=context["day"], month=context["month"], year=context["year"],
                                                hour=context["hour"], minute=context["minute"], second=context["second"]
                                                )
                else:
                    file_ts = datetime.datetime(day=context["day"], month=context["month"], year=context["year"])
            else:
                if "year" in context:
                    file_ts = datetime.datetime(year=context["year"], month=1, day=1)

            file_description = kioskstdlib.try_get_dict_entry(context, "description", "")

            if identifier or (not self.add_needs_context):
                if file_ts:
                    s = f"""pathandfilename={f}, description={file_description}, 
                     identifier={identifier},
                     modified_by={self.modified_by}, create_uuid=True,
                     ts_file: d.m.y={file_ts.day}.{file_ts.month}.{file_ts.year},
                     tags={self.tags}
                     """
                else:
                    s = f"""pathandfilename={f}, description={file_description}, 
                     identifier={identifier},
                     modified_by={self.modified_by}, create_uuid=True,
                     tags={self.tags}
                     """

                logging.info("Adding file to repository: %s" % s)

                return self._add_file_to_repository(path_and_filename=f,
                                                    description=file_description,
                                                    modified_by=self.modified_by,
                                                    identifier=identifier,
                                                    ts_file=file_ts,
                                                    tags=self.tags)
            else:
                logging.warning("File " + f + " not added to repository due to missing or unknown context identifier.")
                return False
                # else:
                #     return False, "context unclear."

        except Exception as e:
            logging.error(f"{self.__class__.__name__}._import_single_file_to_repository: {repr(e)}")
            return False
            # else:
            #     return False, f"Exception in _import_single_file_to_repository: {repr(e)}"

    def import_single_file_to_repository(self, *args, **kwargs):
        if not self.file_repository:
            logging.error("FileImport.execute: No file_repository given")
            return -1

        if not self.tags:
            self.tags = ["import_" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
            logging.info("FileImport.import_single_file_to_repository: File automatically tagged " + self.tags[0])
        else:
            logging.info("FileImport.import_single_file_to_repository: File will be tagged as " + self.tags[0])

        self._import_filters_sorted = self.sort_import_filters()
        return self._import_single_file_to_repository(*args, **kwargs)

    def _add_file_to_repository(self, path_and_filename, identifier="", description="", modified_by="",
                                ts_file=None, tags=None):
        """ adds a file to the repository
        """
        if not self.file_repository:
            logging.error("FileImport.add_files_to_repository: No file_repository given")
            return False

        try:
            ctx_file = self.file_repository.get_contextual_file(None)
            ctx_file.modified_by = modified_by
            ctx_file.ts_file = ts_file
            ctx_file.description = description
            ctx_file.set_tags(tags)
            if identifier:
                ctx_file.contexts.add_context(identifier)

            rc = self.file_repository.add_contextual_file(path_and_filename, ctx_file, override=False)
            if ctx_file.last_error:
                logging.error(f"{path_and_filename} identifier {identifier} troublesome: {ctx_file.last_error}")
            return rc

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._add_file_to_repository : {repr(e)}")
            return False
