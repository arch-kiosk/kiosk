import os
import argparse
import sys
import logging
from sync.core.packdirectory import pack_directory


def main():
    parser = argparse.ArgumentParser(
        description="Pack a directory into a ZIP while respecting .packignore rules."
    )

    # 1. Required: Source Directory
    parser.add_argument(
        "source",
        help="The root directory to pack (where .packignore lives)"
    )

    # 2. Required: Output Path
    parser.add_argument(
        "output",
        help="The path for the resulting ZIP file (e.g., backup.zip)"
    )

    # 3. Optional: Selective Packing
    parser.add_argument(
        "--only",
        action="append",
        help="Limit packing to specific subdirectories (can be used multiple times)"
    )

    # 4. Optional: Empty Directory Toggle
    parser.add_argument(
        "--include-empty",
        action="store_true",
        help="Include directories that are empty or contain only ignored files"
    )

    # 5. Optional: Verbosity
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Show ignored files and debug information"
    )

    args = parser.parse_args()

    # Configure Logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format="%(levelname)s: %(message)s")

    # --- Path Normalization ---
    # Convert everything to absolute paths so the FileCollector logic is rock solid
    abs_source = os.path.abspath(args.source)
    abs_output = os.path.abspath(args.output)

    abs_limits = None
    if args.only:
        # If user provides a relative path like "data/sub",
        # we join it with the CURRENT working directory first
        abs_limits = [os.path.abspath(d) for d in args.only]

    if not os.path.isdir(abs_source):
        print(f"Error: Source directory '{abs_source}' does not exist.")
        sys.exit(1)

    # --- Execution ---
    print(f"Scanning: {abs_source}")
    if abs_limits:
        print(f"Limiting to: {', '.join(args.only)}")

    try:
        count = pack_directory(
            source_dir=abs_source,
            output_zip=abs_output,
            limit_to_dirs=abs_limits,
            include_empty=args.include_empty
        )
        print(f"Successfully packed {count} items into '{abs_output}'.")
    except Exception as e:
        print(f"An error occurred during packing: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()