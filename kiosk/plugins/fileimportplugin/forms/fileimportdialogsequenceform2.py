from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError

import kioskstdlib
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField


class SequenceForm2(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()

    def __init__(self, sort_options, image_manipulation_sets, *args, **kwargs):
        """
        Initializes the edit/create form for export KioskFileExportWorkstation
        :param sort_options: a tuple (id, name): Something like [("excel", "Excel"), ("csv", "CSV")]
        :param image_manipulation_sets: someth'n like [("Sahara", "qr_code_sahara"), ("Peruvian light", "qr_code_peru")]
        :param args:
        :param kwargs:
        """
        super().__init__(*args, **kwargs)

        sort_options.sort()
        self.sort_sequence_by.choices = list(sort_options)

        image_manipulation_sets.sort()
        self.image_manipulation_set.choices = list(image_manipulation_sets)
