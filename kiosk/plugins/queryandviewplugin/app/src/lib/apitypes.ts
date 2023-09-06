export type AnyDict = {
    [key: string]: any
}

export type ApiResultKioskQueryDescriptionUI={
    [key:string]: AnyDict
}


export interface ApiResultKioskQueryDescription {
    id: string
    type: string
    name: string
    description: string
    ui: ApiResultKioskQueryDescriptionUI
}

export interface KioskQueryInstance extends ApiResultKioskQueryDescription {
    uid: string
}

export interface ApiResultKioskQueryDocumentInformation {
    columns: AnyDict
    column_order: [string]
    query: [AnyDict]
}

export interface ApiResultKioskQuery {
    result_msg?: string
    record_count: number
    overall_record_count: number
    page: number
    page_size: number
    dsd_information: [AnyDict]
    document_information: ApiResultKioskQueryDocumentInformation
    records: [AnyDict]
}

