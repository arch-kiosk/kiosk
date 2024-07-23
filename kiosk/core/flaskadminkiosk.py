from wtforms import SelectField, DateTimeField, TextAreaField, StringField
from wtforms.validators import InputRequired

import kioskglobals
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from flask import request, redirect, url_for
from authorization import MANAGE_USERS, MANAGE_SERVER_PRIVILEGE, selection_of_privileges

import wtforms.fields
import kiosksqlalchemy
from sqlalchemy_models.adminmodel import KioskFilePickingRules
from sqlalchemy_models.adminmodel import KioskQCRules, KioskQCFlags
from sqlalchemy_models.adminmodel import KioskQCRules, KioskFileManagerDirectories
from sqlalchemy_models.adminmodel import KioskFileMakerRecordingConstants
from sqlalchemy_models.adminmodel import KioskQueries


class EmptyStringField(wtforms.fields.StringField):
    def process_data(self, value):
        self.data = value or ''


class UpperCaseField(wtforms.fields.StringField):
    """
    This field auto-uppercases
    """

    def process_data(self, value: str):
        try:
            if value.upper() == "NONE":
                self.data = ""
            else:
                self.data = str(value).upper()
        except BaseException as e:
            self.data = ""

    def _value(self):
        return str(self.data).upper() if self.data is not None else ""

    def post_validate(self, form, validation_stopped):
        if not validation_stopped:
            try:
                self.data = str(self.data).upper()
            except BaseException as e:
                pass

class KioskModelView(ModelView):
    list_template = "admin/list.html"
    create_template = "admin/create.html"
    edit_template = "admin/edit.html"

    def is_accessible(self):
        return current_user.is_authenticated and current_user.fulfills_requirement(MANAGE_USERS)

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login_controller.login', next=request.url))


class UserModelView(KioskModelView):
    form_overrides = {
        'pwd_hash': EmptyStringField,
        'repl_user_id': UpperCaseField
    }
    column_exclude_list = ["pwd_hash"]
    form_excluded_columns = ["pwd_hash"]
    form_args = {
        'user_id': {
            'label': 'short user id',
            'validators': [InputRequired()],
            'description': 'Usually a three digit user id, no special characters, no spaces'

        },
        'groups': {
            'label': 'Group memberships',
            'description': 'list all groups this user belongs to, separated by comma. E.g. "field_worker,operator"'

        },
        'must_change_pwd': {
            'label': 'Change password on next login',
            'description': 'Check if you want the user to change the password on next login.'
        },
        'repl_user_id': {
            'label': 'user id in recording database',
            'validators': [InputRequired()],
            'description': 'The user id recorded when user modifies recording records. '
                           'If in doubt, repeat the short user id'
        },
        'force_tz_index': {
            'label': 'override time zone index with',
            'description': "Set this to a valid Kiosk Time Zone Index only if you want to override the"
                           "Browser's default"
        }

    }


class PrivilegeModelView(KioskModelView):
    form_overrides = {
        'privilege': SelectField
    }

    form_args = {
        'addressee': {
            'label': 'Addressee',
            'validators': [InputRequired()],
            'description': 'The group-id or user-id which will be assigned the privilege'
        },
        'privilege': {
            'label': 'Privilege',
            'description': 'enter a single privilege to assign to the user or group',
            'choices': selection_of_privileges
        },
    }


