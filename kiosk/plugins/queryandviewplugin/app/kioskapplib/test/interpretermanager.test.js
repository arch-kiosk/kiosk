// noinspection DuplicatedCode
import { expect, test } from 'vitest'
import {InterpreterManager} from "../interpretermanager.js";
import {SymbolicDataReferenceInterpreter} from "../symbolicdatareferenceinterpreter.js";

test("test interpreter not interpreting anything", () => {
    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(new SymbolicDataReferenceInterpreter())

    expect(interpreter.interpret("")).toBe("");
    expect(interpreter.interpret(undefined)).toBe("");
    expect(interpreter.interpret(null)).toBe("");
    expect(interpreter.interpret("Nothing to do")).toBe("Nothing to do");
    expect(interpreter.interpret("##Nothing to do")).toBe("#Nothing to do");

});

test("test interpreter interpreting #() notation", () => {
    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(new SymbolicDataReferenceInterpreter(x => x === "variable"?"1":undefined))

    expect(interpreter.interpret("#(variable)")).toBe("1");
    expect(interpreter.interpret("#(not a variable)")).toBe("");

    expect(interpreter.interpret("#(variable) #(variable)")).toBe("1 1");
});

test("test interpreter interpreting #() notation with quantifiers", () => {
    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(new SymbolicDataReferenceInterpreter(x => x === "variable"?"1":undefined))

    expect(interpreter.interpret("#n(variable)")).toBe("1");
    expect(interpreter.interpret("#n(not a variable)")).toBe("");
    expect(interpreter.interpret("#n(variable) #(variable)")).toBe("1 1");
});

test("test interpreter interpreting #:#() notation", () => {
    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(new SymbolicDataReferenceInterpreter(x => x === "variable"?"1":undefined))

    expect(interpreter.interpret("#:#(variable)")).toBe("1");
    expect(interpreter.interpret("#:#(not a variable)")).toBe("");
    expect(interpreter.interpret("#:#(variable) #(variable)")).toBe("1 1");
});

test("test interpreter interpreting #:#() notation with quantifiers", () => {
    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(new SymbolicDataReferenceInterpreter((x) => {
        return x === "variable"?"1":(x === "variable2"?"2":undefined)
    }))

    expect(interpreter.interpret("#n:#(variable)")).toBe("1");
    expect(interpreter.interpret("#n:#(not a variable)")).toBe("");
    expect(interpreter.interpret("#n:#(variable) #(variable)")).toBe("1 1");
    expect(interpreter.interpret("#1:#(variable)")).toBe("1");
    expect(interpreter.interpret("#1:#(variable) something")).toBe("1 something");
    expect(interpreter.interpret("#1:#(variable) #(variable)")).toBe("1 #(variable)");
    expect(interpreter.interpret("#1:#(variable2) #(variable)")).toBe("2 #(variable)");
    expect(interpreter.interpret("#1:#(variable) #(variable2)")).toBe("1 #(variable2)");
});

test("test interpreter interpreting #() notation with default quantifier", () => {
    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(new SymbolicDataReferenceInterpreter((x) => {
        return x === "variable"?"1":(x === "variable2"?"2":undefined)
    }))

    expect(interpreter.interpret("#(variable)","n")).toBe("1");
    expect(interpreter.interpret("#(not a variable)","n")).toBe("");
    expect(interpreter.interpret("#(variable) #(variable)","n")).toBe("1 1");
    expect(interpreter.interpret("#(variable)","1")).toBe("1");
    expect(interpreter.interpret("#(variable) something","1")).toBe("1 something");
    expect(interpreter.interpret("#(variable) #(variable)","1")).toBe("1 #(variable)");
    expect(interpreter.interpret("#(variable2) #(variable)","1")).toBe("2 #(variable)");
    expect(interpreter.interpret("#(variable) #(variable2)","1")).toBe("1 #(variable2)");
    expect(interpreter.interpret("#n(variable)","1")).toBe("1");
    expect(interpreter.interpret("#n(not a variable)","1")).toBe("");
    expect(interpreter.interpret("#n(variable) #(variable)","1")).toBe("1 1");
});

test("test interpreter interpreting #* notation", () => {
    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(new SymbolicDataReferenceInterpreter(x => x === "variable"?"1":undefined))

    expect(interpreter.interpret("#*#(variable)")).toBe("1");
    expect(interpreter.interpret("#*#(not a variable)")).toBe("");
    expect(interpreter.interpret("#*#(variable) #(variable)")).toBe("1 1");
});
