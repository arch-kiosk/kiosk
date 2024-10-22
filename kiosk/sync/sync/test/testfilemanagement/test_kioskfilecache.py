import pytest
import tempfile
import os
import logging
import datetime

from dsd.dsd3singleton import Dsd3Singleton
from kioskfilecachemodel import KioskFileCacheModel
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

from kioskrepresentationtype import KioskRepresentationType
from sync_config import SyncConfig
from uuid import uuid4

from kioskfilecache import KioskFileCache

class TestKioskFileCache(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        # not using , test_config_file="config_kiosk_imagemanagement.yml"
        return self.get_standard_test_config(__file__)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def db_truncate_session(self, urapdb):
        try:
            KioskFileCacheModel.truncate()
        finally:
            return KioskSQLDb

    def test_model(self, db_truncate_session):
        tb_filecache = KioskFileCacheModel()
        tb_filecache.uid = uuid4()
        tb_filecache.uid_file = uuid4()
        tb_filecache.created = datetime.datetime.now()
        tb_filecache.modified = datetime.datetime.now()
        tb_filecache.representation_type = "sometype"
        tb_filecache.add(commit=True)

        assert tb_filecache.count() == 1

    def test_get_nothing_from_cache(self, db_truncate_session):
        cache = KioskFileCache(tempfile.gettempdir())
        assert not cache.get(str(uuid4()), KioskRepresentationType("something"))

    def test_add_to_cache(self, db_truncate_session, tmpdir):
        session = db_truncate_session
        cache_dir = str(tmpdir)
        repr_type = KioskRepresentationType(unique_name="sometype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_dir)
        cache_path = cache.add(uid, repr_type)
        KioskSQLDb.commit()
        assert cache_path
        assert str(cache_path) == str(tmpdir.join(repr_type.unique_name, str(uid)[:2]))
        assert KioskSQLDb.get_record_count("kiosk_file_cache", "uid", "uid_file=%s", [uid]) == 1

    def test_add_to_cache_and_validate(self, db_truncate_session, tmpdir):
        session = db_truncate_session
        cache_dir = str(tmpdir)
        repr_type = KioskRepresentationType(unique_name="sometype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_dir)
        cache_filename = cache.add(uid, repr_type, src_file_extension="jpg")
        assert cache_filename
        expected_filename = str(tmpdir.join(repr_type.unique_name, str(uid)[:2], uid + ".jpg"))
        assert cache_filename == expected_filename
        assert not cache.is_valid(uid, repr_type)

        with open(cache_filename, "w") as f:
            f.write("test")

        assert cache.validate(uid, repr_type) == expected_filename
        assert cache.is_valid(uid, repr_type)

    def test_add_to_cache_and_validate_variation(self, db_truncate_session, tmpdir):
        session = db_truncate_session
        cache_dir = str(tmpdir)
        repr_type = KioskRepresentationType(unique_name="sometype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_dir)
        cache_path = cache.add(uid, repr_type)
        assert cache_path
        assert os.path.isdir(cache_path)
        assert not cache.is_valid(uid, repr_type)

        expected_filename = str(tmpdir.join(repr_type.unique_name, uid + ".jpg"))

        with open(expected_filename, "w") as f:
            f.write("test")

        assert cache.validate(uid, repr_type, expected_filename) == expected_filename
        assert cache.is_valid(uid, repr_type)

    def test_get_file_from_cache(self, db_truncate_session, tmpdir):
        session = db_truncate_session
        cache_dir = str(tmpdir)
        repr_type = KioskRepresentationType(unique_name="sometype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_dir)
        cache_path = cache.add(uid, repr_type)
        assert cache_path
        assert os.path.isdir(cache_path)
        assert not cache.is_valid(uid, repr_type)

        expected_filename = str(tmpdir.join(repr_type.unique_name, uid + ".jpg"))

        with open(expected_filename, "w") as f:
            f.write("test")

        assert cache.validate(uid, repr_type, expected_filename) == expected_filename
        assert cache.is_valid(uid, repr_type)
        assert cache.get(uid, repr_type) == expected_filename

    def test_invalidate(self, db_truncate_session, tmpdir):
        session = db_truncate_session
        cache_dir = str(tmpdir)
        repr_type_1 = KioskRepresentationType(unique_name="sometype")
        repr_type_2 = KioskRepresentationType(unique_name="someothertype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_dir)
        cache_filename_1 = cache.add(uid, repr_type_1, src_file_extension="txt")
        assert cache_filename_1
        cache_filename_2 = cache.add(uid, repr_type_2, src_file_extension="txt")
        assert cache_filename_2

        assert not cache.is_valid(uid, repr_type_1)
        assert not cache.is_valid(uid, repr_type_2)

        for filename in [cache_filename_1, cache_filename_2]:
            with open(filename, "w") as f:
                f.write("test")

        assert cache.validate(uid, repr_type_1) == cache_filename_1
        assert cache.validate(uid, repr_type_2) == cache_filename_2
        assert cache.is_valid(uid, repr_type_1)
        assert cache.is_valid(uid, repr_type_2)

        assert cache.invalidate(uid, repr_type_2)
        assert not cache.is_valid(uid, repr_type_2)
        assert cache.is_valid(uid, repr_type_1)

        assert cache.validate(uid, repr_type_2)
        assert cache.is_valid(uid, repr_type_2)

        assert cache.invalidate(uid)
        assert not cache.is_valid(uid, repr_type_1)
        assert not cache.is_valid(uid, repr_type_2)

    def test_invalidate_all(self, db_truncate_session, tmpdir):
        session = db_truncate_session
        cache_dir = str(tmpdir)
        repr_type_1 = KioskRepresentationType(unique_name="sometype")
        repr_type_2 = KioskRepresentationType(unique_name="someothertype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_dir)
        cache_filename_1 = cache.add(uid, repr_type_1, src_file_extension="txt")
        assert cache_filename_1
        cache_filename_2 = cache.add(uid, repr_type_2, src_file_extension="txt")
        assert cache_filename_2

        assert not cache.is_valid(uid, repr_type_1)
        assert not cache.is_valid(uid, repr_type_2)

        for filename in [cache_filename_1, cache_filename_2]:
            with open(filename, "w") as f:
                f.write("test")

        assert cache.validate(uid, repr_type_1) == cache_filename_1
        assert cache.validate(uid, repr_type_2) == cache_filename_2
        assert cache.is_valid(uid, repr_type_1)
        assert cache.is_valid(uid, repr_type_2)

        assert cache.invalidate()
        assert not cache.is_valid(uid, repr_type_1)
        assert not cache.is_valid(uid, repr_type_2)

    def test_delete_from_cache(self, db_truncate_session, tmpdir):
        def get_representation_type(representation_type_name: str):

            type_name = representation_type_name.lower()
            if type_name == "sometype":
                return KioskRepresentationType(unique_name="sometype")
            elif type_name == "someothertype":
                return KioskRepresentationType(unique_name="someothertype")
            else:
                return None

        session = db_truncate_session
        cache_dir = str(tmpdir)
        repr_type_1 = get_representation_type("sometype")
        repr_type_2 = get_representation_type("someothertype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_base_dir=cache_dir,
                               representation_repository=get_representation_type)
        cache_filename_1 = cache.add(uid, repr_type_1, src_file_extension="txt")
        assert cache_filename_1
        cache_filename_2 = cache.add(uid, repr_type_2, src_file_extension="txt")
        assert cache_filename_2

        assert not cache.is_valid(uid, repr_type_1)
        assert not cache.is_valid(uid, repr_type_2)

        for filename in [cache_filename_1, cache_filename_2]:
            with open(filename, "w") as f:
                f.write("test")

        assert cache.validate(uid, repr_type_1) == cache_filename_1
        assert cache.validate(uid, repr_type_2) == cache_filename_2
        assert cache.is_valid(uid, repr_type_1)
        assert cache.is_valid(uid, repr_type_2)

        assert os.path.isfile(cache_filename_1)
        assert cache.delete_from_cache(uid, repr_type_1)
        assert not cache.is_valid(uid, repr_type_1)

        logging.warning(f"file to delete: {cache_filename_1}")
        assert not os.path.isfile(cache_filename_1)

        cache_filename_1 = cache.add(uid, repr_type_1, src_file_extension="txt")
        for filename in [cache_filename_1]:
            with open(filename, "w") as f:
                f.write("test")
        assert cache.validate(uid, repr_type_1)
        assert os.path.isfile(cache_filename_1)

        assert cache.delete_from_cache(uid)
        assert not cache.is_valid(uid, repr_type_1)
        assert not os.path.isfile(cache_filename_1)
        assert not cache.is_valid(uid, repr_type_2)
        assert not os.path.isfile(cache_filename_2)

    def test_invalidate_cache(self, db_truncate_session, tmpdir):
        session = db_truncate_session
        cache_dir = str(tmpdir)
        repr_type_1 = KioskRepresentationType(unique_name="sometype")
        repr_type_2 = KioskRepresentationType(unique_name="someothertype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_dir)
        cache_filename_1 = cache.add(uid, repr_type_1, src_file_extension="txt")
        cache_filename_2 = cache.add(uid, repr_type_2, src_file_extension="txt")

        for filename in [cache_filename_1, cache_filename_2]:
            with open(filename, "w") as f:
                f.write("test")

        assert cache.validate(uid, repr_type_1) == cache_filename_1
        assert cache.validate(uid, repr_type_2) == cache_filename_2
        assert cache.is_valid(uid, repr_type_1)
        assert cache.is_valid(uid, repr_type_2)

        assert cache.invalidate()
        assert not cache.is_valid(uid, repr_type_1)
        assert not cache.is_valid(uid, repr_type_2)

    def test_repair_cache_filename(self, db_truncate_session, tmpdir):
        session = db_truncate_session
        cache_dir = os.path.join(str(tmpdir), "cache")
        repr_type_1 = KioskRepresentationType(unique_name="sometype")
        repr_type_2 = KioskRepresentationType(unique_name="someothertype")
        uid = str(uuid4())
        cache = KioskFileCache(cache_dir)
        cache_filename_1 = cache.add(uid, repr_type_1, src_file_extension="jpg")
        assert cache_filename_1
        cache_filename_2 = cache.add(uid, repr_type_2, src_file_extension="jpg")
        assert cache_filename_2

        with open(cache_filename_1, "w") as f:
            f.write("test")

        with open(cache_filename_2, "w") as f:
            f.write("test")

        assert cache.validate(uid, repr_type_1)
        assert cache.is_valid(uid, repr_type_1)
        assert cache.validate(uid, repr_type_2)
        assert cache.is_valid(uid, repr_type_2)
        assert cache.get(uid, repr_type_1)
        assert cache.get(uid, repr_type_2)


        new_cache_dir = str(tmpdir + "\\new_cache")
        os.rename(cache_dir, new_cache_dir)
        cache = KioskFileCache(new_cache_dir)
        assert not cache.get(uid, repr_type_1)
        assert not cache.get(uid, repr_type_2)
        cache.repair_cache_filename(uid)
        assert cache.get(uid, repr_type_1)
        assert cache.get(uid, repr_type_2)

    @pytest.mark.skip
    def test_invalidate_cache_delete_files(self):
        # todo
        assert False
