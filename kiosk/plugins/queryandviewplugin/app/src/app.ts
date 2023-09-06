import { KioskApp } from "../kioskapplib/kioskapp";
import { unsafeCSS } from "lit";
import { html, literal } from "lit/static-html.js";
import { property, state } from "lit/decorators.js";
import "./kioskqueryselector.ts";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

setBasePath("/sl_assets");

// import local_css from "/src/static/logviewerapp.sass?inline";
// @ts-ignore
import local_css from "./styles/component-queryandviewapp.sass?inline";
import { AnyDict, ApiResultKioskQueryDescription, KioskQueryInstance } from "./lib/apitypes";
import { KioskViewDetails, KioskViewInstance } from "./apptypes";
import { KioskQueryFactory } from "./kioskqueryfactory";
import { nanoid } from "nanoid";
import "./kioskquerylayouter.ts";
import { KioskQueryLayouter } from "./kioskquerylayouter";
import { KioskView } from "./kioskview";
import { fowlerNollVo1aHashModern } from "./lib/applib";

export class QueryAndViewApp extends KioskApp {
    static styles = unsafeCSS(local_css);
    _messages: { [key: string]: object } = {};

    static properties = {
        ...super.properties,
    };

    // noinspection JSUnresolvedReference
    @state()
    // @ts-ignore
    inSelectQueryMode = !import.meta.env.DEV;

    @state()
    queries: KioskQueryInstance[] = [];

    @state()
    views: Map<string, KioskViewInstance> = new Map();

    @state()
    selectQueryTab: string | null = null;

    constructor() {
        super();
    }

