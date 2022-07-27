function triggerAdministration(endpoint = "") {
    window.location.replace(getRoutefor(endpoint));
}

function triggerAdminInterface(endpoint = "") {
    window.location.replace(getRoutefor(endpoint));
}

function triggerBackup() {
    let bt = $("#bt-backup");
    if (!bt.prop("disabled")) {
        bt.click();
    } else {
        kioskErrorToast("The backup is not ready yet, please try again.");
    }
}

function triggerUploadPatch(endpoint) {
  const route = getRoutefor(endpoint)
  kioskOpenModalDialog(route, {
    closeOnBgClick: false,
    showCloseBtn: true,
    callbacks: {
      open: () => {
      },
      close: () => {
      },
      ajaxFailed: () => {
        //@ts-ignore
        $.magnificPopup.close();
        kioskErrorToast("Sorry, it was not possible to start this feature.");
      }
    }
  })
}


function init_bt_backup() {
    let bt = $("#bt-backup");
    bt.prop("disabled", false);
    bt.on("click", () => {
        kioskOpenModalDialog("/administration/backup", {
            closeOnBgClick: false,
            focus: "#backup-dir",
            showCloseBtn: false,
            callbacks: {
                open: () => {
                    $('#backup-form').bind('keypress', function (e) {
                        if (e.keyCode === 13) {
                            $(this).find('input[type=submit]:first').click();
                        }
                    });
                },
                ajaxFailed: () => {
                    $.magnificPopup.close();
                    kioskErrorToast("Sorry, the backup dialog wouldn't start.");
                }
            }
        });
    });
}

function init_bt_restore() {
    let bt = $("#bt-restore");
    bt.prop("disabled", false);
    bt.on("click", () => {
        kioskOpenModalDialog("/administration/restore", {
            closeOnBgClick: false,
            focus: "#restore-dir",
            showCloseBtn: false,
            callbacks: {
                open: () => {
                    $('#restore-form').bind('keypress', function (e) {
                        if (e.keyCode === 13) {
                            $(this).find('input[type=submit]:first').click();
                        }
                    });
                },
                ajaxFailed: () => {
                    $.magnificPopup.close();
                    kioskErrorToast("Sorry, the restore dialog wouldn't start.");
                }
            }
        });
    });
}

function init_bt_housekeeping() {
    let bt = $("#bt-housekeeping");
    bt.prop("disabled", false);
    bt.on("click", () => {
        kioskOpenModalDialog("/administration/housekeeping", {
            closeOnBgClick: false,
            //focus: "#backup-dir",
            showCloseBtn: true,
            callbacks: {
                open: () => {
                    $('#housekeeping-form').bind('keypress', function (e) {
                        if (e.keyCode === 13) {
                            $(this).find('input[type=submit]:first').click();
                        }
                    });
                },
                beforeClose: () => {
                    try {
                        startHousekeeping.housekeeping_job.stopit = true;
                    } catch {
                    }
                    return true;
                },
                ajaxFailed: () => {
                    $.magnificPopup.close();
                    kioskErrorToast("Sorry, the housekeeping dialog wouldn't start.");
                }
            }
        });
    });
}

function init_bt_restart_server() {
    let bt = $("#bt-restart");
    bt.prop("disabled", false);
    bt.on("click", function () {
        kioskYesNoToast("do you really want to restart the server? Note that it will take a few minutes " +
            "to reload. Afterwards perhaps another manual refresh of everybody's browser content might be needed.",
            () => {

                kioskSendAjaxCommand("GET", $(this),
                    "/administration/restart",
                    {},
                    () => {
                        console.log("restart successful.")
                        window.location.replace("/logout");
                    },
                    (err_code, json) => {
                        if ("result" in json) {
                            kioskErrorToast(json.result);
                        } else {
                            kioskErrorToast(`An Error occurred when trying to restart the server: ${err_code}`)
                        }
                    });
            });
    })
}

function init_bt_clear() {
    $("#bt-clear").on("click", function () {

        kioskYesNoToast("DANGER! Do you really intend to wipe all your data in the master database? Your data will be lost " +
            "unless you have a backup. Do this only if you really know what you are doing! This is not a standard operation.",
            () => {
                kioskSendAjaxCommand("POST", $(this),
                    "/administration/cleardb",
                    {},
                    () => {
                        kioskSuccessToast(`Done!`)
                    },
                    (err_code, json) => {
                        if ("result" in json) {
                            kioskErrorToast(json.result);
                        } else {
                            kioskErrorToast(`An Error occurred in when calling init_bt_clear: ${err_code}`)
                        }

                    });
            });
    })
}

