
// @ts-ignore
import local_css from './styles/component-fulltextkioskquery.sass?inline'
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { consume } from "@lit-labs/context";
import { constantsContext } from "./constantscontext";
import { property, state, query ,customElement } from "lit/decorators.js";
import { AnyDict, Constant } from "./lib/apitypes";
import { DictionaryAccessor } from "./lib/dictionaryAccessor";
import { InterpreterFactory } from "./lib/interpreterfactory";
import { GridSorterDefinition } from "@vaadin/grid";
import { handleCommonFetchErrors, handleErrorInApp } from "./lib/applib";
import { FetchException } from "../kioskapplib/kioskapi";
import { APIResultFTS, ApiResultKioskFTSHit } from "./apptypes";
import { MSG_ERROR, MSG_SEVERITY_ERROR } from "./lib/appmessaging";

@customElement('full-text-kiosk-query')
export class FullTextKioskQuery extends KioskAppComponent {
    static styles = unsafeCSS(local_css);
    static properties = {
        ...super.properties
    }

    @consume({context: constantsContext})
    @state()
    private constants?: Constant[]

    @state()
    private ftsResults: Array<ApiResultKioskFTSHit>;

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }
    willUpdate(_changedProperties: any) {
        // if (_changedProperties.has("queryDefinition") && this.queryDefinition) {
        //     //translate and amened the query definition into a correct UISchema here.
        //     this.getQueryUiSchema(this.queryDefinition.ui["ui_elements"])
        //     console.log(this.uiSchema)
        // }
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        setTimeout(() => (<HTMLInputElement>this.shadowRoot.querySelector("#search-term")).focus(),500)
    }

    prepareFTSResults(data: APIResultFTS) {
        for (const r of data.records) {
            const regexpFields1 = /(\[(?<field>.*?)##\])/gm
            const regexpFields2 = /(^(?<field>.*?)##\])/gm
            r.excerpt = r.excerpt.replace(regexpFields1, function(match: string, s: string, field: string) {
                return `<span class="fts-excerpt-field">${field}</span>`
            })
            r.excerpt = r.excerpt.replace(regexpFields2, function(match: string, s: string, field: string) {
                return `<span class="fts-excerpt-field">${field}</span>`
            })
        }
    }

    fetchFtsResults(searchTerm: string) {
        const urlFetchParams = new URLSearchParams()
        urlFetchParams.append("search_prompt", searchTerm)
        // urlfetchParams.append("limit", params.page.toString())
        try {
            this.apiContext.fetchFromApi("", "kioskfts", {
                    method: "GET",
                    caller: "fulltextkioskquery.fetchFtsResults",
                }, "v1",
                urlFetchParams)
                .then((data: APIResultFTS) => {
                    if ('result_msg' in data && data.result_msg !== "ok") {
                        console.log(`Error: `, data.result_msg);
                        handleErrorInApp(this, MSG_ERROR, data.result_msg, "fulltextKioskQuery.fetchFtsResults")
                    } else {
                        if ('result_msg' in data) {
                            this.prepareFTSResults(data)
                            this.ftsResults = data.records
                        } else {
                            console.log(`Error in fetchFtsResults: Kiosk was not able to come up with a search result   `)
                            handleErrorInApp(this, MSG_ERROR, "Kiosk was not able to come up with a search result", "fulltextKioskQuery.fetchFtsResults")
                        }
                    }
                })
                .catch((e: Error) => {
                    handleCommonFetchErrors(this, <FetchException> e, "fulltextKioskQuery.fetchFtsResults", null);
                });
        }
        catch(e) {
            handleCommonFetchErrors(this, e, "fulltextKioskQuery.fetchFtsResults", null);
        }
    }

    startSearch(e: Event) {
        e.preventDefault()
        const searchTerm = (<HTMLInputElement>this.shadowRoot.querySelector("#search-term")).value
        console.log(searchTerm)
        this.fetchFtsResults(searchTerm)
    }

    private gotoIdentifier(event: MouseEvent) {
        const cell = <HTMLDivElement>event.currentTarget
        const identifier = cell.getAttribute("data-identifier")
        const colRecordType = cell.getAttribute("data-record-type")
        const tableName = colRecordType
        // todo: this is a hack! The field name must come from Kiosk.
        const fieldName = "arch_context"
        const identifierEvent = new CustomEvent("identifierClicked",
            {
                "detail": {
                    "dsdName": fieldName,
                    "tableName": tableName,
                    "identifier": identifier
                },
                bubbles: true}
        );
        console.log(identifierEvent)
        this.dispatchEvent(identifierEvent);
    }

    renderFTSResultRecord(r : ApiResultKioskFTSHit) {
        return html`
            <div class="fts-meta">
                <div class="fts-identifier identifier" data-record-type="${r.identifier_record_type}" 
                     data-identifier="${r.identifier}" 
                    @click="${this.gotoIdentifier}">
                    <span>${r.identifier}</span><i class="fa fa-footsteps"></i>
                </div>
                <div class="fts-record-type">${r.record_type}</div>
            </div>
            <div class="fts-excerpt">${unsafeHTML(r.excerpt)}</div>
        `
    }
    renderSearchResults() {
        console.log(this.ftsResults)

        return html`
            <div class="kiosk-query-results">
                ${(this.ftsResults.length == 0)?html`
                    <div class="no-records"><div><i></i>Sorry, your query yielded no results.</div></div>`
                    :html`
                        <div class="fts-results">
                            <div class="fts-header">match info</div>
                            <div class="fts-header">excerpt</div>
                            ${this.ftsResults.map((result: ApiResultKioskFTSHit) => this.renderFTSResultRecord(result))}
                        </div>
                    `}
            </div>
        `;
    }

    apiRender(): TemplateResult {
        return html`
            <div class="kiosk-query-ui search-term">
                <i></i><input id="search-term" name="search-term" type="text" autofocus placeholder="Enter your search terms here" />
                <button class="start-search modal-round-button" @click="${this.startSearch}"><i></i></button>
            </div>
            <div class="result-count">
                ${this.ftsResults ? html`<span>${this.ftsResults.length} records found</span>` : nothing}
            </div>
            ${this.ftsResults ? this.renderSearchResults() : nothing}
        `;
    }

}