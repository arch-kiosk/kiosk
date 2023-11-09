import { KioskApp } from "../kioskapplib/kioskapp";
import { nothing, unsafeCSS } from "lit";
import { html, literal } from "lit/static-html.js";
import {provide} from '@lit-labs/context'
import {constantsContext} from './constantscontext'
import { property, state } from "lit/decorators.js";
import "./kioskqueryselector.ts";
import "./selectidentifierpopup.ts";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";


setBasePath("/sl_assets");

// import local_css from "/src/static/logviewerapp.sass?inline";
// @ts-ignore
import local_css from "./styles/component-queryandviewapp.sass?inline";
import { AnyDict, Constant, ApiResultKioskQueryDescription, KioskQueryInstance,
    ApiResultContextsFull,ApiResultContextsFullIdentifierInformation } from "./lib/apitypes";
import { KioskViewDetails, KioskViewInstance } from "./apptypes";
import { KioskQueryFactory } from "./kioskqueryfactory";
import { nanoid } from "nanoid";
import "./kioskquerylayouter.ts";
import { KioskQueryLayouter } from "./kioskquerylayouter";
import { KioskView } from "./kioskview";
import { fowlerNollVo1aHashModern, handleCommonFetchErrors } from "./lib/applib";
import { FetchException } from "../kioskapplib/kioskapi";
import { identifierInfoContext } from "./identifierinfocontext";

export class QueryAndViewApp extends KioskApp {
    static styles = unsafeCSS(local_css);
    _messages: { [key: string]: object } = {};

    static properties = {
        ...super.properties,
    };

    // noinspection JSUnresolvedReference
    @state()
    // @ts-ignore
    inSelectQueryMode = false //!import.meta.env.DEV;

    @state()
    inGotoIdentifierMode = false

    @state()
    queries: KioskQueryInstance[] = [];

    @state()
    views: Map<string, KioskViewInstance> = new Map();

    @state()
    selectQueryTab: string | null = null;

    @provide({context: constantsContext})
    @state()
    constants: Array<Constant> = []

    @provide({context: identifierInfoContext})
    @state()
    private identifierInfo: Array<ApiResultContextsFullIdentifierInformation> = [];

    private recordTypeAliases: {[key: string]: string} = { }

    constructor() {
        super();
    }

    firstUpdated(_changedProperties: any) {
        console.log("App first updated.");
        super.firstUpdated(_changedProperties);
    }

    getRecordTypeAliases() {
        this.recordTypeAliases = { }
        for (const constant of this.constants) {
            if (constant.path === "glossary") {
                let v  = constant.value
                if (Array.isArray(v)) v = v[0]
                this.recordTypeAliases[constant.key] = v
            }
        }
    }

    fetchConstants() {
        this.showProgress = true
        this.apiContext.fetchFromApi(
            "",
            "constants",
            {
                method: "GET",
                caller: "app.fetchConstants",
            })
            .then((json: object) => {
                console.log("constants fetched");
                this.showProgress = false
                this.constants = json as Constant[]
                this.getRecordTypeAliases()
                return this.apiContext.fetchFromApi(
                    "",
                    "contexts/full",
                    {
                        method: "GET",
                        caller: "app.fetchConstants",
                    })
            })
            .then((json: ApiResultContextsFull) => {
                this.identifierInfo = json.identifiers
                console.log("identifier information fetched", this.identifierInfo);
            })
            .catch((e: FetchException) => {
                this.showProgress = false
                // handleFetchError(msg)
                handleCommonFetchErrors(this, e, "loadConstants", null);
            });
    }

    apiConnected() {
        console.log("api is connected");
        this.fetchConstants();
    }

    protected reloadClicked(e: Event) {
        // let el = this.shadowRoot.getElementById("workstation-list")
        // el.shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
        //     bubbles: true,
        //     cancelable: false,
        // }))
        // this.inSelectQueryMode = !this.inSelectQueryMode
        this.requestUpdate();
    }

    protected selectQueryClicked(e: Event) {
        if (!this.inSelectQueryMode) {
            this.inSelectQueryMode = true;
        }
    }

    protected selectGoToClicked(e: Event) {
        if (!this.inGotoIdentifierMode) {
            this.inGotoIdentifierMode = true;
        }
    }

