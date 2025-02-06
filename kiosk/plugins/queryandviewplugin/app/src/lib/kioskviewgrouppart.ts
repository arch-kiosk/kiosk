import {
    AnyDict,
    ApiKioskViewCompilation,
    ApiKioskViewDocument,
    ApiKioskViewDocumentLayouts,
    ApiKioskViewDocumentType,
    ApiKioskViewGroupPart,
    ApiKioskViewLayout, ApiKioskViewListLayout, ApiKioskViewTable,
} from "./apitypes";
import { DataContext } from "./datacontext";
import { InterpreterManager } from "../../kioskapplib/interpretermanager";
import { InterpreterFactory } from "./interpreterfactory";
import { DSDRecordAccessor } from "./dsdrecordaccessor";
import { KioskViewDocument } from "./kioskviewdocument";
import { compareISODateTime, safeLocaleCompare } from "./applib";
import { DataSetDefinition } from "../../kioskapplib/datasetdefinition";
import { KioskView } from "../kioskview";

type FieldOrderComparer = (v1: any,v2: any) => number

type OrderedColumn = {
    name: string
    idx: number
    cmp: FieldOrderComparer
}


export class KioskViewGroupPart {
    private _part: ApiKioskViewGroupPart
    private _groupId: string
    private readonly _document: ApiKioskViewDocumentType
    private readonly _partId: string
    private _dataContext: DataContext
    private _interpreter: InterpreterManager
    private _partData: ApiKioskViewTable
    public recordMissing: Boolean = false
    private _UIDFieldIdx: number = -1;
    private _sort_order: Array<OrderedColumn> = []
    private _cachedElements: AnyDict = {};
    private _types:{[key: string]: Array<string>} = {}

    get interpreter() {
        return this._interpreter
    }
    get recordType() {
        return this.layout.record_type
    }

    static check_part(groupId: string, partId: string, data: ApiKioskViewDocument) {
        const part = data.compilation.groups[groupId].parts[partId]
        if (!part.hasOwnProperty("text")) throw `KioskViewDocument part ${partId} has no text attribute`
        if (!part.hasOwnProperty("position")) throw `KioskViewDocument part ${partId} has no position attribute`
        let layout = part.layout || partId
        if (!data.hasOwnProperty(layout)) throw `KioskViewDocument part ${groupId}, ${partId} referring to unknown layout ${layout}`
        this.check_layout(data, layout)
    }

    static check_layout(data: ApiKioskViewDocumentType, layoutId: string) {
        if (!data.hasOwnProperty(layoutId)) throw `KioskViewDocument layout ${layoutId} does not exist`
        const layout = (data as ApiKioskViewDocumentLayouts)[layoutId]

        for (const attribute of ["record_type", "view_type", "fields_selection"]) {
            if (!layout.hasOwnProperty(attribute))
                throw `KioskViewDocument layout ${layoutId} has no ${attribute} attribute`
        }
        if (!layout.hasOwnProperty("layout_settings"))
            throw `KioskViewDocument layout ${layoutId} has no layout_settings`
    }

    constructor(data: ApiKioskViewDocument, groupId: string, partId: string,
                types:{[key: string]: Array<string>}, dataContext: DataContext=undefined) {
        KioskViewGroupPart.check_part(groupId, partId, data)
        this._groupId = groupId
        this._part = data.compilation.groups[groupId].parts[partId]
        this._partId = partId
        this._document = data
        this._dataContext = dataContext
        this._partData = undefined
        this._types = types
        this._initInterpreter()
    }

    _initInterpreter() {
        if (this._dataContext) {
            this._interpreter = InterpreterFactory(this._dataContext)
        }
    }

    set dataContext(dataContext: DataContext) {
        this._dataContext = dataContext
        this._initInterpreter()
    }

    get dataContext() {
        return this._dataContext
    }

    get text() {
        if (this._dataContext) {
            return this._interpreter.interpret(this._part.text)
            // return VariableParser.quicklySubstitute(this._part.text, (key: string) => this._dataContext.get(key) || key)
        } else {
            return this._part.text
        }
    }

    get position() {
        return this._part.position
    }

    get opened() {
        return this._part.opened || false
    }

    toggleOpen() {
        this._part.opened = !(this._part.opened || false)
    }

    get partId() {
        return this._partId
    }

    get cssPartId() {
        return this._partId.replace(/[^a-zA-Z|0-9|\-|_]/, "-")
    }

    get layout() : ApiKioskViewLayout {
        const layoutId = this._part.layout || this._partId
        if (!this._document.hasOwnProperty(layoutId)) throw `KioskViewDocument part ${this._partId} referring to unknown layout ${layoutId}`
        return (this._document as ApiKioskViewDocumentLayouts)[layoutId]
    }

    get maxHeight(): string | undefined {
        if (this.layout.view_type === "list") {
            return (this.layout as ApiKioskViewListLayout).max_height
        }
        return undefined
    }

