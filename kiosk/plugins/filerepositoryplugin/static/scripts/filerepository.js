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
  $("#fr-sidebar input").keyup(function (event) {
    fetchImageCount();
  });

  $("#frf-recording-context").change(function (event) {
    fetchImageCount();
  });

  $("#frf-tags").change(function (event) {
    fetchImageCount();
  });

  $("#frf-no-context").change(function (event) {
    refreshContext();
    fetchImageCount();
  });

  $("#fr-resolution-select").change(function (event) {
    if (check_image_count()) {
      let res_val = $("#fr-resolution-select").val();
      if ($("#frf-resolution-select").length) {
        $("#frf-resolution-select").remove()
      }
      $("#frf").append("<input style='display:none' name='frf-resolution-select' id='frf-resolution-select' value='" + res_val + "'>");
      $("#frf").submit();
    } else {
      alert("oops.")
    }
  });

  $("#fr-sorting").change(function (event) {
    if (check_image_count()) {
      let sort_val = $("#fr-sorting").val();
      if ($("#frf-sorting").length) {
        $("#frf-sorting").remove()
      }
      $("#frf").append("<input style='display:none' name='frf-sorting' id='frf-sorting' value='" + sort_val + "'>");
      $("#frf").submit();
    }
  });

  $("#content-wrapper").on("scroll", function () {
    //alert("scroll Top is " + String($(this).scrollTop()))
    if ($(this).scrollTop() > 50) {
      $('#scroll-to-top:hidden').stop(true, true).fadeIn();
    } else {
      $('#scroll-to-top').stop(true, true).fadeOut();
    }
  });

  $("#filter-reset").on("click", () => {
    resetFileReposFilters(true);

  })

  $("#fr-bt-toggle").on("click", toggleFileMarkers);
  $("#fr-bt-clear-markers").on("click", clearAllFileMarkers);
  $("#fr-bt-set-markers").on("click", setAllFileMarkers);
  $("#fr-bt-bulk-delete").on("click", askBulkDelete);
  $("#fr-bt-bulk-tag").on("click", askBulkTag);
  $("#fr-bt-bulk-attach").on("click", askBulkAttach);

  $(function () {
    $("#scroll-to-top").on("click",
      function () {
        $("#content-wrapper").animate(
          {
            scrollTop: $(".thetop").offset().top
          }, "1000");
        return false
      })
  });

  let input = document.getElementById("frf-tags");
  let awesomplete_tags = new Awesomplete(input,
    {list: "fr-tags",
      minChars: 0});
  input.addEventListener("awesomplete-selectcomplete", fetchImageCount);

  input = document.getElementById("frf-context");
  input.addEventListener("awesomplete-selectcomplete", fetchImageCount);
}

function initPageList() {
  $(".fr-page-list-page").on("click", function (evt) {
    onPageClick(evt)
  })
}

function resetFileReposFilters(fetch = false) {
  $("#frf-no-context").checked = false;
  $("#frf-context").val("");
  $("#frf-description").val("");
  $("#frf-tags").val("");
  $("#frf-recording-context").val("");
  if (fetch) fetchImageCount();
}

function onPageClick(evt) {
  let page = $(evt.currentTarget);
  let page_number = page.text();

  if ($("#frf-current-page").length) {
    $("#frf-current-page").remove()
  }
  $("#frf").append("<input style='display:none' name='frf-current-page' id='frf-current-page' value='" + page_number + "'>");
  $("#frf").submit();

}


