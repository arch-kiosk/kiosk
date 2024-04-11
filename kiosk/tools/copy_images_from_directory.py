import logging
import os.path
import shutil
import sys
from os import path

import kioskstdlib
from dsd.dsd3singleton import Dsd3Singleton
from filerepository import FileRepository
from fts.kioskfulltextsearch import FTS
from fts.ftstableindexer import FTSTableIndexer
from fts.ftsview import FTSView
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig


def usage():
    print("""
    Usage of copy_images_from_directory.py:
    ===================
      This reads the images table of a Kiosk installation and tries to copy all images that are missing in the file repository 
      from a the source directory to the file repository.

      copy_images_from_directory <kiosk-dir> <source-dir>

      <kiosk-dir> is required and must point to the base directory of the Kiosk that gets the images 
                  (in which either a config\kiosk_config.yml or a config\sync_config.yml is expected)
                  
      <source-dir> is required and must point to the directory where the images are located that should be copied to the Kiosk.
    
    """)
    sys.exit(0)


if __name__ == '__main__':
    options = {}
    dsd_file = ""
    database = ""

    logging.basicConfig(format='>[%(module)s.%(levelname)s at %(asctime)s]: %(message)s', level=logging.ERROR)
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    if len(sys.argv) != 3:
        usage()

    kiosk_dir = sys.argv[1]
    if kiosk_dir and not path.isdir(kiosk_dir):
        logging.error(f"kiosk directory {kiosk_dir} does not seem to exist or is not a valid directory.")
        usage()

    src_dir = sys.argv[2]
    if src_dir and not path.isdir(src_dir):
        logging.error(f"source directory {src_dir} does not seem to exist or is not a valid directory.")
        usage()

    cfg_file = path.join(kiosk_dir, r'config\kiosk_config.yml')
    if not path.isfile(cfg_file):
        cfg_file = path.join(kiosk_dir, r'config\sync_config.yml')
        if not path.isfile(cfg_file):
            logging.error(f"neither a sync_config.yml nor a kiosk_config.yml can be found. ")
            usage()

    cfg = SyncConfig.get_config({'config_file': cfg_file})
    file_repository: str = cfg.get_file_repository()
    if not os.path.exists(file_repository):
        logging.error(f"file repository {file_repository} does not exist.")
        usage()

    dsd = Dsd3Singleton.get_dsd3()
    assert dsd.append_file(cfg.dsdfile)
    cur = KioskSQLDb.execute_return_cursor("SELECT * FROM images")
    row = cur.fetchone()
    fr = FileRepository(cfg)

    while row:
        uid = row['uid']
        file_name = row['filename']
        if file_name:
            fr_path: str = fr.get_repository_path_for_file(uid)
            if fr_path:
                if not path.isfile(path.join(fr_path, file_name)):
                    fr_sub_dir = fr_path.split(os.path.sep)[-1]
                    src_sub_file_name = os.path.join(src_dir, fr_sub_dir, file_name)
                    if path.isfile(src_sub_file_name):
                        src_file_name = src_sub_file_name
                    else:
                        src_file_name = os.path.join(src_dir, file_name)

                    if path.isfile(src_file_name):
                        if not path.exists(fr_path):
                            try:
                                os.mkdir(fr_path)
                            except Exception as e:
                                logging.error(f"Error creating directory {fr_path}: {e}")
                                exit(-1)
                        try:
                            shutil.copy(src_file_name, path.join(fr_path, file_name))
                            logging.info(f"copied {src_file_name} to {fr_path}")
                        except Exception as e:
                            logging.error(f"Error copying {file_name}: {e}")
                    else:
                        logging.error(f"no file {src_file_name} in {src_dir} or a sub-directory.")
                else:
                    logging.info(f"Image {uid} already exists in file repository.")
            else:
                logging.error(f"Can't find repository path for {uid}.")
                pass
        else:
            logging.error(f"Image {uid} has no filename.")
        row = cur.fetchone()

    logging.info(f"Done.")
