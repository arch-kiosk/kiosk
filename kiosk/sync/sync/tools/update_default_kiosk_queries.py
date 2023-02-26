import logging
import sys
from os import path

from dsd.dsd3singleton import Dsd3Singleton
from kioskquery.kioskquerystore import install_default_kiosk_queries
from sync_config import SyncConfig


def usage():
    print("""
    Usage of update_default_kiosk_queries.py:
    ===================
      update_default_kiosk_queries <kiosk-dir>
      <kiosk-dir> is required and must point to the base directory 
                  (in which either a config\kiosk_config.yml or a config\sync_config.yml is expected)
    """)
    sys.exit(0)


if __name__ == '__main__':
    options = {}
    dsd_file = ""
    database = ""

    logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    if len(sys.argv) != 2:
        usage()

    kiosk_dir = sys.argv[1]
    if kiosk_dir and not path.isdir(kiosk_dir):
        logging.error(f"kiosk directory {kiosk_dir} does not seem to exist or is not a valid directory.")
        usage()

    cfg_file = path.join(kiosk_dir, r'config\kiosk_config.yml')
    if not path.isfile(cfg_file):
        cfg_file = path.join(kiosk_dir, r'config\sync_config.yml')
        if not path.isfile(cfg_file):
            logging.error(f"neither a sync_config.yml nor a kiosk_config.yml can be found. ")
            usage()

    cfg = SyncConfig.get_config({'config_file': cfg_file})
    dsd = Dsd3Singleton.get_dsd3()
    assert dsd.append_file(cfg.dsdfile)
    print(
        f"Installing query definitions from {cfg.default_kiosk_queries} and "
        f"{cfg.default_kiosk_queries}\\{cfg.get_project_id()}")
    install_default_kiosk_queries(cfg)
    print("Ok.")
