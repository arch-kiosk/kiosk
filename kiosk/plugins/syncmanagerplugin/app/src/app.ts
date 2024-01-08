import { KioskApp } from "../kioskapplib/kioskapp";
import { DateTime } from "luxon";
import { html, unsafeCSS } from "lit";
import {state} from 'lit/decorators.js'
import "./workstationlist.ts"

// import local_css from "/src/static/logviewerapp.sass?inline";
// @ts-ignore
import local_css from "./component-syncmanagerapp.sass?inline";

export class SyncManagerApp extends KioskApp {
    static styles = unsafeCSS(local_css);
    _messages: {[key: string]: object} = {}

    @state()
    last_sync_date: DateTime

    static get properties() {
        return { ...super.properties };
    }

    constructor() {
        super();
    }

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext") ) {
            if (this.apiContext ) console.log("starting app");
        }
    }

    protected reloadClicked(e: Event) {
        let el = this.shadowRoot.getElementById("workstation-list")
        el.shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
            bubbles: true,
            cancelable: false,
        }))
    }

    protected render_toolbar() {
        return html`
            <div class="toolbar">
                <div id="toolbar-filters"></div>
                <div class="toolbar-info">
                    ${this.last_sync_date?html`<label>last synchronization</label><label>${this.last_sync_date.toLocaleString(DateTime.DATETIME_MED)}</label>`:html`<label>no synchronization, yet</label>`}
                </div>
                <div id="toolbar-buttons">
                    <div class="toolbar-button" @click=${this.reloadClicked}>
                        <i class="fas fa-reload"></i>
                    </div>
                </div>
            <div>
        </div>`
    }
    syncManagerInfoReceived (e: CustomEvent) {
        if (e.detail) {
            this.last_sync_date = DateTime.fromISO(e.detail)
        }
    }

    // apiRender is only called once the api is connected.
    apiRender() {
        let dev = html``
        // @ts-ignore
        if (import.meta.env.DEV) {
            dev = html`<div class="logged-in-message">logged in! Api is at ${this.apiContext.getApiUrl()}</div>`
        }
        let toolbar = this.render_toolbar()
        let app = html`
            <workstation-list id="workstation-list" .apiContext=${this.apiContext} @syncmanagerinfo="${this.syncManagerInfoReceived}"></workstation-list>`
        return html`${dev}${toolbar}${app}`
    }
}

window.customElements.define("syncmanager-app", SyncManagerApp);
