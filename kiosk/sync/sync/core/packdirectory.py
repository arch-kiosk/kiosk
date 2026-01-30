# written by Gemini and LeChat together. They were giving each other hints and this came out
# In a few years I guess all I will do is tell them what I want and I just copy and paste.

import os
import pathspec
import zipfile
import logging

# Setup logging - change level to logging.DEBUG to see ignored files
logger = logging.getLogger("PackDirectory")


class FileCollector:
    def __init__(self, source_dir, base_ignore_rules=None, ignore_filename=".packignore"):
        self.source_dir = os.path.abspath(source_dir)
        self.base_rules = base_ignore_rules or []
        self.ignore_filename = ignore_filename

    def _build_global_spec(self):
        """Collects all rules and anchors them correctly to the source_dir."""
        global_rules = list(self.base_rules)
        for root, _, filenames in os.walk(self.source_dir):
            if self.ignore_filename in filenames:
                # Calculate relative path and normalize slashes for pathspec
                rel_prefix = os.path.relpath(root, self.source_dir).replace(os.sep, '/')

                ignore_path = os.path.join(root, self.ignore_filename)
                with open(ignore_path, 'r', encoding='utf-8', errors='replace') as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith('#'):
                            continue

                        is_negation = line.startswith('!')
                        pattern = line[1:] if is_negation else line

                        if rel_prefix == ".":
                            global_rules.append(line)
                        else:
                            # If rule is anchored locally (starts with /), keep it anchored
                            if pattern.startswith('/'):
                                anchored = f"{rel_prefix}{pattern}"
                            else:
                                anchored = f"{rel_prefix}/{pattern}"

                            global_rules.append(f"!{anchored}" if is_negation else anchored)

        return pathspec.PathSpec.from_lines('gitwildmatch', global_rules)

    def collect_files(self, limit_to_dirs=None, include_empty_directories=False):
        """Walks the tree (or specific subtrees) and filters via the global spec."""
        spec = self._build_global_spec()
        files_to_pack = []

        # Determine where to start the walk
        targets = [self.source_dir] if not limit_to_dirs else limit_to_dirs

        for target in targets:
            abs_target = os.path.abspath(target)

            # Security: Don't walk outside the source_dir
            if os.path.commonpath([self.source_dir, abs_target]) != self.source_dir:
                logger.warning(f"Skipping target outside source_dir: {target}")
                continue

            for root, dirs, files in os.walk(abs_target, topdown=True):
                rel_root = os.path.relpath(root, self.source_dir).replace(os.sep, '/')

                # 1. Prune ignored directories immediately (dirs[:] mutation)
                # Use trailing slash to force directory matching in pathspec
                dirs[:] = [
                    d for d in dirs
                    if not spec.match_file((f"{rel_root}/{d}" if rel_root != "." else d) + '/')
                ]

                valid_files_in_dir = []
                for f in files:
                    if f == self.ignore_filename:
                        continue

                    rel_file = f if rel_root == "." else f"{rel_root}/{f}"

                    try:
                        if not spec.match_file(rel_file):
                            valid_files_in_dir.append(rel_file)
                        else:
                            logger.debug(f"Ignored: {rel_file}")
                    except Exception as e:
                        logger.error(f"Error checking {rel_file}: {e}")

                files_to_pack.extend(valid_files_in_dir)

                # 2. Handle empty directories
                if include_empty_directories and rel_root != ".":
                    if not dirs and not valid_files_in_dir:
                        files_to_pack.append(rel_root + '/')

        # set() handles overlapping paths if limit_to_dirs has redundancy
        return sorted(list(set(files_to_pack)))


def pack_directory(source_dir, output_zip, limit_to_dirs=None, base_rules=None, include_empty=False):
    """Orchestrates collection and zip creation."""
    source_path = os.path.abspath(source_dir)
    output_path = os.path.abspath(output_zip)

    collector = FileCollector(source_path, base_ignore_rules=base_rules)
    file_list = collector.collect_files(
        limit_to_dirs=limit_to_dirs,
        include_empty_directories=include_empty
    )

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for rel in file_list:
            # Reconstruct local path for reading
            full_path = os.path.join(source_path, rel.replace('/', os.sep))

            try:
                # Defensive check: is it actually a directory?
                if rel.endswith('/') or os.path.isdir(full_path):
                    # Add directory entry to ZIP
                    zinfo = zipfile.ZipInfo(rel if rel.endswith('/') else rel + '/')
                    zipf.writestr(zinfo, '')
                else:
                    zipf.write(full_path, rel)
            except (PermissionError, OSError) as e:
                logger.error(f"Failed to pack {full_path}: {e}")

    return len(file_list)