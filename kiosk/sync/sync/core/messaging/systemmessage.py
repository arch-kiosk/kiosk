from __future__ import annotations

import datetime
import nanoid
import json
from urapdatetimelib import local_datetime_to_utc, utc_to_local_datetime
from .systemmessagecatalog import *


class SystemMessage:
    # noinspection PyTypeChecker
    def __init__(self, uid=None, message_id="", msg: SystemMessage = None):
        self.sender = ""
        self.headline = ""
        self._message_id = ""
        self.body = ""
        self.utc_timestamp: datetime.datetime = datetime.datetime.now(datetime.timezone.utc)
        self.project = ""
        self._dirty = False
        self._addressee = "*"
        self._addressee_is_user = False
        self.message_class = ""
        self.severity = MSG_SEVERITY_LOWEST
        self.auto_delete = -1
        self._deleted = False
        self._uid = uid
        self._modified = datetime.datetime.now()
        if msg:
            self.init_from_message(msg)
        if not self._message_id and message_id:
            self.message_id = message_id

    def init_from_message(self, msg: SystemMessage):
        self._uid = msg.uid
        self.sender = msg.sender
        self.headline = msg.headline
        self.body = msg.body
        self.utc_timestamp = msg.utc_timestamp
        self.project = msg.project
        self._message_id = msg.message_id
        self._dirty = msg._dirty
        self.set_addressee(msg.addressee, msg._addressee_is_user)
        self.message_class = msg.message_class
        self.severity = msg.severity
        self.auto_delete = msg.auto_delete
        self._deleted = msg._deleted
        self._modified = msg._modified

    @property
    def uid(self):
        if not self._uid:
            self._uid = nanoid.generate()
        return self._uid

    @property
    def dirty(self):
        return self._dirty

    @property
    def deleted(self):
        return self._deleted

    @property
    def message_id(self):
        return self._message_id

    @message_id.setter
    def message_id(self, value):
        if SYS_MSG_ID_DETAILS[value][2] == SYS_MSG_LONER:
            if self._uid and self._uid != value:
                raise ValueError(f"The message id of message {self._uid} cannot be changed at this point "
                                 f"because it would change the uid.")
            else:
                self._uid = value
        else:
            # if the former message_id was a LONER changing it would have to change an existing uid
            if self._message_id and self._uid == self._message_id:
                raise ValueError(f"The message id of message {self._uid} cannot be changed at this point "
                                 f"because it would change the uid.")
        self._message_id = value
        self.message_class = SYS_MSG_ID_DETAILS[self._message_id][0]

    def delete(self, trigger_update=True):
        self._deleted = True
        if trigger_update:
            self.update()

    @property
    def timestamp(self):
        if self.utc_timestamp:
            return utc_to_local_datetime(self.utc_timestamp)
        else:
            return None

    @property
    def modified(self):
        return self._modified

    def set_modified(self, timestamp=None) -> datetime.datetime:
        """
        sets the modification timestamp of this message
        :param timestamp: if given, this timestamp is being used.
                          Otherwise the current time
        :return: datetime.datetime
        """
        if not timestamp:
            timestamp = datetime.datetime.now()
        self._modified = timestamp

        return self._modified

    @property
    def format_time(self):
        return datetime.datetime.strftime(self.timestamp, "%d. %b %H:%M:%S")

    @timestamp.setter
    def timestamp(self, value: datetime.datetime):
        self.utc_timestamp = local_datetime_to_utc(value)

    @property
    def addressee(self):
        return self._addressee

    @property
    def addressee_is_user(self):
        return self._addressee_is_user

    @property
    def severity_class(self):
        """
            returns a css classname depending on the severity of the messages.
            can return an empty string
        """
        if self.severity >= MSG_SEVERITY_ERROR:
            return "severity-error"
        elif self.severity >= MSG_SEVERITY_WARNING:
            return "severity-warning"
        elif self.severity >= MSG_SEVERITY_INFO:
            return "severity-info"

        return ""

    def set_addressee(self, addressee, is_user=False):
        self._addressee_is_user = is_user
        if addressee == "":
            self._addressee = "*"
            self._addressee_is_user = False
        else:
            self._addressee = addressee

    def validate(self) -> str:
        """
        validates the message.
        :return: a validation message if the message is not valid. Otherwise an empty
                    string indicates the message is valid.
        """
        if not self.uid:
            return "message has no uid"

        if not self.message_id:
            return f"message {self.uid} has no message id"

        if not self.headline:
            return f"message {self.uid} has no headline"

        if not self.sender:
            return f"message {self.uid} has no sender"

        if not self.addressee:
            self.set_addressee("*")

        # if self.addressee != '*' and self._message_id and SYS_MSG_ID_DETAILS[self._message_id][2] == SYS_MSG_LONER:
        #     return f"Loner message {self.uid} has an address. Loners can only be addressed to everybody."

        return ""

    def update(self):
        """
        needs to be called whenever an attribute of the instance is changed and the instance needs to be
        saved by the MessageStore.
        """
        self.set_modified()
        self._dirty = True

    def stored(self):
        """
        Called by a storage class that made sure that the current message state has been saved.
        """
        self._dirty = False

    def to_json(self):
        d = dict()
        for attr in self.__dict__.keys():
            v = self.__dict__[attr]
            if not callable(v):
                if isinstance(v, datetime.datetime):
                    dt: datetime.datetime = v
                    d[attr] = dt.isoformat()
                else:
                    d[attr] = self.__dict__[attr]
        return d

    def from_json(self, json_param):
        if isinstance(json_param, str):
            d: dict = json.loads(json_param)
        elif isinstance(json_param, dict):
            d: dict = json_param
        else:
            raise ValueError(f"{self.__class__.__name__}.from_json: input type must be a json string or a dict.")

        self._uid = d["_uid"]
        self.sender = d["sender"]
        self.headline = d["headline"]
        self.body = d["body"]
        self.project = d["project"]
        self._message_id = d["_message_id"]
        self._dirty = d["_dirty"]
        self.set_addressee(d["_addressee"], d["_addressee_is_user"])
        self.message_class = d["message_class"]
        self.severity = d["severity"]
        self.auto_delete = d["auto_delete"]
        self._deleted = d["_deleted"]
        try:
            self._modified = datetime.datetime.fromisoformat(d["_modified"])
        except:
            # legacy issue: Older messages in the database sometimes are without _modified.
            self._modified = datetime.datetime.fromisoformat(d["utc_timestamp"])
        self.utc_timestamp = datetime.datetime.fromisoformat(d["utc_timestamp"])
