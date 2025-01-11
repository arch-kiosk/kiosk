import logging
import os

import kioskstdlib
from kioskcleanup import KioskCleanup
from kioskglobals import debug
from kiosklib import is_local_server
from sync_config import SyncConfig


def clear_log(cfg: SyncConfig, test_mode=False, override_logdir=""):
    """
    clears the log

    :param cfg:
    :param test_mode:
    :param override_logdir:
    :return: boolean
    """
    try:
        housekeeping_cfg = cfg.get_section("housekeeping")
        clear_log_cfg = kioskstdlib.try_get_dict_entry(housekeeping_cfg, "clear_log", {}, True)
        max_days = kioskstdlib.try_get_dict_entry(clear_log_cfg, "max_days", 30, True)
        mode = kioskstdlib.try_get_dict_entry(clear_log_cfg, "mode", "", True)
        logging.debug(f"clear_log: configured mode is {mode} ")
        if not mode:
            if is_local_server(cfg):
                mode = "move"
            else:
                mode = "delete"
        logging.debug(f"clear_log: actual mode is {mode} ")

        if mode not in ["delete", "move"]:
            logging.error(f"housekeepingclearlog.clear_log: unknown mode '{mode}'")
            return False

        if max_days and not str(max_days).isnumeric():
            logging.error(
                f"housekeepingclearlog.clear_log: skipped because max_days is set to an invalid number {max_days}")
            return False
        if not max_days:
            logging.info(f"housekeepingclearlog.clear_log: skipped because max_days is set to 0")
            return True

        max_days = int(str(max_days))

        log_dir = override_logdir if override_logdir else kioskstdlib.get_file_path(cfg.get_logfile())
        if not os.path.isdir(log_dir):
            return False

        target_dir = ""
        if mode == "move":
            target_dir = os.path.join(log_dir,"archive")
            if not os.path.isdir(target_dir):
                os.mkdir(target_dir)

        if test_mode:
            return True, mode, max_days

        cleaner = KioskCleanup(max_age_days=max_days, move_to=target_dir if mode == "move" else "")
        cleaner.add_dir(log_dir)

        return cleaner.cleanup()
    except BaseException as e:
        logging.error(f"housekeepingclearlog.clear_log: An exception occurred: {repr(e)}")
        return False