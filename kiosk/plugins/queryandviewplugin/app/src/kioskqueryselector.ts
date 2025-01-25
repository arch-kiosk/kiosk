// @ts-ignore
import local_css from "./styles/component-queryselector.sass?inline";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { handleCommonFetchErrors, handleErrorInApp } from "./lib/applib";
import { Constant, ApiResultKioskQueryDescription, ApiResultKioskQuery } from "./lib/apitypes";
import { FetchException } from "../kioskapplib/kioskapi";
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { KioskQueryFactory } from "./kioskqueryfactory";
import { QUERY_UI_SCENARIO } from "./apptypes";
import { consume } from "@lit/context";
import { constantsContext } from "./constantscontext";
import { DataContext } from "./lib/datacontext";
import { DictionaryAccessor } from "./lib/dictionaryAccessor";
import { InterpreterFactory } from "./lib/interpreterfactory";
import { InterpreterManager } from "../kioskapplib/interpretermanager";
import { MSG_ERROR } from "./lib/appmessaging";

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
                    handleErrorInApp(this, MSG_ERROR, "Kiosk reported an error when loading available queries", "KioskQuerySelector.loadQueries")
                } else {
                    try {
                        this.showQueries(data);
                    } catch(e) {
                        handleErrorInApp(this, MSG_ERROR, `Error on the client side when preparing available queries: ${e}`, "KioskQuerySelector.loadQueries")
                    }
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
        this.kioskQueries.sort(function (a: ApiResultKioskQueryDescription, b: ApiResultKioskQueryDescription) {
            let rc = 0
            rc = (Object.prototype.hasOwnProperty.call(a, "category") &&
                Object.prototype.hasOwnProperty.call(b, "category")) ? (a.category??"").localeCompare(b.category??"") : 0;
            if (!rc) {
                rc = (a.order_priority??"").localeCompare(b.order_priority??"");
                if (!rc) {
                    rc = (a.name??"").localeCompare(b.name??"")
                }
            } else {
                if (a.category === "-") rc = 1
                if (b.category === "-") rc = -1
            }

            return rc
        })
    }

    showQueries(kioskQueries: ApiResultKioskQueryDescription[]) {
        if (this.constants)
            this.assignConstants()
        this.showLocalProgress = false;
        // kioskQueries.forEach((query) => console.log(query));
        this.kioskQueries = kioskQueries;
        try {
            this.initQueries()
        } catch(e) {
            throw `Cannot init queries: ${e}`
        }
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

    protected renderQueryItem(query: ApiResultKioskQueryDescription, index: number) {
        let newCategory = ""
        if (index > 0 && this.kioskQueries[index-1].category !== query.category) {
            newCategory = query.category === "-"? "more queries": query.category
        } else if (index == 0) {
            newCategory = "most wanted"
        }
        return html`
            ${newCategory ? html`<div class="kiosk-query-category">${newCategory}</div>` : nothing}
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
                <div id="kiosk-query-list">${this.kioskQueries.map((query, index) => this.renderQueryItem(query, index))}</div>
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
