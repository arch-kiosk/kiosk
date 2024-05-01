// @ts-ignore
// @ts-ignore
// noinspection CssUnresolvedCustomProperty

import local_css from "./styles/component-structuredkioskquery.sass?inline";
import { DateTime } from "luxon";
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { css, html, nothing, TemplateResult, unsafeCSS } from "lit";
import { property, state, query, customElement } from "lit/decorators.js";
import { Constant, AnyDict, ApiResultKioskQuery, KioskQueryInstance } from "./lib/apitypes";
import {
    Dictionary,
    UISchema,
    UISchemaLayoutElement,
    UISchemaLookupProvider,
    UISchemaLookupSettings, UISchemaUIElement,
// @ts-ignore
} from "ui-component";
import "@vaadin/grid";
import "@vaadin/grid/vaadin-grid-column-group.js";
import "@vaadin/grid/vaadin-grid-filter-column.js";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/grid/vaadin-grid-sort-column.js";
import "@vaadin/grid/vaadin-grid-tree-column.js";
import { registerStyles } from "@vaadin/vaadin-themable-mixin/register-styles.js";
import "@shoelace-style/shoelace/dist/components/menu/menu.js";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";
import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
import '@vaadin/select'

// @ts-ignore
import { ComboBoxDataProviderParams, ComboBoxDataProvider } from "@vaadin/combo-box";
// @ts-ignore
import { ComboBoxDataProviderCallback } from "@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin";
import { getLatinDate, handleCommonFetchErrors } from "./lib/applib";
import { Grid, GridDataProviderCallback, GridDataProviderParams, GridSorterDefinition } from "@vaadin/grid";

import { columnBodyRenderer, columnHeaderRenderer, GridColumnBodyLitRenderer } from "@vaadin/grid/lit";
import { FetchException } from "../kioskapplib/kioskapi";
import { consume } from "@lit/context";
import { constantsContext } from "./constantscontext";
import { DictionaryAccessor } from "./lib/dictionaryAccessor";
import { DataContext } from "./lib/datacontext";
import { InterpreterFactory } from "./lib/interpreterfactory";
import { InterpreterManager } from "../kioskapplib/interpretermanager";
import { SheetExport } from "./exporter";
// import { BarChart, PieChart } from "@toast-ui/chart";
import {
    refreshBarChart,
    refreshPieChart,
    RESULT_VIEW_TYPE_PIECHART,
    RESULT_VIEW_TYPE_BARCHART,
    getChartsByType, chartType2String,
} from "./structuredkioskquerycharts";

const RESULT_VIEW_TYPE_DATA = 1;
type ResultViewType = typeof RESULT_VIEW_TYPE_DATA | typeof RESULT_VIEW_TYPE_PIECHART | typeof RESULT_VIEW_TYPE_BARCHART

@customElement("structured-kiosk-query")
export class StructuredKioskQuery extends KioskAppComponent {

    static styles = unsafeCSS(local_css);

    overall_record_count: number = -1;

    private dataContext: DataContext = new DataContext();
    private _interpreter: InterpreterManager;

    get interpreter() {
        return this._interpreter;
    }

    static properties = {
        ...super.properties,
    };

    @property()
    public queryDefinition: KioskQueryInstance;

    @state()
    uiSchema: UISchema;

    @state()
    _inputData: AnyDict;

    @query("#grid")
    private grid!: Grid;

    @state()
    data: ApiResultKioskQuery | null = null;

    @consume({ context: constantsContext })
    @state()
    private constants?: Constant[];

    @state()
    private activeView: ResultViewType = RESULT_VIEW_TYPE_DATA;

    @state()
    private activeChart: AnyDict = {}

