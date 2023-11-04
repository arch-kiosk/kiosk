import * as apittypes from "./apitypes";
import {
    AnyDict,
    ApiKioskViewData,
    ApiKioskViewDocument, ApiKioskViewDocumentLayouts, ApiKioskViewDocumentType,
    ApiKioskViewGroup,
    ApiKioskViewGroupPart, ApiKioskViewImages,
    ApiKioskViewLayout,
} from "./apitypes";
import { KioskViewGroupPart } from "./kioskviewgrouppart";
import { DataContext } from "./datacontext";
import { DataSetDefinition } from "../../kioskapplib/datasetdefinition";


export class KioskViewDocument {
    private _data: apittypes.ApiKioskViewDocument;
    private _compilation: apittypes.ApiKioskViewCompilation;
    private readonly MAX_VERSION = 1;
    private _dataContext : DataContext = undefined
    private _dsd: DataSetDefinition

    set dataContext(dataContext: DataContext) {
        this._dataContext = dataContext
    }

    get name() {
        return this._compilation.name;
    }

    get recordType() {
        return this._compilation.record_type;
    }

    get dsd() {
        return this._dsd
    }

    _check_header(data: ApiKioskViewDocument) {
        if (data.hasOwnProperty("kioskview.header")) {
            if (data["kioskview.header"].hasOwnProperty("version")) {
                if (data["kioskview.header"].version <= this.MAX_VERSION) {
                    return true;
                } else throw `Cannot process version ${data["kioskview.header"].version} of ApiKioskViewDocument`;
            } else throw `ApiKioskViewDocument has no version in header`;
        } else throw `ApiKioskViewDocument has no header`;
    }
    _check_compilation(data: ApiKioskViewDocument) {
        if (!data.hasOwnProperty("compilation")) {
            throw 'ApiKioskViewDocument has no compilation'
        }
        if (!data.compilation.hasOwnProperty("name")) {
            throw 'ApiKioskViewDocument.compilation has no name'
        }
        if (!data.compilation.hasOwnProperty("record_type")) {
            throw 'ApiKioskViewDocument.compilation has no record_type'
        }
        if (!data.compilation.hasOwnProperty("groups") || Object.keys(data.compilation.groups).length == 0) {
            throw 'ApiKioskViewDocument.compilation has no groups'
        }
        Object.keys(data.compilation.groups).forEach((groupId) => {
            this._check_group(groupId, data.compilation.groups[groupId])
            Object.keys(data.compilation.groups[groupId].parts).forEach(
                part => KioskViewGroupPart.check_part(groupId, part, data)
            )

        } )
    }

    _check_group(groupId: string, group: ApiKioskViewGroup) {
        if (!group) throw `KioskViewDocument group ${groupId} empty or compromised`
        if (!group.hasOwnProperty("parts") || Object.keys(group.parts).length == 0) throw `KioskViewDocument group ${groupId} has no parts`
        if (!group.hasOwnProperty("type")) throw `KioskViewDocument group ${groupId} has no type`
        if (group.type !== "accordion" && group.type !== "stacked") throw `KioskViewDocument group ${groupId} has unknown type ${group.type}`
    }

    _check_data(data: ApiKioskViewDocument) {
        if (!data.hasOwnProperty("kioskview.data")) {
            throw 'ApiKioskViewDocument has no kioskview.data section'
        }
    }

    _check_dsd(data: ApiKioskViewDocument) {
        if (!data.hasOwnProperty("kioskview.dsd")) {
            throw 'ApiKioskViewDocument has no kioskview.dsd section'
        }
    }

    load(data: any) {
        this._data = null
        this._check_header(data);
        this._check_compilation(data);
        this._check_data(data);
        this._check_dsd(data);
        this._data = data;
        this._dsd = new DataSetDefinition()
        this._dsd.loadFromDict(this._data["kioskview.dsd"])
        this._compilation = this._data.compilation
    }

    _assert_data() {
        if (!this._data) throw 'No valid KioskViewDocument loaded.'
    }

    /**
     * returns a tuple per group consisting of [group-id, group type]
     */
    getGroups() {
       this._assert_data()
       return Object.keys(this._compilation.groups).map(group => [group, this._compilation.groups[group].type])
    }

    getParts(groupId: string) {
        if (!this._data.compilation.groups.hasOwnProperty(groupId)) throw `KioskViewDocument.getParts: Group ${groupId} unknown.`
        const groupParts = Object.keys(this._compilation.groups[groupId].parts).map(
            partId => new KioskViewGroupPart(this._data, groupId, partId, this._dataContext))
        groupParts.sort(
            (a, b) =>
                a.position < b.position ? -1 : (a.position > b.position ? 1 : 0))
        return groupParts
    }

    getDSD() {
        return this._data["kioskview.dsd"]
    }

    getData(): ApiKioskViewData {
        return this._data["kioskview.data"]
    }

    getImageDescriptions(): ApiKioskViewImages {
        return this._data["kioskview.images"]
    }
}

