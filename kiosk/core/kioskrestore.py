import fnmatch
import shutil
import hashlib
import uuid
import time
import datetime
import sys
import os
import logging
import subprocess

from ruamel.yaml import YAML

import psycopg2
import psycopg2.extras

import kioskstdlib
from kioskconfig import KioskConfig
from os import path
import zipfile

KIOSK_FILES = [
    r"api",
    r"core",
    r"plugins",
    r"static",
    r"templates",
    r"tools",
    r"sqlalchemy_models",
    r"__init__.py",
    r"run_kiosk.py",
    r"apply-kiosk-acl.ps1",
    r"this_is_the_kiosk_root.md",
    r"sync\sync\console.py",
    r"sync\sync\custom\default_filecontexts.py",
    r"sync\sync\sync_plugins",
    r"sync\sync\core",
    r"sync\sync\tools",
]

MCP_CORE_FILES = [
    r"sync\sync\mcpcore",
]

USER_TABLES = [
    r"kiosk_user",
    r"kiosk_privilege"
]

WORKSTATION_TABLES = [
    r"kiosk_workstation",
    r"repl_workstation",
    r"repl_workstation_filemaker",
    r"repl_workstation_file_export",
    r"repl_dock_reporting"
]

CONFIG_TABLES = [
    r"repl_file_picking_rules",
]


