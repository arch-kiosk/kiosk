import os
import time

import pytest

import kioskglobals
from messaging.systemmessage import SystemMessage, MSG_SEVERITY_INFO, MSG_SEVERITY_HIGHEST, MSG_SEVERITY_LOWEST
from messaging.systemmessagecatalog import SYS_MSG_ID_TEST_MULTI
from messaging.systemmessagelist import SystemMessageList, ErrorSystemMessageDeleted
from messaging.systemmessagestore import SystemMessageStore
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class SystemMessageTestStore:
    store_values = []

    def load(self, store: SystemMessageStore):
        for v in self.store_values:
            msg = SystemMessage(uid=v[0], message_id=SYS_MSG_ID_TEST_MULTI)
            msg.headline = v[1]
            if v[2]:
                msg.delete()
            store.set_message(msg)

    def store(self, store):
        self.store_values = []
        for msg in store.messages:
            self.store_values.append((msg.uid, msg.headline, msg.deleted))

    def clear(self, store):
        self.store_values = []


class TestSystemMessageList(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def rgs(self, config):
        return self.get_general_store(config)

    @pytest.fixture()
    def sys_messages(self, rgs, config):

        SystemMessageList.release_instance()
        sml = SystemMessageList(rgs, config.get_project_id())
        test_store = SystemMessageTestStore()
        sml.assign_store(SystemMessageStore(on_store=test_store.store, on_load=test_store.load))
        return sml

    def test_init(self, sys_messages, rgs, config):
        assert sys_messages

        # test singleton
        sys_message_2 = SystemMessageList(rgs, config.get_project_id())
        assert sys_messages == sys_message_2
        assert sys_messages._list is not None
        sys_messages.release_instance()

        sys_message_3 = SystemMessageList(rgs, config.get_project_id())
        assert sys_messages != sys_message_3

    def test_change_mark(self, sys_messages: SystemMessageList, rgs, config):
        sys_messages.reset_general_change_mark()
        assert sys_messages.general_change_mark == 0
        assert sys_messages._new_general_change_mark() == 1
        assert sys_messages._new_general_change_mark() == 2
        assert sys_messages.general_change_mark == 2
        sys_messages.release_instance()
        sys_messages_2 = SystemMessageList(rgs, config.get_project_id())
        assert sys_messages_2 != sys_messages
        assert sys_messages_2._new_general_change_mark()
        assert sys_messages_2.general_change_mark == 3
        assert sys_messages._new_general_change_mark()
        assert sys_messages.general_change_mark == 4
        assert sys_messages_2.general_change_mark == 4

    def test_send_message(self, sys_messages, rgs):
        with pytest.raises(ValueError):
            msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
            msg._uid = None
            sys_messages.send_message(msg)

        with pytest.raises(ValueError):
            msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
            assert sys_messages.send_message(msg)

        with pytest.raises(ValueError):
            msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
            msg.headline = "my headline"
            assert sys_messages.send_message(msg)

        msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg.headline = "my headline"
        msg.sender = "a sender"
        assert sys_messages.send_message(msg)

        assert sys_messages.count == 1

        assert sys_messages.get_message(msg.uid).dirty

        msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg.headline = "my second headline"
        msg.sender = "a sender"
        assert sys_messages.send_message(msg, trigger_update=False)

        assert sys_messages.count == 2

        assert not sys_messages.get_message(msg.uid).dirty

    def test_delete_message(self, sys_messages):
        msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg.headline = "my headline"
        msg.sender = "a sender"
        assert sys_messages.send_message(msg, False)
        assert sys_messages.get_message(msg.uid).headline == msg.headline
        assert not sys_messages.get_message(msg.uid, include_deleted=True).dirty

        sys_messages.delete_message(msg.uid)
        with pytest.raises(ErrorSystemMessageDeleted):
            assert sys_messages.get_message(msg.uid) == msg

        assert sys_messages.get_message(msg.uid, include_deleted=True).headline == msg.headline
        assert sys_messages.get_message(msg.uid, include_deleted=True).dirty

        sys_messages.delete_message(msg.uid, for_good=True)
        with pytest.raises(KeyError):
            assert sys_messages.get_message(msg.uid, include_deleted=True) == msg

    def test_messages(self, sys_messages):
        msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg.headline = "message 1"
        msg.sender = "a sender"
        msg.severity = 0
        assert sys_messages.send_message(msg)

        msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg.headline = "message 2"
        msg.sender = "a sender"
        msg.severity = 0
        assert sys_messages.send_message(msg)

        assert sys_messages.count == 2

        messages = list(sys_messages.get_messages(up_to_severity=MSG_SEVERITY_LOWEST).messages())
        assert len(messages) == 2

        result = [messages[0].headline, messages[1].headline]
        result.sort()
        assert result == ["message 1", "message 2"]

    def test_get_relevance(self, sys_messages):
        msg1 = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg1.headline = "message 1"
        msg1.sender = "a sender"
        msg1.set_addressee("admins")
        msg1.severity = MSG_SEVERITY_HIGHEST
        assert sys_messages.send_message(msg1)

        msg2 = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg2.headline = "message 2"
        msg2.sender = "a sender"
        msg2.set_addressee("")
        msg2.severity = MSG_SEVERITY_INFO
        assert sys_messages.send_message(msg2)

        assert sys_messages.count == 2

        messages = sys_messages.get_messages(up_to_severity=MSG_SEVERITY_LOWEST)
        messages.set_thresholds(MSG_SEVERITY_LOWEST, MSG_SEVERITY_LOWEST)
        messages.set_user_information(user_groups=["admins"], user_id="test")

        assert messages.get_relevance(msg=msg1) == messages.MSG_RELEVANCE_SHOW
        assert messages.get_relevance(msg=msg2) == messages.MSG_RELEVANCE_SHOW

        messages.set_user_information(user_groups=["operators"], user_id="test")
        assert messages.get_relevance(msg=msg1) == messages.MSG_RELEVANCE_COUNT
        assert messages.get_relevance(msg=msg2) == messages.MSG_RELEVANCE_SHOW

        messages.set_user_information(user_groups=["admins", "operators"], user_id="test")
        assert messages.get_relevance(msg=msg1) == messages.MSG_RELEVANCE_SHOW
        assert messages.get_relevance(msg=msg2) == messages.MSG_RELEVANCE_SHOW

        messages.set_thresholds(MSG_SEVERITY_HIGHEST)
        assert messages.get_relevance(msg=msg1) == messages.MSG_RELEVANCE_SHOW
        assert messages.get_relevance(msg=msg2) == messages.MSG_RELEVANCE_NONE

        messages.set_thresholds(MSG_SEVERITY_INFO)
        assert messages.get_relevance(msg=msg1) == messages.MSG_RELEVANCE_SHOW
        assert messages.get_relevance(msg=msg2) == messages.MSG_RELEVANCE_SHOW

    def test_count_relevance(self, sys_messages):
        msg1 = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg1.headline = "message 1"
        msg1.sender = "a sender"
        msg1.set_addressee("admins")
        msg1.severity = MSG_SEVERITY_HIGHEST
        assert sys_messages.send_message(msg1)

        msg2 = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg2.headline = "message 2"
        msg2.sender = "a sender"
        msg2.set_addressee("")
        msg2.severity = MSG_SEVERITY_INFO
        assert sys_messages.send_message(msg2)

        assert sys_messages.count == 2

        messages = sys_messages.get_messages(up_to_severity=MSG_SEVERITY_LOWEST)
        messages.set_thresholds(MSG_SEVERITY_LOWEST, MSG_SEVERITY_LOWEST)
        messages.set_user_information(user_groups=["admins"], user_id="test")
        count = messages.count_relevant_messages()
        assert count.relevant == 2
        assert count.appears == 2
        assert messages.relevant_messages == 2
        assert messages.appearing_messages == 2

        messages.set_user_information(user_groups=["operators"], user_id="test")
        count = messages.count_relevant_messages()
        assert count.relevant == 2
        assert count.appears == 1
        assert messages.relevant_messages == 2
        assert messages.appearing_messages == 1

        messages.set_user_information(user_groups=["admins", "operators"], user_id="test")
        count = messages.count_relevant_messages()
        assert count.relevant == 2
        assert count.appears == 2
        assert messages.relevant_messages == 2
        assert messages.appearing_messages == 2

        messages.set_thresholds(MSG_SEVERITY_HIGHEST)
        count = messages.count_relevant_messages()
        assert count.relevant == 1
        assert count.appears == 1
        assert messages.relevant_messages == 1
        assert messages.appearing_messages == 1

        messages.set_thresholds(MSG_SEVERITY_INFO)
        count = messages.count_relevant_messages()
        assert count.relevant == 2
        assert count.appears == 2
        assert messages.relevant_messages == 2
        assert messages.appearing_messages == 2

    def test_send_message_to_user(self, sys_messages: SystemMessageList):

        msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg.headline = "my headline"
        msg.sender = "a sender"
        msg.severity = 0
        assert sys_messages.send_message(msg)

        assert sys_messages.count == 1

        msg = SystemMessage(message_id=SYS_MSG_ID_TEST_MULTI)
        msg.headline = "my second headline"
        msg.sender = "a sender"
        msg.set_addressee("lkh", is_user=True)
        msg.severity = 0
        assert sys_messages.send_message(msg, trigger_update=False)

        messages = sys_messages.get_messages(up_to_severity=MSG_SEVERITY_LOWEST)
        assert messages
        assert len(list(messages.messages())) == 1
        messages.set_user_information([], "test")
        messages.set_thresholds(MSG_SEVERITY_LOWEST, MSG_SEVERITY_LOWEST)
        assert messages.relevant_messages == 1
        messages.set_user_information([], "lkh")
        assert messages.relevant_messages == 2
        assert messages.appearing_messages == 2

    # def test_sync(self, sys_messages: SystemMessageList):
    #     def load_list_values(msgs):
    #         for v in msgs:
    #             msg = SystemMessage(uid=v[0], message_id=SYS_MSG_ID_TEST_MULTI)
    #             msg.headline = v[1]
    #             if v[2]:
    #                 msg.delete()
    #             sys_messages.send_message(msg, validate=False)
    #
    #     test_store = SystemMessageTestStore()
    #     test_store.store_values = [("uid1", "headline 1", False), ("uid2", "headline2", False)]
    #
    #     store = SystemMessageStore(on_load=test_store.load, on_store=test_store.store, on_clear=test_store.clear)
    #     store.load()
    #     assert len(store.messages) == 2
    #     sys_messages.assign_store(store)
    #     load_list_values([("uid3", "headline 3", False), ("uid4", "headline4", False)])
    #
    #     sys_messages.sync(two_way=True)
    #     assert sys_messages.count == 4
    #
    #     time.sleep(.1)
    #     test_store.store_values = [("uid1", "headline 1", False), ("uid2", "headline2", False)]
    #     store = SystemMessageStore(on_load=test_store.load, on_store=test_store.store, on_clear=test_store.clear)
    #     store.load()
    #     assert len(store.messages) == 2
    #     sys_messages.assign_store(store)
    #
    #     sys_messages.sync(two_way=True)
    #     assert sys_messages.count == 4
    #
    #     assert len(store.messages) == 4
    #     time.sleep(.1)
    #     sys_messages.delete_message(uid="uid1")
    #     assert sys_messages.get_message("uid1", include_deleted=True).dirty
    #     sys_messages.sync(two_way=True)
    #     assert len([msg for msg in store.messages if not msg.deleted]) == 3
