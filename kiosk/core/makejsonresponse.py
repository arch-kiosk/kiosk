import decimal
import logging
from typing import Callable, Union
import datetime

import flask
from flask import Response, jsonify
from flask.json.provider import DefaultJSONProvider

from pluggableflaskapp import current_app


def make_json_response(api_result: dict, json_serial: Callable = None) -> Response:
    """
    Takes a dict that is the api_result and turns it into a Flask JSON Response
    :param api_result:      A Response object for Flask to return
    :param json_serial:     an optional default json method that handles the serialization of json datatypes.
    :return: Response object
    :raises All kinds of Exceptions and a particular Exception if the app's current json provider
            is not a correct json provider.
    """
    original_default: Union[Callable, None] = None

    def _json_serial(obj):
        """JSON serializer for objects not serializable by default json code"""

        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()

        if isinstance(obj, decimal.Decimal):
            return float(obj)

        try:
            return original_default(obj)
        except BaseException as e:
            logging.error(f"make_json_response: Type {type(obj)} not serializable")

        return f"{type(obj)}"

    app = current_app

    if isinstance(app.json, DefaultJSONProvider):
        json_provider: DefaultJSONProvider = app.json
        original_default = json_provider.default
        json_provider.default = json_serial if json_serial else _json_serial
        response = flask.make_response(jsonify(api_result), 200)
        app.json.default = original_default
    else:
        raise Exception(f"make_json_response: The original json provider "
                        f"does not seem to be of type DefaultJSONProvider.")
    return response
