from flask_wtf import FlaskForm

from wtforms.validators import DataRequired, Length
from wtforms.fields import HiddenField
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, KioskGeneralFormErrors, \
    KioskLabeledStringField, KioskTimeZoneSelectorField


class UploadForm1(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    tags = KioskLabeledStringField(label="assign tags")
    add_needs_context = KioskLabeledBooleanField(label="import only files with context")
    substitute_identifiers = KioskLabeledBooleanField(label="substitute patterns in identifiers")
    user_time_zone_index = KioskTimeZoneSelectorField(label="time zone for date and time of imported files")
