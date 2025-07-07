import pytest

from kioskrepresentationtype import KioskRepresentationType
from sync_config import SyncConfig
import logging

from kioskfilecachemodel import KioskFileCacheModel
from uuid import uuid4, UUID
import datetime
import json

from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
import os

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_kiosk_imagemanagement.yml")
log_file = os.path.join(test_path, r"data", "test_log.log")
file_repository = os.path.join(test_path, "data")


class TestKioskFileCacheModel(KioskPyTestHelper):
    @pytest.fixture()
    def db_session(self):
        cfg = self.get_config(config_file=config_file, log_file=log_file, file_repos_path=file_repository,
                              config_class=SyncConfig)
        assert cfg

    @pytest.fixture()
    def truncated_db(self, db_session):
        KioskFileCacheModel().truncate(commit=True)
        return db_session

    def test_init(self):
        fcm = KioskFileCacheModel()
        for f in fcm._fields:
            assert hasattr(fcm, f[0])

        assert not fcm.uid
        assert not fcm.uid_file
        assert not fcm.representation_type
        assert not fcm.invalid
        assert not fcm.created
        assert not fcm.modified
        assert not fcm.image_attributes
        assert not fcm.path_and_filename

    def test_add(self, db_session):
        fcm = KioskFileCacheModel()
        # fcm.uid = str(uuid4())
        fcm.uid_file = str(uuid4())
        fcm.representation_type = "master"
        fcm.invalid = False
        fcm.created = datetime.datetime.now()
        fcm.modified = datetime.datetime.now()
        fcm.image_attributes = {"height": 600, "width": 800}
        fcm.path_and_filename = ".\\somepath\\and\\filename.jpg"
        assert not fcm.uid
        assert fcm.add(commit=True)
        assert fcm.uid
        return fcm.uid

    def test_set_defaults(self, truncated_db):
        fcm = KioskFileCacheModel()
        assert isinstance(fcm.image_attributes, dict)
        assert isinstance(fcm.path_and_filename, str)
        assert fcm.image_attributes is not None
        assert fcm.path_and_filename is not None
        assert fcm.uid_file is None

        fcm = KioskFileCacheModel(test=True)
        assert fcm.image_attributes is None
        assert fcm.path_and_filename is None
        assert fcm.uid_file is None

        fcm = KioskFileCacheModel(uid_file=uuid4(), image_attributes={"max": 15},
                                  path_and_filename=".\\somewhere\\something.jpg")
        assert fcm.image_attributes is not None
        assert fcm.path_and_filename is not None
        assert fcm.image_attributes["max"] == 15
        assert fcm.path_and_filename == ".\\somewhere\\something.jpg"
        assert isinstance(fcm.uid_file, str)

        fcm = KioskFileCacheModel(uid_file='878b1109-14f6-4922-9d69-678695c3831a', image_attributes={"max": 15},
                                  path_and_filename=".\\somewhere\\something.jpg")
        assert fcm.image_attributes is not None
        assert fcm.path_and_filename is not None
        assert fcm.image_attributes["max"] == 15
        assert fcm.path_and_filename == ".\\somewhere\\something.jpg"
        assert fcm.uid_file == '878b1109-14f6-4922-9d69-678695c3831a'

    def test_get(self, truncated_db):
        uid = self.test_add(truncated_db)
        fcm = KioskFileCacheModel()
        assert fcm.get_one("uid=%s", [uid])
        assert fcm.uid == uid
        assert fcm.representation_type == "master"
        assert fcm.image_attributes["height"] == 600
        assert fcm.image_attributes["width"] == 800
        assert fcm.path_and_filename == ".\\somepath\\and\\filename.jpg"
        uid_file = fcm.uid_file

        fcm = KioskFileCacheModel()
        assert fcm.get_one("uid_file=%s and representation_type=%s", [uid_file, 'master'])
        assert fcm.uid == uid
        assert fcm.representation_type == "master"
        assert fcm.image_attributes["height"] == 600
        assert fcm.image_attributes["width"] == 800
        assert fcm.path_and_filename == ".\\somepath\\and\\filename.jpg"

    def test_all(self, truncated_db):
        for _ in range(0, 5):
            assert self.test_add(truncated_db)

        fcm = KioskFileCacheModel()
        assert len(list(fcm.all())) == 5

        fcm = KioskFileCacheModel()
        assert len(list(fcm.all(where="representation_type = %s", params=["master"]))) == 5

    def test_count(self, truncated_db):
        for _ in range(0, 5):
            assert self.test_add(truncated_db)

        fcm = KioskFileCacheModel()
        assert fcm.count() == 5

    def test_update(self, truncated_db):
        uid = self.test_add(truncated_db)

        fcm = KioskFileCacheModel(uid=uid)
        assert fcm.get_by_key()
        assert fcm.uid == uid
        fcm.representation_type = "small"
        fcm.invalid = True
        old_created = fcm.created
        fcm.created = datetime.datetime.now()
        old_modified = fcm.modified
        fcm.modified = datetime.datetime.now()
        fcm.image_attributes = {"height": 200, "width": 100}
        fcm.path_and_filename = ".\\somepath\\and\\someotherfilename.jpg"
        assert fcm.update(commit=True)
        fcm = KioskFileCacheModel(uid=uid)
        assert fcm.get_by_key()
        assert fcm.created == old_created
        assert not fcm.modified == old_modified
        assert fcm.image_attributes["height"] == 200
        assert fcm.image_attributes["width"] == 100

    def test_get_many(self, truncated_db):
        uids = []
        for _ in range(0, 5):
            uid = self.test_add(truncated_db)
            assert uid
            uids.append(uid)

        fcm = KioskFileCacheModel()
        cache_files = fcm.get_many("representation_type=%s", ["master"])
        c = 0
        for f in cache_files:
            assert f.uid in uids
            uids.remove(f.uid)
            c += 1

        assert c == 5

    def test_update_many(self, truncated_db):
        uids = []
        for _ in range(0, 5):
            uid = self.test_add(truncated_db)
            assert uid
            uids.append(uid)

        fcm = KioskFileCacheModel(uid=uid)
        assert fcm.get_by_key()
        assert fcm.uid_file
        assert fcm.representation_type == "master"

        assert fcm.update_many(["representation_type"], ["small"])
        assert fcm.representation_type == "small"

    def test_delete(self, truncated_db):
        uids = []
        for _ in range(0, 5):
            uid = self.test_add(truncated_db)
            assert uid
            uids.append(uid)

        fcm = KioskFileCacheModel(uid=uid)
        assert len(list(fcm.get_many())) == 5
        assert fcm.get_by_key()
        assert fcm.uid_file
        assert fcm.representation_type == "master"

        fcm.delete()
        fcm = KioskFileCacheModel(uid=uid)
        assert not fcm.get_by_key()
        assert len(list(fcm.get_many())) == 4
