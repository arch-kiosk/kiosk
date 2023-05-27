from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField


class KioskFileExportWorkstationForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    workstation_id = KioskLabeledStringField(label="unique dock id",
                                             validators=[Length(3, 20, "Please enter a dock id"
                                                                       "with at least 3 and not more than 20 characters"),
                                                         DataRequired(
                                                             "A dock id is really required")],

                                             )
    description = KioskLabeledStringField(label="descriptive name",
                                          validators=[Length(min=3, message="Please enter a descriptive name with "
                                                                            "at least 3 characters"),
                                                      DataRequired(
                                                          "You really want a descriptive name")], )
    recording_group = KioskLabeledStringField(label="port",
                                              validators=[
                                                  Length(min=3,
                                                         message="Please select an existing port or create a new "
                                                                 "one by giving it a name with at least 3 "),
                                                  DataRequired(
                                                      "A port name is mandatory")]
                                              )
    export_format = KioskLabeledSelectField(label="export format",
                                            validators=[DataRequired(
                                                "Please select an export format.")]
                                            )

    include_files = KioskLabeledBooleanField(label="export files from file repository, too")

    filename_rendering = KioskLabeledSelectField(label="file name rendering",
                                                 validators=[],
                                                 validate_choice=False
                                                 )

    def validate_filename_rendering(self, field):
        if self.include_files.data:
            if not self.filename_rendering:
                raise ValidationError(f"Please select a rendering method "
                                      f"if you choose to include files from the file repository.")

    def __init__(self, mode, export_formats, filename_renderings, *args, **kwargs):
        """
        Initializes the edit/create form for export KioskFileExportWorkstation
        :param mode: if "edit" attributes that cannot be changed will be disabled
        :param export_formats: a tuple (id, name): Something like [("excel", "Excel"), ("csv", "CSV")]
        :param filename_renderings: something like [("uid", "use unique id as filename"), ("descriptive", "render descriptive filenames")]
        :param args:
        :param kwargs:
        """
        super().__init__(*args, **kwargs)
        if mode == "edit":
            self.workstation_id.render_kw = {'disabled': ''}

        export_formats.sort()
        self.export_format.choices = list(export_formats)

        filename_renderings.sort()
        self.filename_rendering.choices = list(filename_renderings)
