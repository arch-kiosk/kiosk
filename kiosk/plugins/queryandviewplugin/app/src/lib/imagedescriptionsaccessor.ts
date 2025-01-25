import { DataContextAccessor } from "./datacontextaccessor";
import { ApiKioskViewImageRecord } from "./apitypes";
import { DataContext } from "./datacontext";

export class ImageDescriptionAccessor extends DataContextAccessor {
    private descriptions: {[key: string]: ApiKioskViewImageRecord}


    public constructor(id: string, dataContext: DataContext, descriptions: {[key: string]: ApiKioskViewImageRecord}=undefined) {
        super(id, dataContext);
        this.rootKey = '/$/images/descriptions'
        this.assignEntries(descriptions)
    }

    /**
     * assigns an array of description entries as (not to!) the description dict. So
     * this is replacing the whole dictionary! The path value of the Constant instance follows
     * the "constants" api: there the path would be e.g. "glossary" and the key "some term". In the dictionary that
     * would be accessible as "/$/images/descriptions/uuid"
     * @param descriptions an array of Constant instances.
     */
    public assignEntries(descriptions: {[key: string]: ApiKioskViewImageRecord}) {
        this.descriptions = descriptions
    }

    get(_path: string, key: string, _getMode: number = 0): any {
        // debugger;
        // path = path.substring(this.rootKey.length)
        // let entry = undefined

        const entry = this.descriptions[key]

        if (entry) {
            return entry
        } else {
            return ""
        }
    }
}