from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, ValidationError
import kioskstdlib
import filecontextutils
import filerepository
import kioskglobals


class ModalFileEditForm(FlaskForm):
    ef_description = TextAreaField(id="ef-description", label='context-independent description')
    ef_tags = StringField(label="tags", id="mef-tags")
    ef_export_filename = StringField(label="file name", id="ef-export-filename")
    ef_file_datetime = StringField(label="date and time of creation (for photos: when was the photo shot?)",
                                   id="ef-file-datetime")

    def __init__(self, file_repos, *args, **kwargs):
        self.file_repos: filerepository.FileRepository = None
        self.set_file_respository(file_repos)
        super().__init__(*args, **kwargs)

    def set_file_respository(self, file_repos):
        self.file_repos = file_repos

    def validate_ef_file_datetime(self, field):
        if field.data:
            fd, msg = kioskstdlib.check_urap_date_time(field.data, allow_date_only=True)
            if not fd:
                raise ValidationError(message=msg)

    def validate_ef_export_filename(self, field):
        if field.data:
            secure_filename = kioskstdlib.urap_secure_filename(field.data, additional_characters=";")
            if secure_filename != field.data:
                raise ValidationError(message=f"The filename you entered contains problematic characters. "
                                              f"Why not use '{secure_filename}'?")
