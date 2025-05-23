import datetime
import datetime
import json
import logging
import os
import sys
import threading
import time
from inspect import signature

from pprint import pprint
from typing import Callable, Union

import yaml

import kioskstdlib
from concurrent.futures.thread import ThreadPoolExecutor
from threading import current_thread
from werkzeug.exceptions import HTTPException

# ##########
# necessary due to a werkzeug bug:
# https://github.com/jarus/flask-testing/issues/143
import werkzeug
from flask_cors import CORS
from werkzeug.exceptions import InternalServerError

from eventmanager import EventManager
from fts.kioskfulltextsearch import FTS
from kioskuser import KioskUser
from messaging.systemmessagecatalog import SYS_MSG_ID_STORE_NOT_READY, MSG_SEVERITY_INFO, \
    SYS_MSG_ID_CHECKUP_EXCEPTION, SYS_MSG_ID_ADMIN_CREATED, SYS_MSG_ID_ADMIN_GROUP_CREATED, \
    SYS_MSG_ID_MIGRATION_FAILED, SYS_MSG_ID_REBUILD_FIC_FAILED, SYS_MSG_ID_TEMP_DIR_MISSING, \
    SYS_MSG_ID_DEVELOPMENT_ENVIRONMENT_ACTIVE, SYS_MSG_ID_MCP_NOT_UP, SYS_MSG_ID_DEVELOPMENT_GENERATE_SYSTEM_MESSAGE, \
    SYS_MSG_ID_PATCH_SUCCESSFUL, SYS_MSG_ID_PATCH_FAILED, SYS_MSG_ID_GS_WITH_ID, SYS_MSG_ID_DEFAULT_PRIVILEGES
from messaging.systemmessagelist import SystemMessageList
from messaging.systemmessagestore import SystemMessageStore
from messaging.systemmessagestorepostgres import SystemMessageStorePostgres
from synchronization import Synchronization
import datetime
import datetime
import json
import logging
import os
import sys
import threading
import time
from inspect import signature

from pprint import pprint
from typing import Callable, Union

import yaml

import kioskstdlib
from concurrent.futures.thread import ThreadPoolExecutor
from threading import current_thread
from werkzeug.exceptions import HTTPException

# ##########
# necessary due to a werkzeug bug:
# https://github.com/jarus/flask-testing/issues/143
import werkzeug
from flask_cors import CORS
from werkzeug.exceptions import InternalServerError

from eventmanager import EventManager
from fts.kioskfulltextsearch import FTS
from kioskuser import KioskUser
from messaging.systemmessagecatalog import SYS_MSG_ID_STORE_NOT_READY, MSG_SEVERITY_INFO, \
    SYS_MSG_ID_CHECKUP_EXCEPTION, SYS_MSG_ID_ADMIN_CREATED, SYS_MSG_ID_ADMIN_GROUP_CREATED, \
    SYS_MSG_ID_MIGRATION_FAILED, SYS_MSG_ID_REBUILD_FIC_FAILED, SYS_MSG_ID_TEMP_DIR_MISSING, \
    SYS_MSG_ID_DEVELOPMENT_ENVIRONMENT_ACTIVE, SYS_MSG_ID_MCP_NOT_UP, SYS_MSG_ID_DEVELOPMENT_GENERATE_SYSTEM_MESSAGE, \
    SYS_MSG_ID_PATCH_SUCCESSFUL, SYS_MSG_ID_PATCH_FAILED, SYS_MSG_ID_GS_WITH_ID
from messaging.systemmessagelist import SystemMessageList
from messaging.systemmessagestore import SystemMessageStore
from messaging.systemmessagestorepostgres import SystemMessageStorePostgres
from synchronization import Synchronization

werkzeug.cached_property = werkzeug.utils.cached_property
# ##########

from appfactory import AppFactory
from flask import redirect, url_for, request, jsonify, abort, render_template, g, Blueprint
from flask.helpers import send_from_directory
from flask_admin import Admin
from flaskapppluginmanager import FlaskAppPluginManager
from pluggableflaskapp import PluggableFlaskApp, current_app

import kioskglobals
import kiosksqlalchemy
from authorization import full_login_required, USER_GROUP_ADMINS, DEFAULT_PRIVILEGES
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from dsd.dsdyamlloader import DSDYamlLoader
from initkiosk import basic_initialization, init_app_related_stuff
from kioskconfig import KioskConfig
from kiosklib import is_ajax_request, dispatch_system_message, dispatch_user_message, is_local_server
from mcpinterface.mcpjob import MCPJob, is_mcp_job
from mcpinterface.mcpqueue import assert_mcp
from mcpinterface.mcpconstants import *

from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
# from sync.core.threadedjobmanagement.kioskthreadedjobmanager import KioskThreadedJob
from syncrepositorytypes import TYPE_GENERALSTORE, TYPE_AUTOSTART_THREAD
from kiosksqldb import KioskSQLDb
from fileidentifiercache import FileIdentifierCache

from api import register_api as register_kiosk_apis


class NotModified(HTTPException):
    code = 304
    description = '<p>The requested resource has not been modified.</p>'


