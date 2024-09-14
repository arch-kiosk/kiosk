import datetime
import logging
import ntpath
import time
import winreg
from os import path
# import yappi
from timeit import default_timer as timer

import pyodbc
import pythoncom

import kioskstdlib
from dsd.dsd3 import DataSetDefinition, KEY_TABLE_FLAG_EXPORT_DONT_TRUNCATE
from sync_config import SyncConfig
from kioskstdlib import report_progress
from tz.kiosktimezoneinstance import KioskTimeZoneInstance
from .filemakercontrol import FileMakerControl


class FileMakerControlWindows(FileMakerControl):
    """ FileMakerControl class for Windows.

    .. note::

        Don't instantiate directly, always use parent class FileMakerControl.get_instance()
    """

    ENCODING = "Latin1"

    def __init__(self):
        self.cnxn = None
        self.fmapp = None
        self.fm_doc = None
        self.opened_filename = ""
        self.odbc_ini_dsn = ""
        self.template_version = ""

    def __del__(self):
        try:
            self._quit_fm_db()
        except WindowsError as e:
            pass
        except BaseException as e:
            pass

    def _init_export_fm_filename(self, workstation):
        """ returns the path and filemaker-Model filename in a workstation's export folder if the file
            exists. Otherwise it returns an empty string.
        """
        destdir = SyncConfig.get_config().filemaker_export_dir

        if not path.isdir(destdir):
            logging.error(destdir + ' does not seem to exist or is not a folder/directory.')
            return ""

        destdir = path.join(destdir, workstation.get_id())
        if not path.isdir(destdir):
            logging.error(destdir + " does not seem to exist or is not a folder/directory.")
            return ""

        destfile = path.join(destdir, SyncConfig.get_config().filemaker_db_filename)
        if path.isfile(destfile):
            return destfile
        else:
            return ""

    def _init_import_fm_filename(self, workstation, check_path_only=False):
        """ returns the path and filemaker-Model filename in a workstation's import folder
            if the file exists. Otherwise it returns an empty string.
        """
        destdir = SyncConfig.get_config().filemaker_import_dir

        if not path.isdir(destdir):
            logging.error(destdir + ' does not seem to exist or is not a folder/directory.')
            return ""

        destdir = path.join(destdir, workstation.get_id())
        if not path.isdir(destdir):
            logging.error(destdir + " does not seem to exist or is not a folder/directory.")
            return ""

        destfile = path.join(destdir, SyncConfig.get_config().filemaker_db_filename)
        if check_path_only or path.isfile(destfile):
            return destfile
        else:
            return ""

    def _start_fm_db_with_com(self, fm_pathandfilename, userid, userpwd):
        """ starts a filemaker database using com. \n
        returns either the com document object of the filemaker Model or
        None, if something went wrong. In the latter case the filemaker Model will also be
        closed again to prevent succeeding errors. """
        # import locally because on IIS it throws an exception.
        import win32com.client
        try:
            if self.fmapp is None:
                # noinspection PyUnresolvedReferences
                pythoncom.CoInitialize()
                self.fmapp = win32com.client.Dispatch("FMPRO.Application")
            self.fmapp.Visible = 1
            fmdocs = self.fmapp.Documents
            logging.debug("Trying to open " + fm_pathandfilename)
            doc = fmdocs.Open(fm_pathandfilename, userid, userpwd)
            if doc is not None:
                logging.debug("%s has been opened." % doc.FullName)
            return (doc)
        except Exception as e:
            logging.error("Exception opening fm-database:" + repr(e))
            try:
                self._quit_fm_db()
            except:
                pass
        return None

    def _start_fm_script_and_wait(self, script_name, wait_seconds=10):
        """ since filemaker's DoFMScript command does neither return anything
        nor waits for the script to finish, this method simulates such behaviour.
        It calls the script script_name and waits for the script to return. If the
        script does not return within the given timespan of wait_seconds (default is 10),
        it returns an empty string. If the script succeeds the method returns the return-code
        of the script.

    .. note::

        This works only with filemaker databases that have a table constants, consisting of columns id and value.
        The script to call must write a script-result into the table under the key "scriptresult" that
        translates in python to True. This script result is returned to the caller.

    """
        if self.cnxn:
            if self.fm_doc:
                cur = self.cnxn.cursor()
                cur.execute('select "value" from "constants" where "id"=\'scriptresult\'')
                if not cur.fetchone():
                    cur.execute('INSERT INTO "constants"("id", "value") VALUES(?, ?)', ["scriptresult", ""])
                    logging.info("inserted scriptresult")
                    self.cnxn.commit()
                else:
                    cur.execute('UPDATE "constants" set "value"=\'\' where "id"=\'scriptresult\'')
                    self.cnxn.commit()
                self.fm_doc.DoFMScript(script_name)
                v = ""
                i = 0
                while True:
                    cur.execute('select "value" from "constants" where "id"=\'scriptresult\'')
                    v = cur.fetchone()[0]
                    if v:
                        logging.debug("filemaker script " + script_name + " returned " + str(v))
                        break
                    i = i + 1
                    if i > wait_seconds:
                        logging.error(f"filemaker script {script_name} did not run or did not return anything "
                                      f"after {i} seconds. ")
                        logging.error(f"aborted script {script_name} due to timeout.")
                        break
                    time.sleep(1)

                if i > wait_seconds:
                    return ""

                return v
        return ""

    def _quit_fm_db(self):
        """ closes a potentially open odbc connection to filemaker, an open filemaker com document,
            and database com object. Catches all exceptions. Returns nothing.
        """
        try:
            if self.cnxn is not None:
                self.cnxn.close()
                self.cnxn = None
        except WindowsError as e:
            logging.error(repr(e))
        except BaseException as e:
            logging.error(repr(e))

        try:
            if self.fm_doc is not None:
                logging.debug("_quit_fm_db: Trying to close doc")
                self.fm_doc.close()
                logging.debug("_quit_fm_db: Setting doc to None")
                self.fm_doc = None
                logging.debug("_quit_fm_db: doc set to None!")
        except WindowsError as e:
            logging.error(repr(e))
        except BaseException as e:
            logging.error(repr(e))
        try:
            if self.fmapp is not None:
                logging.debug("_quit_fm_db: Trying to quit fm")
                self.fmapp.quit()
                logging.debug("_quit_fm_db: Settung fmapp to None")
                self.fmapp = None
                logging.debug("_quit_fm_db: Did it")
        except WindowsError as e:
            logging.error(repr(e))
        except BaseException as e:
            logging.error(repr(e))
        self.opened_filename = ""

    def start_fm_database(self, workstation, pathandfilename="export", codepage_encoding="Latin1",
                          use_odbc_ini_dsn=False):
        """ starts a workstation's filemaker database, opens an odbc connection to it,
            and checks whether the database meets the necessary specifications. \n
            returns the odbc connection or None in case of an error. Makes sure that the
            filemaker database is closed in case of error.\n
            If pathandfilename contains "export" or the parameter is not given at all
            path and filename of the fm database in the export folder will be used. \n
            If pathandfilename contains "import" path and filename of the fm database in the
            import folder will be used.  \n
            Otherwise the given path and filename will be used.

            todo: refactor. It is too long and too ugly. And why this mess with "export" and import and all? Hmpf.
        """

        self.template_version = ""
        usrname = SyncConfig.get_config().filemaker_db_usr_name
        usrpwd = SyncConfig.get_config().filemaker_db_usr_pwd
        s = SyncConfig.get_config().filemaker_encoding
        if s:
            self.ENCODING = s
        else:
            self.ENCODING = codepage_encoding

        if use_odbc_ini_dsn:
            s = SyncConfig.get_config().odbc_ini_dsn
            if not s:
                logging.error("Error in start_fm_database: use_odbc_ini_dsn requested "
                              "without odbc_ini_dsn configured in config.yml")
                return None
            else:
                self.odbc_ini_dsn = s

        if self.cnxn:
            try:
                self.cnxn.close()
                self.cnxn = None
            except:
                pass

        if pathandfilename == "export":
            logging.error("Call to FileMakerControlWindows with 'export' is not supported anymore.")
            raise DeprecationWarning("Call to FileMakerControlWindows with 'export' is not supported anymore.")
            # filename = self._init_export_fm_filename(workstation)
            # if not (filename):
            #     logging.error("workstation's filemaker-file in the export folder could not be located.")
            #     return (None)
        elif pathandfilename == "import":
            filename = self._init_import_fm_filename(workstation)
            if not filename:
                logging.error("workstation's filemaker-file in the import folder could not be located.")
                return None
        else:
            filename = pathandfilename

        if not path.isfile(filename):
            logging.error("The filemaker-file %s does not exist." % filename)
            return None

        databasename = str(ntpath.split(filename)[1].split(".", 2)[0])
        odbc_connect_str = 'Driver=FileMaker ODBC;Server=localhost;' + \
                           'Database=' + databasename + ';UID=' + usrname
        if not use_odbc_ini_dsn:
            odbc_connect_str = 'Driver=FileMaker ODBC;Server=localhost;' + \
                               'Database=' + databasename + ';UID=' + usrname
            if usrpwd != "":
                odbc_connect_str = odbc_connect_str + ';pwd=' + usrpwd
        else:
            try:
                if self.ENCODING.lower() == "utf-8":
                    odbc_encoding = "UTF-8"
                    auto_detect_encoding = "No"
                else:
                    auto_detect_encoding = "No"
                    odbc_encoding = ""

                if self.set_odbc_ini_dsn(self.odbc_ini_dsn, {
                    "Database": databasename,
                    "AutoDetectEncoding": auto_detect_encoding,
                    "MultiByteEncoding": odbc_encoding
                }):
                    odbc_connect_str = 'dsn=' + self.odbc_ini_dsn + ';UID=' + usrname
                    if usrpwd != "":
                        odbc_connect_str = odbc_connect_str + ';pwd=' + usrpwd
                    logging.debug(f"Using dsn method to open filemaker with encoding {odbc_encoding}.")
                else:
                    logging.error("start_fm_database: set_odbc_ini_dsn failed.")
                    return None
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.start_fm_database: Exception when "
                              f"setting odbc ini dsn: {repr(e)}")
                logging.info(f"{self.__class__.__name__}.start_fm_database: Connection string was "
                             f"{odbc_connect_str}")
                return None

        try:
            self.cnxn = pyodbc.connect(odbc_connect_str)
            if self.cnxn is not None:
                logging.error("Attempt to use start_fm_database when there is still a connection open. "
                              "Please close FileMaker first!")
                try:
                    self.cnxn.close()
                except:
                    pass
                self.cnxn = None
                return None
        except BaseException as e:
            err_str = repr(e)
            if "Unable to open file (802)" in err_str:
                logging.error("Attempt to use start_fm_database when there is "
                              "still a connection to a different database open. "
                              "Please close FileMaker first!")
                try:
                    self.cnxn.close()
                except:
                    pass
                self.cnxn = None
                return None

            logging.debug(f"{self.__class__.__name__}.start_fm_database: Expected Exception {err_str} "
                          f"when testing for open FM instance")
            pass

        self.fm_doc = self._start_fm_db_with_com(filename, usrname, usrpwd)
        if self.fm_doc is not None:
            try:
                logging.debug("Connecting " + databasename + " using " + odbc_connect_str)
                self.cnxn = pyodbc.connect(odbc_connect_str)
                self.cnxn.setdecoding(pyodbc.SQL_CHAR, encoding=self.ENCODING)
                self.cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding=self.ENCODING)
            except Exception as e:
                logging.error("Error opening odbc connection to database " + databasename + ": " + repr(e))

        if self.fm_doc is not None and self.cnxn is not None:
            try:
                cursor = self.cnxn.cursor()
                cursor.execute("select \"value\" from constants where id='template_version'")
                self.template_version = cursor.fetchval()
                logging.debug("template version is " + self.template_version)
                cursor.close()
                self.opened_filename = filename
                return self.cnxn
            except Exception as e:
                logging.error("Error reading template_version: " + repr(e))

        self._quit_fm_db()
        return None

    def count_images_modified_recently(self):
        """
        This checks how many records in the images table have been modified within the last 5 minutes
        :return: the number of images that have been modified in the last 5 minutes
        """
        # todo: time zone
        # this us using something like a current time in FileMaker. Think about it in terms of time zones

        result = -1
        cur = self.cnxn.cursor()
        try:
            cur.execute("select " + "count(uid) from images where hour(CURTIMESTAMP - modified) = 0 and "
                                    "minute(CURTIMESTAMP - modified) < 5 ")
            result = cur.fetchone()[0]
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.count_images_modified_recently : {repr(e)}")
        finally:
            try:
                cur.close()
            except BaseException:
                pass

        return result

    def check_fm_database(self, check_template_version=False):
        """checks whether an open filemaker database meets the necessary specifications. It checks if the
            database meets the configured template_version (if check_template_version is True!) and
            calls the evaluation script "check_scripting" in the fm database. \n
            Only if this fm script returns 1 and the configured template_version under the key f_check_scripting
            in the table constants the database is accepted.
        :returns True if the database meets the requirements.
        """
        rc = False
        if check_template_version:
            if isinstance(SyncConfig.get_config().expected_filemaker_template_version, float):
                logging.error("Kiosk Configuration has the filemaker_template_version configured "
                              "as a floating point number and not as a text. "
                              "Please enclose the template version in single quotes")
                return rc

            if not self.template_version.upper() == SyncConfig.get_config().expected_filemaker_template_version.upper():
                logging.error("template_version " + self.template_version + " and expected template version " +
                              SyncConfig.get_config().expected_filemaker_template_version + " don't match!")
                return rc

        cur = self.cnxn.cursor()
        cur.execute("update \"constants\" set \"value\"='' where \"id\"='f_check_scripting'")
        self.cnxn.commit()
        cur.close()
        try:
            if self.fm_doc is not None:
                logging.debug(self.fm_doc.FullName)
                v = self._start_fm_script_and_wait("check_scripting", 3)
                if not v or str(v) != "1":
                    logging.warning("check_scripting did not run properly. _start_fm_script_and_wait returned %s " % v)
            else:
                logging.error("fm_doc is none!")
            cur = self.cnxn.cursor()
            cur.execute("select \"value\" from \"constants\" where \"id\"='f_check_scripting'")
            logging.debug("select value from constants where id='f_check_scripting' returned row count of %s " % str(
                cur.rowcount))
            v = cur.fetchone()[0]
            logging.debug("f_check_scripting is %s" % v)
            rc = (v == self.template_version)
        except Exception as e:
            logging.error(repr(e))
        if not rc:
            logging.error("scripting does not work properly with the fm file ")
        try:
            cur.close()
        except:
            pass
        return rc

    def check_is_table_already_up_to_date(self, tablename, latest_record_data,
                                          current_tz: KioskTimeZoneInstance = None):
        fm_cur = None
        try:
            fm_cur = self.cnxn.cursor()
            return self._is_table_already_up_to_date(tablename, fm_cur, latest_record_data[0], latest_record_data[1],
                                                     latest_record_data[2], current_tz=current_tz)
        finally:
            if fm_cur:
                fm_cur.close()

    def transfer_table_data_to_filemaker(self, db_cur, dsd: DataSetDefinition, tablename,
                                         fieldlist=None, dest_tablename="", latest_record_data=None,
                                         current_tz: KioskTimeZoneInstance = None):
        """ Transfers data from a table in an open odbc database to the same table in the filemaker database
            wants an open odbc database as source in db_cur, a DataSetDefinition that defines the columns to copy and
            the name of the table to copy. \n

            As an alternative to the DataSetDefinition, a list with fieldnames can be supplied.
            The odbc database and the filemaker database need to be open. \n

            if no dsd is provided the target table will always be truncated. Otherwise the dsd table flag
            EXPORT_DONT_TRUNCATE can prevent this.

            returns True or False.

            :param db_cur: open postgres cursor
            :param dsd: the dsd from which to look up the table structure. Can be None, in which case "fieldlist" must
                        provide the table structure. _tz fields will automatically be omitted from the structure.
            :param tablename: (source) table name. The dsd table name of the source. required.
            :param fieldlist: if fieldlist is given, the table structure will not be retrieved from the dsd.
                              Note that in this case the caller has to care about removing _tz fields from the list.
                              Note also that all datetime fields are located in timezone "r"
            :param dest_tablename: only if different from the source table name
            :param latest_record_data: a tuple: (modified_field_name, max_modified_by, record_count).
                                       If set the whole transfer will only happen if the most recent value of
                                       the modified_field_name (usually "modified") is
                                       different between the src and dest or if the number of records differs
                                       between the two tables. If Null, the transfer will always proceed.
                                       Note: The latest_record_data is in UTC time zone.
            :param current_tz: required current time zone information to user for FileMaker
            :return: 0: method did not succeed
                     1: data was transferred successfully
                     2: data did not need to be transferred: Table was already up to date
            :raises nothing in particular but can let a few Exceptions through

            :todo: refactor It is a bit longish.
            :todo: test
        """

        # yappi.start()
        assert tablename, f"obsolete: transfer_table_data_to_filemaker needs a table name (dest table {dest_tablename})"
        assert dsd, f"obsolete: transfer_table_data_to_filemaker needs dsd information (table {tablename})"
        assert current_tz, f"obsolete: transfer_table_data_to_filemaker needs a current_tz parameter (table {tablename})"

        if not fieldlist:
            fieldlist = []

        if not dest_tablename:
            dest_tablename = tablename

        fm_sql_insert = ""
        fm_sql_delete = ""
        key_field = ""
        params = ""

        truncate = not dsd.table_has_meta_flag(tablename, KEY_TABLE_FLAG_EXPORT_DONT_TRUNCATE)

        try:
            fm_cur = self.cnxn.cursor()
            if latest_record_data:
                if self._is_table_already_up_to_date(dest_tablename, fm_cur, latest_record_data[0],
                                                     latest_record_data[1], latest_record_data[2],
                                                     current_tz=current_tz):
                    fm_cur.close()
                    return 2
                logging.debug(f"{self.__class__.__name__}.transfer_table_data_to_filemaker:"
                              f"table {dest_tablename} gets updated.")
            else:
                logging.debug(f"{self.__class__.__name__}.transfer_table_data_to_filemaker:"
                              f"table {dest_tablename} always gets updated.")

            if truncate:
                logging.debug(f"{self.__class__.__name__}.transfer_table_data_to_filemaker: "
                              f"truncating {dest_tablename}")
                fm_sql_truncate = "TRUNCATE TABLE " + dest_tablename
                fm_cur.execute(fm_sql_truncate)
                self.cnxn.commit()
            else:
                key_field = dsd.get_uuid_field(tablename)
                if not key_field:
                    raise Exception(f"table {dest_tablename} does not seem to have a replfield_uuid instruction. "
                                    f"It is necessary if table is flagged EXPORT_DONT_TRUNCATE.")
                else:
                    logging.debug(f"table {dest_tablename} will not be truncated "
                                  f"because of dsd table flag EXPORT_DONT_TRUNCATE ")
                    fm_sql_delete = f'DELETE FROM \"{dest_tablename}\" WHERE upper(\"{key_field}\")=upper(\'%s\')'

            logging.debug(f"{self.__class__.__name__}.transfer_table_data_to_filemaker: "
                          f"about to insert into {dest_tablename}")
            fm_sql_insert = 'INSERT INTO ' + dest_tablename + '('
            fm_sql_insert_values = ""
            comma = ""

            if not fieldlist:
                # remove _tz fields as they are not to be transported to FileMaker
                fieldlist = [f for f in dsd.list_fields(tablename) if dsd.get_field_datatype(tablename, f) != "tz"]

            varchar_fields = []
            timestamp_fields = {}

            # u_fields = list(dsd.get_fields_with_instructions(tablename, ["replfield_modified"]).keys())
            modified_fields = dsd.list_fields_with_instruction(tablename, "replfield_modified")
            modified_field_name = modified_fields[0] if modified_fields else ""
            if modified_field_name:
                fieldlist.append("modified_ww")

            for f in fieldlist:
                fm_sql_insert = fm_sql_insert + comma + '"' + f + '"'
                fm_sql_insert_values = fm_sql_insert_values + comma + "?"
                comma = ", "
                if f != "modified_ww":
                    field_data_type = dsd.get_field_datatype(tablename, f)
                    if field_data_type in ["varchar", "text"] or \
                            (tablename == "fm_repldata_transfer" and f == "modified_by"):  # todo: That looks hacky. Why the direct reference to "modified_by"?
                        varchar_fields.append(f)
                    else:
                        if field_data_type == "timestamp":
                            timestamp_fields[f] = dsd.get_tz_type_for_field(tablename, f) if dsd else ""

            fm_sql_insert = fm_sql_insert + ") VALUES(" + fm_sql_insert_values + ")"

            r_count = 1
            max_time_elapsed = 0
            sum_time = 0
            average = 0
            # culprits = []
            c_ts_values = 0
            c_ts_to_u = 0
            c_ts_to_r = 0

            row = db_cur.fetchone()
            while row:
                if not truncate:
                    # in this case every single record has to be deleted first.
                    sql = fm_sql_delete % row[key_field]
                    fm_cur.execute(sql)

                params = []
                for f in fieldlist:
                    try:
                        # noinspection PyComparisonWithNone
                        if f == "modified_ww":
                            modified_value = row["modified"]
                            modified_tz_value = row["modified_tz"]
                            field_value = current_tz.utc_dt_to_tz_dt(modified_value, modified_tz_value) \
                                if modified_tz_value else modified_value
                        else:
                            field_value = row[f]
                            if field_value is not None:
                                if f in varchar_fields:
                                    field_value = self._handle_gobbledygook(f, field_value, row, tablename)
                                elif f in timestamp_fields.keys():
                                    c_ts_values += 1
                                    tz_value = row[f + "_tz"]
                                    if tz_value:
                                        # if f in u_fields:
                                            # the u_fields (modified field, created field or proxy_for) are always
                                            #  converted to current user time zone
                                        if timestamp_fields[f] == "u":
                                            field_value = current_tz.utc_dt_to_user_dt(field_value)
                                        elif timestamp_fields[f] == "r":
                                            field_value = current_tz.utc_dt_to_recording_dt(field_value)
                                        else:
                                            # timestamp in its originally recorded time zone
                                            field_value = current_tz.utc_dt_to_tz_dt(field_value, tz_value)
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.transfer_table_data_to_filemaker: "
                                      f"Exception when processing field {f}...")
                        raise e

                    params.append(field_value)

                start = timer()
                success = False
                try:
                    fm_cur.execute(fm_sql_insert, params)
                    success = True
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.transfer_table_data_to_filemaker: {repr(e)}")
                    raise Exception(f"Error when transferring record {row['uid'] if 'uid' in row else '?'} "
                                    f"from {tablename} to {dest_tablename}")
                end = timer()
                r_count = r_count + 1
                time_elapsed = end - start
                sum_time = sum_time + time_elapsed
                # if time_elapsed > 0.06:
                #     if "uid" in row:
                #         culprits.append((row["uid"], time_elapsed))
                if time_elapsed > max_time_elapsed:
                    max_time_elapsed = time_elapsed
                average = sum_time / r_count
                row = db_cur.fetchone()


            logging.info(f"About to commit {str(r_count - 1)} lines in {dest_tablename}")
            self.cnxn.commit()
            logging.info(f"Copied {str(r_count - 1)} lines from {tablename} to filemaker: {dest_tablename}")
            logging.info(f"sum_time is {sum_time}. max_time_elapsed is {max_time_elapsed}. "
                         f"Average is {sum_time / r_count} ")
            logging.info(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                         f"Converted {str(c_ts_to_u)} of {str(c_ts_values)} timestamps "
                         f"to user time zone {current_tz.user_tz_iana_name}")
            logging.info(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                         f"Converted {str(c_ts_to_r)} of {str(c_ts_values)} timestamps "
                         f"to recording time zone {current_tz.recording_tz_iana_name}")

            return 1
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.transfer_table_data_to_filemaker: "
                          f"Exception {e.__class__.__name__} occurred: {repr(e)}")
            logging.info(f"The last sql was: {fm_sql_insert} with params {params}")
            for s in e.args:
                logging.error(f"Error details: {s}")
            try:
                self.cnxn.commit()
            except:
                pass
            try:
                fm_cur.close()
            except:
                pass

        return 0

    def transfer_non_dsd_table_data_to_filemaker(self, db_cur,
                                                 fieldlist: dict, dest_tablename="", latest_record_data=None,
                                                 current_tz: KioskTimeZoneInstance = None,
                                                 truncate=True,
                                                 delete_key_field=""):
        """ Transfers data from a table in an open odbc database to the same table in the filemaker database
            wants an open odbc database as source in db_cur, a DataSetDefinition that defines the columns to copy and
            the name of the table to copy. \n

            As an alternative to the DataSetDefinition, a list with fieldnames can be supplied.
            The odbc database and the filemaker database need to be open. \n

            if no dsd is provided the target table will always be truncated. Otherwise the dsd table flag
            EXPORT_DONT_TRUNCATE can prevent this.

            returns True or False.

            :param db_cur: open postgres cursor
            :param fieldlist: required. A dictionary with fields as keys and a tuple as value.
                                        the field tuple consists of
                                        [0] datetype: a dsd data type,
                                        [1] timezone type: None for non-datetimes, "r" or "u" for datetimes
            :param dest_tablename: required. The table name
            :param latest_record_data: a tuple: (modified_field_name, max_modified_by, record_count).
                                       If set the whole transfer will only happen if the most recent value of
                                       the modified_field_name (usually "modified") is
                                       different between the src and dest or if the number of records differs
                                       between the two tables. If Null, the transfer will always proceed.
                                       Note: The latest_record_data is in UTC time zone.
            :param current_tz: required current time zone information to user for FileMaker
            :param truncate: optional default True.
                             if False every single record is deleted with a delete statement first.
                             Needs the delete_key_field.
            :param delete_key_field: required IF truncate is False. The field that is the key field for the table.
                                     Usually "uid"
            :return: 0: method did not succeed
                     1: data was transferred successfully
                     2: data did not need to be transferred: Table was already up to date
            :raises nothing in particular but can let a few Exceptions through

            :todo: refactor It is a bit longish.
            :todo: test
        """

        # yappi.start()
        assert dest_tablename, f"transfer_non_dsd_table_data_to_filemaker needs a dest_tablename parameter."
        assert isinstance(fieldlist, dict), "transfer_non_dsd_table_data_to_filemaker " \
                                            "needs a fieldlist parameter of type dictionary." \
                                            f" (table {dest_tablename})"
        assert current_tz, (f"obsolete: transfer_non_dsd_table_data_to_filemaker needs a current_tz parameter"
                            f" (table {dest_tablename})")

        fm_sql_insert = ""
        fm_sql_delete = ""
        params = ""

        try:
            fm_cur = self.cnxn.cursor()
            if latest_record_data:
                if self._is_table_already_up_to_date(dest_tablename, fm_cur, latest_record_data[0],
                                                     latest_record_data[1], latest_record_data[2],
                                                     current_tz=current_tz):
                    fm_cur.close()
                    return 2
                logging.debug(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker:"
                              f"table {dest_tablename} gets updated.")
            else:
                logging.debug(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker:"
                              f"table {dest_tablename} always gets updated.")

            if truncate:
                logging.debug(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                              f"truncating {dest_tablename}")
                fm_sql_truncate = "TRUNCATE TABLE " + dest_tablename
                fm_cur.execute(fm_sql_truncate)
                self.cnxn.commit()
            else:
                if not delete_key_field:
                    raise Exception(f"table {dest_tablename} is not supposed to be truncated but "
                                    f"no key field for deletion is given")
                else:
                    logging.debug(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                                  f"table {dest_tablename} will not be truncated ")
                    fm_sql_delete = f'DELETE FROM \"{dest_tablename}\" WHERE upper(\"{delete_key_field}\")=upper(\'%s\')'

            logging.debug(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                          f"about to insert into {dest_tablename}")
            fm_sql_insert = 'INSERT INTO ' + dest_tablename + '('
            fm_sql_insert_values = ""
            comma = ""

            varchar_fields = []
            timestamp_fields = {}

            # get rid of tz fields
            for tz_f in [f for f, f_info in fieldlist.items() if f_info[0].lower() == "tz"]:
                fieldlist.pop(tz_f)

            for f, f_info in fieldlist.items():
                fm_sql_insert = fm_sql_insert + comma + '"' + f + '"'
                fm_sql_insert_values = fm_sql_insert_values + comma + "?"
                comma = ", "
                field_data_type = f_info[0].lower()
                if field_data_type in ["varchar", "text"]:
                    varchar_fields.append(f)
                else:
                    if dest_tablename == "fm_repldata_transfer" and f == "modified_by":
                        varchar_fields.append(f)
                    if field_data_type == "timestamp":
                        timestamp_fields[f] = f_info[1] if f_info[1] else "r"

            fm_sql_insert = fm_sql_insert + ") VALUES(" + fm_sql_insert_values + ")"

            row = db_cur.fetchone()

            r_count = 1
            max_time_elapsed = 0
            sum_time = 0
            # average = 0
            # culprits = []
            c_ts_values = 0
            c_ts_to_u = 0
            c_ts_to_r = 0
            while row:
                if not truncate:
                    # in this case every single record has to be deleted first.
                    sql = fm_sql_delete % row[delete_key_field]
                    fm_cur.execute(sql)

                params = []
                for f in fieldlist.keys():
                    try:
                        field_value = row[f]
                        # noinspection PyComparisonWithNone
                        if field_value is not None:
                            if f in varchar_fields:
                                field_value = self._handle_gobbledygook(f, field_value, row, dest_tablename)
                            elif f in timestamp_fields.keys():
                                c_ts_values += 1
                                tz_value = row[f + "_tz"]
                                if tz_value:
                                    if not timestamp_fields[f]:
                                        # timestamp in its originally recorded time zone
                                        field_value = current_tz.utc_dt_to_tz_dt(field_value, tz_value)
                                    elif timestamp_fields[f] == "u":
                                        # timestamp in the current user time zone
                                        c_ts_to_u += 1
                                        field_value = current_tz.utc_dt_to_user_dt(field_value)
                                    elif timestamp_fields[f] == "r":
                                        # timestamp in the current recording time zone
                                        c_ts_to_r += 1
                                        field_value = current_tz.utc_dt_to_recording_dt(field_value)
                    except BaseException as e:
                        logging.error(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                                      f"Exception when processing field '{f}'...")
                        raise e

                    params.append(field_value)

                start = timer()
                try:
                    fm_cur.execute(fm_sql_insert, params)
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: {repr(e)}")
                end = timer()
                r_count = r_count + 1
                time_elapsed = end - start
                sum_time = sum_time + time_elapsed
                # if time_elapsed > 0.06:
                #     if "uid" in row:
                #         culprits.append((row["uid"], time_elapsed))
                if time_elapsed > max_time_elapsed:
                    max_time_elapsed = time_elapsed
                # average = sum_time / r_count
                row = db_cur.fetchone()

            logging.info(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                         f"About to commit {str(r_count - 1)} lines in {dest_tablename}")
            self.cnxn.commit()
            logging.info(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                         f"Copied {str(r_count - 1)} lines from {dest_tablename} to filemaker: {dest_tablename}")
            logging.info(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                         f"sum_time is {sum_time}. max_time_elapsed is {max_time_elapsed}. "
                         f"Average is {sum_time / r_count} ")
            logging.info(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                         f"Converted {str(c_ts_to_u)} of {str(c_ts_values)} timestamps "
                         f"to user time zone {current_tz.user_tz_iana_name}")
            logging.info(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                         f"Converted {str(c_ts_to_r)} of {str(c_ts_values)} timestamps "
                         f"to recording time zone {current_tz.recording_tz_iana_name}")

            return 1
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                          f"Exception {e.__class__.__name__} occurred: {repr(e)}")
            logging.info(f"{self.__class__.__name__}.transfer_non_dsd_table_data_to_filemaker: "
                         f"The last sql was: {fm_sql_insert} with params {params}")
            for s in e.args:
                logging.error(f"Error details: {s}")
            try:
                self.cnxn.commit()
            except:
                pass
            try:
                fm_cur.close()
            except:
                pass

        return 0

    def _is_table_already_up_to_date(self, dest_tablename, fm_cur, modified_field_name,
                                     max_modified, record_count, current_tz: KioskTimeZoneInstance = None):
        """

        This checks if the most recent value of the modified_field_name
        (usually "modified") equals the given max_modified
        and if the number of records equals the given record_count.

        :param dest_tablename the destination table, where records are about to be copied to
        :param fm_cur a cursor to the filemaker database
        :param modified_field_name : this is the name of the modified field in the dest_table
        :param max_modified this is the UTC timestamp value max(modified_field_name) needs to meet.
        :param record_count this is the value count(modified_field_name) needs to meet
        :param current_tz - required time zone info to be used for the FileMaker database
        :return: True if the dest table fulfills the requirements.
        """
        # todo: test

        assert current_tz
        rc = False

        modified_field = modified_field_name
        if modified_field:
            fm_cur = fm_cur.execute(f"select max(\"{modified_field}\") \"max_modified\", "
                                    f"count(\"{modified_field}\") \"c\" from \"{dest_tablename}\"")
            fm_record = fm_cur.fetchone()

            # time zone: The max_modified from postgres is always in UTC,
            #  so the FM max modified needs a conversion
            pg_utc_dt: datetime.datetime = max_modified
            fm_utc_dt: datetime.datetime = current_tz.user_dt_to_utc_dt(fm_record[0])

            logging.debug(f"{self.__class__.__name__}._is_table_already_up_to_date: "
                          f"{dest_tablename}: max_modified={fm_record[0]}/UTC:{fm_utc_dt}, count={fm_record[1]}")

            if not fm_utc_dt and not pg_utc_dt:
                logging.info(f"{self.__class__.__name__}._is_table_already_up_to_date: "
                             f"Skipped {dest_tablename}: No records, so there is nothing to do.")
                return True

            # need to get rid of microseconds
            if fm_utc_dt:
                fm_utc_dt = datetime.datetime(fm_utc_dt.year, fm_utc_dt.month, fm_utc_dt.day, fm_utc_dt.hour,
                                              fm_utc_dt.minute, fm_utc_dt.second, 0)
            if pg_utc_dt:
                pg_utc_dt = datetime.datetime(pg_utc_dt.year, pg_utc_dt.month, pg_utc_dt.day, pg_utc_dt.hour,
                                              pg_utc_dt.minute, pg_utc_dt.second, 0)

            if fm_utc_dt == pg_utc_dt and fm_record[1] == record_count:
                logging.info(f"{self.__class__.__name__}._is_table_already_up_to_date: "
                             f"Skipped {dest_tablename}: Nothing to do.")
                rc = True
            else:
                logging.debug(f"{self.__class__.__name__}._is_table_already_up_to_date: "
                              f"{dest_tablename} needs an update: {fm_utc_dt} <> {pg_utc_dt}")
        return rc

    def _handle_gobbledygook(self, f, field_value, row, tablename):
        #  strange phenomenon in filemaker in the vm only: Instead of ""
        #  some gobbledygook is put into empty VARCHAR fields
        #  The following code filters it out but it is awful and I need to
        #  find a better solution or do away with the phenomenon itself
        #  one day

        if field_value.strip() == "":
            field_value = None
        else:
            if field_value.strip().encode("utf-8")[:3] == b'\xe6\xb0\x80':
                field_value = None
                logging.warning(f"{self.__class__.__name__}._handle_gobbledygook: " +
                                "Gobbledygook fix {}.{} of {} set to None".format(tablename, f, row["uid"]))

        return field_value

    def sync_internal_files_tables(self, files_table: str, columns_to_copy: [str]):
        """
        synchronizes the files table with the files_load table. Note that the modified_by in files has not
        been tampered with at this point (the old records are still in there) and files_load does not automatically
        change modified_by, so it reflects what is currently in the master(postgres) database.

        Records not in files_load are deleted in files,
        records with files.modified_by < files_load.modified_by are deleted, too.

        :param files_table: name of the files table (e.G. "images")
        :param columns_to_copy: the columns to copy from images_load to images (or whatever files_table name is)
        """
        fm_cur = self.cnxn.cursor()
        try:
            if self._sync_files_load_and_files(columns_to_copy, files_table, fm_cur):
                fm_cur.execute(f"select count(uid) from \"{files_table}\"")
                c_files = int(fm_cur.fetchone()[0])

                fm_cur.execute(f"select count(uid) from \"{files_table}_load\"")
                c_load_files = int(fm_cur.fetchone()[0])

                fm_cur.close()
                if c_files == c_load_files:
                    logging.debug(
                        f"{self.__class__.__name__}.sync_internal_files_tables: {c_files} records in {files_table}")
                    return True
                else:
                    logging.error(f"{self.__class__.__name__}.sync_internal_files_tables: {c_files} in {files_table}"
                                  f" != {c_load_files} in {files_table}_load")
                    return False
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.sync_internal_files_tables: {repr(e)}")

        try:
            fm_cur.close()
        except BaseException:
            pass

        return False

    def _sync_files_load_and_files(self, columns_to_copy, files_table, fm_cur):
        """

        :param columns_to_copy:
        :param files_table:
        :param fm_cur:
        :return:
        todo: this is using static field names for modified and img_proxy. The dsd should provide the field names.
        """
        sql = ""
        try:
            files_load_table = files_table + "_load"

            # first delete all records in the file table that are not in the _load table
            logging.debug(f"{self.__class__.__name__}.sync_internal_files_tables: "
                          f"deleting obsolete records in {files_table}")
            # fm_cur.execute(f"delete from \"{files_table}\" "
            #                f"where \"uid\" not in (select \"uid\" from \"{files_load_table}\")")
            sql = f"""delete from \"{files_table}\"
                           where \"uid\" in (
                              select \"{files_table}\".\"uid\" from \"{files_table}\" 
                              left outer join \"{files_load_table}\" 
                              on \"{files_table}\".\"uid\" = \"{files_load_table}\".\"uid\" 
                              where \"{files_load_table}\".\"uid\" is Null
                             )"""
            fm_cur.execute(sql)

            # then delete all records in the files table that are newer in the load table
            logging.debug(f"{self.__class__.__name__}.sync_internal_files_tables: "
                          f"deleting outdated or modified records in {files_table}")
            sql = f"""
                 delete from \"{files_table}\" where \"uid\" in (
                    select \"{files_table}\".\"uid\" from \"{files_table}\" 
                    inner join \"{files_load_table}\" on \"{files_table}\".\"uid\"=\"{files_load_table}\".\"uid\" 
                    where (\"{files_table}\".\"modified\" < \"{files_load_table}\".\"modified\")
                    or (\"{files_table}\".\"img_proxy\" <> \"{files_load_table}\".\"img_proxy\")
                    )
                """
            fm_cur.execute(sql)

            # finally insert all new records from the load table into the files table
            sql_insert_columns = ",".join([f"\"{x}\"" for x in columns_to_copy])
            sql_select_columns = ",".join([f"\"{files_load_table}\".\"{x}\"" for x in columns_to_copy])
            sql = f"""
                 insert into \"{files_table}\" ({sql_insert_columns})
                    select {sql_select_columns} from \"{files_load_table}\" 
                    left outer join \"{files_table}\" 
                    on \"{files_load_table}\".\"uid\" = \"{files_table}\".\"uid\" 
                    where \"{files_table}\".\"uid\" is Null   
                """
            logging.debug(f"{self.__class__.__name__}.sync_internal_files_tables: "
                          f"adding from {files_table}_load to {files_table}")
            fm_cur.execute(sql)
            self.cnxn.commit()
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._sync_files_load_and_files: {repr(e)}")
            logging.info(f"last sql was {sql}")

        return False

    def set_constant(self, key, value, sync=0):
        """
        sets a key / value pair in the constants-table of the open filemaker - Model
        :param key: the key
        :param value: the value
        :param sync: 0 (default) = the key won't sync, -1=the key is defined on system level, 1=the key syncs

        """
        fm_cur = self.cnxn.cursor()
        try:
            if isinstance(value, datetime.datetime):
                dest_field = "value_ts"
                value.replace(microsecond=0)
            else:
                dest_field = "value"

            value = str(value)

            fm_cur.execute("select " +
                           "\"value\" from \"constants\" where \"id\"=?", [key])
            if not fm_cur.fetchone():
                logging.debug("inserting " + key + " = " + value + " into " + dest_field)
                fm_cur.execute("insert " +
                               "into \"constants\" (\"id\", \"" + dest_field + "\",\"sync\") values(?, ?, ?)",
                               [key, value, sync])
            else:
                logging.debug("updating " + key + " = " + value + " in " + dest_field)
                fm_cur.execute("update" + " \"constants\" " +
                               "set \"" + dest_field + "\"=?, " +
                               "\"sync\"=? " +
                               "where \"id\"=?", [value, sync, key])
            self.cnxn.commit()
            fm_cur.close()
            return True
        except Exception as e:
            logging.error(f"{self.__class__.__name__}.set_constant: setting {key} caused {repr(e)}")
            try:
                fm_cur.close()
            except BaseException:
                pass
        return False

    def get_ts_constant(self, key):
        """returns a timestamp value from the open filemaker-Model's constant table.
           if key does not exist or an error occurs, function returns None"""

        fm_cur = self.cnxn.cursor()
        try:
            fm_cur.execute("select \"value_ts\" from \"constants\" where \"id\"=?", [key])
            v = fm_cur.fetchone()
            fm_cur.close()
            if v:
                return v[0]
        except Exception as e:
            logging.debug("DB-Error in UrapFileMakerControlWindows.get_constants: " + repr(e))
        return None

    def get_constant(self, key):
        """returns a value from the open filemaker-Model's constant table.
           if key does not exist or an error occurs, function returns None"""

        fm_cur = self.cnxn.cursor()
        try:
            fm_cur.execute("select \"value\" from \"constants\" where \"id\"=?", [key])
            v = fm_cur.fetchone()
            fm_cur.close()
            if v:
                return v[0]
        except Exception as e:
            logging.debug("DB-Error in UrapFileMakerControlWindows.get_constants: " + repr(e))
        return None

    def select_table_data(self, dsd: DataSetDefinition, tablename, version=0, import_filter=""):
        try:
            sql_select = 'SELECT '
            comma = ""
            for f in dsd.omit_fields_by_datatype(tablename,
                                                 dsd.list_fields(tablename, version=version),
                                                 "tz"):
                sql_select = sql_select + comma + '"' + f + '"'
                comma = ", "
            sql_select = sql_select + ' FROM "' + tablename + '"'
            if import_filter:
                sql_select += " WHERE " + import_filter
                logging.debug(f"{self.__class__.__name__}.select_table_data: using import filter: "
                              f"{sql_select}.")

            fm_cur = self.cnxn.cursor()
            return fm_cur.execute(sql_select)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.select_table_data: Exception when querying table {tablename}:"
                          f" {repr(e)}")
            for s in e.args:
                logging.error(f"Error details: {s}")
            raise Exception(f"Error in select_table_data for table {tablename}")

    def export_container_images(self, workstation, printdots, callback_progress=None):
        """
        asks the filemaker database to unload all the images into the given path.

        todo time zone: Check if this still works when running on the server's FileMaker. The FM Code must only
         use the dates like fork_sync_time etc. from the constants and never now() or so!
        """
        try:
            path = workstation.get_and_init_files_dir("import")
            kioskstdlib.remove_files_in_directory(path)
            self.set_constant("image_export_dir", path)
            logging.debug("FileMakerWorkstation._import_containerfiles_from_filemaker: "
                          "Calling Filemaker 'ExportImages'")
            rc = self._start_fm_script_with_progress("ExportImages", "export_progress", 1, 240, True,
                                                     callback_progress=callback_progress)
            return bool(rc != "")

        except Exception as e:
            logging.error("Exception in export_container_images: " + repr(e))
        return False

    def get_tables(self):
        fm_cur = self.cnxn.cursor()
        fm_tables = fm_cur.tables()
        result = []
        for r in fm_tables:
            result.append(r.table_name)
        return result

    def start_fm_script_with_progress(self, script_name, progress_key, wait_seconds_per_step=1, max_wait_cycles=60,
                                      printdots=False, callback_progress=None):
        """ just the public version of _start_fm_script_with_progress """

        return self._start_fm_script_with_progress(script_name, progress_key,
                                                   wait_seconds_per_step=wait_seconds_per_step,
                                                   max_wait_cycles=max_wait_cycles,
                                                   printdots=printdots,
                                                   callback_progress=callback_progress)

    def _start_fm_script_with_progress(self, script_name, progress_key, wait_seconds_per_step=1, max_wait_cycles=60,
                                       printdots=False, callback_progress=None):
        """ since filemaker's DoFMScript command does neither return anything
        nor waits for the script to finish, this method simulates such behaviour.
        It calls the script script_name and waits for the script to return. If the
        script does not return after the given wait cycles (default is 60 by one second),
        it returns an empty string. If the script succeeds the method returns the return-code
        of the script. \n
        Unlike _start_fm_script_and_wait this method looks up the constant given by progress_key every
        wait_seconds_per_step and prints a dot for every accomplished point. The value must be
        "x/y" with x the completed steps and y the number of overall steps the fm-script estimates.
        if printdots is False, no output will be send to the screen.
        calback_progress is optional. If given, the progress will be reported there.

    .. note::

        This works only with filemaker databases that have a table constants, consisting of columns id and value.
        The script to call must write a script-result into the table under the key "scriptresult" that
        translates in python to True. This script result is returned to the caller.

    """
        if self.cnxn:
            if self.fm_doc:
                cur = self.cnxn.cursor()
                cur.execute('select "value" from "constants" where "id"=\'scriptresult\'')
                if not cur.fetchone():
                    cur.execute('INSERT INTO "constants"("id", "value") VALUES(?, ?)', ["scriptresult", ""])
                    logging.info("inserted scriptresult")
                    self.cnxn.commit()
                else:
                    cur.execute('UPDATE "constants" set "value"=\'\' where "id"=\'scriptresult\'')
                    self.cnxn.commit()

                self.fm_doc.DoFMScript(script_name)
                v = ""
                i = 0
                c_steps_done = 0
                c_steps = 0
                while True:
                    cur.execute('select "value" from "constants" where "id"=\'scriptresult\'')
                    v = cur.fetchone()[0]
                    if v:
                        logging.debug("filemaker script " + script_name + " returned " + str(v))
                        break
                    i = i + 1
                    if i > max_wait_cycles:
                        logging.debug("filemaker script did not run or did not return anything")
                        break
                    time.sleep(wait_seconds_per_step)
                    if printdots:
                        cur.execute('select "value" from "constants" where "id"=\'' + progress_key + '\'')
                        r = cur.fetchone()
                        if r:
                            progress = r[0]
                            if progress:
                                progress = progress.split(sep="/")
                                if len(progress) == 2:
                                    logging.debug("filemaker script " + script_name + " returned " + str(v))
                                    if int(progress[0]) != c_steps_done:
                                        i = 0
                                        c_steps_done = int(progress[0])
                                        c_steps = int(progress[1])
                                        if c_steps > 0:
                                            report_progress(callback_progress, c_steps_done * 100 / c_steps,
                                                            script_name)
                                else:
                                    logging.debug("filenmaker script is not returning a properly split progress.")
                            else:
                                logging.debug("filenmaker script is not returning a proper progress.")
                        else:
                            logging.debug("filenmaker script is not returning anything.")
                            # print("\n" + str(c_steps_done) + " of " + str(c_steps) + " done.")

                if i > max_wait_cycles:
                    logging.error("filemaker script " + script_name + " exceeded " + str(
                        max_wait_cycles * wait_seconds_per_step) + " seconds.")
                    return ""
                else:
                    return v
        return ""

    def process_repldata_transfer_table(self):
        """starts the script import_replication_data in filemaker and returns the resulting constant
           with the id import_replication_data, which constains the number of records that have been
           imported for any given table in the format "tablename:rowcount\ntablename:rowcount ... """
        """asks the filemaker database to unload all the images into the given path."""
        try:
            rc = self._start_fm_script_and_wait("import_replication_data", 60)
            if rc:
                import_result = self.get_constant("import_replication_data")
                return import_result

        except Exception as e:
            logging.error("Exception in process_repldata_transfer_table: " + repr(e))
        return ""

    def process_images_transfer_table(self, callback_progress=None):
        try:
            rc = self._start_fm_script_with_progress("import_images", "import_images_progress", 1, 60, True,
                                                     callback_progress=callback_progress)
            if rc:
                actually_inserted = self.get_constant("import_files_inserted")
                logging.info(f"{self.__class__.__name__}.process_images_transfer_table: "
                             f"{actually_inserted} files have actually been inserted.")
                import_result = self.get_constant("import_images_result")
                if import_result:
                    return import_result
                else:
                    logging.error("Error in process_images_transfer_table: Filemaker import_images returned " +
                                  str(rc) + " but constant import_images_result is empty.")
            else:
                logging.error("Error in process_images_transfer_table: Filemaker import_images returned False")

        except Exception as e:
            logging.error("Exception in process_images_transfer_table: " + repr(e))
        return ""

    def rebuild_file_identifier_cache(self, callback_progress=None):
        """
        Triggers the fm script "index_all_images" which rebuilds the file identifier cache.
        :param callback_progress: the method that processes the script's progress
        :return: True on success otherwise false
        """
        try:
            rc = self._start_fm_script_with_progress("index_all_images", "index_images_progress", 2, 60, True,
                                                     callback_progress=callback_progress)
            if rc:
                index_images_progress = self.get_constant("index_images_progress")
                logging.info(f"{self.__class__.__name__}.rebuild_file_identifier_cache: "
                             f"progress was {index_images_progress}.")
                if index_images_progress:
                    return True
                else:
                    logging.error("Error in rebuild_file_identifier_cache: Filemaker index_all_images"
                                  " returned nothing")
            else:
                logging.error("Error in rebuild_file_identifier_cache: Filemaker index_all_images returned False")

        except Exception as e:
            logging.error("Exception in rebuild_file_identifier_cache: " + repr(e))
        return False

    def _apply_config_patches(self):
        """
        Triggers the fm script "apply_config_patches" which patches marked configuration keys into the
        workstation configuration.
        :return: True on success otherwise false
        """
        try:
            rc = self._start_fm_script_and_wait("apply_config_patches", 10)
            if rc:
                logging.debug(f"{self.__class__.__name__}._apply_config_patches returned {rc}. ")
                return True
            else:
                logging.error(f"{self.__class__.__name__}._apply_config_patches: "
                              f"Filemaker script returned False")
        except Exception as e:
            logging.error(f"{self.__class__.__name__}._apply_config_patches: Exception " + repr(e))

        return False

    @classmethod
    def getfieldvalue(cls, rec, fieldname):
        """Unfortunately it is not really standardized how to access values of a record by column-name.
           Since the classes which use UrapFileMakerControl should not need to know the
           specific database interface used for accessing data, this wrapper helps."""
        return rec.__getattribute__(fieldname)

    def set_odbc_ini_dsn(self, dsn, key_values):
        ok = False
        odbc_ini = None
        dsn_key = None
        logging.debug("set_odbc_ini_dsn: Entering.")
        try:
            odbc_ini = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"Software\ODBC\ODBC.INI", 0, winreg.KEY_SET_VALUE)
            dsn_key = winreg.OpenKey(odbc_ini, dsn, 0, winreg.KEY_SET_VALUE)
        except BaseException:
            try:
                logging.debug(r"Set_odbc_ini_dsn: HKEY_LOCAL_MACHINE failed, that's ok!")
                winreg.CloseKey(odbc_ini)
            except BaseException:
                pass
            finally:
                odbc_ini = None

        if not odbc_ini:
            try:
                logging.debug("set_odbc_ini_dsn: trying HKEY_CURRENT_USER")
                try:
                    odbc_ini = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\ODBC\ODBC.INI", 0,
                                              winreg.KEY_SET_VALUE)
                except BaseException as e:
                    raise Exception(r"set_odbc_ini_dsn: Cannot access CURRENT_USER\Software\ODBC\ODBC.INI")
                try:
                    dsn_key = winreg.OpenKey(odbc_ini, dsn, 0, winreg.KEY_SET_VALUE)
                except BaseException as e:
                    raise Exception(f"set_odbc_ini_dsn: Cannot access odbc entry {dsn}")
            except Exception as e:
                logging.error("Exception in set_odbc_ini_dsn: " + repr(e))
                try:
                    winreg.CloseKey(odbc_ini)
                except:
                    pass

        if odbc_ini and dsn_key:
            logging.debug("set_odbc_ini: odbc_ini key and dsn_key open.")
            try:
                for k in key_values:
                    logging.debug(f"writing to open key: {k}={key_values[k]}")
                    winreg.SetValueEx(dsn_key, k, 0, winreg.REG_SZ, key_values[k])
                logging.debug("set_odbc_ini: all keys set.")
                ok = True
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.set_odbc_ini_dsn(): "
                              f"Exception when initializing odbc values{repr(e)}")

            finally:
                try:
                    winreg.CloseKey(dsn_key)
                except:
                    pass
                try:
                    winreg.CloseKey(odbc_ini)
                except:
                    pass
        logging.debug("set_odbc_ini: leaving.")

        return ok

    def start_independent_fm_database(self, pathandfilename, usrname, usrpwd, codepage_encoding="Latin1",
                                      use_odbc_ini_dsn=""):
        """ starts a workstation's filemaker database, opens an odbc connection to it,
            and checks whether the database meets the necessary specifications. \n
            returns the odbc connection or None in case of an error. Makes sure that the
            filemaker database is closed in case of error.\n
            If pathandfilename contains "export" or the parameter is not given at all
            path and filename of the fm database in the export folder will be used. \n
            If pathandfilename contains "import" path and filename of the fm database in the
            import folder will be used.  \n
            Otherwise the given path and filename will be used.
        """

        if self.cnxn:
            try:
                self.cnxn.close()
                self.cnxn = None
            except:
                pass
        self.fm_doc = None
        filename = pathandfilename

        if not path.isfile(filename):
            logging.error("The filemaker-file %s does not exist." % filename)
            return (None)

        databasename = ntpath.split(filename)[1].split(".", 2)[0]

        if not use_odbc_ini_dsn:
            odbc_connect_str = 'Driver=FileMaker ODBC;Server=localhost;' + \
                               'Database=' + databasename + ';UID=' + usrname
            if usrpwd != "":
                odbc_connect_str = odbc_connect_str + ';pwd=' + usrpwd
        else:
            if codepage_encoding.lower() == "utf-8":
                odbc_encoding = "UTF-8"
                AutoDetectEncoding = "No"
            else:
                AutoDetectEncoding = "No"
                odbc_encoding = ""

            if self.set_odbc_ini_dsn(use_odbc_ini_dsn, {
                "Database": databasename,
                "AutoDetectEncoding": AutoDetectEncoding,
                "MultiByteEncoding": odbc_encoding
            }):
                odbc_connect_str = 'dsn=' + use_odbc_ini_dsn + ';UID=' + usrname
            else:
                logging.error("start_independent_fm_database: set_odbc_ini_dsn failed.")
                return (None)

        try:
            self.cnxn = pyodbc.connect(odbc_connect_str)
            if self.cnxn is not None:
                logging.error(
                    "Attempt to use start_independent_fm_database when there is still a connection open. Please close FileMaker first!")
                self.cnxn.close()
                self.cnxn = None
                return (None)
        except:
            pass

        self.fm_doc = self._start_fm_db_with_com(filename, usrname, usrpwd)
        if self.fm_doc is not None:
            try:
                logging.debug("Connecting " + databasename)
                self.cnxn = pyodbc.connect(odbc_connect_str)
                self.cnxn.setdecoding(pyodbc.SQL_CHAR, encoding=codepage_encoding)
                self.cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding=codepage_encoding)
            except Exception as e:
                logging.error("Error opening odbc connection to database " + databasename + ": " + repr(e))

        if (self.fm_doc is not None) and self.cnxn is not None:
            self.opened_filename = filename
            return self.cnxn

        self._quit_fm_db()
        return None

    def truncate_table(self, table_name):
        fm_cur = self.cnxn.cursor()
        fm_sql_truncate = "TRUNCATE TABLE " + table_name
        fm_cur.execute(fm_sql_truncate)
        self.cnxn.commit()
