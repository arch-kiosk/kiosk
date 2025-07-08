import datetime
import logging
from pprint import pprint

import pytest
import os

from dsd.dsd3singleton import Dsd3Singleton
from fileidentifiercache import FileIdentifierCache
from plugins.filerepositoryplugin.filerepositoryarchive import FileRepositoryArchive, FR_ARCHIVE_NAMESPACE
from test.testhelpers import KioskPyTestHelper
from synchronization import Synchronization
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")


class TestFileRepositoryArchive(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def dsd(self, db):
        _dsd = Dsd3Singleton.get_dsd3()
        fid = FileIdentifierCache(_dsd)
        assert fid.build_file_identifier_cache_from_contexts()
        return _dsd

    def test_init(self, config, dsd, db):
        fr_archive = FileRepositoryArchive(dsd, config, "new archive")
        assert fr_archive

    def test_check_archive_name(self):
        assert FileRepositoryArchive.check_archive_name("with space") == "with_space"

    def test_migrate_archive_table(self, config, dsd, db):
        fr_archive = FileRepositoryArchive(dsd, config, "new_archive")
        fr_archive.migrate_archive_table()
        KioskSQLDb.commit()
        self.assert_table(fr_archive.archive_table_name, FR_ARCHIVE_NAMESPACE)

    def test_query_images(self, config, dsd, db):
        options = {'files': [],
                   'frf': {'context': None,
                           'description': '',
                           'from_date': '',
                           'no_context': False,
                           'recording_context': '',
                           'site': '-',
                           'tags': '',
                           'to_date': ''},
                   'options': {'filtered_images': True,
                               'new_archive': 'new',
                               'selected': '',
                               'use_new_archive': True}}
        fr_archive = FileRepositoryArchive(dsd, config, "new_archive")
        fr_archive.migrate_archive_table()
        fr_archive.set_frf_options(options["frf"])
        sql_select, sql_from, params = fr_archive.query_images(files_table_name="images", columns=["uid", "description"])
        sql = sql_select + sql_from
        assert sql == (
            f'select i.uid,i.description from images i inner join (select images.uid from images images left outer join '
            f'"context_cache"."file_identifier_cache" on '
            f'images.uid="context_cache"."file_identifier_cache"."data"::uuid) q on q.uid = i.uid')
        assert params == []
        options = {'files': [],
                   'frf': {'context': None,
                           'description': '',
                           'from_date': '',
                           'no_context': True,
                           'recording_context': '',
                           'site': '-',
                           'tags': 'cat',
                           'to_date': ''},
                   'options': {'filtered_images': True,
                               'new_archive': 'new',
                               'selected': '',
                               'use_new_archive': True}}
        fr_archive = FileRepositoryArchive(dsd, config, "new_archive")
        fr_archive.set_frf_options(options["frf"])
        sql_select, sql_from, params = fr_archive.query_images(files_table_name="images", columns=["uid", "description"])
        sql = sql_select + sql_from
        assert sql == ('select i.uid,i.description from images i inner join (select images.uid from images images '
                       'left outer join "context_cache"."file_identifier_cache" on '
                       'images.uid="context_cache"."file_identifier_cache"."data"::uuid  where  '
                       '"context_cache"."file_identifier_cache"."data" is null  and '
                       "coalesce(substring(lower(tags) from %s),'') <> '') q on q.uid = i.uid")
        assert params == ["cat"]
        cur = KioskSQLDb.execute_return_cursor(sql, params)
        assert cur
        cur.close()

        options = {'files': [],
                   'frf': {'context': None,
                           'description': 'brick',
                           'from_date': '',
                           'no_context': False,
                           'recording_context': '',
                           'site': '-',
                           'tags': '',
                           'to_date': ''},
                   'options': {'filtered_images': True,
                               'new_archive': 'new',
                               'selected': '',
                               'use_new_archive': True}}
        fr_archive = FileRepositoryArchive(dsd, config, "new_archive")
        fr_archive.set_frf_options(options["frf"])
        sql_select, sql_from, params = fr_archive.query_images(
            files_table_name=KioskSQLDb.sql_safe_namespaced_table(FR_ARCHIVE_NAMESPACE, "new_archive_images"),
            columns=["uid", "description"])
        sql = sql_select + sql_from
        assert sql == ('select i.uid,i.description from "FR_ARCHIVE"."new_archive_images" i inner join (select '
                       'images.uid from "FR_ARCHIVE"."new_archive_images" images left outer join '
                       '"context_cache"."file_identifier_cache" on '
                       'images.uid="context_cache"."file_identifier_cache"."data"::uuid  where \n'
                       '                        '
                       '(("context_cache"."file_identifier_cache"."description" ilike %s \n'
                       '                            or images.description ilike %s \n'
                       '                            or cast(images.uid as VARCHAR) = %s)\n'
                       '                            or images.uid in \n'
                       '                            ( \n'
                       '                                select cm_photo.uid_photo from '
                       'collected_material_photo cm_photo\n'
                       '                                inner join collected_material cm on '
                       'cm_photo.uid_cm = cm.uid\n'
                       '                                left outer join small_find sf on '
                       'cm_photo.uid_cm = sf.uid_cm\n'
                       '                                where\n'
                       "                                concat(cm.description, ' ', sf.material, ' "
                       "')\n"
                       '                                ilike %s                \n'
                       '                            )\n'
                       '                            or images.export_filename ilike %s   \n'
                       '                        )) q on q.uid = i.uid')
        assert params == ['%brick%', '%brick%', 'brick', '%brick%', '%brick%']
        cur = KioskSQLDb.execute_return_cursor(sql, params)
        assert cur
        cur.close()

    def test_copy_fr_records(self, config, dsd, db):
        KioskSQLDb.execute("""truncate images; INSERT
        INTO
        public.images(description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                      original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag, export_filename,
                      modified_tz, modified_ww)
        VALUES(null, '2021-07-29 13:17:47.000000', null, '2021-03-09 17:14:15.000000',
               '834b7fd2-98cf-4df3-808d-2e6b56386a0f.pdf',
               '{"width": 2080, "format": "AI", "height": 1362, "version": 2}', 'a7fde484a583199a2e9e54b7869683b7',
               null, '"import_2021-07-29 13:17:24","lutz-","Bob"', '834b7fd2-98cf-4df3-808d-2e6b56386a0f',
               '2021-07-29 13:17:47.739420', '2025-04-29 17:19:15.924123 +00:00', 'LKH', false, null, null, 6587072,
               '2025-04-29 19:19:15.924123');
        INSERT
        INTO
        public.images(description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                      original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag, export_filename,
                      modified_tz, modified_ww)
        VALUES(null, '2024-10-06 15:35:14.000000', null, '2024-10-06 15:35:14.000000',
               '5acf8f83-abc8-4ee9-ab28-980660673760.png', '{"width": 2553, "format": "PNG", "height": 1648}',
               'bf30f0f4d5eb9c3a2740131836c1967c', 'BF30F0F4D5EB9C3A2740131836C1967C', '"BROKEN_FILE"',
               '5acf8f83-abc8-4ee9-ab28-980660673760', '2024-10-06 15:35:14.000000',
               '2024-10-06 19:35:14.000000 +00:00', 'LDB', false, null, null, 40079121, '2024-10-06 15:35:14.000000');
        INSERT
        INTO
        public.images(description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                      original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag, export_filename,
                      modified_tz, modified_ww)
        VALUES(null, '2024-10-06 15:38:14.000000', null, '2024-10-06 15:38:14.000000',
               'b481b399-c0e7-43f7-909e-d55e9a388629.heic', '{"width": 2667, "format": "JPEG", "height": 2000}',
               'bd478c423adaeac0caae6015cd057555', 'BD478C423ADAEAC0CAAE6015CD057555', '"BROKEN_FILE"',
               'b481b399-c0e7-43f7-909e-d55e9a388629', '2024-10-06 15:38:14.000000',
               '2024-10-06 19:38:14.000000 +00:00', 'LDB', false, null, null, 40079121, '2024-10-06 15:38:14.000000');
        """)

        options = {'files': [],
                   'frf': {'context': None,
                           'description': '',
                           'from_date': '',
                           'no_context': False,
                           'recording_context': '',
                           'site': '-',
                           'tags': '',
                           'to_date': ''},
                   'options': {'filtered_images': True,
                               'new_archive': 'new',
                               'selected': '',
                               'use_new_archive': True}}
        fr_archive = FileRepositoryArchive(dsd, config, "new_archive")
        fr_archive.migrate_archive_table()
        KioskSQLDb.commit()
        fr_archive.set_frf_options(options["frf"])
        c = fr_archive.move_fr_records("", "images", FR_ARCHIVE_NAMESPACE, "new_archive_images")
        assert c == 3
        assert (KioskSQLDb.get_records("""select * from "FR_ARCHIVE"."new_archive_images" """) ==
                [[None,
                  datetime.datetime(2024, 10, 6, 15, 35, 14),
                  None,
                  datetime.datetime(2024, 10, 6, 15, 35, 14),
                  '5acf8f83-abc8-4ee9-ab28-980660673760.png',
                  None,
                  {'format': 'PNG', 'height': 1648, 'width': 2553},
                  'bf30f0f4d5eb9c3a2740131836c1967c',
                  'BF30F0F4D5EB9C3A2740131836C1967C',
                  '"BROKEN_FILE"',
                  '5acf8f83-abc8-4ee9-ab28-980660673760',
                  datetime.datetime(2024, 10, 6, 15, 35, 14),
                  datetime.datetime(2024, 10, 6, 19, 35, 14, tzinfo=datetime.timezone.utc),
                  'LDB',
                  40079121,
                  datetime.datetime(2024, 10, 6, 15, 35, 14),
                  False,
                  None],
                 [None,
                  datetime.datetime(2024, 10, 6, 15, 38, 14),
                  None,
                  datetime.datetime(2024, 10, 6, 15, 38, 14),
                  'b481b399-c0e7-43f7-909e-d55e9a388629.heic',
                  None,
                  {'format': 'JPEG', 'height': 2000, 'width': 2667},
                  'bd478c423adaeac0caae6015cd057555',
                  'BD478C423ADAEAC0CAAE6015CD057555',
                  '"BROKEN_FILE"',
                  'b481b399-c0e7-43f7-909e-d55e9a388629',
                  datetime.datetime(2024, 10, 6, 15, 38, 14),
                  datetime.datetime(2024, 10, 6, 19, 38, 14, tzinfo=datetime.timezone.utc),
                  'LDB',
                  40079121,
                  datetime.datetime(2024, 10, 6, 15, 38, 14),
                  False,
                  None],
                 [None,
                  datetime.datetime(2021, 7, 29, 13, 17, 47),
                  None,
                  datetime.datetime(2021, 3, 9, 17, 14, 15),
                  '834b7fd2-98cf-4df3-808d-2e6b56386a0f.pdf',
                  None,
                  {'format': 'AI', 'height': 1362, 'version': 2, 'width': 2080},
                  'a7fde484a583199a2e9e54b7869683b7',
                  None,
                  '"import_2021-07-29 13:17:24","lutz-","Bob"',
                  '834b7fd2-98cf-4df3-808d-2e6b56386a0f',
                  datetime.datetime(2021, 7, 29, 13, 17, 47, 739420),
                  datetime.datetime(2025, 4, 29, 17, 19, 15, 924123, tzinfo=datetime.timezone.utc),
                  'LKH',
                  6587072,
                  datetime.datetime(2025, 4, 29, 19, 19, 15, 924123),
                  False,
                  None]])

        assert KioskSQLDb.get_record_count("images", "uid") == 0
        c = fr_archive.move_fr_records(FR_ARCHIVE_NAMESPACE, "new_archive_images", "", "images")
        assert c == 3

    def test_get_where_selected_files(self, dsd, config):
        fr_archive = FileRepositoryArchive(dsd, config, "new_archive")
        assert fr_archive.get_where_selected_files() == ("", [])
        fr_archive.set_selected_files([
            'd767a410-e362-425b-9125-580f5ea69633',
            'a25d6bd0-45a8-4328-a131-41bd3d75188b',
            'a8efde0d-a5d9-44c4-8b9e-287935b216c6'])
        assert fr_archive.get_where_selected_files() == (" where i.uid in (%s,%s,%s)", [
            'd767a410-e362-425b-9125-580f5ea69633',
            'a25d6bd0-45a8-4328-a131-41bd3d75188b',
            'a8efde0d-a5d9-44c4-8b9e-287935b216c6'])

    def test_copy_fr_records_with_selected_files(self, config, dsd, db):
        KioskSQLDb.execute("""truncate images; INSERT
        INTO
        public.images(description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                      original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag, export_filename,
                      modified_tz, modified_ww)
        VALUES(null, '2021-07-29 13:17:47.000000', null, '2021-03-09 17:14:15.000000',
               '834b7fd2-98cf-4df3-808d-2e6b56386a0f.pdf',
               '{"width": 2080, "format": "AI", "height": 1362, "version": 2}', 'a7fde484a583199a2e9e54b7869683b7',
               null, '"import_2021-07-29 13:17:24","lutz-","Bob"', '834b7fd2-98cf-4df3-808d-2e6b56386a0f',
               '2021-07-29 13:17:47.739420', '2025-04-29 17:19:15.924123 +00:00', 'LKH', false, null, null, 6587072,
               '2025-04-29 19:19:15.924123');
        INSERT
        INTO
        public.images(description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                      original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag, export_filename,
                      modified_tz, modified_ww)
        VALUES(null, '2024-10-06 15:35:14.000000', null, '2024-10-06 15:35:14.000000',
               '5acf8f83-abc8-4ee9-ab28-980660673760.png', '{"width": 2553, "format": "PNG", "height": 1648}',
               'bf30f0f4d5eb9c3a2740131836c1967c', 'BF30F0F4D5EB9C3A2740131836C1967C', '"BROKEN_FILE","Bob"',
               '5acf8f83-abc8-4ee9-ab28-980660673760', '2024-10-06 15:35:14.000000',
               '2024-10-06 19:35:14.000000 +00:00', 'LDB', false, null, null, 40079121, '2024-10-06 15:35:14.000000');
        INSERT
        INTO
        public.images(description, img_proxy, ref_uid, file_datetime, filename, image_attributes, md5_hash,
                      original_md5, tags, uid, created, modified, modified_by, repl_deleted, repl_tag, export_filename,
                      modified_tz, modified_ww)
        VALUES(null, '2024-10-06 15:38:14.000000', null, '2024-10-06 15:38:14.000000',
               'b481b399-c0e7-43f7-909e-d55e9a388629.heic', '{"width": 2667, "format": "JPEG", "height": 2000}',
               'bd478c423adaeac0caae6015cd057555', 'BD478C423ADAEAC0CAAE6015CD057555', '"BROKEN_FILE"',
               'b481b399-c0e7-43f7-909e-d55e9a388629', '2024-10-06 15:38:14.000000',
               '2024-10-06 19:38:14.000000 +00:00', 'LDB', false, null, null, 40079121, '2024-10-06 15:38:14.000000');
        """)

        options = {'files': [],
                   'frf': {'context': None,
                           'description': '',
                           'from_date': '',
                           'no_context': False,
                           'recording_context': '',
                           'site': '-',
                           'tags': 'Bob',
                           'to_date': ''},
                   'options': {'filtered_images': True,
                               'new_archive': 'new',
                               'selected': '',
                               'use_new_archive': True}}
        fr_archive = FileRepositoryArchive(dsd, config, "new_archive")
        fr_archive.migrate_archive_table()
        KioskSQLDb.commit()
        fr_archive.set_frf_options(options["frf"])
        fr_archive.set_selected_files(['5acf8f83-abc8-4ee9-ab28-980660673760', '834b7fd2-98cf-4df3-808d-2e6b56386a0f'])
        c = fr_archive.move_fr_records("", "images", FR_ARCHIVE_NAMESPACE, "new_archive_images")
        assert c == 2
        assert (KioskSQLDb.get_records("""select * from "FR_ARCHIVE"."new_archive_images" """) ==
                [[None,
                  datetime.datetime(2024, 10, 6, 15, 35, 14),
                  None,
                  datetime.datetime(2024, 10, 6, 15, 35, 14),
                  '5acf8f83-abc8-4ee9-ab28-980660673760.png',
                  None,
                  {'format': 'PNG', 'height': 1648, 'width': 2553},
                  'bf30f0f4d5eb9c3a2740131836c1967c',
                  'BF30F0F4D5EB9C3A2740131836C1967C',
                  '"BROKEN_FILE","Bob"',
                  '5acf8f83-abc8-4ee9-ab28-980660673760',
                  datetime.datetime(2024, 10, 6, 15, 35, 14),
                  datetime.datetime(2024, 10, 6, 19, 35, 14, tzinfo=datetime.timezone.utc),
                  'LDB',
                  40079121,
                  datetime.datetime(2024, 10, 6, 15, 35, 14),
                  False,
                  None],
                 [None,
                  datetime.datetime(2021, 7, 29, 13, 17, 47),
                  None,
                  datetime.datetime(2021, 3, 9, 17, 14, 15),
                  '834b7fd2-98cf-4df3-808d-2e6b56386a0f.pdf',
                  None,
                  {'format': 'AI', 'height': 1362, 'version': 2, 'width': 2080},
                  'a7fde484a583199a2e9e54b7869683b7',
                  None,
                  '"import_2021-07-29 13:17:24","lutz-","Bob"',
                  '834b7fd2-98cf-4df3-808d-2e6b56386a0f',
                  datetime.datetime(2021, 7, 29, 13, 17, 47, 739420),
                  datetime.datetime(2025, 4, 29, 17, 19, 15, 924123, tzinfo=datetime.timezone.utc),
                  'LKH',
                  6587072,
                  datetime.datetime(2025, 4, 29, 19, 19, 15, 924123),
                  False,
                  None]])
        assert KioskSQLDb.get_record_count("images", "uid") == 1
        KioskSQLDb.execute("truncate images")
        c = fr_archive.move_fr_records(FR_ARCHIVE_NAMESPACE, "new_archive_images", "", "images")
        assert c == 2
