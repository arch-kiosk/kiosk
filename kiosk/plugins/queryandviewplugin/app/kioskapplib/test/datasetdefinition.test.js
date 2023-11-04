// noinspection DuplicatedCode
import { expect, test } from 'vitest'
import { DataSetDefinition } from "../datasetdefinition.ts";

function test_dsd() {
    return {
        "site": {
            "arch_context": [
                "datatype(VARCHAR)",
                "identifier()",
                "label(\"site\")"
            ],
            "uid": [
                "datatype(UUID)",
                "replfield_uuid()"
            ],
        },
        "unit": {
            "arch_context": [
                "datatype(VARCHAR)",
                "identifier()",
                "label(\"unit\")"
            ],
                "arch_domain": [
                "datatype(VARCHAR)",
                "id_domain(\"arch_context\")"
            ],
                "coordinates": [
                "datatype(VARCHAR)"
            ],
                "created": [
                "datatype(TIMESTAMP)",
                "replfield_created()"
            ],
                "excavator_full_name": [
                "datatype(VARCHAR)"
            ],
                "id": [
                "datatype(NUMBER)",
                "local_id(\"arch_context\")"
            ],
                "id_excavator": [
                "datatype(VARCHAR)"
            ],
                "id_site": [
                "datatype(VARCHAR)",
                "join(\"site\",\"id\")"
            ],
                "identification_method_analysis": [
                "datatype(VARCHAR)"
            ],
                "identification_method_cm": [
                "datatype(VARCHAR)"
            ],
                "identification_method_loci": [
                "datatype(VARCHAR)"
            ],
                "legacy_unit_id": [
                "datatype(VARCHAR)"
            ],
                "method": [
                "datatype(VARCHAR)"
            ],
                "modified": [
                "datatype(TIMESTAMP)",
                "replfield_modified()"
            ],
                "modified_by": [
                "datatype(VARCHAR)",
                "replfield_modified_by()",
                "default(null)"
            ],
                "name": [
                "datatype(VARCHAR)"
            ],
                "purpose": [
                "datatype(VARCHAR)"
            ],
                "spider_counter": [
                "datatype(NUMBER)"
            ],
                "term_for_locus": [
                "datatype(VARCHAR)"
            ],
                "term_for_unit": [
                "datatype(VARCHAR)"
            ],
                "type": [
                "datatype(VARCHAR)"
            ],
                "uid": [
                "datatype(UUID)",
                "replfield_uuid()"
            ],
                "unit_creation_date": [
                "datatype(DATE)"
            ]
        },
        "unit_narrative": {
            "created": [
                "datatype(TIMESTAMP)",
                "replfield_created()"
            ],
                "date": [
                "datatype(TIMESTAMP)"
            ],
                "id_excavator": [
                "datatype(TEXT)"
            ],
                "id_unit": [
                "datatype(TEXT)"
            ],
                "modified": [
                "datatype(TIMESTAMP)",
                "replfield_modified()"
            ],
                "modified_by": [
                "datatype(TEXT)",
                "replfield_modified_by()",
                "default(null)"
            ],
                "narrative": [
                "datatype(TEXT)",
                "record_description()"
            ],
                "uid": [
                "datatype(UUID)",
                "replfield_uuid()"
            ],
                "uid_unit": [
                "datatype(UUID)",
                "join(\"unit\")"
            ]
        }
    }
}

test("test init and version", () => {
    let dsd = undefined
    expect(() => dsd = new DataSetDefinition()).not.toThrowError();
    expect(()=> dsd.loadFromDict({},1)).toThrowError(/Version .* not supported/)
    expect(()=> dsd.loadFromDict({},3)).not.toThrowError()
});

test("test structure fails: table", () => {
    let dsd = undefined
    expect(() => dsd = new DataSetDefinition()).not.toThrowError();
    expect(()=> dsd.loadFromDict({"a_table": undefined})).toThrowError(/table .* foul/)
    expect(()=> dsd.loadFromDict({"a_table": 'undefined'})).toThrowError(/table .* foul/)
    expect(()=> dsd.loadFromDict({"a_table": new Map()})).not.toThrowError()
});

test("test structure fails: table field", () => {
    let dsd = undefined
    expect(() => dsd = new DataSetDefinition()).not.toThrowError();
    expect(()=> dsd.loadFromDict({"a_table": {}})).not.toThrowError()
    expect(()=> dsd.loadFromDict({"a_table": {"12": []}})).not.toThrowError(/field .* foul/)
    expect(()=> dsd.loadFromDict({"a_table": {"field": undefined}})).toThrowError(/field .* foul/)
    expect(()=> dsd.loadFromDict({"a_table": {"field": 12}})).toThrowError(/field .* foul/)
    expect(()=> dsd.loadFromDict({"a_table": {"field": ["instruction()"]}})).not.toThrowError()
});