function refreshContext() {
  if ($('#frf-no-context').is(":checked")) {
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
  console.log(fetchImageCount.caller)
  try {
    $("#file-count").text("calculating...");
    frfEnableSubmitMode(false);
    if (fr_timeout != null) clearTimeout(fr_timeout);
  } finally {
    fr_timeout = null;
  }
  fr_timeout = setTimeout(getFileCount, 500);
}

function getMaxImagesPerPage() {
  let v = parseInt($("#fr-filter").attr("max-images-per-page"));
  return v
}


function getFileCount() {
  if (!lockFileCount) {
    lockFileCount = true;
    try {
      formData = $("#frf").serializeArray();
      formData.push({name: "ajax", value: "true"});
      $.ajax({
        url: "/filerepository",
        type: "POST",
        dataType: "json",
        data: formData
      })
        .done(function (json) {
          // $("#fr-image-count").remove();
          // $("#fr-filter").append(`<div id="fr-image-count" image-count="${json.result}"></div>`)
          $("#file-count").text("");
          $("#file-count").attr("image-count", json.result);
          maxImages = getMaxImagesPerPage();
          $("#frf-from-date").removeClass("input-error");
          $("#frf-to-date").removeClass("input-error");
          $("#context-identifier-filter").removeClass("input-error");
          if (isNaN(json.result)) {
            if (json.result.startsWith("The identifier")) {
              $("#context-identifier-filter").addClass("input-error");
              $("#file-count").text(json.result);
            } else if (json.result.indexOf("valid date or year") > -1) {
              if (json.result.indexOf("'from'") > -1) {
                $("#frf-from-date").addClass("input-error");
              } else {
                $("#frf-to-date").addClass("input-error");
              }
              $("#file-count").text(json.result);
            }
            else {
              kioskErrorToast(json.result);
            }
            frfEnableSubmitMode(false);
            // return
          } else {
            if (json.result > 0) {
              // if (json.result <= maxImages)  {
              if (json.result) {
                frfEnableSubmitMode(true);
                if (json.result > 1)
                  $("#file-count").text(json.result.toString() + " files found. Click to fetch 'em.")
                else
                  $("#file-count").text("One file found. Click to fetch it.");
              } else {
                $("#file-count").text(json.result.toString() + " files found. Please be more specific.");
                frfEnableSubmitMode(false);
              }
            } else {
              $("#file-count").text("No files match your criteria.");
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
  resetFileReposFilters()
  $("#frf-tags").val(tag);
  $("#frf").submit();
}

function onFRImageClick(uuid) {
  $.magnificPopup.open({
    type: 'ajax',
    items: {
      src: "/filerepository/edit/" + uuid
    },
    //  focus: "create-workstation-id",
    removalDelay: 200,
    mainClass: "mfp-with-anim"
    // callbacks: {
    //     ajaxContentAdded: ()=>{
    //       frInitEditImageDialog();
    //     }
    //   }
  });
}

function updateFileRepositoryImage(uuid) {
  //todo: Why does this have its own CSRF Token? I thought that is added automatically when using ajax?
  $.ajax({
    url: "/filerepository/fetch_tile/" + uuid + "/force_reload=1",
    type: "POST",
    dataType: "html",
    beforeSend: function (xhr, settings) {
      // $("#"+uuid).replaceWith("<div id=\'" + uuid + "\'></div>");
      // inject_button_loader($("#"+uuid));
      csrf_token = $("#csrf_token").attr("value");
      if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
      }
    }
  })
    .done(function (html) {
      $("#" + uuid).replaceWith(html);
      activateImage(uuid);

      console.log("Replaced " + uuid);
      refreshBLazy();
    })
    .fail(function (xhr, status, errorThrown) {
      console.log(errorThrown);
      $("#frf").submit();
    });
}

function refreshBLazy() {
  refreshMarkers();
  let bLazy = new Blazy({
    container: "#content-wrapper",
    success: (ele) => {
      $(ele).off("click", function (evt) {
        onEditImage(evt)
      });
      $(ele).on("click", function (evt) {
        onEditImage(evt)
      });
    }
  });
}

function identifierClicked() {
  let uuid = this.id;
  sessionStorage.setItem("filemarked_" + uuid, String(!isFileChecked(uuid)))
  showFileChecked(this)
}

function setFileChecked(element, value) {
  let uuid = element.id;
  sessionStorage.setItem("filemarked_" + uuid, String(value))
  showFileChecked(element)
}

function isFileChecked(uuid) {
  return sessionStorage.getItem("filemarked_" + uuid) === "true"
}

function showFileChecked(element) {
  let marker = $(element).find(".fa-star").first()
  let uuid = element.id;
  if (isFileChecked(uuid)) {
    marker.addClass("check");
  } else {
    marker.removeClass("check");
  }
  marker.css("visibility", "visible");

}

function refreshMarkers() {
  $("#fr-image-list-wrapper").children().each((index, element) => {
    let clicker = $(element).find(".fr-identifier-and-check").first()
    clicker.on("click", identifierClicked.bind(element));
    showFileChecked(element)
  })
}

function toggleFileMarkers() {
  $("#fr-image-list-wrapper").children().each((index, element) => {
    identifierClicked.bind(element)();
  })

}

function clearAllFileMarkers() {
  $("#fr-image-list-wrapper").children().each((index, element) => {
    setFileChecked(element, false)
  })
}

function resetFileMarkers() {
  let c = 0;
  while (c < sessionStorage.length) {
    let key = sessionStorage.key(c);
    if (key.startsWith("filemarked_")) {
      sessionStorage.removeItem(key)
    } else {
      c++;
    }
  }
}

function countFileMarkers() {
  let c = 0;
  for (let i = 0; i < sessionStorage.length; i++) {
    let key = sessionStorage.key(i);
    if (key.startsWith("filemarked_") && (sessionStorage.getItem(key) === 'true')) {
      c++
    }
  }
  return c;
}

function setAllFileMarkers() {
  $("#fr-image-list-wrapper").children().each((index, element) => {
    setFileChecked(element, true)
  })

}

function changeToolButtonState(id, state) {
  let bt = $("#" + id)
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
    let c = countFileMarkers()
    if (c === 0) {
      kioskSuccessToast("Please mark the files you want to delete by clicking on the " +
        "star next to a file's context identifiers.")
      return;
    }
    changeToolButtonState('fr-bt-bulk-delete', 0);
    let options = {
      title: `You are about to delete ${c} files!`,
      backgroundColor: 'var(--color-background)',
      titleColor: 'var(--color-white)',
      messageColor: 'var(--color-white)',
      iconColor: 'var(--color-reddish)',
    }
    kioskYesNoToast(`<br>Do you really want to delete the ${c} files you starred?<br><br>`, () => {
      kioskYesNoToast(`<br>Some or all of those ${c} files might get detached from their 
    archaeological contexts, too. <br><strong>Are you sure you want to proceed?</strong><br><br>`, () => {
          _bulkDelete();
        }, () => changeToolButtonState('fr-bt-bulk-delete', 1)
        , options)
    }, () => changeToolButtonState('fr-bt-bulk-delete', 1), options)
  }
}

function askBulkAttach() {
  kioskErrorToast("This operation is not implemented yet.")
}


function askBulkTag() {
  let c = countFileMarkers()
  if (c === 0) {
    kioskSuccessToast("Please mark the files you want to tag by clicking on the " +
      "star next to a file's context identifiers.")
    return;
  }

  let files = getMarkedFiles();
  $.magnificPopup.open({
    type: 'ajax',
    ajax: {
      settings: {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          'files': files
        })
      }
    },
    items: {
      src: "/filerepository/bulktag"
    },
    removalDelay: 200,
    mainClass: "mfp-with-anim",
    callbacks: {
      beforeOpen: function () {
        changeToolButtonState('fr-bt-bulk-tag', 0);
      },
      afterClose: function () {
        changeToolButtonState('fr-bt-bulk-tag', 1);
      }
    }
  });
}


function getMarkedFiles() {
  let files = []
  for (let c = 0; c < sessionStorage.length; c++) {
    let key = sessionStorage.key(c);
    if (key.startsWith("filemarked_")) {
      if (sessionStorage.getItem(key) === "true") {
        let uid = key.substr(11)
        files.push(uid)
      }
    }
  }
  return files
}

function _bulkDelete() {
  let files = getMarkedFiles();
  changeToolButtonState('fr-bt-bulk-delete', 2);
  kioskAjax("/filerepository/bulkdelete", JSON.stringify({"files": files}), 'POST',
    {
      beforeSend: function (xhr, settings) {
        csrf_token = $("#csrf_token").attr("value");
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrf_token);
        }
      },
      dataType: "json",
      contentType: "application/json",
      onSuccess: (data, textStatus, jqXHR) => {
        changeToolButtonState('fr-bt-bulk-delete', 1);
        fetchImageCount();
        if (data.result != "ok") {
          kioskErrorToast(data.result);
        } else {
          kioskSuccessToast(`${data.deleted_files.length} files have been successfully deleted.`);
          for (let i = 0; i < data.deleted_files.length; i++) {
            let el = $("#" + data.deleted_files[i]);
            sessionStorage.removeItem("filemarked_" + data.deleted_files[i])
            if (el) el.remove();
          }
        }
      },
      onError: (errStr, status, xhr, stateData) => {
        changeToolButtonState('fr-bt-bulk-delete', 1);
        kioskErrorToast(errStr);
        fetchImageCount();
      }
    })
}


/******************************************************
 Edit Image Dialog
 *********************************************************/
function initEFDialog() {
  $("#image-container").one("error", function () {
    $("#image-spinner").hide();
    $("#image-container").replaceWith("<div id='img-load-err'><span>Could not load image.</span></span></div>");
  });
  installImageOnLoadHandler();
  efInitUploader();
  efInitAddContext();
  efInitDropContext();
}

function efInitUploader() {
  $('#ef-upload-area').dmUploader({
    url: '/filerepository/replace/' + efGetCurrentImageUID(),
    auto: true,
    queue: false,
    //allowedTypes: "image/*",
    dataType: 'json',
    extraData: {"uid": efGetCurrentImageUID()},
    onInit: function () {
    },
    onNewFile: function (id, file) {
      // When a new file is added using the file selector or the DnD area
      let img_src = $("#image-container").attr("src");
      $("#image-container").attr("img_src", img_src);
      let width = $("#image-container").width();
      let height = $("#image-container").height();
      $("#image-container").css({
        "min-width": width,
        "min-height": height
      });
      $("#image-container").attr("src", null);
    },
    onBeforeUpload: function (id) {
      $("#image-container").hide();
      $("#image-spinner").show();
      // $("#image-container").fadeIn("fast");
      $(".modal-download").hide();
      $(".modal-upload").hide();
      setEFUploadFileProgress(id, 0);
    },
    onUploadProgress: function (id, percent) {
      setEFUploadFileProgress(id, percent);
    },
    onUploadSuccess: function (id, data) {
      if (data.result == "ok") {
        setEFUploadFileProgress(101, data.result);
      } else {
        setEFUploadFileProgress(-1, data.result);
      }
    },
    onUploadError: function (id, xhr, status, errorThrown) {
      onEFUploadError(errorThrown);
    },
    onFallbackMode: function (message) {
      kioskErrorToast('Browser not supported!: ' + message);
    }
  }); //end $('#drop-area-div').dmUploader
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

function efAddNewContext() {
  let newContext = $($("#ef-new-context-controls-template").html());
  let contextList = $(".ef-context-list");
  this.parent().before(newContext);
  let btDropThis = newContext.find(".ef-cancel-new-context");
  let editField = newContext.find("input");
  let field_id = "new-context-" + String(contextList.children().length) + "-" + String(Date.now())
  editField.attr("name", field_id);
  editField.attr("id", field_id);
  btDropThis.on("click", efDropThisNewContext.bind(newContext));
  editField.focus();
}

function efDropThisNewContext(evt) {
  this.remove();
}

function efGetCurrentImageUID() {
  let uuid = $("#uid").text();
  return uuid
}

function efDropContext(evt) {
  let parent = this.parent();
  let undoButton = parent.find(".ef-undo-drop-context");
  if (undoButton) {
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
  $.magnificPopup.close();
}

function installImageOnLoadHandler() {
  $("#image-container").one("load", function () {
    EXIF.getData(this, function () {
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
      }
    );
  }).each(function () {
    if (this.complete) {
      $(this).trigger('load');
    }
  });
}

function setEFUploadFileProgress(status, data) {
  if (status == -1) {
    kioskModalErrorToast(data);
  }
  // if (status == 101) {
  let d = new Date();
  let img_src = $("#image-container").attr("img_src");
  $("#image-container").attr("src", img_src + "?" + d.getTime());
  $("#image-container").css({
    "min-width": "none",
    "min-height": "none"
  });
  let uuid = $("#uid").text();
  updateFileRepositoryImage(uuid);
  installImageOnLoadHandler();
  // }
}

function onEFUploadError(errorThrown) {
  kioskErrorToast('An error occured during upload: ' + errorThrown);
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
      if (record_type[0] === '(') record_type = record_type.substring(1, record_type.length - 1);
      console.log("deleting context " + context + " from " + record_type);
      formData.push({name: "drop-context-" + context, value: record_type});
    }

  }
  console.log(formData);
  $.post("/filerepository/editdialog/" + uuid, formData,
    function (data) {
      if (data.result !== "ok") {
        $("#ef-ok").prop("disabled", false);
        if (data.result === "exception") {
          kioskModalErrorToast(data.msg);
        } else {
          for (let f in data.result) {
            let err_msg = data.result[f][0];
            let html_field = f.replace(/_/g, "-");
            console.log(html_field, err_msg);
            $("#" + html_field).before('<div class="dialog-error">' + err_msg + '</div>');
          }
        }
      } else {
        let uuid = $("#uid").text();
        $.magnificPopup.close();
        updateFileRepositoryImage(uuid);
      }
    }
  );
}

function onEFDialogDelete() {
  $(".dialog-error").remove();
  let uuid = $("#uid").text();
  kioskYesNoToast("Are you sure, you want to delete this file? ",
    () => {
      EFDeleteFile(uuid, false);
    }, () => {
    }, {}, ".kiosk-modal-dialog-toasts");

}

function EFDeleteFile(uuid, forceIt) {
  let urlParamForce = forceIt ? "true" : "false";
  $.post({
    url: "/filerepository/delete/" + uuid + "/" + urlParamForce,
    beforeSend: function (xhr, settings) {
      csrf_token = $("#csrf_token").attr("value");
      if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
      }
    }
  })
    .done(function (data) {
      if (data.result != "ok") {
        if (data.hasOwnProperty("ask_for_force") && !forceIt) {

          kioskYesNoToast(data.result,
            () => {
              EFDeleteFile(uuid, true);
            }, () => {
            }, {}, "#kiosk-modal-dialog-toasts");
        } else {
          kioskModalErrorToast(data.result);
        }
      } else {
        uuid = $("#uid").text();
        $.magnificPopup.close();
        $("#" + uuid).remove();
      }
    })
    .fail(function (xhr, status, errorThrown) {
      console.log(errorThrown);
      $("#frf").submit();
    });
}

