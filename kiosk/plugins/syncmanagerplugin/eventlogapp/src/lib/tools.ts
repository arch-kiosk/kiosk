import {DateTime} from "luxon";

export function getLatinDate(dt: DateTime, withTime: boolean = true): string {
    const latinMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
    const dtStr = `${dt.day}.${latinMonths[dt.month-1]}.${dt.year}`
    return withTime?dtStr + " " + dt.toLocaleString(DateTime.TIME_SIMPLE):dtStr
}