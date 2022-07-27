from pluggableflaskapp import PluggableFlaskApp
from plugin import Plugin
from inspect import signature


class FlaskAppPlugin(Plugin):
    _app: PluggableFlaskApp = None

    def init_app(self, app, **kwargs):
        self._app = app
        sig = signature(self._package.init_app)
        if len(sig.parameters) > 1:
            self._package.init_app(self._app, **kwargs)
        else:
            self._package.init_app(self._app)
