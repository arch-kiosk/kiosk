import json
import logging
import datetime
import os
import pathlib
from sys import warnoptions
from typing import List, Optional, Tuple
from zipfile import ZipFile

import kioskstdlib
from filerepository import FileRepository
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdview import DSDView
from dsd.dsdyamlloader import DSDYamlLoader
from kioskfilesmodel import KioskFilesModel
from kioskrepresentationtype import KioskRepresentations, KioskRepresentationType
from kiosksqldb import KioskSQLDb
from databasedrivers import DatabaseDriver
from sync_config import SyncConfig


class TransferKiosk:
    transfer_progress = None

    def __init__(self, cfg: SyncConfig):
        self.cfg = cfg
        self.enable_console = False
        self.master_view = self._init_dsd(cfg)
        self.console_log = print
        self.temp_table_name = ""
        self._delta = None

    def setup_console(self):
        if self.enable_console:
            self.console_log = print
        else:
            self.console_log = lambda *args, **kwargs: None

    @classmethod
    def set_progress_handler(cls, progress_handler):
        cls.transfer_progress = progress_handler

    @classmethod
    def _report_progress(cls, progress_prc=0, msg=""):
        return kioskstdlib.report_progress(cls.transfer_progress, progress_prc, topic="transfer_kiosk",
                                           extended_progress=msg)

    @staticmethod
    def _init_dsd(cfg):
        master_dsd = Dsd3Singleton.get_dsd3()
        master_dsd.register_loader("yml", DSDYamlLoader)
        if not master_dsd.append_file(cfg.get_dsdfile()):
            logging.error(f"TransferKiosk._init_dsd: dsd3 initialized: "
                          f"{cfg.get_dsdfile()} could not be loaded by append_file.")
            raise Exception(f"init_dsd: {cfg.get_dsdfile()} could not be loaded.")

        try:
            master_view = DSDView(master_dsd)
            master_view_instructions = DSDYamlLoader().read_view_file(cfg.get_master_view())
            master_view.apply_view_instructions(master_view_instructions)
            logging.debug(f"TransferKiosk._init_dsd: dsd3 initialized: {cfg.get_dsdfile()}.")
            return master_view
        except BaseException as e:
            logging.error("TransferKiosk._init_dsd: dsd3 initialized: "
                          "Exception when applying master view to dsd: {repr(e)}")
            raise e

    def cat(self, target_dir: str) -> bool:
        def json_serial(obj):
            """JSON serializer for objects not serializable by default json code"""

            if isinstance(obj, (datetime.datetime, datetime.date)):
                return obj.isoformat()
            raise TypeError("Type %s not serializable" % type(obj))

        self.setup_console()
        self.console_log(f"cataloguing ...")
        if not self.master_view:
            logging.error("Master View not initialized!")
            return False

        files_table = self.master_view.dsd.files_table
        if not files_table:
            logging.error("Not clear what the table for files is named in this kiosk.")
            return False

        self.console_log(f"image table is {files_table}")

        if not os.path.exists(target_dir):
            os.mkdir(target_dir)
        cat_file = os.path.join(target_dir, 'cat_file.json')
        self.console_log(f"Dumping file information into {cat_file}", end="")
        cur = KioskSQLDb.execute_return_cursor(f"select uid, modified, md5_hash "
                                               f"from images where not coalesce(tags,'') ilike %s", ["%BROKEN_FILE%"])
        count = 0
        with open(cat_file, 'w', encoding='utf-8') as f:
            f.write("[\n")
            while True:
                data = cur.fetchmany(100)
                if not data:
                    break
                for d in data:
                    if count > 0:
                        f.write(",\n")
                    json.dump(d, f, default=json_serial)
                    count += 1
                    if count % 100 == 0:
                        self.console_log(".", end="")

            f.write("]\n")

        self.console_log(f" okay: {count} file records dumped.")
        return True

    def create_files_delta(self, target_catalog=None, source_catalog=None,
                           context_bound=False,
                           omit_record_types: Optional[List[str]] = None):
        """
        Note, that target_catalog and source catalog are mutually exclusive.
        Note, that when using context_bound that the caller must make sure that the file-identifier cache is up to date.

        :param target_catalog: the path and file name of the target catalog.
        :param source_catalog: the path and file name of the source catalog
        :param context_bound: default is false. if set this limits the images to those
                              that appear in the file-identifier-cache.
        :param omit_record_types: Only in combination with context_bound: an array
                                    of record types that do NOT count as context bound.
                                    That way you can export only images that are bound to
                                    the rest of the record types.
        :return:
        """
        if not (target_catalog or source_catalog):
            logging.error(f"{self.__class__.__name__}.create_files_delta: "
                          f"Called without either a target catalog or a source catalog.")
            return False

        if target_catalog and source_catalog:
            logging.error(f"{self.__class__.__name__}.create_files_delta: "
                          f"Called with BOTH a target catalog and a source catalog.")
            return False

        if target_catalog and not os.path.isfile(target_catalog):
            logging.error(f"{self.__class__.__name__}.create_files_delta: "
                          f"Target catalog {target_catalog} does not exist")
            return False

        if source_catalog and not os.path.isfile(source_catalog):
            logging.error(f"{self.__class__.__name__}.create_files_delta: "
                          f"Source catalog {source_catalog} does not exist")
            return False

        if context_bound and source_catalog:
            logging.error(f"{self.__class__.__name__}.create_files_delta: "
                          f"Using a source-catalog with the context_bound option is not supported.")
            return False

        self.console_log(f"Importing {source_catalog if source_catalog else target_catalog} ", end="")
        self._import_json_catalog(source_catalog if source_catalog else target_catalog)

        c = KioskSQLDb.get_field_value_from_sql("c",
                                                f"select count(uid) c from "
                                                f"{KioskSQLDb.sql_safe_ident(self.temp_table_name)}")
        recent = KioskSQLDb.get_field_value_from_sql("recent",
                                                     f"select max(modified) recent from "
                                                     f"{KioskSQLDb.sql_safe_ident(self.temp_table_name)}")
        if c and recent:
            self.console_log(f"... okay: {c} records found in catalog "
                             f"of which the most recent is of {recent.isoformat()} ")
            logging.debug(f"{self.__class__.__name__}._import_json_catalog: {c} records in temp table. "
                          f"Most recent date is {recent.isoformat()}")
        else:
            self.console_log(f"... okay: {c} records found in catalog.")
            logging.debug(f"{self.__class__.__name__}._import_json_catalog: {c} records in temp table. ")

        if context_bound:
            if omit_record_types:
                sql_omit = f" OR fid_record_type in ({','.join([DatabaseDriver.quote_value('VARCHAR', x) for x in omit_record_types])})"
            else:
                sql_omit = ""

            files_table_sql = f"""(select distinct uid, modified, md5_hash from 
                              {KioskSQLDb.sql_safe_ident(self.master_view.dsd.files_table)} files 
                              inner join {KioskSQLDb.sql_safe_namespaced_table("context_cache", "file_identifier_cache")} fid 
                                on files.uid = fid.data::UUID
                              where not (coalesce(tags,'') ilike {DatabaseDriver.quote_value('VARCHAR', DatabaseDriver.wildcard('BROKEN_FILE'))})
                                         {sql_omit}
                                        )
                                """
        else:
            files_table_sql = f"""(select distinct uid, modified, md5_hash from 
                              {KioskSQLDb.sql_safe_ident(self.master_view.dsd.files_table)} 
                              where not coalesce(tags,'') ilike 
                              {DatabaseDriver.quote_value('VARCHAR', DatabaseDriver.wildcard('BROKEN_FILE'))})"""
        if source_catalog:
            self.console_log(f"Creating delta to transfer files from a remote Kiosk to this one ", end="")
            delta = self._process_delta(KioskSQLDb.sql_safe_ident(self.temp_table_name), files_table_sql)
        else:
            self.console_log(f"Creating delta to transfer files from this Kiosk to a remote Kiosk ", end="")
            delta = self._process_delta(files_table_sql, KioskSQLDb.sql_safe_ident(self.temp_table_name))

        self.console_log(f"okay: {len(delta)} files need to be copied.")
        self._delta = delta
        return True

    def delta2file(self, filename: str):
        with open(filename, "w") as f:
            json.dump(self._delta, f)

    def file2delta(self, filename: str):
        if not os.path.isfile(filename):
            logging.error(f"{self.__class__.__name__}.file2delta: delta file {filename} does not exist.")
            return False
        with open(filename, "r") as f:
            self._delta = json.load(f)
        return True

    def _import_json_catalog(self, catalog_file):
        with open(catalog_file, "r") as f:
            file_records = json.load(f)
        self.temp_table_name = str(kioskstdlib.uuid4())
        sql = f"CREATE TEMP TABLE IF NOT EXISTS {KioskSQLDb.sql_safe_ident(self.temp_table_name)} ("
        sql += f"uid UUID UNIQUE PRIMARY KEY NOT NULL, " \
               f"modified TIMESTAMP NOT NULL," \
               f"md5_hash VARCHAR)"
        KioskSQLDb.execute(sql)
        sql_insert = f"INSERT INTO {KioskSQLDb.sql_safe_ident(self.temp_table_name)} VALUES(%s,%s,%s)"
        for file in file_records:
            KioskSQLDb.execute(sql_insert, [file[0], datetime.datetime.fromisoformat(file[1]), file[2]])

    def _process_delta(self, from_kiosk, to_kiosk):
        """
        processes the delta. from_kiosk and to_kiosk must be valid sql-sources (either a table or a select in brackets)
        that are already properly formatted for the target database driver.
        :param from_kiosk: image information of the source kiosk
        :param to_kiosk: image information of the target kiosk
        :return:
        """
        sql = f"""select {KioskSQLDb.sql_safe_ident('from_kiosk')}.{KioskSQLDb.sql_safe_ident('uid')} 
                    from {from_kiosk} from_kiosk 
                    left outer join {to_kiosk} to_kiosk on from_kiosk.uid = to_kiosk.uid
                    where to_kiosk.uid is null 
                        or (to_kiosk.modified < from_kiosk.modified 
                            and coalesce(to_kiosk.md5_hash,'X')::VARCHAR != coalesce(from_kiosk.md5_hash, 'Y')::VARCHAR)
                    """
        cur = KioskSQLDb.execute_return_cursor(sql)
        c = 0
        r = cur.fetchone()
        delta = []
        while r:
            delta.append(r[0])
            r = cur.fetchone()
            c += 1
            if c % 100 == 0:
                self.console_log(f".", end="")

        return delta

    def pack_delta(self, target_dir, max_errors=1, max_zip_size=100000000, fake_it=False,
                   resolution="", start_with=0, max_count=0):
        c = 0

        def dot():
            nonlocal c
            c += 1
            if c % 80 == 0:
                self.console_log(".", flush=True)
            else:
                self.console_log(".", end="", flush=True)

            if not self._report_progress(int(100 * c / len(self._delta)), "compiling transfer directory"):
                raise Exception(f"{self.__class__.__name__}.pack_delta: "
                                f"Progress cancelled by user")

        c_error = 0

        representation_type = None
        if resolution:
            try:
                representation_type = KioskRepresentations.instantiate_representation_from_config(resolution)
            except:
                logging.error(f"{self.__class__.__name__}.pack_delta: "
                              f"cannot find a representation type for resolution {resolution}.")
                return False

        try:
            kfm = KioskFilesModel()
            if not os.path.exists(target_dir):
                os.mkdir(target_dir)
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.pack_delta: "
                          f"Error when creating or accessing {target_dir}: {repr(e)}")
            return False

        self.console_log(f"Pack {len(self._delta)} files in {target_dir}:")
        logging.debug(f"{self.__class__.__name__}.pack_delta: "
                      f"Starting to pack {len(self._delta)} files in {target_dir}")
        file_repos = FileRepository(self.cfg, )
        zip_nr = 0
        zip_size = 0
        zip_file = None
        try:
            for f in self._delta:
                dot()
                if (not start_with) or c >= start_with:
                    if max_count and c >= start_with + max_count:
                        logging.info(f"{self.__class__.__name__}.pack_delta: not including file# {c}")
                        c -= 1
                        break
                    if representation_type:
                        filename = self.get_cache_file(f, file_repos, representation_type)
                    else:
                        filename = file_repos.get_file_repository_filename(f)
                    if filename and os.path.exists(filename):
                        if not zip_file:
                            zip_nr += 1
                            zip_filename = f"kiosk_file_repos_{zip_nr}.zip"
                            zip_size = 0
                            zip_file = ZipFile(os.path.join(target_dir, zip_filename), 'w')
                        if zip_file:
                            try:
                                filename_only = pathlib.PurePath(filename).name
                                fr_path = pathlib.PurePath(filename).parent.name
                                filename_in_zip = os.path.join(fr_path, filename_only)
                                if not fake_it:
                                    zip_file.write(filename, arcname=filename_in_zip)
                                    try:
                                        info = zip_file.getinfo(filename_in_zip.replace("\\", "/"))
                                        zip_size += info.compress_size
                                    except BaseException as e:
                                        logging.error(f"{self.__class__.__name__}.pack_delta: "
                                                      f"Exception reflecting on {filename_in_zip}: {repr(e)}")
                                        raise Exception("Zip operation failed")
                                else:
                                    zip_size += int(kioskstdlib.get_file_size(filename) * 0.7)

                                if zip_size > max_zip_size:
                                    zip_file.close()
                                    zip_file = None

                            except BaseException as e:
                                logging.error(
                                    f"{self.__class__.__name__}.pack_delta: Error zipping {filename}: {repr(e)}")
                                raise Exception("Zip operation failed")

                    else:
                        if not kfm.get_one("uid=%s", [f]) or not kfm.tags or "BROKEN_FILE" not in kfm.tags:
                            c_error += 1
                            logging.error(f"{self.__class__.__name__}.pack_delta: File '{f} not found'")
                            if 0 < max_errors <= c_error:
                                raise Exception("Too many missing files")
                        else:
                            raise Exception(f"Can't ascertain "
                                            f"filename for delta file {f}")

        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.pack_delta: Exception occurred: {repr(e)}")
        finally:
            if zip_file:
                zip_file.close()

        self.console_log(f"\nDone", flush=True)
        self.console_log(f"\n{c - c_error} files packed, {c_error} files missing or caused errors.", flush=True)
        return True

    def extract_only_all_new_files(self, zip_ref: ZipFile, file_repos_path, force) -> Tuple[int, int]:
        c_existing = 0
        c = 0
        for member in zip_ref.infolist():
            if member.is_dir():
                continue
            target_path = os.path.normpath(os.path.join(file_repos_path, member.filename))
            if not os.path.lexists(target_path):
                zip_ref.extract(member, file_repos_path)
                c += 1
            else:
                c_existing += 1
                if force:
                    logging.warning(f"{self.__class__.__name__}.extract_only_all_new_files: "
                                    f"The file {target_path} existed already in the file repository. "
                                    f"It gets replaced because of --force.")
                    c += 1
                    zip_ref.extract(member, file_repos_path)
                else:
                    logging.warning(f"{self.__class__.__name__}.extract_only_all_new_files: "
                                    f"The file {target_path} exists already in the file repository and will not be replaced "
                                    f"unless you use --force.")
        return c, c_existing

    def unpack(self, source_dir, file_repos_path="", force_replace_files=False) -> bool:
        """
        unpacks all the zip files straight into the file repository.
        This will not override existing files unless force_replace_files is True.

        :param source_dir: the folder with the zip files
        :param file_repos_path: the file repository root
        :param force_replace_files: set to True to override destination files
        :return: boolean
        """
        c_zips = 0

        def dot():
            nonlocal c_zips
            c_zips += 1
            if c_zips % 80 == 0:
                self.console_log(".", flush=True)
            else:
                self.console_log(".", end="", flush=True)

        if not file_repos_path:
            file_repos_path = self.cfg.get_file_repository(False)
        if len(file_repos_path) < 5:
            logging.error(f"{self.__class__.__name__}.unpack: "
                          f"The path to the file repository has fewer than 5 characters. That does not seem healthy.")
            return False
        if not os.path.isdir(file_repos_path):
            logging.error(f"{self.__class__.__name__}.unpack: "
                          f"The path to the file repository ({file_repos_path}) does not point to a valid directory.")
            return False

        zip_files = kioskstdlib.find_files(source_dir, "kiosk_file_repos*.zip", order_desc=False)
        self.console_log(f"Unpacking zip files from {source_dir} to {file_repos_path}.")
        c_existing = 0
        c_extracted = 0

        try:
            for zip_file_path in zip_files:
                dot()
                with ZipFile(zip_file_path, 'r') as zip_ref:
                    c, cx = self.extract_only_all_new_files(zip_ref, file_repos_path, force=force_replace_files)
                    c_existing += cx
                    c_extracted += c
                    if cx:
                        logging.info(f"{self.__class__.__name__}.unpack: {cx} files "
                                     f"from zip {zip_file_path} already existed in the file repository.")

                    # zip_ref.extractall(file_repos_path)
        except Exception as e:
            logging.error(f"{self.__class__.__name__}.unpack: Exception during unzipping: {repr(e)}")

        print("\n", flush=True)
        self.console_log(f"\n{c_zips} zip files unpacked. \n{c_extracted} files extracted to {file_repos_path}. "
                         f"\n{c_existing} files already existed in the file repository.")
        if (not force_replace_files):
            self.console_log("\nUse --force if you want to replace existing files. But think twice!")
        logging.info(f"{c_zips} zip files unpacked. {c_extracted} files extracted to {file_repos_path}. "
                     f"{c_existing} files already existed in the file repository.")

        return True

    def get_cache_file(self, uuid: str, file_repos: FileRepository, representation_type: KioskRepresentationType):
        f = file_repos.get_contextual_file(uuid)
        if f:
            cache_file = f.get_representation(representation_type, True)
            if cache_file:
                return cache_file
            else:
                logging.error(f"{self.__class__.__name__}.get_cache_file: "
                              f"Cannot get resolution {representation_type.label} for file {uuid}")
        else:
            logging.error(f"{self.__class__.__name__}.get_cache_file: "
                          f"Cannot get contextual file {uuid}")
        return ""
