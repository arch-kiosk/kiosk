import { html, LitElement} from "lit";
import {customElement} from 'lit/decorators.js'
import local_css from '../styles/component-narrative-widget.sass?inline';
import {State} from "../store/reducer";
import {StoreContextSelector, StoreDateSelector, StoreTeamSelector} from '../store/actions';
import { FetchException} from "@arch-kiosk/kiosktsapplib"

import {
    getRecordTypeNames,
    getSqlDate,
    handleCommonFetchErrors,
    name2RecordType,
    recordType2Name
// @ts-ignore
} from "../lib/applib.ts";

import { KioskStoreAppComponent } from "../../kioskapplib/kioskStoreAppComponent"

import { unsafeCSS } from "lit";

class NarrativeRecord {
    identifier: string
    domain_identifier: string
    modified_by: string
    narrative: string
    modified: Date
    record_type: string
}

@customElement('narrative-widget')
class NarrativeWidget extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);

    selected_date: Date = null
    selected_context: string = ""
    selected_member: string = ""
    narratives: Array<NarrativeRecord> = []
    fetching: boolean = false
    fetch_error: string = ""
    record_types: Set<string> = new Set()
    show_record_types: string = ""
    record_type_names: { [key: string]: string } = null

    sort_by = ["domain_identifier", "identifier", "modified"]

    static properties = {
        ...super.properties,
        selected_context: {type: String},
        selected_date: {type: Date},
        selected_member: {type: String},
        fetching: {type: Boolean},
        sort_by: {type: Array},
        show_record_types: {type: String}
    }
    private record_count: number = 0;
    private page_size: number = 0;

    constructor() {
        super();
    }

    get_conditions(us_date: string, identifier: string, member: string) {
        if (identifier || member) {
            let conditions = [`equals(modified_date, ${us_date})`]
            if (identifier) conditions.push(`equals(domain_identifier, '${identifier}')`)
            if (member) conditions.push(`equals(modified_by, '${member}')`)
            return {
                "AND": conditions
            }
        } else
            return {
                "?": `equals(modified_date, ${us_date})`
            }
    }

    fetch_data() {
        this.fetching = true
        const us_date = getSqlDate(this.selected_date)
        // let searchParams = new URLSearchParams({
        //     page_size: "100"
        // })
        this.apiContext.fetchFromApi("", "cql/query",
            {
                method: "POST",
                caller: "narrativewidget.fetch_data",
                body: JSON.stringify({
                        "cql": {
                            "base": {
                                "scope": {
                                    "unit": {
                                        "unit_narrative": {
                                            "join": "inner(uid, uid_unit)"
                                        },
                                        "locus": {
                                            "collected_material": {}
                                        }
                                    }
                                },
                                "target": {
                                    "field_or_instruction": "record_description()"
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
                                        "field_or_instruction": "modified",
                                        "default": "",
                                    },
                                    "id_excavator": {
                                        "field_or_instruction": "replfield_modified_by()",
                                        "default": ""
                                    }
                                }
                            },
                            "meta": {
                                "version": 0.1
                            },
                            "query": {
                                "columns": {
                                    "domain_identifier": {
                                        "source_field": "identifier"
                                    },
                                    "identifier": {
                                        "source_field": "primary_identifier"
                                    },
                                    "modified_date": {
                                        "source_field": "modified_date"
                                    },
                                    "modified_timestamp": {
                                        "source_field": "modified_timestamp"
                                    },
                                    "modified_by": {
                                        "source_field": "id_excavator"
                                    },
                                    "record_type": {
                                        "source_field": "record_type"
                                    },
                                    "narrative": {
                                        "source_field": "data"
                                    }
                                },
                                "conditions": this.get_conditions(us_date, this.selected_context, this.selected_member),
                                "distinct": "True",
                                "type": "Raw"
                            }
                        }
                    }
                ),
            },"v1"
        )
            .then((data: any) => {
                if (data.result_msg !== "ok") {
                    this.fetch_error = data.result_msg
                } else {
                    this.fetch_error = ""
                    this.record_count = data.overall_record_count
                    this.page_size = data.page_size
                    this.load_narratives(data.records)
                }

                this.fetching = false

            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this, e, "narrativeWidget.fetch_data", null)
            })
    }

    load_narratives(records: []) {
        this.narratives = []
        records.forEach((r: any) => {
            let narrative = new NarrativeRecord()
            narrative.identifier = r.identifier
            narrative.domain_identifier = r.domain_identifier
            narrative.modified_by = r.modified_by ? r.modified_by : "?"
            narrative.modified = new Date(r.modified_timestamp)
            narrative.narrative = r.narrative
            narrative.record_type = r.record_type
            this.record_types.add(narrative.record_type)
            // console.log(`added record type ${narrative.record_type}`)
            this.narratives.push(narrative)
        })
        this.sort_records(this.sort_by)
    }

    sort_records(sort_by: Array<string>) {
        function _sort(a: NarrativeRecord, b: NarrativeRecord): number {
            for (let i = 0; i < sort_by.length; i++) {
                let attrib: string = sort_by[i];
                let value_a = a[attrib as keyof NarrativeRecord]
                let value_b = b[attrib as keyof NarrativeRecord]
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

        this.narratives.sort(_sort)
        this.requestUpdate();
    }

    // protected changeContext(context: string) {
    //     store.dispatch(setSelector("contextSelector", {"selectedContext": context}))
    // }

    stateChanged(state: State) {
        // console.log("narrativeWidget.state_changed triggered")
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
        if (state.constants.length > 0 && !this.record_type_names) {
            this.record_type_names = getRecordTypeNames(state.constants)
            if (!changed) this.requestUpdate()
        }
    }

    apiRender() {
        const filteredCount = this.narratives.filter(x => (this.show_record_types === "" || x.record_type === this.show_record_types)).length
        return html`
                    <div class="narrative-widget">
                        <div class="headline">
                            <p>${filteredCount} ${this.record_count?' of ' + this.record_count:undefined} Narrative(s)</p>
                        </div>
                        <div class="controls">
                            <div class="controls-left">
                                ${this.renderRecordTypeSelector()}
                            </div>
                        </div>
                        ${this.selected_date !== null
                                ? this.render_widget()
                                : html`Please select a date`}
                    </div>`
    }

    renderRecordTypeSelector() {
        if (!this.selected_date)
            return html``
        let record_types = Array.from(this.record_types)
        record_types.push(" all")
        record_types.sort()
        let selected = this.show_record_types == "" ? " all" : this.show_record_types
        return html`
            <label for="record-type-selector">record type</label>
            <select name="record-type-selector" id="record-type-selector" @change="${this.recordTypeChanged}">
                ${record_types.map(record_type => html`
                            <option value="${record_type}"
                                    ?selected="${(selected === record_type)}">
                                ${recordType2Name(this.record_type_names, record_type)}
                            </option>
                        `
                )}
            </select>
        `
    }

    protected recordTypeChanged(e: Event) {
        // @ts-ignore
        const value = e.currentTarget.value
        if (value === " all") {
            this.show_record_types = ""
        } else {
            this.show_record_types = value
        }
    }

    protected render_widget() {
        if (!this.selected_date) {
            return html`please select a date`
        }
        if (this.fetching)
            return html`fetching data ...`
        else {
            if (this.narratives.length == 0) {
                return html`
                    <div class="no-narratives">
                        <p>No narratives found for your selection</p>
                    </div>`
            }
            return html`
                <div class="narrative-list">
                    ${this.narratives.map(narrative =>
                            html`${(this.show_record_types === "" || narrative.record_type === this.show_record_types)
                                    ? html`
                                        <div class="narrative">
                                            ${this.show_record_types === ''
                                                    ? html`
                                                        <div class="narrative-headline">
                                                            <p>
                                                                ${recordType2Name(this.record_type_names, narrative.record_type)}</p>
                                                        </div>`
                                                    : undefined}
                                            <div class="narrative-headline">
                                                <p>
                                                    ${this.selected_context ? undefined : html`${narrative.domain_identifier}/`}
                                                    ${narrative.identifier}</p>
                                                <p>by: ${narrative.modified_by}
                                                        (${narrative.modified.toLocaleTimeString([],
                                                            {hour: '2-digit', minute: '2-digit'})})</p>
                                            </div>
                                            <div class="narrative-body">
                                                ${narrative.narrative}
                                            </div>
                                        </div>`
                                    : undefined}`
                    )}
                </div>`
        }
    }
}