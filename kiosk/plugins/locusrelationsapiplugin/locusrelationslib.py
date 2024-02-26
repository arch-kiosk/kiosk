import logging
import uuid

import nanoid
from psycopg2.extras import DictRow

from contextmanagement.kioskscopeselect import KioskScopeSelect
from dsd.dsd3 import DataSetDefinition
from kiosksqldb import KioskSQLDb


# identifies all locus relations in a given context
# the context is as usual spun by a record type and identifier

class LocusRelations:
    def __init__(self, record_type: str, identifier: str, dsd: DataSetDefinition):
        self.loci = []
        self.relations = []
        self._record_type = record_type
        self._identifier = identifier
        self._dsd = dsd

    def _get_direct_relations_sql(self):
        scope_select = KioskScopeSelect()
        scope_select.set_dsd(self._dsd)
        selects = scope_select.get_selects(self._record_type, target_types=["locus_relations"], add_lore=False)
        if len(selects) != 1 or len(selects[0]) != 2:
            raise Exception(f"{self.__class__.__name__}.get_all_relations: Can't get direct relations for "
                            f"{self._record_type}/{self._identifier}")
        return selects[0][1]

    def get_direct_relations(self):
        select = self._get_direct_relations_sql()
        sql = "SELECT " + f""" locus.uid, locus.arch_context, locus.alternate_id, 
                                           locus.description, locus.type, 
                                           locus_relations.type relation_type, 
                                           locus_relations.uid_sketch, 
                                           locus_relations.sketch_description,
                                           locus_relations.created,
                                           locus_relations.modified, locus_relations.modified_by
                                           from ({select}) tmp 
                           INNER JOIN locus_relations on tmp.uid = locus_relations.uid 
                           INNER JOIN locus on locus_relations.uid_locus = locus.uid"""
        return list(KioskSQLDb.get_records(sql, {"identifier": self._identifier.upper()}))

    def get_all_relations(self):
        select = self._get_direct_relations_sql()
        temp_table = nanoid.generate()
        self.loci = []
        self.relations = []
        try:
            sql = f"""{'CREATE'} TEMP TABLE {KioskSQLDb.sql_safe_ident(temp_table)} AS
            SELECT {KioskSQLDb.sql_safe_ident("uid")}, {KioskSQLDb.sql_safe_ident("uid_locus_2_related")} 
            FROM ({select}) t 
            """
            KioskSQLDb.execute(sql, {"identifier": self._identifier.upper()})
            KioskSQLDb.execute("ALTER " + f"TABLE {KioskSQLDb.sql_safe_ident(temp_table)} ADD PRIMARY KEY (uid)")
            assert KioskSQLDb.does_temp_table_exist(temp_table)
            c_added = KioskSQLDb.get_record_count(temp_table, "uid")

            safety_rounds = 20
            while c_added > 0:
                sql = "INSERT INTO" + f""" {KioskSQLDb.sql_safe_ident(temp_table)} (uid, uid_locus_2_related) 
                       SELECT DISTINCT rel.uid, rel.uid_locus_2_related from {KioskSQLDb.sql_safe_ident(temp_table)} tmp
                        INNER JOIN locus_relations rel on tmp.uid_locus_2_related = rel.uid_locus
                        LEFT OUTER JOIN {KioskSQLDb.sql_safe_ident(temp_table)} as tmp2 on rel.uid = tmp2.uid
                        WHERE tmp2.uid IS NULL;
                      """
                c_added = KioskSQLDb.execute(sql)
                safety_rounds -= 1
                if safety_rounds < 1:
                    raise Exception(f"It took too many database requests to determine the locus relations "
                                    f"for {self._record_type}/{self._identifier}")

            sql = "SELECT " + f""" 
                                   locus.uid, 
                                   locus.arch_context, 
                                   locus_relations.uid_locus_2_related, 
                                   locus_relations.type relation_type,
                                   locus_relations.chronology, 
                                   locus_relations.uid_sketch, 
                                   locus_relations.sketch_description,
                                   locus_relations.created,
                                   locus_relations.modified, 
                                   locus_relations.modified_by
                                   from {KioskSQLDb.sql_safe_ident(temp_table)} tmp 
                   INNER JOIN locus_relations on tmp.uid = locus_relations.uid 
                   INNER JOIN locus on locus_relations.uid_locus = locus.uid"""
            self.relations = list(KioskSQLDb.get_records(sql, raise_exception=True))

            sql = "SELECT DISTINCT" + f""" 
                                   locus.uid, locus.arch_context, 
                                   locus.alternate_id, 
                                   locus.description, 
                                   locus.type,
                                   string_agg(distinct tagging.tag, '#') AS tags,
                                   locus.created,
                                   locus.modified, 
                                   locus.modified_by
                                   from {KioskSQLDb.sql_safe_ident(temp_table)} tmp 
                   INNER JOIN locus_relations on tmp.uid = locus_relations.uid 
                   INNER JOIN locus on locus_relations.uid_locus = locus.uid
                   LEFT OUTER JOIN tagging on locus.uid = tagging.source_uid 
                   GROUP BY locus.uid"""
            self.loci = list(KioskSQLDb.get_records(sql, raise_exception=True))

        except BaseException as e:
            self.loci = []
            self.relations = []
            logging.error(f"{self.__class__.__name__}.get_all_relations: {repr(e)}")

            raise e

        finally:
            try:
                if KioskSQLDb.does_temp_table_exist(temp_table):
                    KioskSQLDb.execute(f"drop table {KioskSQLDb.sql_safe_ident(temp_table)}")
            except BaseException:
                pass







