//abstract
export class Interpreter {
    _symbol = ""

    interpret(expr, quantifier="n") {
        throw "Not implemented"
        return ""
    }
    get symbol() {
        return this._symbol
    }
}

export class InterpreterManager {
    INTERPRETER_SYMBOL = "#"

    interpreters = new Map()

    addInterpreter(interpreter) {
        if (!!!interpreter.symbol) {
            throw "Attempt to add an interpreter that has no interpreter symbol"
        }
        this.interpreters.set(interpreter.symbol, interpreter)
    }
    interpret(expr, quantifier="n", substCRLF="\r") {
        if (!!!expr || typeof expr !== "string") return expr
        if (expr[0] !== this.INTERPRETER_SYMBOL) return expr

        let idxSymbol = 1
        if (expr[idxSymbol] === "1" || expr[idxSymbol] === "n") {
            quantifier = expr[1]
            idxSymbol++
        }
        let symbol = expr[idxSymbol]
        //special treatment of ( to allow simple "#()" statements instead of "#(#()"
        let toInterpret

        if (symbol === "(") {
            toInterpret = "#(" + expr.substring(idxSymbol+1)
            symbol = ":"
        } else {
            toInterpret = expr.substring(idxSymbol+1)
        }

        switch (symbol) {
            case "#":
                expr = "#" + toInterpret;
                break;
            case "*":
                for (const interpreter of this.interpreters.values()){
                    toInterpret = interpreter.interpret(toInterpret, quantifier)
                }
                expr = toInterpret;
                break;
            default:
                if (this.interpreters.has(symbol)) {
                    expr = this.interpreters.get(symbol).interpret(toInterpret, quantifier)
                }
        }
        if (substCRLF !== "\r") {
            expr = expr.replace("\n", "").replace("\r", substCRLF)
        }
        return expr
    }
}