import logging
from mcpinterface.mcpjob import MCPJobStatus
from plugins.kioskreportingdockplugin import KioskReportingDock
from synchronization import Synchronization
from plugins.syncmanagerplugin.workstationmanagerworker import WorkstationManagerWorker
from plugins.kioskfilemakerworkstationplugin.kioskfilemakerworkstation import KioskFileMakerWorkstation


class DeleteReportingDockWorker(WorkstationManagerWorker):

    def worker(self):

        def delete_dock():

            self.init_dsd()
            sync = Synchronization()
            try:
                dock = KioskReportingDock(dock_id=dock_id, sync=sync)
                self.job.publish_progress(10)
                if dock.load_workstation():
                    dock.sync_dock.delete(commit=True)
                    self.job.publish_progress(100)
                    rc = "ok"
                else:
                    rc = "It was not possible to load the reporting dock."
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.worker: {repr(e)}")
                rc = repr(e)
            return rc

        # #########
        # Code of worker function
        # #########
        logging.debug("DeleteReportingDock worker starts")

        try:
            if self.job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING:
                self.job.publish_progress(0, "processing request...")
                dock_id = self.job.job_data["workstation_id"]
                json_message = delete_dock()
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
                                         "message": "Delete reporting dock cancelled by user."})

        except InterruptedError:
            if self.job.progress.get_message():
                self.job.publish_result({"success": False,
                                         "message": self.job.progress.get_message()
                                         })
            else:
                self.job.publish_result({"success": False,
                                         "message": "An error occurred. Please refer to the log for details."
                                         })

        logging.debug("delete reporting dock - worker ends")
