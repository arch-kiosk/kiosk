var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a, _b;
import { KioskApp } from "../kioskapplib/kioskapp";
import { unsafeCSS } from "lit";
import { html } from 'lit/static-html.js';
import { state } from "lit/decorators.js";
import "./kioskqueryselector.ts";
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('/sl_assets');
// import local_css from "/src/static/logviewerapp.sass?inline";
// @ts-ignore
import local_css from "./styles/component-queryandviewapp.sass?inline";
import { KioskQueryFactory } from "./kioskqueryfactory";
import { nanoid } from "nanoid";
import "./kioskquerylayouter.ts";
export class QueryAndViewApp extends (_b = KioskApp) {
    constructor() {
        super();
        this._messages = {};
        this.inSelectQueryMode = true;
        this.queries = [];
    }
    firstUpdated(_changedProperties) {
        console.log("App first updated.");
        super.firstUpdated(_changedProperties);
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext")) {
            if (this.apiContext)
                console.log("starting app");
        }
    }
    reloadClicked(e) {
        // let el = this.shadowRoot.getElementById("workstation-list")
        // el.shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
        //     bubbles: true,
        //     cancelable: false,
        // }))
    }
    selectQueryClicked(e) {
        if (!this.inSelectQueryMode) {
            this.inSelectQueryMode = true;
        }
    }
    queryModeClosed(e) {
        this.inSelectQueryMode = false;
        if (e.detail) {
            this.openQuery(e.detail);
        }
    }
    openQuery(kioskQuery) {
        const queryTag = KioskQueryFactory.getKioskQueryTag(kioskQuery.type);
        if (queryTag) {
            let query = { "uid": nanoid(), ...kioskQuery };
            this.queries.push(query);
            this.requestUpdate();
        }
    }
    render_toolbar() {
        return html ` <div class="toolbar">
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
        return html `<kiosk-query-selector
            id="kiosk-query-selector"
            .apiContext=${this.apiContext}
            @close="${this.queryModeClosed}"
        >
        </kiosk-query-selector>`;
    }
    renderQuery(query) {
        return html `<${KioskQueryFactory.getKioskQueryTag(query.type)} 
            id="${query.uid}" 
            .apiContext=${this.apiContext} 
            .queryDefinition=${query}
            slot="${query.uid}">
        </${KioskQueryFactory.getKioskQueryTag(query.type)}>`;
    }
    onCloseQuery(e) {
        console.warn(`app.onCloseQuery: Not implemented: Trying to close panel ${e.detail}`);
    }
    renderLayout() {
        return html `<kiosk-query-layouter 
            .apiContext="${this.apiContext}" 
            .assignedQueries="${this.queries.map(q => [q.uid, q.name])}"
            @close="${this.onCloseQuery}">
            ${this.queries.map(query => this.renderQuery(query))}
        </kiosk-query-layouter>`;
    }
    // apiRender is only called once the api is connected.
    apiRender() {
        let dev = html ``;
        // @ts-ignore
        if (import.meta.env.DEV) {
            dev = html `<div class="logged-in-message">logged in! Api is at ${this.apiContext.getApiUrl()}</div>`;
        }
        let toolbar = this.render_toolbar();
        let app = this.inSelectQueryMode ? this.renderQueryMode() : this.renderLayout();
        return html `${dev}${toolbar}${app}`;
    }
}
_a = QueryAndViewApp;
QueryAndViewApp.styles = unsafeCSS(local_css);
QueryAndViewApp.properties = {
    ...Reflect.get(_b, "properties", _a),
};
__decorate([
    state()
], QueryAndViewApp.prototype, "inSelectQueryMode", void 0);
__decorate([
    state()
], QueryAndViewApp.prototype, "queries", void 0);
window.customElements.define("queryandview-app", QueryAndViewApp);
//# sourceMappingURL=app.js.map