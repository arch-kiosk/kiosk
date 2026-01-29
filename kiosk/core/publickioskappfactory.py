import logging
import os
from http import HTTPStatus
from urllib.parse import urlparse, urlunparse

from flask import Flask, request, redirect, abort, render_template, current_app, make_response, send_file

import kioskdatetimelib
import kioskstdlib
from kioskconfig import KioskConfig

config: KioskConfig = None

def create_public_kiosk_app(root_path):
    global config

    static_folder = os.path.join(root_path, "static")
    pkapp = Flask(__name__, root_path=root_path, static_folder=static_folder)
    # app.config['PROPAGATE_EXCEPTIONS'] = False
    pkapp.config['DEBUG'] = True
    pkapp.config['ROOT_PATH'] = root_path
    EXEMPT_ENDPOINTS = ['index', 'setup', "static", "kioskca"]
    print(f"Is Debug On? {pkapp.debug}")
    print(f"Testing Config: {pkapp.config}")

    @pkapp.before_request
    def force_https():
        # Check if we are on HTTP and the endpoint is NOT in our exempt list
        # Also check 'X-Forwarded-Proto' if you are behind a proxy/load balancer
        is_http = request.scheme == 'http' or request.headers.get('X-Forwarded-Proto') == 'http'

        if is_http and request.endpoint not in EXEMPT_ENDPOINTS:
            logging.debug(f"Public Kiosk App: rerouting {request.url} to https")
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

    pkapp.register_error_handler(400, handle_emergency_error)
    pkapp.register_error_handler(500, handle_emergency_error)
    pkapp.register_error_handler(Exception, handle_emergency_error)
    pkapp.add_url_rule('/', 'index', public_index)
    pkapp.add_url_rule('/setup', 'setup', setup)
    pkapp.add_url_rule('/kioskca', 'kioskca', kioskca)

    config = KioskConfig.get_config({"config_file": os.path.join(pkapp.config["ROOT_PATH"],"config","kiosk_config.yml")})

    # app = Flask.create_app(r"{0}\config\kiosk_config.yml".format(root_path), root_path=root_path)
    # app.config.from_object(cls.FlaskConfigObject(cfg["Flask"]))
    return pkapp


def handle_emergency_error(e):
    description = e.description if hasattr(e, 'description') else repr(e)
    logging.error(f"HTTP ERROR {e.code if hasattr(e, 'code') else '?'}: "
                  f"{description}")
    return kioskstdlib.get_absolute_emergency_html(description), getattr(e, 'code', 500)

def public_index():
    https_link = request.url.replace('http://', 'https://', 1)
    return render_template("publickioskindex.html",
                           global_constants=config.kiosk["global_constants"],
                           https_link=https_link)

def setup():

    parsed = urlparse(request.url)

    https_link = urlunparse((
        'https',
        parsed.netloc,  # keeps domain and port
        '',  # empty path
        '', '', ''  # empty params, query, fragment
    ))

    return render_template("publickiosksetup.html",
                           global_constants=config.kiosk["global_constants"],
                           https_link=https_link)

def kioskca():
    try:
        ca_file = config.root_ca_file
        print(ca_file)
        if not kioskstdlib.file_exists(ca_file):
            raise Exception(f"The CA file {ca_file} is missing for this Kiosk.")

        mime_type = 'text/plain'
        resp = make_response(send_file(ca_file,
                                       mimetype=mime_type,
                                       download_name="kioskca.crt",
                                       as_attachment=True,
                                       etag=kioskdatetimelib.get_utc_now_as_str()))

        resp.headers['Last-Modified'] = str(kioskdatetimelib.get_utc_now().timestamp())
        resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, ' \
                                        'pre-check=0, max-age=0'
        resp.headers['Pragma'] = 'no-cache'
        resp.headers['Expires'] = '-1'
        return resp
    except BaseException as e:
        logging.error(f"public http kiosk/kioskca: {repr(e)}")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR, description=repr(e))




