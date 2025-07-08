from functools import wraps

from flask_allows import Requirement
from flask_login import current_user
from kioskuser import KioskUser
from flask import request, current_app, abort
from flask_login.config import EXEMPT_METHODS
from kiosklib import is_ajax_request
import kioskglobals

import logging

ENTER_ADMINISTRATION_PRIVILEGE = "enter administration"
MANAGE_SERVER_PRIVILEGE = "manage server"
BACKUP_PRIVILEGE = "backup"
RESTORE_PRIVILEGE = "restore"
MANAGE_USERS = "manage users"
MODIFY_DATA = "modify data"
DOWNLOAD_FILE = "download file"
DEVELOP_PRIVILEGE = "develop"
SYNCHRONIZE = "synchronize"
INSTALL_PLUGIN = "install plugin"
ARCHIVE_FILES = "archive files"
ENTER_FILE_ARCHIVES = "enter file archives"

# workstation / docks and hub
EDIT_WORKSTATION_PRIVILEGE = "edit workstation"
PREPARE_WORKSTATIONS = "prepare workstation"
DOWNLOAD_WORKSTATION = "download workstation"
UPLOAD_WORKSTATION = "upload workstation"
CREATE_WORKSTATION = "create workstation"
FILE_EXPORT_PRIVILEGE = "file export"
MANAGE_REPORTING = "manage reporting"
OPERATE_REPORTING = "operate reporting"
MANAGE_PORTS = "manage ports"

# All privileges need to be added here so that they can be selected in the administration:
selection_of_privileges = [
    "*",
    ENTER_ADMINISTRATION_PRIVILEGE,
    MANAGE_SERVER_PRIVILEGE,
    BACKUP_PRIVILEGE,
    RESTORE_PRIVILEGE,
    MANAGE_USERS,
    MODIFY_DATA,
    ARCHIVE_FILES,
    ENTER_FILE_ARCHIVES,
    DOWNLOAD_FILE,
    DEVELOP_PRIVILEGE,
    SYNCHRONIZE,
    INSTALL_PLUGIN,
    EDIT_WORKSTATION_PRIVILEGE,
    PREPARE_WORKSTATIONS,
    DOWNLOAD_WORKSTATION,
    UPLOAD_WORKSTATION,
    CREATE_WORKSTATION,
    FILE_EXPORT_PRIVILEGE,
    MANAGE_REPORTING,
    OPERATE_REPORTING,
    MANAGE_PORTS
]

# standard user groups the system addresses explicitly
USER_GROUP_ADMINS = "admins"
USER_GROUP_DEVELOPERS = "developers"

# default groups and privileges
DEFAULT_PRIVILEGES = {
    "field_worker": [DOWNLOAD_WORKSTATION, DOWNLOAD_FILE, UPLOAD_WORKSTATION, MODIFY_DATA],
    "operator": [ENTER_ADMINISTRATION_PRIVILEGE,
                 PREPARE_WORKSTATIONS,
                 CREATE_WORKSTATION,
                 BACKUP_PRIVILEGE,
                 SYNCHRONIZE,
                 EDIT_WORKSTATION_PRIVILEGE,
                 OPERATE_REPORTING,
                 MANAGE_REPORTING,
                 FILE_EXPORT_PRIVILEGE]
}


def full_login_required(func):
    """
    If you decorate a view with this, it will ensure that the current user is
    logged in and authenticated before calling the actual view. (If they are
    not, it calls the :attr:`LoginManager.unauthorized` callback.) For
    example::

        @app.route('/post')
        @full_login_required
        def post():
            pass

    If there are only certain times you need to require that your user is
    logged in, you can do so with::

        if not current_user.is_authenticated:
            return current_app.login_manager.unauthorized()

    ...which is essentially the code that this function adds to your views.

    It can be convenient to globally turn off authentication when unit testing.
    To enable this, if the application configuration variable `LOGIN_DISABLED`
    is set to `True`, this decorator will be ignored.

    .. Note ::

        Per `W3 guidelines for CORS preflight requests
        <http://www.w3.org/TR/cors/#cross-origin-request-with-preflight-0>`_,
        HTTP ``OPTIONS`` requests are exempt from login checks.

    :param func: The view function to decorate.
    :type func: function
    """

    @wraps(func)
    def decorated_view(*args, **kwargs):
        is_ajax = False
        try:
            is_ajax = is_ajax_request()
            if is_ajax and kioskglobals.get_development_option("webapp_development").lower() == "true":
                logging.warning("full_login_required passed because of option 'webapp_development'")
            elif request.method in EXEMPT_METHODS:
                pass
            elif current_app.login_manager._login_disabled:
                pass
            elif not current_user.is_authenticated:
                if is_ajax:
                    abort(403)
                else:
                    return current_app.login_manager.unauthorized()
            elif current_user.must_change_pwd:
                if is_ajax:
                    abort(403)
                else:
                    return current_app.login_manager.unauthorized()

        except BaseException as e:
            if is_ajax:
                abort(403)
            else:
                logging.error(f"authorization.@full_login_required: {repr(e)}")
                return current_app.login_manager.unauthorized()

        return func(*args, **kwargs)

    return decorated_view


