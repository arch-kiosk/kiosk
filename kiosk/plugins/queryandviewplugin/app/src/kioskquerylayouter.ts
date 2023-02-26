// @ts-ignore
import local_css from './styles/component-kioskquerylayouter.sass?inline'

import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, PropertyValues, TemplateResult, unsafeCSS } from "lit";
import { property, state, customElement } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import { ApiResultKioskQueryDescription } from "./lib/apitypes";

export type QueryTuple = [id: string, name: string]


@customElement('kiosk-query-layouter')
export class KioskQueryLayouter extends KioskAppComponent {
    static styles = unsafeCSS(local_css);


    static properties = {
        ...super.properties
    }

    @property()
    public assignedQueries: QueryTuple[] = []

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
    }

    tryClose(e: Event) {
        const tab = e.target;
        if ("panel" in tab) {
            const panel = tab.panel
            const event = new CustomEvent("close", { "detail": panel })
            this.dispatchEvent(event)
        } else {console.error('KioskQueryLayouter.tryClose: target has not panel attribute')}
    }

    apiRender(): TemplateResult {
        console.log("render kioskquerylayouter")
        return html`
            <div class="kiosk-query-layouter">
                <sl-tab-group @sl-close="${this.tryClose}">
                    ${this.assignedQueries.map(q => html`
                        <sl-tab slot="nav" panel="${q[0]}" closable>${q[1]}</sl-tab>
                    `)}
                    ${this.assignedQueries.map(q => html`
                        <sl-tab-panel name="${q[0]}"><slot name="${q[0]}"></slot></sl-tab-panel>
                    `)}
                </sl-tab-group>
                <slot></slot>
            </div>
        `
    }

}

