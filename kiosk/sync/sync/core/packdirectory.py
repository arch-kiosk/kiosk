# written by Gemini and LeChat together. They were giving each other hints and this came out
# In a few years I guess all I will do is tell them what I want and I just copy and paste.

import os
from typing import Callable, Optional, List

import pathspec
import zipfile
import logging

# Setup logging - change level to logging.DEBUG to see ignored files
logger = logging.getLogger("PackDirectory")

MANDATORY_RULES = [
    'node_modules/',
    '.git/',
    '.gitignore',
    '.DS_Store',
    '.*cache*',
    'Thumbs.db',
    '__pycache__/',
    '*.pyc',
    '.venv/',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    'venv/',
    '.cache/',         # Parcel/Babel/NPM cache
    '.parcel-cache/',  # Specific to Parcel bundler
    'tsbuildinfo',     # TypeScript incremental compilation info
    '*.tsbuildinfo',   # Glob for the same
    # Source Maps
    '*.css.map',  # Specific to CSS
    '*.js.map',  # Specific to JS
    # IDE / Editor Folders
    '.vscode/',  # VS Code settings
    '.idea/',  # JetBrains / IntelliJ settings
    '*.swp',  # Vim temporary swap files
    '*.swo',
    "qrcoderecognitiontests/",
    "kiosk_secure.yml",
    "kiosk_config.yml",
    "kiosk_local_config.yml",
    "secure.js"
]


class FileCollector:
    def __init__(self, source_dir: str, base_ignore_rules: Optional[List[str]] = None,
                 ignore_filename: str = ".packignore", on_log: Optional[Callable[[str], None]] = None):
        if base_ignore_rules is None:
            base_ignore_rules = MANDATORY_RULES
        self.source_dir = os.path.abspath(source_dir)
        self.base_rules = base_ignore_rules
        self.ignore_filename = ignore_filename
        self.on_log = on_log

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

    def collect_files(self, limit_to_dirs: Optional[List[str]] = None, include_empty_directories: bool = False):
        """Walks the tree (or specific subtrees/files) and filters via the global spec."""
        spec = self._build_global_spec()
        files_to_pack = []
        targets = [self.source_dir] if not limit_to_dirs else limit_to_dirs

        for target in targets:
            abs_target = os.path.abspath(target)

            # --- CALLBACK: Notify for every target being collected ---
            if self.on_log:
                self.on_log(f"collecting {abs_target}...")

            if os.path.commonpath([self.source_dir, abs_target]) != self.source_dir:
                logging.warning(f"Skipping target outside source_dir: {target}")
                continue

            if os.path.isfile(abs_target):
                rel_file = os.path.relpath(abs_target, self.source_dir).replace(os.sep, '/')
                is_ignored = spec.match_file(rel_file)
                if not is_ignored and os.path.basename(abs_target) != self.ignore_filename:
                    files_to_pack.append(rel_file)
                else:
                    logging.debug(f"Target file ignored by rules: {rel_file}")
                continue

            for root, dirs, files in os.walk(abs_target, topdown=True):
                rel_root = os.path.relpath(root, self.source_dir).replace(os.sep, '/')

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
                    except Exception:
                        continue

                files_to_pack.extend(valid_files_in_dir)

                if include_empty_directories and rel_root != ".":
                    if not dirs and not valid_files_in_dir:
                        files_to_pack.append(rel_root + '/')

        return sorted(list(set(files_to_pack)))


def pack_directory(source_dir: str, output_zip: str, limit_to_dirs: Optional[List[str]] = None,
                   base_rules: Optional[List[str]] = None, include_empty: bool = False,
                   on_log: Optional[Callable[[str], None]] = None):
    """
    Orchestrates collection and compression.
    If limit_to_dirs is used, logging is restricted to those specific base targets.
    """
    source_path = os.path.abspath(source_dir)
    output_path = os.path.abspath(output_zip)

    collector = FileCollector(source_path, base_ignore_rules=base_rules, on_log=on_log)
    file_list = collector.collect_files(
        limit_to_dirs=limit_to_dirs,
        include_empty_directories=include_empty
    )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Convert limit_to_dirs to absolute paths for comparison if they exist
    abs_limits = [os.path.abspath(p) for p in limit_to_dirs] if limit_to_dirs else []
    logged_targets = set()

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for rel in file_list:
            full_path = os.path.join(source_path, rel.replace('/', os.sep))

            # --- CALLBACK LOGIC ---
            if on_log:
                if abs_limits:
                    # If using limit_to, find which target this file belongs to
                    for target in abs_limits:
                        if full_path.startswith(target) and target not in logged_targets:
                            on_log(f"packing {target}...")
                            logged_targets.add(target)
                else:
                    # Standard behavior: log every new directory
                    current_dir = os.path.dirname(full_path)
                    if current_dir != last_logged_dir:
                        on_log(f"packing {current_dir}...")
                        last_logged_dir = current_dir

            try:
                if rel.endswith('/') or os.path.isdir(full_path):
                    zinfo = zipfile.ZipInfo(rel if rel.endswith('/') else rel + '/')
                    zipf.writestr(zinfo, '')
                else:
                    zipf.write(str(full_path), rel)
            except (PermissionError, OSError) as e:
                logger.error(f"Failed to pack {full_path}: {e}")

    return len(file_list)