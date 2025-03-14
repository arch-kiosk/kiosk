// @ts-ignore
import local_css from './styles/component-kioskview.sass?inline'
// @ts-ignore
import 'ui-component'
import { KioskViewDetails } from "./apptypes";
import { customElement, state } from "lit/decorators.js";
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { css, html, nothing, TemplateResult, unsafeCSS } from "lit";
import {constantsContext} from "./constantscontext";
import {timeZoneInfoContext} from "./timezoneinfocontext";
import {consume} from "@lit/context";

import { ApiKioskViewListLayout, ApiResultKioskView, Constant } from "./lib/apitypes";
import { property } from "lit/decorators.js";
import {
    UISchema,
    ApiTimeZoneInfo,
    UIComponent,
// @ts-ignore
} from "ui-component"
import { FetchException } from "../kioskapplib/kioskapi";
import { handleCommonFetchErrors } from "./lib/applib";

import { KioskViewDocument } from "./lib/kioskviewdocument";
import { DataContext } from "./lib/datacontext";
import { DictionaryAccessor } from "./lib/dictionaryAccessor";
import { DSDRecordAccessor } from "./lib/dsdrecordaccessor";
import { KioskViewGroupPart } from "./lib/kioskviewgrouppart";
// import { InterpreterManager } from "../kioskapplib/interpretermanager";
// import { SymbolicDataReferenceInterpreter } from "../kioskapplib/symbolicdatareferenceinterpreter";
// import { Template } from "ejs";
import { ImageDescriptionAccessor } from "./lib/imagedescriptionsaccessor";
import { KioskTimeZones } from "../../../../../../../kiosktsapplib";

// @ts-ignore
const DEVELOPMENT = (import.meta as unknown).env.VITE_MODE === 'DEVELOPMENT'

