let file_import_files_to_go;
let local_import_running;

function showBackButton(eventHandler) {
    // This was apparently once supposed to show the back button but I don't know how that could ever have been the case.
    // Now it is just showing the close button.
    kioskActivateButton($("#bt-close"), () => {
        $.magnificPopup.close();
    });
}

function fileImportDialog(endpoint) {
    setCookie("import_tags", "");
    var local_import_running = false;
    kioskOpenModalDialog(getRoutefor(endpoint), {
        closeOnBgClick: false,
        callbacks: {
            ajaxFailed: () => {
                kioskErrorToast("Dialog could not be initialized. Please try again.", {
                    timeout: 5000
                    //};
                });
                $.magnificPopup.close();
            },
            beforeClose: () => {
                try {
                    //todo: old, needs an update
                    $('#mif-upload-area').dmUploader('cancel');
                } catch (e) {
                }
                try {
                    cancelLocalImportIfNecessary()
                } catch (e) {
                }
                mifUploadClose();
            }
        }
    });
}

function startLocalImport() {

    installSpinnerEx($("#import-spinner"), "triggering import ...");

    $.ajax({
        url: "/fileimport/localimport",
        type: "POST",
        data: {},
        dataType: "json",
    })
        .done(function (json) {
            //$("#ws-message-div").css("height", "auto");
            if (json.result === "ok") {
                local_import_running = true;
                pollImportProgress("Import started...");
            } else {
                local_import_running = false;
                stop_spinner();
                $("#ws-message-div").html("Blast! Importing failed: <span style='color: red'>" + json.result + "</span>");
                showBackButton(true);
            }
        })
        .fail(function (xhr, status, errorThrown) {
            local_import_running = false;
            stop_spinner();
            $("#ws-message-div").html("Importing failed - Your request could not even be sent. Reason: <span style='color: red'>" + errorThrown + ".</span> That should not have happened.");
            showBackButton(true);
        });
}

function cancelLocalImportIfNecessary() {
    if (local_import_running) {
        local_import_running = false;
        $.ajax({
            url: "/fileimport/cancel",
            type: "GET",
            dataType: "json",
            data: true
        })
        // .done(function (json) {
        // })
        // .fail(function (xhr, status, errorThrown) {
        // });

    }
    if (startPollSequenceImport.hasOwnProperty("job")) {
        if (startPollSequenceImport.job) {
            console.log("Job cancelled.")
            startPollSequenceImport.job.stopit = true;
        }
    }
}

function pollImportProgress() {
    $.ajax({
        url: "/urap_progress",
        type: "POST",
        dataType: "json",
        data: $('#show-only-errors').is(":checked") ? {"error_level": "errors"} : {"error_level": ""}
    })
        .done(function (json) {
            if (json.result === "ok") {
                if (json.extended_progress) {
                    $("#ws-message-div").html(json.extended_progress[0] + " files processed, " + json.extended_progress[1] + " files imported.");
                }
                //   $("#pollingOutput").html(json.percentage + "%");
                if (json.progress < 100) {
                    setTimeout(pollImportProgress, 300);
                } else {
                    show_import_log(false, json, json.extended_progress[0] + " files processed, " + json.extended_progress[1] + " files imported.");
                }
            } else {
                cancelLocalImportIfNecessary()
                show_import_log(true, json, "Some unspecific error occurred during import.");
            }
        })
        .fail(function (xhr, status, errorThrown) {
            cancelLocalImportIfNecessary()
            stop_spinner();
            homeLineSvg();
            $("#ws-message-div").html("Cannot acquire progress from the sever. Reason: <span style='color: red'>" + errorThrown + ".</span> Your command might have been processed, all the same. Look at the general server log.");
        });
}

