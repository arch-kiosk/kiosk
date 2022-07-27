import datetime

from typing import Dict, List

from .systemmessage import SystemMessage


class SystemMessageStore:
    def __init__(self, on_store: callable, on_load: callable, on_clear: callable = None):
        self._messages: dict = {}
        self._dirty = False
        self._on_store = on_store
        self._on_load = on_load
        self._on_clear = on_clear

    @property
    def messages(self) -> List[SystemMessage]:
        return self._messages.values()

    def get_message_status(self, uid: str) -> (int, datetime.datetime):
        """
        checks if a message exists in the store and what it's deletion status is
        :param uid: the uid of the message
        :return: a triplet (deletion_status, creation timestamp, modification timestamp ) with
                    deletion_status: int: -1 for a deleted message,
                                          0 if a message does not exist and
                                          1 if it does and is not deleted.
                    timestamp: the utc_timestamp of the message. Can be None!
                    modified: the utc_timestamp of the last modification. Never None!
        """
        if uid in self._messages:
            message: SystemMessage = self._messages[uid]
            if message.deleted:
                return -1, message.utc_timestamp, message.modified
            else:
                return 1, message.utc_timestamp, message.modified
        return 0, None, None

    def load(self):
        self._load()
        self._dirty = False

    def _load(self):
        self._on_load(self)

    def store(self):
        if self._dirty:
            self._store()
            self._dirty = False

    def _store(self):
        self._on_store(self)

    def set_message(self, message: SystemMessage):
        self._messages[message.uid] = message
        self._dirty = True

    def clear(self):
        if self._on_clear:
            self._on_clear(self)
            self._messages = {}
        else:
            raise Exception("call to SystemMessageStore.clear without a clear delegate assigned.")



