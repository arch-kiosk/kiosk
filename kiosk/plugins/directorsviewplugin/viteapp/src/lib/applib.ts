//@ts-ignore
import {FetchException} from "../../../../../static/scripts/kioskapputils.js"
//@ts-ignore
import {MessageData, MSG_LOGGED_OUT, MSG_NETWORK_ERROR, sendMessage} from "./appmessaging.ts"
import {LitElement} from "lit-element";

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