function start_download_spinner() {
  $("#download-menu").hide();
  $("#image-spinner").show()
}

function stop_download_spinner() {
  $("#download-menu").show();
  $("#image-spinner").hide()
}

function onEFDownloadImage(event) {
  closeMenu('#download-menu-contents', $('#download-menu'));
  let uuid = $("#uid").text();

  let target = event.target
  if (target.id !== 'download-raw') {
    let representationId = target.getAttribute("data-representation-id")
    uuid = uuid + ':' + representationId
    console.log("downloading representation " + representationId)
  }
  else console.log("downloading raw file")

  start_download_spinner();
  $(".download-msg").remove();
  $.fileDownload('/filerepository/download/' + uuid + '/start')
      .done(function () {
        console.log("file download success")
        afterFileDownload()
      })
      .fail(function () {
        console.log("file download failure")
        afterFileDownload()
      })

  function afterFileDownload() {
        $.ajax({
          method: 'GET',
          url: '/filerepository/download/' + uuid + '/response',
          dataType: "json",
          data: {result: 'ok'}
        })
        .done(function (msg) {
          stop_download_spinner();
          console.log(msg)
          if (msg.result !== 'ok') {
            $("#image-spinner").before('<div class="dialog-error download-msg">Drat! Something went wrong with the download:<br>' + msg.result + '</div>');
            $(".download-msg").fadeIn();
            $(".download-msg").click(function () {
              $(".download-msg").remove()
            });
          } else {
            $("#image-spinner").before('<div class="dialog-error download-msg">Download initiated, might even be finished.</div>');
            $(".download-msg").fadeIn();
            $(".download-msg").click(function () {
              $(".download-msg").remove()
            });
          }
        });
  }
}