    protected queryModeClosed(e: CustomEvent) {
        if (e.detail) {
            this.openQuery(e.detail);
        }
        this.inSelectQueryMode = false;

    }

    protected identifierPopupClosed(e: CustomEvent) {
        this.inGotoIdentifierMode = false;
        if (e.detail) {
            const identifierEvent = new CustomEvent("identifierClicked",
                {
                    "detail": {
                        "dsdIdentifierFieldName": e.detail.dsdName,
                        "tableName": e.detail.tableName,
                        "identifier": e.detail.identifier,
                    },
                    bubbles: true,
                },
            );
            this.onGotoIdentifier(identifierEvent);
        }
    }

    protected openQuery(kioskQuery: ApiResultKioskQueryDescription) {
        const queryTag = KioskQueryFactory.getKioskQueryTag(kioskQuery.type);
        if (queryTag) {
            let query = { uid: nanoid(), ...kioskQuery };
            this.queries.push(query);
            this.requestUpdate();
            this.updateComplete.then(() => {
                let layouter = <KioskQueryLayouter>this.shadowRoot.getElementById("query-layout");
                layouter.selectPage(query.uid);
            });
        }
    }

    private gotoIdentifier(event: MouseEvent) {
        const idClicked = (event.currentTarget as HTMLElement).id
        if (idClicked === "btGoto") {
            var exp = this.renderRoot.querySelector("#devIdentifier") as HTMLInputElement
            var tableName = exp.value.split("/")[0]
            var identifier = exp.value.split("/")[1]
            var fieldName: string = "arch_context";
        } else
        {
            var cell = <HTMLSpanElement>event.currentTarget;
            var identifier: string = cell.dataset.identifier;
            var tableName: string = cell.dataset.tableName;
            var fieldName: string = cell.dataset.fieldName;
        }

        const identifierEvent = new CustomEvent("identifierClicked",
            {
                "detail": {
                    "dsdIdentifierFieldName": fieldName,
                    "tableName": tableName,
                    "identifier": identifier,
                },
                bubbles: true,
            },
        );
        this.onGotoIdentifier(identifierEvent);
    }

    private onGotoIdentifier(event: CustomEvent) {

        let viewDetails = <KioskViewDetails>event.detail;
        // @ts-ignore
        // if (import.meta.env.DEV) {
        //     alert(viewDetails.tableName + "." + viewDetails.dsdIdentifierFieldName + ": " + viewDetails.identifier);
        // }

        const viewId = KioskView.getViewId(viewDetails);
        if (!this.views.has(viewId)) {
            let view: KioskViewInstance = { viewId: viewId, details: { ...viewDetails } };
            this.views.set(viewId, view);
            this.requestUpdate();
            this.updateComplete.then(() => {
                let layouter = <KioskQueryLayouter>this.shadowRoot.getElementById("view-layout");
                layouter.selectPage(view.viewId);
            });
        }
    }

    protected renderToolbar() {
        return html`
            <div class="toolbar">
                <div id="toolbar-left">
                    <div class="toolbar-button" @click="${this.selectQueryClicked}">
                        <i class="fas fa-query"></i>
                    </div>
                    ${this.identifierInfo.length > 0?html`
                    <div class="toolbar-button footstep-toolbar-button" @click="${this.selectGoToClicked}">
                        <i class="fas fa-footsteps"></i>
                    </div>`:nothing}
                </div>
                <div id="toolbar-buttons">
                    <div style="display:none" class="toolbar-button" @click="${this.reloadClicked}">
                        <i class="fas fa-window-restore"></i>
                    </div>
                    <div class="toolbar-button" @click="${this.reloadClicked}">
                        <i class="fas fa-reload"></i>
                    </div>
                </div>
                <div></div>
            </div>`;
    }

    renderQueryMode() {
        return html`
            <kiosk-query-selector
                id="kiosk-query-selector"
                .apiContext="${this.apiContext}"
                @closeSelection="${this.queryModeClosed}"
                style="display:${this.inSelectQueryMode ? "block" : "none"}"
            >
            </kiosk-query-selector>`;
    }

