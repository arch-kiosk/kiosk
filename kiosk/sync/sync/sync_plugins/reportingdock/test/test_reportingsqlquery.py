import os
import pytest

from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from reportingdock.reportinglib import ReportingException
from reportingdock.reportingsqlquery import ReportingSqlQuery
from kioskquery.kioskqueryvariables import KioskQueryVariables
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
reporting_test_data = os.path.join(test_path, r"sql", "reporting_test_data.sql")


class TestReportingSqlQuery(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    def test_key_value_query(self, config, dsd):
        query_def = {
            "type": "sql",
            "query": "select "+" * from {{locus}} l where l.arch_context={{#context_identifier}}",
            "output_type": "key-value"
        }
        variable_def = {
            "context_identifier": "datatype(VARCHAR)"
        }
        variables = KioskQueryVariables(variable_def)
        variables.set_variable("context_identifier", "LA-001")
        query = ReportingSqlQuery(query_def, variables, namespace="test_dock")
        with pytest.raises(ReportingException, match="no results"):
            query.execute()

        KioskSQLDb.run_sql_script(reporting_test_data)
        query.execute()
        self.assert_table_data_json("reporting_values",
                                    os.path.join(test_path, "json", "test_dock_reporting_values.json"),
                                    keyfields=["context_identifier", "key"],
                                    namespace="test_dock")

    def test_list_query(self, config, dsd):
        query_def = {
            "type": "sql",
            "query": "select" + """ {{#context_identifier}} as context_identifier, r.type relation_type, 
                        l2.arch_context to_locus 
                        from {{locus}} as l 
                        inner join {{locus_relations}} as r 
                        on l.uid = r.uid_locus
                        inner join {{locus}} as l2
                        on r.uid_locus_2_related = l2.uid
                        where
                        l.arch_context={{#context_identifier}}
                        order by r.type, l2.arch_context 
                    """,
            "output_type": "list",
            "output_table": "locus_relations"
        }
        variable_def = {
            "context_identifier": "datatype(VARCHAR)"
        }
        KioskSQLDb.run_sql_script(reporting_test_data)

        variables = KioskQueryVariables(variable_def)
        variables.set_variable("context_identifier", "LA-002")
        query = ReportingSqlQuery(query_def, variables, namespace="test_dock")
        query.execute()

        self.assert_table_data_json("reporting_locus_relations",
                                    os.path.join(test_path, "json", "test_dock_reporting_locus_relations.json"),
                                    keyfields=["context_identifier", "to_locus"],
                                    namespace="test_dock")

