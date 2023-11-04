// noinspection DuplicatedCode
import { expect, test } from 'vitest'
import { VariableParser } from "../variableparser.js";

test("test parser return code", () => {
    expect(new VariableParser("no variable").parse()).toBe(0);
    expect(new VariableParser("one #(variable)").parse()).toBe(1);
    expect(new VariableParser("two #(variable) #(also_a_variable)").parse()).toBe(2);
});

test("test parser return variable name", () => {
    let parser = new VariableParser("one #(a_variable)")
    expect(parser.variableNames[0]).toBe("a_variable");

    parser = new VariableParser("one #(a_variable) and #(another_variable) and #(yet_another_variable)")
    expect(parser.variableNames[0]).toBe("a_variable");
    expect(parser.variableNames[1]).toBe("another_variable");
    expect(parser.variableNames[2]).toBe("yet_another_variable");

});

test("test parser set value", () => {
    let parser = new VariableParser("one #(a_variable) and another #(b_variable)")
    expect(() => parser.set("a_variable", "a value")).not.toThrowError()
    expect(parser.get("a_variable")).toBe("a value")
    expect(parser.get("b_variable")).toBe(undefined)
    expect(() => parser.set("b_variable", "b value")).not.toThrowError()
    expect(parser.get("b_variable")).toBe("b value")
    expect(() => parser.set("c_variable", "c value")).toThrowError()
})

test("test parser substitute", () => {
    let parser = new VariableParser("one #(a_variable) and another #(b_variable)")
    expect(() => parser.set("a_variable", "a value")).not.toThrowError()
    expect(parser.substitute()).toBe("one a value and another ")
    expect(parser.substitute(true)).toBe("one a value and another #(b_variable)")
    expect(() => parser.set("b_variable", "b value")).not.toThrowError()
    expect(parser.substitute(true)).toBe("one a value and another b value")
    expect(parser.substitute(false)).toBe("one a value and another b value")
})

test("test quickly substitute", () => {
    expect(VariableParser.quicklySubstitute(
        "one #(a_variable) and another #(b_variable)",v => v==="a_variable"?"a value":"b value"))
        .toBe("one a value and another b value")
})

test("test quickly substitute same variable twice", () => {
    expect(VariableParser.quicklySubstitute(
        "one #(a_variable) and another #(a_variable)",v => v==="a_variable"?"a value":"b value"))
        .toBe("one a value and another a value")
})

test("test quickly substitute same variable once with quantifier", () => {
    expect(VariableParser.quicklySubstitute(
        "one #(a_variable) and another #(a_variable)",v => v==="a_variable"?"a value":"b value",
        "1"))
        .toBe("one a value and another #(a_variable)")
})

test("test quickly substitute two variables once with quantifier", () => {
    expect(VariableParser.quicklySubstitute(
        "one #(a_variable) and another #(b_variable)",v => v==="a_variable"?"a value":"b value",
        "1"))
        .toBe("one a value and another #(b_variable)")
})