    firstUpdated(_changedProperties: any) {
        console.log("App first updated.");
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext")) {
            if (this.apiContext) console.log("starting app");
        }
    }

    protected reloadClicked(e: Event) {
        // let el = this.shadowRoot.getElementById("workstation-list")
        // el.shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
        //     bubbles: true,
        //     cancelable: false,
        // }))
        // this.inSelectQueryMode = !this.inSelectQueryMode
        this.requestUpdate()
    }

    protected selectQueryClicked(e: Event) {
        if (!this.inSelectQueryMode) {
            this.inSelectQueryMode = true;
        }
    }

    protected queryModeClosed(e: CustomEvent) {
        if (e.detail) {
            this.openQuery(e.detail);
        }
        this.inSelectQueryMode = false;

    }

    protected openQuery(kioskQuery: ApiResultKioskQueryDescription) {
        const queryTag = KioskQueryFactory.getKioskQueryTag(kioskQuery.type);
        if (queryTag) {
            let query = { uid: nanoid(), ...kioskQuery };
            this.queries.push(query);
            this.requestUpdate();
            this.updateComplete.then(() => {
                let layouter = <KioskQueryLayouter>this.shadowRoot.getElementById("query-layout");
                layouter.selectPage(query.uid);
            });
        }
    }
    private gotoIdentifier(event: MouseEvent) {
        const cell = <HTMLSpanElement>event.currentTarget
        const identifier: string = cell.dataset.identifier
        const tableName: string = cell.dataset.tableName
        const fieldName: string = cell.dataset.fieldName

        const identifierEvent = new CustomEvent("identifierClicked",
            {
                "detail": {
                    "dsdName": fieldName,
                    "tableName": tableName,
                    "identifier": identifier
                },
                bubbles: true}
        );
        this.onGotoIdentifier(identifierEvent)
    }

    private onGotoIdentifier(event: CustomEvent) {

        let viewDetails = <KioskViewDetails>event.detail

        // @ts-ignore
        if (import.meta.env.DEV) {
            alert(viewDetails.tableName + "." + viewDetails.dsdName + ": " + viewDetails.identifier);
        }

        const viewId = KioskView.getViewId(viewDetails)
        if (!this.views.has(viewId)) {
            let view: KioskViewInstance = { viewId: viewId, details: {...viewDetails} };
            this.views.set(viewId, view);
            this.requestUpdate();
            this.updateComplete.then(() => {
                let layouter = <KioskQueryLayouter>this.shadowRoot.getElementById("view-layout");
                layouter.selectPage(view.viewId);
            });
        } else {
            alert("already there")
        }
    }

    protected render_toolbar() {
        return html` <div class="toolbar">
            <div id="toolbar-left">
                <div class="toolbar-button" @click="${this.selectQueryClicked}">
                    <i class="fas fa-query"></i>
                </div>
            </div>
            <div id="toolbar-buttons">
                <div style="display:none" class="toolbar-button" @click="${this.reloadClicked}">
                    <i class="fas fa-window-restore"></i>
                </div>
                <div class="toolbar-button" @click="${this.reloadClicked}">
                    <i class="fas fa-reload"></i>
                </div>
            </div>
            <div></div>
        </div>`;
    }

    renderQueryMode() {
        return html`<kiosk-query-selector
            id="kiosk-query-selector"
            .apiContext=${this.apiContext}
            @closeSelection="${this.queryModeClosed}"
            style="display:${this.inSelectQueryMode?'block':'none'}"
        >
        </kiosk-query-selector>`;
    }

    renderQuery(query: KioskQueryInstance) {
        return html`<${KioskQueryFactory.getKioskQueryTag(query.type)} 
            id="${query.uid}" 
            .apiContext=${this.apiContext} 
            .queryDefinition=${query}
            slot="${query.uid}"
        >
            
        </${KioskQueryFactory.getKioskQueryTag(query.type)}>`;
    }

    renderView(view: KioskViewInstance) {
        return html`<kiosk-view
            id="${view.details.tableName}${String(fowlerNollVo1aHashModern(view.viewId))}"
            .apiContext=${this.apiContext}
            .viewDetails=${view.details}
            slot="${view.viewId}">
        </kiosk-view>`
    }

    onCloseQuery(e: CustomEvent) {
        const queryId = e.detail;
        const idx = this.queries.findIndex((q) => q.uid === queryId);
        this.queries.splice(idx, 1);
        this.requestUpdate();
    }

    onCloseView(e: CustomEvent) {
        const viewId = e.detail;
        this.views.delete(e.detail)
        this.requestUpdate();
    }

    renderLayout() {
        return html`<kiosk-query-layouter id="query-layout"
            .apiContext="${this.apiContext}"
            .assignedPages="${this.queries.map((q) => [q.uid, q.name])}"
            @close="${this.onCloseQuery}"
            @identifierClicked="${this.onGotoIdentifier}" 
            style="display:${this.inSelectQueryMode?'none':'block'}"
        >
            ${this.queries.map((query) => this.renderQuery(query))}
        </kiosk-query-layouter>
        <div class="splitter"></div>
        <kiosk-query-layouter id="view-layout"
            .apiContext="${this.apiContext}"
            .assignedPages="${[...this.views.values()].map((view) => [view.viewId, view.viewId])}"
            @close="${this.onCloseView}"
            @identifierClicked="${this.onGotoIdentifier}" 
            style="display:${this.inSelectQueryMode?'none':'block'}"
        >
            ${[...this.views.values()].map((query) => this.renderView(query))}
        </kiosk-query-layouter>`;
    }

    // apiRender is only called once the api is connected.
    apiRender() {
        let dev = html``;
        // @ts-ignore
        if (import.meta.env.DEV) {
            dev = html`<div><div class="logged-in-message">logged in! Api is at ${this.apiContext.getApiUrl()}</div>
                <div class="dev-tool-bar"><span>Open identifier:</span>
                    <span class="dev-open-identifier"
                          data-identifier="F"
                          data-table-name = "unit"
                          data-field-name = "arch-context"
                          @click="${this.gotoIdentifier}">F</span>
                    <span class="dev-open-identifier"
                          data-identifier="D"
                          data-table-name = "unit"
                          data-field-name = "arch-context"
                          @click="${this.gotoIdentifier}">D</span>
                    <span class="dev-open-identifier"
                          data-identifier="H"
                          data-table-name = "unit"
                          data-field-name = "arch-context"
                          @click="${this.gotoIdentifier}">H</span>
                </div>
            </div>`;
        }
        let toolbar = this.render_toolbar();
        const app = html`${this.renderQueryMode()}${this.renderLayout()}`
        return html`${dev}${toolbar}${app}`;
    }
}

window.customElements.define("queryandview-app", QueryAndViewApp);
