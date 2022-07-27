import logging
from pprint import pformat
from typing import List, Union

from werkzeug import datastructures

import kioskglobals

from flask_login import current_user

import kioskstdlib
from kioskconfig import KioskConfig
from kioskfilemanagerbridge import KioskFileManagerBridge
from kioskuser import KioskUser
from filehandlingsets import FileHandlingSet
from sync_plugins.reportingdock import ReportingDock
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from kioskworkstation import KioskDock, TYPE_KIOSK_WORKSTATION
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb
from authorization import EDIT_WORKSTATION_PRIVILEGE, PREPARE_WORKSTATIONS, DOWNLOAD_WORKSTATION, \
    UPLOAD_WORKSTATION, SYNCHRONIZE, get_local_authorization_strings, MANAGE_USERS, OPERATE_REPORTING, MANAGE_REPORTING


class KioskReportingDock(KioskDock):

    PRIVILEGES = {
        OPERATE_REPORTING: "operate reporting",
        MANAGE_REPORTING: "manage reporting"
    }

    def __init__(self, dock_id: str, sync: Synchronization = None):
        super().__init__(workstation_id=dock_id, sync=sync)
        self._sync_dock: Union[ReportingDock, None] = None
        self._authorized_to: List[str] = []
        self._ws_options: dict = {}

    def _reset_attributes(self):
        self._sync_dock = None
        self._authorized_to = []
        self._ws_options = {}

    @property
    def recording_group(self) -> str:
        return "reporting"

    def load_workstation(self) -> bool:
        self._reset_attributes()

        # noinspection PyTypeChecker
        self._sync_dock: ReportingDock = self.sync.get_workstation("ReportingDock", self._id)
        if self._sync_dock:
            self._calc_status_text(self.status)

            try:
                self._authorized_to = []
                if current_user:
                    self._authorized_to = get_local_authorization_strings(self.PRIVILEGES, param_user=current_user)
            except BaseException as e:
                pass

            return self._sync_dock.exists()
        else:
            return False

    def _calc_status_text(self, status):

        self._state_description = ""
        self._state_text = ""

        if status == "IDLE":
            self._state_text = "ready"
        elif status == "REPORTED":
            self._state_text = "report can be downloaded"

    @property
    def description(self):
        if self._sync_dock:
            return self._sync_dock.description
        else:
            return ""

    @property
    def status(self):
        if self._sync_dock:
            return self._sync_dock.state_machine.get_state().upper()
        else:
            return ""

    @property
    def state_text(self):
        return self._state_text

    @property
    def state_description(self):
        return self._state_description

    @property
    def icon_url(self):
        return ""

    @property
    def icon_code(self):
        # return ""
        return "\uf56c"

    @property
    def exists(self):
        if self._sync_dock:
            return self._sync_dock.exists()

        return False

    @property
    def sync_dock(self):
        return self._sync_dock

    def create_workstation(self, dock_name, creation_params: dict) -> bool:
        """
        creates a FileMakerWorkstation by creating the corresponding FileMakerWorkstation class of the sync subsystem
        :param dock_name:  the workstation's description
        :param creation_params: a dictionary with settings for the ReportingDock
                       (parameters will be forwarded to ReportingDock constructor)
        :return: True if the workstation was successfully created and loaded.
                 Raises Exceptions on failure
        """
        if not self.sync:
            self.sync = Synchronization()

        ws = self.sync.create_workstation("ReportingDock", self._id, dock_name,
                                          query_definition_filename=creation_params["query_definition_filename"],
                                          mapping_definition_filename=creation_params["mapping_definition_filename"],
                                          template_file=creation_params["template_file"],
                                          output_file_prefix=creation_params["output_file_prefix"],
                                          )
        if ws:
            if ws.save():
                return self.load_workstation()
            else:
                raise Exception("error saving dock " + self._id)
        else:
            raise Exception("error creating dock " + self._id)

    @classmethod
    def register_types(cls, type_repository):
        type_repository.register_type(TYPE_KIOSK_WORKSTATION, cls.__name__, cls)
        return True

    @classmethod
    def get_readable_name(cls):
        return "Reporting"

    @classmethod
    def get_supported_workstation_types(cls):
        return {cls.__name__: ["ReportingDock"]}

    def register_option(self, option_id, option):
        if "disabled" not in option:
            option["disabled"] = False
        if "warning" not in option:
            option["warning"] = False
        if "low" not in option:
            option["low"] = False
        if "css_id" not in option:
            option["css_id"] = option_id.replace("_", "-")
        self._ws_options[option_id] = option

    def register_options(self):
        if not self._ws_options:
            self.register_option("run", {"id": "workstation.run",
                                         "caption": "run report",
                                         "description": "run the report",
                                         "privilege": "operate reporting",
                                         "onclick": f"krd_run('{self.id}',"
                                                    f"'run report',"
                                                    f"'run')",
                                         "js_key": "run"
                                         })

            fm: KioskFileManagerBridge = KioskFileManagerBridge.instantiate()
            if fm:
                url_for_alias = fm.url_for_directory("reporting")
                self.register_option("download", {"id": "workstation.download",
                                                  "caption": "download via file manager",
                                                  "description": f"click to jump to the file manager "
                                                                 f"where you can download the report",
                                                  "onclick": f"kioskActivateFileManager('{url_for_alias}$"
                                                             f"${self._sync_dock.get_id()}')",
                                                  "low": False,
                                                  "warning": False,
                                                  "privilege": OPERATE_REPORTING,
                                                  "js_key": "download"
                                                  }
                                     )

            self.register_option("delete_option", {"id": "workstation.delete",
                                                   "caption": "remove reporting dock",
                                                   "description": "Removes a reporting dock for good.",
                                                   "privilege": "manage reporting",
                                                   "low": True,
                                                   "warning": True,
                                                   "onclick": f"krd_action('{self.id}',"
                                                              f"'remove reporting dock',"
                                                              f"'delete')",
                                                   "js_key": "delete"
                                                   })

            self.register_option("edit_option", {"id": "workstation.edit",
                                                 "caption": "report settings",
                                                 "description": "edit the report's rules and settings",
                                                 "privilege": "manage reporting",
                                                 "onclick": "krd_edit('" + self.id +
                                                            "', 'kioskreportingdock.edit')",
                                                 "js_key": "edit"
                                                 })

    def _get_option(self, option_id):
        if option_id in self._ws_options:
            privilege = self._ws_options[option_id]["privilege"]
            if privilege:
                if privilege not in self._authorized_to:
                    return {}

            return self._ws_options[option_id]
        else:
            logging.error(f"{self.__class__.__name__}._get_option: "
                          f"Attempt to get the unknown dock option {option_id}.")
            return {}

    def _modify_option(self, option_id, key, value):
        if option_id in self._ws_options:
            self._ws_options[option_id][key] = value
        else:
            logging.error(f"{self.__class__.__name__}._modify_option: "
                          f"Attempt to modify the unknown dock option {option_id}.")

    def get_options(self, current_plugin_controller=None):
        def add_to_option_list(option, low=False, disabled=False):
            if option:
                option["low"] = low
                option_list.append(option)

        self.register_options()

        option_list = []
        self._authorized_to = get_local_authorization_strings(self.PRIVILEGES, param_user=current_user)

        add_to_option_list(self._get_option("run"))
        if self._sync_dock.get_state() == self._sync_dock.REPORTED:
            add_to_option_list(self._get_option("download"), low=False)

        add_to_option_list(self._get_option("edit_option"), low=True)
        add_to_option_list(self._get_option("delete_option"), low=True)

        return option_list

    def get_priority_options(self, current_plugin_controller=None):
        return [x for x in self.get_options(current_plugin_controller=current_plugin_controller) if not x["low"]]

    def get_low_options(self, current_plugin_controller=None):
        return [x for x in self.get_options(current_plugin_controller=current_plugin_controller) if x["low"]]

    # def has_no_next_option_msg(self, current_plugin_controller=None):
    #     if not self.get_priority_options(current_plugin_controller=current_plugin_controller):
    #         if self.status == "BACK_FROM_FIELD" and "synchronize" in self._authorized_to:
    #             return "This workstation is ready for synchronization. " \
    #                    "As soon as all partaking workstations are in this state, you can start " \
    #                    "Synchronization from the burger menu or the toolbar."
    #         else:
    #             return "This workstation is waiting for the admin. " \
    #                    "Right now, there is not really anything to do for you here."
    def after_synchronization(self) -> bool:
        pass

    def is_option_available(self, requested_option: str, current_plugin_controller=None):
        option_list = self.get_options(current_plugin_controller=current_plugin_controller)
        for option in option_list:
            if option["js_key"].lower() == requested_option.lower():
                if not ("disabled" in option and option["disabled"]):
                    return True

        return False
