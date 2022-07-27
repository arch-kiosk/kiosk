
function kfw_InitInstallerUploader() {
  const MAX_INSTALL_FILE_SIZE = 50 // 50 Megabyte

  const route = getRoutefor("kioskfilemakerworkstation.trigger_install")
  console.log(route)

  $('#drop-area-div').dmUploader({
    url: route,
    auto: true,
    queue: false,
    // allowedTypes: "fmp12",
    extFilter: ["fmp12"],
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
      installSpinner($("#drop-area-div"),"hold on ...")
      setkfwInstallUploadProgress(id, 0);
    },
    onUploadProgress: function (id, percent) {
      setkfwInstallUploadProgress(id, percent);
    },
    onUploadSuccess: function (id, data) {
      $.magnificPopup.close()
      if (data.success) {
        kioskSuccessToast(data.message,{timeout: 0})
      }
      else {
        kioskErrorToast(`The upload failed (${data.message}). Please try again.`)
      }
    },
    onUploadError: function (id, xhr, status, errorThrown) {
      console.log(xhr)
      console.log(status)
      console.log(errorThrown)
      $.magnificPopup.close()
      if (errorThrown) {
        kioskErrorToast(`The upload failed (${errorThrown}). Please try again.`)
      }
      else
        kioskErrorToast(`The upload failed. Please try again.`)
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

function setkfwInstallUploadProgress(id, percent) {
  $("#ws-message-div").html(`${percent} % done`);
}


function kfw_initInstallUpload() {
  console.log("initializing file upload...")
  // let ws_id = $("#file-upload").attr("data");
  // $('#drop-area-div').dmUploader({
  //   url: '/kioskfilemakerworkstation/workstation/' + ws_id + "/upload",
  //   dataType: 'json',
  //   extFilter: ['fmp12'],
  //   queue: false,
  //   auto: true,
  //   onInit: function () {
  //   },
  //   onBeforeUpload: function (id) {
  //     $("#dialog-subtitle").text("uploading new field data");
  //     installSpinner($("#workstation-options"), "Initiating upload ...");
  //   },
  //   onUploadProgress: function (id, percent) {
  //     $("#ws-message-div").html("Upload of database at " + percent + " %.");
  //   },
  //   onUploadSuccess: function (id, data) {
  //     workstation_click.reload = true;
  //     stop_spinner();
  //     $("#dialog-subtitle").text("upload of new field data");
  //     if (data.success && data.log.length == 0) {
  //       $("#ws-message-div").html("<i class=\"fas fa-check-circle\"></i> Upload of database completed");
  //     } else {
  //       if (data.success) {
  //         kfw_show_dump(false, data.log, data.message);
  //       } else {
  //         kfw_show_dump(true, data.log, data.message);
  //       }
  //     }
  //   },
  //   onUploadError: function (id, message) {
  //     $("#ws-message-div").html("<i class=\"fas fa-angry\"></i> Really? The upload failed: <span style='color: red'>" + message + "</span>");
  //   },
  //   onFallbackMode: function (message) {
  //     kioskErrorToast('Browser not supported!: ' + message);
  //   },
  //   onFileExtError: function (file) {
  //     kioskErrorToast('Please upload only filemaker files (with the extension .fmp12).');
  //   }
  // }); //end $('#drop-area-div').dmUploader
}
