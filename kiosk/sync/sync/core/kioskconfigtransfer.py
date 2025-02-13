import logging
import os
import shutil
import typing
from zipfile import ZipFile

import yaml

import kioskstdlib
from kioskstdlibbasics import resolve_symbols
from yamlconfigreader import YAMLConfigReader


class KioskConfigTransfer:
    # only the symbols %project_id% and %base_path% are allowed here!
    config_parts = [
        ["kiosk_config.yml", r"%base_path%\config", r"\kiosk\config", True],
        ["kiosk_secure.yml", r"%base_path%\config", r"\kiosk\config", True],
        ["**", r"%base_path%\custom\%project_id%", r"\kiosk\custom\kiosk_custom\%project_id%", True],
        ["**", r"%base_path%\sync\sync\custom", r"\kiosk\custom\sync_custom\%project_id%", False],
        ["*", r"%base_path%\reporting", r"\kiosk\reporting", False],
        ["**", r"%base_path%\config\kiosk_queries", r"\kiosk\config\kiosk_queries", False],
        ["DSD", r"%base_path%\config\dsd", r"\kiosk\config\dsd", False],
    ]

    def __init__(self, kiosk_dir, cfg):
        self._zip_path_and_filename = ""
        self.cfg = cfg
        self.kiosk_dir = kiosk_dir
        self.zip = None

    def check_local_system(self):
        rc = True
        for f in ["kiosk_config.yml", "kiosk_local_config.yml", "kiosk_secure.yml"]:
            if not os.path.exists(os.path.join(self.kiosk_dir, "config", f)):
                logging.error(f"{self.__class__.__name__}.check_local_system: {f} not found in existing system. "
                              f"That system does not seem to be compatible. It needs all three configuration files.")
                rc = False
        if not rc:
            return rc
        # is there more to check?
        return rc

    def open_zip(self, mode: typing.Literal['r', 'w', 'x', 'a']):
        if not self.zip:
            zip_path = kioskstdlib.get_file_path(self._zip_path_and_filename)
            if mode == "w":
                if not os.path.isdir(zip_path):
                    os.makedirs(self._zip_path_and_filename, exist_ok=True)
                if not os.path.isdir(zip_path):
                    logging.error(f"{self.__class__.__name__}.open_zip: Could not create path "
                                  f"{self._zip_path_and_filename}")
                    return None

                if os.path.isfile(self._zip_path_and_filename):
                    os.remove(self._zip_path_and_filename)
            self.zip = ZipFile(self._zip_path_and_filename, mode)
        return self.zip

    def close_zip(self):
        if self.zip:
            self.zip.close()
            self.zip = None

    def _do_skip_file(self, path_and_filename: str, suppress_dot_files=True):
        try:
            if kioskstdlib.get_filename(path_and_filename).startswith(".") and suppress_dot_files:
                logging.debug(f"{self.__class__.__name__}._do_skip_file: "
                              f"filename {path_and_filename} starts with a . -> skipped.")
                return True

            if os.path.islink(path_and_filename) or kioskstdlib.is_file_hidden(path_and_filename):
                logging.debug(f"{self.__class__.__name__}._do_skip_file: "
                              f"file {path_and_filename} is hidden -> skipped.")
                return True

            return False
        except BaseException as e:
            logging.error(
                f"{self.__class__.__name__}._do_skip_file: Exception when checking {path_and_filename}: {repr(e)}")
            raise e

    def copy_to_zip(self, src_path, src_file_name: str, dest_path: str, required=False):
        zip_file = self.open_zip("w")
        if not zip_file:
            return False
        path_and_filename = os.path.join(src_path, src_file_name)
        if self._do_skip_file(path_and_filename=path_and_filename, suppress_dot_files=False):
            return True

        if not os.path.isfile(path_and_filename):
            if required:
                logging.error(f"{self.__class__.__name__}.copy_to_zip: file {path_and_filename} "
                              f"is required but does not exist.")
                return False
            else:
                return True

        zip_file.write(path_and_filename, os.path.join(dest_path, src_file_name))
        return True

    def copy_dir_to_zip(self, src_path, dest_path, required=False, recursive=False):
        def r_copy_dir_to_zip(src_path: str, dest_path: str):
            sub_dirs = []
            if not os.path.isdir(src_path):
                return
            logging.info("searching directory " + src_path)
            # current_sub_dir_name = kioskstdlib.get_filename(kioskstdlib.trim_pathsep(src_path))
            content = [x for x in os.listdir(src_path) if not x.startswith(".")]
            for f in content:
                if os.path.isfile(os.path.join(src_path, f)):
                    if not self.copy_to_zip(src_path, f, dest_path):
                        return False
                else:
                    if f != "__pycache__":
                        sub_dirs.append(f)
            if recursive:
                for sub_dir in sub_dirs:
                    if not r_copy_dir_to_zip(os.path.join(src_path, sub_dir), os.path.join(dest_path, sub_dir)):
                        return False
            return True

        if not os.path.exists(src_path):
            if required:
                logging.error(f"{self.__class__.__name__}._copy_dir_to_zip: directory {dest_path} "
                              f"is required but does not exist.")
                return False

            return True
        return r_copy_dir_to_zip(src_path, dest_path)

    def copy_dsd_files(self, dest_path):
        dsd = self.cfg.get_dsdfile()
        if self.cfg.get_project_id() in dsd:
            logging.info(f"{self.__class__.__name__}.copy_dsd_files: including project DSD: {dsd}")
            return self.copy_to_zip(kioskstdlib.get_file_path(dsd), kioskstdlib.get_filename(dsd), dest_path, True)
        else:
            logging.info(f"{self.__class__.__name__}.copy_dsd_files: NOT including DSD: {dsd}")


    def export_to_zip(self, target_file: str):
        rc = False
        if self.check_local_system():
            self._zip_path_and_filename = target_file
            try:
                rc = True
                for cp in self.config_parts:
                    for index, _ in enumerate(cp):
                        cp[index] = self.cfg.resolve_symbols(cp[index])
                    if cp[0].startswith("*"):
                        if not self.copy_dir_to_zip(cp[1], cp[2], recursive=True if cp[0] == "**" else False):
                            rc = False
                            break
                    elif cp[0].lower() == "dsd":
                        if not self.copy_dsd_files(cp[2]):
                            rc = False
                            break
                    else:
                        if not self.copy_to_zip(cp[1], cp[0], cp[2], cp[3]):
                            rc = False
                            break
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.export : {repr(e)}")
            finally:
                self.close_zip()

        return rc

    def unzip_file(self, zip_path, file_name: str, dest_path: str, required=False):
        zip = self.open_zip("r")
        if zip:
            zip_element = os.path.join(zip_path, file_name).replace("\\", "/")
            if zip_element.startswith("/"):
                zip_element = zip_element[1:]
            try:
                info = zip.getinfo(zip_element)
                dest_path_and_filename = os.path.join(dest_path, file_name).replace("/", os.sep)
                with zip.open(info) as zip_stream:
                    with open(dest_path_and_filename, "wb") as out_file:
                        shutil.copyfileobj(zip_stream, out_file)
                logging.info(f"{self.__class__.__name__}.unzip_file: unzipped {dest_path_and_filename}")
                return True
            except KeyError as e:
                if required:
                    logging.error(f"{self.__class__.__name__}.unzip_file : {zip_element} does not exist in zip file")
                    return False
                else:
                    return True
            except BaseException as e:
                logging.error(
                    f"{self.__class__.__name__}.unzip_file: Exception when unpacking {zip_element} to {dest_path}: {repr(e)}")
        return False

    def unzip_dir(self, zip_dir, dest_path, recursive=False):
        dest_path = dest_path.replace("/", os.sep)
        zip = self.open_zip("r")
        if zip:
            zip_path = zip_dir.replace(os.sep, "/")
            if zip_path.startswith("/"):
                zip_path = zip_path[1:]
            try:
                if recursive:
                    # file_paths = [kioskstdlib.get_file_path(f.filename) for f in zip.infolist() ]
                    # print(file_paths)
                    files = [f for f in zip.infolist() if kioskstdlib.get_file_path(f.filename).startswith(zip_path)]
                else:
                    files = [f for f in zip.infolist() if kioskstdlib.get_file_path(f.filename).endswith(zip_path)]
                # print(files)

                rc = True
                for f in files:
                    if not f.is_dir():
                        relative_dest_path = (kioskstdlib.get_file_path(f.filename)
                                              .replace(zip_path, dest_path)
                                              .replace("/", os.sep))

                        if not os.path.isdir(relative_dest_path):
                            logging.info(f"{self.__class__.__name__}.unzip_dir: creating new directory "
                                         f"{relative_dest_path}")
                            os.makedirs(relative_dest_path, exist_ok=True)
                        if not self.unzip_file(kioskstdlib.get_file_path(f.filename),
                                               kioskstdlib.get_filename(f.filename), relative_dest_path):
                            rc = False
                            break
                return rc
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.unzip_dir: Exception when unpacking "
                              f"{zip_dir} to {dest_path}: {repr(e)}")
        return False

    def unzip_dsd_files(self, zip_dsd_path, dest):
        return self.unzip_dir(zip_dsd_path, dest ,recursive=False)

    def check_zip_config(self, project_id) -> bool:
        zip = self.open_zip("r")
        if zip:
            try:
                zip_element = "kiosk/config/kiosk_config.yml"
                try:
                    info = zip.getinfo(zip_element)
                    with zip.open(info) as zip_stream:
                        cfg_lines = zip_stream.read()
                    cfg = yaml.load(cfg_lines, Loader=yaml.BaseLoader)
                    zipped_project_id = cfg["config"]["project_id"]
                    if zipped_project_id == project_id:
                        return True
                    else:
                        logging.error(f"Project ID in zipped config ({zipped_project_id}) "
                                      f"does not match the --project_id parameter ({project_id}).")
                except BaseException as e:
                    logging.error(
                        f"{self.__class__.__name__}.check_zip_config: Exception when reading config file "
                        f"from zip: {repr(e)}")
            finally:
                self.close_zip()
        return False

    def import_from_zip(self, source_file: str, project_id: str, dest: str = ""):
        rc = False
        config_dict = {"project_id": project_id,
                       "base_path": self.cfg.base_path
                       }
        if self.check_local_system():
            self._zip_path_and_filename = source_file
            if not self.check_zip_config(project_id):
                return False

            try:
                rc = True
                for cp in self.config_parts:
                    for index, _ in enumerate(cp):
                        if isinstance(cp[index], str):
                            try:
                                # note: This is not using the local config to resolve symbols. The local config
                                # could potentially have a different project_id than the config that gets unzipped.
                                cp[index] = resolve_symbols(cp[index], config_dict, error_unknown_symbol=True)
                            except BaseException as e:
                                logging.error(f"{self.__class__.__name__}.import_from_zip: {repr(e)}")
                            if dest:
                                cp[index] = cp[index].replace(self.cfg.base_path, dest)

                    if cp[0].startswith("*"):
                        if not self.unzip_dir(cp[2], cp[1], recursive=True if cp[0] == "**" else False):
                            rc = False
                            break
                    elif cp[0].lower() == "dsd":
                        if not self.unzip_dsd_files(cp[2], cp[1]):
                            rc = False
                            break
                    else:
                        if not self.unzip_file(cp[2], cp[0], cp[1], cp[3]):
                            rc = False
                            break
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.import : {repr(e)}")
            finally:
                self.close_zip()

        return rc
