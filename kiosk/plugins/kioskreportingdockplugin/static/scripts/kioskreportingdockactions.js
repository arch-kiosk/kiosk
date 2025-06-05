function kioskReportingDelete(ws_id, action_url) {
  kioskYesNoToast("Are you sure, you want to delete the file export definition '" + ws_id + "'?",
    () => {
      kioskReportingAction(ws_id, "deleting file export", action_url);
    },
  )
}

function kioskReportingStart(ws_id, action_url) {
  kioskYesNoToast("Are you sure, you want to start the file export '" + ws_id + "'?",
    () => {
      kioskReportingAction(ws_id, "starting file export", action_url);
    },
  )
}

function kioskReportingActivateFileManager(url) {
  if (url) window.location.assign(url);
}

function krd_action(ws_id, title, action_url) {
  $("#workstation-options").replaceWith("<div></div>");
  $("#dialog-subtitle").text(title);
  let btClose = $("#bt-close")
  kioskDisableButton(btClose, true)
  let targetUrl = "/kioskreportingdock/trigger/" + action_url + "/" + ws_id

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

function krd_run(ws_id, title, action_url) {
    kioskGetAjaxElement($("#dialog-workzone"),
                      "/kioskreportingdock/run/" + ws_id,
                      null,
                      $("#dialog-workzone"),
                      (response, status, xhr) => {
                        if (status == "error") {
                          kioskErrorToast(`An error occured: ${response}.<br>${xhr.responseJSON.message}.`, {
                            timeout: 5000,
                            transitionIn: 'fadeIn',
                            transitionOut: 'fadeOut'
                            // onClosed: function(instance, toast, closedBy){
                            //};
                          });
                          $.magnificPopup.close();
                        }
                      });
}

function krd_view(ws_id, title, action_url) {
    $.magnificPopup.close();
    window.open("/kioskreportingdock/view/" + ws_id, '_blank')
}

function krd_edit(ws_id, endpoint) {
  const route = getRoutefor(endpoint)
  window.location.replace(`${route}/${ws_id}/edit`);
}

//# sourceURL=kioskreportingdockaction.js
