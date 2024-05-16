import logging
from kioskconfig import KioskConfig
from shutil import copy
import os
## a test patch script in python


def patch_script_main(cfg: KioskConfig, transfer_dir, kiosk_version):
    logging.debug("in patch_script_main")
    src_file = os.path.join(transfer_dir, 'editfiledialog.html')
    try:
        dst_file = os.path.join(cfg.base_path, 'plugins', 'filerepositoryplugin','templates','editfiledialog.html')
        copy(src_file, dst_file)
        return True, ""
    except Exception as e:
        err = f"patch_script_main: Error when copying {src_file} to {dst_file}: {repr(e)}"
        logging.error(f"patch_script_main: Error when copying {src_file} to {dst_file}: {repr(e)}")
        return False, err
    finally:
        try:
            os.remove(src_file)
        except Exception as e:
            logging.error(f"patch_script_main: Error when removing {src_file}: {repr(e)}")
        try:
            os.remove(os.path.join(transfer_dir, 'quickfix_2701.py'))
        except Exception as e:
            logging.error(f"patch_script_main: Error when removing {os.path.join(transfer_dir, 'quickfix_2701.py')}: {repr(e)}")

            

