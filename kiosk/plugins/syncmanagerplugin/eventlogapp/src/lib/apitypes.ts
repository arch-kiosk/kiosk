// import * as string_decoder from "string_decoder";
import {DateTime} from 'luxon'

export type AnyDict = {
    [key: string]: any
}

export interface SyncManagerEventV1 {
    uid: string
    ts: string
    event: string
    message: string
    dock: string
    level: string
    user?: string
    tsDate: DateTime
}

export interface SyncManagerEventsV1 {
    last_sync_ts: string
    events: Array<SyncManagerEventV1>



}