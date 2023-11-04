
export class SimpleFunctionParser {
    static src_regex_function = String.raw`^\s*(?<instruction>[a-zA-z0-9]+)\((?<params>.*?)\)\s*$`;
    static src_regex_params = String.raw`((\s*"(?<param_quote>.*?)"\s*)|(\s*'(?<param_singlequote>.*?)'\s*)|(\s*(?<param_noquote>[^,]*)))(?<end>,|$)`

    constructor() {
        this.ok = false
        this.parameters = []
        this.instruction = ""
        this.err = "s"
    }

    parse(command) {
        const src_regex_function = new RegExp(SimpleFunctionParser.src_regex_function, "g")
        const src_regex_params = new RegExp(SimpleFunctionParser.src_regex_params, "g")
        this.ok = false
        const instruction = src_regex_function.exec(command)
        if (instruction && Object.keys(instruction.groups).length === 2) {
            this.instruction = instruction.groups['instruction']
            const _params = instruction.groups['params']
            if (_params.trim() === "") {
                this.ok = true
            } else {
                const match_iter = _params.matchAll(src_regex_params)
                for (const match of match_iter) {
                    for (const group of ["param_quote", "param_singlequote", "param_noquote"]) {
                        try {
                            if (match.groups[group] !== undefined) {
                                let value = match.groups[group]
                                if (group !== "param_noquote" && value.toLowerCase() === "null") {
                                    value = `'${value}'`
                                }
                                this.parameters.push(value)
                            }
                        } catch(error) {
                            console.log(error)
                        }
                    }
                    if (match.groups["end"] !== ",") {
                        break;
                    }
                }
                this.ok = this.parameters.length > 0
            }
        } else {
            this.err = "too many or too few syntactical groups. 'Instruction' and 'parameters' are expected"
        }
        return this.ok
    }

    static quickCheck(command) {
        const instruction = new RegExp(SimpleFunctionParser.src_regex_function).exec(command)
        return !!instruction
    }
}

export default SimpleFunctionParser