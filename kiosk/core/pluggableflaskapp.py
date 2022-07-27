from flask import Flask, current_app as flask_current_app

from eventmanager import EventManager
from pluginmanager import PluginManager
from werkzeug.local import LocalProxy


class PluggableFlaskApp(Flask):
    _plugin_manager = None
    _events = None

    def __init__(self, import_name, static_url_path=None, static_folder='static', static_host=None, host_matching=False,
                 subdomain_matching=False, template_folder='templates', instance_path=None,
                 instance_relative_config=False, root_path=None):
        self._project_id = None

        super().__init__(import_name, static_url_path, static_folder, static_host, host_matching, subdomain_matching,
                         template_folder, instance_path, instance_relative_config, root_path)

    def register_plugin_manager(self, plugin_manager: PluginManager):
        if not self._plugin_manager:
            self._plugin_manager = plugin_manager

    def register_event_manager(self, event_manager: EventManager):
        self._events = event_manager

    @property
    def project_id(self):
        return self._project_id

    @project_id.setter
    def project_id(self, value):
        self._project_id = value

    @property
    def plugin_manager(self):
        return self._plugin_manager

    @property
    def events(self):
        return self._events


def get_current_app() -> PluggableFlaskApp:
    return flask_current_app


current_app: PluggableFlaskApp = LocalProxy(get_current_app)
