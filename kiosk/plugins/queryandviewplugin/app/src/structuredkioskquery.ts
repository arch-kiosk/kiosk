// @ts-ignore
import local_css from './styles/component-structuredkioskquery.sass?inline'
import "./kioskqueryui.ts"
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { KioskQueryInstance } from "./lib/apitypes";
import { UISchema } from "ui-component";

@customElement('structured-kiosk-query')
export class StructuredKioskQuery extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties
    }

    @property()
    public queryDefinition: KioskQueryInstance

    @state()
    uiSchema: UISchema

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

    willUpdate(_changedProperties: any) {
        if (_changedProperties.has("queryDefinition") && this.queryDefinition) {
            //translate and amened the query definition into a correct UISchema here.
            this.uiSchema = {
                header: { version: 1 },
                dsd: <any>this.queryDefinition.ui["dsd"],
                layout_settings: {
                    orchestration_strategy: "stack",
                },
                meta: {
                    scenario: "query-ui"
                },
                ui_elements: this.queryDefinition.ui["ui_elements"]
            }
        }
    }

    apiRender(): TemplateResult {
        return html`
            <div class="structured-kiosk-query">
                <kiosk-query-ui .apiContext=${this.apiContext} .uiDefinition="${this.uiSchema}"></kiosk-query-ui>
            </div>
        `
    }
}

