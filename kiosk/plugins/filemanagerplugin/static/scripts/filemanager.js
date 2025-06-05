function initFileManager() {
  $(".fa-arrow-circle-right").on("click", (e) => {
    let topic = $(e.target).parent().next().text()
    window.location.assign(`${join_route(getRoutefor("filemanager.filemanager_show"), topic)}`);
  })
}

function initFileManagerTopic(topic) {
  initFileManagerHeaders();
  initFileManagerUploader(topic);
}

function initFileManagerHeaders() {
  $('.fm-file-header').each(function () {
    if (this.innerText !== 'actions') {
      $(this).on("click", (e) => {
        let sort_by = $(this).attr("sort-field")
        let sort_order = $($(this).children()[1]).hasClass('fa-sort-up') ? 'dsc' : 'asc'
        $("#sort-by").val(sort_by)
        $("#sort-order").val(sort_order)
        $("#sort-form").submit()
      })
    }
  })
}

function triggerFileManagerDownload(url) {
  window.location = url
}

function triggerFileManagerDelete(filename, url) {
  kioskYesNoToast(`Are you sure you want to delete file ${filename}?`, () => {
    kioskAjax(url, {}, 'POST', {
      onSuccess: (data) => {
        if (data.success)
          location.reload()
        else
          kioskErrorToast("Blimey! The file could not be deleted: <br>" +
          "<span style='color: var(--col-accent-alert)'>" + data.message + "</span>", {
            timeout: 5000,
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            onClosed: function (instance, toast, closedBy) {
              location.reload()
            }
          });
      },
      onError: (msg, textStatus, jqXHR, stateData) => {
        kioskErrorToast("Blimey! The file could not be deleted: <br>" +
          "<span style='color: var(--col-accent-alert)'>" + msg + "</span>", {
            timeout: 5000,
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            onClosed: function (instance, toast, closedBy) {
              location.reload()
            }
          });
      }
    })
  })
}

function triggerFileManagerRestore(filename, url) {
  kioskYesNoToast(`Are you sure you want to restore file ${filename}?`, () => {
    kioskAjax(url, {}, 'POST', {
      onSuccess: (data) => {
        if (data.success)
          location.reload()
        else
          kioskErrorToast("Blimey! The file could not be restored: <br>" +
          "<span style='color: var(--col-accent-alert)'>" + data.message + "</span>", {
            timeout: 5000,
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            onClosed: function (instance, toast, closedBy) {
              location.reload()
            }
          });
      },
      onError: (msg, textStatus, jqXHR, stateData) => {
        kioskErrorToast("Blimey! The file could not be restored: <br>" +
          "<span style='color: var(--col-accent-alert)'>" + msg + "</span>", {
            timeout: 5000,
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            onClosed: function (instance, toast, closedBy) {
              location.reload()
            }
          });
      }
    })
  })
}

function initFileManagerUploader(topic) {
  let maxUploadSizeMb = 5

  if ($("#max-upload-size-mb").length) {
    maxUploadSizeMb = Number($("#max-upload-size-mb").attr("max-upload-size-mb"))
  }
  let route = join_route(getRoutefor("filemanager.filemanager_show"), 'upload')
  route = join_route(route, topic)
  $('#fm-drop-area-div').dmUploader({
    url: route,
    auto: true,
    queue: false,
    dataType: 'json',
    maxFileSize: maxUploadSizeMb * 1024 * 1024,
    onBeforeUpload: function (id) {
      setFileManagerInstallUploadProgress(id, 0);
    },
    onUploadProgress: function (id, percent) {
      setFileManagerInstallUploadProgress(id, percent);
    },
    onUploadSuccess: function (id, data) {
      $("#fm-upload-progress").text(`Please drag a file here or click to upload`);
      if (data.success) {
        kioskSuccessToast(data.message,{
            timeout: 5000,
            onClosed: uploadFinished
          })
      }
      else {
        kioskErrorToast(`The upload failed (${data.message}). Please try again.`, {
            timeout: 5000,
            onClosed: uploadFinished
          })
      }
    },
    onUploadError: function (id, xhr, status, errorThrown) {
      console.log(xhr)
      console.log(status)
      console.log(errorThrown)

      $.magnificPopup.close()
      if (errorThrown) {
        kioskErrorToast(`The upload failed (${errorThrown}). Please try again.`,{
            timeout: 5000,
            onClosed: uploadFinished
          })
      }
      else
        kioskErrorToast(`The upload failed. Please try again.`, {
            timeout: 5000,
            onClosed: uploadFinished
          })
    },
    onFallbackMode: function (message) {
      kioskErrorToast('The upload failed because your Browser does not support it: ' + message, {
            timeout: 5000,
            onClosed: uploadFinished
          });
    },
    onFileSizeError: function (file) {
      kioskErrorToast(`The selected file exceeds the file size limit of ${maxUploadSizeMb} MBytes`)
    }

  });

}

function setFileManagerInstallUploadProgress(id, percent) {
  $("#fm-upload-progress").text(`${percent} % done`);
}

function uploadFinished (instance, toast, closedBy) {
  location.reload()
}
