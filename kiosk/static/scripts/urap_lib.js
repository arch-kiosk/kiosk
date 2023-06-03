var routes={};

function burb() {
  alert("burb");
}

function getHTML(url, function_call) {
  //used only in workstation_list.js.reload_workstation
  $.ajax({
  method: 'GET',
  url: url,
  dataType: "html"
})
  .done(function(html) {
          function_call(html);
        })
  .fail(function() {
          function_call("Error loading " + url);
        });
};

/**
 * Installs a spinner by REPLACING the jq_element_to_replace_with!
 * @param {*} arg
 * @param {string} default_str
 */
function installSpinner(jq_element_to_replace_with, initial_msg, showMsgDiv=true) {
  if (showMsgDiv) {
    jq_element_to_replace_with.replaceWith('\
        <div id="dlg-spinner-wrapper" class="dlg-spinner-wrapper" \
          style="position: relative; overflow: hidden; padding: 1em 0em 1em 0em; width: 100%">\
          <div id="dlg-spinner" class="cssload-loader" \
            style="float: left; left: 0px; background-color: black; transition: all 300ms ease-in;"> \
            <div class="cssload-inner cssload-one"></div>	\
            <div class="cssload-inner cssload-two"></div>	\
            <div class="cssload-inner cssload-three"></div>\
            </div> \
            <div id="ws-message-div" style="position: absolute; top: 50%; left: 75px; \
            transform: translateY(-50%); font-size: 1em; width: 80%;">\
              <p>' + initial_msg + '</p>\
            </div>\
        </div>');
  } else {
    jq_element_to_replace_with.replaceWith('\
        <div id="dlg-spinner-wrapper" class="dlg-spinner-wrapper" \
          style="position: relative; overflow: hidden; padding: 1em 0em 1em 0em; width: 85px">\
          <div id="dlg-spinner" class="cssload-loader" \
            style="float: left; left: 0px; background-color: black; transition: all 300ms ease-in;"> \
            <div class="cssload-inner cssload-one"></div>	\
            <div class="cssload-inner cssload-two"></div>	\
            <div class="cssload-inner cssload-three"></div>\
            </div> \
        </div>');
  }

}

function installSpinnerEx(jq_element_to_replace_with, initial_msg) {
  jq_element_to_replace_with.replaceWith('\
      <div id="dlg-spinner-wrapper" class="dlg-spinner">\
        <div id="dlg-spinner" class="cssload-loader dlg-cssload-loader"> \
          <div class="cssload-inner cssload-one"></div>	\
          <div class="cssload-inner cssload-two"></div>	\
          <div class="cssload-inner cssload-three"></div>\
        </div> \
        <div id="ws-message-div" class="dlg-spinner-msgdiv">\
          <span>' + initial_msg + '</span>\
        </div>\
      </div>');

}

/**
 * Installs a spinner but keeps the jq_element_to_hide!
 * @param {*} arg
 * @param {string} default_str
 */
function addSpinner(jq_element_to_hide, initial_msg, showMsgDiv=true) {
  if (showMsgDiv) {
    jq_element_to_hide.hide()
    jq_element_to_hide.before('\
        <div id="dlg-spinner-wrapper" class="dlg-spinner-wrapper" \
          style="position: relative; overflow: hidden; padding: 1em 0em 1em 0em; width: 100%">\
          <div id="dlg-spinner" class="cssload-loader" \
            style="float: left; left: 0px; background-color: black; transition: all 300ms ease-in;"> \
            <div class="cssload-inner cssload-one"></div>	\
            <div class="cssload-inner cssload-two"></div>	\
            <div class="cssload-inner cssload-three"></div>\
            </div> \
            <div id="ws-message-div" style="position: absolute; top: 50%; left: 75px; \
            transform: translateY(-50%); font-size: 1em; width: 80%;">\
              <p>' + initial_msg + '</p>\
            </div>\
        </div>');
  } else {
    jq_element_to_hide.hide()
    jq_element_to_hide.before('\
        <div id="dlg-spinner-wrapper" class="dlg-spinner-wrapper" \
          style="position: relative; overflow: hidden; padding: 1em 0em 1em 0em; width: 85px">\
          <div id="dlg-spinner" class="cssload-loader" \
            style="float: left; left: 0px; background-color: black; transition: all 300ms ease-in;"> \
            <div class="cssload-inner cssload-one"></div>	\
            <div class="cssload-inner cssload-two"></div>	\
            <div class="cssload-inner cssload-three"></div>\
            </div> \
        </div>');
  }

}


function removeSpinnerEx(restore_html) {
  $("#dlg-spinner-wrapper").replaceWith(restore_html);
}


function stop_spinner() {
  let jqDlgSpinner = $("#dlg-spinner");
  if (jqDlgSpinner.length) {
    $(jqDlgSpinner).hide();
    let jqWsMessageDiv = $("#ws-message-div");
    if (jqWsMessageDiv.length) {
      jqWsMessageDiv.css("position", "static");
      jqWsMessageDiv.css("margin-top", "2em");
      jqWsMessageDiv.css("width", "100%");
      jqWsMessageDiv.css("left", "5px");
    }
  }
}

