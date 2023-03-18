// @ts-ignore
import local_css from './styles/component-queryselector.sass?inline'
import { html, TemplateResult, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
    handleCommonFetchErrors,
} from "./lib/applib";
import {ApiResultKioskQueryDescription} from "./lib/apitypes"
import { FetchException } from "../kioskapplib/kioskapi";
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import {KioskQueryFactory} from "./kioskqueryfactory"
import {SCENARIO } from "./apptypes"

@customElement('kiosk-query-selector')
export class KioskQuerySelector extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties
    }

    @state()
    protected showLocalProgress = false
    @state()
    protected loadingMessage = ''
    @state()
    protected kioskQueries: ApiResultKioskQueryDescription[] = []

    firstUpdated(_changedProperties: any) {
        console.log("KioskQuerySelector first updated", _changedProperties)
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext") ) {
            if (this.apiContext ) {
                this.loadQueries()
            }
        }
    }

    loadQueries() {
        console.log(`loading queries`)
        this.loadingMessage = 'loading queries ...'
        this.showLocalProgress = true
        const urlSearchParams = new URLSearchParams()
        urlSearchParams.append("uic_literal", SCENARIO)
        this.apiContext.fetchFromApi("", "kioskquery",
            {
                method: "GET",
                caller: "kioskqueryselector.loadQueries"
            }, "v1",
            urlSearchParams
        )
            .then((data: any) => {
                if ('result_msg' in data && data.result_msg !== "ok") {
                    console.log(`Error: `, data)
                } else {
                    this.showQueries(data)
                }
            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this, e, "kioskqueryselector.loadQueries", null)
            })
    }

    showQueries(kioskQueries: ApiResultKioskQueryDescription[]) {
        this.showLocalProgress = false
        kioskQueries.forEach(query => console.log(query))
        this.kioskQueries = kioskQueries
    }

    overlayClicked() {
        this.tryClose()
    }

    connectedCallback() {

        super.connectedCallback()

    }
    tryClose(selectedQuery: ApiResultKioskQueryDescription = null) {
        const event = new CustomEvent("close", selectedQuery?{"detail": selectedQuery}:{})
        this.dispatchEvent(event)
    }

    selectQuery(e: PointerEvent) {
        if (!(e.currentTarget instanceof HTMLDivElement)) {
            return
        }
        const element = <HTMLDivElement>e.currentTarget
        let kioskQuery = this.kioskQueries.find(q => q.id === element.id)
        this.tryClose(kioskQuery)
    }
    protected renderQueryItem(query: ApiResultKioskQueryDescription) {
        return html`
            <div id="${query.id}" 
                 class="kiosk-query" 
            @click="${this.selectQuery}">
                <i class="fas">${KioskQueryFactory.getTypeIcon(query.type)}</i>
                <div class="kiosk-query-text">
                    <div>${query.name}</div>
                    <div>${query.description}</div>
                </div>
            </div>
        `
    }
    apiRender(): TemplateResult {
        return html`
            <div class="query-selector-overlay" @click=${this.overlayClicked}></div>
            <div class="query-selector">
                ${this.showLocalProgress?this.renderProgress(true):html`
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
            
        `
    }

    renderProgress(force: boolean = false): TemplateResult {
        let htmlBar = super.renderProgress(force);
        return htmlBar?html`${htmlBar}
        <div class="loading-message">${this.loadingMessage}</div>`:html``
    }
}

