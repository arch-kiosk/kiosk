function kioskFileExportDelete(ws_id, action_url) {
  kioskYesNoToast("Are you sure, you want to delete the file export definition '" + ws_id + "'?",
    () => {
      kioskFileExportAction(ws_id, "deleting file export", action_url);
    },
  )
}

function kioskFileExportStart(ws_id, action_url) {
  kioskYesNoToast("Are you sure, you want to start the file export '" + ws_id + "'?",
    () => {
      kioskFileExportAction(ws_id, "starting file export", action_url);
    },
  )
}

function kioskFileExportActivateFileManager(url) {
  if (url) window.location.replace(url);
}

function kioskFileExportAction(ws_id, title, action_url) {
  $("#workstation-options").replaceWith("<div></div>");
  $("#dialog-subtitle").text(title);
  let btClose = $("#bt-close")
  kioskDisableButton(btClose, true)
  let targetUrl = "/kioskexportworkstation/trigger/" + action_url + "/" + ws_id

  kioskSendAjaxCommand("POST", btClose, targetUrl, {},
    (json) => {
      $.magnificPopup.close()
      let message = ""
      if ("message" in json) {
        if (json.message.trim()) kioskSuccessToast(json.message);
      }
    },
    (err_code, json) => {
      $.magnificPopup.close()
      console.log(err_code, json)
      let message = ""
      if ("message" in json) message = ` (${json.message})`
      kioskErrorToast(`It was not possible to start this job${message}. Please try again.`);
      kioskDisableButton(btClose, false)
    })

}

function kfe_edit(ws_id, endpoint) {
  const route = getRoutefor(endpoint)
  window.location.replace(`${route}/${ws_id}/edit`);
}
