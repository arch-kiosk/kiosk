import logging
import os
from concurrent.futures.thread import ThreadPoolExecutor
from typing import Union

import kioskstdlib
from messaging.systemmessagelist import SystemMessageList
from urlforjavascript import UrlForPublisher
from scriptmanager import ScriptManager
from flask_login import LoginManager
from typerepository import TypeRepository
from generalstore.generalstore import GeneralStore
from generalstore.generalstorekeys import gs_key_kiosk_init_counter
# from itsdangerous import URLSafeTimedSerializer as JWS
from kioskjwt import KioskJWT
from flask_httpauth import HTTPTokenAuth
from uic.uictree import UICTree
from uic.uicstream import UICStream, UICKioskFile

import datetime
import threading

kiosk_version = "1.5.35"
kiosk_version_name = "slippery search"
kiosk_date = datetime.datetime(2024, 5, 12)
debug = False
development = {}

httpauth = HTTPTokenAuth(scheme="Bearer")

flask_admin = None
logger = None
system_messages: Union[SystemMessageList, None] = None

root_path = ""
cfg = None
master_view = None
kiosk_thread = None
menu = []
url_for_publisher = UrlForPublisher()
script_manager = ScriptManager()
login_manager = LoginManager()
type_repository = TypeRepository()
csrf = None
api = None

# noinspection PyTypeChecker
general_store: GeneralStore = None

# noinspection PyTypeChecker
worker_pool: ThreadPoolExecutor = None

auto_start_objects = []
identifier_cache = None
current_log_file = "unknown"
init_counter = 0
jws = None

uic_tree = None


def get_global_constants():
    """
        returns globally available constants like the project name or its shortcut.
        Used in templates.

    :return: dict
    :todo resolve symbols in global constants before returning?
    """

    return cfg.kiosk["global_constants"]


def get_system_wide_init_counter() -> int:
    """
    returns the system-wide (general store) initialization counter
    :return: int
    """
    try:
        return general_store.get_int(gs_key_kiosk_init_counter)
    except KeyError:
        return 0


def inc_system_wide_init_counter() -> int:
    """
    increases the system-wide (general store) initialization counter
    :return: int
    """
    try:
        return general_store.inc_int(gs_key_kiosk_init_counter)
    except KeyError as e:
        general_store.put_int(gs_key_kiosk_init_counter, 1)
        return 1


def get_config():
    """
    returns the current kiosk configuration
    :return: KioskConfig
    """
    global cfg

    if not cfg:
        from kioskconfig import KioskConfig
        cfg = KioskConfig.get_config()
    return cfg


def get_general_store():
    return general_store


def get_jws() -> KioskJWT:
    """
    returns an instantiated TimedJSONWebSignatureSerializer from itsdangerous.
    Tokens created with this instance do not use timeouts!
    :return: a TimedJSONWebSignatureSerializer (aka JWS) instance
    """
    global jws

    if not jws:
        jws = KioskJWT(get_config().kiosk["SECRET_KEY"])

    return jws


def get_development_option(key: str) -> str:
    """
    returns a setting from the kiosk-config in the section "development"
    :param key: a key under "development"
    :return: the contents of that key or and empty string
    """
    try:
        v = development[key]
        return str(v)
    except:
        return ""


def is_development_system() -> bool:
    """
    checks if the config key "development\development_system" is set to True
    :return:
    """
    return kioskstdlib.to_bool(get_development_option("development_system"))


def get_uic_tree() -> UICTree:
    global uic_tree
    try:
        if not uic_tree:
            uic_stream = UICStream(UICKioskFile.get_file_stream("kiosk_ui_classes.uic"),
                                   get_import_stream=UICKioskFile.get_file_stream)
            uic_tree = uic_stream.tree
    except BaseException as e:
        logging.error(f"kioskglobals.get_uic_tree: {repr(e)}")

    return uic_tree
