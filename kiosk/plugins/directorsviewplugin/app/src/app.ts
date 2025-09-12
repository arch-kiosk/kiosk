import { KioskApp } from "../kioskapplib/kioskapp";
import { nothing, unsafeCSS } from "lit";
import { html, literal } from "lit/static-html.js";
// import {constantsContext} from './constantscontext'
// import { property, state } from "lit/decorators.js";
// @ts-ignore
import {State} from './store/reducer.ts'
// @ts-ignore
import {setConstants} from "./store/actions.ts";
// @ts-ignore
import { Constant, handleCommonFetchErrors } from "./lib/applib.ts";


// import local_css from "/src/static/logviewerapp.sass?inline";
// @ts-ignore
import local_css from "./styles/component-directorsviewapp.sass?inline";
import { FetchException } from "../kioskapplib/kioskapi";
// @ts-ignore
import {store} from './store/store.ts';
// @ts-ignore
import {MessageData, MSG_LOGGED_OUT, sendMessage, showMessage} from "./lib/appmessaging.ts";
import "./selectionframe.ts"
import "./dataviewframe.ts"

// @ts-ignore
// class DirectorsViewApp extends connect(store) (KioskApp) {
class DirectorsViewApp extends KioskApp {
    static styles = unsafeCSS(local_css);
    login_token = ""
    _messages: { [key: string]: object } = {};

    static properties = {
        ...super.properties,
        login_token: {type: String}
    };


    constructor() {
        super();
    }

    _show_message(e: CustomEvent) {
        let messageData = e.detail;
        showMessage(this._messages, messageData, null, true)

    }

    firstUpdated(_changedProperties: any) {
        console.log("App first updated.");
        super.firstUpdated(_changedProperties);
    }

    apiConnected() {
        console.log("api is connected");
        this.fetchConstants()
    }

    fetchConstants() {
        const state: State = store.getState()
        if (state.constants.length === 0) {
            if (this.apiContext) {
                this.apiContext.fetchFromApi("", "constants",
                    {
                        method: "GET",
                        caller: "app.fetchConstants"
                    })
                    .then((json: object) => {
                        this.loadConstants(<[Constant]>json)
                    })
                    .catch((e: FetchException) => {
                        // handleFetchError(msg)
                        handleCommonFetchErrors(this, e, "loadConstants", null)
                    })

            } else {
                console.log("constants not loaded because api not ready")
            }
        } else {
            console.log("constants not loaded because of state:")
            console.log(state)
        }
    }

    loadConstants(constants: [Constant]) {
        store.dispatch(setConstants(constants))
    }

    protected render_app() {
        let dev = html``
        // @ts-ignore
        let app = html`
            <div class='directors-view-frame'>
                 <selection-frame .apiContext="${this.apiContext}"></selection-frame>
                 <dataview-frame .apiContext="${this.apiContext}""></dataview-frame>
             </div>`
        return html`${dev}${app}`
    }

    // apiRender is only called once the api is connected.
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
        return html`${dev}${app}`;
    }
}

window.customElements.define("directorsview-app", DirectorsViewApp);
