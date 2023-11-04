// @ts-ignore
import local_css from './styles/component-structuredkioskquery.sass?inline'
import {DateTime} from "luxon"
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { css, html, nothing, TemplateResult, unsafeCSS } from "lit";
import { property, state, query ,customElement } from "lit/decorators.js";
import { Constant, AnyDict, ApiResultKioskQuery, KioskQueryInstance } from "./lib/apitypes";
import {
    Dictionary,
    UISchema,
    UISchemaLayoutElement,
    UISchemaLookupProvider,
    UISchemaLookupSettings, UISchemaUIElement,
// @ts-ignore
} from "ui-component";
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column-group.js';
import '@vaadin/grid/vaadin-grid-filter-column.js';
import '@vaadin/grid/vaadin-grid-selection-column.js';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import '@vaadin/grid/vaadin-grid-tree-column.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js'

// @ts-ignore
import {ComboBoxDataProviderParams, ComboBoxDataProvider} from '@vaadin/combo-box'
// @ts-ignore
import { ComboBoxDataProviderCallback } from "@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin";
import { getLatinDate, handleCommonFetchErrors } from "./lib/applib";
import { Grid, GridDataProviderCallback, GridDataProviderParams, GridSorterDefinition } from "@vaadin/grid";

import { columnBodyRenderer, columnHeaderRenderer, GridColumnBodyLitRenderer } from "@vaadin/grid/lit";
import { FetchException } from "../kioskapplib/kioskapi";
import { consume } from "@lit-labs/context";
import { constantsContext } from "./constantscontext";
import { DictionaryAccessor } from "./lib/dictionaryAccessor";
import { DataContext } from "./lib/datacontext";
import { InterpreterFactory } from "./lib/interpreterfactory";
import { InterpreterManager } from "../kioskapplib/interpretermanager";