    get expandable(): boolean {
        const group = (this._document.compilation as ApiKioskViewCompilation).groups[this._groupId]


        if (group.type === "accordion")
            return true

        if (this.layout.view_type === "list") {
            return (this.layout as ApiKioskViewListLayout).max_height_expandable || false
        }
        return false
    }

    private getFieldOrderComparer(sortField: string, dec: boolean, viewDocument: KioskViewDocument): FieldOrderComparer {
        let dataType: string
        let orderComparers: {[name: string]: {inc: FieldOrderComparer,
                                                dec: FieldOrderComparer}} = {};
        let comparer = ""

        orderComparers["text"] = ({
            inc: (v1: string, v2: string) => safeLocaleCompare(v1, v2),
            dec: (v1: string, v2: string) => safeLocaleCompare(v2, v1)})
        orderComparers["datetime"] = ({
            inc: (v1: string, v2: string) => compareISODateTime(v1,v2),
            dec: (v1: string, v2: string) => compareISODateTime(v2,v1)})

        try {
            dataType = viewDocument.dsd.get_field_data_type(this.recordType, sortField).toUpperCase()
            if (["VARCHAR", "TEXT"].includes(dataType))
                comparer = "text"
            if (["DATE", "DATETIME", "TIMESTAMP", "TIME"].includes(dataType))
                comparer = "datetime"
        } catch (e) {
            console.log(`Unknown sort field ${this.recordType}/${sortField}`)
            return (() => 0)
        }

        if (!comparer)
            return ((x) => 0)
        if (dec) {
            return orderComparers["text"].dec
        } else {
            return orderComparers["text"].inc
        }
    }

    public createSortOrder(viewDocument: KioskViewDocument, order_records_by: string[]) {
        this._sort_order = []
        const columns = this._partData[0]
        if (order_records_by == undefined)
            return

        order_records_by.forEach((sortInstruction) => {
            let dec = false
            if (sortInstruction.startsWith(">")) {
                sortInstruction = sortInstruction.slice(1)
                dec = true
            }
            let index = columns.findIndex(x => x === sortInstruction)
            if (index > -1) {
                this._sort_order.push({
                    name: sortInstruction,
                    idx: index,
                    cmp: this.getFieldOrderComparer(sortInstruction, dec, viewDocument)
                })
            } else {
                console.error(`sort column ${sortInstruction} unknown.`)
            }
        })
    }

    public orderRecords() {
        if (this._sort_order == undefined || this._sort_order.length == 0)
            return

        //remove the column row
        const columns = this._partData.splice(0,1)[0]

        this._partData.sort((row1, row2) => {
            for (let orderedColumn of this._sort_order) {
                const rc = orderedColumn.cmp(row1[orderedColumn.idx], row2[orderedColumn.idx])
                if (rc != 0)
                    return rc
            }
            return 0
        })
        //add the column row back to index 0
        this._partData.splice(0,0,columns)
    }

    public initDataContextForPart(viewDocument: KioskViewDocument) {
        let partDataContext: DataContext
        let recordAccessor: DSDRecordAccessor
        let record: Array<any>

        // if (this.layout.record_type === "locus_photo") debugger;
        this._partData = viewDocument.getData()[this.layout.record_type]
        if (!this._partData || this._partData.length < 2) {
            if (!this.layout.hasOwnProperty("on_record_missing") || this.layout.on_record_missing === "hide") {
                return undefined
            } else {
                record = []
                this.recordMissing = true
            }
        } else {
            record = this._partData[1]
        }

        this._UIDFieldIdx = this._partData[0].findIndex(x => x === "uid")
        if (this._UIDFieldIdx == -1) {
            console.log(`part ${this._partId} refers to record type that has no UID field. All record types must have a uid.`)
            return undefined
        }

        // this.createSortOrder(viewDocument)
        // this.orderRecords()

        partDataContext = this.dataContext.clone()
        recordAccessor = new DSDRecordAccessor(
            this.recordType,
            this.dataContext,
            {
                fields: this._partData[0],
                record: record
            },
            viewDocument.types[this.recordType])

        if (recordAccessor) {
            console.log(recordAccessor)
            partDataContext.registerAccessor(recordAccessor)
            this.dataContext = partDataContext
        }
        return partDataContext
    }


    moveToNextRow(lastUID: string) {
        let index = 0
        let record: Array<any> = undefined
        let rowIndex = -1

        if (this.recordMissing || !this._partData)
            return ""

        if (!lastUID) {
            rowIndex = 0
        } else {
            rowIndex = parseInt(lastUID)
            if (Number.isNaN(rowIndex)) {
                // That's when I would actually have to find the UID. But I am not sure if that is ever necessary
                rowIndex = -1
            }
        }
        rowIndex += 1
        if (rowIndex == 0)
            return ""

        if (rowIndex >= this._partData.length) {
            this.dataContext.deleteAccessorIfExists(this.recordType)
            return ""
        }

        const recordAccessor = new DSDRecordAccessor(
            this.recordType,
            this.dataContext,
            {
                fields: this._partData[0],
                record: this._partData[rowIndex]
            },
            this._types[this.recordType]
            )
        this._dataContext.registerAccessor(recordAccessor)
        return rowIndex.toString()
    }
    public getPartExpansionSettings() {
        let maxHeight: string | undefined;
        let buttonMode: ("open" | "close" | undefined) = undefined;
        if (this.layout.view_type === "list") {
            if (this.maxHeight) {
                maxHeight = this.maxHeight
                if (this.expandable) {
                    buttonMode = this.opened ? "close" : "open"
                }
            }
        }
        return { maxHeight, buttonMode: buttonMode };
    }

