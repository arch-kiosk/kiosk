function kfw_disable(ws_id, action_url, disable) {
  kfw_action(ws_id,
    `set disabled to ${disable}`,
    action_url,
    true,
    {'disable': disable}
  )
}

function kfw_action(ws_id, title, action_url, ack = false, jsonData = {}) {
  console.log(ws_id, title, action_url)
  $("#workstation-options").replaceWith("<div></div>");
  $("#dialog-subtitle").text(title);
  let btClose = $("#bt-close")
  kioskDisableButton(btClose, true)

  let targetUrl = "/kioskfilemakerworkstation/trigger/" + action_url + "/" + ws_id

  if (!ack && (action_url === "reset" || action_url === "renew")) {
    kioskYesNoToast("Are you sure, you want to reset this workstation? Afterwards, you will not be able to import " +
      " any copy of it that is still out there!",
      () => {
        kfw_action(ws_id, title, action_url, true);
      },
      () => {
        $.magnificPopup.close()
      }, {})
    return
  }

  if (!ack && action_url === "fix_import") {
    kioskYesNoToast("This workstation's safety mechanisms prevented the last import. " +
        "<br><br>Do you know what you are doing and are you sure you want to sidestep those safety catches?<br><br>",
      () => {
        kfw_action(ws_id, title, action_url, true);
      },
      () => {
        $.magnificPopup.close()
      }, {})
    return
  }

  if (!ack && action_url === "delete") {
    kioskYesNoToast("Are you sure, you want to delete this workstation? " +
      "<br><span style='font-weight: bold'>You cannot undo this step! </span><br>" +
      "Should there be a workstation of this kind out there, its data will be lost!",
      () => {
        kfw_action(ws_id, title, action_url, true);
      },
      () => {
        $.magnificPopup.close()
      }, {})
    return
  }

  if (!ack && action_url === "reset_recording_group") {
    kioskYesNoToast("Are you sure, you want to reset this workstation's recording group? Note that the next first " +
      "preparation of a workstation for this recording group will be slower than usual.",
      () => {
        kfw_action(ws_id, title, action_url, true);
      },
      () => {
        $.magnificPopup.close()
      }, {})
    return
  }

  kioskSendAjaxCommand("POST", btClose, targetUrl, jsonData,
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

// function kfw_reset(ws_id) {
//   kioskYesNoToast("Are you sure, you want to reset this workstation? Afterwards, you will not be able to import " +
//     " any copy of it that is still out there!",
//     () => {
//       workstation_action(ws_id, "reset workstation", "reset");
//     }, () => {
//     }, {}, "#dialog-workzone");
// }


function kfw_download(ws_id) {

//$("#"+ctl_id).css('visibility', 'hidden');
  $("#dialog-subtitle").text("downloading recording system");
  installSpinner($("#workstation-options"), "Working on it...");

  $.fileDownload('/kioskfilemakerworkstation/workstation/' + ws_id + '/download/start')
    .done(function () {
      $.ajax({
        method: 'POST',
        url: '/kioskfilemakerworkstation/workstation/' + ws_id + '/download/response',
        dataType: "json",
        data: {result: 'ok'}
      })
        .done(function (data) {
          stop_spinner();
          console.log(data);
          if (data.success) {
            $("#ws-message-div").html("<i class=\"fas fa-check-circle\"></i> Download successfully initiated - perhaps even already finished. " +
              "Check with your browser.");
            // workstation_click.reload = true;
          } else {
            $("#ws-message-div").html("<i class=\"fas fa-bug\"></i> Sigh. Something went wrong with the download:<br>" +
              "<span style='color: var(--color-reddish)'>" + data.message + "</span>");
            // workstation_click.reload = true;
          }
        })
        .always(function () {
          //$("#"+ctl_id+"_spinner").remove();
          //$("#"+ctl_id).css('visibility', 'visible');
        });
    })
    .fail(function () {
      stop_spinner();
      $("#ws-message-div").html("<i class=\"fas fa-bug\"></i> " +
        "<span style='color: var(--color-reddish)'>Oh my. The download would not even start. " +
        "You may try again, but ...</span>");
    });
}

function kfw_initFileUpload() {
  console.log("initializing file upload...")
  try {
    $("#drop-area-div").dmUploader("cancel");
  } catch (e) {
    console.log(e)
  }
  let ws_id = $("#file-upload").attr("data");
  $('#drop-area-div').dmUploader({
    url: '/kioskfilemakerworkstation/workstation/' + ws_id + "/upload",
    dataType: 'json',
    extFilter: ['fmp12'],
    queue: false,
    auto: true,
    onInit: function () {
    },
    onBeforeUpload: function (id) {
      $("#dialog-subtitle").text("uploading new field data");
      //addSpinner is important here because it does not replace the upload zone.
      addSpinner($("#workstation-options"), "Initiating upload ...");
    },
    onUploadProgress: function (id, percent) {
      $("#ws-message-div").html("Upload of database at " + percent + " %.");
    },
    onUploadSuccess: function (id, data) {
      stop_spinner();
      console.log("upload completed");
      $("#dialog-subtitle").text("upload of new field data");
      if (data.success && data.log.length == 0) {
        $("#ws-message-div").html("<i class=\"fas fa-check-circle\"></i> Upload of database completed");
      } else {
        if (data.success) {
          kfw_show_dump(false, data.log, data.message);
        } else {
          kfw_show_dump(true, data.log, data.message);
        }
      }
    },
    onUploadError: function (id, message) {
      $("#ws-message-div").html("<i class=\"fas fa-angry\"></i> Really? The upload failed: <span style='color: red'>" + message + "</span>");
    },
    onFallbackMode: function (message) {
      kioskErrorToast('Browser not supported!: ' + message);
    },
    onFileExtError: function (file) {
      kioskErrorToast('Please upload only filemaker files (with the extension .fmp12).');
    }
  }); //end $('#drop-area-div').dmUploader
}

function kfw_show_dump(has_error, log, msg = "") {
  $("#dlg-spinner-wrapper").remove();
  console.log(log);
  $('#dialog-workzone').append("<div id='ws-error-message-div'></div>");
  $('#dialog-workzone').append("<div id='ws-error-snippets-wrapper'></div>");
  if (has_error) {
    if (msg != "") {
      $("#ws-error-message-div").html("Hmpf. Upload failed, and here's why: <br><br><span style='color: red'>" + msg + "</span>");
    } else {
      $("#ws-error-message-div").html("Hmpf. That failed for unknown reasons.");
    }
  } else {
    $("#ws-error-message-div").html("It has been done, but with this or these warnings: ");
  }
  $("#ws-error-message-div").css("margin-top", "1em");
  $("#ws-error-message-div").css("margin-bottom", "1em");
  if (log.length > 0) {
    $("#ws-error-snippets-wrapper").css("max-height", "400px");
    $("#ws-error-snippets-wrapper").css("overflow", "auto");
    obj = $('#ws-error-snippets-wrapper');

    first_error = false;
    for (let s of log) {
      classes = "ws-warning";
      if (!first_error) {
        if (s.toLowerCase().indexOf("error") > -1) {
          classes = "ws-warning first-error";
          first_error = true;
        }
      }
      obj.append("<div class='" + classes + "'>" + s + "</div>");
    }
  }
}

function kfw_edit(ws_id, endpoint) {
  const route = getRoutefor(endpoint)
  if ($("#edit-option")[0].hasAttribute("disabled")) {
    kioskErrorToast("This option is disabled in the current state of the workstation. Probably it is only available if the " +
      "workstation is in mode 'synchronized'.")
  } else {
    console.log(`edit workstation ${ws_id} at ${route}`)
    window.location.replace(`${route}/${ws_id}/edit`);
  }
}

function kfw_event_log(ws_id) {
  window.location.replace(`/syncmanager/event_log/${ws_id}`);
}

function kfw_upload(ws_id) {
  $("#upload-file").click();
}

