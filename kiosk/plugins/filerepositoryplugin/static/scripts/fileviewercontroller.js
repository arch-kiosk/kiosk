
/*tools */
function fvOpenInNewTab(uuid, representationId="") {
    if (representationId === "" || representationId === "original") representationId = "ct"
    let url = new URL("/filerepository/fetch/" + uuid, window.location.origin)
    url.searchParams.append(representationId, true)
    console.log(`fetching ${url.toString()}`)
    window.open(url.toString(), "_blank");
}

function fvOnOpenInNewTabClick(e) {
    closeMenu("#download-menu-contents", $("#download-menu"));
    let uuid = $("#uid").text();
    fvOpenInNewTab(uuid)
}


/* FileViewerController Class */
class FileViewerController {
    files = []  //object with uuid, width, height
    initialIndex = 0
    currentIndex = -1
    apiContext = null
    lightBoxElement = null
    url=  ""
    hasData = false
    readOnly = false
    useArchive = false  // if true, the file viewer will try to get the file from the current archive
    defaultFullScreenRes = "master"
    resolutions = {}  // object with label = key (yup!)

    opened = () => {}
    beforeOpen = () => {}

    constructor(apiContext, lightBoxElement, hasData=false, readOnly=false) {
        this.apiContext = apiContext
        this.hasData = hasData
        this.readOnly = readOnly
        this.clear()
        this.setLightBoxElement(lightBoxElement)
    }

    get width() {
        return this.files[this.currentIndex < 0?this.initialIndex:this.currentIndex].width
    }

    get height() {
        return this.files[this.currentIndex < 0?this.initialIndex:this.currentIndex].height
    }

    clear() {
        this.files = []
        this.initialIndex = 0
        this.currentIndex = -1
        this.url = ""
    }

    _loadImage(fileIndex, loadData=true) {
        const resolutionLabel = this.lightBoxElement?.currentResolution??""
        let resolutionId = "master"

        try {
            if (resolutionLabel !== "") {
                let entry = Object.entries(this.resolutions).find((v) => v[0] === resolutionLabel)
                resolutionId = entry ? entry[1] : "master"
            }
        }
        catch (e) {
            console.log("FileViewerController._loadImage: resolutionId not found: ", resolutionId)
        }
        console.log("_loadImage loads ", resolutionId, this.files[fileIndex]);

        if (this.apiContext && this.lightBoxElement) {
            if (fileIndex >= 0 && fileIndex < this.files.length) {
                const uuid = this.files[fileIndex].uuid
                const url = this.apiContext.getFetchURL(
                    "",
                    `files/file`,
                    {
                        method: "GET",
                        caller: "kioskview.fetchFileFromApi",
                    },
                    "v1",
                    new URLSearchParams({
                        uuid: uuid,
                        resolution: resolutionId
                    })).url;
                if (url) {
                    if (loadData)
                        this._loadData(uuid)
                    this.url = url
                    this.currentIndex = fileIndex
                    return true
                }
            }
        }
        return false
    }

    _loadData(uuid) {
        let address = `/filerepository/editpartial/${uuid}`;
        if (this.useArchive) {
            address = address + "/use_archive=1"
        }
        let url = new URL(address, window.location.origin)
        if (this.readOnly) url.searchParams.append("readonly", true)
        console.log(`fetching ${url.toString()}`)

        console.log(`FileViewerController loading from ${address}`)
        kioskAjaxGetPartial(
            url.toString(),
            {},
            "fr-data-partial",
            (targetId, textStatus, jqXHR, stateData) => {
                console.log("_loadData successful")
                this._analyzeFileInfo()
            },
            (err_msg, textStatus, jqXHR, stateData) => {
                kioskErrorToast("FileViewerController._loadData interrupted due to this error:<br>" + err_msg);
            },
            {},
            {},
            null,
            undefined,
            "GET")
    }

