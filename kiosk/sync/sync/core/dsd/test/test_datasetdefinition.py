import logging
import pprint

import pytest
import os
from dsd.dsd3 import DataSetDefinition, Join
from dsd.dsdview import DSDView
from dsd.dsdyamlloader import DSDYamlLoader
from dsd.dsd3 import DSDWrongVersionError, DSDFileError, DSDTableDropped, DSDSemanticError
from dsd.dsdconstants import *
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
config_file = os.path.join(test_path, r"config", "config_test.yml")
log_file = os.path.join(test_path, r"log", "test_log.log")
base_path = KioskPyTestHelper.get_kiosk_base_path_from_test_path(test_path)

data_dir = os.path.join(test_path, "data")
dsd3_dropped_table_file = os.path.join(data_dir, "dsd3_dropped_table.yml")
dsd3_images_file2 = os.path.join(data_dir, "dsd3_unit.yml")
dsd3_images_file = os.path.join(data_dir, "dsd3_images.yml")
dsd2_file = os.path.join(data_dir, "dsd2.yml")
dsd3_test_file = os.path.join(data_dir, "dsd3_test.yml")
dsd3_test_tz_file = os.path.join(data_dir, "dsd3_test_tz.yml")
dsd3_external_test_base_file = os.path.join(data_dir, "dsd3_external_test_base.yml")
dsd3_import_test_base_file = os.path.join(data_dir, "dsd3_import_test_base_file.yml")
dsd3_rename_table_test = os.path.join(data_dir, "dsd3_rename_table_test.yml")
dsd3_dayplan = os.path.join(data_dir, "dsd3_dayplan.yml")
dsd3_constants = os.path.join(data_dir, "dsd3_constants.yml")
dsd3_urap = os.path.join(data_dir, "urap_dsd3.yml")
real_urap_dsd = os.path.join(base_path, "config", "dsd", "default_dsd3.yml")
lookup_test_dsd3 = os.path.join(data_dir, "lookup_test_dsd3.yml")


