// @ts-ignore
import { html, LitElement, unsafeCSS } from "lit";
import {customElement} from 'lit/decorators.js'

// @ts-ignore
import local_css from "./styles/component-contextselector.sass?inline";
import {State} from "./store/reducer";
// @ts-ignore
import {store} from './store/store.ts';
// @ts-ignore
import {setSelector, StoreContextSelector, StoreDateSelector} from './store/actions.ts';
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import {fetchFromApi, FetchException} from "@arch-kiosk/kiosktsapplib"
// @ts-ignore
import {handleCommonFetchErrors} from "./lib/applib.ts";
// @ts-ignore
import { KioskStoreAppComponent } from "../kioskapplib/kioskStoreAppComponent.ts";


@customElement('context-selector')
class ContextSelector extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);
    login_token = ""
    api_url = ""
    selected_date: Date = null
    selected_context: string = ""
    contexts: Array<StoreContextSelector> = []
    fetching_contexts: boolean = false
    fetch_error: string = ""


    constructor() {
        super();
        // @ts-ignore
        this._init();
    }

    static properties = {
        ...super.properties,
        selected_date: {type: Date},
        selected_context: {type: String},
        fetching_contexts: {type: Boolean}
    };

    _init() {
    }

    fetch_contexts() {
        this.fetching_contexts = true
        const month = (this.selected_date.getMonth() + 1).toString().padStart(2, "0")
        const day = this.selected_date.getDate().toString().padStart(2, "0")
        const year = this.selected_date.getFullYear()
        const us_date = `${year}-${month}-${day}`
        const body = JSON.stringify({
                "cql": {
                    "meta": {
                        "version": 0.1
                    },
                    "base": {
                        "scope": {
                            "unit": "browse()"
                        },
                        "target": {
                            "field_or_instruction": "modified_ww()",
                            "format": "datetime(date)"
                        },
                        additional_fields: {
                            "type": {
                                "field_or_instruction": "unit.type",
                                "default": "",
                                "format": "dsd_type(varchar)"
                            }
                        }
                    },
                    "query": {
                        "type": "Raw",
                        "distinct": true,
                        "columns": {
                            "identifier": {
                                "source_field": "identifier"
                            },
                            "uid": {
                                "source_field": "id_uuid"
                            },
                            "type": {
                                "source_field": "type"
                            }


                        },
                        "conditions": {
                            "?": `equals(data, \"${us_date}\")`
                        }
                    }
                }
            }
        )
            this.apiContext.fetchFromApi("", "cql/query",
            {
                method: "POST",
                caller: "contextselector.fetch_contexts",
                body: body,

            },
        )
        .then((data: any) => {
            if (data.result_msg !== "ok") {
                this.fetch_error = data.result_msg
            } else {
                this.fetch_error = ""
                this.load_contexts(data.records)
            }

            this.fetching_contexts = false

        })
        .catch((e: FetchException) => {
            handleCommonFetchErrors(this, e, "contextselector.fetch_data", null)
        })
    }

    load_contexts(records: []) {
        this.contexts = []
        records.forEach((r: any) => {
            let context = new StoreContextSelector()
            context.selectedContext = r.identifier
            context.selectedUid = r.uid
            context.selectedContextType = r.type
            this.contexts.push(context)
        })


        if (this.contexts.findIndex(ctx => ctx.selectedContext === this.selected_context) == -1)
            this.changeContext("")
    }

    stateChanged(state: State) {
        // if (this.fetch_error) {
        //     return html`Error fetching contexts: ${this.fetch_error}`
        // }
        if ("dateSelector" in state.selectors) {
            let stateDate: Date = (<StoreDateSelector>state.selectors["dateSelector"]).selectedDate
            if ((!this.selected_date) || (stateDate.getTime() !== this.selected_date.getTime())) {
                this.selected_date = stateDate
                this.fetch_contexts()
            }
        }
        if ("contextSelector" in state.selectors) {
            let stateContext: string = (<StoreContextSelector>state.selectors["contextSelector"]).selectedContext
            if ((!this.selected_context) || (stateContext !== this.selected_context)) {
                this.selected_context = stateContext
            }
        }
    }

    apiRender() {
        return html`
            <div class="context-selector">
                ${this.selected_date !== null
                        ? this.render_contexts()
                        : html`Please select a date`}
            </div>`
    }

    protected changeContext(contextId: string) {
        let context = {selectedContext: "", selectedUid: ""}
        if (contextId) {
            context = this.contexts.find(ctx => ctx.selectedContext === contextId)
        }
        store.dispatch(setSelector("contextSelector", context))
    }

    protected contextClicked(e: Event) {
        // @ts-ignore
        const context = e.currentTarget.getAttribute("context")
        if (context != this.selected_context) {
            this.changeContext(context)
        }
    }

    protected render_contexts() {
        if (this.fetching_contexts)
            return html`fetching contexts...`
        else {
            return html`
                <div class="context"
                     context=""
                     @click=${this.contextClicked}>
                    <i class="fa fa-trash"></i>
                </div>

                ${this.contexts.map(context => html`
                    <div class="context ${context.selectedContext === this.selected_context ? 'selected-context' : ''}"
                         context="${context.selectedContext}"
                         @click=${this.contextClicked}>
                        ${context.selectedContext}
                    </div>`
                )}`
        }
    }

    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

}
