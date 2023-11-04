import {Interpreter} from "./interpretermanager.js";
import { VariableParser } from "./variableparser.js"

export class SymbolicDataReferenceInterpreter extends Interpreter {
    _symbol = ":"
    _dataProvider = x => x

    constructor(dataProvider) {
        super();
        if (dataProvider)
            this._dataProvider = dataProvider
    }

    set dataProvider(dataProvider) {
        this._dataProvider = dataProvider
    }

    interpret(expr, quantifier="n") {
        return VariableParser.quicklySubstitute(expr, this._dataProvider, quantifier)
    }
}