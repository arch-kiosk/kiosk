// @ts-ignore
// import {developMode} from './lib/const.js'
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

// @ts-ignore
import local_css from "./component-workstationcard.sass?inline";

import {
    fetchFromApi,
    FetchException,
    // @ts-ignore
} from "../../../../static/scripts/kioskapputils.js";

// @ts-ignore
import tagStyle from "./component-workstationcard.sass";

// @ts-ignore
import { store } from "./store/store.ts";
// @ts-ignore
import {
    gotoPage,
    handleCommonFetchErrors,
    JOB_STATUS_DONE,
    JOB_STATUS_REGISTERED,
    JOB_STATUS_CANCELED,
} from "./lib/applib";
import { Workstation } from "./lib/workstation";
import { kioskErrorToast, kioskOpenModalDialog, kioskYesNoToast } from "./lib/types/externalglobalfunctions";
import "./progress-ring/progress-ring";
import { KioskApp } from "../kioskapplib/kioskapp";
import { showMessage } from "./lib/appmessaging";

@customElement("workstation-card")
class WorkstationCard extends KioskApp {
    static styles = unsafeCSS(local_css);

    fetching: boolean = false;
    fetch_error: string = "";
    workstation_id: string;
    workstation_data: Workstation = new Workstation();
    percentage: number = -1;
    showJobInfo: boolean = false;
    jobMessage: string = "";
    jobError: string = "";
    jobHasWarnings: boolean = false;
    jobIsRunning: boolean = false;
    jobGotCanceled: boolean = false;
    constructor() {
        super();
        // @ts-ignore
        this._init();
    }

    static get properties() {
        return {
            ...super.properties,
            fetching: { type: Boolean },
            workstation_id: { type: String },
            workstation_data: { type: Object },
        };
    }

    _init() {}

    protected cardClicked(e: Event) {
        //@ts-ignore
        if (this.jobIsRunning) {
            this.askCancelJob();
        } else {
            let route = this.apiContext.getKioskRoute(
                `${this.workstation_data.workstation_class.toLowerCase()}.workstation_actions`,
            );
            kioskOpenModalDialog(`${route}/${this.workstation_id}`, {
                closeOnBgClick: false,
                // focus: "#backup-dir",
                showCloseBtn: true,
                callbacks: {
                    // open: () => {
                    //     alert("message!")
                    // },
                    close: () => {
                        this.dispatchEvent(
                            new CustomEvent("fetch-workstations", {
                                bubbles: true,
                                cancelable: true,
                            }),
                        );
                    },
                    ajaxFailed: () => {
                        //@ts-ignore
                        $.magnificPopup.close();
                        kioskErrorToast(
                            "Sorry, there is no access to the actions panel of this workstation. " +
                                'Presumably your session has timed out <a href="/logout">Try a fresh log in.</a>'
                        );
                    },
                },
            });
        }
    }

    protected showLog(e: Event) {
        e.stopPropagation();
        gotoPage(this.workstation_data.actions["log"]);
    }

    apiRender() {
        // this._load_from_state()
        console.log(`rendering card ${this.workstation_id}:`);
        console.log(this.workstation_data);
        this._calc_job_progress();
        return html`
            <div
                id="${this.workstation_id}"
                class="workstation-card ${this.workstation_data.disabled ? "workstation-disabled" : undefined}"
                @click="${this.cardClicked}">
                <div class="card-header">
                    ${this.workstation_data.icon_code
                        ? html` <div class="card-icon">
                              <i class="fas">${this.workstation_data.icon_code}</i>
                          </div>`
                        : this.workstation_data.icon_url
                        ? html` <div
                              class="card-icon"
                              style="background-image:url(${this.workstation_data.icon_url})"
                          ></div>`
                        : html` <div class="card-icon">
                              <i class="fas"></i>
                          </div>`}

                    <div class="title">
                        <span>${this.workstation_data.description}</span>
                        <span>[${this.workstation_id}]</span>
                    </div>
                </div>
                ${this.showJobInfo && (!this.jobHasWarnings || this.jobError)
                    ? html`
                          ${this.jobError
                              ? html` <div class="title-state error">${this.jobError}</div>`
                              : html` <div class="title-state processing">
                                    ${this.workstation_data.job_status_code == JOB_STATUS_REGISTERED
                                        ? "pending..."
                                        : "processing..."}
                                </div>`}
                      `
                    : html` <div class="title-state">${this.workstation_data.state_text}</div>`}

                <div class="card-body">
                    ${!this.jobIsRunning
                        ? html` <div class="ws-info">
                              <div class="job-warnings">
                                  ${this.jobHasWarnings
                                      ? html`<p>The last task was successful but returned warnings</p>`
                                      : html`${this.jobGotCanceled
                                            ? html`<p>
                                                  <span class="job-cancelled-label">The last task got cancelled</span>
                                              </p>`
                                            : undefined}`}
                                  ${this.jobError ? html`<p>There is more information available.</p>` : undefined}
                                  ${this.jobError || this.jobHasWarnings
                                      ? html` <button @click=${this.showLog} class="kiosk-btn job-info error">
                                            <i class="fas fa-bug"></i>
                                            <div>See details</div>
                                        </button>`
                                      : undefined}
                              </div>
                              ${this.jobError || this.jobHasWarnings ? html` <div class="spacer"></div>` : undefined}
                              <div>
                                  ${this.workstation_data.disabled
                                      ? html`This workstation is disabled. Please click to reactivate it.`
                                      : html`${this.workstation_data.state_description}`}
                              </div>
                          </div>`
                        : undefined}
                    ${this.showJobInfo && !this.jobError && !this.jobHasWarnings
                        ? html` <div class="job-info">
                              <sl-progress-ring percentage="${this.percentage}" size="54" stroke-width="6">
                                  ${this.percentage > 0 ? html`${this.percentage}%` : undefined}
                              </sl-progress-ring>
                              <div>${this.jobMessage}</div>
                          </div>`
                        : undefined}
                </div>
            </div>
        `;
    }

