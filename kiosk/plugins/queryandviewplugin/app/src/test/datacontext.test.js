import { expect, test } from "vitest";
import { DataContext } from "../lib/datacontext.ts";
import { DataContextAccessor } from "../lib/datacontextaccessor.ts";

class DummyAccessor extends DataContextAccessor {
    constructor(id, dataContext, data = []) {
        super(id, dataContext);
        this.data = data
    }

    get(path, key, getMode= 0) {
        if (Object.keys(this.data).find(k => k === path)) {
            const v = this.data[path].find(obj => obj.key === key)
            if (v) return v.value
        }
    }
}

test("test init", () => {
    const dataContext = new DataContext()
    expect(dataContext).toBeDefined();
});

test("test add accessor to top", () => {
    const dataContext = new DataContext()
    const accessor = new DummyAccessor("dummy", dataContext)
    expect(() => dataContext.registerAccessor(accessor)).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["dummy"])

    const accessor2 = new DummyAccessor("Bob", dataContext)
    expect(() => dataContext.registerAccessor(accessor2)).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["Bob", "dummy"])

    const accessor3 = new DummyAccessor("Huxley", dataContext)
    expect(() => dataContext.registerAccessor(accessor3)).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["Huxley", "Bob", "dummy"])
});

test("test add accessor to back", () => {
    const dataContext = new DataContext()
    const accessor = new DummyAccessor("dummy", dataContext)
    expect(() => dataContext.registerAccessor(accessor,false)).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["dummy"])

    const accessor2 = new DummyAccessor("Bob", dataContext)
    expect(() => dataContext.registerAccessor(accessor2, false)).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["dummy", "Bob"])

    const accessor3 = new DummyAccessor("Huxley", dataContext)
    expect(() => dataContext.registerAccessor(accessor3, false)).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["dummy", "Bob", "Huxley"])
});

test("test add accessor to position", () => {
    const dataContext = new DataContext()
    const accessor = new DummyAccessor("dummy", dataContext)
    expect(() => dataContext.registerAccessor(accessor)).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["dummy"])

    const accessor2 = new DummyAccessor("Bob", dataContext)
    expect(() => dataContext.registerAccessor(accessor2, true, "dummy")).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["Bob", "dummy"])

    const accessor3 = new DummyAccessor("Huxley", dataContext)
    expect(() => dataContext.registerAccessor(accessor3, false, "Bob")).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["Bob", "Huxley", "dummy"])

    const accessor4 = new DummyAccessor("Omar", dataContext)
    expect(() => dataContext.registerAccessor(accessor4, true, "Bob")).not.toThrowError()
    expect(dataContext.ids).toStrictEqual(["Omar", "Bob", "Huxley", "dummy"])
});

test("test separatePathAndKey", () => {
    const dataContext = new DataContext()

    expect(dataContext.separatePathAndKey("/$/constants/constant_1/my_key")).toStrictEqual({path:"/$/constants/constant_1", key: "my_key"})
    expect(dataContext.separatePathAndKey("my_key")).toStrictEqual({path:"", key: "my_key"})
    expect(dataContext.separatePathAndKey("")).toStrictEqual({path:"", key: ""})
    expect(dataContext.separatePathAndKey("/$/")).toStrictEqual({path:"/$", key: ""})
})

test("test get", () => {
    const dataContext = new DataContext()
    const accessor = new DummyAccessor("dummy",
        dataContext,
        { "/$/constants/constant_1": [{ key: "my_key", value: "my value" }] })
    dataContext.registerAccessor(accessor)
    expect(dataContext.get("/$/constants/constant_1/my_key")).toBe("my value")
})
