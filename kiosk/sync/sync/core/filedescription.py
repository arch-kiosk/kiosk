import copy
import logging
from collections import deque

from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb
from sync_config import SyncConfig


class FileDescription:
    # This is all horrible and needs massive refactoring
    # A version that works independently. But really, this is bad.
    # It is more or less a copy of ModelFileRepository.get_description_summary

    class FileDescriptionSet:
        def __init__(self, file_description_priorities):
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
            # if descriptions:
            #     self.next_group = None

        def get_description(self):
            result = ""
            for description in self.descriptions:
                if result:
                    result += ";\n" + description
                else:
                    result = description
            return result

    def __init__(self, cfg: SyncConfig, dsd: DataSetDefinition):
        self.file_description_fields = dsd.get_file_fields_with_description_fields()
        self.file_description_priorities = self.get_file_description_priorities(cfg)
        self.file_description_set = None

    def get_file_description_priorities(self, cfg: SyncConfig):
        priority_sets = cfg.kiosk["filerepositoryplugin"]["file_descriptions"]
        try:
            return copy.deepcopy(priority_sets[next(iter(priority_sets))])
        except Exception as e:
            logging.error(f"{self.__class__.__name__}.get_file_description_priorities: "
                          f"Can't load file description priorities from config: {repr(e)}")
            return {}

    def get_description_summary(self, uid, include_image_description=True,
                                         crlf="\n"):
        found = 0
        self.file_description_set = self.FileDescriptionSet(self.file_description_priorities)
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
                    if t != "images" or include_image_description:
                        for fld_pair in self.file_description_fields[t]:
                            cur.execute("select {} from {} where {}=%s".format(fld_pair[1], t, fld_pair[0]),
                                        [uid])
                            r = cur.fetchone()
                            while r:
                                # found += 1
                                # if found > 1:
                                #     logging.debug("image {} is referenced twice, yippieh!".format(self.get_value("uid")))

                                dsc = r[fld_pair[1]]
                                if dsc:
                                    dscs.append(dsc)

                                r = cur.fetchone()
                except Exception as e:
                    logging.error("Exception in FileDescription.get_description_summary: " + repr(e))
                    logging.debug(f"t: {t}")
                    return

                self.file_description_set.add_descriptions(dscs)
            t = self.file_description_set.get_next_table()

        s = self.file_description_set.get_description()
        if crlf != "\n":
            s = s.replace("\n", crlf)
        return s.strip(": ")