class KioskAppFactory(AppFactory):
    cfg: KioskConfig = None

    @classmethod
    def _is_plugin_active(cls, plugin_name):
        try:
            cls.cfg: KioskConfig
            if cls.cfg:
                if plugin_name in cls.cfg.kiosk:
                    if "active" in cls.cfg.kiosk[plugin_name]:
                        return cls.cfg.kiosk[plugin_name]["active"]
                else:
                    if plugin_name in cls.cfg.autoload_plugins:
                        return True
        except Exception as e:
            print(f"Kiosk Plugin {plugin_name} cannot be activated due to exception {repr(e)}")

        return False

    @classmethod
    def init_logging(cls):
        # This is to suppress Werkzeug log entries.
        werkzeug_logger = logging.getLogger('werkzeug')
        werkzeug_logger.setLevel(kioskglobals.cfg.get_werkzeug_log_level())

        # This is to suppress the red lock log entries.
        red_lock_logger = logging.getLogger('redis_lock')
        red_lock_logger.setLevel(kioskglobals.cfg.get_werkzeug_log_level())

        logging.basicConfig(format='>[%(process)d/%(thread)d: %(module)s.%(levelname)s at %(asctime)s]: %(message)s',
                            level=logging.ERROR)
        logger = logging.getLogger()
        logger.setLevel(kioskglobals.cfg.get_log_level())
        if not kioskglobals.cfg.do_log_to_screen():
            logger.handlers = []

        return logger

    @classmethod
    def create_new_file_log(cls, logger: logging.Logger):
        if kioskglobals.cfg.get_logfile():
            cls.close_all_file_loggers(logger)

            log_pattern = kioskglobals.cfg.get_logfile().replace("#", "%")

            # todo: This is such a hack. But it makes sure, that two processes do not produce two different logs if
            # the minute is about to expire and the logfile pattern is on a minute basis.
            # Nonetheless, since logging is not multiprocess safe, logging needs to move to REDIS or a database. Not now.
            if datetime.datetime.now().second >= 58:
                time.sleep(3)

            log_file = datetime.datetime.strftime(datetime.datetime.now(), log_pattern)
            kioskglobals.current_log_file = log_file
            ch = logging.FileHandler(filename=log_file)
            ch.setLevel(kioskglobals.cfg.get_log_level())

            formatter = logging.Formatter(
                '>[%(process)d/%(thread)d: %(module)s.%(levelname)s at %(asctime)s]: %(message)s')
            ch.setFormatter(formatter)
            logger.addHandler(ch)

            logging.debug("--------------- Starting new log %s ------------ \n" % log_file)

    @classmethod
    def close_all_file_loggers(cls, logger):
        for handler in logger.handlers:
            if isinstance(handler, logging.FileHandler):
                logger.remove_handler(handler)
                handler.flush()
                handler.close()

    @classmethod
    def kiosk_refresh_globals(cls):
        """
        this runs whenever a request is made and it turns out that a system-wide (general store)
        reinitialization of global variables has been initiated by some other request.

        """
        try:
            logging.debug("reinitializing identifier cache")
            kioskglobals.identifier_cache = MemoryIdentifierCache(kioskglobals.master_view.dsd)
        except BaseException as e:
            logging.error(f"{cls.__name__}.kiosk_refresh_globals: {repr(e)}")
            raise e

    @classmethod
    def _before_app_creation(cls, config_file, root_path=None, ):
        # loads all the plugins in the plugin directory
        kioskglobals.flask_admin = Admin()
        kioskglobals.root_path = root_path
        kiosksqlalchemy.instantiate_sqlalchemy_db()
        kioskglobals.worker_pool = ThreadPoolExecutor(max_workers=5)

        cls.cfg = basic_initialization(config_file)
        if not cls.cfg:
            logging.error("_create_std_app: Configuration file not available. Halt.")
            raise Exception("_create_std_app: Configuration file not available. Halt.")

        kioskglobals.logger = cls.init_logging()

        if kioskglobals.cfg.get_logfile():
            cls.create_new_file_log(kioskglobals.logger)
            if kioskglobals.cfg.get_log_level() == logging.DEBUG:
                logging.debug("---------------- LOG LEVEL SET TO DEBUG!\n")
        else:
            logging.warning("****************************** Using no logfile **********************************")

        # not sure why I did this before
        # cls.cfg = cls._load_config_from_yaml_file(config_file)
        cls.init_dsd()

        print(f"PostgreSQL version {KioskSQLDb.get_postgres_version()} on port {kioskglobals.cfg.database_port}")

        # Load all the plugins:
        plugin_manager = cls.load_plugins()

        if hasattr(kioskglobals.general_store, "gs_id") and kioskglobals.general_store.gs_id:
            print(f"! NOTE: General Store is using an id: {kioskglobals.general_store.gs_id}")

        cls.check_for_failed_patch()

        # todo: Every plugin that has something to contribute to the dsd, has to do it now:

        # now that the dsd is complete, the master view can be applied.
        cls.load_master_view()

        # migration can start, now that the dsd is complete and the master view created.
        # Migration is secured by a redis based lock.
        cls.migrate()
        # time.sleep(8)

        # this can only happen after migration because it needs the tables to be up
        kioskglobals.identifier_cache = MemoryIdentifierCache(kioskglobals.master_view.dsd)
        try:
            kioskglobals.init_counter = kioskglobals.get_system_wide_init_counter()
            logging.info(
                f"{cls.__name__}._create_std_app: kiosk init counter starts with {kioskglobals.init_counter}")
        except BaseException as e:
            logging.error(f"{cls.__name__}._create_std_app: Exception when querying init counter {repr(e)}")

        return plugin_manager

    @classmethod
    def _create_std_app(cls, config_file, root_path=None, static_folder=None):
        """
            Overrides the super method completely
        """
        assert root_path
        assert os.path.isdir(root_path)

        plugin_manager = cls._before_app_creation(config_file=config_file, root_path=root_path)
        tz = KioskSQLDb.get_default_time_zone()
        if tz != "UTC":
            raise Exception(f"The default time zone setting for PostgreSQL is currently {tz}. "
                            f"It must be UTC to run Kiosk. "
                            "Please make sure that either the environment variable 'PGTZ' is set to 'UTC' or "
                            "that PostgreSQL is configured to use UTC as the default time zone.")
        #
        # Create the actual app object
        #
        if static_folder:
            app = PluggableFlaskApp(__name__, root_path=root_path, static_folder=static_folder)
        else:
            app = PluggableFlaskApp(__name__, root_path=root_path)

        app.config.from_object(cls.FlaskConfigObject(cls.cfg["Flask"]))
        app.register_event_manager(EventManager())
        app.register_plugin_manager(plugin_manager)
        if hasattr(app, "before_first_request_funcs"):
            # Flask < 2.3.0
            app.before_first_request_funcs.append(cls._before_first_request)
        else:
            # Flask >= 2.3.0
            cls._before_first_request(app)
        app.teardown_request_funcs.setdefault(None, []).append(cls._teardown_request)
        cors = CORS(app)
        app.config['CORS_HEADERS'] = 'Content-Type'

        logging.getLogger('flask_cors').level = logging.WARNING
        app.register_error_handler(InternalServerError, handle_emergency_error)
        app.before_request(cls.kiosk_before_request)
        app.after_request(cls.kiosk_after_request)

        app.type_repository = kioskglobals.type_repository
        # the configuration for Flask itself is expected in the key "Flask" in our config file
        kiosksqlalchemy.set_sqlalchemy_uri(cls.cfg)
        app.config.from_object(cls.FlaskConfigObject(cls.cfg["Flask"]))

        # init sqlalchemy
        kiosksqlalchemy.init_sql_alchemy(app, cls.cfg)

        init_app_related_stuff(app)

        cls.add_app_url_rules(app)
        # registers the plugin manager with the app and
        # initializes all the plugins with the app object

        try:
            register_kiosk_apis(app)
        except BaseException as e:
            raise Exception(f"_create_std_app: Error when registering kiosk apis{repr(e)}")

        plugin_manager.init_app(app, api=kioskglobals.api)

        cls._load_background_threads(app)
        KioskSQLDb.release_thread_con()
        cls.show_ip_addresses()
        return app

    @classmethod
    def _before_first_request(cls, app: PluggableFlaskApp = None):
        if not app:
            app = current_app

        plugin_manager = app.plugin_manager
        logging.debug(f"{cls.__name__}._before_first_request: In _before_first_request.")

        cls.register_menus(plugin_manager, app)
        cls.register_scripts(plugin_manager)
        cls.register_global_routes(plugin_manager)
        print("\nPLUGINS:********************")
        cls.list_plugins(plugin_manager)

        print("\nURL-MAP:********************")
        print(app.url_map)
        print(f"Flask static folder is {app._static_folder}")
        logging.debug(f"Flask static folder is {app._static_folder}")

        print("\nSynchronous scripts:***************+")
        print(kioskglobals.script_manager.scripts)

        print("\nFileRepository Types: ***************+")
        for fr_cat in kioskglobals.type_repository.repository:
            print("   " + str(fr_cat))
            print("   -----------------")
            for fr_type in kioskglobals.type_repository.repository[fr_cat]:
                print("   > " + str(fr_type))
        try:
            if cls._check_startup():
                logging.debug("app creation successfully finished.\n")
            else:
                logging.debug("app creation successful BUT with warnings in checkup.\n")

            cls.show_ip_addresses()
        except BaseException as e:
            logging.error(f"{cls.__name__}._create_std_app: Unhandled Error during _check_startup: {repr(e)}")
            dispatch_system_message(f"Unhandled Error during _check_startup: {repr(e)}",
                                    message_id=SYS_MSG_ID_CHECKUP_EXCEPTION,
                                    body="Should this occur repeatedly an Admin needs to check the logs.")

    @classmethod
    def show_ip_addresses(cls):
        try:
            cfg = kioskglobals.get_config()
            subnet = kioskstdlib.try_get_dict_entry(cfg.kiosk, "subnet", "192.168")
            addresses = kioskstdlib.get_ip_addresses(
                subnet, kioskglobals.get_development_option("advanced_debug_log").lower() == "true")
            color = kioskstdlib.try_get_dict_entry(cfg.kiosk, "terminal_accent_color_ansi",
                                                   "[31;1m")
            print(f"\n\x1B[2J\x1B[H\u001b{color}")
            print("")
            if addresses:
                print("------------------------------------------------")
                print("")
                print("Kiosk is ready and listening to these addresses:")
                print("")
                for address in addresses:
                    print(f"{address}")
            else:
                print("Can't show what ip address kiosk is using")

            print("")
            print("------------------------------------------------")
        except BaseException as e:
            print(repr(e))
            logging.error(f"{cls.__class__.__name__}.show_ip_addresses: Can't show IP addresses{repr(e)}")
        finally:
            print("\u001b[0m")

    # noinspection PyBroadException
    @classmethod
    def _teardown_request(cls, error=None):
        try:
            try:
                # commit an open transaction that is not in erroneous state.
                con = KioskSQLDb.get_con(establish=False)
                if con:
                    if not con.closed:
                        if KioskSQLDb.transaction_active() and not KioskSQLDb.in_error_state():
                            KioskSQLDb.commit()

            except BaseException as e:
                logging.error(f"{cls.__name__}._teardown_request: Exception when releasing db connection: {repr(e)}")
            KioskSQLDb.release_thread_con()
            if error:
                logging.debug(f"{cls.__name__}._teardown_request: {str(error)}")
        except BaseException as e:
            try:
                logging.error(f"{cls.__name__}._teardown_request: {repr(e)}")
            except:
                pass
        try:
            logging.debug(f"************ END OF REQUEST ************")
        except:
            pass

    @classmethod
    def _check_startup(cls):
        result = True

        result = result & cls._check_gs_id()
        result = result & cls._check_mcp()
        result = result & cls._check_temp_dir()
        result = result & cls._check_file_upload_dir()
        result = result % cls._check_development_options()

        return result

    @classmethod
    def _check_gs_id(cls):
        if hasattr(kioskglobals.general_store, "gs_id") and kioskglobals.general_store.gs_id:
            dispatch_system_message("General Store is Using an ID",
                                    SYS_MSG_ID_GS_WITH_ID,
                                    body=f"This Kiosk is using a General Store with an ID "
                                         f"({kioskglobals.general_store.gs_id}), presumably to engage "
                                         f"a separate Master Control Program for testing purposes."
                                         f"This is just a reminder of that fact!",
                                    sender=f"{cls.__name__}._check_startup")
        return True

    @classmethod
    def _check_mcp(cls):
        try:
            cfg = kioskglobals.get_config()
            if is_local_server(cfg):
                try:
                    assert_mcp(kioskglobals.general_store)
                except MCPNotRunningError:
                    time.sleep(.5)
                    assert_mcp(kioskglobals.general_store)

                return True
            else:
                # todo: _check_mcp only runs on local servers for the time being because it is unreliable online
                return True
        except MCPNotRunningError as e:
            dispatch_system_message("Master Control is not up.",
                                    SYS_MSG_ID_MCP_NOT_UP,
                                    body="Without Master Control started core features like workstation export and import"
                                         " or housekeeping will not be available. Please start Master Control.",
                                    sender=f"{cls.__name__}._check_startup")
        return False

    @classmethod
    def _check_temp_dir(cls):
        try:
            temp_dir = kioskglobals.get_config().get_temp_dir(create_if_non_existent=True)
            assert temp_dir
            return True
        except BaseException as e:
            dispatch_system_message("Temporary directory either not configured or cannot be created.",
                                    SYS_MSG_ID_TEMP_DIR_MISSING,
                                    body="Without a temp dir some system services won't work properly. "
                                         "Config would be config/temp_dir.",
                                    addressee="admins",
                                    sender=f"{cls.__name__}._check_startup")
            return False

    @classmethod
    def _check_file_upload_dir(cls):
        try:
            cfg: KioskConfig = kioskglobals.get_config()
            file_upload_dir = cfg.get_temporary_upload_path()
            assert file_upload_dir
            return True
        except BaseException as e:
            dispatch_system_message("The temporary file upload path is either not configured or cannot be created.",
                                    SYS_MSG_ID_TEMP_DIR_MISSING,
                                    body="This is about the config key kiosk/temporary_upload_path, not about config/temp_dir",
                                    addressee="admins",
                                    sender=f"{cls.__name__}._check_startup")
            return False

    @classmethod
    def _check_development_options(cls):
        try:
            if kioskglobals.get_development_option("generate_system_message").lower() == "true":
                body = f"PID: {os.getpid()}), Thread: {threading.current_thread().ident}"
                dispatch_system_message("System Information.",
                                        SYS_MSG_ID_DEVELOPMENT_GENERATE_SYSTEM_MESSAGE,
                                        body=body,
                                        addressee="admins",
                                        sender=f"{cls.__name__}._check_development_options")

            if kioskglobals.get_development_option("webapp_development").lower() == "true":
                raise Exception("Kiosk runs in webapp_development mode. This is a security risk "
                                "and should not happen in "
                                "production.")
        except BaseException as e:
            dispatch_system_message("development environment option detected. Please check your configuration.",
                                    SYS_MSG_ID_DEVELOPMENT_ENVIRONMENT_ACTIVE,
                                    body=repr(e),
                                    addressee="admins",
                                    sender=f"{cls.__name__}._check_development_options")
        return True

    @classmethod
    def _create_emergency_app(cls, config_file, root_path=None, static_folder=None, reason="unknown"):
        """
            Overrides the super method completely
        """
        if static_folder:
            app = PluggableFlaskApp(__name__, root_path=root_path, static_folder=static_folder)
        else:
            app = PluggableFlaskApp(__name__, root_path=root_path)
        app.config["emergency_mode"] = True
        app.config["emergency_reason"] = reason
        # cors = CORS(app)
        app.before_request(cls.kiosk_before_emergency_request)
        # app.type_repository = kioskglobals.type_repository
        # the configuration for Flask itself is expected in the key "Flask" in our config file
        # kiosksqlalchemy.set_sqlalchemy_uri(cls.cfg)
        try:
            app.config.from_object(cls.FlaskConfigObject(kioskglobals.cfg["Flask"]))
        except BaseException as e:
            logging.error(f"{cls.__name__}._create_emergency_app : {repr(e)}")

        # init sqlalchemy
        # kiosksqlalchemy.init_sql_alchemy(app, cls.cfg)

        # init_app_related_stuff(app)
        cls.register_emergency_context_processors(app)
        cls.register_emergency_error_handlers(app)
        # cls.add_emergency_url_rules(app)

        # # registers the plugin manager with the app and
        # # initializes all the plugins with the app object
        #
        # register_kiosk_apis(app)
        # plugin_manager.init_app(app, api=kioskglobals.api)
        #
        # cls._load_background_threads(app)
        #
        # cls.register_menus(plugin_manager, app)
        # cls.register_scripts(plugin_manager)
        # cls.register_global_routes(plugin_manager)
        # print("\nPLUGINS:********************")
        # cls.list_plugins(plugin_manager)

        print("\nURL-MAP:********************")
        print(app.url_map)
        print(f"Flask static folder is {app._static_folder}")
        logging.debug(f"Flask static folder is {app._static_folder}")

        # print("\nSynchronous scripts:***************+")
        # print(kioskglobals.script_manager.scripts)
        #
        # print("\nFileRepsitory Types: ***************+")
        # for fr_cat in kioskglobals.type_repository.repository:
        #     print("   " + str(fr_cat))
        #     print("   -----------------")
        #     for fr_type in kioskglobals.type_repository.repository[fr_cat]:
        #         print("   > " + str(fr_type))
        #
        logging.debug("emergency app creation successfully finished.\n")
        return app

    @classmethod
    def save_response(cls, resp):
        resp_data = {}
        resp_data['status_code'] = resp.status_code
        resp_data['status'] = resp.status
        resp_data['headers'] = dict(resp.headers)
        resp_data['data'] = resp.response
        return resp_data

    @classmethod
    def kiosk_after_request(cls, resp):
        # resp.headers.add('Access-Control-Allow-Origin', '*')
        # resp.headers.add('Access-Control-Allow-Headers', 'Content-Type, X-Token')
        # resp.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        if kioskglobals.get_development_option("print_raw_requests") == "true":
            resp_data = cls.save_response(resp)
            pprint(resp_data)
        return resp

    @classmethod
    def kiosk_before_request(cls):
        try:
            if kioskglobals.get_development_option("print_raw_requests") == "true":
                pprint("request")
                pprint(request)

            if kioskglobals.general_store:
                try:
                    gs_init_counter = kioskglobals.get_system_wide_init_counter()
                except KeyError as e:
                    gs_init_counter = 0

                if gs_init_counter != kioskglobals.init_counter:
                    logging.debug(f"refreshing globals. gs_init_counter is {gs_init_counter}")
                    cls.kiosk_refresh_globals()
                    kioskglobals.init_counter = gs_init_counter
        except BaseException as e:
            logging.error(f"{cls.__name__}.kiosk_before_request: {repr(e)}")

        return None

    @classmethod
    def kiosk_before_emergency_request(cls):
        reason = "unknown"
        try:
            if request.url_rule and request.url_rule.rule.startswith("/static"):
                return
            else:
                reason = current_app.config["emergency_reason"]
        except:
            pass
        abort(500, reason)

    @classmethod
    def add_app_url_rules(cls, app):
        app.add_url_rule('/refresh', "refresh_config", refresh_config)
        app.add_url_rule('/<path:filename>', "rootfile", root_file)
        app.add_url_rule('/custom_file/<path:filename>', "custom_file", custom_file)
        app.add_url_rule('/urap_progress', "urap_progress", get_progress, methods=['POST'])
        app.add_url_rule('/kiosk_progress', "kiosk_progress", get_progress, methods=['POST'])
        # app.add_url_rule('/job_progress', "job_progress", job_progress, methods=['POST'])
        # app.add_url_rule('/job_log', "job_log", job_log, methods=['POST'])
        app.add_url_rule('/mcp_job_progress', "mcp_job_progress", mcp_job_progress, methods=['POST'])
        app.add_url_rule('/mcp_job_log', "mcp_job_log", mcp_job_log, methods=['POST'])
        app.add_url_rule('/delete_system_message', "delete_system_message", delete_system_message, methods=['POST'])
        app.add_url_rule('/get_system_messages', "get_system_messages", get_system_messages, methods=['POST'])

    @classmethod
    def load_plugins(cls, is_plugin_active: Union[Callable, None] = None):
        plugin_manager = FlaskAppPluginManager()
        plugin_manager.is_plugin_active = cls._is_plugin_active
        project_id = cls.cfg.get_project_id()
        if not cls.load_general_store(plugin_manager):
            logging.error("_create_std_app: General Store could not be created.")
            # dispatch_system_message(headline="General Store not running.",
            #                         message_id=SYS_MSG_ID_STORE_NOT_READY,
            #                         body="Either REDIS is not running or not properly configured in this project",
            #                         addressee=USER_GROUP_ADMINS)
            raise Exception("General Store not up and running.")
        else:
            cls.init_system_messaging(kioskglobals.general_store)

        plugin_dir = cls.cfg.resolve_symbols(cls.cfg.kiosk["plugin_path"])
        if project_id:
            plugin_manager.load_plugins(plugin_dir=plugin_dir,
                                        init_plugin_configuration={"project_id": project_id},
                                        is_plugin_active=is_plugin_active)
        else:
            plugin_manager.load_plugins(plugin_dir=plugin_dir)
        if "mcpcore.mcpworker" in sys.modules:
            print("mcpcore.mcpworker in sys.modules. THAT IS NOT ALLOWED!")
            raise Exception("KioskAppFactory.load_plugins: Detected mcpcore.mcpworker in sys.modules. "
                            "That is not allowed.")
        return plugin_manager

    @classmethod
    def init_system_messaging(cls, general_store):
        try:
            logging.debug(f"{cls.__name__}.init_system_messaging: initializing ...")
            system_messages = SystemMessageList(general_store, kioskglobals.get_config().get_project_id())

            store = SystemMessageStore(on_load=SystemMessageStorePostgres.load,
                                       on_store=SystemMessageStorePostgres.store)
            system_messages.assign_store(store)
            system_messages.sync(two_way=True)
            kioskglobals.system_messages = system_messages
            logging.debug(f"{cls.__name__}.init_system_messaging: system messaging initialized.")
        except BaseException as e:
            logging.error(f"{cls.__name__}.init_system_messaging: {repr(e)}")

    @classmethod
    def register_menus(cls, plugin_manager, app):
        for plugin_name in plugin_manager.plugins:
            try:
                plugin = plugin_manager.plugins[plugin_name]
                if hasattr(plugin, "register_menus"):
                    menu_entries = plugin.register_menus(app)

                    if menu_entries:
                        for m in menu_entries:
                            # logging.debug(f"plugin {plugin.name} registers menu {m.name}->{m.endpoint}")
                            kioskglobals.url_for_publisher.add_route(m.endpoint)
                            kioskglobals.menu.append(m)
            except Exception as e:
                logging.info("Exception in KioskAppFactory.register_menus: "
                             "UrapKiosk register_controller: No menu information for {} ".format(plugin_name) +
                             ":" + repr(e))

    @classmethod
    def register_global_routes(cls, plugin_manager):
        for plugin_name in plugin_manager.plugins:
            try:
                plugin = plugin_manager.plugins[plugin_name]
                b = hasattr(plugin, "register_global_routes")
                if b:
                    routes = plugin.register_global_routes()
                    if routes:
                        for m in routes:
                            # logging.debug(f"{cls.__name__}.KioskAppFactory.register_global_routes : "
                            #               f"plugin {plugin.name} registers global route {m}")
                            if isinstance(m, str):
                                kioskglobals.url_for_publisher.add_route(m)
                            elif isinstance(m, tuple):
                                kioskglobals.url_for_publisher.add_route(m[0], m[1])
                            else:
                                logging.error(f"{cls.__name__}.KioskAppFactory.register_global_routes : "
                                              f"plugin {plugin.name} registered a bad global route: {m}")


            except Exception as e:
                logging.info("Exception in KioskAppFactory.register_global_routes: plugin {} ".format(plugin_name) +
                             " caused exception " + repr(e))

    @classmethod
    def register_scripts(cls, plugin_manager):
        for plugin_name in plugin_manager.plugins:
            plugin = plugin_manager.plugins[plugin_name]
            if hasattr(plugin, "register_global_scripts"):
                try:
                    scripts = plugin.register_global_scripts()
                    if scripts:
                        for s in scripts:
                            logging.debug(f"plugin {plugin.name} registers script {s}")
                            kioskglobals.script_manager.add_script(s, scripts[s])
                except Exception as e:
                    logging.info("No script information for {} ".format(plugin.name) + repr(e))

    @classmethod
    def list_plugins(cls, plugin_manager):
        for plugin_name in plugin_manager.plugins:
            plugin = plugin_manager.plugins[plugin_name]
            msg_plugin = "Registered Plugin " + plugin.name + " of class " + plugin.__class__.__name__
            try:
                from core.kioskcontrollerplugin import KioskControllerPlugin
                if isinstance(plugin, KioskControllerPlugin):
                    if hasattr(plugin, "is_main_index"):
                        if plugin.is_main_index:
                            msg_plugin = msg_plugin + " (provides main index)"
            except Exception as e:
                logging.error("Exception in register_controller when registering the index function: " + repr(e))
            print("\n" + msg_plugin)
        print("\n")

    @classmethod
    def create_app(cls, config_name: str = None, root_path=None, static_folder=None) -> object:
        print(f"KioskAppFactory.create_app: root is {root_path}, configuration file is {config_name}")
        try:
            return cls._create_std_app(config_name, root_path=root_path, static_folder=static_folder)
        except BaseException as e:
            logging.error(f"{cls.__name__}.create_app: Cannot start app because of exception {repr(e)}")
            logging.error(f"{cls.__name__}.create_app: Will start emergency app instead.")
            print(f"\n\u001b[31;1;5m")
            print("")
            print("------------------------------------------------")
            print("")
            print(f"ERROR: {repr(e)} ")
            print("THE KIOSK SERVER DID NOT START PROPERLY AND IS IN EMERGENCY MODE ")
            print("")
            print("------------------------------------------------\u001b[0m")
            return cls._create_emergency_app(config_name, root_path=root_path, static_folder=static_folder,
                                             reason=repr(e))

    @classmethod
    def load_general_store(cls, plugin_manager):
        cfg: KioskConfig = cls.cfg
        try:
            general_store_plugin = cfg.config["general_store_plugin"]
            general_store_class_name = cfg.config["general_store_class"]
            general_store_id = kioskstdlib.try_get_dict_entry(cfg.config, "gs_id", "", True)
            if plugin_manager.load_plugins(cfg.sync_plugin_directory, [general_store_plugin]):
                plugin = plugin_manager.get_plugin_by_name(general_store_plugin)
                plugin.register_type(kioskglobals.type_repository)
                GeneralStoreClass = kioskglobals.type_repository.get_type(TYPE_GENERALSTORE, general_store_class_name)
                if GeneralStoreClass:
                    try:
                        kioskglobals.general_store = GeneralStoreClass(cfg, gs_id=general_store_id)
                        return kioskglobals.general_store.is_running()
                    except BaseException as e:
                        logging.error(f"{cls.__name__}.load_general_store: "
                                      f"Exception when instantiating the GeneralStoreClass: {repr(e)}")
                else:
                    logging.error(
                        "General store class not found in type repository. Parallel execution will not be functional.")
            else:
                logging.error("General store plugin not loaded. Parallel execution will not be functional.")
        except BaseException as e:
            logging.error(f"{cls.__name__}.load_general_store: Exception when loading the general store: {repr(e)}")

        return False

    # noinspection PyPep8Naming
    @classmethod
    def _load_background_threads(cls, app):
        auto_starts = kioskglobals.type_repository.list_types(TYPE_AUTOSTART_THREAD)

        if not auto_starts:
            return
        else:
            if not is_local_server(cls.cfg):
                logging.info(f"auto_start modules not supported on online servers. "
                             f"But apparently there are some plugins that have registered autostart threads. "
                             f"({auto_starts}) skipped.")
                return

        for class_name in auto_starts:
            AutoStartClass = "undefined"
            try:
                AutoStartClass = kioskglobals.type_repository.get_type(TYPE_AUTOSTART_THREAD, class_name)
                obj = AutoStartClass(app, kioskglobals.general_store, kioskglobals.cfg)
                thread = obj.start(kioskglobals.worker_pool)
                if thread:
                    logging.debug(f"Autostart class {AutoStartClass.__name__} started.")
                    kioskglobals.auto_start_objects.append((obj, thread))
                else:
                    logging.error(f"Autostart class {AutoStartClass.__name__} would not start.")
            except BaseException as e:
                logging.error(f"{cls.__name__}._load_background_threads: Exception when "
                              f"starting autostart class {AutoStartClass.__name__}: {repr(e)}")

    @classmethod
    def init_dsd(cls):
        master_dsd = Dsd3Singleton.get_dsd3()
        master_dsd.register_loader("yml", DSDYamlLoader)
        if not master_dsd.append_file(kioskglobals.cfg.get_dsdfile()):
            logging.error(
                f"{cls.__name__}.init_dsd: {kioskglobals.cfg.get_dsdfile()} could not be loaded by append_file.")
            raise Exception(f"{cls.__name__}.init_dsd: {kioskglobals.cfg.get_dsdfile()} could not be loaded.")

        try:
            kioskglobals.master_view = DSDView(master_dsd)
            master_view_instructions = DSDYamlLoader().read_view_file(kioskglobals.cfg.get_master_view())
            kioskglobals.master_view.apply_view_instructions(master_view_instructions)
        except BaseException as e:
            logging.error(f"{cls.__name__}.init_dsd: Exception when applying master view to dsd: {repr(e)}")
            raise e
        logging.debug(f"{cls.__name__}.init_dsd: dsd3 initialized: {kioskglobals.cfg.get_dsdfile()}. ")

    @classmethod
    def load_master_view(cls):
        try:
            kioskglobals.master_view = DSDView(Dsd3Singleton.get_dsd3())
            master_view_instructions = DSDYamlLoader().read_view_file(kioskglobals.cfg.get_master_view())
            kioskglobals.master_view.apply_view_instructions(master_view_instructions)
        except BaseException as e:
            logging.error(f"{cls.__name__}.init_dsd: Exception when applying master view to dsd: {repr(e)}")
            raise e

        logging.debug(f"{cls.__name__}.init_dsd: master view initialized: {kioskglobals.cfg.get_master_view()}")

    @classmethod
    def migrate(cls):
        from generalstore.generalstore import GeneralStore
        general_store: GeneralStore = kioskglobals.general_store

        # todo refactor: This is really not that great. First: I don't know what timeout=1 actually does,
        # then, do all processes wait until they get the lock and then they all migrate and - worse - they all refresh
        # the fid caches and check on the admin user? Looks like it, doesn't it?

        lock = general_store.acquire_process_lock("kiosk_migration", expire_seconds=120, timeout=1)
        if lock:
            logging.info(f"kioskappfactory.migrate: _lock acquired for thread {current_thread().ident}")
            try:
                postgres_adapter = PostgresDbMigration(kioskglobals.master_view.dsd, KioskSQLDb.get_con())
                migration = Migration(kioskglobals.master_view.dsd, postgres_adapter, cls.cfg.get_project_id())
                migration.self_check()
                logging.debug("Migration ready.")
                if migration.migrate_dataset():
                    KioskSQLDb.commit()
                    logging.info("Migration complete, database committed.")

                    # the following things are in here so that they are protected by the same process lock.
                    cls.init_fid_caches()
                    if migration.affected_tables() > 0:
                        logging.info(f"kioskappfactory.migrate: {migration.affected_tables()} "
                                     f"tables affected. refreshing full text search.")
                        fts = FTS(kioskglobals.master_view.dsd, cls.cfg)
                        if not fts.rebuild_fts():
                            logging.error(f"kioskappfactory.migrate: refreshing full text search failed.")

                    try:
                        cls.init_users_and_privileges()
                    except BaseException as e:
                        logging.error(f"{cls.__name__}.migrate: Exception when checking admin user: {repr(e)}")

                    return True
                else:
                    KioskSQLDb.rollback()
                    logging.error("Migration failed, database rolled back.")
                    dispatch_system_message(headline="Database Migration Failed.",
                                            message_id=SYS_MSG_ID_MIGRATION_FAILED,
                                            body="""Right now Kiosk is operating with an outdated database structure. 
                                                    This can be a critical problem. Please inform an administrator.""",
                                            sender=f"{cls.__name__}.migrate")
            except BaseException as e:
                logging.error(f"{cls.__name__}.migrate: Exception during migration or self_check: {repr(e)}")
                dispatch_system_message(headline="Database migration or self check failed.",
                                        message_id=SYS_MSG_ID_MIGRATION_FAILED,
                                        body=f"""Right now Kiosk is operating with an outdated database structure. 
                                                This can be a critical problem. Please inform an administrator. 
                                                Details: {repr(e)}.""",
                                        sender=f"{cls.__name__}.migrate")
            finally:
                try:
                    general_store.release_process_lock(lock)
                    logging.info(f"kioskappfactory.migrate: _lock released for thread {current_thread().ident}")
                except BaseException as e:
                    logging.error(f"kioskappfactory.migrate: _lock NOT released for thread {current_thread().ident}:"
                                  f"{repr(e)}")
        else:
            logging.warning(f"kioskappfactory.migrate: _lock NOT acquired for thread {current_thread().ident}")

        return False

    @classmethod
    def init_fid_caches(cls):
        try:
            # The file - identifier cache can be built after migration
            sync = Synchronization()
            if not FileIdentifierCache.build_fic_indexes(sync.type_repository, kioskglobals.master_view.dsd):
                raise Exception("Some file identifier cache in build_fic_indexes failed.")
            # fic = FileIdentifierCache(kioskglobals.master_view.dsd)
            # fic.build_file_identifier_cache_from_contexts(commit=True)
        except BaseException as e:
            logging.error(f"{cls.__name__}.migrate: Error when rebuilding file-identifier-cache: "
                          f"{repr(e)}")
            dispatch_system_message(headline="Rebuilding of at least one file identifier cache went wrong.",
                                    message_id=SYS_MSG_ID_REBUILD_FIC_FAILED,
                                    body="""Kiosk might fail applying the right files to a context. This 
                                    needs the attention of an administrator. """,
                                    sender=f"{cls.__name__}.migrate")

    @classmethod
    def init_users_and_privileges(cls):
        admin_created = False

        if not KioskSQLDb.get_record_count("kiosk_user", "user_id"):
            admin_created = True
            logging.warning("no kiosk users in database. Creating admin user with no password.")
            KioskSQLDb.execute(f"""
            INSERT INTO kiosk_user (user_id, user_name, pwd_hash, repl_user_id, 
            groups, must_change_pwd) 
            VALUES ('admin', 'Admin', '', 'admin', '{USER_GROUP_ADMINS}', true);
            """, commit=True)
            dispatch_system_message(headline="user admin created. Please login without a password.",
                                    message_id=SYS_MSG_ID_ADMIN_CREATED,
                                    body="On first login you will be asked to give the admin a password. Make sure "
                                         "to use a secure one AND make sure not to forget it because otherwise "
                                         "you are in danger of losing access to this server for good.",
                                    sender="init_users_and_privileges")

        if not KioskSQLDb.get_record_count("kiosk_privilege", "addressee", f"addressee='{USER_GROUP_ADMINS}'"):
            logging.warning("no admin privileges in database. Creating group 'admins' with universal rights.")
            KioskSQLDb.execute(f"""
            INSERT INTO kiosk_privilege (addressee, privilege) 
            VALUES ('{USER_GROUP_ADMINS}', '*');
            """, commit=True)
            if not admin_created:
                dispatch_system_message(headline="user group 'admins' with universal rights created.",
                                        message_id=SYS_MSG_ID_ADMIN_GROUP_CREATED,
                                        body="This group is expected by the system but was missing.",
                                        sender="init_users_and_privileges")

        if not KioskSQLDb.get_record_count("kiosk_privilege", "addressee", f"addressee <> '{USER_GROUP_ADMINS}'"):
            logging.warning("beside the admin's there are no privileges in database. "
                            "Creating default privileges and groups.")

            try:
                for addressee, privileges in DEFAULT_PRIVILEGES.items():
                    for privilege in privileges:
                        KioskSQLDb.execute(f"""
                        INSERT INTO kiosk_privilege (addressee, privilege) 
                        VALUES (%s,%s)""", parameters=[addressee, privilege])
                KioskSQLDb.commit()
            except BaseException as e:
                KioskSQLDb.rollback()
                logging.error(f"KioskAppFactory.init_users_and_privileges: "
                              f"Error creatung default privileges: {repr(e)}")
                dispatch_system_message(headline="Error creating default privileges",
                                        message_id=SYS_MSG_ID_DEFAULT_PRIVILEGES,
                                        body=f"It was not possible to create the default groups and "
                                             f"privileges for this Kiosk ({repr(e)}). Please review the users and privileges "
                                             f"in the administration module.",
                                        sender="init_users_and_privileges")

    @classmethod
    def register_emergency_error_handlers(cls, app):
        from werkzeug.exceptions import BadRequest, InternalServerError
        app.register_error_handler(BadRequest, handle_emergency_error)
        app.register_error_handler(InternalServerError, handle_emergency_error)

    @classmethod
    def register_emergency_context_processors(cls, app):
        # app.template_context_processors[None].append(inject_menu)
        # app.template_context_processors[None].append(inject_global_constants)
        # app.template_context_processors[None].append(inject_global_scripts)
        # app.template_context_processors[None].append(inject_routes)
        pass

    @classmethod
    def check_for_failed_patch(cls):
        patch_log = log_file = os.path.join(kioskstdlib.get_file_path(kioskglobals.cfg.logfile), "patches.yml")
        if not os.path.exists(log_file):
            return

        with open(log_file, "r", encoding='utf8') as ymlfile:
            log = yaml.load(ymlfile, Loader=yaml.FullLoader)

        patch_to_check = kioskstdlib.try_get_dict_entry(log, 'check_on_startup', '', True)
        if not patch_to_check:
            return

        try:
            patch_result = kioskstdlib.to_bool(log[patch_to_check]["success"])
            if patch_result:
                dispatch_system_message("Patch was successfully installed.",
                                        SYS_MSG_ID_PATCH_SUCCESSFUL,
                                        body="The patch you uploaded recently was successfully "
                                             "applied during Kiosk's startup phase. You are all set.",
                                        sender=f"kioskpatcher")
            else:
                error_messages = log[patch_to_check]["log"]
                error_message = error_messages[-1]
        except BaseException as e:
            logging.error(f"{cls.__name__}.check_for_failed_patch : {repr(e)}")
            patch_result = False
            error_message = f"Error checking for a failed patch: {repr(e)}"

        if not patch_result:
            dispatch_system_message("Patch installation failed.",
                                    SYS_MSG_ID_PATCH_FAILED,
                                    body=f"Kiosk failed to apply the patch you uploaded recently. "
                                         f"The error message was \n"
                                         f"'{error_message}'.\n"
                                         f"That can have rather severe consequences, so please call for help ASAP.",
                                    sender=f"kioskpatcher")
        try:
            log["check_on_startup"] = ""
            with open(log_file, "w") as ymlfile:
                yaml.dump(log, ymlfile, default_flow_style=False)
        except BaseException as e:
            logging.error(f"{cls.__name__}.check_for_failed_patch: Error when resetting 'check_on_startup': {repr(e)}")


