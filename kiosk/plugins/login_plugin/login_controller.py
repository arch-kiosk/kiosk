from flask import Blueprint, request, redirect, render_template, jsonify, \
    flash, url_for
from flask_login import current_user, login_user, logout_user, login_required
from authorization import full_login_required
from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, PasswordField
from wtforms.validators import DataRequired

import logging

from kiosksqldb import KioskSQLDb
from kioskuser import KioskUser

_plugin_name_ = "login_plugin"
_controller_name_ = "login_controller"

login_plugin = Blueprint(_controller_name_, __name__)


@login_plugin.route("/login", methods=['GET', 'POST'])
def login():
    print("\n*************** kiosk_authentication/login")
    try:
        print("static: " + url_for('static', filename='style.css'))
    except Exception as e:
        print(repr(e))

    if request.method == 'POST':
        user = KioskUser.authenticate(request.form['user-id'], request.form['user-pwd'])
        if user:
            login_user(user)
            if str(request.form['user-pwd']).strip() == "" or user.must_change_pwd:
                return render_template('login.html', no_burger_menu=True, change_password=True)
            else:
                return redirect(url_for('get_index'))
        else:
            logout_user()
            flash('Authentication failed')
    return render_template('login.html', no_burger_menu=True)


@login_plugin.route('/logout', methods=['GET', 'POST'])
def logout():
    print("\n*************** kiosk_authentication/logout")
    logout_user()
    return redirect(url_for('get_index'))


@login_plugin.route('/userprofile/<string:uuid>', methods=['GET', 'POST'])
@login_required
def user_profile(uuid):

    class WtfUserProfile(FlaskForm):
        user_uuid = StringField('id')
        user_id = StringField('User-Id', id="mup-user-id", validators=[DataRequired()])
        user_name = StringField('Name', id="mup-user-name", validators=[DataRequired()])
        set_password = BooleanField('set password', id="mup-set-password")
        user_password = PasswordField('Password', id="mup-user-password", validators=[])
        user_password_check = PasswordField('Repeat password', id="mup-user-password-check", validators=[])

        def load_data(self, user):
            self.user_uuid.data = user.id
            self.user_id.data = user.user_id
            self.user_name.data = user.user_name

        def save_data(self, user):
            user.user_id = self.user_id.data
            user.user_name = self.user_name.data
            return user

    print("\n*************** kiosk_authentication/user_profile for user {}".format(uuid))
    user_profile_form = WtfUserProfile()

    if request.method == 'GET':
        if uuid == current_user.id:
            user = current_user
        else:
            user = KioskUser.get(uuid)
        if user:
            user_profile_form.load_data(user)
            return render_template('userprofile.html', form=user_profile_form)
        return ""
    else:
        if not user_profile_form.validate():
            return jsonify(result=user_profile_form.errors)
        else:
            print(user_profile_form.set_password.data)
            user = KioskUser.get(uuid)
            user = user_profile_form.save_data(user)
            if user.save():
                if user_profile_form.set_password.data:
                    if not user.set_password(user_profile_form.user_password.data):
                        logging.warning("user_profile: user with user-id {}: Password could not be set".format(user.user_id))
                        logging.debug("user_profile: KioskSQLDb.Rollback!")
                        KioskSQLDb.rollback()
                        return jsonify(result="exception", msg="Password could not be set.")
                    else:
                        logging.info("user_profile: user with user-id {}: Password set".format(user.user_id))

                KioskSQLDb.commit()
                logging.info("user_profile: user with user-id {}: profile data updated".format(user.user_id))
                return jsonify(result="ok")
            else:
                logging.info("user_profile: KioskSQLDb.Rollback!")
                KioskSQLDb.rollback()
                return jsonify(result="exception", msg="User could not be saved.")
