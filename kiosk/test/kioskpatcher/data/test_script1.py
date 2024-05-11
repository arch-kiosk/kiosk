import logging

from kioskconfig import KioskConfig


def patch_script_main(cfg: KioskConfig, transfer_dir, kiosk_version):
    print(cfg.base_path, transfer_dir, kiosk_version)
    logging.info("It even has access to the patch's log")
    return False, "error messsage from python script"

