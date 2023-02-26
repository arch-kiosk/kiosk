// import { html, css, LitElement } from '/node_modules/lit';
import { html, LitElement, TemplateResult } from "lit";
import { API_STATE_ERROR, API_STATE_READY } from "./kioskapi";
import { state } from "lit/decorators.js";

export abstract class KioskAppComponent extends LitElement {
    // @ts-ignore
    kiosk_base_url = import.meta.env.VITE_KIOSK_BASE_URL;
    apiContext: any;

    static properties = {
        /**
         * The Api Context
         */
        apiContext: { type: Object },
    };

    @state()
    protected showProgress: boolean = false

    protected constructor() {
        super();
        this.apiContext = undefined;
    }

    updated(_changedProperties: any) {
        if (_changedProperties.has("apiContext")) {
            this.showProgress = false;
            // if (this.apiContext && this.apiContext.status === API_STATE_ERROR) {
            //     this.addAppError("Cannot connect to Kiosk API.");
            // }
        }
    }
    abstract apiRender(): TemplateResult;

    render() {
        let renderedHtml;
        if (this.apiContext && this.apiContext.status === API_STATE_READY) {
            renderedHtml = this.apiRender();
        } else {
            if (this.apiContext && this.apiContext.status === API_STATE_ERROR) renderedHtml = this.renderApiError();
            else renderedHtml = this.renderNoContextYet();
        }
        // noinspection HtmlUnknownTarget
        return html`
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${renderedHtml}
        `;
    }

    renderNoContextYet(): TemplateResult {
        // noinspection HtmlUnknownTarget
        return html` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
    }
    renderApiError(): TemplateResult {
        return undefined;
    }

    renderProgress(force = false): TemplateResult {
        if (force || this.showProgress)
            return html` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
        else return undefined;
    }

}
