export const QUERY_UI_SCENARIO = "query-ui"
export const VIEW_UI_SCENARIO = "view-ui"

export interface KioskViewDetails {
    tableName: string
    dsdIdentifierFieldName: string
    identifier: string
}
export interface KioskViewInstance {
    viewId: string
    details: KioskViewDetails
}
