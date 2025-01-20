
class FileViewerController {
    files = []  //object with uuid, width, height
    initialIndex = 0
    currentIndex = -1
    apiContext = null
    lightBoxElement = null
    url=  ""
    hasData = false

    constructor(apiContext, lightBoxElement, hasData=false) {
        this.apiContext = apiContext
        this.hasData = hasData
        this.clear()
        this.setLightBoxElement(lightBoxElement)
    }

    clear() {
        this.files = []
        this.initialIndex = 0
        this.currentIndex = -1
        this.url = ""
    }

    _loadImage(fileIndex) {
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
                        resolution: "master"
                    })).url;
                if (url) {
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

        console.log(`FileViewerController loading from ${address}`)
        kioskAjaxGetPartial(
            address,
            {},
            "fr-data-partial",
            (targetId, textStatus, jqXHR, stateData) => {
                console.log("_loadData successful")
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

    reloadData() {
        this._loadImage(this.currentIndex)
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
        if (this.currentIndex > -1) {
            try {
                this.files.splice(this.currentIndex, 1)
            } catch(e) {
                console.log("invalidateCurrent threw Error: ", e);
            }
            if (this.currentIndex < this.files.length) return this._loadImage(this.currentIndex)
            if (this.currentIndex !== 0) return this._loadImage(this.currentIndex -1)
        }
        return false
    }

    setLightBoxElement(lightBoxElement) {
        if (this.lightBoxElement) {
            this.detachHandlers()
        }
        this.lightBoxElement = lightBoxElement
        this.lightBoxElement.hasData = this.hasData
        this.lightBoxElement.addEventListener("beforeClose", this.onBeforeClose)
        this.lightBoxElement.apiContext = this.apiContext
        this.lightBoxElement.setURLProvider(this);
    }

    onBeforeClose(e) {
        const partial = document.getElementById("fr-data-partial")
        const recordButtons = partial?.querySelector("#ef-record-buttons")
        if (recordButtons?.classList.contains("ef-record-dirty")) {
            const defObject = e.detail.defer(e)
            kioskYesNoToast("You seem to have changed data. Do you really want to close the lightbox without saving your changes?",
                () => defObject.finish(), () => {defObject.cancel()})
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
            return(this.files[idx])
        }
        return null
    }

    removeFile(uuid) {
        const idx = this.getFileIndex(uuid)
        if (idx > -1) {
            return this.files.splice(idx,1)
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
     */
    showFiles(uuid=null) {
        this.initialIndex = uuid ? this.getFileIndex(uuid) : 0
        this.currentIndex = -1
        if (this.initialIndex > -1) {
            this.lightBoxElement.openDialog()
        }
    }
}
