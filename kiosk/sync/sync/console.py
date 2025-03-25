import pprint
import sys

import kioskstdlib
from filemakerrecording.filemakerworkstation import FileMakerWorkstation
from qualitycontrol.qualitycontrol import QualityControl
from reportingdock import ReportingDock
from sync_config import SyncConfig
import logging
import pdb
import os

from os import path
from core.synchronization import Synchronization
from kiosksqldb import KioskSQLDb
from filerepository import FileRepository
from dsd.dsd3singleton import Dsd3Singleton

repl_test_mode = False
sync = None

py_path = os.path.dirname(os.path.abspath(__file__))
base_path = kioskstdlib.get_parent_dir(kioskstdlib.get_parent_dir(py_path))


def urap_help():
    print("sorry, there isn't much, yet:")
    print("-------------------------------------------------------")
    print("list_workstations() lists all workstations")
    print("delete_workstations() deletes all workstations.")
    print("""recreate_workstation_tables() deletes all the tables and \r       
                 recreates them on the basis of the current DSD.""")


def list_workstations():
    if sync:
        print("")
        print("type".ljust(20), "id".ljust(15), "description".ljust(25), "state".ljust(15))
        print("=" * 20, "=" * 15, "=" * 25, "=" * 15)
        for ws in sync.list_workstations():
            print(ws.__class__.__name__, ws.get_id().ljust(15), ws.get_description().ljust(25),
                  ws.get_state().ljust(15))
    else:
        print("Error: no sync object available.")
    print("")


def fork_all_workstations():
    if sync:
        print("")
        print("type".ljust(20), "id".ljust(15), "description".ljust(25), "state".ljust(15))
        print("=" * 20, "=" * 15, "=" * 25, "=" * 15)
        for ws in sync.list_workstations():
            print(ws.__class__.__name__, ws.get_id().ljust(15), ws.get_description().ljust(25),
                  ws.get_state().ljust(15))
    else:
        print("Error: no sync object available.")
    print("")


def delete_workstations():
    if sync:
        if input(
                "Are you sure you want to delete all the current workstations?  "
                "(type yup for yes)") == "yup":
            for ws in sync.list_workstations():
                print(f"deleting {ws.get_id()}...")
                if sync.delete_workstation(ws, False):
                    print("OK")
                else:
                    print(f"ERROR deleting workstation {ws.get_id()}")
    else:
        print("Error: no sync object available.")

    print("")


def recreate_workstation_tables():
    if sync:
        if input(
                "Are you sure you want to delete and recreate all the dsd tables of all the current workstations?  "
                "All data in the workstation tables will be lost! (type yup for yes)") == "yup":
            for ws in sync.list_workstations():
                print(f"recreating {ws.get_id()}...")

                if ws.get_state() != 'IDLE':
                    print(f"Sorry, but I don't recreate workstations in state {ws.get_state()}. They must be IDLE!")
                else:
                    if ws.__class__.__name__.endswith("FileMakerWorkstation"):
                        fm_ws: FileMakerWorkstation = ws
                        try:
                            fm_ws.create_dsd_tables()
                            print(f"{ws.get_id()} - OK")
                        except Exception as e:
                            print(f"ERROR recreating dsd tables for workstation {ws.get_id()}: {repr(e)}")
                    else:
                        print(f"ERROR recreating dsd tables for workstation {ws.get_id()}: "
                              f"Not a FileMakerWorkstation but a {ws.__class__}")
    else:
        print("Error: no sync object available.")

    print("")


def init():
    global repl_test_mode
    global sync
    # Initialize logging and settings
    print(chr(27) + "[2J")
    os.system('cls' if os.name == 'nt' else 'clear')
    logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    if ("test" in sys.argv) or repl_test_mode:
        config_file = r'.\test\config\urap_test_config.yml'
        prev_arg = ""
        for arg in sys.argv:
            if prev_arg == "test":
                if path.isfile(arg):
                    config_file = arg
            prev_arg = arg

        repl_test_mode = True
        cfg = SyncConfig.get_config({'config_file': config_file})
        if not cfg or not cfg.is_test_config():
            raise Exception(
                "\n! Testmode requested, but configuration file " + cfg.get_configfile() + " is not a test configuration (test_mode is not true!)\n")
        else:
            print("\n\ntest-config: " + cfg.get_configfile())
    else:
        cfg = SyncConfig.get_config(
            {'config_file': os.path.join(base_path, "config", "kiosk_config.yml")})
        if not cfg:
            raise Exception(f"! Configuration file is not accessible.\n")

        if cfg.is_test_config():
            raise Exception(
                "! Configuration file " + cfg.get_configfile() + " is a test configuration (test_mode is set to true!). " +
                "\n                   A test configuration is not allowed in regular mode.\n")

    if cfg.get_configfile():
        print("Using configuration in " + cfg.get_configfile())
    else:
        logging.warning("No configuration file given.")

    if cfg.get_logfile():
        print("Using logfile in " + cfg.get_logfile())
    else:
        print("Using no logfile")
    if not cfg.do_log_to_screen():
        logger.handlers = []
    if cfg.get_logfile():
        ch = logging.FileHandler(filename=cfg.get_logfile())
        ch.setLevel(logging.DEBUG)
        formatter = logging.Formatter('>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s')
        ch.setFormatter(formatter)
        logger.addHandler(ch)
        logger.info("--------------- Starting new log %s ------------ \n" % cfg.get_logfile())
    return cfg


# Main initialization
config = init()
# let's try to get a cursor
cur = KioskSQLDb.get_cursor()
if cur:
    print("\nConnected to: " + KioskSQLDb.get_connection_info())
else:
    raise Exception("\n Cannot establish a connection to the master database,")

sync = Synchronization()

if repl_test_mode:
    print("\nConsole running in test mode.")
print("\nlog level is " + config.log_level)
print("=" * 40)

file_repos = FileRepository(config, sync.events, sync.type_repository, sync)
dsd = Dsd3Singleton.get_dsd3()
dsd.append_file(config.get_dsdfile())
lst = dsd.list_tables()

print("\nsync object instantiated and ready. config object and dsd object ready, too. And you have a Cursor cur.")
print("\033[1muse urap_help() to get a command overview\n\033[0m")
if __name__ == "__main__":
    print("\nRunning as main python script")
    # ws: FileMakerWorkstation = sync.get_workstation("FileMakerWorkstation", "x1lk")
    # assert ws.exists()
    # ws.callback_progress = lambda x: True
    # ws.export()
    # KioskSQLDb.commit()
    from kioskpatcher import KioskPatcher
    p = KioskPatcher(config,config.get_transfer_dir()[1])
    p.id = "patch1"
    p.log_patch_installation(False, "this did not work", log_check_on_startup=True)
    p.log_patch_installation(False, "this still did not work", log_check_on_startup=True)
    p.id = "patch2"
    p.log_patch_installation(True, "this did work", log_check_on_startup=True)
    pprint.pprint(p.list_logged_patches())
    print("\ndone")
