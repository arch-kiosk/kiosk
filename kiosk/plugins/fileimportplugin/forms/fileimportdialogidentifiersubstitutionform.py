from flask_wtf import FlaskForm

from wtforms.validators import DataRequired, Length, ValidationError
from wtforms.fields import HiddenField
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, KioskGeneralFormErrors, \
    KioskLabeledStringField
from textsubstitution import TextSubstitutionElement


class IdentifierSubstitutionForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    search_pattern = KioskLabeledStringField(label="this pattern in an identifier shall be substituted")
    replace_with = KioskLabeledStringField(label="it will be substituted with this text")

    def validate_search_pattern(self, field):
        if field.data:
            try:
                tse = TextSubstitutionElement(field.data, "-")
            except BaseException as e:
                raise ValidationError(f"The search pattern is not acceptable ({repr(e)})")

    def validate_replace_with(self, field):
        if not field.data.strip():
            if self.search_pattern.data:
                raise ValidationError(f"Please enter what you intend the search pattern "
                                      f"to be replaced with in an identifier")
