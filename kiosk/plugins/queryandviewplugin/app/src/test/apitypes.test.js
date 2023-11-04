import { ApiKioskViewDocument, ApiResultKioskView, ApiKioskViewCompilation, ApiKioskViewGroup } from "../lib/apitypes";
import { expect, test } from "vitest";
import { KioskViewDocument } from "../lib/kioskviewdocument";
import { KioskViewGroupPart } from "../lib/kioskviewgrouppart";

test("test testing", () => {
    expect(true).toBe(true);
    const v1 = JSON.parse(`
    {
        "document": {
            "kioskview.header": {
                "version": 1
            }
        }
    }`);
    expect(v1).toHaveProperty("document");
    expect(v1.document).toBeDefined();
    expect(v1.document).toHaveProperty("kioskview.header");
    expect(v1.document["kioskview.header"].version).toBe(1);
});

test("instantiate and check header", () => {
    const doc = JSON.parse(`
    {
        "kioskview.header": {
            "version": 2
        }
    }`);
    const viewDocument = new KioskViewDocument();
    expect(() => viewDocument.load(doc)).toThrowError(/Cannot process version/);

    doc["kioskview.header"].version = 1;

    expect(() => viewDocument.load({ "kioskview.header": {} })).toThrowError(/has no version/);

    expect(() => viewDocument.load({})).toThrowError(/has no header/);
});

test("check compilation", () => {
    const doc = JSON.parse(`
    {
        "kioskview.header": {
            "version": 1
        }
    }`);
    const viewDocument = new KioskViewDocument();
    expect(() => viewDocument.load(doc)).toThrowError(/has no compilation/);
    doc["compilation"] = {};
    expect(() => viewDocument.load(doc)).toThrowError(/has no name/);
    doc["compilation"] = {
        name: "unit view",
    };
    expect(() => viewDocument.load(doc)).toThrowError(/has no record_type/);
    doc["compilation"] = {
        name: "unit view",
        record_type: "unit",
    };
    expect(() => viewDocument.load(doc)).toThrowError(/has no groups/);

    doc["compilation"]["groups"] = {};
    expect(() => viewDocument.load(doc)).toThrowError(/has no groups/);

    doc["compilation"]["groups"] = {
        "group_1": {},
    };
    expect(() => viewDocument.load(doc)).not.toThrowError(/has no groups/);

    expect(() => viewDocument.load(doc)).toThrowError(/has no parts/);

    doc["compilation"]["groups"] = {
        "group_1": { parts: { "unit.sheet": {} } },
    };
    expect(() => viewDocument.load(doc)).toThrowError(/has no type/);

    doc["compilation"]["groups"] = {
        "group_1": {
            "parts": { "unit.sheet": {} },
            "type": "strange type",
        },
    };
    expect(() => viewDocument.load(doc)).toThrowError(/unknown type/);

    doc["compilation"]["groups"] = {
        "group_1": {
            "parts": { "unit.sheet": {} },
            "type": "accordion",
        },
    };
    expect(() => viewDocument.load(doc)).not.toThrowError(/unknown type/);
    doc["compilation"]["groups"] = {
        "group_1": {
            "parts": { "unit.sheet": {} },
            "type": "stacked",
        },
    };

    expect(() => viewDocument.load(doc)).not.toThrowError(/unknown type/);

});

test("check data and dsd", () => {
    const doc = JSON.parse(`
    {
        "kioskview.header": {
            "version": 1
        },
        "compilation": {
            "name": "unit view",
            "record_type": "unit",
            "groups": {
                "group_1": {
                    "type": "accordion",
                    "parts": {
                        "unit.sheet": {
                            "position": 1,
                            "text": "unit"
                        }
                    }
                }
            }
        },
        "unit.sheet": {
          "fields_selection": "dsd",
          "record_type": "unit",
          "view_type": "sheet",
          "layout_settings": {}
        }
        
    }`);
    const viewDocument = new KioskViewDocument();
    expect(() => viewDocument.load(doc)).toThrowError(/has no kioskview.data/);

    doc["kioskview.data"] = {};
    expect(() => viewDocument.load(doc)).toThrowError(/has no kioskview.dsd/);
    doc["kioskview.dsd"] = {};
    expect(() => viewDocument.load(doc)).not.toThrowError(/has no kioskview.dsd/);
});

