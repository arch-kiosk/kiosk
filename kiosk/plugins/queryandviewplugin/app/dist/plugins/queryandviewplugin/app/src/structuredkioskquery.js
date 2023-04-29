var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// @ts-ignore
import local_css from './styles/component-structuredkioskquery.sass?inline';
import 'ui-component';
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, unsafeCSS } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { handleCommonFetchErrors } from "../dist/src/lib/applib";
let StructuredKioskQuery = class StructuredKioskQuery extends KioskAppComponent {
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }
    apiLookupProvider(id, lookupSettings, params, callback) {
        console.log(id, lookupSettings);
        this.apiContext.fetchFromApi("", "lookup", {
            method: "POST",
            caller: "structuredKioskQuery.apiLookupProvider",
            body: JSON.stringify(lookupSettings)
        })
            .then((data) => {
            if ('result_msg' in data && data.result_msg !== "ok") {
                console.log(`Error: `, data);
                callback([], 0);
            }
            else {
                console.log(data);
                callback(data.records, data.record_count);
            }
        })
            .catch((e) => {
            handleCommonFetchErrors(this, e, "structuredKioskQuery.apiLookupProvider", null);
            callback([], 0);
        });
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        const ui = this.renderRoot.querySelector("#ui");
        ui.lookupProvider = this.apiLookupProvider.bind(this);
        ui.uiSchema = this.uiSchema;
    }
    getQueryUiSchema(elements) {
        this.uiSchema = {
            header: { version: 1 },
            dsd: this.queryDefinition.ui["dsd"],
            layout_settings: {
                orchestration_strategy: "stack",
            },
            meta: {
                scenario: "query-ui"
            },
            ui_elements: {
                "query_fields": {
                    "element_type": {
                        "name": "layout",
                        "layout_settings": {
                            "orchestration_strategy": "stack"
                        },
                        "ui_elements": elements
                    }
                },
                "query_ui_controls": {
                    "element_type": {
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
        };
    }
    willUpdate(_changedProperties) {
        if (_changedProperties.has("queryDefinition") && this.queryDefinition) {
            //translate and amened the query definition into a correct UISchema here.
            this.getQueryUiSchema(this.queryDefinition.ui["ui_elements"]);
        }
    }
    queryUIChanged(event) {
        console.log(event.detail.newData);
    }
    apiRender() {
        return html `
            <div class="kiosk-query-ui">
                <ui-component id="ui" @dataChanged="${this.queryUIChanged}"></ui-component>
            </div>
        `;
    }
};
StructuredKioskQuery.styles = unsafeCSS(local_css);
StructuredKioskQuery.properties = {
    ...(void 0).properties
};
__decorate([
    property()
], StructuredKioskQuery.prototype, "queryDefinition", void 0);
__decorate([
    state()
], StructuredKioskQuery.prototype, "uiSchema", void 0);
StructuredKioskQuery = __decorate([
    customElement('structured-kiosk-query')
], StructuredKioskQuery);
export { StructuredKioskQuery };
//# sourceMappingURL=structuredkioskquery.js.map