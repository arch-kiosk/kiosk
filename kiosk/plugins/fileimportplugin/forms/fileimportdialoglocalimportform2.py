from flask_wtf import FlaskForm

from wtforms.validators import DataRequired, Length
from wtforms.fields import HiddenField
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, KioskGeneralFormErrors


class LocalImportForm2(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    pass
