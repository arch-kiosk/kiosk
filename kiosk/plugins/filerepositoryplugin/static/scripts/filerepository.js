// noinspection CssUnresolvedCustomProperty

function triggerFileRepository(endpoint = "") {
    window.location.replace(getRoutefor(endpoint));
}

/******************************************************
 File List
 *********************************************************/

let fr_timeout = null;
let lockFileCount = false;

function setFileRepositoryEventHandlers() {
    $("#fr-sidebar input").keyup(function(event) {
        fetchImageCount();
    });

    $("#frf-recording-context").change(function(event) {
        fetchImageCount();
    });

    $("#frf-tags").change(function(event) {
        fetchImageCount();
    });

    $("#frf-no-context").change(function(event) {
        refreshContext();
        fetchImageCount();
    });

    $("#fr-resolution-select").change(function(event) {
        if (check_image_count()) {
            let res_val = $("#fr-resolution-select").val();
            if ($("#frf-resolution-select").length) {
                $("#frf-resolution-select").remove();
            }
            $("#frf").append("<input style='display:none' name='frf-resolution-select' id='frf-resolution-select' value='" + res_val + "'>");
            $("#frf").submit();
        } else {
            alert("oops.");
        }
    });

    $("#fr-sorting").change(function(event) {
        if (check_image_count()) {
            let sort_val = $("#fr-sorting").val();
            if ($("#frf-sorting").length) {
                $("#frf-sorting").remove();
            }
            $("#frf").append("<input style='display:none' name='frf-sorting' id='frf-sorting' value='" + sort_val + "'>");
            $("#frf").submit();
        }
    });

    $("#content-wrapper").on("scroll", function() {
        //alert("scroll Top is " + String($(this).scrollTop()))
        if ($(this).scrollTop() > 50) {
            $("#scroll-to-top:hidden").stop(true, true).fadeIn();
        } else {
            $("#scroll-to-top").stop(true, true).fadeOut();
        }
    });

    $("#filter-reset").on("click", () => {
        resetFileReposFilters(true);
    });

    document.querySelector("#fr-bt-toggle").addEventListener("click", toggleFileMarkers);
    document.querySelector("#fr-bt-clear-markers").addEventListener("click", clearAllFileMarkers);
    document.querySelector("#fr-bt-set-markers").addEventListener("click", setAllFileMarkers);
    document.querySelector("#fr-bt-bulk-delete").addEventListener("click", askBulkDelete);
    document.querySelector("#fr-bt-bulk-tag").addEventListener("click", askBulkTag);
    document.querySelector("#fr-bt-bulk-attach").addEventListener("click", askBulkAttach);

    $(function() {
        $("#scroll-to-top").on("click",
            function() {
                $("#content-wrapper").animate(
                    {
                        scrollTop: $(".thetop").offset().top,
                    }, "1000");
                return false;
            });
    });

    let input = document.getElementById("frf-tags");
    let awesomplete_tags = new Awesomplete(input,
        {
            list: "fr-tags",
            minChars: 0,
        });
    input.addEventListener("awesomplete-selectcomplete", fetchImageCount);

    input = document.getElementById("frf-context");
    input.addEventListener("awesomplete-selectcomplete", fetchImageCount);
}

function initPageList() {
    $(".fr-page-list-page").on("click", function(evt) {
        onPageClick(evt);
    });
}

function resetFileReposFilters(fetch = false) {
    $("#frf-no-context").checked = false;
    $("#frf-context").val("");
    $("#frf-description").val("");
    $("#frf-tags").val("");
    $("#frf-recording-context").val("");
    $("#frf-from-date").val("");
    $("#frf-to-date").val("");
    if (fetch) fetchImageCount();
}

function onPageClick(evt) {
    let page = $(evt.currentTarget);
    let page_number = page.text();

    if ($("#frf-current-page").length) {
        $("#frf-current-page").remove();
    }
    $("#frf").append("<input style='display:none' name='frf-current-page' id='frf-current-page' value='" + page_number + "'>");
    $("#frf").submit();

}


function refreshContext() {
    if ($("#frf-no-context").is(":checked")) {
        $("#frf-context").prop("disabled", true);
    } else {
        $("#frf-context").prop("disabled", false);
    }
}


function check_image_count() {
    return true;
    // let image_count = parseInt($("#fr-image-count").attr("image-count"));
    // if (image_count > 0 && image_count < getMaxImagesPerPage()) {
    //   return true;
    // }
    // return false;
}