#  **************************************************************
#  ****    /file-repository redirecting index
#  *****************************************************************/
@full_login_required
def refresh_config():
    logging.info("********* Refreshing config **************")
    kioskglobals.cfg._release_config()
    basic_initialization(kioskglobals.cfg.configfile)
    # init_app_related_stuff(current_app)
    # kioskglobals.cfg.kiosk_config["PluginWorkstationManager"]["allow_operations"] = []
    kioskglobals.inc_system_wide_init_counter()
    return redirect(url_for("get_index"))


def custom_file(filename):
    """Function used to send static custom files from the custom
    folder to the browser.
    """

    custom_static_path = os.path.join(kioskglobals.cfg.get_custom_kiosk_modules_path(),
                                      f"{kioskglobals.cfg.get_project_id()}")
    if current_app.config["SEND_FILE_MAX_AGE_DEFAULT"]:
        if isinstance(current_app.config["SEND_FILE_MAX_AGE_DEFAULT"], int):
            cache_timeout = datetime.timedelta.total_seconds(
                datetime.timedelta(current_app.config["SEND_FILE_MAX_AGE_DEFAULT"]))
        else:
            logging.error(f"kioskappfactory.custom_file: SEND_FILE_MAX_AGE_DEFAULT not an int")
    else:
        cache_timeout = None
    return send_from_directory(custom_static_path, filename,
                               max_age=cache_timeout)


