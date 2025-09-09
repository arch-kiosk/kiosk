import '@vaadin/vaadin-date-picker'
import { html, LitElement, unsafeCSS } from "lit";
import {customElement} from 'lit/decorators.js'
import local_css from './styles/component-dateselector.sass?inline';
import {State} from "./store/reducer";
import {store} from './store/store';
import {setSelector, StoreDateSelector} from './store/actions';
import {getSqlDate, fromSqlDate} from "./lib/applib";
import { KioskStoreAppComponent } from "../kioskapplib/kioskStoreAppComponent";


@customElement('date-selector')
class DateSelector extends KioskStoreAppComponent {
    static styles = unsafeCSS(local_css);
    login_token = ""
    api_url = ""
    selected_date = new Date()
    // @ts-ignore
    static properties = {
        ...super.properties,
        selected_date: {type: Date}
    };

    constructor() {
        super();
        // @ts-ignore
        if (import.meta.env.DEV)
            this.selected_date = new Date(2020,6, 8)
        this._init();
    }

    _init() {
        store.dispatch(setSelector("dateSelector", {"selectedDate": this.selected_date}))
    }

    stateChanged(state: State) {
        if ("dateSelector" in state.selectors) {
            let stateDate: Date = (<StoreDateSelector>state.selectors["dateSelector"]).selectedDate
            if (stateDate.getTime() !== this.selected_date.getTime()) {
                this.selected_date = stateDate
            }
        }
    }

    apiRender() {
        console.log(`selected date is ${this.selected_date}`)
        let start_date = this.selected_date.getDate() - 3
        let end_date = this.selected_date.getDate() + 3
        let dateList = []
        for (let d = start_date; d <= end_date; d++) {
            let newDate = new Date(this.selected_date);
            newDate.setDate(d)
            dateList.push(newDate)
        }
        return html`<div class="date-selector">
                          ${dateList.map(d => html`
                            ${d.getDate() === this.selected_date.getDate() 
                              ? html`
                                <div date=${d.getTime()} class="date-selector-date selected-date">
                                    <vaadin-date-picker 
                                        id="date-picker" 
                                        @change=${this.dateClicked}
                                        auto-open-disabled
                                        value="${getSqlDate(d)}">
                                    </vaadin-date-picker>
                                </div>`
                              : html`
                                <div date=${d.getTime()} class="date-selector-date" @click=${this.dateClicked}>
                                    ${d.toLocaleDateString(undefined, {weekday: 'short'})}
                                </div>`
                                }
                            `)}
                    </div>`
    }

    protected dateClicked(e: Event) {
        console.log(e.currentTarget)
        // @ts-ignore
        if (e.currentTarget.id === "date-picker") {
            // @ts-ignore
            // @ts-ignore
            const new_date = fromSqlDate(e.currentTarget.value);
            store.dispatch(setSelector("dateSelector", {"selectedDate": new_date}))
        } else {
            // @ts-ignore
            const new_date = new Date();
            // @ts-ignore
            new_date.setTime(e.currentTarget.getAttribute("date"))
            store.dispatch(setSelector("dateSelector", {"selectedDate": new_date}))
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
