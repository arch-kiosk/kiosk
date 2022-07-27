// @ts-ignore
import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import dateSelectorStyle from './component-dateselector.sass';
import {State} from "./store/reducer";
// @ts-ignore
import {store} from './store/store.ts';
// @ts-ignore
import {setSelector, StoreDateSelector} from './store/actions.ts';
import {connect} from "pwa-helpers/connect-mixin";
import '@vaadin/vaadin-date-picker'
// @ts-ignore
import {getSqlDate, fromSqlDate} from "./lib/applib.ts";


@customElement('date-selector')
class DateSelector extends connect(store)(LitElement) {

    login_token = ""
    api_url = ""
    selected_date = new Date()
    // @ts-ignore

    constructor() {
        super();
        // @ts-ignore
        if (DEVELOPMENT)
            this.selected_date = new Date(2021,6, 22)
        this._init();
    }

    static get properties() {
        return {
            login_token: {type: String},
            api_url: {type: String},
            selected_date: {type: Date}
        }
    }

    static get styles() {
        return dateSelectorStyle
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

    render() {
        console.log(`selected date is ${this.selected_date}`)
        let start_date = this.selected_date.getDate() - 3
        let end_date = this.selected_date.getDate() + 3
        let dateList = []
        for (let d = start_date; d <= end_date; d++) {
            let newDate = new Date(this.selected_date);
            newDate.setDate(d)
            dateList.push(newDate)
        }
        return html`${this.api_url !== "" 
                        ? html`
                            <div class="date-selector">
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
                        : html`api url unknown`
        }`
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

    protected updated(_changedProperties: any) {
        super.updated(_changedProperties);
        // if (this.editing !== "") {
        //     this.shadowRoot.getElementById("edit-list").focus();
        // }
    }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}