function setFieldAsFirst(jquery_field) {
  // keeps a field from moving the focus on shift+tab key
  jquery_field.keydown(function(event) {
      if (event.which == 9 && event.shiftKey) {  //tab pressed
          console.log("Suppressed going back")
          event.preventDefault(); // stops its action
      }
  });
}

function setFieldAsLast(jquery_field) {
  // keeps a field from moving the focus on tab-key
  jquery_field.keydown(function(event) {
      if (event.which == 9 && !event.shiftKey) {  //tab pressed
          console.log("Suppressed going forward")
          event.preventDefault(); // stops its action
      }
  });
}

function clearFieldErrors() {
  $(".dialog-field-error").remove();
}

function errorOnField(fieldid, errmsg, errclass="dialog-field-error") {
  ctl = $("#"+fieldid);
  if (ctl.exists()) {
    nxt = ctl.next();
    if (nxt.exists()) {
      if (nxt.is("."+errclass)) {
        nxt.remove();
      }
    }
    ctl.after('<div class="' + errclass + '">' + errmsg + '</div>');
  }
}

function okMsgOnDialog(msg, msgclass="dialog-field-ok-msg") {
  ctl = $("#dialog-alert");
  if (ctl.exists()) {
    nxt = ctl.next();
    if (nxt.exists()) {
      if (nxt.is("."+msgclass)) {
        nxt.remove();
      }
    }
    ctl.after('<div class="'+msgclass+'">' + msg + '</div>');
    $("." + msgclass).show("fast");
  }
}

function errorOnDialog(errmsg, errclass="dialog-field-error") {
  ctl = $("#dialog-alert");
  if (ctl.exists()) {
    nxt = ctl.next();
    if (nxt.exists()) {
      if (nxt.is("."+errclass)) {
        nxt.remove();
      }
    }
    ctl.after('<div class="'+errclass+'">' + errmsg + '</div>');
  }
}

function dialog_ok(msg, hide="") {
  clearFieldErrors();
  okMsgOnDialog(msg);
  if (hide) {
    $(hide).hide("fast");
  }
}

function disable_input_fields(scope, disable=true) {
  $(scope + " input").attr("disabled", disable);
}

function clearRoutes() {
  routes = {};
};

function addRoute(endpoint, url) {
  console.log("adding " + endpoint + ": " + url);
  routes[endpoint] = url;
};

function getRoutefor(endpoint) {
  console.log("getting route " + endpoint + ": " + routes[endpoint]);
  return(routes[endpoint]);
};

function kioskStartWhenReady(func, fail_func = null, wait_cycles = 10, _first_call=true) {
  if (_first_call) {
    window.cKioskStartWhenReady = 0;
  }

  console.log("kioskStartWhenReady");
  if (typeof kioskScriptsLoaded == 'undefined') {
      if (window.cKioskStartWhenReady < wait_cycles) {
        window.cKioskStartWhenReady++;
        setTimeout(() => {
          kioskStartWhenReady(func, fail_func, wait_cycles, false);
        }, 500);
      } else {
        if (fail_func) {
          fail_func();
        } else {
          try {
            kioskErrorToast("kioskStartWhenReady could not start an operation even after trying again.");
          } catch {
            alert("kioskStartWhenReady could not start an operation even after trying again.");
          }
        }
      }
  } else {
    func();
  }
}

function kioskStartWhenAvailable(js_element, func, fail_func = null, wait_cycles = 5, _first_call=true) {
  if (_first_call)
    kioskStartWhenAvailable.ckioskStartWhenAvailable = 0;

  console.log("kioskStartWhenAvailable");
  if (!document.getElementById(js_element)) {
      if (kioskStartWhenAvailable.ckioskStartWhenAvailable < wait_cycles) {
        kioskStartWhenAvailable.ckioskStartWhenAvailable++;
        setTimeout(() => {
          kioskStartWhenAvailable(js_element, func, fail_func, wait_cycles, false);
        }, 500);
      } else {
        if (fail_func) {
          fail_func();
        } else {
          try {
            kioskErrorToast("kioskStartWhenAvailable could not start an operation even after trying again.");
          } catch {
            alert("kioskStartWhenAvailable could not start an operation even after trying again.");
          }
        }
      }
  } else {
    func();
  }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function elementExists(element) {
  return !!$(element).length;
}

/**
 * returns a default string if arg is undefined. Otherwise arg
 * @param {*} arg
 * @param {string} default_str
 */
function undefstr(arg, default_str = "") {
  try {
    return arg == undefined ? default_str : String(arg);
  } catch {
    return default_str;
  }
}

/**
 * returns a default value if arg is undefined, otherwise arg as a Number.
 * @param {*} arg
 * @param {number} default_value
 */
function undefint(arg, default_value = 0) {
  try {
    return arg == undefined ? default_value : Number(arg);
  }
  catch {
    return default_value;
  }
}

// Cookies
//as found in https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function join_route(route, subroute) {
  return (route + "/" + subroute).replace("//", "/")
}

function kioskActivateFileManager(url, back_url='', back_name='') {
  setCookie("kiosk_fm_back_url", back_url)
  setCookie("kiosk_fm_back_name", back_name)
  if (url) window.location.replace(url);
}
