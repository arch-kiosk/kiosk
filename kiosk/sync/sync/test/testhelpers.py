import datetime
import json
import logging
import os
import time
import kioskglobals
from unittest import TestCase

import matplotlib.pyplot as plt
import yaml
from PIL import Image
from numpy import array

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from kioskappfactory import KioskAppFactory
from kioskconfig import KioskConfig
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from redisgeneralstore.redisgeneralstore import RedisGeneralStore
from sync_config import SyncConfig
from kiosksqldb import KioskSQLDb


class KioskPyTestHelper:
    test_path = ""
    base_path = ""

    @staticmethod
    def get_kiosk_base_path_from_test_path(test_path) -> str:
        """
        tries to find the kiosk base path in the parent folder structure of the test_path
        :param test_path: the path where a test_file is located
        :return: the base path
        """

        base_path = ""
        id_directories = ["core", "api"]
        id_files = ["this_is_the_kiosk_root.md"]
        current_path = test_path

        if not (id_directories or id_files):
            return ""

        while (not base_path) and current_path and os.path.exists(current_path):
            if len(current_path) == 3:
                break

            exists = True

            for d in id_directories:
                if not os.path.exists(os.path.join(current_path, d)):
                    exists = False
                    break
            if exists:
                for f in id_files:
                    if not os.path.isfile(os.path.join(current_path, f)):
                        exists = False
                        break
            if exists:
                base_path = current_path
            else:
                try:
                    current_path = kioskstdlib.get_parent_dir(current_path)
                except BaseException:
                    current_path = ""
                    break

        return base_path

    @staticmethod
    def set_file_repos_dir(current_config, datadir):
        current_config.config["file_repository"] = os.path.join(str(datadir), "file_repository")
        current_config._file_repository = current_config.config["file_repository"]
        current_config.config["filemaker_export_dir"] = os.path.join(str(datadir), "filemaker\\to_work_station")
        current_config.filemaker_export_dir = current_config.config["filemaker_export_dir"]
        current_config.config["filemaker_import_dir"] = os.path.join(str(datadir), "filemaker\\from_work_station")
        current_config.filemaker_import_dir = current_config.config["filemaker_import_dir"]
        template_name = kioskstdlib.get_filename(current_config.config["filemaker_template"])
        current_config.config["filemaker_template"] = os.path.join(str(datadir), "filemaker", template_name)
        current_config.filemaker_template = current_config.config["filemaker_template"]

    def get_standard_test_config(self, test_file, test_config_file = ""):
        """
        returns a typical test configuration that uses the normal kiosk config file and a log under \log unless
        stated otherwise
        :param test_file: __file__ of the test file. Used to find out where the root path of the test is
        :param test_config_file: the filename of the config file that's expected under test_path\config. If not
                                 given the normal kiosk config will be used (but database will be urap_test)
        """
        self.test_path = os.path.dirname(os.path.abspath(test_file))
        self.base_path = self.get_kiosk_base_path_from_test_path(self.test_path)
        if test_config_file:
            config_file = os.path.join(self.test_path, r"config", test_config_file)
        else:
            config_file = os.path.join(self.base_path, "config", "kiosk_config.yml")

        log_file = os.path.join(self.test_path, r"log", "test_log.log")
        return self.get_config(config_file=config_file, log_file=log_file, base_path=self.base_path)

    def get_config(self, config_file="", log_file="", base_path="", secure_config="", config_class=KioskConfig,
                   file_repos_path=""):

        config_class._release_config()
        kioskglobals.cfg = None

        if not base_path:
            test_path = os.path.dirname(os.path.abspath(__file__))
            base_path = self.get_kiosk_base_path_from_test_path(test_path)

        if not config_file:
            config_file = os.path.join(base_path, "config", "kiosk_config.yml")

        if not secure_config:
            secure_config = os.path.join(base_path, "config", "kiosk_secure.yml")

        cfg = config_class.get_config({"base_path": base_path,
                                       "config_file": config_file,
                                       "secure_file": secure_config})
        assert cfg

        if file_repos_path:
            cfg.config["file_repository"] = file_repos_path
            cfg._file_repository = file_repos_path

        if not cfg:
            raise Exception(f"Configuration could not be initialized with file {config_file}")

        kioskglobals.cfg = cfg

        try:
            cfg.read_config(secure_config)
        except BaseException as e:
            raise Exception(f"could not read secure config {secure_config}: {repr(e)}")

        assert cfg.config["database_usr_name"]

        cfg.config['base_path'] = base_path
        cfg.config["database_name"] = "urap_test"  # just to make extra sure!
        cfg.database_name = "urap_test"

        if log_file:
            cfg.config["logfile"] = log_file
            cfg.logfile = log_file

        # Initialize logging and settings
        logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
        logger = logging.getLogger()
        logger.setLevel(logging.DEBUG)

        if not cfg.do_log_to_screen():
            logger.handlers = []

        if cfg.get_logfile():
            ch = logging.FileHandler(filename=cfg.get_logfile())
            ch.setLevel(logging.DEBUG)
            formatter = logging.Formatter('>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s')
            ch.setFormatter(formatter)
            logger.addHandler(ch)
            logging.info("Logging....")

        Dsd3Singleton.release_dsd3()
        return cfg

    def get_dsd(self, cfg):
        dsd = Dsd3Singleton.get_dsd3()
        assert dsd.append_file(cfg.dsdfile)
        return dsd

    def get_urapdb(self, cfg, migration=True):
        if cfg.database_name != "urap_test":
            raise Exception(f"attempt to use database {cfg.database_name} in test. Stopped.")

        dsd = self.get_dsd(cfg)
        if migration:
            try:
                KioskSQLDb.rollback()
            except:
                pass
            assert KioskSQLDb.drop_database()
            KioskSQLDb.close_connection()
            assert KioskSQLDb.create_database()
            migration = Migration(dsd, PostgresDbMigration(dsd, KioskSQLDb.get_con()))
            migration.self_check()
            assert migration.migrate_dataset()
            KioskSQLDb.commit()
        cur = KioskSQLDb.get_dict_cursor()
        return cur

    def assert_table(self, tablename, schema=""):
        exists = KioskSQLDb.does_table_exist(tablename, schema=schema)
        assert exists, "Table " + tablename + " does not exist."

    def assert_empty_table(self, tablename, schema=""):
        exists = KioskSQLDb.does_table_exist(tablename, schema=schema)
        assert exists, "Table " + tablename + " does not exist."
        if schema:
            r = KioskSQLDb.get_first_record_from_sql("select " + f"* from {schema}.{tablename}", [])
        else:
            r = KioskSQLDb.get_first_record_from_sql("select " + f"* from {tablename}", [])
        assert not r

    def assert_table_missing(self, tablename, schema=""):
        missing = not KioskSQLDb.does_table_exist(tablename, schema=schema)
        assert missing, "Table " + tablename + " should not exist, but it does."

    def assert_table_empty_or_missing(self, tablename, schema=""):
        exists = KioskSQLDb.does_table_exist(tablename, schema=schema)

        if exists:
            if schema:
                r = KioskSQLDb.get_first_record_from_sql("select " + f"* from {schema}.{tablename}", [])
            else:
                r = KioskSQLDb.get_first_record_from_sql("select " + f"* from {tablename}", [])
            assert not r, "Table " + tablename + " exists and isn't empty."

    def assert_record_exists(self, table, value, field="uid", namespace=None):
        r = KioskSQLDb.get_first_record(table, field, value, namespace=namespace)
        assert r, "Record with " + field + " = " + value + " does not exist in table " + table

    def assert_record_missing(self, table, value, field="uid", namespace=""):
        r = KioskSQLDb.get_first_record(table, field, value, namespace=namespace)
        if r:
            assert False, "Record with " + field + " = " + value + " shouldn't but does exist in table " + table

    def assert_record_value(self, table, position, field, value, order_by="", schema=""):
        """ checks, whether in a particular record (the last, the first or a certain number)
        the field is set to the requested value """
        r = KioskSQLDb.get_record_by_position(table, position, field, order_by, schema=schema)
        assert r, "Assert_record_value failed: No Record with in table " + table
        v = r[field]
        assert v == value, "Assert_record_value failed: " + v + " does not equal the expected " + value + " in table " + table

    def assert_table_isempty(self, table):
        assert KioskSQLDb.is_empty(table), "Table " + table + " is not empty, but is supposed to be."

    def assert_table_isnotempty(self, table):
        assert not KioskSQLDb.is_empty(table), f"Table {table} is empty, but is supposed to have at least one record."

    def assert_tables_are_equal(self, tableone, tabletwo, fieldlist=None, order_by=None):
        raise NotImplementedError
        # todo: needs redesign for pytest

        cur = KioskSQLDb.get_cursor()
        fields = "*"
        if fieldlist:
            fields = ', '.join(map(lambda x: "\"" + str(x) + "\"", fieldlist))
        sql = "SELECT " + fields + " FROM \"%s\""
        if order_by:
            sql = sql + " order by " + order_by

        cur.execute(sql % tableone)
        records_one = cur.fetchall()
        cur.execute(sql % tabletwo)
        records_two = cur.fetchall()
        cur.close()

        assert len(records_one) == len(
            records_two), "assert_tables_are_equal failed with tables " + tableone + " and " + tabletwo
        TestCase.assertCountEqual(records_one, records_two,
                                  "assert_tables_are_equal failed with tables " + tableone + " and " + tabletwo)

    def prepare_table(self, tablename, drop, truncate, create_script):
        cur = KioskSQLDb().get_cursor()
        doit = True
        if KioskSQLDb.does_table_exist(tablename):
            if drop:
                cur.execute(f"drop table \"{tablename}\"")
            else:
                doit = False
                if truncate:
                    cur.execute("truncate table \"" + tablename + "\"")
        if doit:
            KioskSQLDb.run_sql_script(create_script)

    def initialize_table_data(self, table, filename, truncate=False):
        time.sleep(1)
        if truncate:
            KioskSQLDb.execute("truncate table \"" + table + "\";")
        KioskSQLDb.initialize_table_data(table, filename)

    def manipulate_data(self, table, filename, modified_by=None):
        """manipulates records in table accoding to the data in the filename.
           if Modified_by is given, the modification-date will be set to the current time
           and modified_by to the parameter given """

        time.sleep(1)
        return (KioskSQLDb.update_table_data(table, filename, "uid", modified_by, True, False))

    def manipulate_modification_data(self, table, uid, modified_by, modification_ts=None):
        time.sleep(1)
        if not modification_ts:
            modification_ts = datetime.datetime.now()
        try:
            sql = "update \"" + table + "\" set modified_by=%s, modified=%s"
            sql = sql + " where uid=%s;"
            return (KioskSQLDb.execute(sql, [modified_by, modification_ts, uid]))
        except Exception as e:
            logging.error("Exception in manipulate_modification_data: " + repr(e))
        return (False)

    def manipulate_creation_date(self, table, uid, creation_ts=None):
        time.sleep(1)
        if not creation_ts:
            creation_ts = datetime.datetime.now()
        try:
            sql = "update \"" + table + "\" set created=%s"
            sql = sql + " where uid=%s;"
            return (KioskSQLDb.execute(sql, [creation_ts, uid]))
        except Exception as e:
            logging.error("Exception in manipulate_modification_data: " + repr(e))
        return (False)

    def assert_table_data_yaml(self, table, filename, keyfield=None, fail_on_key_not_found=True):
        """ compares records in the table according to the records in the yml-file.
            They keyfield defines, which of the fields in the yml-file will be used
            in the where - clause of the select statement. Only the first record will be compared. \n
            Some parameters control the manipulation: \n
            \n
            keyfield   : If the key field is given, it is always this field that is supposed to be the key. If
                         it is not given, the first field in a yaml-section is supposed to be the key-field. \n
            fail_on_key_not_found: if True, the function fails if the table does not have a requested row. \n

             """
        assert_str = None
        cur = None
        if filename:
            try:
                # with open(filename, "r") as ymlfile:
                #     y = yaml.load(ymlfile)
                # print("\n***********************")
                # print(y)
                # print("\n***********************")
                with open(filename, "r") as ymlfile:
                    records = yaml.load(ymlfile)
            except Exception as e:
                logging.error(repr(e))
                records = None
            try:
                if records:
                    # logging.debug("records is true")
                    cur = KioskSQLDb.get_dict_cursor()
                    if cur:
                        for row in records:
                            sqlselect = "SELECT " + "* FROM \"" + table + "\" WHERE "
                            if keyfield:
                                sqlwhere = "\"" + keyfield + "\""
                                where_value = row[keyfield]
                            else:
                                kf = list(row.keys())[0]
                                sqlwhere = "\"" + kf + "\""
                                where_value = row[kf]
                            sqlwhere = sqlwhere + "=%s;"
                            sqlselect = sqlselect + sqlwhere
                            cur.execute(sqlselect, [where_value])
                            if cur.rowcount == 0:
                                if fail_on_key_not_found:
                                    assert False, "rowcount = 0: Key " + sqlwhere + " with %s = " + str(
                                        where_value) + " not found in table " + table
                            else:
                                table_row = cur.fetchone()
                                if table_row:
                                    for key, value in row.items():
                                        assert table_row[
                                                   key] == value, "table " + table + ",field " + key + " does not have the right value: " + str(
                                            value)
                                else:
                                    if fail_on_key_not_found:
                                        assert False, "asdf Key " + sqlwhere + " with %s = " + str(
                                            where_value) + " not found in table " + table

                    if cur:
                        cur.close()
                else:
                    raise Exception("No records in yaml file")
            except Exception as e:
                logging.error("Exception in assert_table_data: " + repr(e))
                assert_str = repr(e)
            try:
                if cur:
                    cur.close()
            except:
                pass
            if assert_str:
                assert False, assert_str

    def assert_table_data_json(self, table, filename, keyfields=None, fail_on_key_not_found=True,
                               skip_columns=[], namespace=""):
        """ compares records in the table according to the records in the yml-file.
            They keyfield defines, which of the fields in the yml-file will be used
            in the where - clause of the select statement. Only the first record will be compared. \n
            Some parameters control the manipulation: \n

            :param keyfields: If keyfields is given, these fields together lead to unique records. If
                         it is not given, the first field in a yaml-section is supposed to be the key-field. \n
            :param fail_on_key_not_found: if True, the function fails if the table does not have a requested row. \n
            :param skip_columns:[] only compare these columns.

        """
        assert_str = None
        cur = None
        san_table = KioskSQLDb.sql_safe_namespaced_table(namespace=namespace,
                                                         db_table=table)
        if filename:
            try:
                with open(filename, "r", encoding="utf-8") as jsonfile:
                    records = json.load(jsonfile)
            except Exception as e:
                logging.error(repr(e))
                records = None
            try:
                if records:
                    # logging.debug("records is true")
                    cur = KioskSQLDb.get_dict_cursor()
                    if cur:
                        cur.execute(f"select count(*) from {san_table}")
                        r_count = cur.fetchone()
                        assert r_count[0] == len(records), f"different number of records in json and table {table}: " \
                                                           f"{r_count[0]} instead of {len(records)}"

                        for row in records:
                            sqlselect = f"SELECT " + f"* FROM {san_table} WHERE "
                            where_values = []
                            sqlwhere = ""
                            if keyfields:
                                for keyfield in keyfields:
                                    if sqlwhere:
                                        sqlwhere += " AND "
                                    sqlwhere += "\"" + keyfield + "\""
                                    sqlwhere = sqlwhere + "=%s"
                                    where_values.append(row[keyfield])
                            else:
                                kf = list(row.keys())[0]
                                sqlwhere = "\"" + kf + "\""
                                sqlwhere = sqlwhere + "=%s"
                                where_value = row[kf]

                            sqlselect = sqlselect + sqlwhere + ";"
                            try:
                                cur.execute(sqlselect, where_values)
                                rowcount = cur.rowcount
                            except Exception as e:
                                print(repr(e))
                                rowcount = 0

                            if rowcount == 0:
                                if fail_on_key_not_found:
                                    assert False, f"rowcount = 0: Key {sqlwhere} with %s = {where_values}" \
                                                  f" not found in table " + table
                            else:
                                table_row = cur.fetchone()
                                if table_row:
                                    for key, value in row.items():
                                        if not skip_columns or \
                                                (key not in skip_columns):
                                            if not value or value == "null":
                                                assert not table_row[
                                                    key], f"{table_row[key]} in record {table_row} is not None."
                                            else:
                                                if isinstance(table_row[key], datetime.datetime):
                                                    dt_value = datetime.datetime.strptime(value,
                                                                                          '%Y-%m-%d %H:%M:%S.%f')
                                                    assert kioskstdlib.compare_datetimes(table_row[
                                                                                            key], dt_value,
                                                                                        compare_microseconds=False) == 0, \
                                                        f"{table_row[key]} != {value}"
                                                else:
                                                    if isinstance(table_row[key], dict):
                                                        value = json.loads(value)
                                                        assert table_row[
                                                                   key] == value, \
                                                            "table " + table + ",field " + key + \
                                                            " does not have the right value: " + str(
                                                                value) + " but " + str(table_row[key])
                                                    else:
                                                        assert str(table_row[
                                                                       key]) == str(value), \
                                                            "table " + table + ",field " + key + \
                                                            " does not have the right value: " + str(
                                                                value) + " but " + str(table_row[key])
                                else:
                                    if fail_on_key_not_found:
                                        assert False, "asdf Key " + sqlwhere + " with %s = " + str(
                                            where_value) + " not found in table " + table
                    if cur:
                        cur.close()
                else:
                    raise Exception("No records in json file")
            finally:
                try:
                    if cur:
                        cur.close()
                except:
                    pass

    # todo: needs redesign for pytest.
    # def create_path( path):
    #     try:
    #         if not os.path.isdir(path):
    #             makedirs(path)
    #     except OSError as e:
    #         if e.errno != errno.EEXIST:
    #             raise Exception("Exception creating " + path + ": " + repr(e))
    #     self.paths_created.append(path)
    #
    # def writetofile( filename, text):
    #     try:
    #         with open(filename, 'w') as f:
    #             f.write(text)
    #         self.files_created.append(filename)
    #         return (True)
    #     except Exception as e:
    #         logging.error("Exception in writetofile: " + repr(e))
    #         return (False)
    #
    # def assert_file_contents( filename, text):
    #     try:
    #         with open(filename, "r") as f:
    #             s = f.read()
    #         assert s == text, "assert_file_contents failed: Contents of " + filename + " does not match " + text
    #     except Exception as e:
    #         assert False, "assert_file_contents failed: Reading " + filename + " did not work: " + repr(e)
    #
    # def remove_created_files(self):
    #     for f in self.files_created:
    #         try:
    #             os.remove(f)
    #         except:
    #             pass
    #
    # def remove_created_directories( remove_if_not_empty=False):
    #     for p in reversed(self.paths_created):
    #         print("removing " + p)
    #         try:
    #             if remove_if_not_empty:
    #                 shutil.rmtree(p)
    #             else:
    #                 os.rmdir(p)
    #         except:
    #             pass

    def file_exists(self, filepath):
        try:
            if os.path.isfile(filepath):
                return True
        except:
            pass
        return (False)

    @staticmethod
    def show_image(src_file, include_histogram: bool = False, show_externally=True):
        img: Image.Image = Image.open(src_file).convert("L")
        img_array = array(img)
        if include_histogram:
            fig = plt.figure()
            a = fig.add_subplot(1, 2, 1)
            plt.hist(img_array.flatten(), bins=256, range=(0.0, 255), fc='k', ec='k')
            a = fig.add_subplot(1, 2, 2)

        plt.imshow(img_array, cmap='gray')
        plt.show()
        if show_externally:
            img.show()

    def get_table_field_info(self, table, schema, field):
        sql = f"select * " \
              f"from INFORMATION_SCHEMA.COLUMNS where table_name = '{table}' and table_schema='{schema}' and column_name='{field}';"
        r = None
        try:
            cur = KioskSQLDb.get_dict_cursor()

            if cur:
                cur.execute(sql)
                r = cur.fetchone()
                cur.close()
        finally:
            cur.close()

        return r

    def get_table_fields_info(self, table, schema=""):
        if schema:
            sql = f"select * " \
                  f"from INFORMATION_SCHEMA.COLUMNS where table_name = '{table}' and table_schema='{schema}';"
        else:
            sql = f"select * " \
                  f"from INFORMATION_SCHEMA.COLUMNS where table_name = '{table}';"

        r = None
        fields = []
        try:
            cur = KioskSQLDb.get_dict_cursor()

            if cur:
                cur.execute(sql)
                r = cur.fetchone()
                while r:
                    _ = (r["column_name"], r["data_type"], r["is_nullable"], r["column_default"])
                    fields.append(_)
                    r = cur.fetchone()
                cur.close()
        finally:
            cur.close()

        return fields

    @staticmethod
    def sort_structure(structure: []):
        structure.sort(key=lambda x: x[0])
        return structure

    @staticmethod
    def arrays_are_equal(list1, list2):
        if len(list1) != len(list2):
            return False
        for l in list1:
            if l not in list2:
                return False

        return True

    def get_kiosk_testing_app(self, config_file, test_path, base_path=None):
        if not base_path:
            base_path = self.get_kiosk_base_path_from_test_path(test_path)

        print(f"config_file: {config_file}, root_path: {base_path}")
        config = self.get_config(config_file)
        assert config.database_name == "urap_test"

        kiosk_app = KioskAppFactory.create_app(config_file, root_path=base_path)
        kiosk_app.config["TESTING"] = True
        kiosk_app.config["SERVER_NAME"] = "localhost"
        assert "emergency_mode" not in kiosk_app.config
        return kiosk_app

    def get_general_store(self, config):
        rgs = RedisGeneralStore(config)
        kioskglobals.general_store = rgs
        return kioskglobals.general_store

