from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField, KioskLabeledPrettyCheckboxField


class ArchiveDialogForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    marked_images = KioskLabeledPrettyCheckboxField(label="move only marked images")
    filtered_images = KioskLabeledPrettyCheckboxField(label="move all currently filtered images")
    use_existing_archive = KioskLabeledPrettyCheckboxField(label="move files to existing archive")
    selected_archive = KioskLabeledSelectField(label="select archive")
    use_new_archive = KioskLabeledPrettyCheckboxField(label="move files to new archive")
    new_archive = KioskLabeledStringField(label="give the new archive a name")

    def __init__(self, archives, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.selected_archive.choices = archives
