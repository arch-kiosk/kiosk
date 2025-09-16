import { html, LitElement, unsafeCSS } from "lit";
import {customElement} from 'lit/decorators.js'

import local_css from '../styles/component-archival-entity-widget.sass?inline';
import {State} from "../store/reducer";
import {StoreContextSelector, StoreDateSelector, StoreTeamSelector} from '../store/actions';
import { FetchException} from "@arch-kiosk/kiosktsapplib"
import {
    fromSqlDate,
    getSqlDate, getStandardTerm,
    handleCommonFetchErrors,
} from "../lib/applib";
import { KioskStoreAppComponent } from "../../kioskapplib/kioskStoreAppComponent"
import {DateTime} from "luxon"

class ArchivalEntityRecord {
    identifier: string
    type: string
    created: number
    modified: number
    modified_by: string
    hasDescription: boolean
    activityCount: number
    fileCount: number
    record_type: string
}

@customElement('archival-entity-widget')
class ArchivalEntityWidget extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);

    selected_date: Date = null
    selected_member: string = ""
    archivalEntities: { [key: string]: ArchivalEntityRecord } = {}
    archivalEntityList: Array<ArchivalEntityRecord> = []
    fetching: boolean = false
    fetch_error: string = ""
    archivalEntityCount: number = 0
    selected_sort: string = "identifier"
    termForArchivalEntity: string = "archival entity"
    termForArchivalEntityPlural: string = "archival entities"

    sort_by: { [key: string]: Array<string> }= {
        "identifier": ["identifier", "modified"],
        "creation": ["created", "identifier"]
    }

    static properties = {
        ...super.properties,
        selected_context: {type: String},
        selected_date: {type: Date},
        selected_member: {type: String},
        fetching: {type: Boolean},
        sort_by: {type: Array},
        termForArchivalEntity: {type: String}
    }

    constructor() {
        super();
    }


    get_conditions(us_date: string, member: string): string {
        let sql = `modified_date = '${us_date}' and coalesce(type,'') <> 'su'`
        if (member) {
            if (member) sql = sql + ` and modified_by ='${member}'`
        }
        return sql
    }

    fetch_data() {
        this.fetching = true
        const us_date = getSqlDate(this.selected_date)
        const sql = `
            primary_identifier, identifier, nodescription, created, modified_by, modified_date, modified_timestamp,
            record_type, type, count(data_uuid) c 
            from {base} where ${this.get_conditions(us_date, this.selected_member)}  
            group by primary_identifier, identifier, nodescription, created, modified_by, 
            modified_date, modified_timestamp, record_type, type         
        `
        const cql = {
            "cql": {
                "base": {
                    "scope": {
                        "archival_entity": "browse()"
                    },
                    "target": {
                        "field_or_instruction": "modified_ww()"
                    },
                    "additional_fields": {
                        "modified_date": {
                            "field_or_instruction": "modified_ww()",
                            "default": "",
                            "format": "datetime(date)"
                        },
                        "modified_by": {
                            "field_or_instruction": "replfield_modified_by()",
                            "default": "",
                        },
                        "modified_timestamp": {
                            "field_or_instruction": "modified_ww()",
                            "default": "",
                        },
                        "created": {
                            "field_or_instruction": "archival_entity.replfield_created()",
                            "default": "null",
                            "format": "datetime(date)"
                        },
                        "date_defined": {
                            "field_or_instruction": "archival_entity.date_defined",
                            "default": "null",
                            "format": "datetime(date)"
                        },
                        "type": {
                            "field_or_instruction": "archival_entity.type",
                            "default": "null",
                        },
                        "nodescription": {
                            "field_or_instruction": "archival_entity.description",
                            "default": "true",
                            "format": "isempty()"
                        }

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

        let searchParams = new URLSearchParams({
            page_size: "-1",
            "qc_data_context": "qc_data_context"
        })
        this.apiContext.fetchFromApi("", "cql/query",
            {
                method: "POST",
                caller: "archivalentitywidget.fetch_data",
                body: JSON.stringify(cql),
            },"v1", searchParams
        )
        .then((data: any) => {
            if (data.result_msg !== "ok") {
                this.fetch_error = data.result_msg
            } else {
                this.fetch_error = ""
                this.load_records(data.records, data.qc_messages)
            }

            this.fetching = false
        })
        .catch((e: FetchException) => {
            handleCommonFetchErrors(this, e, "archivalEntityWidget.fetch_data", null)
        })
    }

    load_records(records: [], qc_messages: []) {
        this.archivalEntities = {}
        this.archivalEntityList = []

        records.forEach((r: any) => {
            const aeId = r.primary_identifier
            let ae: ArchivalEntityRecord
            if (r.record_type != "unit") {
                if (this.archivalEntities.hasOwnProperty(aeId))
                    ae = this.archivalEntities[aeId]
                else {
                    ae = new ArchivalEntityRecord()
                    this.archivalEntities[aeId] = ae
                    this.archivalEntityList.push(ae)
                    ae.fileCount = 0
                    ae.type = "?"
                    ae.hasDescription = false
                    ae.activityCount = 0
                    ae.record_type = ""
                    ae.modified = 0
                }
                // console.log(r)
                ae.identifier = r.primary_identifier
                ae.record_type = r.record_type
                const modified = DateTime.fromISO(r.modified_timestamp).toMillis()
                if (modified > ae.modified) {
                    ae.modified = modified
                    ae.modified_by = r.modified_by;
                }

                if (r.type) ae.type = r.type

                if (r.created) {
                    ae.created = DateTime.fromSQL(r.created).toMillis()
                }

                if (!r.nodescription) ae.hasDescription = true

                if (r.record_type == "archival_entity_file") {
                    ae.fileCount = r.c
                }
                if (r.record_type == "archival_entity_activity") {
                    ae.activityCount = r.c
                }
            }
        })
        this.archivalEntityCount = Object.keys(this.archivalEntities).length
        this.sort_records(this.sort_by[this.selected_sort])
    }

    sort_records(sort_by: Array<string>) {
        function _sort(a: ArchivalEntityRecord, b: ArchivalEntityRecord): number {
            for (let i = 0; i < sort_by.length; i++) {
                let attrib: string = sort_by[i];
                let value_a = a[attrib as keyof ArchivalEntityRecord]
                let value_b = b[attrib as keyof ArchivalEntityRecord]
                let result: number = 0

                if (typeof (value_a) === "string") {
                    result = (<string>value_a).localeCompare((<string>value_b))
                } else {
                    if (value_a < value_b) result = -1
                    if (value_a > value_b) result = 1
                }

                if (result != 0)
                    return result
            }
            return 0
        }
        // console.log(`sorting loci by ${this.sort_by[this.selected_sort]}`)
        this.archivalEntityList.sort(_sort)
        this.requestUpdate();
    }

    stateChanged(state: State) {
        // console.log("Widget.state_changed triggered")
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
            // if ("contextSelector" in state.selectors) {
            //     let stateContext: string = (<StoreContextSelector>state.selectors["contextSelector"]).selectedContext
            //     if (stateContext !== this.selected_context) {
            //         this.selected_context = stateContext
            //         this.selected_context_uid = (<StoreContextSelector>state.selectors["contextSelector"]).selectedUid
            //         changed = true
            //     }
            // }
            if ("teamSelector" in state.selectors) {
                let stateMember: string = (<StoreTeamSelector>state.selectors["teamSelector"]).selectedMember
                if (stateMember !== this.selected_member) {
                    // console.log(`narrative widget: new selected member ${stateMember}`)
                    this.selected_member = stateMember
                    changed = true
                }
            }
            if (changed) this.fetch_data()
        }
        if (state.constants.length > 0) {
            this.termForArchivalEntity = getStandardTerm(state.constants,
                "standard_term_for_archival_entity", false, this.termForArchivalEntity)
            this.termForArchivalEntityPlural = getStandardTerm(state.constants,
                "standard_term_for_archival_entity", true, this.termForArchivalEntityPlural)
        }
    }

    apiRender() {
        return html`
                    <div class="ae-widget">
                        <div class="headline">
                            <p>${this.archivalEntityCount} ${this.archivalEntityCount == 1?this.termForArchivalEntity:this.termForArchivalEntityPlural}</p>
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
        // console.log("rendering loci")
        if (!this.selected_date) {
            return html`please select a date`
        }
        if (this.fetching)
            return html`fetching data ...`
        else {
            if (this.archivalEntityCount == 0) {
                return html`
                    <div class="no-loci">
                        <p>No data found for your selection</p>
                    </div>`
            } else {
                return html`
                <div class="ae-list ae-list-with-member'}">
                    <div class="list-header">identifier</div>
                    <div class="list-header">type</div>
                    <div class="list-header">creation</div>
                    <div class="list-header">description?</div>
                    <div class="list-header">activities</div>
                    <div class="list-header">photos</div>
                    ${this.selected_member ? html`<div class="list-header">at</div>` : html`<div class="list-header">by</div>`}
                    ${this.archivalEntityList.map((ae: ArchivalEntityRecord) =>
                    html`
                        <div class="identifier-col">
                            ${ae.identifier}
                        </div>
                        <div>${ae.type}</div>
                        <div>${DateTime.fromMillis(ae.created).toLocaleString()}</div>
                        <div class="center-col">${ae.hasDescription
                                ?html`                                
                                    <i class="fa fa-check"></i>
                                `:undefined}</div>
                        <div class="center-col">${ae.activityCount}</div>
                        <div class="center-col">${ae.fileCount}</div>
                        ${this.selected_member 
                            ?html`<div class="center-col">${DateTime.fromMillis(ae.modified).toLocaleString({timeStyle: "short"})}</div>`  
                            :html`<div class="center-col">${ae.modified_by} (${DateTime.fromMillis(ae.modified).toLocaleString({timeStyle: "short"})})</div>`}
                    `
                    )}
                </div>
                `
            }
        }
    }

    // public updated(_changedProperties: any) {
    //     super.updated(_changedProperties);
    //     const elements = this.shadowRoot.querySelectorAll(".tooltip-button")
    //     // if (this.editing !== "") {
    //     //     this.shadowRoot.getElementById("edit-list").focus();
    //     // }
    // }

}