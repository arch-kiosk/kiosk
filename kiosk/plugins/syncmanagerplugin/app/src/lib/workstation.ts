export class Workstation {
    workstation_id: string
    workstation_class: string
    description: string
    recording_group: string
    state_text: string
    state_description: string
    disabled: boolean
    icon_code: string
    icon_url: string
    job_status: string
    job_status_code: number
    job_result: {[key: string]: any} = {}
    job_progress: {[key: string]: any} = {}
    actions:{[key: string]: string} = {}
    meta: string

    public from_dict(r: {[key: string]: any}) {
        this.description = r["description"]
        this.workstation_id = r["id"]
        this.state_text = r["state_text"]
        this.state_description = r["state_description"]
        this.disabled = r["disabled"]
        this.recording_group = r["recording_group"] ? r["recording_group"] : 'unassigned'
        this.workstation_class = r["workstation_class"]
        this.icon_code = "icon_code" in r ? r["icon_code"] : ""
        this.icon_url = "icon_url" in r ? r["icon_url"] : ""
        this.job_status = "job_status" in r ? r["job_status"] : ""
        this.job_status_code = "job_status_code" in r ? r["job_status_code"] : ""
        this.job_result = "job_result" in r ? r["job_result"] : ""
        this.job_progress = "job_progress" in r ? r["job_progress"] : {}
        this.actions = "actions" in r ? r["actions"] : {}
        this.meta = "meta" in r ? r["meta"] : {}
        return this
    }
}