function show_import_log(has_error, json, msg = "") {
    stop_spinner();
    local_import_running = false
    msgdiv = $("#ws-message-div");
    //$("#ws-message-div").css("margin-top","1.5em");

    if (has_error) {
        if (json.result === "locked") {
            msgdiv.html("The system is busy with some other thread that cannot run parallel. Please try again. later.");
        } else {
            if (msg != "") {
                msgdiv.html("Blast! " + msg + ": <span style='color: red'>" + json.result + "</span>");
            } else {
                msgdiv.html("Blast! It failed: <span style='color: red'>" + json.result + "</span>");
            }
        }
    } else {
        msgdiv.html("File import finished: " + msg);
    }
    kioskActivateButton($("#bt-back"), () => {
        kioskGetAjaxElement($("#pagecontrol"),
            "fileimport/dialoglocalimport2",
            null,
            $("#pagecontrol"),
            (response, status, xhr) => {
                if (status == "error") {
                    kioskErrorToast(`<div>Error loading page fileimport/dialoglocalimport2: ${response} </div>`,
                        {
                            onClosing: () => {
                                $.magnificPopup.close();
                            }
                        });
                }
            }
        );
    });
    kioskActivateButton($("#bt-close"), () => {
        $.magnificPopup.close();
    });

    if (json.hasOwnProperty("dump")) {
        let obj = $('#import-log');
        obj.fadeIn('slow');
        obj.show();

        let first_error = false;
        for (let i in json.dump) {
            let s;
            s = String(json.dump[i]);
            let classes = "import-log-entry";
            if (s.toLowerCase().indexOf("error") > -1) {
                classes += " log-error";
                if (!first_error) {
                    classes += " first-error";
                    first_error = true;
                }
            } else {
                if (s.toLowerCase().indexOf("warning") > -1) {
                    classes += " log-warning";
                }
            }
            obj.append("<p class='" + classes + "'>" + s + "</p>");
        }
    }
}

/* *********************************************

              Upload single file

********************************************* */

function mifInitUploader() {
    file_import_files_to_go = 0;
    onUploadComplete.already_called = false;

    $('#mif-upload-area').dmUploader({
        url: '/fileimport/uploadimage',
        auto: false,
        queue: true,
        extraData: getUploadFileAttributes,
        //allowedTypes: "image/*",
        dataType: 'json',
        onInit: function () {
        },
        onNewFile: function (id, file) {
            // When a new file is added using the file selector or the DnD area
            file_import_files_to_go++;
            console.log(file)
            return addUploadFile(id, file);
        },
        onBeforeUpload: function (id) {
            setUploadFileProgress(id, 0);
        },
        onUploadProgress: function (id, percent) {
            setUploadFileProgress(id, percent);
        },
        onUploadSuccess: function (id, data) {
            file_import_files_to_go--;
            console.log(data);
            if (data.success) {
                setUploadFileProgress(id, 101, data.message);
            } else {
                setUploadFileProgress(id, -1, data.message);
            }
        },
        onUploadError: function (id, xhr, status, errorThrown) {
            file_import_files_to_go--;
            setUploadFileProgress(id, -1, errorThrown);
        },
        onFallbackMode: function (message) {
            alert('Browser not supported!: ' + message);
        },
        onComplete: function () {
            onUploadComplete();
        }
    }); //end $('#drop-area-div').dmUploader
    let localImportDialogPage1Initialized = true;

}

function getUploadFileAttributes() {
    return mifInitUploader.file_timestamps
}

function addUploadFile(id, file) {

    filename = file.name
    if (!mifInitUploader.file_timestamps)
        mifInitUploader.file_timestamps = {}
    mifInitUploader.file_timestamps[file.name] = new Date(file.lastModified).toISOString()
    kioskActivateButton($("#bt-ok"), mifOnStartUploadImport);
    let jqFileList;
    let jqTooManyFiles = $("#mif-file-list-too-many");
    let jqAddMore = $("#mif-file-list-add-more");
    let maxFileUploads = parseInt(jqTooManyFiles.attr("max_file_uploads"));
    if ($("#mif-file-list").children().length >= maxFileUploads) {
        jqAddMore.hide()
        jqTooManyFiles.show("slow");
        return false;
    } else {
        jqFileList = $("#mif-file-list");
        jqFileList.append("<div id='mif-upload-" + id + "' class='mif-file-to-upload'><div class='progress-bar'></div><div>" +
            filename + "</div><div class='mif-upload-progress'></div></div>");
        if (jqFileList.children().length == maxFileUploads) {
            jqAddMore.hide()
            $("#mif-upload-area").hide("slow");
            $(jqFileList).css("height", "auto");
        } else {
            jqAddMore.show("fast")
        }
        return true;
    }
}

function mifOnStartUploadImport() {
    $("#import-upload-files-ok").hide("fast");
    $("#mif-upload-area").hide("fast");
    $('#mif-upload-area').dmUploader('start');
}

