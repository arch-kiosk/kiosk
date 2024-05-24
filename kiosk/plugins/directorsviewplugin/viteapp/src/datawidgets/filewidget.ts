// @ts-ignore
import { html, LitElement, unsafeCSS } from "lit";
import {customElement} from 'lit/decorators.js'
// @ts-ignore
import local_css from '../styles/component-file-widget.sass?inline';
import {State} from "../store/reducer";
// @ts-ignore
import {store} from '../store/store.ts';
import {
    StoreContextSelector,
    StoreTeamSelector,
    StoreDateSelector,
    setDataViewClassValue
// @ts-ignore
} from '../store/actions.ts';
import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import {fetchFromApi, FetchException} from "../../../../../static/scripts/kioskapputils.js"
import {
    getSqlDate,
    Constant,
    getRecordTypeNames,
    name2RecordType,
    recordType2Name,
    handleCommonFetchErrors
//@ts-ignore
} from "../lib/applib.ts";
// @ts-ignore
import "./fileview.ts"
// @ts-ignore
import { KioskAppComponent } from "../../kioskapplib/kioskappcomponent.ts";

class FileRecord {
    identifier: string
    modified_by: string
    uid_file: string
    description: string
    image_description: string
    filename: string
    record_type: string
    modified: Date
}

export class FileWidgetResolution {
    height: number
    width: number
    label: string
    id: string

}