def get_local_authorization_strings(local_privilege_dict: dict, param_user: KioskUser = None):
    """
    translates the users current privileges into privilege strings locally used by the
    controller and its templates.

    :param local_privilege_dict: a dictionary mapping global privilege names
           to local names the controller uses within templates. e.G.
           { BACKUP_PRIVILEGE: "backup" }
    :param param_user: Usually it uses current_user of flask_login. If that is not possible (for instance because
           it runs in a separate thread) it needs an explicit KioskUser.
    :return: an array with locally known privilege strings if the user fulfills the
             requirement. Can throw exceptions!
    """
    if param_user:
        user: KioskUser = param_user
    else:
        user: KioskUser = current_user

    if user:
        if hasattr(user, "fulfills_requirement"):  # repr(user).startswith("<kioskuser.KioskUser"):
            return [value for key, value in local_privilege_dict.items() if user.fulfills_requirement(key)]
        else:
            if "AnonymousUserMixin" in user.__class__:
                raise Exception(f"get_local_authorization_strings: user is not logged in.")
            else:
                logging.warning(f"get_local_authorization_strings: current_user is not of type KioskUser but of "
                                f"type {user.__class__}")
                raise Exception(f"get_local_authorization_strings: user is not of type KioskUser: {user}")
    else:
        logging.error(f"get_local_authorization_strings: no current_user. ")
        raise Exception(f"get_local_authorization_strings: no current_user. user is {user}")


def is_authorized(privilege, param_user: KioskUser = None):
    """
    checks whether a user fulfills a privilege

    :param privilege: a global privilege. Do use the constants from the authorization module!
    :param param_user: Usually it uses current_user of flask_login. If that is not possible (for instance because
           it runs in a separate thread) it needs an explicit KioskUser.
    :return: True or False. Can throw exceptions!
    """
    if param_user:
        user: KioskUser = param_user
    else:
        user: KioskUser = current_user

    if user:
        return user.fulfills_requirement(privilege)
    else:
        logging.error(f"is_authorized: current_user is Null")
        raise Exception(f"is_authorized: current_user is Null")


def is_explicitly_authorized(global_privilege, param_user: KioskUser = None):
    """
    checks whether a user fulfills a global_privilege (as opposed to a some privilege)

    :param global_privilege: the privilege. Do use the constants from the authorization module!
    :param param_user: Usually it uses current_user of flask_login. If that is not possible (for instance because
           it runs in a separate thread) it needs an explicit KioskUser.
    :return: True or False. Can throw exceptions!
    """
    if param_user:
        user: KioskUser = param_user
    else:
        user: KioskUser = current_user

    if user:
        return user.fulfills_requirement("explicit_" + global_privilege)
    else:
        logging.error(f"is_explicitly_authorized: current_user is Null")
        raise Exception(f"is_explicitly_authorized: current_user is Null")


class IsAuthorized(Requirement):
    def __init__(self, requirement):
        self.requirement = requirement

    def fulfill(self, user):
        rc = False
        if hasattr(user, "fulfills_requirement"):
            rc = user.fulfills_requirement(self.requirement)
            if not rc:
                logging.debug(f"{self.__class__.__name__}.fulfill: user does not fulfill {self.requirement}")
        else:
            logging.debug(f"{self.__class__.__name__}.fulfill: user object has no fulfills_requirement")
        return rc


class IsExplicitlyAuthorized(Requirement):
    def __init__(self, requirement):
        self.requirement = requirement

    def fulfill(self, user):
        return user.fulfills_requirement("explicit_" + self.requirement) if hasattr(user,
                                                                                    "fulfills_requirement") else False
