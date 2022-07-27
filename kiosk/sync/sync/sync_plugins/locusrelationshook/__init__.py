import logging
from typing import Union

from dsd.dsd3singleton import Dsd3Singleton
from sync_config import SyncConfig
from synchronization import Synchronization
from synchronizationplugin import SynchronizationPlugin
from kiosksqldb import KioskSQLDb

_plugin_ = None


class PluginLocusRelationsHook(SynchronizationPlugin):
    _plugin_version = 0.1
    MAX_RELATIONS_REPORT = 20

    sql_relation_types_template = "with " + """
    relation_types as (
        select * from %s
        )
        """

    sql_relation_chron_types_template = """
    ,relation_chron_types as (
        select * from %s
        )
        """

    sql_set_r1_image = """
-- set image in r1 if it does not have one but r2 has one
update locus_relations set uid_sketch = r2_images.uid_sketch
from (
    select r1.uid, r2.uid_sketch from locus_relations r1
        inner join relation_types on r1.type = relation_types.r1
        inner join locus_relations r2
            on r1.uid_locus = r2.uid_locus_2_related and
               r2.uid_locus = r1.uid_locus_2_related and
               r2.type = relation_types.r2
    where r1.uid_locus is not null and r1.uid_locus_2_related is not null and
          r2.uid_locus is not null and r2.uid_locus_2_related is not null and
          r1.type is not null and r2.type is not null
          and r1.modified > r2.modified
          and r1.uid_sketch is null
          and r2.uid_sketch is not null
    ) as r2_images
where r2_images.uid = locus_relations.uid;
    """

    sql_delete_r2_without_image_insert_delete_uids = """
    insert into repl_deleted_uids(deleted_uid, "table", repl_workstation_id, modified)
        select distinct r2.uid, 'locus_relations', 'kiosk', now() from locus_relations r1
        inner join relation_types on r1.type = relation_types.r1
        inner join locus_relations r2
            on r1.uid_locus = r2.uid_locus_2_related and
               r2.uid_locus = r1.uid_locus_2_related and
               r2.type = relation_types.r2
    where r1.uid_locus is not null and r1.uid_locus_2_related is not null and
          r2.uid_locus is not null and r2.uid_locus_2_related is not null and
          r1.type is not null and r2.type is not null
          and r1.modified > r2.modified
          and r1.uid_sketch is not null
          and r2.uid_sketch is null
        """

    sql_delete_r2_without_image = """
delete from locus_relations where uid in (
    select r2.uid from locus_relations r1
        inner join relation_types on r1.type = relation_types.r1
        inner join locus_relations r2
            on r1.uid_locus = r2.uid_locus_2_related and
               r2.uid_locus = r1.uid_locus_2_related and
               r2.type = relation_types.r2
    where r1.uid_locus is not null and r1.uid_locus_2_related is not null and
          r2.uid_locus is not null and r2.uid_locus_2_related is not null and
          r1.type is not null and r2.type is not null
          and r1.modified > r2.modified
          and r1.uid_sketch is not null
          and r2.uid_sketch is null
    );"""

    sql_create_missing_relations = """
insert into locus_relations(uid_locus, uid_locus_2_related, type, uid_sketch, created, modified, modified_by)
select uid_locus_2_related uid_locus, uid_locus uid_locus_2_related, relation_types.r2, uid_sketch,
       now(), now(), 'sys'  from locus_relations
inner join locus on locus_relations.uid_locus = locus.uid
inner join locus related_locus on locus_relations.uid_locus_2_related = related_locus.uid
inner join relation_types on locus_relations.type=relation_types.r1
where locus_relations.uid not in (
select r1.uid from locus_relations r1 inner join locus_relations r2
    on r1.uid_locus = r2.uid_locus_2_related and
       r2.uid_locus = r1.uid_locus_2_related and
       r2.type = relation_types.r2
where r1.uid_locus is not null and r1.uid_locus_2_related is not null and
      r2.uid_locus is not null and r2.uid_locus_2_related is not null and
          r1.type is not null and r2.type is not null)
"""

    sql_create_missing_relations_v3 = """
    insert into locus_relations(uid_locus, uid_locus_2_related, type, chronology, uid_sketch, created, modified, modified_by)
    select uid_locus_2_related uid_locus, uid_locus uid_locus_2_related, relation_types.r2, 
           relation_chron_types.r2, uid_sketch,
           now(), now(), 'sys'  from locus_relations
    inner join locus on locus_relations.uid_locus = locus.uid
    inner join locus related_locus on locus_relations.uid_locus_2_related = related_locus.uid
    inner join relation_types on locus_relations.type=relation_types.r1
    left outer join relation_chron_types on locus_relations.chronology=relation_chron_types.r1
    where locus_relations.uid not in (
    select r1.uid from locus_relations r1 inner join locus_relations r2
        on r1.uid_locus = r2.uid_locus_2_related and
           r2.uid_locus = r1.uid_locus_2_related and
           r2.type = relation_types.r2
    where r1.uid_locus is not null and r1.uid_locus_2_related is not null and
          r2.uid_locus is not null and r2.uid_locus_2_related is not null and
              r1.type is not null and r2.type is not null)
    """

    sql_update_sketch_descriptions = """
update locus_relations
set sketch_description=locus.arch_context || ' ' || locus_relations.type || ' ' || related_locus.arch_context
from locus, locus related_locus
where locus_relations.uid_locus=locus.uid
  and locus_relations.uid_locus_2_related=related_locus.uid
and locus_relations.uid_sketch is not null;
    """

    sql_clear_sketch_descriptions = """
    update locus_relations
    set sketch_description=Null
    where locus_relations.uid_sketch is null and locus_relations.sketch_description is not null
    """

    sql_test_relations = """
select count(distinct r1.uid) c from locus_relations r1
--     inner join locus_relations r2
--     on r1.uid_locus = r2.uid_locus_2_related and
--        r1.uid_locus_2_related = r2.uid_locus
    left outer join relation_types on r1.type = relation_types.r1
    left outer join locus on r1.uid_locus = locus.uid
    left outer join locus related_locus on r1.uid_locus_2_related = related_locus.uid
where r1.uid not in (
    select r1.uid
    from locus_relations r1
             inner join relation_types on r1.type = relation_types.r1
             inner join locus_relations r2
                        on r1.uid_locus = r2.uid_locus_2_related and
                           r1.uid_locus_2_related = r2.uid_locus and
                           r2.type = relation_types.r2
             inner join locus on r1.uid_locus = locus.uid and r2.type = relation_types.r2
             inner join locus related_locus on r1.uid_locus_2_related = related_locus.uid
)"""

    sql_test_relations_report = """
        select distinct CONCAT(locus.arch_context, ' ', r1.type,' ', related_locus.arch_context) line from
               locus_relations r1
            left outer join relation_types on r1.type = relation_types.r1
            left outer join locus on r1.uid_locus = locus.uid
            left outer join locus related_locus on r1.uid_locus_2_related = related_locus.uid
        where r1.uid not in (
            select r1.uid
            from locus_relations r1
                     inner join relation_types on r1.type = relation_types.r1
                     inner join locus_relations r2
                                on r1.uid_locus = r2.uid_locus_2_related and
                                   r1.uid_locus_2_related = r2.uid_locus and
                                   r2.type = relation_types.r2
                     inner join locus on r1.uid_locus = locus.uid and r2.type = relation_types.r2
                     inner join locus related_locus on r1.uid_locus_2_related = related_locus.uid
            )"""


    def all_plugins_ready(self):
        app: Synchronization = self.app
        app.events.subscribe("synchronization", "after_synchronization", self.manage_locus_relations)
        logging.debug(f"PluginLocusRelationsHook subscribed to synchronization.after_synchronization")

    def manage_locus_relations(self):
        logging.debug(f"{self.__class__.__name__}.manage_locus_relations: called.")
        config = SyncConfig.get_config()

        chron_types_sql = self.get_sql_relation_chron_types()
        if chron_types_sql:
            return self.manage_locus_relations_v3(chron_types_sql)
        else:
            return self.manage_locus_relations_v2()

    def manage_locus_relations_v3(self, chron_types_sql):
        def execute(sql, text=""):
            rc = KioskSQLDb.execute(sql)
            if text:
                if rc:
                    logging.info(f"{rc} {text}.")
                else:
                    logging.debug(f"{self.__class__.__name__}.manage_locus_relations: {rc} {text}.")

        try:
            logging.debug(f"{self.__class__.__name__}.manage_locus_relations_v2: called.")
            config = SyncConfig.get_config()
            sql_relation_types = self.sql_relation_types_template % self.get_sql_relation_types(config)
            sql_relation_chron_types = self.sql_relation_chron_types_template % self.get_sql_relation_chron_types()
            logging.debug(f"{self.__class__.__name__}.manage_locus_relations (relation_types): {sql_relation_types}")
            logging.debug(f"{self.__class__.__name__}.manage_locus_relations (relation_chron_types):"
                          f" {sql_relation_chron_types}")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.manage_locus_relations: {repr(e)}")
            return False

        try:
            # set image in dominant relation (the newer one) if the subordinate relation has one
            sql = sql_relation_types + " " + self.sql_set_r1_image
            execute(sql, "images copied from subordinate relation.")

            # delete subordinate relations that don't have an image while the dominant relation has one
            # add them to repl_deleted_uids first
            sql = sql_relation_types + " " + self.sql_delete_r2_without_image_insert_delete_uids
            execute(sql, " subordinate locus relations will be recreated because the dominant relation has an image.")

            # now delete them
            sql = sql_relation_types + " " + self.sql_delete_r2_without_image
            execute(sql)

            # create subordinate relations that are missing
            sql = sql_relation_types + " " + sql_relation_chron_types + " " + self.sql_create_missing_relations_v3
            execute(sql, " opposite locus relations (v3) created.")

            # set correct sketch_description
            sql = self.sql_update_sketch_descriptions
            execute(sql, " locus relation sketch descriptions updated.")

            sql = self.sql_clear_sketch_descriptions
            execute(sql, " locus relation sketch descriptions removed because the sketch had been deleted.")

            KioskSQLDb.commit()
            logging.info(f"locus relations successfully updated.")

            self.test_relations(sql_relation_types)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.manage_locus_relations: {repr(e)}")
            try:
                KioskSQLDb.rollback()
                logging.error(f"{self.__class__.__name__}.manage_locus_relations: rolled back.")
            except BaseException as e2:
                logging.error(f"{self.__class__.__name__}.manage_locus_relations: error when rolling back: {repr(e2)}")
        return False

    def test_relations(self, sql_relation_types):
        try:
            sql = sql_relation_types + " " + self.sql_test_relations
            rc = KioskSQLDb.get_field_value_from_sql("c", sql)
            if rc:
                logging.warning(f"{rc} locus relations still have issues that cannot be fixed automatically:")
                cur = KioskSQLDb.execute_return_cursor(sql_relation_types + " " + self.sql_test_relations_report)
                r = cur.fetchone()
                c = 0
                while r and c < self.MAX_RELATIONS_REPORT:
                    logging.info(f"{r[0]}")
                    c += 1
                    if c == self.MAX_RELATIONS_REPORT:
                        logging.warning(f"stopped to report problematic relations after {self.MAX_RELATIONS_REPORT}")

                    r = cur.fetchone()

        except BaseException as e:
            logging.warning(f"{self.__class__.__name__}.manage_locus_relations Exception when testing "
                            f"results: {repr(e)}")

    def manage_locus_relations_v2(self):
        def execute(sql, text=""):
            rc = KioskSQLDb.execute(sql)
            if text:
                if rc:
                    logging.info(f"{rc} {text}.")
                else:
                    logging.debug(f"{self.__class__.__name__}.manage_locus_relations: {rc} {text}.")

        try:
            logging.debug(f"{self.__class__.__name__}.manage_locus_relations_v2: called.")
            config = SyncConfig.get_config()
            sql_relation_types = self.sql_relation_types_template % self.get_sql_relation_types(config)
            logging.debug(f"{self.__class__.__name__}.manage_locus_relations (relation_types): {sql_relation_types}")
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.manage_locus_relations: {repr(e)}")
            return False

        try:
            # set image in dominant relation (the newer one) if the subordinate relation has one
            sql = sql_relation_types + " " + self.sql_set_r1_image
            execute(sql, "images copied from subordinate relation.")

            # delete subordinate relations that don't have an image while the dominant relation has one
            # add them to repl_deleted_uids first
            sql = sql_relation_types + " " + self.sql_delete_r2_without_image_insert_delete_uids
            execute(sql, " subordinate locus relations will be recreated because the dominant relation has an image.")

            # now delete them
            sql = sql_relation_types + " " + self.sql_delete_r2_without_image
            execute(sql)

            # we don't do this because some projects have two types of relations between the same loci and
            # that cannot be distinguished from just two types that don't match.

            # # delete subordinate relations the type of which does not match the dominant relation
            # # add them to repl_deleted_uids first
            # sql = sql_relation_types + " " + self.sql_delete_odd_opposites_insert_to_deleted_uids
            # rc = KioskSQLDb.execute(sql)
            # logging.debug(f"{self.__class__.__name__}.manage_locus_relations: "
            #               f"{rc} rows affected by sql_delete_odd_opposites_insert_to_deleted_uids")
            #
            # # then delete them
            # sql = sql_relation_types + " " + self.sql_delete_odd_opposites
            # rc = KioskSQLDb.execute(sql)
            # logging.debug(f"{self.__class__.__name__}.manage_locus_relations: "
            #               f"{rc} rows affected by sql_delete_odd_opposites")

            # create subordinate relations that are missing
            sql = sql_relation_types + " " + self.sql_create_missing_relations
            execute(sql, " opposite locus relations created.")

            # set correct sketch_description
            sql = self.sql_update_sketch_descriptions
            execute(sql, " locus relation sketch descriptions updated.")

            sql = self.sql_clear_sketch_descriptions
            execute(sql, " locus relation sketch descriptions removed because the sketch had been deleted.")

            KioskSQLDb.commit()
            logging.info(f"locus relations successfully updated.")

            self.test_relations(sql_relation_types)
            return True
        except BaseException as e:
            logging.error(f"{self.__class__.__name__}.manage_locus_relations: {repr(e)}")
            try:
                KioskSQLDb.rollback()
                logging.error(f"{self.__class__.__name__}.manage_locus_relations: rolled back.")
            except BaseException as e2:
                logging.error(f"{self.__class__.__name__}.manage_locus_relations: error when rolling back: {repr(e2)}")
        return False

    def get_sql_relation_types(self, config):
        relation_types = self.get_relation_types_from_constants(config)
        if not relation_types:
            relation_types = self.get_relation_types_from_config(config)
        if not relation_types:
            raise Exception("relation types are neither configured in the constants table nor in the config.")

        relation_types_left = []
        relation_types_right = []
        sql_relation_types_left = ''
        sql_relation_types_right = ''
        for k, v in relation_types.items():
            relation_types_left.append(f"'{k}'")
            relation_types_right.append(f"'{v}'")

        sql_relation_types_left = "Array[" + ",".join(relation_types_left) + "]"
        sql_relation_types_right = "Array[" + ",".join(relation_types_right) + "]"
        sql = f'unnest({sql_relation_types_left}, {sql_relation_types_right}) as relation_types("r1","r2")'

        return sql

    def get_sql_relation_chron_types(self) -> Union[None, str]:
        """
        returns the sql string that contains the chronological relations and their opposites
        :returns: either the sql string or None if for some reason this feature does not apply or an error occured
        """
        dsd = master_dsd = Dsd3Singleton.get_dsd3()
        if dsd.get_current_version("locus_relations") < 3:
            logging.warning(f"{self.__class__.__name__}.get_sql_relation_chron_types: "
                            f"chronology not fixed in locus_relations < 3.")
            return None

        chron_relation_types = self.get_chron_relation_types_from_constants()
        if not chron_relation_types:
            logging.error(f"{self.__class__.__name__}.get_sql_relation_chron_types: "
                          f"valuelist_locus_relations_chron_opposites not configured in table config")
            return None

        relation_types_left = []
        relation_types_right = []
        sql_relation_types_left = ''
        sql_relation_types_right = ''
        for k, v in chron_relation_types.items():
            relation_types_left.append(f"'{k}'")
            relation_types_right.append(f"'{v}'")

        sql_relation_types_left = "Array[" + ",".join(relation_types_left) + "]"
        sql_relation_types_right = "Array[" + ",".join(relation_types_right) + "]"
        sql = f'unnest({sql_relation_types_left}, {sql_relation_types_right}) as chron_relation_types("r1","r2")'

        return sql

    def get_relation_types_from_constants(self, config) -> dict:
        return self.get_key_value_pair_from_constants("valuelist_locus_relations_opposites")

    def get_chron_relation_types_from_constants(self) -> dict:
        return self.get_key_value_pair_from_constants("valuelist_locus_relations_chron_opposites")

    @staticmethod
    def get_key_value_pair_from_constants(key):
        cur = KioskSQLDb.execute_return_cursor(f"select * from constants where id='{key}'")
        try:
            key_value_pair = dict()
            r = cur.fetchone()
            if r:
                if r["value"]:
                    pairs = [line.split("=") for line in r["value"].splitlines()]
                    for pair in pairs:
                        key_value_pair[pair[0].strip()] = pair[1].strip()
                        key_value_pair[pair[1].strip()] = pair[0].strip()
        finally:
            cur.close()

        return key_value_pair

    def get_relation_types_from_config(self, config: SyncConfig) -> dict:
        if config.has_key("relation_type_pairs"):
            relation_types = config.relation_type_pairs
            for k, v in list(relation_types.items()):
                relation_types[v] = k

            return relation_types
        else:
            return {}


# -----------------------------------------------------------
# Plugin - Code
# -----------------------------------------------------------
def instantiate_plugin_object(plugin_candidate, package, init_plugin_configuration={}):
    logging.debug(f"PluginLocusRelationsHook installed ")
    return PluginLocusRelationsHook(plugin_candidate, package)

    # if "project_id" in init_plugin_configuration and \
    #         init_plugin_configuration["project_id"].lower() in ["urap", "arch1900"]:
    # else:
    #     logging.error("Skipped PluginImportUrapHook because the project_id is not urap")
    #     return None
