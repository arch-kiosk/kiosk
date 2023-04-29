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
// import { html, css, LitElement } from '/node_modules/lit';
import { html, LitElement } from "lit";
import { API_STATE_ERROR, API_STATE_READY } from "./kioskapi";
import { state } from "lit/decorators.js";
export class KioskAppComponent extends LitElement {
    constructor() {
        super();
        // @ts-ignore
        this.kiosk_base_url = import.meta.env.VITE_KIOSK_BASE_URL;
        this.showProgress = false;
        this.apiContext = undefined;
    }
    updated(_changedProperties) {
        if (_changedProperties.has("apiContext")) {
            this.showProgress = false;
            // if (this.apiContext && this.apiContext.status === API_STATE_ERROR) {
            //     this.addAppError("Cannot connect to Kiosk API.");
            // }
        }
    }
    render() {
        let renderedHtml;
        if (this.apiContext && this.apiContext.status === API_STATE_READY) {
            renderedHtml = this.apiRender();
        }
        else {
            if (this.apiContext && this.apiContext.status === API_STATE_ERROR)
                renderedHtml = this.renderApiError();
            else
                renderedHtml = this.renderNoContextYet();
        }
        // noinspection HtmlUnknownTarget
        return html `
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${renderedHtml}
        `;
    }
    renderNoContextYet() {
        // noinspection HtmlUnknownTarget
        return html ` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
    }
    renderApiError() {
        return undefined;
    }
    renderProgress(force = false) {
        if (force || this.showProgress)
            return html ` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
        else
            return undefined;
    }
}
KioskAppComponent.properties = {
    /**
     * The Api Context
     */
    apiContext: { type: Object },
};
__decorate([
    state()
], KioskAppComponent.prototype, "showProgress", void 0);
//# sourceMappingURL=kioskappcomponent.js.map
//# sourceMappingURL=kioskappcomponent.js.map
//# sourceMappingURL=kioskappcomponent.js.map