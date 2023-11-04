import { Interpreter, InterpreterManager } from "../../kioskapplib/interpretermanager";
import { SymbolicDataReferenceInterpreter } from "../../kioskapplib/symbolicdatareferenceinterpreter";
import { DataContext } from "./datacontext";

export function InterpreterFactory(dataContext: DataContext):InterpreterManager {
    const sdrInterpreter = new SymbolicDataReferenceInterpreter((exp: string) => {
        return dataContext.get(exp)
    })

    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(sdrInterpreter)
    return interpreter
}