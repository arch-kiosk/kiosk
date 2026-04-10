import logging
import os
import re
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
    dry_run = False

    @classmethod
    def pip_freeze(cls, requirements_txt_tmp: str):
        # sys.executable points to the python.exe inside your Venv
        # -m pip runs the pip module installed in that specific environment
        cmd = [sys.executable, "-m", "pip", "freeze"]

        if os.path.isfile(requirements_txt_tmp):
            os.remove(requirements_txt_tmp)

        try:
            with open(requirements_txt_tmp, "w") as f:
                # Using a list for cmd is safer and avoids shell=True issues
                rc = subprocess.run(cmd, stdout=f, check=True)
        except subprocess.CalledProcessError as e:
            raise Exception(f"KioskRequirements.pip_freeze: Error running pip freeze: {e}")

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
                    parts[1] = parts[1].split("#")[0]  # eliminates the hash if there is one
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

        def modify_operator(op: str, version: str):
            if op != "==" or len(version.split(".")) == 1:
                return op
            return "~="

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
                            operator = modify_operator(command[1], command[0])
                            f.write(f"{requirement}{operator}{command[0]}\n")
                    elif command[0].strip().lower() == "del":
                        dels.append(f"{requirement}\n")
                    else:
                        operator = modify_operator(command[1], command[0])
                        f.write(f"{requirement}{operator}{command[0]}\n")

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
    def install(cls, requirements_txt, check_venv=False, use_wheels=False, remove_packages=True):
        if not os.path.isfile(requirements_txt):
            logging.error(f"{cls.__name__}._install_packages: File {requirements_txt} not found.")
            return False

        if not cls._check_venv({} if check_venv else {"nv": None}):
            return False

        requirements_del_txt = get_filename_without_extension(
            requirements_txt) + ".del." + get_file_extension(requirements_txt)
        requirements_del_txt = os.path.join(os.path.dirname(requirements_txt), requirements_del_txt)
        if os.path.exists(requirements_del_txt) and remove_packages:
            if not cls._remove_packages(requirements_del_txt):
                return False
        return cls._install_packages_with_wheels(requirements_txt) if use_wheels else cls._install_packages(
            requirements_txt)

    @classmethod
    def _remove_packages(cls, requirements_del_txt):
        if not os.path.isfile(requirements_del_txt):
            logging.error(f"{cls.__name__}._remove_packages: File {requirements_del_txt} not found.")
            return False
        try:
            if cls.in_console:
                print("running pip and uninstalling python packages ... ", flush=True)
            rc = subprocess.run(
                f"python -m pip uninstall --retries 0 --disable-pip-version-check -r {requirements_del_txt} -y",
                stdout=subprocess.PIPE)

            if rc.returncode != 0:
                logging.warning(f"\n{cls.__name__}._remove_packages: python -m pip uninstall -r failed: {str(rc)}.")

            if cls.in_console:
                print("Done \n", flush=True)
            return True

        except OSError as e:
            logging.error(f"\n{cls.__name__}._remove_packages: {repr(e)}")

        return False

    @classmethod
    def _install_packages(cls, requirements_txt):
        try:
            if cls.in_console:
                print("running pip and installing python packages ... ", flush=True)
            library_path = os.path.join(os.path.dirname(requirements_txt), 'libraries')
            cmd = f"python -m pip install --retries 0 --disable-pip-version-check {'--dry-run ' if cls.dry_run else ''}-r {requirements_txt} --no-cache-dir"
            rc = subprocess.run(cmd, cwd=library_path,
                                stdout=subprocess.PIPE)
            if rc.returncode == 0:
                if cls.in_console:
                    print("Done\n", flush=True)
                return True

            logging.error(f"\n{cls.__name__}._install_packages: {cmd} failed: {str(rc)}")

        except OSError as e:
            logging.error(f"\n{cls.__name__}._install_packages: {repr(e)}")

    @classmethod
    def _install_packages_with_wheels(cls, requirements_txt: str) -> bool:
        if cls.in_console:
            print("running pip and installing wheels ... ", flush=True)

        wheel_dir = os.path.join(os.path.dirname(requirements_txt), 'wheels')
        if not os.path.exists(wheel_dir):
            logging.error(f"\n{cls.__name__}._install_packages_with_wheels: wheel-directory {wheel_dir} "
                          f"does not exist. Stopping.")
            return False

        temp_requirements_txt = requirements_txt.replace("requirements", "tmp_requirements")
        try:
            cls._rewrite_file_requirements(requirements_txt, temp_requirements_txt)
            cwd = os.path.dirname(requirements_txt)
            cmd = f"python -m pip install --retries 0 --disable-pip-version-check {'--dry-run ' if cls.dry_run else ''}--no-index --no-cache-dir --find-links={wheel_dir} -r {temp_requirements_txt}"
            rc = subprocess.run(
                cmd,
                cwd=cwd,
                stdout=subprocess.PIPE)
            if rc.returncode == 0:
                if cls.in_console:
                    print("Done\n", flush=True)
                return True
            else:
                raise Exception(f"pip returned: {rc.returncode}")

        except BaseException as e:
            logging.error(f"_install_packages_with_wheels: {repr(e)}")
        finally:
            if temp_requirements_txt:
                if os.path.isfile(temp_requirements_txt):
                    os.remove(temp_requirements_txt)
        return False

    @classmethod
    def _rewrite_file_requirements(cls, src_path_and_filename, dst_path_and_filename):
        """
        _AI_: Gemini

        Reads a requirements file and converts filename-style entries
        (e.g., 'package-1.2.3.tar.gz') into standard 'package==1.2.3' format.

        Example Usage:
        _rewrite_file_requirements('requirements.txt', 'requirements.deploy.txt')

        """
        # Pattern explanation:
        # ^(.+?)          -> Group 1: Match package name (non-greedy)
        # -               -> The separator between name and version
        # (\d[\d\.]+)     -> Group 2: Match version (starts with digit, then digits/dots)
        # \.(?:tar\.gz|whl|zip)$ -> Match the extension and end of line
        file_pattern = re.compile(r'^(.+?)-(\d[\d\.]+)\.(?:tar\.gz|whl|zip)$')

        with open(src_path_and_filename, 'r') as src, open(dst_path_and_filename, 'w') as dst:
            for line in src:
                clean_line = line.strip()

                # Skip empty lines or comments
                if not clean_line or clean_line.startswith('#'):
                    dst.write(line)
                    continue

                # Extract just the filename if a path was provided (e.g., ./pkgs/flask-allows-0.7.2.tar.gz)
                filename = os.path.basename(clean_line)
                match = file_pattern.match(filename)

                if match:
                    package_name, version = match.groups()
                    # Convert to standard requirement format
                    dst.write(f"{package_name}=={version}\n")
                else:
                    # It's already a standard requirement or something else, keep as is
                    dst.write(line if line.endswith('\n') else line + '\n')
