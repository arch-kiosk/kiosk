function startRecordingGroupAction() {
  const selection = $('#recording-group').val()
  const route = $('#select-recording-group-form').attr('route')
  const action = $('#select-recording-group-form').attr('action')
  $.magnificPopup.close()
  kfwExecuteGroupAction(selection, route);
}

function kfwGroupAction(endpoint) {
  const route = getRoutefor(endpoint)
  if (!route) {
    kioskErrorToast(`The command triggered an error: Endpoint ${endpoint} has no route. 
    Please inform an admin or developer about this.`)
    return
  }
  kioskOpenModalDialog(route, {
    closeOnBgClick: false,
    focus: "#recording-group",
    showCloseBtn: false,
    callbacks: {
      open: () => {
        kioskStartWhenAvailable("select-recording-group-form",
          () => {
            $('#recording-group').keydown(function (e) {
              if (e.which === 13) {
                e.preventDefault();
                startRecordingGroupAction();
              }
            });
          },
          () => {
            return;
          })
      },
      ajaxFailed: () => {
        $.magnificPopup.close();
        kioskErrorToast("Sorry, I cannot start the dialog to select a recording group");
      }
    }
  })
}

function kfwExecuteGroupAction(selection, route) {
  kioskSendAjaxCommand("POST", null, route, {
      'recording_group': selection
    },
    (json) => {
      if (json.message) {
        kioskSuccessToast(json.message)
      }
      refreshWorkstationList()
    },
    (err_code, json) => {
      let message = ""
      if ("message" in json)
        message = json.message
      else
        message = "Some error occurred but the server did not provide any details."
      kioskErrorToast(message);
      refreshWorkstationList();
    })
}

// function kfwImportAll(endpoint) {
//   const route = getRoutefor(endpoint)
//   if (!route) {
//     kioskErrorToast(`The command triggered an error: Endpoint ${endpoint} has no route.
//     Please inform an admin or developer about this.`)
//     return
//   }
//
//   kioskOpenModalDialog(route, {
//     closeOnBgClick: false,
//     focus: "#recording-group",
//     showCloseBtn: false,
//     callbacks: {
//       open: () => {
//         kioskStartWhenAvailable("select-recording-group-form",
//           () => {
//             $('#recording-group').keydown(function (e) {
//               if (e.which === 13) {
//                 e.preventDefault();
//                 startRecordingGroupAction();
//               }
//             });
//           },
//           () =>{
//             return;
//           })
//       },
//       ajaxFailed: () => {
//         $.magnificPopup.close();
//         kioskErrorToast("Sorry, I cannot start the dialog to select a recording group");
//       }
//     }
//   })
//
// }

// function kfwExecuteImportAll(selection, route) {
//   kioskSendAjaxCommand("POST", null, route, {
//       'recording_group': selection
//     },
//     (json) => {
//       if (json.message) {
//         kioskSuccessToast(json.message)
//       }
//       refreshWorkstationList()
//     },
//     (err_code, json) => {
//       let message = ""
//       if ("message" in json)
//         message = json.message
//       else
//         message = "Some error occurred but the server did not provide any details."
//       kioskErrorToast(message);
//       refreshWorkstationList();
//     })
// }
//
// function kfwResetAll(endpoint) {
//   kioskSendAjaxCommand("POST", null, route, {},
//     (json) => {
//       if (json.message) {
//         kioskSuccessToast(json.message)
//       }
//       refreshWorkstationList()
//     },
//     (err_code, json) => {
//       let message = ""
//       if ("message" in json)
//         message = json.message
//       else
//         message = "Some error occurred but the server did not provide any details."
//       kioskErrorToast(message);
//       refreshWorkstationList();
//     })
// }

function refreshWorkstationList() {
  const el = document.getElementsByTagName("syncmanager-app")[0].shadowRoot.getElementById("workstation-list")
  el.shadowRoot.dispatchEvent(new CustomEvent("fetch-workstations", {
    bubbles: true,
    cancelable: false,
  }))
}

function kfwInstallUpdate(endpoint) {
  const route = getRoutefor(endpoint)
  kioskOpenModalDialog(route, {
    closeOnBgClick: false,
    // focus: "#backup-dir",
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

