import { KioskApp } from "../kioskapplib/kioskapp";
import { unsafeCSS } from "lit";
import { html, literal } from 'lit/static-html.js'
import { property, state } from "lit/decorators.js";
import "./kioskqueryselector.ts";
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('/sl_assets');

// import local_css from "/src/static/logviewerapp.sass?inline";
// @ts-ignore
import local_css from "./styles/component-queryandviewapp.sass?inline";
import { ApiResultKioskQueryDescription, KioskQueryInstance } from "./lib/apitypes";
import { KioskQueryFactory } from "./kioskqueryfactory";
import { nanoid } from "nanoid";
import "./kioskquerylayouter.ts"

export class QueryAndViewApp extends KioskApp {
    static styles = unsafeCSS(local_css);
    _messages: { [key: string]: object } = {};

    static properties = {
        ...super.properties,
    };

    @state()
    inSelectQueryMode = true;

    @state()
    queries: KioskQueryInstance[] = [];

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
    }

    protected selectQueryClicked(e: Event) {
        if (!this.inSelectQueryMode) {
            this.inSelectQueryMode = true;
        }
    }

    protected queryModeClosed(e: CustomEvent) {
        this.inSelectQueryMode = false;
        if (e.detail) {
            this.openQuery(e.detail);
        }
    }

    protected openQuery(kioskQuery: ApiResultKioskQueryDescription) {
        const queryTag = KioskQueryFactory.getKioskQueryTag(kioskQuery.type);
        if (queryTag) {
            let query = {"uid": nanoid(), ...kioskQuery}
            this.queries.push(query)
            this.requestUpdate()
        }
    }

    private gotoIdentifier(event: CustomEvent) {
        alert(event.detail["tableName"] + "." + event.detail["dsdName"] + ": " + event.detail["identifier"])
    }

    protected render_toolbar() {
        return html` <div class="toolbar">
            <div id="toolbar-left">
                <div class="toolbar-button" @click="${this.selectQueryClicked}">
                    <i class="fas fa-query"></i>
                </div>
            </div>
            <div id="toolbar-buttons">
                <div class="toolbar-button" @click="${this.reloadClicked}">
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
            @close="${this.queryModeClosed}"
        >
        </kiosk-query-selector>`;
    }

    renderQuery(query: KioskQueryInstance) {

        return html`<${KioskQueryFactory.getKioskQueryTag(query.type)} 
            id="${query.uid}" 
            .apiContext=${this.apiContext} 
            .queryDefinition=${query}
            slot="${query.uid}">
        </${KioskQueryFactory.getKioskQueryTag(query.type)}>`
    }

    onCloseQuery(e: CustomEvent) {
        console.warn(`app.onCloseQuery: Not implemented: Trying to close panel ${e.detail}`)
    }

    renderLayout() {
        return html`<kiosk-query-layouter 
            .apiContext="${this.apiContext}" 
            .assignedQueries="${this.queries.map(q => [q.uid, q.name])}"
            @close="${this.onCloseQuery}"
            @identifierClicked="${this.gotoIdentifier}">
            ${this.queries.map(query => this.renderQuery(query))}
        </kiosk-query-layouter>`;
    }

    // apiRender is only called once the api is connected.
    apiRender() {
        let dev = html``;
        // @ts-ignore
        if (import.meta.env.DEV) {
            dev = html`<div class="logged-in-message">logged in! Api is at ${this.apiContext.getApiUrl()}</div>`;
        }
        let toolbar = this.render_toolbar();
        let app = this.inSelectQueryMode ? this.renderQueryMode() : this.renderLayout();
        return html`${dev}${toolbar}${app}`;
    }
}

window.customElements.define("queryandview-app", QueryAndViewApp);