function init_bt_dataintegrity() {
    let bt = $("#bt-data-integrity");
    bt.prop("disabled", false);
    bt.on("click", function () {
        kioskSendAjaxCommand("POST", $(this),
            "/administration/data-integrity",
            {},
            () => {
                kioskSuccessToast(`Done!`)
            },
            (err_code, json) => {
                if (json) {
                    console.log(json.result);
                    kioskErrorToast(json.result);
                } else {
                    kioskErrorToast(`An Error occurred in when calling resetpassword: ${err_code}`)
                }

            });
    });
}

function init_bt_system_messages() {
    let bt = $(".btn-check-message");
    bt.on("click", (e) => {
        let bt = $("#" + e.currentTarget.id);
        let uid = bt.attr("uid");
        let msgDiv = $(document.getElementById(uid));
        bt.hide("fast");
        deleteSystemMessage(uid, {
            onSuccess: (msg, textStatus, jqXHR) => {
                msgDiv.hide("fast");
            },
            onError: (html_error, msg, jqXHR) => {
                kioskErrorToast(html_error);
            }
        })
    });
}

function initAdministration() {
    initCollapsibles();

    kioskToggleCollapsible($("#admin-sysinfo-clicker"));
    kioskToggleCollapsible($("#admin-plugins-clicker"));
    kioskToggleCollapsible($("#admin-users-clicker"));

    // let elems = document.querySelectorAll('.modal');
    // // M.Modal.init(elems, {
    //   dismissible: false
    //
    // });


    $(".btn-reset-password").on("click", resetPassword);
    init_bt_backup();
    init_bt_restore();
    init_bt_clear();
    init_bt_housekeeping();
    init_bt_dataintegrity();
    init_bt_system_messages();
    init_bt_restart_server();
    // kioskGetAjaxElement();

}

function resetPassword() {
    let btn = $(this);
    let uid = btn.attr("uid");

    kioskSendAjaxCommand("POST", $(this),
        "/administration/resetpassword",
        {"uid": uid},
        (json) => {
            kioskSuccessToast(json.message,
                {
                    timeout: 0,
                });
            btn.replaceWith("<i class='mdi mdi-check' style='justify-self: center'></i>");
        },
        (err_code, json) => {
            if (json) {
                kioskErrorToast(json.result);
            } else {
                kioskErrorToast(`An Error occurred in when calling resetpassword: ${err_code}`);
            }

        });
}

