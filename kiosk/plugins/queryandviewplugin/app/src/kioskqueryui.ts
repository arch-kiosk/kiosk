// @ts-ignore
import local_css from "./styles/component-kioskqueryui.sass?inline";

import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import { property, state, customElement } from "lit/decorators.js";
// import { ApiResultKioskQueryDescriptionUI } from "./lib/apitypes";
import "ui-component"
import { UISchema } from "ui-component";

@customElement("kiosk-query-ui")
export class StructuredKioskQuery extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties,
    };

    @property()
    public uiDefinition: UISchema;

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        const ui: any = this.renderRoot.querySelector("#ui");
        ui.data = {
            e1: "54: 26",
            e2: "my filter",
            e3: "2012-02-28",
            e4: "2012-02-28T00:15",
            e5TemplateLabel: "This is my template label",
        };
        ui.uiSchema = this.uiDefinition
    }

    apiRender(): TemplateResult {
        return html`
            <div class="kiosk-query-ui">
                <ui-component id="ui"></ui-component>
            </div>
        `;
    }
}
