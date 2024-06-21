import * as string_decoder from "string_decoder";

export type AnyDict = {
    [key: string]: any
}

export class Constant {
    path : string
    key: string
    value: string
}

export type ApiResultContextsFull={
    identifiers: Array<ApiResultContextsFullIdentifierInformation>
}

export type ApiResultContextsFullIdentifierInformation={
    field: string
    record_type: string
    identifier: string
}

export type ApiResultKioskQueryDescriptionUI={
    [key:string]: AnyDict
}

export interface ApiResultKioskQueryChartDefinition {
    type: string
    title: string
    interpretedTitle?: string
}

export interface ApiResultKioskQueryDescription {
    id: string
    type: string
    name: string
    description: string
    ui: ApiResultKioskQueryDescriptionUI
    category: string
    order_priority: string
    show_rows?: boolean
    charts?: {[key: string]: ApiResultKioskQueryChartDefinition}
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

export interface ApiKioskViewGroupPart {
    position: number
    text: string
    layout?: string
    opened?: boolean
}

export interface ApiKioskViewGroup {
    type: "stacked" | "accordion"
    parts: {[partId: string]: ApiKioskViewGroupPart}
}

export interface ApiKioskViewCompilation {
    name: string
    record_type: string
    groups: { [groupName: string]: ApiKioskViewGroup }
}

export interface ApiKioskViewHeader {
    version: number
}

export type ApiKioskViewTable = Array<Array<any>>

export interface ApiKioskViewData {
    [key: string]: ApiKioskViewTable
}

export interface ApiKioskViewImages {
    [key: string]: string
}

export interface ApiKioskViewDSD {
    [key: string]: ApiKioskViewTable
}

export interface ApiKioskViewLayout {
    record_type: string,
    view_type: "sheet" | "list" | "file_list" | "harris_matrix",
    fields_selection: "dsd" | "view",
    on_record_missing?: "hide" | "show" | "message"
    layout_settings: AnyDict
    ui_elements: AnyDict
}

export interface ApiKioskViewListLayout extends ApiKioskViewLayout {
    view_type: "list"
    max_height?: string
    max_height_expandable?: boolean
}

export interface ApiKioskViewDocument {
    compilation: ApiKioskViewCompilation
    "kioskview.data"?: ApiKioskViewData
    "kioskview.lookup_data"?: ApiKioskViewData
    "kioskview.images"?: ApiKioskViewImages
    "kioskview.dsd"?: ApiKioskViewDSD
    "kioskview.header": ApiKioskViewHeader
}

export interface ApiKioskViewDocumentLayouts {
    [key: string]: ApiKioskViewLayout
}

export type ApiKioskViewDocumentType = ApiKioskViewDocument | ApiKioskViewDocumentLayouts

export interface ApiResultKioskView {
   document: ApiKioskViewDocument
}