from flask_login import current_user

import kioskglobals
import kioskstdlib
from authorization import get_local_authorization_strings
from filehandlingsets import FileHandlingSet
from kioskrepositorytypes import TYPE_KIOSK_WORKSTATION
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb


class KioskWorkstation:
    TYPE_KIOSK_WORKSTATION: TYPE_KIOSK_WORKSTATION
    # needs to be populated by sub-classes
    PRIVILEGES = {
    }

    @classmethod
    def register_types(cls, type_repository):
        raise NotImplementedError()

    @classmethod
    def register_class_events(cls, event_manager):
        pass

    @classmethod
    def get_kiosk_workstation_type(cls):
        return cls.__name__

    @classmethod
    def get_readable_name(cls):
        return cls.__name__

    def is_option_available(self, option: str):
        return False

    @classmethod
    def get_recording_groups(cls):
        recording_groups = [r["recording_group"]
                            for r in KioskSQLDb.get_records("select distinct recording_group from repl_workstation")]
        recording_groups.extend(FileHandlingSet.list_file_handling_sets(kioskglobals.get_config()))
        recording_groups.sort()
        return set(recording_groups)

    @classmethod
    def get_supported_workstation_types(cls) -> {}:
        raise NotImplementedError

    def __init__(self, workstation_id: str, sync=None):
        if sync:
            self.sync = sync
        else:
            self.sync = Synchronization()

        self._id = kioskstdlib.delete_any_of(workstation_id.strip(), "*%\"'")

    @property
    def id(self):
        return self._id.strip()

    @property
    def description(self):
        raise NotImplementedError

    @property
    def state_text(self):
        raise NotImplementedError

    @property
    def state_description(self):
        raise NotImplementedError

    @property
    def icon_url(self):
        raise NotImplementedError

    @property
    def icon_code(self):
        raise NotImplementedError

    def load_workstation(self) -> bool:
        raise NotImplementedError

    def after_synchronization(self) -> bool:
        """
        This is called only after successful synchronization
        E.g. used to check if the status of the workstation allows to reset the download/upload status
        Needs to be overridden since some workstation types might not even have a download/upload status
        :returns boolean
        :exception: Throws no exceptions.
        """
        raise NotImplementedError

    @property
    def recording_group(self) -> str:
        return ""

    @classmethod
    def workstation_id_exists(cls, workstation_id):
        return KioskSQLDb.get_record_count("repl_workstation", "id", "\"id\"=%s", [workstation_id]) > 0

    @classmethod
    def get_privileges(cls) -> dict:
        return cls.PRIVILEGES

    def access_granted(self, grant_by_wildcard: bool = True) -> bool:
        """
        returns whether or not the access to this dock is granted at all for the current user
        :param grant_by_wildcard: if True some workstation types will be accessible by default
        :returns: bool
        """

        return bool(get_local_authorization_strings(self.get_privileges(), param_user=current_user))


# noinspection PyAbstractClass
class KioskDock(KioskWorkstation):
    pass
