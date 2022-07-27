from kioskconfig import KioskConfig
from filerepository import FileRepository
import os
import logging
from kioskconfig import KioskConfig


from synchronization import Synchronization
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb


def init(config_file):
    KioskConfig._release_config()
    cfg = KioskConfig.get_config({"config_file": config_file})

    # Initialize logging and settings
    logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    if not cfg.do_log_to_screen():
        logger.handlers = []

    if cfg.get_logfile():
        ch = logging.FileHandler(filename=cfg.get_logfile())
        ch.setLevel(logging.INFO)
        formatter = logging.Formatter('>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s')
        ch.setFormatter(formatter)
        logger.addHandler(ch)


if __name__ == '__main__':
    this_path = os.path.dirname(os.path.abspath(__file__))
    base_path = KioskPyTestHelper.get_kiosk_base_path_from_test_path(this_path)
    init(os.path.join(base_path, "config", 'kiosk_config.yml'))
    cfg = KioskConfig.get_config()
    cfg.truncate_log()
    if not os.path.isdir(cfg.get_file_repository()):
        logging.error(f"file repository {cfg.file_repository} does not point to a valid path.")
    else:
        sync = Synchronization()
        file_repos = FileRepository(cfg, sync.events, sync.type_repository, sync)
        files = file_repos.do_housekeeping(console=True)