function startBackupOrRestore(event = null) {

    let isBackup = $("#backup-form").length ? true : false;
    let isRestore = $("#restore-form").length ? true : false;
    console.log(`startBackupOrRestore for ${isBackup ? "backup" : "restore"}`);
    startBackupOrRestore.job = null;
    if (isBackup)
        setModalDialogTitle("Backup")
    else
        setModalDialogTitle("Restore");

    if (event) {
        event.preventDefault();
    }
    kioskSendAjaxForm($("#bt-ok"),
        $("#dialog-ajax-part"),
        isBackup ? "/administration/backup" : "/administration/restore",
        (jq_form, state_data) => {
            if (!kioskElementHasErrors()) {
                let job_uid = getJobIDFromHtml();
                if (job_uid) {

                    let job = new KioskJob(isBackup ? $("#backup-form") : $("#restore-form"))
                    if (job) {
                        job.onSuccess = (result) => {
                            if (isRestore) {
                                $.magnificPopup.close();
                                let msg = "Restore successfully finished. "
                                if ("restored_files" in result) {
                                    msg += `${result["restored_files"]} files had to be restored to the file repository.`
                                }

                                kioskSuccessToast(msg +
                                    "<br><strong>It is crucial to restart all server processes and Master Control!</strong>",
                                    {
                                        timeout: 0,
                                    });
                            } else {
                                kioskActivateButton($("#bt-ok"), null);
                                kioskActivateButton($("#bt-cancel"), null);
                                kioskActivateButton($("#bt-close"), () => {
                                    $.magnificPopup.close();
                                });
                                let result_html = `<div class="backup-result"><span class="backup-label">Backup saved successfully as </span>` +
                                    `<span id="backup-file">${result['backup_file']}</span>` +
                                    `<button id="backup-clipboard" class="kiosk-btn-32"><i class="mdi mdi-content-copy"></i></button></div>`
                                if('backup_file_repository_dir' in result) {
                                    result_html += `<div class="backup-result"><span class="backup-label">${result['files_copied']} files copied to </span>` +
                                    `<span id="file-repos-dir">${result['backup_file_repository_dir']}</span>` +
                                    `<button id="file-repos-clipboard" class="kiosk-btn-32"><i class="mdi mdi-content-copy"></i></button></div>`
                                }
                                $("#dlg-spinner-wrapper").html(result_html);
                                $("#backup-clipboard").click(() => {
                                    let backupFile = $("#backup-file").text();
                                    navigator.clipboard.writeText(backupFile).then(function () {
                                        kioskSuccessToast("Filename is on the clipboard!");
                                        $.magnificPopup.close();
                                    }, function () {
                                        kioskErrorToast("Copying to clipboard did not work. Please jot it down.");
                                    });
                                });
                                $("#file-repos-clipboard").click(() => {
                                    let fileRepos = $("#file-repos-dir").text();
                                    navigator.clipboard.writeText(fileRepos).then(function () {
                                        kioskSuccessToast("Path is on the clipboard!");
                                        $.magnificPopup.close();
                                    }, function () {
                                        kioskErrorToast("Copying to clipboard did not work. Please jot it down.");
                                    });
                                })
                            }
                        };
                        job.onStopProgress = () => {
                            stop_spinner();
                        };
                        job.onError = (err_msg) => {
                            $.magnificPopup.close();
                            kioskErrorToast(`${(isBackup ? "Backup" : "Restore")} failed due to an error: ` + err_msg);
                        };
                        job.onInitProgress = () => {
                            kioskDisableButton($("#bt-ok"), true);
                            kioskDisableButton($("#bt-cancel"), true);
                            installSpinner(isBackup ? $("#backup-form") : $("#restore-form"), "initializing ... ");
                        };
                        job.onProgress = (progress, message, topic) => {
                            if (!topic) {
                                $("#ws-message-div").html(`Now in progress: ${message}`);
                            }
                        };
                        startBackupOrRestore.job = job;
                    }
                    if (startBackupOrRestore.job)
                        startBackupOrRestore.job.connect(job_uid);
                    else {
                        kioskModalErrorToast(`<div>Sorry, some error makes it impossible to say whether or not 
${(isBackup ? "Backup" : "Restore")} has started. Please look at the logs.</div>`);
                    }
                } else {
                    kioskModalErrorToast(`<div>Sorry, some error (no job-id) makes it impossible to say whether or not 
${(isBackup ? "Backup" : "Restore")} has started. Please look at the logs.</div>`);
                }
            } else {
                if (!isBackup) initCombobox();
                kioskDisableButton($("#bt-ok", false));
                kioskDisableButton($("#bt-cancel", false));
            }
        },
        (xhr, status, errorThrown, state_data) => {
            kioskModalErrorToast(`<div>Sorry, There was an error: ${errorThrown} </div>`);
        });
}

function startHousekeeping(event = null) {

    if (event) {
        event.preventDefault();
    }
    kioskSendAjaxForm($("#bt-ok"),
        $("#dialog-ajax-part"),
        "/administration/housekeeping",
        (jq_form, state_data) => {
            if (!kioskElementHasErrors()) {
                let job_uid = getJobIDFromHtml();
                if (job_uid) {

                    let job = new KioskJob($("#housekeeping-form"))
                    if (job) {
                        job.onSuccess = () => {
                            $.magnificPopup.close();
                            kioskSuccessToast("Housekeeping finished.");
                        };
                        job.onStopProgress = () => {
                            stop_spinner();
                        };
                        job.onError = (err_msg) => {
                            $.magnificPopup.close();
                            kioskErrorToast("Task aborted due to an error: " + err_msg);
                        };
                        job.onInitProgress = () => {
                            kioskDisableButton($("#bt-ok"), true);
                            kioskDisableButton($("#bt-cancel"), true);
                            installSpinner($("#housekeeping-form"), "initializing ... ");
                        };
                        job.onProgress = (progress, message, topic) => {
                            if (!topic) {
                                $("#ws-message-div").html(`${progress}%: ${message}`);
                            }
                        };
                        startHousekeeping.housekeeping_job = job;
                    }
                    if (startHousekeeping.housekeeping_job)
                        startHousekeeping.housekeeping_job.connect(job_uid);
                    else {
                        kioskModalErrorToast(`<div>Sorry, some error makes it impossible to say whether or not the 
housekeeping has started. Please look at the logs.</div>`);
                    }
                } else {
                    kioskModalErrorToast(`<div>Sorry, some error (no job-id) makes it impossible to say whether or not the 
housekeeping has started. Please look at the logs.</div>`);
                }
            } else {
                kioskDisableButton($("#bt-ok", false));
                kioskDisableButton($("#bt-cancel", false));
            }
        },
        (xhr, status, errorThrown, state_data) => {
            kioskModalErrorToast(`<div>Sorry, There was an error: ${errorThrown} </div>`);
        });
}

