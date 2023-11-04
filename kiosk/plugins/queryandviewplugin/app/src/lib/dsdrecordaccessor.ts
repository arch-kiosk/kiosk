import { DataContextAccessor } from "./datacontextaccessor";
import { DataContext } from "./datacontext";
import { Constant } from "./apitypes";

interface DSDRecord {
    fields: Array<string>,
    record: Array<any>
}

export class DSDRecordAccessor extends DataContextAccessor {
    _data: { [idx: string]: any };
    _dataContext: DataContext;

    /**
     * A RecordAccessor for one record that binds to DSD information.
     *
     * @param id the record_type. Serves as root and id at the same time
     * @param dataContext the DataContext with the DSD information
     * @param data A DSDRecord consisting of a "fields" and "record" array
     */
    public constructor(id: string, dataContext: DataContext, data: DSDRecord) {
        super(id, dataContext);
        this.rootKey = "/" + id;
        this._dataContext = dataContext;
        this.assignData(data);
    }

    public assignData(data: DSDRecord) {
        this._data = {};
        for (let i = 0; i <= data.fields.length; i++) {
            this._data[data.fields[i]] = data && data.record ? data.record[i] : undefined;
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
        return this._data[key];
    }
}