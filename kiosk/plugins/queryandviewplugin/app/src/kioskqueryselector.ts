// @ts-ignore
import local_css from "./styles/component-queryselector.sass?inline";
import { html, TemplateResult, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { handleCommonFetchErrors } from "./lib/applib";
import { Constant, ApiResultKioskQueryDescription } from "./lib/apitypes";
import { FetchException } from "../kioskapplib/kioskapi";
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { KioskQueryFactory } from "./kioskqueryfactory";
import { QUERY_UI_SCENARIO } from "./apptypes";
import { consume } from "@lit-labs/context";
import { constantsContext } from "./constantscontext";
import { DataContext } from "./lib/datacontext";
import { DictionaryAccessor } from "./lib/dictionaryAccessor";
import { InterpreterFactory } from "./lib/interpreterfactory";
import { InterpreterManager } from "../kioskapplib/interpretermanager";

@customElement("kiosk-query-selector")
export class KioskQuerySelector extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties,
    };
    private dataContext: DataContext = new DataContext()
    private _interpreter: InterpreterManager

    @state()
    protected showLocalProgress = false;
    @state()
    protected loadingMessage = "";

    @state()
    protected kioskQueries: ApiResultKioskQueryDescription[] = [];

    @consume({context: constantsContext})
    @state()
    private constants?: Constant[]

    firstUpdated(_changedProperties: any) {
        console.log("KioskQuerySelector first updated", _changedProperties);
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("apiContext")) {
            if (this.apiContext) {
                this.loadQueries();
            }
        }
    }

    private assignConstants() {
        if (this.constants.length > 0 && !this.dataContext.hasAccessor("dictionary"))  {
            const accessor = new DictionaryAccessor("dictionary", this.dataContext, this.constants)
            accessor.assignEntries(this.constants)
            this.dataContext.registerAccessor(accessor)
            console.log("KioskQuerySelector applied constants: ", this.constants)
            this._interpreter = InterpreterFactory(this.dataContext)
        }
    }

    loadQueries() {
        console.log(`loading queries`);
        this.loadingMessage = "loading queries ...";
        this.showLocalProgress = true;
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append("uic_literal", QUERY_UI_SCENARIO);
        this.apiContext
            .fetchFromApi(
                "",
                "kioskquery",
                {
                    method: "GET",
                    caller: "kioskqueryselector.loadQueries",
                },
                "v1",
                urlSearchParams,
            )
            .then((data: any) => {
                if ("result_msg" in data && data.result_msg !== "ok") {
                    console.log(`Error: `, data);
                } else {
                    this.showQueries(data);
                }
            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this, e, "kioskqueryselector.loadQueries", null);
            });
    }

    initQueries() {
        for (const query of this.kioskQueries) {
                query.name = this._interpreter.interpret(query.name,undefined,"/")
        }
    }

    showQueries(kioskQueries: ApiResultKioskQueryDescription[]) {
        if (this.constants)
            this.assignConstants()
        this.showLocalProgress = false;
        // kioskQueries.forEach((query) => console.log(query));
        this.kioskQueries = kioskQueries;
        this.initQueries()
    }

    overlayClicked() {
        this.tryClose();
    }

    connectedCallback() {
        super.connectedCallback();
    }
    tryClose(selectedQuery: ApiResultKioskQueryDescription = null) {
        const event = new CustomEvent("closeSelection", selectedQuery ? {
            detail: selectedQuery } : { detail: null });
        this.dispatchEvent(event);
    }

    selectQuery(e: PointerEvent) {
        if (!(e.currentTarget instanceof HTMLDivElement)) {
            return;
        }
        const element = <HTMLDivElement>e.currentTarget;
        let kioskQuery = this.kioskQueries.find((q) => q.id === element.id);
        this.tryClose(kioskQuery);
    }
    protected renderQueryItem(query: ApiResultKioskQueryDescription) {
        return html`
            <div id="${query.id}" class="kiosk-query" @click="${this.selectQuery}">
                <i class="fas">${KioskQueryFactory.getTypeIcon(query.type)}</i>
                <div class="kiosk-query-text">
                    <div>${query.name}</div>
                    <div>${this._interpreter.interpret(query.description,undefined,"/")}</div>
                </div>
            </div>
        `;
    }

    apiRender(): TemplateResult {
        return html`
            <div class="query-selector-overlay" @click=${this.overlayClicked}></div>
            <div class="query-selector">
                ${this.showLocalProgress || !this.constants
                    ? this.renderProgress(true)
                    : html`
                          <div class="kiosk-query-selector-title-bar" @click="${this.overlayClicked}">
                              <i class="fas fa-xmark"></i>
                          </div>
                          <div class="kiosk-query-selector-headline">
                              <i class="fas fa-query"></i>
                              <h3>Choose your way to search and query</h3>
                          </div>
                      `}
                <div id="kiosk-query-list">${this.kioskQueries.map((query) => this.renderQueryItem(query))}</div>
            </div>
        `;
    }

    renderProgress(force: boolean = false): TemplateResult {
        let htmlBar = super.renderProgress(force);
        return htmlBar
            ? html`${htmlBar}
                  <div class="loading-message">${this.loadingMessage}</div>`
            : html``;
    }
}
