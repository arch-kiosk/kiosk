import os
import argparse
import sys
import logging
from packdirectory import pack_directory

# These rules are enforced regardless of what is in the local .packignore files.
# Adding trailing slashes to directories triggers the high-speed pruning logic.


def main():
    parser = argparse.ArgumentParser(
        description="Pack a directory into a ZIP while respecting .packignore and mandatory rules."
    )

    parser.add_argument("source", help="The root directory to pack")
    parser.add_argument("output", help="The path for the resulting ZIP file")

    parser.add_argument(
        "--only",
        action="append",
        help="Limit packing to specific subdirectories (relative to current shell or absolute)"
    )

    parser.add_argument(
        "--include-empty",
        action="store_true",
        help="Include empty directories in the ZIP"
    )

    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Show debug logs (useful for seeing why files were ignored)"
    )

    args = parser.parse_args()

    # Logging setup
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format="%(levelname)s: %(message)s")

    # Path Normalization
    abs_source = os.path.abspath(args.source)
    abs_output = os.path.abspath(args.output)

    abs_limits = None
    if args.only:
        abs_limits = [os.path.abspath(d) for d in args.only]

    if not os.path.isdir(abs_source):
        print(f"Error: Source directory '{abs_source}' does not exist.")
        sys.exit(1)

    print(f"--- Starting Pack Operation ---")
    print(f"Source: {abs_source}")
    print(f"Output: {abs_output}")

    if abs_limits:
        # Just for display, show them as relative to the source
        rel_display = [os.path.relpath(d, abs_source) for d in abs_limits]
        print(f"Targeting specific subdirs: {', '.join(rel_display)}")

    try:
        # We pass our MANDATORY_RULES as the base_rules
        count = pack_directory(
            source_dir=abs_source,
            output_zip=abs_output,
            limit_to_dirs=abs_limits,
            include_empty=args.include_empty
        )
        print(f"Done! Packed {count} items.")
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()