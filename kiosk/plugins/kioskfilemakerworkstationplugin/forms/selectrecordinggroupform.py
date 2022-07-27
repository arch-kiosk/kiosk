from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField


class SelectRecordingGroupForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    recording_group = KioskLabeledSelectField(label="recording group")

    def __init__(self, recording_groups, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.recording_group.choices = recording_groups
