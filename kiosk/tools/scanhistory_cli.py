import argparse
import csv
import logging
import os
import sys

# Assuming kioskstdlib is a custom or local module in your environment
import kioskstdlib
from sync_config import SyncConfig
from tools.kiosktoolslib import init_tool, get_kiosk_base_path_from_test_path


class VerboseParser(argparse.ArgumentParser):
    def error(self, message):
        # 1. Print the full help (with all your help="" strings)
        self.print_help()
        # 2. Print the specific error message at the bottom
        print(f"\nERROR: {message}", file=sys.stderr)
        # 3. Exit so the script doesn't try to continue
        sys.exit(2)


import csv
import os

# Assuming kioskstdlib is a custom or local module in your environment
import kioskstdlib


def parse_filename_to_iso(filename):
    """Splits the filename and converts date/time into an ISO timestamp.

    Returns (iso_timestamp, uuid) or (None, None) if invalid.
    """
    # 1. Strictly look for an extension at the end (e.g., .txt, .png)
    name_without_ext, ext = os.path.splitext(filename)
    if not ext:
        # Skip entirely if there is no file extension
        return None, None

    # 2. Split by underscore into 3 parts
    parts = name_without_ext.split("_", 2)
    if len(parts) != 3:
        return None, None

    date_part, time_part, uuid_part = parts

    # 3. Format the time_part (HHMMSS.mmmmmm) into HH:MM:SS.mmmmmm
    # Expected format length for HHMMSS.mmmmmm is 13 characters
    if len(time_part) >= 6 and "." in time_part:
        hh = time_part[0:2]
        mm = time_part[2:4]
        ss_ms = time_part[4:]  # Captures seconds and microseconds (e.g., 57.019367)
        formatted_time = f"{hh}:{mm}:{ss_ms}"
    else:
        # Fallback if time format is unexpectedly structured
        formatted_time = time_part

    # 4. Combine into an ISO 8601 timestamp
    iso_timestamp = f"{date_part}T{formatted_time}"

    return iso_timestamp, uuid_part


def scan_and_log_directory(target_directory, output_csv_path):
    # Updated CSV headers
    fields = ["timestamp", "uuid", "md5_hash"]

    print(f"Scanning directory: {target_directory}...")

    try:
        with open(
            output_csv_path, mode="w", newline="", encoding="utf-8"
        ) as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=fields)
            writer.writeheader()

            count = 0
            for filename in os.listdir(target_directory):
                full_path = os.path.join(target_directory, filename)

                if os.path.isfile(full_path):
                    # Parse and format
                    timestamp, uuid_part = parse_filename_to_iso(filename)

                    # If it failed parsing or didn't have an extension, skip it
                    if not timestamp or not uuid_part:
                        continue

                    try:
                        md5_hash = kioskstdlib.get_file_hash(full_path)
                    except Exception as e:
                        print(
                            f"\nError hashing file {filename}: {e}. Skipping.\n"
                        )
                        continue

                    writer.writerow(
                        {
                            "timestamp": timestamp,
                            "uuid": uuid_part,
                            "md5_hash": md5_hash,
                        }
                    )
                    count += 1
                    print(f"\r({count} done)", end="")

            print(
                f"\nSuccess! Processed {count} files. Results saved to '{output_csv_path}'."
            )

    except Exception as e:
        print(f"An error occurred: {e}")


# --- Configuration ---
TARGET_DIR = "./path_to_your_files"
OUTPUT_CSV = "./file_manifest.csv"

def get_kiosk_dir():
    """Returns the default Kiosk directory if none is provided."""
    this_path = os.path.dirname(os.path.abspath(__file__))
    kiosk_dir = get_kiosk_base_path_from_test_path(this_path)
    return kiosk_dir

# Run the script
if __name__ == "__main__":
    parser = VerboseParser(description="Kiosk History Directory Scanner. \n"
                                       "This scans the history directory in the file repository and creates a CSV file"
                                       "with the timestamp, the uuid and the md5 hash of the deleted file. \nCan be "
                                       "very helpful when deleting images that once were deleted and then made it back "
                                       "into Kiosk accidentally.")

    # Positional Argument
    parser.add_argument(
        "--kiosk-path",
        nargs="?",
        default="",
        help="Optional path to the Kiosk directory. If not given the tool will try to find the Kiosk root itself."
    )

    # Flag Argument

    args = parser.parse_args()
    kiosk_dir = args.kiosk_path if args.kiosk_path else get_kiosk_dir()
    config_file = os.path.join(kiosk_dir, "config", 'kiosk_config.yml')
    if not init_tool(config_file, logfile_prefix="hub_sweep_", log_level_console=logging.INFO,
                     log_level_file=logging.DEBUG if args.test_run else logging.INFO):
        parser.error("ERROR: Initialization failed.")
        exit(0)

    cfg = SyncConfig.get_config()

    history_path = os.path.join(cfg.get_file_repository(), "history")
    scan_and_log_directory(history_path, os.path.join(history_path, "history.csv"))