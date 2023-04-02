import shutil
import hashlib
import uuid
import time
import datetime
import sys
import os
import logging
import subprocess

import yaml

import psycopg2
import psycopg2.extras

import kioskstdlib
from kioskconfig import KioskConfig
from os import path

KIOSK_FILES = [
    r"api",
    r"core",
    r"plugins",
    r"static",
    r"templates",
    r"sqlalchemy_models",
    r"__init__.py",
    r"sync\sync\console.py",
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
    r"repl_workstation"
]


class KioskRestore:
    dev_mode = False
    restore_progress = None
    in_console = False
    postgres_master_db = "postgres"

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
        try:
            rc = subprocess.run(cmdline, cwd=working_directory)  # stdout=subprocess.PIPE
        except OSError as e:
            cls._abort_with_error(0, f"Exception in zip_add_files: {repr(e)}")

        if rc.returncode != 0:
            cls._abort_with_error(0, f"7zip returned an error: {rc.returncode}")

        return True

    @classmethod
    def zip_extract_files(cls, working_directory, src_file, files, zip_options: str = ""):
        # f"-w{working_directory}",
        if zip_options:
            cmdline = ["7za.exe", "x", zip_options, src_file,
                       ]
        else:
            cmdline = ["7za.exe", "x", src_file, ]

        if files:
            cmdline.append(files)

        try:
            if cls.dev_mode:
                print(cmdline)
                rc = subprocess.run(cmdline, cwd=working_directory)
            else:
                rc = subprocess.run(cmdline, cwd=working_directory, stdout=subprocess.PIPE)

        except OSError as e:
            cls._abort_with_error(0, f"Exception in zip_extract_files: {repr(e)}")

        if rc.returncode != 0:
            cls._abort_with_error(0, f"7zip returned an error: {rc.returncode}")

        return True

    @classmethod
    def rm_dirs(cls, working_dir, files=None):
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
            config = KioskConfig.get_config({"config_file", config_file})
        except BaseException as e:
            cls._abort_with_error(-1, f"unpack_kiosk: Exception when "
                                      f"reading configuration file {config_file}: {repr(e)}")
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

            if "nc" not in options:
                unzips.append([path.join(src_dir, "kiosk.zip"),
                               [
                                   kioskstdlib.get_relative_path(kiosk_dir, config.custom_sync_modules),
                                   kioskstdlib.get_relative_path(kiosk_dir, config.get_custom_kiosk_modules_path()),
                               ],
                               kiosk_dir,
                               "-aoa"])

        if "ucm" in options:
            unzips.append([path.join(src_dir, "kiosk.zip"),
                           [
                               kioskstdlib.get_relative_path(kiosk_dir, config.custom_sync_modules),
                               kioskstdlib.get_relative_path(kiosk_dir, config.get_custom_kiosk_modules_path()),
                           ],
                           kiosk_dir,
                           "-aoa"])

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
                cls.rm_dirs(filemaker_dir, None)

        if "ft" in options:
            unzips.append([path.join(src_dir, "filemaker.zip"),
                           ["*template*"],
                           filemaker_dir,
                           "-aoa"])

        # _remove_old_zip_files(unzips)

        if "o" in options and "c" in options:
            cls.rm_dirs(kiosk_dir, KIOSK_FILES)
            if "exclude_mcp" not in options:
                cls.rm_dirs(kiosk_dir, MCP_CORE_FILES)

        for unzip_set in unzips:
            cls._unzip_unzip_set(path_dict, *unzip_set)

    @classmethod
    def _assert_paths(cls, config: KioskConfig):
        kiosk_dir = config.resolve_symbols(config.kiosk["base_path"])
        path_dict = {"kiosk": kiosk_dir,
                     "sync": config.resolve_symbols(config.config["sync"])}

        if not path.isdir(kiosk_dir):
            cls._abort_with_error(0, f"Kiosk path cannot be resolved from Kiosk/base_path in {config.configfile}")
        print(f"Kiosk base path is {kiosk_dir}")

        if not path.isdir(path_dict["sync"]):
            cls._abort_with_error(0, f"Sync path cannot be resolved from config/sync in {config.configfile}")
        return path_dict

    @classmethod
    def assert_7zip(cls):
        try:
            subprocess.run("7za.exe", stdout=subprocess.PIPE)
        except FileNotFoundError:
            cls._abort_with_error(-1, "This tool needs an installed version of the 7zip command line tool 7za.exe.")

    @classmethod
    def _unzip_unzip_set(cls, path_dict, src_file, to_unzip, working_directory, zip_options):
        if to_unzip:
            for z in to_unzip:
                s = kioskstdlib.resolve_symbols_in_string(z, path_dict)
                print(f"Unzipping {s} from {src_file} to {working_directory}")
                time.sleep(2)
                cls.zip_extract_files(working_directory, src_file, s, zip_options)
        else:
            print(f"Unzipping {src_file} to {working_directory}")
            cls.zip_extract_files(working_directory, src_file, None, zip_options)

    @staticmethod
    def get_server_type():
        local_server = ""
        while local_server not in ("y", "n"):
            if local_server != "":
                print("\nPlease answer with y for yes or n for no! \n")
            local_server = input("Is this a local server? (y/n)")

        return "local" if local_server == "y" else "online"

    @classmethod
    def create_kiosk(cls, src_dir, kiosk_dir, kiosk_configfile, options):

        try:

            kiosk_zip = path.join(src_dir, "kiosk.zip")
            secure_file = os.path.join(kiosk_dir, "config", "kiosk_secure.yml")

            print("creating kiosk...", end=" ", flush=True)
            os.makedirs(kiosk_dir)
            config_dir = path.join(kiosk_dir, 'config')
            os.mkdir(config_dir)
            with open(secure_file, "w") as f:
                f.writelines(["config:\n", f"  base_path: {kiosk_dir}\n"])

            cls.zip_extract_files(kiosk_dir, kiosk_zip, 'config/*.yml', )
            try:
                os.remove(kiosk_configfile)
            except:
                pass
            template_config = os.path.join(config_dir, 'kiosk_config_template.yml')
            if os.path.exists(template_config):
                shutil.move(template_config, kiosk_configfile)
            else:
                print("\nWarning: There was no template configuration 'kiosk_config_template.yml' to use.\n")
                with open(kiosk_configfile, "w", encoding='utf8') as ymlfile:
                    ymlfile.write("""
import_configurations:\n
        - kiosk_default_config.yml\n
        - kiosk_secure.yml\n
""")

            cls.zip_extract_files(kiosk_dir, kiosk_zip, 'config/dsd', )
            cls.set_new_database_credentials(kiosk_configfile, secure_file, options)

            with open(kiosk_configfile, "r", encoding='utf8') as ymlfile:
                cfg = yaml.load(ymlfile, Loader=yaml.FullLoader)

            os.mkdir(path.join(kiosk_dir, r"log"))
            os.mkdir(path.join(kiosk_dir, r"sync"))
            sync_dir = path.join(kiosk_dir, r"sync\sync")
            os.mkdir(sync_dir)
            os.mkdir(path.join(sync_dir, r"log"))
            sync_config_dir = path.join(sync_dir, r"config")
            os.mkdir(sync_config_dir)
            file_repository_dir = path.join(sync_dir, r"file_repository")
            os.mkdir(file_repository_dir)
            filemaker_dir = path.join(sync_dir, r"filemaker")
            os.mkdir(filemaker_dir)
            os.mkdir(path.join(filemaker_dir, "to_work_station"))
            os.mkdir(path.join(filemaker_dir, "from_work_station"))

            cfg["import_configurations"] = ["kiosk_default_config.yml", "kiosk_secure.yml"]
            cfg["config"]["sync"] = sync_dir
            cfg["server_type"] = cls.get_server_type()
            # cfg["config"]["base_path"] = kiosk_dir
            # cfg["config"]["file_repository"] = r"%sync%\file_repository"
            # cfg["config"]["file_handling_definition"] = path.join(config_dir, r"file_handling.yml")
            # cfg["config"]["dataset_definition"] = r"%sync%\config\dsd\dsd3.yml"
            # cfg["config"]["filemaker_export_dir"] = r"%sync%\filemaker\to_work_station"
            # cfg["config"]["filemaker_import_dir"] = r"%sync%\filemaker\from_work_station"
            cfg["kiosk"]["local_import_paths"] = []
            cfg["kiosk"]["base_path"] = kiosk_dir
            if "pgdb" in options:
                cfg["config"]["database_name"] = options["pgdb"]

            with open(kiosk_configfile, "w") as ymlfile:
                yaml.dump(cfg, ymlfile, default_flow_style=False)

            cls.zip_extract_files(kiosk_dir, kiosk_zip, 'sync/sync/config/*', )
            sync_config_file = path.join(sync_config_dir, 'sync_config.yml')
            with open(sync_config_file, "r", encoding='utf8') as ymlfile:
                cfg = yaml.load(ymlfile, Loader=yaml.FullLoader)

            cfg["import_configurations"] = [kiosk_configfile]
            cfg["config"]["redirect_to"] = kiosk_configfile
            cfg["config"]["logfile"] = path.join(sync_dir, r"log\sync.log")

            try:
                cfg["development"] = {}
            except:
                pass

            try:
                if "playgroundplugin" in cfg["kiosk"]:
                    cfg["kiosk"]["playgroundplugin"] = {"active": False}
            except BaseException as e:
                pass

            with open(sync_config_file, "w") as ymlfile:
                yaml.dump(cfg, ymlfile, default_flow_style=False)

            kiosk_parent_dir = kioskstdlib.get_parent_dir(kiosk_dir)
            app_folder = os.path.basename(os.path.normpath(kiosk_dir))
            cls.write_start_ps1(app_folder, kiosk_dir, kiosk_parent_dir, options)
            cls.write_start_mcp_ps1(app_folder, kiosk_dir, kiosk_parent_dir, options)

            with open(path.join(sync_dir, "start_console.ps1"), "w") as f:
                f.write(f'$env:PYTHONPATH="{kiosk_dir};{path.join(kiosk_dir, "core")};{path.join(kiosk_dir, "sync")};')
                f.write(f'{path.join(kiosk_dir, "sync", "sync")};')
                f.write(f'{path.join(kiosk_dir, "sync", "sync", "plugins")};')
                f.write(f'{path.join(kiosk_dir, "sync", "sync", "core")}"\n')
                f.write('python console.py')

            cls.zip_extract_files(kiosk_dir, kiosk_zip, "config/dsd", "-aoa")
            cls.zip_extract_files(kiosk_dir, kiosk_zip, "config/ui", "-aoa")
            cls.zip_extract_files(kiosk_dir, kiosk_zip, 'config/kiosk_ui_classes.uic', "-aoa")
            cls.zip_extract_files(kiosk_dir, kiosk_zip, "config/kiosk_queries", "-aoa")
            print("ok", flush=True)

        except IOError as e:
            print("Error")
            cls._abort_with_error(-1, f"Exception in create_kiosk: {repr(e)}")

    @classmethod
    def write_start_ps1(cls, app_folder, kiosk_dir, kiosk_parent_dir, options):
        with open(path.join(kiosk_parent_dir, "start.ps1"), "w") as f:
            f.write(r'''
                $env:HostIP = (
                    Get-NetIPConfiguration |
                    Where-Object {
                        $_.IPv4DefaultGateway -ne $null -and
                        $_.NetAdapter.Status -ne "Disconnected"
                    }
                ).IPv4Address.IPAddress
                # [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms")
                # $oReturn=[System.Windows.Forms.Messagebox]::Show("The kiosk server runs on http://" + $env:HostIP + ":5000")
                '**********************************************************'
                'Kiosk Server is running as http://' + $env:HostIP + ':5000'
                '**********************************************************'
            ''')
            f.write(f'''$env:FLASK_APP = "{app_folder}"\n
    # uncomment the following line for debugging purposes, but never on live online systems!\n
    # $env:FLASK_DEBUG = 1\n
    # use "development" if you want autostart when sources are change.\n
    $env:FLASK_ENVIRONMENT="production"\n''')
            f.write(f'$env:PYTHONPATH="{kiosk_dir};{path.join(kiosk_dir, "core")};'
                    f'{path.join(kiosk_dir, "core", "sqlalchemy_models")};'
                    f'{path.join(kiosk_dir, "sync")};')
            f.write(f'{path.join(kiosk_dir, "sync", "sync")};{path.join(kiosk_dir, "sync", "sync", "core")};"')
            f.write('\n')
            if "no_redis" not in options and "sudo_password" in options:
                f.write(f"""bash -c "echo {options["sudo_password"]} | sudo -S /etc/init.d/redis_6379 start"\n""")
            f.write('flask run --host 0.0.0.0')

    @classmethod
    def write_start_mcp_ps1(cls, app_folder, kiosk_dir, kiosk_parent_dir, options):
        with open(path.join(kiosk_parent_dir, "start_mcp.ps1"), "w") as f:
            f.write(f'''$env:FLASK_APP = "{app_folder}"\n
    # uncomment the following line for debugging purposes, but never on live online systems!\n
    # $env:FLASK_DEBUG = 1\n
    # use "development" if you want autostart when sources are change.\n
    $env:FLASK_ENVIRONMENT="production"\n''')
            f.write(f'$env:PYTHONPATH="{kiosk_dir};{path.join(kiosk_dir, "core")};'
                    f'{path.join(kiosk_dir, "core", "sqlalchemy_models")};'
                    f'{path.join(kiosk_dir, "sync")};')
            f.write(f'{path.join(kiosk_dir, "sync", "sync")};{path.join(kiosk_dir, "sync", "sync", "core")};"')
            f.write('\n')
            if "no_redis" not in options and "sudo_password" in options:
                f.write(f"""bash -c "echo {options["sudo_password"]} | sudo -S /etc/init.d/redis_6379 start"\n""")
            f.write(fr'cd {path.join(kiosk_dir, "sync", "sync", "mcpcore")}')
            f.write(fr'python ./mcpterminal.py {path.join(kiosk_dir, "config", "kiosk_config.yml")}')

    @classmethod
    def set_new_database_credentials(cls, kiosk_configfile, kiosk_secure_file, options):
        try:
            print("setting new database credentials ... ", end=" ", flush=True)
            with open(kiosk_secure_file, "r", encoding='utf8') as ymlfile:
                cfg = yaml.load(ymlfile, Loader=yaml.FullLoader)

            if not cfg:
                cfg = {"config": {}}
            if "dbuser" in options:
                cfg["config"]["database_usr_name"] = options["dbuser"]
            if "dbpwd" in options:
                cfg["config"]["database_usr_pwd"] = options["dbpwd"]

            with open(kiosk_secure_file, "w") as ymlfile:
                yaml.dump(cfg, ymlfile, default_flow_style=False)

            print("ok", flush=True)

            if "dbname" in options:
                print("setting new database name ... ", end=" ", flush=True)
                with open(kiosk_configfile, "r", encoding='utf8') as ymlfile:
                    cfg = yaml.load(ymlfile, Loader=yaml.FullLoader)
                cfg["config"]["database_name"] = options["dbname"]
                with open(kiosk_configfile, "w") as ymlfile:
                    yaml.dump(cfg, ymlfile, default_flow_style=False)

                print("ok", flush=True)

        except BaseException as e:
            print("Error")
            cls._abort_with_error(-1, f"Exception in set_new_database_credentials: {repr(e)}")

    @classmethod
    def _delete_user_data(cls, db_name, user_id, user_pwd):
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
    def _transfer_tables(cls, tables, db_name, tmp_db_name, user_id, user_pwd):
        done = False
        try:
            source_con = psycopg2.connect(f"dbname={db_name} user={user_id} password={user_pwd}")
            target_con = psycopg2.connect(f"dbname={tmp_db_name} user={user_id} password={user_pwd}")

            for t in tables:
                c = cls._transfer_record_by_record(source_con, t, target_con)
                print(f"table {t} recovered from old database: {c} records.", flush=True)

            target_con.commit()
            done = True
        except Exception as e:
            logging.error(f"Exception in kioskrestore.transfer_tables: {repr(e)}")
        finally:
            try:
                source_con.close()
            except:
                pass
            try:
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
    def restore_db(cls, config_data, src_dir, restore_users=False, restore_workstations=False, backup_file=""):
        """
        restores a database from a backupfile using pgrestore

        :param config_data: filename of the configuration file OR a KioskConfig object
        :param src_dir: if backup_file is not given, a "backup.dmp" is expected in this src_dir.
                Otherwise src_dir is ignored.
        :param restore_users: True if Users are to be restored from the backup
        :param restore_workstations: True if workstations are to be restored from the backup
                (repl_workstation and kiosk_workstation!)
        :param backup_file: see src_dir.
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
                    raise Exception(f"pg_restore_database (pg_restore or psql) returned error {str(rc)}")

                print(f"ok", flush=True)
                cls._report_progress(progress_prc=80, msg="restoring database")

                if kiosk_db_exists:
                    if not restore_users:
                        # transfer user data to the restored database (which
                        # has the effect of keeping the users of the target database)
                        print("recovering user data from old database ...", flush=True)
                        cls._transfer_tables(USER_TABLES, db_name, tmp_db_name, user_id, user_pwd)
                        print("recovering user data from old database ... Done", flush=True)
                    if not restore_workstations:
                        # transfer workstation data to the restored database
                        print("recovering workstation data from old database ...", flush=True)
                        cls._transfer_tables(WORKSTATION_TABLES, db_name, tmp_db_name, user_id, user_pwd)
                        print("recovering workstation data from old database ... Done", flush=True)
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
                con.close()
                print("ok", flush=True)
                print(f"Database {db_name} successfully restored ", end="", flush=True)
                cls._report_progress(progress_prc=100, msg="Database successfully restored.")

                rc = True
            except Exception as e:
                if cls.in_console:
                    print("failed.")

                rc = False
                logging.error(f"Exception in restore_db: {repr(e)}.")
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

                cls._abort_with_error(0, f"Exception in restore_db: {repr(e)}")

        except BaseException as e:
            print("KioskRestore.restore_db failed.")
            cls._abort_with_error(0, f"Exception in restore_db: {repr(e)}")
            rc = False

        if not rc:
            cls._abort(0)

    @classmethod
    def assert_postgres(cls):
        rc = False
        try:
            rc = subprocess.run(f"psql -V")
        except BaseException:
            pass
        if not rc:
            cls._abort_with_error(0, "Postgres cannot be found. Please add it to the OS Path!")

    @classmethod
    def pg_restore_database(cls, src_dir, dump_file, db_name, user_id, user_pwd, native_format=False):
        rc = -1
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
                                        f"--dbname={db_name} {dump_file}")  # , stdout=subprocess.PIPE
                else:
                    logging.debug(f"pg_restore_database: calling psql -U{user_id} "
                                  f"--file={dump_file} {db_name}")
                    rc = subprocess.run(f"psql -U{user_id} "
                                        f"--file={dump_file} {db_name}",
                                        stdout=subprocess.PIPE)  # , stdout=subprocess.PIPE

                rc = rc.returncode
                sys.stdout.flush()
            else:
                print("failed", flush=True)
                print(f"dump file {pgpassfile} does not exist.")
                rc = False
        finally:
            try:
                os.remove(pgpassfile)
            except:
                pass

        return rc

    @classmethod
    def get_postgres_connection(cls, db_name, user_id, user_pwd):
        connected_to = ""
        con = None
        try:
            con = psycopg2.connect("dbname=" + db_name + " user=" + user_id + " password=" + user_pwd)
            connected_to = db_name
        except psycopg2.OperationalError as e:
            try:
                con = psycopg2.connect(f"dbname={cls.postgres_master_db} user={user_id} password={user_pwd}")
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
