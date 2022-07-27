import pytest

from dsd.dsdyamlloader import DSDYamlLoader
from test.testhelpers import KioskPyTestHelper
import logging
import os
import kioskstdlib
from kiosksqldb import KioskSQLDb
from dsd.dsd3singleton import Dsd3Singleton
from sync_plugins.locusrelationshook import PluginLocusRelationsHook

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
locus_relations_2_dsd = os.path.join(test_path, r"config", "locus_relations_2_dsd.yml")


class TestLocusRelationsHook(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture()
    def urapdb_with_records(self, urapdb, shared_datadir):
        sql_records = os.path.join(shared_datadir, "sql_insert_locus_relations.sql")
        KioskSQLDb.run_sql_script(sql_records)
        return urapdb

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    # @pytest.fixture()
    # def dsd(self, urapdb):
    #     return Dsd3Singleton.get_dsd3()

    def test_connections(self, config, urapdb_with_records):
        assert config
        assert urapdb_with_records

    def test_get_relation_types_from_constants(self, cfg, urapdb_with_records):
        plugin = PluginLocusRelationsHook("locusrelationshook", "pluginlocusrelationshook")
        KioskSQLDb.execute("""insert into constants(id, value, uid, created, modified, modified_by)
        VALUES('valuelist_locus_relations_opposites', 'above=below' ||
                                                      '\rabuts = is abutted by' ||
                                                      '\rbelow = above' ||
                                                      '\rbonds with=bonds with' ||
                                                      '\rseals= is sealed by',
        '036603fa-2261-5045-a5eb-4d996e54352b','2020-02-10 21:53:39.000000','2020-02-10 22:15:41.000000','lkh');""")
        assert plugin
        assert plugin.get_relation_types_from_constants(cfg) == {"above": "below",
                                                                 "abuts": "is abutted by",
                                                                 "below": "above",
                                                                 "bonds with": "bonds with",
                                                                 'is abutted by': 'abuts',
                                                                 'is sealed by': 'seals',
                                                                 "seals": "is sealed by"}

    def test_get_relation_types_from_config(self, cfg, urapdb_with_records):
        plugin = PluginLocusRelationsHook("locusrelationshook", "pluginlocusrelationshook")
        assert plugin.get_relation_types_from_config(cfg) == {"above": "below",
                                                              "abuts": "is abutted by",
                                                              "below": "above",
                                                              "bonds with": "bonds with",
                                                              'is abutted by': 'abuts',
                                                              'is sealed by': 'seals',
                                                              "seals": "is sealed by"}

    def test_get_sql_relation_types(self, cfg, urapdb_with_records):
        plugin = PluginLocusRelationsHook("locusrelationshook", "pluginlocusrelationshook")
        KioskSQLDb.execute("""insert into constants(id, value, uid, created, modified, modified_by)
        VALUES('valuelist_locus_relations_opposites', 'above=below' ||
                                                      '\rbumps on = is bumped by' ||
                                                      '\rabuts = is abutted by' ||
                                                      '\rbelow = above' ||
                                                      '\rbonds with=bonds with' ||
                                                      '\rseals= is sealed by',
        '036603fa-2261-5045-a5eb-4d996e54352b','2020-02-10 21:53:39.000000','2020-02-10 22:15:41.000000','lkh');""")
        assert plugin
        assert plugin.get_relation_types_from_constants(cfg) == {"above": "below",
                                                                 "bumps on": "is bumped by",
                                                                 "abuts": "is abutted by",
                                                                 "below": "above",
                                                                 "bonds with": "bonds with",
                                                                 'is abutted by': 'abuts',
                                                                 'is bumped by': 'bumps on',
                                                                 'is sealed by': 'seals',
                                                                 "seals": "is sealed by"}
        relation_types_sql = plugin.get_sql_relation_types(cfg)
        assert relation_types_sql == f"unnest(Array['above','below','bumps on','is bumped by','abuts'," \
                                     f"'is abutted by','bonds with','seals','is sealed by'], " \
                                     f"Array['below','above','is bumped by','bumps on','is abutted by'," \
                                     f"'abuts','bonds with','is sealed by','seals']) " \
                                     f"as relation_types(\"r1\",\"r2\")"
        assert KioskSQLDb.get_field_value_from_sql("c", f"select count(r1) c from {relation_types_sql}") == 9

    def test_manage_locus_relations(self, cfg, urapdb_with_records, shared_datadir):
        plugin = PluginLocusRelationsHook("locusrelationshook", "pluginlocusrelationshook")
        sql_records = os.path.join(shared_datadir, "sql_insert_locus_records.sql")
        KioskSQLDb.run_sql_script(sql_records)
        sql = """
INSERT INTO public.constants (id, value, value_ts, category, comment, field_type, sync, uid, created, modified, modified_by, repl_deleted, repl_tag) VALUES ('valuelist_locus_relations_opposites', 'above=below
abuts=is abutted by
below=above
bonds with=bonds with
seals=is sealed by
is sealed by=seals
cuts through=cut by
cut by=cuts through
fills=is filled by
is adjacent to=is adjacent to
is abutted by=abuts
', null, 'valuelists', 'pairs of relations like this: 
abuts=is abutted
is abutted by=abuts
Make sure that every relation that calls for an opposite relation is mentioned on the left side if a pair. That is why both "abuts" and is "abutted by" lead in a separate line. The system will create the second term when the first one is selected. If a relation must not trigger an opposite relation, use "-" like this:
abuts=-. But that should not be necessary.', null, 1, '036603fa-2261-5045-a5eb-4d996e54352b', '2020-02-10 21:53:39.000000', '2020-02-10 22:15:41.000000', 'lkh', false, null);                          """
        assert KioskSQLDb.execute(sql)
        assert plugin
        assert plugin.manage_locus_relations()

    def test_get_sql_relation_chron_types_fails(self, cfg, urapdb_with_records, shared_datadir):
        Dsd3Singleton.release_dsd3()
        dsd = Dsd3Singleton.get_dsd3()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(locus_relations_2_dsd)
        assert dsd.get_current_version("locus_relations") == 2
        plugin = PluginLocusRelationsHook("locusrelationshook", "pluginlocusrelationshook")
        assert not plugin.get_sql_relation_chron_types()

    def test_get_sql_relation_chron_types(self, cfg, urapdb_with_records, shared_datadir):
        Dsd3Singleton.release_dsd3()
        dsd = Dsd3Singleton.get_dsd3()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(cfg.get_dsdfile())
        KioskSQLDb.execute("""insert into constants(id, value, uid, created, modified, modified_by)
        VALUES('valuelist_locus_relations_chron_opposites', 'earlier than=later than' ||
                                                      '\rlater than = earlier than' ||
                                                      '\rsame time as = same time as',
        '0f6603fa-2261-5045-a5eb-4d996e54352b','2020-02-10 21:53:39.000000','2020-02-10 22:15:41.000000','sys');""")
        dsd = Dsd3Singleton.get_dsd3()
        assert dsd.get_current_version("locus_relations") >= 3
        plugin = PluginLocusRelationsHook("locusrelationshook", "pluginlocusrelationshook")
        assert plugin.get_sql_relation_chron_types() == f"unnest(Array['earlier than','later than','same time as'], " \
                                                        f"Array['later than','earlier than','same time as']) " \
                                                        f"as chron_relation_types(\"r1\",\"r2\")"
