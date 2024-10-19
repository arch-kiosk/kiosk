import logging
import sys
from os import path

from dsd.dsd3singleton import Dsd3Singleton
from fts.kioskfulltextsearch import FTS
from fts.ftstableindexer import FTSTableIndexer
from fts.ftsview import FTSView
from sync_config import SyncConfig
from tools.KioskDatabaseIntegrity import KioskDatabaseIntegrity


def usage():
    print("""
    Usage of check_kiosk_db_integrity.py:
    ===================
      check_kiosk_db_integrity <kiosk-dir>
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
    logger.setLevel(logging.INFO)

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
    print("Checking Database Integrity ...", flush=True, end="")
    db_int = KioskDatabaseIntegrity(SyncConfig.get_config())
    db_int.ensure_database_integrity()
    print("Done", flush=True, end="\n")

