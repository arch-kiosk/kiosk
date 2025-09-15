import { html} from "lit";
import {customElement} from 'lit/decorators.js'
import local_css from '../styles/component-deletion-info-widget.sass?inline';
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
import { store } from "../store/store";
import { DateTime } from "luxon"

class DeletionInfoRecord {
    record_type: string
    modified: string
    dock: string
    deleted_records: number
}

@customElement('deletion-info-widget')
class DeletionInfoWidget extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);

    selected_date: Date = null
    selected_context: string = ""
    selected_context_uid: string = ""
    deletions: Array<DeletionInfoRecord> = []
    // lociList: Array<LocusRecord> = []
    fetching: boolean = false
    fetch_error: string = ""
    unitCount: number = 0
    selected_sort: string = "identifier"
    record_type_names: { [key: string]: string } = null;

    sort_by: { [key: string]: Array<string> }= {
        "dock": ["dock", "modified"],
        "record type": ["record_type", "modified"],
        "sync time": ["modified", "dock"]
    }

    constructor() {
        super();
    }

    static properties = {
        ...super.properties,
        selected_date: {type: Date},
        fetching: {type: Boolean},
        sort_by: {type: Array},
    }

    get_conditions(us_date: string): string {
        let sql = `date(modified) = date('${us_date}')`
        return sql
    }

    fetch_data() {
        this.fetching = true
        const us_date = getSqlDate(this.selected_date)
        let searchParams = new URLSearchParams({"from_date": us_date, "to_date": us_date})
        this.apiContext.fetchFromApi("", "deletions",
            {
                method: "GET",
                caller: "deletion-info-widget.fetch_data",
            },undefined,searchParams
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
                handleCommonFetchErrors(this, e, "deletion-info-widget.fetch_data", null)
            })
    }

    load_records(records: []) {
        console.log("deletion_data", records)
        this.deletions = []

        records.forEach((r: any) => {
            const unitId = r.primary_identifier
            const recordTypeName = r[1] in this.record_type_names?this.record_type_names[r[1]]:getStandardTerm(store.getState().constants,r[1],false,r[1])
            const deletion = new DeletionInfoRecord()
            deletion.modified = DateTime.fromSQL(r[0], {zone: "utc"}).toLocaleString({
                // dateStyle: "full",
                timeStyle: "short",
                // timeZone: "Australia/Sydney",
            })
            deletion.record_type = recordTypeName
            deletion.dock = r[2]
            deletion.deleted_records = r[3]
            this.deletions.push(deletion)
        })
        this.selected_sort = "dock"
        this.sort_records(this.sort_by[this.selected_sort])
    }

    sort_records(sort_by: Array<string>) {
        function _sort(a: DeletionInfoRecord, b: DeletionInfoRecord): number {
            for (let i = 0; i < sort_by.length; i++) {
                let attrib: string = sort_by[i];
                let value_a = a[attrib as keyof DeletionInfoRecord]
                let value_b = b[attrib as keyof DeletionInfoRecord]
                let result: number = 0

                if (typeof (value_a) === "string" && typeof (value_b) === "string") {
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
        console.log(`sorting loci by ${this.sort_by[this.selected_sort]}`)
        this.deletions.sort(_sort)
        this.requestUpdate();
    }

    stateChanged(state: State) {
        console.log('state', state)
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
        }


        if (state.constants.length > 0 && !this.record_type_names) {
            this.record_type_names = getRecordTypeNames(state.constants);
        }

        if (changed && this.record_type_names) this.fetch_data()

        // if (state.constants.length > 0) {
        //     // this.term_for_unit = getStandardTerm(state.constants,
        //     //     "label_for_unit_on_start_page", false, this.term_for_unit).replace("\r", " or ")
        //     // this.term_for_supervisor = getStandardTerm(state.constants, "label_supervisor",
        //     //     false, this.term_for_supervisor)
        // }
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


    apiRender() {
        return html`
            <div class="deletion-info-widget">
                ${this.deletions.length == 0
                    ?html`
                        <div class="headline green">
                            <p>Nothing was deleted on this day</p>
                        </div>
                    `
                    :html`
                        <div class="headline red">
                            <p>deletions on this day</p>
                        </div>
                        <div class="controls red">
                            <div class="controls-left">
                                ${this.renderSortSelector()}
                            </div>
                        </div>
                        ${this.render_widget()}
                    `}
            </div>`
    }

    protected render_widget() {
        if (this.fetching)
            return html`fetching data ...`
        else {
            if (this.deletions.length == 0) {
                return html`
                    <div class="no-loci">
                        <p>There were no deletions on this day</p>
                    </div>`
            } else {
                return html`
                <div class="deletion-list">
                    <div class="list-header red">dock</div>
                    <div class="list-header red">record type</div>
                    <div class="list-header red" style="text-align: end">sync time</div>
                    <div class="list-header red" style="text-align: end">number of deletions</div>
                    <div class="list-header red">&nbsp;</div>
                    ${this.deletions.map((d: DeletionInfoRecord) =>
                    html`
                        <div>${d.dock}</div>
                        <div>${d.record_type}</div>
                        <div style="text-align: end">${d.modified}</div>
                        <div style="text-align: end">${d.deleted_records}</div>
                        <div>&nbsp;</div>
                    `
                )}
                </div>`
            }
        }
    }
}