// @ts-ignore
import {developMode} from './lib/const.js'
import {customElement, html, LitElement} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
// @ts-ignore
import {store} from './store/store.ts';
// @ts-ignore
import {State} from './store/reducer.ts'
// @ts-ignore
import {setConstants, Constant} from "./store/actions.ts";
// @ts-ignore
import {MessageData, MSG_LOGGED_OUT, sendMessage, showMessage} from "./lib/appmessaging.ts";
// @ts-ignore
import {getStandardTerm, handleCommonFetchErrors} from "./lib/applib.ts";
// @ts-ignore
import {fetchFromApi, FetchException, getKioskToken as kioskGetKioskToken, getApiUrl as kioskGetApiUrl} from "../../../../static/scripts/kioskapputils.js"
// @ts-ignore
import appStyle from './component-directorsviewapp.sass';
// @ts-ignore
import {devGetApiUrl, devGetKioskToken, devInitKioskApp} from "./lib/devapputils.js";
import "./selectionframe.ts"
import "./dataviewframe.ts"
import {Store} from "redux";


let getKioskToken = kioskGetKioskToken
let getApiUrl = kioskGetApiUrl
// @ts-ignore
if (typeof DEVELOPMENT !== 'undefined' && DEVELOPMENT) {
    // @ts-ignore
    console.log("DEVELOPMENT")
    // @ts-ignore
    import("../../../../static/styles/_defaults.sass")
    // @ts-ignore
    import("./lib/dev.sass")
    getKioskToken = devGetKioskToken
    getApiUrl = devGetApiUrl

}

@customElement('directorsview-app')
class DirectorsViewApp extends connect(store) (LitElement) {

    login_token = ""
    _messages: {[key: string]: object} = {}

    constructor() {
        super();
        // @ts-ignore
        if (DEVELOPMENT) {
            this._init();
        } else {
            // @ts-ignore
            kioskStartWhenReady(this._init.bind(this), () => {
                console.log("kioskStartWhenReady failed.")
            })
        }
    }

    static get properties() {
        return {
            login_token: {type: String}
        }
    }

    static get styles() {
        return appStyle
    }

    stateChanged(state: State) {
    }

    _init() {
        getKioskToken()
            .then((token: string) => {
                console.log("token is " + token);
                this.login_token = token;
                this.fetchConstants();
                this.addEventListener("send-message", this._show_message)
            })
            .catch((e: FetchException)=> {
                let messageData = new MessageData(MSG_LOGGED_OUT, "The Kiosk Server is either not running or you have been logged out.")
                showMessage(this._messages, messageData, null, true)
            })
    }

    _show_message(e: CustomEvent) {
        let messageData = e.detail;
        showMessage(this._messages, messageData, null, true)

    }


    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    protected updated(_changedProperties: any) {
        super.updated(_changedProperties);
        // if (this.editing !== "") {
        //     this.shadowRoot.getElementById("edit-list").focus();
        // }
    }

    fetchConstants() {
        const state: State = store.getState()
        if (state.constants.length === 0) {
            if (this.login_token && getApiUrl()) {
                fetchFromApi(getApiUrl(), this.login_token, "constants",
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
        if (DEVELOPMENT) {
            dev = html`<div class="logged-in-message">logged in! Api is at ${getApiUrl()}</div>`
        }
        let app = html`
            <div class='directors-view-frame'>
                <selection-frame .api_url="${getApiUrl()}" .login_token="${this.login_token}"></selection-frame>
                <dataview-frame .api_url="${getApiUrl()}" .login_token="${this.login_token}"></dataview-frame>
            </div>`
        return html`${dev}${app}`
    }

    render() {
        return html`
                
                    ${this.login_token
                      ? this.render_app()
                      : html`<div class="wait-for-login"><p>Please wait ...</p></div>`}
                    `
    }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}

