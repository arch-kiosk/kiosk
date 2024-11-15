import datetime

import pytest

import kioskdatetimelib
from messaging.systemmessage import SystemMessage
from test.testhelpers import KioskPyTestHelper
from messaging.systemmessagecatalog import SYS_MSG_ID_TEST_LONER, SYS_MSG_ID_TEST_MULTI

# todo time zone simpliciation (done)

class TestSystemMessage(KioskPyTestHelper):

    def test_init(self):
        msg = SystemMessage()
        assert msg
        assert msg.uid

        msg = SystemMessage("uuid")
        assert msg
        assert msg.uid == "uuid"

    def test_timestamp(self):
        msg = SystemMessage()
        now = datetime.datetime.now()
        msg.timestamp = now
        assert msg.timestamp.timestamp() == now.timestamp()   #  .timestamp returns a POSIX float that's the same between different time zones
        assert msg.utc_timestamp.timestamp() == now.timestamp()

    def test_message_id(self):
        msg = SystemMessage()
        assert not msg._uid
        msg.message_id = SYS_MSG_ID_TEST_LONER
        assert msg._uid == SYS_MSG_ID_TEST_LONER

        with pytest.raises(ValueError):
            msg.message_id = SYS_MSG_ID_TEST_MULTI

        assert msg._uid == SYS_MSG_ID_TEST_LONER

        msg = SystemMessage()
        assert not msg._uid
        msg.message_id = SYS_MSG_ID_TEST_MULTI
        assert not msg._uid

        msg.message_id = SYS_MSG_ID_TEST_LONER

        assert msg._uid == SYS_MSG_ID_TEST_LONER
        assert msg.message_id == SYS_MSG_ID_TEST_LONER

        msg = SystemMessage()
        assert not msg._uid
        assert msg.uid

        with pytest.raises(ValueError):
            msg.message_id = SYS_MSG_ID_TEST_LONER

        msg.message_id = SYS_MSG_ID_TEST_MULTI


    def test_to_json_str(self):
        msg = SystemMessage()
        msg.utc_timestamp = kioskdatetimelib.get_utc_now()
        msg.headline = "my headline"
        msg.body = "my body"
        msg.severity = 12
        msg.set_addressee("lkh", is_user=True)
        msg.sender = "the sender"
        msg.message_id = SYS_MSG_ID_TEST_LONER
        msg.message_class = "the class"
        msg.delete()
        s = msg.to_json()
        assert s
        print(s)
        msg2 = SystemMessage()
        msg2.from_json(s)

        assert msg2.__dict__ == msg.__dict__
