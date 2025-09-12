import "@vaadin/vaadin-list-box";
import "@vaadin/vaadin-item";
import { html, LitElement, unsafeCSS, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import local_css from "./styles/component-widgetselector.sass?inline";
import { State } from "./store/reducer";
import { store } from "./store/store";
import { setSelector, StoreWidgetSelector } from "./store/actions";
import { KioskStoreAppComponent } from "../kioskapplib/kioskStoreAppComponent";
import { AVAILABLE_WIDGETS, getRecordTypeNames, getAllWidgets, WidgetDescriptor } from "./lib/applib";
import { ListBox } from "@vaadin/vaadin-list-box";

//Whenever a new widget gets invented, the version for the cookie needs to go up.
const COOKIE_KIOSKDVDEFAULTWIDGETSELECTION = "kioskDVDefaultWidgetSelectionV2"

@customElement("widget-selector")
class WidgetSelector extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);
    static properties = {
        ...super.properties,
        selectedWidgets: { type: Array },
    };
    widgets: Array<WidgetDescriptor>;
    selectedWidgets: Array<string>;


    login_token = "";
    api_url = "";
    record_type_names: { [key: string]: string } = null;


    @state()
    selectorIsOpen: boolean = false;

    private docClicked: any;

    constructor() {
        super();
        this._init();
    }

    _init() {
        store.dispatch(setSelector("widgetSelector", { "selectedWidgets": this.selectedWidgets }));
    }

    stateChanged(state: State) {
        if (this.widgets) {
            if ("widgetSelector" in state.selectors && (<StoreWidgetSelector>state.selectors["widgetSelector"]).selectedWidgets) {
                this.selectedWidgets = (<StoreWidgetSelector>state.selectors["widgetSelector"]).selectedWidgets;
                console.log("new widget selection: ", this.selectedWidgets);
            }
        }
        if (state.constants.length > 0 && !this.widgets) {
            this.record_type_names = getRecordTypeNames(state.constants);
            this.widgets = getAllWidgets(state);
            if (!this.selectedWidgets) {
                this.getDefaultSelection().then((v) => {
                    this.selectedWidgets = v
                    store.dispatch(setSelector("widgetSelector", { "selectedWidgets": this.selectedWidgets }));
                })
                    .catch((e) => {console.error("Error getting the default widget selection",e)})
            } else {
                this.requestUpdate();
            }
        }
    }

    async getDefaultSelection() {
        const cookie = await cookieStore.get(COOKIE_KIOSKDVDEFAULTWIDGETSELECTION)
        return cookie?JSON.parse(cookie.value):AVAILABLE_WIDGETS.slice()
    }

    closeSelector() {
        if (this.docClicked)
            document.removeEventListener("click", this.docClicked);
        const selectedWidgets = this.getWidgetSelection();
        this.selectorIsOpen = false;
        if (!(selectedWidgets.length === this.selectedWidgets?.length &&
            selectedWidgets.every((val, i) => val === this.selectedWidgets[i]))) {
            store.dispatch(setSelector("widgetSelector", { "selectedWidgets": selectedWidgets }));
            this.storeSelectionInCookie(selectedWidgets);
        }

    }

    private storeSelectionInCookie(selectedWidgets: Array<string>) {
        const cookie: CookieInit = {
            name: COOKIE_KIOSKDVDEFAULTWIDGETSELECTION,
            value: JSON.stringify(selectedWidgets),
            expires: Date.now() + 30 * 24 * 60 * 60 * 1000, //30 days
            path: "/",
        };
        cookieStore.set(cookie).catch(() => {
            console.error("Error setting the widget selection as a cookie");
        });
    }

    getWidgetSelection() {
        const listBox: ListBox = this.shadowRoot.querySelector("#widget-selector");
        let selectedWidgets: Array<string> = [];
        if (listBox) {
            const selections = listBox.selectedValues;
            selections.sort();
            console.log("selected values is ", selections);
            for (const selection of selections) {
                const widget = this.widgets.find(w => w.order === selection);
                if (widget) selectedWidgets.push(widget.id);
            }
        }
        if (selectedWidgets.length == 0) {
            selectedWidgets = AVAILABLE_WIDGETS.slice();
        }
        return selectedWidgets;

    }

    getWidgetIndices(): Array<number> {
        return this.widgets.filter(x => this.selectedWidgets?.includes(x.id)).map(x => x.order);
    }

    protected updated(_changedProperties: any) {
        super.updated(_changedProperties);
        if (_changedProperties.has("selectedWidgets")) {
            const target: ListBox = this.shadowRoot.querySelector("#widget-selector");
            if (target) {
                const selectedValues = this.getWidgetIndices();
                console.log("target.selectedValues was", target.selectedValues);
                console.log("selected Values set to", selectedValues);
                target.selectedValues = selectedValues;
            }
        }
    }

    selectorButtonClicked() {
        const target: HTMLElement = this.shadowRoot.querySelector("#widget-selector");
        console.log("target", target);

        if (this.selectorIsOpen) {
            this.closeSelector();
        } else {
            this.docClicked = (event: MouseEvent) => {
                const withinBoundaries = event.composedPath().includes(target);
                if (!withinBoundaries) {
                    const bt: HTMLElement = this.shadowRoot.querySelector("#widget-selector-button");
                    if (!event.composedPath().includes(bt)) {
                        this.closeSelector();
                        document.removeEventListener("click", this.docClicked);
                    }
                }
            };

            document.addEventListener("click", this.docClicked);
            this.selectorIsOpen = true;
        }
    }

    apiRender() {
        if (!this.widgets?.length)
            return html``;

        return html`
            <button id="widget-selector-button"
                    class="widget-selector-button ${this.selectorIsOpen ? "widget-selector-button-open" : "widget-selector-button-closed"}"
                    @click="${this.selectorButtonClicked}"><i class="fas fa-list-check"></i></button>
            <vaadin-list-box id="widget-selector"
                             class="widget-selector-list ${this.selectorIsOpen ? "" : "widget-selector-closed"}"
                             multiple ">
            ${this.widgets.map(widget => html`
                <vaadin-item>${widget.displayName}</vaadin-item>
            `)}
            </vaadin-list-box>

        `;
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        if (this.docClicked) {
            console.log("Removed docClicked event listener");
            document.removeEventListener("click", this.docClicked);
        }
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
