from marshmallow import Schema, fields


class KioskApiError(Schema):
    class Meta:
        fields = ("err",)

    err = fields.Str()


# ***********************************************************************
# ******* /api-info
# ***********************************************************************
class PublicApiInfo(Schema):
    class Meta:
        fields = ("project", "project_name", "kiosk_version_name", "kiosk_version", "api_version")
        ordered = True

    project = fields.Str()
    project_name = fields.Str()
    kiosk_version_name = fields.Str()
    kiosk_version = fields.Str()
    api_version = fields.Str()
