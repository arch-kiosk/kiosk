var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// @ts-ignore
import local_css from './styles/component-structuredkioskquery.sass?inline';
import { KioskAppComponent } from "../kioskapplib/kioskappcomponent";
import { html, unsafeCSS } from "lit";
import { property, customElement } from "lit/decorators.js";
let StructuredKioskQuery = class StructuredKioskQuery extends KioskAppComponent {
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        // if (_changedProperties.has("apiContext") ) {
        //     if (this.apiContext ) {
        //         this.loadQueries()
        //     }
        // }
    }
    apiRender() {
        return this.apiContext ? html `
            <div class="structured-kiosk-query">
                <h3>This is query "${this.queryDefinition.name}"</h3>
            </div>
        ` : html ``;
    }
};
StructuredKioskQuery.styles = unsafeCSS(local_css);
StructuredKioskQuery.properties = {
    ...(void 0).properties
};
__decorate([
    property()
], StructuredKioskQuery.prototype, "queryDefinition", void 0);
StructuredKioskQuery = __decorate([
    customElement('structured-kiosk-query')
], StructuredKioskQuery);
export { StructuredKioskQuery };
//# sourceMappingURL=structuredkioskquery.js.map