# todo time zone simpliciation
import ntpath
from os import path

from dsd.dsd3 import DataSetDefinition
from filemakerrecording.filemakercontrol import FileMakerControl
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig
from workstation import Dock


class MockWorkstation(Dock):
    @classmethod
    def register_states(cls):
        super().register_states()
        cls.STATE_NAME.update(
            {
                0: "IDLE",
                1: "READY_FOR_EXPORT",
                2: "IN_THE_FIELD",
                3: "BACK_FROM_FIELD"
            })

    def _load(self, cur=None):
        self.description = "dock"
        self.recording_group = "default"
        self.user_time_zone_index = 96554373  # Central European Time (Europe/Berlin)
        self.grant_access_to = "*"
        state = "IDLE"
        self.state_machine.set_initial_state(state)
        return True


class FileMakerControlMock(FileMakerControl):
    def __init__(self):
        self.cnxn = None
        self.fmapp = None
        self.fm_doc = None
        self.opened_filename = ""
        self.odbc_ini_dsn = ""
        self.template_version = ""

    def _init_import_fm_filename(self, workstation, check_path_only=False):
        """ returns the path and filemaker-Model filename in a workstation's import folder
            if the file exists. Otherwise it returns an empty string.
        """
        destdir = SyncConfig.get_config().filemaker_import_dir

        # if not path.isdir(destdir):
        #     logging.error(destdir + ' does not seem to exist or is not a folder/directory.')
        #     return ""

        destdir = path.join(destdir, workstation.get_id())
        # if not path.isdir(destdir):
        #     logging.error(destdir + " does not seem to exist or is not a folder/directory.")
        #     return ""

        destfile = path.join(destdir, SyncConfig.get_config().filemaker_db_filename)
        return destfile
        # if check_path_only or path.isfile(destfile):
        # else:
        #     return ""

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
                raise Exception("Error in start_fm_database: use_odbc_ini_dsn requested "
                                "without odbc_ini_dsn configured in config.yml")
            else:
                self.odbc_ini_dsn = s

        if pathandfilename == "export":
            raise DeprecationWarning("Call to FileMakerControlWindows with 'export' is not supported anymore.")
        elif pathandfilename == "import":
            filename = self._init_import_fm_filename(workstation)
            if not filename:
                raise Exception("workstation's filemaker-file in the import folder could not be located.")
        else:
            filename = pathandfilename

        # if not path.isfile(filename):
        #     logging.error("The filemaker-file %s does not exist." % filename)
        #     return None

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

                    # if self.set_odbc_ini_dsn(self.odbc_ini_dsn, {
                    #     "Database": databasename,
                    #     "AutoDetectEncoding": auto_detect_encoding,
                    #     "MultiByteEncoding": odbc_encoding
                    # }):
                    odbc_connect_str = 'dsn=' + self.odbc_ini_dsn + ';UID=' + usrname
                    if usrpwd != "":
                        odbc_connect_str = odbc_connect_str + ';pwd=' + usrpwd
                #     logging.debug(f"Using dsn method to open filemaker with encoding {odbc_encoding}.")
                # else:
                #     logging.error("start_fm_database: set_odbc_ini_dsn failed.")
                #     return None
            except BaseException as e:
                raise Exception(f"{self.__class__.__name__}.start_fm_database: Exception when "
                                f"setting odbc ini dsn: {repr(e)}")

            self.opened_filename = filename

        return True

    def select_table_data(self, dsd: DataSetDefinition, tablename, version=0, import_filter=""):
        try:
            sql_select = 'SELECT '
            comma = ""
            # todo time zone: this should only return the Zulu timestamp fields but not the _tz fields
            for f in dsd.omit_fields_by_datatype(tablename, dsd.list_fields(tablename, version=version), "tz"):
                if not f.endswith("_ww"):
                    sql_select = sql_select + comma + '"' + f + '"'
                    comma = ", "
            sql_select = sql_select + ' FROM "' + tablename + '"'
            if import_filter:
                sql_select += " WHERE " + import_filter

            return KioskSQLDb.execute_return_cursor(sql_select)
        except BaseException as e:
            raise Exception(f"Error in select_table_data for table {tablename}: {repr(e)}")

    @classmethod
    def getfieldvalue(cls, rec, fieldname):
        """Unfortunately it is not really standardized how to access values of a record by column-name.
           Since the classes which use UrapFileMakerControl should not need to know the
           specific database interface used for accessing data, this wrapper helps."""
        return rec[fieldname]

