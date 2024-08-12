import datetime
import logging
import pprint
import time
from collections import deque
from functools import reduce
from typing import List, Dict

from flask import url_for

import kioskglobals
import kioskstdlib
import kioskdatetimelib
from contextmanagement.sqlsourcecached import CONTEXT_CACHE_NAMESPACE
from core.kioskcontrollerplugin import get_plugin_for_controller
from sync.core.filerepository import FileRepository
from kiosksqldb import KioskSQLDb
from .filerepositorylib import get_file_description_priorities
from databasedrivers import DatabaseDriver


class FileRepositoryFile:
    class FileDescriptionSet:
        def __init__(self, file_description_set, file_description_priorities):
            self.descriptions = []
            self.priorities = deque()
            self.priorities.append(file_description_priorities['primary'])
            if 'secondary' in file_description_priorities:
                self.priorities.append(file_description_priorities['secondary'])
            self.current_priority = deque(self.priorities.popleft())
            self.current_group = None
            self.current_table = None

        def get_next_table(self):
            if not self.current_group:
                try:
                    if not self.current_priority:
                        if self.descriptions or not self.priorities:
                            return None
                        self.current_priority = deque(self.priorities.popleft())
                        # logging.debug("current priority: {}".format(self.current_priority))

                    self.current_group = deque(self.current_priority.popleft())
                    # logging.debug("current group: {}".format(self.current_group))
                except:
                    return None
            try:
                self.current_table = self.current_group.popleft()
                # logging.debug("current table: {}".format(self.current_table))
                return self.current_table
            except:
                return None

        def add_descriptions(self, descriptions):
            for description in descriptions:
                self.descriptions.append(description)
            if descriptions:
                self.next_group = None

        def get_description(self):
            result = ""
            for description in self.descriptions:
                if result:
                    result += ";\n" + description
                else:
                    result = description
            return result

    def __init__(self, controller_plugin, r: dict, description_fields, file_description_priorities,
                 add_file_datetime=False):
        self.r = r
        self.uid = r["uid"]
        self.controller_plugin = controller_plugin
        self.description_fields = description_fields
        self.add_file_datetime = add_file_datetime
        self.file_description_set = self.FileDescriptionSet(controller_plugin, file_description_priorities)

    @property
    def tags(self) -> List[str]:
        return self.r["tags"].upper().split(",")

    def get_image_file_ref(self, representation_id, force_reload=False):
        """
        returns the url that fetches a representation of this image
        todo: needs redesign/refactoring when standard images are redesigned
        :param representation_id:
        :return:
        """
        if "uid" in self.r:
            if not force_reload:
                return url_for('filerepository.fetch_repository_file', file_uuid=self.r["uid"],
                               resolution=representation_id)
            else:
                s = url_for('filerepository.fetch_repository_file', file_uuid=self.r["uid"],
                            resolution=representation_id) + "?" + str(datetime.datetime.now())
                logging.debug(f"get_image_file_ref with force_reload: {s}")
                return s
        else:
            return url_for('static', filename='assets/images/no_file.svg')

    def get_value(self, key, default=""):
        if key == "tags":
            return self.get_tags_without_parantheses()
        if key in self.r:
            result = self.r[key]
            if self.r[key] is not None:
                if isinstance(result, datetime.datetime):
                    return result.replace(tzinfo=None)
                else:
                    return self.r[key]
            else:
                return default
        else:
            return ""

    def set_value(self, key, value):
        if key == "tags":
            value = self.put_tags_in_parentheses(value)
        if key in self.r:
            self.r[key] = value
            return True

        return False

    def get_description_summary(self, include_image_description=True, crlf="\n"):
        found = 0
        cur = KioskSQLDb.get_dict_cursor()
        t = self.file_description_set.get_next_table()
        tried = set()
        while t:
            # refactor: The set is really unnecessary. Just got through every table only once
            if t not in tried:
                tried.add(t)
                dscs = []
                try:
                    # if t == "pottery":
                    #     logging.debug(self.description_fields)
                    uid = self.get_value("uid")
                    if t != "images" or include_image_description:
                        for fld_pair in self.description_fields[t]:
                            cur.execute("select {} from {} where {}=%s".format(fld_pair[1], t, fld_pair[0]),
                                        [uid])
                            r = cur.fetchone()
                            while r:
                                # found += 1
                                # if found > 1:
                                #     logging.debug("image {} is referenced twice, yippieh!".format(self.get_value("uid")))

                                dsc = r[fld_pair[1]]
                                if dsc:
                                    # if dscs:
                                    #     dscs.append("; " + dsc)
                                    # else:
                                    dscs.append(dsc)

                                r = cur.fetchone()
                except Exception as e:
                    logging.error("Exception in get_description_summary: " + repr(e))
                    logging.debug("t: {}".format(t))
                    return

                self.file_description_set.add_descriptions(dscs)
            t = self.file_description_set.get_next_table()

        s = self.file_description_set.get_description()
        if crlf != "\n":
            s = s.replace("\n", crlf)
        return s.strip(": ")

    def get_file_datetime(self):
        return kioskstdlib.latin_date(self.r["file_datetime"], no_time=True)

    def get_arch_identifier(self, include_indirect_identifiers=False):
        """
        :param include_indirect_identifiers: if true and there are no direct identifiers,
               the indirect identifiers will be used instead.
        :return: a comma separated list of identifiers
        """
        if 'identifiers' not in self.r or (self.r['identifiers'] is None and include_indirect_identifiers):
            self._get_identifiers_and_recording_contexts()

        v = self.get_value('identifiers')
        if not v and include_indirect_identifiers:
            indirect_identifiers: dict = self.get_value("indirect_contexts")
            if indirect_identifiers:
                v = ", ".join(f"({k})" for k in indirect_identifiers.keys())

        return v

    def get_identifiers_and_recording_contexts(self):
        if 'identifiers_recording_contexts' not in self.r:
            self._get_identifiers_and_recording_contexts()

        return self.get_value('identifiers_recording_contexts')

    def get_indirect_contexts(self):
        if 'indirect_contexts' not in self.r:
            self._get_identifiers_and_recording_contexts()

        return self.get_value('indirect_contexts')

    def get_arch_context_and_description(self, separator=":"):
        title = self.get_value('identifiers')

        return separator.join([title,
                               self.get_description_summary(crlf="<br>")]).strip(separator + " ")

    def put_tags_in_parentheses(self, tags_str):
        tags = tags_str.split(",")
        rc = ["\"" + x.strip() + "\"" for x in tags]
        rc_str = ",".join(rc)
        return rc_str

    def get_tags_without_parantheses(self):
        tag_str = ""
        if self.r["tags"]:
            tags = self.r["tags"].split(",")
            for t in tags:
                t = t.strip()
                if t.startswith("\""):
                    t = t[1:]
                if t.endswith("\""):
                    t = t[:-1]
                if tag_str == "":
                    tag_str += t
                else:
                    tag_str += "," + t

        return (tag_str)

    def get_image_class_postfix(self, resolution=None):
        if not resolution:
            pf = "default"
        else:
            pf = resolution
        return pf

    def update(self, modified_by="sys", user_time_zone_index=0):
        """
        todo: This is really not great because it sidestep KioskContextualFile!
        :param modified_by:
        :return:
        """
        if not self.r or not self.r["uid"]:
            return False

        # print(f"attempt to update {self.r['uid']}", flush=True)
        sql = "update images set "
        sql += "description=%s, "
        sql += "tags=%s, "
        sql += "file_datetime=%s, "
        sql += "file_datetime_tz=%s, "
        sql += "export_filename=%s, "
        sql += "modified=%s, "
        sql += "modified_tz=%s, "
        sql += "modified_by=%s "
        sql += "where uid=%s"

        cur = KioskSQLDb.get_dict_cursor()
        try:
            params = [self.r["description"],
                      self.r["tags"],
                      self.r["file_datetime"],
                      self.r["file_datetime_tz"],
                      self.r["export_filename"],
                      kioskdatetimelib.get_utc_now(),
                      user_time_zone_index,
                      modified_by,
                      self.r["uid"]]
            # print(sql, params)
            cur.execute(sql, params)
            cur.close()
            KioskSQLDb.commit()
            # print(f"attempt to update {self.r['uid']} done", flush=True)
            return True
        except Exception as e:
            logging.error("Exception in " + repr(e))
            try:
                cur.close()
            finally:
                pass
            return False

    def _get_identifiers_and_recording_contexts(self):
        """
            sets the key "identifiers", "indirect identifiers" and "identifiers_recording_contexts"
        """
        cur = KioskSQLDb.get_dict_cursor()
        identifiers_recording_contexts = {}
        indirect_contexts = {}
        self.r["indirect_contexts"] = indirect_contexts

        try:
            cur.execute(f"select" + " * from "
                                    f"{KioskSQLDb.sql_safe_namespaced_table(CONTEXT_CACHE_NAMESPACE, 'file_identifier_cache')} "
                                    f"where data=%s", [self.uid])
            r = cur.fetchone()
            while r:
                if r["primary"]:
                    identifiers_recording_contexts[r["identifier"]] = ModelFileRepository.get_recording_context_alias(
                        r["record_type"])
                else:
                    try:
                        record_type = kioskglobals.identifier_cache.get_recording_contexts(r["identifier"])[0][0]
                        record_type = ModelFileRepository.get_recording_context_alias(record_type)
                    except KeyError:
                        record_type = "?"

                    indirect_contexts[r["identifier"]] = record_type
                r = cur.fetchone()
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}._get_identifiers_and_recording_contexts: {repr(e)}")
        finally:
            cur.close()
        self.r["identifiers"] = ", ".join(identifiers_recording_contexts.keys())
        self.r["identifiers_recording_contexts"] = identifiers_recording_contexts
        if not indirect_contexts:
            self.r["indirect_contexts"] = {}
        else:
            self.r["indirect_contexts"] = indirect_contexts


