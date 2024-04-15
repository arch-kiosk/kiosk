// @ts-ignore
import local_css from "./styles/component-selectidentifier.sass?inline";
import { html, nothing, PropertyValues, TemplateResult, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ApiResultKioskQueryDescription, ApiResultContextsFullIdentifierInformation, AnyDict } from "./lib/apitypes";
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { consume } from "@lit/context";
import { DataContext } from "./lib/datacontext";
import { InterpreterManager } from "../kioskapplib/interpretermanager";
import { identifierInfoContext } from "./identifierinfocontext";

@customElement("select-identifier-popup")
export class SelectIdentifierPopup extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties,
    };
    private dataContext: DataContext = new DataContext()
    private _interpreter: InterpreterManager
    private firstRenderDone = false

    private searchTerm = ""
    // @state()
    // protected showLocalProgress = false;
    // @state()
    // protected loadingMessage = "";
    @state()
    private displayLines: Array<ApiResultContextsFullIdentifierInformation> = []

    @state()
    protected kioskQueries: ApiResultKioskQueryDescription[] = [];

    @consume({context: identifierInfoContext, subscribe: true})
    @state()
    private identifierInfo?: Array<ApiResultContextsFullIdentifierInformation>=[]

    @property()
    shown: boolean

    @property()
    recordTypeAliases: {[key: string]: string} = { }


    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("shown") && this.shown) {
            const inputField: HTMLInputElement = this.renderRoot.querySelector("#input-identifier")
            inputField.focus();
        }
    }

    overlayClicked() {
        this.tryClose();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    tryClose(detail: object = null) {
        const event = new CustomEvent("closeSelection", { detail: detail });
        this.dispatchEvent(event);
    }

    getRecordTypeAlias(recordType: string) : string {
        const t =  this.recordTypeAliases[recordType]
        return t?t:recordType.replace("_", " ")
    }

    private gotoIdentifier(event: MouseEvent) {
        const cell = <HTMLDivElement>event.currentTarget
        const identifier = cell.getAttribute("data-identifier")
        const tableName = cell.getAttribute("data-table")
        const fieldName = cell.getAttribute("data-field")


        this.tryClose(
            {
                "dsdName": fieldName,
                "tableName": tableName,
                "identifier": identifier
            }
        );
    }

    async searchIdentifiers() {
        const MAX_LINES=30
        const searchTerm = this.searchTerm.toLowerCase()
        let result: Array<ApiResultContextsFullIdentifierInformation>|undefined
        const identifierInfo = this.identifierInfo
        if (!this.identifierInfo ||this.identifierInfo.length == 0) return

        function _search(cmpFunc: (x:ApiResultContextsFullIdentifierInformation)=>boolean): Boolean {
            result = []
            for (const x of identifierInfo) {
                if (result.length > MAX_LINES) break
                if (cmpFunc(x))
                    result.push(x)
            }
            return (result.length <= MAX_LINES)
        }


        if (_search((x:ApiResultContextsFullIdentifierInformation) => x.identifier.toLowerCase().indexOf(searchTerm) > -1)) {
            this.displayLines = result
            return
        }
        if (_search((x:ApiResultContextsFullIdentifierInformation) => x.identifier.toLowerCase().startsWith(searchTerm))) {
            this.displayLines = result
            return
        }
        if (_search((x:ApiResultContextsFullIdentifierInformation) => x.identifier.toLowerCase() === searchTerm)) {
            this.displayLines = result
            return
        }
    }

    searchTermChanged(event: InputEvent) {
        const inputElement = <HTMLInputElement> event.target
        this.searchTerm = inputElement.value
        this.searchIdentifiers()
        console.log(this.recordTypeAliases)
    }



    renderIdInfo(idInfo: ApiResultContextsFullIdentifierInformation) {
        return html`
            <div class="identifier" 
                         data-identifier="${idInfo.identifier}" 
                         data-table="${idInfo.record_type}" 
                         data-field="${idInfo.field}" 
                         @click="${this.gotoIdentifier}">${idInfo.identifier}</div>
            <div class="record-type">
                ${this.getRecordTypeAlias(idInfo.record_type)}
            </div>`
    }

    apiRender(): TemplateResult {
        return html`
            <div class="query-selector-overlay" @click=${this.overlayClicked}></div>
                <div class="select-identifier-popup-content">
                    <div class="kiosk-query-selector-title-bar" @click="${this.overlayClicked}">
                        <i class="fas fa-xmark"></i>
                    </div>
                    <div class="kiosk-query-selector-headline">
                        <i class="fas fa-footsteps"></i>
                        <h3>Search and Select an Archaeological Identifier</h3>
                    </div>
                    <div class="identifier-search-area">
                        <label for="input-identifier">search for</label>
                        <input name="input-identifier" id="input-identifier" type="text" value="${this.searchTerm}" 
                               @input="${this.searchTermChanged}"/>
                    </div>
                    <div class="identifier-list-area">
                        ${this.displayLines.map((idInfo) => this.renderIdInfo(idInfo))}
                    </div>
                </div>
        `;
    }

    // renderProgress(force: boolean = false): TemplateResult {
    //     let htmlBar = super.renderProgress(force);
    //     return htmlBar
    //         ? html`${htmlBar}
    //               <div class="loading-message">${this.loadingMessage}</div>`
    //         : html``;
    // }
}
