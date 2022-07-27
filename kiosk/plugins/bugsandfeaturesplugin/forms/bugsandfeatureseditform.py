from flask_wtf import FlaskForm

from wtforms.fields import HiddenField
from wtforms.validators import DataRequired, Length
from core.kioskwtforms import KioskLabeledBooleanField, KioskStringField, \
    KioskLabeledStringField, KioskGeneralFormErrors, KioskLabeledSelectField, KioskLabeledTextAreaField
from ..models.modelbugsandfeatures import ModelBugsAndFeatures


class BafEditBugForm(FlaskForm, KioskGeneralFormErrors):

    page_initialized = HiddenField()
    where = KioskLabeledStringField(label="where in the system?")
    description = KioskLabeledTextAreaField(label="describe the feature or bug")
    priority = KioskLabeledSelectField(id="baf-priority", label="priority")# KioskLabeledStringField(label="priority")
    state = KioskLabeledSelectField(id="baf-state", label="state")# KioskLabeledStringField(label="state")

    def __init__(self, model_bugs_and_features, *args, **kwargs):
        self.model_bugs_and_features: ModelBugsAndFeatures = model_bugs_and_features
        super().__init__(*args, **kwargs)
        priorities = list(set([("", ""), ("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")] +
                              [(x.lower(), x.lower()) for x in self.model_bugs_and_features.get_priorities()
                              if x and x != "None"]))
        priorities.sort()
        self.priority.choices = priorities

        states = list(set([("", ""), ("fixed: test", "fixed: test"),
                           ("irreproducible", "irreproducible"),
                           ("tested", "tested"), ("done", "done")] +
                          [(x.lower(), x.lower()) for x in self.model_bugs_and_features.get_states() if x and x != "None"]))
        states.sort()
        self.state.choices = states



