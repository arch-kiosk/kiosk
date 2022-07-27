from flask_wtf import FlaskForm
from os import path
from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError
from core.kioskwtforms import KioskLabeledPrettyCheckboxField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField, KioskLabeledTextAreaField


class SyncOptionsForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    so_rewire_duplicates = KioskLabeledPrettyCheckboxField(label="if an image is a duplicate, rewire it.", default=True)
    so_drop_duplicates = KioskLabeledPrettyCheckboxField(label="if an image is a duplicate, drop it.")
    so_ignore_file_issues = KioskLabeledPrettyCheckboxField(label="if an image cannot be imported, drop it")
    so_safe_mode = KioskLabeledPrettyCheckboxField(label="Safe mode: Don't delete anything. ")
    so_housekeeping = KioskLabeledPrettyCheckboxField(label="do some housekeeping, too. ", default=True)