function frfEnableSubmitMode(enable) {
    if (enable) {
        $("#file-count-div").addClass("fetch-files");
        $("#file-count-div").on("click", () => {
            resetFileMarkers();
            $("#frf").submit();
            frfEnableSubmitMode(false);
        });
        $(".fr-fetch-icon").show();
    } else {
        $("#file-count-div").on("click", false);
        $("#file-count-div").removeClass("fetch-files");
        $(".fr-fetch-icon").hide();
    }
}

function fetchImageCount() {
    try {
        if (fetchImageCount.fr_timeout != null) clearTimeout(fetchImageCount.fr_timeout);
    } finally {
        fetchImageCount.fr_timeout = null;
    }
    fetchImageCount.fr_timeout = setTimeout(getFileCount, 500);
}

function getMaxImagesPerPage() {
    let v = parseInt($("#fr-filter").attr("max-images-per-page"));
    return v;
}


function getFileCount() {
    console.log("getFileCount entered")
    frfEnableSubmitMode(false);
    $("#file-count").text("calculating...");
    if (!lockFileCount) {
        lockFileCount = true;
        try {
            formData = $("#frf").serializeArray();
            formData.push({ name: "ajax", value: "true" });
            $.ajax({
                url: "/filerepository",
                type: "POST",
                dataType: "json",
                data: formData,
            })
                .done(function(json) {
                    // $("#fr-image-count").remove();
                    // $("#fr-filter").append(`<div id="fr-image-count" image-count="${json.result}"></div>`)
                    $("#file-count").text("");
                    $("#file-count").attr("image-count", json.result);
                    maxImages = getMaxImagesPerPage();
                    $("#frf-from-date").removeClass("input-error");
                    $("#frf-to-date").removeClass("input-error");
                    $("#context-identifier-filter").removeClass("input-error");
                    const elFileCount = $("#file-count")
                    const filteredSiteId = elFileCount[0].dataset?.filteredSite??""
                    if (isNaN(json.result)) {
                        if (json.result.startsWith("The identifier")) {
                            $("#context-identifier-filter").addClass("input-error");
                            $("#file-count").text((filteredSiteId?`Site ${filteredSiteId}: `:"") + json.result);
                        } else if (json.result.indexOf("valid date or year") > -1) {
                            if (json.result.indexOf("'from'") > -1) {
                                $("#frf-from-date").addClass("input-error");
                            } else {
                                $("#frf-to-date").addClass("input-error");
                            }
                            elFileCount.text((filteredSiteId?`Site ${filteredSiteId}: `:"") + json.result);
                        } else {
                            kioskErrorToast(json.result);
                        }
                        frfEnableSubmitMode(false);
                        // return
                    } else {
                        if (json.result > 0) {
                            // if (json.result <= maxImages)  {
                            debugger
                            if (json.result) {
                                frfEnableSubmitMode(true);
                                if (json.result > 1)
                                    elFileCount.text(json.result.toString() + ` files found${filteredSiteId?" in site " + filteredSiteId:""}. Click to fetch 'em.`);
                                else
                                    elFileCount.text(`One file found${filteredSiteId?" in site " + filteredSiteId:""}. Click to fetch it.`);
                            } else {
                                elFileCount.text(json.result.toString() + ` files found${filteredSiteId?" in site " + filteredSiteId:""}. Please be more specific.`);
                                frfEnableSubmitMode(false);
                            }
                        } else {
                            elFileCount.text(`No files match your criteria${filteredSiteId?" in site " + filteredSiteId:""}.`);
                        }
                    }
                });
        } finally {
            lockFileCount = false;
        }
    }
    fr_timeout = null;
}

function file_repos_load_by_tag(tag) {
    resetFileReposFilters();
    $("#frf-tags").val(tag);
    $("#frf").submit();
}

function updateFileRepositoryImage(uuid) {
    //todo: Why does this have its own CSRF Token? I thought that is added automatically when using ajax?
    $.ajax({
        url: "/filerepository/fetch_tile/" + uuid + "/force_reload=1",
        type: "POST",
        dataType: "html",
        beforeSend: function(xhr, settings) {
            // $("#"+uuid).replaceWith("<div id=\'" + uuid + "\'></div>");
            // inject_button_loader($("#"+uuid));
            csrf_token = $("#csrf_token").attr("value");
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        },
    })
        .done(function(html) {
            $("#" + uuid).replaceWith(html);
            activateImage(uuid);

            console.log("Replaced " + uuid);
            refreshBLazy();
        })
        .fail(function(xhr, status, errorThrown) {
            console.log(errorThrown);
            $("#frf").submit();
        });
}