function activateImage(uuid) {
  $(".fr-image-clicked").removeClass("fr-image-clicked");
  let jqImage = $("#" + uuid);
  if (jqImage) {
    jqImage.addClass("fr-image-clicked");
  } else
    console.log(`activateImage: Image ${uuid} does not exist.`);

  // jqImage.parents(".fr-image-wrapper").addClass("fr-image-clicked");

}

/* **************************************************************************************

                  Bulk Tagging Dialog

************************************************************************************** */

function initBulkTaggingSelections() {
  $("#btag-dialog select").each((idx, el) => {
    $(el).on("change", () => {
        updateChangedTagsLabel()
      }
    )
  })
}

function updateChangedTagsLabel() {
  let c = 0
  $("#btag-dialog select").each((idx, el) => {
    if ($(el).val() !== "") c++;
  })
  const l = $("#changed-tags-label")
  const c_div = $(".changed-tags-counter")
  if (c > 0) {
    l.text(`${c} tag changes will be applied to the marked files.`)
    c_div.show()
  } else {
    l.text('')
    c_div.hide()
  }
}

function startBulkTagging() {
  let tag_changes = {}
  $("#btag-dialog select").each((idx, el) => {
    const action = $(el).val()
    if (action) tag_changes[$(el).attr("tag")] = action
  })
  const new_tags = $("#new-tags").val()
  if (Object.keys(tag_changes).length > 0 || new_tags) {
    let files = getMarkedFiles();
    inject_button_loader($("#bt-ok"), "#000");
    kioskActivateButton($("#bt-cancel"), null);
    kioskAjax("/filerepository/bulktag/execute",
      JSON.stringify({
        'files': files,
        'tag_changes': tag_changes,
        'new_tags': new_tags
      }),
      "POST",
      {
        contentType: 'application/json',
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
              transitionIn: 'fadeIn',
              transitionOut: 'fadeOut',
              onClosed: function (instance, toast, closedBy) {
                $.magnificPopup.close()
              }
            });
        },
        onError: (msg, textStatus, jqXHR, stateData) => {
          remove_button_loader($("#bt-ok"));
          kioskActivateButton($("#bt-ok"), null);
          kioskErrorToast("Sorry, an error occured when applying the tag changes: <br><br>" +
            "<span style='color: var(--col-accent-alerts)'>" + msg + "</span>", {
            timeout: 5000,
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            onClosed: function (instance, toast, closedBy) {
              $.magnificPopup.close()
            }
          });
        }
      });
  } else {
    $.magnificPopup.close()
  }
}

function fetchIdentifiers() {
  globalGetKioskToken()
    .then((token) => {
      return globalFetchFromApi(globalGetApiUrl(""), token, "contexts", {})
    })
    .then((result) => {
      let element = document.getElementById("frf-context");
	    new Awesomplete(element, { list: result.identifiers });
    })
}

//# sourceURL=filerepository.js