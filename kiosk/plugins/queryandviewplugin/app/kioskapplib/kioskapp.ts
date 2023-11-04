// import { html, css, LitElement } from '/node_modules/lit';
import { html, LitElement, TemplateResult } from "lit";
import { API_STATE_ERROR, API_STATE_READY } from "./kioskapi";

export abstract class KioskApp extends LitElement {
    // @ts-ignore
    kiosk_base_url = import.meta.env.VITE_KIOSK_BASE_URL;
    appErrors: any[];
    apiContext: any;
    showProgress: boolean;

    static properties = {
        /**
         * The Api Context
         */
        apiContext: { type: Object },
        appErrors: { type: Array },
        showProgress: { type: Boolean },
    };

    protected constructor() {
        super();
        this.appErrors = [];
        this.apiContext = undefined;
        this.showProgress = false;
    }

    protected onAppMessage(e: CustomEvent) {
        console.log(`Unhandled AppMessage received`, e.detail)
        this.addAppError(e.detail.headline + '<br>' + e.detail.body)
    }

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
        this.addEventListener("send-message", this.onAppMessage)
    }

    updated(_changedProperties: any) {
        if (_changedProperties.has("apiContext")) {
            this.showProgress = false;
            if (this.apiContext && this.apiContext.status === API_STATE_ERROR) {
                this.addAppError("Cannot connect to Kiosk API.");
            }
            if (!_changedProperties["apiContext"] && this.apiContext) {
                this.apiConnected()
            }
        }
    }
    apiConnected() {
        //only for overrides
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
            <style>
                .system-message {
                    border-style: solid;
                    border-width: 2px;
                    padding: 2px 1em;
                    position: relative;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #882501, #bb3302);
                    color: #fabc02;
                }
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 5px;
                    width: 100vw;
                    background-color: black;
                }
                .loading-progress {
                    height: 5px;
                    width: 100%;
                    border-radius: 3px;
                    background: linear-gradient(
                        90deg,
                        red 0%,
                        yellow 15%,
                        lime 30%,
                        cyan 50%,
                        blue 65%,
                        magenta 80%,
                        red 100%
                    );
                    background-size: 200%;
                    animation: move-gradient 2s ease-in infinite;
                }
                @keyframes move-gradient {
                    0% {
                        background-position: 0% 0%;
                    }
                    100% {
                        background-position: -200% 0%;
                    }
                }
            </style>
            <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" />
            ${this.renderProgress()} ${this.renderErrors()} ${renderedHtml}
        `;
    }

    renderNoContextYet(): TemplateResult {
        // noinspection HtmlUnknownTarget
        return html` <link rel="stylesheet" href="${this.kiosk_base_url}static/styles.css" /> `;
    }
    renderApiError(): TemplateResult {
        return undefined;
    }

    renderErrors(): TemplateResult {
        if (this.appErrors.length > 0) {
            return html` ${this.appErrors.map((error) => html`<div class="system-message" @click="${this.errorClicked}">${error}</div>`)} `;
        } else return undefined;
    }

    errorClicked(e: MouseEvent) {
        console.log(e)
        this.deleteError((<HTMLDivElement>e.target).textContent)
    }

    renderProgress(force = false): TemplateResult {
        if (force || this.showProgress)
            return html` <div class="loading">
                <div class="loading-progress"></div>
            </div>`;
        else return undefined;
    }

    addAppError(error: string) {
        this.appErrors.push(error);
        this.requestUpdate();
    }

    deleteError(error: string) {
        let foundIndex = -1;
        this.appErrors.find((apiErr, index) => {
            if (apiErr === error) {
                foundIndex = index;
                return true;
            } else return false;
        });
        if (foundIndex > -1) {
            this.appErrors.splice(foundIndex, 1);
            this.appErrors = [...this.appErrors];
            // this.requestUpdate();
        }
    }
}
