var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// @ts-ignore
import local_css from './styles/component-queryselector.sass?inline';
import { html, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { handleCommonFetchErrors, } from "./lib/applib";
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { KioskQueryFactory } from "./kioskqueryfactory";
import { SCENARIO } from "./apptypes";
let KioskQuerySelector = class KioskQuerySelector extends KioskAppComponent {
    constructor() {
        super(...arguments);
        this.showLocalProgress = false;
        this.loadingMessage = '';
        this.kioskQueries = [];
    }
    firstUpdated(_changedProperties) {
        console.log("KioskQuerySelector first updated", _changedProperties);
        super.firstUpdated(_changedProperties);
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext")) {
            if (this.apiContext) {
                this.loadQueries();
            }
        }
    }
    loadQueries() {
        console.log(`loading queries`);
        this.loadingMessage = 'loading queries ...';
        this.showLocalProgress = true;
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append("uic_literal", SCENARIO);
        this.apiContext.fetchFromApi("", "kioskquery", {
            method: "GET",
            caller: "kioskqueryselector.loadQueries"
        }, "v1", urlSearchParams)
            .then((data) => {
            if ('result_msg' in data && data.result_msg !== "ok") {
                console.log(`Error: `, data);
            }
            else {
                this.showQueries(data);
            }
        })
            .catch((e) => {
            handleCommonFetchErrors(this, e, "kioskqueryselector.loadQueries", null);
        });
    }
    showQueries(kioskQueries) {
        this.showLocalProgress = false;
        kioskQueries.forEach(query => console.log(query));
        this.kioskQueries = kioskQueries;
    }
    overlayClicked() {
        this.tryClose();
    }
    connectedCallback() {
        super.connectedCallback();
        console.log("query selector connected callback");
    }
    tryClose(selectedQuery = null) {
        const event = new CustomEvent("close", selectedQuery ? { "detail": selectedQuery } : {});
        this.dispatchEvent(event);
    }
    selectQuery(e) {
        if (!(e.currentTarget instanceof HTMLDivElement)) {
            return;
        }
        const element = e.currentTarget;
        let kioskQuery = this.kioskQueries.find(q => q.id === element.id);
        this.tryClose(kioskQuery);
    }
    renderQueryItem(query) {
        return html `
            <div id="${query.id}" 
                 class="kiosk-query" 
            @click="${this.selectQuery}">
                <i class="fas">${KioskQueryFactory.getTypeIcon(query.type)}</i>
                <div class="kiosk-query-text">
                    <div>${query.name}</div>
                    <div>${query.description}</div>
                </div>
            </div>
        `;
    }
    apiRender() {
        return html `
            <div class="query-selector-overlay" @click=${this.overlayClicked}></div>
            <div class="query-selector">
                ${this.showLocalProgress ? this.renderProgress(true) : html `
                    <div class="kiosk-query-selector-title-bar" @click="${this.tryClose}">
                        <i class="fas fa-xmark"></i>
                    </div>
                    <div class="kiosk-query-selector-headline">
                        <i class="fas fa-query"></i>
                        <h2 >Choose your way to search and query</h2>
                    </div>
                `}
                <div id="kiosk-query-list">
                    ${this.kioskQueries.map(query => this.renderQueryItem(query))}
                </div>
            </div>
            
        `;
    }
    renderProgress(force = false) {
        let htmlBar = super.renderProgress(force);
        return htmlBar ? html `${htmlBar}
        <div class="loading-message">${this.loadingMessage}</div>` : html ``;
    }
};
KioskQuerySelector.styles = unsafeCSS(local_css);
KioskQuerySelector.properties = {
    ...(void 0).properties
};
__decorate([
    state()
], KioskQuerySelector.prototype, "showLocalProgress", void 0);
__decorate([
    state()
], KioskQuerySelector.prototype, "loadingMessage", void 0);
__decorate([
    state()
], KioskQuerySelector.prototype, "kioskQueries", void 0);
KioskQuerySelector = __decorate([
    customElement('kiosk-query-selector')
], KioskQuerySelector);
export { KioskQuerySelector };
//# sourceMappingURL=kioskqueryselector.js.map