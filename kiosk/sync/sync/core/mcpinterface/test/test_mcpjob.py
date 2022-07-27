import time

import pytest
import os

from mcpinterface.mcpjob import MCPJob, MCPJobStatusError, MCPJobStatus, Progress
from sync_plugins.redisgeneralstore.redisgeneralstore import RedisGeneralStore
from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")


class TestMCPJob(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def gs(self):
        config = self.get_config(config_file)
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
        job = MCPJob(self.gs)
        assert job.job_id

    def test_set_worker(self, gs):
        job = MCPJob(gs)
        assert not job.get_worker()
        job.set_worker("sync_plugins.kioskstarter", "WorkerClass")
        assert job.get_worker() == ("sync_plugins.kioskstarter", "WorkerClass")
        job._job_info.status = 1
        with pytest.raises(MCPJobStatusError):
            job.set_worker("sync_plugins.kioskstarter", "newWorkerClass")

    def test_set_attributes(self, gs):
        job = MCPJob(gs)

        assert job.capture_log
        job.capture_log = False
        assert not job.capture_log

        assert job.auto_renew
        job.auto_renew = False
        assert not job.auto_renew

        assert not job.system_lock
        job.system_lock = True
        assert job.system_lock

        job.job_data = {"key1": "value1",
                        "key2": "value2"}
        assert job.job_data == {"key1": "value1",
                                "key2": "value2"}
        job.user_data = {"key3": "value3",
                         "key4": "value4"}
        assert job.user_data == {"key3": "value3",
                                 "key4": "value4"}

        assert job.os_pid == 0
        job.os_pid = 1
        assert job.os_pid == 1

    def test_set_and_save_attributes(self, gs):
        job = MCPJob(gs)

        job.capture_log = False
        job.auto_renew = False
        job.system_lock = True
        job.os_pid = 1
        job.job_data = {"key1": "value1",
                        "key2": "value2"}
        job.user_data = {"key3": "value3",
                         "key4": "value4"}
        job.set_worker("module", "class")
        job.queue()
        job_id = job.job_id

        job = MCPJob(gs, job_id)
        assert not job.capture_log
        assert not job.auto_renew
        assert job.system_lock
        assert job.job_data == {"key1": "value1",
                                "key2": "value2"}
        assert job.user_data == {"key3": "value3",
                                 "key4": "value4"}
        assert job.os_pid == 1

    def test_queue(self, gs):
        job = MCPJob(gs)
        job.set_worker("sync_plugins.kioskstarter", "WorkerClass")
        job.user_data = {"user-id": "lkh"}
        job.job_data = {"do": "this and that"}
        job.queue()
        job_id = job.job_id

        new_job = MCPJob(gs, job_id)
        assert new_job.get_worker() == ("sync_plugins.kioskstarter", "WorkerClass")
        assert new_job.status == MCPJobStatus.JOB_STATUS_REGISTERED
        assert new_job.user_data == {"user-id": "lkh"}
        assert new_job.job_data == {"do": "this and that"}

    def test_cancel(self, gs):
        job = MCPJob(gs)
        job.set_worker("sync_plugins.kioskstarter", "WorkerClass")
        job.user_data = {"user-id": "lkh"}
        job.job_data = {"do": "this and that"}
        job.cancel()
        assert job.status == MCPJobStatus.JOB_STATUS_CANCELLED
        with pytest.raises(MCPJobStatusError):
            job.queue()
        job._job_info.status = MCPJobStatus.JOB_STATUS_GHOST
        job.queue()
        job.cancel()
        job_id = job.job_id

        new_job = MCPJob(gs, job_id)
        assert new_job.status == MCPJobStatus.JOB_STATUS_CANCELLED

    def test__change_data_attribute(self, gs):
        job = MCPJob(gs)
        job.set_worker("sync_plugins.kioskstarter", "WorkerClass")
        job.user_data = {"user-id": "lkh"}
        job.job_data = {"do": "this and that"}
        job.queue()
        job_id = job.job_id
        assert job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
        assert job._change_data_attribute(["job_data", "do"], "something else")
        new_job = MCPJob(gs, job_id)
        assert new_job.get_worker() == ("sync_plugins.kioskstarter", "WorkerClass")
        assert new_job.status == MCPJobStatus.JOB_STATUS_DONE
        assert new_job.job_data["do"] == "something else"

        new_job.auto_renew = False
        another_one = MCPJob(gs, job_id)
        assert not another_one.auto_renew

    def test__fetch_data_attribute(self, gs):
        job = MCPJob(gs)
        job.set_worker("sync_plugins.kioskstarter", "WorkerClass")
        job.user_data = {"user_id": "lkh"}
        job.job_data = {"do": "this and that"}
        job.meta_data = ["Workstation", "FileMakerWorkstation"]
        job.queue()
        job_id = job.job_id

        new_job = MCPJob(gs, job_id)
        assert new_job.set_status_to(MCPJobStatus.JOB_STATUS_GHOST)
        assert new_job._change_data_attribute(["job_data", "do"], "something else")
        assert new_job._change_data_attribute(["user_data", "user_id"], "new_user")
        new_job.set_worker("sync_plugins.kioskstarter", "Some other WorkerClass")
        assert new_job.meta_data == ["Workstation", "FileMakerWorkstation"]
        new_job._change_data_attribute(["meta_data"], ["Workstation"])
        assert new_job.set_status_to(MCPJobStatus.JOB_STATUS_REGISTERED)
        assert new_job.set_status_to(MCPJobStatus.JOB_STATUS_DONE)
        assert new_job.status == MCPJobStatus.JOB_STATUS_DONE
        new_job.auto_renew = False

        assert job.get_worker() == ("sync_plugins.kioskstarter", "WorkerClass")
        assert job.user_data == {"user_id": "lkh"}
        assert job.job_data == {"do": "this and that"}
        assert job.meta_data == ["Workstation", "FileMakerWorkstation"]
        assert job.status == MCPJobStatus.JOB_STATUS_REGISTERED

        assert job.fetch_status() == MCPJobStatus.JOB_STATUS_DONE
        assert job.status == MCPJobStatus.JOB_STATUS_DONE
        assert job._fetch_data_attribute("job_data")
        assert job.job_data == {"do": "something else"}
        assert job.user_data == {"user_id": "lkh"}
        assert job._fetch_data_attribute("user_data")
        assert job.user_data == {"user_id": "new_user"}
        assert job._fetch_data_attribute("meta_data")
        assert job.meta_data == ["Workstation"]

    def test_pulse(self, gs):
        job = MCPJob(gs)
        job.set_worker("sync_plugins.kioskstarter", "WorkerClass")
        job.user_data = {"user-id": "lkh"}
        job.job_data = {"do": "this and that"}
        job.seconds_till_timeout = 1
        job.queue()
        job_id = job.job_id
        assert job.pulse(start=True)
        assert job.check_pulse()
        time.sleep(2)
        assert not job.check_pulse()

    def test_auto_renew(self, gs):
        # do it without autorenew first
        for i in range(0, 1):
            job = MCPJob(gs)
            job.set_worker("sync_plugins.kioskstarter", "WorkerClass")
            job.user_data = {"user-id": "lkh"}
            job.job_data = {"do": "this and that"}
            job.auto_renew = bool(i)
            job.seconds_till_timeout = 2
            job.queue()
            job_id = job.job_id
            assert job.pulse(start=True)
            assert job.check_pulse() == 1
            time.sleep(2)
            assert job.set_status_to(MCPJobStatus.JOB_STATUS_RUNNING)
            time.sleep(1)
            if job.auto_renew:
                assert job.check_pulse() == 2
            else:
                assert not job.check_pulse()

    def test_set_result_and_progress(self, gs):
        job = MCPJob(gs)
        job.set_worker("class", "module")
        job.user_data = {"user-id": "lkh"}
        job.job_data = {"do": "this and that"}
        job.publish_progress(0, "None")
        job.publish_result({"success": "none"})
        job.auto_renew = True
        job.seconds_till_timeout = 2
        job.queue()
        job_id = job.job_id

        job1 = MCPJob(gs, job_id)
        assert job.progress.get_progress() == 0
        assert job.result == {"success": "none"}

        assert job1.publish_progress(10, "10% done")
        assert job1.publish_result({"success": "not yet"})

        assert job.poll_progress().get_progress() == 10
        assert job.poll_progress().get_message() == "10% done"
        assert job.fetch_result() == {"success": "not yet"}

        assert job.publish_detailed_progress("some topic", 50, "some message")
        progress = job1.poll_progress()
        assert progress.get_progress("some topic") == 50
        assert progress.get_message("some topic") == "some message"
        assert progress.get_progress_dict() == {"some_topic": {"message": "some message", 'order': 0, "progress": 50},
                                                "progress": 10,
                                                "message": "10% done"}

    def test_set_loglines(self, gs):
        job = MCPJob(gs)
        job.set_worker("class", "module")
        job.user_data = {"user-id": "lkh"}
        job.job_data = {"do": "this and that"}
        job.publish_progress(0, "None")
        job.publish_result({"success": "none"})
        job.auto_renew = True
        job.seconds_till_timeout = 2
        assert job.get_log_lines() == 0
        job.queue()
        job_id = job.job_id
        assert job.publish_log_lines(["line 1", "line 2"]) == 2
        assert job.publish_log_lines(["line 3", "line 4"]) == 4

        job2 = MCPJob(gs, job_id)
        assert job2.get_log_lines() == ["line 1", "line 2", "line 3", "line 4"]

    def test_with_job_type_suffix(self, gs):
        suffix = "WS"
        job = MCPJob(gs, job_type_suffix=suffix)
        job.set_worker("class", "module")
        job.user_data = {"user-id": "lkh"}
        job.job_data = {"do": "this and that"}
        job.meta_data = ["workstation"]
        job.publish_progress(0, "None")
        job.publish_result({"success": "none"})
        job.auto_renew = True
        job.seconds_till_timeout = 2
        assert job.get_log_lines() == 0
        job.queue()
        job_id = job.job_id
        assert job.publish_log_lines(["line 1", "line 2"]) == 2
        assert job.publish_log_lines(["line 3", "line 4"]) == 4

        job2 = MCPJob(gs, job_id)
        assert job2.get_log_lines() == ["line 1", "line 2", "line 3", "line 4"]

        assert job2.job_id[-2:] == suffix
