import datetime
import logging
import re
from random import randint

from jinja2 import pass_eval_context
from markupsafe import escape, Markup

import kioskglobals


@pass_eval_context
def newline_to_br(eval_ctx, value: str) -> str:
    # @pass_eval_context
    # def nl2br(eval_ctx, value):
    br = "<br>\n"

    if eval_ctx.autoescape:
        value = escape(value)
        br = Markup(br)

    result = "\n\n".join(
        f"<p>{br.join(p.splitlines())}</p>"
        for p in re.split(r"(?:\r\n|\r(?!\n)|\n){2,}", value)
    )
    return Markup(result) if eval_ctx.autoescape else result

def jinja_fake_version(value: str) -> str:
    if value:
        if value == "kiosk_version":
            from kioskglobals import kiosk_version, is_development_system
            if not is_development_system():
                return f"{hash(kiosk_version)}"

    return f"{randint(1,100)}"

@pass_eval_context
def format_datetime(eval_ctx, value, format='medium'):
    if isinstance(value, str):
        value = datetime.datetime.fromisoformat(value)
    else:
        if not isinstance(value, datetime.datetime):
            logging.error(f"jinjafilters.format_datetime: not a datetime.datetime")
            return value
    if format == 'full':
        return value.strftime("%d %B %Y")
    elif format == 'medium':
        return value.strftime("%d %b %Y")
    else:
        return value.isoformat()
