import { html, LitElement, unsafeCSS } from "lit";
import {customElement} from 'lit/decorators.js'

import { createPopper } from '@popperjs/core';
import local_css from '../styles/component-locus-widget.sass?inline';
import {State} from "../store/reducer";
import {StoreContextSelector, StoreDateSelector, StoreTeamSelector} from '../store/actions';
import { FetchException} from "@arch-kiosk/kiosktsapplib"
import {
    fromSqlDate,
    getSqlDate, getStandardTerm,
    handleCommonFetchErrors,
} from "../lib/applib";
import { KioskStoreAppComponent } from "../../kioskapplib/kioskStoreAppComponent"

class LocusRecord {
    identifier: string
    type: string
    locus_creation: string
    created: number
    modified: number
    modified_by: string
    unitId: string
    hasInterpretation: boolean
    hasDescription: boolean
    relationsCount: number
    photoCount: number
    lotCount: number
    record_type: string
    qc_messages: any[]
    max_severity: string
}

@customElement('locus-widget')
class LocusWidget extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);

    selected_date: Date = null
    selected_context: string = ""
    selected_context_uid: string = ""
    selected_member: string = ""
    loci: { [key: string]: LocusRecord } = {}
    lociList: Array<LocusRecord> = []
    fetching: boolean = false
    fetch_error: string = ""
    locusCount: number = 0
    selected_sort: string = "identifier"
    term_for_locus: string = "locus"
    term_for_loci: string = "loci"
    poppers: Map<string, any> = null

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
        term_for_locus: {type: String}
    }

    constructor() {
        super();
    }


    get_conditions(us_date: string, identifier: string, member: string): string {
        let sql = `modified_date = '${us_date}' and coalesce(type,'') <> 'su'`
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
            primary_identifier, identifier, nointerpretation, nodescription, created, modified_by, modified_date,
            date_defined, record_type, type, primary_identifier_uuid qc_data_context, count(data_uuid) c 
            from {base} where ${this.get_conditions(us_date, this.selected_context, this.selected_member)}  
            group by primary_identifier, identifier, nointerpretation, nodescription, created, modified_by, 
            modified_date, date_defined, record_type, type, primary_identifier_uuid         
        `
        const cql = {
            "cql": {
                "base": {
                    "scope": {
                        "unit": {
                            "locus": {
                                "locus_relations": {},
                                "lot": {},
                                "locus_photo": {},
                                // "collected_material": {}
                            }
                        }
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
                            "field_or_instruction": "locus.replfield_created()",
                            "default": "null",
                            "format": "datetime(date)"
                        },
                        "date_defined": {
                            "field_or_instruction": "locus.date_defined",
                            "default": "null",
                            "format": "datetime(date)"
                        },
                        "type": {
                            "field_or_instruction": "locus.type",
                            "default": "null",
                        },
                        "nointerpretation": {
                            "field_or_instruction": "locus.interpretation",
                            "default": "true",
                            "format": "isempty()"
                        },
                        "nodescription": {
                            "field_or_instruction": "locus.description",
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
                caller: "locuswidget.fetch_data",
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
            handleCommonFetchErrors(this, e, "locusWidget.fetch_data", null)
        })
    }

    get_locus_qc_messages(qc_messages: [], locus_uid: string) {
        let rc_messages: any[] = []
        for (const msg of qc_messages) {
            if (msg["data_context"] == locus_uid)
                rc_messages.push(msg)
        }
        return rc_messages
    }

    get_max_qc_severity(qc_messages:any[]) {
        let max_severity = ""

        for (const msg of qc_messages) {
            const severity = msg["severity"]
            if (severity.startsWith("err")) {
                return "error"
            }
            if (severity.startsWith("warn")) {
                max_severity = "warning"
            }
            else if (severity == "hint" && max_severity != "warning") {
                max_severity = "hint"
            }
        }
        return max_severity
    }

    load_records(records: [], qc_messages: []) {
        this.loci = {}
        this.lociList = []
        console.log('qc_messages:', qc_messages)
        records.forEach((r: any) => {
            const locusId = r.primary_identifier
            let locus: LocusRecord

            if (r.record_type != "unit") {
                if (locusId in this.loci)
                    locus = this.loci[locusId]
                else {
                    locus = new LocusRecord()
                    this.loci[locusId] = locus
                    this.lociList.push(locus)
                    locus.photoCount = 0
                    locus.lotCount = 0
                    locus.type = "?"
                    locus.hasDescription = false
                    locus.hasInterpretation = false
                    locus.relationsCount = 0
                    locus.record_type = ""
                    locus.modified = 0
                    locus.locus_creation = "?"
                    locus.max_severity = ""
                    locus.qc_messages = []
                }
                // console.log(r)
                locus.identifier = r.primary_identifier
                locus.unitId = r.identifier
                locus.record_type = r.record_type
                if (r.modified > locus.modified)
                    locus.modified = r.modified
                    locus.modified_by = r.modified_by

                // if (r.modified_by) locus.modified_by = r.modified_by ? r.modified_by : "?"
                if (r.type) locus.type = r.type
                if (r.date_defined) {
                    locus.locus_creation = fromSqlDate(r.date_defined).toLocaleDateString()
                }
                if (r.created) {
                    locus.created = fromSqlDate(r.created).getTime()
                }

                //wrap this in the if to show only changes from that day
                //if the if is deactivated the current state of the locus record is shown
                // see #908
                if (!r.nodescription) locus.hasDescription = true
                if (!r.nointerpretation) locus.hasInterpretation = true
                if (qc_messages.length > 0 && locus.qc_messages.length == 0) {
                    locus.qc_messages = this.get_locus_qc_messages(qc_messages, r.qc_data_context)
                    locus.max_severity = ""
                    if (locus.qc_messages.length > 0) locus.max_severity = this.get_max_qc_severity(locus.qc_messages)
                    console.log(locus)
                }
                if (r.record_type == "locus_photo") {
                    locus.photoCount = r.c
                }
                if (r.record_type == "locus_relations") {
                    locus.relationsCount = r.c
                }
                if (r.record_type == "lot") {
                    locus.lotCount = r.c
                }
            }
        })
        this.locusCount = Object.keys(this.loci).length
        this.sort_records(this.sort_by[this.selected_sort])
    }

    sort_records(sort_by: Array<string>) {
        function _sort(a: LocusRecord, b: LocusRecord): number {
            for (let i = 0; i < sort_by.length; i++) {
                let attrib: string = sort_by[i];
                let value_a = a[attrib as keyof LocusRecord]
                let value_b = b[attrib as keyof LocusRecord]
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
        this.lociList.sort(_sort)
        this.requestUpdate();
    }

    stateChanged(state: State) {
        // console.log("locusWidget.state_changed triggered")
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
                    changed = true
                }
            }
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
            this.term_for_locus = getStandardTerm(state.constants,
                "standard_term_for_loci", false, this.term_for_locus)
            this.term_for_loci = getStandardTerm(state.constants,
                "standard_term_for_loci", true, this.term_for_loci)
        }
    }

    showQcMessages(event: MouseEvent) {
        const el = <HTMLElement>event.target
        console.log(el);
        const tooltip = <HTMLElement>el.nextElementSibling
        const tip_id = el.getAttribute("tip-id")
        console.log(tip_id)
        const popper = this.poppers.get(tip_id)
        popper.update()
        tooltip.setAttribute("data-show", "")
        tooltip.addEventListener("blur", () => {tooltip.removeAttribute("data-show")})
        tooltip.addEventListener("mouseleave", () => {tooltip.removeAttribute("data-show")})
        tooltip.addEventListener("click", () => {tooltip.removeAttribute("data-show")})
    }

    apiRender() {
        return html`
                    <div class="locus-widget">
                        <div class="headline">
                            <p>${this.locusCount} ${this.locusCount == 1?this.term_for_locus:this.term_for_loci}</p>
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

    protected renderQCMessages(locus: LocusRecord) {
        console.log(locus.qc_messages)
        return html`
            <div class="qc-message-view">
                <p>recording quality for ${locus.identifier}</p>
                ${locus.qc_messages.map( (msg) => html`
                    <p class="qc-message ${msg.severity}">
                        <i class="fa fa-exclamation-circle ${msg.severity}"></i>${msg.message}
                    </p>
                `)}
            </div>    
                
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
            if (this.locusCount == 0) {
                return html`
                    <div class="no-loci">
                        <p>No data found for your selection</p>
                    </div>`
            } else {
                return html`
                <div class="locus-list ${this.selected_member ? undefined: 'locus-list-with-member'}">
                    <div class="list-header">identifier</div>
                    <div class="list-header">type</div>
                    <div class="list-header">lots</div>
                    <div class="list-header">creation</div>
                    <div class="list-header">description?</div>
                    <div class="list-header tighter">interpre-tation?</div>
                    <div class="list-header">relations</div>
                    <div class="list-header">photos</div>
                    ${this.selected_member ? undefined : html`<div class="list-header">by</div>`}
                    ${this.lociList.map((locus: LocusRecord) =>
                    html`
                        <div class="identifier-col">
                            ${this.selected_context ? undefined : html`${locus.unitId}/`}${locus.identifier}
                            ${locus.max_severity != ''
                                ?html`                                
                                    <i class="fa fa-exclamation-circle ${locus.max_severity} tooltip-button" 
                                       tip-id="${locus.identifier}" 
                                       @click="${this.showQcMessages}">
                                    </i>
                                    <div class="tooltip">
                                        ${this.renderQCMessages(locus)}
                                    </div>
                                `:undefined} 
                        </div>
                        <div>${locus.type}</div>
                        <div class="center-col">${locus.lotCount}</div>
                        <div>${locus.locus_creation}</div>
                        <div class="center-col">${locus.hasDescription
                                ?html`                                
                                    <i class="fa fa-check"></i>
                                `:undefined}</div>
                        <div class="center-col">${locus.hasInterpretation
                                ?html`                                
                                    <i class="fa fa-check"></i>
                                `:undefined}</div>
                        <div class="center-col">${locus.relationsCount}</div>
                        <div class="center-col">${locus.photoCount}</div>
                        ${this.selected_member ? undefined : html`<div class="center-col">${locus.modified_by}</div>`}
                    `
                    )}
                </div>
                `
            }
        }
    }

    public updated(_changedProperties: any) {
        super.updated(_changedProperties);
        const elements = this.shadowRoot.querySelectorAll(".tooltip-button")
        this.poppers = new Map()
        for (const el of elements) {

            const popperInstance = createPopper(el, <HTMLElement>el.nextElementSibling, {
                placement: "right",
                modifiers: [
                    {
                        name: "offset",
                        options: {
                            offset: [0, 8]
                        }
                    }
                ]});
            this.poppers.set(el.getAttribute("tip-id"), popperInstance)
        }
        // if (this.editing !== "") {
        //     this.shadowRoot.getElementById("edit-list").focus();
        // }
    }

}