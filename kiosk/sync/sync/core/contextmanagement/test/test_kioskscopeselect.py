import datetime
import logging
import os
from pprint import pprint

import pytest

import kioskstdlib
from contextmanagement.kioskscopeselect import KioskScopeSelect
from dsd.dsd3singleton import Dsd3Singleton
from test.testhelpers import KioskPyTestHelper
from kiosksqldb import KioskSQLDb

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
sql_records = os.path.join(test_path, "sql", "records_kiosk_context.sql")


class TestKioskScopeSelect(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

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
        selects = scope_select.get_selects("unit", "CC", ["unit", "locus", "collected_material"])
        assert [x[0] for x in selects] == ["unit", "locus", "collected_material"]
        assert selects[0][1] == """select "unit"."id","unit"."name","unit"."purpose","unit"."type","unit"."method","unit"."id_excavator","unit"."unit_creation_date","unit"."id_site","unit"."excavator_full_name","unit"."spider_counter","unit"."coordinates","unit"."legacy_unit_id","unit"."term_for_unit","unit"."term_for_locus","unit"."identification_method_loci","unit"."identification_method_cm","unit"."identification_method_analysis","unit"."arch_domain","unit"."arch_context","unit"."uid","unit"."created","unit"."modified","unit"."modified_by" from unit where "unit"."arch_context"=%(identifier)s"""
        assert selects[1][1] == """select "locus"."uid_unit","locus"."type","locus"."opening elevations","locus"."closing elevations","locus"."description","locus"."date_defined","locus"."date_closed","locus"."interpretation","locus"."colour","locus"."formation_process","locus"."id","locus"."arch_domain","locus"."arch_context","locus"."uid","locus"."created","locus"."modified","locus"."modified_by" from unit inner join "locus" on "unit"."uid"="locus"."uid_unit" where "unit"."arch_context"=%(identifier)s"""
        assert selects[2][1] == """select "collected_material"."uid_locus","collected_material"."external_id","collected_material"."uid_lot","collected_material"."type","collected_material"."description","collected_material"."isobject","collected_material"."date","collected_material"."storage","collected_material"."pottery_remarks","collected_material"."status_done","collected_material"."status_todo","collected_material"."dearregistrar","collected_material"."weight","collected_material"."period","collected_material"."quantity","collected_material"."is_grave_good","collected_material"."collection_method","collected_material"."id","collected_material"."arch_domain","collected_material"."arch_context","collected_material"."uid","collected_material"."created","collected_material"."modified","collected_material"."modified_by" from unit inner join "locus" on "unit"."uid"="locus"."uid_unit" inner join "collected_material" on "locus"."uid"="collected_material"."uid_locus" where "unit"."arch_context"=%(identifier)s"""

        for select in selects:
            r = KioskSQLDb.get_first_record_from_sql(select[1], {"identifier": "LA"})
