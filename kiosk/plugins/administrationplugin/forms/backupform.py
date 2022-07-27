from flask_wtf import FlaskForm
from os import path
from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length, ValidationError
from core.kioskwtforms import KioskLabeledPrettyCheckboxField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors


class BackupForm(FlaskForm, KioskGeneralFormErrors):
    page_initialized = HiddenField()
    backup_dir = KioskLabeledStringField(label="backup destination")
    backup_file_repository = KioskLabeledPrettyCheckboxField(label="backup file repository, too")
    # backup_workstation_files = KioskLabeledPrettyCheckboxField(label="backup workstation files, too")

    def validate_backup_dir(self, field):
        if not self.backup_dir.data.strip():
            raise ValidationError(
                f"Please state a target directory on the host machine where the backup should be saved.")
        elif not path.isdir(self.backup_dir.data):
            raise ValidationError(f"Sorry, but the path {self.backup_dir.data} does not exist on the server.")

    # where = KioskLabeledStringField(label="where in the system?")
    # description = KioskLabeledTextAreaField(label="describe the feature or bug")
    # priority = KioskLabeledSelectField(id="baf-priority", label="priority")# KioskLabeledStringField(label="priority")
    # state = KioskLabeledSelectField(id="baf-state", label="state")# KioskLabeledStringField(label="state")
    #
    # def __init__(self, model_bugs_and_features, *args, **kwargs):
    #     self.model_bugs_and_features: ModelBugsAndFeatures = model_bugs_and_features
    #     super().__init__(*args, **kwargs)
    #     priorities = list(set([("", ""), ("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")] +
    #                           [(x.lower(), x.lower()) for x in self.model_bugs_and_features.get_priorities()
    #                           if x and x != "None"]))
    #     priorities.sort()
    #     self.priority.choices = priorities
    #
    #     states = list(set([("", ""), ("fixed: test", "fixed: test"),
    #                        ("irreproducible", "irreproducible"),
    #                        ("tested", "tested"), ("done", "done")] +
    #                       [(x.lower(), x.lower()) for x in self.model_bugs_and_features.get_states() if x and x != "None"]))
    #     states.sort()
    #     self.state.choices = states
