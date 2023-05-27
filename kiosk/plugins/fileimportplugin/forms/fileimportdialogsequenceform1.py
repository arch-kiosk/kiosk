from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError

import kioskstdlib
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField


class SequenceImportForm1(FlaskForm, KioskGeneralFormErrors):

    page_initialized = HiddenField()
    mif_local_path = KioskStringField(validators=[Length(3, 255, "That local path looks wrong."),
                                                       DataRequired(
                                                           "Please select a folder on the master machine to scan.")])
    file_extensions = KioskStringField()
    tags = KioskLabeledStringField(label="assign tags")
    recursive = KioskLabeledBooleanField(label="scan subfolders, too")
    # add_needs_context = KioskLabeledBooleanField(label="import only files with context")
    sort_sequence_by = KioskLabeledSelectField(label="sort sequence by",
                                               validators=[DataRequired(
                                                   "Please select a sort method")]
                                               )
    image_manipulation_set = KioskLabeledSelectField(label="qr code recognition method",
                                                     validators=[DataRequired(
                                                         "Please select the best strategy")]
                                                     )
    use_exif_time = KioskLabeledBooleanField(label="set time of shot from exif data ")

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

    def __init__(self, sort_options, image_manipulation_sets, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.init_lists(sort_options, image_manipulation_sets)

    def init_lists(self, sort_options, image_manipulation_sets):
        """
        Initializes the edit/create form for export KioskFileExportWorkstation
        :param sort_options: a tuple (id, name): Something like [("excel", "Excel"), ("csv", "CSV")]
        :param image_manipulation_sets: someth'n like [("qr_code_sahara", "Sahara"), ("qr_code_peru", "Peruvian light")]
        """
        sort_options.sort()
        self.sort_sequence_by.choices = list(sort_options)

        image_manipulation_sets.sort()
        self.image_manipulation_set.choices = list(image_manipulation_sets)
