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
        tz.recording_tz_index = 27743346  # Mountain Time (US/Mountain)

        argv = {
            "f": "modified",
            "data_type": "timestamp",
            "tz_type": "u",
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

        # test #2

        f = "modified"
        data_type = "timestamp"
        tz_type = "r"
        value = datetime.datetime.fromisoformat("2024-08-01T12:00:00")
        value_list = []

        sql = FileMakerWorkstation._import_table_get_update_field_sql(f=f,
                                                                      data_type=data_type,
                                                                      tz_type=tz_type,
                                                                      value=value,
                                                                      value_list=value_list,
                                                                      tz=tz)
        value_list = [
            f"'{x.isoformat()}'" if isinstance(x, datetime.datetime) else (f"'{x}'" if isinstance(x, str) else x) for x
            in
            value_list]
        assert sql % tuple(value_list) == (f"\"modified\"=case "
                                           f"when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
                                           f"\"modified\" != '2024-08-01T12:00:00+00:00') "
                                           f"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
                                           f"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
                                           f"THEN '2024-08-01T12:00:00 US/Mountain'::timestamptz "
                                           f"ELSE \"modified\" END, "
                                           f"\"modified_tz\"=case when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
                                           f"\"modified\" != '2024-08-01T12:00:00+00:00') "
                                           f"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
                                           f"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
                                           f"THEN 27743346 ELSE \"modified_tz\" END")

        # test #3

        f = "modified"
        data_type = "varchar"
        tz_type = None
        value = "my value"
        value_list = []

        sql = FileMakerWorkstation._import_table_get_update_field_sql(f=f,
                                                                      data_type=data_type,
                                                                      tz_type=tz_type,
                                                                      value=value,
                                                                      value_list=value_list,
                                                                      tz=tz)

        value_list = [f"'{datetime.datetime.isoformat(x)}'" if isinstance(x, datetime.datetime) else x for x in
                      value_list]
        assert sql % tuple(value_list) == "\"modified\"=my value"

        # test #4

        f = "modified"
        data_type = "timestamp"
        tz_type = None
        value = datetime.datetime.fromisoformat("2024-08-01T12:00:00")
        value_list = []

        sql = FileMakerWorkstation._import_table_get_update_field_sql(f=f,
                                                                      data_type=data_type,
                                                                      tz_type=tz_type,
                                                                      value=value,
                                                                      value_list=value_list,
                                                                      tz=tz)
        value_list = [
            f"'{x.isoformat()}'" if isinstance(x, datetime.datetime) else (f"'{x}'" if isinstance(x, str) else x) for x
            in
            value_list]
        assert sql % tuple(value_list) == (f"\"modified\"=case "
                                           f"when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
                                           f"\"modified\" != '2024-08-01T12:00:00+00:00') "
                                           f"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
                                           f"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
                                           f"THEN '2024-08-01T12:00:00 US/Mountain'::timestamptz "
                                           f"ELSE \"modified\" END, "
                                           f"\"modified_tz\"=case when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
                                           f"\"modified\" != '2024-08-01T12:00:00+00:00') "
                                           f"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
                                           f"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
                                           f"THEN 27743346 ELSE \"modified_tz\" END")

    def test__import_table_get_insert_field_sql(self, mock_kiosk_time_zones):
        tz = KioskTimeZoneInstance(kiosk_time_zones=KioskTimeZones())
        tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)
        tz.recording_tz_index = 27743346  # Mountain Time (US/Mountain)

        argv = {
            "f": "modified",
            "data_type": "timestamp",
            "tz_type": "u",
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

        ### test 2
        argv = {
            "f": "modified",
            "data_type": "timestamp",
            "tz_type": "r",
            "value": datetime.datetime.fromisoformat("2024-08-01T12:00:00"),
            "value_list": [],
            "tz": tz
        }

        sql_insert, sql_values = FileMakerWorkstation._import_table_get_insert_field_sql(**argv)
        value_list = [f"{datetime.datetime.isoformat(x)}" if isinstance(x, datetime.datetime) else x
                      for x in argv["value_list"]]
        assert sql_insert == "\"modified\", \"modified_tz\""
        assert sql_values == "%s,%s"
        assert value_list == ['2024-08-01T18:00:00', 27743346]

        ### test 3
        argv = {
            "f": "some_field",
            "data_type": "varchar",
            "tz_type": None,
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

        ### test 4
        argv = {
            "f": "modified",
            "data_type": "timestamp",
            "tz_type": None,
            "value": datetime.datetime.fromisoformat("2024-08-01T12:00:00"),
            "value_list": [],
            "tz": tz
        }

        sql_insert, sql_values = FileMakerWorkstation._import_table_get_insert_field_sql(**argv)
        value_list = [f"{datetime.datetime.isoformat(x)}" if isinstance(x, datetime.datetime) else x
                      for x in argv["value_list"]]
        assert sql_insert == "\"modified\", \"modified_tz\""
        assert sql_values == "%s,%s"
        assert value_list == ['2024-08-01T18:00:00', 27743346]

    @pytest.fixture()
    def prepare__import_table_from_filemaker(self, db, config, mocker, mock_kiosk_time_zones):

        tz = KioskTimeZoneInstance(kiosk_time_zones=KioskTimeZones())
        tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)
        tz.recording_tz_index = 27743346  # Mountain Time (US/Mountain)
        utc_now = kioskdatetimelib.get_utc_now()

        mocker.patch.object(FileMakerWorkstation, "_load",
                            lambda cur=None: True)
        mocker.patch.object(FileMakerWorkstation, "get_fork_time",
                            lambda _: utc_now)
        ws = FileMakerWorkstation("testdock", "test dock")
        ws.recording_group = "default"
        # ws.user_time_zone_index = 96554373
        # ws.recording_time_zone_index = 27743346
        # state = self.get_state_from_code(r[1])
        # self.state_machine.set_initial_state(state)

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
                        "created": ["datatype(timestamp)", "replfield_created()"]
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
        ws: FileMakerWorkstation = prepare__import_table_from_filemaker["ws"]
        prepare__import_table_from_filemaker["tz"].recording_tz_index = None
        fm: FileMakerControlMock = prepare__import_table_from_filemaker["fm"]
        uid1 = uuid4()
        uid2 = uuid4()

        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
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
                               'field2_tz_iana, tz2."tz_IANA"::varchar modified_tz_iana, '
                               'tz3."tz_IANA"::varchar file_proxy_tz_iana, tz4."tz_IANA"::varchar '
                               'created_tz_iana FROM test_table  left outer join kiosk_time_zones tz1 on '
                               'test_table."field2_tz" = tz1.id left outer join kiosk_time_zones tz2 on '
                               'test_table."modified_tz" = tz2.id left outer join kiosk_time_zones tz3 on '
                               'test_table."file_proxy_tz" = tz3.id left outer join kiosk_time_zones tz4 on '
                               'test_table."created_tz" = tz4.id) UPDATE test_table SET "uid"=%s, '
                               '"field1"=%s, "field2"=case when ("iana_time_zones"."field2_tz_iana" is null '
                               'and "field2" != %s) OR ("iana_time_zones"."field2_tz_iana" is not null and '
                               '"field2" != (%s || \' \' || '
                               '"iana_time_zones"."field2_tz_iana")::timestamptz) THEN %s::timestamptz ELSE '
                               '"field2" END, "field2_tz"=case when ("iana_time_zones"."field2_tz_iana" is '
                               'null and "field2" != %s) OR ("iana_time_zones"."field2_tz_iana" is not null '
                               'and "field2" != (%s || \' \' || '
                               '"iana_time_zones"."field2_tz_iana")::timestamptz) THEN %s ELSE "field2_tz" '
                               'END, "modified"=case when ("iana_time_zones"."modified_tz_iana" is null and '
                               '"modified" != %s) OR ("iana_time_zones"."modified_tz_iana" is not null and '
                               '"modified" != %s::timestamptz) THEN %s::timestamptz ELSE "modified" END, '
                               '"modified_tz"=case when ("iana_time_zones"."modified_tz_iana" is null and '
                               '"modified" != %s) OR ("iana_time_zones"."modified_tz_iana" is not null and '
                               '"modified" != %s::timestamptz) THEN %s ELSE "modified_tz" END, '
                               '"modified_by"=%s, "file_proxy"=case when '
                               '("iana_time_zones"."file_proxy_tz_iana" is null and "file_proxy" != %s) OR '
                               '("iana_time_zones"."file_proxy_tz_iana" is not null and "file_proxy" != (%s '
                               '|| \' \' || "iana_time_zones"."file_proxy_tz_iana")::timestamptz) THEN '
                               '%s::timestamptz ELSE "file_proxy" END, "file_proxy_tz"=case when '
                               '("iana_time_zones"."file_proxy_tz_iana" is null and "file_proxy" != %s) OR '
                               '("iana_time_zones"."file_proxy_tz_iana" is not null and "file_proxy" != (%s '
                               '|| \' \' || "iana_time_zones"."file_proxy_tz_iana")::timestamptz) THEN %s '
                               'ELSE "file_proxy_tz" END, "created"=case when '
                               '("iana_time_zones"."created_tz_iana" is null and "created" != %s) OR '
                               '("iana_time_zones"."created_tz_iana" is not null and "created" != (%s || \' '
                               '\' || "iana_time_zones"."created_tz_iana")::timestamptz) THEN '
                               '%s::timestamptz ELSE "created" END, "created_tz"=case when '
                               '("iana_time_zones"."created_tz_iana" is null and "created" != %s) OR '
                               '("iana_time_zones"."created_tz_iana" is not null and "created" != (%s || \' '
                               '\' || "iana_time_zones"."created_tz_iana")::timestamptz) THEN %s ELSE '
                               '"created_tz" END, "repl_tag" = 1 FROM "iana_time_zones" WHERE '
                               'test_table."uid" = "iana_time_zones"."uid" AND test_table."uid" = %s')

    def test__import_table_from_filemaker_inserts_only(self, prepare__import_table_from_filemaker):
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        assert prepare__import_table_from_filemaker['tz'].recording_tz_index == 27743346  # Mountain Time (US/Mountain)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # modified
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:00:00')}', "  # proxy
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}')")  # created

        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # modified
            f"'sys', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:00:00')}', "  # proxy
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}')")  # created

        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp with time zone, "
            "modified timestamp with time zone, "
            "modified_tz int, "
            "modified_by varchar,"
            "field2_tz int, "
            "repl_tag int, "
            "file_proxy timestamp with time zone, "
            "file_proxy_tz int, "
            "created timestamp with time zone, "
            "created_tz int, "
            "repl_deleted boolean)")

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, field2_tz, "
                                         "modified, modified_tz, "
                                         "file_proxy, file_proxy_tz, "
                                         "created, created_tz "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 16, 0, tzinfo=datetime.timezone.utc),
                     27743346,
                     datetime.datetime(2024, 8, 29, 8, 30, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 10, 00, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),
                     96554373],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 17, 0, tzinfo=datetime.timezone.utc),
                     27743346,
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 11, 00, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     96554373]
                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_legacy_no_change(self, prepare__import_table_from_filemaker):
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        assert prepare__import_table_from_filemaker['tz'].recording_tz_index == 27743346  # Mountain Time (US/Mountain)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

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

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp with time zone, field2_tz int, "
            "modified timestamp with time zone, modified_tz int, "
            "file_proxy timestamp with time zone, file_proxy_tz int, "
            "created timestamp with time zone, created_tz int, "
            "modified_by varchar,"
            "repl_tag int, repl_deleted boolean)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, f"
            f"ield2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"null,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}', "
            f"null,"
            f"'sys', null, null)")

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, field2, "
                                         "field2_tz,  "
                                         "modified, modified_tz, "
                                         "file_proxy, file_proxy_tz, "
                                         "created, created_tz,"
                                         "modified_by "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 10, 0, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 12, 30, tzinfo=datetime.timezone.utc),
                     None,
                     'sys'],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 11, 0, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 12, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 13, 30, tzinfo=datetime.timezone.utc),
                     None,
                     'sys']
                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_legacy_change(self, prepare__import_table_from_filemaker):
        # recording_tz different from user_tz
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        assert prepare__import_table_from_filemaker['tz'].recording_tz_index == 27743346  # Mountain Time (US/Mountain)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp with time zone, field2_tz int, "
            "modified timestamp with time zone, modified_tz int, "
            "file_proxy timestamp with time zone, file_proxy_tz int, "
            "created timestamp with time zone, created_tz int, "
            "modified_by varchar,"
            "repl_tag int, repl_deleted boolean)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T07:30:00')}', "  # this must change
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T07:30:00')}', "  # this must change
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T07:30:00')}', "  # this must change
            f"null,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:01')}', "  # this must change
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # Berlin time -> UTC 08:30
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}', "  # Berlin time -> UTC 10:30
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:30:00')}'"  # Berlin time -> UTC 11:30
            f")")
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "  # US/Mountain time -> UTC 17:00
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}'"
            f")")

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, field2_tz, "
                                         "modified, modified_tz, "
                                         "file_proxy, file_proxy_tz, "
                                         "created, created_tz "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 10, 0, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 8, 30, tzinfo=datetime.timezone.utc),  # 08:30
                     96554373,
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),  # 08:30
                     96554373,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),  # 08:30
                     96554373],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 17, 0, tzinfo=datetime.timezone.utc),  # 17:00
                     27743346,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None]

                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_legacy_change_2(self, prepare__import_table_from_filemaker):
        # this time with no recording_tz specified
        # settings are:

        prepare__import_table_from_filemaker["tz"].recording_tz_index = None
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        assert prepare__import_table_from_filemaker['tz'].recording_tz_index == 96554373

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp with time zone, field2_tz int, "
            "modified timestamp with time zone, modified_tz int, "
            "file_proxy timestamp with time zone, file_proxy_tz int, "
            "created timestamp with time zone, created_tz int, "
            "modified_by varchar,"
            "repl_tag int, repl_deleted boolean)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T07:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T07:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T07:30:00')}', "
            f"null,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:01')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"null,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:00:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # Berlin time -> UTC 08:30
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # Berlin time -> UTC 09:30
            f"'{datetime.datetime.fromisoformat('2024-08-29T12:30:00')}'"  # Berlin time -> UTC 10:30
            f")")
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "  # US/Mountain time -> UTC 17:00
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}'"
            f")")

        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, field2_tz, "
                                         "modified, modified_tz, "
                                         "file_proxy, file_proxy_tz, "
                                         "created, created_tz "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 10, 0, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 8, 30, tzinfo=datetime.timezone.utc),  # 08:30
                     96554373,
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),  # 09:30
                     96554373,
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),  # 10:30
                     96554373],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 9, 0, tzinfo=datetime.timezone.utc),  # 09:00
                     96554373,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None,
                     datetime.datetime(2024, 8, 29, 11, 30, tzinfo=datetime.timezone.utc),
                     None]

                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_no_legacy_no_changes(self, prepare__import_table_from_filemaker):
        # this time the shadow table already has a datetime with a tz_index
        # settings are:
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        assert prepare__import_table_from_filemaker['tz'].recording_tz_index == 27743346  # Mountain Time

        # 45966874: NZ-CHAT

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            f"{'create'} table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp with time zone, field2_tz int, "
            "modified timestamp with time zone, modified_tz int, "
            "file_proxy timestamp with time zone, file_proxy_tz int, "
            "created timestamp with time zone, created_tz int, "
            "modified_by varchar,"
            "repl_tag int, repl_deleted boolean)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T16:00:00')}', "  # -> NZ-CHAT 2024-08-30 04:45
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:30:00')}', "  # -> Berlin 10:30
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T09:30:00')}', "  # NZ-CHAT 2024-08-29 22:15 
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # NZ-CHAT 2024-08-29 23:15
            f"45966874,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T17:00:00')}', "  # NZ-CHAT 2024-08-30 05:45
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T09:30:00')}', "  # Berlin 11:30
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T09:30:00')}', "  # NZ-CHAT 2024-08-29 22:15 
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T09:30:00')}', "  # NZ-CHAT 2024-08-29 22:15 
            f"45966874,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-30T04:45:00')}', "  # NZ-CHAT
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # Berlin
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T22:15:00')}', "  # NZ-CHAT
            f"'{datetime.datetime.fromisoformat('2024-08-29T23:15:00')}'"  # NZ-CHAT
            f")")
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-30T05:45:00')}', "  # NZ-CHAT
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # Berlin
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T22:15:00')}', "  # NZ-CHAT
            f"'{datetime.datetime.fromisoformat('2024-08-29T22:15:00')}'"  # NZ-CHAT
            f")")

        KioskSQLDb.commit()
        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, field2_tz, "
                                         "modified, modified_tz, "
                                         "file_proxy, file_proxy_tz, "
                                         "created, created_tz "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 16, 0, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 8, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 10, 30, tzinfo=datetime.timezone.utc),
                     45966874],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 17, 0, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     45966874]
                    ]
        expected.sort()
        assert records == expected

    def test__import_table_from_filemaker_updates_no_legacy(self, prepare__import_table_from_filemaker):
        # this time the shadow table already has a datetime with a tz_index
        # this test is using user time zone for "modified", "created" and "file_proxy" and recording time zone for "field2"
        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        assert prepare__import_table_from_filemaker['tz'].recording_tz_index == 27743346
        # existing kiosk record: tz_nzchat = 45966874  # Chatham Time (NZ-CHAT)

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp with time zone, field2_tz int, "
            "modified timestamp with time zone, modified_tz int, "
            "file_proxy timestamp with time zone, file_proxy_tz int, "
            "created timestamp with time zone, created_tz int, "
            "modified_by varchar,"
            "repl_tag int, repl_deleted boolean)")

        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T15:59:00')}', "   # -> US/Mountain 09:59:00
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "   # -> Berlin 10:29
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "  # -> NZ-CHAT 21:14
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "  # -> NZ-CHAT 21:14
            f"45966874,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T16:59:00')}', " # -> US/Mountain 10:59:00 
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:59')}', " # -> Berlin 10:29:59
            f"45966874," # irrelevant in this case because this is the replfield_modified
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:59')}', " # -> NZ-CHAt 21:14:59
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:59')}', " # -> NZ-CHAt 21:14:59
            f"45966874,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T09:59:00')}', "  # field2, UTC 15:59:00
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # modified, UTC 08:30:00 
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T21:15:00')}', "  # modified, Berlin -> UTC 2024-08-29 19:15 
            f"'{datetime.datetime.fromisoformat('2024-08-29T22:15:00')}'"  # modified, Berlin -> UTC 2024-08-29 20:15
            f")")

        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "  # modified field2, US/Mountain -> UTC 17:00
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:29:59')}', "  # not modified, UTC 08:29:59
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # modified, Berlin -> UTC 9:30
            f"'{datetime.datetime.fromisoformat('2024-08-29T21:14:59')}'"  # not modified -> UTC 08:29:59
            f")")

        KioskSQLDb.commit()
        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])

        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, field2_tz, "
                                         "modified, modified_tz, "
                                         "file_proxy, file_proxy_tz, "
                                         "created, created_tz "
                                         "from testdock_test_table order by field1")

        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 15, 59, tzinfo=datetime.timezone.utc),
                     27743346,
                     datetime.datetime(2024, 8, 29, 8, 30, 0, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 19, 15, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 20, 15, tzinfo=datetime.timezone.utc),
                     96554373],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 17, 0, tzinfo=datetime.timezone.utc),
                     27743346,
                     datetime.datetime(2024, 8, 29, 8, 29, 59, tzinfo=datetime.timezone.utc),
                     45966874,  # remains NZ-CHAT because the value has not changed and so nothing gets updated
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 8, 29, 59, tzinfo=datetime.timezone.utc),
                     45966874]
                    ]
        assert records == expected

    def test__import_table_from_filemaker_updates_no_legacy_tz_type(self, prepare__import_table_from_filemaker):
        # this test is defining the created field as tz_type 'r' to enforce transforming it into Mountain Time
        # as that is not allowed, it should be ignored and 'u' is being used.
        # The field2 is defined as tz_type 'u' to enforce transforming it into User Time
        # and that should happen.

        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        assert prepare__import_table_from_filemaker['tz'].recording_tz_index == 27743346
        # existing kiosk record: tz_nzchat = 45966874  # Chatham Time (NZ-CHAT)

        dsd = DataSetDefinition()
        dsd.append({"config": {
            "format_version": 3},
            "test_table": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')"],
                        "field1": ["datatype('TEXT')"],
                        "field2": ["datatype('timestamp')", "tz_type('u')"],
                        "modified": ["datatype('timestamp')", "replfield_modified()"],
                        "modified_by": ["datatype('varchar')", "replfield_modified_by()"],
                        "file_proxy": ["datatype(timestamp)", "proxy_for('file')"],
                        "created": ["datatype(timestamp)", "replfield_created()", "tz_type('r')"]
                    }
                }
            }
        })

        ws = prepare__import_table_from_filemaker["ws"]
        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp with time zone, field2_tz int, "
            "modified timestamp with time zone, modified_tz int, "
            "file_proxy timestamp with time zone, file_proxy_tz int, "
            "created timestamp with time zone, created_tz int, "
            "modified_by varchar,"
            "repl_tag int, repl_deleted boolean)")

        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T15:59:00')}', "   # -> NZ_CHAT 2024-08-30T04:44:00
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "   # -> Berlin 10:29
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "  # -> NZ-CHAT 21:14
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "  # -> NZ-CHAT 21:14
            f"45966874,"
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T16:59:00')}', " # -> NZ_CHAT 2024-08-30T05:44:00
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:59')}', " # -> Berlin 10:29:59
            f"45966874," # irrelevant in this case because this is the replfield_modified
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:59')}', " # -> NZ-CHAt 21:14:59
            f"45966874,"
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:59')}', " # -> NZ-CHAt 21:14:59
            f"45966874,"
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-30T04:44:00')}', "  # field2 not modified-> UTC 2024-08-29T15:59
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:30:00')}', "  # modified, UTC 08:30:00 
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T21:15:00')}', "  # modified, Berlin -> UTC 2024-08-29 19:15 
            f"'{datetime.datetime.fromisoformat('2024-08-29T22:15:00')}'"  # modified, stays on Berlin -> UTC 2024-08-29 20:15
            f")")

        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:00:00')}', "  # modified, because of tz_type 'u' Berlin -> UTC 09:00
            f"'{datetime.datetime.fromisoformat('2024-08-29T10:29:59')}', "  # not modified, UTC 08:29:59
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T11:30:00')}', "  # modified, Berlin -> UTC 9:30
            f"'{datetime.datetime.fromisoformat('2024-08-29T21:14:59')}'"  # not modified -> UTC 08:29:59
            f")")

        KioskSQLDb.commit()
        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               dsd, "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])

        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, field2_tz, "
                                         "modified, modified_tz, "
                                         "file_proxy, file_proxy_tz, "
                                         "created, created_tz "
                                         "from testdock_test_table order by field1")

        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 15, 59, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 8, 30, 0, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 19, 15, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 20, 15, tzinfo=datetime.timezone.utc),
                     96554373],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 9, 0, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 8, 29, 59, tzinfo=datetime.timezone.utc),
                     45966874,  # remains NZ-CHAT because the value has not changed and so nothing gets updated
                     datetime.datetime(2024, 8, 29, 9, 30, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 8, 29, 59, tzinfo=datetime.timezone.utc),
                     45966874]
                    ]
        assert records == expected

    def test__import_table_from_filemaker_updates_no_legacy_2(self, prepare__import_table_from_filemaker):
        # this time the shadow table already has a datetime wit h a tz_index and there is no recording time zone
        # tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)

        ws = prepare__import_table_from_filemaker["ws"]
        prepare__import_table_from_filemaker["tz"].recording_tz_index = None

        assert prepare__import_table_from_filemaker[
                   'tz'].user_tz_index == 96554373  # Central European Time (Europe/Berlin)
        assert prepare__import_table_from_filemaker['tz'].recording_tz_index == 96554373

        uid1 = uuid4()
        uid2 = uuid4()

        # this simulates the shadow table in Kiosk:
        KioskSQLDb.execute(
            "create table testdock_test_table(uid uuid, field1 varchar, "
            "field2 timestamp with time zone, field2_tz int, "
            "modified timestamp with time zone, modified_tz int, "
            "file_proxy timestamp with time zone, file_proxy_tz int, "
            "created timestamp with time zone, created_tz int, "
            "modified_by varchar,"
            "repl_tag int, repl_deleted boolean)")

        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T15:59:00')}', "
            f"96554373,"  # Berlin -> 17:59
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "
            f"45966874,"  # NZ-CHAT -> 21:14
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "
            f"45966874,"  # NZ-CHAT -> 21:14
            f"'{datetime.datetime.fromisoformat('2024-08-29T08:29:00')}', "
            f"45966874,"  # NZ-CHAT -> 21:14
            f"'sys', null, null)")
        KioskSQLDb.execute(
            f"{'insert'} into testdock_test_table(uid, field1, "
            f"field2, field2_tz, "
            f"modified, modified_tz, "
            f"file_proxy, file_proxy_tz, "
            f"created, created_tz, "
            f"modified_by, "
            f"repl_tag, repl_deleted) "
            f"values('{uid2}', 'r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T16:59:00')}', "
            f"45966874,"  # NZ-CHAT -> 30.08.2024 05:44
            f"'{datetime.datetime.fromisoformat('2024-08-29T21:14:00')}', "
            f"27743346,"  # Mountain Time (US/Mountain) -> Berlin (because this is a modified field!) 29.08.2024 23:14 
            f"'{datetime.datetime.fromisoformat('2024-08-29T21:14:00')}', "
            f"27743346,"  # Mountain Time (US/Mountain) -> 29.08.2024 15:14 
            f"'{datetime.datetime.fromisoformat('2024-08-29T21:14:00')}', "
            f"27743346,"  # Mountain Time (US/Mountain) -> 29.08.2024 15:14 
            f"'sys', null, null)")

        # this simulates the FileMaker table:
        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid1}', 'r1f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-29T14:00:00')}', "  # Berlin modified field2 -> UTC 12:00:00
            f"'{datetime.datetime.fromisoformat('2024-08-29T13:00:00')}', "  # Berlin modified, -> UTC 11:00 
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T14:00:00')}', "  # Berlin modified, -> UTC 12:00 
            f"'{datetime.datetime.fromisoformat('2024-08-29T15:00:00')}'"  # Berlin modified, -> UTC 13:00 
            f")")

        KioskSQLDb.execute(
            f"{'insert'} into test_table values('{uid2}','r2f1', "
            f"'{datetime.datetime.fromisoformat('2024-08-30T05:44:00')}', "  # field2 not modified -> 2024-08-29T16:59:00
            f"'{datetime.datetime.fromisoformat('2024-08-29T23:14:00')}', "  # not modified -> 2024-08-29T21:14:00
            f"'sys',"
            f"'{datetime.datetime.fromisoformat('2024-08-29T15:14:00')}', "  # not modified -> 2024-08-29T21:14:00
            f"'{datetime.datetime.fromisoformat('2024-08-29T15:14:00')}' "  # not modified -> 2024-08-29T21:14:00
            f")")

        KioskSQLDb.commit()
        cur = KioskSQLDb.get_dict_cursor()
        assert ws._import_table_from_filemaker(cur, prepare__import_table_from_filemaker["fm"],
                                               prepare__import_table_from_filemaker["dsd"], "test_table",
                                               tz=prepare__import_table_from_filemaker["tz"])
        KioskSQLDb.commit()
        records = KioskSQLDb.get_records("select uid, field1, "
                                         "field2, field2_tz, "
                                         "modified, modified_tz, "
                                         "file_proxy, file_proxy_tz, "
                                         "created, created_tz "
                                         "from testdock_test_table")
        records.sort()
        expected = [[str(uid1),
                     'r1f1',
                     datetime.datetime(2024, 8, 29, 12, 0, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 11, 0, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 12, 0, tzinfo=datetime.timezone.utc),
                     96554373,
                     datetime.datetime(2024, 8, 29, 13, 0, tzinfo=datetime.timezone.utc),
                     96554373
                     ],
                    [str(uid2),
                     'r2f1',
                     datetime.datetime(2024, 8, 29, 16, 59, tzinfo=datetime.timezone.utc),
                     45966874,
                     datetime.datetime(2024, 8, 29, 21, 14, tzinfo=datetime.timezone.utc),
                     27743346,
                     datetime.datetime(2024, 8, 29, 21, 14, tzinfo=datetime.timezone.utc),
                     27743346,
                     datetime.datetime(2024, 8, 29, 21, 14, tzinfo=datetime.timezone.utc),
                     27743346
                     ]
                    ]
        expected.sort()
        assert records == expected
