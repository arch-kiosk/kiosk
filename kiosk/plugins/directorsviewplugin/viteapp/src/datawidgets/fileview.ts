// @ts-ignore
import { html, LitElement, unsafeCSS } from "lit";
import {customElement} from 'lit/decorators.js'
// @ts-ignore
import local_css from '../styles/component-file-view.sass?inline';
// import {connect} from "pwa-helpers/connect-mixin";
// @ts-ignore
import {fetchBlobFromApi, FetchException} from "../../../../../static/scripts/kioskapputils.js"
// @ts-ignore
import {handleCommonFetchErrors} from "../lib/applib.ts";
// @ts-ignore
import { KioskAppComponent } from "../../kioskapplib/kioskappcomponent.ts";

@customElement('file-view')
class FileWidget extends KioskAppComponent {
    static styles = unsafeCSS(local_css);

    _resolution = ""
    description = ""
    _visible = false

    private loaded = false
    private imageUrl = ""
    private observer: IntersectionObserver = null
    _uuid_file = ""

    static properties = {
        ...super.properties,
        uuid_file: {type: String},
        resolution: {type: String},
        loaded: {type: Boolean},
        imageUrl: {type: String},
        visible: {type: Boolean},
        description: {type: String}
    }

    constructor() {
        super();
        this.observerCallback = this.observerCallback.bind(this);
        // @ts-ignore
        this._init();
    }


    get uuid_file() {
        return (this._uuid_file)
    }

    set uuid_file(value: string) {
        if (value !== this._uuid_file) {
            this._uuid_file = value
            this.load_image()
        }
    }

    get resolution() {
        return (this._resolution)
    }

    set resolution(value: string) {
        if (value !== this._resolution) {
            this._resolution = value
            this.load_image()
        }
    }

    get visible() {
        return (this._visible)
    }

    set visible(value: boolean) {
        if (value !== this._visible) {
            this._visible = value
            this.load_image()
        }
    }

    _init() {
        this._visible = false;
        this.loaded = false;
    }

    connectedCallback() {
        super.connectedCallback();
        // Remove the wrapping `<lazy-image>` element from the a11y tree.
        this.setAttribute('role', 'presentation');
        // if IntersectionObserver is available, initialize it.
        this.initIntersectionObserver();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.disconnectObserver();
    }

    /**
     * Sets the `intersecting` property when the element is on screen.
     * @param  {[IntersectionObserverEntry]} entries
     * @protected
     */
    observerCallback(entries: IntersectionObserverEntry[]) {
        // @ts-ignore
        const isIntersecting = ({ isIntersecting }) => isIntersecting;
        if (entries.some(isIntersecting)) {
            this.visible = true;
        }
    }

    /**
     * Initializes the IntersectionObserver when the element instantiates.
     * @protected
     */
    initIntersectionObserver() {
        // if IntersectionObserver is unavailable, simply load the image.
        if (!('IntersectionObserver' in window)) return this.visible = true;
        // Short-circuit if observer has already initialized.
        if (this.observer) return;
        // Start loading the image 10px before it appears on screen
        const rootMargin = '10px';
        this.observer =
            new IntersectionObserver(this.observerCallback, { rootMargin });
        this.observer.observe(this);
    }

    /**
     * Disconnects and unloads the IntersectionObserver.
     * @protected
     */
    disconnectObserver() {
        this.observer.disconnect();
        this.observer = null;
        delete this.observer;
    }

    protected clicked(e: Event) {
        this.dispatchEvent(new CustomEvent("select-image",
            {bubbles: true, composed: true, detail: this._uuid_file}));
    }


    fetch_image() {
        this.loaded = false
        let searchParams = new URLSearchParams({
            uuid: this._uuid_file,
            resolution: this._resolution
        })
        this.apiContext.fetchBlobFromApi("", "files/file",
            {
                method: "GET",
                caller: "directorsview.fileview"

            },"v1", searchParams)
            .then((blob: Blob) => {
                this.imageUrl = URL.createObjectURL(blob);
                this.loaded = true
            })
            .catch((e: FetchException) => {
                if (e.response.status != 404) {
                    handleCommonFetchErrors(this, e, "fileview.fetch_image", null)
                }
            })
    }


    load_image() {
        if (this._resolution && this._uuid_file) {
            if  (this._visible) {
                this.fetch_image()
            }
        }
    }

    render_image() {
        return html`<img @click="${this.clicked}" src="${this.imageUrl}" alt="${this.description}"/>`
    }

    render_placeholder() {
        return html`
            <div class="placeholder"><i class="fa fa-camera"></i></div>`
    }

    apiRender() {
        return html`
                    ${this.loaded
                            ? this.render_image()
                            : this.render_placeholder()}
                    </div>`
    }

}
