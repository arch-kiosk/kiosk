from flask import Blueprint, request, redirect, render_template, jsonify, \
    flash, url_for, Response, abort
from flask_login import current_user, login_user, logout_user, login_required
from authorization import full_login_required
from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, PasswordField
from wtforms.validators import DataRequired

import logging

from kiosklib import is_ajax_request
from kiosksqldb import KioskSQLDb
from kioskuser import KioskUser
from tz.kiosktimezones import KioskTimeZones

_plugin_name_ = "login_plugin"
_controller_name_ = "login_controller"
_url_prefix_ = '/' + _controller_name_
plugin_version = 0.1

login_plugin = Blueprint(_controller_name_, __name__,
                         template_folder='templates',
                         static_folder="static",
                         # url_prefix=_url_prefix_
                         )


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
            try:
                if str(request.form['user-pwd']).strip() == "" or user.must_change_pwd:
                    return render_template('login.html', no_burger_menu=True, change_password=True)
                else:
                    response = redirect(url_for('get_index'), code=303)
                    return process_client_time_zone(response, user)
            except BaseException as e:
                logging.error(f"login_controller.login: Error when logging you in: {repr(e)}")
                flash(repr(e))
        else:
            logout_user()
            flash('Authentication failed')
    return render_template('login.html', no_burger_menu=True)


def process_client_time_zone(response: Response, user: KioskUser):
    """
    processes the client_iana_time_zone cookie with the client browser's time zone and
    sets the cookies client_tz_index and client_tz_name and kiosk_tz_index and kiosk_tz_name
    :param response: the Flask Response that is about to be sent back to the Browser
    :param user: The logged in Kiosk User
    """
    if "client_iana_time_zone" in request.cookies:
        client_iana_tz = request.cookies.get("client_iana_time_zone")
        kiosk_time_zones = KioskTimeZones()
        client_tz_index = kiosk_time_zones.get_time_zone_index(client_iana_tz)
        client_tz_name = ""
        if client_tz_index:
            client_tz_name = kiosk_time_zones.get_time_zone_info(client_tz_index)[1]
            response.set_cookie("client_tz_index", str(client_tz_index))
            response.set_cookie("client_tz_name", client_tz_name)
        else:
            logging.warning(f"login_controller.process_client_time_zone: "
                            f"could not get a tz index for the client's time zone {client_iana_tz}")

        kiosk_tz_index = client_tz_index
        kiosk_tz_name = client_tz_name
        kiosk_iana_time_zone = client_iana_tz
        user_tz_index = user.get_force_tz_index()
        if user_tz_index:
            try:
                tz_info = kiosk_time_zones.get_time_zone_info(user_tz_index)
                kiosk_tz_name = tz_info[1]
                kiosk_iana_time_zone = tz_info[2]
                kiosk_tz_index = user_tz_index
            except BaseException as e:
                logging.warning(f"login_controller.process_client_time_zone: "
                                f"Error when forcing the user's time zone name: {repr(e)}. "
                                f"Falling back to the client's time zone")

        response.set_cookie("kiosk_tz_index", str(kiosk_tz_index))
        response.set_cookie("kiosk_tz_name", kiosk_tz_name)
        response.set_cookie("kiosk_iana_time_zone", kiosk_iana_time_zone)

        return response
    else:
        raise Exception("It is not possible to determine your Browser's time zone. Please contact support.")


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
        user_id = StringField('User-Id', id="mup-user-id",
                              render_kw={"autocorrect": "off", "autocapitalize": "none", "autocomplete":"off"},
                              validators=[DataRequired()])
        user_name = StringField('Name', id="mup-user-name", validators=[DataRequired()])
        set_password = BooleanField('set password', id="mup-set-password")
        user_password = PasswordField('Password', id="mup-user-password", validators=[],
                                      render_kw={"autocorrect": "off", "autocapitalize": "none", "autocomplete":"off"})
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
                        logging.warning(
                            "user_profile: user with user-id {}: Password could not be set".format(user.user_id))
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


@login_plugin.route('/manage_time_zone/<string:uuid>', methods=['GET', 'POST'])
@login_required
def manage_time_zone(uuid):

    print("\n*************** login_controller/manage_time_zones for user {}".format(uuid))

    if uuid == current_user.id:
        user = current_user
    else:
        user = KioskUser.get(uuid)

    if not user:
        logging.error(f"login_controller.manage_time_zone: user with uuid ${uuid} unknown.")
        abort(403, "cannot authorize user")

    if request.method == 'GET':
        client_tz_name = request.cookies.get("client_iana_time_zone")
        return render_template('usertimezone.html', user=user, client_tz_name=client_tz_name)
    else:
        if not is_ajax_request():
            logging.error(f"login_controller.manage_time_zone: user with uuid ${uuid} tried a POST without Ajax.")
            abort(400, "Bad Request")

        force_tz_index = request.json["force_tz_index"]
        if force_tz_index == 0:
            force_tz_index = None

        if force_tz_index != user.force_tz_index:
            user.force_tz_index = force_tz_index
            if not user.save():
                return jsonify(result="error", message="For some reason the new time zone settings could not be saved")
            else:
                return jsonify(result="ok", message="The changes will take effect when you next log in again.")
        return jsonify(result="ok")


