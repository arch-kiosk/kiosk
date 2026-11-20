# *********************************************************
#
# file_repository_analyze_cli.py
# Tool to analyze mainly the size of the file repository
#
# *********************************************************
import argparse
import logging
import os
import sys

from dsd.dsd3singleton import Dsd3Singleton
from filerepositoryanalyzer import FileRepositoryAnalyzer
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig
from tools.housekeepingcli import get_kiosk_base_path_from_test_path
from tools.kiosktoolslib import init_tool, is_kiosk_root


class VerboseParser(argparse.ArgumentParser):
    def error(self, message):
        self.print_help()
        print(f"\nERROR: {message}", file=sys.stderr)
        sys.exit(2)


def get_kiosk_dir():
    """Returns the default Kiosk directory if none is provided."""
    this_path = os.path.dirname(os.path.abspath(__file__))
    kiosk_dir = get_kiosk_base_path_from_test_path(this_path)
    return kiosk_dir




def main():
    parser = VerboseParser(description="Kiosk File Repository Analyze CLI")

    # Positional Argument
    parser.add_argument(
        "--kiosk-path",
        nargs="?",
        default="",
        help="Optional path to the Kiosk directory. If not given the tool will try to find the Kiosk root itself."
    )

    parser.add_argument(
        "--file",
        nargs="?",
        default="",
        help="optional output file. By default it is fr_analyze.json"
    )


    args = parser.parse_args()
    kiosk_dir = args.kiosk_path if args.kiosk_path else get_kiosk_dir()
    if not is_kiosk_root(kiosk_dir):
        parser.error(f"{kiosk_dir} is not a valid kiosk directory")

    config_file = os.path.join(kiosk_dir, "config", 'kiosk_config.yml')
    if not init_tool(config_file, logfile_prefix="fr_analyze_", log_level_console=logging.WARNING,
                     log_level_file=logging.DEBUG):
        parser.error("ERROR: Initialization failed.")
        exit(0)

    out_file = args.file if args.file else "fr_analyze.json"

    cfg = SyncConfig.get_config()

    fa = FileRepositoryAnalyzer(
        cfg
    )
    fa.run()
    fa.write_to_file(out_file)


if __name__ == "__main__":
    main()
