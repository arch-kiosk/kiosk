import os
import sys

import psycopg2

from sync_config import SyncConfig

version = "0.1"

global_params = {"--kiosk-dir": "kiosk-dir",
                 "--transfer-dir": "transfer-dir",
                 "-?": "?",
                 "--help": "?",
                 }

command_params = {
}

required_params = {
    # "cat": ["target-dir"],
    # "create-files-delta": ["delta-file"],
    # "pack-delta": ["delta-file", "target-dir"],
    # "unpack": ["source-dir"]
}

options = {}
command = ""


def usage():
    print("""
    check_workstation_states checks if all Recording Workstations are back from the field. (not checking the download status!)

    Usage of check_workstation_states.py:
    ===================
      check_workstation_states kiosk-dir   
      <kiosk-dir>=Required. Points to the local kiosk base directory on which to perform the command. 

    This can be used as a sub-script. It returns 1 if all workstations are fine otherwise (which includes errors) 0.    

    """)
    sys.exit(0)



if __name__ == '__main__':
    this_path = os.path.dirname(os.path.abspath(__file__))
    if len(sys.argv) != 2:
        print(f"no Kiosk dir")
        usage()

    kiosk_dir = sys.argv[1]

    if kiosk_dir is None:
        print(f"no Kiosk dir")
        usage()

    config_file = os.path.join(kiosk_dir, "config", 'kiosk_config.yml')
    root_file = os.path.join(kiosk_dir, "this_is_the_kiosk_root.md")
    if not os.path.isfile(root_file):
        print(f"{root_file} does not exist.")
        usage()

    if not os.path.isfile(config_file):
        print(f"{config_file} does not exist.")
        usage()

    cur = None
    con = None
    rc = 0
    try:
        cfg = SyncConfig.get_config({'config_file': config_file,
                                  'base_path': kiosk_dir})
        project_id = cfg.get_project_id()
        db_name = cfg.database_name
        usr = cfg.database_usr_name
        pwd = cfg.database_usr_pwd
        port = cfg.database_port

        timeout = f" options='-c statement_timeout=5s'"

        con = psycopg2.connect(
            "dbname=" + db_name + " user=" + usr + " password=" + pwd + f" port={cfg.database_port}" + timeout)

        cur = con.cursor()
        cur.execute(f"select count(*) from repl_workstation where state <> 0")
        r = cur.fetchone()
        if r[0] == 0:
            print(f"Fine, all workstations are idle for project {project_id}")
            rc = 1
        else:
            print(f"{r[0]} Workstations are still in the field for project {project_id}")

    except BaseException as e:
        print(f"check_workstation_states: An error occured: {repr(e)}")
    finally:
        try:
            if cur: cur.close()
        except:
            pass
        try:
            if con: con.close()
        except:
            pass
    exit(rc)