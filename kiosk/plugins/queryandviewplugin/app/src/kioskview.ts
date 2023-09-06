// @ts-ignore
import local_css from './styles/component-kioskview.sass?inline'
import 'ui-component'
import { KioskViewDetails } from "./apptypes";
import { customElement, state } from "lit/decorators.js";
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { css, html, nothing, TemplateResult, unsafeCSS } from "lit";
import { ApiResultKioskQuery, KioskQueryInstance } from "./lib/apitypes";
import { registerStyles } from "@vaadin/vaadin-themable-mixin/register-styles";
import { property } from "lit/decorators.js";
import {
    UISchema,
    UISchemaLayoutElement,
// @ts-ignore
} from "ui-component";

@customElement('kiosk-view')
export class KioskView  extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static getViewId(viewDetails: KioskViewDetails): string {
        return `view:${viewDetails.tableName}|${viewDetails.dsdName}|${viewDetails.identifier}`
    }

    static properties = {
        ...super.properties
    }

    @state()
    data: ApiResultKioskQuery | null = null

    @state()
    uiSchema: UISchema

    @property()
    public viewDetails: KioskViewDetails

    constructor() {
        super();
    }

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    willUpdate(_changedProperties: any) {
        if (_changedProperties.has("viewDetails") && this.viewDetails) {
            //translate and amened the query definition into a correct UISchema here.
            this.loadUI()
        }
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        const ui: any = this.renderRoot.querySelector("#ui");
        // (<UISchemaLookupProvider>ui.lookupProvider) = this.apiLookupProvider.bind(this)
        ui.uiSchema = this.uiSchema
    }

    loadUI() {
        this.uiSchema = {
            header: { version: 1 },
            dsd: {},
            layout_settings: {
                orchestration_strategy: "stack",
            },
            meta: {
                scenario: "query-ui"
            },
            ui_elements: {
                "query_fields": {
                    "element_type": <UISchemaLayoutElement>{
                        "name": "layout",
                        "layout_settings": {
                            "orchestration_strategy": "stack"
                        },
                        "ui_elements": {}
                    }
                }
            }
        }
    }

    apiRender(): TemplateResult {
        return html`
            <div class="kiosk-view">
                <h1>view for ${this.viewDetails.identifier}</h1>
                <ui-component id="ui"></ui-component>
            </div>
        `;
    }
}