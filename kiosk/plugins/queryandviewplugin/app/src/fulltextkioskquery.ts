
// @ts-ignore
import local_css from './styles/component-fulltextkioskquery.sass?inline'
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, nothing, TemplateResult, unsafeCSS } from "lit";
import { consume } from "@lit-labs/context";
import { constantsContext } from "./constantscontext";
import { property, state, query ,customElement } from "lit/decorators.js";
import { Constant } from "./lib/apitypes";
import { DictionaryAccessor } from "./lib/dictionaryAccessor";
import { InterpreterFactory } from "./lib/interpreterfactory";

@customElement('full-text-kiosk-query')
export class FullTextKioskQuery extends KioskAppComponent {
    static styles = unsafeCSS(local_css);
    static properties = {
        ...super.properties
    }

    @consume({context: constantsContext})
    @state()
    private constants?: Constant[]

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


    apiRender(): TemplateResult {
        return html`
            <div class="kiosk-query-ui search-term">
                <i></i><input id="search-term" name="search-term" type="text" autofocus placeholder="Enter your search terms here" />
                <button class="start-search modal-round-button"><i></i></button>
            </div>
        `;
    }

}