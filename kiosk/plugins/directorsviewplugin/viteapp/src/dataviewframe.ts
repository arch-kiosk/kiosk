// @ts-ignore
import {developMode} from './lib/const.js'
import { html, LitElement} from "lit";
import {customElement} from 'lit/decorators.js'
// @ts-ignore
import local_css from './styles/component-dataframe.sass?inline';
import "./datawidgets/unitinfowidget.ts"
import "./datawidgets/narrativewidget.ts"
import "./datawidgets/locuswidget.ts"
import "./datawidgets/cmwidget.ts"
import "./datawidgets/featurewidget.ts"
import "./datawidgets/filewidget.ts"
// @ts-ignore
import {State} from "./store/reducer.ts";
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent.ts";
import { unsafeCSS } from "lit";


@customElement('dataview-frame')
class DataViewFrame extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties,
    };

    constructor() {
        super();
        // @ts-ignore
    }

    stateChanged(state: State) {
    }

    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    protected renderDataWidgets() {
        return html`
            <unit-info-widget .apiContext="${this.apiContext}"></unit-info-widget>
            <narrative-widget .apiContext="${this.apiContext}"></narrative-widget>
            <file-widget .apiContext="${this.apiContext}"></file-widget>
            <locus-widget .apiContext="${this.apiContext}"></locus-widget>
            <cm-widget .apiContext="${this.apiContext}"></cm-widget>
            <feature-widget .apiContext="${this.apiContext}"></feature-widget>
            
        `
    }

    apiRender() {
        return this.renderDataWidgets()
    }

}

