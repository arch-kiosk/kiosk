import { DataSetDefinition } from "@arch-kiosk/kiosktsapplib"
import { DataContextAccessor } from "./datacontextaccessor";

export class DataContext {
    static GET_MODE_DEFAULT = 0
    static GET_MODE_ENDS_WITH = 1
    static GET_MODE_REGEX = 1

    private accessors: DataContextAccessor[] = [];
    private dsd: DataSetDefinition;
    private SEPARATOR = '/'

    public clone(): DataContext {
        const c = new DataContext()
        c.accessors = [...this.accessors]
        c.dsd = this.dsd
        c.SEPARATOR = this.SEPARATOR
        return c
    }

    public separatePathAndKey(designator: string) {
        const keySep = designator.lastIndexOf(this.SEPARATOR)
        const key = designator.substring(keySep+1)
        const path = designator.substring(0, keySep) || ""
        return { path: path, key: key}
    }

    get(designator: string): any {
        let mode = DataContext.GET_MODE_DEFAULT

        designator = designator.trimStart()

        if (designator.startsWith('*')) {
            mode = DataContext.GET_MODE_ENDS_WITH
            designator = designator.substring(1)
        } else {
            if (designator.startsWith(':')) {
                // todo: get the instruction
                mode = DataContext.GET_MODE_REGEX
            } else {
                // make sure that a path expression starts with the root
                if (!designator.startsWith("/"))
                    designator = "/" + designator
            }
        }

        const pathAndKey = this.separatePathAndKey(designator)
        for (const accessor of this.accessors) {
            if (mode == DataContext.GET_MODE_DEFAULT && accessor.rootKey && pathAndKey.path) {
                if (!pathAndKey.path.startsWith(accessor.rootKey)) {
                    continue;
                }
            }
            const v = accessor.get(pathAndKey.path, pathAndKey.key, mode);
            if (typeof v !== "undefined") return v;
        }
        return undefined
    }

    public get count() {
        return this.accessors.length
    }

    public get ids() {
        return this.accessors.map(accessor => accessor.id)
    }

    /**
     * register a DataContextAccessor with a certain priority. By default, it will be inserted at the top of the list.
     * @param accessor a DataContextAccessor
     * @param before true (default) to put it before the position. false to put it behind.
     * @param position "" (default) or an id of an existing DataContextAccessor.
     *                 Before "" means first, after "" means last.
     */
    registerAccessor(accessor: DataContextAccessor, before = true, position = "") {
        this.deleteAccessorIfExists(accessor.id)
        if (position) {
            const pos = this.accessors.findIndex((accessor) => accessor.id === position);
            if (pos == -1)
                throw `registerAccessor: Accessor ${position} does not exist`;

            this.accessors.splice(before ? pos : pos+1, 0, accessor);

        } else {
            if (before) {
                this.accessors.splice(0, 0, accessor);
            } else {
                this.accessors.push(accessor);
            }
        }
    }

    deleteAccessorIfExists(id:string) {
        const pos = this.accessors.findIndex((accessor) => accessor.id === id);
        if (pos > -1) {
            this.accessors.splice(pos, 1)
        }
    }

    hasAccessor(id: string): boolean {
        return this.accessors.findIndex((accessor) => accessor.id === id) > -1
    }

    getAccessor(id: string): DataContextAccessor {
        return this.accessors.find((accessor) => accessor.id === id)
    }
}