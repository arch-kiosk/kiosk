import pytest
import os
from dsd.dsd3 import DataSetDefinition
from dsd.dsdyamlloader import DSDYamlLoader
from dsd.dsd3 import DSDInstructionSyntaxError, DSDUnknownInstruction
from dsd.dsdview import DSDView
from test.testhelpers import KioskPyTestHelper

test_path = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(test_path, "data")

dsd2_file = os.path.join(data_dir, "dsd2.yml")
dsd3_images_file = os.path.join(data_dir, "dsd3_images.yml")
dsd3_images_file2 = os.path.join(data_dir, "dsd3_unit.yml")
dsd3_test_file = os.path.join(data_dir, "dsd3_test.yml")
dsd3_external_test_base_file = os.path.join(data_dir, "dsd3_external_test_base.yml")
dsd3_test_view1 = os.path.join(data_dir, "dsd3_view_filemaker_recording.yml")
dsd3_dayplan = os.path.join(data_dir, "dsd3_dayplan.yml")
default_dsd3 = os.path.join(data_dir, "default_dsd3.yml")

config_file = os.path.join(test_path, r"config", "config_test.yml")


class TestDataSetDefinition(KioskPyTestHelper):

    @pytest.fixture(scope="module")
    def cfg(self):
        return self.get_config(config_file)

    @pytest.fixture()
    def dsd_initialized(self, cfg):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        assert dsd.append_file(dsd3_images_file)
        assert dsd.append_file(dsd3_images_file2)
        assert dsd.append_file(dsd3_test_file)
        return dsd

    def test_init(self, dsd_initialized):
        dsd = dsd_initialized
        assert dsd.append_file(dsd3_images_file)
        assert "images" in dsd._dsd_data.get([])
        assert "test" in dsd._dsd_data.get([])

    def test_view_clones_dsd(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        view_dsd = dsd.clone()
        assert "images" in view_dsd._dsd_data.get([])
        assert "test" in view_dsd._dsd_data.get([])
        view_dsd._dsd_data.set(["images"], "nix")
        assert view_dsd._dsd_data.get(["images"]) == "nix"
        assert not isinstance(view_dsd._dsd_data.get(["images"]), dict)
        assert isinstance(dsd._dsd_data.get(["images"]), dict)

    def test_view_load_instructions(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        view = DSDView(dsd)
        view_instructions = view.load_view_from_file(dsd3_test_view1, DSDYamlLoader())
        assert view_instructions
        assert "tables" in view_instructions
        assert "exclude_fields" in view_instructions

    def test_view_apply_instructions_with_errors(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        view = DSDView(dsd)
        assert "images" in view.dsd._dsd_data.get([])
        view_instructions = {"tables": ["wronginstruction(\"some parameter\")"]}
        with pytest.raises(DSDUnknownInstruction):
            view.apply_view_instructions(view_instructions)
        view_instructions = {"tables": ["badinstruction"]}
        with pytest.raises(DSDInstructionSyntaxError):
            view.apply_view_instructions(view_instructions)

    def test_view_apply_include(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        view = DSDView(dsd)
        assert "images" in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])
        assert "unit" in view.dsd._dsd_data.get([])

        assert view.apply_view_instructions({"tables": ["include('images')"]})
        assert "images" in view.dsd._dsd_data.get([])
        assert "test" not in view.dsd._dsd_data.get([])
        assert "unit" not in view.dsd._dsd_data.get([])

        view = DSDView(dsd)
        assert view.apply_view_instructions({"tables": ["include('*')"]})
        assert "images" in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])
        assert "unit" in view.dsd._dsd_data.get([])

        view = DSDView(dsd)
        assert view.apply_view_instructions({"tables": ["include('nothing')"]})
        assert "images" not in view.dsd._dsd_data.get([])
        assert "test" not in view.dsd._dsd_data.get([])
        assert "unit" not in view.dsd._dsd_data.get([])

    def test_view_apply_exclude(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        view = DSDView(dsd)
        assert "images" in view.dsd._dsd_data.get([])

        assert view.apply_view_instructions({"tables": ["include(*)"]})
        assert "images" in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])
        assert "unit" in view.dsd._dsd_data.get([])

        view = DSDView(dsd)
        assert view.apply_view_instructions({"tables": ["include(*)", "exclude('images')"]})
        assert "images" not in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])
        assert "unit" in view.dsd._dsd_data.get([])

        view = DSDView(dsd)
        assert view.apply_view_instructions({"tables": ["include(*)",
                                                        "exclude('images')",
                                                        "exclude('test')",
                                                        "exclude('unit')"]})
        assert "images" not in view.dsd._dsd_data.get([])
        assert "test" not in view.dsd._dsd_data.get([])
        assert "unit" not in view.dsd._dsd_data.get([])

    def test_view_apply_include_tables_with_instruction(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        dsd.append_file(dsd3_dayplan)
        view = DSDView(dsd)
        assert "images" in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])
        assert "unit" in view.dsd._dsd_data.get([])
        assert "dayplan" in view.dsd._dsd_data.get([])

        assert view.apply_view_instructions({"tables": ["include_tables_with_instruction('replfield_uuid')"]})
        assert "unit" in view.dsd._dsd_data.get([])
        assert "dayplan" in view.dsd._dsd_data.get([])
        assert "images" not in view.dsd._dsd_data.get([])
        assert "test" not in view.dsd._dsd_data.get([])

    def test_view_apply_include_tables_with_flags(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        dsd.append_file(dsd3_dayplan)
        view = DSDView(dsd)
        assert "images" in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])
        assert "unit" in view.dsd._dsd_data.get([])
        assert "dayplan" in view.dsd._dsd_data.get([])

        assert view.apply_view_instructions({"tables": ["include_tables_with_flag('not_in_master')"]})
        assert "unit" not in view.dsd._dsd_data.get([])
        assert "dayplan" not in view.dsd._dsd_data.get([])
        assert "images" not in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])

    def test__apply_exclude_field(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        dsd.append_file(dsd3_dayplan)
        view = DSDView(dsd)
        assert "images" in view.dsd._dsd_data.get([])
        assert "filename" in view.dsd.list_fields("images")
        assert view.apply_view_instructions({"tables": ["include(*)", "exclude_field('images', 'filename')"]})
        assert "images" in view.dsd._dsd_data.get([])
        assert "filename" not in view.dsd.list_fields("images")

    def test__apply_exclude_fields_with_instruction(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        dsd.append_file(dsd3_dayplan)
        view = DSDView(dsd)
        assert "images" in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])
        assert "filename" in view.dsd.list_fields("images")
        assert "extra_field" in view.dsd.list_fields("images")
        assert "dontsync" in view.dsd.list_fields("test")
        assert view.apply_view_instructions({"tables": ["include(*)",
                                                        "exclude_fields_with_instruction('images', 'no_sync')"]})
        assert "images" in view.dsd._dsd_data.get([])
        assert "filename" not in view.dsd.list_fields("images")
        assert "extra_field" not in view.dsd.list_fields("images")
        assert "dontsync" in view.dsd.list_fields("test")

    def test__apply_exclude_fields_with_instruction_all_tables(self, dsd_initialized):
        dsd: DataSetDefinition = dsd_initialized
        dsd.append_file(dsd3_dayplan)
        view = DSDView(dsd)
        assert "images" in view.dsd._dsd_data.get([])
        assert "test" in view.dsd._dsd_data.get([])
        assert "filename" in view.dsd.list_fields("images")
        assert "extra_field" in view.dsd.list_fields("images")
        assert "dontsync" in view.dsd.list_fields("test")
        assert view.apply_view_instructions({"tables": ["include(*)",
                                                        "exclude_fields_with_instruction('no_sync')"]})
        assert "images" in view.dsd._dsd_data.get([])
        assert "filename" not in view.dsd.list_fields("images")
        assert "extra_field" not in view.dsd.list_fields("images")
        assert "dontsync" not in view.dsd.list_fields("test")

    def test__apply_exclude_id_and_domain_fields(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        dsd.append_file(default_dsd3)
        view = DSDView(dsd)
        assert "collected_material" in view.dsd._dsd_data.get([])
        assert "arch_domain" in view.dsd.list_fields("collected_material")
        assert "id" in view.dsd.list_fields("collected_material")
        assert view.apply_view_instructions({"tables": ["include(*)",
                                                        "exclude_fields_with_instruction('id_domain')",
                                                        "exclude_fields_with_instruction('local_id')"]})
        assert "arch_domain" not in view.dsd.list_fields("collected_material")
        assert "id" not in view.dsd.list_fields("collected_material")
        assert "uid" in view.dsd.list_fields("collected_material")
        assert "arch_domain" not in view.dsd.list_fields("locus")
        assert "id" not in view.dsd.list_fields("locus")
        assert "uid" in view.dsd.list_fields("locus")

    def test__apply_exclude_all_fields(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        dsd.append_file(default_dsd3)
        view = DSDView(dsd)
        assert "unit" in view.dsd._dsd_data.get([])
        assert len(view.dsd.list_fields("unit")) > 0
        assert view.apply_view_instructions({"tables": ["include(unit)",
                                                        "exclude_all_fields_from_table('unit')"]})
        assert "unit" in view.dsd._dsd_data.get([])
        assert len(view.dsd.list_fields("unit")) == 0

    def test__apply_include_field(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        dsd.append_file(default_dsd3)
        view = DSDView(dsd)
        assert "unit" in view.dsd._dsd_data.get([])
        assert len(view.dsd.list_fields("unit")) > 0
        assert view.apply_view_instructions({"tables": ["include(unit)",
                                                        "exclude_all_fields_from_table('unit')",
                                                        "include_field('unit', 'arch_context')",
                                                        "include_field('unit', 'arch_domain')"]
                                             })
        assert "unit" in view.dsd._dsd_data.get([])
        assert len(view.dsd.list_fields("unit")) == 2

    def test__apply_include_fields(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        dsd.append_file(default_dsd3)
        view = DSDView(dsd)
        assert "unit" in view.dsd._dsd_data.get([])
        assert len(view.dsd.list_fields("unit")) > 0
        assert view.apply_view_instructions({"tables": ["include(unit)",
                                                        "exclude_all_fields_from_table('unit')",
                                                        "include_fields('unit', 'arch_context', 'arch_domain', "
                                                        "'purpose')"]
                                             })
        assert "unit" in view.dsd._dsd_data.get([])
        assert len(view.dsd.list_fields("unit")) == 3

    def test__apply_exclude_fields(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        dsd.append_file(default_dsd3)
        view = DSDView(dsd)
        assert "unit" in view.dsd._dsd_data.get([])
        assert "arch_context" in view.dsd.list_fields("unit")
        assert "arch_domain" in view.dsd.list_fields("unit")
        assert "purpose" in view.dsd.list_fields("unit")

        assert len(view.dsd.list_fields("unit")) > 0
        assert view.apply_view_instructions({"tables": ["include(unit)",
                                                        "exclude_fields('unit', 'arch_context', 'arch_domain', "
                                                        "'purpose')"]
                                             })
        assert "unit" in view.dsd._dsd_data.get([])
        assert len(view.dsd.list_fields("unit")) > 0
        assert "arch_context" not in view.dsd.list_fields("unit")
        assert "arch_domain" not in view.dsd.list_fields("unit")
        assert "purpose" not in view.dsd.list_fields("unit")


    def test__apply_include_fields_with_instruction(self):
        dsd = DataSetDefinition()
        dsd.register_loader("yml", DSDYamlLoader)
        dsd.append_file(default_dsd3)
        view = DSDView(dsd)
        assert "unit" in view.dsd._dsd_data.get([])
        assert len(view.dsd.list_fields("unit")) > 0
        assert view.apply_view_instructions({"tables": ["include(unit)",
                                                        "exclude_all_fields_from_table('unit')",
                                                        "include_fields_with_instruction('unit', 'label')"]
                                             })
        assert "unit" in view.dsd._dsd_data.get([])
        assert view.dsd.list_fields("unit") == ["legacy_unit_id", "arch_context"]
