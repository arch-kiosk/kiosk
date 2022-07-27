from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from kioskuser import KioskUser
from sync_config import SyncConfig
from mcpinterface.mcpjob import MCPJob, MCPJobStatus
from generalstore.generalstore import GeneralStore
from generalstore.generalstorekeys import gs_key_kiosk_init_counter
import logging


class WorkstationManagerWorker:
    def __init__(self, cfg: SyncConfig, job: MCPJob, gs: GeneralStore):
        self.job: MCPJob = job
        self.gs: GeneralStore = gs
        from kioskconfig import KioskConfig
        self.cfg = cfg

    def start(self):
        logging.info(f"job {self.job.job_id}: running")
        self.job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
        self.worker()

    def worker(self):
        raise NotImplementedError

    def init_dsd(self):
        master_dsd = Dsd3Singleton.get_dsd3()
        master_dsd.register_loader("yml", DSDYamlLoader)
        if not master_dsd.append_file(self.cfg.get_dsdfile()):
            logging.error(
                f"create_workstation: DSD {self.cfg.get_dsdfile()} could not be loaded by append_file.")
            raise Exception(f"create_workstation: DSD {self.cfg.get_dsdfile()} could not be loaded.")
        return master_dsd

    def get_kiosk_user(self):
        """
        returns a KioskUser object with the user data of the user who started the job.
        returns None if there is no user data or that user does not exist.
        """
        try:
            user_uuid = self.job.user_data["uuid"]
            logging.info(f"WorkstationManagerWorker.get_kiosk_user: loading user {user_uuid}")
            user = KioskUser(user_uuid, check_token=False)
            return user
        except BaseException as e:
            logging.error(f"WorkstationManagerWorker.get_kiosk_user: {repr(e)}")
            return None

    def job_is_ok(self, current_operation_label=""):
        if current_operation_label == "":
            current_operation_label = f"Job {self.job.job_id}"

        status = self.job.fetch_status()
        if status == MCPJobStatus.JOB_STATUS_CANCELLING:
            logging.error(f"{current_operation_label} job has status CANCELLING.")
            return False

        if not self.job.check_pulse():
            logging.error(f"{current_operation_label} job timed out.")
            return False

        return True

    def inc_system_wide_init_counter(self) -> int:
        """
        increases the system-wide (general store) initialization counter
        :return: int
        """
        logging.debug(f"{self.__class__.__name__}.inc_system_wide_init_counter: increasing counter.")
        try:
            return self.gs.inc_int(gs_key_kiosk_init_counter)
        except KeyError as e:
            self.gs.put_int(gs_key_kiosk_init_counter, 1)
            return 1

