// @ts-ignore
import {customElement, html, LitElement} from 'lit-element';
// @ts-ignore
import teamSelectorStyle from './component-teamselector.sass';
import {State} from "./store/reducer";
// @ts-ignore
import {store} from './store/store.ts';
// @ts-ignore
import {StoreDateSelector, StoreTeamSelector, setSelector} from './store/actions.ts';
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import {fetchFromApi, FetchException} from "../../../../static/scripts/kioskapputils.js"
// @ts-ignore
import {handleCommonFetchErrors} from "./lib/applib.ts";


@customElement('team-selector')
class TeamSelector extends connect(store)(LitElement) {

    login_token = ""
    api_url = ""
    selected_date: Date = null
    selected_member: string = ""
    team: Array<string> = []
    fetching_data: boolean = false
    fetch_error: string = ""


    constructor() {
        super();
        // @ts-ignore
        this._init();
    }

    static get properties() {
        return {
            login_token: {type: String},
            api_url: {type: String},
            selected_member: {type: String},
            selected_date: {type: Date},
            fetching_data: {type: Boolean}
        }
    }

    static get styles() {
        return teamSelectorStyle
    }


    _init() {
    }

    fetch_team() {
        this.fetching_data = true
        const month = (this.selected_date.getMonth() + 1).toString().padStart(2, "0")
        const day = this.selected_date.getDate().toString().padStart(2, "0")
        const year = this.selected_date.getFullYear()
        const us_date = `${year}-${month}-${day}`
        fetchFromApi(this.api_url, this.login_token, "cql/query",
            {
                method: "POST",
                caller: "teamselector.fetch_team",
                body: JSON.stringify({
                        "cql": {
                            "meta": {
                                "version": 0.1
                            },
                            "base": {
                                "scope": {
                                    "unit": "browse()"
                                },
                                "target": {
                                    "field_or_instruction": "modified",
                                    "format": "datetime(date)"
                                },
                                "additional_fields": {
                                    "modified_by": {
                                        "field_or_instruction": "replfield_modified_by()",
                                        "default": "?"
                                    }
                                }
                            },
                            "query": {
                                "type": "Raw",
                                "distinct": true,
                                "columns": {
                                    "member": {
                                        "source_field": "modified_by"
                                    }
                                },
                                "conditions": {
                                    "?": `equals(data, \"${us_date}\")`
                                }
                            }
                        }
                    }
                ),
            },
        )
            .then((data: any) => {
                if (data.result_msg !== "ok") {
                    this.fetch_error = data.result_msg
                } else {
                    this.fetch_error = ""
                    this.parse_records(data.records)
                }

                this.fetching_data = false

            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this, e, "teamselector.fetch_data", null)
            })
    }

    parse_records(records: []) {
        this.team = []
        records.forEach((r: any) => {
            this.team.push(r.member)
        })
        if (this.team.indexOf(this.selected_member) == -1)
            this.changeSelection("")
    }

    protected changeSelection(selection: string) {
        store.dispatch(setSelector("teamSelector", {"selectedMember": selection}))
    }

    stateChanged(state: State) {
        if ("dateSelector" in state.selectors) {
            let stateDate: Date = (<StoreDateSelector>state.selectors["dateSelector"]).selectedDate
            if ((!this.selected_date) || (stateDate.getTime() !== this.selected_date.getTime())) {
                this.selected_date = stateDate
                this.fetch_team()
            }
        }
        if ("teamSelector" in state.selectors) {
            let stateMember: string = (<StoreTeamSelector>state.selectors["teamSelector"]).selectedMember
            if ((!this.selected_member) || (stateMember !== this.selected_member)) {
                this.selected_member = stateMember
            }
        }
    }

    protected memberClicked(e: Event) {
        // @ts-ignore
        const member = e.currentTarget.getAttribute("member")
        console.log(`Team member ${member} clicked.`)
        if (member != this.selected_member) {
            this.changeSelection(member)
        }
    }

    render() {
        return html`${this.api_url !== "" && this.login_token !== ""
            ? html`
                <div class="team-selector">
                ${this.selected_date !== null
                ? this.render_team()
                : html`Please select a date`}
                </div>`
            : html`api url unknown`
        }`
    }

    protected render_team() {
        if (this.fetching_data)
            return html`fetching data...`
        else {
            return html`
                        <div class="member"
                             member=""
                             @click=${this.memberClicked}>
                            <i class="fa fa-trash"></i>
                        </div>

                        ${this.team.map(member => html`
                            <div class="team-member ${member == this.selected_member?'selected-member':''}"
                                 member="${member}"
                                  
                                 @click=${this.memberClicked}>
                                ${member}
                            </div>`
            )}`
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
