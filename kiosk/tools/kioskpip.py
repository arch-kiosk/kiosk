import logging
import os
import sys

from kioskrequirements import KioskRequirements, in_virtual_env

params = {
    "--no-venv": "nv",
    "--no-uninstall": 'nd'
}


def get_parent_dir(kiosk_dir):
    """
    returns the full parent directory of directory
    :param kiosk_dir: the directory whose parent is needed
    :return: complete parent directory
    """
    return os.path.abspath(os.path.join(kiosk_dir, os.pardir))


def interpret_param(known_param, param):
    new_option = params[known_param]
    rc = None

    # if new_option == "fd":
    #     param_parts = param.split("=")
    #     if len(param_parts) == 2:
    #         date_part = param_parts[1]
    #         from_date = kioskstdlib.guess_datetime(date_part)
    #         if from_date:
    #             rc = {new_option: from_date}
    # elif new_option == "full":
    #     rc = {"ft": None,
    #           "c": None,
    #           "p": None,
    #           "db": None}
    # elif new_option == "pf":
    #     rc = {
    #         "p": None,
    #         "pf": None}
    # else:

    rc = {new_option: None}

    return rc


def usage():
    print("""
    Usage of kioskpip.py:
    ===================
      kioskpip [freeze <path of requirements.dist file>|install] <path and filename of requirements.txt file>
      optional:
        --no-venv: Don't check if kioskpip freeze is used in a virtual environment
        --no-uninstall: Don't uninstall packages from the *.del.txt file.

    """)
    sys.exit(0)


if __name__ == '__main__':

    options = {}
    logging.basicConfig(level=logging.INFO)
    if len(sys.argv) < 2:
        usage()

    kiosk_path = get_parent_dir(os.path.abspath(os.path.dirname(__file__)))
    sys.path.append(kiosk_path)
    sys.path.append(os.path.join(kiosk_path, "core"))
    sys.path.append(os.path.join(kiosk_path, "sync", "sync", "core"))
    sys.path.append(os.path.join(kiosk_path, "sync", "sync"))

    dist_file = ""
    requirements_txt = ""

    mode = sys.argv[1]
    if mode == "freeze":
        if len(sys.argv) < 3:
            usage()
        dist_file = os.path.join(sys.argv[2], "requirements.dist")
        if not os.path.isfile(dist_file):
            logging.error(f"Requirements.dist file {requirements_txt} does not seem to exist.")
            usage()
        requirements_txt = sys.argv[3]
    elif mode == "install":
        requirements_txt = sys.argv[2]
    else:
        usage()

    if mode == "install" and not os.path.isfile(requirements_txt):
        logging.error(f"Requirements.txt file {requirements_txt} does not seem to exist.")
        usage()

    for i in range(4 if mode == "freeze" else 3, len(sys.argv)):
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

    # if not in_virtual_env():
    #     if "nv" not in options:
    #         logging.error("Freeze used outside of a virtual environment!")
    #         usage()
    #     else:
    #         logging.warning("Freeze used outside of a virtual environment.")

    KioskRequirements.in_console = True
    if mode == "freeze":
        if KioskRequirements.freeze(dist_file, requirements_txt, options):
            logging.info(f"Ok. The requirements are listed in {requirements_txt}. (There might also be a .del. file)")
        else:
            logging.error("Failed: freeze reported at least one error.")

    elif mode == "install":
        if KioskRequirements.install(requirements_txt, options):
            logging.info(f"Ok. The requirements are met now.")
        else:
            logging.error("Failed: install reported at least one error.")
