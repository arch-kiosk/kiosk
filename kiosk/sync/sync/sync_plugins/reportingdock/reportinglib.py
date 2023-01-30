from kioskquery.kioskquerylib import KioskQueryException


class ReportingException(KioskQueryException):
    pass


class ReportingVoidTransformation(ReportingException):
    pass


IDENTIFIER_VARIABLE_NAME = "context_identifier"
