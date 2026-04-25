# tools library: Only used by the tools in kiosk\tools
import sys
import kioskstdlib
import os
from kioskconfig import KioskConfig
import datetime
import logging

ROOT_FILE_NAME = "this_is_the_kiosk_root.md"

def get_kiosk_base_path_from_test_path(test_path) -> str:
    """
    tries to find the kiosk base path in the parent folder structure of the test_path
    :param test_path: the path where a test_file is located
    :return: the base path
    """

    base_path = ""
    id_directories = ["core", "api"]
    id_files = [ROOT_FILE_NAME]
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


def init_tool(config_file, logfile_prefix="", log_level_console=logging.WARNING, log_level_file = logging.DEBUG) -> bool:
    KioskConfig.release_config()
    if not os.path.exists(config_file):
        logging.error(f"Kiosk configuration file {config_file} does not exist.")
        return False
    cfg = KioskConfig.get_config({"config_file": config_file})

    # Initialize logging and settings
    logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    logger = logging.getLogger()

    # CRITICAL: Set the Logger to the LOWEST level (DEBUG)
    # so it allows all messages to pass through to the handlers.
    logger.setLevel(min(log_level_console, log_level_file))

    # 2. Configure the Console Handler
    # We clear existing handlers to avoid duplicates if calling this twice
    logger.handlers = []
    console_h = logging.StreamHandler()
    console_h.setLevel(log_level_console)  # e.g., WARNING
    console_formatter = logging.Formatter('%(asctime)s: %(message)s', datefmt="%H:%M:%S")
    console_h.setFormatter(console_formatter)
    logger.addHandler(console_h)

    if cfg.get_logfile():
        log_pattern = cfg.get_logfile().replace("#", "%")
        log_file = datetime.datetime.strftime(datetime.datetime.now(), log_pattern)
        if logfile_prefix:
            log_file_name = logfile_prefix + "_" + kioskstdlib.get_filename(log_file)
            log_file = os.path.join(kioskstdlib.get_file_path(log_file), log_file_name)

        print(f"Logging in {log_file}")

        file_h = logging.FileHandler(filename=cfg.resolve_symbols(log_file))
        file_h.setLevel(log_level_file)  # e.g., DEBUG
        file_formatter = logging.Formatter('>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s')
        file_h.setFormatter(file_formatter)
        logger.addHandler(file_h)

    return True


def split_param(known_parameter, param, default=None):
    param_parts = param.split("=")
    rc = default
    if len(param_parts) == 2:
        param_2 = param_parts[1]
        if param_2:
            rc = {known_parameter: param_2}
    return rc


def get_kiosk_dir_param(first_parameter_position: int, parameter_names=None):
    if not parameter_names:
        parameter_names = ["--kiosk-dir"]

    for i in range(first_parameter_position, len(sys.argv)):
        param = sys.argv[i]
        known_params = [p for p in parameter_names if param.lower().startswith(p)]
        for known_param in known_params:
            if known_param:
                rc = split_param(known_param, param)
                if rc:
                    return list(rc.values())[0]
    return None


def interpret_all_params(first_parameter_position: int, import_params, interpret_param_method):
    # new_options = copy.deepcopy(options)
    new_options = {}
    for i in range(first_parameter_position, len(sys.argv)):
        param = sys.argv[i]
        known_param = [p for p in import_params if param.lower().startswith(p)]
        if known_param:
            known_param = known_param[0]
            new_option = interpret_param_method(known_param, param)
            if new_option:
                new_options.update(new_option)
            else:
                logging.error(f"parameter \"{param}\" not understood.")
                return None
        else:
            logging.error(f"parameter \"{param}\" unknown.")
            return None
    return new_options


def check_required_options(options, required_options):
    error = False
    for ro in required_options:
        if ro not in options:
            logging.error(f"Missing required option {ro}")
            error = True

    return not error


def init_dsd(cfg):
    # needs to be imported locally because kioskpatcher is using this library but must not load dsd stuff.
    from dsd.dsd3singleton import Dsd3Singleton
    from dsd.dsdview import DSDView
    from dsd.dsdyamlloader import DSDYamlLoader

    master_dsd = Dsd3Singleton.get_dsd3()
    master_dsd.register_loader("yml", DSDYamlLoader)
    if not master_dsd.append_file(cfg.get_dsdfile()):
        logging.error(
            f"init_dsd: {cfg.get_dsdfile()} could not be loaded by append_file.")
        raise Exception(f"init_dsd: {cfg.get_dsdfile()} could not be loaded.")

    try:
        master_view = DSDView(master_dsd)
        master_view_instructions = DSDYamlLoader().read_view_file(cfg.get_master_view())
        master_view.apply_view_instructions(master_view_instructions)
        logging.debug(f"init_dsd: dsd3 initialized: {cfg.get_dsdfile()}. ")
        return master_view
    except BaseException as e:
        logging.error(f"init_dsd: Exception when applying master view to dsd: {repr(e)}")
        raise e

def is_kiosk_root(kiosk_path: str)->bool:
    """
    Checks if the path is a directory and that it has the root marker file.
    :param kiosk_path: str
    :return: bool
    """
    try:
        if os.path.isdir(kiosk_path):
            return os.path.isfile(os.path.join(kiosk_path, ROOT_FILE_NAME))
    except BaseException as e:
        pass
    return False