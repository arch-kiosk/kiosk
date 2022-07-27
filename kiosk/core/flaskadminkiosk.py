import kioskglobals
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from flask import request, redirect, url_for
from authorization import MANAGE_USERS, MANAGE_SERVER_PRIVILEGE
import wtforms.fields
import kiosksqlalchemy
from sqlalchemy_models.adminmodel import KioskFilePickingRules
from sqlalchemy_models.adminmodel import KioskQCRules, KioskQCFlags
from sqlalchemy_models.adminmodel import KioskQCRules, KioskFileManagerDirectories


class EmptyStringField(wtforms.fields.StringField):
    def process_data(self, value):
        self.data = value or ''


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
        'pwd_hash': EmptyStringField
    }
    column_exclude_list = ["pwd_hash"]


class PrivilegeModelView(KioskModelView):
    pass


class FilePickingModelView(KioskModelView):
    pass


class QCRulesModelView(KioskModelView):
    pass


class QCFlagsModelView(KioskModelView):
    pass


class KioskFileManagerDirectoriesView(KioskModelView):
    form_columns = ('alias', 'description', 'path', "enabled", "privilege_modify", "privilege_read", "server_restart")
    column_display_pk = True

    def is_accessible(self):

        return hasattr(current_user, "fulfills_requirement") and \
                       current_user.fulfills_requirement(MANAGE_SERVER_PRIVILEGE)


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
