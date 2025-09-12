import { html, LitElement, nothing} from "lit";
import {customElement, state} from 'lit/decorators.js'
import local_css from './styles/component-dataframe.sass?inline';
import "./datawidgets/unitinfowidget.ts"
import "./datawidgets/narrativewidget.ts"
import "./datawidgets/locuswidget.ts"
import "./datawidgets/cmwidget.ts"
import "./datawidgets/featurewidget.ts"
import "./datawidgets/filewidget.ts"
import "./datawidgets/deletioninfowidget"
// @ts-ignore
import {State} from "./store/reducer.ts";
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import { KioskStoreAppComponent } from "../kioskapplib/kioskStoreAppComponent.ts";
import { unsafeCSS } from "lit";
import { StoreWidgetSelector } from "./store/actions";


@customElement('dataview-frame')
class DataViewFrame extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);

    static properties = {
        ...super.properties,
    };

    @state()
    selectedWidgets:Array<string>

    constructor() {
        super();
        // @ts-ignore
    }

    stateChanged(state: State) {
        if ("widgetSelector" in state.selectors) {
            this.selectedWidgets = (<StoreWidgetSelector>state.selectors["widgetSelector"]).selectedWidgets;
            console.log("new widget configuration: ", this.selectedWidgets)
            this.requestUpdate()
        }
    }

    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    protected renderDataWidgets() {
        if (!this.selectedWidgets) return html``
        return html`
            <unit-info-widget .apiContext="${this.apiContext}" style="${this.selectedWidgets.includes('unit-info-widget')?nothing:'display:none'}"></unit-info-widget>
            <deletion-info-widget .apiContext="${this.apiContext}" style="${this.selectedWidgets.includes('deletion-info-widget')?nothing:'display:none'}"></deletion-info-widget>
            <narrative-widget .apiContext="${this.apiContext}" style="${this.selectedWidgets.includes('narrative-widget')?nothing:'display:none'}"></narrative-widget>
            <file-widget .apiContext="${this.apiContext}" style="${this.selectedWidgets.includes('file-widget')?nothing:'display:none'}"></file-widget>
            <locus-widget .apiContext="${this.apiContext}" style="${this.selectedWidgets.includes('locus-widget')?nothing:'display:none'}"></locus-widget>
            <cm-widget .apiContext="${this.apiContext}" style="${this.selectedWidgets.includes('cm-widget')?nothing:'display:none'}"></cm-widget>
            <feature-widget .apiContext="${this.apiContext}" style="${this.selectedWidgets.includes('feature-widget')?nothing:'display:none'}"></feature-widget>
        `
    }

    apiRender() {
        return this.renderDataWidgets()
    }

}

