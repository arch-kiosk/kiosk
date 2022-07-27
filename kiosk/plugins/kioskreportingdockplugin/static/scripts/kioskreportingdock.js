function reportingDockConfirmPage() {
  document.getElementById("new-workstation-form").submit();
}

function reportingDockCancelPage(event) {
  event.preventDefault();
  kioskYesNoToast("Your changes will be lost, are you sure you want to cancel?", () => {
    window.location.replace(getRoutefor("syncmanager.sync_manager_show"));
  })
}


function reportingDocInitUploader() {
  const MAX_INSTALL_FILE_SIZE = 50 // 50 Megabyte

  const route = getRoutefor("kioskreportingdock.trigger_upload")

  $('#drop-area-div').dmUploader({
    url: route,
    auto: true,
    queue: false,
    dataType: 'json',
    maxFileSize: MAX_INSTALL_FILE_SIZE * 1024 * 1024,
    // extraData: {"uid": efGetCurrentImageUID()},
    // onInit: function () {
    // },
    // onNewFile: function (id, file) {
    //   console.log("adding file " + file)
    //   return false
    // },
    onBeforeUpload: function (id) {
      addSpinner($("#drop-area-div"),"hold on ...")
      setReportingDockUploadProgress(id, 0);
    },
    onUploadProgress: function (id, percent) {
      setReportingDockUploadProgress(id, percent);
    },
    onUploadSuccess: function (id, data) {
      $("#dlg-spinner-wrapper").remove()
      if (data.success) {
        kioskSuccessToast(data.message,{timeout: 0, onClosed: () => refreshForm() })

      }
      else {
        kioskErrorToast(`The upload failed (${data.message}). Please try again.`,
            {onClosed: () => $("#drop-area-div").show()})
      }
    },
    onUploadError: function (id, xhr, status, errorThrown) {
      // console.log(xhr)
      // console.log(status)
      // console.log(errorThrown)
      $("#dlg-spinner-wrapper").remove()
      if (errorThrown) {
        kioskErrorToast(`The upload failed (${errorThrown}). Please try again.`,
            {onClosed: () => $("#drop-area-div").show()})
      }
      else
        kioskErrorToast(`The upload failed. Please try again.`,
            {onClosed: () => $("#drop-area-div").show()})
    },
    onFallbackMode: function (message) {
      kioskErrorToast('The upload failed because your Browser does not support it: ' + message);
    },
    onFileExtError: function (file) {
      kioskErrorToast('Only files with the extension .fmp12 can be uploaded here. Please select a proper file.')
    },
    onFileSizeError: function (file) {
      kioskErrorToast(`The selected file exceeds the file size limit of ${MAX_INSTALL_FILE_SIZE} MBytes`)
    }

  });
}

function refreshForm() {
  let input = $("<input>")
                 .attr("type", "hidden")
                 .attr("name", "refresh").val("true");
  $('#new-workstation-form').append(input);
  document.getElementById("new-workstation-form").submit();
}

function setReportingDockUploadProgress(id, percent) {
  $("#ws-message-div").html(`${percent} % done`);
}


function kfw_initInstallUpload() {
    console.log("initializing file upload...")
}
