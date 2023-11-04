import { expect, test } from "vitest";
import { DataContext } from "../lib/datacontext.ts";
import { Constant } from "../lib/applib.ts";
import { DSDRecordAccessor } from "../lib/dsdrecordaccessor.ts";


test("test get", () => {
    const dataContext = new DataContext();
    let records = [
        ["field 1","field 2","field 3", "field 4"],
        ["1.1","1.2","1.3", "1.4"],
        ["2.1","2.2","2.3", "2.4"],
        ["3.1","3.2","3.3", "3.4"],
        ["4.1","4.2","4.3", "4.4"]
    ];

    const recordAccessor = new DSDRecordAccessor("my_record", dataContext,
        {fields: records[0], record: records[1]})

    dataContext.registerAccessor(recordAccessor)
    expect(dataContext.get("my_record/field 1")).toBe("1.1")
    expect(dataContext.get("my_record/field 2")).toBe("1.2")
    recordAccessor.assignData({fields: records[0], record:records[2]})
    expect(dataContext.get("my_record/field 1")).toBe("2.1")
    expect(dataContext.get("my_record/field 2")).toBe("2.2")
    expect(dataContext.get("my_record/field 3")).toBe("2.3")
    expect(dataContext.get("my_record/field 4")).toBe("2.4")
    expect(dataContext.get("/my_record/field 4")).toBe("2.4")
    expect(dataContext.get("field 4")).toBe("2.4")
    expect(dataContext.get("*record/field 4")).toBe("2.4")
});
