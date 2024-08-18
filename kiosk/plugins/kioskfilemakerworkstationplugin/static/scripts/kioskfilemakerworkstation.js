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
    function addHiddenInput(elementId, fieldName, value) {
        const v = document.getElementById(elementId).value
        if (v && v !== "") {
            const hidden = document.createElement("input")
            hidden.setAttribute("name", fieldName)
            hidden.setAttribute("value", v)
            hidden.setAttribute("type", "hidden")
            form.appendChild(hidden)
        }
    }

    const form = document.getElementById("new-workstation-form")
    addHiddenInput("user-time-zone-index", "user_time_zone_index");
    addHiddenInput("recording-time-zone-index", "recording_time_zone_index");
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
        options.each(function (index) {
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
