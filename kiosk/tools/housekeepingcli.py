import datetime
import logging
import os
import sys
from time import sleep
from typing import List, Dict

import yaml

import kioskstdlib
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from filerepository import FileRepository
from housekeeping import Housekeeping
from kioskconfig import KioskConfig
from sync.core.fileimport import FileImport
from sync_config import SyncConfig
from synchronization import Synchronization
from tools.kiosktoolslib import init_dsd
from tz.kiosktimezones import KioskTimeZones
from synchronization import Synchronization
import filerepository

import_params = {"--param_file": "p",
                 "--all": "all",
                 # "-repl_user_id": "u",
                 # "-tz": "tz",
                 "-?": "?"
                 }
options = {}
last_progress = 0


def interpret_param(known_param, param):
    new_option = import_params[known_param]
    rc = None

    if new_option in ["p"]:  # , "u", "tz"]:
        param_parts = param.split("=")
        if len(param_parts) == 2:
            param_2 = param_parts[1]
            if param_2:
                rc = {new_option: param_2}
    else:
        rc = {new_option: None}

    return rc


def usage():
    print("""
    Usage of housekeepingcli.py:
    ===================
      housekeepingcli --param_file=<path and filename of parameters --all
      parameters:
        --param_file: path and filename of a YAML file that has specific parameters. You can use --all instead.
        --all: If you don't define a task list in the param_file or the param_file does 
                not exist you can run all tasks with this parameter.
        -?: additional help for the YAML file. 
    """)
    sys.exit(0)


def show_yaml_help():
    print("""
    example of a YAML file for this cli:
    ===================
    """)
    sys.exit(0)


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


def init(config_file):
    KioskConfig._release_config()
    cfg = KioskConfig.get_config({"config_file": config_file})

    # Initialize logging and settings
    logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    # logger.handlers = []

    if cfg.get_logfile():
        log_pattern = cfg.get_logfile().replace("#", "%")
        log_file = datetime.datetime.strftime(datetime.datetime.now(), log_pattern)
        ch = logging.FileHandler(filename=cfg.resolve_symbols(log_file))
        ch.setLevel(logging.INFO)
        formatter = logging.Formatter('>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s')
        ch.setFormatter(formatter)
        logger.addHandler(ch)


def report_progress(prg):
    global last_progress
    print("\r", end="")

    if "progress" in prg:
        new_progress = int(prg["progress"])
        if new_progress > last_progress:
            last_progress = new_progress
            print(f"\r{new_progress} %", end="", flush=True)
            sleep(.1)
    return True


def run_housekeeping(cfg: SyncConfig, tasks: List, import_options: Dict):
    init_dsd(cfg)
    sync = Synchronization()
    file_repos = filerepository.FileRepository(cfg,
                                               sync.events,
                                               sync.type_repository,
                                               sync)
    housekeeping: Housekeeping = Housekeeping(file_repos, console=False)

    if "files" in import_options:
        housekeeping.limit_to_files = import_options["files"]

    return housekeeping.do_housekeeping(progress_handler=report_progress,
                                        housekeeping_tasks=tasks,
                                        file_tasks_only=False)

if __name__ == '__main__':
    this_path = os.path.dirname(os.path.abspath(__file__))
    kiosk_dir = get_kiosk_base_path_from_test_path(this_path)
    init(os.path.join(kiosk_dir, "config", 'kiosk_config.yml'))
    cfg = KioskConfig.get_config()
    cfg.truncate_log()

    if not os.path.isdir(cfg.get_file_repository()):
        logging.error(f"file repository {cfg.file_repository} does not point to a valid path.")
        exit(-1)

    if len(sys.argv) == 2 and sys.argv[1] == "-?":
        show_yaml_help()

    if len(sys.argv) < 2:
        logging.error(f"No parameters given.")
        usage()

    # import_dir = sys.argv[1]
    # if not import_dir or not os.path.isdir(import_dir):
    #     logging.error(f"kiosk directory {import_dir} does not seem to exist or is not a valid directory.")
    #     usage()

    for i in range(1, len(sys.argv)):
        param = sys.argv[i]
        known_param = [p for p in import_params if param.lower().startswith(p)]
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

    print("parameters are: ")
    print(options)

    if "?" in options:
        show_yaml_help()

    if "p" not in options and "all" not in options:
        logging.error(f"Please state a parameter file.")
        usage()

    import_params = {}
    if "p" in options:
        print(f"Using parameters file {options['p']}")
        if not os.path.isfile(options["p"]):
            logging.error(f"The parameter file {options['p']} does not exist.")
            usage()
        try:
            with open(options["p"], "r", encoding='utf8') as ymlfile:
                import_params = yaml.load(ymlfile, Loader=yaml.FullLoader)
        except BaseException as e:
            logging.error(f"Error when reading {options['p']}: {repr(e)}")
            show_yaml_help()
    if not import_params or 'tasks' not in import_params:
        tasks = []
    else:
        tasks = import_params["tasks"]

    if not tasks:
        if "all" not in options:
            logging.error(f"tasks list is empty in parameter file. If you really want to run all tasks "
                          f"you must use the -all parameter in addition. Stopping.")
            usage()
    else:
        if "all" in options:
            logging.warning(f"You have defined a task list in the parameter file but also the -all parameter."
                          f"The task list has priority. If you really want to run all tasks you have to "
                          f"define an empty task list! Continuing with the task list...")

    import_options = import_params["options"] if "options" in import_params else {}
    print(f"---------------------------------------------------------------------------------")
    run_housekeeping(cfg, tasks, import_options)
    print("Housekeeping done.")
    print(f"---------------------------------------------------------------------------------")
