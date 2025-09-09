import { html, LitElement, unsafeCSS } from "lit";
import {customElement} from 'lit/decorators.js'
import local_css from "./styles/component-selectionframe.sass?inline";
import "./dateselector.ts"
import "./contextselector.ts"
import "./teamselector.ts"
import "./widgetselector"
import {State} from "./store/reducer";
import {store} from "./store/store";
import { KioskStoreAppComponent } from "../kioskapplib/kioskStoreAppComponent";

@customElement('selection-frame')
class SelectionFrame extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);

    constructor() {
        super();
    }

    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext")) {
            if (this.apiContext) {
                //ready to do something
            }
        }
    }

    protected renderSelectors() {
        return html`
            <widget-selector .apiContext="${this.apiContext}"></widget-selector>
            <date-selector .apiContext="${this.apiContext}"></date-selector>
            <context-selector .apiContext="${this.apiContext}"></context-selector>
            <team-selector .apiContext="${this.apiContext}"></team-selector>
        `
    }

    apiRender() {
        return this.renderSelectors()
    }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}
