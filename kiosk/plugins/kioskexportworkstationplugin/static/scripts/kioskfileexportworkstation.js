/***********************************************************
 *
 * function for the create workstation page
 *
 **********************************************************/
function confirmPage() {
  if (checkRecordingGroup()) {
    submitPage();
  } else {
    kioskYesNoToast("The recording group you entered does not exist, yet. <br>" +
      "Do you really want to create a new recording group?", () => {
      submitPage();
    })
  }
}

function submitPage() {
  document.getElementById("new-workstation-form").submit();
}

function cancelPage(event) {
  event.preventDefault();
  kioskYesNoToast("Your changes will be lost, are you sure you want to cancel?", () => {
    window.location.assign(getRoutefor("syncmanager.sync_manager_show"));
  })
}

function checkRecordingGroup() {
  let recordingGroup = document.getElementById("recording-group").value.toLowerCase();
  let result = true
  if (recordingGroup) {
    result = false
    let recordingGroups = []
    let options = $("#recording-groups > option")
    options.each(function(index) {
      let v = String(this.value)
      if (v.toLowerCase() === recordingGroup) {
        result = true
      }
    })
  }
  return result
}

/***********************************************************
 *
 * menu functions
 *
 **********************************************************/




//# sourceURL=kioskexportworkstation.js

