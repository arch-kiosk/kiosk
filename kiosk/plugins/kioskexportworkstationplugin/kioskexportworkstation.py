import kioskdatetimelib
import kioskstdlib
from authorization import ENTER_ADMINISTRATION_PRIVILEGE, FILE_EXPORT_PRIVILEGE, get_local_authorization_strings
from kioskfilemanagerbridge import KioskFileManagerBridge
from sync_plugins.fileexportworkstation.fileexport import FileExport
from sync_plugins.fileexportworkstation.fileexportworkstation import FileExportWorkstation
from kioskworkstation import KioskWorkstation, TYPE_KIOSK_WORKSTATION
from synchronization import Synchronization
from flask_login import current_user

TYPE_KIOSK_EXPORT_WORKSTATION = "KioskExportWorkstation"


class FileExportWorkstationOption:

    def __init__(self, caption, description, disabled=False, css_id="", onclick="", warning=False, privilege=""):
        self.disabled = disabled
        self.css_id = css_id
        self.onclick = onclick
        self.caption = caption
        self.description = description
        self.warning = warning
        self.privilege = privilege


class KioskExportWorkstation(KioskWorkstation):
    PRIVILEGES = {
        FILE_EXPORT_PRIVILEGE: FILE_EXPORT_PRIVILEGE,
        ENTER_ADMINISTRATION_PRIVILEGE: ENTER_ADMINISTRATION_PRIVILEGE,
    }

    def __init__(self, workstation_id: str, sync: Synchronization = None):
        super().__init__(workstation_id=workstation_id, sync=sync)
        self._sync_ws: FileExportWorkstation = None
        self._state_text: str = ""
        self._state_description: str = ""
        self._options = []
        self._no_options_msg = ""
        self._calc_options()

    @property
    def sync_ws(self):
        return self._sync_ws

    @property
    def recording_group(self) -> str:
        return self._sync_ws.get_recording_group()

    @property
    def state_text(self):
        self._calc_state()
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
        return "\uf56f"

    @classmethod
    def is_available(cls, current_user):
        authorized_to = []
        try:
            authorized_to = get_local_authorization_strings(cls.PRIVILEGES, param_user=current_user)
        except BaseException as e:
            pass
        return FILE_EXPORT_PRIVILEGE in authorized_to

    @property
    def disabled(self) -> bool:
        return False

    @property
    def exists(self):
        if self._sync_ws:
            return self._sync_ws.exists()

        return False

    def _calc_state(self):
        if self.sync_ws:
            if self.sync_ws.get_state() == FileExportWorkstation.IDLE:
                self._state_text = "ready"
            if self.sync_ws.get_state() == FileExportWorkstation.READY_FOR_EXPORT:
                self._state_text = "forked, waiting for file export"
            if self._sync_ws.get_fork_time():
                self._state_description = "last export on " + \
                                          kioskstdlib.latin_date(kioskdatetimelib.utc_ts_to_timezone_ts(
                                              self._sync_ws.get_fork_time(),
                                              current_user.get_active_time_zone_name(iana=True)))

    def load_workstation(self):
        self._sync_ws = self.sync.get_workstation("FileExportWorkstation", self._id)
        self._calc_options()
        return self._sync_ws.exists()

    @classmethod
    def register_types(cls, type_repository):
        type_repository.register_type(TYPE_KIOSK_WORKSTATION, cls.__name__, cls)
        return True

    @classmethod
    def get_readable_name(cls):
        return "file export"

    @property
    def description(self):
        if self._sync_ws:
            return self._sync_ws.description
        else:
            return ""

    @classmethod
    def get_supported_workstation_types(cls) -> {}:
        return {cls.__name__: ["FileExportWorkstation"]}

    def _calc_options(self):
        import kioskglobals
        self._options.clear()
        self._options.append(FileExportWorkstationOption(
            caption="start export",
            description="start the file export",
            onclick=f"kioskFileExportStart('{self._id}','start')",
            css_id="start",
            disabled=False,
            privilege=FILE_EXPORT_PRIVILEGE
        ))
        if self.sync_ws and self._sync_ws.get_fork_time():
            fm: KioskFileManagerBridge = KioskFileManagerBridge.instantiate()
            if fm:
                file_export = FileExport(kioskglobals.get_config(), self.sync.events, self.sync.type_repository,
                                         self.sync)
                file_export.get_file_export_targets()

                # todo: This assumes that we use FileExportTargetZip only! As soon as the user can select different targets
                #       this needs to be changed
                targets = [target.target_id
                           for target in file_export.get_file_export_targets().values()
                           if target.target_id == 'FileExportTargetZip']

                if len(targets) == 1:
                    url_for_alias = fm.url_for_directory(targets[0])
                    url_for_back = "syncmanager.sync_manager_show"

                    self._options.append(FileExportWorkstationOption(
                        caption="download via file manager",
                        description="click to jump to the file manager where you can download the exported files",
                        onclick=f"kioskActivateFileManager('{url_for_alias}','{url_for_back}', 'Hub')",
                        css_id="go_file_manager",
                        disabled=False,
                        warning=False,
                        privilege=ENTER_ADMINISTRATION_PRIVILEGE
                    ))
        if len(self._options) > 0:
            self._options.append(FileExportWorkstationOption(
                caption="-",
                description="",
                onclick="",
            ))
        self._options.append(FileExportWorkstationOption(
            caption="settings",
            description="modify export format and file export options",
            onclick=f"kfe_edit('{self.id}', 'kioskexportworkstation.edit')",
            css_id="edit",
            disabled=False,
            privilege=FILE_EXPORT_PRIVILEGE

        ))
        self._options.append(FileExportWorkstationOption(
            caption="delete",
            description="delete this file export definition",
            onclick=f"kioskFileExportDelete('{self._id}','delete')",
            css_id="delete",
            disabled=False,
            warning=True,
            privilege=FILE_EXPORT_PRIVILEGE
        ))

    def create_workstation(self, ws_name, recording_group: str,
                           export_file_format: str, include_files: bool, filename_rendering: str) -> None:
        """
        creates a FileExportWorkstation by instantiating the corresponding FileExportWorkstation
        class of the sync subsystem
        :param ws_name:  the workstation's description
        :param recording_group:  the workstation's recording group
        :param export_file_format: the id of the file export driver
        :param include_files: bool
        :param filename_rendering: the id of the filename rendering method
        :return: Nothing. But raises an Exception on failure
        """
        if not self.sync:
            self.sync = Synchronization()

        ws = self.sync.create_workstation("FileExportWorkstation", self._id, ws_name,
                                          recording_group=recording_group,
                                          export_file_format=export_file_format,
                                          include_files=include_files,
                                          filename_rendering=filename_rendering)
        if ws:
            if ws.save():
                return
            else:
                raise Exception("error saving workstation " + self._id)
        else:
            raise Exception("error creating workstation " + self._id)

    def after_synchronization(self) -> bool:
        return True

    def has_no_options_msg(self, plugin_controller) -> str:
        return self._no_options_msg

    def get_options(self):
        authorized_to = []
        if current_user:
            # One cannot ask isInstance(current_user, KioskUser), hence the exception handling.
            try:
                authorized_to = get_local_authorization_strings(self.PRIVILEGES, param_user=current_user)
            except BaseException as e:
                pass

        effective_options = [option for option in self._options
                             if (not option.privilege) or option.privilege in authorized_to]

        if effective_options:
            if effective_options[0].caption == "-":
                effective_options.pop(0)
        if effective_options:
            if effective_options[len(effective_options) - 1].caption == "-":
                effective_options.pop(len(effective_options) - 1)

        if len(effective_options) == 0:
            self._no_options_msg = "Due to your privileges there are no options available to you at this point."
        else:
            self._no_options_msg = ""
        return effective_options

    def is_option_available(self, requested_option: str):
        option_list = self.get_options()
        for option in option_list:
            if option["js_key"].lower() == requested_option.lower():
                if not ("disabled" in option and option["disabled"]):
                    return True

        return False
