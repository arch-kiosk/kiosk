import {utils, writeFile, write} from "xlsx"

export class SheetExport {
    private _rows: Array<object> = []
    private _columnNames: Array<string> = undefined

    constructor() {

    }

    addRow(row: object) {
        this._rows.push(row);
    }

    setColumnNames(columnNames: Array<string>) {
        this._columnNames = columnNames;
    }

    /**
     * Export data to a file in either Excel or CSV format.
     *
     * @param method - The export method. Can be "excel", "csv" or "clipboard". Defaults to "excel".
     * @returns void
     */
    export(method="excel") {
        const worksheet = utils.json_to_sheet(this._rows)
        if (this._columnNames) {
            utils.sheet_add_aoa(worksheet, [this._columnNames], { origin: "A1" });
        }
        const workbook = utils.book_new()
        utils.book_append_sheet(workbook, worksheet, "data")
        switch(method) {
            case "excel":
                writeFile(workbook, "data.xls", { compression: true, bookType: 'xls' })
                break;
            case "csv":
                writeFile(workbook, "data.csv", { compression: true, bookType: 'csv' })
                break;
            case "clipboard":
                const s = write(workbook, { type: "string", bookType: 'txt' })
                navigator.clipboard.writeText(s)
                    .then(clipboard => {
                        alert("Data copied to clipboard")
                    })
                    .catch(err => alert("Data could not be copied to clipboard"))
        }
    }
}