    public getGotoIdentifierEvent(dsd: DataSetDefinition, fieldId: string, identifier: string) {
        const element = this.findElement(fieldId)
        console.log("getGotoIdentifierEvent", element, identifier)
        const linksTo: string = element["element_type"]["links_to"]
        let recordType = linksTo || this.recordType

        if (linksTo && linksTo !== this.recordType && linksTo !== this._document.compilation.record_type) {
            try {
                const idFields = dsd.get_fields_with_instruction(linksTo, "identifier");
                if (idFields.length > 0) {
                    identifier = "";

                    for (const idField of idFields) {
                        const instruction = dsd.get_field_instruction(linksTo, idField, "identifier");
                        if (instruction.parameters.length == 0 || instruction.parameters[0] == "primary") {
                            identifier = this.dataContext.get(`/${linksTo}/${idField}`);
                            break;
                        }
                    }
                }
            } catch (e){
                console.log(e)
            }
        }

        if (identifier && recordType) {
            return new CustomEvent("goto-identifier",
                {
                    detail: {
                        "dsdName": fieldId,
                        "tableName": recordType,
                        "identifier": identifier,
                    },
                    bubbles: true,
                    composed: true
                })
        } else {
            console.error(`Can't go to Identifier/RecordType ${identifier}/${recordType} `)
        }
    }

    public findElement(elementId: string): AnyDict | undefined {
        let layout_elements = [this.layout]
        if (this._cachedElements.hasOwnProperty(elementId)) {
            // console.info(`cache hit: ${elementId}`)
            return this._cachedElements[elementId]
        }
        for (const layout of layout_elements) {
            // if (!layout.hasOwnProperty("ui_element"))
            //     continue;
            for (const id of Object.keys(layout.ui_elements)) {
                if (id === elementId) {
                    this._cachedElements[elementId] = layout.ui_elements[id]
                    return layout.ui_elements[id]
                }
                if (layout.ui_elements[id].hasOwnProperty("element_type") && layout.ui_elements[id]["element_type"].hasOwnProperty("ui_elements")) {
                    layout_elements.push(layout.ui_elements[id]["element_type"])
                }
            }
        }
        return undefined
    }

    private _lookup(value: any, element_id: string, lookup_def: AnyDict) {
        switch(lookup_def["lookup_type"]) {
            case "record":
                return this._lookup_record(value, element_id, lookup_def)
            case "dictionary":
                return this._lookup_in_dictionary(value, element_id, lookup_def)
            default:
                console.error(`kioskviewgrouppart.lookup: Unknown lookup type "${lookup_def["lookup_type"]}" in ui element "${element_id}"`)
        }
        return value
    }

    private _lookup_record(value: any, element_id: string, lookup_def: AnyDict) {
        try {
            const lookup_record_type = lookup_def["record_type"]
            const lookup_data = (this._document as ApiKioskViewDocument)["kioskview.lookup_data"]
            if (!lookup_data)
                return value
            const table_data = lookup_data[lookup_record_type]
            if (!table_data || table_data.length < 2)
                return value
            const valueFieldIdx = table_data[0].findIndex(v => v === lookup_def["display_value"])
            const keyFieldIdx = table_data[0].findIndex(v => v === lookup_def["key_field"])
            for (let rowNr = 1; rowNr < table_data.length; rowNr++) {
                const row = table_data[rowNr]
                if (rowNr > 0) {
                    if (row[keyFieldIdx] === value)
                        return row[valueFieldIdx]
                }
            }
            return value
        } catch (e) {
            throw `_lookup_records: ${e}`
        }
    }
    private _lookup_in_dictionary(value: any, element_id: string, lookup_def: AnyDict) {
        const dictionary = this.dataContext.getAccessor("dictionary")
        return dictionary.get(lookup_def.path, value, DataContext.GET_MODE_DEFAULT)
    }


    public resolveDataRequest(exp: string, elementId: string) {
        const i_result = this.interpreter.interpret(exp)
        try {
            if (elementId && i_result) {
                const element = this.findElement(elementId)
                if (element && element["element_type"].hasOwnProperty("lookup")) {
                    return this._lookup(i_result, elementId, element["element_type"]["lookup"])
                }
            }
            return i_result
        } catch (e) {
            return `elementId: ${e}`
        }
    }
}