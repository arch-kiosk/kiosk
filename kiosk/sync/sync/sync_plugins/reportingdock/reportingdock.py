import logging
import os
from pprint import pformat

from dsd.dsd3 import DataSetDefinition
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from filerepository import FileRepository
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig
from sync_plugins.reportingdock.reportingengine import ReportingEngine
from statemachine import StateTransition
from synchronization import Synchronization
from workstation import Dock


class ReportingDock(Dock):
    IDLE = "IDLE"
    REPORTED = "REPORTED"

    def __init__(self, workstation_id, description="", sync=None, *args, **kwargs):
        self.query_definition_filename: str = ""
        self.mapping_definition_filename: str = ""
        self.template_file: str = ""
        self.report_file_type: str = ""
        self.output_file_prefix: str = ""
        self.variables: dict = {}
        self.zip_output_files: bool = False
        self.base_query = ""

        super().__init__(workstation_id, description, sync, *args, **kwargs)
        self.recording_group = "reporting"

    def on_synchronized(self):
        pass

    def partakes_in_synchronization(self):
        return False

    @classmethod
    def get_workstation_type(cls) -> str:
        return "ReportingDock"

    @classmethod
    def register_states(cls):
        super().register_states()
        cls.STATE_NAME.update(
            {
                0: cls.IDLE,
                1: cls.REPORTED,
            })

    def init_state_machine(self):
        super().init_state_machine()
        self.state_machine.add_transition(self.IDLE, StateTransition("RUN", self.REPORTED, None, self.run))
        self.state_machine.add_transition(self.REPORTED,
                                          StateTransition("RUN", self.REPORTED, None, self.run,
                                                          failed_state=self.IDLE))

    def get_and_init_files_dir(self, direction="import", init=True):
        pass

    def _on_create_workstation(self, cur):
        """
        creates repl_dock_reporting, which is specific to the reporting dock.
        :param cur: an open cursor embedded in a transaction. This here will not commit!
        :exception: can throw all kinds of exceptions. Has no return value.
        """
        super()._on_create_workstation(cur)

        sql = f"INSERT INTO " + f"{KioskSQLDb.sql_safe_ident('repl_dock_reporting')}" \
                                f"({KioskSQLDb.sql_safe_ident('id')}," \
                                f" {KioskSQLDb.sql_safe_ident('query_definition_filename')}," \
                                f" {KioskSQLDb.sql_safe_ident('mapping_definition_filename')}," \
                                f" {KioskSQLDb.sql_safe_ident('template_file')}," \
                                f" {KioskSQLDb.sql_safe_ident('report_file_type')}," \
                                f" {KioskSQLDb.sql_safe_ident('output_file_prefix')}," \
                                f" {KioskSQLDb.sql_safe_ident('variables')}" \
                                f")" \
                                f" VALUES(%s,%s,%s,%s,%s,%s,%s)"

        cur.execute(sql, [self._id,
                          self.query_definition_filename,
                          self.mapping_definition_filename,
                          self.template_file,
                          self.report_file_type,
                          self.output_file_prefix,
                          self.variables])

    def _on_load(self):
        r = KioskSQLDb.get_first_record("repl_dock_reporting", "id", self._id, )
        if r:
            self.query_definition_filename = r["query_definition_filename"]
            self.mapping_definition_filename = r["mapping_definition_filename"]
            self.template_file = r["template_file"]
            self.report_file_type = r["report_file_type"]
            self.output_file_prefix = r["output_file_prefix"]
            self.variables = r["variables"]

    def _on_update_workstation(self, cur):
        close_cur = False
        try:
            if not cur:
                cur = KioskSQLDb.get_dict_cursor()
                close_cur = True

            cur.execute("update " +
                        f"{KioskSQLDb.sql_safe_ident('repl_dock_reporting')} set"
                        f" {KioskSQLDb.sql_safe_ident('query_definition_filename')}=%s,"
                        f" {KioskSQLDb.sql_safe_ident('mapping_definition_filename')}=%s,"
                        f" {KioskSQLDb.sql_safe_ident('template_file')}=%s,"
                        f" {KioskSQLDb.sql_safe_ident('report_file_type')}=%s,"
                        f" {KioskSQLDb.sql_safe_ident('output_file_prefix')}=%s,"
                        f" {KioskSQLDb.sql_safe_ident('variables')}=%s"
                        f" where id=%s",
                        [self.query_definition_filename if self.query_definition_filename else "",
                         self.mapping_definition_filename if self.mapping_definition_filename else "",
                         self.template_file,
                         self.report_file_type,
                         self.output_file_prefix,
                         self.variables,
                         self._id])
            logging.debug(f"{self.__class__.__name__}._on_update_workstation successful: sql was {cur.query}")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._on_update_workstation : {repr(e)}")
            logging.error(f"{self.__class__.__name__}._on_update_workstation : sql was {cur.query}")
        finally:
            if close_cur:
                try:
                    cur.close()
                except BaseException as e:
                    pass

    def _on_delete_workstation(self, cur, migration):
        logging.debug("removing record in repl_dock_reporting for " + self._id)
        cur.execute("delete " + f"from {KioskSQLDb.sql_safe_ident('repl_dock_reporting')} where id=%s", [self._id])

    def _get_workstation_dsd(self) -> DataSetDefinition:
        """
        returns a view on the master dsd for this dock.
        ReportingDock uses very different tables then other workstations.
        :return: a DataSetDefinition
        """
        dsd = Dsd3Singleton.get_dsd3()
        dsd_workstation_view = DSDView(dsd)
        dsd_workstation_view.apply_view_instructions({"config":
                                                          {"format_ver": 3},
                                                      "tables": ["include_tables_with_flag('reporting')"]})
        return dsd_workstation_view.dsd

    def get_reporting_dock_capabilities(self) -> dict:
        result = {
            "can_view": False,
            "can_download": False,
            "can_zip": False,
        }
        try:
            file_repos = FileRepository(SyncConfig.get_config())
            reporting_engine = ReportingEngine(self.get_id(), file_repos=file_repos)
            reporting_engine.template_file = self.template_file
            reporting_engine.load_mapping_definition(os.path.join(ReportingEngine.get_reporting_path(),
                                                                  self.mapping_definition_filename))
            reporting_driver = reporting_engine.get_output_driver()
            result["can_view"] = reporting_driver.can_view
            result["can_download"] = reporting_driver.can_download
            result["can_zip"] = reporting_driver.can_zip

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_reporting_dock_capabilities: {repr(e)}")

        return result

    def run(self) -> bool:
        # just to make sure!
        if not self.state_machine.get_state() in [self.IDLE, self.REPORTED]:
            logging.error(f"{self.__class__.__name__}.run called although dock has "
                          f" state{self.state_machine.get_state()}")
            return False

        if not self.base_query:
            logging.error(f"{self.__class__.__name__}.run missing base_query setting")
            return False

        dock_id = self.get_id()
        logging.info(f"{self.__class__.__name__}.run: Running report to reporting dock " + dock_id)

        # sync = Synchronization()
        file_repos = FileRepository(SyncConfig.get_config())
        reporting_path = ReportingEngine.get_reporting_path()
        reporting_engine = ReportingEngine(self.get_id(), file_repos=file_repos)
        reporting_engine.template_file = os.path.join(reporting_path, self.template_file)
        reporting_engine.filename_prefix = self.output_file_prefix
        reporting_engine.zip_output_files = self.zip_output_files
        logging.debug(f"{self.__class__.__name__}.run: loading query definition " + self.query_definition_filename)
        reporting_engine.load_query_definition(os.path.join(reporting_path,
                                                            self.query_definition_filename))
        reporting_engine.load_mapping_definition(os.path.join(reporting_path,
                                                              self.mapping_definition_filename))

        for var_name, value in self.variables.items():
            reporting_engine.set_variable(var_name, value)

        reporting_engine.create_reports(namespace=dock_id,
                                        selected_base_query=self.base_query,
                                        callback_progress=self.callback_progress)
        return True

    def get_report_file_for_view(self) -> str:
        try:
            file_repos = FileRepository(SyncConfig.get_config())
            reporting_engine = ReportingEngine(self.get_id(), file_repos=file_repos)
            reporting_engine.template_file = self.template_file
            reporting_engine.load_mapping_definition(os.path.join(ReportingEngine.get_reporting_path(),
                                                                  self.mapping_definition_filename))
            reporting_driver = reporting_engine.get_output_driver()
            return reporting_driver.get_target_filename()

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.get_report_file_for_view: {repr(e)}")

        return ""
