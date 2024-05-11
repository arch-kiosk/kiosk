from kioskconfig import KioskConfig
## a test patch script in python


def patch_script_main(cfg: KioskConfig, transfer_dir, kiosk_version):
    print(cfg.base_path, transfer_dir, kiosk_version)
    return True, ""

