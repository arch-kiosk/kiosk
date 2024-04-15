import { DataContextAccessor } from "./datacontextaccessor";
import {FMDictToDict } from "./applib";
import { Constant } from "./apitypes"
import { DataContext } from "./datacontext";

export class DictionaryAccessor extends DataContextAccessor {
    private dictionary: Constant[]

    public constructor(id: string, dataContext: DataContext, dictionary: Constant[]=undefined) {
        super(id, dataContext);
        this.rootKey = '/$/'
        this.assignEntries(dictionary)
    }

    public setRootKey(key: string): void {
        this.rootKey = key
    }

    /**
     * assigns an array of dictionary entries of type Constant as (not to!) the dictionary. So
     * this is replacing the whole dictionary! The path value of the Constant instance follows
     * the "constants" api: there the path would be e.g. "glossary" and the key "some term". In the dictionary that
     * would be accessible as "/$/glossary/key"
     * @param dictionary an array of Constant instances.
     */
    public assignEntries(dictionary: Constant[]) {
        this.dictionary = dictionary
    }

    private splitKeyAndIndex(key: string): string[] {
        const colonIdx = key.lastIndexOf(":")
        if (colonIdx > -1) {
            return [key.substring(0, colonIdx), key.substring(colonIdx+1)]
        }
        return [key, undefined]
    }

    get(path: string, key: string, getMode: number = 0): any {
        path = path.substring(this.rootKey.length)
        let index: string
        let useKeyAsDefault=true
        if (key.endsWith("?")) {
            useKeyAsDefault=false
            key = key.substring(0,key.length-1)
        }
        [key, index] = this.splitKeyAndIndex(key)

        let entry = undefined
        if (path) {
            switch (getMode) {
                case DataContext.GET_MODE_DEFAULT:
                    entry = this.dictionary.find((c) => c.path === path && c.key === key)
                    break
                case DataContext.GET_MODE_ENDS_WITH:
                    entry = this.dictionary.find((c) => c.path.endsWith(path) && c.key === key)
                    break
                default:
                    throw `dictionaryAccessor.get: unknown GET_MODE ${getMode}`
            }
        } else {
            entry = this.dictionary.find((c) => c.key === key)
        }

        if (entry) {
            if (Array.isArray(entry.value)) {
                return this.getListValue(index, entry, path, key);
            } else
                if (index) {
                    const rc = this.getFromFMDict(index, entry)
                    if (rc) return rc
                }
                return entry.value
        } else {
            return useKeyAsDefault?key:undefined
        }
    }

    /**
     * returns the value for a key from an FileMaker style dictionary
     * @param index They "key" into the FM Style dictionary
     * @param entry The FM style dictionary. A string like "key=value\rkey=value\rkey=value"...
     * @returns undefined if the FM Dictionary isn't valid
     *          the index itself if there is no matching key in the dictionary
     *          the value (a string) if the index matches a key in the dictionary
     * @private
     */
    private getFromFMDict(index: string, entry: Constant) {
        const fmDict = FMDictToDict(entry.value)
        if (!fmDict) return undefined
        if (fmDict.hasOwnProperty(index)) return fmDict[index]

        return index
    }

    private getListValue(index: string, entry: Constant, path: string, key: string) {
        let numIndex: number;
        if (!index) {
            numIndex = 1;
        } else {
            numIndex = parseInt(index);
        }
        if (isNaN(numIndex)) {
            console.warn(`dictionaryAccessor.get: non numeric index ${entry.value} used for list value ${path}/${key}`);
            return undefined;
        }
        if (entry.value.length < numIndex) {
            console.warn(`dictionaryAccessor.get: index ${entry.value} out of range for list value ${path}/${key}`);
            return undefined;
        }
        return entry.value[numIndex - 1];
    }
}