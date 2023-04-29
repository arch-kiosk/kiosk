class SimpleFunctionParser {
    constructor() {
        this.src_regex_function = /^\s*(?<instruction>[a-zA-z0-9]+)\((?<params>.*?)\)\s*$/g;
        this.src_rexex_params = /((\s*"(?<param_quote>.*?)"\s*)|(\s*'(?<param_singlequote>.*?)'\s*)|(\s*(?<param_noquote>[^,]*)))(?<end>,|$)/g;
        this.ok = false;
        this.parameters = [];
        this.instruction = "";
        this.err = "";
    }
    parse(command) {
        this.ok = false;
        const instruction = this.src_regex_function.exec(command);
        if (instruction && Object.keys(instruction.groups).length === 2) {
            this.instruction = instruction.groups['instruction'];
            const _params = instruction.groups['params'];
            if (_params.trim() === "") {
                this.ok = true;
            }
            else {
                const match_iter = _params.matchAll(this.src_rexex_params);
                for (const match of match_iter) {
                    for (const group of ["param_quote", "param_singlequote", "param_noquote"]) {
                        try {
                            if (match.groups[group] !== undefined) {
                                let value = match.groups[group];
                                if (group !== "param_noquote" && value.toLowerCase() === "null") {
                                    value = `'${value}'`;
                                }
                                this.parameters.push(value);
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                    if (match.groups["end"] !== ",") {
                        break;
                    }
                }
                this.ok = this.parameters.length > 0;
            }
        }
        else {
            this.err = "too many or too few syntactical groups. 'Instruction' and 'parameters' are expected";
        }
        return this.ok;
    }
}
export default SimpleFunctionParser;
//# sourceMappingURL=simplefunctionparser.js.map