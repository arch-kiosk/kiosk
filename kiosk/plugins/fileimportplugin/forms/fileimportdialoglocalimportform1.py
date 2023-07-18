from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError

import kioskstdlib
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors


class LocalImportForm1(FlaskForm, KioskGeneralFormErrors):

    page_initialized = HiddenField()
    mif_local_path = KioskStringField(validators=[Length(3, 255, "That local path looks wrong."),
                                                       DataRequired(
                                                           "Please select a folder on the master machine to scan.")])
    file_extensions = KioskStringField()
    tags = KioskLabeledStringField(label="assign tags")
    recursive = KioskLabeledBooleanField(label="scan subfolders, too")
    add_needs_context = KioskLabeledBooleanField(label="import only files with context")
    substitute_identifiers = KioskLabeledBooleanField(label="substitute patterns in identifiers")

    def validate_file_extensions(self, field):
        if field.data:
            extensions = [kioskstdlib.delete_any_of(ext, " *:!%") for ext in field.data.split(",")]
            extensions = [ext[1:] if ext.startswith(".") else ext for ext in extensions]
            new_extensions = ",".join([ext.lower() for ext in extensions if ext])
            if field.data != new_extensions:
                self.file_extensions.data = new_extensions
                raise ValidationError(f"The list of file extensions had some issues that were corrected. "
                                      f"Please double check if the list is what you want. "
                                      f"If so, just click next again.")



