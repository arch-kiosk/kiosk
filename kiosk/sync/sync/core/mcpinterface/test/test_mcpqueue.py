import time

import pytest
import os

from mcpinterface.mcpjob import MCPJob, MCPJobStatusError, MCPJobStatus
from mcpinterface.mcpqueue import MCPQueue, MCPLockError, MCPJobUnknownError
from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
file_repos_path = os.path.join(test_path, "data", "file_repos")


class TestMCPQueue(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def gs(self):
        config = self.get_config(config_file, file_repos_path=file_repos_path)
        assert config.get_file_repository() == file_repos_path
        assert config.database_name == "urap_test"
        gs = RedisGeneralStore(config)
        assert gs._check_redis()
        return gs

    @pytest.fixture()
    def config(self):
        return SyncConfig.get_config()

    def test_init(self, gs, config):
        assert config.database_name == "urap_test"
        assert gs
        queue = MCPQueue(gs)
        assert queue

    def test_lock(self, gs):
        queue = MCPQueue(gs)
        lock = queue.lock()
        queue.unlock(lock)
        lock = queue.lock()
        time.sleep(5)
        first_lock = queue.lock()
        with pytest.raises(MCPLockError):
            second_lock = queue.lock(timeout=1)
        queue.unlock(first_lock)
        lock = queue.lock(timeout=1, expire_seconds=1)
        time.sleep(2)
        queue.unlock(lock)

    def test_force_flush(self, gs):
        job = MCPJob(gs)
        job.set_worker("class", "module")
        job.queue()
        job_id = job.job_id
        assert MCPJob(gs, job_id).job_id == job_id

        queue = MCPQueue(gs)
        queue.force_flush()
        with pytest.raises(MCPJobUnknownError):
            MCPJob(gs, job_id).job_id == job_id

    def test_list_jobs(self, gs):
        queue = MCPQueue(gs)
        queue.force_flush()
        assert queue.list_jobs() == []
        job_ids = []
        for _ in range(1, 10):
            job = MCPJob(gs)
            job.set_worker("class", "module")
            job.project_id = "urap"
            job.seconds_to_idle = 60
            job.seconds_till_timeout = 5
            job.queue()
            job_ids.append(job.job_id)
        job_list = queue.list_jobs()
        job_list.sort()
        job_ids.sort()
        assert job_list == job_ids

    def test_pop(self, gs):
        queue = MCPQueue(gs)
        job = MCPJob(gs)
        job.set_worker("class", "module")
        job.queue()
        job_id = job.job_id
        assert MCPJob(gs, job_id).job_id == job_id
        data = queue.pop(job_id)
        assert data["job_id"] == job_id
        data = queue.pop(job_id)
        assert not data

    def test_list_jobs_with_suffix(self, gs):
        queue = MCPQueue(gs)
        queue.force_flush()
        assert queue.list_jobs() == []
        job_ids = []
        for _ in range(1, 10):
            if _ % 2 == 0:
                job = MCPJob(gs)
            else:
                job = MCPJob(gs, job_type_suffix="WS")
                job_ids.append(job.job_id)

            job.set_worker("class", "module")
            job.project_id = "urap"
            job.seconds_to_idle = 60
            job.seconds_till_timeout = 5
            job.queue()
        job_list = queue.list_jobs(suffix="WS")
        job_list.sort()
        job_ids.sort()
        assert job_list == job_ids
