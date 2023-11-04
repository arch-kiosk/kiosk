import datetime
import logging
import os
from pprint import pprint

import pytest

import kioskstdlib
from contextmanagement.kioskscopeselect import KioskScopeSelect
from dsd.dsd3 import DataSetDefinition, Join
from dsd.dsd3singleton import Dsd3Singleton
from dsd.dsdyamlloader import DSDYamlLoader
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
log_file = os.path.join(test_path, r"log", "test_log.log")
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")
lookup_test_dsd3 = os.path.join(test_path, r"config", "test_lookup_paths_test_dsd3.yml")


class TestKioskScopeSelect(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def urapdb(self, cfg):
        return self.get_urapdb(cfg)

    @pytest.fixture(scope="module")
    def urapdb_with_records(self, urapdb):
        KioskSQLDb.run_sql_script(sql_records)

    @pytest.fixture()
    def config(self, cfg, shared_datadir):
        self.set_file_repos_dir(cfg, shared_datadir)
        return cfg

    @pytest.fixture()
    def dsd(self, urapdb):
        return Dsd3Singleton.get_dsd3()

    def test_init(self, dsd):
        scope_select = KioskScopeSelect()
        scope_select.set_dsd(dsd)
        selects = scope_select.get_selects("unit", ["unit", "locus", "collected_material"],
                                           add_lore=False)
        assert [x[0] for x in selects] == ["unit", "locus", "collected_material"]
        assert selects[0][
                   1] == """select distinct "unit"."id","unit"."name","unit"."purpose","unit"."type","unit"."method","unit"."id_excavator","unit"."unit_creation_date","unit"."id_site","unit"."excavator_full_name","unit"."spider_counter","unit"."coordinates","unit"."legacy_unit_id","unit"."term_for_unit","unit"."term_for_locus","unit"."identification_method_loci","unit"."identification_method_cm","unit"."identification_method_analysis","unit"."arch_domain","unit"."arch_context","unit"."uid","unit"."created","unit"."modified","unit"."modified_by" from "unit" where "unit"."arch_context"=%(identifier)s"""
        assert selects[1][
                   1] == """select distinct "locus"."uid_unit","locus"."type","locus"."opening elevations","locus"."closing elevations","locus"."description","locus"."date_defined","locus"."date_closed","locus"."interpretation","locus"."colour","locus"."formation_process","locus"."id","locus"."arch_domain","locus"."arch_context","locus"."uid","locus"."created","locus"."modified","locus"."modified_by" from "unit" inner join "locus" on "unit"."uid"="locus"."uid_unit" where "unit"."arch_context"=%(identifier)s"""
        assert selects[2][
                   1] == """select distinct "collected_material"."uid_locus","collected_material"."external_id","collected_material"."uid_lot","collected_material"."type","collected_material"."description","collected_material"."isobject","collected_material"."date","collected_material"."storage","collected_material"."pottery_remarks","collected_material"."status_done","collected_material"."status_todo","collected_material"."dearregistrar","collected_material"."weight","collected_material"."period","collected_material"."quantity","collected_material"."is_grave_good","collected_material"."collection_method","collected_material"."id","collected_material"."arch_domain","collected_material"."arch_context","collected_material"."uid","collected_material"."created","collected_material"."modified","collected_material"."modified_by" from "unit" inner join "locus" on "unit"."uid"="locus"."uid_unit" inner join "collected_material" on "locus"."uid"="collected_material"."uid_locus" where "unit"."arch_context"=%(identifier)s"""

        for select in selects:
            r = KioskSQLDb.get_first_record_from_sql(select[1], {"identifier": "LA"})

    def test__get_lore_paths(self, dsd):
        scope_select = KioskScopeSelect()
        scope_select.set_dsd(dsd)
        scope_select._auto_context("site")
        result = scope_select._get_lore_paths("locus")
        assert result == [["unit", "locus"], ["site", "unit", "locus"]]
        result = scope_select._get_lore_paths("collected_material")
        assert result == [["locus", "collected_material"],
                          ["unit", "locus", "collected_material"],
                          ["site", "unit", "locus", "collected_material"]]

    def test_lore(self, dsd):
        scope_select = KioskScopeSelect()
        scope_select.set_dsd(dsd)
        selects = scope_select.get_selects("locus", ["locus", "locus_architecture", "locus_deposit"],
                                           add_lore=True)
        assert [x[0] for x in selects] == ["locus", "locus_architecture", "locus_deposit", "unit", "site"]
        assert selects[0][
                   1] == """select distinct "locus"."uid_unit","locus"."type","locus"."opening elevations","locus"."closing elevations","locus"."description","locus"."date_defined","locus"."date_closed","locus"."interpretation","locus"."colour","locus"."formation_process","locus"."id","locus"."arch_domain","locus"."arch_context","locus"."uid","locus"."created","locus"."modified","locus"."modified_by" from "locus" where "locus"."arch_context"=%(identifier)s"""

        assert selects[1][
                   1] == """select distinct "locus_architecture"."uid_locus","locus_architecture"."material","locus_architecture"."wall_thickness","locus_architecture"."preserved_height","locus_architecture"."features","locus_architecture"."brick_size","locus_architecture"."stone_size","locus_architecture"."mortar_desc","locus_architecture"."uid","locus_architecture"."created","locus_architecture"."modified","locus_architecture"."modified_by" from "locus" inner join "locus_architecture" on "locus"."uid"="locus_architecture"."uid_locus" where "locus"."arch_context"=%(identifier)s"""
        assert selects[2][
                   1] == """select distinct "locus_deposit"."uid_locus","locus_deposit"."material","locus_deposit"."compositions","locus_deposit"."gravel_prc","locus_deposit"."sand_prc","locus_deposit"."silt_prc","locus_deposit"."clay_prc","locus_deposit"."inclusions","locus_deposit"."description","locus_deposit"."uid","locus_deposit"."created","locus_deposit"."modified","locus_deposit"."modified_by" from "locus" inner join "locus_deposit" on "locus"."uid"="locus_deposit"."uid_locus" where "locus"."arch_context"=%(identifier)s"""
        assert selects[3][
                   1] == """select distinct "unit"."id","unit"."name","unit"."purpose","unit"."type","unit"."method","unit"."id_excavator","unit"."unit_creation_date","unit"."id_site","unit"."excavator_full_name","unit"."spider_counter","unit"."coordinates","unit"."legacy_unit_id","unit"."term_for_unit","unit"."term_for_locus","unit"."identification_method_loci","unit"."identification_method_cm","unit"."identification_method_analysis","unit"."arch_domain","unit"."arch_context","unit"."uid","unit"."created","unit"."modified","unit"."modified_by" from "unit" inner join "locus" on "unit"."uid"="locus"."uid_unit" where "locus"."arch_context"=%(identifier)s"""
        assert selects[4][
                   1] == """select distinct "site"."id","site"."purpose","site"."id_short","site"."uid_site_map","site"."arch_domain","site"."arch_context","site"."uid","site"."created","site"."modified","site"."modified_by" from "site" inner join "unit" on "site"."id"="unit"."id_site" inner join "locus" on "unit"."uid"="locus"."uid_unit" where "locus"."arch_context"=%(identifier)s"""

        for select in selects:
            r = KioskSQLDb.get_first_record_from_sql(select[1], {"identifier": "LA"})

    def test__get_additional_lookup_paths(self, cfg):
        Dsd3Singleton.release_dsd3()
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(lookup_test_dsd3)
        scope_select = KioskScopeSelect()
        scope_select.set_dsd(dsd)
        assert scope_select._get_additional_lookup_paths("locus") == [["locus_types"], ["locus_color"]]
        assert scope_select._get_additional_lookup_paths("recursion_test_1") == []
        assert scope_select._get_additional_lookup_paths("recursion_test_2") == [["recursion_test_1"]]
        assert scope_select._get_additional_lookup_paths("recursion_test_3") == [["recursion_test_2"]]
        assert scope_select._get_additional_lookup_paths("recursion_test_3", recursive=True) == [
            ["recursion_test_2"],
            ["recursion_test_2",
             "recursion_test_1"]]
        assert scope_select._get_additional_lookup_paths("recursion_test_4") == [["recursion_test_3"],
                                                                                 ["recursion_test_1"]]
        assert scope_select._get_additional_lookup_paths("recursion_test_4", recursive=True) == [
            ["recursion_test_3"], ["recursion_test_3", "recursion_test_2"],
            ["recursion_test_3", "recursion_test_2", "recursion_test_1"],
            ["recursion_test_1"]
        ]

    def test__get_from_for_path(self, cfg, monkeypatch):

        def mock__get_join(self, root_table: str, target_table: str) -> Join:
            if root_table == "locus" and target_table == "locus_relations":
                return Join("locus", "locus_relations", "inner",
                            "uid", "uid_locus")
            if root_table == "locus_relations" and target_table == "locus":
                return Join("locus_relations", "locus", "inner",
                            "uid_locus_2_related", "uid")

        Dsd3Singleton.release_dsd3()
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(lookup_test_dsd3)
        scope_select = KioskScopeSelect()

        monkeypatch.setattr(KioskScopeSelect, "_get_join", mock__get_join)

        scope_select.set_dsd(dsd)

        from_sql = scope_select._get_from_for_path(["locus", "locus_relations", "locus"])
        assert from_sql == ('from "locus" as "locus1" inner join '
                            '"locus_relations" on "locus1"."uid"="locus_relations"."uid_locus" inner join '
                            '"locus" on "locus_relations"."uid_locus_2_related"="locus"."uid"')

        from_sql = scope_select._get_from_for_path(["locus", "locus_relations", "locus", "locus_relations", "locus"])
        assert from_sql == ('from "locus" as "locus1" inner join "locus_relations" as "locus_relations2" '
                            'on "locus1"."uid"="locus_relations2"."uid_locus" inner join "locus" as '
                            '"locus3" on "locus_relations2"."uid_locus_2_related"="locus3"."uid" inner '
                            'join "locus_relations" on "locus3"."uid"="locus_relations"."uid_locus" inner '
                            'join "locus" on "locus_relations"."uid_locus_2_related"="locus"."uid"')
