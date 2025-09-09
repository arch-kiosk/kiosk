import '@vaadin/vaadin-list-box'
import '@vaadin/vaadin-item'
import { html, LitElement, unsafeCSS, nothing } from "lit";
import {customElement, state} from 'lit/decorators.js'
import local_css from './styles/component-widgetselector.sass?inline';
import {State} from "./store/reducer";
import {store} from './store/store';
import {setSelector, StoreWidgetSelector} from './store/actions';
import { KioskStoreAppComponent } from "../kioskapplib/kioskStoreAppComponent";
import { AVAILABLE_WIDGETS, getRecordTypeNames, getAllWidgets, WidgetDescriptor } from "./lib/applib";

@customElement('widget-selector')
class WidgetSelector extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);
    login_token = ""
    api_url = ""
    record_type_names: { [key: string]: string } = null
    selectedWidgets = AVAILABLE_WIDGETS.slice()
    widgets: Array<WidgetDescriptor>
    private docClicked: Any

    constructor() {
        super();
        this._init();
    }

    _init() {
        store.dispatch(setSelector("widgetSelector", {"selectedWidgets": this.selectedWidgets}))
    }



    stateChanged(state: State) {
        const changed = false
        if ("widgetSelector" in state.selectors) {
            let selectedWidgets = (<StoreWidgetSelector>state.selectors["widgetSelector"]).selectedWidgets
            this.selectedWidgets = selectedWidgets
        }
        if (state.constants.length > 0 && !this.record_type_names) {
            this.record_type_names = getRecordTypeNames(state.constants)
            this.widgets = getAllWidgets(state, this.record_type_names)
            if (!changed) this.requestUpdate()
        }
    }

    static properties = {
        ...super.properties,
        selected_widgets: {type: Array}
    };

    @state()
    selectorIsOpen: boolean = false


    selectorButtonClicked() {
        const target: HTMLElement = this.shadowRoot.querySelector('#widget-selector')
        console.log("target", target)

        if (this.selectorIsOpen) {
            if (this.docClicked)
                document.removeEventListener('click', this.docClicked)
        } else {
            this.docClicked = (event: MouseEvent)=> {
                const withinBoundaries = event.composedPath().includes(target)

                if (!withinBoundaries) {
                    const bt: HTMLElement = this.shadowRoot.querySelector('#widget-selector-button')

                    if (!event.composedPath().includes(bt)) {

                        this.selectorIsOpen = false
                        document.removeEventListener('click', this.docClicked)
                    }
                }
            }

            document.addEventListener('click', this.docClicked)
        }

        this.selectorIsOpen = !this.selectorIsOpen
    }

    apiRender() {
        console.log(`widgets are ${this.widgets}`)
        if (!this.widgets?.length)
            return html``

        return html`
            <button id="widget-selector-button" class="widget-selector-button ${this.selectorIsOpen?'widget-selector-button-open':'widget-selector-button-closed'}"
            @click=${this.selectorButtonClicked}><i class="fas fa-list-check"></i></button>
            <vaadin-list-box id="widget-selector" class="widget-selector-list ${this.selectorIsOpen?'':'widget-selector-closed'}" 
                             multiple
                             .selectedValues=${[0,2,3]}>
                ${this.widgets.map(widget => html`
                    <vaadin-item>${widget.displayName}</vaadin-item>
                `)}
            </vaadin-list-box>
        
        `
    }


    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
    }

    // protected updated(_changedProperties: any) {
    //     super.updated(_changedProperties);
    //     // if (this.editing !== "") {
    //     //     this.shadowRoot.getElementById("edit-list").focus();
    //     // }
    // }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}
