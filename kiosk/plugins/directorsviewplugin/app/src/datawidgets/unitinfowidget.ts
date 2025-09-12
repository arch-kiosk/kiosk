import { html, LitElement} from "lit";
import {customElement} from 'lit/decorators.js'
import local_css from '../styles/component-unit-info-widget.sass?inline';
import {State} from "../store/reducer";
import {StoreContextSelector, StoreDateSelector, StoreTeamSelector} from '../store/actions';
import {FetchException} from "@arch-kiosk/kiosktsapplib"
import {
    fromSqlDate, getRecordTypeNames,
    getSqlDate, getStandardTerm,
    handleCommonFetchErrors,
//@ts-ignore
} from "../lib/applib.ts";
import { unsafeCSS } from "lit";
import { KioskStoreAppComponent } from "../../kioskapplib/kioskStoreAppComponent"
class UnitRecord {
    identifier: string
    type: string
    method: string
    created: number
    unit_creation: string
    modified: number
    id_excavator: string
    id_site: string
    purpose: string
}

@customElement('unit-info-widget')
class UnitInfoWidget extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);

    selected_date: Date = null
    selected_context: string = ""
    selected_context_uid: string = ""
    units: Array<UnitRecord> = []
    // lociList: Array<LocusRecord> = []
    fetching: boolean = false
    fetch_error: string = ""
    unitCount: number = 0
    term_for_unit: string = "unit"
    term_for_supervisor: string = "supervisor"
    selected_sort: string = "identifier"

    sort_by: { [key: string]: Array<string> }= {
        "identifier": ["identifier", "modified"],
        "creation": ["created", "identifier"]
    }


    constructor() {
        super();
    }

    static properties = {
        ...super.properties,
        selected_context: {type: String},
        selected_date: {type: Date},
        fetching: {type: Boolean},
        sort_by: {type: Array},
        term_for_unit: {type: String},
        term_for_supervisor: {type: String}
    }

    get_conditions(identifier: string): string {
        let sql = ` identifier = '${identifier}'`
        return sql
    }

    fetch_data() {

        this.fetching = true
        const sql = `
            primary_identifier, identifier, id_site, id_excavator, purpose, created, unit_creation_date, modified_by, modified_date, type, method 
            from {base} where ${this.get_conditions(this.selected_context)}  
        `
        const cql = {
            "cql": {
                "base": {
                    "scope": {
                        "unit": {}
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
                            "field_or_instruction": "replfield_created()",
                            "default": "null",
                            "format": "datetime(date)"
                        },
                        "type": {
                            "field_or_instruction": "type",
                            "default": "null",
                        },
                        "method": {
                            "field_or_instruction": "method",
                            "default": "null",
                        },
                        "purpose": {
                            "field_or_instruction": "purpose",
                            "default": "null",
                        },
                        "unit_creation_date": {
                            "field_or_instruction": "unit_creation_date",
                            "default": "null",
                        },
                        "id_site": {
                            "field_or_instruction": "id_site",
                            "default": "null",
                        },
                        "id_excavator": {
                            "field_or_instruction": "id_excavator",
                            "default": "null",
                        }
                    },
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
        debugger;
        console.log(cql)
        this.apiContext.fetchFromApi("", "cql/query",
            {
                method: "POST",
                caller: "unit-info-widget.fetch_data",
                body: JSON.stringify(cql),
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
                handleCommonFetchErrors(this, e, "unit-info-widget.fetch_data", null)
            })
    }

    load_records(records: []) {
        this.units = []
        let unitDict: { [key: string]: UnitRecord } = {}

        records.forEach((r: any) => {
            const unitId = r.primary_identifier
            let unit: UnitRecord

            if (unitId in unitDict)
                unit = unitDict[unitId]
            else {
                unit = new UnitRecord()
                unitDict[unitId] = unit
                this.units.push(unit)
                unit.id_excavator = ""
                unit.purpose = ""
                unit.id_site = "?"
                unit.method = "?"
                unit.type = "?"
                unit.modified = 0
                unit.created = 0
                unit.unit_creation = "?"
            }
            // console.log(r)
            unit.identifier = r.primary_identifier
            if (r.modified > unit.modified)
                unit.modified = r.modified
            if (r.unit_creation_date) {
                unit.unit_creation = fromSqlDate(r.unit_creation_date).toLocaleDateString()
            }

            // if (r.modified_by) locus.modified_by = r.modified_by ? r.modified_by : "?"
            if (r.type) unit.type = r.type
            if (r.method) unit.method = r.method
            if (r.id_site) unit.id_site = r.id_site
            if (r.id_excavator) unit.id_excavator = r.id_excavator
            if (r.purpose) unit.purpose = r.purpose

            if (r.created) {
                unit.created = fromSqlDate(r.created).getTime()
            }
        })
        this.unitCount = Object.keys(this.units).length
        // this.sort_records(this.sort_by[this.selected_sort])
    }

    // sort_records(sort_by: Array<string>) {
    //     function _sort(a: UnitRecord, b: UnitRecord): number {
    //         for (let i = 0; i < sort_by.length; i++) {
    //             let attrib: string = sort_by[i];
    //             let value_a = a[attrib as keyof UnitRecord]
    //             let value_b = b[attrib as keyof UnitRecord]
    //             let result: number = 0
    //
    //             if (typeof (value_a) === "string") {
    //                 result = (<string>value_a).localeCompare((<string>value_b))
    //             } else {
    //                 if (value_a < value_b) result = -1
    //                 if (value_a > value_b) result = 1
    //             }
    //
    //             if (result != 0)
    //                 return result
    //         }
    //         return 0
    //     }
    //     // console.log(`sorting loci by ${this.sort_by[this.selected_sort]}`)
    //     this.units.sort(_sort)
    //     this.requestUpdate();
    // }

    // protected changeContext(context: string) {
    //     store.dispatch(setSelector("contextSelector", {"selectedContext": context}))
    // }

    stateChanged(state: State) {
        console.log('state', state)
        if (this.fetch_error) {
            return html`Error fetching: ${this.fetch_error}`
        }
        if (state.initState == 0)
            return

        let changed = false

        if (state.selectors.hasOwnProperty("contextSelector")) {
            let stateContext: string = (<StoreContextSelector>state.selectors["contextSelector"]).selectedContext
            if (stateContext !== this.selected_context) {
                this.selected_context = stateContext
                this.selected_context_uid = (<StoreContextSelector>state.selectors["contextSelector"]).selectedUid
                changed = true
            }
        }
        if (changed) this.fetch_data()
        // if (state.constants.length > 0 && !this.record_type_names) {
        //     this.record_type_names = getRecordTypeNames(state.constants)
        //     this.requestUpdate().then(r => {
        //     })
        // }
        if (state.constants.length > 0) {
            this.term_for_unit = getStandardTerm(state.constants,
                "label_for_unit_on_start_page", false, this.term_for_unit).replace("\r", " or ")
            this.term_for_supervisor = getStandardTerm(state.constants, "label_supervisor",
                false, this.term_for_supervisor)
        }
    }

    get_unit_term() {
        return this.term_for_unit
    }

    apiRender() {
        return html`
            <div class="unit-info-widget">
                <div class="headline">
                    ${!this.selected_context
                    ?html`<p>Please select a ${this.get_unit_term()} to see its information</p>`
                    :undefined}
                    ${this.unitCount == 1
                    ?html`<p>information for ${this.units[0].identifier}</p>`
                    :undefined}
                </div>            
                ${this.unitCount == 1
                        ? this.render_widget()
                        : html`<p></p>`}
            </div>`
    }

    protected render_widget() {
        // console.log("rendering loci")
        if (this.fetching)
            return html`fetching data ...`
        else {
            if (this.unitCount == 0) {
                return html`
                    <div class="no-loci">
                        <p>No data found for your selection</p>
                    </div>`
            } else {
                return html`
                <div class="unit-list">
                    <div class="list-header">site</div>
                    <div class="list-header">creation</div>
                    <div class="list-header">type</div>
                    <div class="list-header">method</div>
                    <div class="list-header">${this.term_for_supervisor}</div>
                    <div class="list-header">purpose</div>
                    ${this.units.map((unit: UnitRecord) =>
                    html`
                        <div>${unit.id_site}</div>
                        <div>${unit.unit_creation}</div>
                        <div>${unit.type}</div>
                        <div>${unit.method}</div>
                        <div>${unit.id_excavator}</div>
                        <div>${unit.purpose}</div>`
                )}
                </div>`
            }
        }
    }
}