class FilePickingModelView(KioskModelView):
    form_overrides = {
        'rule_type': SelectField,
        'operator': SelectField
    }

    form_args = {
        'workstation_type': {
            'label': 'Dock Type',
            'validators': [InputRequired()],
            'description': 'The type of dock to which this rule applies. '
                           'E.g. FileMakerWorkstation or FileExportWorkstation'
        },
        'recording_group': {
            'label': 'Port (aka. recording group)',
            'validators': [InputRequired()],
            'description': 'The port to which this rule applies. E.g. "default"'
        },
        'order': {
            'label': 'Rule Order',
            'validators': [InputRequired()],
            'description': 'rules with a higher order win. The lowest order is 0. (The ALL rule needs 0)'
        },
        'rule_type': {
            'label': 'Rule Type',
            'validators': [InputRequired()],
            'description': 'What type of rule do you want to use?',
            'choices': ["ALL", "CONTEXTUALS", "CONTEXT", "RECORD_TYPE", "TAG", "DATE", "FILE_EXTENSION"]
        },
        'operator': {
            'label': 'Operator',
            'description': 'Not all rules support the same operators. Consult the docs.',
            'choices': ["", "=", "IN", "!IN", "HAS", "!HAS", "XIN", "WITHIN", "!WITHIN", "BEFORE", "AFTER"]
        },
        'value': {
            'label': 'Comparandum',
            'description': 'Needs a value that fits the rule type / operator. E.g. WITHIN, BEFORE etc. only work with'
                           'the DATE rule type',
        },
        'resolution': {
            'label': 'Resolution',
            'validators': [InputRequired()],
            'description': '"Dummy" or name of the image resolution to choose if the rule applies. '
                           'Usually something like "low" or "high", depending on your file handling configuration.',
        },

    }


class QCRulesModelView(KioskModelView):
    pass


class QCFlagsModelView(KioskModelView):
    pass


class KioskQueriesView(KioskModelView):
    form_excluded_columns = ["modified", "created"]

    form_overrides = {
        'modified': DateTimeField,
        'created': DateTimeField,
    }


class KioskFileManagerDirectoriesView(KioskModelView):
    form_columns = ('alias', 'description', 'path', "enabled", "privilege_modify", "privilege_read", "server_restart")
    column_display_pk = True

    def is_accessible(self):
        return hasattr(current_user, "fulfills_requirement") and \
               current_user.fulfills_requirement(MANAGE_SERVER_PRIVILEGE)


class KioskFileMakerRecordingConstantsView(KioskModelView):
    form_excluded_columns = ["modified", "created"]

    form_overrides = {
        'modified': DateTimeField,
        'created': DateTimeField,
        'value_ts': DateTimeField,
        'sync': SelectField,
        'value': TextAreaField

    }

    form_args = {
        'sync': {
            'label': 'synchronization type',
            'description': 'defines if values for this key get synchronized. -1 and 0: never, 1=yes',
            'choices': [-1, 0, 1]
        },
    }

    form_widget_args = {
        'value': {
            'style': 'height: 15em'
        }
    }



class KioskAdminRedirectView(AdminIndexView):
    @expose('/')
    def index(self):
        return redirect(url_for('administration.administration_index'))


def init_flask_admin(cfg, app):
    # init flask-admin
    from sqlalchemy_models.adminmodel import KioskUser, KioskPrivilege
    kioskglobals.flask_admin: Admin
    kioskglobals.flask_admin.name = cfg.kiosk["global_constants"]["project_name"]
    kioskglobals.flask_admin.template_mode = 'bootstrap3'
    kioskglobals.flask_admin.init_app(app, index_view=KioskAdminRedirectView())
    kioskglobals.flask_admin.add_view(UserModelView(KioskUser, kiosksqlalchemy.sqlalchemy_db.session))
    kioskglobals.flask_admin.add_view(PrivilegeModelView(KioskPrivilege, kiosksqlalchemy.sqlalchemy_db.session))
    kioskglobals.flask_admin.add_view(
        FilePickingModelView(KioskFilePickingRules, kiosksqlalchemy.sqlalchemy_db.session))
    kioskglobals.flask_admin.add_view(
        QCRulesModelView(KioskQCRules, kiosksqlalchemy.sqlalchemy_db.session))
    kioskglobals.flask_admin.add_view(
        QCFlagsModelView(KioskQCFlags, kiosksqlalchemy.sqlalchemy_db.session))
    kioskglobals.flask_admin.add_view(
        KioskFileManagerDirectoriesView(KioskFileManagerDirectories, kiosksqlalchemy.sqlalchemy_db.session))
    kioskglobals.flask_admin.add_view(
        KioskFileMakerRecordingConstantsView(KioskFileMakerRecordingConstants, kiosksqlalchemy.sqlalchemy_db.session))
    kioskglobals.flask_admin.add_view(
        KioskQueriesView(KioskQueries, kiosksqlalchemy.sqlalchemy_db.session))
