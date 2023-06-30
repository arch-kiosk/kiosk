from flask_wtf import FlaskForm
from os import path
from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError
from core.kioskwtforms import KioskLabeledPrettyCheckboxField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors


class TransferForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    catalog_file = HiddenField()
    transfer_dir = KioskLabeledStringField(label="transfer destination")
    # transfer_file_repository = KioskLabeledPrettyCheckboxField(label="transfer file repository, too")
    # transfer_workstation_files = KioskLabeledPrettyCheckboxField(label="transfer workstation files, too")

    def validate_transfer_dir(self, field):
        if not self.transfer_dir.data.strip():
            raise ValidationError(
                f"Please state a target directory on the host machine where the transfer should be saved.")
        elif not path.isdir(self.transfer_dir.data):
            raise ValidationError(f"Sorry, but the path {self.transfer_dir.data} does not exist on the server.")

