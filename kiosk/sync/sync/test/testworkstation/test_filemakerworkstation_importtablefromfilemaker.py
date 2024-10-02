# todo time zone simpliciation
import os
import pprint
import shutil
import datetime
from uuid import uuid4
from zoneinfo import ZoneInfo

import pytest

import kioskdatetimelib
from dsd.dsd3 import DataSetDefinition
from filemakerrecording.mockfilemakercontrol import FileMakerControlMock
from kiosksqldb import KioskSQLDb
from test.testhelpers import KioskPyTestHelper

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from tz.kiosktimezoneinstance import KioskTimeZoneInstance
# from tz.kiosktimezones import KioskTimeZones
from test.mock_timezoneinfo import mock_kiosk_time_zones, KioskTimeZones
from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation

test_dir = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_dir, r"data\config\config_test.yml")
log_file = os.path.join(test_dir, r"log\test.log")


class TestFilemakerWorkstation2(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def db(self, config):
        assert KioskSQLDb.drop_database()
        assert KioskSQLDb.create_database()

    def test__import_table_get_update_field_sql(self, db, mock_kiosk_time_zones):
        tz = KioskTimeZoneInstance(kiosk_time_zones=KioskTimeZones())
        tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)

        argv = {
            "f": "modified",
            "data_type": "timestamptz",
            "value": datetime.datetime.fromisoformat("2024-08-01T12:00:00"),
            "value_list": [],
            "tz": tz
        }

        sql = FileMakerWorkstation._import_table_get_update_field_sql(**argv)
        # value_list = [f"'{datetime.datetime.isoformat(x)}'" if isinstance(x, datetime.datetime) else x for x in
        #               argv["value_list"]]
        value_list = argv["value_list"]

        # KioskSQLDb.execute("create temp table sometable(modified timestamp with time zone, modified_tz varchar)")
        cur = KioskSQLDb.get_dict_cursor()
        try:
            cur.execute(f"{sql}", value_list)
        except:
            pass
        assert cur.query == (b"\"modified\"=case "
                             b"when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
                             b"\"modified\" != '2024-08-01T12:00:00+00:00'::timestamptz) "
                             b"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
                             b"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
                             b"THEN '2024-08-01T12:00:00 Europe/Berlin'::timestamptz "
                             b"ELSE \"modified\" END, "
                             b"\"modified_tz\"=case when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
                             b"\"modified\" != '2024-08-01T12:00:00+00:00'::timestamptz) "
                             b"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
                             b"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
                             b"THEN 96554373 ELSE \"modified_tz\" END")

        # test #3

        f = "modified"
        data_type = "varchar"
        value = "my value"
        value_list = []

        sql = FileMakerWorkstation._import_table_get_update_field_sql(f=f,
                                                                      data_type=data_type,
                                                                      value=value,
                                                                      value_list=value_list,
                                                                      tz=tz)

        value_list = [f"'{datetime.datetime.isoformat(x)}'" if isinstance(x, datetime.datetime) else x for x in
                      value_list]
        assert sql % tuple(value_list) == "\"modified\"=my value"

        # test #4

        f = "modified"
        data_type = "timestamp"
        value = datetime.datetime.fromisoformat("2024-08-01T12:00:00")
        value_list = []

        sql = FileMakerWorkstation._import_table_get_update_field_sql(f=f,
                                                                      data_type=data_type,
                                                                      value=value,
                                                                      value_list=value_list,
                                                                      tz=tz)
        value_list = [
            f"'{x.isoformat()}'" if isinstance(x, datetime.datetime) else (f"'{x}'" if isinstance(x, str) else x) for x
            in
            value_list]
        assert sql % tuple(value_list) == ('"modified"=\'2024-08-01T12:00:00\'')

    def test__import_table_get_insert_field_sql(self, mock_kiosk_time_zones):
        tz = KioskTimeZoneInstance(kiosk_time_zones=KioskTimeZones())
        tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)
        tz.recording_tz_index = 27743346  # Mountain Time (US/Mountain)

        argv = {
            "f": "modified",
            "data_type": "timestamptz",
            "value": datetime.datetime.fromisoformat("2024-08-01T12:00:00"),
            "value_list": [],
            "tz": tz
        }

        sql_insert, sql_values = FileMakerWorkstation._import_table_get_insert_field_sql(**argv)
        value_list = [f"{datetime.datetime.isoformat(x)}" if isinstance(x, datetime.datetime) else x
                      for x in argv["value_list"]]
        assert sql_insert == "\"modified\", \"modified_tz\""
        assert sql_values == "%s,%s"
        assert value_list == ['2024-08-01T10:00:00', 96554373]

        ### test 3
        argv = {
            "f": "some_field",
            "data_type": "varchar",
            "value": "some value",
            "value_list": [],
            "tz": tz
        }

        sql_insert, sql_values = FileMakerWorkstation._import_table_get_insert_field_sql(**argv)
        value_list = [f"{datetime.datetime.isoformat(x)}" if isinstance(x, datetime.datetime) else x
                      for x in argv["value_list"]]
        assert sql_insert == "\"some_field\""
        assert sql_values == "%s"
        assert value_list == ['some value']

    @pytest.fixture()
    def prepare__import_table_from_filemaker(self, db, config, mocker, mock_kiosk_time_zones):

        tz = KioskTimeZoneInstance(kiosk_time_zones=KioskTimeZones())
        tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)
        utc_now = kioskdatetimelib.get_utc_now()

        mocker.patch.object(FileMakerWorkstation, "_load",
                            lambda cur=None: True)
        mocker.patch.object(FileMakerWorkstation, "get_fork_time",
                            lambda _: utc_now)
        ws = FileMakerWorkstation("testdock", "test dock")
        ws.recording_group = "default"

        fm = FileMakerControlMock()
        assert fm.start_fm_database(ws, "import", use_odbc_ini_dsn=True)

        dsd = DataSetDefinition()
        dsd.append({"config": {
            "format_version": 3},
            "test_table": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')"],
                        "field1": ["datatype('TEXT')"],
                        "field2": ["datatype('timestamp')"],
                        "modified": ["datatype('timestamp')", "replfield_modified()"],
                        "modified_by": ["datatype('varchar')", "replfield_modified_by()"],
                        "file_proxy": ["datatype(timestamp)", "proxy_for('file')"],
                        "created": ["datatype(timestamptz)", "replfield_created()"],
                        "created_tz": ["datatype(tz)"]
                    }
                }
            }
        })

        KioskSQLDb.execute("""create table kiosk_time_zones(
                            id         integer not null
                                unique,
                            tz_long    varchar,
                            "tz_IANA"  varchar,
                            deprecated boolean,
                            version    integer not null
                        );
                        """)
        KioskSQLDb.execute("""
            INSERT INTO public.kiosk_time_zones (id, tz_long, "tz_IANA", deprecated, version) 
            VALUES (96554373, 'Central European Time (Europe/Berlin)', 'Europe/Berlin', true, 1720205986);
        """)
        KioskSQLDb.execute("""
            INSERT INTO public.kiosk_time_zones (id, tz_long, "tz_IANA", deprecated, version) 
            VALUES (27743346, 'Mountain Time (US/Mountain)', 'US/Mountain', false, 1720205986);
        """)
        KioskSQLDb.execute("""
            INSERT INTO public.kiosk_time_zones (id, tz_long, "tz_IANA", deprecated, version)
            VALUES (45966874, 'Chatham Time (NZ-CHAT)', 'NZ-CHAT', false, 1720205986);
        """)
        KioskSQLDb.execute("create table test_table("
                           "uid uuid, "
                           "field1 varchar, "
                           "field2 timestamp with time zone, "
                           "modified timestamp with time zone, "
                           "modified_by varchar,"
                           "file_proxy timestamp with time zone,"
                           "created timestamp with time zone)")

        return {"dsd": dsd,
                "config": config,
                "ws": ws,
                "fm": fm,
                "tz": tz,
                "utc_now": utc_now
                }

    def test__import_table_get_sqls(self, prepare__import_table_from_filemaker):
        # tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)

        ws: FileMakerWorkstation = prepare__import_table_from_filemaker["ws"]
        prepare__import_table_from_filemaker["tz"].recording_tz_index = None
        fm: FileMakerControlMock = prepare__import_table_from_filemaker["fm"]
        uid1 = uuid4()
        uid2 = uuid4()

        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # modified
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}')")

        fm_cur = fm.select_table_data(prepare__import_table_from_filemaker["dsd"],
                                      "test_table")
        fm_rec = fm_cur.fetchone()
        sql_insert, insert_values, sql_update, update_values = ws._import_table_get_sqls(
            "test_table",
            prepare__import_table_from_filemaker["dsd"],
            "test_table",
            1,
            prepare__import_table_from_filemaker["fm"], fm_rec,
            prepare__import_table_from_filemaker["tz"], uid2)
        print(sql_update)
        assert sql_update == (f'{"WITH"} "iana_time_zones" AS ( SELECT "uid", tz1."tz_IANA"::varchar '
                              'created_tz_iana FROM test_table  left outer join kiosk_time_zones tz1 on '
                              'test_table."created_tz" = tz1.id) UPDATE test_table SET "uid"=%s, '
                              '"field1"=%s, "field2"=%s, "modified"=case when ("modified_tz" is null and '
                              '"modified" != %s) OR ("modified_tz" is not null and "modified" != '
                              '%s::timestamptz) THEN %s::timestamptz ELSE "modified" END, '
                              '"modified_tz"=case when ("modified_tz" is null and "modified" != %s) OR '
                              '("modified_tz" is not null and "modified" != %s::timestamptz) THEN %s ELSE '
                              '"modified_tz" END, "modified_ww"=%s, "modified_by"=%s, "file_proxy"=%s, '
                              '"created"=case when ("iana_time_zones"."created_tz_iana" is null and '
                              '"created" != %s) OR ("iana_time_zones"."created_tz_iana" is not null and '
                              '"created" != (%s || \' \' || '
                              '"iana_time_zones"."created_tz_iana")::timestamptz) THEN %s::timestamptz ELSE '
                              '"created" END, "created_tz"=case when ("iana_time_zones"."created_tz_iana" '
                              'is null and "created" != %s) OR ("iana_time_zones"."created_tz_iana" is not '
                              'null and "created" != (%s || \' \' || '
                              '"iana_time_zones"."created_tz_iana")::timestamptz) THEN %s ELSE "created_tz" '
                              'END, "repl_tag" = 1 FROM "iana_time_zones" WHERE test_table."uid" = '
                              '"iana_time_zones"."uid" AND test_table."uid" = %s')

    def test__import_table_from_filemaker_inserts_only(self, prepare__import_table_from_filemaker):
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # modified -> 
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}')")  # created

        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # modified
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}')")  # created

        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp, "
            "modified timestamp with time zone, "
            "modified_tz int, "
            "modified_ww timestamp, "
            "modified_by varchar,"
            "field2_tz int, "
            "repl_tag int, "
            "file_proxy timestamp, "
            "created timestamp with time zone, "
            "created_tz int, "
            "repl_deleted boolean)")

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2,  "
                                         "modified, modified_tz, modified_ww,"
                                         "file_proxy, "
                                         "created, created_tz "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 10, 0),
                     datetime.datetime(2024, 8, 29, 8, 30, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 10, 30),
                     datetime.datetime(2024, 8, 29, 12, 00),
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),
                     96554373],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 11, 0),
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 11, 30),
                     datetime.datetime(2024, 8, 29, 13, 00),
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     96554373]
                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_legacy_no_change(self, prepare__import_table_from_filemaker):
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp, "
            "modified timestamp with time zone, "
            "modified_tz int, "
            "modified_ww timestamp, "
            "modified_by varchar,"
            "field2_tz int, "
            "repl_tag int, "
            "file_proxy timestamp, "
            "created timestamp with time zone, "
            "created_tz int, "
            "repl_deleted boolean)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, "
            f"modified, modified_tz, modified_ww,"
            f"file_proxy,"
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"null,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, "
            f"modified, modified_tz, modified_ww,"
            f"file_proxy,"
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}', "
            f"null,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}')")
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}')")

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, "
                                         "modified, modified_tz, modified_ww,"
                                         "file_proxy, "
                                         "created, created_tz,"
                                         "modified_by "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 10, 0),
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 10, 30),
                     datetime.datetime(2024, 8, 29, 11, 30),
                     datetime.datetime(2024, 8, 29, 12, 30, tzinfo=datetime.timezone.utc),
                     None,
                     'sys'],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 11, 0),
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 11, 30),
                     datetime.datetime(2024, 8, 29, 12, 30),
                     datetime.datetime(2024, 8, 29, 13, 30, tzinfo=datetime.timezone.utc),
                     None,
                     'sys']
                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_legacy_change(self, prepare__import_table_from_filemaker):
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        # tz_nzchat = 45966874  # Chatham Time (NZ-CHAT)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp, "
            "modified timestamp with time zone, "
            "modified_tz int, "
            "modified_ww timestamp, "
            "modified_by varchar,"
            "field2_tz int, "
            "repl_tag int, "
            "file_proxy timestamp, "
            "created timestamp with time zone, "
            "created_tz int, "
            "repl_deleted boolean)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, "
            f"modified, modified_tz, modified_ww,"
            f"file_proxy,"
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"null,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, "
            f"modified, modified_tz, modified_ww,"
            f"file_proxy,"
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}', "
            f"null,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # -> 96554373, UTC 09:30, _ww=11:30
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}')")
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T14:30:00')}')")  # ->  96554373, UTC 12:30

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, "
                                         "modified, modified_tz, modified_ww,"
                                         "file_proxy, "
                                         "created, created_tz,"
                                         "modified_by "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 10, 0),
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 11, 30),
                     datetime.datetime(2024, 8, 29, 11, 30),
                     datetime.datetime(2024, 8, 29, 12, 30, tzinfo=datetime.timezone.utc),
                     None,
                     'sys'],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 11, 0),
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 11, 30),
                     datetime.datetime(2024, 8, 29, 12, 30),
                     datetime.datetime(2024, 8, 29, 12, 30, tzinfo=datetime.timezone.utc),
                     96554373,
                     'sys']
                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_no_legacy_change(self, prepare__import_table_from_filemaker):
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        # tz_nzchat = 45966874  # Chatham Time (NZ-CHAT)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp, "
            "modified timestamp with time zone, "
            "modified_tz int, "
            "modified_ww timestamp, "
            "modified_by varchar,"
            "field2_tz int, "
            "repl_tag int, "
            "file_proxy timestamp, "
            "created timestamp with time zone, "
            "created_tz int, "
            "repl_deleted boolean)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, "
            f"modified, modified_tz, modified_ww,"
            f"file_proxy,"
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # -> 96554373 12:30 / _WW 23:15
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T23:15:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "  # -> NZ-CHAT 2024-08-30T01:15
            f"45966874,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, "
            f"modified, modified_tz, modified_ww,"
            f"file_proxy,"
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # -> 96554373, 2024-08-29T13:30
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}', "  # -> NZ-CHAT 2024-08-30T02:15
            f"45966874,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "  # -> stays NZ-CHAT, UTC 2024-08-29T10:30:00
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-30T11:16:00')}')")  # -> 96554373, UTC 2024-08-30T09:16:00
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T14:00:00')}', "  # -> 96554373, UTC 2024-08-29T12:00:00
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-30T02:15:00')}')")  # -> stays NZ-CHAT, UTC 2024-08-29T13:30

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, "
                                         "modified, modified_tz, modified_ww,"
                                         "file_proxy, "
                                         "created, created_tz,"
                                         "modified_by "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 10, 0),
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 23, 15),
                     datetime.datetime(2024, 8, 29, 11, 30),
                     datetime.datetime(2024, 8, 30, 9, 16, tzinfo=datetime.timezone.utc),
                     96554373,
                     'sys'],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 12, 0),
                     datetime.datetime(2024, 8, 29, 12, 00, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 14, 00),
                     datetime.datetime(2024, 8, 29, 12, 30),
                     datetime.datetime(2024, 8, 29, 13, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     'sys']
                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_no_legacy_no_changes(self, prepare__import_table_from_filemaker):
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        # tz_nzchat = 45966874  # Chatham Time (NZ-CHAT)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp, "
            "modified timestamp with time zone, "
            "modified_tz int, "
            "modified_ww timestamp, "
            "modified_by varchar,"
            "field2_tz int, "
            "repl_tag int, "
            "file_proxy timestamp, "
            "created timestamp with time zone, "
            "created_tz int, "
            "repl_deleted boolean)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, "
            f"modified, modified_tz, modified_ww,"
            f"file_proxy,"
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # -> 96554373 12:30 / _WW 23:15
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T23:15:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "  # -> NZ-CHAT 2024-08-30T01:15
            f"45966874,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, "
            f"modified, modified_tz, modified_ww,"
            f"file_proxy,"
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # -> 96554373, 2024-08-29T13:30
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-30T00:15:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}', "  # -> NZ-CHAT 2024-08-30T02:15
            f"45966874,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "  # -> stays NZ-CHAT, UTC 2024-08-29T10:30:00
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-30T01:15:00')}')")  # -> stays NZ-CHAT, UTC 2024-08-29T12:30
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}', "  # -> stays NZ-CHAT, UTC 2024-08-29T11:30, _ww=2024-08-30T00:15:00
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-30T02:15:00')}')")  # -> stays NZ-CHAT, UTC 2024-08-29T13:30

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, "
                                         "modified, modified_tz, modified_ww,"
                                         "file_proxy, "
                                         "created, created_tz,"
                                         "modified_by "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 10, 0),
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 23, 15),
                     datetime.datetime(2024, 8, 29, 11, 30),
                     datetime.datetime(2024, 8, 29, 12, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     'sys'],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 12, 0),
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 30, 00, 15),
                     datetime.datetime(2024, 8, 29, 12, 30),
                     datetime.datetime(2024, 8, 29, 13, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     'sys']
                    ]
        expected.sort()
        assert records == expected
