export const SCENARIO = "query-ui"

export interface KioskViewDetails {
    tableName: String
    dsdName: String
    identifier: String
}
export interface KioskViewInstance {
    viewId: string
    details: KioskViewDetails
}
