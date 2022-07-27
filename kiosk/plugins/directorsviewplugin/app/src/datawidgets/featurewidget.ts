// @ts-ignore
import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import widgetStyle from './component-feature-widget.sass';
import {State} from "../store/reducer";
// @ts-ignore
import {store} from '../store/store.ts';
// @ts-ignore
import {setSelector, StoreContextSelector, StoreDateSelector, StoreTeamSelector} from '../store/actions.ts';
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import {fetchFromApi, FetchException} from "../../../../../static/scripts/kioskapputils.js"
import {
    fromSqlDate,
    getRecordTypeNames,
    getSqlDate, getStandardTerm,
    handleCommonFetchErrors,
    name2RecordType,
    recordType2Name
// @ts-ignore
} from "../lib/applib.ts";

class FeatureRecord {
    identifier: string
    type: string
    feature_creation: string
    created: number
    modified: number
    photoCount: number
    modified_by: string
    uid: string
}

@customElement('feature-widget')
class FeatureWidget extends connect(store)(LitElement) {

    login_token = ""
    api_url = ""
    selected_date: Date = null
    selected_context: string = ""
    selected_context_uid: string = ""
    selected_member: string = ""
    features: Array<FeatureRecord> = []
    fetching: boolean = false
    fetch_error: string = ""
    featureCount: number = 0
    selected_sort: string = "identifier"
    selected_context_type: string = ""
    term_for_feature: string = "feature"
    plural_for_feature: string = "features"

    sort_by: { [key: string]: Array<string> } = {
        "identifier": ["identifier", "modified"],
        "creation": ["created", "identifier"],

    }

    constructor() {
        super();
        // @ts-ignore
        this._init();
    }

    static get properties() {
        return {
            login_token: {type: String},
            api_url: {type: String},
            selected_context: {type: String},
            selected_date: {type: Date},
            selected_member: {type: String},
            fetching: {type: Boolean},
            sort_by: {type: Array},
            term_for_feature: {type: String}

        }
    }

    static get styles() {
        return widgetStyle
    }

    _init() {
    }

    get_conditions(us_date: string): string {
        let identifier = this.selected_context

        // let sql = `record_type in ('feature_unit', 'locus', 'locus_photo') and modified_date = '${us_date}'`
        let sql = `unit_type = 'feature' and record_type in ('unit', 'dayplan') and modified_date = '${us_date}'`
        if (identifier) {
            if (this.selected_context_type === "feature")
                sql = sql + ` and identifier = '${identifier}'`
            else
                sql = sql +  ` and "id_uuid" in (select "uid_dst_unit" from unit_unit_relation where "uid_src_unit"='${this.selected_context_uid}')`
        }
        if (this.selected_member) sql = sql + ` and modified_by ='${this.selected_member}'`
        return sql
    }

