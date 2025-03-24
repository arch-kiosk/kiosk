import logging
import os
import subprocess
import sys
from os import path
from typing import List

from kioskrequirements import KioskRequirements

params = {"-fr": "fr", "--unpack_file_repository": "fr",
          "-fro": "fro", "--override_file_repository": "fro",
          "-w": "w", "--unpack_workstations": "w",
          "-ft": "ft", "--unpack_filemaker_template": "ft",
          "-c": "c", "--code": "c",
          "-nc": "nc", "--no_custom_directories": "nc",
          "-dev": "dev",
          "-p": "p",
          "-db": "db", "--database": "db",
          "-o": "o", "--override": "o",
          "--no_config": "noc",
          "-ru": "ru",
          "--restore_users": "ru",
          "-dbuser": "dbuser",
          "-dbpwd": "dbpwd",
          "-dbname": "dbname",
          "-dbport": "dbport",
          "-pgdb": "pgdb",
          # "-nt": "nt",
          "-nomg": "nomg", "--no_migration": "nomg",
          # "-no_thumbnails": "nt",
          "-no_admin": "no_admin",
          "--no_admin": "no_admin",
          "-na": "no_admin",
          "--no_redis": "no_redis",
          "-nr": "no_redis",
          "--sudo_password": "sudo_password",
          "-sp": "sudo_password",
          "--patch": "patch",
          "--no_housekeeping": "nh",
          "-nh": "nh",
          "--no_timezones": "ntz",
          "--guided": "guided",
          "--test_drive": "test_drive",
          "-rm": "rm",
          "--update_custom_modules": "ucm",
          "--exclude_mcp": "exclude_mcp",
          "-ncu": "no_clear_up",
          "--no_clear_up": "no_clear_up",
          "-cfc": "clear_file_cache",
          "--clear_file_cache": "clear_file_cache",
          "--project_id": "project_id",
          "--skip_installation": "skip_installation",
          "--renew_workstations": "renew",
          "--dont_check_workstations": "dcw",
          "-dcw": "dcw"
          }


def usage():
    print("""
    Usage of unpackkiosk.py:
    ===================
      unpackkiosk <path and filename of source folder with zips> <path and filename of destinaton kiosk>
      Needs admin privileges in windows (unless -no_admin is given).

      optional:
        -o / --override: if there is already a kiosk it will be overridden. Otherwise only the creation of a kiosk is allowed.  
        --no_config: only relevant with -o and for updates: suppresses the update of the default configuration files.
                     The kiosk_config will never be modified, though! Only the kiosk_default_config and the other default
                     dsd and config files. 
        -c / --code: unpacks the code for kiosk and kiosk-sync and installs our custom libraries.
        -ncu/ --no_clear_up: skips deleting old files first. Only useful together with very special patches that
                             use zip files with only a few files in them. 
        -nc / --no_custom_directories: don't unpack custom directories
        -fr / --unpack_file_repository: unpacks the contents of the file repository zip to the actual file repository
                it will only add files and not override existing ones.
        -fro  --override_file_repository: unpacks the contents of the file repository zip to the actual file repository
                this will override existing files. -fro wins over -fr if both are given
        
        -w / --unpack_workstations: Unpacks the workstation zip file to the filemaker folder
        -ft / --unpack_filemaker_template: Unpacks the filemaker template file
        -p: installs pip and the requirements and libraries with pip
        -nh / --no_housekeeping: suppresses housekeeping at the end of unpackkiosk
        --project_id: Only for new installations and in that case required: The central id for the project. 
        -db / --database: if in update mode: restores the database from the dbbackup.dmp. 
                                             A current database will be renamed first to _<current date>
                          if new installation: creates the database if necessary.
        -dbuser=user-id: This sets a new database user in the config.yml
        -dbpwd=password: This sets a new database password for the user in the config.yml
        -dbname=database name: This sets a different database to use in the config.yml
        -dbport=database port: This sets a different port for postgres to use in the config.yml
        -pgdb=database name: sets a postgres master database (which is used as a fallback) other than the default 'postgres'.    
        -nomg/--no_migration: suppresses the database migration at the end of unpackkiosk 
        -ru/ --restore_users: restores users and privileges from the backup. Usually the users and privileges
                              are NOT restored. Only in connection with -db! 
        -nt/ --no_thumbnails: obsolete. Use nh instead if you want to skip housekeeping (which includes refreshing thumbnails) 
        -cfc[=force]/ --clear_file_cache[=force]: sets all the file cache entries to "renew". The "refresh file cache" tool does the work.
                                  use =force to actually invalidate the file cache entries and remove the files  
        -na/--no_admin: run unpackkiosk without admin privileges.
        -nr/ --no_redis: Don't check and use redis.
        -no_timezones: Don't update the time zone catalog.
        -sp/ --sudo_password=password: Needed to write the redis call into start.ps1. Necessary only for a new install and
                                       if redis is being used at all (--no_redis is not set)
        -rm: restart machine at the end of unpackkiosk - if it was successful.
        --exclude_mcp: Does not unpack the MCPCore in order not to crash into a running MCP
        --update_custom_modules: explicitly update custom modules if -c is not set
        --skip_installation: Skips updating files and stuff and only does the aftermath
        --renew_workstations: renews all workstations that are in a state < in_the_field
        -dcw / --dont_check_workstations: Skips the check if workstations are in the field. 
        --patch: a short cut for patching core code files only. Does not temper with configuration, python or the db.
                Just unpacks the core code files. Implies -c, -o, --no_custom_directories, --no_config, 
                --no_redis, --no_migration, --no_thumbnails, --dont_check_workstations
    """)
    sys.exit(1)


