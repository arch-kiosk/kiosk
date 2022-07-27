from flask_wtf import FlaskForm
from wtforms.fields import HiddenField

from core.kioskwtforms import KioskGeneralFormErrors, KioskLabeledPrettyCheckboxField


class KioskReportingVariablesForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    zip_output_files = KioskLabeledPrettyCheckboxField(label="ZIP output files")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
