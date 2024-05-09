from __future__ import annotations
import sys
import os
import logging

import kioskstdlib
from config import Config
from yamlconfigreader import YAMLConfigReader


class SyncConfig(Config):
    """ **Use SyncConfig._get_config_ to access the project-wide configuration file.**
    It acts like a singleton. The default configuration file is located in the
    main-scripts path as test_kiosk_config.yml.

    The configuration file uses yaml-notation, so should look something like this::

        config:
          logfile: ./log/urap_dev.log
          log_to_screen: True
          dataset_definition: ./config/dsd.yml

    If a different configuration file is
    needed, it can be stated with the default config when _get_config_ is called
    for the first time: cfg = SyncConfig._get_config_({'config_file': '.\\config\\test_kiosk_config.yml'})\n
    The default-configuration can be used also to give standard configuration settings that
    can but need not be contained in the configuration file.
    \n
    The most important configuration file entry is logfile. This also can be
    included in the default configuration. If it cannot be found anywhere, the
    systems default log file will be located the main script's path and called
    default.log.
    """
    _config = None

    @classmethod
    def get_config(cls, default_config: dict = {}, log_warnings=True) -> SyncConfig:
        """This is the singleton call. Use this and not __init__ !
           default_config may contain the key "config_file"
        """
        try:
            if SyncConfig._config is None:
                SyncConfig._config = cls(default_config, log_warnings=log_warnings)
            return SyncConfig._config
        except BaseException as e:
            print(f"Exception in SyncConfig.get_config: {repr(e)}")
            logging.error(f"Exception in SyncConfig.get_config: {repr(e)}")
            return None

    @classmethod
    def release_config(cls):
        cls._release_config()

    @classmethod
    def _release_config(cls):
        SyncConfig._config = None
        if hasattr(cls, "_instance") and cls._instance:
            cls._instance = None

    def __init__(self, default_config={}, log_warnings=True):
        """Don't use this unless you want a separate copy of the configuration"""
        super().__init__(import_mode=self.IMPORT_MODE_FIRST_WINS)

        # initialize defaults
        path = '.' if os.path.dirname(sys.argv[0]) == "" else os.path.dirname(sys.argv[0])
        self._log_warnings = log_warnings
        self.default_config = default_config
        self.configfile = ""
        self.logfile = path + r"\default.log"
        self.log_to_screen = True
        self.test_directory = path + r"\test"
        self.autoload_plugins = None
        self.cache_dir = None
        self.temp_dir = path + r"\temp"
        self.init_error = ""
        if not self._load_config():
            raise Exception(f"SyncConfig.init: {self.init_error}")
        if "logfile" in self.config:
            self.logfile = self.resolve_symbols(self.config["logfile"])
            if self.logfile == "NONE":
                self.logfile = False
                logging.info("Logging-File explicitly set to NONE")

        if "log_to_screen" in self.config:
            self.log_to_screen = bool(self.config["log_to_screen"])

    def _load_config(self):
        fatal_error = False
        if self.default_config:
            if type(self.default_config) is dict:
                if "config_file" in self.default_config:
                    self.configfile = self.default_config["config_file"]
                if "base_path" in self.default_config:
                    self.base_path = self.default_config["base_path"]
            else:
                raise Exception("SyncConfig._load_config: invalid default config initializer: Not a dictionary.")
        if not os.path.isfile(self.configfile):
            raise Exception(f"SyncConfig._load_config: No or invalid configfile given: {self.configfile}")

        yamlreader = YAMLConfigReader(self.configfile)
        self.on_read_config(yamlreader)
        self.read_config(self.configfile)
        self._config["custom_path"] = r"%base_path%\custom\%project_id%"

        if "secure_file" in self.default_config:
            self.read_config(self.default_config["secure_file"])

        if not self.base_path and "base_path" in self.config:
            self.base_path = self.config["base_path"]

        if not self.base_path:
            raise Exception(f"No base path set in config {self.configfile}.")

        if "temp_dir" in self.default_config:
            self.temp_dir = self.default_config["temp_dir"]
        else:
            self.temp_dir = os.path.join(self.base_path, 'temp')
            self.config["temp_dir"] = self.temp_dir
            logging.debug(f"No temp_dir configured. Defaulting to {self.temp_dir}.")

        self.config["custom_path"] = self.resolve_symbols(self._config["custom_path"])
        self.custom_path = self.config["custom_path"]

        if "dataset_definition" in self.config:
            self.dsdfile = self.resolve_symbols(self.config["dataset_definition"])
        else:
            self.dsdfile = ""
            logging.error("No dataset definition configured. Replication cannot operate without.")
            self.init_error = "No dataset definition configured. Replication cannot operate without."
            fatal_error = True

        if "master_view" in self.config:
            self.master_view = self.resolve_symbols(self.config["master_view"])
        else:
            self.master_view = ""
            if self._log_warnings:
                logging.warning("No master view configured. Replication cannot operate without.")
            # init_error = True

        if "filemaker_template" in self.config:
            self.filemaker_template = self.resolve_symbols(self.config["filemaker_template"])
        else:
            self.filemaker_template = ""
            logging.error("No filemaker_template configured. Replication cannot operate without.")
            self.init_error = "No filemaker_template configured. Replication cannot operate without."

        if "filemaker_export_dir" in self.config:
            self.filemaker_export_dir = self.resolve_symbols(self.config["filemaker_export_dir"])
        else:
            self.filemaker_export_dir = ""
            logging.error("No filemaker_export_dir configured. Replication cannot operate without.")
            self.init_error = "No filemaker_export_dir configured. Replication cannot operate without."

        if "filemaker_import_dir" in self.config:
            self.filemaker_import_dir = self.resolve_symbols(self.config["filemaker_import_dir"])
        else:
            self.filemaker_import_dir = ""
            logging.error("No filemaker_import_dir configured. Replication cannot operate without.")
            self.init_error = "No filemaker_import_dir configured. Replication cannot operate without."

        if "expected_filemaker_template_version" in self.config:
            self.expected_filemaker_template_version = self.config["expected_filemaker_template_version"]
        else:
            self.expected_filemaker_template_version = ""
            logging.error("Noexpected_filemaker_template_version configured. Replication cannot operate without.")
            self.init_error = "Noexpected_filemaker_template_version configured. Replication cannot operate without."

        if "filemaker_db_filename" in self.config:
            self.filemaker_db_filename = self.config["filemaker_db_filename"]
        else:
            if self._log_warnings:
                logging.warning("filemaker_db_filename not configured.")

        if "filemaker_db_usr_name" in self.config:
            self.filemaker_db_usr_name = self.config["filemaker_db_usr_name"]
        else:
            if self._log_warnings:
                logging.warning("filemaker_db_usr_name not configured.")

        if "filemaker_db_usr_pwd" in self.config:
            self.filemaker_db_usr_pwd = self.config["filemaker_db_usr_pwd"]
        else:
            if self._log_warnings:
                logging.warning("filemaker_db_usr_pwd not configured.")

        if "test_mode" in self.config:
            self.test_mode = self.config["test_mode"]
        else:
            self.test_mode = False

        if "database_name" in self.config:
            self.database_name = self.config["database_name"]
        else:
            self.database_name = ""
            logging.warning("No database_name in configuration file. It is required!")
            self.init_error = "No database_name in configuration file. It is required!"
            fatal_error = True

        if "database_usr_name" in self.config:
            self.database_usr_name = self.config["database_usr_name"]
        else:
            self.database_usr_name = ""
            logging.warning("No database_usr_name in configuration file. It is required!")
            self.init_error = "No database_usr_name in configuration file. It is required!"
            fatal_error = True

        if "database_usr_pwd" in self.config:
            self.database_usr_pwd = self.config["database_usr_pwd"]
        else:
            self.database_usr_pwd = ""
            if self._log_warnings:
                logging.warning("No database_usr_pwd in configuration file. Looks suspicious!")

        if "database_port" in self.config:
            self.database_port = str(self.config["database_port"])
        else:
            self.database_port = "5432"

        if "database_timeout_sec" in self.config:
            self.database_timeout_sec = self.config["database_timeout_sec"]
        else:
            self.database_timeout_sec = 0

        if "file_repository" in self.config:
            self._file_repository = self.resolve_symbols(self.config["file_repository"])
        else:
            self._file_repository = ""
            logging.warning("no file_repository configured.")
            self.init_error = "no file_repository configured."
            fatal_error = True

        # if "thumbnail_dir" in self.config:
        #     self.thumbnail_dir = self.resolve_symbols(self.config["thumbnail_dir"])
        # else:
        #     self.thumbnail_dir = ""
        #     logging.warning("thumbnail_dir not configured.")

        if "default_resolution" in self.config:
            self.default_resolution = self.config["default_resolution"]
        else:
            self.default_resolution = "high"
            if self._log_warnings:
                logging.warning(
                    "no default resolution for the creation of workstations configured. \"High\" will be used.")

        if "default_recording_group" in self.config:
            self.default_recording_group = self.config["default_recording_group"]
        else:
            self.default_recording_group = "default"

        if "file_handling_definition" in self.config:
            self.file_handling_definition = self.resolve_symbols(self.config["file_handling_definition"])
        else:
            logging.error("no file_handling_definition configured.")

        if "filemaker_encoding" in self.config:
            self.filemaker_encoding = self.config["filemaker_encoding"]
        else:
            self.filemaker_encoding = ""

        if "odbc_ini_dsn" in self.config:
            self.odbc_ini_dsn = self.config["odbc_ini_dsn"]
        else:
            self.odbc_ini_dsn = ""

        if "log_level" in self.config:
            self.log_level = self.config["log_level"].upper()
        else:
            self.log_level = "INFO"

        if "werkzeug_log_level" in self.config:
            self.werkzeug_log_level = self.config["werkzeug_log_level"].upper()
        else:
            self.werkzeug_log_level = "INFO"

        if "fork_ignore_missing_files" in self.config:
            self.ignore_missing_files = self.config["fork_ignore_missing_files"]
        else:
            self.ignore_missing_files = False

        if "sync_plugin_directory" in self.config:
            self.sync_plugin_directory = self.resolve_symbols(self.config["sync_plugin_directory"])
        else:
            self.sync_plugin_directory = "./plugins"
            if self._log_warnings:
                logging.warning(
                    "No sync_plugin_directory configured. Default value is ./plugins, which will not work with kiosk!")

        self.autoload_plugins = None
        if "autoload_plugins" in self.config:
            self.autoload_plugins = self.config["autoload_plugins"]
        if f"autoload_plugins_{self.get_project_id()}" in self.config:
            if self.autoload_plugins:
                self.autoload_plugins.extend(self.config[f"autoload_plugins_{self.get_project_id()}"])
            else:
                self.autoload_plugins = self.config[f"autoload_plugins_{self.get_project_id()}"]
        if not self.autoload_plugins:
            self.autoload_plugins = None
            if self._log_warnings:
                logging.warning(
                    "No autoload plugins configured. "
                    "No plugins will be loaded on instantiation of a Synchronization object")

        if "cache_dir" in self.config:
            self.cache_dir = self.config["cache_dir"]
        else:
            self.cache_dir = None
            logging.debug("No cache_dir configured. The cache dir will be cache in the file repository")

        if "custom_sync_modules" in self.config:
            self.custom_sync_modules = self.resolve_symbols(self.config["custom_sync_modules"])
        else:
            self.custom_sync_modules = self.resolve_symbols('%sync%\\custom')
            if self._log_warnings:
                logging.warning(f"No custom sync module path defined. Defaulting to {self.custom_sync_modules}")

        if "use_double_commit" in self.config:
            self.use_double_commit = bool(self.config["use_double_commit"])
        else:
            self.use_double_commit = False

        if "file_identifier_cache_sql" in self.config:
            self.file_identifier_cache_sql = self.resolve_symbols(self.config["file_identifier_cache_sql"])
        else:
            # if self._log_warnings:
            #     logging.warning("No sql script to build the file-identifier cache given!")
            self.file_identifier_cache_sql = ""



        return not fatal_error

    def get_configfile(self):
        return self.configfile

    def get_dsdfile(self):
        return self.dsdfile

    def get_master_view(self):
        return self.master_view

    def get_logfile(self):
        return self.logfile

    def truncate_log(self):
        try:
            for handler in logging.getLogger().handlers:
                if hasattr(handler, "baseFilename"):
                    with open(handler.baseFilename, 'w'):
                        pass
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.truncate_log: Exception {repr(e)}")

    def do_log_to_screen(self):
        return self.log_to_screen

    def is_test_config(self):
        return self.test_mode

    def get_file_repository(self, create_if_non_existant=False):
        if self._file_repository:
            if os.path.isdir(self._file_repository):
                return self._file_repository
            if create_if_non_existant:
                try:
                    os.mkdir(self._file_repository)
                except Exception as e:
                    logging.error(
                        "get_file_repository: Exception creating file repository under " + self._file_repository + ": " + repr(
                            e))
            else:
                logging.warning(
                    f"SyncConfig.get_file_repository: path to missing "
                    f"file repository ({self._file_repository}) requested but without option to create it.")
            if os.path.isdir(self._file_repository):
                return self._file_repository
        else:
            logging.error("SyncConfig.get_file_repository: file repository requested but not set.")

        return ""

    def get_thumbnail_sets(self):
        """
        todo: redesign with new file management!
        :return:
        """
        raise DeprecationWarning("get_thumbnail_sets is obsolete.")
        thumbnail_sets = {}
        if self.config:
            if 'thumbnail_sets' in self.config:
                for tn_set in self.config['thumbnail_sets']:
                    v = self.config['thumbnail_sets'][tn_set]
                    if v:
                        if len(v.split(",")) == 2:
                            thumbnail_sets[tn_set] = (v.split(",")[0], v.split(",")[1])

        return (thumbnail_sets)

    def get_ordered_thumbnail_sets(self):
        """
        todo: redesign with new file management!
        :return:
        """
        raise DeprecationWarning("get_ordered_thumbnail_sets is obsolete.")
        sets = self.get_thumbnail_sets()
        ordered_sets = []
        ordered_sets = [(s, sets[s]) for s in sets]
        print(ordered_sets)
        ordered_sets.sort(key=lambda x: int(x[1][0]) * int(x[1][1]))
        return (ordered_sets)

    @staticmethod
    def str_to_log_level(log_level_str: str):
        if log_level_str == "INFO":
            return logging.INFO
        if log_level_str == "DEBUG":
            return logging.DEBUG
        if log_level_str == "WARNING":
            return logging.WARNING
        if log_level_str == "ERROR":
            return logging.ERROR
        return logging.INFO

    def get_log_level(self):
        return self.str_to_log_level(self.log_level)

    def get_werkzeug_log_level(self):
        return self.str_to_log_level(self.werkzeug_log_level)

    def get_cache_dir(self, create_if_non_existent=False):
        if not self.cache_dir:
            self.cache_dir = os.path.join(self._file_repository, "cache")

        if os.path.isdir(self.cache_dir):
            return self.cache_dir

        if create_if_non_existent:
            try:
                os.mkdir(self.cache_dir)
            except Exception as e:
                logging.error(
                    f"get_cache_dir: Exception creating cache dir under {self.cache_dir}: "
                    f"{repr(e)}")
        else:
            logging.error(
                "SyncConfig.get_cache_dir: path to missing cache repository requested"
                f"but without option to create it. cache dir is configured to be {self.cache_dir}")

        if os.path.isdir(self.cache_dir):
            return self.cache_dir

        return ""

    def set_temp_dir(self, temp_dir: str):
        """
        to set a different temp dir than given in the config.
        Only for testing purposes. Be aware that this will not recalculate any configuration values
        that use %temp_dir%.

        :param temp_dir: the path to the new temp dir
        :return: the temporary directory or a blank string if an error occurred.
        """
        self.temp_dir = temp_dir
        self._config['temp_dir'] = temp_dir

    def get_temp_dir(self, create_if_non_existent=True):
        """
        returns the fully qualified path of the temp directory.
        :param create_if_non_existent: creates the temp directory if set to True (which is default in this case)
        :return: the temporary directory or a blank string if an error occurred.
        """
        if os.path.isdir(self.temp_dir):
            return self.temp_dir

        if create_if_non_existent:
            try:
                os.mkdir(self.temp_dir)
            except Exception as e:
                logging.error(
                    f"SyncConfig.get_temp_dir: Exception creating temp directory {self.temp_dir}: "
                    f"{repr(e)}")
        else:
            logging.error(
                "SyncConfig.get_temp_dir: path to missing temp directory requested"
                f"but without option to create it. temporary directory is configured to be {self.temp_dir}")

        if os.path.isdir(self.temp_dir):
            return self.temp_dir

        return ""

    def get_project_id(self):
        return self.config["project_id"] if "project_id" in self.config else ""

    @property
    def sleep_for_filemaker(self):
        return self.config["sleep_for_filemaker"] if "sleep_for_filemaker" in self.config else 0

    @property
    def default_kiosk_queries(self):
        return self.resolve_symbols(
            self.config["default_kiosk_queries"]) if "default_kiosk_queries" in self.config else os.path.join(
            self.base_path, 'config', 'kiosk_queries')

    def get_recording_context_alias(self, recording_context: str):
        """
        returns the alias for a recording context as it is configured under
        file_repository:
            recording_context_aliases:

        :param recording_context:
        :return: the alias if given or the recording_context
        """
        # noinspection PyBroadException
        try:
            recording_context = self.file_repository["recording_context_aliases"][recording_context]
        except BaseException as e:
            pass
        return recording_context

    def is_in_debug_mode(self) -> bool:
        """
        returns true if the log level is configured to be DEBUG
        :return: boolean
        """
        return self.get_log_level() == logging.DEBUG

    def get_transfer_dir(self, check_unpack_kiosk=True):
        transfer_dir = kioskstdlib.try_get_dict_entry(self.config, "transfer_dir", "")
        if transfer_dir:
            if os.path.isdir(transfer_dir):
                if check_unpack_kiosk:
                    if os.path.isdir(os.path.join(transfer_dir, "unpackkiosk")):
                        if os.path.isfile(os.path.join(transfer_dir, "unpackkiosk", "unpackkiosk.py")):
                            error_msg = ""
                        else:
                            error_msg = f"unpackkiosk.py is not installed in {os.path.join(transfer_dir, 'unpackkiosk')}"
                    else:
                        error_msg = f"No unpackkiosk directory installed in {transfer_dir}"
                else:
                    error_msg = ""
            else:
                error_msg = f"Transfer directory {transfer_dir} does not exist."
        else:
            error_msg = f"transfer_dir not configured."
        return error_msg, transfer_dir

    def get_create_transfer_dir(self) -> str:
        """
        creates the transfer dir if it does not exist. If it is not configured, a default will be used
        (the parent dir of Kiosk + transfer_dir)
        This does not check if unpackkiosk is available in the transfer_dir
        :param cfg: SyncConfig
        :return: the transfer_dir or an empty string in case of an error
        """
        error_msg, transfer_dir = self.get_transfer_dir(check_unpack_kiosk=False)
        if not error_msg:
            return transfer_dir
        if not transfer_dir:
            transfer_dir = os.path.join(kioskstdlib.get_parent_dir(self.base_path), "transfer")
            logging.warning(f"SyncConfig.get_create_transfer_dir: transfer dir not configured: "
                            f"defaulting to {transfer_dir}")

        if transfer_dir:
            try:
                if not os.path.isdir(transfer_dir):
                    os.mkdir(transfer_dir)
                return transfer_dir
            except BaseException as e:
                logging.error(f"SyncConfig.get_create_transfer_dir: "
                              f"Error validating or creating transfer dir {transfer_dir}: {repr(e)}")
                return ""

    def get_dsd_path(self):
        return kioskstdlib.get_file_path(self.dsdfile)

    def get_fts_config(self) -> dict:
        try:
            return self._config["kiosk"]["queryandviewplugin"]["fts"]
        except BaseException as e:
            logging.info(f"{self.__class__.__name__}.get_fts_config: "
                         f"full text search not configured in queryandviewplugin.")
            return {}
