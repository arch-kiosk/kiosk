from flask_wtf import FlaskForm
from os import path
from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError
from core.kioskwtforms import KioskLabeledPrettyCheckboxField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField, KioskLabeledTextAreaField


class HousekeepingForm(FlaskForm, KioskGeneralFormErrors):

    page_initialized = HiddenField()
    hk_mark_broken_images = KioskLabeledPrettyCheckboxField(label="mark broken images")
    hk_create_representations = KioskLabeledPrettyCheckboxField(label="create missing representations")
    hk_complete_file_meta_data = KioskLabeledPrettyCheckboxField(label="complete file meta data")
    hk_rewrite_images_record = KioskLabeledPrettyCheckboxField(label="rewrite image records")
    hk_lowercase_filenames = KioskLabeledPrettyCheckboxField(label="set filerepository file names to lowercase")
    hk_quality_check = KioskLabeledPrettyCheckboxField(label="run quality control")
    hk_fts = KioskLabeledPrettyCheckboxField(label="re-create full text search index")
    clear_logs = KioskLabeledPrettyCheckboxField(label="Tidy up log files")