class ModelFileRepository:
    """ ModelFileRepository provides data around files in the file repository.

    .. Attention

        In the current version the Model does not work with the dataset definition.
        It does not support file-fields in tables other than a central table called
        "images" (hardwired name). It also does not support more than one field in this
        table.

    """

    MAX_RECORDS_PER_CHUNK = 20
    ACCEPTED_FILTER_FIELDS = ["context", "recording_context", "tags", "description", "no_context",
                              "from_date", "to_date"]
    SORTING_OPTIONS = ["context", "oldest first", "latest first", "undated, then latest first"]

    def __init__(self, conf, plugin_name):
        self.filter_options = {"records_per_chunk": self.MAX_RECORDS_PER_CHUNK}
        self.conf = conf
        self.file_repos = FileRepository(conf)
        self.plugin_controller = get_plugin_for_controller(plugin_name)
        self.sorting_option = self.SORTING_OPTIONS[0]

    def set_filter_values(self, options):
        if "filter_values" not in self.filter_options:
            self.filter_options["filter_values"] = {}

        for o, value in options.items():
            if o not in self.ACCEPTED_FILTER_FIELDS:
                logging.error("ModelFileRepository.set_filter_values: field " + o + " unknown and ignored.")
                raise Exception("Bad Request")
            else:
                self.check_filter_option(o, value)

    @staticmethod
    def guess_year(year_str) -> int:
        if year_str.isnumeric():
            year = int(year_str)
            if 0 < year < 100 or 999 < year:
                return kioskdatetimelib.interpolate_year(year)
        return 0

    def check_filter_option(self, option, value):
        if option == "from_date" and value:
            if not kioskstdlib.guess_datetime(value):
                year = self.guess_year(str(value))
                if year:
                    value = str.format('{0:4d}-01-01', year)
                else:
                    raise ValueError("Please enter a valid date or year in 'from'.")
        elif option == "to_date" and value:
            if not kioskstdlib.guess_datetime(value):
                year = self.guess_year(str(value))
                if year:
                    value = str.format('{0:4d}-12-31', year)
                else:
                    raise ValueError("Please enter a valid date or year in 'to'.")

        self.filter_options["filter_values"][option] = value

    def _get_where(self, file_identifier_cache_table_name):
        """
        This is really baaaad code. It is so bad. But it will be completely removed and changed one day, anyhow.
        Currently it is not using a dsd and everything is entirely hardcoded.
        todo: massive refactoring. And shame on me!
        :return:
        """
        sql = ""
        conjunction = ""
        params = []
        for o in self.filter_options["filter_values"]:
            where_part = ""
            param = None
            param2 = None
            param3 = None
            param4 = None
            param5 = None
            # print(o)

            if o == "tags" and self.filter_options["filter_values"][o]:
                tags = reduce((lambda tags, tag: tags + "|" + tag.lower()),
                              self.filter_options["filter_values"][o].split(","))
                where_part = "substring(tags from %s) <> ''"
                param = tags
            elif o in ["context"]:
                if self.filter_options["filter_values"]["no_context"]:
                    where_part = f" {file_identifier_cache_table_name}.\"data\" is null "
                    param = None
                else:
                    if self.filter_options["filter_values"][o]:
                        # where_part = " file_identifier_cache.identifier ilike %s"
                        where_part = f" {file_identifier_cache_table_name}.\"identifier\" ilike %s"
                        param = kioskstdlib.escape_backslashs(self.filter_options["filter_values"][o])
            elif o in ["description"] and self.filter_options["filter_values"][o]:
                # todo: This is really horribly hardcoded and must go one day.
                #  referring to tables with recording data by name is a no-go
                #  deprecated: Throw this out once Q&V has a full text search.
                where_part = f"""
                    (({file_identifier_cache_table_name}.\"description\" ilike %s 
                        or images.description ilike %s 
                        or cast(images.uid as VARCHAR) = %s)
                        or images.uid in 
                        ( 
                            select cm_photo.uid_photo from collected_material_photo cm_photo
                            inner join collected_material cm on cm_photo.uid_cm = cm.uid
                            left outer join small_find sf on cm_photo.uid_cm = sf.uid_cm
                            where
                            concat(cm.description, ' ', sf.material, ' ')
                            ilike %s                
                        )
                        or images.export_filename ilike %s   
                    ) """
                param = kioskstdlib.escape_backslashs("%" + self.filter_options["filter_values"][o] + "%")
                param2 = kioskstdlib.escape_backslashs("%" + self.filter_options["filter_values"][o] + "%")
                param3 = self.filter_options["filter_values"][o]
                param4 = param
                param5 = param
            elif o == "recording_context" and self.filter_options["filter_values"][o]:
                where_part = f"{file_identifier_cache_table_name}.record_type = %s"
                param = self.filter_options["filter_values"][o]
            elif o == "from_date" and self.filter_options["filter_values"][o]:
                where_part = f"date(file_datetime) >= %s"
                param = kioskstdlib.guess_datetime(self.filter_options["filter_values"][o])
            elif o == "to_date" and self.filter_options["filter_values"][o]:
                where_part = f"date(file_datetime) <= %s"
                param = kioskstdlib.guess_datetime(self.filter_options["filter_values"][o])
            else:
                if o != "no_context" and self.filter_options["filter_values"][o]:
                    raise Exception(f"what is {o}?")

            if where_part:
                # print(where_part)
                sql = sql + conjunction + where_part
                conjunction = " and "
                if param:
                    params.append(param)
                if param2:
                    params.append(param2)
                if param3:
                    params.append(param3)
                if param4:
                    params.append(param4)
                if param5:
                    params.append(param5)
        if sql:
            sql = "where " + sql
        return sql, params

    def _get_order(self):
        if self.sorting_option == "context":
            return "order by identifiers, \"file_datetime\""
        elif self.sorting_option == "oldest first":
            return "order by \"file_datetime\", \"identifiers\""
        elif self.sorting_option == self.SORTING_OPTIONS[2]:
            return "order by \"sort_fd\" desc, \"identifiers\""
        elif self.sorting_option == self.SORTING_OPTIONS[3]:
            return "order by \"file_datetime\" desc, \"identifiers\""
        else:
            logging.error(f"{self.__class__.__name__}._get_order: unknown sorting order "
                          f"'{self.sorting_option}' selected.")
            return "order by identifiers, \"file_datetime\""

    def query_image_count(self):
        cur = KioskSQLDb.get_dict_cursor()
        file_identifier_cache_table_name = KioskSQLDb.sql_safe_namespaced_table(CONTEXT_CACHE_NAMESPACE,
                                                                                'file_identifier_cache')
        sql_where, params = self._get_where(file_identifier_cache_table_name)
        if sql_where:
            sql_where = " " + sql_where
        sql = "select " + "  count(distinct images.uid) c from images " \
                          f"left outer join " \
                          f"{file_identifier_cache_table_name} " \
                          f"on images.uid={file_identifier_cache_table_name}.\"data\"::uuid {sql_where};"
        # pprint.pprint(sql)
        try:
            cur.execute(sql, params)
            logging.debug(f"sql: {str(cur.query)}")
            r = cur.fetchone()
            cur.close()
            if r:
                return r["c"]
        except Exception as e:
            logging.error("Exception in ModelFileRepository.query_image_count: " + repr(e))
            logging.error("ModelFileRepository.query_image_count: KioskSQLDb.rollback!")
            logging.debug(sql)
            KioskSQLDb.rollback()
            cur.close()
        return None

    def query_images(self):
        result = []
        cur = KioskSQLDb.get_dict_cursor()
        file_identifier_cache_table_name = KioskSQLDb.sql_safe_namespaced_table(CONTEXT_CACHE_NAMESPACE,
                                                                                'file_identifier_cache')
        sql_where, params = self._get_where(file_identifier_cache_table_name)
        sql_order = self._get_order()

        if sql_where:
            sql_where = " " + sql_where
        if sql_order:
            sql_order = " " + sql_order

        sql = "select " + f" distinct images.*, COALESCE(\"file_datetime\", '0001-01-01') sort_fd, " \
                          "array_to_string(identifier_array, ', ') identifiers from \"images\" " \
                          f"left outer join " \
                          f"{file_identifier_cache_table_name} " \
                          f"on images.uid={file_identifier_cache_table_name}.data::uuid " + \
              f"left outer join (select {file_identifier_cache_table_name}.\"data\", " \
              f"array_agg({file_identifier_cache_table_name}.\"identifier\") \"identifier_array\" " + \
              f"from {file_identifier_cache_table_name} " \
              f"where {file_identifier_cache_table_name}.\"primary\" = True " \
              f"group by {file_identifier_cache_table_name}.\"data\") id_array " + \
              "on images.uid = id_array.data" + \
              sql_where + sql_order + ";"
        try:
            cur.execute(sql, params)
            # print(cur.query)

            file_description_fields = self.file_repos.get_file_fields_with_description_fields()
            file_description_priorities = get_file_description_priorities(self.plugin_controller)

            r = cur.fetchone()
            while r:
                try:
                    result.append(
                        FileRepositoryFile(self.plugin_controller, dict(r),
                                           file_description_fields, file_description_priorities))
                except Exception as e:
                    msg = "Error instantiating a FileRepositoryFile. Aborting process: " + repr(e)
                    raise Exception(msg)

                r = cur.fetchone()
            cur.close()
            return result
        except Exception as e:
            logging.error("Exception in ModelFileRepository.query_images: " + repr(e))
            cur.close()
            KioskSQLDb.rollback()
        return []

    def get_image(self, uuid) -> FileRepositoryFile:
        cur = KioskSQLDb.get_dict_cursor()
        # sql = "select " + " distinct images.*, array_to_string(identifier_array, ',') identifiers from \"images\" " \
        #                   "left outer join file_identifier_cache on images.uid=file_identifier_cache.uid_file " \
        #       "left outer join (select uid_file, " \
        #       "array_agg(concat(\"identifier\", '(', \"recording_context\", ')')) \"identifier_array\" " \
        #       "from file_identifier_cache where \"primary\"=1 group by uid_file) id_array " \
        #       "on images.uid = id_array.uid_file where images.uid=%s;"
        sql = "select " + " distinct images.* from \"images\" " \
                          " where images.uid=%s;"
        try:
            cur.execute(sql, [uuid])
            r = cur.fetchone()
            if r:
                cur.close()

                return (FileRepositoryFile(self.plugin_controller, dict(r),
                                           self.file_repos.get_file_fields_with_description_fields(),
                                           get_file_description_priorities(self.plugin_controller)))
        except Exception as e:
            logging.error("Exception in FileRepository.get_image" + repr(e))
        finally:
            try:
                cur.close()
            finally:
                pass
        return None

    def get_images(self, uuids: List[str]) -> List[FileRepositoryFile]:
        """
        returns a list of FileRepositoryFile files. Beware: It is slow for a larger number of files.
        Don't call with an empty list!
        :param uuids: a list of file uuids
        :return: a List of FileRepositoryFile instances
        :raises: An exception only in case the list is empty
        """
        if not uuids:
            raise Exception("get_images called with an empty query list.")

        cur = KioskSQLDb.get_dict_cursor()
        sql = "select " + f" distinct * from {KioskSQLDb.sql_safe_ident('images')} "

        result = []
        try:
            where = "where uid in (" + ",".join(DatabaseDriver.quote_value("VARCHAR", uuid) for uuid in uuids)
            where = where + ")"
            sql += where

            cur.execute(sql)
            r = cur.fetchone()
            while r:
                result.append(FileRepositoryFile(self.plugin_controller, dict(r),
                                                 self.file_repos.get_file_fields_with_description_fields(),
                                                 get_file_description_priorities(self.plugin_controller)))
                r = cur.fetchone()

        except Exception as e:
            logging.error("Exception in FileRepository.get_image" + repr(e))
        finally:
            try:
                cur.close()
            finally:
                pass
        return result

    def get_image_tags(self, uuids: List[str]) -> Dict[str, List[str]]:
        """
        somewhat special but fast way to get all the tags used by a list of files
        :param uuids: a list of file uuids
        :return: a dictionary with uuid as the key and a List[str] with the tags of that file.
                 Tags are uppercase and stripped of quotes
        :raises: can throw all kinds of exceptions
        """
        if not uuids:
            raise Exception("get_image_tags called with an empty query list.")

        cur = KioskSQLDb.get_dict_cursor()
        sql = "select uid, tags" + f" from {KioskSQLDb.sql_safe_ident('images')} "

        result = {}
        try:
            where = "where coalesce(tags, '') != '' and uid in (" + ",".join(
                DatabaseDriver.quote_value("VARCHAR", uuid) for uuid in uuids)
            where = where + ")"
            sql += where

            cur.execute(sql)
            r = cur.fetchone()
            while r:
                result[r["uid"]] = [tag.strip("\" ") for tag in kioskstdlib.null_val(r["tags"], "").split(",") if
                                    tag.strip("\" ") != ""]
                r = cur.fetchone()

        except Exception as e:
            logging.error(f"{self.__class__.__name__}.get_image_tags: Exception {repr(e)}")
            raise e
        finally:
            try:
                cur.close()
            finally:
                pass
        return result

    @staticmethod
    def get_thumbnail_types():
        """
        returns a dictionary of the representation types defined in config/file_repository/thumbnails

        :return:  {representation_label: representation_id} or {} if there are none
        """
        return FileRepository.get_thumbnail_types(kioskglobals.cfg)
        # result = {}
        #
        # thumbnail_ids = kioskglobals.cfg.file_repository["thumbnails"]
        # for key in thumbnail_ids:
        #     try:
        #         result[kioskglobals.cfg.file_repository["representations"][key]["label"]] = key
        #     except KeyError:
        #         result[key] = key
        # return result

    def get_sorting_options(self):
        result = self.SORTING_OPTIONS
        return result

    def get_tags(self):
        cur = KioskSQLDb.get_dict_cursor()
        sql = "select distinct tags from \"images\" where coalesce(tags, '\"\"') not in ('\"\"','') order by tags;"
        tags = []
        try:
            cur.execute(sql)
            r = cur.fetchone()
            while r:
                tag_str: str = r["tags"]
                if tag_str:
                    tags.extend([tg.strip("\" ") for tg in tag_str.split(",") if tg.strip("\" ") != ""])
                r = cur.fetchone()
            return set(tags)

        except Exception as e:
            logging.error(f"Exception in get_tags: {repr(e)}")

        return []

    @staticmethod
    def get_recording_context_alias(recording_context: str):
        """
        returns the alias for a recording context as it is configured under
        file_repository:
            recording_context_aliases:

        :param recording_context:
        :return: the alias if given or the recording_context
        """
        config = kioskglobals.cfg
        return config.get_recording_context_alias(recording_context)

    @staticmethod
    def get_recording_context_from_alias(alias: str):
        """
        returns the recording context for an alias as it is configured under
        file_repository:
            recording_context_aliases:
                recording_context: "alias"

        :param alias: the alias the recording context of which is needed
        :return: the recording_context for the alias (or what was given as alias itself)
        """
        config = kioskglobals.cfg
        recording_context = alias

        # noinspection PyBroadException
        try:
            aliases: dict = config["file_repository"]["recording_context_aliases"]
            recording_context = kioskstdlib.get_dict_key_from_value(aliases, alias)
        except BaseException as e:
            pass

        return recording_context

    @classmethod
    def get_aliased_recording_contexts(cls, recording_contexts: list = None) -> dict:
        """
        returns a dictionary with the recording contexts or, if available their aliases as keys and the
        recording context as value.

        :param recording_contexts: either a list of record types or this will query the file identifier cache for
                                   available record types.
        :return: dictionary with alias/record_type = record_type
        """
        d = {}
        if not recording_contexts:
            recording_contexts = cls.get_used_record_types()
        for c in recording_contexts:
            d[cls.get_recording_context_alias(c)] = c

        return d

    @classmethod
    def get_used_record_types(cls):
        cur = KioskSQLDb.get_dict_cursor()
        result = []
        try:
            cur.execute(f"select" +
                        f" distinct record_type from "
                        f"{KioskSQLDb.sql_safe_namespaced_table(CONTEXT_CACHE_NAMESPACE, 'file_identifier_cache')} ")

            r = cur.fetchone()
            while r:
                result.append(r["record_type"])
                r = cur.fetchone()
        except BaseException as e:
            logging.error(f"{cls.__name__}.get_used_record_types: {repr(e)}")
        finally:
            cur.close()

        return result
