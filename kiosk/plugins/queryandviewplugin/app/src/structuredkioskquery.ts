// @ts-ignore
import local_css from './styles/component-structuredkioskquery.sass?inline'
import "./kioskqueryui.ts"
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { KioskQueryInstance } from "./lib/apitypes";

@customElement('structured-kiosk-query')
export class StructuredKioskQuery extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties
    }

    @property()
    public queryDefinition: KioskQueryInstance

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        // if (_changedProperties.has("apiContext") ) {
        //     if (this.apiContext ) {
        //         this.loadQueries()
        //     }
        // }
    }

    apiRender(): TemplateResult {
        return html`
            <div class="structured-kiosk-query">
                <kiosk-query-ui .apiContext=${this.apiContext} .uiDefinition="${this.queryDefinition.ui}"></kiosk-query-ui>
            </div>
        `
    }
}