current_kiosk_version = ""


def interpret_param(known_param, param):
    new_option = params[known_param]

    if new_option == "dbuser":
        userid = param.split("=")[1]
        rc = {new_option: userid}
    elif new_option == "dbpwd":
        userpwd = param.split("=")[1]
        rc = {new_option: userpwd}
    elif new_option == "clear_file_cache":
        option_params = param.split("=")
        if len(option_params) > 1 and option_params[1] == "force":
            rc = {new_option: "force"}
        else:
            rc = {new_option: ""}
    elif new_option == "sudo_password":
        sudopwd = param.split("=")[1]
        rc = {new_option: sudopwd}
    elif new_option == "pgdb":
        pgdb = param.split("=")[1]
        rc = {new_option: pgdb}
    elif new_option == "dbname":
        dbname = param.split("=")[1]
        rc = {new_option: dbname}
    elif new_option == "dbport":
        dbport = param.split("=")[1]
        rc = {new_option: dbport}
    elif new_option == "project_id":
        project_id = param.split("=")[1]
        rc = {new_option: project_id}
    elif new_option == "patch":
        rc = {new_option: None,
              "o": None,
              "c": None,
              "nc": None,
              "noc": None,
              "no_redis": None,
              "nh": None,
              "nt": None,
              "dcw": None}
    else:
        rc = {new_option: None}

    return rc


def in_virtual_env():
    """
        determines whether the current process is running inside a virtual environment (python or virtualenv).
    """

    try:
        if sys.real_prefix:
            return True
    except AttributeError:
        pass
    return not (sys.prefix == sys.base_prefix)


def pip_basics():
    """
        upgrades pip to the latest version
    """
    if not in_virtual_env():
        logging.warning("Option p used outside of a virtual environment!")
    try:
        print("upgrading pip ...", end="", flush=True)
        rc = subprocess.run(f"python -m pip install --upgrade pip", stdout=subprocess.PIPE)
        if rc.returncode != 0:
            logging.error(f"pip_basics: python -m pip install --upgrade pip returned {rc}")
            sys.exit(1)
    except BaseException as e:
        logging.error(f"pip_basics : {repr(e)}")
        sys.exit(1)