def root_file(filename):
    """Function used to send unrestricted static files that are expected in the root folder.
    The files are actually located in static/root
    Especially robots.txt. This is rather for development environments. In production
    the web server should serve static files from /static/root
    """

    cache_timeout = None
    if filename.lower() in ["robots.txt"]:
        static_path = os.path.join(kioskglobals.cfg.base_path, "static", "root")
        if current_app.config["SEND_FILE_MAX_AGE_DEFAULT"]:
            if isinstance(current_app.config["SEND_FILE_MAX_AGE_DEFAULT"], int):
                cache_timeout = datetime.timedelta.total_seconds(
                    datetime.timedelta(current_app.config["SEND_FILE_MAX_AGE_DEFAULT"]))
            else:
                logging.error(f"kioskappfactory.root_file: SEND_FILE_MAX_AGE_DEFAULT not an int")
        return send_from_directory(static_path, filename,
                                   max_age=cache_timeout)
    else:
        logging.debug(f"kioskappfactory.root_file: illegal attempt to access /{filename}")
        abort(404)


#  **************************************************************
#  ****    /urap_progress and /kiosk_progress
#  ****    uses the old kiosk_thread / UrapThread mode.
#  ****    deprecated!
#  *****************************************************************/
# @full_login_required
def get_progress():
    if kioskglobals.kiosk_thread.is_running():
        return jsonify(result="ok", progress=kioskglobals.kiosk_thread.get_progress(),
                       extended_progress=kioskglobals.kiosk_thread.extended_progress)
    else:
        rc = kioskglobals.kiosk_thread.get_result("json_message")
        # ja, I know, the next line is far from being thread-safe. But since we won't have
        # very tight concurring requests, I ignore the danger for the time being.
        # This works only, if we assume that between the end of the thread no further
        # threaded operation has been started by anybody else.
        msgs = []
        if "error_level" in request.form:
            if request.form["error_level"] == "errors":
                msgs = list(filter(
                    lambda s: s.upper().find("ERROR") in range(0, 10) or s.upper().find("XCEPTION") in range(0, 10),
                    kioskglobals.kiosk_thread.get_log()))
        if not msgs:
            msgs = kioskglobals.kiosk_thread.get_log()
        return (jsonify(result=rc, progress=100,
                        extended_progress=kioskglobals.kiosk_thread.extended_progress,
                        has_warnings=kioskglobals.kiosk_thread.last_action_had_warnings(),
                        has_errors=kioskglobals.kiosk_thread.last_action_had_errors(),
                        dump=msgs))