test("getGroups", () => {
    const doc = JSON.parse(`
    {
        "kioskview.header": {
            "version": 1
        },
        "compilation": {
            "name": "unit view",
            "record_type": "unit",
            "groups": {
                "group_1": {
                    "type": "stacked",
                    "parts": {
                        "unit.sheet": {}
                    } 
                },
                "group_2": {
                    "type": "accordion",
                    "parts": {"unit.sheet":{}} 
                }
            }
        },
        "kioskview.data": {},
        "kioskview.dsd": {}
    }`);
    const viewDocument = new KioskViewDocument();
    expect(() => viewDocument.load(doc)).toThrowError(/has no text attribute/);
    doc.compilation.groups["group_1"].parts["unit.sheet"].text = "text 1";
    doc.compilation.groups["group_2"].parts["unit.sheet"].text = "text 2";
    expect(() => viewDocument.load(doc)).toThrowError(/has no position attribute/);

    doc.compilation.groups["group_1"].parts["unit.sheet"].position = 1;
    doc.compilation.groups["group_2"].parts["unit.sheet"].position = 1;

    // expect(() => viewDocument.load(doc)).toThrowError(/unknown layout/);

    doc["unit.sheet"] = {
        "fields_selection": "dsd",
        "record_type": "unit",
        "view_type": "sheet",
        "layout_settings": {}
    };
    expect(() => viewDocument.load(doc)).not.toThrowError(/unknown layout/);

    viewDocument.load(doc);
    expect(viewDocument.getGroups()).toStrictEqual([["group_1", "stacked"], ["group_2", "accordion"]]);

});

test("getParts and layout", () => {
    const doc = JSON.parse(`
    {
        "kioskview.header": {
            "version": 1
        },
        "compilation": {
            "name": "unit view",
            "record_type": "unit",
            "groups": {
                "group_1": {
                    "type": "stacked",
                    "parts": {
                        "unit.sheet": {
                            "text": "unit",
                            "opened": true,
                            "position": 2
                        },
                        "locus.list": {
                            "text": "loci",
                            "position": 1,
                            "layout": "loci.list"
                        }
                    } 
                }                
            }
        },
        "kioskview.data": {},
        "kioskview.dsd": {},
        "unit.sheet": {
          "fields_selection": "dsd",
          "record_type": "unit",
          "view_type": "sheet",
          "layout_settings": {}
        },
        "loci.list": {
            "record_type": "locus",
            "view_type": "list",
            "fields_selection": "dsd",
            "layout_settings": {}
        }
    }`);
    const viewDocument = new KioskViewDocument();
    viewDocument.load(doc);

    expect(viewDocument.getParts("group_1").map(part => part.text)).toStrictEqual(["loci", "unit"]);
    expect(viewDocument.getParts("group_1").map(part => part.layout.record_type)).toStrictEqual(["locus", "unit"]);
    expect(viewDocument.getParts("group_1")[0].opened).toBe(false);
    expect(viewDocument.getParts("group_1")[1].opened).toBe(true);
});

test("check_layout", () => {
    expect(() => KioskViewGroupPart.check_layout({}, "unit.sheet")).toThrowError(/does not exist/);
    expect(() => KioskViewGroupPart.check_layout({ "unit.sheet": {} }, "unit.sheet")).toThrowError(/no record_type attribute/);
    expect(() => KioskViewGroupPart.check_layout({ "unit.sheet": { "record_type": "unit" } }, "unit.sheet")).toThrowError(/no view_type attribute/);
    expect(() => KioskViewGroupPart.check_layout({
        "unit.sheet": {
            "record_type": "unit",
            "view_type": "list",
        }
    }, "unit.sheet")).toThrowError(/no fields_selection attribute/);

    expect(() => KioskViewGroupPart.check_layout({
        "unit.sheet": {
            "record_type": "unit",
            "view_type": "list",
            "fields_selection": "dsd"
        }
    }, "unit.sheet")).toThrowError(/no layout_settings/);

    expect(() => KioskViewGroupPart.check_layout({
        "unit.sheet": {
            "record_type": "unit",
            "view_type": "list",
            "fields_selection": "dsd",
            "layout_settings": {}
        }
    }, "unit.sheet")).not.toThrowError();
});
