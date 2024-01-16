let synchronization_active_job;

$(() => {
  synchronization_active_job = undefined;
  $("#hamburger").hide();
  $(".toolbar").hide();
  $.getScript('/static/scripts/urap_lib.js');
  kioskStartWhenReady(syncManagerStartPollSynchronization);

});

function syncManagerLogLinesShown(loglines_present, heading="") {
  if (syncManagerLogLinesShown.showError) {
    syncManagerInsertIcon("fas fa-bug");
    if (!loglines_present) {
      $(".kiosk-log-line").fadeOut("slow");
      $("#div-log-show-details").hide();
    } else {
      $("#log-show-details").on("click", (e) => {
        if (e.currentTarget.checked) {
          $(".kiosk-log-line-info").show("fast");
        } else {
          $(".kiosk-log-line-info").hide();
        }
      });
    }
  }
  else {
    syncManagerJobDownloadDetails("Synchronization successfully finished.")
  }
}


function syncManagerDetailLogLinesShown(loglines_present, heading="") {
    syncManagerInsertIcon("fas fa-check-circle");
    if (!loglines_present) {
      $(".kiosk-log-line").fadeOut("slow");
      $("#div-log-show-details").hide();
    } else {
      $("#log-show-details").on("click", (e) => {
        if (e.currentTarget.checked) {
          $(".kiosk-log-line-info").show("fast");
        } else {
          $(".kiosk-log-line-info").hide();
        }
      });
    }
}


function syncManagerStartPollSynchronization() {
  // installSpinner($("#sync-spinner"), "acquiring synchronization status...");
  // $("#ws-message-div").css("left", "0");
  // setTimeout(pollProgress, 300);
  synchronization_active_job = undefined;
  let jobId = $("#sync-wrapper").attr("job_uid");
  if (jobId) {
    let job = new KioskJob($("#dialog-workzone"), "");
    if (job) {
      job.onError = syncManagerJobError;
      job.onSuccess = () => {
        syncManagerLogLinesShown.showError = false;
        syncManagerJobLookForWarnings("Synchronization successfully finished.");
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

function syncManagerInsertIcon(class_str) {
  $("#_kiosk-progress-view .kiosk-log-heading").prepend(`<i class=\'${class_str}\'></i> `);
}

function syncManagerJobLookForWarnings(success_msg) {
  let job = synchronization_active_job;
  showMenu();
  let rc = job.showLogLines(success_msg,
    (err_msg) => {
      kioskErrorToast(`${success_msg} But no further report could be fetched due to error <br>${err_msg}`);
    },
    syncManagerLogLinesShown,
    "warning",
    "However, please look at the warnings:");
}

function syncManagerJobDownloadDetails(success_msg) {
  let job = synchronization_active_job;
  // showMenu();
  let rc = job.showLogLines(success_msg,
    (err_msg) => {
      kioskErrorToast(`${success_msg} But no further report could be fetched due to error <br>${err_msg}`);
    },
    syncManagerDetailLogLinesShown,
    "info",
    "");
}

function syncManagerJobError(err_msg) {
  let job = synchronization_active_job;
  syncManagerLogLinesShown.showError = true;
  showMenu();
  if (job.status === JOB_STATUS_CANCELLING || job.status === JOB_STATUS_CANCELED) {
    kioskErrorToast(err_msg);
    return;
  }
  if (err_msg === "") {
    err_msg = "Some unknown Error occurred."
  }

  syncManagerInsertIcon("fas fa-bug");
  let rc = job.showLogLines(err_msg,
    (msg) => {
      kioskErrorToast(msg);
    },
    syncManagerLogLinesShown);

  if (!rc) {
    kioskErrorToast(err_msg + "<br>Also: The loglines could not be shown.");
  }
}

function showMenu() {
  // $("#hamburger").show();
  $(".toolbar").show();
}
