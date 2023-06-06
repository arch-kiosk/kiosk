import logging
import threading
from copy import copy
from uuid import uuid4
import sys
import os

import flask
import jinja2
from flask import url_for, \
    render_template, request, jsonify, make_response
from flask_login import current_user
from flask_wtf.csrf import CSRFError
from flask_wtf.csrf import CSRFProtect
from werkzeug.exceptions import BadRequest, Forbidden, NotFound, Unauthorized

import kioskglobals
import kiosklib
import kioskstdlib
from kioskconfig import KioskConfig
from kioskmenuitem import KioskMenuItem
from kioskthread import KioskThread
from kioskuser import KioskUser
from messaging.systemmessage import SystemMessage
from messaging.systemmessagecatalog import *
from messaging.systemmessagelist import SystemMessages


def basic_initialization(config_file):
    # Initialize logging and settings
    kioskglobals.cfg = KioskConfig.get_config({'config_file': config_file,
                                               'base_path': kioskglobals.root_path})
    try:
        if kioskglobals.cfg.config["no_console"]:
            f = open(os.devnull, 'w')
            sys.stdout = f
    except:
        pass
    print("\n*****************************")
    if not kioskglobals.cfg:
        raise Exception("! Kiosk's configuration file is not accessible.")
    else:
        # todo: What is that about? Test mode in regular mode? Makes no sense.
        print("Using configuration in " + kioskglobals.cfg.get_configfile())
        if kioskglobals.cfg.is_test_config():
            kioskglobals.cfg = None
            raise Exception(f"! Configuration file {config_file} "
                            f"is a test configuration (test_mode is set to true!). "
                            f"A test configuration is not allowed in regular mode.")

    print("\nFlask Version {}".format(flask.__version__))
    print("\nURAP Kiosk Version " + str(kioskglobals.kiosk_version))
    print("from " + str(kioskglobals.kiosk_date))
    print("on database " + kioskglobals.cfg.config["database_name"])
    try:
        if "TESTING" in kioskglobals.cfg["Flask"] and kioskglobals.cfg["Flask"]:
            print("Flask in mode TESTING \n")
    except:
        pass
    kioskglobals.cfg["kiosk"]["global_constants"]["kiosk_version"] = kioskglobals.kiosk_version
    kioskglobals.cfg["kiosk"]["global_constants"]["kiosk_nickname"] = kioskglobals.kiosk_version_name
    try:
        kioskglobals.development = copy(kioskglobals.cfg["development"])
        if kioskglobals.development:
            color = kioskstdlib.try_get_dict_entry(kioskglobals.get_config().kiosk, "terminal_accent_color_ansi",
                                                   "[31;1m")
            print(f"\n\u001b{color}")
            print("***************************** \n")
            print("Development options are active: ")
            print(kioskglobals.cfg["development"])
            if kioskglobals.get_development_option("webapp_development").lower() == "true":
                print("! Kiosk is in webapp development mode: Checking CSRF and Authorization are switched off ! ")
                print("! Don't do that on a production server ! ")
            print("*****************************")
            print("\u001b[0m")
    except KeyError as e:
        pass

    return kioskglobals.cfg


def init_app_related_stuff(app):
    try:
        app.config["SECRET_KEY"] = kioskglobals.cfg.kiosk["SECRET_KEY"]
        # if app.debug:
        #     print("************** Flask in mode DEBUG ***************+ \n")
        #     kioskglobals.debug = True
        # if app.env == "development":
        #     print("************** Flask in DEVELOPMENT ENVIRONMENT ***************+ \n")
        #     kioskglobals.development = True
    except Exception as e:
        print("Exception " + repr(e) + ": NO SECRET KEY CONFIGURED, WILL BE DEV! WHY NOT USE " + str(uuid4()))
        logging.warning("Exception " + repr(e) + ": NO SECRET KEY CONFIGURED, WILL BE DEV! WHY NOT USE " + str(uuid4()))
        app.config['SECRET_KEY'] = "dev"

    cfg: KioskConfig = kioskglobals.cfg

    if kioskglobals.get_development_option("webapp_development").lower() == "true":
        app.config['WTF_CSRF_ENABLED'] = False
    # if kiosklib.is_local_server(cfg):
    #     app.config['WTF_CSRF_METHODS'] = []
    #     app.config['WTF_CSRF_ENABLED'] = False

    if not app.config['WTF_CSRF_ENABLED']:
        logging.warning("ini_app_related_stuff: CSRF protection is switched off")
        app.config['WTF_CSRF_METHODS'] = []

    kioskglobals.csrf = CSRFProtect(app)


    template_loader = jinja2.ChoiceLoader([
        app.jinja_loader,
        jinja2.FileSystemLoader([cfg.resolve_symbols(cfg.kiosk["template_path"]), ]),
    ])
    app.jinja_loader = template_loader

    logging.info("creating KioskThread")
    kioskglobals.kiosk_thread = KioskThread()

    register_context_processors(app)

    register_error_handlers(app)


