import json
import logging
import os
import sys
import kioskstdlib
import datetime
from kioskconfig import KioskConfig
from kiosklib import dispatch_system_message
from kioskpatcher import KioskPatcher
from kiosktoolslib import get_kiosk_base_path_from_test_path, init_tool, interpret_all_params, check_required_options, \
    split_param, get_kiosk_dir_param
from kiosksqldb import KioskSQLDb
from messaging.systemmessagecatalog import SYS_MSG_ID_MCP_NOT_UP, SYS_MSG_ID_PATCH_SUCCESSFUL, SYS_MSG_ID_PATCH_FAILED
from transferkiosk import TransferKiosk
from initkiosk import basic_initialization

version = "0.1"

global_params = {"--kiosk-dir": "kiosk-dir",
                 "--transfer-dir": "transfer-dir",
                 "-?": "?",
                 "--help": "?",
                 }

command_params = {
}

required_params = {
    # "cat": ["target-dir"],
    # "create-files-delta": ["delta-file"],
    # "pack-delta": ["delta-file", "target-dir"],
    # "unpack": ["source-dir"]
}

options = {}
command = ""


def usage():
    print("""
    kioskpatcher checks if a patch is available and installs it.

    Usage of kioskpatcher-cli.py:
    ===================
      kioskpatcher command [command-specific parameters][--kiosk-dir] [--transfer-dir]   
      <kiosk-dir>=points to the local kiosk base directory on which to perform the command. 
        If omitted kioskpatcher expects to run in a subdirectory of kiosk and will try to find the kiosk root. 
      <transfer-dir>=points to the directory that contains the patch. Usually not necessary because if omitted
       kioskpatcher reads the transfer-dir from the Kiosk's config or expects the transfer dir to be at ..\transfer
       relative to the kiosk dir.  

    """)
    sys.exit(0)


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

    if new_option in ["kiosk-dir", "transfer-dir"]:
        rc = split_param(new_option, param)
    else:
        rc = {new_option: None}

    return rc


if __name__ == '__main__':
    this_path = os.path.dirname(os.path.abspath(__file__))
    kiosk_dir = get_kiosk_dir_param(1, {"--kiosk-dir"})
    transfer_dir = ""

    if kiosk_dir is None:
        kiosk_dir = get_kiosk_base_path_from_test_path(this_path)
    else:
        logging.info(f"Kiosk Dir explicitly set to {kiosk_dir}")

    config_file = os.path.join(kiosk_dir, "config", 'kiosk_config.yml')

    if not init_tool(config_file, logfile_prefix="patcher"):
        usage()
    basic_initialization(config_file)
    cfg: KioskConfig = KioskConfig.get_config()
    cfg.truncate_log()
    logging.info(f"kioskpatcher version {version}")

    # if len(sys.argv) < 2:
    #     logging.error(f"No command given.")
    #     usage()
    #
    # command = sys.argv[1]
    # if command not in command_params.keys():
    #     logging.error(f"The command {command} is unknown.")
    #     usage()

    # global_params.update(command_params[command])
    options = interpret_all_params(1, global_params, interpret_param)
    if options is not None:
        if "transfer-dir" in options:
            transfer_dir = cfg.resolve_symbols(options["transfer-dir"])
    if not transfer_dir:
        transfer_dir = cfg.get_create_transfer_dir()

    if not check_transfer_dir(transfer_dir):
        usage()

    if command in required_params and not check_required_options(options, required_params[command]):
        usage()


    logging.info(f"Kiosk directory is {kiosk_dir}")
    logging.info(f"Transfer directory is {transfer_dir}")
    kiosk_patcher = KioskPatcher(cfg, transfer_dir)
    if kiosk_patcher.patch_file:
        rc = kiosk_patcher.apply_patch(running_during_startup=True)
        if rc[0]:
            print("patch successfully applied.")
        else:
            print(f"patch failed with {rc[1]}")
    else:
        print("No patch file present. Nothing to do.")
