//@ts-ignore
import {FetchException} from "../../../../../static/scripts/kioskapputils.js"
//@ts-ignore
import {MessageData, MSG_NETWORK_ERROR, MSG_LOGGED_OUT, sendMessage} from "./appmessaging.ts"
import {LitElement} from "lit-element";
//@ts-ignore

export const JOB_STATUS_GHOST = 0;
export const JOB_STATUS_REGISTERED = 1;
export const JOB_STATUS_SUSPENDED = 5;
export const JOB_STATUS_STARTED = 8;
export const JOB_STATUS_RUNNING = 10;
export const JOB_STATUS_CANCELLING = 15;
export const JOB_STATUS_DONE = 20;
export const JOB_STATUS_CANCELED = 21;
export const JOB_STATUS_ABORTED = 22;


export class Constant {
    path : string
    key: string
    value: string
}

export function log(obj: any) {
    // @ts-ignore
    if (import.meta.env.VITE_MODE == 'DEVELOPMENT') console.log(obj)
}

export function getSqlDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
}

export function fromSqlDate(date: string): Date {
    const parts = date.split("-")
    return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]))
}

export function getRecordTypeNames(constants: Array<Constant>): {[key:string]: string} {
    let result: {[key:string]: string} = {}

    for (let i=0;i<constants.length;i++) {
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

export function recordType2Name(recordTypeNames: {[key:string]: string}, recordType: string): string {
    if (recordTypeNames && recordType in recordTypeNames) {
        return recordTypeNames[recordType]
    } else return recordType
}

export function name2RecordType(recordTypeNames: {[key:string]: string}, name: string): string {
    if (recordTypeNames) {
        const recordTypes = Object.keys(recordTypeNames)
        for (let i = 0; i < recordTypes.length; i++) {
            if (recordTypeNames[recordTypes[i]] === name) return recordTypes[i]
        }
    }
    return ""
}

export function handleCommonFetchErrors(handlerInstance: LitElement,
                                        e: FetchException, messagePrefix="",
                                        onUnhandledError: CallableFunction=null) {
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
            `${messagePrefix}Kiosk server responded with a network error.`,`(${e}). 
            The server might be down or perhaps you are not logged in properly.`)
        return
    }
}

export function gotoPage(href: string) : void {

    // @ts-ignore
    if (import.meta.env.VITE_MODE == 'DEVELOPMENT') {
        href = "http://localhost:5000" + href
    }
    window.location.href = href
}