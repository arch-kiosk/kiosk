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
  const form = document.getElementById("new-workstation-form")
  const timeZone = document.getElementById("time-zone-index").value
  if (timeZone && timeZone !== "") {
    const hidden = document.createElement("input")
    hidden.setAttribute("name", "time_zone_index")
    hidden.setAttribute("value", timeZone)
    hidden.setAttribute("type", "hidden")
    form.appendChild(hidden)
  }
  form.submit();
}

function cancelPage(event) {
  event.preventDefault();
  kioskYesNoToast("Your changes will be lost, are you sure you want to cancel?", () => {
    window.location.replace(getRoutefor("syncmanager.sync_manager_show"));
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

function fmWorkstationsPrepare(ws_id) {

}

//# sourceURL=kioskfilemakerworkstation.js
