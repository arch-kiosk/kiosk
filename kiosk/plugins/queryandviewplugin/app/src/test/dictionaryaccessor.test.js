import { expect, test } from "vitest";
import { DataContext } from "../lib/datacontext.ts";
import { Constant } from "../lib/applib.ts";
import { DictionaryAccessor } from "../lib/dictionaryAccessor.ts";

test("test get", () => {
    const dataContext = new DataContext();
    let constants = [
        {
            path: "glossary",
            key: "locus",
            value: "locus value",
        },
        {
            path: "glossary",
            key: "unit",
            value: "unit value",
        },
        {
            path: "constants",
            key: "unit",
            value: "unit value",
        },
        {
            path: "constants/labels",
            key: "label_datum_point_elevation",
            value: "datum point elevation",
        },
    ];
    const constantAccessor = new DictionaryAccessor("dictionary", dataContext, constants)
    dataContext.registerAccessor(constantAccessor)
    expect(dataContext.get("locus/data")).not.toBeDefined()
    expect(dataContext.get("$/glossary/locus")).toBe("locus value")
    expect(dataContext.get("/$/glossary/locus")).toBe("locus value")
    expect(dataContext.get("/$/glossary/unit")).toBe("unit value")
    expect(dataContext.get("*/unit")).toBe("unit value")
    expect(dataContext.get("unit")).toBe("unit value")
    expect(dataContext.get("$/constants/labels/label_datum_point_elevation")).toBe("datum point elevation")
    expect(dataContext.get("/constants/labels/label_datum_point_elevation")).not.toBe("datum point elevation")
    expect(dataContext.get("*/constants/labels/label_datum_point_elevation")).toBe("datum point elevation")
    expect(dataContext.get("*/labels/label_datum_point_elevation")).toBe("datum point elevation")
});
