import logging

import pytest
from psycopg2 import ProgrammingError

from sync_config import SyncConfig
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb
import os
import datetime

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "test_kiosk_config.yml")
log_file = os.path.join(test_path, r"data", "test_log.log")


# @pytest.mark.skip
class TestKioskSQLDb(KioskPyTestHelper):

    @pytest.fixture(scope='module')
    def cfg(self):
        return self.get_standard_test_config(__file__, test_config_file=config_file)

    def test_instantiation(self, cfg):
        cur = KioskSQLDb.get_cursor()
        try:
            cur.execute("drop table if exists images")
            cur.execute("create table if not exists images( uid varchar)")
            cur.execute("insert into images( uid ) values('value')")
            cur.execute("select uid from images")
            value = cur.fetchone()[0]
            cur.close()
        except:
            KioskSQLDb.rollback()
        finally:
            cur.close()
        assert isinstance(value, str)

    def test_execute(self, cfg):
        def execute_sql(commit=False):
            KioskSQLDb.execute("drop table if exists \"test_execute\";", commit=commit)
            KioskSQLDb.execute(
                """create table test_execute
                    (
                        uid uuid,
                        something varchar
                    );

                    create unique index test_execute_uid_uindex
                        on test_execute (uid);

                    alter table test_execute
                        add constraint test_execute_pk
                            primary key (uid);

                    """
            )
            KioskSQLDb.execute(
                "insert into test_execute(uid, something) values('4f9883c9-39c8-4dd7-8550-ca530a92a057', 'something 1')",
                commit=commit)
            KioskSQLDb.execute(
                "insert into test_execute(uid, something) values('8f8070f9-4947-4be1-bbfd-d4cbf743914a','something 2')",
                commit=commit)

        KioskSQLDb.execute("drop table if exists \"test_execute\";", commit=True)
        execute_sql()

        assert KioskSQLDb.get_record_count("test_execute", "uid") == 2
        assert KioskSQLDb.execute("delete from test_execute") == 2
        KioskSQLDb.rollback()
        with pytest.raises(ProgrammingError):
            KioskSQLDb.execute("drop table \"test_execute\";")

        KioskSQLDb.rollback()

        execute_sql(True)
        KioskSQLDb.rollback()
        assert KioskSQLDb.execute("delete from test_execute;") == 2
        KioskSQLDb.execute("drop table \"test_execute\";", commit=True)

    def test_set_autocommit(self, cfg):
        KioskSQLDb.rollback()
        assert not KioskSQLDb.transaction_active()
        KioskSQLDb.execute("drop table if exists images")
        KioskSQLDb.execute("create table if not exists images( uid varchar)")
        assert KioskSQLDb.transaction_active()
        KioskSQLDb.commit()
        assert not KioskSQLDb.transaction_active()
        KioskSQLDb.execute_return_cursor("select 1 \"c\" from images limit 0")
        assert KioskSQLDb.transaction_active()
        KioskSQLDb.commit()
        assert not KioskSQLDb.transaction_active()

        assert KioskSQLDb.set_autocommit(True)
        KioskSQLDb.execute("drop table if exists images")
        KioskSQLDb.execute("create table if not exists images( uid varchar)")
        assert not KioskSQLDb.transaction_active()
        KioskSQLDb.execute_return_cursor("select 1 \"c\" from images limit 0")
        assert not KioskSQLDb.transaction_active()
        assert KioskSQLDb.set_autocommit(False)

        assert not KioskSQLDb.transaction_active()
        KioskSQLDb.execute("drop table if exists images")
        KioskSQLDb.execute("create table if not exists images( uid varchar)")
        assert KioskSQLDb.transaction_active()
        assert not KioskSQLDb.set_autocommit(True)
        KioskSQLDb.rollback()
        assert KioskSQLDb.set_autocommit(True)

    def test_does_view_exist(self, cfg):
        try:
            KioskSQLDb.execute("drop view if exists test_view")
        except BaseException as e:
            KioskSQLDb.execute("drop materialized view if exists test_view")

        assert not KioskSQLDb.does_view_exist("test_view")

        KioskSQLDb.execute("create view test_view as select 1")
        assert KioskSQLDb.does_view_exist("test_view")
        KioskSQLDb.execute("drop view if exists test_view")

        KioskSQLDb.execute("create materialized view test_view as select 1")
        assert not KioskSQLDb.does_view_exist("test_view")
        assert KioskSQLDb.does_view_exist("test_view", materialized_view=True)
        KioskSQLDb.execute("drop materialized view if exists test_view")
        assert not KioskSQLDb.does_view_exist("test_view", materialized_view=True)

    def test_time_zone(self, cfg):
        assert KioskSQLDb.get_first_record_from_sql("select '2023-08-01 16:06:01.000000 +00:00'::timestamptz"
                                                    "")[0] == datetime.datetime(2023, 8, 1, 16, 6, 1,
                                                                                tzinfo=datetime.timezone.utc)

    def test_get_default_time_zone(self, cfg):
        assert KioskSQLDb.get_default_time_zone() == "UTC"
