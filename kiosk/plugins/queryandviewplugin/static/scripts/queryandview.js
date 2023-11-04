function onViewImageClicked(evt) {
    const uuid = evt.detail
    kioskOpenModalDialog("/filerepository/editdialog/" + uuid + "?read_only=1", {});
}
