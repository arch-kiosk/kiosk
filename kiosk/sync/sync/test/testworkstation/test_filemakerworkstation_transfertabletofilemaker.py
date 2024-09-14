import os
import pprint
import shutil
import datetime
from uuid import uuid4
from zoneinfo import ZoneInfo

import psycopg2
from wrapt import wrap_function_wrapper

import pytest, pytest_mock
import kioskdatetimelib
from dsd.dsd3 import DataSetDefinition
from filemakerrecording.filemakercontrolwindows import FileMakerControlWindows
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


class TestFilemakerWorkstationTransferTableToFileMaker(KioskPyTestHelper):
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

    # def test__import_table_get_update_field_sql(self, db, mock_kiosk_time_zones):
    #     tz = KioskTimeZoneInstance(kiosk_time_zones=KioskTimeZones())
    #     tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)
    #     tz.recording_tz_index = 27743346  # Mountain Time (US/Mountain)
    #
    #     argv = {
    #         "f": "modified",
    #         "data_type": "timestamp",
    #         "tz_type": "u",
    #         "value": datetime.datetime.fromisoformat("2024-08-01T12:00:00"),
    #         "value_list": [],
    #         "tz": tz
    #     }
    #
    #     sql = FileMakerWorkstation._import_table_get_update_field_sql(**argv)
    #     # value_list = [f"'{datetime.datetime.isoformat(x)}'" if isinstance(x, datetime.datetime) else x for x in
    #     #               argv["value_list"]]
    #     value_list = argv["value_list"]
    #
    #     # KioskSQLDb.execute("create temp table sometable(modified timestamp with time zone, modified_tz varchar)")
    #     cur = KioskSQLDb.get_dict_cursor()
    #     try:
    #         cur.execute(f"{sql}", value_list)
    #     except:
    #         pass
    #     assert cur.query == (b"\"modified\"=case "
    #                          b"when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
    #                          b"\"modified\" != '2024-08-01T12:00:00+00:00'::timestamptz) "
    #                          b"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
    #                          b"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
    #                          b"THEN '2024-08-01T12:00:00 Europe/Berlin'::timestamptz "
    #                          b"ELSE \"modified\" END, "
    #                          b"\"modified_tz\"=case when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
    #                          b"\"modified\" != '2024-08-01T12:00:00+00:00'::timestamptz) "
    #                          b"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
    #                          b"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
    #                          b"THEN 96554373 ELSE \"modified_tz\" END")
    #
    #     # test #2
    #
    #     f = "modified"
    #     data_type = "timestamp"
    #     tz_type = "r"
    #     value = datetime.datetime.fromisoformat("2024-08-01T12:00:00")
    #     value_list = []
    #
    #     sql = FileMakerWorkstation._import_table_get_update_field_sql(f=f,
    #                                                                   data_type=data_type,
    #                                                                   tz_type=tz_type,
    #                                                                   value=value,
    #                                                                   value_list=value_list,
    #                                                                   tz=tz)
    #     value_list = [f"'{x.isoformat()}'" if isinstance(x, datetime.datetime) else (f"'{x}'" if isinstance(x, str) else x) for x in
    #                   value_list]
    #     assert sql % tuple(value_list) == (f"\"modified\"=case "
    #                                        f"when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
    #                                        f"\"modified\" != '2024-08-01T12:00:00+00:00') "
    #                                        f"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
    #                                        f"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
    #                                        f"THEN '2024-08-01T12:00:00 US/Mountain'::timestamptz "
    #                                        f"ELSE \"modified\" END, "
    #                                        f"\"modified_tz\"=case when (\"iana_time_zones\".\"modified_tz_iana\" is null and "
    #                                        f"\"modified\" != '2024-08-01T12:00:00+00:00') "
    #                                        f"OR (\"iana_time_zones\".\"modified_tz_iana\" is not null and "
    #                                        f"\"modified\" != ('2024-08-01T12:00:00' || ' ' || \"iana_time_zones\".\"modified_tz_iana\")::timestamptz) "
    #                                        f"THEN 27743346 ELSE \"modified_tz\" END")
    #
    #     # test #3
    #
    #     f = "modified"
    #     data_type = "varchar"
    #     tz_type = None
    #     value = "my value"
    #     value_list = []
    #
    #     sql = FileMakerWorkstation._import_table_get_update_field_sql(f=f,
    #                                                                   data_type=data_type,
    #                                                                   tz_type=tz_type,
    #                                                                   value=value,
    #                                                                   value_list=value_list,
    #                                                                   tz=tz)
    #
    #     value_list = [f"'{datetime.datetime.isoformat(x)}'" if isinstance(x, datetime.datetime) else x for x in
    #                   value_list]
    #     assert sql % tuple(value_list) == "\"modified\"=my value"

    @pytest.fixture()
    def mocked_fm_instance(self, mocker) -> FileMakerControlWindows:

        class FakePyODBC:
            last_cur = None

            def cursor(self):
                cur = KioskSQLDb.get_dict_cursor()
                self.last_cur = cur

                return self.last_cur

            def commit(self):
                KioskSQLDb.commit()

            def close(self):
                if self.last_cur:
                    self.last_cur.close()

        def mock_start_fm_database(self, *args, **kwargs):
            self.template_version = ""
            self.cnxn = FakePyODBC()
            return self

        def wrap_dict_cursor_execute(wrapped, instance, args, kwargs):
            if args and isinstance(args[0], str):
                arg_list = list(args)
                arg_list[0] = arg_list[0].replace("?", "%s")
                args = tuple(arg_list)
            return wrapped(*args, **kwargs)

        wrap_function_wrapper("psycopg2.extras", 'DictCursor.execute', wrap_dict_cursor_execute)

        fm = FileMakerControlWindows()
        mocked_fm = mocker.patch.object(fm, "start_fm_database")
        # this is only to make sure that the mock_start_database method gets the right object for self
        mocked_fm.side_effect = lambda *args, **kwargs: mock_start_fm_database(fm, args, kwargs)

        assert fm.start_fm_database(None, use_odbc_ini_dsn=True)
        return fm

    def test_proxy_cursor(self, db):
        called = False

        def fake_execute(wrapped, instance, args, kwargs):
            nonlocal called
            called = True
            return wrapped(*args, **kwargs)

        assert KioskSQLDb.get_dict_cursor().__class__.__name__ == "DictCursor"
        wrap_function_wrapper("psycopg2.extras", 'DictCursor.execute', fake_execute)
        cur = KioskSQLDb.execute_return_cursor('select \'test\'')
        r = cur.fetchone()
        assert r[0] == "test"
        assert called

    def test_mocked_fm_instance(self, mocked_fm_instance):
        assert mocked_fm_instance.cnxn

    @pytest.fixture()
    def prepare__exporting_to_filemaker(self, db, config, mocker, mock_kiosk_time_zones, mocked_fm_instance):
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

        dsd = DataSetDefinition()

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
        KioskSQLDb.execute("create table test_table_src(uid uuid, field1 varchar, "
                           "field2 timestamp with time zone, field2_tz varchar,"
                           "modified timestamp with time zone, modified_tz varchar,"
                           "modified_by varchar)")

        KioskSQLDb.execute("create table test_table(uid uuid, field1 varchar, field2 timestamp, "
                           "modified timestamp, modified_ww timestamp, modified_by varchar)")

        return {"dsd": dsd,
                "config": config,
                "ws": ws,
                "fm": mocked_fm_instance,
                "tz": tz,
                "utc_now": utc_now}

    @pytest.fixture()
    def dsd_test_table(self, prepare__exporting_to_filemaker):
        dsd = prepare__exporting_to_filemaker["dsd"]
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
                    }
                }
            }
        })
        return prepare__exporting_to_filemaker

    def test_transfer_table_data_to_filemaker_one_record_no_tz(self, dsd_test_table):
        prepared_by_fixture = dsd_test_table

        dsd = prepared_by_fixture["dsd"]

        tablename = "test_table"
        fm: FileMakerControlWindows = prepared_by_fixture["fm"]

        c = KioskSQLDb.execute(f"""
            INSERT INTO test_table_src 
            VALUES('37aefbe7-e45d-4f85-bf4b-30618da16980', 
                'f1value', 
                '{datetime.datetime.fromisoformat('2024-09-11T08:15:12')}',
                null,
                '{datetime.datetime.fromisoformat('2024-09-11T08:16:12')}',
                null,
                'ups'
                )
        """)

        cur = KioskSQLDb.execute_return_cursor("select * from test_table_src")
        assert fm.transfer_table_data_to_filemaker(cur,
                                                   dsd,
                                                   tablename,
                                                   current_tz=prepared_by_fixture["tz"]) > 0
        cur.close()

        records = KioskSQLDb.get_records("select * from test_table")
        records.sort()
        assert records == [['37aefbe7-e45d-4f85-bf4b-30618da16980',
                            'f1value',
                            datetime.datetime(2024, 9, 11, 8, 15, 12),
                            datetime.datetime(2024, 9, 11, 8, 16, 12),
                            datetime.datetime(2024, 9, 11, 8, 16, 12),
                            'ups']]

    def test_transfer_table_data_to_filemaker_tz(self, dsd_test_table):
        prepared_by_fixture = dsd_test_table
        # tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)
        # tz.recording_tz_index = 27743346  # Mountain Time (US/Mountain)

        dsd = prepared_by_fixture["dsd"]
        tablename = "test_table"
        fm: FileMakerControlWindows = prepared_by_fixture["fm"]

        insert_sql = f"""
            INSERT INTO test_table_src (uid, field1, field2, field2_tz, modified, modified_tz, modified_by)  
            VALUES (%s, %s,%s,%s,%s,%s,%s)"""

        KioskSQLDb.execute(insert_sql, [
            '37aefbe7-e45d-4f85-bf4b-30618da16980',
            '1',
            datetime.datetime.fromisoformat('2024-09-11T08:15:12'),  # shall be 08:15:12
            None,
            datetime.datetime.fromisoformat('2024-09-11T08:16:12'),  # shall be 10:16:12, _ww the same
            96554373,  # berlin
            'ups'
        ])
        KioskSQLDb.execute(insert_sql, [
            '52aefbe7-e45d-4f85-bf4b-30618da16980',
            '2',
            datetime.datetime.fromisoformat('2024-09-11T15:15:12'),  # shall be 15:15:12
            None,
            datetime.datetime.fromisoformat('2024-09-11T15:16:12'),  # shall be 17:16:12, __ww 09:16:12
            27743346,  # US mountain time
            'ups']
        )
        KioskSQLDb.execute(insert_sql, [
            '62aefbe7-e45d-4f85-bf4b-30618da16980',
            '3',
            datetime.datetime.fromisoformat('2024-09-11T15:15:12'),  # shall be 17:15:12 because it ain't matter in this direction that the current recording time is US/Mountain
            96554373,  # Berlin
            datetime.datetime.fromisoformat('2024-09-11T15:16:12'),  # shall be 17:16:12, __ww 09:16:12
            27743346,  # US mountain time
            'ups']
        )

        cur = KioskSQLDb.execute_return_cursor("select * from test_table_src")
        assert fm.transfer_table_data_to_filemaker(cur,
                                                   dsd,
                                                   tablename,
                                                   current_tz=prepared_by_fixture["tz"]) > 0
        cur.close()

        records = KioskSQLDb.get_records("select field1, field2, modified, modified_ww from test_table order by field1")
        assert records == [[
                '1',
                datetime.datetime(2024, 9, 11, 8, 15, 12),
                datetime.datetime(2024, 9, 11, 10, 16, 12),
                datetime.datetime(2024, 9, 11, 10, 16, 12)
            ],
            [
                '2',
                datetime.datetime(2024, 9, 11, 15, 15, 12),
                datetime.datetime(2024, 9, 11, 17, 16, 12),  # modified should always be user time zone in FM
                datetime.datetime(2024, 9, 11, 9, 16, 12),  # Mountain Time
            ],
            [
                '3',
                datetime.datetime(2024, 9, 11, 17, 15, 12),
                datetime.datetime(2024, 9, 11, 17, 16, 12),  # modified should always be user time zone in FM
                datetime.datetime(2024, 9, 11, 9, 16, 12),  # Mountain Time
            ],
        ]

    def test_transfer_table_data_to_filemaker_tz_with_dsd_settings(self, prepare__exporting_to_filemaker):
        prepared_by_fixture = prepare__exporting_to_filemaker
        # tz.user_tz_index = 96554373  # Central European Time (Europe/Berlin)

        prepared_by_fixture = prepare__exporting_to_filemaker
        assert prepared_by_fixture["tz"].user_tz_index == 96554373  # Mountain Time (US/Mountain)
        assert prepared_by_fixture["tz"].recording_tz_index == 27743346  # Mountain Time (US/Mountain)

        dsd = prepare__exporting_to_filemaker["dsd"]
        dsd.append({"config": {
            "format_version": 3},
            "test_table": {
                "structure": {
                    1: {
                        "uid": ["datatype('UUID')"],
                        "field1": ["datatype('TEXT')"],
                        "field2": ["datatype('timestamp'), tz_type('r')"],
                        "modified": ["datatype('timestamp')", "replfield_modified()"],
                        "modified_by": ["datatype('varchar')", "replfield_modified_by()"],
                    }
                }
            }
        })
        return prepare__exporting_to_filemaker

        tablename = "test_table"
        fm: FileMakerControlWindows = prepared_by_fixture["fm"]

        insert_sql = f"""
            INSERT INTO test_table_src (uid, field1, field2, field2_tz, modified, modified_tz, modified_by)  
            VALUES (%s, %s,%s,%s,%s,%s,%s)"""

        KioskSQLDb.execute(insert_sql, [
            '62aefbe7-e45d-4f85-bf4b-30618da16980',
            '3',
            datetime.datetime.fromisoformat('2024-09-11T15:15:12'),  # shall be 17:15:12 because even with a tz_type('r')
                                                                     #  it ain't matter in this direction that the current recording time is US/Mountain
            96554373,  # Berlin
            datetime.datetime.fromisoformat('2024-09-11T15:16:12'),  # shall be 17:16:12, __ww 09:16:12
            27743346,  # US mountain time
            'ups']
        )

        cur = KioskSQLDb.execute_return_cursor("select * from test_table_src")
        assert fm.transfer_table_data_to_filemaker(cur,
                                                   dsd,
                                                   tablename,
                                                   current_tz=prepared_by_fixture["tz"]) > 0
        cur.close()

        records = KioskSQLDb.get_records("select field1, field2, modified, modified_ww from test_table order by field1")
        assert records == [
            [
                '3',
                datetime.datetime(2024, 9, 11, 17, 15, 12),
                datetime.datetime(2024, 9, 11, 17, 16, 12),  # modified should always be user time zone in FM
                datetime.datetime(2024, 9, 11, 9, 16, 12),  # Mountain Time
            ],
        ]
