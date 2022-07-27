// @ts-ignore
import {developMode} from './lib/const.js'
import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import frameStyle from './component-dataframe.sass';
import "./datawidgets/unitinfowidget.ts"
import "./datawidgets/narrativewidget.ts"
import "./datawidgets/filewidget.ts"
import "./datawidgets/locuswidget.ts"
import "./datawidgets/cmwidget.ts"
import "./datawidgets/featurewidget.ts"
// @ts-ignore
import {State} from "./store/reducer.ts";
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import {store} from "./store/store.ts";


@customElement('dataview-frame')
class DataViewFrame extends connect(store) (LitElement) {

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

    protected renderDataWidgets() {
        return html`
            <unit-info-widget .api_url="${this.api_url}" .login_token="${this.login_token}"></unit-info-widget>
            <narrative-widget .api_url="${this.api_url}" .login_token="${this.login_token}"></narrative-widget>
            <file-widget .api_url="${this.api_url}" .login_token="${this.login_token}"></file-widget>
            <locus-widget .api_url="${this.api_url}" .login_token="${this.login_token}"></locus-widget>
            <cm-widget .api_url="${this.api_url}" .login_token="${this.login_token}"></cm-widget>
            <feature-widget .api_url="${this.api_url}" .login_token="${this.login_token}"></feature-widget>
        `
    }

    render() {
        return html`${this.api_url !== "" && this.login_token !== "" ?
            this.renderDataWidgets() :
            html`api url unknown`
        }`
    }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}

