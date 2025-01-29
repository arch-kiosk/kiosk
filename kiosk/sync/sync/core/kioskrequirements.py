import logging
import os
import subprocess
import sys
from pprint import pprint


# ##############################################################################################################
# collection of kioskstdlib methods to be independent of all kinds of libraries
# ##############################################################################################################

# noinspection DuplicatedCode
def in_virtual_env():
    """
        determines whether the current process is running inside a virtual environment (python or virtualenv).
    """

    try:
        if sys.real_prefix:
            return True
    except AttributeError:
        pass
    return not (sys.prefix == sys.base_prefix)


# noinspection DuplicatedCode
def get_filename_without_extension(filename):
    """
    returns a filename without an extension AND without the path!
    :param filename:
    :return:
    """
    filename_without_ext = ""
    try:
        filename_without_ext = os.path.basename(filename)
        idx = filename_without_ext.rfind(".")
        if idx > -1:
            filename_without_ext = filename_without_ext[:idx]
    except:
        filename_without_ext = ""
        pass
    return filename_without_ext


# noinspection DuplicatedCode
def get_file_extension(filename):
    ext = ""
    try:
        new_filename, ext = os.path.splitext(filename)
        if ext[0] == ".":
            ext = ext[1:]
    except:
        pass
    return ext


# noinspection DuplicatedCode
def get_filename(filename):
    """
    returns a filename without without the path!
    :param filename:
    :return:
    """
    separated_filename = ""
    try:
        separated_filename = os.path.basename(filename)
    except:
        pass
    return separated_filename


# ##############################################################################################################
# KioskRequirements
# ##############################################################################################################