// ************************************************************
// Processes View
// ************************************************************

function initProcesses(refresh_url, processes_url) {

    function refreshProcesses() {
        $("#process-list").css("border-color", "grey");
        kioskAjaxGetPartial(refresh_url, {}, "process-list",
            (targetId, textStatus, jqXHR, stateData) => {
                $(".process-delete").on("click", deleteProcess).prop("disabled", false);
                $(".process-cancel").on("click", cancelProcess).prop("disabled", false);
                setTimeout(refreshProcesses, 2000);
            },
            (err_msg, textStatus, jqXHR, stateData) => {
                kioskErrorToast("Status polling interrupted due to this error:<br>" + err_msg);
            }
        )
    }

    initCollapsibles();
    deleteProcess.processes_url = processes_url;
    cancelProcess.processes_url = processes_url;

    $(".process-delete").on("click", deleteProcess);
    $(".process-cancel").on("click", cancelProcess);


    setTimeout(refreshProcesses, 2000);


    // kioskToggleCollapsible($("#admin-sysinfo-clicker"));
    // kioskToggleCollapsible($("#admin-plugins-clicker"));
    // kioskToggleCollapsible($("#admin-users-clicker"));

    // let elems = document.querySelectorAll('.modal');
    // // M.Modal.init(elems, {
    //   dismissible: false
    //
    // });


    // $(".btn-reset-password").on("click", resetPassword);
    // init_bt_backup();
    // init_bt_test();
    // init_bt_housekeeping();
    // kioskGetAjaxElement();

}

function deleteProcess() {
    let btn = $(this);
    let uid = btn.attr("uid");
    process_action(uid, "kill",
        () => {
            kioskSuccessToast("Job successfully deleted. Should be gone.");
        }, (msg) => {
            kioskErrorToast("Could not delete job due to this error: <br>" + msg);
        });
}

function cancelProcess() {
    let btn = $(this);
    let uid = btn.attr("uid");
    process_action(uid, "cancel",
        () => {
            kioskSuccessToast("Job successfully canceled. It should terminate soon.");
        }, (msg) => {
            kioskErrorToast("Could not cancel job due to this error: <br>" + msg);
        });
}


function process_action(uid, action, onSuccess, onError) {
    kioskAjax(deleteProcess.processes_url,
        {
            "action": action,
            "uid": uid
        }, "POST",
        {
            "onSuccess": (msg) => {
                if (msg === "ok") onSuccess(); else onError(msg);
            },
            "onError": onError
        }
    );
}

// ************************************************************
// logs View
// ************************************************************

function initLogs(refresh_url) {

    // function refreshProcesses() {
    //   $("#process-list").css("border-color", "grey");
    //   kioskAjaxGetPartial(refresh_url, {}, "process-list",
    //     (targetId, textStatus, jqXHR, stateData) => {
    //       $(".process-delete").on("click", deleteProcess).prop("disabled", false);
    //       $(".process-cancel").on("click", cancelProcess).prop("disabled", false);
    //       setTimeout(refreshProcesses, 2000);
    //     },
    //     (err_msg, textStatus, jqXHR, stateData) => {
    //       kioskErrorToast("Status polling interrupted due to this error:<br>" + err_msg);
    //     }
    //   )
    // }

    initCollapsibles();
    initHovers();
    // deleteProcess.processes_url = processes_url;
    // cancelProcess.processes_url = processes_url;
    //
    // $(".process-delete").on("click", deleteProcess);
    // $(".process-cancel").on("click", cancelProcess);


    // setTimeout(refreshProcesses, 2000);


}

function initHovers() {
    $(".log-item").hover(function () {
        $(this).siblings().css("background-color", "var(--color-sand)");
        $(this).css("background-color", "var(--color-sand)");
    }, function () {
        $(this).siblings().css("background", "none");
        $(this).css("background", "none");
    });
}


//# sourceURL=administration/administration.js