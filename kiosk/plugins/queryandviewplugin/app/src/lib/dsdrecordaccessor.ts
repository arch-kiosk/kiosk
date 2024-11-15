import { DataContextAccessor } from "./datacontextaccessor";
import { DataContext } from "./datacontext";
import { Constant } from "./apitypes";

interface DSDRecord {
    fields: Array<string>,
    record: Array<any>
}

export class DSDRecordAccessor extends DataContextAccessor {
    _data: { [idx: string]: any };
    _types: Array<string> = []
    _dataContext: DataContext;

    /**
     * A RecordAccessor for one record that binds to DSD information.
     *
     * @param id the record_type. Serves as root and id at the same time
     * @param dataContext the DataContext with the DSD information
     * @param data A DSDRecord consisting of a "fields" and "record" array
     * @param types type information for the record
     */
    public constructor(id: string, dataContext: DataContext, data: DSDRecord, types: Array<string>=[]) {
        super(id, dataContext);
        this.rootKey = "/" + id;
        this._dataContext = dataContext;
        // if (types.length == 0) debugger;
        this._types = types
        this.assignData(data);
    }

    public assignData(data: DSDRecord) {
        this._data = {};
        for (let i = 0; i <= data.fields.length; i++) {
            this._data[data.fields[i]] = [data && data.record ? data.record[i] : undefined, i < this._types.length?this._types[i]:undefined];
        }
    }

    get(path: string, key: string, getMode: number): any {
         if (path) {
            switch (getMode) {
                case DataContext.GET_MODE_DEFAULT:
                    if (path !== this.rootKey)
                        return undefined;
                    break;
                case DataContext.GET_MODE_ENDS_WITH:
                    if (!this.rootKey.endsWith(path))
                        return undefined;
                    break;
                case DataContext.GET_MODE_REGEX:
                    // ToDo
                    throw "DSDRecordAccessor.get: Regex not implemented";
                default:
                    throw `DSDRecordAccessor.get: Unknown getMode in ${path}${key}`;

            }
        }
        const data_type = this._data[key][1]
        // if (key === "modified") debugger;
        if (data_type === "TIMESTAMPTZ") {
            if (this._data.hasOwnProperty(key + "_ww") && this._data[key + "_ww"][0]) {
                return this._data[key + "_ww"][0];
            }
            const tz = this._data.hasOwnProperty(key + "_tz")?this._data[key + "_tz"][0]:"-"
            return `${this._data[key][0]}${tz?'@'+tz:''}`;
        }
        return this._data[key][0];
    }
}