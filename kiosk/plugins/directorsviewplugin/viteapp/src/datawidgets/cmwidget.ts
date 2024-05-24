// @ts-ignore
import { html, LitElement, unsafeCSS } from "lit";
import {customElement} from 'lit/decorators.js'
// @ts-ignore
import local_css from '../styles/component-cm-widget.sass?inline';
import {State} from "../store/reducer";
// @ts-ignore
import {store} from '../store/store.ts';
// @ts-ignore
import {StoreContextSelector, StoreDateSelector, StoreTeamSelector} from '../store/actions.ts';
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import {fetchFromApi, FetchException} from "../../../../../static/scripts/kioskapputils.js"

import {
    fromSqlDate,
    getSqlDate, getStandardTerm,
    handleCommonFetchErrors,
}
// @ts-ignore
    from "../lib/applib.ts";
// @ts-ignore
import { KioskAppComponent } from "../../kioskapplib/kioskappcomponent.ts";

class CMRecord {
    identifier: string
    type: string
    cm_creation: string
    created: number
    modified: number
    modified_by: string
    lot: boolean
    unitId: string
    hasDescription: boolean
    cm_type: string
    photoCount: number
    record_type: string
}

@customElement('cm-widget')
class CMWidget extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    selected_date: Date = null
    selected_context: string = ""
    selected_context_uid: string = ""
    selected_member: string = ""
    // cm: { [key: string]: CMRecord } = {}
    cm: Array<CMRecord> = []
    fetching: boolean = false
    fetch_error: string = ""
    cmCount: number = 0
    selected_sort: string = "identifier"
    term_for_cm: string = "collected material"
    plural_for_cm: string = "collected materials"
    cm_types: {[key: string]: string} = {}

    sort_by: { [key: string]: Array<string> }= {
        "identifier": ["identifier", "modified"],
        "creation": ["created", "identifier"],
        "type": ["cm_type", "created", "identifier"],
        "material": ["type", "created", "identifier"]
    }

    constructor() {
        super();
    }

    static properties = {
        ...super.properties,
        selected_context: {type: String},
        selected_date: {type: Date},
        selected_member: {type: String},
        fetching: {type: Boolean},
        sort_by: {type: Array},
        term_for_cm: {type: String}
    }

    get_conditions(us_date: string, identifier: string, member: string): string {
        let sql = `record_type in ('collected_material', 'collected_material_photo') and modified_date = '${us_date}'`
        if (identifier || member) {
            if (identifier) sql = sql + ` and identifier = '${identifier}'`
            if (member) sql = sql + ` and modified_by ='${member}'`
        }
        return sql
    }

    fetch_data() {
        this.fetching = true
        const us_date = getSqlDate(this.selected_date)
        const sql = `
            primary_identifier, identifier, cm_type, nolot, nodescription, created, modified_by, modified_date, 
            record_type, type, count(data_uuid) c 
            from {base} 
            where ${this.get_conditions(us_date, this.selected_context, this.selected_member)}
            group by primary_identifier, identifier, cm_type, nolot, nodescription, created, modified_by, modified_date, 
            record_type, type         
        `
        // console.log(sql)
        const cql = {
            "cql": {
                "base": {
                    "scope": {
                        "unit": {
                            "locus": {
                                "collected_material": {
                                    "collected_material_photo": {}
                                },
                            }
                        }
                    },
                    "target": {
                        "field_or_instruction": "replfield_modified()"
                    },
                    "additional_fields": {
                        "modified_date": {
                            "field_or_instruction": "replfield_modified()",
                            "default": "",
                            "format": "datetime(date)"
                        },
                        "modified_by": {
                            "field_or_instruction": "replfield_modified_by()",
                            "default": "",
                        },
                        "modified_timestamp": {
                            "field_or_instruction": "replfield_modified()",
                            "default": "",
                        },
                        "created": {
                            "field_or_instruction": "collected_material.replfield_created()",
                            "default": "null",
                            "format": "datetime(date)"
                        },
                        "type": {
                            "field_or_instruction": "collected_material.type",
                            "default": "",
                            "format": "dsd_type(varchar)"
                        },
                        "nolot": {
                            "field_or_instruction": "collected_material.uid_lot",
                            "default": "false",
                            "format": "isempty()"
                        },
                        "nodescription": {
                            "field_or_instruction": "collected_material.description",
                            "default": "true",
                            "format": "isempty()"
                        },
                        "cm_type": {
                            "field_or_instruction": "collected_material.cm_type",
                            "default": "-",
                            "format": "dsd_type(varchar)"
                        }
                    }
                },
                "meta": {
                    "version": 0.1,
                    // "comment": "cmwidget"
                },
                "query": {
                    "type": "DirectSqlQuery",
                    "sql": sql
                }
            }
        }

        let searchParams = new URLSearchParams({
            page_size: "-1"
        })

        this.apiContext.fetchFromApi("", "cql/query",
            {
                method: "POST",
                caller: "cmwidget.fetch_data",
                body: JSON.stringify(cql),
            },"v1",searchParams
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
                handleCommonFetchErrors(this, e, "cmwidget.fetch_data", null)
            })
    }

    load_records(records: []) {
        this.cm = []
        let collected_materials : { [key: string]: CMRecord } = {}
        records.forEach((r: any) => {
            const cmId = r.primary_identifier
            let cm: CMRecord

            if (cmId in collected_materials)
                cm = collected_materials[cmId]
            else {
                cm = new CMRecord()
                collected_materials[cmId] = cm
                this.cm.push(cm)
                cm.photoCount = 0
                cm.lot = false
                cm.type = "?"
                cm.hasDescription = false
                cm.cm_type = 'bulk'
                cm.record_type = ""
                cm.modified = 0
                cm.cm_creation = "?"
            }
            cm.identifier = r.primary_identifier
            cm.unitId = r.identifier
            cm.record_type = r.record_type
            if (r.modified > cm.modified)
                cm.modified = r.modified
            cm.modified_by = r.modified_by

            if (r.type) cm.type = r.type
            if (r.cm_type) cm.cm_type = this.cm_types[r.cm_type]
            if (r.created) {
                cm.cm_creation = fromSqlDate(r.created).toLocaleDateString()
                cm.created = fromSqlDate(r.created).getTime()
            }

            // wrapping this makes sure that hasDescription and isSmallFind are going to be displayed
            // only if the cm record itself has been modified. This comes closest to the information "has been made
            // a small find on the selected day / has been given a description on that day"
            // but: The results are often incomprehensible. Discussed in #887.
            // if (r.record_type == "collected_material") {
            if (!r.nodescription) cm.hasDescription = true
            if (!r.nolot) cm.lot = true
            // }
            if (r.record_type == "collected_material_photo") {
                cm.photoCount = r.c
            }
        })
        this.cmCount = Object.keys(this.cm).length
        this.sort_records(this.sort_by[this.selected_sort])
    }

    sort_records(sort_by: Array<string>) {
        function _sort(a: CMRecord, b: CMRecord): number {
            for (let i = 0; i < sort_by.length; i++) {
                let attrib: string = sort_by[i];
                let value_a = a[attrib as keyof CMRecord]
                let value_b = b[attrib as keyof CMRecord]
                let result: number = 0

                if (typeof (value_a) === "string") {
                    result = (<string>value_a).localeCompare((<string>value_b))
                } else {
                    if (typeof (value_a) === "boolean") {
                        if (value_a && !value_b) result = -1
                        if (!value_a && value_b) result = 1
                    } else {
                        if (value_a < ((value_b as unknown) as number)) result = -1
                        if (value_a > ((value_b as unknown) as number)) result = 1
                    }
                }

                if (result != 0)
                    return result
            }
            return 0
        }
        this.cm.sort(_sort)
        this.requestUpdate();
    }

    stateChanged(state: State) {
        if (this.fetch_error) {
            return
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
            this.term_for_cm = getStandardTerm(state.constants,
                "standard_term_for_cm", false, this.term_for_cm)
            this.plural_for_cm = getStandardTerm(state.constants,
                "standard_term_for_cm", true, this.term_for_cm)
            console.log("standard term for cm is", this.term_for_cm, this.plural_for_cm)
            for (let i = 0; i < state.constants.length; i++) {
                let constant = state.constants[i]
                if (constant["path"] === "constants/collected_material_types")
                    this.cm_types[constant.key] = constant.value
            }
            console.log('cm_types:')
            console.log(this.cm_types)


        }
    }

    apiRender() {
        return html`
                    <div class="cm-widget">
                        <div class="headline">
                            <p>${this.cmCount} ${this.cmCount == 1?this.term_for_cm:this.plural_for_cm}</p>
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

    protected render_widget() {
        if (!this.selected_date) {
            return html`please select a date`
        }
        if (this.fetching)
            return html`fetching data ...`
        else {
            if (this.cmCount == 0) {
                return html`
                    <div class="no-data">
                        <p>No data found for your selection</p>
                    </div>`
            } else {
                return html`
                <div class="cm-list ${this.selected_member ? undefined: 'cm-list-with-member'}">
                    <div class="list-header">identifier</div>
                    <div class="list-header">material</div>
                    <div class="list-header">creation</div>
                    <div class="list-header">description?</div>
                    <div class="list-header">type</div>
                    <div class="list-header">lot?</div>
                    <div class="list-header">photos</div>
                    ${this.selected_member ? undefined : html`<div class="list-header">by</div>`}
                    ${this.cm.map((el: CMRecord) =>
                    html`
                        <div>
                            ${this.selected_context ? undefined : html`${el.unitId}/`}${el.identifier}
                        </div>
                        <div>${el.type}</div>
                        <div>${el.cm_creation}</div>
                        <div class="center-col">${el.hasDescription
                                ?html`                                
                                    <i class="fa fa-check"></i>
                                `:undefined}</div>
                        <div>${el.cm_type}</div>
                        <div class="center-col">${el.lot
                                ?html`                                
                                    <i class="fa fa-check"></i>
                                `:undefined}</div>
                        <div class="center-col">${el.photoCount}</div>
                        ${this.selected_member ? undefined : html`<div class="center-col">${el.modified_by}</div>`}
                                `
                )}
                </div>`
            }
        }
    }

}