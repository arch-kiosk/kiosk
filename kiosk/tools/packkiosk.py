import os
import sys
import logging

import kioskstdlib
from kioskbackup import KioskBackup

from os import path
from kioskconfig import KioskConfig
from kioskrequirements import KioskRequirements
from tz.kiosktimezones import KioskTimeZones

params = {"-fr": "fr", "--pack_file_repository": "fr",
          "-fd": "fd", "--file_repository_date": "fd",
          "-w": "w", "--pack_workstations": "w",
          "-ft": "ft", "--pack_filemaker_template": "ft",
          "-c": "c", "--code": "c",
          "-p": "p", "--pip_freeze": "p",
          "-db": "db", "--database": "db",
          "-full": "full", "--full": "full"
          }


# **********************************************
# console part
# **********************************************


# noinspection PyShadowingNames
def interpret_param(known_param, param):
    new_option = params[known_param]
    rc = None

    if new_option == "fd":
        param_parts = param.split("=")
        if len(param_parts) == 2:
            date_part = param_parts[1]
            from_date = kioskstdlib.guess_datetime(date_part)
            if from_date:
                rc = {new_option: from_date}
    elif new_option == "full":
        rc = {"ft": None,
              "c": None,
              "p": None,
              "db": None}
    else:

        rc = {new_option: None}

    return rc


def usage():
    print("""
    Usage of packkiosk.py:
    ===================
      packkiosk <path and filename of kiosk> <path and filename of destination zip file>
      optional:
        -fr / --pack_file_repository: Packs the file repository, too, in a separate zip file

        -fd=<date> / --file_repository_date=<date>: 
                                      Only in combination with -fr. Packs only files with a modification 
                                      or creation date of or after the given date

        -w / --pack_workstations: Includes the filemaker folder of individual workstations
        -ft / --pack_filemaker_template: Includes the filemaker template
        -p / --pip_freeze: needs pip-tools! Creates and includes a requirements.txt out of the requirements.in 
                           that is expected in the parent directory of the given kiosk directory. 
        -db / --database: creates and includes a backup of the database
        -c / --code: includes the code files (which includes custom folders)
        --full: most common option. Includes -ft -c- db -p but NOT the file repository and NO workstations

    """)
    sys.exit(0)


if __name__ == '__main__':
    options = {}
    KioskBackup.in_console = True
    logging.basicConfig(level=logging.INFO)
    if len(sys.argv) < 3:
        usage()

    kiosk_dir = sys.argv[1]
    if kiosk_dir and not path.isdir(kiosk_dir):
        logging.error(f"kiosk directory {kiosk_dir} does not seem to exist or is not a valid directory.")
        usage()

    cfg_file = path.join(kiosk_dir, r'config\kiosk_config.yml')
    if not path.isfile(cfg_file):
        logging.error(f"{cfg_file} does not seem to point to a configuration file.")
        usage()

    dst_dir = sys.argv[2]
    dst_dir = path.abspath(dst_dir)
    if dst_dir and not path.isdir(dst_dir):
        logging.error(f"{dst_dir} does not seem to point to a valid folder.")
        usage()
    print(f"packing to directory {dst_dir}")

    cfg = KioskConfig.get_config({'config_file': cfg_file, 'base_path': kiosk_dir})
    if not path.isdir(cfg.get_file_repository()):
        logging.error(f"file repository {cfg.get_file_repository()} does not point to a valid path.")
        usage()

    for i in range(3, len(sys.argv)):
        param = sys.argv[i]
        known_param = [p for p in params if param.lower().startswith(p)]
        if known_param:
            known_param = known_param[0]
            new_option = interpret_param(known_param, param)
            if new_option:
                options.update(new_option)
            else:
                logging.error(f"parameter {param} not understood.")
        else:
            print(f"parameter \"{param}\" unknown.")
            usage()

    print("parameters are: ")
    print(options)
    if "p" in options:
        dist_file = os.path.join(kioskstdlib.get_parent_dir(kiosk_dir), 'requirements.dist')
        requirements_txt = os.path.join(dst_dir, 'requirements.kiosk.txt')
        if KioskRequirements.freeze(dist_file, requirements_txt, {'nv': True}):
            print(f"Requirements compiled in file {requirements_txt}")
        else:
            logging.error('-p options resulted in an error. Aborting.')
            usage()
        # KioskBackup.pip_compile(kiosk_dir, dst_dir, options)

    if "db" in options:
        KioskBackup.backup_database(cfg, dst_dir)

    KioskBackup.copy_tools(kiosk_dir, dst_dir)

    if "c" in options:
        KioskBackup.copy_libraries(dst_dir, kiosk_dir=kiosk_dir)

    tz_dir = os.path.join(kiosk_dir, "tools", "tz")
    kiosk_tz = KioskTimeZones(os.path.join(tz_dir, "backward"))
    kiosk_tz.generate_kiosk_time_zone_dist(os.path.join(tz_dir, "kiosk_tz.json"))
    KioskBackup.pack_kiosk(cfg, dst_dir, options)
    print("Done.")