def register_error_handlers(app):
    app.register_error_handler(CSRFError, handle_csrf_error)
    app.register_error_handler(Unauthorized, handle_401_error)
    app.register_error_handler(BadRequest, handle_400_error)
    app.register_error_handler(NotFound, handle_404_error)
    app.register_error_handler(Forbidden, handle_403_error)


def register_context_processors(app):
    app.template_context_processors[None].append(inject_menu)
    app.template_context_processors[None].append(inject_global_constants)
    app.template_context_processors[None].append(inject_global_scripts)
    app.template_context_processors[None].append(inject_routes)
    app.template_context_processors[None].append(inject_system_messages)
    app.template_context_processors[None].append(inject_system_information)


def handle_csrf_error(e):
    if "X-Requested-With" in request.headers and request.headers["X-Requested-With"] == "XMLHttpRequest":
        logging.error(f"CSRF ERROR during ajax call: {e.description}!")
        json = {"result": "csrf failure",
                "html_error": f"<div>Your session has timed out."
                              f"<a href=\"{url_for('login_controller.logout')}\">"
                              f"Please try a fresh login.</a></div>"
                }
        response = make_response(jsonify(json))
        response.headers['X-kiosk-error'] = "csrf error"

        return response
    else:
        logging.error(f"CSRF ERROR during non-ajax call: {e.description}! URL was {request.url}.")
        return render_template('error_csrf.html', reason=e.description), 400


def handle_400_error(e):
    logging.error(f"400 ERROR: {e.description} with url {request.url}.")
    return render_template('error_400.html', reason=e.description), 400


def handle_401_error(e):
    logging.error(f"401 ERROR: {e.description} with url {request.url}.")
    return render_template('error_401.html', reason=e.description), 401


def handle_404_error(e):
    logging.error(f"404 ERROR: {e.description} with url {request.url}.")
    return render_template('error_404.html', reason=e.description), 404


def handle_403_error(e):
    logging.error(f"403 ERROR: {e.description} with url {request.url}")
    return render_template('error_403.html', reason=e.description, error=403), 403


def inject_menu():
    current_main_menu = []
    current_rel_menu = []

    m: KioskMenuItem
    for m in kioskglobals.menu:
        if m.is_active():
            if m.get_parent_menu_name():
                current_rel_menu.append(m)
            else:
                current_main_menu.append(m)

    return dict(menu=sorted(current_main_menu, key=lambda m: m.order) + sorted(current_rel_menu, key=lambda m: m.order))


def inject_global_constants():
    return dict(global_constants=kioskglobals.get_global_constants(),
                project_id=kioskglobals.cfg.get_project_id())


def inject_routes():
    return dict(published_routes=kioskglobals.url_for_publisher.get_script())


# @app.context_processor
def inject_global_scripts():
    return dict(global_sync_scripts=kioskglobals.script_manager.get_synchronous_scripts_tags(),
                global_async_scripts=kioskglobals.script_manager.get_asynchronous_scripts_script())


def inject_system_information():
    if kioskglobals.get_development_option("show_system_informaton").lower() == "true":
        return dict(
            sys_info={
                "pid": os.getpid(),
                "tid": threading.current_thread().ident
            }
        )
    else:
        return dict()


def inject_system_messages():
    change_mark = 0
    try:
        if kioskglobals.get_development_option("suppress_system_messages").lower() == "true":
            return dict(system_messages=[], sys_msgs_change_mark=0)
        else:
            system_messages = kioskglobals.system_messages.get_messages()
            change_mark = kioskglobals.system_messages.change_mark
            # print(f"relevant: {system_messages.relevant_messages}, appearing:{system_messages.appearing_messages}")
            if current_user and hasattr(current_user, "message_threshold"):
                group_threshold, user_threshold = current_user.message_threshold
                system_messages.set_thresholds(group_threshold=group_threshold, user_threshold=user_threshold)
                system_messages.set_user_information(user_groups=current_user.groups, user_id=current_user.user_id)
            # for msg in system_messages.messages():
            #     msg: SystemMessage
            #     print(f'system_message {msg.uid}: {msg.deleted}')
    except BaseException as e:
        logging.error(f"initkiosk.inject_system_messages: Exception {repr(e)}")
        message = SystemMessage()
        message.message_id = SYS_MSG_ID_MESSAGING_CORRUPT
        message.message_class = SYS_MSG_CLASS_ERROR
        message.headline = "system messaging is corrupted."
        message.body = "There might be errors but they cannot be accessed or displayed." \
                       "An admin needs to look into that."
        message.severity = MSG_SEVERITY_ERROR
        message.sender = "initkiosk.inject_system_messages"
        system_messages = SystemMessages([message])

    return dict(system_messages=system_messages, sys_msgs_change_mark=change_mark)
