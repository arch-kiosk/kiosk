from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, ValidationError


class BufFilterForm(FlaskForm):
    buf_view = SelectField(id="buf-view", label="view")

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)

    def init_view_choices(self, views):
        self.buf_view.choices = []
        self.buf_view.choices.extend([(t, t) for t in views])

