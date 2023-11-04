// noinspection DuplicatedCode
import { expect, test } from 'vitest'
import SimpleFunctionParser from "../simplefunctionparser";

test("finds some_func() a valid instruction", () => {
    expect(new SimpleFunctionParser().parse("some_func()")).toBe(true);
});

test("finds some_func not a valid instruction", () => {
    expect(new SimpleFunctionParser().parse("some_func")).toBe(false);
});

test("finds some_func(param_one) a valid instruction", () => {
    expect(new SimpleFunctionParser().parse("some_func(param_one)")).toBe(true);
});

test('finds some_func("param_one") a valid instruction', () => {
    expect(new SimpleFunctionParser().parse('some_func("param_one")')).toBe(true);
});

test("finds some_func('param_one') a valid instruction", () => {
    expect(new SimpleFunctionParser().parse("some_func('param_one')")).toBe(true);
});

test("finds some_func('param_one', 'param_two') a valid instruction", () => {
    expect(new SimpleFunctionParser().parse("some_func('param_one', 'param_two')")).toBe(true);
});

test("get the correct result from some_func(1, 'param_two')", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("some_func(1, 'param_two')");
    expect(parser.ok).toBe(true);
    expect(parser.instruction).toBe("some_func");
    expect(parser.parameters).toStrictEqual(["1", "param_two"]);
});

test("get no parameters from noparamfunc()", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("noparamfunc()");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(0)
});

test("get an empty parameter in the middle of func(first,\"\",\"third\")", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func(first,\"\",\"third\")");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(3)
    expect(parser.parameters[1]).toBe("")
    expect(parser.parameters[0]).toBe("first")
    expect(parser.parameters[2]).toBe("third")
});

test("get an empty parameter in the middle of func(first,'',\"third\")", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func(first,'',\"third\")");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(3)
    expect(parser.parameters[1]).toBe("")
    expect(parser.parameters[0]).toBe("first")
    expect(parser.parameters[2]).toBe("third")
});

test("get an empty parameter in the middle of func(first,,\"third\")", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func(first,,\"third\")");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(3)
    expect(parser.parameters[1]).toBe("")
    expect(parser.parameters[0]).toBe("first")
    expect(parser.parameters[2]).toBe("third")
});

test("get an empty parameter at the end of func(first,\"second\",)", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func(first,\"second\",)");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(3)
    expect(parser.parameters[0]).toBe("first")
    expect(parser.parameters[1]).toBe("second")
    expect(parser.parameters[2]).toBe("")
});

test("get four empty parameter from func(,,,)", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func(,,,)");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(4)
    expect(parser.parameters[0]).toBe("")
    expect(parser.parameters[1]).toBe("")
    expect(parser.parameters[2]).toBe("")
    expect(parser.parameters[3]).toBe("")
});

test("get null,a,b,null parameters from func(,a,b,)", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func(,a,b,)");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(4)
    expect(parser.parameters[0]).toBe("")
    expect(parser.parameters[1]).toBe("a")
    expect(parser.parameters[2]).toBe("b")
    expect(parser.parameters[3]).toBe("")
});

test("get modified_by and Urap's iPad from func(modified_by, \"Urap's iPad\")", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func(modified_by, \"Urap's iPad\")");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(2)
    expect(parser.parameters[0]).toBe("modified_by")
    expect(parser.parameters[1]).toBe("Urap's iPad")
});

test("get \"something\" from default(something)", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("default(something)");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(1);
    expect(parser.parameters[0]).toBe("something")
});

test("get \"something\" from default('something')", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("default(something)");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(1);
    expect(parser.parameters[0]).toBe("something")
});

test("get \"null\" from default(null)", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("default(null)");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(1);
    expect(parser.parameters[0]).toBe("null")
});
test("get \"'null'\" from default('null')", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("default('null')");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(1);
    expect(parser.parameters[0]).toBe("'null'")
});

test("ignores internal brackets in quoted parameters", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func('something(that has brackets)', 'more(brackets)')");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(2);
    expect(parser.parameters[0]).toBe("something(that has brackets)")
    expect(parser.parameters[1]).toBe("more(brackets)")
});

test("ignores internal brackets in unquoted parameters", () => {
    const parser = new SimpleFunctionParser();
    parser.parse("func(something(that has brackets), more(brackets))");
    expect(parser.ok).toBe(true);
    expect(parser.parameters.length).toBe(2);
    expect(parser.parameters[0]).toBe("something(that has brackets)")
    expect(parser.parameters[1]).toBe("more(brackets)")
});
test("no parameter", () => {
    const parser = new SimpleFunctionParser();
    expect(parser.parse("identifier()")).toBe(true)

})
