// @ts-ignore
import local_css from "./styles/component-queryselector.sass?inline";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { handleCommonFetchErrors, handleErrorInApp } from "./lib/applib";
import { Constant, ApiResultKioskQueryDescription, ApiResultKioskQuery } from "./lib/apitypes";
import { FetchException } from "@arch-kiosk/kiosktsapplib"
import { KioskAppComponent } from "@arch-kiosk/kiosktsapplib"
import { KioskQueryFactory } from "./kioskqueryfactory";
import { QUERY_UI_SCENARIO } from "./apptypes";
import { consume } from "@lit/context";
import { constantsContext } from "./constantscontext";
import { DataContext } from "./lib/datacontext";
import { DictionaryAccessor } from "./lib/dictionaryAccessor";
import { InterpreterFactory } from "./lib/interpreterfactory";
import { InterpreterManager } from "@arch-kiosk/kiosktsapplib"
import { MSG_ERROR } from "./lib/appmessaging";
import Cookies from "js-cookie"

export const COOKIE_KIOSKQNVQUERYFAVOURITES = "kioskQnVQueryFavourites"

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

    @property()
    protected queryFilter: string = "";

    @property()
    public autoSelect: string = "";  //if set the query selector will automatically select the query with this id and close. Only if the id does not exist will it stay open.

    @consume({context: constantsContext})
    @state()
    private constants?: Constant[]

    @query('#query-filter')
    elQueryFilter !: HTMLInputElement;

    async focusFilter() {
        await this.updateComplete
        console.log('queryFilter', this.elQueryFilter)
        setTimeout(()=>{this.elQueryFilter.focus({ preventScroll: true})}, 1000)
        // requestAnimationFrame(() => {
        //     this.elQueryFilter.focus();
        // });
    }

    firstUpdated(_changedProperties: any) {
        // console.log("KioskQuerySelector first updated", _changedProperties);
        super.firstUpdated(_changedProperties);
        this.focusFilter()
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
            // console.log("KioskQuerySelector applied constants: ", this.constants)
            this._interpreter = InterpreterFactory(this.dataContext)
        }
    }

    loadQueries() {
        // console.log(`loading queries`);
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
                        if (this.autoSelect) {
                            const selectQuery = this.autoSelect.toLowerCase()
                            const kioskQueries: ApiResultKioskQueryDescription[] = data
                            for (const q of kioskQueries) {
                                if (q.id.toLowerCase() === selectQuery) {
                                    this.tryClose(q)
                                    return
                                }
                            }
                        }
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
        // console.log(this.kioskQueries)
        for (const query of this.kioskQueries) {
            query.name = this._interpreter.interpret(query.name,undefined,"/")
            query.category = this._interpreter.interpret(query.category,undefined,"/")
        }
        this.applyFavourites()
        this.sortQueries()
    }

    sortQueries() {
        this.kioskQueries.sort(function (a: ApiResultKioskQueryDescription, b: ApiResultKioskQueryDescription) {
            let rc = 0
            const a_cat = (a.category??"") === "favourites"?" ":a.category
            const b_cat = (b.category??"") === "favourites"?" ":b.category
            rc = (a_cat && b_cat) ? a_cat.localeCompare(b_cat) : 0;
            if (!rc) {
                rc = (a.order_priority??"").localeCompare(b.order_priority??"");
                if (!rc) {
                    rc = (a.name??"").localeCompare(b.name??"")
                }
            } else {
                if (a_cat === "-") rc = 1
                if (b_cat === "-") rc = -1
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
        const kioskQuery = this.kioskQueries.find((q) => q.id === element.id);
        this.tryClose(kioskQuery);
    }

    toggleFavourite(q: ApiResultKioskQueryDescription) {
        let cookie = Cookies.get(COOKIE_KIOSKQNVQUERYFAVOURITES)
        let currentFavourites = cookie?JSON.parse(cookie):{}
        if (q.id in currentFavourites)
            delete currentFavourites[q.id]
        else
            currentFavourites[q.id] = q.category
        const newCookie = {
            name: COOKIE_KIOSKQNVQUERYFAVOURITES,
            value: JSON.stringify(currentFavourites),
            expires: 360, // Date.now() + 360 * 24 * 60 * 60 * 1000, //360 days
            path: "/",
        };
        Cookies.set(newCookie.name, newCookie.value, {expires: newCookie.expires, path: newCookie.path})

    }

    applyFavourites() {
        let cookie = Cookies.get(COOKIE_KIOSKQNVQUERYFAVOURITES)
        let currentFavourites = cookie?JSON.parse(cookie):{}
        const favIds = Object.keys(currentFavourites)
        this.kioskQueries.forEach(q => {
            if (q.id !== "fulltextquery") {
                if (favIds.includes(q.id)) {
                    if (q.category !== "favourites") {
                        q.original_category = q.category
                        q.category = "favourites"
                    }
                } else {
                    if (q.category === "favourites") {
                        q.category = q.original_category
                    }
                }
            }
        })
    }

    bookmarkQuery(e: PointerEvent) {
        if (!(e.currentTarget instanceof HTMLDivElement)) {
            return;
        }
        const element = <HTMLDivElement>e.currentTarget.parentElement;
        const kioskQuery = this.kioskQueries.find((q) => q.id === element.id);
        this.toggleFavourite(kioskQuery)
        this.applyFavourites()
        this.sortQueries()
        this.requestUpdate()
        e.stopPropagation()
    }

    protected renderQueryItem(query: ApiResultKioskQueryDescription, index: number) {
        let newCategory = ""
        let unchecked= html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/>
            </svg>`
        let checked= html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <path d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128zM192 112C183.2 112 176 119.2 176 128L176 515.2L293.4 437C309.5 426.3 330.5 426.3 346.6 437L464 515.2L464 128C464 119.2 456.8 112 448 112L192 112z"/>
        </svg>`

        if (index > 0 && this.kioskQueries[index-1].category !== query.category) {
            newCategory = query.category === "-" ? "more queries": query.category
        } else if (index == 0) {
            newCategory = "favourites"
        }
        return html`
            ${newCategory ? html`<div class="kiosk-query-category">${newCategory==='favourites'?'most wanted':newCategory}</div>` : nothing}
            <div id="${query.id}" class="kiosk-query" @click="${this.selectQuery}">
                <div class="kiosk-query-bookmark-div" @click="${this.bookmarkQuery}"><i class="fas">${KioskQueryFactory.getTypeIcon(query.type)}</i>
                    ${query.id === 'fulltextquery'?nothing:(query.category === "favourites"?unchecked:checked)}
                </div>
                <div class="kiosk-query-text">
                    <div>${query.name}</div>
                    <div>${this._interpreter.interpret(query.description,undefined,"/")}</div>
                </div>
            </div>
        `;
    }

    queryFilterChanged(e: Event) {
        this.queryFilter = (e.currentTarget as HTMLInputElement).value
    }

    apiRender(): TemplateResult {
        return html`
            <svg style="display:none">
                <symbol id="favourite-unchecked" viewBox="0 0 512 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                    <path d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128zM192 112C183.2 112 176 119.2 176 128L176 515.2L293.4 437C309.5 426.3 330.5 426.3 346.6 437L464 515.2L464 128C464 119.2 456.8 112 448 112L192 112z"/>
                </symbol>
                <symbol id="favourite-checked" viewBox="0 0 512 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                    <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/>
                </symbol>
            </svg>
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
                <div class="query-filter">
                    <label for="query-filter">filter queries by</label>
                    <input id="query-filter" autofocus name="query-filter" 
                                                 @input=${this.queryFilterChanged} type="text">
                </div>
                <div id="kiosk-query-list">${this.kioskQueries
                    .filter(query => this.queryFilter === "" ||
                        query.type === "FullTextKioskQuery" ||
                        (query.name + query.description).toLowerCase().includes(this.queryFilter.toLowerCase()),
                    )
                    .map((query, index) => this.renderQueryItem(query, index))}
                </div>
            </div>
        `;
    }

    renderProgress(force: boolean = false): TemplateResult {
        const htmlBar = super.renderProgress(force);
        return htmlBar
            ? html`${htmlBar}
                  <div class="loading-message">${this.loadingMessage}</div>`
            : html``;
    }
}
