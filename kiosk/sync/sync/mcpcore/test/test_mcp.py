import time

import pytest
import os

from mcpinterface.mcpjob import MCPJob, MCPJobStatusError, MCPJobStatus
from mcpinterface.mcpqueue import MCPQueue, MCPLockError, MCPJobUnknownError
from mcpcore.mcp import MCP
from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper


test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestMCP(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def gs(self):
        config = self.get_config(config_file, log_file=log_file)
        assert config.database_name == "urap_test"
        gs = RedisGeneralStore(config)
        assert gs._check_redis()
        queue = MCPQueue(gs)
        queue.force_flush()
        assert not queue.is_mcp_alive(), "MCP should not be running in the background while running these tests!"
        return gs

    @pytest.fixture()
    def config(self):
        return SyncConfig.get_config()

    def test_init(self, gs, config):
        assert config.database_name == "urap_test"
        assert gs
        mcp = MCP(gs)
        assert mcp

    def test_reload_queue(self, gs):
        MCPQueue(gs).force_flush()
        mcp = MCP(gs)
        mcp.reload_queue()
        for job_nr in range(5, 0, -1):
            job = MCPJob(gs)
            job.job_data = {"job_nr": job_nr}
            job.set_worker("module", "class")
            job.queue()
            time.sleep(.1)
            print(f"{job_nr}: {job._job_info.ns_created}")

        mcp.reload_queue()
        ordered = [job.job_data["job_nr"] for job in mcp.queue.values()]
        assert ordered == [5, 4, 3, 2, 1]

    def test_next_job(self, gs):
        MCPQueue(gs).force_flush()
        time.sleep(1)
        mcp = MCP(gs)
        mcp.reload_queue()
        for job_nr in range(5, 0, -1):
            job = MCPJob(gs)
            job.job_data = {"job_nr": job_nr}
            job.set_worker("module", "class")
            job.queue()
            time.sleep(.1)

        job = mcp.next_job()
        assert job.job_data["job_nr"] == 5
        job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_RUNNING)
        assert not mcp.next_job()
        job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_CANCELLING)
        assert not mcp.next_job()
        job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_REGISTERED)

        for job_nr in range(5, 0, -1):
            job = mcp.next_job()
            assert job.job_data["job_nr"] == job_nr
            job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_DONE)

        assert not mcp.next_job()

    def test_next_job_2(self, gs):
        MCPQueue(gs).force_flush()
        time.sleep(1)
        mcp = MCP(gs)
        mcp.reload_queue()

        queue = MCPQueue(gs)
        for _ in range(1, 4):
            job = MCPJob(gs)
            job.set_worker("class", "module")
            job.project_id = "urap"
            job.seconds_to_idle = 10
            job.seconds_till_timeout = 5
            job.job_data = {"job_nr": _}
            job.queue()
            time.sleep(.2)

        job = mcp.next_job()
        assert job
        assert job.job_data["job_nr"] == 1
        job.set_status_to(new_status=MCPJobStatus.JOB_STATUS_STARTED)

        job2 = mcp.next_job()
        assert not job2
        job.set_status_to(new_status=MCPJobStatus.JOB_STATUS_DONE)

        job2 = mcp.next_job()
        assert job2
        assert job2.job_data["job_nr"] == 2
        job2.set_status_to(new_status=MCPJobStatus.JOB_STATUS_STARTED)

        job3 = mcp.next_job()
        assert not job3
        job2.set_status_to(new_status=MCPJobStatus.JOB_STATUS_DONE)

        job3 = mcp.next_job()
        assert job3
        assert job3.job_data["job_nr"] == 3
        job3.set_status_to(new_status=MCPJobStatus.JOB_STATUS_DONE)

        assert not mcp.next_job()

        # job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_RUNNING)
        # assert not mcp.next_job()
        # job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_CANCELLING)
        # assert not mcp.next_job()
        # job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_REGISTERED)
        #
        # for job_nr in range(5, 0, -1):
        #     job = mcp.next_job()
        #     assert job.job_data["job_nr"] == job_nr
        #     job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_DONE)
        #
        # assert not mcp.next_job()

    def test_priority_job(self, gs):
        MCPQueue(gs).force_flush()
        time.sleep(1)
        mcp = MCP(gs)
        mcp.reload_queue()
        for job_nr in range(5, 0, -1):
            job = MCPJob(gs)
            job.job_data = {"job_nr": job_nr}
            if job_nr in [3, 1]:
                job.system_lock = True
            job.set_worker("module", "class")
            job.queue()
            time.sleep(.1)

        for job_nr in [3, 1, 5, 4, 2]:
            job = mcp.next_job()
            assert job.job_data["job_nr"] == job_nr
            job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_DONE)

        assert not mcp.next_job()

    def test_multiple_project_jobs(self, gs):
        MCPQueue(gs).force_flush()
        time.sleep(1)
        mcp = MCP(gs)
        mcp.reload_queue()
        for job_nr in range(5, 0, -1):
            job = MCPJob(gs)
            job.job_data = {"job_nr": job_nr}
            if job_nr in [4, 2]:
                job.project_id = "ustp"
            else:
                job.project_id = "urap"
            job.set_worker("module", "class")
            job.queue()
            time.sleep(1)

        job5 = mcp.next_job()
        assert job5.job_data["job_nr"] == 5
        job5._set_job_attribute("status", MCPJobStatus.JOB_STATUS_RUNNING)
        job = mcp.next_job()
        assert job.job_data["job_nr"] == 4
        job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_RUNNING)
        assert not mcp.next_job()
        job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_DONE)
        job2 = mcp.next_job()
        assert job2.job_data["job_nr"] == 2

        job5._set_job_attribute("status", MCPJobStatus.JOB_STATUS_CANCELLED)
        job = mcp.next_job()
        assert job.job_data["job_nr"] == 3
        job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_DONE)
        job2._set_job_attribute("status", MCPJobStatus.JOB_STATUS_DONE)

        job = mcp.next_job()
        assert job.job_data["job_nr"] == 1
        job._set_job_attribute("status", MCPJobStatus.JOB_STATUS_DONE)
        job = mcp.next_job()
        assert not job

    def test_start_job_mock(self, gs, monkeypatch):

        def mock_start_process(something, job_id, kiosk_base_path, config_file_name, test_mode):
            job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
            base_path = self.get_kiosk_base_path_from_test_path(test_path)

            assert kiosk_base_path == base_path
            assert config_file_name == config_file
            return 1

        monkeypatch.setattr(MCP, "start_process", mock_start_process)
        MCPQueue(gs).force_flush()
        time.sleep(1)
        mcp = MCP(gs)
        mcp.reload_queue()
        job = MCPJob(gs)
        job.set_worker("module", "class")
        job.queue()
        assert mcp.start_job(mcp.next_job()) == 1
        assert job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING

    def test_start_job(self, gs):
        MCPQueue(gs).force_flush()
        mcp = MCP(gs)
        mcp.reload_queue()
        job = MCPJob(gs)
        job.set_worker("module", "class")
        job.queue()
        p = mcp.start_job(mcp.next_job(), test_mode=1)
        assert p
        assert job.fetch_status() == MCPJobStatus.JOB_STATUS_STARTED
        p.join(timeout=10)
        assert job._fetch_data_attribute("os_pid", lock_queue=False) == p.pid

    def test_start_real_job(self, gs):
        # MCPQueue(gs).force_flush()
        mcp = MCP(gs)
        mcp.reload_queue()
        job = MCPJob(gs)
        job.seconds_to_idle = 60
        job.project_id = "urap"
        job.system_lock = True
        job.set_worker("mcpcore.test.jobs", "Job1")
        job.queue()
        # p = mcp.start_job(mcp.next_job())
        # assert p
        # time.sleep(3)
        # assert job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING
        # p.join(timeout=10)
        # assert job.fetch_status() == MCPJobStatus.JOB_STATUS_DONE

    def test_start_stuck_job(self, gs):
        MCPQueue(gs).force_flush()
        time.sleep(1)
        mcp = MCP(gs)
        mcp.reload_queue()
        job = MCPJob(gs)
        job.set_worker("mcpcore.test.jobs", "StuckJob")
        job.seconds_till_timeout = 3
        job.queue()
        p = mcp.start_job(mcp.next_job())
        assert p
        time.sleep(3)
        assert job.fetch_status() == MCPJobStatus.JOB_STATUS_RUNNING
        assert job.check_pulse()
        time.sleep(2)
        assert job.check_pulse()
        time.sleep(2)
        assert not job.check_pulse()
        p.terminate()

    def test_terminate_timeouts(self, gs):
        MCPQueue(gs).force_flush()
        mcp = MCP(gs)
        mcp.reload_queue()
        job = MCPJob(gs)
        job.set_worker("mcpcore.test.jobs", "StuckJob")
        job.seconds_till_timeout = 1
        job.queue()
        p = mcp.start_job(mcp.next_job())
        assert p
        time.sleep(5)
        assert not job.check_pulse()
        assert mcp.collect_garbage() == 1
        assert job.fetch_status() == MCPJobStatus.JOB_STATUS_CANCELLING
        time.sleep(2)
        assert mcp.collect_garbage() == 1
        time.sleep(2)
        assert mcp.collect_garbage() == 0
        assert job.fetch_status() == MCPJobStatus.JOB_STATUS_ABORTED

    def test_garbage_collection(self, gs):
        MCPQueue(gs).force_flush()
        mcp = MCP(gs)
        mcp.reload_queue()
        job = MCPJob(gs)
        job.set_worker("mcpcore.test.jobs", "StuckJob")
        job.seconds_till_timeout = 1
        job.seconds_to_idle = 3
        job.queue()
        p = mcp.start_job(mcp.next_job())
        assert p
        time.sleep(3)
        assert not job.check_pulse()
        assert mcp.collect_garbage() == 1
        assert job.fetch_status() == MCPJobStatus.JOB_STATUS_CANCELLING
        time.sleep(2)
        assert mcp.collect_garbage() == 1
        assert job.fetch_status() == MCPJobStatus.JOB_STATUS_ABORTED
        time.sleep(2)
        assert mcp.collect_garbage() == 0
        time.sleep(2)
        assert mcp.collect_garbage() == 1
        with pytest.raises(KeyError):
            assert job.fetch_status() == MCPJobStatus.JOB_STATUS_ABORTED

    def test_pulse_mcp(self, gs):

        queue = MCPQueue(gs)
        queue.force_flush()
        mcp = MCP(gs)
        mcp.mcp_pulse_timeout = 2
        mcp.pulse_mcp(lock_queue=True)
        time.sleep(1)
        assert queue.is_mcp_alive()
        time.sleep(2)
        assert not queue.is_mcp_alive()
