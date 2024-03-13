import { literal, StaticValue } from "lit/static-html.js";
import "./structuredkioskquery.ts"
import "./fulltextkioskquery.ts"


export class KioskQueryFactory {
    static tagKioskStructuredQuery = literal`structured-kiosk-query`
    static tagFullTextKioskQuery = literal`full-text-kiosk-query`

    static getTypeIcon(kioskQueryType: string) {
        switch(kioskQueryType.toLowerCase()) {
            case "structuredkioskquery": return ""
            case "fulltextkioskquery": return ""
            default: return ""
        }
    }

    static getKioskQueryTag(kioskQueryType: string): StaticValue | null {
        switch(kioskQueryType.toLowerCase()) {
            case "structuredkioskquery": return this.tagKioskStructuredQuery
            case "fulltextkioskquery": return this.tagFullTextKioskQuery
            default: return null
        }
    }
}