test("test structure fails: instruction wrong", () => {
    let dsd = undefined
    expect(() => dsd = new DataSetDefinition()).not.toThrowError();
    expect(()=> dsd.loadFromDict({"a_table": {"field": ["instruction()"]}})).not.toThrowError()
    expect(()=> dsd.loadFromDict({"a_table": {"field": ["my_instruction", "2nd_instruction()"]}}))
        .toThrowError(/malformed instruction my_instruction/)
    expect(()=> dsd.loadFromDict({"a_table": {"field": ["my_instruction(1,2,3)", "2nd_instruction(1,'("]}}))
        .toThrowError(/malformed instruction 2nd_instruction/)
    expect(()=> dsd.loadFromDict({"a_table": {"field": ["my_instruction(1,2,3)", "2nd_instruction(1,'(')"]}}))
        .not.toThrowError()
});

test("test list_tables", () => {
    let dsd = new DataSetDefinition()
    expect(()=> dsd.loadFromDict(test_dsd())).not.toThrowError()
    expect(dsd.tables).toStrictEqual(["unit", "unit_narrative"])
})

test("test list_fields", () => {
    let dsd = new DataSetDefinition()
    expect(()=> dsd.loadFromDict(test_dsd())).not.toThrowError()
    expect(dsd.list_fields("unit")).toStrictEqual([
        "arch_context",
        "arch_domain",
        "coordinates",
        "created",
        "excavator_full_name",
        "id",
        "id_excavator",
        "id_site",
        "identification_method_analysis",
        "identification_method_cm",
        "identification_method_loci",
        "legacy_unit_id",
        "method",
        "modified",
        "modified_by",
        "name",
        "purpose",
        "spider_counter",
        "term_for_locus",
        "term_for_unit",
        "type",
        "uid",
        "unit_creation_date"
    ])
    expect(dsd.list_fields("unit_narrative").length).toBe(9)

})

test("list_field_instructions", () => {
    let dsd = new DataSetDefinition()
    expect(()=> dsd.loadFromDict(test_dsd())).not.toThrowError()
    expect(dsd.list_field_instructions("unit", "spider_counter")).toStrictEqual([{
        instruction: "datatype",
        parameters: ["NUMBER"]
    }])

    expect(dsd.list_field_instructions("unit", "arch_context")).toStrictEqual(
        [
            {
                instruction: "datatype",
                parameters: ["VARCHAR"]
            },
            {
                instruction: "identifier",
                parameters: []
            },
            {
                instruction: "label",
                parameters: ["unit"]
            }
            ]
    )
})

test("get_fields_with_instruction", () => {
    let dsd = new DataSetDefinition()
    expect(()=> dsd.loadFromDict(test_dsd())).not.toThrowError()
    expect(dsd.get_fields_with_instruction("unit", "datatype")).toStrictEqual([
        "arch_context",
        "arch_domain",
        "coordinates",
        "created",
        "excavator_full_name",
        "id",
        "id_excavator",
        "id_site",
        "identification_method_analysis",
        "identification_method_cm",
        "identification_method_loci",
        "legacy_unit_id",
        "method",
        "modified",
        "modified_by",
        "name",
        "purpose",
        "spider_counter",
        "term_for_locus",
        "term_for_unit",
        "type",
        "uid",
        "unit_creation_date"
    ])
    expect(dsd.get_fields_with_instruction("unit", "identifier")).toStrictEqual([
        "arch_context"
    ])
    expect(dsd.get_fields_with_instruction("unit", "default")).toStrictEqual([
        "modified_by"
    ])
})

test("get_field_instruction", () => {
    let dsd = new DataSetDefinition()
    expect(() => dsd.loadFromDict(test_dsd())).not.toThrowError()
    expect(dsd.get_field_instruction("unit", "modified_by", "default")).toStrictEqual(
        {"instruction":"default",
                 "parameters": ["null"]
        })
    expect(dsd.get_field_instruction("unit", "arch_context", "label")).toStrictEqual(
        {"instruction":"label",
            "parameters": ["unit"]
        })
})

test("get_field_instruction_parameters", () => {
    let dsd = new DataSetDefinition()
    expect(() => dsd.loadFromDict(test_dsd())).not.toThrowError()
    expect(dsd.get_field_instruction_parameters("unit", "modified_by", "default")).toStrictEqual(
        ["null"])

    expect(dsd.get_field_instruction_parameters("unit", "arch_context", "label")).toStrictEqual(
        ["unit"])
})

test("get_lore_tables", () => {
    let dsd = new DataSetDefinition()
    expect(() => dsd.loadFromDict(test_dsd())).not.toThrowError()
    expect(dsd.get_lore_tables("site")).toStrictEqual([])
    expect(dsd.get_lore_tables("unit")).toStrictEqual(["site"])
    expect(dsd.get_lore_tables("unit_narrative")).toStrictEqual(["unit", "site"])
})