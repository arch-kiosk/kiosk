import { KioskApp } from "../kioskapplib/kioskapp";
// import { DateTime } from "luxon";
import { html, unsafeCSS } from "lit";
// import "./workstationlist.ts"

// import local_css from "/src/static/logviewerapp.sass?inline";
// @ts-ignore
import local_css from "./component-queryandviewapp.sass?inline";

export class QueryAndViewApp extends KioskApp {
    static styles = unsafeCSS(local_css);
    _messages: {[key: string]: object} = {}

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
        // let el = this.shadowRoot.getElementById("workstation-list")
        // el.shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
        //     bubbles: true,
        //     cancelable: false,
        // }))
    }

    protected render_toolbar() {
        return html`
            <div class="toolbar">
                <div id="toolbar-filters"></div>
                <div id="toolbar-buttons">
                    <div class="toolbar-button" @click=${this.reloadClicked}>
                        <i class="fas fa-reload"></i>
                    </div>
                </div>
            <div>
        </div>`
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
            Query and View App`
        return html`${dev}${toolbar}${app}`
    }
}

window.customElements.define("queryandview-app", QueryAndViewApp);
