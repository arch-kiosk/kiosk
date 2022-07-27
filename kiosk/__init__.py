# my first line here should end with LF only
# this should be my second line
from kioskappfactory import KioskAppFactory
import flask
import inspect
import os.path


def create_app(config_id: flask.cli.ScriptInfo):
    filename = inspect.getframeinfo(inspect.currentframe()).filename
    root_path = os.path.dirname(os.path.abspath(filename))
    # This should not be necessary and has never been except one day on meritaten.
    # perhaps one day I find out why.
    static_folder = os.path.join(root_path, "static")
    kiosk_app = KioskAppFactory.create_app(r"{0}\config\kiosk_config.yml".format(root_path), root_path=root_path)
    return kiosk_app


app = create_app(config_id="")

