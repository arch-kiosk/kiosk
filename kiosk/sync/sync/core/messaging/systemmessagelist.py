from __future__ import annotations

import copy
import logging
import threading

import nanoid

import urapdatetimelib
from generalstore.generalstore import GeneralStore
from generalstore.generalstorekeys import messaging_change_mark
from .systemmessage import SystemMessage
from .systemmessagecatalog import *
from .systemmessagestore import SystemMessageStore


class ErrorSystemMessageDeleted(Exception):
    pass


class ErrorNoMessageStore(Exception):
    pass


class SystemMessageList(object):
    # This is a singleton! Initializations should only happen in __init_singleton__
    # The instance creation of this singleton should be thread-safe.

    __lock = threading.Lock()
    __instance = None
    __instance_id = ""
    _synced = True  # if False, the list needs to be synced
    _last_changed: int = 0
    _store = None

    def __new__(cls, general_store: GeneralStore, project_id: str):
        with cls.__lock:
            if not cls.__instance:
                cls.__instance = super(SystemMessageList, cls).__new__(cls)
                cls.__instance.__init_singleton__(general_store, project_id=project_id)

        return cls.__instance

    def __init__(self, general_store: GeneralStore, project_id: str):
        # don't use init to initialize anything! This is a singleton!
        self._list: dict
        # self._uids: set
        pass

    @classmethod
    def get_instance(cls):
        return cls.__instance

    # noinspection PyAttributeOutsideInit
    def __init_singleton__(self, general_store: GeneralStore, project_id: str):
        self._list = dict()
        # self._uids = set()
        self.__instance_id = nanoid.generate("abcdefg")  # just for testing purposes.
        self._store = None
        self._general_store: GeneralStore = general_store
        self._project_id = project_id

    @property
    def synced(self):
        """
        Is the current message list been synced or are there changes in the list that have not been synced to a store?
        :return:
        """
        return self._synced

    @property
    def change_mark(self) -> int:
        """
        returns a change mark that can be used in a subsequent call to has_changed in order to find out whether
        messages in the local SystemMessageList has changed in comparison to the state of the change mark.
        This is not using the current change mark in the general store!

        :return: a change mark
        """
        return self._last_changed

    @property
    def general_change_mark(self) -> int:
        """
        returns the current change mark stored in the general store.

        :return: a change mark
        """
        try:
            return self._general_store.get_int("#".join([messaging_change_mark, self._project_id]))
        except KeyError:
            return 0

    @property
    def count(self) -> int:
        """
        returns the number of messages in the list that are NOT deleted.
        :return: int
        """
        return len([1 for msg in self._list.values() if not msg.deleted])

    @property
    def count_deleted(self) -> int:
        """
        returns the number of messages in the list that are deleted.
        :return: int
        """
        return len([1 for msg in self._list.values() if msg.deleted])

    def reset_general_change_mark(self) -> int:
        """
        resets the change mark in the general store. Only for testing purposes.
        :return: 0
        """
        self._general_store.put_int("#".join([messaging_change_mark, self._project_id]), 0)
        return 0

    def _new_general_change_mark(self) -> int:
        """
        creates and returns a new change mark in the general store
        :return: a change mark
        """
        return self._general_store.inc_int("#".join([messaging_change_mark, self._project_id]))

    def trigger_change(self, lock) -> int:
        """
        syncs the local messages with the store and returns the resulting change mark.
        This also synchronizes the local change mark and that in the general store.
        :param lock: if trigger_change runs within a lock set this to False, otherwise it should be True.
        """
        self._synced = False
        self.sync(lock=lock)
        logging.debug(f"{self.__class__.__name__}.trigger_change: new change mark {self.change_mark}")
        return self.change_mark

    def has_changed(self, change_mark: int) -> bool:
        """
        compares a change mark with the current instance and returns True if a change has occurred since then.
        Currently, this is based on a timestamp, so if given a newer change mark this method returns False.
        This is using the local change mark and not the one stored in the general store.

        :param change_mark: a change mark acquired by a call to change_mark.
        :return: True or False.
        """
        return change_mark < self.general_change_mark

    @classmethod
    def release_instance(cls):
        """
        For testing purposes. Helps to reset the singleton between tests.
        """
        cls.__instance = None

    def assign_store(self, store: SystemMessageStore):
        """
        assigns the SystemMessageStore to sync with. Needs to be assigned as soon as available
        :param store: some SystemMessageStore based object
        """
        self._store = store

    def send_message(self, message: SystemMessage, trigger_update: bool = True, validate=True, lock=True):
        """
        queues a message in the message list unless a message with that uid is already in the list.

        :param message: a SystemMessage.
        :param trigger_update: if set to False the message's update method will not be called. Default is True.
        :param lock: used internally by class to make sure that a lock is not used within a lock.
        :param validate: if set to False the message won't be validated first.
        :return: True if successful (which includes that there was already a message in the list with that uid)
        """

        # ****************************************************
        def __send_message():
            # if message.uid in self._list.keys():
            #     return True

            if trigger_update:
                message.update()

            # self._uids.add(message.uid)
            self._list[message.uid] = message
            self.trigger_change(lock=False)
            logging.debug(f"SystemMessageList.{self.__class__.__name__}.send_message: queued {message.headline}")

            return True

        # ****************************************************

        if validate:
            s = message.validate()
            if s:
                raise ValueError(f"SystemMessageList.{self.__class__.__name__}.send_message: Message is invalid: {s}")

        logging.debug(f"SystemMessageList({self.__instance_id}).{self.__class__.__name__}.send_message: "
                      f"about to send {message.headline}")

        if lock:
            with self.__lock:
                return __send_message()
        else:
            return __send_message()

    def delete_message(self, uid, for_good=False, lock=True, trigger_update=True):
        """
        deletes a message from the list by marking it as "deleted"
        :param uid:
        :param trigger_update: if set to False the message's update method will not be called. Default is True.
        :param lock: used internally by class to make sure that a lock is not used within a lock.
        :param for_good:
        """

        # ****************************************************
        def __delete():
            try:
                msg = self._get_message(uid, include_deleted=True)

                if msg.deleted and for_good:
                    # self._uids.discard(uid)
                    self._list.pop(uid)

                msg.delete(trigger_update=trigger_update)
                self.trigger_change(lock=False)
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.delete_message: {repr(e)}")
                raise e

        # ****************************************************

        if lock:
            with self.__lock:
                __delete()
        else:
            __delete()

    def get_message(self, uid, include_deleted=False) -> SystemMessage:
        """
        returns a copy of a system message in the list if it exists.
        :param include_deleted: get a message even if it is marked deleted.
        :param uid: the uid of the requested system message
        :return: the system message
        :raises: KeyError if the uid is unknown (or the message was deleted) or other Exceptions
        """
        with self.__lock:
            result = self._get_message(uid, include_deleted)
            if result:
                return SystemMessage(msg=result)

    def _get_message(self, uid, include_deleted=False):
        """
        returns a system message (not a copy) in the list if it exists.

        note:  This private method is not thread safe!
               It is supposed to be called from a method that itself cares for the lock.

        :param include_deleted: get a message even if it is marked deleted.
        :param uid: the uid of the requested system message
        :return: the system message
        :raises: KeyError if the uid is unknown
                 ErrorSystemMessageDeleted if the message is deleted
        """
        msg = self._list[uid]
        if msg.deleted and not include_deleted:
            raise ErrorSystemMessageDeleted(f"Message {msg.uid} was deleted.")
        return msg

    def get_messages(self, up_to_severity=MSG_SEVERITY_INFO, filter_func: callable = None) -> SystemMessages:
        """
        returns a SystemMessages instance with local copies of all messages.
        :param up_to_severity: messages with a severity greater or equal this one are returned
        :param filter_func: a callback function that takes a message and returns True if the message should be included.
        :returns: a SystemMessages instance that can be used for further analysis and browsing through the messages.
                  The SystemMessages instance holds only copies of the messages to keep SystemMessagesList Thread-safe.
        """

        # ****************************************************
        def _fetch_messages():
            for uid in uids:
                # noinspection PyBroadException
                try:
                    msg = self.get_message(uid)
                except Exception:
                    msg = None

                if msg and msg.severity >= up_to_severity:
                    if not filter_func or filter_func(msg):
                        yield msg

        # ****************************************************

        if self.general_change_mark > self.change_mark:
            self.sync(two_way=True)

        uids = set(self._list.keys())

        return SystemMessages(list(_fetch_messages()))

    def sync(self, two_way: bool = False, lock=True):
        """
        synchronizes the local message list with the message list in the store

        :param two_way: if true the messages in the store will be synchronized into the local messages list as well.
        :param lock: sync locks the message queue unless lock is set to False explicitly.
        """

        def _sync():
            self._store.load()
            records_to_store = self._sync_to_store(self._store)
            if two_way:
                records_from_store = self._sync_from_store(self._store)
            else:
                records_from_store = 0

            if records_to_store > 0:
                self._store.store()
                self._last_changed = self._new_general_change_mark()
                logging.debug(f"{self.__class__.__name__}.sync: {records_to_store} changes were made to the store: "
                              f"new change mark {self._last_changed}")
            else:
                if records_from_store > 0:
                    self._last_changed = self.general_change_mark
            self._synced = True

        if not self._store:
            raise ErrorNoMessageStore("SystemMessageList.sync called without a store assigned.")
        if lock:
            with self.__lock:
                _sync()
        else:
            _sync()

    def _sync_to_store(self, store: SystemMessageStore) -> int:
        """
        syncs the local messages into the store
        :param store: the store
        :return number of changes made to the store
        """
        changes = 0
        for msg in self._list.values():
            msg: SystemMessage
            if msg.dirty:
                deletion_status, store_msg_timestamp, store_modified = store.get_message_status(msg.uid)
                replace_it = False
                if deletion_status == 0:  # message does not exist in store
                    replace_it = True
                else:
                    if msg.modified > store_modified:  # message in local list is newer, so replace it
                        replace_it = True
                if replace_it:
                    store.set_message(msg)
                    changes += 1
        if changes:
            logging.debug(f"{self.__class__.__name__}._sync_to_store: {changes} changes made to store.")
        return changes

    def _sync_from_store(self, store: SystemMessageStore):
        changes = 0
        for msg in store.messages:
            try:
                list_msg = self._list[msg.uid]
            except KeyError:
                list_msg = None

            if list_msg:
                if msg.modified > list_msg.modified:
                    if msg.deleted:
                        self._list.pop(msg.uid)
                        # logging.debug(f"{self.__class__.__name__}.sync: msg {msg.uid} deleted due to store.")
                    else:
                        self._list[msg.uid] = SystemMessage(msg=msg)
                    changes += 1
            else:
                # message does not exist locally
                # logging.debug(f"{self.__class__.__name__}.sync: msg {msg.uid} does not exist locally.")
                if not msg.deleted:
                    self.send_message(msg, trigger_update=False, validate=False, lock=False)
                    changes += 1

        if changes:
            logging.debug(f"{self.__class__.__name__}._sync_from_store: {changes} changes imported from store.")
        return changes


