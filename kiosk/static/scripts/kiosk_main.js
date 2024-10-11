// job status constants must match the same constants of MCPJobStatus class
// todo: what are they doing here? Can't they be in kioskjob.js?
const JOB_STATUS_GHOST = 0;
const JOB_STATUS_REGISTERED = 1;
const JOB_STATUS_SUSPENDED = 5;
const JOB_STATUS_STARTED = 8;
const JOB_STATUS_RUNNING = 10;
const JOB_STATUS_CANCELLING = 15;
const JOB_STATUS_DONE = 20;
const JOB_STATUS_CANCELED = 21;
const JOB_STATUS_ABORTED = 22;

$(() => {
  $.fn.exists = function () {
    return this.length !== 0;
  };
  import_scripts();
  install_handlers();
  fetchSystemMessages(2);
});

function import_scripts() {
  $.getScript('/static/scripts/thirdparty/jquery.fileDownload.js');
  $.getScript('/static/scripts/thirdparty/dmuploader.js');
  $.getScript('/static/scripts/thirdparty/jquery.magnific-popup.js');
  $.getScript('/static/scripts/thirdparty/izi-toast/iziToast.js');
  $.getScript('/static/scripts/kiosktoasts.js');
  $.getScript('/static/scripts/kioskajax.js');
  $.getScript('/static/scripts/kioskjob.js');
  $.getScript('/static/scripts/kioskjobmanagement.js');
  $.getScript('/static/scripts/basicmodaldialog.js');
  $.getScript('/static/scripts/menu.js');
  $.getScript('/static/scripts/user.js');
  $.getScript('/static/scripts/kioskapiutils.js');
  //$.getScript('/static/scripts/urap_lib.js');
  $.getScript('/static/scripts/thirdparty/awesomplete.min.js');
  $.getScript('/static/scripts/thirdparty/exif.js');
  $.getScript('/static/scripts/kiosklastscript.js');
}

function install_handlers() {
  installSystemMessageHandlers()
}

function installSystemMessageHandlers() {
  $(".system-message-close").on("click", closeSystemMessage)
}

function closeSystemMessage(e) {
  let message_uid = e.target.id;
  deleteSystemMessage(message_uid, {
    onSuccess: (msg, textStatus, jqXHR) => {
      console.log(msg)
      $(`#system-messages`).attr("change_mark", msg.change_mark)
      $(`#${message_uid}`).hide("fast");
    },
    onError: (html_error, msg, jqXHR) => {
      if (jqXHR.status === 403) {
        $(`#${message_uid}`).hide("fast");
      } else {
        kioskErrorToast(html_error);
      }
    }
  })
}

function deleteSystemMessage(uid, options) {
  kioskAjax("/delete_system_message", {"uid": uid}, "POST", options);
}

function fetchSystemMessages(seconds_till_fetch = 20, retries=0) {
const MAX_MESSAGE_POLL_RETRIES = 10

  function _fetchSystemMessages() {
    console.log("fetching system messages ...")
    try {
      if (typeof kioskAjaxGetPartial == 'undefined' || typeof kioskErrorToast == 'undefined') {
        if (retries < MAX_MESSAGE_POLL_RETRIES) {
          fetchSystemMessages(seconds_till_fetch, retries + 1)
          return
        }
        else
          throw "kiosk not ready"
      }
    } catch(e)
    {
      alert("`System messages and errors cannot be fetched from the server. " +
        " The Kiosk Server did not get ready in time. Please try again by refreshing your page.")
      return
    }
    try {
      let currentChangeMark = ""
      let systemMessages = $(`#system-messages`)
      if (systemMessages) {
        try {
          currentChangeMark = systemMessages.attr("change_mark")
        } catch {}

        kioskAjaxGetPartial(
          "/get_system_messages",
          {"change_mark": currentChangeMark},
          'system-messages',
          (target_id, textStatus, jqXHR, statusData) => {
            console.log("fetching system messages ... success")
            fetchSystemMessages();
            installSystemMessageHandlers();
          },
          (err_msg, textStatus, jqXHR, statusData) => {
            if (jqXHR.status === 403 || jqXHR.status === 304) { //unauthorized? Just keep trying
              fetchSystemMessages();
            } else {
                if (retries > MAX_MESSAGE_POLL_RETRIES) {
                  kioskErrorToast(`system messages and errors cannot be fetched from the server. <br/> 
                    The server returned status ${jqXHR.status}: ${err_msg}. Refresh page to restart polling.`);
                  return
                } else {
                  console.log(`Error ${jqXHR.status} in _fetchSystemMessages: trying again.`)
                }
                fetchSystemMessages(seconds_till_fetch,retries+1);
            }
          },
        )
      } else {
        fetchSystemMessages()
      }
    } catch (e) {
      console.log(e);
      if (retries > 0) {
        kioskErrorToast(`system messages and errors cannot be fetched from the server. (${e})<br/>
        Refresh page to restart polling.`);
      } else {
        fetchSystemMessages(seconds_till_fetch,retries+1);
      }
    }
  }

  setTimeout(_fetchSystemMessages, 1000 * seconds_till_fetch)
}

function triggerModule(endpoint = "") {
  window.location.replace(getRoutefor(endpoint));
}