def pip_install_requirements(src_dir):
    requirements_file = path.join(src_dir, "requirements.kiosk.txt")
    if not path.isfile(requirements_file):
        logging.error(f"Error when installing python packages: Requirements file {requirements_file} missing.")
        sys.exit(1)
    try:
        print("running pip and installing python packages ...", end="", flush=True)
        if KioskRequirements.install(requirements_file, {"nv": True}):
            print("ok", flush=True)
        else:
            print("failed")
            sys.exit(1)

    except OSError as e:
        logging.error(f"Exception in pip_install_requirements: {repr(e)}")
        sys.exit(1)


def check_db_name(cfg_file, options):
    if "dbname" in options:
        from kioskconfig import KioskConfig
        KioskConfig._release_config()
        config = KioskConfig.get_config({"config_file": cfg_file})
        if "dbname" in options:
            assert config.database_name == options["dbname"]


def check_imagemagick():
    try:
        from wand.image import Image
    except BaseException as e:
        if "not installed ImageMagick" in repr(e):
            return False
        else:
            print(f"Unexpected response when testing if imagemagick is installed: {repr(e)}")

    return True


def check_ghostscript():
    from wand.image import Image
    with open("test.pdf", "w") as f:
        f.write("just a test file, please delete!")

    try:
        test_pdf = Image(filename="test.pdf")
    except BaseException as e:
        if "FailedToExecuteCommand" in repr(e):
            return False
    finally:
        os.remove("test.pdf")

    return True


def check_redis():
    try:
        from redis import Redis as Client
        from redis.commands.json.path import Path
        redis = Client(host="127.0.0.1", port="6379")
        if redis:
            if redis.ping():
                return True
    except BaseException as e:
        print(repr(e))

    return False


# noinspection DuplicatedCode
def start_python_subprocess(python_script, parameters, working_directory=None):
    """
    Executes a Python script as a subprocess. This function runs a specified Python
    script with given parameters in a subprocess. If no working directory is
    specifically provided, the current working directory of the process will be
    used instead. It captures the script's return code and returns it. In case of
    any error during the execution, it raises an exception.

    !This is an exact copy of the same function in kioskstdlib!

    :param python_script: The path to the Python script to be executed.
    :param parameters: A list of parameters to pass to the Python script.
    :param working_directory: Directory to set as the working directory for the
                              subprocess. If not specified, defaults to the
                              current working directory.
    :return: The return code of the executed Python script.
    :rtype: int
    :raises Exception: If there is an error during the script execution, an
                       exception is raised with a corresponding error message.
    """
    cmdline = []
    try:

        if not os.path.isfile(python_script):
            if not os.path.isfile(os.path.join(working_directory, python_script)):
                raise ValueError(f"Script {python_script} does not exist.")

        if not working_directory:
            working_directory = os.getcwd()

        cmdline = [sys.executable, python_script]
        cmdline.extend(parameters)
        result = subprocess.run(cmdline, cwd=working_directory, env=os.environ.copy())
        rc = result.returncode
        return rc

    except BaseException as e:
        cmdline_str = " ".join(cmdline)
        err_msg = f"unpackkiosk.start_python_subprocess: " \
                  f"Error running {cmdline_str}: {repr(e)}."
        raise Exception(err_msg)


def workstations_in_the_field(kiosk_dir: str) -> bool:
    script = "check_workstation_states.py"  # this returns 1 if all workstations are in state IDLE
    try:
        rc = start_python_subprocess(script, [kiosk_dir])
        return rc != 1
    except BaseException as e:
        logging.error(f"unpackkiosk.workstations_in_the_field: {repr(e)}")
        return True


def transform_file_repository(cfg_file):
    from transformfilerepository import TransformFileRepository
    if kioskstdlib.cmp_semantic_version(current_kiosk_version, "1.5") == -1:
        print("Transforming the file repository if necessary: ", end="", flush=True)
        transform = TransformFileRepository(cfg_file)
        transform.console = True
        if not transform.transform():
            logging.error("Transform file repository failed miserably!")
        if transform.get_errors() > 0:
            logging.warning(f"Transform file repository reported trouble with {transform.get_errors()} files.")
    else:
        logging.info(f"Transform file repository skipped because we're updating a Kiosk versions > 1.5.")