function refreshBLazy() {
    refreshMarkers();
    let bLazy = new Blazy({
        container: "#content-wrapper",
        success: (ele) => {
            $(ele).off("click", function(evt) {
                onEditImage(evt);
            });
            $(ele).on("click", function(evt) {
                onEditImage(evt);
            });
        },
    });
}

function identifierClicked() {
    let uuid = this.id;
    sessionStorage.setItem("filemarked_" + uuid, String(!isFileChecked(uuid)));
    showFileChecked(this);
}

function setFileChecked(element, value) {
    let uuid = element.id;
    sessionStorage.setItem("filemarked_" + uuid, String(value));
    showFileChecked(element);
}

function isFileChecked(uuid) {
    return sessionStorage.getItem("filemarked_" + uuid) === "true";
}

function showFileChecked(element) {
    let marker = $(element).find(".fa-star").first();
    let uuid = element.id;
    if (isFileChecked(uuid)) {
        marker.addClass("check");
    } else {
        marker.removeClass("check");
    }
    marker.css("visibility", "visible");

}

function refreshMarkers() {
    const numOr0 = (v) => {
        try {
            return parseInt(v)
        } catch{}
        return 0
    }

    document.filesOnPage = []
    $("#fr-image-list-wrapper").children().each((index, element) => {
        let clicker = $(element).find(".fr-identifier-and-check").first();
        clicker.off("click");
        clicker.on("click", identifierClicked.bind(element));
        document.filesOnPage.push({
            uuid: element.id,
            width: numOr0(element.dataset.width),
            height: numOr0(element.dataset.height)
        })
        showFileChecked(element);
    });
}

function toggleFileMarkers() {
    $("#fr-image-list-wrapper").children().each((index, element) => {
        identifierClicked.bind(element)();
    });

}

function clearAllFileMarkers() {
    $("#fr-image-list-wrapper").children().each((index, element) => {
        setFileChecked(element, false);
    });
}

function resetFileMarkers() {
    let c = 0;
    while (c < sessionStorage.length) {
        let key = sessionStorage.key(c);
        if (key.startsWith("filemarked_")) {
            sessionStorage.removeItem(key);
        } else {
            c++;
        }
    }
}

function countFileMarkers() {
    let c = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        if (key.startsWith("filemarked_") && (sessionStorage.getItem(key) === "true")) {
            c++;
        }
    }
    return c;
}

function setAllFileMarkers() {
    $("#fr-image-list-wrapper").children().each((index, element) => {
        setFileChecked(element, true);
    });

}

function changeToolButtonState(id, state) {
    let bt = $("#" + id);
    if (bt) {
        console.log(bt);
        if (state === 0) {
            bt.addClass("disabled");
        } else if (state === 1) {
            remove_button_loader(bt);
            bt.removeClass("disabled");
        } else if (state === 2) {
            bt.addClass("disabled");
            inject_button_loader(bt, "#000");
        }
    }

}

function toolButtonEnabled(bt) {
    return !$(bt).hasClass("disabled");
}

function askBulkDelete(e) {
    if (toolButtonEnabled(e.currentTarget)) {
        let c = countFileMarkers();
        if (c === 0) {
            kioskSuccessToast("Please mark the files you want to delete by clicking on the " +
                "star next to a file's context identifiers.");
            return;
        }
        changeToolButtonState("fr-bt-bulk-delete", 0);
        let options = {
            title: `You are about to delete ${c} files!`,
            backgroundColor: "var(--color-background)",
            titleColor: "var(--color-white)",
            messageColor: "var(--color-white)",
            iconColor: "var(--color-reddish)",
        };
        kioskYesNoToast(`<br>Do you really want to delete the ${c} files you starred?<br><br>`, () => {
            kioskYesNoToast(`<br>Some or all of those ${c} files might get detached from their 
    archaeological contexts, too. <br><strong>Are you sure you want to proceed?</strong><br><br>`, () => {
                    _bulkDelete();
                }, () => changeToolButtonState("fr-bt-bulk-delete", 1)
                , options);
        }, () => changeToolButtonState("fr-bt-bulk-delete", 1), options);
    }
}


function checkMarkers() {
    let c = countFileMarkers();
    if (c === 0) {
        kioskSuccessToast("Please mark the files you want to tag by clicking on the " +
            "star next to a file's context identifiers.");
        return false;
    }
    return true;

}

