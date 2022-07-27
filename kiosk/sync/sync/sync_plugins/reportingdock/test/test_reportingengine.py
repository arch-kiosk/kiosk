import os

import pytest

from dsd.dsd3singleton import Dsd3Singleton
from kiosksqldb import KioskSQLDb
from reportingdock.reportingengine import ReportingEngine
from reportingdock.reportinglib import *
from reportingdock.reportingmapper import ReportingMapper
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "kiosk_config.yml")
# sql_data = os.path.join(test_path, r"sql", "data.sql")
log_file = os.path.join(test_path, r"log", "test_log.log")
query_def_1 = os.path.join(test_path, r"defs", "query_def_1.yml")
query_def_unknown_query_type = os.path.join(test_path, r"defs", "query_def_unknown_query_type.yml")
query_def_2 = os.path.join(test_path, r"defs", "query_def_2.yml")
query_def_3 = os.path.join(test_path, r"defs", "query_def_3.yml")
query_def_4 = os.path.join(test_path, r"defs", "query_def_4.yml")
mapping_def_1 = os.path.join(test_path, r"defs", "mapping_def_1.yml")
mapping_def_2 = os.path.join(test_path, r"defs", "mapping_def_2.yml")
mapping_def_3 = os.path.join(test_path, r"defs", "mapping_def_3.yml")
reporting_test_data = os.path.join(test_path, r"sql", "reporting_test_data.sql")


