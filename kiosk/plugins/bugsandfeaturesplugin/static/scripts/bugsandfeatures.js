function triggerBugsAndFeatures(endpoint="") {
  window.location.replace(getRoutefor(endpoint));
};

function editBug(uuid) {
  kioskOpenModalDialog("/bugsandfeatures/editdialog/"+uuid, {
    callbacks: {
      ajaxFailed : ()=>{
        $.magnificPopup.close();
        kioskErrorToast("Sorry, the modal dialog to edit this record wouldn't start.");
      }
    }
  });
}