function askBulkTag() {
    if (!checkMarkers()) return;

    let files = getMarkedFiles();
    $.magnificPopup.open({
        type: "ajax",
        ajax: {
            settings: {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    "files": files,
                }),
            },
        },
        items: {
            src: "/filerepository/bulktag",
        },
        removalDelay: 200,
        mainClass: "mfp-with-anim",
        callbacks: {
            beforeOpen: function() {
                changeToolButtonState("fr-bt-bulk-tag", 0);
            },
            afterClose: function() {
                changeToolButtonState("fr-bt-bulk-tag", 1);
            },
        },
    });
}

function askBulkAttach() {
    if (!checkMarkers()) return;
    let cFiles = countFileMarkers();
    if (cFiles > 10) {
        kioskErrorToast(`Sorry, but in this version of Kiosk you can only link maximal 10 images at a time. 
      Please unmark a few (currently you have marked ${cFiles}).`);
        return;
    }


    try {
        let cb = document.getElementById("select-link-context");
        cb.addEventListener("closeSelection", closeBulkAttach);
        cb.openDialog();
    } catch (e) {
        kioskErrorToast(`The link feature could not be started ${e}`);
    }
}

function closeBulkAttach(evt) {
    let selectedContext = evt.detail;
    // selectedContext.field,selectedContext.identifier, selectedContext.record_type
    console.log(selectedContext);
    let files = getMarkedFiles();
    kioskYesNoToast(`Are you sure you want to link the ` +
        `marked ${files.length} files with ${selectedContext.identifier}(${selectedContext["record_type"]})? <br>
      Please double check because you won't be able to undo this easily.`, () => {
        _executeBulkLink(files, selectedContext);
    });
}


function getMarkedFiles(fileCallback = null) {
    let files = [];
    for (let c = 0; c < sessionStorage.length; c++) {
        let key = sessionStorage.key(c);
        if (key.startsWith("filemarked_")) {
            if (sessionStorage.getItem(key) === "true") {
                let uid = key.substr(11);
                if (fileCallback)
                    fileCallback(uid)
                else
                    files.push(uid);
            }
        }
    }
    return files;
}

function _bulkDelete() {
    let files = getMarkedFiles();
    changeToolButtonState("fr-bt-bulk-delete", 2);
    kioskAjax("/filerepository/bulkdelete", JSON.stringify({ "files": files }), "POST",
        {
            beforeSend: function(xhr, settings) {
                csrf_token = $("#csrf_token").attr("value");
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrf_token);
                }
            },
            dataType: "json",
            contentType: "application/json",
            onSuccess: (data, textStatus, jqXHR) => {
                changeToolButtonState("fr-bt-bulk-delete", 1);
                fetchImageCount();
                if (data.result != "ok") {
                    kioskErrorToast(data.result);
                } else {
                    kioskSuccessToast(`${data.deleted_files.length} files have been successfully deleted.`);
                    for (let i = 0; i < data.deleted_files.length; i++) {
                        let el = $("#" + data.deleted_files[i]);
                        sessionStorage.removeItem("filemarked_" + data.deleted_files[i]);
                        if (el) el.remove();
                    }
                }
            },
            onError: (errStr, status, xhr, stateData) => {
                changeToolButtonState("fr-bt-bulk-delete", 1);
                kioskErrorToast(errStr);
                fetchImageCount();
            },
        });
}

function _executeBulkLink(files, selectedContext) {
    changeToolButtonState("fr-bt-bulk-attach", 2);
    kioskAjax("/filerepository/bulklink/execute", JSON.stringify({ "files": files, "context_info": selectedContext }),
        "POST",
        {
            beforeSend: function(xhr, settings) {
                csrf_token = $("#csrf_token").attr("value");
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrf_token);
                }
            },
            dataType: "json",
            contentType: "application/json",
            onSuccess: (data, textStatus, jqXHR) => {
                console.log("data", data);
                changeToolButtonState("fr-bt-bulk-attach", 1);
                fetchImageCount();
                if (!data.success) {
                    kioskErrorToast(data.message);
                } else {
                    let cModified = Object.keys(data.data.updated).length;
                    if (data.message && data.message !== "") {
                        kioskSuccessToast(`${data.message}`);
                    } else {
                        kioskSuccessToast(`${cModified} files have been successfully linked to ` +
                            `${selectedContext["identifier"]}.`);
                    }
                    if (cModified > 0) {
                        for (let uid of Object.keys(data.data.updated)) {
                            updateFileRepositoryImage(uid);
                        }
                    }

                    // for (let i = 0; i < data.linked_files.length; i++) {
                    //   let el = $("#" + data.linked_files[i]);
                    //   sessionStorage.removeItem("filemarked_" + data.deleted_files[i])
                    //   if (el) el.remove();
                    // }
                }
            },
            onError: (errStr, status, xhr, stateData) => {
                changeToolButtonState("fr-bt-bulk-attach", 1);
                kioskErrorToast(errStr);
                fetchImageCount();
            },
        });
}


