from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField


class NewWorkstationDefaultForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    workstation_type = KioskLabeledSelectField(label="dock type")
    # workstation_id = KioskLabeledStringField(label="unique workstation id",
    #                                          validators=[Length(3, 20, "Please enter a workstation id"
    #                                                                    "with at least 3 and not more than 20 characters"),
    #                                                      DataRequired(
    #                                                          "A workstation id is really required")])
    # description = KioskLabeledStringField(label="descriptive name")

    def __init__(self, workstation_types, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.workstation_type.choices = workstation_types
