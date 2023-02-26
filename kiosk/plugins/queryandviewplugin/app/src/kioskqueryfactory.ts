import { literal, StaticValue } from "lit/static-html.js";
import "./structuredkioskquery.ts"

export class KioskQueryFactory {
    static tagKioskStructuredQuery = literal`structured-kiosk-query`

    static getTypeIcon(kioskQueryType: string) {
        switch(kioskQueryType.toLowerCase()) {
            case "structuredkioskquery": return ""
            default: return ""
        }
    }

    static getKioskQueryTag(kioskQueryType: string): StaticValue | null {
        switch(kioskQueryType.toLowerCase()) {
            case "structuredkioskquery": return this.tagKioskStructuredQuery
            default: return null
        }
    }
}