import {FetchException} from "@arch-kiosk/kiosktsapplib"
import {MessageData, MSG_LOGGED_OUT, MSG_NETWORK_ERROR, sendMessage} from "./appmessaging"
import {LitElement} from "lit-element";
import { State } from "../store/reducer";
import { StoreWidgetSelector } from "../store/actions";

export const AVAILABLE_WIDGETS = [
    "unit-info-widget",
    "narrative-widget",
    "file-widget",
    "locus-widget",
    "cm-widget",
    "feature-widget",
    "deletion-info-widget",
    "archival-entity-widget"
]

export type WidgetDescriptor = {
    id: string
    displayName: string
    active: boolean
    order: number
}

export class Constant {
    path: string
    key: string
    value: string
}

export function getSqlDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
}

export function fromSqlDate(date: string): Date {
    const parts = date.split("-")
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
}

export function getRecordTypeNames(constants: Array<Constant>): { [key: string]: string } {
    let result: { [key: string]: string } = {}

    for (let i = 0; i < constants.length; i++) {
        let constant = constants[i]
        try {
            if (constant["path"] === "file_repository/recording_context_aliases") {
                result[constant.key] = constant.value
            }
        } catch (e) {
            console.log(e)
            console.log(constant)
        }
    }

    return result
}

export function getLabels(constants: Array<Constant>): { [key: string]: string } {
    let result: { [key: string]: string } = {}

    for (let i = 0; i < constants.length; i++) {
        let constant = constants[i]
        try {
            if (constant["path"] === "constants/labels") {
                result[constant.key] = constant.value
            }
        } catch (e) {
            console.log(e)
            console.log(constant)
        }
    }

    return result
}

export function decodeFileMakerKeyValueList(valueList: string): { [key: string]: string } {
    let result: {[key:string]: string} = {}
    let pairs = valueList.split("\r")
    for (const p of pairs) {
        const pair = p.split("=")
        result[pair[0]] = pair[1]
    }
    return result
}

export function getStandardTerm(constants: Array<Constant>, standard_term: string,
                                plural: Boolean = false, default_value: string = ""): string {
    let result: string = ""
    let plurals: { [key: string]: string } = {}

    for (let i = 0; i < constants.length; i++) {
        let constant = constants[i]
        try {
            if (constant["path"] === "constants/labels" && constant.key === standard_term) {
                result = constant.value
                if (!plural) {
                    return result
                }
            }

            if (plural && constant["path"] === "constants/labels" && constant.key === "plurals") {
                plurals = decodeFileMakerKeyValueList(constant.value)
            }
            if (result &&  Object.keys(plurals).length > 0) break
        } catch (e) {
            console.log(e)
            console.log(constant)
        }

    }
    try {
        if (result && plurals) {
            result = plurals[result]
        }
    } catch(e) {
        result = default_value
    }

    return result || default_value
}

export function recordType2Name(recordTypeNames: { [key: string]: string }, recordType: string): string {
    if (recordTypeNames && recordType in recordTypeNames) {
        return recordTypeNames[recordType]
    } else return recordType
}

export function name2RecordType(recordTypeNames: { [key: string]: string }, name: string): string {
    if (recordTypeNames) {
        const recordTypes = Object.keys(recordTypeNames)
        for (let i = 0; i < recordTypes.length; i++) {
            if (recordTypeNames[recordTypes[i]] === name) return recordTypes[i]
        }
    }
    return ""
}

export function handleCommonFetchErrors(handlerInstance: LitElement,
                                        e: FetchException, messagePrefix = "",
                                        onUnhandledError: CallableFunction = null) {
    if (messagePrefix) messagePrefix += ": "
    if (e.response) {
        if (e.response.status == 403 || e.response.status == 401) {
            sendMessage(handlerInstance, MSG_NETWORK_ERROR,
                `${messagePrefix}You are not logged in properly or your session has timed out`,
                `<a href="/logout">Please log in again.</a>`)
            return
        }

        if (onUnhandledError) {
            onUnhandledError(e)
        } else {
            sendMessage(handlerInstance, MSG_NETWORK_ERROR,
                `${messagePrefix}Kiosk server responded with an error.`, `(${e.response.statusText}). 
                The server might be down or perhaps you are not logged in properly.`)
        }

    } else {
        sendMessage(handlerInstance, MSG_NETWORK_ERROR,
            `${messagePrefix}Kiosk server responded with a network error.`, `(${e}). 
            The server might be down or perhaps you are not logged in properly.`)
        return
    }
}

export function getAllWidgets(state: State): Array<WidgetDescriptor> {
    const allWidgets: Array<WidgetDescriptor> = []
    try {
        if (state.constants?.length > 0) {
            AVAILABLE_WIDGETS.forEach(w => {
                let wd: WidgetDescriptor = { id: w, displayName: "", active: true, order: -1 }
                switch (w) {
                    case "unit-info-widget":
                        wd.displayName = `${getStandardTerm(state.constants,
                            "standard_term_for_unit", false, "unit")} information`;
                        wd.order = 0;
                        break;
                    case "narrative-widget":
                        wd.displayName = `${getStandardTerm(state.constants,
                            "standard_term_for_unit", false, "unit")} narratives`;
                        wd.order = 1;
                        break;
                    case "file-widget":
                        wd.displayName = `images and files`;
                        wd.order = 2;
                        break;
                    case "locus-widget":
                        wd.displayName = `${getStandardTerm(state.constants,
                            "standard_term_for_loci", true, "loci")}`;
                        wd.order = 3;
                        break;
                    case "cm-widget":
                        wd.displayName = `${getStandardTerm(state.constants,
                            "standard_term_for_cm", true, "collected materials")}`;
                        wd.order = 4;
                        break;
                    case "feature-widget":
                        wd.displayName = `${getStandardTerm(state.constants,
                            "standard_term_for_feature_unit", true, "features")}`;
                        wd.order = 5;
                        break;
                    case "deletion-info-widget":
                        wd.displayName = `deletions`;
                        wd.order = 6;
                        break;
                    case "archival-entity-widget":
                        wd.displayName = `archival entities`;
                        wd.order = 7;
                        break;
                }
                if (wd.order !== -1) {
                    allWidgets.push(wd)
                }
            })
            allWidgets.sort((w1, w2) => w1.order - w2.order)
        }
    } catch (e) {
        console.error("Error ", e)
    }
    return allWidgets
}