    private _calc_job_progress(): void {
        const job_progress = this.workstation_data.job_progress;
        this.jobError = "";
        this.jobHasWarnings = false;
        this.jobGotCanceled = false;
        // if (this.workstation_id == "x1lk") {
        //     this.showJobInfo = true
        //     this.jobMessage = "forking"
        //     this.percentage = 45
        //     this.jobHasWarnings = true
        //     this.jobIsRunning = true
        //     return
        // }
        if ("job_status_code" in this.workstation_data && this.workstation_data.job_status_code) {
            if (this.workstation_data.job_status_code < JOB_STATUS_DONE) {
                this.showJobInfo = true;
                if ("progress" in job_progress && job_progress.progress) {
                    this.percentage = job_progress.progress;
                    this.jobMessage = job_progress.message;
                } else {
                    this.percentage = -1;
                    this.jobMessage = job_progress.message;
                }
                this.jobIsRunning = true;
            } else {
                this.jobIsRunning = false;
                if ("success" in this.workstation_data.job_result) {
                    if (this.workstation_data.job_result.success) {
                        this.percentage = 100;
                        this.jobMessage = "finished";
                        if (this.workstation_data.job_result.has_warnings) this.jobHasWarnings = true;
                        this.showJobInfo = this.jobHasWarnings;
                    } else {
                        this.percentage = job_progress.progress;
                        this.jobMessage = "click to see details";
                        this.showJobInfo = true;
                        this.jobError = this.workstation_data.job_result.message;
                    }
                } else {
                    if (this.workstation_data.job_status_code == JOB_STATUS_CANCELED) {
                        this.percentage = 0;
                        this.showJobInfo = false;
                        this.jobIsRunning = false;
                        this.jobGotCanceled = true;
                    } else {
                        this.percentage = job_progress.progress;
                        this.jobMessage = this.workstation_data.job_result.message;
                    }
                }
            }
        } else {
            this.percentage = 0;
            this.showJobInfo = false;
            this.jobMessage = "";
            this.jobIsRunning = false;
        }
        console.log(`job info for workstation ${this.workstation_id}: ${this.workstation_data.job_status_code}`);
    }

    private askCancelJob() {
        kioskYesNoToast(
            `${this.workstation_data.description} is currently on the job. <br>
        Do you want to cancel that job?`,
            () => {
                this.cancelJob();
            },
            () => {
                this.triggerReloadWorkstations();
            },
            {
                backgroundColor: "var(--col-bg-att)",
                messageColor: "var(--col-primary-bg-att)",
                iconColor: "var(--col-accent-bg-att)",
            },
        );
    }

    private triggerReloadWorkstations() {
        this.dispatchEvent(
            new CustomEvent("fetch-workstations", {
                bubbles: true,
                cancelable: false,
            }),
        );
    }

    private cancelJob() {
        console.log("cancelling job for workstation " + this.workstation_id);
        this.apiContext
            .fetchFromApi("syncmanager", `workstation/${this.workstation_id}/job`, {
                method: "DELETE",
                caller: "workstationcard.cancelJob",
            })
            .then((data: any) => {
                if (data.result_msg !== "ok") {
                    kioskErrorToast(`It was not possible to cancel the job: <strong>${data.result_msg}</strong>`);
                }
                this.triggerReloadWorkstations();
            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this as LitElement, e, "workstationlist.fetchWorkstations", () => {
                    kioskErrorToast(`It was not possible to cancel the job because of an error ${e}.`);
                });
            });
    }

    // onAfterEnter(location: any, commands: any, router: any) {
    //     console.log("OnAfterEnter", location, commands, router);
    //     // this._installSyncEvents();
    // }
}