@customElement('kiosk-view')
export class KioskView  extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    static getViewId(viewDetails: KioskViewDetails): string {
        const dsdIdentifierFieldName = (viewDetails.hasOwnProperty("dsdIdentifierFieldName") && viewDetails.dsdIdentifierFieldName !== "")?viewDetails.dsdIdentifierFieldName:"arch_context"
        return `view:${viewDetails.tableName}|${dsdIdentifierFieldName}|${viewDetails.identifier}`
    }

    static properties = {
        ...super.properties
    }

    @state()
    private viewDocument: KioskViewDocument | null = null

    @state()
    private uiSchema: UISchema

    @property()
    public viewDetails: KioskViewDetails

    @property()
    public stickyTop: number = 50

    @state()
    loadingMessage = "";

    @state()
    showLocalProgress = false;

    @state()
    localError = "";

    @consume({context: constantsContext})
    @state()
    private constants?: Constant[]

    @consume({context: timeZoneInfoContext})
    @state()
    private timeZoneInfo?: KioskTimeZones

    private dataContext: DataContext = new DataContext()

    private _groupParts: { [groupName: string]: KioskViewGroupPart[] } = {}

    private _intersectionObserver: IntersectionObserver;

    private _onNextViewUpdate: Function = undefined


    constructor() {
        super();
        //I think this a relict:
        // const sdrInterpreter = new SymbolicDataReferenceInterpreter((exp: string) => {this.dataContext.get(exp)})
    }

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    willUpdate(_changedProperties: any) {
        // if (_changedProperties.has("viewDocument") && this.viewDocument) {
        //     //builds the UI Schema
        //     this.loadUI()
        // }
    }

    public bookmarkTop(topOffset: number = 0) {
        const bookmark = this.renderRoot.querySelector(".view-bookmark") as HTMLDivElement
        console.log("getBoundingClientRect", this.getBoundingClientRect())
        bookmark.style.top = `${this.getBoundingClientRect().top * -1 + topOffset}px`
    }

    public restoreBookmark() {
        const bookmark = this.renderRoot.querySelector(".view-bookmark") as HTMLDivElement

        if (bookmark && parseInt(bookmark.style.top) != 0) {
            setTimeout(() => {
                bookmark.scrollIntoView()
                },0)
        }
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        console.log("updated: ", _changedProperties)
        if (_changedProperties.has("apiContext") || _changedProperties.has("viewDetails")) {
            this.viewDocument = undefined
            if (this.apiContext) {
                this.dataContext = new DataContext()
                this._groupParts = {}
                this.fetchViewFromApi();
            }
        } else {
            if (_changedProperties.has("viewDocument") && !!this.viewDocument) {
                this.assignUIs()
                this.observeMainGroupHeader();
            } else {
                if (_changedProperties.has("_intersectionObserver")) {
                    console.log("intersection observer changed")
                    this.observeMainGroupHeader();
                }
            }
        }
        if (this._onNextViewUpdate && this.viewDocument !== undefined) {
            const func = this._onNextViewUpdate.bind(this)
            this._onNextViewUpdate = undefined
            func()
        }
    }

    private observeMainGroupHeader() {
        const mainGroup = this.findPartByRecordType(this.viewDocument.recordType);
        if (mainGroup) {
            const groupHeaderElement = this.shadowRoot.querySelector(`.part-header[data-part-id="${mainGroup.partId}"]`);
            console.log("main group is ", mainGroup, groupHeaderElement);
            if (this._intersectionObserver) {
                this._intersectionObserver.disconnect();
                this._intersectionObserver = undefined;
            }
            if (!this._intersectionObserver && groupHeaderElement) {
                this._intersectionObserver = new IntersectionObserver((entries) => {
                    let el: HTMLElement = this.shadowRoot.querySelector(`.fixed-part-header[data-part-id="${mainGroup.partId}"]`);
                    if (el) {
                        if (entries[0].isIntersecting) {
                            el.style.display = "none";
                        } else {
                            if (entries[0].boundingClientRect.top < this.stickyTop) {
                                el.style.display = "block";
                                el.style.top = `${this.stickyTop}px`;
                            } else {
                                console.log(`fixed-part-header: boundingClientRect.top > ${this.stickyTop}`, entries[0]);
                            }
                        }
                    } else {
                        console.warn("observeMainGroupHeader: fixed-part-header not found")
                    }
                }, {
                    root: null,
                    rootMargin: "20px",
                    threshold: 1.0,
                });
                this._intersectionObserver.observe(groupHeaderElement);
            }
        } else {
            console.warn("observeMainGroupHeader: main group not found")
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect()
            this._intersectionObserver = undefined
        }
    }

    fetchViewFromApi() {

        console.log(`loading view ${this.viewDetails.tableName} / ${this.viewDetails.identifier}`);
        this.loadingMessage = "loading view ...";
        this.showLocalProgress = true;
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append("identifier", this.viewDetails.identifier);
        this.apiContext
            .fetchFromApi(
                "queryandview",
                `view/${this.viewDetails.tableName}`,
                {
                    method: "GET",
                    caller: "kioskview.fetchViewFromApi",
                },
                "v1",
                urlSearchParams,
            )
            .then((data: any) => {
                this.loadingMessage = "";
                this.showLocalProgress = false;
                if ("result_msg" in data && data.result_msg !== "ok") {
                    console.log(`Error fetching view data in fetchViewFromApi: `, data);
                    this.localError = data.result_msg
                } else {
                    this.loadViewDocument(data)
                }
            })
            .catch((e: FetchException) => {
                this.loadingMessage = "";
                this.showLocalProgress = false;
                handleCommonFetchErrors(this, e, "KioskView.fetchViewFromApi", null);
            });

    }
    
    loadViewDocument(data: ApiResultKioskView) {
        if (!Object.prototype.hasOwnProperty.call(data, "document")) {
            this.localError = "loadViewDocument: the server responded with an empty or invalid response."
        }
        if (DEVELOPMENT) {
            console.log('received ApiResult: ', data["document"])
        }
        const viewDocument = new KioskViewDocument()
        try {
            viewDocument.dataContext = this.dataContext
            viewDocument.load(data.document)
            // this.requestUpdate()
        } catch (e) {
            this.localError = `loadViewDocument: the server responded with an invalid document: ${e}`
        }
        this.preprocessAsyncData(viewDocument).then(() => {
            this.viewDocument = viewDocument

            console.log("assigning constants")
            this.assignConstants()
            this.assignBasicDataContext()
            this.assignLore()
            this.assignFileDescriptions()
        })
    }

    private async addTimeZonesFromTable(viewDocument: KioskViewDocument, table: string, tzFieldNames: Array<string>) {
        if (Object(viewDocument.getData()).hasOwnProperty(table)) {
            const data = viewDocument.getData()[table]
            const colNames = data[0]
            const timeZoneFieldIndexes = tzFieldNames.map(fieldName => colNames.findIndex(x => x === fieldName))
            if (timeZoneFieldIndexes.length > 1) {
                for (let n=1; n<data.length; n++) {
                    for (let idx of timeZoneFieldIndexes) {
                        await this.timeZoneInfo.cacheLocally(data[n][idx])
                    }
                }
            }
        }
    }

    private async preprocessTimeZones(viewDocument: KioskViewDocument) {
        for (const t of viewDocument.dsd.list_tables()) {
            const tzFields = viewDocument.dsd.get_fields_with_datatype(t, "tz")
            if (tzFields.length > 0) {
                await this.addTimeZonesFromTable(viewDocument,t, tzFields)
            }
        }
        console.log("preprocessTimeZones", this.timeZoneInfo.getLocalCache())
    }

    private async preprocessAsyncData(viewDocument: KioskViewDocument) {
        await this.preprocessTimeZones(viewDocument)
    }

    private assignConstants() {
        if (this.constants) {
            const accessor = new DictionaryAccessor("dictionary", this.dataContext, this.constants)
            accessor.assignEntries(this.constants)
            this.dataContext.registerAccessor(accessor)
            console.log("applied constants: ", this.constants)
        }
    }

    private assignLore() {
        if (this.viewDocument.dsd) {
            for (const table of this.viewDocument.dsd.get_lore_tables(this.viewDetails.tableName)) {
                const recordAccessor = new DSDRecordAccessor(
                    table,
                    this.dataContext,
                    {
                        fields: this.viewDocument.getData()[table][0],
                        record: this.viewDocument.getData()[table][1]
                    },
                    this.viewDocument.types[table])
                this.dataContext.registerAccessor(recordAccessor)
            }
        }
    }

    private assignFileDescriptions() {
        const descriptions = this.viewDocument.getImageDescriptions()
        if (descriptions) {
            const accessor = new ImageDescriptionAccessor("imagedescriptions", this.dataContext, descriptions)
            this.dataContext.registerAccessor(accessor)
            console.log("applied image descriptions: ", descriptions)
        }
    }

    private assignBasicDataContext() {
        const data = this.viewDocument.getData()[this.viewDetails.tableName]
        if (data.length < 2) {
            return
        }
        const recordAccessor = new DSDRecordAccessor(
            this.viewDetails.tableName,
            this.dataContext,
            {
                fields: data[0],
                record: data[1]
            },
            this.viewDocument.types[this.viewDetails.tableName])
        this.dataContext.registerAccessor(recordAccessor)
    }

    loadUI(part: KioskViewGroupPart):UISchema {
        const layout = part.layout
        return {
            header: { version: 1 },
            dsd: this.viewDocument.getDSD(),
            layout_settings: {...layout.layout_settings, "readonly": true},
            meta: {
                scenario: "view"
            },
            ui_elements: part.layout.ui_elements
        }
    }

    public async goto(options: {recordType?: string, uid?:string} = {}) {
        let targetElement = this.parentElement
        let navDone = false
        await this.updateComplete
        this._onNextViewUpdate = () => {
            setTimeout(() => {
                if (options.hasOwnProperty("recordType") && options["recordType"] != "") {
                    this.gotoRecordType(options).then((result) => {
                        if (!result) {
                            console.log("gotoRecordType failed")
                            var rect = this.getBoundingClientRect();
                            if (!(
                                rect.top >= 0 &&
                                rect.top <= (window.innerHeight || document.documentElement.clientHeight)
                            )) {
                                this.parentElement.style.scrollMarginTop = "200px"
                                this.parentElement.scrollIntoView()
                            }
                        }
                    })
                }
                this.requestUpdate("_intersectionObserver")
            },200)
        }
        this.requestUpdate()
    }

    public async gotoRecordType(options: any): Promise<boolean> {
        let scrollTo: Element
        let partUIElement: UIComponent
        const part = this.findPartByRecordType(options.recordType)

        if (part) {
            const partElement = this.renderRoot.querySelector(`#part-body-${part.cssPartId}`)
            if (partElement) {
                scrollTo = partElement

                if (part.expandable) {
                    console.log("gotoRecordType, opening ", part)
                    if (!part.opened)
                        part.toggleOpen()
                    this.requestUpdate("_intersectionObserver")
                }
                if (options.hasOwnProperty("uid")) {
                    partUIElement = partElement.querySelector("ui-component")
                }
            }
        }
        if (scrollTo) {
            await this.updateComplete
            if (partUIElement) {
                try {
                    if (partUIElement.gotoRecord(options.uid)) {
                        console.log("gotoRecordType, UIComponent.gotoRecord succeeded")
                        return true
                    } else {
                        console.log("gotoRecordType, UIComponent.gotoRecord failed")
                    }
                } catch (e) {
                    console.log("gotoRecordType, error in gotoRecord: ", e)
                }
            }
            scrollTo.scrollIntoView()
            return true
        } else {
            return false
        }
    }

    private findPart(partId: string) {
        for (const g of Object.values(this._groupParts)) {
            const idx = g.findIndex(x => x.partId === partId)
            if (idx > -1)
                return g[idx]
        }
        return undefined
    }

    findPartByRecordType(recordType: string) {
        for (const g of Object.values(this._groupParts)) {
            const idx = g.findIndex(x => x.recordType === recordType)
            if (idx > -1)
                return g[idx]
        }
        return undefined
    }

    getGroupParts(groupId: string) {
        if (!this._groupParts[groupId])
            this._groupParts[groupId] = this.viewDocument.getParts(groupId)

        return this._groupParts[groupId]

    }

    fetchFileFromApi(uuidFile: string, resolution: string): Promise<Blob> {

        let fetchParams = new URLSearchParams({
            uuid: uuidFile,
            resolution: resolution
        })

        return this.apiContext
            .fetchBlobFromApi(
                "",
                `files/file`,
                {
                    method: "GET",
                    caller: "kioskview.fetchFileFromApi",
                },
                "v1",
                fetchParams,
            )
    }

    assignUIs() {
        for (const group of this.viewDocument.getGroups()) {
            const parts = this.getGroupParts(group[0])
            parts.forEach( part => {
                try {
                    if (!part.recordMissing) {
                        //That's already done by render...Group
                        // const partDataContext = this.setDataContextforPart(part)
                        console.log(`part ${part.partId} data context:`, part.dataContext)
                        const ui: UIComponent = this.renderRoot.querySelector(`#ui-${part.cssPartId}`);
                        if (!ui) {
                            console.log(`Part ${part.partId} has no UIComponent with id #ui-${part.cssPartId}`)
                        } else {
                            ui.dataProvider = (exp: string, id: string) => {
                                return part.resolveDataRequest(exp, id)
                            }

                            ui.timeZoneInfoProvider = (tzIndex: number|undefined): ApiTimeZoneInfo => {
                                if (this.timeZoneInfo) {
                                    let rc = this.timeZoneInfo.getTimeZoneInfoFromLocalCache(tzIndex)
                                    console.log(`access to time zone ${tzIndex}: ${rc}`)
                                    return rc
                                }
                                else {
                                    console.error("access to TimeZoneInfo but time zones was not ready")
                                }

                            }

                            ui.moveToNextRow = (lastUID: string) => part.moveToNextRow(lastUID)
                            ui.setSortOrder = (sortOrder: string[]) => {
                                console.log("settings sort order to ", sortOrder)
                                part.createSortOrder(this.viewDocument, sortOrder)
                                part.orderRecords()
                            }
                            //todo: Need to use the proper type UIComponentFileFetchParams from uicomponent  here
                            ui.fetchFileProvider = (params: any) => {
                                console.log("FetchFileProvider",params)
                                this.fetchFileFromApi(params.uuid, params.resolution)
                                    .then((blob: Blob) => {
                                        console.log(`file back for uuid ${params.uuid}`)
                                        params.reportURL(URL.createObjectURL(blob))
                                    })
                                    .catch((e: FetchException) => {
                                        console.log(`no file for ${params.uuid}`)
                                        params.reportURL(null)
                                        if (e.response?.status != 404) {
                                            handleCommonFetchErrors(this, e, "fetchFileProvider", null)
                                        }
                                    })
                                // setTimeout(() => {
                                //     // params.reportURL("/block2.png")
                                //
                                // }, 2000)
                            }
                            ui.uiSchema = this.loadUI(part)
                            ui.showDevelopmentInfo = DEVELOPMENT
                            ui.addEventListener("goto-identifier", (event: CustomEvent) => {
                                event.preventDefault()
                                event.stopPropagation()

                                const newEvent = part.getGotoIdentifierEvent(this.viewDocument.dsd, event.detail.fieldId, event.detail.identifier)
                                this.dispatchEvent(newEvent);
                            })
                        }
                    }
                } catch (e) {
                    console.log(`Error initializing UIComponent for part ${part.partId}: ${e}`)
                }
            })
        }
    }

    renderPart(part: KioskViewGroupPart):TemplateResult {
        if (part.recordMissing && part.layout.on_record_missing === "message") {
         return html`<div class="missing-record-message"><i></i> Sorry, but there is no available data of this type</div>`
        } else {
            return html`
                <ui-component id="ui-${part.cssPartId}"></ui-component>`
        }
    }

    expandHeader(event: Event) {
        const header = event.currentTarget as HTMLDivElement
        const partId = header.dataset["partId"]
        const part = this.findPart(partId)
        if (part) {
            if (part.expandable) {
                part.toggleOpen()
                this.requestUpdate()
            }
        }
    }

    scrollToViewTop(event: Event) {
        this.parentElement.style.scrollMarginTop="100px"
        this.parentElement.scrollIntoView({ behavior: "smooth" })
        // const header = event.currentTarget as HTMLDivElement
        // const partId = header.dataset["partId"]
        // const elHeader = this.shadowRoot.querySelector(`.part-header[data-part-id="${partId}"]`)
        // elHeader.parentElement.scrollIntoView({ behavior: "smooth" })
    }

    renderStackedPartHeader(part: KioskViewGroupPart) {
        let { maxHeight, buttonMode } = part.getPartExpansionSettings();
        let expandIcon = undefined
        if (buttonMode)
            expandIcon = buttonMode=="close" ? html`<i></i>` : html`<i></i>`;

        return html`<div data-part-id=${part.partId} class="part-header" @click="${part.expandable?this.expandHeader:nothing}">
            <span>${part.text}</span>
            ${part.expandable?expandIcon:nothing}
        </div>
        <div data-part-id=${part.partId} class="fixed-part-header" @click="${this.scrollToViewTop}">
            <i class="fas fa-angles-up"></i><span>${part.text}</span>
        </div>`
    }

    renderPartBody(part: KioskViewGroupPart) {
        let { maxHeight, buttonMode } = part.getPartExpansionSettings();
        const htmlPartId = "part-body-" + part.cssPartId
        return html`<div id="${htmlPartId}" data-max-height="${maxHeight}" 
                         class="part-body" style="${buttonMode==="open"?'max-height:' + maxHeight:nothing}">
            ${this.renderPart(part)}
            </div>`
    }

    renderStackedGroup(groupId: string): TemplateResult {
        const parts = this.getGroupParts(groupId).filter(p => p.initDataContextForPart(this.viewDocument))
        // parts.forEach( p => this.setDataContextforPart(p))
        return html`
            <div class="view-group stacked">
                ${parts.map(part => html`
                    <div class="view-part stacked">
                        ${this.renderStackedPartHeader(part)}
                        ${this.renderPartBody(part)}
                    </div>
                `)}        
            </div>`
    }

    renderAccordionPartHeader(part: KioskViewGroupPart) {
        let { maxHeight, buttonMode } = part.getPartExpansionSettings();
        let expandIcon = undefined
        if (buttonMode)
            expandIcon = buttonMode=="close" ? html`<i></i>` : html`<i></i>`;

        return html`<div data-part-id=${part.partId} class="accordion-part-header" @click="${part.expandable?this.expandHeader.bind(this):nothing}">
            <div>${part.text}</div>
            <div>${part.expandable?expandIcon:nothing}</div>
        </div>`
    }

    renderAccordionPartBody(part: KioskViewGroupPart) {
        let { maxHeight, buttonMode } = part.getPartExpansionSettings();
        const htmlPartId = "part-body-" + part.cssPartId
        let cssStyle =  "max-height: " + (maxHeight || "100vh")
        cssStyle = cssStyle + (buttonMode === 'open'?';display:none':'')
        return html`
            <div id="${htmlPartId}"
                 style="${cssStyle}"
                 class="part-body">
                ${this.renderPart(part)}
            </div>`
    }

    renderAccordionGroup(groupId: string): TemplateResult {
        const parts = this.getGroupParts(groupId).filter(p => p.initDataContextForPart(this.viewDocument))
        // parts.forEach( p => this.setDataContextforPart(p))
        return html`
            <div class="view-group stacked">
                ${parts.map(part => html`
                    <div class="view-part stacked">
                        ${this.renderAccordionPartHeader(part)}
                        ${this.renderAccordionPartBody(part)}
                    </div>
                `)}
            </div>`
    }

    renderGroups(): TemplateResult {
        const groups = this.viewDocument.getGroups()
        if (this.dataContext && this.dataContext.ids.find(x => x === this.viewDetails.tableName)) {
            return html`
                <div class="view-bookmark"></div>
                <div class="kiosk-view">
                    ${groups.map(group => html`
                        ${group[1] === "stacked"
                            ? this.renderStackedGroup(group[0])
                            : (group[1] === "accordion"
                                ? this.renderAccordionGroup(group[0])
                                : html`unknown group type`)}
                    `)}
                </div>`
        } else {
            return html`<div class="missing-record-message"><i></i> Sorry, but there is no data available</div>`
        }
    }

    apiRender(): TemplateResult {
        if (!this.localError) {
            return html`
                ${this.showLocalProgress || !this.viewDocument
                    ? this.renderProgress(true)
                    : this.renderGroups()}
            `;
        } else return this.renderLocalError()
    }

    renderProgress(force: boolean = false): TemplateResult {
        let htmlBar = super.renderProgress(force);
        return htmlBar
            ? html`${htmlBar}
                  <div class="loading-message">${this.loadingMessage}</div>`
            : html``;
    }

    renderLocalError(): TemplateResult {
        return html`<div class="local-error">${this.localError}</div>`;
    }

}