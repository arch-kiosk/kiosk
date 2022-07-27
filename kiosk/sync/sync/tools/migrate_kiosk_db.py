import sys
import logging

import psycopg2

from dsd.dsdview import DSDView
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig
from migration.migration import Migration
from migration.postgresdbmigration import PostgresDbMigration
from dsd.dsd3 import DataSetDefinition
from dsd.dsdyamlloader import DSDYamlLoader

import kioskstdlib
from os import path

params = {"-dsd": "dsd",
          "-db": "db",
          "--reverse_engineer_master": "reverse",
          "-re": "reverse",
          "--reverse_engineer_workstations": "reverse workstations",
          "-rw": "reverse workstations",
          "-q": "quiet",
          "--quiet": "quiet",
          "--current_version_only": "current_version_only",
          }

cfg: SyncConfig


def connect_database():
    con = psycopg2.connect(f"dbname={cfg.database_name} user={cfg.database_usr_name} password={cfg.database_usr_pwd}")
    con.autocommit = False
    KioskSQLDb._con_ = con
    cur = KioskSQLDb.execute_return_cursor("select current_database()")
    try:
        r = cur.fetchone()
        assert r[0] == cfg.database_name
    finally:
        cur.close()


# noinspection PyShadowingNames
def do_reverse_engineering(dsd: DataSetDefinition, migration: Migration, cfg, current_version_only=False):
    master_view_file = cfg.get_master_view()
    master_view = DSDView(dsd)
    master_view_instructions = DSDYamlLoader().read_view_file(master_view_file)
    master_view.apply_view_instructions(master_view_instructions)
    migration.set_reverse_engineering_view(master_view)
    result = migration.reverse_engineer_dataset(current_version_only=current_version_only)

    return result


# noinspection PyShadowingNames
def do_reverse_engineering_workstations(dsd: DataSetDefinition, migration: Migration, cfg, current_version_only=False):
    dsd_workstation_view = DSDView(dsd)
    dsd_workstation_view.apply_view_instructions({"config":
                                                      {"format_ver": 3},
                                                  "tables": ["include_tables_with_instruction('replfield_uuid')",
                                                             "include_tables_with_flag('filemaker_recording')",
                                                             "exclude_field('images', 'filename')",
                                                             "exclude_field('images', 'md5_hash')",
                                                             "exclude_field('images', 'image_attributes')"
                                                             ]})

    migration.set_reverse_engineering_view(dsd_workstation_view)
    logging.info(f"do_reverse_engineering_workstations: "
                 f"{len(dsd_workstation_view.dsd.list_tables())} tables in dsd-view.")
    result = False

    try:
        cur = KioskSQLDb.execute_return_cursor("""select id from repl_workstation_filemaker;""")
        r = cur.fetchone()
        if not r:
            print("No workstations to reverse engineer found.")
        else:
            while r:
                workstation_id = r["id"]
                print(f"reverse engineering workstation {workstation_id}")
                result = migration.reverse_engineer_dataset(prefix=workstation_id + "_", namespace=workstation_id,
                                                            current_version_only=current_version_only)
                if not result:
                    raise Exception(f"Error in reverse engineering of workstation {workstation_id}")
                r = cur.fetchone()
    except BaseException as e:
        logging.error(f"do_reverse_engineering_workstations: {repr(e)}")
        print(f"Exception in do_reverse_engineering_workstations: {repr(e)}")
    finally:
        try:
            cur.close()
        except BaseException as e:
            logging.error(f"do_reverse_engineering_workstations: {repr(e)}")

    return result