@customElement('file-widget')
class FileWidget extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    selected_date: Date = null
    selected_context: string = ""
    selected_member: string = ""
    selected_image: string = ""
    selected_sort: string = "modified"
    selected_resolution: string = ""
    files: Array<FileRecord> = []
    fetching: boolean = false
    fetch_error: string = ""
    viewMode: string = "list"
    sort_by: { [key: string]: Array<string> }= {
        "modified": ["modified", "identifier"],
        "identifier": ["primary_identifier","identifier", "created"],
    }
    record_types: Set<string> = new Set()
    show_record_types: string = ""
    record_type_names: { [key: string]: string } = null

    private record_count: number = 0;
    private page_size: number = 0;

    static properties = {
        ...super.properties,
        selected_context: {type: String},
        selected_member: {type: String},
        selected_date: {type: Date},
        selected_resolution: {type: String},
        selected_image: {type: String},
        selected_sort: {type: String},
        fetching: {type: Boolean},
        sort_by: {type: Array},
        viewMode: {type: String},
        show_record_types: {type: String}
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchResolutions();
    }

    fetchResolutions() {
        if (!this.selected_resolution) {
            if (this.apiContext) {
                this.apiContext.fetchFromApi("", "files/resolutions",
                    {
                        method: "GET",
                        caller: "filewidget.fetch_resolutions",
                    })
                    .then((json: object) => {
                        store.dispatch(setDataViewClassValue("filewidget", "resolutions", json))
                    })
                    .catch((e: FetchException) => {
                        handleCommonFetchErrors(this, e, "fileWidget.fetchResolutions", null)
                    })
            }
        }
    }

    get_conditions(us_date: string, identifier: string, member: string) {
        if (identifier || member) {
            let conditions = [`equals(modified_date, ${us_date})`]
            if (identifier) conditions.push(`equals(base_identifier, '${identifier}')`)
            if (member) conditions.push(`equals(modified_by, '${member}')`)
            return {
                "AND": conditions
            }
        } else
            return {
                "?": `equals(modified_date, ${us_date})`
            }

    }

    fetch_data() {
        this.fetching = true
        const us_date = getSqlDate(this.selected_date)
        const conditions = this.get_conditions(us_date, this.selected_context, this.selected_member)
        // console.log(conditions)
        this.apiContext.fetchFromApi("", "cql/query",
            {
                method: "POST",
                caller: "filewidget.fetch_data",
                body: JSON.stringify({
                        "cql": {
                            "base": {
                                "scope": {
                                    "unit": "browse()"
                                },
                                "target": {
                                    "field_or_instruction": "uid_file()"
                                },
                                "additional_fields": {
                                    "modified_date": {
                                        "field_or_instruction": "replfield_modified()",
                                        "default": "",
                                        "format": "datetime(date)"
                                    },
                                    "modified_timestamp": {
                                        "field_or_instruction": "modified",
                                        "default": "",
                                    },
                                    "modified_by": {
                                        "field_or_instruction": "modified_by",
                                        "default": ""
                                    },
                                    "description": {
                                        "field_or_instruction": "describes_file()",
                                        "default": ""
                                    },
                                    "image_description": {
                                        "field_or_instruction": "uid_file()",
                                        "default": "",
                                        "substitute": "lookup('images','uid','description')"
                                    },
                                    "filename": {
                                        "field_or_instruction": "uid_file()",
                                        "default": "",
                                        "substitute": "lookup('images','uid','export_filename')"
                                    }

                                }
                            },
                            "meta": {
                                "version": 0.1
                            },
                            "query": {
                                "columns": {
                                    "base_identifier": {
                                        "source_field": "identifier"
                                    },
                                    "identifier": {
                                        "source_field": "primary_identifier"
                                    },
                                    "modified_date": {
                                        "source_field": "modified_date"
                                    },
                                    "modified_timestamp": {
                                        "source_field": "modified_timestamp"
                                    },
                                    "modified_by": {
                                        "source_field": "modified_by"
                                    },
                                    "description": {
                                        "source_field": "description"
                                    },
                                    "image_description": {
                                        "source_field": "image_description"
                                    },
                                    "filename": {
                                        "source_field": "filename"
                                    },
                                    "record_type": {
                                        "source_field": "record_type"
                                    },
                                    "uid_file": {
                                        "source_field": "data"
                                    }
                                },
                                "conditions": conditions,
                                "distinct": "True",
                                "type": "Raw"
                            }
                        }
                    }
                ),
            },
        )
            .then((data: any) => {
                if (data.result_msg !== "ok") {
                    this.record_count = 0
                    this.fetch_error = data.result_msg
                } else {
                    this.fetch_error = ""
                    this.record_count = data.overall_record_count
                    this.page_size = data.page_size
                    this.load_files(data.records)
                }

                this.fetching = false

            })
            .catch((e: FetchException) => {
                handleCommonFetchErrors(this, e, "filewidget.fetch_data", null)
            })
    }

    load_files(records: []) {
        this.files = []
        this.record_types = new Set()
        records.forEach((r: any) => {
            let file = new FileRecord()
            file.identifier = r.identifier
            file.modified_by = r.modified_by ? r.modified_by : "?"
            file.modified = new Date(r.modified_timestamp)
            file.uid_file = r.uid_file
            file.description = r.description
            file.image_description = r.image_description
            file.filename = r.filename
            file.record_type = r.record_type
            this.record_types.add(r.record_type)
            this.files.push(file)
        })
        this.sort_records(this.sort_by[this.selected_sort])
    }

    sort_records(sort_by: Array<string>) {
        function _sort(a: FileRecord, b: FileRecord): number {
            for (let i = 0; i < sort_by.length; i++) {
                let attrib: string = sort_by[i];
                let value_a = a[attrib as keyof FileRecord]
                let value_b = b[attrib as keyof FileRecord]
                let result: number = 0

                if (typeof (value_a) === "string") {
                    result = (<string>value_a).localeCompare((<string>value_b))
                } else {
                    if (value_a < value_b) result = -1
                    if (value_a > value_b) result = 1
                }

                if (result != 0)
                    return result
            }
            return 0
        }

        // console.log(`sorting files by ${this.sort_by}`)
        this.files.sort(_sort)
        let newSelectedImage = ""
        this.files.forEach(file => {
            if (file.uid_file === this.selected_image || !newSelectedImage)
                newSelectedImage = file.uid_file
        })
        this.selected_image = newSelectedImage

        this.requestUpdate();
    }

    // protected changeContext(context: string) {
    //     store.dispatch(setSelector("contextSelector", {"selectedContext": context}))
    // }

    setSmallestResolution(resolutions: Array<FileWidgetResolution>): boolean {
        // console.log(resolutions)
        let minRes = -1
        let resolution = ""

        for (let i = 0; i < resolutions.length; i++) {
            let newRes = resolutions[i].height * resolutions[i].width
            if (minRes > newRes || minRes == -1) {
                minRes = newRes
                resolution = resolutions[i].id
            }
        }
        if (this.selected_resolution === resolution)
            return false
        // console.log(`Resolution is "${resolution}"`)
        this.selected_resolution = resolution
        console.log(`filewidget: selected resulution is ${this.selected_resolution}`)
        return true
    }

    stateChanged(state: State) {
        // console.log("FileWidget.state_changed triggered")
        let doFetch = false
        // console.log(state)
        if (state.initState == 0)
            return
        if ("dateSelector" in state.selectors && "filewidget" in state.dataviews) {
            let dataView = <{ [key: string]: object }>state.dataviews["filewidget"]
            if ("resolutions" in dataView) {
                doFetch = this.setSmallestResolution(<Array<FileWidgetResolution>>dataView["resolutions"])
                // noinspection DuplicatedCode
                let stateDate: Date = (<StoreDateSelector>state.selectors["dateSelector"]).selectedDate
                if ((!this.selected_date) || (stateDate.getTime() !== this.selected_date.getTime())) {
                    // console.log(`new selected data ${stateDate}`)
                    this.selected_date = stateDate
                    doFetch = true
                }
                if ("contextSelector" in state.selectors) {
                    let stateContext: string = (<StoreContextSelector>state.selectors["contextSelector"]).selectedContext
                    if (stateContext !== this.selected_context) {
                        // console.log(`new selected context ${stateContext}`)
                        this.selected_context = stateContext
                        doFetch = true
                    }
                }
                if ("teamSelector" in state.selectors) {
                    let stateMember: string = (<StoreTeamSelector>state.selectors["teamSelector"]).selectedMember
                    if (stateMember !== this.selected_member) {
                        // console.log(`new selected member ${stateMember}`)
                        this.selected_member = stateMember
                        doFetch = true
                    }
                }
                if (doFetch)
                    this.fetch_data()
            }
            if (state.constants.length > 0 && !this.record_type_names) {
                this.record_type_names = getRecordTypeNames(state.constants)
                if (!doFetch) this.requestUpdate()
            }
        }
    }

    protected recordTypeChanged(e: Event) {
        // @ts-ignore
        const value = e.currentTarget.value
        if (value === " all") {
            this.show_record_types = ""
        } else {
            this.show_record_types = value
        }
    }

    protected gridView(e: Event) {
        this.viewMode = "grid"
    }

    protected listView(e: Event) {
        this.viewMode = "list"
    }

    protected imageView(e: Event) {
        this.viewMode = "image"
    }

    protected selectImage(e: CustomEvent) {
        const uid = e.detail
        this.selected_image = uid
        this.viewMode = "image"
    }

    apiRender() {
        const filteredCount = this.files.filter(x => (this.show_record_types === "" || x.record_type === this.show_record_types)).length
        return html`
                    <div class="file-widget">
                        <div class="headline">
                            <p>${this.record_count > this.page_size 
                                    ? html`${this.page_size} of ${filteredCount}` 
                                    : html`${filteredCount}`} Files</p>
                        </div>
                        <div class="controls">
                            <div class="controls-left">
                                ${this.renderRecordTypeSelector()}
                                ${this.renderSortSelector()}
                            </div>
                            <div class="controls-right">
                                <i @click=${this.listView}
                                   class="fa fa-view-list ${this.viewMode === "list" ? `selected-view-mode` : ``}"></i>
                                <i @click=${this.gridView}
                                   class="fa fa-view-grid ${this.viewMode === "grid" ? `selected-view-mode` : ``}"></i>
                                <i @click=${this.imageView}
                                   class="fa fa-view-image ${this.viewMode === "image" ? `selected-view-mode` : ``}"></i>
                            </div>
                        </div>
                        ${this.selected_date !== null && this.selected_resolution
                                ? this.render_widget()
                                : html`waiting for selection or server information...`}
                    </div>`
    }

    renderRecordTypeSelector() {
        if (!this.selected_date)
            return html``
        let record_types = Array.from(this.record_types)
        record_types.push(" all")
        record_types.sort()
        let selected = this.show_record_types == "" ? " all" : this.show_record_types
        return html`
            <div class="control-container">
            <label for="record-type-selector">record type</label>
            <select name="record-type-selector" id="record-type-selector" @change="${this.recordTypeChanged}">
                ${record_types.map(record_type => html`
                            <option value="${record_type}"
                                    ?selected="${(selected === record_type)}">
                                ${recordType2Name(this.record_type_names, record_type)}
                            </option>
                        `
                )}
            </select></div>
        `
    }

    protected render_widget() {
        if (!this.selected_date) {
            return html`please select a date`
        }
        if (this.fetching)
            return html`fetching data ...`
        else {
            if (this.files.length == 0) {
                return html`
                    <div class="no-files">
                        <p>No files modified on that date / for that context</p>
                    </div>`
            }
            if (this.viewMode == "list") {
                return this.renderListView()
            } else {
                if (this.viewMode == "grid") {
                    return this.renderGridView()
                } else {
                    return this.renderImageView()
                }
            }
        }
    }

    protected renderListView() {
        return html`
            <div id="file-list" class="file-list">
                ${this.files.map(file => html`
                    ${(this.show_record_types === "" || file.record_type === this.show_record_types)
                            ? html`
                                <div class="file">
                                    <div class="file-body">
                                        <file-view id="${file.uid_file}"
                                                   .apiContext="${this.apiContext}"
                                                   .uuid_file="${file.uid_file}"
                                                   .resolution="${this.selected_resolution}"
                                                   .description="${file.description}"
                                                   class="${this.selected_image === file.uid_file ? "selected-image" : undefined}"
                                                   @select-image="${this.selectImage}"
                                        >
                                        </file-view>
                                    </div>
                                    <div class="file-headline">
                                        <div class="main-headline">
                                            <p>${file.identifier}</p>
                                            <p>by: ${file.modified_by}
                                                    (${file.modified.toLocaleTimeString([],
                                                        {hour: '2-digit', minute: '2-digit'})})
                                            </p>
                                        </div>
                                        <p>${recordType2Name(this.record_type_names, file.record_type)}</p>
                                        <p>${file.description}</p>
                                        <p>${file.image_description}</p>
                                        ${file.filename?html`<p>filename: ${file.filename}</p>`:undefined}
                                    </div>
                                </div>`
                            : undefined}`
                )}
            </div>`
    }

    protected renderGridView() {
        return html`
            <div class="file-grid">
                ${this.files.map(file => html`
                    ${(this.show_record_types === "" || file.record_type === this.show_record_types)
                            ? html`
                                <div class="grid-cell" id="${file.uid_file}">
                                    <file-view @select-image="${this.selectImage}"
                                               .apiContext="${this.apiContext}"
                                               .uuid_file="${file.uid_file}"
                                               .resolution="${this.selected_resolution}"
                                               class="${this.selected_image === file.uid_file ? "selected-image" : undefined}"
                                    >
                                    </file-view>
                                    <p>${file.identifier}</p>
                                </div>`
                            : undefined
                    }`
                )}
            </div>`
    }

    sortTypeChanged(e: Event) {
        //@ts-ignore
        this.selected_sort = e.currentTarget.value
        this.sort_records(this.sort_by[this.selected_sort])
    }

    renderSortSelector() {
        return html`
            <div class="control-container"><label for="sort-type-selector">sort by</label>
            <select name="sort-type-selector" id="sort-type-selector" @change="${this.sortTypeChanged}">
                ${Object.keys(this.sort_by).map(sort_id => html`
                            <option value="${sort_id}"
                                    ?selected="${(this.selected_sort === sort_id)}">
                                ${sort_id}
                            </option>
                        `
        )}
            </select></div>
        `
    }

    protected renderImageView() {
        return html`
            <div class="file-view">
                ${this.files.map(file => html`
                    ${(this.selected_image === file.uid_file 
                        && (this.show_record_types === "" || file.record_type === this.show_record_types))
                        ?html`
                            <file-view id="${file.uid_file}"
                                       .apiContext="${this.apiContext}"
                                       .uuid_file="${file.uid_file}"
                                       resolution="master">
                            </file-view>
                            <div class="file-headline">
                                <div class="main-headline">
                                    <p>${file.identifier}</p>
                                    <p>by: ${file.modified_by}
                                        (${file.modified.toLocaleTimeString([],
                                {hour: '2-digit', minute: '2-digit'})})
                                    </p>
                                </div>
                                <p>${recordType2Name(this.record_type_names, file.record_type)}</p>
                                <p>${file.description}</p>
                                <p>ref# [${this.selected_image}]</p>
                            </div>`
                        : undefined
                }`
            )}
            </div>`
    }

    protected updated(_changedProperties: any) {
        super.updated(_changedProperties);

        if (this.selected_image) {
            let b = this.shadowRoot.getElementById(this.selected_image);
            // console.log(`found ${b.id}`)
            // b.scrollIntoView();
            // this.shadowRoot.getElementById("file-list").scrollBy(0,-5)
            if (b)
                setTimeout(() => {
                    b.scrollIntoView({block: 'center', inline: 'center'});
                    // let fileList = this.shadowRoot.getElementById("file-list")
                    // if (fileList) fileList.scrollBy(0,-5)
                }, 500)
        }
    }
}