#  **************************************************************
#  ****    /delete_system_message: confirms and thus deletes a system message
#  *****************************************************************/
@full_login_required
def delete_system_message():
    # print(f"user is {current_user}")
    message_uid = request.form["uid"]
    try:
        kioskglobals.system_messages.delete_message(uid=message_uid)
    except KeyError as e:
        pass
    except BaseException as e:
        logging.error(f"kioskappactory.delete_system_message: {repr(e)}")
    return jsonify({"result": "ok", "change_mark": kioskglobals.system_messages.change_mark})


#  **************************************************************
#  ****    /system_messages
#  *****************************************************************/
# field projects don't need this:
# todo: check full login if this runs on an online server.
# @full_login_required
def get_system_messages():
    try:
        change_mark = int(request.form['change_mark'])
    except KeyError:
        change_mark = 0

    # print(f"/system_messages for change_mark {change_mark}")
    if not kioskglobals.system_messages.has_changed(change_mark) \
            or kioskglobals.get_development_option("suppress_system_messages").lower() == "true":
        raise NotModified()
    else:
        return render_template("_system_messages.html")


#  **************************************************************
#  ****    /mcp_job_progress: Used for MCP jobs only.
#  *****************************************************************/
# @full_login_required
def mcp_job_progress():
    if is_ajax_request():
        if "job_uid" in request.form and request.form["job_uid"]:
            job_uid = request.form["job_uid"]
            if is_mcp_job(job_uid):
                return fetch_mcp_job_progress(job_uid)
        else:
            logging.error("kioskappfactory/mcp_job_progress: BAD REQUEST. No job_uid given ")
    else:
        logging.error("kioskappfactory/mcp_job_progress: BAD REQUEST. Not an ajax call. ")

    abort(400)


