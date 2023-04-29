import { literal } from "lit/static-html.js";
import "./structuredkioskquery.ts";
export class KioskQueryFactory {
    static getTypeIcon(kioskQueryType) {
        switch (kioskQueryType.toLowerCase()) {
            case "structuredkioskquery": return "";
            default: return "";
        }
    }
    static getKioskQueryTag(kioskQueryType) {
        switch (kioskQueryType.toLowerCase()) {
            case "structuredkioskquery": return this.tagKioskStructuredQuery;
            default: return null;
        }
    }
}
KioskQueryFactory.tagKioskStructuredQuery = literal `structured-kiosk-query`;
//# sourceMappingURL=kioskqueryfactory.js.map
//# sourceMappingURL=kioskqueryfactory.js.map