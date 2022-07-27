// @ts-ignore
import {developMode} from './lib/const.js'
import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import frameStyle from './component-selectionframe.sass';
import "./dateselector.ts"
import "./contextselector.ts"
import "./teamselector.ts"
// @ts-ignore
import {State} from "./store/reducer.ts";
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import {store} from "./store/store.ts";

@customElement('selection-frame')
class SelectionFrame extends connect(store) (LitElement) {

    login_token = ""
    api_url = ""

    constructor() {
        super();
        // @ts-ignore
        this._init();
    }

    static get properties() {
        return {
            login_token: {type: String},
            api_url: {type: String}
        }
    }

    static get styles() {
        return frameStyle
    }


    _init() {
    }

    stateChanged(state: State) {
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

    protected renderSelectors() {
        return html`
            <date-selector .api_url="${this.api_url}" .login_token="${this.login_token}"></date-selector>
            <context-selector .api_url="${this.api_url}" .login_token="${this.login_token}"></context-selector>
            <team-selector .api_url="${this.api_url}" .login_token="${this.login_token}"></team-selector>
        `
    }

    render() {
        return html`${this.api_url !== "" && this.login_token !== "" ?
            this.renderSelectors() :
            html`api url unknown`
        }`
    }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}
