
function onFacadeImageClicked(e, evt) {
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
    const clickedElement = evt.target
    const uuid = clickedElement.dataset.uuid
    const width = clickedElement.dataset.width
    const height = clickedElement.dataset.height

    if (document.hasOwnProperty("fileViewerController")) {
        const fwc = document.fileViewerController
        fwc.opened = (e) => {
            console.log("fws.opened", e)
            showRainbowProgress(false)
            if (e?.result) {
                document.getElementById("broken-image").style.display = "none"
            } else {
                document.getElementById("broken-image").style.display = "grid"
            }
        }
        fwc.beforeOpen = () => {
            showRainbowProgress(true)
        }
        if (fwc) {
            fwc.clear()
            // document.filesOnPage.forEach(f => fwc.addFile(f))
            // fwc.addFile({ uuid: clickedUuid })
            fwc.addFile({
                uuid: uuid,
                width: numOr0(width),
                height: numOr0(height),
            });
            fwc.showFiles(uuid)
            return
        }
    }
    kioskErrorToast("Currently the viewer is not present. Please try refreshing the page. (Err: There is no FileViewerController present)")
}

