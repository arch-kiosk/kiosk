// @ts-ignore
import local_css from './styles/component-kioskquerylayouter.sass?inline'

import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, nothing, PropertyValues, TemplateResult, unsafeCSS } from "lit";
import { property, state, customElement } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import { ApiResultKioskQueryDescription } from "./lib/apitypes";
import { SlTabGroup } from "@shoelace-style/shoelace";
import { KioskView } from "./kioskview";

export type QueryTuple = [id: string, name: string]


@customElement('kiosk-query-layouter')
export class KioskQueryLayouter extends KioskAppComponent {
    static styles = unsafeCSS(local_css);


    static properties = {
        ...super.properties
    }

    @property()
    public assignedPages: QueryTuple[] = []

    @property({noAccessor: true})
    public topOffset: number = 0

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
    }

    public selectPage(queryId: string) {
        let tabGroup = <SlTabGroup> this.shadowRoot.querySelector("sl-tab-group")
        return new Promise((resolve) => {
            setTimeout(() => {
                tabGroup.show(queryId)
                resolve(true)
            }, 100)
        })
    }

    tryClose(e: Event) {
        const tab = e.target;
        if ("panel" in tab) {
            const panel = tab.panel
            const event = new CustomEvent("close", { "detail": panel })
            this.dispatchEvent(event)
        } else {console.error('KioskQueryLayouter.tryClose: target has not panel attribute')}
    }

    tabShow(e: CustomEvent) {
        const slotId = e.detail.name
        const view = this.querySelector(`kiosk-view[slot="${slotId}"]`) as KioskView
        view.restoreBookmark()
    }

    tabHide(e: CustomEvent) {
        const slotId = e.detail.name
        const view = this.querySelector(`kiosk-view[slot="${slotId}"]`) as KioskView
        console.log("view-id" , view.id)
        view.bookmarkTop(this.topOffset)
    }

    closeAll() {
        const event = new CustomEvent("close", { "detail": "-all-" })
        this.dispatchEvent(event)
    }

    apiRender(): TemplateResult {
        return (this.assignedPages.length==0)?html``:html`
            <div class="kiosk-query-layouter">
                ${this.assignedPages.length > 1?html`<i class="fas fa-burst query-layouter-close-all" @click="${this.closeAll}"></i>`:nothing}
                <sl-tab-group @sl-close="${this.tryClose}" @sl-tab-show="${this.tabShow}" @sl-tab-hide="${this.tabHide}">
                    ${this.assignedPages.map(q => html`
                        <sl-tab slot="nav" panel="${q[0]}" closable>${q[1]}</sl-tab>
                    `)}
                    ${this.assignedPages.map(q => html`
                        <sl-tab-panel name="${q[0]}"><slot name="${q[0]}"></slot></sl-tab-panel>
                    `)}
                </sl-tab-group>
            </div>
        `
    }
}