class KioskRequirements:
    in_console = False

    @classmethod
    def pip_freeze(self, requirements_txt_tmp: str):
        # cmd = f"pip list --format=\"freeze\""
        cmd = f"pip freeze"

        if os.path.isfile(requirements_txt_tmp):
            os.remove(requirements_txt_tmp)

        with open(requirements_txt_tmp, "w") as f:
            rc = subprocess.run(cmd, stdout=f)

    @classmethod
    def freeze(cls, dist_file: str, requirements_txt: str, options: dict) -> bool:
        if not cls._check_venv(options):
            return False

        requirements_txt_tmp = requirements_txt + ".tmp"

        try:
            cls.pip_freeze(requirements_txt_tmp)
            if not os.path.isfile(requirements_txt_tmp):
                logging.error("pip freeze failed")
                return False

            pip_requirements = cls.read_requirements_file(requirements_txt_tmp)
            dist_requirements = cls.read_requirements_file(dist_file)

            return cls.compile_dist_requirements(pip_requirements, dist_requirements, requirements_txt)
        finally:
            os.remove(requirements_txt_tmp)

    @classmethod
    def _check_venv(cls, options):
        if not in_virtual_env():
            if "nv" not in options:
                logging.error("KioskRequirements._check_venv: "
                              "Operation outside of a virtual environment needs special permission.")
                return False
            else:
                logging.warning("KioskRequirements._check_venv: This is running outside of a virtual environment.")
        return True

    @classmethod
    def read_requirements_file(cls, requirements_txt_tmp):
        requirements = {}

        with open(requirements_txt_tmp, "r") as f:
            while line := f.readline().rstrip():
                if line.find("@ file") > -1:
                    parts = line.split("@")
                    parts[0] = parts[0].strip()
                    parts[1] = parts[1].strip()
                    parts[1] = parts[1].split("#")[0] # eliminates the hash if there is one
                else:
                    sep = ""
                    for _ in ["==", ">=", "<="]:
                        if line.find(_) > -1:
                            sep = _
                    if sep:
                        parts = line.split(sep)
                    else:
                        parts = [line]

                if len(parts) == 1:
                    requirements[parts[0]] = None
                else:
                    requirements[parts[0]] = [parts[1], sep]

        return requirements

    @classmethod
    def compile_dist_requirements(cls, pip_requirements, dist_requirements, requirements_txt) -> bool:
        class RequirementException(Exception):
            pass

        def _check_pip_requirement(req: str):
            if req in pip_requirements:
                return pip_requirements[req]
            else:
                req = req.lower()
                req2 = req.replace('_', '-')
                for key in pip_requirements.keys():
                    if key.lower() == req:
                        raise RequirementException(f"{requirement} was reported by pip freeze as {key}. "
                                                   f"Please correct the capitalization in the dist file.")
                    if key.lower() == req2:
                        raise RequirementException(f"{requirement} was reported by pip freeze as {key}. "
                                                   f"Please correct the underscores in the dist file.")

                raise RequirementException(f"{requirement} not reported by pip freeze")

        if os.path.exists(requirements_txt):
            os.remove(requirements_txt)
        errors = 0
        dels = []
        requirements_del_txt = get_filename_without_extension(
            requirements_txt) + ".del." + get_file_extension(requirements_txt)
        requirements_del_txt = os.path.join(os.path.dirname(requirements_txt), requirements_del_txt)
        if os.path.exists(requirements_del_txt):
            os.remove(requirements_del_txt)

        with open(requirements_txt, "a") as f:
            for requirement, command in dist_requirements.items():
                try:
                    if not command:
                        command = _check_pip_requirement(requirement)
                        if command[0].startswith("file:"):
                            package = get_filename(command[0][6:])
                            # f.write(f"{requirement} @ file:{package}\n")
                            f.write(f"{package}\n")
                        else:
                            f.write(f"{requirement}{command[1]}{command[0]}\n")
                    elif command[0].strip().lower() == "del":
                        dels.append(f"{requirement}\n")
                    else:
                        f.write(f"{requirement}{command[1]}{command[0]}\n")

                except RequirementException as e:
                    logging.error(f"{cls.__name__}.compile_dist_requirements: {e}")
                    errors += 1

        if not errors:
            if dels:
                with open(requirements_del_txt, "a") as f_del:
                    for d in dels:
                        f_del.write(d)

        return errors == 0

    @classmethod
    def install(cls, requirements_txt, options):
        if not cls._check_venv(options):
            return False

        requirements_del_txt = get_filename_without_extension(
            requirements_txt) + ".del." + get_file_extension(requirements_txt)
        requirements_del_txt = os.path.join(os.path.dirname(requirements_txt), requirements_del_txt)
        if os.path.exists(requirements_del_txt) and "nd" not in options:
            if not cls._remove_packages(requirements_del_txt):
                return False
        return cls._install_packages(requirements_txt)

    @classmethod
    def _remove_packages(cls, requirements_del_txt):
        if not os.path.isfile(requirements_del_txt):
            logging.error(f"{cls.__name__}._remove_packages: File {requirements_del_txt} not found.")
            return False
        try:
            if cls.in_console:
                print("running pip and uninstalling python packages ... ", flush=True)
            rc = subprocess.run(f"pip uninstall -r {requirements_del_txt} -y", stdout=subprocess.PIPE)

            if rc.returncode != 0:
                logging.warning(f"\n{cls.__name__}._remove_packages: pip uninstall -r failed: {str(rc)}.")

            if cls.in_console:
                print("Done \n", flush=True)
            return True

        except OSError as e:
            logging.error(f"\n{cls.__name__}._remove_packages: {repr(e)}")

        return False

    @classmethod
    def _install_packages(cls, requirements_txt):
        if not os.path.isfile(requirements_txt):
            logging.error(f"{cls.__name__}._install_packages: File {requirements_txt} not found.")
            return False
        try:
            if cls.in_console:
                print("running pip and installing python packages ... ", flush=True)
            library_path = os.path.join(os.path.dirname(requirements_txt), 'libraries')
            # cwd = os.getcwd()
            # os.chdir(library_path)
            rc = subprocess.run(f"pip install -r {requirements_txt} --no-cache-dir", cwd=library_path,
                                stdout=subprocess.PIPE)
            # os.chdir(cwd)
            if rc.returncode == 0:
                if cls.in_console:
                    print("Done\n", flush=True)
                return True

            logging.error(f"\n{cls.__name__}._install_packages: pip install -r failed: {str(rc)}")

        except OSError as e:
            logging.error(f"\n{cls.__name__}._install_packages: {repr(e)}")
