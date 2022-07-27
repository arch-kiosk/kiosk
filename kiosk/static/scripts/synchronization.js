let synchronization_active_job;

$(() => {
  synchronization_active_job = undefined;
  $.getScript('/static/scripts/urap_lib.js');
  kioskStartWhenReady(startPollSynchronization);

});

function syncLogLinesShown(loglines_present, heading="") {
  if (syncLogLinesShown.showError)
    insertIcon("fas fa-bug");
  else
    insertIcon("fas fa-check-circle");

  if (!loglines_present) {
    $(".kiosk-log-line").fadeOut("slow");
  }
}


function startPollSynchronization() {
  $("#hamburger").hide();
  // installSpinner($("#sync-spinner"), "acquiring synchronization status...");
  // $("#ws-message-div").css("left", "0");
  // setTimeout(pollProgress, 300);
  synchronization_active_job = undefined;
  let jobId = $("#sync-wrapper").attr("job_uid");
  if (jobId) {
    let job = new KioskJob($("#dialog-workzone"), "");
    if (job) {
      job.onError = syncJobError;
      job.onSuccess = () => {
        syncLogLinesShown.showError = false;
        syncJobLookForWarnings("Synchronization successfully finished.");
      };
      synchronization_active_job = job;
    }
  }
  if (synchronization_active_job) {
    synchronization_active_job.connect();
  } else {
    kioskErrorToast("Could not start local job. Synchronization might be running, nonetheless. Please check" +
      "if that is the case in the process overview.");
  }
}

function insertIcon(class_str) {
  $("#_kiosk-progress-view .kiosk-log-heading").prepend(`<i class=\'${class_str}\'></i> `);
}

function syncJobLookForWarnings(success_msg) {
  let job = synchronization_active_job;
  homeLineSvg();
  let rc = job.showLogLines(success_msg,
    (err_msg) => {
      kioskErrorToast(`${success_msg} But no further report could be fetched due to error <br>${err_msg}`);
    },
    syncLogLinesShown,
    "warning",
    "However, please look at the warnings:");
}

function syncJobError(err_msg) {
  let job = synchronization_active_job;
  syncLogLinesShown.showError = true;
  homeLineSvg();
  if (job.status === JOB_STATUS_CANCELLING || job.status === JOB_STATUS_CANCELED) {
    kioskErrorToast(err_msg);
    return;
  }
  if (err_msg === "") {
    err_msg = "Some unknown Error occurred."
  }

  insertIcon("fas fa-bug");
  let rc = job.showLogLines(err_msg,
    (msg) => {
      kioskErrorToast(msg);
    },
    syncLogLinesShown);

  if (!rc) {
    kioskErrorToast(err_msg + "<br>Also: The loglines could not be shown.");
  }
}


function homeLineSvg() {
  $("#homebtn").css("display", "flex");
  var homeLine = "<svg class='flat_icon' xmlns='http://www.w3.org/2000/svg' width='64px' height='64px' viewBox='0 0 100 100' ><path class='circle' d='M50,2.125c26.441,0,47.875,21.434,47.875,47.875c0,26.441-21.434,47.875-47.875,47.875C17.857,97.875,2.125,76.441,2.125,50C2.125,23.559,23.559,2.125,50,2.125z'/><g class='icon'><path class='base' d='M50,29.753l23.293,17.47v26.011c0,2.572-2.086,4.659-4.66,4.659H31.366c-2.574,0-4.658-2.086-4.658-4.659V47.223L50,29.753z'/><path class='hole' d='M50,50.427c5.145,0,9.316,4.172,9.316,9.316c0,5.144-4.172,9.317-9.316,9.317c-5.146,0-9.316-4.174-9.316-9.317C40.684,54.599,44.854,50.427,50,50.427z'/><path class='roof' d='M50,35.188L22.826,55.374V38.295L50,18.107l27.174,20.188v17.08L50,35.188z'/></g></svg>"
  $(homeLine).appendTo('#line-home');
  $("#homebtn").click(()=>{
    window.location.replace('/');
  });
  setTimeout(()=>{$("#homebtn").removeClass("animated");},500);
}


function oldPollProgress() {
  $.ajax({
    url: "/urap_progress",
    type: "POST",
    dataType: "json",
  })
  .done(function (json) {
    if (json.result == "ok") {
      $("#ws-message-div>p").text(json.progress + " %");
      //   $("#pollingOutput").html(json.percentage + "%");
      if (json.progress < 100) {
        setTimeout(pollProgress,300);
      }
      else {
        if (json.hasOwnProperty("has_warnings") && (json.has_warnings)) {
          show_log(false, json, "Synchronization succeeded, but please read the warnings: ");
        }
        else {
          show_log(false, json, "Yippieh. Synchronization succeeded. See log below for details.");
        }
      }
    }
    else {
      homeLineSvg();
      show_log(true, json, "An error occurred during synchronization");
    }
  })
  .fail(function(xhr, status, errorThrown) {
    stop_spinner();
    homeLineSvg();
    $("#ws-message-div>p").html("Cannot acquire progress from the sever. Reason: <span style='color: red'>" + errorThrown + ".</span> Your command might have been processed, all the same.");
  });
}

function show_log(has_error, json, msg="") {
  stop_spinner();
  msgdiv = $("#ws-message-div>p");
  $("#ws-message-div").css("margin-top","1.5em");

  if (has_error) {
    if (json.result == "locked") {
      msgdiv.html("The system is busy with some other thread that cannot run parallel. Please try again. later.");
    }
    else {
      if (msg != "") {
        msgdiv.html("Blast! " + msg + ": <span style='color: red'>" + json.result + "</span>");
      } else {
        msgdiv.html("Blast! It failed: <span style='color: red'>" + json.result + "</span>");
      }
    }
  }else{
    msgdiv.html(msg);
  }
  if (json.hasOwnProperty("dump")) {
    obj = $('#sync-log');
    obj.fadeIn('slow');
    obj.show();

    first_error = false;
    for (var i in json.dump) {
      s = String(json.dump[i]);
      classes= "sync-log-entry";
      if (s.toLowerCase().indexOf("error")>-1) {
        classes += " log-error";
        if (!first_error) {
            classes += " first-error";
            first_error = true;
        }
      } else {
        if (s.toLowerCase().indexOf("warning")>-1) {
          classes += " log-warning";
        }
      }
      obj.append("<p class='"+classes+"'>" + s + "</p>");
    }
  }
}