    constructor() {
        super();
        registerStyles("vaadin-grid", css`
            :host [part~="header-cell"] ::slotted(vaadin-grid-cell-content), [part~="footer-cell"] ::slotted(vaadin-grid-cell-content), [part~="reorder-ghost"] {
                font-weight: bold
            }
        `);
    }

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    private assignConstants() {
        if (this.constants) {
            const accessor = new DictionaryAccessor("dictionary", this.dataContext, this.constants);
            accessor.assignEntries(this.constants);
            this.dataContext.registerAccessor(accessor);
            console.log("applied constants: ", this.constants);
            this._interpreter = InterpreterFactory(this.dataContext);
        }
    }

    private assignInputs() {
        if (this._inputData) {
            const inputs = Object.keys(this._inputData).map(key => {
                return {
                    path: "/inputs",
                    key: key,
                    value: this._inputData[key]
                }
            })
            const accessor = new DictionaryAccessor("inputs", this.dataContext)
            accessor.setRootKey("/variables")
            // const accessor: DictionaryAccessor = <DictionaryAccessor> this.dataContext.getAccessor("dictionary")
            accessor.assignEntries(inputs)
            this.dataContext.deleteAccessorIfExists("inputs")
            this.dataContext.registerAccessor(accessor)
            console.log("applied inputs: ", inputs)
        }
    }

    apiLookupProvider(id: string, lookupSettings: UISchemaLookupSettings, params: ComboBoxDataProviderParams, callback: ComboBoxDataProviderCallback<any>) {
        console.log(id, lookupSettings);
        this.apiContext.fetchFromApi("", "lookup", {
            method: "POST",
            caller: "structuredKioskQuery.apiLookupProvider",
            body: JSON.stringify(lookupSettings),
        })
            .then((data: any) => {
                if ("result_msg" in data && data.result_msg !== "ok") {
                    console.log(`Error: `, data);
                    callback([], 0);
                } else {
                    console.log(data);
                    callback(data.records, data.record_count);
                }
            })
            .catch((e: Error) => {
                handleCommonFetchErrors(this, <FetchException>e, "structuredKioskQuery.apiLookupProvider", null);
                callback([], 0);
            });
    }

    async fetchQueryResults(params: {
        page: number;
        pageSize: number;
        searchTerm: string;
        sortOrders: GridSorterDefinition[];
    }): Promise<[[AnyDict] | [], number]> {
        const apiData = {
            "query_id": this.queryDefinition.id,
            "inputs": this._inputData,
        };
        const urlfetchParams = new URLSearchParams();
        urlfetchParams.append("page_size", params.pageSize.toString());
        urlfetchParams.append("page", params.page.toString());
        try {
            const data = await this.apiContext.fetchFromApi("", "kioskquery", {
                    method: "POST",
                    caller: "structuredKioskQuery.fetchQueryResults",
                    body: JSON.stringify(apiData),
                }, "v1",
                urlfetchParams);
            if ("result_msg" in data && data.result_msg !== "ok") {
                console.log(`Error: `, data);
                return [null, 0];
            } else {
                this.data = data;
                console.log(this.data);
                return [data.records, this.data.overall_record_count];
            }
        } catch (e) {
            handleCommonFetchErrors(this, e, "structuredKioskQuery.fetchQueryResults", null);
            return [[], 0];
        }
    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        console.log("updated fired");
        if (_changedProperties.has("constants")) {
            this.assignConstants();
        }
        if (_changedProperties.has("uiSchema") && this.uiSchema) {
            const ui: any = this.renderRoot.querySelector("#ui");
            (<UISchemaLookupProvider>ui.lookupProvider) = this.apiLookupProvider.bind(this);
            ui.dataProvider = (exp: string, id: string) => {
                console.log(`request for data: ${exp} ${id}`);
                const i_result = this.interpreter.interpret(exp);
                return i_result || exp;
            };
            ui.uiSchema = this.uiSchema;
        }
        if (_changedProperties.has("activeChart") || _changedProperties.has("activeView") || _changedProperties.has("data") && this.data) {
            if (this.data && this.activeView != RESULT_VIEW_TYPE_DATA) {
                if (this.data.page_size <= this.overall_record_count) {
                    this.fetchAllData().then(data => {
                        this.refreshGraph(this.data);
                    });
                } else {
                    this.refreshGraph(this.data);
                }
            }

        }
    }

