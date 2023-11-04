import { DataContext } from "./datacontext";

export abstract class DataContextAccessor {
    protected dataContext: DataContext;
    private _rootKey: string = "" //if all the paths in the accessor share a path, set a root key: No need to search them all.
    protected _id: string;

    public get rootKey() {
        return this._rootKey
    }

    protected set rootKey(rootKey: string) {
        this._rootKey = rootKey
    }

    public get id() {
        return this._id;
    }

    public constructor(id: string, dataContext: DataContext) {
        this._id = id;
        this.dataContext = dataContext;
    }

    /**
     * method signature for get
     * @param path a path (without the wildcard or instruction prefix!)
     * @param key the key
     * @param getMode the search mode: see DataContext.GET_MODE_xxx constants
     * @returns undefined if there is no key or path
     */
    abstract get(path: string, key: string, getMode: number): any
}