def transform_file_cache(cfg_file):
    from transformfilecache import TransformFileCache
    if kioskstdlib.cmp_semantic_version(current_kiosk_version, "1.5") == -1:
        print("Transforming file cache directories if necessary: ", end="", flush=True)
        transform = TransformFileCache(cfg_file)
        transform.console = True
        if not transform.transform():
            logging.error("Transform file cache failed miserably!")
        if transform.get_errors() > 0:
            logging.warning(f"Transform file cache reported trouble with {transform.get_errors()} files.")
    else:
        logging.info(f"Transform file cache skipped because we're updating a Kiosk versions > 1.5.")


def clear_file_cache(cfg_file, force=False):
    from sync_config import SyncConfig
    from kiosksqldb import KioskSQLDb
    from kioskfilecache import KioskFileCache
    config = SyncConfig.get_config({"config_file": cfg_file})

    cache_dir = os.path.join(config.get_file_repository(create_if_non_existant=True), "cache")
    if "cache" in config.file_repository:
        cache_dir = config.resolve_symbols(config.file_repository["cache"])
    else:
        logging.warning(f"clear_file_cache: file_repository_cache not set: Defaulting to {config._cache_dir}")

    db = KioskSQLDb()
    # file_repository_path = config.get_file_repository()
    # dsd = DataSetDefinition(DSDInMemoryStore())
    # dsd.register_loader(DSDLoaderClass=DSDYamlLoader, file_ext="yml")
    # dsd.append_file(self.config.get_dsdfile())
    # files_table = dsd.files_table
    # assert files_table

    file_cache = KioskFileCache(cache_base_dir=cache_dir)
    try:
        if force:
            if file_cache.invalidate(uid=None, representation_type=None, delete_files=True, commit=True):
                kioskstdlib.remove_kiosk_subtree(cache_dir, config.base_path)
                os.mkdir(cache_dir)
                return True
            else:
                logging.error(f"clear_file_cache with force was unsuccessful")
        else:
            if file_cache.renew(commit=True):
                return True

            logging.error(f"clear_file_cache: flagging with renew was unsuccessful")

    except BaseException as e:
        logging.error(f"clear_file_cache {repr(e)}")
    return False


def housekeeping(cfg_file: str):
    try:
        from housekeeping import Housekeeping
        from sync_config import SyncConfig
        from filerepository import FileRepository
        from synchronization import Synchronization

        config = SyncConfig.get_config({"config_file": cfg_file})
        sync = Synchronization()
        file_repos = FileRepository(config,
                                    event_manager=sync.events,
                                    type_repository=sync.type_repository,
                                    plugin_loader=sync)
        hk = Housekeeping(file_repos, console=True)
        housekeeping_tasks_to_run = [
            "housekeeping_check_broken_files",
            "housekeeping_check_file_meta_data",
            "housekeeping_check_cache_files",
            "housekeeping_rewrite_image_record",
            "housekeeping_lowercase_filenames",
            "housekeeping_clear_log"
        ]
        hk.do_housekeeping(housekeeping_tasks=housekeeping_tasks_to_run)
    except BaseException as e:
        logging.error(f"housekeeping: Exception in housekeeping: {repr(e)}")


def install_default_queries(cfg_file: str):
    try:
        from kioskquery.kioskquerystore import install_default_kiosk_queries
        from sync_config import SyncConfig

        config = SyncConfig.get_config({"config_file": cfg_file})
        install_default_kiosk_queries(config)
        print("Installed default kiosk queries.", flush=True)
    except BaseException as e:
        logging.error(f"install_default_queries: Exception in install_default_queries: {repr(e)}. "
                      f"Continuing, though ...")


