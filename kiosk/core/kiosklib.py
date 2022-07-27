import datetime
from functools import wraps, update_wrapper
from typing import Optional

from flask import request, make_response

import kioskstdlib
from sync_config import SyncConfig
from kioskconfig import KioskConfig
from kioskstdlib import now_as_str
from messaging.systemmessage import SystemMessage
from messaging.systemmessagelist import SystemMessageList
from messaging.systemmessagecatalog import *
from flask_login import current_user

import logging


class UserError(Exception):
    pass


def is_ajax_request():
    return "X-Requested-With" in request.headers and request.headers["X-Requested-With"] == "XMLHttpRequest"


def is_local_server(cfg):
    try:
        if cfg.config["server_type"] == 'local':
            return True
    except:
        pass
    return False


def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    return update_wrapper(no_cache, view)


def write_reset_file(config: KioskConfig):
    reset_file = config.get_reset_file()
    if reset_file:
        with open(reset_file, "a") as file_object:
            file_object.write(now_as_str() + "\n")
        logging.info(f"written to reset_file {reset_file}.")


def dispatch_system_message(headline: str,
                            message_id: str,
                            severity: int = MSG_SEVERITY_LOWEST - 1,
                            body: str = "",
                            addressee: str = "*",
                            sender="system",
                            dont_log=False, project_id=None):
    """
        dispatches a system error to the system message list.
        Just a convenience method that sets a few default values.

        This sends a message to either a group or everybody. So make sure
        not to use a user as addressee. Use dispatch_user_message for that.

    :param headline: mandatory headline
    :param message_id: mandatory message id (use a constant from systemmessagecatalog.py
    :param severity: optional. If not set the message-id determines what severity to use.
    :param body: optional.
    :param addressee: optional (everybody if not set). Do not use a user-id here.
    :param sender: optional "sender" if not set.
    :param dont_log: set to True if you don't want this to end up in the log files.
    :param project_id: optional. If not given it will be retrieved from the config file.
    """
    config = KioskConfig.get_config()
    try:
        if "suppress_messages" in config.kiosk:
            if kioskstdlib.to_bool(config.kiosk["suppress_messages"][message_id]):
                return
    except KeyError as e:
        pass
        # logging.debug(f"kiosklib.dispatch_system_message: "
        #               f"Key missing when checking if system message {message_id} should be suppressed: {repr(e)}")
    except BaseException as e:
        logging.error(f"kiosklib.dispatch_system_message: "
                      f"Error when checking if system message {message_id} should be suppressed: {repr(e)}")

    message = SystemMessage(message_id=message_id)
    try:
        if severity == MSG_SEVERITY_LOWEST - 1:
            severity = SYS_MSG_ID_DETAILS[message_id][1]

    except BaseException as e:
        logging.error(f"kiosklib.dispatch_system_message: "
                      f"Presumably message id {message_id} is not properly defined: {repr(e)}")
        message.message_class = SYS_MSG_CLASS_ERROR
        if severity == MSG_SEVERITY_LOWEST - 1:
            severity = MSG_SEVERITY_ERROR

    message.severity = severity
    message.sender = sender
    if project_id:
        message.project = project_id
    else:
        try:
            cfg = SyncConfig.get_config()
            message.project = cfg.get_project_id()
        except BaseException as e:
            logging.error(f"kiosklib.dispatch_system_message: "
                          f"project id cannot be retrieved from config: {repr(e)}")

    message.headline = headline
    message.body = body
    message.set_addressee(addressee)

    if not dont_log:
        log_msg = f"{message.sender}: {message.headline}"
        if severity >= MSG_SEVERITY_ERROR:
            logging.error(log_msg)
        elif severity >= MSG_SEVERITY_INFO:
            logging.info(log_msg)
        elif severity >= MSG_SEVERITY_WARNING:
            logging.warning(log_msg)
        else:
            logging.debug(log_msg)

    system_messages = SystemMessageList.get_instance()
    if not system_messages:
        logging.error(f"kiosklib.dispatch_system_message: system_messages not initialized")
    else:
        try:
            system_messages.send_message(message)
        except BaseException as e:
            logging.error(f"kiosklib.dispatch_system_message: {repr(e)}")


def dispatch_user_message(headline: str,
                          message_id: str,
                          user_id: str = "",
                          severity: int = MSG_SEVERITY_LOWEST - 1,
                          body: str = "",
                          sender="system",
                          dont_log=False):
    """
        dispatches a system message to a user. Usually the current user.
        Just a convenience method that sets a few default values.

    :param headline: mandatory headline
    :param message_id: mandatory message id (use a constant from systemmessagecatalog.py
    :param user_id: optional user-id (not the uuid). if not set the current user will be used.
    :param severity: optional. If not set the message-id determines what severity to use.
    :param body: optional.
    :param sender: optional "sender" if not set.
    :param dont_log: set to True if you don't want this to end up in the log files.
    """
    config = KioskConfig.get_config()
    message = SystemMessage(message_id=message_id)
    try:
        message.message_class = SYS_MSG_ID_DETAILS[message_id][0]
        if severity == MSG_SEVERITY_LOWEST - 1:
            severity = SYS_MSG_ID_DETAILS[message_id][1]

    except BaseException as e:
        logging.error(f"kiosklib.dispatch_system_message: "
                      f"Presumably message id {message_id} is not properly defined: {repr(e)}")
        message.message_class = SYS_MSG_CLASS_ERROR
        if severity == MSG_SEVERITY_LOWEST - 1:
            severity = MSG_SEVERITY_ERROR

    message.severity = severity
    message.sender = sender
    try:
        message.project = config.get_project_id()
    except BaseException as e:
        logging.error(f"kiosklib.dispatch_system_message: "
                      f"project id cannot be retrieved from config: {repr(e)}")

    message.headline = headline
    message.body = body

    if not user_id:
        try:
            user_id = current_user.user_id
        except:
            pass
    if not user_id:
        raise Exception("kiosklib.dispatch_user_message called without a user_id")

    if not dont_log:
        log_msg = f"{message.sender}: {message.headline}"
        if severity >= MSG_SEVERITY_ERROR:
            logging.error(log_msg)
        elif severity >= MSG_SEVERITY_INFO:
            logging.info(log_msg)
        elif severity >= MSG_SEVERITY_WARNING:
            logging.warning(log_msg)
        else:
            logging.debug(log_msg)

    message.set_addressee(user_id, is_user=True)
    system_messages = SystemMessageList.get_instance()
    try:
        system_messages.send_message(message)
    except BaseException as e:
        logging.error(f"kiosklib.dispatch_user_message: {repr(e)}")


def run_quality_control(data_context: Optional[str] = None) -> None:
    """
    just a bridge to qualitycontrol.qualitycontrol.run_quality_control which you can also simply call
    directly.
    """
    from qualitycontrol.qualitycontrol import run_quality_control as _run_quality_control
    _run_quality_control(data_context)