/******************************************************
 Edit File Partial
 *********************************************************/
function initEFPartial(time_zones) {
    // time_zones.getTimeZoneByIndex(1820474).then(tz_info => {
    //   alert(`1820474 is ${tz_info.tz_IANA}`)
    // })

    installImageOnLoadHandler();
    efInitUploader();
    efInitAddContext();
    efInitDropContext();
    efInitFormFields()
}

function efInitUploader() {
    $("#ef-upload-area").dmUploader({
        url: "/filerepository/replace/" + efGetCurrentImageUID(),
        auto: true,
        queue: false,
        //allowedTypes: "image/*",
        dataType: "json",
        extraData: { "uid": efGetCurrentImageUID() },
        onInit: function() {
        },
        onNewFile: function(id, file) {
            // When a new file is added using the file selector or the DnD area
            // let img_src = $("#image-container").attr("src");
            // $("#image-container").attr("img_src", img_src);
            // let width = $("#image-container").width();
            // let height = $("#image-container").height();
            // $("#image-container").css({
            //     "min-width": width,
            //     "min-height": height,
            // });
            // $("#image-container").attr("src", null);
        },
        onBeforeUpload: function(id) {
            // $("#image-container").hide();
            // $("#image-spinner").show();
            // // $("#image-container").fadeIn("fast");
            // $(".modal-upload").hide();
            showhidemenu("#upload-area", "#upload-area-contents");
            showHideLightbox(true)
            showRainbowProgress(true)
            setEFUploadFileProgress(id, 0);
        },
        onUploadSuccess: function(id, data) {
            showHideLightbox(false)
            showRainbowProgress(false)
            if (data.result === "ok") {
                document.fileViewerController.reloadFile({width: data.width, height: data.height})
                let uuid = efGetCurrentImageUID()
                updateFileRepositoryImage(uuid);
                // installImageOnLoadHandler();
                setEFUploadFileProgress(101, data.result);
            } else {
                setEFUploadFileProgress(-1, data.result);
            }
        },
        onUploadError: function(id, xhr, status, errorThrown) {
            showRainbowProgress(false)
            showHideLightbox(false)
            onEFUploadError(errorThrown);
        },
        onFallbackMode: function(message) {
            kioskErrorToast("Browser not supported!: " + message);
        },
    }); //end $('#drop-area-div').dmUploader
}

function showRainbowProgress(show) {
    const el = document.querySelector(".rainbow-loading")
    if (el) el.style.display = show ? "unset" : "none"
}

function showHideLightbox(hide=null) {
    const el = document.fileViewerController?.lightBoxElement
    if (el) {
        el.showHideUI(hide)
    }
    const elData = document.getElementById("ef-dialog")
    hide = hide === null ? !(elData.style.visibility === "hidden") : hide
    elData.style.visibility = hide ? "hidden" : "unset"
}

function efInitAddContext() {
    let btAdd = $("#ef-new-context");
    btAdd.on("click", efAddNewContext.bind(btAdd));
}

function efInitDropContext() {
    let dropButtons = $(".ef-cancel-context");
    for (let idx = 0; idx < dropButtons.length; idx++) {
        let button = $(dropButtons[idx]);
        button.on("click", efDropContext.bind(button));
    }

}

function efInitFormFields() {
    const partial = document.getElementById("fr-data-partial")
    for (const e of partial.getElementsByTagName("input")) {
        if (e.id !== "ef-upload-input")
            e.addEventListener("input", efMarkRecordDirty)
    }
    for (const e of partial.getElementsByTagName("textarea")) {
        e.addEventListener("input", efMarkRecordDirty)
    }
}

