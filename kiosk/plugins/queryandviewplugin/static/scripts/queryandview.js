
function onViewImageClicked(evt) {
    const numOr0 = (v) => {
        try {
            return parseInt(v)
        } catch{}
        return 0
    }

    function showRainbowProgress(show) {
        const el = document.querySelector(".rainbow-loading")
        if (el) el.style.display = show ? "unset" : "none"
    }

    console.log("onViewImageClicked", evt)
    const uuid = evt.detail.uuid
    if (document.hasOwnProperty("fileViewerController")) {
        const fwc = document.fileViewerController
        const elOpenInNewTab= document.getElementById("open-image-in-new-tab")
        const elOpenInNewTabText= document.getElementById("open-in-new-tab-text")
        elOpenInNewTab.style.display = 'none'
        fwc.opened = (e) => {
            console.log("fws.opened", e)
            showRainbowProgress(false)
            if (e?.result) {
                document.getElementById("broken-image").style.display = "none"
                // here comes a hack: The issue here is that this can only be reliably
                // done once both the image and the data have arrived. Let's hope it does that within a second.
                setTimeout(function () {
                    elOpenInNewTab.style.display = elOpenInNewTabText.innerText === '' ? 'none' : 'block'
                }, 1000)
            } else {
                document.getElementById("broken-image").style.display = "grid"
            }
        }
        fwc.beforeOpen = () => {
            elOpenInNewTab.style.display = "none"
            document.getElementById("broken-image").style.display = "none"
            showRainbowProgress(true)
        }
        if (fwc) {
            fwc.clear()
            debugger;
            console.log(`Selecting image ${evt.detail}`);
            const fileList = evt.detail?.fileList
            if (fileList) {
                for (const fileObject of fileList) {
                    fwc.addFile(fileObject);
                }
            }
            fwc.showFiles(uuid)
            return
        }
    }
    kioskErrorToast("Currently the viewer is not present. Please try refreshing the page. (Err: There is no FileViewerController present)")
}

function triggerUploadQuery(endpoint) {
    const route = getRoutefor(endpoint)
    kioskOpenModalDialog(route, {
        closeOnBgClick: false,
        showCloseBtn: true,
        callbacks: {
            open: () => {
            },
            close: () => {
            },
            ajaxFailed: () => {
                //@ts-ignore
                $.magnificPopup.close();
                kioskErrorToast("Sorry, it was not possible to start this feature.");
            }
        }
    })
}

function initFileViewer(app) {
    if (!document.hasOwnProperty("fileViewerController")) {
        document.apiContext = app?.apiContext
        if (!document.hasOwnProperty("apiContext") || !document.apiContext) {
            console.error("FileViewerController cannot be initialized: no apiContext");
            return false
        } else {
            let lb = document.getElementsByTagName("kiosk-lightbox")[0];
            document.fileViewerController = new FileViewerController(document.apiContext, lb,
                true, true);
            console.log("FileViewerController initialized");
        }
    }
    return true
}