    _analyzeFileInfo() {
        const elFileInfo = document.getElementById("ef-file-info")
        const elBrokenImageText = document.getElementById("broken-image-text")
        const elOpenInNewTabText= document.getElementById("open-in-new-tab-text")
        if (elOpenInNewTabText) elOpenInNewTabText.innerText = ""

        if (elFileInfo) {
            const fileType = elFileInfo.dataset.fileType
            const newTabRes = elFileInfo.dataset.openInNewTab??""
            if (fileType) {
                if (fileType === "svg" || fileType === "pdf" || fileType === "mov" || fileType.startsWith("mp")) {
                    // elBrokenImageText.style.display = "block"
                    elBrokenImageText.innerHTML = `Sorry, this file type (${fileType.toUpperCase()}) is not supported by the current viewer or it has no visual representation.` +
                        (newTabRes ? "": "<br/>Please use the download button and download the file into a new browser tab.!")

                } else {
                    elBrokenImageText.innerText = `Sorry, the file is either broken or missing or the file type (${fileType.toUpperCase()}) has no visual representation.`
                    // elBrokenImageText.style.display = "none"
                }
                if (newTabRes) {
                    elBrokenImageText.innerHTML += '<br/><span class="fr-click-to-open-tab">Click here to download the original file into a new browser tab</span>'
                    elOpenInNewTabText.innerHTML = '<span class="fr-click-to-open-tab">Click here to open the original file in a new browser tab.</span>'
                }
            }
        }
        document.querySelectorAll(".fr-click-to-open-tab").forEach(el => {
            el.addEventListener("click", fvOnOpenInNewTabClick)
        })
    }

    reloadData() {
        this._loadImage(this.currentIndex)
    }

    reloadFile(newDimensions = null) {
        if (this.currentIndex > -1) {
            if (newDimensions) {
                this.files[this.currentIndex].width = newDimensions.width
                this.files[this.currentIndex].height = newDimensions.height
            }
            this.lightBoxElement.reloadFile()
        }
    }

    // urlProvider start
    prev() {
        return this._loadImage( this.currentIndex === -1 ? this.initialIndex : this.currentIndex - 1)
    }

    next() {
        return this._loadImage( this.currentIndex === -1 ? this.initialIndex : this.currentIndex + 1)
    }
    // urlProvider end

    eof() {
        return (this.currentIndex > -1 ? this.currentIndex : this.initialIndex)  >= this.files.length -1
    }

    bof() {
        return (this.currentIndex > -1 ? this.currentIndex : this.initialIndex) <= 0
    }

    invalidateCurrent() {
        let rc = false
        if (this.currentIndex > -1) {
            try {
                this.files.splice(this.currentIndex, 1)
            } catch(e) {
                console.log("invalidateCurrent threw Error: ", e);
            }
            if (this.currentIndex < this.files.length) rc = this._loadImage(this.currentIndex)
            if (this.currentIndex !== 0) rc = this._loadImage(this.currentIndex -1)
            this.reloadFile()
        }
        return rc
    }