def fetch_mcp_job_progress(job_uid):
    try:
        attempts = 1
        last_exception = ""
        job = None
        time.sleep(.5)
        # hacky, hacky
        while not job and attempts < 5:
            try:
                job = MCPJob(kioskglobals.general_store, job_id=job_uid)
            except BaseException as e:
                last_exception = repr(e)
                attempts += 1
                time.sleep(.5)

        if job:
            return jsonify({"status": job.status,
                            "progress": job.progress.get_progress_dict(),
                            "result": job.result
                            }
                           )
        else:
            # I am not happy with this, but it might be the only way to get some
            # patience into the system
            logging.error(f"kioskappfactory/fetch_mcp_job_progress: faking a running job after {last_exception}.")
            return jsonify({"status": MCPJobStatus.JOB_STATUS_RUNNING
                            }
                           )
    except BaseException as e:
        logging.error(f"kioskappfactory/fetch_mcp_job_progress: Exception {repr(e)}")
        abort(500, "could not fetch progress of running mcp job")


#  **************************************************************
#  ****    /mcp_job_log
#  *****************************************************************/
# @full_login_required
# todo: on online servers the full_login should be checked.
def mcp_job_log():
    if is_ajax_request():
        if "job_uid" in request.form and request.form["job_uid"]:
            try:
                job = MCPJob(kioskglobals.general_store, job_id=request.form["job_uid"])
                str_level = ""
                if "log_level" in request.form:
                    str_level = request.form["log_level"].lower()

                return jsonify(job.get_log_lines(filter_str=str_level))
            except BaseException as e:
                logging.error(f"kioskappfactory/mcp_job_log: Exception {repr(e)}")
                abort(500)
        else:
            logging.error("kioskappfactory/mcp_job_log: BAD REQUEST. No jobUID given ")

    else:
        logging.error("kioskappfactory/mcp_job_log: BAD REQUEST. Not an ajax call. ")

    abort(400)