    refreshGraph(data: ApiResultKioskQuery) {
        const graphDiv = this.shadowRoot.getElementById("chart");
        const queryResultContainer = this.shadowRoot.querySelector(".kiosk-query-result-area");
        const styles = window.getComputedStyle(queryResultContainer, null)
        const width = styles.width
        if (graphDiv.firstElementChild) {
            graphDiv.removeChild(graphDiv.firstElementChild);
        }
        console.log("refreshing graph", graphDiv);
        if (this.activeView != RESULT_VIEW_TYPE_DATA) {
            let chartType = chartType2String(this.activeView)
            // let chartDefinition = this.queryDefinition.charts[Object.keys(this.queryDefinition.charts)[0]]
            let chartDefinition = this.queryDefinition.charts[this.activeChart[chartType]]
            console.log("chartDefinition", chartDefinition)
            // chartDefinition.title=
            if (this.activeView === RESULT_VIEW_TYPE_PIECHART) {
                refreshPieChart(graphDiv, this.data, `${parseInt(width) - 50}px`, "400px",chartDefinition);
            } else {
                if (this.activeView === RESULT_VIEW_TYPE_BARCHART) {
                    refreshBarChart(graphDiv, this.data, `${parseInt(width) - 50}px`, "400px",chartDefinition);
                }
            }

        }
    }

    private async fetchAllData(): Promise<[Array<any>, number]> {
        if (this._inputData) {
            return await this.fetchQueryResults({
                page: 1,
                pageSize: -1,
                sortOrders: [],
                searchTerm: "",
            });
        } else {
            return [undefined, 0];
        }
    }

    private dataProvider = async (
        params: GridDataProviderParams<AnyDict>,
        callback: GridDataProviderCallback<AnyDict>,
    ) => {
        const { page, pageSize, sortOrders } = params;
        console.log("params", params);
        if (this._inputData) {
            const rc = await this.fetchQueryResults({
                page: page + 1,
                pageSize: pageSize,
                sortOrders: sortOrders,
                searchTerm: "",
            });
            let data, count;
            [data, count] = rc;
            if (count > 0 || page == 0) {
                this.overall_record_count = count;
                this.requestUpdate();
                console.log("no records found.");
            }
            console.log("over_all_count:", this.overall_record_count);
            console.log("first line:", data[0]);
            callback(data, this.overall_record_count);
        } else callback([], 0);
    };

