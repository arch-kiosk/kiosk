export const QUERY_UI_SCENARIO = "query-ui"
export const VIEW_UI_SCENARIO = "view-ui"

export interface KioskViewDetails {
    tableName: string
    dsdIdentifierFieldName: string
    identifier: string
    subRecordType: string
    subRecordUid: string
}
export interface KioskViewInstance {
    viewId: string
    elementId: string
    details: KioskViewDetails
}

export type ApiResultKioskFTSHit = {
    uid: string,
    identifier: string,
    identifier_record_type: string
    record_type: string,
    excerpt: string,
    rank: string,
    displayRecordType: string  //dynamically added in the app
}

export type APIResultFTS = {
    result_msg: string,
    page: string,
    ages: string,
    page_size: string,
    record_count: string,
    overall_record_count: string,
    // dsd_information: string,
    // document_information: string,
    records: Array<ApiResultKioskFTSHit>
}
