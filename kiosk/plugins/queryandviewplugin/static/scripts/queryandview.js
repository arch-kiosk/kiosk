function onViewImageClicked(evt) {
    const uuid = evt.detail
    kioskOpenModalDialog("/filerepository/editdialog/" + uuid + "?read_only=1", {});
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

