import time, os

import pytest

from messaging.systemmessage import SystemMessage, MSG_SEVERITY_INFO, MSG_SEVERITY_HIGHEST, MSG_SEVERITY_LOWEST
from messaging.systemmessagecatalog import SYS_MSG_ID_MCP_NOT_UP, SYS_MSG_ID_TEST_LONER
from messaging.systemmessagelist import SystemMessageList, ErrorSystemMessageDeleted, ErrorNoMessageStore
from messaging.systemmessagestore import SystemMessageStore
from messaging.systemmessagestorepostgres import SystemMessageStorePostgres
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


# noinspection DuplicatedCode
class TestSystemMessageStorePostgres(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def rgs(self, config):
        return self.get_general_store(config)

    @pytest.fixture()
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def sys_messages(self, rgs, config):
        SystemMessageList.release_instance()
        return SystemMessageList(rgs, config.get_project_id())

    def test_init(self, sys_messages, config, db):
        assert sys_messages
        assert config
        assert db
        assert KioskSQLDb.does_table_exist('kiosk_system_message')

    def test_sync_1(self, config, db, rgs):
        KioskSQLDb.truncate_table("kiosk_system_message")

        # create two independent local message lists to simulate two processes
        SystemMessageList.release_instance()
        message_list_p1 = SystemMessageList(rgs, config.get_project_id())
        SystemMessageList.release_instance()
        message_list_p2 = SystemMessageList(rgs, config.get_project_id())

        # send a message in process 1
        msg_p1 = SystemMessage(SYS_MSG_ID_TEST_LONER)
        msg_p1.body = "p1"
        with pytest.raises(ErrorNoMessageStore):
            assert message_list_p1.send_message(msg_p1, validate=False)

        # send a message in process 2 with a delay
        time.sleep(2)
        msg_p2 = SystemMessage(SYS_MSG_ID_TEST_LONER)
        msg_p2.body = "p2"
        with pytest.raises(ErrorNoMessageStore):
            assert message_list_p2.send_message(msg_p2, validate=False)

        assert msg_p2.uid == msg_p1.uid

        # make sure both message lists have their message
        assert message_list_p1.count == 1
        assert message_list_p2.count == 1

        # sync process 1 with the message store
        message_store_p1 = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                              on_store=SystemMessageStorePostgres.store)
        message_list_p1.assign_store(message_store_p1)
        message_store_p1.load()
        assert len(message_store_p1.messages) == 0

        message_list_p1.sync(two_way=True)
        message_store_p1.store()

        # sync process 2 with the message store
        message_store_p2 = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                              on_store=SystemMessageStorePostgres.store)
        message_store_p2.load()
        message_list_p2.assign_store(message_store_p2)
        assert len(message_store_p2.messages) == 1
        message_list_p2.sync(two_way=True)
        message_store_p2.store()

        # load the store in process 1 again and test if the younger message of process 2 is the
        # only message in the store
        message_store_p1.load()
        assert len(message_store_p1.messages) == 1
        deletion_status, created, ts = message_store_p1.get_message_status(SYS_MSG_ID_TEST_LONER)
        assert ts == msg_p2.modified
        msgs = list(message_store_p1.messages)
        assert msgs[0].body == "p2"

        # delete the message in process 1 (which in fact deletes the message originally posted by process 2)
        message_list_p1.delete_message(SYS_MSG_ID_TEST_LONER)

        # sync process 1 with the message store
        message_list_p1.sync(two_way=True)
        message_store_p1.store()

        # sync process 2 with the message store
        message_store_p2.load()
        assert len(message_store_p2.messages) == 1
        message_list_p2.sync(two_way=True)
        message_store_p2.store()

        # check if the message is deleted in both message lists
        with pytest.raises(ErrorSystemMessageDeleted):
            message_list_p1.get_message(SYS_MSG_ID_TEST_LONER)

        assert message_list_p1.count == 0
        assert message_list_p2.count == 0

    def test_sync_2(self, config, db, rgs):
        KioskSQLDb.truncate_table("kiosk_system_message")

        # create two independent local message lists to simulate two processes
        SystemMessageList.release_instance()
        message_list_p1 = SystemMessageList(rgs, config.get_project_id())
        SystemMessageList.release_instance()
        message_list_p2 = SystemMessageList(rgs, config.get_project_id())

        # send a message in process 1
        msg_p1 = SystemMessage(SYS_MSG_ID_TEST_LONER)
        with pytest.raises(ErrorNoMessageStore):
            message_list_p1.send_message(msg_p1, validate=False)

        # send a message in process 2 with a delay
        time.sleep(1)
        msg_p2 = SystemMessage(SYS_MSG_ID_TEST_LONER)
        with pytest.raises(ErrorNoMessageStore):
            message_list_p2.send_message(msg_p2, validate=False)

        # make sure both message lists have their message
        assert message_list_p1.count == 1
        assert message_list_p2.count == 1

        # sync process 1 with the message store
        message_store_p1 = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                              on_store=SystemMessageStorePostgres.store)
        message_store_p1.load()
        assert len(message_store_p1.messages) == 0
        message_list_p1.assign_store(message_store_p1)
        message_list_p1.sync(two_way=True)
        message_store_p1.store()

        # delete the message in p2 before syncing with the store for the first time
        with pytest.raises(ErrorNoMessageStore):
            message_list_p2.delete_message(msg_p2.uid)

        # sync process 2 with the message store
        message_store_p2 = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                              on_store=SystemMessageStorePostgres.store)
        message_store_p2.load()
        assert len(message_store_p2.messages) == 1

        message_list_p2.assign_store(message_store_p2)
        message_list_p2.sync(two_way=True)
        message_store_p2.store()

        # load the store in process 1 again and test if the message is gone
        message_store_p1.load()
        message_list_p1.sync(two_way=True)

        # check if the message is deleted in both message lists
        with pytest.raises(KeyError):
            message_list_p1.get_message(msg_p1.uid)
        with pytest.raises(ErrorSystemMessageDeleted):
            message_list_p2.get_message(msg_p2.uid)

        assert message_list_p1.count == 0
        assert message_list_p2.count == 0