    fetch_data() {
        this.fetching = true
        const us_date = getSqlDate(this.selected_date)
        const sql = `
            id_uuid, primary_identifier, identifier, recorder, created, modified_by, modified_date, 
            record_type, type, unit_type, count(data_uuid) c 
            from {base} 
            where ${this.get_conditions(us_date)}
            group by id_uuid, primary_identifier, identifier, recorder, created, modified_by, modified_date, 
            record_type, type, unit_type         
        `
        // console.log(sql)
        const cql = {
            "cql": {
                "base": {
                    "scope": {
                        "unit": {
                            "feature_unit": {
                                "dayplan": {
                                    "join": "inner(uid_unit, uid_unit)",
                                },
                                "locus": {
                                    "join": "inner(uid_unit, uid_unit)",
                                    "relates_to": {
                                        "collected_material": {}
                                    }
                                },
                            }
                        }
                    },
                    "target": {
                        "field_or_instruction": "replfield_modified()"
                    },
                    "additional_fields": {
                        // "id_uuid": {
                        //     "field_or_instruction": "id_uuid",
                        //     "default": "",
                        // },
                        "modified_date": {
                            "field_or_instruction": "replfield_modified()",
                            "default": "",
                            "format": "datetime(date)"
                        },
                        "modified_by": {
                            "field_or_instruction": "replfield_modified_by()",
                            "default": "",
                            "format": "dsd_type(varchar)"
                        },
                        "modified_timestamp": {
                            "field_or_instruction": "replfield_modified()",
                            "default": "",
                        },
                        "created": {
                            "field_or_instruction": "feature_unit.replfield_created()",
                            "default": "null",
                            "format": "datetime(date)"
                        },
                        "type": {
                            "field_or_instruction": "feature_unit.feature_type",
                            "default": "",
                            "format": "dsd_type(varchar)"
                        },
                        "unit_type": {
                            "field_or_instruction": "unit.type",
                            "default": "",
                            "format": "dsd_type(varchar)"
                        },
                        "recorder": {
                            "field_or_instruction": "unit.id_excavator",
                            "default": "",
                            "format": "dsd_type(varchar)"
                        },
                    }
                },
                "meta": {
                    "version": 0.1
                },
                "query": {
                    "type": "DirectSqlQuery",
                    "sql": sql
                }
            }
        }
        // console.log(cql)
        fetchFromApi(this.api_url, this.login_token, "cql/query",
            {
                method: "POST",
                body: JSON.stringify(cql),
                caller: "featurewidget.fetch_data"
            }
        )
            .then((data: any) => {
                if (data.result_msg !== "ok") {
                    this.fetch_error = data.result_msg
                } else {
                    this.fetch_error = ""
                    this.load_records(data.records)
                }

                this.fetching = false

            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this, e, "featureWidget.fetch_data", null)
            })
    }

    load_records(records: []) {
        this.features = []
        let featureDict: { [key: string]: FeatureRecord } = {}

        // console.log(`feature records: ${records.length}`)
        records.forEach((r: any) => {
            const featureId = r.identifier
            let feature: FeatureRecord

            if (featureId in featureDict)
                feature = featureDict[featureId]
            else {
                feature = new FeatureRecord()
                featureDict[featureId] = feature
                this.features.push(feature)
                feature.photoCount = 0
                feature.type = "?"
                feature.modified = 0
                feature.feature_creation = "?"
                feature.modified_by = ""
            }
            feature.identifier = r.identifier
            feature.uid = r.id_uuid

            if (r.modified > feature.modified)
                feature.modified = r.modified
                feature.modified_by = r.modified_by

            // if (r.recorder) feature.recorder = r.recorder

            if (r.type) feature.type = r.type

            if (r.created) {
                feature.feature_creation = fromSqlDate(r.created).toLocaleDateString()
                feature.created = fromSqlDate(r.created).getTime()
            }

            if (r.record_type == "dayplan") {
                feature.photoCount = r.c
            }
        })
        this.featureCount = Object.keys(this.features).length
        this.sort_records(this.sort_by[this.selected_sort])
    }

    sort_records(sort_by: Array<string>) {
        function _sort(a: FeatureRecord, b: FeatureRecord): number {
            for (let i = 0; i < sort_by.length; i++) {
                let attrib: string = sort_by[i];
                let value_a = a[attrib as keyof FeatureRecord]
                let value_b = b[attrib as keyof FeatureRecord]
                let result: number = 0

                if (typeof (value_a) === "string") {
                    result = (<string>value_a).localeCompare((<string>value_b))
                } else {
                    if (typeof (value_a) === "boolean") {
                        if (value_a && !value_b) result = -1
                        if (!value_a && value_b) result = 1
                    } else {
                        if (value_a < value_b) result = -1
                        if (value_a > value_b) result = 1
                    }
                }

                if (result != 0)
                    return result
            }
            return 0
        }

        // console.log(`sorting features by ${this.sort_by[this.selected_sort]}`)
        this.features.sort(_sort)
        this.requestUpdate();
    }

    stateChanged(state: State) {
        // console.log("feature-widget.state_changed triggered")
        if (this.fetch_error) {
            return html`Error fetching: ${this.fetch_error}`
        }
        if (state.initState == 0)
            return
        let changed = false
        if ("dateSelector" in state.selectors) {
            let stateDate: Date = (<StoreDateSelector>state.selectors["dateSelector"]).selectedDate
            if ((!this.selected_date) || (stateDate.getTime() !== this.selected_date.getTime())) {
                this.selected_date = stateDate
                changed = true
            }
            if ("contextSelector" in state.selectors) {
                let stateContext: string = (<StoreContextSelector>state.selectors["contextSelector"]).selectedContext
                if (stateContext !== this.selected_context) {
                    this.selected_context = stateContext
                    this.selected_context_uid = (<StoreContextSelector>state.selectors["contextSelector"]).selectedUid
                    this.selected_context_type = (<StoreContextSelector>state.selectors["contextSelector"]).selectedContextType
                    changed = true
                }
            }
            if ("teamSelector" in state.selectors) {
                let stateMember: string = (<StoreTeamSelector>state.selectors["teamSelector"]).selectedMember
                if (stateMember !== this.selected_member) {
                    this.selected_member = stateMember
                    changed = true
                }
            }
            if (changed) this.fetch_data()
        }
        if (state.constants.length > 0) {
            this.term_for_feature = getStandardTerm(state.constants,
                "standard_term_for_feature_unit", false, this.term_for_feature)
            this.plural_for_feature = getStandardTerm(state.constants,
                "standard_term_for_feature_unit", true, this.plural_for_feature)
        }
    }

    render() {
        return html`${this.api_url !== "" && this.login_token !== ""
            ? html`
                    <div class="feature-widget">
                        <div class="headline">
                            <p>${this.featureCount} ${this.featureCount == 1?this.term_for_feature:this.plural_for_feature}</p>
                        </div>
                        <div class="controls">
                            <div class="controls-left">
                                ${this.renderSortSelector()}
                            </div>
                        </div>
                        ${this.selected_date !== null
                                ? this.render_widget()
                                : html`Please select a date`}
                    </div>`
            : html`api url unknown`
        }`
    }

    sortTypeChanged(e: Event) {
        //@ts-ignore
        this.selected_sort = e.currentTarget.value
        this.sort_records(this.sort_by[this.selected_sort])
    }

    renderSortSelector() {
        return html`
            <label for="sort-type-selector">sort by</label>
            <select name="sort-type-selector" id="sort-type-selector" @change="${this.sortTypeChanged}">
                ${Object.keys(this.sort_by).map(sort_id => html`
                            <option value="${sort_id}"
                                    ?selected="${(this.selected_sort === sort_id)}">
                                ${sort_id}
                            </option>
                        `
                )}
            </select>
        `
    }

    protected changeContext(featureId: string) {
        let context = {selectedContext: "", selectedUid: "", selectedContextType: ""}
        if (featureId) {
            let feature = this.features.find(f => f.identifier === featureId)
            context.selectedContext = feature.identifier
            context.selectedUid = feature.uid
            context.selectedContextType = "feature"
            store.dispatch(setSelector("contextSelector", context))
        }
    }

    protected gotoIdentifier(e: Event) {
        //@ts-ignore
        const context = e.currentTarget.getAttribute("context")
        // console.log(`clicked on ${context}`)
        if (context != this.selected_context) {
            this.changeContext(context)
        }
    }

    render_widget() {
        // console.log("rendering feature widget")
        if (!this.selected_date) {
            return html`please select a date`
        }
        if (this.fetching)
            return html`fetching data ...`
        else {
            if (this.featureCount == 0) {
                return html`
                    <div class="no-data">
                        <p>No data found for your selection</p>
                    </div>`
            } else {
                return html`
                    <div class="feature-list ${this.selected_member ? undefined: 'feature-list-with-member'}">
                        <div class="list-header">identifier</div>
                        <div class="list-header">type</div>
                        <div class="list-header">creation</div>
                        <div class="list-header">photos</div>
                        ${this.selected_member ? undefined : html`<div class="list-header">by</div>`}
                        ${this.features.map((el: FeatureRecord) =>
                                html`
                                    <div class="list-identifier" context=${el.identifier} @click=${this.gotoIdentifier}>${el.identifier}</div>
                                    <div>${el.type}</div>
                                    <div>${el.feature_creation}</div>
                                    <div class="center-col">${el.photoCount}</div>
                                    ${this.selected_member ? undefined : html`<div class="center-col">${el.modified_by}</div>`}
                                `
                        )}
                        
                    </div>`
            }
        }
    }

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        // if (this.editing !== "") {
        //     this.shadowRoot.getElementById("edit-list").focus();
        // }
    }

// onAfterEnter(location: any, commands: any, router: any) {
//     console.log("OnAfterEnter", location, commands, router);
//     // this._installSyncEvents();
// }
}