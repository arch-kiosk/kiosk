import { AnyDict } from "../src/lib/apitypes";
import { SimpleFunctionParser } from "./simplefunctionparser";

interface DSDInstruction {
    instruction: string
    parameters: Array<string>
}

export class DataSetDefinition {
    static CURRENT_DSD_FORMAT_VERSION = 3
    _dsd: { [key: string]: { [key: string]: Array<string> } }

    _check_version(version: number) {
        if (version != DataSetDefinition.CURRENT_DSD_FORMAT_VERSION)
            throw `DataSetDefinition.loadFromJSON: DSD Version ${version} is not supported.`
    }

    /**
     * loads the dsd data from a dictionary that is a preparsed version of a merely textual DSD
     * Checks if the structure is okay or throws errors.
     *
     * @param version the DSD format's version
     * @param data the DSD Data (only tables, not the header)
     */
    loadFromDict(data: object, version: number = DataSetDefinition.CURRENT_DSD_FORMAT_VERSION) {
        this._check_version(version)
        this._check_dsd_structure(data)
        this._dsd = <any>data
    }

    _check_dsd_structure(data: AnyDict) {
        for (const tableName of Object.keys(data)) {
            if (typeof data[tableName] !== "object") {
                throw `DataSetDefinition._check_dsd_structure: ${tableName} definition is foul.`
            }
            this._check_table_structure(tableName, data[tableName])
        }
    }

    _check_table_structure(tableName: string, table: AnyDict) {
        for (const fieldName of Object.keys(table)) {
            if (!Array.isArray(table[fieldName]))
                throw `DataSetDefinition._check_table_field_structure: ${tableName}.${fieldName} field definition is foul.`

            this._check_table_field_structure(tableName, fieldName, table[fieldName])
        }
    }

    _check_table_field_structure(tableName: string, fieldName: string, field: Array<string>) {
        for (const instruction of field) {
            if (!SimpleFunctionParser.quickCheck(instruction)) {
                throw `DataSetDefinition._check_table_field_structure: ${tableName}.${fieldName} has malformed instruction ${instruction}`
            }
        }
    }

    get tables(): Array<string> {
        return this.list_tables()
    }

    list_tables() {
        return Object.keys(this._dsd)
    }

    has_table(tableName: string) {
        return this._dsd.hasOwnProperty(tableName)
    }
    list_fields(tableName: string): Array<string> {
        if (!this.has_table(tableName)) throw `DataSetDefinition.list_fields: ${tableName} does not exist`
        return [...Object.keys(this._dsd[tableName])]
    }

    has_field(tableName: string, fieldName: string) {
        if (this.has_table(tableName))
            return this._dsd[tableName].hasOwnProperty(fieldName)

        return false
    }

    protected _extract_field_instructions_from_array(instructions: Array<string>, reduceToInstruction="") {
        const result: Array<DSDInstruction> = []
        for (const command of instructions) {
            let parser = new SimpleFunctionParser()
            if (parser.parse(command)) {
                const instruction = {
                    "instruction": parser.instruction,
                    "parameters": [...parser.parameters]
                }
                if (reduceToInstruction) {
                    if (instruction.instruction === reduceToInstruction) {
                        return [instruction]
                    }
                } else {
                    result.push(instruction)
                }
            } else {
                throw `${command} syntax error`
            }
        }
        return result
    }

    list_field_instructions(tableName: string, fieldName: string): Array<DSDInstruction> {
        if (!this.has_field(tableName, fieldName)) throw `DataSetDefinition.list_field_instructions: ${tableName}.${fieldName} does not exist`
        const instructions = this._dsd[tableName][fieldName]
        try {
            return this._extract_field_instructions_from_array(instructions)
        } catch (e) {
            throw `DataSetDefinition.list_field_instructions: ${tableName}.${fieldName}: ${e}`
        }
    }

    protected _has_instruction(instructions: Array<string>, requestedInstruction: string): boolean {
        const parsedInstructions = this._extract_field_instructions_from_array(instructions)
        return !!parsedInstructions.find((ins) => ins.instruction === requestedInstruction)
    }

    /**
     * returns a list with the names of the fields that have the requested instruction.
     * @param tableName
     * @param requestedInstruction
     */
    get_fields_with_instruction(tableName: string, requestedInstruction: string): Array<string> {
        if (!this.has_table(tableName)) throw `DataSetDefinition.get_fields_with_instructions: ${tableName} does not exist`
        try {
            return Object.keys(this._dsd[tableName]).filter(
                key => this._has_instruction(this._dsd[tableName][key], requestedInstruction))
        } catch (e) {
            throw `DataSetDefinition.get_fields_with_instruction: ${tableName}: ${e}`
        }
    }

    get_field_instruction(tableName: string, fieldName: string, requestedInstruction: string): DSDInstruction | undefined {
        if (!this.has_field(tableName, fieldName)) throw `DataSetDefinition.get_field_instructions: ${tableName}.${fieldName} does not exist`
        const instructions = this._dsd[tableName][fieldName]
        try {
            const instructionObjects = this._extract_field_instructions_from_array(instructions, requestedInstruction)
            if (instructionObjects.length != 1) {
                return undefined
            }
            else {
                return instructionObjects[0]
            }

        } catch (e) {
            throw `DataSetDefinition.get_field_instruction: ${tableName}.${fieldName} / ${requestedInstruction}: ${e}`
        }
    }

    get_field_instruction_parameters(tableName: string, fieldName: string, requestedInstruction: string): Array<any> | undefined {
        const instructionObject = this.get_field_instruction(tableName, fieldName, requestedInstruction)
        if (instructionObject) {
            return instructionObject.parameters
        } else {
            return undefined
        }
    }

    /**
     * returns an array of the record types that are back-joined by the source table.
     * Only accepts joins with a "1" quantifier as valud back links
     * In a dataset with a join series of site <- unit <- locus this would return ["unit, "site"]
     * @param tableName The source table from where the joins start to get interpreted.
     */
    get_lore_tables(tableName: string): Array<string> {
        const back_joins: Array<string> = []
        let nextTables = [tableName]

        while (nextTables.length) {
            const nextTable = nextTables.pop()
            if (this.has_table(nextTable)) {
                if (nextTable !== tableName) {
                    back_joins.push(nextTable)
                }
                const fields = this.get_fields_with_instruction(nextTable, "join")
                for (let field of fields) {
                    const parameters = this.get_field_instruction_parameters(nextTable, field, "join")
                    if ((parameters.length > 2 ? parameters[2] : "1") == "1") {
                        nextTables.push(parameters[0])
                    }
                }
            }
        }

        return back_joins
    }

    /**
     * returns the datatype for a field. If that doesn't succeed an exception will be thrown.
     *
     * @param tableName the name of the table
     * @param fieldName the name of the field
     '
     * @return the data type as a string
     */
    get_field_data_type(tableName: string, fieldName: string): string {
        const instruction = this.get_field_instruction(tableName, fieldName, "datatype")
        return instruction.parameters[0]
    }

}