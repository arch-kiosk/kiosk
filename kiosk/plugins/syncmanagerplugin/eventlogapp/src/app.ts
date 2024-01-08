import { KioskApp } from "../kioskapplib/kioskapp";
import { nothing, unsafeCSS } from "lit";
import { html, literal } from "lit/static-html.js";
import { handleCommonFetchErrors } from "./lib/applib";


// @ts-ignore
import local_css from "./styles/component-hubeventlogapp.sass?inline";
import { FetchException } from "../kioskapplib/kioskapi";
// import {MessageData, MSG_LOGGED_OUT, sendMessage, showMessage} from "./lib/appmessaging.ts";
import "./hubeventlog"

class HubEventLogApp extends KioskApp {
    static styles = unsafeCSS(local_css);
    login_token = ""
    dock = ""
    _messages: { [key: string]: object } = {};

    static properties = {
        ...super.properties,
        login_token: {type: String},
        dock: {type: String}
    };


    constructor() {
        super();
    }

    firstUpdated(_changedProperties: any) {
        console.log("App first updated.");
        super.firstUpdated(_changedProperties);
    }

    apiConnected() {
        console.log("api is connected");
        // this.fetchConstants()
    }

    changeDock(e: Event) {
        let dock = (e.currentTarget as HTMLInputElement).value
        let event_log = this.shadowRoot.querySelector("hub-event-log")
        event_log.setAttribute("dock", dock)
    }

    backClick() {
        const options = {
            bubbles: true
        }
        this.dispatchEvent(new CustomEvent('go-back', options))
    }

    protected renderToolbar() {
        return html`
            <div class="toolbar">
                <div id="toolbar-left">
                    <div class="small-list-button"><i class='fas fa-arrow-circle-left' style='justify-self: center' @click="${this.backClick}"></i></div>
                    <label for="dock_filter">dock:</label><input id="dock_filter" name="dock_filter" type="text" value="${this.dock}" @change="${this.changeDock}"/>
                </div>
                <div></div>
            </div>`;
    }

    protected render_app() {
        let dev = html``
        // @ts-ignore
        let app = html`
            <div class='event-log-frame'>
                 <hub-event-log .apiContext="${this.apiContext}" dock="${this.dock}"></hub-event-log>
             </div>`
        return html`${dev}${app}`
    }

    apiRender() {
        let dev = html``;
        // @ts-ignore
        if (import.meta.env.DEV) {
            dev = html`
                <div>
                    <div class="logged-in-message">logged in! Api is at ${this.apiContext.getApiUrl()}</div>
                </div>`;
        }
        const app = this.render_app()
        const toolbar = this.renderToolbar()
        return html`${dev}${toolbar}${app}`;
    }
}

window.customElements.define("hubeventlog-app", HubEventLogApp);
