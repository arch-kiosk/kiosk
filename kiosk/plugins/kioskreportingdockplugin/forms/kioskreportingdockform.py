import os
import re

from flask_wtf import FlaskForm
from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError

from core.kioskwtforms import KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField
from reportingdock.reportingengine import ReportingEngine


class KioskReportingDockForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    workstation_id = KioskLabeledStringField(label="unique workstation id",
                                             validators=[Length(3, 20, "Please enter a workstation id"
                                                                       "with at least 3 and not more than 20 characters"),
                                                         DataRequired(
                                                             "A workstation id is really required")],

                                             )
    description = KioskLabeledStringField(label="descriptive name",
                                          validators=[Length(min=3, message="Please enter a descriptive name with at "
                                                                            "least 3 characters"),
                                                      DataRequired(
                                                          "You really want a descriptive name")], )

    query_definition_filename = KioskLabeledSelectField(label="report definition",
                                                        )

    mapping_definition_filename = KioskLabeledSelectField(label="mapping instructions",
                                                          )

    template_file = KioskLabeledSelectField(label="template for report",
                                            )

    output_file_prefix = KioskLabeledStringField(label="prefix for report filenames", )

    def validate_output_file_prefix(self, field):
        self.output_file_prefix.data = self.output_file_prefix.data.strip()
        if self.output_file_prefix.data:
            if len(self.output_file_prefix.data) > 19:
                raise ValidationError("Please enter a prefix shorter than 20 characters.")
            if not re.match('^([A-Za-z0-9]*)$', self.output_file_prefix.data):
                raise ValidationError("Please enter a prefix with only alphanumerical characters.")

    def validate_query_definition_filename(self, field):
        query_definition_file = os.path.join(ReportingEngine.get_reporting_path(), self.query_definition_filename.data)
        try:
            ReportingEngine.check_query_definition(query_definition_file)
        except BaseException as e:
            raise ValidationError(f"{self.query_definition_filename.data} "
                                  f"is not a valid query definition file: {repr(e)}")

    def validate_mapping_definition_filename(self, field):
        mapping_definition_file = os.path.join(ReportingEngine.get_reporting_path(),
                                               self.mapping_definition_filename.data)
        try:
            ReportingEngine.check_mapping_definition(mapping_definition_file)
        except BaseException as e:
            raise ValidationError(f"{self.mapping_definition_filename.data} "
                                  f"is not a valid mapping instruction: {repr(e)}")

    def __init__(self, mode,
                 query_definition_filenames,
                 mapping_definition_filenames,
                 template_files,
                 *args, **kwargs):
        super().__init__(*args, **kwargs)
        if mode == "edit":
            self.workstation_id.render_kw = {'disabled': ''}

        query_definition_filenames.sort()
        self.query_definition_filename.choices = list(query_definition_filenames)

        mapping_definition_filenames.sort()
        self.mapping_definition_filename.choices = list(mapping_definition_filenames)

        template_files.sort()
        self.template_file.choices = list(template_files)
