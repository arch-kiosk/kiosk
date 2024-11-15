import datetime
import logging
import os
import sys
from time import sleep

import yaml

import kioskstdlib
from contextmanagement.memoryidentifiercache import MemoryIdentifierCache
from filerepository import FileRepository
from kioskconfig import KioskConfig
from sync.core.fileimport import FileImport
from synchronization import Synchronization
from tools.kiosktoolslib import init_dsd
from tz.kiosktimezones import KioskTimeZones

import_params = {"-import_params": "p",
                 "-repl_user_id": "u",
                 "-tz": "tz",
                 "-?": "?"
                 }
options = {}
last_progress = 0


def interpret_param(known_param, param):
    new_option = import_params[known_param]
    rc = None

    if new_option in ["p", "u", "tz"]:
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
    Usage of import_files.py:
    ===================
      import_files <path and filename of file import folder> -import_params=<path and filename of parameters -repl_user_id=<user-id>>
      parameters:
        -import_params: path and filename of a YAML file that has specific parameters
                 if given all other parameters will be ignored.
        -repl_user_id: user id as used in the filemaker recording to mark the imported files
        -?: additional help for the YAML file. 
        
    """)
    sys.exit(0)


def show_yaml_help():
    print("""
    example of a YAML file with parameters:
    ===================
    file_import:
      recursive: True
      add_needs_context: False
      file_extensions: "jpg,nef"
      tags: "import_091256"
      substitute_identifiers (optional).
    file_import_filters:
      fileimportqrcodefilter:
        get_identifier: Bool
        get_date: Bool
        recognition_strategy: "qr_code_peru"
      fileimportstandardfolderfilter:
        get_identifier_from_folder: Bool
        get_date_from_folder: Bool
      fileimportstandardfilefilter:
        get_identifier_from_filename: Bool
        get_description_from_filename: Bool
        get_date_from_file: Bool
      fileimportexiffilter:
        get_context_from_exif: Bool
        get_date_from_exif: Bool
        get_description_from_exif: Bool
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
        new_progress = 0
        if "topic" in prg:
            if prg["topic"].find("import-local-files"):
                new_progress = int(prg["progress"])
            if "extended_progress" in prg:
                print(f"Trying file #{prg['extended_progress'][0]}. "
                      f"({prg['extended_progress'][1]} files imported so far)",
                      end="")
        if new_progress > last_progress:
            last_progress = new_progress
    sleep(.5)
    return True


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
        logging.error(f"No file import directory given.")
        usage()

    import_dir = sys.argv[1]
    if not import_dir or not os.path.isdir(import_dir):
        logging.error(f"kiosk directory {import_dir} does not seem to exist or is not a valid directory.")
        usage()

    for i in range(2, len(sys.argv)):
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

    if "p" not in options:
        logging.error(f"Please state a parameter file.")
        usage()

    print(f"Using parameters file {options['p']}")
    if not os.path.isfile(options["p"]):
        logging.error(f"The file {options['p']} does not exist.")
        usage()

    if "u" not in options:
        logging.error(f"No repl_user_id given.")
        usage()

    if "tz" not in options:
        logging.error(f"Please state a tz index")
        usage()

    try:
        tz_index = int(options["tz"])
    except BaseException as e:
        logging.error(f'{options["tz"]} is not a valid time zone index. Must be an integer.')
        usage()

    time_zones = KioskTimeZones()
    tz_long = time_zones.get_long_time_zone(tz_index)
    if not tz_long or tz_long == "-":
        logging.error(f'{options["tz"]} is not a valid time zone')
        usage()

    print(f"Using time zone {options['tz']}, {tz_long}")

    repl_user_id = options["u"]
    with open(options["p"], "r", encoding='utf8') as ymlfile:
        import_params = yaml.load(ymlfile, Loader=yaml.FullLoader)

    if not import_params or 'file_import' not in import_params or 'file_import_filters' not in import_params:
        logging.error(f"The file with parameters does not contain the required keys.")
        usage()

    if "file_extensions" in import_params["file_import"]:
        import_params["file_import"]["file_extensions"] = import_params["file_import"]["file_extensions"].lower()
    sync = Synchronization()
    file_repos = FileRepository(cfg, sync.events, sync.type_repository, sync)
    # files = file_repos.do_housekeeping(console=True)

    file_import = FileImport(cfg, sync,tz_index=tz_index)

    sorted_names = file_import.sort_import_filters()
    context_filters = [file_import.get_file_import_filter(x) for x in sorted_names]
    filter_params = import_params['file_import_filters']
    for context_filter in context_filters:
        context_filter_name = context_filter.__class__.__name__.lower()
        if context_filter_name in filter_params:
            context_filter.set_filter_configuration_values(filter_params[context_filter_name])
            print(f"Using filter {context_filter_name} with parameters {context_filter.get_filter_configuration()}")
            context_filter.activate()
        else:
            print(f"Not using filter {context_filter_name}.")
            context_filter.deactivate()

    general_import_params = import_params["file_import"]
    tags = general_import_params["tags"] if "tags" in general_import_params else ""

    if len(tags) == 0:
        tags = "import_" + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        general_import_params["tags"] = tags
        print("")
        logging.info(
            "Files will be automatically tagged as " + tags)

    general_import_params["mif_local_path"] = import_dir
    file_import.set_from_dict(general_import_params)
    print(f"using user \"{repl_user_id}\" to mark imported files.")
    print(f"files will be tagged as \"{general_import_params['tags']}\" to mark imported files.")
    file_import.modified_by = repl_user_id
    file_import.callback_progress = report_progress
    last_progress = 0

    file_import.file_repository = file_repos
    file_import.callback_progress = report_progress
    master_view = init_dsd(cfg)
    ic = MemoryIdentifierCache(master_view.dsd)
    file_import.identifier_evaluator = ic.has_identifier
    file_import.move_finished_files = True
    print(f"---------------------------------------------------------------------------------")
    print(f"\nImport from \"{file_import.pathname}\" into project \"{cfg.get_project_id()}\":")
    rc = file_import.execute()
    print("Import done.")
    print(f"---------------------------------------------------------------------------------")
    print(f"{file_import.files_added}/{file_import.files_processed} files added.")