def do_migration(quiet_mode: bool, reverse_engineer_only: bool = False, reverse_workstations: bool = False,
                 current_version_only: bool = False):
    print(f"Migration will be using \n- configuration from {cfg.configfile}")
    print(f"- database {cfg.database_name}")
    print(f"- dataset definition {cfg.dsdfile}")
    print("parameters are: ")
    print(options)
    print("")
    if not quiet_mode:
        text = input("proceed with this configuration? (type yup to proceed)")
        if text != "yup":
            print("Aborted: Nothing happened.")
            sys.exit(0)
            return
    else:
        print("-q option: Proceeding automatically...")
    if reverse_engineer_only or reverse_workstations:
        print("reverse engineering ...", flush=True)
    else:
        print("migrating...", flush=True)

    dsd3 = DataSetDefinition()
    dsd3.register_loader("yml", DSDYamlLoader)
    dsd3.append_file(cfg.dsdfile)
    connect_database()
    postgres_adapter = PostgresDbMigration(dsd3, KioskSQLDb.get_con())

    try:
        migration = Migration(dsd3, postgres_adapter)
        if reverse_engineer_only or reverse_workstations:
            if reverse_engineer_only:
                result = do_reverse_engineering(dsd=dsd3, migration=migration, cfg=cfg,
                                                current_version_only=current_version_only)
            if reverse_workstations:
                result = do_reverse_engineering_workstations(dsd=dsd3, migration=migration, cfg=cfg,
                                                             current_version_only=current_version_only)
        else:
            result = migration.migrate_dataset()
    except Exception as e:
        result = False
        logging.error(repr(e))

    logger = logging.getLogger()
    logger.handlers[0].flush()
    sys.stdout.flush()

    if not result:
        print("Error occured: Rolling back.")
        KioskSQLDb.rollback()
        print("Roll back successful.")
    else:
        KioskSQLDb.commit()
        print("Migration done and commited.", flush=True)


# **********************************************
# console part
# **********************************************


def interpret_param(known_param, param: str):
    new_option = params[known_param]
    rc = None

    if new_option == "db":
        rc = {new_option: param.split("=")[1]}
    elif new_option == "dsd":
        rc = {new_option: param.split("=")[1]}
    else:

        rc = {new_option: None}

    return rc


def usage():
    print("""
    Usage of kiosk_db_migrate.py:
    ===================
      kiosk_db_migrate <kiosk-dir> [options]
      <kiosk-dir> is required and must point to the base directory 
                  (in which either a config\kiosk_config.yml or a config\sync_config.yml is expected)

      options:
        -q / --quiet: Do not ask before proceeding
        -db=<database> / --database=<database name>: uses a different databasename then the one in the kiosk-config
        -dsd=<dataset definition>: Uses a different dataset definition than the one in the kiosk config

        -re / --reverse_engineer_master: does not migrate but reverse engineer the existing database
        -rw / --reverse_engineer_workstations: add the workstation tables to the migration catalog if
                                            they match the current dsd.   
        --current_version_only: instead of trying to reverse engineer some version of a table's structure, only
                                the current version will be accepted. 

    """)
    sys.exit(0)


if __name__ == '__main__':
    options = {}
    dsd_file = ""
    database = ""

    logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    if len(sys.argv) < 2:
        usage()

    kiosk_dir = sys.argv[1]
    if kiosk_dir and not path.isdir(kiosk_dir):
        logging.error(f"kiosk directory {kiosk_dir} does not seem to exist or is not a valid directory.")
        usage()

    cfg_file = path.join(kiosk_dir, r'config\kiosk_config.yml')
    if not path.isfile(cfg_file):
        cfg_file = path.join(kiosk_dir, r'config\sync_config.yml')
        if not path.isfile(cfg_file):
            logging.error(f"neither a sync_config.yml nor a kiosk_config.yml can be found. ")
            usage()

    cfg = SyncConfig.get_config({'config_file': cfg_file})

    for i in range(2, len(sys.argv)):
        param = sys.argv[i]
        known_param = [p for p in params if param.lower().startswith(p)]
        if known_param:
            known_param = known_param[0]
            new_option = interpret_param(known_param, param)
            if new_option:
                options.update(new_option)
            else:
                logging.error(f"parameter {param} not understood.")
                usage()
        else:
            print(f"parameter \"{param}\" unknown.")
            usage()

    if "db" in options:
        cfg.database_name = options["db"]
    if "dsd" in options:
        if path.isfile(options["dsd"]):
            cfg.dsdfile = options["dsd"]
        else:
            print(f"dsd file {options['dsd']} does not exist. ")
            usage()

    do_migration(quiet_mode="quiet" in options, reverse_engineer_only="reverse" in options,
                 reverse_workstations="reverse workstations" in options,
                 current_version_only="current_version_only" in options)
