import copy
import logging
import os
from typing import Union, Iterator, Tuple, Callable
from zipfile import ZipFile

import kioskstdlib
import syncrepositorytypes
from configreader import ConfigReader
from filerepository import FileRepository
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig
from sync_constants import UserCancelledError
from synchronization import Synchronization
from typerepository import TypeRepository
from .reportinglib import *
from .reportingmapper import ReportingMapper
from .reportingoutputdriver import ReportingOutputDriver
from .reportingquery import ReportingQuery
from .reportingquerydefinition import ReportingQueryDefinition
from .reportingsqlquery import ReportingSqlQuery
from kioskquery.kioskqueryvariables import KioskQueryVariables


class ReportingEngine:
    _query_type_mapping = {"sql": ReportingSqlQuery}

    @classmethod
    def get_reporting_path(cls, resolve_symbols=True):
        config = SyncConfig.get_config()
        try:
            reporting_path = config.resolve_symbols(config["reportingdock"]["base_path"])
        except BaseException as e:
            logging.warning(f"ReportingEngine.get_reporting_path: Reporting path not configured ({repr(e)})")
            reporting_path = os.path.join(config.base_path, "reporting")
        if reporting_path:
            if not os.path.isdir(reporting_path):
                os.mkdir(reporting_path)
        if resolve_symbols:
            return reporting_path
        else:
            return config["reportingdock"]["base_path"]

    @classmethod
    def check_query_definition(cls, query_definition_file):
        """
        This only checks the query definition briefly.
        :param query_definition_file: path and filename of a query definition
        """
        query_def = ReportingQueryDefinition(ConfigReader.read_file(query_definition_file))
        KioskQueryVariables(query_def.variable_definitions)

    @classmethod
    def check_mapping_definition(cls, mapping_definition_file_path):
        """
        This only checks the mapping definition briefly.
        :param mapping_definition_file_path: path and filename of a mapping definition
        """
        mapping_definition = ConfigReader.read_file(mapping_definition_file_path)
        ReportingMapper.check_mapping_definition(mapping_definition)

    def __init__(self, namespace="", file_repos=None):
        self._query_definition: Union[ReportingQueryDefinition, None] = None
        self._variables: Union[KioskQueryVariables, None] = None
        self._mapping_definition: Union[dict, None] = None
        self._namespace = namespace
        self.template_file = ""
        self.template_type = ""
        self.filename_prefix = ""
        self._callback_progress = None
        self.zip_output_files = False
        self._output_driver: Union[ReportingOutputDriver, None] = None
        self._file_repos: Union[FileRepository, None] = file_repos
        self._has_key_value_store = False

    @property
    def variable_definitions(self):
        return self._variables

    def _interruptable_callback_progress(self, *args, **kwargs):
        if self._callback_progress and not self._callback_progress(*args, **kwargs):
            raise UserCancelledError

    def load_query_definition(self, query_definition_file_path: str):
        if query_definition_file_path == kioskstdlib.get_filename(query_definition_file_path):
            query_definition_file_path = os.path.join(self.get_reporting_path(), query_definition_file_path)
        self._query_definition = ReportingQueryDefinition(ConfigReader.read_file(query_definition_file_path))
        self._variables = KioskQueryVariables(self._query_definition.variable_definitions)
        try:
            self._variables.add_constants(self._query_definition.settings)
        except AttributeError:
            pass

    def get_base_query_info(self):
        """
        returns a list of tuples with (base query name, description)
        :return: list[(str, str)]
        """
        if self._query_definition:
            return [(n, q["description"]) for n, q in self._query_definition.base_queries.items()]

    def get_required_variables(self, base_query_name):
        """
        returns the names of the variables that are required to run a report on the base_query
        :returns: list [str]
        """
        return self._query_definition.get_required_variables(base_query_name)

    def allows_zip(self, base_query_name):
        """
        simply returns the setting of the query definition. Look there for further information.
        :returns: bool.
        """
        return self._query_definition.allows_zip(base_query_name)

    def get_variable_error(self, variable_name, variable_value) -> str:
        """
        returns an error text if the value does not meet the variable's requirements
        :returns: str
        """
        try:
            v = self._variables.transform_variable_value(variable_name, variable_value)
            return ""
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_variable_error: {repr(e)}")
            return repr(e)

    def get_template_strings(self, base_query_name):
        """
        returns the names of the variables that are required to run a report on the base_query
        :returns: list [str]
        """
        return self._query_definition.get_template_strings(base_query_name)

    def load_mapping_definition(self, mapping_definition_file_path: str, template_file: str = ""):
        """
        Loads the mapping definition and instantiates the output driver according to the
        setting in the mapping definition. If there is no such setting, the template file will be used
        to determine the output driver. If the template file is not given as parameter the instance's
        template_file property will be used.
        """
        self._mapping_definition = ConfigReader.read_file(mapping_definition_file_path)
        if template_file:
            self.template_file = template_file

        self._instantiate_output_driver()

    def set_variable(self, key: str, value: any):
        if not self._query_definition:
            raise ReportingException(f"{self.__class__.__name__}.set_variable: No query definition present.")
        self._variables.set_variable(key, value)

    def _prepare_zip_file(self, config: SyncConfig):
        compression_method = "DEFLATED"
        output_filename_template = "kiosk_report_#a_#d#m#y-#H#M.zip"

        try:
            target_config = config.reportingdock
            output_filename_template = kioskstdlib.try_get_dict_entry(target_config, "output_filename_zip",
                                                                      output_filename_template)
            compression_method = kioskstdlib.try_get_dict_entry(target_config, "compression_method", compression_method)
        except KeyError as e:
            logging.error(f"{self.__class__.__name__}._load_target: {repr(e)}")

        output_filename = os.path.join(self.get_output_directory(config),
                                       self.filename_prefix +
                                       kioskstdlib.get_datetime_template_filename(output_filename_template))

        logging.info(f"{self.__class__.__name__}._prepare_zip_file: "
                     f"Zipping reporting output to zip file {output_filename} with method {compression_method}")
        if os.path.isfile(output_filename):
            os.remove(output_filename)

        return ZipFile(output_filename, "x", compression=kioskstdlib.get_zip_compression_method(compression_method))

    def create_reports(self, namespace: str, selected_base_query: Union[str, None], callback_progress: Callable = None):
        """
        creates all the reports.
        :param namespace: the dock's id
        :param selected_base_query: the base query to use
        :param callback_progress: a callback method that receives progress information
        """
        result = False
        if namespace:
            self._namespace = namespace
        self._callback_progress = callback_progress
        self._variables.transform_all_variables()

        if not selected_base_query:
            if len(self._query_definition.base_queries) == 1:
                selected_base_query = self._query_definition.base_queries.keys()[1]
            else:
                raise ReportingException(f"{self.__class__.__name__}.create_reports: "
                                         f"No base query selected although there is more than one.")
        if selected_base_query not in self._query_definition.base_queries:
            raise ReportingException(f"{self.__class__.__name__}.create_reports: "
                                     f"selected base query {selected_base_query} is missing in the query definition.")
        config = SyncConfig.get_config()

        base_query = self._query_definition.base_queries[selected_base_query]
        base_query["output_type"] = "base_query"
        logging.debug(f"{self.__class__.__name__}.create_reports: about to instantiate ReportingSQLQuery")
        query = ReportingSqlQuery(base_query, self._variables,
                                  self._namespace, self.get_template_strings(selected_base_query))
        query.debug = kioskstdlib.to_bool(kioskstdlib.try_get_dict_entry(config.reportingdock, "debug_sql", "false"))
        if query.debug:
            logging.warning(f"{self.__class__.__name__}.create_reports: sql debugging is on. "
                            f"That should only be the case during development.")
        try:
            identifiers = query.execute_base_query()
        except ReportingException as e:
            logging.error(f"{self.__class__.__name__}.create_reports: "
                          f"Error when executing query {selected_base_query}:"
                          f"{repr(e)}")
            raise e

        if not identifiers:
            raise ReportingException(f"{self.__class__.__name__}.create_reports: "
                                     f"base query {selected_base_query} did not yield any context identifiers.")
        zip_instance = None
        try:
            if self.zip_output_files:
                zip_instance = self._prepare_zip_file(config)

            if not self.init_output():
                raise Exception("init_output was not successful.")

            for index, identifier in enumerate(identifiers):
                self._interruptable_callback_progress(index * 100 / len(identifiers),
                                                      f"running report for {identifier}")
                self.set_variable("context_identifier", identifier)
                logging.info(f"Creating report for {identifier}")
                self.prepare_data(namespace=self._namespace, config=config, base_query=selected_base_query)
                self.map(self._namespace)
                output_path_and_filename = self.output(context_identifier=identifier)
                if zip_instance:
                    zip_instance.write(filename=output_path_and_filename,
                                       arcname=kioskstdlib.get_filename(output_path_and_filename))
                    os.remove(output_path_and_filename)

            result = True

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.create_reports: {repr(e)}")

            raise e
        finally:
            try:
                if not self.close_output(success=result):
                    raise Exception(f"Error closing the output driver with success={result}")
            except BaseException as e2:
                logging.error(f"{self.__class__.__name__}.create_reports : {repr(e2)}")
            if zip_instance:
                zip_instance.close()

    def prepare_data(self, namespace: str, config, base_query=""):
        """
        Prepares the data for a single context identifier which must be present as the variable "#context_identifier"
        :param namespace: the (schema) name of the reporting dock.
        :param config: a config instance
        :param base_query: id of base query
        """
        if not self._query_definition:
            raise ReportingException(f"{self.__class__.__name__}.prepare_data: No query definition present.")

        self._has_key_value_store = False
        already_used_query_types = []
        for qid, query_dict in self._query_definition.queries.items():
            type_id = query_dict["type"].lower()
            if type_id not in self._query_type_mapping:
                raise ReportingException(f"{self.__class__.__name__}.prepare_data: query type {type_id} unknown.")

            query_instance: ReportingQuery = self._query_type_mapping[type_id](
                query_dict, self._variables,
                namespace=namespace,
                template_strings=self.get_template_strings(base_query))
            query_instance.debug = kioskstdlib.to_bool(
                kioskstdlib.try_get_dict_entry(config.reportingdock, "debug_sql", "false"))

            query_instance.execute(prepare_first_run=type_id not in already_used_query_types)
            if hasattr(query_instance, "used_key_value_store") and query_instance.used_key_value_store:
                self._has_key_value_store = True

            already_used_query_types.append(type_id)

    def _on_load_list_for_mapper(self, list_name: str,
                                 columns: list[str], order_by_columns: list[str] = None) -> Iterator[Tuple]:
        class RowIterator:
            def __init__(self, cur):
                self._cur = cur

            def generate(self):
                try:
                    r = self._cur.fetchone()
                    while r:
                        yield r
                        r = cur.fetchone()
                finally:
                    cur.close()

        cur = None
        try:
            if columns:
                sql_cols = ",".join([KioskSQLDb.sql_safe_ident(col) for col in columns])
            else:
                sql_cols = "*"

            if order_by_columns:
                sql_order_by = " order by " + ",".join([KioskSQLDb.sql_safe_ident(col) for col in order_by_columns])
            else:
                sql_order_by = ""
            cur = KioskSQLDb.execute_return_cursor(
                "select " +
                f"{sql_cols} from {KioskSQLDb.sql_safe_namespaced_table(self._namespace, 'reporting_' + list_name)}"
                f"{sql_order_by}")

            return RowIterator(cur).generate()

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._on_load_list_for_mapper: {repr(e)}")
            if cur:
                cur.close()
            KioskSQLDb.rollback()
            raise ReportingException(f"{repr(e)}")

    def _on_render_filename(self, uid: str, render_method: str) -> str:
        """
        renders a filename for a file's uid.
        :param uid: a valid uid for a filerepository file
        :returns an empty string in case of an error
        """
        if self._file_repos:
            try:
                ctx = self._file_repos.get_contextual_file(uid)
                if render_method == "descriptive":
                    result = ctx.get_descriptive_filename()
                elif render_method == "filename":
                    result = ctx.export_filename
                else:
                    logging.warning(f"{self.__class__.__name__}._on_render_filename: "
                                    f"filename rendering method {render_method} unknown.")
                    result = ""
                return result

            except Exception as e:
                logging.warning(f"{self.__class__.__name__}._on_render_filename: "
                                f"Exception {repr(e)} when accessing file {uid}")
                return ""
        else:
            logging.warning(f"{self.__class__.__name__}._on_render_filename: "
                            f"No FileRepository set when accessing file name for {uid}")
            return ""

    def _load_key_values(self, namespace) -> dict:
        """
        loads the keys and values from the dock's reporting_values table into a dictionary.
        :param namespace: the dock's namespace (schema)
        :return: dict
        """
        cur = None
        result = {}
        if not self._has_key_value_store:
            logging.debug(f"{self.__class__.__name__}._load_key_values: "
                          f"report has no table reporting_values and no key-value query")
            return result
        try:
            cur = KioskSQLDb.execute_return_cursor(
                "select " +
                f"key, value from "
                f"{KioskSQLDb.sql_safe_namespaced_table(namespace, 'reporting_values')}"
                f"where {KioskSQLDb.sql_safe_ident('context_identifier')}=%s",
                [self._variables.get_variable_raw("context_identifier")])

            r = cur.fetchone()
            while r:
                result[r["key"]] = r["value"]
                r = cur.fetchone()

            return result
        except BaseException as e:
            raise ReportingException(f"error when loading key values: {repr(e)}")
        finally:
            if cur:
                cur.close()
            KioskSQLDb.rollback()

    def _instantiate_output_driver(self):
        """
        Instantiates the output driver (e.g. ReportingOutputPDF or ReportingOutputExcel) from the information
        in the current mapping definition. afterwards self._output_driver is set.
        if the mapping definition has not output driver set the template file will be used to determine the
        output driver.
        """
        if self._output_driver:
            return

        cfg = SyncConfig.get_config()

        output_driver_name = None
        try:
            output_driver_name = self._mapping_definition["header"]["output_driver"]
        except KeyError:
            # not output driver? Use template file to find the right one
            logging.info(f"{self.__class__.__name__}._instantiate_output_driver: "
                         f"No output_driver setting in mapping definition")
            pass

        sync = Synchronization()
        sync.load_plugins(cfg.reportingdock["plugins"])
        type_repository: TypeRepository = sync.type_repository

        if not output_driver_name and self.template_file:
            output_driver_name = self.get_report_type_from_file_extension(type_repository, self.template_file)

        if not output_driver_name:
            logging.error(f"{self.__class__.__name__}._instantiate_output_driver: "
                          f"{self.template_file} does not imply any active reporting output driver. "
                          f"Perhaps the responsible output driver is not listed in the reportingdock config?")
            raise ReportingException(f"{self.__class__.__name__}._instantiate_output_driver: "
                                     f"No output driver identifiable from either mapping definition or template file")

        Driver = type_repository.get_type(syncrepositorytypes.TYPE_REPORTING_OUTPUT_DRIVER, output_driver_name)
        if not Driver:
            raise ReportingException(f"{self.__class__.__name__}._instantiate_output_driver: "
                                     f"'{output_driver_name}' is not a registered reporting output driver. "
                                     f"Perhaps it is not listed in the reportingdock config?")

        self._output_driver = Driver()
        self._output_driver.target_dir = self.get_output_directory(cfg)
        if self.template_file:
            self._output_driver.template_file = self.template_file

    def get_output_driver(self) -> ReportingOutputDriver:
        self._instantiate_output_driver()
        return self._output_driver

    def map(self, namespace):
        if not self._mapping_definition:
            raise ReportingException(f"{self.__class__.__name__}.map: No mapping definition present.")
        if not self._variables.has_variable(IDENTIFIER_VARIABLE_NAME):
            raise ReportingException(f"{self.__class__.__name__}.map: No context identifier variable present.")

        self._namespace = namespace
        key_values = self._load_key_values(namespace)
        key_values.update(self._variables.get_variables_dict())
        self._output_driver.map(self._mapping_definition, key_values,
                                self._on_load_list_for_mapper,
                                self._on_render_filename)
        return self._output_driver.mapping_results

    def get_output_directory(self, cfg):
        """
        ascertains the output directory.
        This does not create the whole output directory. Just the general part that is not
        driver-specific.

        :param cfg: A SyncConfig instance
        """
        export_directory = os.path.join('%base_path%', 'reporting')
        try:
            reporting_config = cfg.config["reportingdock"]
            export_directory = reporting_config["output_path"]
        except Exception:
            pass

        export_directory = cfg.resolve_symbols(export_directory)
        if not os.path.exists(export_directory):
            os.mkdir(export_directory)
        report_directory = os.path.join(export_directory, self._namespace)
        if not os.path.exists(report_directory):
            os.mkdir(report_directory)
        return report_directory

    def init_output(self) -> bool:
        """
        gives the output-driver the chance to initialize the whole report (this is not called per arch-context)
        """
        if not self._mapping_definition:
            raise ReportingException(f"{self.__class__.__name__}.output: No mapping definition present.")
        if not self.template_file:
            raise ReportingException(f"{self.__class__.__name__}.output: No template file given.")

        self._instantiate_output_driver()

        self._output_driver.mapping_definition = self._mapping_definition
        return self._output_driver.init()

    def close_output(self, success: bool) -> bool:
        """
        gives the output-driver the chance to finish the whole report (this is not called per arch-context)
        success: True if the report ran successfully up to this point
                 False if an error occured and the output driver will rather do some cleaning up.
        """
        if not self._output_driver:
            raise ReportingException(f"{self.__class__.__name__}.output: output driver not instantiated.")

        return self._output_driver.close(success)

    def output(self, context_identifier: str) -> str:
        """
        executes the output (the step that creates the actually output files of the report)
        :param context_identifier: the context identifier which is at the center of this report
        :returns the result of the ReportingOutputDriver - should be path and filename of the output file
        """
        if not self._output_driver:
            raise ReportingException(f"{self.__class__.__name__}.output: output driver not instantiated.")

        self._output_driver.template_file = self.template_file
        self._output_driver.target_file_name_without_extension = kioskstdlib.urap_secure_filename(
            self.filename_prefix + context_identifier)
        self._output_driver.mapping_definition = self._mapping_definition
        target_path_filename = self._output_driver.execute(self._on_load_list_for_mapper)
        return target_path_filename

    @classmethod
    def get_report_type_from_file_extension(cls, type_repository, template_file):
        ext = kioskstdlib.get_file_extension(template_file).lower()
        types = type_repository.list_types(syncrepositorytypes.TYPE_REPORTING_OUTPUT_DRIVER)
        for t in types:
            t_class = type_repository.get_type(syncrepositorytypes.TYPE_REPORTING_OUTPUT_DRIVER, t)
            if ext in t_class.get_supported_file_extensions():
                return t
