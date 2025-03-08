import datetime
import logging
import os
import sys
from copy import copy
from typing import Tuple

import yaml

import kioskstdlib
import yamlconfigreader
from kioskconfig import KioskConfig
import subprocess

CURRENT_PATCH_FILE_VERSION = 0.3

ESC_RED = "\u001b[31m"
ESC_GREEN = "\u001b[32;1m"
ESC_YELLOW = "\u001b[33;1m"
ESC_RESET = "\u001b[0m"


# noinspection PyBroadException
class KioskPatcher:
    def __init__(self, cfg: KioskConfig, transfer_dir: str, patch_file=None):
        self.kiosk_version = ""
        try:
            import kioskversion
            self.kiosk_version = kioskversion.kiosk_version
        except BaseException as e:
            logging.info(f"{self.__class__.__name__}.__init__: Can't import kioskversion module. "
                         f"This might be an older Kiosk, so let's try something else... ({repr(e)})")
            try:
                import kioskglobals
                self.kiosk_version = kioskglobals.kiosk_version
                del sys.modules["kioskglobals"]
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.__init__: Exception when importing kiosk_version: {repr(e)}. "
                              f"Trying to carry on")
        if not self.kiosk_version:
            logging.error("Can't find out what version this Kiosk is. That might become a problem later ...")
        else:
            logging.info(f"Patching Kiosk of version {self.kiosk_version}...")

        self.id = ""
        self.transfer_dir = transfer_dir
        self.cfg = cfg
        try:
            self.development = copy(cfg["development"])
        except KeyError as e:
            self.development = {}
        self.patch_path_and_filename = os.path.join(transfer_dir, 'patch.yml')
        self.patch_file = {}
        if patch_file:
            self.patch_file = patch_file
        else:
            self.read_patch_file()

    def read_patch_file(self, patch_file=None) -> Tuple[bool, str]:
        try:
            if not patch_file:
                patch_file = yamlconfigreader.YAMLConfigReader(self.patch_path_and_filename).read_file(
                    self.patch_path_and_filename)
            version = float(str(patch_file['header']['version']))
            if version > CURRENT_PATCH_FILE_VERSION or version < 0.3:
                err_msg = f"{self.__class__.__name__}.read_patch_file: " \
                          f"Patch file version of {self.patch_path_and_filename} is {version}, " \
                          f"expected was max {CURRENT_PATCH_FILE_VERSION}"
                logging.error(err_msg)
                return False, err_msg
            self.id = patch_file['patch']['id']
            self.patch_file = patch_file
            return True, ""
        except FileNotFoundError:
            return False, "No patch file present."
        except BaseException as e:
            err_msg = (f"{self.__class__.__name__}.read_patch_file: Error when opening {self.patch_path_and_filename}:"
                       f" {repr(e)}")
            logging.error(err_msg)
            return False, err_msg

    def _assert_patch_file(self):
        if not self.id or not self.patch_file:
            raise "No valid patch file was opened."

    def _check_max_version(self):
        try:
            max_version = kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'resulting_kiosk_version', '')
            if max_version:
                if not self.kiosk_version:
                    return "False", "Cannot patch this Kiosk because I can't figure out its version."
                if kioskstdlib.cmp_semantic_version(self.kiosk_version, max_version) > -1:
                    err_msg = f"{self.__class__.__name__}.patch_can_run: " \
                              f"Patch {self.id} lifts kiosk to version {max_version}, " \
                              f"But Kiosk is already on version {self.kiosk_version}."
                    logging.error(err_msg)
                    return False, err_msg
                else:
                    logging.info(f"{self.__class__.__name__}.patch_can_run: Patch {self.id} "
                                 f"will set Kiosk to version {max_version}")
            else:
                logging.info(f"{self.__class__.__name__}.patch_can_run: Patch {self.id} "
                             f"will not set Kiosk version.")
            return True, ""
        except BaseException as e:
            err_msg = (f"{self.__class__.__name__}.patch_can_run: Error when "
                       f"checking patch and Kiosk version: {repr(e)}")
            logging.error(err_msg)
            return False, err_msg

    def _check_min_version(self):
        try:
            min_version = kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'min_kiosk_version', '')
            if min_version:
                if not self.kiosk_version:
                    return "False", "Cannot patch this Kiosk because I can't figure out its version."
                if kioskstdlib.cmp_semantic_version(min_version, self.kiosk_version) > 0:
                    err_msg = f"{self.__class__.__name__}.patch_can_run: " \
                              f"Patch {self.id} expects kiosk to be at least version {min_version}, " \
                              f"but Kiosk is on version {self.kiosk_version}."
                    logging.error(err_msg)
                    return False, err_msg
            else:
                logging.info(f"{self.__class__.__name__}.patch_can_run: Patch {self.id} "
                             f"requires no minimum Kiosk version.")
            return True, ""
        except BaseException as e:
            err_msg = (f"{self.__class__.__name__}.patch_can_run: Error when "
                       f"checking patch and minimum kiosk version: {repr(e)}")
            logging.error(err_msg)
            return False, err_msg

    def _check_required_version(self):
        try:
            required_version = kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'required_kiosk_version', '')
            if required_version:
                if not self.kiosk_version:
                    return "False", "Cannot patch this Kiosk because I can't figure out its version."
                if kioskstdlib.cmp_semantic_version(required_version, self.kiosk_version) != 0:
                    err_msg = f"{self.__class__.__name__}.patch_can_run: " \
                              f"Patch {self.id} requires Kiosk at exactly version {required_version}, " \
                              f"but Kiosk is on version {self.kiosk_version}."
                    logging.error(err_msg)
                    return False, err_msg
            else:
                logging.info(f"{self.__class__.__name__}.patch_can_run: Patch {self.id} "
                             f"requires no exact Kiosk version.")
            return True, ""
        except BaseException as e:
            err_msg = (f"{self.__class__.__name__}.patch_can_run: Error when "
                       f"checking patch and required kiosk version: {repr(e)}")
            logging.error(err_msg)
            return False, err_msg

    def patch_can_run(self) -> Tuple[bool, str]:
        try:
            self._assert_patch_file()
            rc, msg = self._check_max_version()
            if not rc:
                return rc, msg
            rc, msg = self._check_min_version()
            if not rc:
                return rc, msg
            rc, msg = self._check_required_version()
            if not rc:
                return rc, msg

            return True, ""

        except BaseException as e:
            err_msg = (f"{self.__class__.__name__}.patch_can_run: Error when "
                       f"checking if the patch can be applied: {repr(e)}")
            logging.error(err_msg)
            return False, err_msg

    def needs_restart(self) -> bool:
        """
        Checks if either needs_restart or unpackkiosk are set to true
        :return: bool
        """

        self._assert_patch_file()
        return (
                kioskstdlib.to_bool(
                    kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'needs_restart', 'True'))
                or kioskstdlib.to_bool(
                    kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'unpackkiosk', 'False'))
        )

    def is_close_mcp_requested(self):
        self._assert_patch_file()
        return kioskstdlib.to_bool(kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'close_mcp', 'False'))

    def apply_patch(self, running_during_startup=None) -> Tuple[bool, str]:
        """
        This assumes that neither the Kiosk server nor MCP are running
        or that it does not matter for this patch.
        :param running_during_startup: set this to True if apply_patch is triggered by a command line
               process outside of a Kiosk module. That way you make sure that Kiosk will show messages after a restart.
               Set this explicitly to False to suppress these messages. If None, apply_patch takes an educated guess.
        :return: tuple of bool result and if false an error message
        """
        self._assert_patch_file()
        logging.info(f"{self.__class__.__name__}.apply_patch starts")
        script = kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'start_script', '')
        rc = True
        msg = ""

        if script:
            try:
                rc, msg = self.start_script(script)
                if not rc:
                    logging.error(
                        f"{self.__class__.__name__}.apply_patch: The script {script} returned with an error: {msg}")
                    # return False, msg
            except BaseException as e:
                logging.error(f"{self.__class__.__name__}.apply_patch: {repr(e)}")
                rc = False
                msg = repr(e)

        if rc:
            run_unpackkiosk = kioskstdlib.to_bool(
                kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'unpackkiosk', 'False'))
            if run_unpackkiosk:
                try:
                    rc, msg = self.run_unpackkiosk()
                    # if not rc[0]:
                    #     return rc
                except BaseException as e:
                    logging.error(f"{self.__class__.__name__}.apply_patch: {repr(e)}")
                    rc = False
                    msg = repr(e)

        self.log_patch_installation(rc, msg, running_during_startup)
        try:
            if rc and kioskstdlib.file_exists(self.patch_path_and_filename):
                os.remove(self.patch_path_and_filename)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.apply_patch: Noncritical Exception for patch {self.id} "
                          f"when deleting patch.yml: {repr(e)}")
        return rc, msg

    def log_patch_installation(self, success: bool, error_message: str, log_check_on_startup=None):
        try:
            if success:
                logging.info(f"{self.__class__.__name__}.apply_patch for patch {self.id} successful")
            else:
                logging.error(f"{self.__class__.__name__}.apply_patch for patch {self.id} failed: {error_message}")

            log_file = os.path.join(kioskstdlib.get_file_path(self.cfg.logfile), "patches.yml")
            if os.path.exists(log_file):
                with open(log_file, "r", encoding='utf8') as ymlfile:
                    log = yaml.load(ymlfile, Loader=yaml.FullLoader)
            else:
                log = {}

            if self.id not in log:
                log[self.id] = {"success": False,
                                "log": []}
            if (log_check_on_startup is None and self.needs_restart()) or log_check_on_startup:
                log["check_on_startup"] = self.id
            log[self.id]["success"] = success
            log[self.id]["log"].append(f"{datetime.datetime.now()}: "
                                       f"{error_message if error_message else 'successful'}")
            with open(log_file, "w") as ymlfile:
                yaml.dump(log, ymlfile, default_flow_style=False)

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.log_patch_installation: Exception when "
                          f"logging {'successful' if success else 'failed'} patch installation {repr(e)}")

    def start_script(self, script: str) -> Tuple[bool, str]:
        """
        starts a script. The script can either be a
        powershell script or a python script.

        :param script: filename of the script. The file is expected in the transfer directory.
        :return: (bool to indicate success, error message in case of an error)
        """
        script_file = os.path.join(self.transfer_dir, script)
        if not os.path.isfile(script_file):
            raise Exception(f'Script {script_file} not found.')
        if kioskstdlib.get_file_extension(script_file).lower() == "py":
            return self.start_python_script(script_file)
        elif kioskstdlib.get_file_extension(script_file).lower() == "ps1":
            return self.start_shell_script(script_file)
        else:
            raise Exception(f"Script {script} has wrong file extension.")

    def start_shell_script(self, script_file: str) -> Tuple[bool, str]:
        """
        starts a powershell shell script. The script is supposed to return either 0 (default) or 1.
        In terms of an error (return code 1) the script should echo an error message to stdout.
        :param script_file: the ps1 file to start
        :return: (bool to indicate success, error message in case of an error)
        """
        cmdline = ["powershell ",
                   script_file,
                   self.transfer_dir,
                   self.cfg.base_path,
                   self.cfg.get_project_id(),
                   self.kiosk_version
                   ]
        logging.debug(f"{self.__class__.__name__}.start_shell_script: Starting Powershell Script {script_file}.")
        result = subprocess.run(cmdline, cwd=self.transfer_dir, stdout=subprocess.PIPE)
        rc = result.returncode
        msg = kioskstdlib.get_printable_chars(result.stdout) if hasattr(result, "stdout") else ""
        logging.debug(f"{self.__class__.__name__}.start_shell_script: Powershell Script {script_file} returned "
                      f"{rc}: {msg}")
        return (True, "") if rc == 0 else (False, msg)

    def start_python_script(self, script_file: str):
        """
        loads a python script as a module and executes the method patch_script_name.
        The method must take three arguments: cfg: KioskConfig, transfer_dir: str, kiosk_version: str and
        return (bool to indicate success, error message in case of an error).
        Exceptions within the patch method will be caught.

        :param script_file: path and filename of the script file
        :return: (bool to indicate success, error message in case of an error)
        """
        logging.debug(f"{self.__class__.__name__}.start_python_script: loading python script {script_file}.")
        try:
            module = kioskstdlib.load_python_module(script_file, 'patch_script')
            logging.debug(f"{self.__class__.__name__}.start_python_script: "
                          f"loading python script {script_file} successful.")
            if hasattr(module, "patch_script_main"):
                return module.patch_script_main(self.cfg, self.transfer_dir, self.kiosk_version)
            else:
                return [False, f"Python script {script_file} has no method 'patch_script_main'"]
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.start_python_script: "
                          f"Error when loading script {script_file} {repr(e)}")
            return [False, repr(e)]

    def run_unpackkiosk(self) -> [bool, str]:
        """
        start unppackkiosk with the parameters set in the patch.yaml
        :return: Tuple[bool, str] with str being the message if bool is False
        """
        unpackkiosk_parameters: list[str] = kioskstdlib.try_get_dict_entry(
            self.patch_file['patch'],
            'unpackkiosk_parameters', '').split(" ")
        unpackkiosk_parameters = [x for x in unpackkiosk_parameters if x]
        if unpackkiosk_parameters:
            logging.info(f"running unppackkiosk with parameters from patch.yml: {unpackkiosk_parameters}")
        else:
            unpackkiosk_parameters = ['--patch', '-nt', '-na', '-nr']
            logging.info(f"running unppackkiosk with default parameters: {unpackkiosk_parameters}")

        unpackkiosk_parameters.append('--guided')
        if not kioskstdlib.to_bool(kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'close_mcp', 'False')):
            unpackkiosk_parameters.append('--exclude_mcp')
        if kioskstdlib.to_bool(kioskstdlib.try_get_dict_entry(self.patch_file['patch'], 'restart_machine', 'False')):
            unpackkiosk_parameters.append('-rm')

        unpackkiosk_dir = os.path.join(self.transfer_dir, 'unpackkiosk')
        unpackkiosk_file = os.path.join(unpackkiosk_dir, 'unpackkiosk.py')
        if not os.path.isfile(unpackkiosk_file):
            err_msg = f"{self.__class__.__name__}.run_unpackkiosk: " \
                      f"unpackkiosk not installed in {self.transfer_dir}"
            logging.error(err_msg)
            return False, err_msg

        cmdline_str = "python " + os.path.join(unpackkiosk_file) + " " + self.transfer_dir + " " + \
                      self.cfg.base_path + " " + " ".join(unpackkiosk_parameters)
        if not kioskstdlib.to_bool(self.get_development_option("test_patch").lower() == "true"):
            if kioskstdlib.in_virtual_env():
                err_msg = f"{self.__class__.__name__}.run_unpackkiosk: " \
                          f"attempt to install the patch on a system with virtual environment. " \
                          f"That is most likely a development system. Cmdline would have been: {cmdline_str}"
                logging.error(err_msg)
                return False, err_msg

            if self.is_development_system():
                err_msg = f"{self.__class__.__name__}.run_unpackkiosk: " \
                          f"attempt to install the patch on a development system. Cmdline would have been " \
                          f"{cmdline_str}"
                logging.error(err_msg)
                return False, err_msg
        else:
            unpackkiosk_parameters.append("--test_drive")
            logging.warning(f"{self.__class__.__name__}.run_unpackkiosk: "
                            f"test drive with command line {cmdline_str} --test_drive")

        # return self.start_unpackkiosk_async(unpackkiosk_dir, unpackkiosk_file, unpackkiosk_parameters)
        print ("\x1B[2J\x1B[H\x1B[30;1;43m")  # Black on yellow, bold
        print ("*******************************************************")
        print ("**                Updating Kiosk                     **")
        print ("**      This process can take quite a while,         **")
        print ("**      even up to 30 minutes during which           **")
        print ("**      you won't see a thing here. So please        **")
        print ("**      have patience. Kiosk will start after        **")
        print ("**            the update has finished                **")
        print ("*******************************************************\x1B[0m", flush=True)
        return self.start_unpackkiosk_sync(unpackkiosk_dir, unpackkiosk_file, unpackkiosk_parameters)

    # noinspection PyPep8Naming
    def start_unpackkiosk_async(self, unpackkiosk_dir, unpackkiosk_file, unpackkiosk_parameters):
        cmdline = []
        try:
            cmdline = ["python", os.path.join(unpackkiosk_file), self.transfer_dir, self.cfg.base_path]
            cmdline.extend(unpackkiosk_parameters)
            DETACHED_PROCESS = 0x00000008
            CREATE_NEW_CONSOLE = 0x00000010
            subprocess.Popen(cmdline, cwd=unpackkiosk_dir, shell=True,
                             creationflags=DETACHED_PROCESS & CREATE_NEW_CONSOLE)  # stdout=subprocess.PIPE

        except BaseException as e:
            cmdline_str = " ".join(cmdline)
            err_msg = f"{self.__class__.__name__}..start_unpackkiosk_async: " \
                      f"Error running unpackkiosk: {repr(e)}." \
                      f"Cmdline was: {cmdline_str}"
            logging.error(err_msg)
            return False, err_msg

    def start_unpackkiosk_sync(self, unpackkiosk_dir, unpackkiosk_file, unpackkiosk_parameters):
        cmdline = []
        try:
            cmdline = ["python", os.path.join(unpackkiosk_file), self.transfer_dir, self.cfg.base_path]
            cmdline.extend(unpackkiosk_parameters)
            result = subprocess.run(cmdline, capture_output=True, cwd=unpackkiosk_dir)
            rc = result.returncode
            logging.info(f"{self.__class__.__name__}.start_shell_script: unpackkiosk sub process returned "
                          f"{rc}")
            return (True, "") if rc == 0 else (False, f"unpackkiosk failed with rc {rc}. "
                                                      f"Look at the unpackkiosk logs for details.")

        except BaseException as e:
            cmdline_str = " ".join(cmdline)
            err_msg = f"{self.__class__.__name__}.start_unpackkiosk_sync: " \
                      f"Error running unpackkiosk: {repr(e)}." \
                      f"Cmdline was: {cmdline_str}"
            logging.error(err_msg)
            return False, err_msg

    def get_development_option(self, key: str) -> str:
        """
        returns a setting from the kiosk-config in the section "development"
        :param key: a key under "development"
        :return: the contents of that key or and empty string
        """
        try:
            v = self.development[key]
            return str(v)
        except BaseException:
            return ""

    def is_development_system(self) -> bool:
        """
        checks if the config key "development/development_system" is set to True
        :return:
        """
        return kioskstdlib.to_bool(self.get_development_option("development_system"))