    setLightBoxElement(lightBoxElement) {
        if (this.lightBoxElement) {
            this.detachHandlers()
        }
        this.lightBoxElement = lightBoxElement
        this.lightBoxElement.hasData = this.hasData

        try {
            if (this.lightBoxElement.dataset.hasOwnProperty("resolutions")) {
                let resolutions = this.lightBoxElement.dataset.resolutions.split(",")
                for (let i = 0; i < resolutions.length; i += 2) {
                    this.resolutions[resolutions[i]] = resolutions[i + 1]
                }
            } else {
                this.resolutions = { "master": "master" }
            }
        } catch (e) {
                this.resolutions = { "master": "master" }
        }
        this.resolutions["best"] = "best"
        this.lightBoxElement.resolutions = Object.keys(this.resolutions)
        this.defaultFullScreenRes = this.lightBoxElement.dataset.hasOwnProperty("fullscreenRes")?this.lightBoxElement.dataset.fullscreenRes:this.defaultFullScreenRes
        let entry = Object.entries(this.resolutions).find((v) => v[1] === this.defaultFullScreenRes)
        const defaultFullscreenResLabel = entry?entry[0]:"master"

        this.lightBoxElement.addEventListener("beforeOpen", (e) => this.onBeforeOpen(e))
        this.lightBoxElement.addEventListener("opened", (e) => this.onOpened(e))
        this.lightBoxElement.addEventListener("beforeClose", (e) => this.onBeforeClose(e))
        this.lightBoxElement.addEventListener("closed", (e) => this.onClosed(e))
        this.lightBoxElement.addEventListener("beforeNext", this.onBeforeNav)
        this.lightBoxElement.addEventListener("beforePrev", this.onBeforeNav)
        this.lightBoxElement.addEventListener("ResolutionChanged", (e) => this.onResolutionChanged(e))
        let userResolution = getCookie("kioskCurrentViewerResolution")
        entry = Object.entries(this.resolutions).find((v) => v[0] === userResolution)
        this.lightBoxElement.currentResolution = entry ? entry[0] : defaultFullscreenResLabel
        this.lightBoxElement.apiContext = this.apiContext
        this.lightBoxElement.setURLProvider(this);
    }

    onBeforeOpen(e) {
        this.beforeOpen(e.detail)
    }

    onOpened(e) {
        this.opened(e.detail)
    }

    onBeforeClose(e) {
        const partial = document.getElementById("fr-data-partial")
        const recordButtons = partial?.querySelector("#ef-record-buttons")
        if (recordButtons?.classList.contains("ef-record-dirty")) {
            const defObject = e.detail.defer(e)
            kioskYesNoToast("You seem to have changed data. Do you really want to close the lightbox without saving your changes?",
                () => defObject.finish(), () => defObject.cancel())
        }
    }

    onClosed(e) {
        const uuid = this.files[this.currentIndex]?.uuid
        activateImage(uuid)
        document.getElementById("broken-image").style.display = "none"
        console.log(`lightbox closed, moving to ${uuid}`);
    }

    onBeforeNav(e) {
        const partial = document.getElementById("fr-data-partial")
        const recordButtons = partial?.querySelector("#ef-record-buttons")
        if (recordButtons?.classList.contains("ef-record-dirty")) {
            const defObject = e.detail.defer(e)
            kioskYesNoToast("You seem to have changed data. <br/>" +
                "Do you really want to move to a different file before you have saved your changes?",
                () => defObject.finish(), () => defObject.cancel())
        }
    }

    onResolutionChanged(e) {
        console.log(this.lightBoxElement.currentResolution)
        setCookie("kioskCurrentViewerResolution", this.lightBoxElement.currentResolution)
        if (this._loadImage(this.currentIndex, false)) {
            this.reloadFile()
        }
    }

    addFile(fileObject) {
        if (this.getFileIndex(fileObject.uuid) === -1) {
            this.files.push(fileObject)
        }
    }

    getFile(uuid) {
        const idx = this.getFileIndex(uuid)
        if (idx > -1) {
            return (this.files[idx])
        }
        return null
    }

    removeFile(uuid) {
        const idx = this.getFileIndex(uuid)
        if (idx > -1) {
            return this.files.splice(idx, 1)
        }
        return null
    }

    getFileIndex(uuid) {
        for (const [index, f] of this.files.entries()) {
            if (f.uuid === uuid) return index
        }
        return -1
    }

    /**
     * shows the files in the file viewer.
     * @param uuid if set this is the first file the file viewer will show.
     * @param useArchive
     */
    showFiles(uuid = null, useArchive = false) {
        this.initialIndex = uuid ? this.getFileIndex(uuid) : 0
        this.currentIndex = -1
        this.useArchive = useArchive
        if (this.initialIndex > -1) {
            this.lightBoxElement.openDialog()
        }
    }
}