    renderGotoIdentifierMode() {
            return html`
                <select-identifier-popup
                    id="select-identifier-popup"
                    .apiContext="${this.apiContext}"
                    .shown="${this.inGotoIdentifierMode}"
                    .recordTypeAliases="${this.recordTypeAliases}"
                    @closeSelection="${this.identifierPopupClosed}"
                    style="display:${this.inGotoIdentifierMode ? "block" : "none"}"
                >
                </select-identifier-popup>`;
    }

    renderQuery(query: KioskQueryInstance) {
        return html`
            <${KioskQueryFactory.getKioskQueryTag(query.type)}
                id="${query.uid}"
                .apiContext="${this.apiContext}"
                .queryDefinition="${query}"
                slot="${query.uid}"
            >

            </${KioskQueryFactory.getKioskQueryTag(query.type)}>`;
    }

    renderView(view: KioskViewInstance) {
        return html`
            <kiosk-view
                id="${view.details.tableName}${String(fowlerNollVo1aHashModern(view.viewId))}"
                .apiContext="${this.apiContext}"
                .viewDetails="${view.details}"
                @goto-identifier="${this.onGotoIdentifier}"
                slot="${view.viewId}">
            </kiosk-view}>`;
    }

    onCloseQuery(e: CustomEvent) {
        const queryId = e.detail;
        const idx = this.queries.findIndex((q) => q.uid === queryId);
        this.queries.splice(idx, 1);
        this.requestUpdate();
    }

    onCloseView(e: CustomEvent) {
        const viewId = e.detail;
        this.views.delete(e.detail);
        this.requestUpdate();
    }

    renderLayout() {
        return html`
            <kiosk-query-layouter id="query-layout"
                                  .apiContext="${this.apiContext}"
                                  .assignedPages="${this.queries.map((q) => [q.uid, q.name])}"
                                  @close="${this.onCloseQuery}"
                                  @identifierClicked="${this.onGotoIdentifier}"
                                  style="display:${this.inSelectQueryMode ||this.inGotoIdentifierMode ? "none" : "block"}"
            >
                ${this.queries.map((query) => this.renderQuery(query))}
            </kiosk-query-layouter>
            <div class="splitter"></div>
            <kiosk-query-layouter id="view-layout"
                                  .apiContext="${this.apiContext}"
                                  .assignedPages="${[...this.views.values()].map((view) => [
                                      view.viewId,
                                      (import.meta as any).env.VITE_MODE === 'DEVELOPMENT' ? view.viewId : view.details.identifier])}"
                                  @close="${this.onCloseView}"
                                  @identifierClicked="${this.onGotoIdentifier}"
                                  style="display:${this.inSelectQueryMode ||this.inGotoIdentifierMode ? "none" : "block"}"
            >
                ${[...this.views.values()].map((view) => this.renderView(view))}
            </kiosk-query-layouter>`;
    }

    // apiRender is only called once the api is connected.
    apiRender() {
        let dev = html``;
        // @ts-ignore
        if (import.meta.env.DEV) {
            dev = html`
                <div>
                    <div class="logged-in-message">logged in! Api is at ${this.apiContext.getApiUrl()}</div>
                    <div class="dev-tool-bar"><label>Open identifier:</label>
                        <span class="dev-open-identifier"
                              data-identifier="LA"
                              data-table-name="unit"
                              data-field-name="arch-context"
                              @click="${this.gotoIdentifier}">LA</span>
                        <span class="dev-open-identifier"
                              data-identifier="D"
                              data-table-name="unit"
                              data-field-name="arch-context"
                              @click="${this.gotoIdentifier}">D</span>
                        <span class="dev-open-identifier"
                              data-identifier="PVD"
                              data-table-name="site"
                              data-field-name="arch-context"
                              @click="${this.gotoIdentifier}">PVD</span>
                        <label for="identifier">identifier:</label><input class="dev-open-identifier-input" id="devIdentifier" name="devIdentifier" type="text"/>
                        <button id="btGoto" @click="${this.gotoIdentifier}">Go</button>
                    </div>
                </div>`;
        }
        let toolbar = this.renderToolbar();
        const app = this.constants && this.constants.length > 0?html`${this.renderQueryMode()}${this.renderGotoIdentifierMode()}${this.renderLayout()}`:nothing
        return html`${dev}${toolbar}${app}`;
    }
}

window.customElements.define("queryandview-app", QueryAndViewApp);
