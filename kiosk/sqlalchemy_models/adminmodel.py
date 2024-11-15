from kiosksqlalchemy import sqlalchemy_db as db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import DateTime


class KioskUser(db.Model):
    __tablename__ = "kiosk_user"

    db: SQLAlchemy
    uid = db.Column(UUID(as_uuid=True), primary_key=True,
                    unique=True, nullable=False, server_default="gen_random_uuid()")
    user_id = db.Column(db.String(20))
    user_name = db.Column(db.String())
    pwd_hash = db.Column(db.String(), server_default="''")
    repl_user_id = db.Column(db.String())
    groups = db.Column(db.String())
    must_change_pwd = db.Column(db.Boolean())
    force_tz_index = db.Column(db.Integer())


class KioskPrivilege(db.Model):
    __tablename__ = "kiosk_privilege"

    db: SQLAlchemy
    uid = db.Column(UUID(as_uuid=True), primary_key=True,
                    unique=True, nullable=False, server_default="gen_random_uuid()")
    addressee = db.Column(db.String())
    privilege = db.Column(db.String())


class KioskFilePickingRules(db.Model):
    __tablename__ = "repl_file_picking_rules"

    db: SQLAlchemy
    uid = db.Column(UUID(as_uuid=True), primary_key=True,
                    unique=True, nullable=False, server_default="gen_random_uuid()")
    workstation_type = db.Column(db.String(), default="FileMakerWorkstation")
    recording_group = db.Column(db.String(), default="default")
    order = db.Column(db.Numeric(), nullable=False)
    rule_type = db.Column(db.String(), nullable=False)
    operator = db.Column(db.String())
    value = db.Column(db.String())
    resolution = db.Column(db.String(), nullable=False)
    # disable_changes = db.Column(db.Boolean())
    modified_by = db.Column(db.String(), default="sys")


class KioskQCRules(db.Model):
    __tablename__ = "qc_rules"

    db: SQLAlchemy
    uid = db.Column(UUID(as_uuid=True), primary_key=True,
                    unique=True, nullable=False, server_default="gen_random_uuid()")

    id = db.Column(db.String(), nullable=False)
    type = db.Column(db.String(), nullable=False)
    type_param = db.Column(db.String(), nullable=True)
    trigger = db.Column(db.String(), nullable=False)
    hosts = db.Column(db.String(), nullable=True)
    flag = db.Column(db.String(), nullable=True)
    inputs = db.Column(db.String(), nullable=False)
    enabled = db.Column(db.Numeric(), nullable=False)
    modified_by = db.Column(db.String(), default="sys")


class KioskQCFlags(db.Model):
    __tablename__ = "qc_flags"

    db: SQLAlchemy
    uid = db.Column(UUID(as_uuid=True), primary_key=True,
                    unique=True, nullable=False, server_default="gen_random_uuid()")

    id = db.Column(db.String(), nullable=False)
    severity = db.Column(db.String(), nullable=False)
    message = db.Column(db.String(), nullable=False)
    params = db.Column(db.String(), nullable=True)
    fields_involved = db.Column(db.String(), nullable=True)
    modified_by = db.Column(db.String(), default="sys")


class KioskFileManagerDirectories(db.Model):
    __tablename__ = "kiosk_filemanager_directories"

    db: SQLAlchemy

    alias = db.Column(db.String(), primary_key=True, unique=True, nullable=False)
    description = db.Column(db.String(), nullable=False)
    path = db.Column(db.String(), nullable=False)
    enabled = db.Column(db.Boolean())
    privilege_modify = db.Column(db.String(), nullable=True)
    privilege_read = db.Column(db.String(), nullable=True)
    server_restart = db.Column(db.Boolean())


# class KioskFileMakerRecordingConstants(db.Model):
#     __tablename__ = "constants"
#
#     db: SQLAlchemy
#
#     uid = db.Column(UUID(as_uuid=True), primary_key=True,
#                     unique=True, nullable=False, server_default="gen_random_uuid()")
#     id = db.Column(db.String(), unique=True, nullable=False)
#     category = db.Column(db.String(), nullable=False)
#     value = db.Column(db.String(), nullable=True)
#     value_ts = db.Column(db.DateTime(), nullable=True)
#     field_type = db.Column(db.String(), nullable=True)
#     sync = db.Column(db.Numeric(), nullable=True)
#     modified_by = db.Column(db.String(), nullable=False)
#     modified = db.Column(DateTime, nullable=True, onupdate="now()", server_default=func.now())
#     modified_tz = db.Column(DateTime, nullable=True, onupdate="now()", server_default=func.now())
#     created = db.Column(db.DateTime(), nullable=True, server_default=func.now())


# KioskQueries are only there so that queries can be deleted.
class KioskQueries(db.Model):
    __tablename__="kiosk_queries"
    uid = db.Column(UUID(as_uuid=True), primary_key=True,
                    unique=True, nullable=False, server_default="gen_random_uuid()")
    id = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(), nullable=False)
    description = db.Column(db.String())
    query_type = db.Column(db.String())
    privilege_read = db.Column(db.String())
    privilege_write = db.Column(db.String())
    query = db.Column(db.String())
    modified_by = db.Column(db.String(), nullable=False)
    modified = db.Column(db.DateTime(), nullable=True, onupdate="now()", server_default=func.now())
    created = db.Column(db.DateTime(), nullable=True, server_default=func.now())


def test():
    user = KioskUser(user_id="Test 2",
                     user_name="Test name",
                     pwd_hash="",
                     repl_user_id=None,
                     groups=None
                     )
    db.session.add(user)
    db.session.commit()
