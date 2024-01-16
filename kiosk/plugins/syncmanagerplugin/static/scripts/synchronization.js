let synchronization_active_job;

$(() => {
  synchronization_active_job = undefined;
  $("#hamburger").hide();
  $(".toolbar").hide();
  $.getScript('/static/scripts/urap_lib.js');
  kioskStartWhenReady(syncManagerStartPollSynchronization);
});

function syncManagerErrorLogLinesShown(loglines_present, heading="") {
    syncManagerInsertIcon("fas fa-bug");
    configureLogLineView(loglines_present)
}

function syncManagerWarningLogLinesShown(loglines_present, heading="") {
    if (!loglines_present) {
      syncManagerJobDownloadDetails("Synchronization successfully finished.")
    } else {
      syncManagerInsertIcon("fas fa-check-circle");
      configureLogLineView(loglines_present)
    }
}

function syncManagerDetailLogLinesShown(loglines_present, heading="") {
    syncManagerInsertIcon("fas fa-check-circle");
    configureLogLineView(loglines_present)
}

function configureLogLineView(loglines_present) {
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
      job.onSuccess = syncManagerJobLookForWarnings
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

function syncManagerJobLookForWarnings() {
  let job = synchronization_active_job;
  success_msg = "Synchronization successfully finished."
  // syncManagerStartPollSynchronization.showError = false;
  showMenu();
  syncManagerInsertIcon("fas fa-check-circle");
  let rc = job.showLogLines(success_msg,
    (err_msg) => {
      kioskErrorToast(`${success_msg} But no further report could be fetched due to error <br>${err_msg}`);
    },
    syncManagerWarningLogLinesShown,
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
  // syncManagerStartPollSynchronization.showError = true;
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
    syncManagerErrorLogLinesShown);

  if (!rc) {
    kioskErrorToast(err_msg + "<br>Also: The loglines could not be shown.");
  }
}

function showMenu() {
  // $("#hamburger").show();
  $(".toolbar").show();
}
