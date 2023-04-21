import sys
import os
import shutil
import logging
import subprocess
import time
from typing import List, Callable, Union
from kioskconfig import KioskConfig
from os import path

import kioskstdlib
from datetime import datetime
import synchronization
import workstation


# noinspection PyBroadException
class KioskBackup:
    LIBRARY_PATHS = [
        # LK, 10/10/2021: we don't use those libraries anymore. Their code is integrated in the main code
        # if a library has to be included that does not get installed by pip install,
        # add it here like this (static path required):
        # r"C:\my_libraries\architecture\core\dist",
        r"tools\xtra_libraries",
    ]

    KIOSK_FILES = [
        r"api",
        r"config",
        r"core",
        r"plugins",
        r"static",
        r"templates",
        r"sqlalchemy_models",
        r"__init__.py",
        r"sync\sync\console.py",
        r"sync\sync\config",
        r"sync\sync\sync_plugins",
        r"sync\sync\core",
        r"sync\sync\mcpcore",
        r"sync\sync\tools\UrapCreateDSDFromFM.py",
        r"sync\sync\tools\migrate_kiosk_db.py",
        r"sync\sync\tools\UrapDatabaseIntegrity.py",
    ]

    KIOSK_CONFIG_ONLY_FILES = [
        r"config",
        r"sync\sync\config",
        r"sync\sync\tools",
    ]

    TOOLS_FILES = [
        [r"core", "kioskconfig.py"],
        [r"core", "kioskrestore.py"],
        [r"core", "kioskbackup.py"],
        [r"tools", "unpackkiosk.py"],
        [r"tools", "analyzefilerepository.py"],
        [r"tools", "packkiosk.py"],
        [r"tools", "update_default_kiosk_queries.py"],
        [r"sync\sync\core", "config.py"],
        [r"sync\sync\core", "dicttools.py"],
        [r"sync\sync\core", "yamlconfigreader.py"],
        [r"sync\sync\core", "logginglib.py"],
        [r"sync\sync\core", "sync_config.py"],
        [r"sync\sync\core", "kioskstdlib.py"],
        [r"sync\sync\core", "urapdatetimelib.py"],
        [r"sync\sync\core", "kioskrequirements.py"],
        [r"sync\sync\core", "kioskpiexif.py"],
    ]

    EXCLUDE_PIP_PACKAGES = [
        r"yappi"
    ]

    in_console = False
    backup_progress = None
    dest_backup_file = ""

    @classmethod
    def _print_if_console(cls, *args, **kwargs):
        if cls.in_console:
            print(*args, **kwargs)

    @classmethod
    def _abort(cls, *args):
        if cls.in_console:
            sys.exit(*args)
        else:
            raise InterruptedError

    @classmethod
    def _abort_with_error(cls, rc, msg):
        logging.error(msg)
        cls._report_progress(msg=msg)
        cls._abort(rc)

    @classmethod
    def set_progress_handler(cls, progress_handler):
        cls.backup_progress = progress_handler

    @classmethod
    def _report_progress(cls, progress_prc=0, msg=""):
        if cls.backup_progress:
            cls.backup_progress({"topic": "kiosk_backup",
                                 "progress": str(progress_prc),
                                 "extended_progress": msg
                                 })

    @classmethod
    def _zip_add_files(cls, working_directory, files, dst_file, zip_options: []):
        # f"-w{working_directory}",
        if zip_options:
            cmdline = ["7za.exe", "a", "-xr!__pycache__", "-xr!test", "-xr!.pytest*", "-xr!test", *zip_options,
                       dst_file,
                       ]
        else:
            cmdline = ["7za.exe", "a", "-xr!__pycache__", "-xr!test", "-xr!.pytest*", "-xr!test", dst_file, ]

        if files:
            cmdline.append(files)
        else:
            if not zip_options or " ".join(zip_options).find("-i") == -1:
                logging.error(f"zip_add_files: Neither files nor -i option given. Nothing added to {dst_file}.")
                return

        cls._print_if_console(cmdline)
        attempts = 0
        while attempts < 2:
            try:
                time.sleep(2 * (attempts + 1))
                rc = subprocess.run(cmdline, cwd=working_directory, stdout=subprocess.PIPE)
            except OSError as e:
                cls._abort_with_error(-1, f"Exception in zip_add_files: {repr(e)}")
                return False

            if rc.returncode != 0:
                cls._print_if_console(rc)
                attempts += 1
                if attempts == 2:
                    cls._abort_with_error(-1,
                                          f"_zip_add_files, subprocess.run returned "
                                          f"something other than 0: {rc.returncode}")
                    break
                else:
                    cls._print_if_console(f"_zip_add_files, subprocess.run returned "
                                          f"something other than 0: {rc.returncode}. Trying again.")
            else:
                break

        return True

    @classmethod
    def pack_kiosk(cls, config: KioskConfig, dst_dir, options=None):
        """

        :param config: Kioskconfig instance
        :param dst_dir: :str targetdir for backup
        :param options: a dict with these options:
        {'c' : something = backup code,
         'w': something = backup workstation files,
         'fr': something = backup file respository,
         'fd': date = if fr then backup everything since date fd,
         'ft': something = backup filemaker template file
        """
        path_dict = cls._assert_paths(config)
        kiosk_dir = path_dict["kiosk"]

        cls.assert_7zip()

        zips = []

        if "c" in options:
            zips.append([path.join(dst_dir, "kiosk.zip"),
                         cls.KIOSK_FILES,
                         kiosk_dir,
                         ["-xr!qrcoderecognitiontests", "-xr!node_modules", "-xr!.env.development.local",
                          "-xr!kiosk_secure.yml",
                          "-xr!kiosk_config.yml",
                          "-xr!secure.js", "-xr!*.fmp12"]])
            zips.append([path.join(dst_dir, "kiosk.zip"),
                         [
                             kioskstdlib.get_relative_path(kiosk_dir, config.custom_sync_modules),
                             kioskstdlib.get_relative_path(kiosk_dir, config.get_custom_kiosk_modules_path()),
                         ],
                         kiosk_dir,
                         None])
        else:
            zips.append([path.join(dst_dir, "kiosk.zip"),
                         cls.KIOSK_CONFIG_ONLY_FILES,
                         kiosk_dir,
                         ['-xr!qrcoderecognitiontests',
                          "-xr!kiosk_config.yml",
                          '-xr!kiosk_secure.yml']])

        if "w" in options:
            cls._add_workstation_files(config, dst_dir, zips)

        if "fr" in options:
            from_date = None
            if "fd" in options:
                from_date = options["fd"]

            cls._add_filerepository_files(config, dst_dir, zips, from_date)

        if "ft" in options:
            template_file = config.filemaker_template
            if not path.isfile(template_file):
                cls._abort_with_error(-1, "Option -ft: template file {template_file} does not exist")

            zips.append([path.join(dst_dir, "filemaker.zip"),
                         [template_file],
                         kiosk_dir,
                         None])

        cls._remove_old_zip_files(zips)

        for zip_set in zips:
            cls._zip_zip_set(path_dict, *zip_set)  # , zip_set[1], zip_set[2], zip_set[3]

    @classmethod
    def _assert_paths(cls, config):
        kiosk_dir = config.resolve_symbols(config.base_path)
        path_dict = {"kiosk": kiosk_dir,
                     "sync": config.resolve_symbols(config.config["sync"])}
        if not path.isdir(kiosk_dir):
            cls._abort_with_error(-1, f"Kiosk path cannot be resolved from Kiosk/base_path in {config.configfile}")

        cls._print_if_console(f"Kiosk base path is {kiosk_dir}")
        if not path.isdir(path_dict["sync"]):
            cls._abort_with_error(-1, f"Sync path cannot be resolved from config/sync in {config.configfile}")

        return path_dict

    @classmethod
    def assert_postgres(cls):
        rc = False
        try:
            rc = subprocess.run(f"psql -V")
        except BaseException:
            pass
        if not rc:
            cls._abort_with_error(0, "Postgres cannot be found. Please add it to the OS Path!")

    @classmethod
    def assert_7zip(cls):
        try:
            subprocess.run("7za.exe", stdout=subprocess.PIPE)
        except FileNotFoundError:
            cls._print_if_console("This tool needs an installed version of the 7zip command line tool 7za.exe.")
            cls._abort_with_error(-1, "The 7zip command line tool is not installed on the server.")

    @classmethod
    def _zip_zip_set(cls, path_dict, dst_file, tozip, working_directory, zip_options):
        if tozip:
            for z in tozip:
                s = kioskstdlib.resolve_symbols_in_string(z, path_dict)
                cls._print_if_console(f"Zipping {s} to {dst_file}")
                cls._report_progress(msg=f"Zipping {s} to {dst_file}")
                time.sleep(2)
                cls._zip_add_files(working_directory, s, dst_file, zip_options)
        else:
            cls._print_if_console(f"Zipping {dst_file}")
            cls._zip_add_files(working_directory, None, dst_file, zip_options)

    @classmethod
    def _remove_old_zip_files(cls, zips):
        dst_files = ([zip_set[0] for zip_set in zips])
        for dst_file in dst_files:
            if path.isfile(dst_file):
                cls._print_if_console(f"removing {dst_file}")
                os.remove(dst_file)

    @classmethod
    def _add_workstation_files(cls, config, dest_dir, zips):
        filemaker_path = path.commonprefix([config.filemaker_export_dir, config.filemaker_import_dir])
        sync = synchronization.Synchronization()
        fm_paths = []
        w: workstation.Workstation
        for w in sync.list_workstations():
            if w.get_state() in ["IN_THE_FIELD", "BACK_FROM_FIELD"]:
                p = path.join(config.filemaker_export_dir, w.get_id())
                if path.isdir(p):
                    fm_paths.append(kioskstdlib.get_relative_path(filemaker_path, p))
                if w.get_state() in ["BACK_FROM_FIELD"]:
                    p = path.join(config.filemaker_import_dir, w.get_id())
                    if path.isdir(p):
                        fm_paths.append(kioskstdlib.get_relative_path(p, filemaker_path))
                else:
                    cls._print_if_console(
                        f"Option -w: Workstation {w.get_id()} in state {w.get_state()} -> import-dir skipped.")
            else:
                cls._print_if_console(f"Option -w: Workstation {w.get_id()} in state {w.get_state()} -> skipped.")

        if len(fm_paths) > 0:
            zips.append([path.join(dest_dir, "filemaker.zip"),
                         fm_paths,
                         filemaker_path,
                         "-xr!files"])
        else:
            logging.warning(f"Option -w: No workstation directories found")

    @classmethod
    def _create_file_list(cls, file_repository_path, dest_dir, from_date):
        files = (os.path.join(file_repository_path, fn) for fn in os.listdir(file_repository_path))
        files = [filepath for filepath in files if os.path.isfile(filepath)
                 and datetime.fromtimestamp(os.path.getctime(filepath)) >= from_date]

        if len(files) > 0:
            file_list_filename = ""
            if len(files) < 1000:
                file_list_filename = os.path.join(dest_dir, "files_to_pack")
                with open(file_list_filename, "w") as text_file:
                    for file in files:
                        text_file.write(f"{file}\n")
            else:
                cls._abort_with_error(-1, f"Too many files found in {file_repository_path}: {len(files)} files.")

            cls._print_if_console(f"Option fd: {len(files)} files found.")

            return file_list_filename
        else:
            return None

    @classmethod
    def _add_filerepository_files(cls, config, dest_dir, zips, from_date):
        file_repository_path = config.file_repository
        file_list_filename = None
        if from_date:
            file_list_filename = cls._create_file_list(file_repository_path, dest_dir, from_date)
            if file_list_filename:
                zips.append([path.join(dest_dir, "filerepository.zip"),
                             [],
                             file_repository_path,
                             f"-ir-@{file_list_filename}"])
            else:
                logging.error("Option fd: No files to pack. filerepository skipped.")
        else:
            zips.append([path.join(dest_dir, "filerepository.zip"),
                         [os.path.join(file_repository_path, "*.*")],
                         file_repository_path,
                         "-r-"])

        return file_list_filename

    @classmethod
    def backup_database(cls, config, dest_dir, filename_template="", native_format=False):
        cls.assert_postgres()

        cls.dest_backup_file = ""
        pgpassfile = None
        try:
            cls._report_progress(msg="backup of database")
            if native_format:
                parameters = "--no-owner --no-privileges -Fc -w"
            else:
                parameters = "--no-owner --no-privileges -Fp -w"

            user_id = config.database_usr_name
            user_pwd = config.database_usr_pwd
            db_name = config.database_name
            try:
                filename_template = kioskstdlib.get_datetime_template_filename(filename_template, datetime.now())
            except ValueError as e:
                logging.warning(f"kioskstdlib.backup_database: {filename_template} "
                                f"is not a valid template name for the backup file. Using default template instead")
                filename_template = kioskstdlib.get_datetime_template_filename("kiosk_#a_#d#m#y-#H#M.dmp",
                                                                               datetime.now())

            logging.debug(f"kioskstdlib.backup_database: template is {filename_template}")

            if filename_template == "":
                dest_file = path.join(dest_dir, "dbbackup.dmp")
            else:
                dest_file = path.join(dest_dir, filename_template)

            pgpassfile = path.join(dest_dir, "pgpass.conf")
            cls._print_if_console(f"using passfile: {pgpassfile}")
            with open(pgpassfile, "w") as f:
                f.write(f"*:*:*:{user_id}:{user_pwd}")
            os.environ["PGPASSFILE"] = pgpassfile

            if path.isfile(dest_file):
                os.remove(dest_file)
            cls._print_if_console(f"backing up database to {dest_file}...", end="", flush=True)
            rc = subprocess.run(f"pg_dump {parameters} --username={user_id} "
                                f"--dbname={db_name} --file={dest_file}", stdout=subprocess.PIPE)

            sys.stdout.flush()
            if rc.returncode == 0:
                cls.dest_backup_file = dest_file
                cls._print_if_console(f"ok:", flush=True)
            else:
                raise Exception(f"pg_dump returned error {str(rc)}")

            rc = True
        except BaseException as e:
            cls._abort_with_error(-1, f"Exception in backup_database: {repr(e)}")
            rc = False

        try:
            if pgpassfile:
                os.remove(pgpassfile)
        finally:
            if not rc:
                cls._abort(-1)

    @classmethod
    def copy_tools(cls, kiosk_dir, dest_dir):
        unpackkiosk_dst_dir = path.join(dest_dir, "unpackkiosk")
        cls._print_if_console(f"copying unpack tools to {unpackkiosk_dst_dir} ... ", end="", flush=True)
        if not path.isdir(unpackkiosk_dst_dir):
            os.mkdir(unpackkiosk_dst_dir)

        for f in cls.TOOLS_FILES:
            shutil.copyfile(path.join(kiosk_dir, f"{f[0]}", f"{f[1]}"), path.join(unpackkiosk_dst_dir, f"{f[1]}"))

        # for f in LIB_FILES:
        #     shutil.copyfile(path.join(f[0], f[1]), path.join(unpackkiosk_dst_dir, f"{f[1]}"))

        cls._print_if_console(f"ok", flush=True)

    @classmethod
    def _get_libraries(cls, kiosk_dir):
        libraries = []
        for lib_path in cls.LIBRARY_PATHS:
            if not path.isdir(lib_path):
                lib_path = os.path.join(kiosk_dir, lib_path)
            if path.isdir(lib_path):
                files = None
                new_libs = None
                for (dirpath, dirnames, filenames) in os.walk(lib_path):
                    files = filenames
                    break
                if files:
                    new_libs = [path.join(lib_path, f)
                                for f in files if kioskstdlib.get_file_extension(f).lower() == "gz"]
                else:
                    logging.warning(
                        f"get_libraries: {lib_path} does not contain any files at all! Packkiosk proceeds...")

                if new_libs:
                    # if len(new_libs) > 1:
                    #     logging.warning(f"get_libraries: There are {len(new_libs)} "
                    #                     f"libraries in {lib_path} instead of just one! "
                    #                     f"Proceeding with both of them...")
                    libraries.extend(new_libs)
                else:
                    logging.warning(f"get_libraries: {lib_path} does not contain any libraries! Packkiosk proceeds...")
            else:
                cls._abort_with_error(-1, f"get_libraries: Library path {lib_path} does not exist or isn't a path.")

        return libraries

    @classmethod
    def copy_libraries(cls, dest_dir, kiosk_dir):
        lib_dst_dir = path.join(dest_dir, "libraries")
        if path.isdir(lib_dst_dir):
            kioskstdlib.remove_files_in_directory(folder=lib_dst_dir, remove_sub_dirs=True)
        else:
            os.mkdir(lib_dst_dir)

        libraries = cls._get_libraries(kiosk_dir=kiosk_dir)
        if libraries:
            cls._print_if_console(f"copying libraries to {lib_dst_dir} ... ", end="", flush=True)

            for f in libraries:
                lib_file_name = kioskstdlib.get_filename(f)
                shutil.copyfile(f, path.join(lib_dst_dir, lib_file_name))

            cls._print_if_console(f"ok", flush=True)
        else:
            cls._print_if_console(f"no libraries defined ... ok", flush=True)

    @classmethod
    def copy_file_repository_to_path(cls, config,
                                     dest_path) -> int:
        """
        copies the file repository to a different directory. Only adds modified and new files to that directory.
        :param config: SyncConfig
        :param dest_path: the destination directory
        :return: -1: failed
                 otherwise: Number of files that were actually copied.
        """
        src_path = config.get_file_repository()
        if not os.path.isdir(src_path):
            logging.error(f"{cls.__name__}.copy_file_repository_to_path: {src_path} does not point to "
                          f"an existing file repository")
            return -1

        if not os.path.isdir(dest_path):
            try:
                os.mkdir(dest_path)
            except BaseException as e:
                logging.error(f"{cls.__name__}.copy_file_repository_to_path: Error creating file repository "
                              f"in {dest_path}: {repr(e)}")
                return -1

        ignore_directories = ['cache', 'history', 'temp']
        try:
            files_copied = kioskstdlib.copytree(src_path, dest_path, True, True, ignore=ignore_directories,
                                                _on_progress=cls.backup_progress)
            logging.info(f"{cls.__name__}.copy_file_repository_to_path: {files_copied} files had to be copied. ")
            return files_copied
        except InterruptedError:
            return -1
        except BaseException as e:
            logging.error(f"{cls.__name__}.copy_file_repository_to_path: Error copying files to "
                          f"{dest_path}: {repr(e)}")
            return -1
