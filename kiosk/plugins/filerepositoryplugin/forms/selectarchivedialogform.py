from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField, KioskLabeledPrettyCheckboxField


class SelectArchiveDialogForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    selected_archive = KioskLabeledSelectField(label="archive")

    def __init__(self, archives, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.selected_archive.choices = archives
