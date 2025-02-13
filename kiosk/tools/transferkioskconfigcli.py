import logging
import os
import sys
from time import sleep

from kioskconfig import KioskConfig
from kioskconfigtransfer import KioskConfigTransfer
from kiosktoolslib import get_kiosk_base_path_from_test_path, init_tool, interpret_all_params, check_required_options, \
    split_param, get_kiosk_dir_param
from initkiosk import basic_initialization

version = "0.1"

global_params = {"--kiosk-dir": "kiosk-dir",
                 "--config-zip": "config-zip",
                 "--project-id": "project-id",
                 "--dest": "dest",
                 "-?": "?",
                 "--help": "?",
                 }

command_params = {
    "import": ["config-zip"],
    "export": ["config-zip", "dest", "project-id"]
}

required_params = {
    "import": ["config-zip", "project-id"],
    "export": ["config-zip"],
}

options = {}
command = ""


def usage(err_msg=""):
    flush_log()
    print(flush=True)
    print(f"""
    \x1b[1;31m{err_msg}\x1b[0m
    transferkioskconfigcli imports or exports kiosk configurations from / to existing Kiosks  

    Usage of transferkioskconfigcli.py:
    ===================
      transferkioskconfigcli command [command-specific parameters] --config-zip [--project-id] [--kiosk-dir] [--dest]

      commands are "import" or "export"   

      <kiosk-dir>=points to the local kiosk base directory on which to perform the command. 
        If omitted kioskpatcher expects to run in a subdirectory of kiosk and will try to find the kiosk root. 

      <config-zip>=the path and filename of the zip file in which the config is or will be stored.  

      <project-id>=Required for imports: This is the target project id 
                    that must match with the config that's about to be unpacked.  

      <dest>=optional and only for "import". Relocates the import to a different directory. 
              Mainly for testing purposes in order not to override the local Kiosk. 

    """, flush=True)
    sys.exit(0)


def flush_log():
    print("", flush=True)
    for handler in logging.getLogger().handlers:
        handler.flush()

def check_transfer_dir(transfer_dir: str) -> bool:
    if not transfer_dir:
        logging.error(f"No transfer dir available.")
        return False

    if os.path.exists(transfer_dir):
        if os.path.exists(os.path.join(transfer_dir, "unpackkiosk")):
            return True
        else:
            logging.error(f"transfer dir {transfer_dir} does not have a sub directory unpackkiosk.")
    else:
        logging.error(f"transfer dir {transfer_dir} does not exist.")

    return False


def interpret_param(known_param, param):
    new_option = global_params[known_param]

    if new_option in ["kiosk-dir", "config-zip", "dest", "project-id"]:
        rc = split_param(new_option, param)
    else:
        rc = {new_option: None}

    return rc


if __name__ == '__main__':
    this_path = os.path.dirname(os.path.abspath(__file__))
    kiosk_dir = get_kiosk_dir_param(1, {"--kiosk-dir"})
    config_zip = ""

    if kiosk_dir is None:
        kiosk_dir = get_kiosk_base_path_from_test_path(this_path)
    else:
        logging.info(f"Kiosk Dir explicitly set to {kiosk_dir}")

    config_file = os.path.join(kiosk_dir, "config", 'kiosk_config.yml')

    if not init_tool(config_file, logfile_prefix="kioskconfigcli"):
        usage()

    basic_initialization(config_file)
    cfg: KioskConfig = KioskConfig.get_config()
    cfg.truncate_log()
    flush_log()
    sleep(1)
    logging.info(f"kioskconfigcli version {version}")

    if len(sys.argv) < 2:
        usage("No command given.")

    command = sys.argv[1]
    if command not in command_params.keys():
        usage(f"The command {command} is unknown.")

    # global_params.update(command_params[command])
    options = interpret_all_params(2, global_params, interpret_param)
    if options is not None:
        if "config-zip" in options:
            config_zip = cfg.resolve_symbols(options["config-zip"])

    if command in required_params and not check_required_options(options, required_params[command]):
        usage()

    if not config_zip:
        usage("no config-zip given")

    logging.info(f"Kiosk directory is {kiosk_dir}")
    logging.info(f"the config zip to use is {config_zip}")
    flush_log()
    kct = KioskConfigTransfer(kiosk_dir, cfg)
    if command == "export":
        if not kct.export_to_zip(config_zip):
            usage()
    else:
        cfg.release_config()
        cfg = KioskConfig
        if not kct.import_from_zip(config_zip, project_id=options["project-id"], dest=options["dest"] if "dest" in options else ""):
            usage()
    logging.info(f"\nFinished.\n")