# ********************************************************************************************************************

class SystemMessageCount:
    def __init__(self):
        self.relevant: int
        self.appears: int
        self.severity: {}
        self.reset()

    # noinspection PyAttributeOutsideInit
    def reset(self):
        self.relevant = 0
        self.appears = 0
        self.severity = {}
        for i in range(MSG_SEVERITY_LOWEST, MSG_SEVERITY_HIGHEST + 1):
            self.severity[i] = 0


# ********************************************************************************************************************

class SystemMessages:
    """
        The result class for messages. This is meant to be the thread-local list being used to query
        and sort messages according to current needs.
    """
    _user_groups = []
    MSG_RELEVANCE_NONE = 0
    MSG_RELEVANCE_COUNT = 1
    MSG_RELEVANCE_SHOW = 2

    def __init__(self, messages: list):
        self._messages = messages
        self._dirty = True  # dirty leads to recalculating the relevance values
        self._relevance = {}
        self._group_threshold = 0
        self._user_threshold = 0
        self._user_id = ""
        self._relevant_messages: int = 0
        self._appearing_messages: int = 0

    @property
    def user_id(self):
        return self._user_id

    @user_id.setter
    def user_id(self, value):
        self._user_id = value
        self._dirty = True

    @property
    def appearing_messages(self) -> int:
        self.recalc()
        return self._appearing_messages

    @property
    def relevant_messages(self) -> int:
        self.recalc()
        return self._relevant_messages

    def set_user_information(self, user_groups: list, user_id: str):
        """
        sets the filter information from the current user
        :param user_groups: list. the user's groups
        :param user_id: str. The user's id (not the uuid!)
        """
        self._user_groups = copy.copy(user_groups)
        self._user_id = user_id
        self._dirty = True

    def set_thresholds(self, group_threshold, user_threshold=MSG_SEVERITY_INFO):
        """
        defines the threshold filter information.
        :param group_threshold: the group threshold
        :param user_threshold: the threshold for user messages.
        """
        self._group_threshold = group_threshold
        self._user_threshold = user_threshold
        self._dirty = True

    def recalc(self, if_dirty=True) -> None:
        """
        :param if_dirty: Set to false if you want to recalc notwithstanding if it is necessary
        """
        if not if_dirty or self._dirty:
            self._appearing_messages = 0
            self._relevant_messages = 0
            for msg in self._messages:
                self._calc_relevance(msg)

            self._dirty = False

    def _calc_relevance(self, msg: SystemMessage):
        self._relevance[msg.uid] = self.MSG_RELEVANCE_NONE

        if msg.addressee_is_user:
            if self._user_id == msg.addressee and msg.severity >= self._user_threshold:
                self._relevance[msg.uid] = self.MSG_RELEVANCE_SHOW
                self._relevant_messages += 1
                self._appearing_messages += 1

        else:
            if msg.severity >= self._group_threshold:
                self._relevance[msg.uid] = self.MSG_RELEVANCE_COUNT
                self._relevant_messages += 1

                if msg.addressee == "*" or msg.addressee in self._user_groups:
                    self._relevance[msg.uid] = self.MSG_RELEVANCE_SHOW
                    self._appearing_messages += 1

    def messages(self):
        """
        a generator. Returns the available messages slice by slice.
        """
        self.recalc()
        for msg in self._messages:
            if self.get_relevance(msg=msg):
                yield msg

    def all_messages(self) -> list:
        """
        Returns a list of all messages.
        """
        return self._messages

    def get_relevance(self, uid=None, msg: SystemMessage = None) -> int:
        """
        returns the relevance of a message stored in the list of messages.

        :param uid: optional. If given this is used to find the message.
        :param msg: optional. If uid is not given, the uid of this message is used to find the message in the list.
        :return: the relevance of the message
        """
        if not uid and not msg:
            raise Exception(f"get_relevance needs either a msg or a uid")

        self.recalc()
        if not uid:
            uid = msg.uid
        try:
            return self._relevance[uid]
        except KeyError:
            raise Exception(f"No relevance value for message {msg} / value {uid}")

    def count_relevant_messages(self):
        """
        counts the relevant messages. Returns separate counts of relevant messages and messages that need
        showing. Make sure to have set the user_groups first, otherwise more or less everything is relevant.

        :return: a SystemMessageCount object with an analysis of the message counts
        """
        self.recalc()
        result = SystemMessageCount()
        for msg in self._messages:
            if self._relevance[msg.uid] > self.MSG_RELEVANCE_NONE:
                result.relevant += 1
                result.severity[msg.severity] += 1
                if self._relevance[msg.uid] == self.MSG_RELEVANCE_SHOW:
                    result.appears += 1

        return result


# -------------------------------------------------------------
# a little heper function to init the system message list
# -------------------------------------------------------------
def init_system_message_list(gs, cfg, sync_immediately=True) -> SystemMessageList:
    """
    initializes the system message list singleton and returns the instance
    :param gs:
    :param cfg:
    :param sync_immediately:
    :return: SystemMessageList
    """
    try:
        from messaging.systemmessagestore import SystemMessageStore
        from messaging.systemmessagestorepostgres import SystemMessageStorePostgres
        import os

        if not cfg:
            logging.debug(f"PID({os.getpid()}).store_system_message_list: no config.")

        message_list = SystemMessageList(general_store=gs, project_id=cfg.get_project_id())

        store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                   on_store=SystemMessageStorePostgres.store)
        message_list.assign_store(store)
        if sync_immediately:
            message_list.sync(two_way=True)
        logging.debug(f"PID({os.getpid()})/init_system_message_list: system messaging initialized.")
        return message_list
    except BaseException as e:
        logging.error(f"PID({os.getpid()})/init_system_message_list: Exception {repr(e)}")
