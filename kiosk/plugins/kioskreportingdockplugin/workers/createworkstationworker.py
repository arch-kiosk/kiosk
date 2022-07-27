import logging
from mcpinterface.mcpjob import MCPJobStatus
from plugins.kioskreportingdockplugin import KioskReportingDock
from synchronization import Synchronization
from plugins.syncmanagerplugin.workstationmanagerworker import WorkstationManagerWorker
from plugins.kioskfilemakerworkstationplugin.kioskfilemakerworkstation import KioskFileMakerWorkstation


class CreateWorkstationWorker(WorkstationManagerWorker):

    def worker(self):

        def create_workstation():

            self.init_dsd()

            sync = Synchronization()
            ws = KioskReportingDock(dock_id=dock_id, sync=sync)
            try:
                ws.create_workstation(dock_name=dock_name, creation_params=dock_params)
                rc = "ok"
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.worker: {repr(e)}")
                rc = repr(e)
            return rc

        # #########
        # Code of worker function
        # #########
        logging.debug("create workstation - worker starts")

        try:
            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.publish_progress(0, "processing request...")
                dock_id = self.job.job_data["workstation_id"]
                dock_name = self.job.job_data["description"]
                dock_params = {
                    "query_definition_filename": self.job.job_data["query_definition_filename"],
                    "mapping_definition_filename": self.job.job_data["mapping_definition_filename"],
                    "template_file": self.job.job_data["template_file"],
                    "output_file_prefix": self.job.job_data["output_file_prefix"],
                }
                json_message = create_workstation()
                if json_message == "ok":
                    self.job.publish_result({"success": True})
                    logging.info(f"job {self.job.job_id}: successful")
                else:
                    self.job.publish_result({"success": False,
                                             "message": json_message
                                             })
                self.job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
            else:
                self.job.publish_result({"success": False,
                                         "message": "Create Workstation cancelled by user."})

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result({"success": False,
                                         "message": self.job.progress.get_message()
                                         })
            else:
                self.job.publish_result({"success": False,
                                         "message": "An error occurred. Please refer to the log for details."
                                         })

        logging.debug("create workstation - worker ends")
