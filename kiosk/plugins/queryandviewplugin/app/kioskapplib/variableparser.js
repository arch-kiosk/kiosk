export class VariableParser {
    _variables = new Map()
    _text = ""
    _regex=  /#\(.*?\)/g

    static quicklySubstitute(text, getVariableCallback, quantifier="n") {
        if (typeof getVariableCallback !== 'function')
            throw "quicklySubstitute expects a callable callback but didn't get one."

        const parser = new VariableParser(text)
        let result
        if (quantifier === "n") {
            parser.variableNames.forEach((variable) => {
                let r = getVariableCallback(variable)
                if (r) parser.set(variable, r)
            })
            result = parser.substitute()
        } else {
            if (parser.variableNames.length > 0) {
                const r = getVariableCallback(parser.variableNames[0])
                if (r) parser.set(parser.variableNames[0], r)
            }
            result = parser.substituteOne()
        }

        if (import.meta.env.VITE_DEBUG_PARSING === 'TRUE') {
            return result || `?${text}`
        } else {
            return result
        }
    }

    constructor(text) {
        this._text = text
        this.parse()
    }

    get variableNames() {
        return [...this._variables.keys()]
    }

    parse() {
        let m
        this._variables.clear()
        while (m = this._regex.exec(this._text)) {
            this._variables.set(m[0].substring(2, m[0].length-1), {index: m.index, value: undefined})
        }
        return this._variables.size
    }

    set(variable, value) {
        const v = this._variables.get(variable)
        v.value = value
    }

    get(variable) {
        try {
            const v =  this._variables.get(variable)
            return v.value
        } catch {
            return undefined
        }
    }

    substitute(keep_undefined_variables = false) {
        let result = this._text
        this._variables.forEach((variable, key) => {
            if (variable.value || !keep_undefined_variables) {
                result = result.replaceAll(`#(${key})`, variable.value || "")
            }
        })
        return result
    }

    substituteOne(keep_undefined_variable = false) {
        let result = this._text
        if (this._variables.has(this._text))
            return this._variables[result]

        for (const v of this._variables) {
            const key = v[0], variable = v[1]
            if (variable.value || !keep_undefined_variable) {
                result = result.replace(`#(${key})`, variable.value || "")
                break;
            }
        }
        return result
    }
}