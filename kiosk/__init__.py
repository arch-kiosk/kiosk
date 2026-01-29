from kioskappfactory import KioskAppFactory, create_app
import inspect
import os.path



filename = inspect.getframeinfo(inspect.currentframe()).filename
root_path = os.path.dirname(os.path.abspath(filename))
app = create_app(root_path=root_path, config_id="")