function setUploadFileProgress(id, progress, msg = "") {
    let jqProgressBar = $("#mif-upload-" + id + " .progress-bar");
    let jqUploadText = $("#mif-upload-" + id + " div:nth-child(3)");
    let jqUploadDiv = $("#mif-upload-" + id);
    if (progress == -1) {
        jqProgressBar.css("display", "none");
        jqUploadDiv.addClass("mif-upload-error");
        jqUploadDiv.css("flex-direction", "column");
        jqUploadText.text(msg);
        jqProgressBar.removeClass("progress-bar-animation");
    } else if (progress == 100) {
        jqProgressBar.css("width", "100%");
        jqUploadText.text("transferred, now processing... ");
    } else if (progress == 101) {
        jqProgressBar.css("width", "100%");
        jqUploadText.text("processed (" + msg + ")");
        jqProgressBar.removeClass("progress-bar-animation");
    } else {
        if (jqProgressBar.width() == 0) {
            jqProgressBar.addClass("progress-bar-animation");
        }
        jqProgressBar.css("width", String(progress) + "%");
        jqUploadText.text(String(progress) + " %");
    }
}

function getImportTags() {
    let tags

    try {
        tags = $("#upload-form-2-div").attr("import-tags");
    } catch (e) {
        console.log(e)
    }

    try {
        tags = $("#local-import-form-3-div").attr("import-tags");
    } catch (e) {
        console.log(e)
    }

    if (!tags)
        try {
            tags = getCookie("import_tags").replaceAll("\\054", ",")
            tags = tags.replaceAll("\\073", ";")
            if (tags.charAt(0) == "\"") {
                tags = tags.substr(1, tags.length - 3);
            }
        } catch (e) {
            console.log(e)
        }

    return tags
}

function mifUploadClose() {
    let importTags = getImportTags()
    // $.magnificPopup.close();
    file_repos_load_by_tag(importTags)
}

function onUploadComplete() {

    if (!onUploadComplete.already_called) {
        onUploadComplete.already_called = true;
        kioskActivateButton($("#bt-ok"), null);
        kioskActivateButton($("#bt-close"), () => {
            $.magnificPopup.close()
        });
        if (($(".mif-upload-error").length > 0) || (file_import_files_to_go > 0)) {
            kioskErrorToast("Not all files were uploaded correctly.");
        } else {
            kioskSuccessToast("All files were uploaded successfully.");
        }
    }
}

/**
 * deprecated function! Use kioskSendAjaxform instead!
 * @param jq_bt_next
 * @param jq_outer_div
 * @param url
 * @param on_eval
 * @param on_failure
 * @param state_data
 * @param outer_div_id
 */
function kioskImportSendAjaxForm(jq_bt_next, jq_outer_div, url, on_eval, on_failure, state_data = {}, outer_div_id = null) {
    //used in administration.js.startBackup, bugsandfeaturesplugin.editbugdialog.html.saveDialog
    //and all the fileimport templates
    if (!outer_div_id) outer_div_id = jq_outer_div.attr("id");
    let form = jq_outer_div.find("form").first();

    inject_button_loader(jq_bt_next);
    kioskDeleteAllToasts();
    modaldialog_state_data = state_data;
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
    })
        .done((html) => {
            remove_button_loader(jq_bt_next);
            if (outer_div_id) {
                let dynhtml = $(html);
                let ajaxhtml = null;

                if (dynhtml.attr("id") == outer_div_id) {
                    ajaxhtml = dynhtml
                } else {
                    ajaxhtml = dynhtml.find("#" + outer_div_id);
                }
                if (ajaxhtml && ajaxhtml.length > 0) {
                    jq_outer_div.replaceWith(ajaxhtml);
                } else {
                    on_failure(null, "", "The data returned by the server could not be displayed. That really should not happen.", modaldialog_state_data);
                }
            } else {
                jq_outer_div.replaceWith(html);
            }
            jq_outer_div = $("#" + outer_div_id);
            form = jq_outer_div.find("form").first();
            openErroneousCollapsibles(form);
            if (kioskElementHasErrors(jq_outer_div)) {
                kioskToastGeneralErrors(jq_outer_div);
            }
            on_eval(form, state_data);

        })
        .fail((xhr, status, errorThrown) => {
            remove_button_loader(jq_bt_next);
            on_failure(xhr, status, errorThrown, modaldialog_state_data);
        });
}