class TestReportingEngine(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def config(self):
        return self.get_config(config_file, log_file=log_file)

    @pytest.fixture(scope="module")
    def db(self, config):
        return self.get_urapdb(config)

    @pytest.fixture()
    def dsd(self, db):
        return Dsd3Singleton.get_dsd3()

    def test_get_reporting_path(self, config):
        assert ReportingEngine.get_reporting_path() == os.path.join(config.base_path, "reports")

    def test_reporting_engine(self, config, dsd):
        # prepare data without a query definition should throw exception
        reporting_engine = ReportingEngine()
        with pytest.raises(ReportingException, match="No query definition present."):
            reporting_engine.prepare_data(namespace="dock_test", config=config)

        # using an unknown query type should throw an exception
        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_unknown_query_type)
        with pytest.raises(ReportingException, match="unknown."):
            reporting_engine.prepare_data(namespace="dock_test", config=config)

        # test a real query definition with two queries in it (but no data or context identifier)
        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_2)
        with pytest.raises(ReportingException, match="no value for context_identifier"):
            reporting_engine.prepare_data(namespace="dock_test", config=config)

        # test a real query definition with two queries in it, (but no data)
        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_2)
        reporting_engine.set_variable("context_identifier", "LA-002")
        with pytest.raises(ReportingException, match="no results by query"):
            reporting_engine.prepare_data(namespace="dock_test", config=config)

        KioskSQLDb.run_sql_script(reporting_test_data)
        # test a real query definition with two queries in it, now with data
        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_2)
        reporting_engine.set_variable("context_identifier", "LA-002")
        reporting_engine.prepare_data(namespace="dock_test", config=config)

    def test_reporting_engine_mapper_values_only(self, config, dsd):
        KioskSQLDb.run_sql_script(reporting_test_data)
        KioskSQLDb.drop_table_if_exists("reporting_values", namespace='dock_test')
        # test a real query definition with two queries in it, now with data
        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_2)
        reporting_engine.set_variable("context_identifier", "LA-002")
        reporting_engine.prepare_data(namespace="dock_test", config=config)
        reporting_engine.template_file = "file_does_not_exist.pdf"
        reporting_engine.load_mapping_definition(mapping_definition_file_path=mapping_def_1)
        m = reporting_engine.map(namespace="dock_test")
        assert m == {'context#': 'LA-002',
                     'context#2': 'LA-002',
                     'director': 'n/a',
                     'observation': 'SW wall of trench LA. Also plastered and painted like the '
                                    'others. Wall built to separate LOGS’ room from the outside '
                                    'world'}

    def test_reporting_engine_load_mapping_def(self, config):
        reporting_engine = ReportingEngine()
        reporting_engine.template_file = "file_does_not_exist.pdf"
        reporting_engine.load_mapping_definition(mapping_definition_file_path=mapping_def_1)
        assert reporting_engine._mapping_definition
        mapper = ReportingMapper(reporting_engine._mapping_definition, {}, None)
        assert mapper

    def test_reporting_engine_mapper_with_list(self, config, dsd):
        KioskSQLDb.run_sql_script(reporting_test_data)
        KioskSQLDb.drop_table_if_exists("reporting_values", namespace='dock_test')
        # test a real query definition with two queries in it, now with data
        reporting_engine = ReportingEngine()
        reporting_engine.template_file = "file_does_not_exist.pdf"
        reporting_engine.load_query_definition(query_definition_file_path=query_def_2)
        reporting_engine.set_variable("context_identifier", "LA-002")
        reporting_engine.prepare_data(namespace="dock_test", config=config)
        reporting_engine.load_mapping_definition(mapping_definition_file_path=mapping_def_2)
        m = reporting_engine.map(namespace="dock_test")
        assert m == {'context#': 'LA-002',
                     'context#2': 'LA-002',
                     'director': 'n/a',
                     'locus_relations': 'relation type\tto locus\n'
                                        'is abutted by\tLA-001\n'
                                        'is abutted by\tLA-003',
                     'observation': 'SW wall of trench LA. Also plastered and painted like the '
                                    'others. Wall built to separate LOGS’ room from the outside '
                                    'world'}

    def test_reporting_engine_mapper_with_filename_list(self, config, dsd):
        class FileRepos:
            def get_file_repository_filename(self, uid: str) -> str:
                return "F" + uid

            def get_contextual_file(self, uid: str) -> object:
                class MockContextualFile:
                    def __init__(self, uid: str):
                        self.uid = uid
                        self.export_filename = f"{uid} export filename"

                    def get_descriptive_filename(self):
                        return f'{self.uid} descriptive filename'

                return MockContextualFile(uid)

        KioskSQLDb.run_sql_script(reporting_test_data)
        KioskSQLDb.drop_table_if_exists("reporting_values", namespace='dock_test')
        # test a real query definition with two queries in it, now with data
        reporting_engine = ReportingEngine(file_repos=FileRepos())

        reporting_engine.template_file = "file_does_not_exist.pdf"
        reporting_engine.load_query_definition(query_definition_file_path=query_def_4)
        reporting_engine.set_variable("context_identifier", "LA-002")
        reporting_engine.prepare_data(namespace="dock_test", config=config)
        reporting_engine.load_mapping_definition(mapping_definition_file_path=mapping_def_3)
        m = reporting_engine.map(namespace="dock_test")
        assert m == {'context#': 'LA-002',
                     'context#2': 'LA-002',
                     'director': 'n/a',
                     'locus_relations': 'relation type\tto locus\tsketch file\n'
                                        'is abutted by\tLA-001\t5d9e43c4-bbf4-4aee-b134-2c8ffa75c7d3 descriptive filename\n'
                                        'is abutted by\tLA-003\t6b005beb-614f-4408-bdaa-964ffcb09452 descriptive filename',
                     'observation': 'SW wall of trench LA. Also plastered and painted like the '
                                    'others. Wall built to separate LOGS’ room from the outside '
                                    'world'}

    def test_reporting_engine_output_to_pdf(self, config, dsd, shared_datadir, monkeypatch):
        def get_output_directory(cfg):
            return shared_datadir

        KioskSQLDb.run_sql_script(reporting_test_data)
        KioskSQLDb.drop_table_if_exists("reporting_values", namespace='dock_test')
        # test a real query definition with two queries in it, now with data
        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_2)
        reporting_engine.set_variable("context_identifier", "LA-002")
        reporting_engine.prepare_data(namespace="dock_test", config=config)
        reporting_engine.template_file = os.path.join(shared_datadir, "kiosk_test_form.pdf")
        reporting_engine.load_mapping_definition(mapping_definition_file_path=mapping_def_2)
        m = reporting_engine.map(namespace="dock_test")
        monkeypatch.setattr(reporting_engine, "get_output_directory", get_output_directory)
        reporting_engine.filename_prefix = "reporting_"
        reporting_engine.output("LA-002")
        assert os.path.isfile(os.path.join(shared_datadir, "reporting_LA-002.pdf"))

    def test_create_reports(self, config, dsd, monkeypatch, shared_datadir):
        def get_output_directory(cfg):
            return shared_datadir

        KioskSQLDb.run_sql_script(reporting_test_data)
        KioskSQLDb.drop_table_if_exists("reporting_values", namespace='dock_test')
        # test a real query definition with two queries in it, now with data
        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_3)
        with pytest.raises(ReportingException, match="No base query selected"):
            reporting_engine.create_reports(namespace='dock_test', selected_base_query=None)
        reporting_engine.template_file = "file_does_not_exist.pdf"
        reporting_engine.load_mapping_definition(mapping_definition_file_path=mapping_def_2)
        monkeypatch.setattr(reporting_engine, "get_output_directory", get_output_directory)
        reporting_engine.template_file = os.path.join(shared_datadir, "kiosk_test_form.pdf")
        reporting_engine.template_type = 'ReportingPDFDriver'
        reporting_engine.filename_prefix = "reporting_"
        reporting_engine.create_reports(namespace="dock_test", selected_base_query="This year's loci")
        assert KioskSQLDb.get_field_value_from_sql("value",
                                                   sql="select value from dock_test.reporting_values "
                                                       "where context_identifier = 'LA-003' and key='date_defined'") == '2022-01-08'

        assert not KioskSQLDb.get_field_value_from_sql("value",
                                                       sql="select value from dock_test.reporting_values "
                                                           "where context_identifier = 'LA-002' and key='date_defined'")
        assert self.file_exists(os.path.join(shared_datadir, "reporting_la-003.pdf"))
        assert not self.file_exists(os.path.join(shared_datadir, "reporting_la-002.pdf"))

    def test_create_reports_with_variable(self, config, dsd, monkeypatch, shared_datadir):
        def get_output_directory(cfg):
            return shared_datadir

        KioskSQLDb.run_sql_script(reporting_test_data)
        KioskSQLDb.drop_table_if_exists("reporting_values", namespace='dock_test')

        # test if throws an exception if required variables are not there
        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_3)
        reporting_engine._query_definition.base_queries["loci of certain unit"]["required_variables"] = ["missing"]
        with pytest.raises(ReportingException, match="is required but missing"):
            reporting_engine.create_reports(namespace="dock_test", selected_base_query="loci of certain unit")

        reporting_engine = ReportingEngine()
        reporting_engine.load_query_definition(query_definition_file_path=query_def_3)
        with pytest.raises(ReportingException, match="is required but missing"):
            reporting_engine.create_reports(namespace="dock_test", selected_base_query="loci of certain unit")

        reporting_engine.set_variable("unit", "LA")
        reporting_engine.template_file = os.path.join(shared_datadir, "kiosk_test_form.pdf")
        reporting_engine.load_mapping_definition(mapping_definition_file_path=mapping_def_2)
        monkeypatch.setattr(reporting_engine, "get_output_directory", get_output_directory)
        reporting_engine.filename_prefix = "reporting_"

        reporting_engine.create_reports(namespace="dock_test", selected_base_query="loci of certain unit")

        assert KioskSQLDb.get_field_value_from_sql("value",
                                                   sql="select value from dock_test.reporting_values "
                                                       "where context_identifier = 'LA-003' and key='date_defined'") == '2022-01-08'

        assert self.file_exists(os.path.join(shared_datadir, "reporting_la-003.pdf"))
        assert self.file_exists(os.path.join(shared_datadir, "reporting_la-002.pdf"))
