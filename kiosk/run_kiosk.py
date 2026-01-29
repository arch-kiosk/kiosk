import logging
import threading
import os
import sys
import inspect
import argparse
from flask import request

from cheroot.wsgi import Server
from cheroot.ssl.builtin import BuiltinSSLAdapter

import kioskstdlib
from publickioskappfactory import create_public_kiosk_app
from sync_config import SyncConfig

# Add the parent directory to sys.path so we can import 'kiosk'
# even when running from inside the folder or the parent.
current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from kioskappfactory import create_app

class EOFProtocolFilter(logging.Filter):
    def filter(self, record):
        # Return False to prevent the log from being printed
        if "EOF occurred in violation of protocol" in record.getMessage():
            print("EOF occured")
            return False
        return True

# --- 1. THE REDIRECTOR (PORT 80) ---
def redirect_to_https(environ, start_response):
    host = environ.get('HTTP_HOST', 'x1lk.lan')
    path = environ.get('PATH_INFO', '')
    query = environ.get('QUERY_STRING', '')
    new_url = f"https://{host}{path}"
    if query:
        new_url += f"?{query}"
    start_response('301 Moved Permanently', [('Location', new_url)])
    print("redirecting to HTTPS...")
    return [b"Redirecting to HTTPS..."]

def get_public_kiosk_app():
    filename = inspect.getframeinfo(inspect.currentframe()).filename
    root_path = os.path.dirname(os.path.abspath(filename))
    return create_public_kiosk_app(root_path)


def get_kiosk_app():
    filename = inspect.getframeinfo(inspect.currentframe()).filename
    root_path = os.path.dirname(os.path.abspath(filename))
    return create_app(root_path, "")

def start_server(start_without_https=False):

    logger = logging.getLogger('cheroot.error')
    logger.addFilter(EOFProtocolFilter())
    http_server = Server(('0.0.0.0', 80), get_public_kiosk_app())
    if start_without_https:
        print(f"--- HTTP Kiosk Server Running ---")
        try:
            http_server.start()
        except KeyboardInterrupt:
            http_server.stop()
            return
    else:
        threading.Thread(target=http_server.start, daemon=True).start()
        print(f"--- HTTP Kiosk Server Running ---")

    app = get_kiosk_app()

    cfg = SyncConfig.get_config()
    cert_path = cfg.cert_path
    if not os.path.exists(cert_path):
        logging.error(f"start_server: cert_path not found. Can't start Kiosk at all. Not even in emergency mode.")
        return
    # These paths are relative to where you EXECUTE the command (the parent folder)
    cert_file = os.path.join(cert_path, 'server.crt')
    key_file = os.path.join(cert_path, 'server.key')

    for f in [cert_file, key_file]:
        if not kioskstdlib.file_exists(f):
            logging.error(f"start_server: file {f} not found. Can't start Kiosk at all. Not even in emergency mode.")
            return


    https_server = Server(('0.0.0.0', 443), app)
    https_server.ssl_adapter = BuiltinSSLAdapter(cert_file, key_file)
    https_server.nodelay = True  # Disables Nagle's algorithm (faster small file transfers)
    https_server.numthreads = 20  # Ensure enough threads for parallel resource loading
    https_server.keep_alive_timeout = 10

    print(f"--- Kiosk Production Server Running ---")

    try:
        https_server.start()
    except KeyboardInterrupt:
        https_server.stop()


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description="run_kiosk cli")

    parser.add_argument(
        "--no_https_server",
        action="store_true",
        help="Disable the HTTPS server means: Only run the public http server"
    )

    args = parser.parse_args()
    start_server(args.no_https_server)