def refresh_full_text_index(cfg_file: str):
    try:
        from sync_config import SyncConfig
        from fts.kioskfulltextsearch import FTS
        from dsd.dsd3 import DataSetDefinition
        from dsd.dsd3singleton import Dsd3Singleton

        print("refreshing full text index...", flush=True, end="")
        cfg = SyncConfig.get_config({'config_file': cfg_file})
        dsd = Dsd3Singleton.get_dsd3()
        assert dsd.append_file(cfg.dsdfile)
        fts = FTS(dsd, cfg)
        fts.rebuild_fts(console_output=True)
        print("okay", flush=True, end="\n")

    except BaseException as e:
        print("failed", flush=True, end="\n")
        logging.error(f"refresh_full_text_index: Exception in refresh_full_text_index: {repr(e)}. "
                      f"Continuing, though ...")


def check_database_integrity(cfg_file: str):
    try:
        from sync_config import SyncConfig
        from tools.KioskDatabaseIntegrity import KioskDatabaseIntegrity
        print("checking database integrity...", flush=True, end="")
        cfg = SyncConfig.get_config({'config_file': cfg_file})
        dbint = KioskDatabaseIntegrity(cfg)
        dbint.ensure_database_integrity()
        print("okay", flush=True, end="\n")

    except BaseException as e:
        print("failed", flush=True, end="\n")
        logging.error(f"Error when checking database integrity: {repr(e)}. Continuing, though ...")


def delete_old_directories():
    dirs = [os.path.join(kiosk_dir, "sync", "sync", "sync_plugin", "fileimporturaphook")]
    for d in dirs:
        try:
            kioskstdlib.clear_dir(d)
            os.rmdir(d)
            print(f"Removed {d}")
        except BaseException as e:
            pass

def create_default_directories():
    dirs = [
        os.path.join(kiosk_dir, "reporting"),
        os.path.join(kiosk_dir, "custom"),
        os.path.join(kiosk_dir, "temp"),
        os.path.join(kiosk_dir, "sync", "sync", "custom"),
            ]
    for d in dirs:
        try:
            if not os.path.exists(d):
                os.makedirs(d)
            print(f"created {d}")
        except BaseException as e:
            pass

def renew_workstations(cfg_file: str):
    """
    renews all FileMakerRecordingWorkstation docks.

    :param cfg_file:
    :return: number of successfully renewed docks. -1 in case of a general error.
    """
    try:
        from sync_config import SyncConfig
        from dsd.dsd3 import DataSetDefinition
        from dsd.dsd3singleton import Dsd3Singleton
        from synchronization import Synchronization
        from sync_plugins.filemakerrecording.filemakerworkstation import FileMakerWorkstation

        print("renewing FileMaker recording docks:", flush=True, end="\n")
        c = 0
        cfg = SyncConfig.get_config({'config_file': cfg_file})
        dsd = Dsd3Singleton.get_dsd3()
        sync = Synchronization()
        sync.type_repository.register_type("Workstation", "FileMakerWorkstation", FileMakerWorkstation)
        docks = sync.list_workstations()
        for dock in docks:
            if isinstance(dock, FileMakerWorkstation):
                dock: FileMakerWorkstation
                try:
                    state = dock.get_code_from_state(dock.get_state())
                    if state < dock.get_code_from_state(dock.IN_THE_FIELD):
                        print(f"Renewing {dock.get_id()} (state {dock.get_state()})...", flush=True, end="")
                        if dock.renew():
                            print("okay", flush=True, end="\n")
                            c += 1
                        else:
                            raise Exception("renewal failed. Have a look at the log.")
                    else:
                        print(f"Renewing {dock.get_id()}... skipped because dock is in state {dock.get_state()}",
                              flush=True, end="\n")

                except BaseException as e:
                    logging.error(f"unpackkiosk.renew_workstation: {repr(e)}")
                    print(f"failed ({repr(e)})", flush=True, end="\n")
                    return -1
        print("renewing FileMaker recording docks finished", flush=True, end="\n")
        return c

    except BaseException as e:
        logging.error(f"unpackkiosk.renew_workstation: {repr(e)}")
        print("failed", flush=True, end="\n")