class KioskRestore:
    dev_mode = False
    restore_progress = None
    in_console = False
    postgres_master_db = "postgres"
    RESTORE_USERS_NONE = 0
    RESTORE_USERS_ALL = 1
    RESTORE_USERS_NEW = 2
    db_port = '5432'

    @classmethod
    def _print_if_console(cls, *args, **kwargs):
        if cls.in_console:
            print(*args, **kwargs)

    @classmethod
    def _abort(cls, *args, msg=""):
        """
        if the class has attribute in_console set,
        it will raise an InterrruptedError otherwise
        stop the whole program.

        :param args:  the return code in case of a program halt.
        """
        if cls.in_console:
            sys.exit(*args)
        else:
            raise InterruptedError(msg)

    @classmethod
    def _abort_with_error(cls, rc, msg):
        logging.error(msg)
        cls._report_progress(msg=msg)
        cls._abort(rc, msg=msg)

    @classmethod
    def set_progress_handler(cls, progress_handler):
        cls.restore_progress = progress_handler

    @classmethod
    def _report_progress(cls, progress_prc=0, msg=""):
        if cls.restore_progress:
            cls.restore_progress({"topic": "kiosk_restore",
                                  "progress": str(progress_prc),
                                  "extended_progress": msg
                                  })

    # obsolete
    @classmethod
    def zip_add_files(cls, working_directory, files, dst_file, zip_options: str):
        if zip_options:
            cmdline = ["7za.exe", "a", "-xr!__pycache__", "-xr!.pytest*", zip_options, dst_file,
                       ]
        else:
            cmdline = ["7za.exe", "a", "-xr!__pycache__", "-xr!.pytest*", dst_file, ]

        if files:
            cmdline.append(files)
        else:
            if not zip_options or zip_options.find("-i") == -1:
                logging.error(f"zip_add_files: Neither files nor -i option given. Nothing added to {dst_file}.")
                return

        print(cmdline)
        rc = None
        try:
            rc = subprocess.run(cmdline, cwd=working_directory)  # stdout=subprocess.PIPE
        except OSError as e:
            cls._abort_with_error(-1, f"Exception in zip_add_files: {repr(e)}")

        if not rc or rc.returncode != 0:
            cls._abort_with_error(-1, f"7zip returned an error: {rc.returncode}")

        return True

    @classmethod
    def extract_files_with_7za(cls, working_directory, src_file, files, zip_options: str = "", fail_on_error=True):
        # f"-w{working_directory}",

        if zip_options:
            cmdline = ["7za.exe", "x", zip_options, src_file,
                       ]
        else:
            cmdline = ["7za.exe", "x", src_file, ]

        if files:
            cmdline.append(files)
        rc = None

        try:
            if cls.dev_mode:
                print(cmdline)
                rc = subprocess.run(cmdline, cwd=working_directory)
            else:
                rc = subprocess.run(cmdline, cwd=working_directory, stdout=subprocess.PIPE)

        except OSError as e:
            if fail_on_error:
                cls._abort_with_error(-1, f"Exception in zip_extract_files: {repr(e)}")
            else:
                print(f"WARNING: Exception in zip_extract_files: {repr(e)}. Skipped because this is a patch.")
                return True

        if not rc or rc.returncode != 0:
            if fail_on_error:
                cls._abort_with_error(-1, f"7zip returned an error: {rc.returncode}")
            else:
                print(f"WARNING: 7zip returned an error: {rc.returncode}. Skipped because this is a patch.")

        return True

    @classmethod
    def zip_extract_files(cls, working_directory, src_file, files=None, zip_options: str = "", fail_on_error=True):
        src_path = os.path.join(working_directory, src_file) if not os.path.isabs(src_file) else src_file

        try:
            with zipfile.ZipFile(src_path, 'r') as zip_ref:
                if not files:
                    # Fast path: extract everything
                    zip_ref.extractall(path=working_directory)
                    return True

                # Normalize patterns once
                patterns = [files] if isinstance(files, str) else files
                normalized_patterns = [p.replace('\\', '/').rstrip('/') for p in patterns]

                all_zip_names = zip_ref.namelist()
                members_to_extract = []

                # Single pass through the ZIP table of contents
                for name in all_zip_names:
                    for p in normalized_patterns:
                        # Match exact file/wildcard OR check if name is inside the folder p
                        if fnmatch.fnmatch(name, p) or name.startswith(p + '/'):
                            members_to_extract.append(name)
                            break  # Match found for this file, move to next file

                if not members_to_extract and fail_on_error:
                    raise KeyError(f"No files or directories matched: {patterns}")

                if cls.dev_mode:
                    print(f"Extracting {len(members_to_extract)} matched items...")

                zip_ref.extractall(path=working_directory, members=members_to_extract)

        except (zipfile.BadZipFile, FileNotFoundError, PermissionError, KeyError) as e:
            error_msg = f"Exception in zip_extract_files: {repr(e)}"
            if fail_on_error:
                cls._abort_with_error(-1, error_msg)
            else:
                print(f"WARNING: {error_msg}")
                return False

        return True

    @classmethod
    def rm_dirs(cls, working_dir, files=None, options=None):
        if options is None:
            options = []
        if "no_clear_up" in options:
            return
        try:
            if files:
                paths_to_delete = files
            else:
                paths_to_delete = next(os.walk(working_dir))[1]

            for directory in paths_to_delete:
                abs_dir = path.join(working_dir, directory)
                if path.isdir(abs_dir):
                    print(f"deleting {abs_dir} ...", end="")
                    shutil.rmtree(abs_dir)
                    print("ok")
                else:
                    if path.isfile(abs_dir):
                        print(f"deleting {abs_dir} ...", end="")
                        os.remove(abs_dir)
                        print("ok")
                    else:
                        print(f"{abs_dir} not a directory or file : deletion skipped.")

        except IOError as e:
            logging.error(f"Exception in rm_dirs: {repr(e)}")

    @classmethod
    def unpack_kiosk(cls, src_dir, config_file, options=None):
        try:
            config = KioskConfig.get_config({"config_file": config_file})
        except BaseException as e:
            cls._abort_with_error(-1, f"unpack_kiosk: Exception when "
                                      f"reading configuration file {config_file}: {repr(e)}")
            return

        path_dict = cls._assert_paths(config)
        kiosk_dir = path_dict["kiosk"]
        filemaker_dir = path.dirname(config.filemaker_template)

        unzips = []

        if "c" in options:
            unzips.append([path.join(src_dir, "kiosk.zip"),
                           KIOSK_FILES,
                           kiosk_dir,
                           None])

            if "exclude_mcp" not in options:
                logging.info("including MCP Core files")
                unzips.append([path.join(src_dir, "kiosk.zip"),
                               MCP_CORE_FILES,
                               kiosk_dir,
                               None])
            else:
                logging.info("excluding MCP Core files")

            # if "nc" not in options:
            #     unzips.append([path.join(src_dir, "kiosk.zip"),
            #                    [
            #                        kioskstdlib.get_relative_path(kiosk_dir, config.custom_sync_modules),
            #                        kioskstdlib.get_relative_path(kiosk_dir, config.get_custom_kiosk_modules_path()),
            #                    ],
            #                    kiosk_dir,
            #                    "-aoa"])

        # if "ucm" in options:
        #     unzips.append([path.join(src_dir, "kiosk.zip"),
        #                    [
        #                        kioskstdlib.get_relative_path(kiosk_dir, config.custom_sync_modules),
        #                        kioskstdlib.get_relative_path(kiosk_dir, config.get_custom_kiosk_modules_path()),
        #                    ],
        #                    kiosk_dir,
        #                    "-aoa"])

        if "fr" in options or "fro" in options:
            if "fro" in options:
                unzip_option = "-aoa"
            else:
                unzip_option = "-aos"

            unzips.append([path.join(src_dir, "filerepository.zip"),
                           None,
                           config.file_repository,
                           unzip_option]
                          )

        if "w" in options:
            unzips.append([path.join(src_dir, "filemaker.zip"),
                           None,
                           filemaker_dir,
                           "-xr!*template*"]
                          )
            if "o" in options:
                cls.rm_dirs(filemaker_dir, None, options=options)

        if "ft" in options:
            unzips.append([path.join(src_dir, "filemaker.zip"),
                           ["*template*"],
                           filemaker_dir,
                           "-aoa"])

        # _remove_old_zip_files(unzips)

        if "o" in options and "c" in options:
            cls.rm_dirs(kiosk_dir, KIOSK_FILES, options=options)
            if "exclude_mcp" not in options:
                cls.rm_dirs(kiosk_dir, MCP_CORE_FILES, options=options)

        for unzip_set in unzips:
            cls._unzip_unzip_set(path_dict, *unzip_set, options=options)

    @classmethod
    def _assert_paths(cls, config: KioskConfig):
        kiosk_dir = config.resolve_symbols(config.base_path)
        path_dict = {"kiosk": kiosk_dir,
                     "sync": config.resolve_symbols(config.config["sync"])}

        if not path.isdir(kiosk_dir):
            cls._abort_with_error(-1, f"Kiosk path cannot be resolved from Kiosk/base_path in {config.configfile}")
        print(f"Kiosk base path is {kiosk_dir}")

        if not path.isdir(path_dict["sync"]):
            cls._abort_with_error(-1, f"Sync path cannot be resolved from config/sync in {config.configfile}")
        return path_dict

    @classmethod
    def assert_7zip(cls):
        try:
            subprocess.run("7za.exe", stdout=subprocess.PIPE)
        except FileNotFoundError:
            cls._abort_with_error(-1, "This tool needs an installed version of the 7zip command line tool 7za.exe.")

    @classmethod
    def _unzip_unzip_set(cls, path_dict, src_file, to_unzip, working_directory, zip_options, options=None):
        if options is None:
            options = []
        fail_on_error = "patch" not in options
        if not path.isfile(src_file):
            if fail_on_error:
                cls._abort_with_error(-1, f"Error unzipping {src_file}: File not found.")
            else:
                print(f"\nWarning unzipping {src_file}: File not found. Skipped because this is a patch.\n")
                return
        if to_unzip:
            for z in to_unzip:
                s = kioskstdlib.resolve_symbols_in_string(z, path_dict)
                print(f"Unzipping {s} from {src_file} to {working_directory}")
                time.sleep(2)
                cls.zip_extract_files(working_directory, src_file, s, zip_options, fail_on_error=fail_on_error)
        else:
            print(f"Unzipping {src_file} to {working_directory}")
            cls.zip_extract_files(working_directory, src_file, None, zip_options)

    @classmethod
    def add_base_path_if_necessary(cls, base_path, kiosk_config_file):
        """
        Makes sure that there is a base_path in the central Kiosk config.
        This only does anything if the config file and the base path exist.
        """
        # Initialize the Round-Trip YAML handler
        ryaml = YAML(typ='rt')
        ryaml.preserve_quotes = True  # Keep existing quotes where possible
        ryaml.default_flow_style = False  # Keep the block format (one key per line)

        try:
            if os.path.isfile(kiosk_config_file) and os.path.isdir(base_path):
                with open(kiosk_config_file, "r", encoding='utf-8') as ymlfile:
                    cfg = ryaml.load(ymlfile)

                # If the file was empty, cfg will be None
                if cfg is None:
                    cfg = {}

                # Navigate/Create the nested structure
                if "config" not in cfg:
                    cfg["config"] = {}

                # Update the base_path
                cfg["config"]["base_path"] = base_path

                # Write back—ruamel will only change the line we touched
                with open(kiosk_config_file, "w", encoding='utf-8') as ymlfile:
                    ryaml.dump(cfg, ymlfile)
                return True
            else:
                return False

        except Exception as e:
            # Using repr(e) as per your original logic
            print(f"Error in add_base_path_if_necessary: {repr(e)}")
            return False

    @classmethod
    def create_kiosk(cls, src_dir, kiosk_dir, kiosk_configfile, options):
        if "project_id" not in options:
            cls._abort_with_error(-1, "For a new Kiosk you must state the -project_id parameter!")

        server_type = options["server_type"] if "server_type" in options else "online"
        # Initialize ruamel.yaml object
        # typ='rt' enables Round-Trip (preserves comments/order)
        ryaml = YAML(typ='rt')
        ryaml.preserve_quotes = True
        ryaml.default_flow_style = False

        try:
            kiosk_zip = path.join(src_dir, "kiosk.zip")
            secure_file = os.path.join(kiosk_dir, "config", "kiosk_secure.yml")
            local_config = os.path.join(kiosk_dir, "config", "kiosk_local_config.yml")

            print("creating kiosk...", end=" ", flush=True)
            os.makedirs(kiosk_dir, exist_ok=True)
            config_dir = path.join(kiosk_dir, 'config')
            if not os.path.exists(config_dir):
                os.mkdir(config_dir)

            cls.zip_extract_files(kiosk_dir, kiosk_zip, 'config/*.yml')

            for f in [kiosk_configfile, local_config]:
                try:
                    os.remove(f)
                except:
                    pass

            ### write kiosk_config
            template_config = os.path.join(config_dir, 'kiosk_config_template.yml')
            if os.path.exists(template_config):
                shutil.copy(template_config, kiosk_configfile)
            else:
                template_config = ""
                print("\nWarning: No kiosk_config_template found. Creating new file.\n")
                with open(kiosk_configfile, "w", encoding='utf8') as ymlfile:
                    ymlfile.write("# Kiosk Project Configuration\n")

            with open(kiosk_configfile, "r", encoding='utf8') as ymlfile:
                cfg = ryaml.load(ymlfile)

            print(f"Initializing basic config for project {options['project_id']}... ", end=" ", flush=True)
            if cfg is None: cfg = {}

            if "import_configurations" not in cfg:
                cfg["import_configurations"] = ["kiosk_default_config.yml", "kiosk_local_config.yml",
                                                "kiosk_secure.yml"]

            if "config" not in cfg:
                cfg["config"] = {}

            # Set values (ruamel keeps track of where these keys go)
            cfg["config"]["project_id"] = options["project_id"]
            cfg["config"]["base_path"] = kiosk_dir

            with open(kiosk_configfile, "w", encoding='utf8') as ymlfile:
                ryaml.dump(cfg, ymlfile)
            print("ok", flush=True)

            cls.zip_extract_files(kiosk_dir, kiosk_zip, 'config/dsd')

            log_dir = path.join(kiosk_dir, "log")
            sync_dir = path.join(kiosk_dir, r"sync\sync")
            for d in [log_dir, path.join(kiosk_dir, "sync"), sync_dir,
                      path.join(sync_dir, "log"), path.join(sync_dir, "config"),
                      path.join(sync_dir, "file_repository"), path.join(sync_dir, "filemaker"),
                      path.join(sync_dir, r"filemaker\to_work_station"),
                      path.join(sync_dir, r"filemaker\from_work_station")]:
                os.makedirs(d, exist_ok=True)

            ### write local config

            local_config_template = os.path.join(config_dir, 'kiosk_local_config_template.yml')
            if os.path.exists(local_config_template):
                shutil.copy(local_config_template, local_config)
            else:
                local_config_template = ""
                print("\nWarning: No template for local config found. Creating new file.\n")
                with open(local_config, "w", encoding='utf8') as ymlfile:
                    ymlfile.write("# Kiosk Local Configuration\n")

            with open(local_config, "r", encoding='utf8') as ymlfile:
                cfg = ryaml.load(ymlfile)

            if "config" not in cfg:
                cfg["config"] = {}

            cfg["config"]["server_type"] = server_type
            cfg["config"]["transfer_dir"] = src_dir
            if "pgdb" in options:
                cfg["config"]["database_name"] = options["pgdb"]

            if "kiosk" not in cfg: cfg["kiosk"] = {}
            cfg["kiosk"]["base_path"] = kiosk_dir

            with open(local_config, "w", encoding='utf8') as ymlfile:
                ryaml.dump(cfg, ymlfile)

            template_secure_config = os.path.join(config_dir, 'kiosk_secure_template.yml')
            if os.path.exists(template_secure_config):
                shutil.copy(template_secure_config, secure_file)
            cls.set_new_database_credentials(local_config, secure_file, options)

            ### write /sync/config/sync_config,yml (for what it's worth)

            cls.zip_extract_files(kiosk_dir, kiosk_zip, 'sync/sync/config/*')
            sync_config_file = path.join(sync_dir, 'config', 'sync_config.yml')

            with open(sync_config_file, "r", encoding='utf8') as ymlfile:
                sync_cfg = ryaml.load(ymlfile)

            sync_cfg["import_configurations"] = [kiosk_configfile]
            sync_cfg["config"]["redirect_to"] = kiosk_configfile
            sync_cfg["config"]["logfile"] = path.join(sync_dir, r"log\sync.log")

            if "development" not in sync_cfg:
                sync_cfg["development"] = {}

            with open(sync_config_file, "w", encoding='utf8') as ymlfile:
                ryaml.dump(sync_cfg, ymlfile)

            print("ok", flush=True)

        except (IOError, Exception) as e:
            print(f"Error: {e}")
            cls._abort_with_error(-1, f"Exception in create_kiosk: {repr(e)}")

    @classmethod
    def set_new_database_credentials(cls, kiosk_local_config, kiosk_secure_file, options):
        ryaml = YAML(typ='rt')
        ryaml.preserve_quotes = True
        ryaml.default_flow_style = False

        try:
            print("setting new database credentials ... ", end=" ", flush=True)

            cfg_secure = None
            if os.path.exists(kiosk_secure_file):
                try:
                    with open(kiosk_secure_file, "r", encoding='utf8') as ymlfile:
                        cfg_secure = ryaml.load(ymlfile)
                except Exception:
                    cfg_secure = None

            if cfg_secure is None:
                cfg_secure = {"config": {}}

            # Ensure the 'config' key exists even if the file was partially empty
            if "config" not in cfg_secure:
                cfg_secure["config"] = {}

            if "dbuser" in options:
                cfg_secure["config"]["database_usr_name"] = options["dbuser"]
            if "dbpwd" in options:
                cfg_secure["config"]["database_usr_pwd"] = options["dbpwd"]

            if "kiosk" not in cfg_secure:
                cfg_secure["kiosk"] = {}

            cfg_secure["kiosk"]["SECRET_KEY"] = str(uuid.uuid4())

            with open(kiosk_secure_file, "w", encoding='utf8') as ymlfile:
                ryaml.dump(cfg_secure, ymlfile)

            print("ok", flush=True)

            # --- Handle kiosk_local_config file (Name/Port) ---
            if "dbname" in options or "dbport" in options:
                with open(kiosk_local_config, "r", encoding='utf8') as ymlfile:
                    cfg_main = ryaml.load(ymlfile)

                if cfg_main is None:
                    cfg_main = {"config": {}}
                if "config" not in cfg_main:
                    cfg_main["config"] = {}

                if "dbname" in options:
                    print("setting new database name ... ", end=" ", flush=True)
                    cfg_main["config"]["database_name"] = options["dbname"]

                if "dbport" in options:
                    print("setting new database port ... ", end=" ", flush=True)
                    cfg_main["config"]["database_port"] = options["dbport"]

                with open(kiosk_local_config, "w", encoding='utf8') as ymlfile:
                    ryaml.dump(cfg_main, ymlfile)

                print("ok", flush=True)

        except Exception as e:
            print("Error")
            cls._abort_with_error(-1, f"Exception in set_new_database_credentials: {repr(e)}")

    @classmethod
    def _delete_user_data(cls, db_name, user_id, user_pwd):
        con = None
        try:
            con, connected_db = cls.get_postgres_connection(db_name, user_id, user_pwd)
            if connected_db == db_name:
                print(f"deleting users in {db_name} . ", end="", flush=True)
                cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
                for t in USER_TABLES:
                    print(".", end="", flush=True)
                    cur.execute(f"delete" + " from \"{t}\";")
                print(f"ok", flush=True)
                return True
            else:
                raise Exception(f"delete_user_data could not connect to {db_name}")
        finally:
            if con:
                con.close()

    @classmethod
    def _transfer_record_by_record(cls, source_con, table, target_con, dst_table=""):
        source_cur = source_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        source_cur.execute(f"select * from {table}")

        if not dst_table:
            dst_table = table

        target_cur: psycopg2.extras.DictCursor = target_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        target_cur.execute(f"truncate table {dst_table}")

        c = 0
        r_src = source_cur.fetchone()
        while r_src:
            sqlfields = f'insert' + f' into "{dst_table}"('
            sqlrecord = ' VALUES('
            sqlparam = []

            for field in source_cur.index:
                if not r_src[field] is None:
                    sqlfields += f'"{field}",'
                    sqlrecord += "%s,"
                    sqlparam.append(r_src[field])

            sqlfields = sqlfields[:-1] + ')'
            sqlrecord = sqlrecord[:-1] + ')'
            sql = sqlfields + sqlrecord + ";"
            target_cur.execute(sql, sqlparam)
            c += 1
            r_src = source_cur.fetchone()

        return c

    @classmethod
    def _transfer_only_new_records(cls, source_con, table, target_con, dst_table="", additional_unique_field=""):
        c = 0
        try:
            source_cur = source_con.cursor(cursor_factory=psycopg2.extras.DictCursor)
            source_cur.execute(f"select * from {table}")

            if not dst_table:
                dst_table = table

            target_cur: psycopg2.extras.DictCursor = target_con.cursor(cursor_factory=psycopg2.extras.DictCursor)

            r_src = source_cur.fetchone()
            while r_src:
                sqlfields = f'insert' + f' into "{dst_table}"('
                sqlrecord = ' select '
                sqlparam = []

                for field in source_cur.index:
                    if not r_src[field] is None:
                        sqlfields += f'"{field}",'
                        sqlrecord += "%s,"
                        sqlparam.append(r_src[field])

                sqlfields = sqlfields[:-1] + ')'
                sqlrecord = sqlrecord[:-1] + f' WHERE NOT EXISTS (select uid from {dst_table} where uid=%s'
                sqlparam.append(r_src["uid"])
                if additional_unique_field:
                    sqlrecord = sqlrecord + f' or "{additional_unique_field}"=%s'
                    sqlparam.append(r_src[additional_unique_field])
                sqlrecord = sqlrecord + ")"
                sql = sqlfields + sqlrecord + ";"
                target_cur.execute(sql, sqlparam)
                q = target_cur.query
                print(q)
                c += target_cur.rowcount
                r_src = source_cur.fetchone()
        except BaseException as e:
            logging.error(f"{cls.__name__}._transfer_only_new_records: Error transferring new records: {repr(e)}")
            raise e

        return c

    @classmethod
    def _check_table_versions(cls, table_name, source_con, src_table_versions, target_con, tmp_table_versions):
        """

        :param table_name: name of the table
        :param source_con: source database (the current one that is about to be replaced)
        :param src_table_versions: dict with the table name as key and a Tuple (dsd-table, version) as value
        :param target_con: target database (the one that is about to be restored)
        :param tmp_table_versions: dict with the table name as key and a Tuple (dsd-table, version) as value
        :return: True if the table in both source and target database have the same versions
        """
        try:
            if table_name not in src_table_versions:
                raise Exception(f"No migration information for table {table_name} in the source (current) database.")

            if table_name not in tmp_table_versions:
                raise Exception(
                    f"No migration information for table {table_name} in the target (restored) database.")

            src_version = src_table_versions[table_name][1]
            dst_version = tmp_table_versions[table_name][1]
            if src_version != dst_version:
                raise Exception(f"The version of table {table_name} in the current database is different "
                                f"from the version in the target database (the one that got restored): "
                                f"{src_version} <> {dst_version}. ")

            if src_version == dst_version:
                return True

        except BaseException as e:
            logging.error(f"{cls.__name__}._migrate_dest_table: {repr(e)}")
        return False

    @classmethod
    def _transfer_tables(cls, tables, src_db_name, src_table_versions,
                         tmp_db_name, tmp_table_versions, user_id, user_pwd, only_new=False):
        done = False
        source_con = None
        target_con = None
        try:
            # this is the current data
            source_con = psycopg2.connect(f"dbname={src_db_name} user={user_id} password={user_pwd} port={cls.db_port}")
            # this is the restored data (which will become the current after the restore)
            target_con = psycopg2.connect(f"dbname={tmp_db_name} user={user_id} password={user_pwd} port={cls.db_port}")

            for t in tables:
                if cls._check_table_versions(t, source_con, src_table_versions, target_con, tmp_table_versions):
                    if only_new:
                        c = cls._transfer_only_new_records(target_con, t, source_con, additional_unique_field="user_id")
                        c_all = cls._transfer_record_by_record(source_con, t, target_con)
                        logging.info(
                            f"table {t} recovered from old database: {c} new records, {c_all - c} records kept")
                    else:
                        c = cls._transfer_record_by_record(source_con, t, target_con)
                        logging.info(f"table {t} recovered from old database: {c} records.")
                else:
                    raise Exception("Restore stopped because of an earlier error.")

            target_con.commit()
            done = True
        except Exception as e:
            logging.error(f"Exception in kioskrestore.transfer_tables: {repr(e)}")
        finally:
            try:
                if source_con:
                    source_con.close()
            except:
                pass
            try:
                if target_con:
                    target_con.close()
            except:
                pass

        if not done:
            raise Exception("An error occurred in transfer_tables (see log).")

    @classmethod
    def create_db_if_missing(cls, config_data):
        """
        creates the database if it is missing.
        :param config_data: filename of the configuration file OR a KioskConfig object
        :return: True or False
        """

        if isinstance(config_data, str):
            config = KioskConfig.get_config({"config_file": config_data})
        else:
            if isinstance(config_data, KioskConfig):
                config = config_data
            else:
                cls._abort_with_error(-1, f"Error in create_db_if_missing: param config_file is "
                                          f"neither a string nor a KioskConfig")
                return False

        user_id = config.database_usr_name
        user_pwd = config.database_usr_pwd
        db_name = config.database_name

        con, connected_db = cls.get_postgres_connection(db_name, user_id, user_pwd)
        if not con:
            raise Exception(f"Cannot use {cls.postgres_master_db} "
                            f"to create database {db_name}")

        kiosk_db_exists = (connected_db == db_name)
        if kiosk_db_exists:
            cls._report_progress(msg=f"database {db_name} exists.")
            return True

        # create database if necessary
        print(f"creating database {db_name}...", end="")
        cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        sql = f"create database \"{db_name}\";"
        cls._report_progress(msg=f"creating database {db_name}.")
        cur.execute(sql)
        con.close()
        cls._report_progress(msg=f"database {db_name} created.")
        print(f"ok", end="\n", flush=True)
        cls._report_progress(msg=f"preparing database {db_name}.")

        con, connected_db = cls.get_postgres_connection(db_name, user_id, user_pwd)
        if not con:
            raise Exception(f"Cannot open database {db_name} after creation.")

        kiosk_db_exists = (connected_db == db_name)
        if not kiosk_db_exists:
            print(f"database {db_name} was not created successfully before.", end="")
            cls._report_progress(msg=f"database {db_name} was not created successfully before.")
            return False

        print(f"preparing database {db_name}...", end="")
        cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        sql = f"CREATE EXTENSION IF NOT EXISTS pgcrypto;"
        cur.execute(sql)

        print(f"ok", end="\n", flush=True)

        return True

    @classmethod
    def migrate_database(cls, config_data):
        """
        migrates the database on the basis of the current dsd3
        :param config_data: filename of the configuration file OR a KioskConfig object
        :return: True or False
        """

        from dsd.dsd3singleton import Dsd3Singleton
        from dsd.dsdyamlloader import DSDYamlLoader
        from dsd.dsdview import DSDView
        from migration.postgresdbmigration import PostgresDbMigration
        from migration.migration import Migration

        def init_dsd(cfg):
            master_dsd = Dsd3Singleton.get_dsd3()
            master_dsd.register_loader("yml", DSDYamlLoader)
            if not master_dsd.append_file(cfg.get_dsdfile()):
                logging.error(
                    f"{cls.__name__}.init_dsd: {cfg.get_dsdfile()} could not be loaded by append_file.")
                raise Exception(f"{cls.__name__}.init_dsd: {cfg.get_dsdfile()} could not be loaded.")

            try:
                master_view = DSDView(master_dsd)
                master_view_instructions = DSDYamlLoader().read_view_file(cfg.get_master_view())
                master_view.apply_view_instructions(master_view_instructions)
            except BaseException as e:
                logging.error(f"{cls.__name__}.init_dsd: Exception when applying master view to dsd: {repr(e)}")
                raise e
            logging.debug(f"{cls.__name__}.init_dsd: dsd3 initialized: {cfg.get_dsdfile()}. ")
            return master_view.dsd

        if isinstance(config_data, str):
            config = KioskConfig.get_config({"config_file": config_data})
        else:
            if isinstance(config_data, KioskConfig):
                config = config_data
            else:
                cls._abort_with_error(-1, f"Error in migrate_database: param config_file is "
                                          f"neither a string nor a KioskConfig")
                return False

        user_id = config.database_usr_name
        user_pwd = config.database_usr_pwd
        db_name = config.database_name

        con, connected_db = cls.get_postgres_connection(db_name, user_id, user_pwd)
        if not con:
            raise Exception(f"Cannot use {cls.postgres_master_db} "
                            f"to create database {db_name}")

        kiosk_db_exists = (connected_db == db_name)
        if not kiosk_db_exists:
            cls._report_progress(msg=f"database {db_name} cannot be migrated since it does not exist.")
            return False

        dsd = init_dsd(config)
        postgres_adapter = PostgresDbMigration(dsd, con)
        migration = Migration(dsd, postgres_adapter, config.get_project_id())
        migration.self_check()
        logging.debug("Migration ready.")
        if migration.migrate_dataset():
            con.commit()
            logging.info("Migration complete, database committed.")
            cls._report_progress(msg=f"database {db_name} successfully migrated.")
            return True
        else:
            con.rollback()
            logging.error("Migration failed, database rolled back.")
            return False

    @classmethod
    def _restore_users(cls, restore_users, db_name, src_table_versions, tmp_db_name, tmp_table_versions,
                       user_id, user_pwd):
        try:
            if restore_users == cls.RESTORE_USERS_NONE:
                cls._transfer_tables(USER_TABLES,
                                     db_name, src_table_versions,
                                     tmp_db_name, tmp_table_versions,
                                     user_id, user_pwd)
            else:
                complete_tables = [t for t in USER_TABLES if t != "kiosk_user"]
                cls._transfer_tables(complete_tables,
                                     db_name, src_table_versions,
                                     tmp_db_name, tmp_table_versions,
                                     user_id, user_pwd)
                cls._transfer_tables(["kiosk_user"],
                                     db_name, src_table_versions,
                                     tmp_db_name, tmp_table_versions,
                                     user_id, user_pwd, only_new=True)


        except BaseException as e:
            logging.error(f"{cls.__name__}._restore_users : {repr(e)}")
            raise e

    @classmethod
    def _restore_existing_data(cls, cfg, src_db_name, restore_users, restore_workstations, tmp_db_name,
                               user_id, user_pwd):
        """

        :param cfg: SyncConfig
        :param src_db_name: The source database (or rather the active database BEFORE the restore)
        :param restore_users: RESTORE_USERS_ALL or RESTORE_USERS_NONE or cls.RESTORE_USERS_NEW
        :param restore_workstations: boolean
        :param tmp_db_name: The name of the target database (will be the active database AFTER the restore)
        :param user_id: user-id and
        :param user_pwd: password for postgres
        :return:
        """
        # check first if the options expect any transfer from the current to the restored database
        if restore_users == cls.RESTORE_USERS_ALL and restore_workstations:
            return

        from dsd.dsd3singleton import Dsd3Singleton
        from dsd.dsdyamlloader import DSDYamlLoader
        from dsd.dsdview import DSDView
        from migration.postgresdbmigration import PostgresDbMigration
        from migration.migration import Migration

        def init_dsd(cfg):
            master_dsd = Dsd3Singleton.get_dsd3()
            master_dsd.register_loader("yml", DSDYamlLoader)
            if not master_dsd.append_file(cfg.get_dsdfile()):
                logging.error(
                    f"{cls.__name__}.init_dsd: {cfg.get_dsdfile()} could not be loaded by append_file.")
                raise Exception(f"{cls.__name__}.init_dsd: {cfg.get_dsdfile()} could not be loaded.")

            try:
                master_view = DSDView(master_dsd)
                master_view_instructions = DSDYamlLoader().read_view_file(cfg.get_master_view())
                master_view.apply_view_instructions(master_view_instructions)
            except BaseException as e:
                logging.error(f"{cls.__name__}.init_dsd: Exception when applying master view to dsd: {repr(e)}")
                raise e
            logging.debug(f"{cls.__name__}.init_dsd: dsd3 initialized: {cfg.get_dsdfile()}. ")
            return master_view.dsd

        src_db = None
        tmp_db = None
        src_table_versions = {}
        tmp_table_versions = {}
        try:
            src_db, src_connected_db_name = cls.get_postgres_connection(src_db_name, user_id, user_pwd)
            if src_connected_db_name != src_db_name:
                logging.error(
                    f"{cls.__class__.__name__}._restore_existing_data: cannot connect to database {src_db_name}")
                raise Exception("Error in _restore_existing_data")
            tmp_db, dst_connected_db_name = cls.get_postgres_connection(tmp_db_name, user_id, user_pwd)
            if dst_connected_db_name != tmp_db_name:
                logging.error(
                    f"{cls.__class__.__name__}._restore_existing_data: cannot connect to database {tmp_db_name}")
                raise Exception("Error in _restore_existing_data")
            dsd = init_dsd(cfg)

            db_migration = PostgresDbMigration(dsd, tmp_db)

            migration = Migration(dsd, db_migration, cfg.get_project_id())
            migration.self_check()
            logging.debug("Migration ready.")
            if migration.migrate_dataset():
                tmp_db.commit()
                logging.info("Migration complete, target database committed.")
                cls._report_progress(msg=f"database {tmp_db_name} successfully migrated.")

            tmp_table_versions = db_migration.get_tables_and_versions()

            db_migration = PostgresDbMigration(dsd, src_db)
            src_table_versions = db_migration.get_tables_and_versions()
        finally:
            try:
                if src_db:
                    src_db.close()
            except:
                pass

            try:
                if tmp_db:
                    tmp_db.close()
            except:
                pass

        if not src_table_versions:
            raise Exception(f"{cls.__class__.__name__}._restore_existing_data: "
                            f"Can't access information about the current database's table versions")
        if not tmp_table_versions:
            raise Exception(f"{cls.__class__.__name__}._restore_existing_data: "
                            f"Can't access information about the restored database's table versions")

        ### continue here.
        if restore_users != cls.RESTORE_USERS_ALL:
            # transfer user data to the restored database (which
            # has the effect of keeping the users of the target database)
            print("recovering user data from old database ...", flush=True)
            cls._restore_users(restore_users, src_db_name, src_table_versions, tmp_db_name, tmp_table_versions,
                               user_id, user_pwd)
            print("recovering user data from old database ... Done", flush=True)

        if not restore_workstations:
            # transfer workstation data to the restored database
            print("recovering workstation data from old database ...", flush=True)
            cls._transfer_tables(WORKSTATION_TABLES, src_db_name, src_table_versions, tmp_db_name, tmp_table_versions,
                                 user_id, user_pwd)
            print("recovering workstation data from old database ... Done", flush=True)

        # if not restore_config:
        #     # transfer workstation data to the restored database
        #     print("recovering configuration data from old database ...", flush=True)
        #     cls._transfer_tables(WORKSTATION_TABLES, src_db_name, src_table_versions, tmp_db_name, tmp_table_versions,
        #                          user_id, user_pwd)
        #     print("recovering configuration data from old database ... Done", flush=True)

    @classmethod
    def restore_db(cls, config_data, src_dir,
                   restore_users=RESTORE_USERS_NONE,
                   restore_workstations=False,
                   backup_file="",
                   restore_configuration=False):
        """
        restores a database from a backupfile using psql

        :param config_data: filename of the configuration file OR a KioskConfig object
        :param src_dir: if backup_file is not given, a "backup.dmp" is expected in this src_dir.
                        Otherwise src_dir is ignored.
        :param restore_users: one of the RESTORE_USERS_ constants
        :param restore_workstations: True if workstations are to be restored from the backup.
        :param backup_file: see src_dir.
        :param restore_configuration: True if configuration tables (in the widest sense) are to be restored.
        :returns: Nothing. calls abort() in case of an error.
        """

        rc = False
        try:

            # read configuration values

            if isinstance(config_data, str):
                config = KioskConfig.get_config({"config_file": config_data})
            else:
                if isinstance(config_data, KioskConfig):
                    config = config_data
                else:
                    cls._abort_with_error(-1, f"Error in restore_db: param config_file is "
                                              f"neither a string nor a KioskConfig")
                    return

            if not backup_file:
                src_file = path.join(src_dir, "dbbackup.dmp")
            else:
                src_file = backup_file

            if not path.isfile(src_file):
                cls._abort_with_error(-1, f"Error in restore_db: file {src_file} does not exist.")

            cls._report_progress(msg="restoring database")
            user_id = config.database_usr_name
            user_pwd = config.database_usr_pwd
            db_name = config.database_name
            cls.db_port = config.database_port

            unique_id = hashlib.md5(str(uuid.uuid4()).encode('utf-8')).hexdigest()
            tmp_db_name = f"tmp{unique_id}"

            # create temp database

            con, connected_db = cls.get_postgres_connection(db_name, user_id, user_pwd)
            if not con:
                raise Exception(
                    f"Cannot use {db_name} or {cls.postgres_master_db} to create temp database {tmp_db_name}")

            kiosk_db_exists = (connected_db == db_name)
            if not kiosk_db_exists:
                print(f"The kiosk db {db_name} does not exist, it will be created during the process.")

            cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
            sql = f"create database \"{tmp_db_name}\";"
            print(f"creating restore database {tmp_db_name} ... ", end="", flush=True)
            cur.execute(sql)
            con.close()
            print(f"ok", flush=True)

            kiosk_db_renamed = ""
            try:

                # restore dump file to temp database

                rc = cls.pg_restore_database(src_dir, src_file, tmp_db_name, user_id, user_pwd)
                if rc != 0:
                    raise Exception(f"pg_restore_database (using psql) returned error {str(rc)}")

                print(f"ok", flush=True)
                cls._report_progress(progress_prc=80, msg="restoring database")

                if kiosk_db_exists:
                    cls._restore_existing_data(config, db_name, restore_users, restore_workstations,
                                               tmp_db_name, user_id, user_pwd)
                else:
                    if restore_users:
                        # delete users since there was nothing to keep
                        cls._delete_user_data(tmp_db_name, user_id, user_pwd)
                        logging.warning(f"restore_users option not set => The resulting database has no users! ")

                # rename original database

                if kiosk_db_exists:
                    con, connected_db = cls.get_postgres_connection(tmp_db_name, user_id, user_pwd)
                    cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
                    try:
                        cur.execute(
                            f"select pg_terminate_backend(pid) from pg_stat_activity where datname='{db_name}';")
                    except Exception as e:
                        raise Exception(
                            f"Cannot drop connections on {db_name}: {repr(e)}")

                    current_datetime = datetime.datetime.now().strftime("%d%m%Y%H%M%S")
                    kiosk_db_renamed = f"archive_{db_name}_{current_datetime}"
                    print(f"renaming current database {db_name} to {kiosk_db_renamed} ... ", end="", flush=True)
                    cur.execute(f"alter database \"{db_name}\" rename to \"{kiosk_db_renamed}\"")
                    con.close()
                    print("ok", flush=True)
                    print(f"Notice: The former kiosk database is saved as {kiosk_db_renamed}")

                # rename temp database to kiosk db name

                print(f"renaming restored database {tmp_db_name} to {db_name} ... ", end="", flush=True)

                if kiosk_db_exists:
                    con, connected_db = cls.get_postgres_connection(kiosk_db_renamed, user_id, user_pwd)
                    if not con:
                        raise Exception(
                            f"Cannot use {kiosk_db_renamed} or {cls.postgres_master_db} to rename restored database")
                else:
                    con, connected_db = cls.get_postgres_connection(cls.postgres_master_db, user_id, user_pwd)
                    if not con:
                        raise Exception(f"Cannot use database {cls.postgres_master_db} to rename restored database")

                cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
                cur.execute(f"alter database \"{tmp_db_name}\" rename to \"{db_name}\"")
                cur.close()
                con.commit()
                con.close()
                print("ok", flush=True)
                print(f"Database {db_name} successfully restored ", end="", flush=True)
                cls._report_progress(progress_prc=98, msg="Database successfully restored, cleaning up ...")

                try:
                    from plugins.kioskfilemakerworkstationplugin import KioskFileMakerWorkstation
                    KioskFileMakerWorkstation.reset_all_recording_groups()
                    logging.info(f"KioskRestore.restore_db: reset all recording groups")
                except BaseException as e:
                    logging.error(f"KioskRestore.restore_db: After a successful restore it was not possible "
                                  f"to reset all recording groups due to error {repr(e)}")

                try:
                    con, connected_db = cls.get_postgres_connection(db_name, user_id, user_pwd)
                    if not con:
                        raise Exception(
                            f"Cannot open {db_name} after successful restore.")
                    cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
                    cur.execute(f"update repl_workstation set state=0")
                    con.close()
                    logging.info(f"KioskRestore.restore_db: reset all docks")
                except BaseException as e:
                    logging.error(f"KioskRestore.restore_db: After a successful restore it was not possible "
                                  f"to reset all workstations due to error {repr(e)}")

                cls._report_progress(progress_prc=100, msg="Restore complete.")
                rc = True
            except Exception as e:
                if cls.in_console:
                    print("failed.")

                rc = False
                logging.error(f"KioskRestore.restore_db: {repr(e)}.")
                if kiosk_db_renamed:
                    logging.info(f"restore_db: The former db exists as {kiosk_db_renamed}.")

                try:
                    con.close
                finally:
                    pass

                con, connected_db = cls.get_postgres_connection(db_name, user_id, user_pwd)
                if con:
                    try:
                        cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
                        sql = f"drop database {tmp_db_name};"
                        cur.execute(sql)
                    finally:
                        con.close()

                cls._abort_with_error(-1, f"Exception in restore_db: {repr(e)}")

        except BaseException as e:
            print("KioskRestore.restore_db failed.")
            cls._abort_with_error(-1, f"Exception in restore_db: {repr(e)}")
            rc = False

        if not rc:
            cls._abort(1)

    @classmethod
    def assert_postgres(cls):
        rc = False
        try:
            rc = subprocess.run(f"psql -V")
        except BaseException:
            pass
        if not rc:
            cls._abort_with_error(-1, "Postgres cannot be found. Please add it to the OS Path!")

    @classmethod
    def pg_restore_database(cls, src_dir, dump_file, db_name, user_id, user_pwd, native_format=False):
        rc = -1
        pgpassfile = ""
        try:
            pgpassfile = path.join(src_dir, "pgpass.conf")
            print(f"using passfile: {pgpassfile}")
            with open(pgpassfile, "w") as f:
                f.write(f"*:*:*:{user_id}:{user_pwd}")
            os.environ["PGPASSFILE"] = pgpassfile
            print(f"restoring database {db_name}... ", end="", flush=True)
            if path.isfile(dump_file):
                if native_format:
                    rc = subprocess.run(f"pg_restore --no-owner -w --username={user_id} "
                                        f"--dbname={db_name} -p {cls.db_port} {dump_file}")  # , stdout=subprocess.PIPE
                else:
                    logging.debug(f"pg_restore_database: calling psql -U{user_id} "
                                  f"--file={dump_file} {db_name}")
                    rc = subprocess.run(f"psql -U{user_id} "
                                        f"--file={dump_file} -p {cls.db_port} {db_name}",
                                        stdout=subprocess.PIPE)  # , stdout=subprocess.PIPE

                rc = rc.returncode
                sys.stdout.flush()
            else:
                print("failed", flush=True)
                print(f"dump file {pgpassfile} does not exist.")
                rc = False
        finally:
            try:
                if pgpassfile:
                    os.remove(pgpassfile)
            except:
                pass

        return rc

    @classmethod
    def get_postgres_connection(cls, db_name, user_id, user_pwd):
        connected_to = ""
        con = None
        try:
            con = psycopg2.connect(
                "dbname=" + db_name + " user=" + user_id + " password=" + user_pwd + " port=" + cls.db_port)
            connected_to = db_name
        except psycopg2.OperationalError as e:
            try:
                con = psycopg2.connect(
                    f"dbname={cls.postgres_master_db} user={user_id} password={user_pwd} port=" + cls.db_port)
                connected_to = {cls.postgres_master_db}
            except psycopg2.Error as e:
                logging.error(f"Cannot use db {cls.postgres_master_db} to execute sql statements: " + repr(e))
        except psycopg2.Error as e:
            raise Exception(
                f"restore_database: Cannot connect to database {db_name} "
                f"with the given credentials. Error was: {repr(e)}")
        if connected_to and con:
            con.autocommit = True
            return con, connected_to
        else:
            return None, ""

    @classmethod
    def check_file_repository_path(cls, cfg_file):
        KioskConfig._release_config()
        cfg = KioskConfig.get_config({'config_file': cfg_file})
        if not path.isdir(cfg.get_file_repository()):
            logging.error(f"file repository {cfg.get_file_repository()} does not point to a valid path.")
            return False

        return True

    @classmethod
    def refresh_thumbnails(cls, cfg_file):
        cfg = KioskConfig.get_config({'config_file': cfg_file})
        if not path.isdir(cfg.get_file_repository()):
            logging.error(f"file repository {cfg.get_file_repository()} does not point to a valid path.")
            return False

        from filerepository import FileRepository
        file_repos = FileRepository(cfg)
        print("refreshing filerepository thumbnails ...", end="", flush=True)
        file_repos.do_housekeeping()
        print("Done", flush=True)

    @classmethod
    def restore_file_repository(cls, config,
                                src_path) -> int:
        """
        copies files to the file repository from a backup directory. Only adds modified and new files.
        :param config: SyncConfig
        :param src_path: the source of the files
        :return: -1: failed
                 otherwise: Number of files that were actually copied.
        """
        dest_path = config.get_file_repository()
        if not os.path.isdir(dest_path):
            logging.error(f"{cls.__name__}.restore_file_repository: {dest_path} does not point to "
                          f"an existing file repository")
            return -1

        if not os.path.isdir(src_path):
            logging.error(f"{cls.__name__}.restore_file_repository: {src_path} does not point to "
                          f"an existing backup directory")
            return -1

        ignore_directories = ['cache', 'history', 'temp']
        try:
            files_copied = kioskstdlib.copytree(src_path, dest_path, True, True, ignore=ignore_directories,
                                                _on_progress=cls.restore_progress)
            logging.info(f"{cls.__name__}.restore_file_repository: {files_copied} files had to be copied. ")
            return files_copied
        except InterruptedError:
            return -1
        except BaseException as e:
            logging.error(f"{cls.__name__}.restore_file_repository: Error copying files from {src_path} to "
                          f"{dest_path}: {repr(e)}")
            return -1
