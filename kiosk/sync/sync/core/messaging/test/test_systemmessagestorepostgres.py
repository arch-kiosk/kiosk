import time, os
from typing import List

import pytest

from messaging.systemmessage import SystemMessage, MSG_SEVERITY_INFO, MSG_SEVERITY_HIGHEST, MSG_SEVERITY_LOWEST
from messaging.systemmessagelist import SystemMessageList, ErrorSystemMessageDeleted
from messaging.systemmessagestore import SystemMessageStore
from messaging.systemmessagestorepostgres import SystemMessageStorePostgres
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestSystemMessageStorePostgres(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture(scope="module")
    def rgs(self, config):
        return self.get_general_store(config)

    @pytest.fixture()
    def sys_messages(self, rgs, config):
        SystemMessageList.release_instance()
        return SystemMessageList(rgs, config.get_project_id())

    def test_init(self, sys_messages, config, db):
        assert sys_messages
        assert config
        assert db
        assert KioskSQLDb.does_table_exist('kiosk_system_message')

    def test_store(self, sys_messages, config, db):

        def load(store: SystemMessageStore):
            for v in store_values:
                msg = SystemMessage(uid=v[0])
                msg.headline = v[1]
                if v[2]:
                    msg.delete()
                store.set_message(msg)

        KioskSQLDb.truncate_table('kiosk_system_message')
        message_store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                           on_store=SystemMessageStorePostgres.store)

        store_values = [("uid1", "headline 1", False), ("uid2", "headline2", False)]
        load(message_store)
        message_store.store()
        self.assert_record_exists('kiosk_system_message', 'uid1', 'nid')
        self.assert_record_exists('kiosk_system_message', 'uid2', 'nid')

        store_values = [("uid1", "headline 1", True), ("uid2", "headline2", True)]
        load(message_store)
        message_store.store()

    def test_load(self, sys_messages, config, db):
        messages: List[SystemMessage] = []

        def load(store: SystemMessageStore):
            messages.clear()
            for v in store_values:
                msg = SystemMessage(uid=v[0])
                time.sleep(.2)
                msg.headline = v[1]
                if v[2]:
                    msg.delete()
                store.set_message(msg)
                messages.append(msg)

        KioskSQLDb.truncate_table('kiosk_system_message')
        message_store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                           on_store=SystemMessageStorePostgres.store)

        store_values = [("uid1", "headline 1", False), ("uid2", "headline2", False)]
        load(message_store)
        message_store.store()
        self.assert_record_exists('kiosk_system_message', 'uid1', 'nid')
        self.assert_record_exists('kiosk_system_message', 'uid2', 'nid')

        new_message_store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                               on_store=SystemMessageStorePostgres.store)
        new_message_store.load()
        loaded_values = [(msg.uid, msg.headline, msg.deleted) for msg in new_message_store.messages]
        loaded_values.sort()
        store_values.sort()
        assert loaded_values == store_values

        store_values = [("uid1", "headline 1", False), ("uid2", "headline2", False)]
        load(message_store)
        message_store.store()
        self.assert_record_exists('kiosk_system_message', 'uid1', 'nid')
        self.assert_record_exists('kiosk_system_message', 'uid2', 'nid')

        store_values = [("uid1", "headline 1", False), ("uid2", "headline2", True)]
        load(message_store)
        message_store.store()

        new_message_store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                               on_store=SystemMessageStorePostgres.store)
        new_message_store.load()
        loaded_values = [(msg.uid, msg.headline, msg.deleted, msg.modified) for msg in new_message_store.messages]
        loaded_values.sort()
        assert loaded_values == [('uid1', 'headline 1', False, messages[0].modified),
                                 ('uid2', 'headline2', True, messages[1].modified)]
        assert messages[0].modified != messages[1].modified

        KioskSQLDb.commit()

    def test_sync(self, sys_messages, config, db):

        def load_list_values(msgs):
            for v in msgs:
                msg = SystemMessage(uid=v[0])
                msg.headline = v[1]
                if v[2]:
                    msg.delete()
                sys_messages.send_message(msg, validate=False)

        KioskSQLDb.truncate_table("kiosk_system_message")
        store_values = [("uid1", "headline 1", False), ("uid2", "headline2", False)]
        message_store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                           on_store=SystemMessageStorePostgres.store)
        sys_messages.assign_store(message_store)
        message_store.load()
        assert len(message_store.messages) == 0

        load_list_values([("uid3", "headline 3", False), ("uid4", "headline4", False)])

        sys_messages.sync(two_way=True)
        message_store.store()
        assert sys_messages.count == 2

        message_store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                           on_store=SystemMessageStorePostgres.store)
        sys_messages.assign_store(message_store)
        message_store.load()

        load_list_values([("uid1", "headline 1", False), ("uid4", "headline4", False)])

        sys_messages.sync(two_way=True)
        message_store.store()
        assert sys_messages.count == 3

        message_store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                           on_store=SystemMessageStorePostgres.store)
        sys_messages.assign_store(message_store)
        message_store.load()
        time.sleep(.5)
        sys_messages.delete_message(uid="uid1")
        assert not sys_messages.get_message("uid1", include_deleted=True).dirty