function efAddNewContext() {
    let newContext = $($("#ef-new-context-controls-template").html());
    let contextList = $(".ef-context-list");
    this.parent().before(newContext);
    let btDropThis = newContext.find(".ef-cancel-new-context");
    let editField = newContext.find("input");
    let field_id = "new-context-" + String(contextList.children().length) + "-" + String(Date.now());
    editField.attr("name", field_id);
    editField.attr("id", field_id);
    btDropThis.on("click", efDropThisNewContext.bind(newContext));
    editField.focus();
    efMarkRecordDirty()
}

function efDropThisNewContext(evt) {
    this.remove();
}

function efGetCurrentImageUID() {
    let uuid = $("#uid").text();
    return uuid;
}

function efDropContext(evt) {
    let parent = this.parent();
    let undoButton = parent.find(".ef-undo-drop-context");
    if (undoButton) {
        efMarkRecordDirty()
        undoButton.show();
        undoButton.on("click", efRestoreDroppedContext.bind(undoButton));
        parent.addClass("drop-context-marker");
        this.hide();
    }
}

function efRestoreDroppedContext(evt) {
    let parent = this.parent();
    parent.removeClass("drop-context-marker");

    let deleteButton = parent.find(".ef-cancel-context");
    if (deleteButton) {
        deleteButton.on("click", efDropContext.bind(deleteButton));
        deleteButton.show();
    }
    this.hide();
}

function onEFDialogCancel() {
    const fileViewerController = document.fileViewerController
    fileViewerController?.reloadData()
}

function installImageOnLoadHandler() {
    $("#image-container").one("load", function() {
        EXIF.getData(this, function() {
                let orientation = EXIF.getTag(this, "Orientation");
                if (orientation) {
                    switch (orientation) {
                        case 1:
                            break;
                        case 3:
                            $(this).css("transform", "rotate(180deg)");
                            break;
                        case 6:
                            $(this).css("transform", "rotate(-270deg)");
                            break;
                        case 8:
                            $(this).css("transform", "rotate(-90deg)");
                            break;
                        default:
                            alert("Unhandled Orientation is " + orientation);
                    }
                }
                $("#image-spinner").hide();
                $("#image-container").fadeIn("fast");
                $(".modal-download").fadeIn("slow");
                $(".modal-upload").fadeIn("slow");
            },
        );
    }).each(function() {
        if (this.complete) {
            $(this).trigger("load");
        }
    });
}

function setEFUploadFileProgress(status, data) {
    if (status === -1) {
        kioskErrorToast(data);
    }
    // if (status === 101) {
    //     let d = new Date();
    //     let img_src = $("#image-container").attr("img_src");
    //     $("#image-container").attr("src", img_src + "?" + d.getTime());
    //     $("#image-container").css({
    //         "min-width": "none",
    //         "min-height": "none",
    //     });
    // }
}

function onEFUploadError(errorThrown) {
    kioskErrorToast("An error occured during upload: " + errorThrown);
}

function efMarkRecordDirty(dirty = true) {
    const elRecordButtons = document.getElementById("ef-record-buttons")
    try {
        if (dirty)
            elRecordButtons.classList.add("ef-record-dirty")
        else
            elRecordButtons.classList.remove("ef-record-dirty")
    } catch (e) {
        console.log(e)
    }
}

function onEFDialogOk() {

    $("#ef-ok").prop("disabled", true);
    $(".dialog-error").remove();
    let uuid = $("#uid").text();
    let formData = $("#ef-form").serializeArray();
    let droppedContextMarkers = $("#ef-context-list").find(".drop-context-marker");
    if (droppedContextMarkers) {
        // let droppedContexts = []
        for (let i = 0; i < droppedContextMarkers.length; i++) {
            let context = $(droppedContextMarkers[i]).find(".ef-dialog-identifier").text();
            let record_type = $(droppedContextMarkers[i]).find(".ef-record-type").text();
            if (record_type[0] === "(") record_type = record_type.substring(1, record_type.length - 1);
            console.log("deleting context " + context + " from " + record_type);
            formData.push({ name: "drop-context-" + context, value: record_type });
        }

    }
    console.log(formData);
    $.post("/filerepository/editpartial/" + uuid, formData,
        function(data) {
            if (data.result !== "ok") {
                $("#ef-ok").prop("disabled", false);
                $("#ef-cancel").prop("disabled", false);

                if (data.result === "exception") {
                    kioskModalErrorToast(data.msg);
                } else {
                    for (let f in data.result) {
                        let err_msg = data.result[f][0];
                        let html_field = f.replace(/_/g, "-");
                        console.log(html_field, err_msg);
                        $("#" + html_field).before("<div class=\"dialog-error\">" + err_msg + "</div>");
                    }
                }
            } else {
                let uuid = $("#uid").text();
                updateFileRepositoryImage(uuid);
                efMarkRecordDirty(false)
                setTimeout(() => {
                    const fileViewerController = document.fileViewerController
                    fileViewerController?.reloadData()
                },10)
            }
        },
    );
}

