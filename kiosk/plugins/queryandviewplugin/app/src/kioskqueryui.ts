// @ts-ignore
import local_css from './styles/component-kioskqueryui.sass?inline'

import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { ApiResultKioskQueryDescriptionUI } from "./lib/apitypes";

@customElement('kiosk-query-ui')
export class StructuredKioskQuery extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties
    }

    @property()
    public uiDefinition: ApiResultKioskQueryDescriptionUI

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
    }

    apiRender(): TemplateResult {
        return html`
            <div class="kiosk-query-ui">
                <h3>Query UI</h3>
            </div>
        `
    }
}