    getQueryUiSchema(elements: Dictionary<UISchemaUIElement>) {
        this.uiSchema = {
            header: { version: 1 },
            dsd: <any>this.queryDefinition.ui["dsd"],
            layout_settings: {
                orchestration_strategy: "stack",
            },
            meta: {
                scenario: "query-ui",
            },
            ui_elements: {
                "query_fields": {
                    "element_type": <UISchemaLayoutElement>{
                        "name": "layout",
                        "layout_settings": {
                            "orchestration_strategy": "stack",
                        },
                        "ui_elements": elements,
                    },
                },
                "query_ui_controls": {
                    "element_type": <UISchemaLayoutElement>{
                        "name": "layout",
                        "layout_settings": {
                            "orchestration_strategy": "stack",
                        },
                        "ui_elements": {
                            "line": {
                                "element_type": {
                                    "name": "line",
                                },
                            },
                            "buttons": {
                                "element_type": {
                                    "name": "layout",
                                    "layout_settings": {
                                        "orchestration_strategy": "rightalign",
                                    },
                                    "ui_elements": {
                                        "start": {
                                            "element_type": {
                                                "name": "button",
                                                "type": "iconButton",
                                                "icon": "",
                                                "default": "ENTER",
                                                "extra_style": "padding: 2px 2px 0px 0px",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
    }

    willUpdate(_changedProperties: any) {
        if (_changedProperties.has("queryDefinition") && this.queryDefinition) {
            //translate and amened the query definition into a correct UISchema here.
            this.getQueryUiSchema(this.queryDefinition.ui["ui_elements"]);
            console.log(this.uiSchema);
        }
    }

    queryUIChanged(event: CustomEvent) {
        if (event.detail.srcElement === "start") {
            this.overall_record_count = -1;
            this._inputData = event.detail.newData;
            this.assignInputs()
            // this.fetchQueryResults()
            this.grid?.clearCache();
        }
    }

    showTableView() {
        if (this.activeView === RESULT_VIEW_TYPE_DATA) return;

        this.activeView = RESULT_VIEW_TYPE_DATA;
    }

    showGraphView(graphType: ResultViewType) {
        if (this.activeView === graphType) return;
        this.activeView = graphType;
        console.log(this.activeView);
    }

    switchResultView(event: MouseEvent) {
        const btView = <HTMLDivElement>event.currentTarget;
        switch(btView.id) {
            case "tableView":
                this.showTableView();
                break;
            case "pieChart":
                this.showGraphView(RESULT_VIEW_TYPE_PIECHART);
                break;
            case "barChart":
                this.showGraphView(RESULT_VIEW_TYPE_BARCHART);
                break;
        }
    }

    private isIdentifier(dsdName: string) {
        const colInfo = <AnyDict>this.data.document_information.columns[dsdName];
        return ("identifier" in colInfo && colInfo["identifier"]);
    }

    private getColumnLabel(dsdName: string) {
        const colInfo = <AnyDict>this.data.document_information.columns[dsdName];
        return "label" in colInfo ? colInfo["label"] : dsdName;
    }

    private gotoIdentifier(event: MouseEvent) {
        const cell = <HTMLDivElement>event.currentTarget;
        const identifier = cell.getAttribute("data-identifier");
        const colName = cell.getAttribute("data-column");
        const colInfo = <AnyDict>this.data.document_information.columns[colName];
        const tableName = colInfo["table"];
        const fieldName = colInfo["field"];
        const identifierEvent = new CustomEvent("identifierClicked",
            {
                "detail": {
                    "dsdName": fieldName,
                    "tableName": tableName,
                    "identifier": identifier,
                },
                bubbles: true,
            },
        );
        this.dispatchEvent(identifierEvent);
    }

    private getFormattedCellValue(rowElement: any, colInfo: AnyDict) {
        const dataType = colInfo["datatype"];
        switch (dataType) {
            case "date":
                try {
                    return getLatinDate(DateTime.fromISO(rowElement), false);
                } catch {
                    return "";
                }
            case "datetime":
                try {
                    return getLatinDate(DateTime.fromISO(rowElement), true);
                } catch {
                    return "";
                }
        }
        return rowElement;
    }

    private cellRenderer: GridColumnBodyLitRenderer<AnyDict> = (row, model, column) => {
        const dsdName = column.getAttribute("data-column");
        const colInfo = <AnyDict>this.data.document_information.columns[dsdName];
        const cellValue = this.getFormattedCellValue(row[dsdName], colInfo);
        // const format = this
        if (this.isIdentifier(dsdName)) {
            return html`
                <div class="identifier" data-column="${dsdName}" data-identifier="${row[dsdName]}"
                     @click="${this.gotoIdentifier}">
                    ${cellValue}
                </div>`;
        } else {
            return html`
                <div>
                    ${cellValue}
                </div>`;
        }
    };

    private headerRenderer(col: HTMLElement) {
        return html`
            <div>${this.interpreter.interpret(this.getColumnLabel(col.getAttribute("data-column")), undefined, "/")}
            </div>`;
    }

    renderQueryResult() {
        // if (!(this.data.result_msg === "ok")) {
        //     return html`An error occured: ${this.data.result_msg}`
        // }
        // console.log(this.data)
        return html`
            <vaadin-grid style="${this.activeView == RESULT_VIEW_TYPE_DATA ? "display: block" : "display:none"}"
                         id="grid" .dataProvider="${this.dataProvider}" theme="no-border">
                ${this.data ? this.data.document_information.column_order.map((col: string) => html`
                        <vaadin-grid-column
                            data-column="${col}"
                            ${columnHeaderRenderer(this.headerRenderer, [])}
                            ${columnBodyRenderer(this.cellRenderer, [])}></vaadin-grid-column>
                    `,
                ) : html`
                    <vaadin-grid-column></vaadin-grid-column>`}

            </vaadin-grid>
            <div style="${this.activeView == RESULT_VIEW_TYPE_DATA ? "display:none" : "display: block"}">
                ${this.renderChartSelector()}
                <div id="chart">

                </div>
            </div>`;
    }
    chartSelectionChanged(e: Event) {
        // if (e instanceof KeyboardEvent) {
        //     if (e.key === "Enter" && this._default?.["ENTER"]) {
        //     }
        // } else if (e instanceof MouseEvent) {
        //
        // }
        if (this.activeView != RESULT_VIEW_TYPE_DATA) {
            const chartType = chartType2String(this.activeView)
            let selectedChart = (<HTMLInputElement>e.target).value
            if (selectedChart) {
                this.activeChart[chartType] = selectedChart
                this.activeChart = { ...this.activeChart }
            }
        }
    }

    renderChartSelector() {
        if (this.activeView != RESULT_VIEW_TYPE_DATA) {
            const chartType = chartType2String(this.activeView)
            const charts = getChartsByType(this.activeView, this.queryDefinition.charts)
            const items: any[] = charts.map(chartId => {
                let chartDefinition = this.queryDefinition.charts[chartId]
                chartDefinition.title=this.interpreter.interpret(chartDefinition.title, undefined, "/")
                return {
                    label: chartDefinition.title,
                    value: chartId
                }
            })
            let activeChart = ""
            if (this.activeChart.hasOwnProperty(chartType) && charts.find(x => x === this.activeChart[chartType])) {
                activeChart = this.activeChart[chartType]
            }
            if (!activeChart) {
                this.activeChart[chartType] = charts[0]
                this.activeChart = {...this.activeChart}
                activeChart = charts[0]
            }
            if (charts.length < 2)
                return html``

            console.log("select items", items)
            return html`
                <vaadin-select .items="${items}" class="chart-selector"
                               @change="${this.chartSelectionChanged}"
                .value="${activeChart}">
                </vaadin-select>
            `
        }
    }
    getChartTypes():Array<string> {
        const chartTypes:Set<string> = new Set()
        if (this.queryDefinition.hasOwnProperty("charts")) {
            Object.values(this.queryDefinition.charts).forEach(chart => chartTypes.add(chart["type"]))
        }
        console.log(chartTypes)
        return [...chartTypes]
    }

    renderChartTypeButton(chartType: string): TemplateResult {
        switch (chartType) {
            case "pie":
                return html`
                    <div id="pieChart"
                         class="result-toolbar-button ${this.activeView == RESULT_VIEW_TYPE_PIECHART ? "pressed" : ""}"
                         aria-description="chart view"
                         @click="${this.switchResultView}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path
                                d="M13 2.051V11h8.949c-.47-4.717-4.232-8.479-8.949-8.949zm4.969 17.953c2.189-1.637 3.694-4.14 3.98-7.004h-8.183l4.203 7.004z"></path>
                            <path
                                d="M11 12V2.051C5.954 2.555 2 6.824 2 12c0 5.514 4.486 10 10 10a9.93 9.93 0 0 0 4.255-.964s-5.253-8.915-5.254-9.031A.02.02 0 0 0 11 12z"></path>
                        </svg>
                    </div>`
            case "bar":
                return html`
                    <div id="barChart"
                         class="result-toolbar-button ${this.activeView == RESULT_VIEW_TYPE_BARCHART ? "pressed": ""}"
                         aria-description="chart view"
                         @click="${this.switchResultView}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path
                                d="M6 21H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1z"></path>
                        </svg>
                    </div>`
            default: return html``
        }
    }

    renderGraphButtons() : TemplateResult {
        if (!this.queryDefinition.hasOwnProperty("charts")) return html``

        let result: Array<TemplateResult> = []
        try {
            for (const chartType of this.getChartTypes()) {
                result.push(this.renderChartTypeButton(chartType))
            }
        } catch {
        }
        return result.length > 0?html`${result}`:html`
                <div class="result-toolbar-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                         style="fill: var(--col-error-bg-1);transform: ;msFilter:;"><path d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467L12.884 2.532zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z"></path></svg>                
                </div>
            `
    }

    exportClicked(event: CustomEvent) {
        const exportMethod = event.detail.item.value;
        this.fetchAllData()
            .then(rc => {
                console.log(`fetch all returned ${rc[1]} records`);
                const data: Array<AnyDict> = rc[0];
                console.log(data);
                console.log(this.data.document_information.column_order);
                console.log(this.data.document_information.columns);
                const colLabels: Array<string> = [];
                this.data.document_information.column_order.forEach((col: string) => {
                    colLabels.push(this.interpreter.interpret(this.getColumnLabel(col), undefined, "/"));
                });
                for (const unorderedRow of data) {
                    const row: AnyDict = {};
                    for (const unorderedColumn of this.data.document_information.column_order) {
                        const colInfo = <AnyDict>this.data.document_information.columns[unorderedColumn];
                        let cellValue = unorderedRow[unorderedColumn];
                        if (exportMethod !== "csv")
                            cellValue = this.getFormattedCellValue(cellValue, colInfo);
                        row[unorderedColumn] = cellValue;
                    }
                    exporter.addRow(row);
                }
                exporter.setColumnNames(colLabels);
                exporter.export(exportMethod);

            })
            .catch(e => {
                handleCommonFetchErrors(this, e, "structuredKioskQuery.exportClicked", null);
            });
        const exporter = new SheetExport();
    }

    apiRenderResultArea(): TemplateResult {
        if (this._inputData) {
            return html`
                <div class="kiosk-query-result-area">
                    <div class="result-toolbar">
                        ${this.overall_record_count > 0 ? html`
                                <div id="tableView"
                                     class="result-toolbar-button ${this.activeView == RESULT_VIEW_TYPE_DATA ? "pressed" : ""}"
                                     @click="${this.switchResultView}">
                                    <i class="fas fa-table-columns" aria-description="table view"></i>
                                </div>
                                ${this.renderGraphButtons()}
                                
                                <sl-dropdown @sl-select="${this.exportClicked}">
                                    <div class="result-toolbar-button" slot="trigger" aria-description="export menu">
                                        <i class="fas fa-file-export"></i>
                                    </div>
                                    <sl-menu class="export-drop-down">
                                        <sl-menu-item value="excel" aria-description="export as Excel file">Export to
                                            Excel
                                        </sl-menu-item>
                                        <sl-menu-item value="csv" aria-description="export as CSV file">Export CSV File
                                        </sl-menu-item>
                                        <sl-menu-item value="clipboard" aria-description="export to Clipboard">Copy to
                                            Clipboard
                                        </sl-menu-item>
                                    </sl-menu>
                                </sl-dropdown>`
                            : nothing}
                    </div>
                    <div class="kiosk-query-results">
                        ${(!this._inputData) ? nothing : this.renderQueryResult()}
                        ${(!this._inputData || this.overall_record_count != 0) ? nothing : html`
                            <div class="no-records">
                                <div><i></i>Sorry, your query yielded no results.</div>
                            </div>`}
                    </div>
                </div>`;
        } else {
            return html``;
        }
    }


    apiRender(): TemplateResult {
        return html`
            <div class="kiosk-query-ui">
                <ui-component id="ui" @dataChanged="${this.queryUIChanged}"></ui-component>
            </div>
            ${this.apiRenderResultArea()}
        `;
    }

}