function onEFDialogDelete() {
    $(".dialog-error").remove();
    let uuid = $("#uid").text();
    kioskYesNoToast("Are you sure you want to delete this file? ",
        () => {
            EFDeleteFile(uuid, false);
        }, () => {
        }, {}, ".kiosk-modal-dialog-toasts");

}

function EFDeleteFile(uuid, forceIt) {
    let urlParamForce = forceIt ? "true" : "false";
    $.post({
        url: "/filerepository/delete/" + uuid + "/" + urlParamForce,
        beforeSend: function(xhr, settings) {
            csrf_token = $("#csrf_token").attr("value");
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        },
    })
    .done(function(data) {
        console.log("delete response", data)
        if (data.result !== "ok") {
            if (data.hasOwnProperty("ask_for_force") && !forceIt) {
                kioskYesNoToast(data.result,
                    () => {
                        EFDeleteFile(uuid, true);
                    }, () => {
                    }, {}, ".kiosk-modal-dialog-toasts");
            } else {
                kioskModalErrorToast(data.result);
            }
        } else {
            $("#" + uuid).remove();
            const fileViewerController = document.fileViewerController
            if (!fileViewerController.invalidateCurrent()) {
                document.getElementsByTagName("kiosk-lightbox")[0].doClose()
            }
        }
    })
    .fail(function(xhr, status, errorThrown) {
        console.log(errorThrown);
        kioskErrorToast(`An error occurred: ${errorThrown}`)
        // $("#frf").submit();
    });
}

function start_download_spinner() {
    $("#download-menu").hide();
    $("#image-spinner").show();
}

function stop_download_spinner() {
    $("#download-menu").show();
    $("#image-spinner").hide();
}

function onEFDownloadImage(event) {
    closeMenu("#download-menu-contents", $("#download-menu"));
    let uuid = $("#uid").text();

    let target = event.target;
    if (target.id !== "download-raw") {
        let representationId = target.getAttribute("data-representation-id");
        uuid = uuid + ":" + representationId;
        console.log("downloading representation " + representationId);
    } else console.log("downloading raw file");

    start_download_spinner();
    $(".download-msg").remove();
    $.fileDownload("/filerepository/download/" + uuid + "/start")
        .done(function() {
            console.log("file download success");
            afterFileDownload();
        })
        .fail(function() {
            console.log("file download failure");
            afterFileDownload();
        });

    function afterFileDownload() {
        $.ajax({
            method: "GET",
            url: "/filerepository/download/" + uuid + "/response",
            dataType: "json",
            data: { result: "ok" },
        })
            .done(function(msg) {
                stop_download_spinner();
                console.log(msg);
                if (msg.result !== "ok") {
                    $("#image-spinner").before("<div class=\"dialog-error download-msg\">Drat! Something went wrong with the download:<br>" + msg.result + "</div>");
                    $(".download-msg").fadeIn();
                    $(".download-msg").click(function() {
                        $(".download-msg").remove();
                    });
                } else {
                    $("#image-spinner").before("<div class=\"dialog-error download-msg\">Download initiated, might even be finished.</div>");
                    $(".download-msg").fadeIn();
                    $(".download-msg").click(function() {
                        $(".download-msg").remove();
                    });
                }
            });
    }
}

function activateImage(uuid) {
    $(".fr-image-clicked").removeClass("fr-image-clicked");
    const img = document.getElementById(uuid)
    if (img) {
        img.scrollIntoView()
        img.focus()
        img.classList.add("fr-image-clicked")
    }
}

/* **************************************************************************************

                  Bulk Tagging Dialog

************************************************************************************** */

function initBulkTaggingSelections() {
    $("#btag-dialog select").each((idx, el) => {
        $(el).on("change", () => {
                updateChangedTagsLabel();
            },
        );
    });
}

function updateChangedTagsLabel() {
    let c = 0;
    $("#btag-dialog select").each((idx, el) => {
        if ($(el).val() !== "") c++;
    });
    const l = $("#changed-tags-label");
    const c_div = $(".changed-tags-counter");
    if (c > 0) {
        l.text(`${c} tag changes will be applied to the marked files.`);
        c_div.show();
    } else {
        l.text("");
        c_div.hide();
    }
}

