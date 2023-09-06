var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// @ts-ignore
import local_css from './styles/component-kioskquerylayouter.sass?inline';
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, unsafeCSS } from "lit";
import { property, customElement } from "lit/decorators.js";
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
let KioskQueryLayouter = class KioskQueryLayouter extends KioskAppComponent {
    constructor() {
        super(...arguments);
        this.assignedPages = [];
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
    }
    apiRender() {
        console.log("render kioskquerylayouter");
        return html `
            <div class="kiosk-query-layouter">
                <sl-tab-group>
                    ${this.assignedPages.map(q => html `
                        <sl-tab slot="nav" panel="${q[0]}">${q[1]}</sl-tab>
                    `)}
                    ${this.assignedPages.map(q => html `
                        <sl-tab-panel name="${q[0]}"><slot name="${q[0]}"></slot></sl-tab-panel>
                    `)}
                </sl-tab-group>
                <slot></slot>
            </div>
        `;
    }
};
KioskQueryLayouter.styles = unsafeCSS(local_css);
KioskQueryLayouter.properties = {
    ...(void 0).properties
};
__decorate([
    property()
], KioskQueryLayouter.prototype, "assignedQueries", void 0);
KioskQueryLayouter = __decorate([
    customElement('kiosk-query-layouter')
], KioskQueryLayouter);
export { KioskQueryLayouter };
//# sourceMappingURL=kioskquerylayouter.js.map
//# sourceMappingURL=kioskquerylayouter.js.map
//# sourceMappingURL=kioskquerylayouter.js.map