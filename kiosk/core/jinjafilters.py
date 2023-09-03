import datetime
import logging
import re

from jinja2 import pass_eval_context
from markupsafe import escape, Markup


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
