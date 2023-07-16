from flask_wtf import FlaskForm
from os import path
from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError
from core.kioskwtforms import KioskLabeledPrettyCheckboxField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField, KioskLabeledTextAreaField


class RestoreForm(FlaskForm, KioskGeneralFormErrors):

    page_initialized = HiddenField()
    restore_file = KioskLabeledStringField(label="backup file")
    restore_file_repository = KioskLabeledPrettyCheckboxField(label="restore file repository, too")
    keep_users_and_privileges = KioskLabeledPrettyCheckboxField(label="keep current users and privileges")
    restore_new_users = KioskLabeledPrettyCheckboxField(label="restore new users")
    keep_workstations = KioskLabeledPrettyCheckboxField(label="keep current docks and workstations")

    def validate_restore_file(form, field):
        if not form.restore_file.data.strip():
            raise ValidationError(f"Please state the path and filename of the backup file to restore.")