function startSequenceImport() {
    installSpinnerEx($("#import-spinner"), "triggering import ...");

    $.ajax({
        url: "/fileimport/sequenceimport",
        type: "POST",
        data: {},
        dataType: "json",
    })
        .done(function (json) {
            //$("#ws-message-div").css("height", "auto");
            if (json.result === "ok") {
                local_import_running = true;
                if (json.job_uid) {
                    startPollSequenceImport(json.job_uid)

                } else {
                    local_import_running = false;
                    stop_spinner();
                    $("#ws-message-div").html("Sorry, the import failed: <span style='color: red'>" +
                        "Cannot track progress without a job id</span>");
                    showBackButton(true);
                }
            } else {
                local_import_running = false;
                stop_spinner();
                $("#ws-message-div").html("Blast! Importing failed: <span style='color: red'>" + json.result + "</span>");
                showBackButton(true);
            }
        })
        .fail(function (xhr, status, errorThrown) {
            local_import_running = false;
            stop_spinner();
            $("#ws-message-div").html("Importing failed - Your request could not even be sent. Reason: <span style='color: red'>" + errorThrown + ".</span> That should not have happened.");
            showBackButton(true);
        });
}

function startPollSequenceImport(job_uid) {
    let job = new KioskJob($("#sequence-import-progress"))
    if (job) {
        job.onSuccess = (result) => {
            showSequenceImportLog(startPollSequenceImport.job, result)
        };
        job.onStopProgress = () => {
            stop_spinner();
        };
        job.onError = (err_msg) => {
            kioskErrorToast("Task aborted due to an error: " + err_msg);
        };
        // job.onInitProgress = () => {
        //     kioskDisableButton($("#bt-ok"), true);
        //     kioskDisableButton($("#bt-cancel"), true);
        //     // installSpinner($("#sequence-import-progress"), "initializing ... ");
        // };
        job.onProgress = (progress, message, topic) => {
            console.log(message)
            if (!topic) {
                let progresses_div = document.getElementsByClassName("kiosk-progresses-div")
                if (progresses_div) {
                    progresses_div[0].textContent = message;
                }
            }
        };
        startPollSequenceImport.job = job;
    }
    if (startPollSequenceImport.job)
        startPollSequenceImport.job.connect(job_uid);
    else {
        kioskModalErrorToast(`<div>Sorry, some error makes it impossible to say if the 
import has started. Please look at the logs.</div>`);
    }
}

function showSequenceImportLog(job, result) {
    let msg = ""
    sequenceImportLogLinesShown.has_errors = false
    if (result.has_errors) {
        msg = "The File Sequence Import reported errors. Please look at the log. "
        sequenceImportLogLinesShown.has_errors = true
    } else {
        if (result.has_warnings) {
            msg = "The File Sequence Import finished successfully BUT reported warnings. "
        } else {
            msg = "File Sequence Import finished successfully. "
        }
    }

    let subHeading = ""
    if (result.hasOwnProperty("files_imported")) {
        subHeading = `<br>${result.files_processed} files were processed, ${result.files_imported} files 
        got actually imported.`
    }
    console.log(subHeading)
    let rc = job.showLogLines(msg,
        (err_msg) => {
            kioskErrorToast(err_msg);
        },
        sequenceImportLogLinesShown, "", subHeading);

    if (!rc) {
        kioskErrorToast("Also: The loglines could not be shown.");
    }
    kioskActivateButton($("#bt-close"), () => {
        $.magnificPopup.close();
    });
}

function sequenceImportLogLinesShown(loglines_present, heading = "") {
    if (!loglines_present) {
        $(".kiosk-log-line").fadeOut("slow");
    }
    let class_str = "fas fa-check-circle"
    if (sequenceImportLogLinesShown.has_errors) {
        class_str = "fas fa-bug"
    } else {
        let err_heading = document.getElementsByClassName("kiosk-log-heading")[0]
        err_heading.classList.remove("log-error-heading")
        err_heading.classList.add("log-success-heading")
    }
    $("#_kiosk-progress-view .kiosk-log-heading").prepend(`<i class=\'${class_str}\'></i> `);

}


//# sourceURL=fileimport.js