def get_current_kiosk_version(kiosk_dir):
    if kioskstdlib.file_exists(os.path.join(kiosk_dir, "kiosk.version")):
        try:
            return kioskstdlib.get_kiosk_version_from_file(os.path.join(kiosk_dir, "kiosk.version"))
        except BaseException as e:
            logging.error(f"get_current_kiosk_version: {repr(e)}")

    # Must be pre kiosk.version. Let's read it from the kioskversion.py
    import importlib.util
    import sys
    filepath = os.path.join(kiosk_dir, "core", "kioskversion.py")
    if not kioskstdlib.file_exists(filepath):
        logging.error(f"unpackkiosk.get_current_kiosk_version: No file {filepath}")
        return "0"
    spec = importlib.util.spec_from_file_location("updatever", filepath)
    updatever = importlib.util.module_from_spec(spec)
    sys.modules["updatever"] = updatever
    spec.loader.exec_module(updatever)
    return updatever.kiosk_version


if __name__ == '__main__':
    options = {}
    logging.basicConfig(level=logging.INFO)
    if len(sys.argv) < 3:
        usage()

    src_dir = sys.argv[1]
    src_dir = path.abspath(src_dir)
    if src_dir and not path.isdir(src_dir):
        logging.error(f"{src_dir} does not seem to point to a valid folder.")
        usage()
    if not path.isfile(os.path.join(src_dir, "kiosk.zip")) \
            and not path.isfile(os.path.join(src_dir, "filemaker.zip")) \
            and not path.isfile(os.path.join(src_dir, "dbbackup.dmp")):
        logging.error(f"{src_dir} does not seem to point to a folder with kiosk zip files.")
        usage()

    print(f"unpacking from source directory {src_dir}")

    kiosk_dir = sys.argv[2]
    cfg_file = path.join(kiosk_dir, r'config\kiosk_config.yml')
    secure_file = path.join(kiosk_dir, r'config\kiosk_secure.yml')

    for i in range(3, len(sys.argv)):
        param = sys.argv[i]
        known_param = [p for p in params if param.split("=")[0].lower() == p]
        if known_param:
            known_param = known_param[0]
            new_option = interpret_param(known_param, param)
            if new_option:
                options.update(new_option)
            else:
                logging.error(f"parameter {param} not understood.")
        else:
            print(f"parameter \"{param}\" unknown.")
            usage()

    if "p" in options:
        pip_basics()

    if "p" in options:
        pip_install_requirements(src_dir)

    import kioskstdlib

    if not kioskstdlib.is_platform_admin():
        if "no_admin" in options:
            logging.warning("fUnpackkiosk should run with admin privileges but -no_admin has been used to run anyway.")
        else:
            logging.error(
                f"Unpackkiosk must run with admin privileges (unless started with -no_admin). Use run as ... ")
            sys.exit(1)

    if "patch" not in options:
        if not check_imagemagick():
            logging.error("Error: Imagemagick is not installed! Please install Imagemagick first.")
            sys.exit(1)

        if not check_ghostscript():
            logging.error("Error: Ghostscript is not installed! Please install Ghostscript first.")
            sys.exit(1)

        if "no_redis" not in options:
            if not check_redis():
                logging.error(f"ERROR: REDIS is not installed or at least not running ...")
                sys.exit(1)

    if "test_drive" in options and "o" not in options:
        logging.info(
            "test_drive parameter for a new installation recognized. unpackkiosk will stop here. Options were:")
        logging.info(",".join([f"{k}={v}" for k, v in options.items()]))
        logging.info(f"kiosk-dir: {kiosk_dir}")
        logging.info(f"source-dir: {src_dir}")
        sys.exit(1)

    from kioskrestore import KioskRestore

    KioskRestore.in_console = True
    KioskRestore.dev_mode = "dev" in options
    KioskRestore.assert_7zip()
    if "patch" not in options:
        KioskRestore.assert_postgres()
    this_is_an_update = False

    if path.isdir(kiosk_dir):
        if "o" in options:
            if not path.isfile(cfg_file):
                logging.error(f"Configuration file {cfg_file} does not seem to exist.")
                usage()
            current_version = get_current_kiosk_version(kiosk_dir)
            if not current_version:
                logging.error("Error: Cannot read the version of the existing Kiosk")
                sys.exit(1)
            if current_version == "0":
                logging.error("Error: The Kiosk you try to update is so old that it does not even have a "
                              "kioskversion.py let alone the newer kiosk.version. "
                              "Please make sure you really want to update this Kiosk "
                              "(and then create a kiosk.version manually).")
                sys.exit(1)
            try:
                _current_kiosk_version = kioskstdlib.get_kiosk_semantic_version(current_version)
                if _current_kiosk_version == ("", ""):
                    raise "Cannot parse version"
                if _current_kiosk_version[0] != "1":
                    raise "Cannot update anything but generation 1"
                current_kiosk_version = _current_kiosk_version[1]
            except BaseException as e:
                logging.error(f"Error: The Kiosk you try to update has an illegal version \"{current_version}\" ")
                sys.exit(1)

            print(f"updating an existing Kiosk version \"{current_version}\"", end="\n")

            if workstations_in_the_field(kiosk_dir):
                if "dcw" in options:
                    logging.warning(f"Error: The Kiosk you are trying to update has workstations in the field or "
                                    f"the check failed for some reason. However, "
                                    f"'--dont_check_workstations' is set, so I continue.")
                else:
                    logging.error(f"Error: The Kiosk you are trying to update has workstations in the field or "
                                  f"the check failed for some reason. However, "
                                  f"use '--dont_check_workstations' to update anyhow.")
                    sys.exit(1)

            if "test_drive" in options:
                logging.info("test_drive parameter for an update recognized. unpackkiosk will stop here. Options were:")
                logging.info(",".join([f"{k}={v}" for k, v in options.items()]))
                logging.info(f"kiosk-dir: {kiosk_dir}")
                logging.info(f"source-dir: {src_dir}")
                sys.exit(1)

            if "skip_installation" not in options:
                if "noc" not in options:
                    print(f"unzipping configuration files ...", end="")
                    kiosk_zip = path.join(src_dir, "kiosk.zip")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, "config/kiosk_default_config.yml", "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, "config/kiosk_local_config_template.yml",
                                                   "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, "config/kiosk_secure_template.yml", "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, "config/kiosk_config_template.yml", "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, 'config/image_manipulation_config.yml', "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, 'config/file_handling.yml', "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, 'config/kiosk_ui_classes.uic', "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, "config/dsd", "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, "config/ui", "-aoa")
                    KioskRestore.zip_extract_files(kiosk_dir, kiosk_zip, "config/kiosk_queries", "-aoa")
                    print(f"ok", end="\n")
                else:
                    print(f"skipped configuration files.", end="\n")

                if "dbuser" in options or "dbpwd" in options or "dbname" in options or "dbport" in options:
                    KioskRestore.set_new_database_credentials(cfg_file, secure_file, options)

            this_is_an_update = True
        else:
            logging.error(f"kiosk directory {kiosk_dir} exist but override parameter not set.")
            usage()
    else:
        print(f"Creating new kiosk under {kiosk_dir}")
        if not ("dbuser" in options and "dbpwd" and "dbname" in options):
            logging.error("creating a new kiosk needs dbuser, dbpwd and dbname parameters!")
            usage()
        KioskRestore.create_kiosk(src_dir, kiosk_dir, cfg_file, options)
        options.update({"create_kiosk": None})

    print(f"target kiosk is using config file {cfg_file}")
    check_db_name(cfg_file, options)
    if not KioskRestore.check_file_repository_path(cfg_file):
        usage()

    print("parameters are: ")
    print(options)

    if "skip_installation" not in options:
        KioskRestore.unpack_kiosk(src_dir, cfg_file, options)
        if "patch" not in options:
            if "db" in options:
                if this_is_an_update:
                    if "pgdb" in options:
                        KioskRestore.postgres_master_db = options["pgdb"]
                        print(f"default Postgres database is set to {KioskRestore.postgres_master_db}")
                    restore_users = "ru" in options
                    restore_workstations = "w" in options
                    KioskRestore.restore_db(cfg_file, src_dir,
                                            restore_users=KioskRestore.RESTORE_USERS_ALL,
                                            restore_workstations=restore_workstations)
                else:
                    if not KioskRestore.create_db_if_missing(cfg_file):
                        print(f"create_db_if_missing returned False. Database was not created.")
                        sys.exit(1)
                    else:
                        print(f"database ready.")

    # this does not work:

    sys.path.append(kiosk_dir)
    sys.path.append(os.path.join(kiosk_dir, "core"))
    sys.path.append(os.path.join(kiosk_dir, "sync", "sync", "core"))
    sys.path.append(os.path.join(kiosk_dir, "sync", "sync"))
    # try:
    #     from dsd.dsd3 import DataSetDefinition
    # except BaseException as e:
    #     print(f"cannot import dsd3 module. ")
    #     print(sys.path)
    #     sys.exit(0)

    if this_is_an_update and "nomg" not in options:
        try:
            if not KioskRestore.migrate_database(cfg_file):
                print(f"ERROR: migrate_database returned False. Database was not properly migrated: "
                      f"STOPPING UNPACKKIOSK PREMATURELY.")
                sys.exit(1)
            else:
                print("Database Migration successful")
                if "ntz" not in options:
                    try:
                        from tz.kiosktimezones import KioskTimeZones

                        tz_dir = os.path.join(kiosk_dir, "tools", "tz")
                        kiosk_tz = KioskTimeZones()
                        kiosk_tz.update_local_kiosk_time_zones(os.path.join(tz_dir, "kiosk_tz.json"))
                        print("Updated local Kiosk time zones")
                    except BaseException as e:
                        print(f"ERROR when updating time zones: {repr(e)}. This is not critical. "
                              f"But you will have to update the time zone catalog manually")
                else:
                    print("Skipped updating the time zone catalog")

        except BaseException as e:
            print(f"ERROR: migrate_database threw Exception {repr(e)}: STOPPING.")
            sys.exit(1)
    else:
        if not this_is_an_update:
            print("Migration skipped because this is a new installation that might need configuration first.")
            print("NOTE that after Kiosk has been through the first migration "
                  "you need to update the time zone catalog manually.")

    if this_is_an_update:
        try:
            delete_old_directories()
        except BaseException as e:
            print(f"WARNING: something when wrong when deleting superfluous directories: {repr(e)}. Continuing ...")

        if "patch" not in options:
            transform_file_repository(cfg_file)
        if "clear_file_cache" not in options:
            transform_file_cache(cfg_file)
        else:
            if clear_file_cache(cfg_file, force=True if options["clear_file_cache"] == "force" else False):
                print("file cache successfully cleared", flush=True)

        # obsolete
        # if ("fro" in options or "fr" in options) and "nt" not in options:
        #     KioskRestore.refresh_thumbnails(cfg_file)
        # else:
        #     print("Skipped creation of thumbnails")

        if "renew" in options:
            renew_workstations(cfg_file)

        if "nh" not in options and "nt" not in options:
            try:
                housekeeping(cfg_file)
            except BaseException as e:
                print(f"Exception when starting housekeeping: {repr(e)}")
                print(sys.path)

    install_default_queries(cfg_file)
    create_default_directories()

    if this_is_an_update:
        check_database_integrity(cfg_file)
        refresh_full_text_index(cfg_file)

    logging.info("unpackkiosk is done.")
    if "rm" in options:
        try:
            if subprocess.run(["shutdown", "-r"]).returncode < 0:
                raise Exception("shutdown failed")
        except BaseException as e:
            logging.error(f"unpackkiosk: {repr(e)}")
            options.pop("rm")
