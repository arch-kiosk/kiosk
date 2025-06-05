function triggerSyncManager(endpoint = "") {
    window.location.assign(getRoutefor(endpoint));
}

function triggerNewWorkstation(endpoint = "") {
    triggerCreateKioskWorkstation();
}

function triggerEventLog(endpoint = "") {
    window.location.replace(getRoutefor(endpoint));
}

function triggerCreateKioskWorkstation() {
    kioskOpenModalDialog("/syncmanager/create_workstation", {
        closeOnBgClick: false,
        focus: "#workstation-type",
        showCloseBtn: false,
        callbacks: {
            open: () => {
                kioskStartWhenAvailable("new-workstation-form",
                    () => {
                        $('#workstation-type').keydown(function (e) {
                            if (e.which === 13) {
                                e.preventDefault();
                                startCreateWorkstation();

                            }
                            // if (e.keyCode === 27) {
                            //   alert("27");
                            //   $.magnificPopup.close();
                            // }
                        });
                    })
            },
            ajaxFailed: () => {
                $.magnificPopup.close();
                kioskErrorToast("Sorry, I cannot start the dialog to create a workstation");
            }
        }
    });
}

function startCreateWorkstation() {
    kioskSendAjaxForm($("#bt-ok"),
        $("#dialog-ajax-part"),
        "/syncmanager/create_workstation",
    (jq_form, state_data) => {
            if (kioskElementHasErrors()) {
                kioskDisableButton($("#bt-ok", false));
                kioskDisableButton($("#bt-cancel", false));
            } else {
                let workstationType = $("#workstation-type").val();
                if (workstationType) {
                    let route = `${workstationType.toLowerCase()}.create_kiosk_workstation`;
                    window.location.assign(getRoutefor(route));
                } else {
                    kioskModalErrorToast(`<div>Sorry, something went really wrong.<br> I cannot ascertain the workstation type. 
                                          This is usually due to a wrong kiosk installation.<br><br>Please inform a
                                          developer.</div>`);
                }
            }
        },
        (xhr, status, errorThrown, state_data) => {
            kioskModalErrorToast(`<div>Sorry, There was an error: ${errorThrown} </div>`);
        });
}


/***********************************************************************
 *
 *  Synchronization
 *
 ***********************************************************************/

function syncManagerSynchronize(endpoint) {
    kioskOpenModalDialog(getRoutefor(endpoint), {
        // callbacks: {
        //   ajaxSuccess: () => {
        //     $("#so-safe-mode").on("change", () => {
        //       kioskErrorToast("This feature is not implemented, yet.");
        //       $("#so-safe-mode").prop("checked", false);
        //     });
        //   },
        // }
    })
}

function syncManagerStartSynchronization() {
    // function showExclamation() {
    //   let jq_image=$("#modal-confirm-sync-header .dialog-image");
    //   jq_image.removeClass("image-question");
    //   jq_image.addClass("image-exclamation");
    // };

    $(".dlg-buttons").hide();
    kioskAjax("/syncmanager/synchronization/start",
        $("#sync-options-form").serialize(),
        "POST", {
            onSuccess: (data) => {
                // console.log(data);
                if (data.success && "job_uid" in data.data) {
                    installSpinner($("#modal-confirm-sync-inner").find(":first-child"), "Hang on...");
                    window.location.replace('/syncmanager/synchronization/' + data.data["job_uid"]);
                } else {
                    // showExclamation();
                    $("#sync-msg").html(`Synchronization could not be triggered: <br>` +
                        `<span style='color: var(--col-error-bg-1)'>${data.message}</span>`);
                }
            },
            onError: (msg, textStatus, jqXHR, stateData) => {
                // showExclamation();
                $("#sync-msg").html("The request for synchronization could not even be sent: <br>" +
                    "<span>" + msg + "</span>");
                $("#sync-msg").addClass("sync-msg-error")
            }
        });

}


function syncManagerDontSynchronize() {
    $.magnificPopup.close();
}

