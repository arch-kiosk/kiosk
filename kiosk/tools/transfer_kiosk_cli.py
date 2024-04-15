import json
import logging
import os
import sys
import kioskstdlib
import datetime
from kioskconfig import KioskConfig
from kiosktoolslib import get_kiosk_base_path_from_test_path, init_tool, interpret_all_params, check_required_options, \
    split_param, get_kiosk_dir_param, init_dsd
from kiosksqldb import KioskSQLDb
from transferkiosk import TransferKiosk

global_params = {"--kiosk-dir": "kiosk-dir",
                 "-?": "?",
                 "--help": "?",
                 }

command_params = {
    "cat": {
        "--target-dir": "target-dir"
    },
    "create-files-delta": {
        "--target-catalog": "target-catalog",
        "--source-catalog": "source-catalog",
        "--delta-file": "delta-file"
    },
    "pack-delta": {
        "--delta-file": "delta-file",
        "--target-dir": "target-dir",
        "--fake": "fake",
        "--tolerated-errors": "tolerated-errors"
    },
    "unpack": {
        "--source-dir": "source-dir",
        "--file-repository": "file-repository"
    }
}

required_params = {
    "cat": ["target-dir"],
    "create-files-delta": ["delta-file"],
    "pack-delta": ["delta-file", "target-dir"],
    "unpack": ["source-dir"]
}

options = {}
command = ""


def usage():
    print("""
    Usage of transfer_kiosk_cli.py:
    ===================
      transfer_kiosk_cli command [command-specific parameters][--kiosk-dir]    
      <kiosk-dir> points to the local kiosk base directory on which to perform the command. 
        If omitted transfer_kiosk expects to run in a subdirectory of kiosk and will try to find the kiosk root. 

      commands and their parameters: 
        cat --target-dir=target directory
            creates information about the file repository of the source machine 
            that can be used to run "create-files-delta" on the target machine             

            target-dir: the directory in which the result will be stored. The result must be transferred to the source
                        for the next step  
        create-files-delta --delta-file=<delta file> 
                           --target-catalog=<target catalog file> | --source_catalog=<source catalog file>
            finds the difference between two file repositories and stores it in a delta file 
 
            target-catalog: the catalog of the target server. Means that we are transferring from this server TO another  
            source-catalog: the catalog of the source server. Means that we are transferring FROM that source server
            delta-file: path and filename of the resulting delta information
        pack-delta --delta-file=<delta file file> --target-dir=<target directory> [--fake] 
                   [--tolerated-errors=number of tolerated errors]
            packs all files that are listed in the delta file from the current kiosk into zip files 
 
            delta-file: path and filename of the delta
            target-dir: the directory where the zip files will be stored.
            fake: if present, no actual files will be copied, only fake textfiles will be zipped. For testing purposes.
            tolerated-errors: acceptable number of missing source files while packing 
        unpack --source-dir=<dir with zips> [--file-repository=<path to the file repository>]
            unpacks all the zip files in the source-dir into the file repository. Attention: This does not check again
            if the files are actually newer! The tool trusts that the zip file is the result of the preceding steps.
            
            source-dir: The directory with the zip file
            file-repository: Optional. The file repository path if you want to extract the files to a different place.
    """)
    sys.exit(0)


def interpret_param(known_param, param):
    new_option = global_params[known_param]

    if new_option in ["target-dir", "td", "target-catalog", "source-catalog", "delta-file", "source-dir",
                      "file-repository", "tolerated-errors"]:
        rc = split_param(new_option, param)
    else:
        rc = {new_option: None}

    return rc


def cat():
    if not transfer_kiosk.cat(options["target-dir"]):
        usage()


def create_files_delta():
    target_catalog = kioskstdlib.try_get_dict_entry(options, "target-catalog", "")
    source_catalog = kioskstdlib.try_get_dict_entry(options, "source-catalog", "")
    if not transfer_kiosk.create_files_delta(target_catalog, source_catalog):
        usage()
    print(f"Saving files delta as {options['delta-file']} ... ", end="")
    transfer_kiosk.delta2file(options["delta-file"])
    print(f"okay.")


def pack_delta():
    print(f"Load files delta {options['delta-file']} ... ", end="")
    if transfer_kiosk.file2delta(options["delta-file"]):
        print(f"okay")
        if "tolerated-errors" in options:
            tolerated_errors = int(options["tolerated-errors"])
        else:
            tolerated_errors = 0
        transfer_kiosk.set_progress_handler(lambda prg: True)
        transfer_kiosk.pack_delta(options['target-dir'], fake_it=True if "fake" in options else False,
                                  max_errors=tolerated_errors)


def unpack():
    transfer_kiosk.unpack(options["source-dir"], options["file-repository"] if "file-repository" in options else "")


def run_command():
    if command == "cat":
        cat()
    if command == "create-files-delta":
        create_files_delta()
    if command == "pack-delta":
        pack_delta()
    if command == "unpack":
        unpack()


if __name__ == '__main__':
    this_path = os.path.dirname(os.path.abspath(__file__))
    kiosk_dir = get_kiosk_dir_param(2, {"--kiosk-dir"})
    if kiosk_dir is None:
        kiosk_dir = get_kiosk_base_path_from_test_path(this_path)
    if not init_tool(os.path.join(kiosk_dir, "config", 'kiosk_config.yml')):
        usage()

    cfg = KioskConfig.get_config()
    cfg.truncate_log()

    if len(sys.argv) < 2:
        logging.error(f"No command given.")
        usage()

    command = sys.argv[1]
    if command not in command_params.keys():
        logging.error(f"The command {command} is unknown.")
        usage()

    global_params.update(command_params[command])
    options = interpret_all_params(2, global_params, interpret_param)
    if options is None:
        usage()

    if command in required_params and not check_required_options(options, required_params[command]):
        usage()

    print(f"Kiosk Directory is {kiosk_dir}")
    transfer_kiosk = TransferKiosk(cfg)
    transfer_kiosk.enable_console = True
    run_command()
