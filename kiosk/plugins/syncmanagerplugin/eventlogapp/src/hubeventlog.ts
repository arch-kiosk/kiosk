import { html, PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
// @ts-ignore
import local_css from './styles/component-hubeventlog.sass?inline';
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { unsafeCSS } from "lit";
import { FetchException } from "../kioskapplib/kioskapi";
import { handleCommonFetchErrors } from "./lib/applib";
import { SyncManagerEventsV1, SyncManagerEventV1 } from "./lib/apitypes";
import { DateTime } from "luxon";
import { getLatinDate } from "./lib/tools";


@customElement('hub-event-log')
class HubEventLog extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties,
        dock: {type: String}
    };

    public dock: string=""

    @state()
    private events: Array<SyncManagerEventV1>

    @state()
    private sortedColumn = "time"
    @state()
    private sortDirection = 1

    constructor() {
        super();
    }

    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    protected willUpdate(_changedProperties: PropertyValues) {
        super.willUpdate(_changedProperties);
        if (_changedProperties.has("dock") && this.events) {
            if (_changedProperties.get("dock") !== this.dock) {
                this.events = undefined
                this.fetchEvents()
            }
        }
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext")) {
            if (this.apiContext) {
                this.fetchEvents();
            }
        }
    }

    fetchEvents() {
        console.log(`loading events`);
        this.showProgress = true;
        const urlSearchParams = new URLSearchParams();
        if (this.dock && this.dock !== '')
            urlSearchParams.append("dock_id", this.dock);
        this.apiContext
            .fetchFromApi(
                "syncmanager",
                "events",
                {
                    method: "GET",
                    caller: "hubeventlog.fetchEvents",
                },
                "v1",
                urlSearchParams,
            )
            .then((data: any) => {
                this.loadEvents(data);
            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this, e, "hubeventlog.fetchEvents", null);
            });

    }

    loadEvents(data: SyncManagerEventsV1) {
        this.events = data.events
        for (const e of this.events) e.tsDate = DateTime.fromISO(e.ts);
        console.log(this.events)
    }

    headerClicked(e: MouseEvent) {
        let header = (e.currentTarget as HTMLDivElement).innerText
        if (this.sortedColumn === header) {
            this.sortDirection = (this.sortDirection == 1)?0:1
        } else {
            this.sortedColumn = header
        }
        this.sort()
    }

    sort() {
        let events = [...this.events]
        let sortProperty = "ts"
        let sortDirection = this.sortDirection==0?-1:1
        switch(this.sortedColumn) {
            case "time":
                sortProperty = "ts"
                break
            default:
                sortProperty = this.sortedColumn
        }
        events.sort((a,b) => {
            let rc = 0
            if (sortProperty != "ts") {
                // @ts-ignore
                rc = (a[sortProperty] < b[sortProperty])?-1:((a[sortProperty] > b[sortProperty])?1:0)
                if (rc) return rc * sortDirection
            }
            return ((a.tsDate < b.tsDate)?1:((a.tsDate > b.tsDate)?-1:0)) * sortDirection

        })
        this.events = events
    }

    renderHeader() {
        const headers = ["time", "dock", "event", "user", "message"]
        return headers.map(h => html`
            <div class="log-header" @click="${this.headerClicked}">
                <span>${h}</span>
                ${((this.sortedColumn === h || h==="time") && this.sortDirection==0)?html`<i class="fas fa-asc ${this.sortedColumn === h?undefined:'dim_sort_col'}"></i>`:undefined}
                ${((this.sortedColumn === h || h==="time") && this.sortDirection==1)?html`<i class="fas fa-desc ${this.sortedColumn === h?undefined:'dim_sort_col'}"></i>`:undefined}
            </div>
        `)
    }

    renderBody() {
        if (this.events ) console.log(typeof this.events[0].tsDate)
        if (this.events) {
            return html`${this.events.map(e => html`
            <div class="log-cell">${getLatinDate(e.tsDate, true).toLocaleString()}</div>
            <div class="log-cell">${e.dock}</div>
            <div class="log-cell">${e.event}</div>
            <div class="log-cell">${e.user}</div>
            <div class="log-cell">${e.message}</div>
            `)}`
        } else return undefined
    }

    apiRender() {
        const header = this.renderHeader()
        const body = this.renderBody()
        return html`<div id="log-frame">
            ${header}
            ${body}
            <div`
    }

}