function startBulkTagging() {
    let tag_changes = {};
    $("#btag-dialog select").each((idx, el) => {
        const action = $(el).val();
        if (action) tag_changes[$(el).attr("tag")] = action;
    });
    const new_tags = $("#new-tags").val();
    if (Object.keys(tag_changes).length > 0 || new_tags) {
        let files = getMarkedFiles();
        inject_button_loader($("#bt-ok"), "#000");
        kioskActivateButton($("#bt-cancel"), null);
        kioskAjax("/filerepository/bulktag/execute",
            JSON.stringify({
                "files": files,
                "tag_changes": tag_changes,
                "new_tags": new_tags,
            }),
            "POST",
            {
                contentType: "application/json",
                onSuccess: (data) => {
                    remove_button_loader($("#bt-ok"));
                    kioskActivateButton($("#bt-ok"), null);
                    if (data.success) {
                        $("#frf").submit();
                        frfEnableSubmitMode(false);
                    } else
                        kioskErrorToast("Sorry, but it was not possible to apply the tag changes. <br>" +
                            "<span style='color: var(--col-accent-alert)'>" + data.message + "</span>", {
                            timeout: 5000,
                            transitionIn: "fadeIn",
                            transitionOut: "fadeOut",
                            onClosed: function(instance, toast, closedBy) {
                                $.magnificPopup.close();
                            },
                        });
                },
                onError: (msg, textStatus, jqXHR, stateData) => {
                    remove_button_loader($("#bt-ok"));
                    kioskActivateButton($("#bt-ok"), null);
                    kioskErrorToast("Sorry, an error occured when applying the tag changes: <br><br>" +
                        "<span style='color: var(--col-accent-alerts)'>" + msg + "</span>", {
                        timeout: 5000,
                        transitionIn: "fadeIn",
                        transitionOut: "fadeOut",
                        onClosed: function(instance, toast, closedBy) {
                            $.magnificPopup.close();
                        },
                    });
                },
            });
    } else {
        $.magnificPopup.close();
    }
}

function fetchIdentifiers() {
    let site_filter = getCookie("site_filter")
    let urlSearchParams = undefined
    if (site_filter && site_filter !== "-") {
        urlSearchParams = new URLSearchParams();
        urlSearchParams.append("site_filter", site_filter);
    }
    globalGetKioskToken()
        .then((token) => {
            return globalFetchFromApi(globalGetApiUrl(""),
                token,
                "contexts",
                {  },
                undefined,
                urlSearchParams,
                "");
        })
        .then((result) => {
            if (!fetchIdentifiers.awesomeplete) {
            let element = document.getElementById("frf-context");
                fetchIdentifiers.awesomeplete = new Awesomplete(element, { list: result.identifiers });
            } else {
                fetchIdentifiers.awesomeplete.list = result.identifiers
            }
        });
}

function fr_limitToSite() {
    $.magnificPopup.open({
        type: "ajax",
        items: {
            src: "/filerepository/sitefilterdialog",
        },
        //  focus: "create-workstation-id",
        removalDelay: 200,
        mainClass: "mfp-with-anim"
    });

}

function frInitFileViewer(apiContext) {
    let lb = document.getElementsByTagName("kiosk-lightbox")[0];
    document.fileViewerController = new FileViewerController(apiContext, lb, true)
    console.log("FileViewerController initialized")
}

function onEditImage(evt) {
    if (document.hasOwnProperty("fileViewerController")) {
        let img = $(evt.currentTarget);
        let clickedUuid = img.attr("uid");
        const fwc = document.fileViewerController
        fwc.opened = (e) => {
            showRainbowProgress(false)
            if (e?.result) {
                document.getElementById("broken-image").style.display = "none"
            } else {
                document.getElementById("broken-image").style.display = "grid"
            }
        }
        fwc.beforeOpen = () => {
            showRainbowProgress(true)
        }
        if (fwc) {
            fwc.clear()
            document.filesOnPage.forEach(f => fwc.addFile(f))
            // fwc.addFile({ uuid: clickedUuid })
            fwc.showFiles(clickedUuid)
            return
        }
    }
    kioskErrorToast("Currently the viewer is not present. Please try refreshing the page. (Err: There is no FileViewerController present)")
}
//# sourceURL=filerepository.js