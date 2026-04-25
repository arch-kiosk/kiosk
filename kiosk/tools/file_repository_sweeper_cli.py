# *********************************************************
#
# file_repository_sweeper_cli.py
# Tool to clear up orphaned files from a file repository
# orphaned files are files that do not have a corresponding
# record in the files table.
#
# *********************************************************
import argparse
import logging
import os
import sys

from dsd.dsd3singleton import Dsd3Singleton
from filerepositorysweeper import FileRepositorySweeper
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig
from tools.housekeepingcli import get_kiosk_base_path_from_test_path
from tools.kiosktoolslib import init_tool, is_kiosk_root


class VerboseParser(argparse.ArgumentParser):
    def error(self, message):
        # 1. Print the full help (with all your help="" strings)
        self.print_help()
        # 2. Print the specific error message at the bottom
        print(f"\nERROR: {message}", file=sys.stderr)
        # 3. Exit so the script doesn't try to continue
        sys.exit(2)


def get_kiosk_dir():
    """Returns the default Kiosk directory if none is provided."""
    this_path = os.path.dirname(os.path.abspath(__file__))
    kiosk_dir = get_kiosk_base_path_from_test_path(this_path)
    return kiosk_dir




def main():
    parser = VerboseParser(description="Kiosk File Repository Sweeper CLI")

    # Positional Argument
    parser.add_argument(
        "--kiosk-path",
        nargs="?",
        default="",
        help="Optional path to the Kiosk directory. If not given the tool will try to find the Kiosk root itself."
    )

    # Flag Argument
    parser.add_argument(
        "--force-delete",
        action="store_true",
        help="Forcefully delete files during processing. Otherwise files will be moved to the history folder."
    )

    parser.add_argument(
        "--test-run",
        action="store_true",
        help="just run, don't do anything with the files"
    )

    parser.add_argument(
        "--small_file_repository",
        action="store_true",
        help="Run even on an empty or small file repository"
    )

    args = parser.parse_args()
    kiosk_dir = args.kiosk_path if args.kiosk_path else get_kiosk_dir()
    if not is_kiosk_root(kiosk_dir):
        parser.error(f"{kiosk_dir} is not a valid kiosk directory")

    config_file = os.path.join(kiosk_dir, "config", 'kiosk_config.yml')
    if not init_tool(config_file, logfile_prefix="fr_sweep_", log_level_console=logging.WARNING,
                     log_level_file=logging.DEBUG if args.test_run else logging.INFO):
        parser.error("ERROR: Initialization failed.")
        exit(0)

    cfg = SyncConfig.get_config()
    dsd = Dsd3Singleton.get_dsd3()
    assert dsd.append_file(cfg.dsdfile)

    # Initialize and run the sweeper
    sweeper = FileRepositorySweeper(
        target_path=cfg.get_file_repository(),
        dsd=dsd,
        cfg=cfg,
        force_delete=args.force_delete,
        test_run=args.test_run,
        small_file_repositories=args.small_file_repository
    )
    sweeper.run()


if __name__ == "__main__":
    main()
