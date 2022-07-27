// @ts-ignore
// import {developMode} from './lib/const.js'
// @ts-ignore
import tagStyle from './component-workstationlist.sass';
//@ts-ignore
import {FetchException} from "../../../../static/scripts/kioskapputils.js"
//@ts-ignore
import { KioskApp } from "../kioskapplib/kioskapp";
// import {store} from "./store/store.ts";
import {Workstation} from "./lib/workstation";

// noinspection ES6UnusedImports
import {
    handleCommonFetchErrors,
    JOB_STATUS_DONE,
    JOB_STATUS_REGISTERED,
    JOB_STATUS_CANCELED,
    log,
    JOB_STATUS_RUNNING
// @ts-ignore
} from "./lib/applib.ts";

import "./workstationcard.ts"

//@ts-ignore
import {appGetKioskRoute as kioskAppGetKioskRoute, fetchSomething} from "../../../../static/scripts/kioskapputils.js"
// @ts-ignore
import {devGetKioskRoute} from "./lib/devapputils";
import { html, unsafeCSS } from "lit";
import { customElement } from 'lit/decorators.js';

// @ts-ignore
import local_css from "./component-workstationlist.sass?inline";

@customElement('workstation-list')
class WorkstationList extends KioskApp {
    static styles = unsafeCSS(local_css);
    fetching: boolean = false
    fetch_error: string = ""

    workstations: { [key: string]: Workstation } = {}
    timeoutId: any = null
    fetchingStopped: boolean = false
    sync_status: number = -1

    constructor() {
        super();
        // @ts-ignore
        this._init();
    }

    static get properties() {
        return { ...super.properties,
            fetching: {type: Boolean},
            sync_status: {type: Number},
            workstations: {type: Object}
        };
    }

    _init() {
    }

    protected fetchWorkstations() {
        if (this.timeoutId) clearTimeout(this.timeoutId)
        if (this.fetchingStopped)
            return

        console.log("fetching workstations")
        this.apiContext.fetchFromApi("syncmanager", "workstations",
            {
                method: "GET",
                caller: "workstationlist.fetchWorkstations"
            }
        )
            .then((data: any) => {
                if (data.result_msg !== "ok") {
                    this.fetch_error = data.result_msg
                } else {
                    this.fetch_error = ""
                    // if (this.workstations.length > 0) {
                    //     data.workstations[1].description = "Changed!!!!"
                    // }
                    try {
                        this.processData(data.workstations)
                    } finally {
                        let poll_delay = data.poll_delay
                        console.log(`Poll delay is ${poll_delay}`)
                        this.timeoutId = setTimeout(this.fetchWorkstations.bind(this), poll_delay * 1000)
                        this.sync_status = data.sync_status
                        console.log(`Poll delay is ${this.sync_status}`)
                    }
                }

                this.fetching = false

            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this, e, "workstationlist.fetchWorkstations", null)
            })
    }

    protected processData(data: []) {
        let workstations: { [key: string]: Workstation } = {}
        data.forEach((r: any) => {
            let workstation = new Workstation()
            workstation.from_dict(r)
            // if a workstation has no description it is either a workstation in the making or deleted
            if (workstation.description || workstation.job_status_code != JOB_STATUS_DONE) {
                console.log(`pushing workstation ${workstation.workstation_id}`)
                workstations[workstation.workstation_id] = workstation
            } else {
                console.log(`workstation ${workstation.workstation_id} not listed.`)
            }
        })
        this.workstations = workstations
    }

    protected firstUpdated(_changedProperties: any) {
        super.firstUpdated(_changedProperties);
        this.shadowRoot.addEventListener("fetch-workstations", function () {
            this.fetchWorkstations()
        }.bind(this));
        this.fetchWorkstations();

    }

    updated(_changedProperties: any) {
        super.updated(_changedProperties);
        // if (this.editing !== "") {
        //     this.shadowRoot.getElementById("edit-list").focus();
        // }
    }

    protected stopFetching() {
        this.fetchingStopped = true
        console.log("Stopped fetching.")
    }

    protected getRecordingGroups() : { [key: string]: Array<String>} {
        let result : {[key: string]: Array<String>} = {}

        Object.values(this.workstations).map((workstation: Workstation) => {
            if (!(workstation.recording_group in result)) result[workstation.recording_group] = []
            result[workstation.recording_group].push(workstation.workstation_id)
        })
        return result
    }

    protected renderWorkstationCards(workstations: Array<String>) {
        // console.log(workstations)
        return html`${workstations.map((workstation_id: string) =>
            html`
                        <workstation-card
                                .apiContext="${this.apiContext}"
                                .workstation_id="${workstation_id}"
                                .workstation_data="${this.workstations[workstation_id]}">
                        </workstation-card>
                    `
        )}`
    }

    protected renderSynchronizationRunning() {
        return html`
            <div class="synchronization-running">
                <div class="synchronization-reminder"
                    <div>
                        <p>Currently synchronization is running. <br>
                        <a href="${this.apiContext.getKioskRoute('syncmanager.synchronization_progress')}">Click here to monitor its progress.</a>
                        </p>
                    </div>
                </div>
            </div>
        `
    }

    apiRender() {
        console.log("rendering workstations")
        let developMode = false
        //@ts-ignore
        if (import.meta.env.DEV)
            developMode = true
        const recordingGroupsAndWorkstations = this.getRecordingGroups()
        const recordingGroups = Object.keys(recordingGroupsAndWorkstations)
        if (this.sync_status >= JOB_STATUS_REGISTERED && this.sync_status < JOB_STATUS_DONE) {
            return this.renderSynchronizationRunning()
        } else {
            return html`
                ${developMode
                        ? html`
                            <div class="kiosk-btn" @click="${this.stopFetching}">stop fetching</div>
                        `
                        : undefined}
                ${this.sync_status != -1
                    ?html`
                        <div class="synchronization-reminder">
                            <i class="fas fa-lightbulb"></i><p>The recently started synchronization has ended.</p> 
                            <p><a href="${this.apiContext.getKioskRoute('syncmanager.synchronization_progress')}">
                                Click here to see the results.</a></p>  
                        </div>
                    `
                    :undefined}
                ${(recordingGroups.length > 1)
                        ? html`${recordingGroups.map((recordingGroup) =>
                                html`
                                    <div id="${recordingGroup}" class="recording-group">
                                        <div class="recording-group-header">${recordingGroup}</div>
                                        <div class="recording-group-body">
                                            <div class="recording-group-background">
                                            </div>
                                            ${this.renderWorkstationCards(recordingGroupsAndWorkstations[recordingGroup])}
                                        </div>
                                    </div>`
                        )}`
                        : html`
                            <div class="one-recording-group">
                                ${(recordingGroups.length > 0) ? html`${
                                        this.renderWorkstationCards(recordingGroupsAndWorkstations[recordingGroups[0]])
                                }` : undefined}
                            </div>
                        `}
            `
        }
    }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}