@customElement('structured-kiosk-query')
export class StructuredKioskQuery extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    overall_record_count: number = -1

    private dataContext: DataContext = new DataContext()
    private _interpreter: InterpreterManager

    get interpreter() {
        return this._interpreter
    }

    static properties = {
        ...super.properties
    }

    @property()
    public queryDefinition: KioskQueryInstance

    @state()
    uiSchema: UISchema

    @state()
    _inputData: AnyDict

    @query('#grid')
    private grid!: Grid;

    @state()
    data: ApiResultKioskQuery | null = null

    @consume({context: constantsContext})
    @state()
    private constants?: Constant[]

    constructor() {
        super();
        registerStyles('vaadin-grid', css`
      :host [part~="header-cell"] ::slotted(vaadin-grid-cell-content), [part~="footer-cell"] ::slotted(vaadin-grid-cell-content), [part~="reorder-ghost"] {
        font-weight: bold
      }
    `)
    }
    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    private assignConstants() {
        if (this.constants) {
            const accessor = new DictionaryAccessor("dictionary", this.dataContext, this.constants)
            accessor.assignEntries(this.constants)
            this.dataContext.registerAccessor(accessor)
            console.log("applied constants: ", this.constants)
            this._interpreter = InterpreterFactory(this.dataContext)
        }
    }

    apiLookupProvider(id:string , lookupSettings: UISchemaLookupSettings, params: ComboBoxDataProviderParams, callback: ComboBoxDataProviderCallback<any>) {
        console.log(id, lookupSettings)
        this.apiContext.fetchFromApi("", "lookup", {
            method: "POST",
            caller: "structuredKioskQuery.apiLookupProvider",
            body: JSON.stringify (lookupSettings)
        })
        .then((data: any) => {
            if ('result_msg' in data && data.result_msg !== "ok") {
                console.log(`Error: `, data);
                callback([],0)
            }
            else {
                console.log(data)
                callback(data.records, data.record_count)
            }
        })
        .catch((e: Error) => {
            handleCommonFetchErrors(this, <FetchException> e, "structuredKioskQuery.apiLookupProvider", null);
            callback([],0)
        });
    }

    async fetchQueryResults(params: {
        page: number;
        pageSize: number;
        searchTerm: string;
        sortOrders: GridSorterDefinition[];
    }):Promise<[[AnyDict]|[], number]> {
        const apiData = {
            "query_id": this.queryDefinition.id,
            "inputs": this._inputData
        }
        const urlfetchParams = new URLSearchParams()
        urlfetchParams.append("page_size", params.pageSize.toString())
        urlfetchParams.append("page", params.page.toString())
        try {
            const data = await this.apiContext.fetchFromApi("", "kioskquery", {
                method: "POST",
                caller: "structuredKioskQuery.fetchQueryResults",
                body: JSON.stringify(apiData)
            }, "v1",
                urlfetchParams)
            if ('result_msg' in data && data.result_msg !== "ok") {
                console.log(`Error: `, data);
                return [null, 0]
            } else {
                this.data = data
                console.log(this.data)
                return [data.records, this.data.overall_record_count]
            }
        }
        catch(e) {
            handleCommonFetchErrors(this, e, "structuredKioskQuery.fetchQueryResults", null);
            return [[],0]
        }
    }

    private dataProvider = async (
        params: GridDataProviderParams<AnyDict>,
        callback: GridDataProviderCallback<AnyDict>
    ) => {
        const { page, pageSize, sortOrders } = params;
        console.log("params", params)
        if (this._inputData) {
            const rc = await this.fetchQueryResults({
                page: page + 1,
                pageSize: pageSize,
                sortOrders: sortOrders,
                searchTerm: ""
            })
            let data, count
            [data, count] = rc
            if (count > 0 || page == 0) {
                this.overall_record_count = count
                this.requestUpdate()
                console.log('no records found.')
            }
            console.log("over_all_count:", this.overall_record_count)
            console.log("first line:", data[0])
            callback(data, this.overall_record_count);
        } else callback([], 0)
    };

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        this.assignConstants()
        const ui: any = this.renderRoot.querySelector("#ui");
        (<UISchemaLookupProvider>ui.lookupProvider) = this.apiLookupProvider.bind(this)
        ui.dataProvider = (exp: string, id: string) => {
            console.log(`request for data: ${exp} ${id}`)
            const i_result = this.interpreter.interpret(exp)
            return i_result || exp
        }
        ui.uiSchema = this.uiSchema
    }

    getQueryUiSchema(elements: Dictionary<UISchemaUIElement>) {
        this.uiSchema = {
            header: { version: 1 },
            dsd: <any>this.queryDefinition.ui["dsd"],
            layout_settings: {
                orchestration_strategy: "stack",
            },
            meta: {
                scenario: "query-ui"
            },
            ui_elements: {
                "query_fields": {
                    "element_type": <UISchemaLayoutElement>{
                        "name": "layout",
                        "layout_settings": {
                            "orchestration_strategy": "stack"
                        },
                        "ui_elements": elements
                    }
                },
                "query_ui_controls": {
                    "element_type": <UISchemaLayoutElement> {
                        "name": "layout",
                        "layout_settings": {
                            "orchestration_strategy": "stack"
                        },
                        "ui_elements": {
                            "line": {
                                "element_type": {
                                    "name": "line"
                                }
                            },
                            "buttons": {
                                "element_type": {
                                    "name": "layout",
                                    "layout_settings": {
                                        "orchestration_strategy": "rightalign"
                                    },
                                    "ui_elements": {
                                        "start": {
                                            "element_type": {
                                                "name": "button",
                                                "type": "iconButton",
                                                "icon": "",
                                                "extra_style": "padding: 2px 2px 0px 0px"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    willUpdate(_changedProperties: any) {
        if (_changedProperties.has("queryDefinition") && this.queryDefinition) {
            //translate and amened the query definition into a correct UISchema here.
            this.getQueryUiSchema(this.queryDefinition.ui["ui_elements"])
            console.log(this.uiSchema)
        }
    }

    queryUIChanged(event: CustomEvent) {

        if (event.detail.srcElement === "start") {
            this.overall_record_count = -1
            this._inputData = event.detail.newData
            // this.fetchQueryResults()
            this.grid?.clearCache();
        }
    }

    private isIdentifier(dsdName: string) {
        const colInfo = <AnyDict>this.data.document_information.columns[dsdName]
        return ("identifier" in colInfo && colInfo["identifier"])
    }

    private getColumnLabel(dsdName: string) {
        const colInfo = <AnyDict>this.data.document_information.columns[dsdName]
        return "label" in colInfo?colInfo["label"]:dsdName
    }

    private gotoIdentifier(event: MouseEvent) {
        const cell = <HTMLDivElement>event.currentTarget
        const identifier = cell.getAttribute("data-identifier")
        const colName = cell.getAttribute("data-column")
        const colInfo = <AnyDict>this.data.document_information.columns[colName]
        const tableName = colInfo["table"]
        const fieldName = colInfo["field"]
        const identifierEvent = new CustomEvent("identifierClicked",
            {
                "detail": {
                    "dsdName": fieldName,
                    "tableName": tableName,
                    "identifier": identifier
                    },
                bubbles: true}
        );
        this.dispatchEvent(identifierEvent);
    }

    private getFormattedCellValue(rowElement: any, colInfo: AnyDict) {
        const dataType = colInfo["datatype"]
        switch (dataType) {
            case "date":
                try {
                    return getLatinDate(DateTime.fromISO(rowElement), false)
                } catch {
                    return ""
                }
            case "datetime":
                try {
                    return getLatinDate(DateTime.fromISO(rowElement), true)
                } catch {
                    return ""
                }
        }
        return rowElement
    }

    private cellRenderer:GridColumnBodyLitRenderer<AnyDict> = (row, model, column) => {
        const dsdName = column.getAttribute("data-column")
        const colInfo = <AnyDict>this.data.document_information.columns[dsdName]
        const cellValue = this.getFormattedCellValue(row[dsdName], colInfo)
        // const format = this
        if (this.isIdentifier(dsdName)) {
            return html`
                <div class="identifier" data-column=${dsdName} data-identifier="${row[dsdName]}" 
                     @click="${this.gotoIdentifier}">
                    ${cellValue}
                </div>`
        } else {
            return html`
                <div>
                    ${cellValue}
                </div>`
        }
    }

    private headerRenderer(col: HTMLElement) {
        return html`<div>${this.interpreter.interpret(this.getColumnLabel(col.getAttribute("data-column")),undefined,"/")}</div>`
    }

    renderQueryResult() {
        // if (!(this.data.result_msg === "ok")) {
        //     return html`An error occured: ${this.data.result_msg}`
        // }
        // console.log(this.data)
        return html`
        <vaadin-grid id="grid" .dataProvider="${this.dataProvider}" theme="no-border">
            ${this.data?this.data.document_information.column_order.map((col: string) => html`
                    <vaadin-grid-column 
                                        data-column="${col}"
                                        ${columnHeaderRenderer(this.headerRenderer, [])}
                                        ${columnBodyRenderer(this.cellRenderer, [])}></vaadin-grid-column>
                `
            ):html`<vaadin-grid-column></vaadin-grid-column>`}
            
        </vaadin-grid>`
    }



    apiRender(): TemplateResult {
        return html`
            <div class="kiosk-query-ui">
                <ui-component id="ui" @dataChanged="${this.queryUIChanged}"></ui-component>
            </div>
            <div class="kiosk-query-results">
                ${(!this._inputData)?nothing:this.renderQueryResult()}
                ${(!this._inputData || this.overall_record_count != 0)?nothing:html`
                    <div class="no-records"><div><i></i>Sorry, your query yielded no results.</div></div>`}
            </div>
        `;
    }

}