class TestDataSetDefinition(KioskPyTestHelper):
    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file, log_file=log_file)

    def test_init(self):
        dsd = DataSetDefinition()
        assert dsd

    def test_register_yaml_loader(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)

    def test_load_yaml_file(self):
        dsd = DataSetDefinition()

        assert not dsd.append_file(dsd3_images_file)

        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_images_file)
        assert "images" in dsd._dsd_data.get([])

    def test_check_version(self):
        dsd = DataSetDefinition()

        dsd.register_loader("yml", DSDYamlLoader)
        assert not dsd.append_file(dsd2_file)

    def test_load_2_yaml_files(self):
        dsd = DataSetDefinition()

        assert not dsd.append_file(dsd3_images_file)

        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_images_file)
        dsddata = dsd._dsd_data.get([])
        assert "images" in dsddata
        assert not "unit" in dsddata
        assert "config" in dsddata
        assert "some_config" in dsddata["config"]

        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_images_file2)
        dsddata = dsd._dsd_data.get([])
        assert "images" in dsddata
        assert "unit" in dsddata
        assert "some_other_config" in dsddata["config"]

    @pytest.fixture()
    def dsd_images_and_units(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_images_file)
        assert dsd.append_file(dsd3_images_file2)
        return dsd

    @pytest.fixture()
    def dsd_urap_dsd3(self, cfg):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_urap)
        return dsd

    @pytest.fixture()
    def dsd_real_urap_dsd(self, cfg):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(real_urap_dsd)
        return dsd

    @pytest.fixture()
    def dsd_images_and_units_and_test(self, dsd_images_and_units, cfg):
        assert dsd_images_and_units.append_file(dsd3_test_file)
        return dsd_images_and_units

    @pytest.fixture()
    def dsd_constants(self, dsd_images_and_units, cfg):
        assert dsd_images_and_units.append_file(dsd3_constants)
        return dsd_images_and_units

    def test_list_tables(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)
        tables = dsd.list_tables()
        assert "unit" in tables
        assert "images" in tables
        assert "test" in tables
        assert "test_types" in tables
        assert "migration_catalog" not in tables
        assert len(tables) == 4

        tables = dsd.list_tables(include_dropped_tables=True)
        assert "unit" in tables
        assert "images" in tables
        assert "dropped_table" in tables
        assert "migration_catalog" not in tables
        assert "test_types" in tables
        assert "migration_catalog" not in tables
        assert len(tables) == 5

    def test_list_versions(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)
        versions = dsd.list_table_versions("test")
        assert len(versions) == 3
        assert 1 in versions
        assert 2 in versions
        assert 3 in versions

        versions = dsd.list_table_versions("images")
        assert len(versions) == 1

        versions = dsd.list_table_versions("unit")
        assert len(versions) == 1

        versions = dsd.list_table_versions("dropped_table")
        assert len(versions) == 3

    def test_get_recent_version(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)
        assert dsd.get_current_version("test") == 3
        assert dsd.get_current_version("unit") == 1
        assert dsd.get_current_version("images") == 1
        assert dsd.get_current_version("dropped_table") == 3

    def test_list_fields(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        fields = dsd.list_fields("test")
        assert len(fields) == 9
        assert "description" in fields

        fields = dsd.list_fields("test", 2)
        assert len(fields) == 8
        assert "test_description" in fields

        fields = dsd.list_fields("test", 1)
        assert len(fields) == 7

        with pytest.raises(DSDTableDropped):
            fields = dsd.list_fields("dropped_table")

        fields = dsd.list_fields("dropped_table", version=2)
        assert len(fields) == 6

    def test_get_field_instructions(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        field = dsd.get_field_instructions("test", "description")
        assert len(field) == 1
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0] == "VARCHAR"

        field = dsd.get_field_instructions("test", "modified_by")
        assert len(field) == 3
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0] == "varchar"
        assert "default" in field
        assert len(field["default"]) == 1
        assert field["default"][0] == "sys"

        field = dsd.get_field_instructions("test", "test_description", 2)
        assert len(field) == 1
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0] == "VARCHAR"

        with pytest.raises(DSDTableDropped):
            field = dsd.get_field_instructions("dropped_table", "name")

        field = dsd.get_field_instructions("dropped_table", "name", 2)
        assert len(field) == 1
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0] == "VARCHAR"

    def test_get_field_instructions_with_pattern(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        field = dsd.get_field_instructions("test", "modified_by")
        assert field == {'replfield_modified_by': [], 'datatype': ['varchar'], 'default': ['sys']}

        field = dsd.get_field_instructions("test", "modified_by", patterns=["default", "replfield_modified_by"])
        assert field == {'replfield_modified_by': [], 'default': ['sys']}

    def test_get_fields_with_instruction(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        fields = dsd.get_fields_with_instruction("images", "file_for")
        assert len(fields) == 1
        assert fields[0] == "uid"

        with pytest.raises(DSDTableDropped):
            fields = dsd.get_fields_with_instruction("dropped_table", "proxy_for")

        fields = dsd.get_fields_with_instruction("dropped_table", "default", version=2)
        assert len(fields) == 1
        assert fields[0] == "modified_by"

    def test_get_fields_with_instructions(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        fields = dsd.get_fields_with_instructions("test")
        assert len(fields) == 9

        # now from the cache
        fields = dsd.get_fields_with_instructions("test")
        assert len(fields) == 9

        field = fields["description"]
        assert len(field) == 1
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0] == "VARCHAR"

        field = fields["modified_by"]
        assert len(field) == 3
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0] == "varchar"
        assert "default" in field
        assert len(field["default"]) == 1
        assert field["default"][0] == "sys"

        with pytest.raises(DSDTableDropped):
            fields = dsd.get_fields_with_instructions("dropped_table")

        fields = dsd.get_fields_with_instructions("dropped_table", version=2)
        assert len(fields) == 6

        field = fields["modified_by"]
        assert len(field) == 2
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0] == "REPLFIELD_MODIFIED_BY"
        assert "default" in field
        assert len(field["default"]) == 1
        assert field["default"][0] == "sys"

    def test_get_fields_with_instruction_and_parameters(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        fields = dsd.get_fields_with_instruction("test_types", "identifier")
        assert len(fields) == 3

        fields = dsd.get_fields_with_instruction_and_parameter("test_types", "identifier")
        assert len(fields) == 1
        assert list(fields.keys())[0] == "typ7"

        fields = dsd.get_fields_with_instruction_and_parameter("test_types", "identifier", "additional")
        assert len(fields) == 1
        assert list(fields.keys())[0] == "typ8"

        fields = dsd.get_fields_with_instruction_and_parameter("test_types", "identifier", "nonsense")
        assert len(fields) == 0

        fields = dsd.get_fields_with_instruction_and_parameter("test_types", "identifier", ["additional", None])
        assert len(fields) == 2

        with pytest.raises(DSDSemanticError):
            fields = dsd.get_fields_with_instruction_and_parameter("test_types", "identifier", ["additional", None],
                                                                   fail_on_many=True)
        assert len(fields) == 2

    # gone because of a deprecation
    # def test_list_externally_bound_fields(self, dsd_images_and_units_and_test):
    #     dsd: DataSetDefinition = dsd_images_and_units_and_test
    #     with pytest.raises(DeprecationWarning):
    #         dsd.list_externally_bound_fields("images")

    def test_get_fields_with_certain_instructions(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        fields = dsd.get_fields_with_instructions("images", ["proxy_for", "file_for"])
        assert len(fields) == 2

        field = fields["img_proxy"]
        assert len(field) == 2
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0] == "TIMESTAMP"

        assert "proxy_for" in field
        assert len(field["proxy_for"]) == 1
        assert field["proxy_for"][0] == "uid"

        field = fields["uid"]
        assert len(field) == 3
        assert "datatype" in field
        assert len(field["datatype"]) == 1
        assert field["datatype"][0].lower() == "uuid"

        assert "replfield_uuid" in field
        assert len(field["replfield_uuid"]) == 0

        assert "file_for" in field
        assert len(field["file_for"]) == 1
        assert field["file_for"][0] == "img_proxy"

        with pytest.raises(DSDTableDropped):
            fields = dsd.get_fields_with_instructions("dropped_table", ["table_context", "proxy_for"])

        fields = dsd.get_fields_with_instructions("dropped_table", ["default"], version=2)
        assert len(fields) == 1
        assert "default" in fields["modified_by"]

    def test_get_fields_of_type(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        fields = dsd.list_fields_of_type("test", "varchar")
        assert len(fields) == 3
        assert "name" in fields
        assert "description" in fields

        with pytest.raises(DSDTableDropped):
            fields = dsd.list_fields_of_type("dropped_table", "varchar")

        fields = dsd.list_fields_of_type("dropped_table", "varchar", version=1)
        assert len(fields) == 1
        assert "name" in fields

    def test_list_fields_with_additional_type(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        fields = dsd.list_fields_with_additional_type("images", "default")
        assert len(fields) == 1
        assert "modified_by" in fields

        fields = dsd.list_fields_with_additional_type("images", "absent")
        assert len(fields) == 0

        with pytest.raises(DSDTableDropped):
            fields = dsd.list_fields_with_additional_type("dropped_table", "default")
        fields = dsd.list_fields_with_additional_type("dropped_table", "default", version=2)
        assert len(fields) == 1

    def test_get_proxy_field_reference(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        assert dsd.get_proxy_field_reference("images", "img_proxy") == "uid"
        assert not dsd.get_proxy_field_reference("images", "description")

    def test_get_file_field_reference(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        assert dsd.get_file_field_reference("images", "uid") == "img_proxy"
        assert not dsd.get_file_field_reference("images", "description")

        with pytest.raises(DSDTableDropped):
            assert not dsd.get_file_field_reference("dropped_table", "description")

    def test_get_attribute_reference(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        assert dsd.get_attribute_reference("images", "uid", "file_for") == "img_proxy"
        assert not dsd.get_attribute_reference("images", "uid", "absent")

        with pytest.raises(DSDTableDropped):
            assert not dsd.get_attribute_reference("dropped_table", "uid", "absent")

    # def test_get_excavation_context_reference(self, dsd_images_and_units_and_test):
    #     dsd: DataSetDefinition = dsd_images_and_units_and_test
    #     assert dsd.append_file(dsd3_dropped_table_file)
    #
    #     assert dsd.get_excavation_context_reference("images", "uid") == "excavation_context"
    #     assert not dsd.get_excavation_context_reference("images", "description")
    #
    #     with pytest.raises(DSDTableDropped):
    #         assert dsd.get_excavation_context_reference("dropped_table", "uid") == "excavation_context"

    # def test_get_table_context_reference(self, dsd_images_and_units_and_test):
    #     dsd: DataSetDefinition = dsd_images_and_units_and_test
    #     assert dsd.append_file(dsd3_dropped_table_file)
    #
    #     assert dsd.get_table_context_reference("images", "uid") == "table_context"
    #     assert not dsd.get_table_context_reference("images", "description")
    #
    #     with pytest.raises(DSDTableDropped):
    #         assert dsd.get_table_context_reference("dropped_table", "uid") == "table_context"

    def test_resolve_externals(self):
        dsd: DataSetDefinition = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_external_test_base_file)
        dsddata = dsd._dsd_data.get([])
        assert "uid" in dsddata["table2"]["structure"][1]
        assert "uid" in dsddata["table1"]["structure"][1]
        assert dsddata["table1"]["structure"] == {1: {'created': ['datatype("timestamp")', 'REPLFIELD_CREATED()'],
                                                      'created_tz': ['datatype(TZ)'],
                                                      'description': ['datatype("VARCHAR")', 'describes_file(uid)'],
                                                      'excavation_context': ['datatype("VARCHAR")'],
                                                      'file_datetime': ['datatype("TIMESTAMP")'],
                                                      'file_datetime_tz': ['datatype(TZ)'],
                                                      'id_cm': ['datatype("NUMBER")'],
                                                      'id_locus': ['datatype("NUMBER")'],
                                                      'id_unit': ['datatype("VARCHAR")'],
                                                      'img_proxy': ['datatype("TIMESTAMP")', 'proxy_for(uid)'],
                                                      'img_proxy_tz': ['datatype(TZ)'],
                                                      'modified': ['datatype("timestamp")', 'REPLFIELD_MODIFIED()'],
                                                      'modified_by': ['datatype("REPLFIELD_MODIFIED_BY")',
                                                                      'default("sys")'],
                                                      'modified_tz': ['datatype(TZ)'],
                                                      'original_md5': ['datatype("VARCHAR")'],
                                                      'ref_uid': ['datatype("UUID")'],
                                                      'table_context': ['datatype("VARCHAR")'],
                                                      'tags': ['datatype("VARCHAR")'],
                                                      'uid': ['datatype("REPLFIELD_UUID")',
                                                              'file_for(img_proxy)',
                                                              'excavation_context(excavation_context)',
                                                              'table_context(table_context)']}}
        assert len(dsddata["table2"]["structure"][1]) == 6

    def test_resolve_imports(self):
        dsd: DataSetDefinition = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_import_test_base_file)
        dsddata = dsd._dsd_data.get([])
        assert "uid" in dsddata["test"]["structure"][3]
        assert "uid" in dsddata["table2"]["structure"][1]
        assert "uid" in dsddata["table1"]["structure"][1]
        assert "uid" in dsddata["repl_deleted_uids"]["structure"][1]
        assert "uid" in dsddata["repl_deleted_uids_2"]["structure"][2]
        assert len(dsddata["table1"]["structure"][1]) == 19
        assert len(dsddata["table2"]["structure"][1]) == 6
        assert len(dsddata["repl_deleted_uids"]["structure"][1]) == 6
        assert len(dsddata["repl_deleted_uids_2"]["structure"][2]) == 6
        assert dsddata["test"]["structure"][3] == {'created': ['datatype("timestamp")', 'REPLFIELD_CREATED()'],
                                                   'created_tz': ['datatype(TZ)'],
                                                   'description': ['datatype("VARCHAR")'],
                                                   'dontsync': ['datatype("TIMESTAMP")', 'nosync()'],
                                                   'dontsync_tz': ['datatype(TZ)'],
                                                   'modified': ['datatype("timestamp")', 'REPLFIELD_MODIFIED()'],
                                                   'modified_by': ['datatype("REPLFIELD_MODIFIED_BY")',
                                                                   'default("sys")'],
                                                   'modified_tz': ['datatype(TZ)'],
                                                   'name': ['datatype("VARCHAR")'],
                                                   'uid': ['datatype("REPLFIELD_UUID")']}

    def test_delete_table(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        assert "images" in dsd.list_tables()
        dsd.delete_table("images")
        assert "images" not in dsd.list_tables()

        assert "dropped_table" in dsd.list_tables(include_dropped_tables=True)
        dsd.delete_table("dropped_table")
        assert "dropped_table" not in dsd.list_tables(include_dropped_tables=True)

    def test_get_migration_instructions(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        instructions = dsd.get_migration_instructions("test", 2)
        assert instructions == [{"add": ["description"]}]
        instructions = dsd.get_migration_instructions("test", 3)
        assert instructions == [{"rename": ["test_description", "description"]},
                                {"add": ["dontsync"]}]
        instructions = dsd.get_migration_instructions("test", 3, upgrade=False)
        assert instructions == [{"rename": ["description", "test_description"]},
                                {"drop": ["dontsync"]}]

        instructions = dsd.get_migration_instructions("dropped_table", 3)
        assert instructions == [{"drop_table": []}]

    def test_is_table_dropped(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        assert dsd.is_table_dropped("dropped_table")
        assert not dsd.is_table_dropped("dropped_table", 1)
        assert not dsd.is_table_dropped("dropped_table", 2)
        assert not dsd.is_table_dropped("test")

    def test_list_tables_dropped(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        assert dsd.is_table_dropped("dropped_table")
        assert not dsd.is_table_dropped("dropped_table", 1)
        assert not dsd.is_table_dropped("dropped_table", 2)
        assert not dsd.is_table_dropped("test")

    def test_get_former_table_names(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_rename_table_test)

        result = dsd.get_former_table_names("name3")
        assert len(result) == 2
        assert result[0] == ("name2", 3)
        assert result[1] == ("name1", 2)

        result = dsd.get_former_table_names("name3", version=2)
        result = dsd.get_former_table_names("name3", version=2)
        assert len(result) == 1
        assert result[0] == ("name1", 2)

        result = dsd.get_former_table_names("name3", version=1)
        assert len(result) == 0

    def test_identify_files_table(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.files_table == "images"
        assert dsd._identify_files_table() == 1

    def test_get_field_datatype(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.get_field_datatype("images", "uid") == "uuid"
        assert dsd.get_field_datatype("images", "description") == "varchar"
        assert dsd.get_field_datatype("images", "no field") == ""
        assert dsd.get_field_datatype("images", "replfield_modified") == "timestamptz"
        assert dsd.get_field_datatype("images", "modified_ww") == "timestamp"


    def test_get_modified_field(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.get_modified_field("images") == "modified"
        assert dsd.get_modified_field("unit") == "modified"

    def test_list_fields_with_instruction(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.list_fields_with_instruction("unit", "replfield_uuid") == ["uid"]
        assert dsd.list_fields_with_instruction("images", "file_for") == ["uid"]
        assert dsd.list_fields_with_instruction("images", "uuid_for") == []

    def test_list_file_fields(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.list_file_fields() == {}
        dsd.append_file(dsd3_dayplan)
        assert dsd.list_file_fields() == {"dayplan": ["uid_image"]}

    def test_get_description_field_for_file_field(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        dsd.append_file(dsd3_dayplan)
        assert dsd.get_description_field_for_file_field("dayplan", "uid_image") == ["image_description"]
        assert dsd.get_description_field_for_file_field("dayplan", "uid") == []

    def test_list_tables_with_instructions(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        tables = dsd.list_tables_with_instructions(["replfield_uuid"])
        assert tables == ["images", "unit", "test"]
        dsd.append_file(dsd3_dayplan)
        tables = dsd.list_tables_with_instructions(["replfield_uuid"])
        assert tables == ["images", "unit", "test", "dayplan"]

    def test_table_has_meta_flag(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert not dsd.table_has_meta_flag("unit", KEY_TABLE_FLAG_SYSTEM_TABLE)
        assert dsd.table_has_meta_flag("migration_catalog", KEY_TABLE_FLAG_SYSTEM_TABLE)

        assert dsd.table_has_meta_flag("migration_catalog", [KEY_TABLE_FLAG_SYSTEM_TABLE]) == [
            KEY_TABLE_FLAG_SYSTEM_TABLE]
        assert set(dsd.table_has_meta_flag("test", ["filemaker_workstation", "not_in_master"])) == set(
            ["filemaker_workstation", "not_in_master"])
        assert set(dsd.table_has_meta_flag("test", ["filemaker_workstation", "not_in_master", "not_set"])) == set(
            ["filemaker_workstation", "not_in_master"])
        assert not set(dsd.table_has_meta_flag("test", ["not_set", "system_table"]))

    def test_list_tables_with_flags(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        tables = dsd.list_tables_with_flags(["system_table"])
        assert tables == ["migration_catalog"]

        tables = dsd.list_tables_with_flags(["not_set"])
        assert not tables

        tables = dsd.list_tables_with_flags(["not_in_master"])
        assert tables == ["test"]

        tables = dsd.list_tables_with_flags(["not_in_master", "filemaker_workstation"])
        assert tables == ["test"]

    def test_list_context_tables(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        contexts = dsd.list_context_tables()
        assert contexts.sort() == ["unit", "site", "locus", "collected_material", "pottery"].sort()
        dsd.append_file(dsd3_dayplan)

    def test_get_fork_options(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert not dsd.get_fork_option("unit", "where")
        assert not dsd.get_fork_option("images", "not_set")
        assert dsd.get_fork_option("images", "where")
        assert dsd.get_fork_option("images", "where") == "coalesce(\"images\".\"table_context\",'') <> ''"

    def test_delete_field(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert "filename" in dsd.list_fields("images")
        dsd.delete_field("images", "filename")
        assert "filename" not in dsd.list_fields("images")

    def test_get_instruction_parameters(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.get_instruction_parameters("test_types", "typ1", "stringtype") == ["'a string'"]
        assert dsd.get_instruction_parameters("test_types", "typ2", "numbertype") == ["12.2"]
        assert dsd.get_instruction_parameters("test_types", "typ3", "functiontype") == ["now()"]
        assert dsd.get_instruction_parameters("test_types", "typ4", "othertype") == ["<a tag>"]

        assert dsd.get_instruction_parameters("test_types", "typ6", "stringtype") != ["1"]
        assert dsd.get_instruction_parameters("test_types", "typ6", "stringtype") == ["'a string'"]

    def test_get_instruction_parameters_and_types(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.append_file(dsd3_dropped_table_file)

        v, t = dsd.get_instruction_parameters_and_types("test_types", "typ1", "stringtype")[0]
        assert v == "a string"
        assert t == "string"

        v, t = dsd.get_instruction_parameters_and_types("test_types", "typ2", "numbertype")[0]
        assert v == "12.2"
        assert t == "number"

        v, t = dsd.get_instruction_parameters_and_types("test_types", "typ3", "functiontype")[0]
        assert v == "now()"
        assert t == "function"

        v, t = dsd.get_instruction_parameters_and_types("test_types", "typ4", "othertype")[0]
        assert v == "<a tag>"
        assert t == "other"

        v, t = dsd.get_instruction_parameters_and_types("test_types", "typ5", "nulltype")[0]
        assert v == "Null"
        assert t == "string"

        with pytest.raises(DSDTableDropped):
            v, t = dsd.get_instruction_parameters_and_types("dropped_table", "uid", "datatype")[0]

        v, t = dsd.get_instruction_parameters_and_types("dropped_table", "uid", "datatype", version=1)[0]
        assert v == "REPLFIELD_UUID"
        assert t == "other"

    def test_get_import_filter(self, dsd_constants):
        dsd: DataSetDefinition = dsd_constants
        assert dsd.get_import_filter("constants", "fm12") == '("sync" is null) or ("sync"=1)'

    def test_get_migration_scripts(self, dsd_constants, dsd_images_and_units):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_constants)
        assert dsd.get_migration_scripts("urap") == {}
        dsd: DataSetDefinition = dsd_images_and_units
        assert dsd.get_migration_scripts("urap") != {}
        assert list(dsd.get_migration_scripts("urap").keys()) == ['urap_arch_context', 'something_else']

        assert dsd.get_migration_scripts("khpp") != {}
        assert list(dsd.get_migration_scripts("khpp").keys()) == ['urap_arch_context', 'something_khpp_thing']

        assert dsd.get_migration_scripts("pvd") != {}
        assert list(dsd.get_migration_scripts("pvd").keys()) == ['urap_arch_context', 'something_for_pvd']

        assert dsd.get_migration_scripts("ustp") != {}
        assert list(dsd.get_migration_scripts("ustp").keys()) == ['something_else']

    def test_contexts_available(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        context = dsd.get_context("unit_images")
        assert context["type"] == "file_search"

        context = dsd.get_context("all_images")
        assert context["type"] == "file_search"

    def test_get_context_names(self, dsd_images_and_units_and_test):
        dsd: DataSetDefinition = dsd_images_and_units_and_test
        assert dsd.get_context_names(context_type="something") == []
        assert dsd.get_context_names(context_type="file_search") == ["unit_images", "site_images", "all_images"]
        assert dsd.get_context_names() == ["unit_images", "site_images", "all_images", "unit_locus_relations"]

    def test_list_default_file_locations(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        locations = dsd.list_default_file_locations()
        assert locations
        assert locations["unit"] == ("dayplan", "uid_image")
        assert locations["collected_material"] == ("collected_material_photo", "uid_photo")

    def test_get_default_file_location_for(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        assert dsd.get_default_file_location_for("unit") == ("dayplan", "uid_image")
        assert dsd.get_default_file_location_for("collected_material") == ("collected_material_photo", "uid_photo")
        assert not dsd.get_default_file_location_for("pottery")
        with pytest.raises(DSDSemanticError):
            assert not dsd.get_default_file_location_for("locus_photo")

    def test_list_all_file_locations(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        locations = dsd.list_all_file_locations()
        assert locations
        assert locations["unit"] == [("dayplan", "uid_image")]
        assert locations["collected_material"] == [("collected_material_photo", "uid_photo")]
        assert self.arrays_are_equal(locations["locus"],
                                     [("locus_relations", "uid_sketch"), ("locus_photo", "uid_image")])
        assert self.arrays_are_equal(locations["site"], [("locus_relations", "uid_sketch"), ('dayplan', 'uid_image')])

    def test_get_assigned_file_locations(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        assert dsd.get_assigned_file_locations("unit") == [("dayplan", "uid_image")]
        assert not dsd.get_assigned_file_locations("pottery")
        with pytest.raises(DSDSemanticError):
            assert not dsd.get_assigned_file_locations("locus_photo")

    def test_list_identifier_fields(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        assert dsd.list_identifier_fields("unit") == ["arch_context"]
        assert dsd.list_identifier_fields("locus") == ["arch_context"]
        assert dsd.list_identifier_fields("site") == ["arch_context"]

    def test_get_default_join(self, dsd_real_urap_dsd):
        # site_notes is using join("site")
        assert dsd_real_urap_dsd.get_default_join("site", "site_notes") == Join(root_table="site",
                                                                                related_table="site_notes",
                                                                                _type="inner",
                                                                                related_field="uid_site",
                                                                                root_field="uid")

        # unit is using join("site", "id")
        assert dsd_real_urap_dsd.get_default_join("site", "unit") == Join(root_table="site",
                                                                          related_table="unit",
                                                                          _type="inner",
                                                                          related_field="id_site",
                                                                          root_field="id")

        # locus_relations is using join("locus", "identifier()")
        assert dsd_real_urap_dsd.get_default_join("locus", "locus_relations") == Join(root_table="locus",
                                                                                      related_table="locus_relations",
                                                                                      _type="inner",
                                                                                      related_field="uid_locus",
                                                                                      root_field="uid")

    def test_list_default_joins(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        joins = dsd.list_default_joins()
        assert joins == {'collected_material': [
            Join(root_table="collected_material", related_table="pottery", _type="inner", root_field="replfield_uuid()",
                 related_field="cm_uid")],
            'locus': [Join(root_table="locus", related_table="collected_material", _type="inner",
                           root_field="replfield_uuid()", related_field="uid_locus"),
                      Join(root_table="locus", related_table="locus_relations", _type="inner",
                           root_field="identifier()", related_field="uid_locus")],
            'site': [Join(root_table="site", related_table="site_notes", _type="inner",
                          root_field="replfield_uuid()", related_field="uid_site")],
            'site_notes': [Join(root_table="site_notes", related_table="site_note_photo", _type="inner",
                                root_field="replfield_uuid()", related_field="uid_site_note")],
            'tagging': [
                Join(root_table="tagging", related_table="locus", _type="inner", root_field="source_uid",
                     related_field="uid")],
            'test': [Join(root_table="test", related_table="test_photo", _type="inner", root_field="id()",
                          related_field="id_test")],
            'unit': [
                Join(root_table="unit", related_table="locus", _type="inner", root_field="replfield_uuid()",
                     related_field="uid_unit")]}

    def test_list_default_joins_with_lookups(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        joins = dsd.list_default_joins(include_lookups=True)
        assert joins == {'collected_material': [
            Join(root_table="collected_material", related_table="pottery", _type="inner", root_field="replfield_uuid()",
                 related_field="cm_uid")],
            'locus': [Join(root_table="locus", related_table="collected_material", _type="inner",
                           root_field="replfield_uuid()", related_field="uid_locus"),
                      Join(root_table="locus", related_table="locus_relations", _type="inner",
                           root_field="identifier()", related_field="uid_locus"),
                      Join(root_table="locus", related_table="locus_types", _type="lookup",
                           root_field="type", related_field="id")
                      ],
            'site': [Join(root_table="site", related_table="site_notes", _type="inner",
                          root_field="replfield_uuid()", related_field="uid_site")],
            'site_notes': [Join(root_table="site_notes", related_table="site_note_photo", _type="inner",
                                root_field="replfield_uuid()", related_field="uid_site_note")],
            'tagging': [
                Join(root_table="tagging", related_table="locus", _type="inner", root_field="source_uid",
                     related_field="uid")],
            'test': [Join(root_table="test", related_table="test_photo", _type="inner", root_field="id()",
                          related_field="id_test")],
            'unit': [
                Join(root_table="unit", related_table="locus", _type="inner", root_field="replfield_uuid()",
                     related_field="uid_unit")]}

    def test_document_dsd3(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        assert len(dsd.pprint()) > 50

    def test_get_table_definition(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        assert dsd.get_table_definition("locus") == {'arch_context': ['datatype(VARCHAR)', 'identifier()'],
                                                     'arch_domain': ['datatype(VARCHAR)', 'id_domain("arch_context")'],
                                                     'closing elevations': ['datatype(VARCHAR)'],
                                                     'colour': ['datatype(VARCHAR)'],
                                                     'created': ['datatype(TIMESTAMP)', 'replfield_created()'],
                                                     'created_tz': ['datatype(TZ)'],
                                                     'date_closed': ['datatype(DATE)'],
                                                     'date_defined': ['datatype(DATE)'],
                                                     'description': ['datatype(VARCHAR)'],
                                                     'formation_process': ['datatype(VARCHAR)'],
                                                     'id': ['datatype(NUMBER)', 'local_id("arch_context")'],
                                                     'interpretation': ['datatype(VARCHAR)'],
                                                     'modified': ['datatype(TIMESTAMP)', 'replfield_modified()'],
                                                     'modified_tz': ['datatype(TZ)'],
                                                     'modified_by': ['datatype(VARCHAR)',
                                                                     'replfield_modified_by()',
                                                                     "default('Null')"],
                                                     'opening elevations': ['datatype(VARCHAR)'],
                                                     'type': ['datatype(VARCHAR)', "lookup('locus_types', 'id')"],
                                                     'uid': ['datatype(UUID)', 'replfield_uuid()',
                                                             'join("tagging", "source_uid")'],
                                                     'uid_unit': ['datatype(UUID)', 'join("unit")']}

    def test_get_unparsed_field_instructions(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        assert dsd.get_unparsed_field_instructions("locus", "arch_domain") == ['datatype(VARCHAR)',
                                                                               'id_domain("arch_context")']

    def test_get_lookup_joins(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(lookup_test_dsd3)
        assert [(x.related_table, x.related_field) for x in dsd.get_lookup_joins("locus")] == [("locus_types", "id"),
                                                                                               ("locus_color", "uid")]

        assert dsd.get_lookup_joins("locus_architecture") == []

    def test_assert_raw(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        assert dsd.assert_raw(["locus"])
        assert dsd.assert_raw(["locus"], "structure")
        assert not dsd.assert_raw(["locus"], "meta")

    def test_append_field(self, dsd_urap_dsd3):
        dsd: DataSetDefinition = dsd_urap_dsd3
        assert "new_field" not in dsd.list_fields("locus")
        dsd.append_field("locus", "new_field", ["datatype(VARCHAR)", "default('Null')"])
        assert "new_field" in dsd.list_fields("locus")

    def test_table_can_sync(self, dsd_real_urap_dsd):
        dsd: DataSetDefinition = dsd_real_urap_dsd
        assert dsd.table_can_sync("locus")
        assert not dsd.table_can_sync("kiosk_user")

    def test_get_virtual_fields(self):
        dsd: DataSetDefinition = DataSetDefinition()
        assert dsd.get_virtual_fields({"config": {
            "format_version": 3
        },
            "table1": {
                "structure": {
                    1: {
                        "feld1": ["datatype(VARCHAR)"],
                        "feld2": ["datatype(timestamp)", "replfield_modified()"],
                    }
                }
            }
        }) == {'table1': {1: {'feld2_tz': ['datatype(TZ)', 'modified_tz()'],
                'feld2_ww': ['datatype(TIMESTAMP)', 'modified_ww()']}}}


    def test_omit_fields_by_datatype(self, dsd_images_and_units):
        dsd: DataSetDefinition = dsd_images_and_units
        assert dsd.append_file(dsd3_test_tz_file)
        field_list = dsd.list_fields("test")
        assert field_list == ['name',
                              'description',
                              'some_date',
                              'explicit_r',
                              'dontsync',
                              'uid',
                              'created',
                              'modified',
                              'modified_by',
                              'some_date_tz',
                              'explicit_r_tz',
                              'dontsync_tz',
                              'created_tz',
                              'modified_tz']
        assert dsd.omit_fields_by_datatype("test", field_list, "tz") == ['name',
                                                                         'description',
                                                                         'some_date',
                                                                         'explicit_r',
                                                                         'dontsync',
                                                                         'uid',
                                                                         'created',
                                                                         'modified',
                                                                         'modified_by',
                                                                         # 'some_date_tz',
                                                                         # 'explicit_r_tz',
                                                                         # 'dontsync_tz',
                                                                         # 'created_tz',
                                                                         # 'modified_tz'
                                                                         ]

    def test_get_field_instructiuons_for_tz(self, cfg, dsd_images_and_units):
        dsd: DataSetDefinition = dsd_images_and_units
        assert dsd.append_file(dsd3_test_tz_file)
        assert dsd.get_field_datatype("test", "some_date_tz") == "tz"
        assert dsd.get_field_instructions("test", "some_date_tz") == {'datatype': ['TZ']}

    def test_get_proxy_field_reference_for_tz(self, cfg, dsd_images_and_units):
        dsd: DataSetDefinition = dsd_images_and_units
        assert dsd.append_file(dsd3_test_tz_file)
        assert dsd.get_proxy_field_reference("test", "some_date_tz", test=True) == ""

        dsd_workstation_view = DSDView(dsd)
        dsd_workstation_view.apply_view_instructions({"config":
                                                          {"format_ver": 3},
                                                      "tables": [
                                                          "include_tables_with_instruction('replfield_uuid')",
                                                          "exclude_fields_with_instruction('no_sync')",
                                                      ]})
        ws_dsd = dsd_workstation_view.dsd
        assert ws_dsd.get_proxy_field_reference("test", "some_date_tz", test=True) == ""
