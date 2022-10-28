import logging
from typing import List

from werkzeug import datastructures

import kioskglobals

from flask_login import current_user

import kioskstdlib
from eventmanager import EventManager
from kioskconfig import KioskConfig
from kioskuser import KioskUser
from filehandlingsets import FileHandlingSet
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation
from kioskworkstation import KioskWorkstation, TYPE_KIOSK_WORKSTATION
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb
from authorization import EDIT_WORKSTATION_PRIVILEGE, PREPARE_WORKSTATIONS, DOWNLOAD_WORKSTATION, \
    UPLOAD_WORKSTATION, SYNCHRONIZE, get_local_authorization_strings, MANAGE_USERS, MANAGE_SERVER_PRIVILEGE

TYPE_KIOSK_FILEMAKER_WORKSTATION = "KioskFileMakerWorkstation"


class KioskFileMakerWorkstation(KioskWorkstation):
    PRIVILEGES = {
        EDIT_WORKSTATION_PRIVILEGE: "edit workstation",
        PREPARE_WORKSTATIONS: "prepare workstation",
        DOWNLOAD_WORKSTATION: "download workstation",
        UPLOAD_WORKSTATION: "upload workstation",
        SYNCHRONIZE: "synchronize",
        MANAGE_USERS: "manage file picking",
        MANAGE_SERVER_PRIVILEGE: "manage server",
    }

    download_upload_status_texts = {"-1": "no file transfer, yet", "1": "uploaded",
                                    "2": "downloaded"}

    # noinspection PyMissingConstructor
    def __init__(self, workstation_id: str, sync: Synchronization = None):
        super().__init__(workstation_id=workstation_id, sync=sync)
        self._sync_ws: None or FileMakerWorkstation = None
        self._download_upload_status_text: str = ""
        self._allow_upload: bool = False
        self._allow_download: bool = False
        self._upload_has_priority: bool = False
        self._download_has_priority: bool = False
        self._authorized_to: List[str] = []
        self._ws_options: dict = {}
        self._state_text: str = ""
        self._reset_attributes()
        self._state_description: str = ""

    def _reset_attributes(self):
        self._sync_ws = None
        self._download_upload_status_text = ""
        self._set_file_transfer_options()
        self._authorized_to = []
        self._ws_options = {}
        self._state_text: str = ""

    def _set_file_transfer_options(self, allow_download=False, download_has_priority=False,
                                   allow_upload=False, upload_has_priority=False):
        self._allow_upload = allow_upload
        self._allow_download = allow_download
        self._upload_has_priority = upload_has_priority
        self._download_has_priority = download_has_priority

    @property
    def recording_group(self) -> str:
        return self.sync_ws.get_recording_group()

    @property
    def disabled(self) -> bool:
        return self.sync_ws.disabled

    @disabled.setter
    def disabled(self, value: bool):
        self.sync_ws.disabled = value

    @classmethod
    def get_master_template_path_and_filename(cls, cfg: KioskConfig) -> str:
        return cfg.filemaker_template

    @classmethod
    def get_master_template_filename(cls, cfg: KioskConfig) -> str:
        return kioskstdlib.get_filename(cfg.filemaker_template)

    @classmethod
    def upload_template_file(cls, cfg: KioskConfig, file: datastructures.FileStorage) -> bool:
        """
        saves an uploaded filemaker template file to the template directory. This does not check if the filename

        matches the configured filemaker template name. You have to do that separately. This will save the given file
        under the name that is configured in the kiosk config, no matter what it original name was.

        :return: bool
        """
        try:
            if kioskstdlib.get_file_extension(file.filename) != "fmp12":
                raise Exception("Attempt to save a file with an extension other than .fmp12 as a filemaker template")

            template_filename = cls.get_master_template_path_and_filename(cfg)
            if template_filename:
                file.save(template_filename)
                logging.info(f"{cls.__name__}.upload_template_file: "
                             f"Stored uploaded template " + template_filename + " for file maker recording ")
                return True
            else:
                raise Exception(f"Destination filename could not be acquired")
        except BaseException as e:
            logging.error(f"{cls.__class__.__name__}.upload_template_file: {repr(e)}")

        return False

    @classmethod
    def before_restore(cls, parameters: list = None):
        try:
            cls.reset_all_recording_groups()
            logging.info(f"{cls.__name__}.before_restore: All recording groups reset prior to the restore.")
        except BaseException as e:
            logging.error(f"{cls.__name__}.before_restore: reset_all_recording_groups failed: {repr(e)}")
            raise e


    @classmethod
    def reset_all_recording_groups(cls):
        """
        deletes all the template files of all recording groups.
        throws exception in case of failure.
        """
        recording_groups = cls.get_recording_groups()
        for group in recording_groups:
            FileMakerWorkstation.reset_template(group)

    def load_workstation(self) -> bool:
        self._reset_attributes()
        # noinspection PyTypeChecker
        self._sync_ws: FileMakerWorkstation = self.sync.get_workstation("FileMakerWorkstation", self._id)
        if self._sync_ws:
            self._download_upload_status_text = self.download_upload_status_texts[
                str(self._sync_ws.download_upload_status)]
            self._calc_status_text(self.status, self._sync_ws.download_upload_status)

            try:
                self._authorized_to = []
                if current_user:
                    self._authorized_to = get_local_authorization_strings(self.PRIVILEGES, param_user=current_user)
            except BaseException as e:
                pass

            return self._sync_ws.exists()
        else:
            return False

    def _calc_status_text(self, status, download_upload_status):

        if status == "IDLE":
            self._state_text = "synchronized - needs preparation"
        elif status == "READY_FOR_EXPORT":
            self._state_text = "forked - needs export"
        elif status == "IN_THE_FIELD":
            if download_upload_status == FileMakerWorkstation.NOT_SET or self._sync_ws.has_option('PERMANENT_DOWNLOAD'):
                self._state_text = "prepared for download"
                self._set_file_transfer_options(True, True, False, False)
            elif download_upload_status == FileMakerWorkstation.DOWNLOAD:
                self._state_text = "in the field"
                self._set_file_transfer_options(True, False, True, True)
            else:
                self._state_text = "uploaded - needs import"
                self._set_file_transfer_options(False, False, True, False)
        elif status == "BACK_FROM_FIELD":
            if download_upload_status != FileMakerWorkstation.UPLOAD:
                logging.warning(f"{self.__class__.__name__}._calc_status_text: Workstation {self._id} has is in status "
                                f"BACK_FROM_FIELD but download status is either not set or DOWNLOAD. Perhaps the "
                                f"workstation file has been imported without a upload.")
            self._set_file_transfer_options(False, False, False, False)
            self._state_text = "waiting for synchronization"

        if status in ["IN_THE_FIELD", "BACK_FROM_FIELD"] \
                and self._download_upload_status_text \
                and not self._sync_ws.has_option('PERMANENT_DOWNLOAD'):
            if self._sync_ws.download_upload_status > -1 and \
                    self._sync_ws.download_upload_ts and \
                    self._sync_ws.get_fork_time() < self._sync_ws.download_upload_ts:
                self._state_description = self._download_upload_status_text + " on " + \
                                          self._sync_ws.download_upload_ts.isoformat(" ")[:19]
            else:
                self._state_description = self._download_upload_status_text
        else:
            self._state_description = ""

    @property
    def description(self):
        if self._sync_ws:
            return self._sync_ws.description
        else:
            return ""

    @property
    def download_upload_status(self):
        return self._sync_ws.download_upload_status

    @download_upload_status.setter
    def download_upload_status(self, status):
        self._sync_ws.set_download_upload_status(status, True)

    def reset_download_upload_status(self):
        self._sync_ws.set_download_upload_status(FileMakerWorkstation.NOT_SET, True)

    @property
    def status(self):
        if self._sync_ws:
            return self._sync_ws.state_machine.get_state().upper()
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
        return "\uf3fa"

    @property
    def exists(self):
        if self._sync_ws:
            return self._sync_ws.exists()

        return False

    @property
    def allow_download(self):
        return self._allow_download

    @property
    def allow_upload(self):
        return self._allow_upload

    @property
    def download_has_priority(self):
        return self._download_has_priority

    @property
    def upload_has_priority(self):
        return self._upload_has_priority

    @property
    def sync_ws(self):
        return self._sync_ws

    def create_workstation(self, ws_name, recording_group, gmt_time_zone: str = "",
                           options: str = "", grant_access_to: str = "") -> bool:
        """
        creates a FileMakerWorkstation by creating the corresponding FileMakerWorkstation class of the sync subsystem
        :param ws_name:  the workstation's description
        :param recording_group:  the workstation's recording group
        :param gmt_time_zone: the workstation's time zone or empty
        :param options: special options for the workstation. A ;-separated string
        :param grant_access_to: empty string or a user-id the workstation will be restricted to
        :return: True if the workstation was successfully created and loaded.
                 Raises Exceptions on failure
        """
        if not self.sync:
            self.sync = Synchronization()

        ws = self.sync.create_workstation("FileMakerWorkstation", self._id, ws_name, recording_group=recording_group)
        ws.gmt_time_zone = gmt_time_zone
        ws.options = options
        ws.grant_access_to = grant_access_to
        if ws:
            if ws.save():
                return self.load_workstation()
            else:
                raise Exception("error saving workstation " + self._id)
        else:
            raise Exception("error creating workstation " + self._id)

    @classmethod
    def register_types(cls, type_repository):
        type_repository.register_type(TYPE_KIOSK_WORKSTATION, cls.__name__, cls)
        return True

    @classmethod
    def register_class_events(cls, events: EventManager):
        events.subscribe("administration", "before_restore", cls.before_restore)
        logging.debug(f"KioskFileMakerWorkstation class subscribed to administration.before_restore")

    @classmethod
    def get_readable_name(cls):
        return "filemaker recording"

    @classmethod
    def get_supported_workstation_types(cls):
        return {cls.__name__: ["FileMakerWorkstation"]}

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

    def access_granted(self, grant_by_wildcard: bool = True) -> bool:
        """
        returns whether or not the access to this dock is granted at all for the current user.
        :param grant_by_wildcard: FileMakerWorkstations are accessible by default if they have a wildcard
                                    set in grant_access_to. However, if grant_by_wildcard is set to false they won't.
        :returns: bool
        """

        return (grant_by_wildcard and self.sync_ws.grant_access_to == "*") or \
               current_user.user_id == self.sync_ws.grant_access_to or \
               "prepare workstation" in get_local_authorization_strings(self.get_privileges(), param_user=current_user)

    def register_options(self):
        if not self._ws_options:
            self.register_option("fork_option", {"id": "workstation.fork",
                                                 "caption": "fork",
                                                 "description": "fork recording data",
                                                 "privilege": "prepare workstation",
                                                 "onclick": "kfw_action('" + self.id + "', 'Fork', 'fork')",
                                                 "js_key": "fork"})
            self.register_option("export_option", {"id": "workstation.export_to_filemaker",
                                                   "caption": "prepare for download",
                                                   "description": "prepare recording data for download",
                                                   "privilege": "prepare workstation",
                                                   "onclick": f"kfw_action('{self.id}',"
                                                              f"'Export to FileMaker',"
                                                              f"'export')",
                                                   "js_key": "export"
                                                   })
            self.register_option("fork_export_option", {"id": "workstation.fork_export",
                                                        "caption": "prepare for field",
                                                        "description": "fork and prepare recording data in one step",
                                                        "privilege": "prepare workstation",
                                                        "onclick": f"kfw_action('{self.id}',"
                                                                   f"'Prepare for download',"
                                                                   f"'forknexport')",
                                                        "js_key": "forknexport"
                                                        })
            self.register_option("import_option", {"id": "workstation.import_from_filemaker",
                                                   "caption": "import recording data",
                                                   "description": f"import the uploaded database "
                                                                  f"and prepare synchronization",
                                                   "privilege": "prepare workstation",
                                                   "onclick": f"kfw_action('{self.id}',"
                                                              f"'Import from FileMaker',"
                                                              f"'import')",
                                                   "js_key": "import"
                                                   })
            self.register_option("import_repair_option", {"id": "workstation.fix_import_from_filemaker",
                                                          "caption": "import troublesome recording data",
                                                          "description": f"import the uploaded database "
                                                                         f"despite reported import errors",
                                                          "privilege": "manage server",
                                                          "low": True,
                                                          "warning": True,
                                                          "onclick": f"kfw_action('{self.id}',"
                                                                     f"'Fix Import from FileMaker',"
                                                                     f"'fix_import')",
                                                          "js_key": "fix_import"
                                                          })

            self.register_option("reset_option", {"id": "workstation.reset",
                                                  "caption": "reset workstation",
                                                  "description": "reset the workstation.",
                                                  "privilege": "prepare workstation",
                                                  "low": True,
                                                  "warning": True,
                                                  "onclick": f"kfw_action('{self.id}',"
                                                             f"'Reset workstation',"
                                                             f"'reset')",
                                                  "js_key": "reset"
                                                  })

            self.register_option("reset_rg_option", {"id": "recordinggroup.reset",
                                                     "caption": "reset recording group",
                                                     "description": "reset the recording group. Only for admins!",
                                                     "privilege": "edit workstation",
                                                     "low": True,
                                                     "warning": True,
                                                     "onclick": f"kfw_action('{self.id}',"
                                                                f"'Reset recording group',"
                                                                f"'reset_recording_group')",
                                                     "js_key": "reset_recording_group"
                                                     })

            self.register_option("delete_option", {"id": "workstation.delete",
                                                   "caption": "delete workstation",
                                                   "description": "Admin only! Removes a workstation for good.",
                                                   "privilege": "edit workstation",
                                                   "low": True,
                                                   "warning": True,
                                                   "onclick": f"kfw_action('{self.id}',"
                                                              f"'Delete workstation',"
                                                              f"'delete')",
                                                   "js_key": "delete"
                                                   })

            self.register_option("edit_option", {"id": "workstation.edit",
                                                 "caption": "edit workstation",
                                                 "description": "edit the workstation's rules and properties",
                                                 "privilege": "edit workstation",
                                                 "onclick": "kfw_edit('" + self.id +
                                                            "', 'kioskfilemakerworkstation.edit')",
                                                 "js_key": "edit"
                                                 })

            self.register_option("upload_option", {"id": "workstation.upload",
                                                   "caption": "upload new field data",
                                                   "description": "upload database from your device",
                                                   "privilege": "upload workstation",
                                                   "upload": True,
                                                   "onclick": "kfw_upload('" + self.id + "')",
                                                   "js_key": "upload"
                                                   })
            self.register_option("download_option", {"id": "workstation.download",
                                                     "caption": "download recording system",
                                                     "description": "download a database directly to your device",
                                                     "privilege": "download workstation",
                                                     "onclick": "kfw_download('" + self.id + "')",
                                                     "js_key": "download"
                                                     })
            self.register_option("disable_option", {"id": "workstation.disable",
                                                    "caption": "disable workstation",
                                                    "description": "The workstation will not partake in anything "
                                                                   "until it is activated again",
                                                    "privilege": "edit workstation",
                                                    "onclick": "kfw_disable('" + self.id +
                                                               "', 'disable', true)",
                                                    "js_key": "disable"
                                                    })
            self.register_option("enable_option", {"id": "workstation.enable",
                                                   "caption": "enable workstation",
                                                   "description": "This workstation is currently deactivated. "
                                                                  "This option activates it again.",
                                                   "privilege": "edit workstation",
                                                   "onclick": "kfw_disable('" + self.id +
                                                              "', 'disable', false)",
                                                   "js_key": "disable"
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
                          f"Attempt to get the unknown workstation option {option_id}.")
            return {}

    def _modify_option(self, option_id, key, value):
        if option_id in self._ws_options:
            self._ws_options[option_id][key] = value
        else:
            logging.error(f"{self.__class__.__name__}._modify_option: "
                          f"Attempt to modify the unknown workstation option {option_id}.")

    def get_options(self, current_plugin_controller=None):
        def add_to_option_list(option, low=False, disabled=False):
            if option:
                if current_plugin_controller:
                    if not current_plugin_controller.is_operation_allowed(option["id"]):
                        return

                option["low"] = low
                if disabled:
                    option["disabled"] = disabled
                option_list.append(option)

        self.register_options()
        option_list = []
        self._authorized_to = get_local_authorization_strings(self.PRIVILEGES, param_user=current_user)

        if self.disabled:
            add_to_option_list(self._get_option("enable_option"))
        else:

            if self.status == "IDLE":
                add_to_option_list(self._get_option("fork_export_option"))
                add_to_option_list(self._get_option("fork_option"), low=True)

            if self.status == "READY_FOR_EXPORT":
                self._modify_option("fork_option", "description",
                                    "prepare the database for export AGAIN. Make sure that's what you want.")
                add_to_option_list(self._get_option("export_option"))
                add_to_option_list(self._get_option("fork_option"), low=True)
                add_to_option_list(self._get_option("fork_export_option"), low=True)

            # We don't allow this anymore (0.13.7) because it is too dangerous:
            # if self.status == "BACK_FROM_FIELD":
            #     add_to_option_list(self._get_option("import_option"), low=True)

            if self.allow_download and self.download_has_priority:
                add_to_option_list(self._get_option("download_option"))
                if self.allow_upload:
                    self._modify_option("upload_option", "description",
                                        "repeat upload from your device. Make sure it is what you want.")
                    add_to_option_list(self._get_option("upload_option"), low=True)

            elif self.allow_upload and self.upload_has_priority:
                add_to_option_list(self._get_option("upload_option"))
                if self.allow_download:
                    self._modify_option("download_option", "description",
                                        "repeat download to your device. Make sure it is what you want.")
                    add_to_option_list(self._get_option("download_option"), low=True)
            elif self.allow_upload and not self.upload_has_priority:
                self._modify_option("upload_option", "description",
                                    "repeat upload from your device. Make sure it is what you want.")
                if self.status != "BACK_FROM_FIELD":
                    add_to_option_list(self._get_option("import_option"))
                    if self.sync_ws.get_xstate(self.sync_ws.XSTATE_IMPORT_ERROR):
                        add_to_option_list(self._get_option("import_repair_option"), low=True)

                add_to_option_list(self._get_option("upload_option"), low=True)

            if self.status == "IN_THE_FIELD" and self.allow_download:
                self._modify_option("export_option", "description",
                                    "prepare filemaker database for download AGAIN. Make sure it's what you want.")
                add_to_option_list(self._get_option("export_option"), low=True)

            add_to_option_list(self._get_option("reset_option"), low=True)
            if self.status == "IDLE":
                add_to_option_list(self._get_option("edit_option"), low=True)
            else:
                add_to_option_list(self._get_option("edit_option"), low=True, disabled=True)

            add_to_option_list(self._get_option("reset_rg_option"), low=True)

            add_to_option_list(self._get_option("disable_option"), low=True)

        add_to_option_list(self._get_option("delete_option"), low=True)

        return option_list

    def get_priority_options(self, current_plugin_controller=None):
        return [x for x in self.get_options(current_plugin_controller=current_plugin_controller) if not x["low"]]

    def get_low_options(self, current_plugin_controller=None):
        return [x for x in self.get_options(current_plugin_controller=current_plugin_controller) if x["low"]]

    def has_no_next_option_msg(self, current_plugin_controller=None):
        if not self.get_priority_options(current_plugin_controller=current_plugin_controller):
            if self.status == "BACK_FROM_FIELD" and "synchronize" in self._authorized_to:
                return "This workstation is ready for synchronization. " \
                       "As soon as all partaking workstations are in this state, you can start " \
                       "Synchronization from the burger menu or the toolbar."
            else:
                return "This workstation is waiting for the admin. " \
                       "Right now, there is not really anything to do for you here."

    def is_option_available(self, requested_option: str, current_plugin_controller=None):
        option_list = self.get_options(current_plugin_controller=current_plugin_controller)
        for option in option_list:
            if option["js_key"].lower() == requested_option.lower():
                if not ("disabled" in option and option["disabled"]):
                    return True

        return False
