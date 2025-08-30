import { InterpreterManager } from "@arch-kiosk/kiosktsapplib"
import { SymbolicDataReferenceInterpreter } from "@arch-kiosk/kiosktsapplib";
import { DataContext } from "./datacontext";

export function InterpreterFactory(dataContext: DataContext):InterpreterManager {
    const sdrInterpreter = new SymbolicDataReferenceInterpreter((exp: string) => {
        return dataContext.get(exp)
    })

    const interpreter = new InterpreterManager()
    interpreter.addInterpreter(sdrInterpreter)
    return interpreter
}