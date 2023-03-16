// @ts-ignore
import local_css from './styles/component-structuredkioskquery.sass?inline'
import 'ui-component'
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import { property, state, query ,customElement } from "lit/decorators.js";
import { AnyDict, ApiResultKioskQuery, KioskQueryInstance } from "./lib/apitypes";
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
import {ComboBoxDataProviderParams, ComboBoxDataProvider} from '@vaadin/combo-box'
import { ComboBoxDataProviderCallback } from "@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin";
import { handleCommonFetchErrors } from "../dist/src/lib/applib";
import { Grid, GridDataProviderCallback, GridDataProviderParams, GridSorterDefinition } from "@vaadin/grid";
import { SCENARIO } from "./apptypes";

@customElement('structured-kiosk-query')
export class StructuredKioskQuery extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    overall_record_count: number = 0

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

    firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
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
            handleCommonFetchErrors(this, e, "structuredKioskQuery.apiLookupProvider", null);
            callback([],0)
        });
    }

    async fetchQueryResults(params: {
        page: number;
        pageSize: number;
        searchTerm: string;
        sortOrders: GridSorterDefinition[];
    }):Promise<[[AnyDict], number]> {
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
                return [data.records, this.data.overall_record_count]
            }
        }
        catch(e: any) {
            handleCommonFetchErrors(this, e, "structuredKioskQuery.fetchQueryResults", null);
            return [null,0]
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
            if (count > 0) this.overall_record_count = count
            console.log("over_all_count:", this.overall_record_count)
            console.log("first line:", data[0])
            callback(data, this.overall_record_count);
        } else callback([], 0)
    };

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        const ui: any = this.renderRoot.querySelector("#ui");
        (<UISchemaLookupProvider>ui.lookupProvider) = this.apiLookupProvider.bind(this)
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
        }
    }

    queryUIChanged(event: CustomEvent) {

        if (event.detail.srcElement === "start") {
            this.overall_record_count = 0
            this._inputData = event.detail.newData
            // this.fetchQueryResults()
            this.grid?.clearCache();
        }
    }

    renderQueryResult() {
        // if (!(this.data.result_msg === "ok")) {
        //     return html`An error occured: ${this.data.result_msg}`
        // }
        // console.log(this.data)
        return html`
        <vaadin-grid id="grid" .dataProvider="${this.dataProvider}">
            ${this.data?this.data.document_information.column_order.map((col: string) => html`
                <vaadin-grid-column path="${col}"></vaadin-grid-column>
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
                ${!this._inputData?nothing:this.renderQueryResult()}
            </div>
        `;
    }
}

