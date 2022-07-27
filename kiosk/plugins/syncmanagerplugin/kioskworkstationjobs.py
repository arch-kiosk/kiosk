from mcpinterface.mcpqueue import MCPQueue
from mcpinterface.mcpjob import MCPJob

MCP_SUFFIX_WORKSTATION = "WS"
JOB_META_TAG_WORKSTATION = "WS"
JOB_META_TAG_DELETED = "DEL"
JOB_META_TAG_CREATED = "NEW"
JOB_META_TAG_SYNCHRONIZATION = "SYNC"


class KioskWorkstationJob:
    def __init__(self, job: MCPJob):
        self.mcp_job = job

    @property
    def workstation_id(self):
        if "ws_id" in self.mcp_job.job_data:
            return self.mcp_job.job_data["ws_id"]
        if "workstation_id" in self.mcp_job.job_data:
            return self.mcp_job.job_data["workstation_id"]


    @property
    def meta_data(self):
        return self.mcp_job.meta_data

    @property
    def job_id(self):
        return self.mcp_job.job_id


class KioskWorkstationJobs:
    def __init__(self, general_store, project_id):
        self._general_store = general_store
        self.queue = MCPQueue(general_store)
        self._jobs: [MCPJob] = []
        self._project_id = project_id

    def list_workstation_job_ids(self) -> [str]:
        """
        returns all mcp job-ids that are connected to a workstation.
        Note that this returns the jobs of all projects.
        fetch_workstation_jobs filters by project.
        :return: a list of job ids
        """
        return self.queue.list_jobs(suffix=MCP_SUFFIX_WORKSTATION)

    def fetch_workstation_jobs(self) -> [KioskWorkstationJob]:
        """
        fetches a list of KioskWorkstationJob instances with the job information of all
        jobs related to a workstation of the current project.

        :return: a list of KioskWorkstationJob instances
        """
        job_ids = self.list_workstation_job_ids()
        jobs = []
        for job_id in job_ids:
            job = KioskWorkstationJob(MCPJob(self._general_store, job_id))
            if job.mcp_job.project_id == self._project_id:
                if JOB_META_TAG_WORKSTATION in job.meta_data:
                    jobs.append(job)
                    # print(job.mcp_job.job_data)
                    # print(job.mcp_job.result)

        self._jobs = jobs
        return self._jobs

    def get_workstation_job(self, ws_id: str) -> MCPJob or None:
        if not self._jobs:
            self.fetch_workstation_jobs()
        for job in self._jobs:
            job: MCPJob
            if job.job_id == ws_id:
                return job

        return None