def handle_emergency_error(e):
    logging.error(f"HTTP ERROR: {e.description}")
    messages = []
    is_emergency_state = True

    try:
        is_emergency_state = "emergency_reason" in current_app.config
        if kioskglobals.system_messages:
            user_groups = []
            user_id = ""
            threshold = MSG_SEVERITY_INFO
            try:
                from flask_login import current_user
                user: KioskUser = current_user
                if user:
                    threshold = user.message_threshold
                    user_groups = user.groups
                    user_id = user.user_id
            except:
                pass

            messages = kioskglobals.system_messages.get_messages(threshold)
            messages.set_thresholds(group_threshold=threshold)
            if user_id:
                messages.set_user_information(user_id=user_id, user_groups=user_groups)
            messages = list(messages.messages())
    except:
        messages = []

    try:
        global_constants = kioskglobals.get_global_constants()
    except:
        global_constants = {}

    try:
        project_id = kioskglobals.cfg.get_project_id()
    except:
        project_id = "?"

    try:
        if not kioskglobals.cfg:
            raise Exception("Kiosk Configuration not accessible.")
        return render_template('emergency_error.html',
                               reason=e.description,
                               system_messages=messages,
                               is_emergency_state=is_emergency_state,
                               project_id=project_id,
                               global_constants=global_constants), 500
    except Exception as e2:
        return f"""
            <html>
                <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <link rel="apple-touch-icon" sizes="180x180"
                            href="{{ url_for('static', filename='assets/images/favicon/apple-touch-icon.png') }}">
                      <link rel="icon" type="image/png" sizes="32x32"
                            href="{{ url_for('static', filename='assets/images/favicon/favicon-32x32.png') }}">
                      <link rel="icon" type="image/png" sizes="16x16" href="/static/assets/images/favicon/favicon-16x16.png">
                      <link rel="manifest" href="/static/assets/images/favicon/site.webmanifest">
                      <link rel="shortcut icon" href="/static/assets/images/favicon/favicon.ico">
                      <meta name="msapplication-TileColor" content="#2b5797">
                      <meta name="msapplication-config" content="/static/assets/images/favicon/browserconfig.xml">
                      <meta name="theme-color" content="#ffffff">
                      <style>
                        body {{
                            background: darkblue;
                            font-family: monospace;
                            color: yellow;
                            margin: 0px;
                            border: 0px;
                            padding: 0px;
                            box-sizing: border-box;
                            width: 100%;
                            height: 100%;
                        }}
                        h1 {{font-size: 36px; text-align: center}}
                        h2 {{margin-top: 2em; font-size: 28px; text-align: center}}
                        p {{font-family: sans-serif; font-size: 22px; color: white; text-align: center}}
                        .message {{margin: 0 auto 0 auto; position: absolute; top: 50%;
                        transform: translateY(-50%);width: 100%; box-sizing: border-box}}  
                      </style>
                </head>
                <body>
                    <div class="message">
                       <h1>Right now, kiosk can't do anything. <br/>Not even show an error message properly.</h1>
                       <h2>The original error message was:</h2>
                       <p>{e.description}</p>
                       <h2>the reason why even the emergency mode failed to display:</h2>
                       <p>{repr(e2)}</p>
                       <h2>Please consult your administrator right away.</h2>
                    </div>
                </body>
            </html>
            """
