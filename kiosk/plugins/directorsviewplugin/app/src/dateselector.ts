import "@vaadin/vaadin-date-picker";
import "@vaadin/vaadin-date-picker";
import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import local_css from "./styles/component-dateselector.sass?inline";
import { State } from "./store/reducer";
import { store } from "./store/store";
import { setSelector, StoreDateSelector } from "./store/actions";
import { getSqlDate, fromSqlDate, handleCommonFetchErrors } from "./lib/applib";
import { KioskStoreAppComponent } from "../kioskapplib/kioskStoreAppComponent";
import { AnyDict } from "../kioskapplib/datasetdefinition";
import { FetchException } from "@arch-kiosk/kiosktsapplib";
import { DateTime } from "luxon"
import _ from "lodash"

@customElement("date-selector")
class DateSelector extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);
    login_token = "";
    api_url = "";
    fetch_error: string = ""

    selected_date = new Date();
    static properties = {
        ...super.properties,
        selected_date: { type: Date },
        workDays: {type: Array}
    };
    workDays: Array<number> = undefined

    constructor() {
        super();
        // @ts-ignore
        if (import.meta.env.DEV) {
            // this.selected_date = new Date(2020,6, 8)
            // this.selected_date = new Date(2025, 8, 10);
        }
        this._init();
    }

    _init() {
        store.dispatch(setSelector("dateSelector", { "selectedDate": this.selected_date }));
    }

    stateChanged(state: State) {
        if ("dateSelector" in state.selectors) {
            let stateDate: Date = (<StoreDateSelector>state.selectors["dateSelector"]).selectedDate;
            if (stateDate.getTime() !== this.selected_date.getTime()) {
                this.selected_date = stateDate;
            }
        }
    }

    protected updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext")) {
            this.fetchWorkDays();
        }
    }

    async fetchDeletionDays() {
        let searchParams = new URLSearchParams({})

        return this.apiContext.fetchFromApi("", "deletions",
            {
                method: "GET",
                caller: "deletion-info-widget.fetch_data",
            }, undefined, searchParams
        )
    }

    async fetchWorkDays() {
        const cql = { "cql": {
                "base": {
                    "scope": {
                        "archival_entity": "browse()",
                        "site": "browse()",
                    },
                    "target": {
                        "field_or_instruction": "modified_ww()",
                    },
                    "additional_fields": {},
                },
                "meta": {
                    "version": 0.1,
                },
                "query": {
                    "type": "DirectSqlQuery",
                    "sql": "distinct  data::date from {base} ",
                }
            }
        };

        let searchParams = new URLSearchParams({
            page_size: "-1"
        })

        try {
            const data = await this.apiContext.fetchFromApi("", "cql/query",
                {
                    method: "POST",
                    caller: "dateselector.fetchWorkDays",
                    body: JSON.stringify(cql),
                }, undefined,searchParams
            )
            if (data.result_msg !== "ok") {
                this.fetch_error = data.result_msg;
            } else {
                this.fetch_error = "";
                const deletionRecords = await this.fetchDeletionDays()
                this.loadWorkDays(data.records, deletionRecords.records);
            }
        } catch(e) {
            handleCommonFetchErrors(this, e, "dateselector.fetchWorkDays", null);
        }

    }

    loadWorkDays(records: Array<AnyDict>, deletionRecords: Array<Array<string>>) {
        const workDays = new Set<number>(records.map((r) => {
            return DateTime.fromISO(r["data"]).startOf("day").toMillis();
        }))
        deletionRecords.forEach(r => {
            try {
                // Deletion Timestamps are expected to be _WW time stamps. Legacy deletion timestamps are UTC, so
                // they can be a day off.
                const d = DateTime.fromSQL(r[0]).startOf("day").toMillis()
                // if (r[0].startsWith("2025-09-13")) debugger;
                workDays.add(d);
            } catch {}
        })
        const workDayList = Array.from(workDays)
        workDayList.sort()
        this.workDays = workDayList
        // const newDate = DateTime.fromMillis(this.workDays[nextIndex])
        // store.dispatch(setSelector("dateSelector", { "selectedDate": new Date(this.selected_date) }));
    }

    jumpToWorkday(evt: MouseEvent) {
        const el = <HTMLElement>evt.currentTarget
        const selectedDate = DateTime.fromJSDate(this.selected_date).startOf("day")
        const selectedDateMs = selectedDate.toMillis()
        let nextIndex: number

        switch (el.id) {
            case "bt-prev-workday":
                nextIndex = _.sortedLastIndex(this.workDays, selectedDateMs) -1;
                if (nextIndex > 0 && this.workDays[nextIndex] == selectedDateMs) nextIndex-=1
                break;
            case "bt-next-workday":
                nextIndex = _.sortedIndex(this.workDays, selectedDateMs);
                if (nextIndex !== 0 || this.workDays[0] == selectedDateMs) nextIndex+=1
                // if (nextIndex != this.workDays.length-1) nextIndex-=1
                break;
            case "bt-first-workday": nextIndex = 0;break;
            case "bt-last-workday": nextIndex = this.workDays.length-1;break;
        }
        if (selectedDateMs && nextIndex > -1) {
            const newDate = DateTime.fromMillis(this.workDays[nextIndex])
            // this.selected_date =
            store.dispatch(setSelector("dateSelector", { "selectedDate": newDate.toJSDate() }));
        }
    }

    dateNavigation(dir: "back" | "forward") {
        if (this.workDays) {
            return dir==='back'? html`
                <div class = "date-navigation" >
                    <button id="bt-first-workday" @click="${this.jumpToWorkday}"><i class="fas fa-backward-fast"></i></button>
                    <button id="bt-prev-workday" @click="${this.jumpToWorkday}"><i class="fas fa-backward"></i></button>
                </div>`: html`
                <div class="date-navigation">
                    <button id="bt-next-workday" @click="${this.jumpToWorkday}"><i class="fas fa-forward"></i></button>
                    <button id="bt-last-workday" @click="${this.jumpToWorkday}"><i class="fas fa-forward-fast"></i></button>
                </div>`
        } else {
            return nothing
        }
    }

    apiRender() {
        // const d = Date.UTC(this.selected_date.getFullYear(), this.selected_date.getMonth(), this.selected_date.getDay())
        let start_date = this.selected_date.getDate() - 3;
        let end_date = this.selected_date.getDate() + 3;
        let dateList: Array<any> = [];
        const selectedDate = DateTime.fromJSDate(this.selected_date).startOf("day")
        console.log(`selected date is ${selectedDate}`);
        for (let d = start_date; d <= end_date; d++) {
            let newDate = new Date(selectedDate.toJSDate());
            newDate.setDate(d);
            const jsDate = DateTime.fromJSDate(newDate).startOf("day")
            // if (jsDate.day === 10) debugger;
            console.log("selected js-date", jsDate.toMillis())
            dateList.push(jsDate);
        }
        console.log(this.workDays?"rendering with workdays":"rendering without workdays")
        // if (this.workDays) debugger;
        return html`
            <div class="date-selector">
                ${this.dateNavigation('back')}
                ${dateList.map((d) => html`
                    ${d.toMillis() === selectedDate.toMillis()
                        ? html`
                            <div date="${d.toMillis()}" class="date-selector-date selected-date">
                                <vaadin-date-picker
                                    id="date-picker"
                                    @change="${this.dateClicked}"
                                    auto-open-disabled
                                    value="${getSqlDate(d.toJSDate())}">
                                </vaadin-date-picker>
                            </div>`
                        : html`
                            <div date="${d.toMillis()}" class="date-selector-date-inactive ${this.workDays && this.workDays.includes(d.toMillis())?'active-day':''}" @click="${this.dateClicked}">
                                <span >${d.weekdayShort}</span>
                            </div>`
                    }
                `)}
                ${this.dateNavigation('forward')}
                
            </div>`;
    }

    protected dateClicked(e: Event) {
        console.log(e.currentTarget);
        // @ts-ignore
        if (e.currentTarget.id === "date-picker") {
            // @ts-ignore
            // @ts-ignore
            const new_date = fromSqlDate(e.currentTarget.value);
            store.dispatch(setSelector("dateSelector", { "selectedDate": new_date }));
        } else {
            // @ts-ignore
            const new_date = new Date();
            // @ts-ignore
            new_date.setTime(e.currentTarget.getAttribute("date"));
            store.dispatch(setSelector("dateSelector", { "selectedDate": new_date }));
        }

    }

    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    // protected updated(_changedProperties: any) {
    //     super.updated(_changedProperties);
    //     // if (this.editing !== "") {
    //     //     this.shadowRoot.getElementById("edit-list").focus();
    //     // }
    // }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}
