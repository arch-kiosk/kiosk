/* basicmodaldialog.js

    kiosk library with functions that help build modal dialogs.

    needs kiosktoasts.js

 */

let modaldialog_state_data = {};

function setTextAreaHeight(jq_in){
    jq_in.each(function(index, elem){
        elem.style.height = elem.scrollHeight+'px';
    });
}

function setModalDialogTitle(title) {
  let el = document.getElementById("kiosk-modal-dialog-title");
  el.textContent = title;
}

function kioskOpenModalDialog(href, paramAjaxOptions) {

  let ajaxBasics = {
    closeOnContentClick: false,
    closeOnBgClick: true,
    type: 'ajax',
    showCloseBtn: true,
    items: {
      src: href
    },
    //  focus: "create-workstation-id",
    removalDelay: 200,
    mainClass: "mfp-with-anim",
  };

  ajaxOptions = Object.assign(ajaxBasics, paramAjaxOptions,);

  console.log(ajaxOptions);
  if (("callbacks" in ajaxOptions)
    && (!("ajaxContentAdded" in ajaxOptions.callbacks))
    && (!("updateStatus" in ajaxOptions.callbacks))) {

    if ("ajaxSuccess" in ajaxOptions.callbacks) {
      ajaxOptions.callbacks.ajaxContentAdded = () => {
        ajaxOptions.callbacks.ajaxSuccess();
      };
    }
    if ("ajaxFailed" in ajaxOptions.callbacks) {
      ajaxOptions.callbacks.updateStatus = (data) => {
        if (data.status === "error") {
          ajaxOptions.callbacks.ajaxFailed();
        }
      };
    }
  }
  console.log(ajaxOptions);
  $.magnificPopup.open(ajaxOptions);
}

function inject_button_loader(jquery_object, color="#fff") {
  if (jquery_object) {
    let h = jquery_object.height();
    let w = jquery_object.width();
    let dimensions = `width:${w}px; height:${h}px`;
    jquery_object.hide();
    let obj_id = jquery_object.attr("id");
    // if (!obj_id)
    //   obj_id = jquery_object.attr("id");

    let spinner_id = "spinner_" + obj_id;
    let new_html = `<div id="${spinner_id}" class="btn-spinner-div" style="${dimensions}"><div></div></div>`;
    jquery_object.before(new_html);
    jquery_object.appendTo("#" + spinner_id);
    let jq_spinner_div = $(`#${spinner_id}`);
    let install_div = $(jq_spinner_div[0].firstChild);

    inject_loader_div(install_div, color, w, h);
  }
}

function remove_button_loader(jquery_object) {
  if (jquery_object) {
    let obj_id = jquery_object.attr("id");
    if (!obj_id)
      obj_id = jquery_object.attr("id");

    let spinner_id = "spinner_" + obj_id;
    jquery_object.insertBefore("#" + spinner_id);
    $("#" + spinner_id).remove();
    $("#" + obj_id).show();
  }
}

function remove_loader_div(jquery_object) {
  jquery_object.find("div .loader_div").remove();
}

function inject_loader_div(jquery_object, color="#fff", width=44, height=44) {

  // before: jquery_object.html("<div class=\".loader_div\" style=\"height: 64px; display: flex; " +
  circle_x = Math.floor(width / 2)
  circle_y = Math.floor(height / 2)
  jquery_object.html("<div class=\"loader-div\" style=\"display: flex; " +
    "justify-content: center;align-items: center\">" +
    `<svg width=\"${width}\" height=\"${height}\" ` +   //viewBox="0 0 44 44"
    `xmlns=\"http://www.w3.org/2000/svg\" stroke=\"${color}\">\n` +
    "    <g fill=\"none\" fill-rule=\"evenodd\" stroke-width=\"2\">\n" +
    `        <circle cx=\"${circle_x}\" cy=\"${circle_y}\" r=\"1\">\n` +
    "            <animate attributeName=\"r\"\n" +
    "                begin=\"0s\" dur=\"1.8s\"\n" +
    "                values=\"1; 20\"\n" +
    "                calcMode=\"spline\"\n" +
    "                keyTimes=\"0; 1\"\n" +
    "                keySplines=\"0.165, 0.84, 0.44, 1\"\n" +
    "                repeatCount=\"indefinite\" />\n" +
    "            <animate attributeName=\"stroke-opacity\"\n" +
    "                begin=\"0s\" dur=\"1.8s\"\n" +
    "                values=\"1; 0\"\n" +
    "                calcMode=\"spline\"\n" +
    "                keyTimes=\"0; 1\"\n" +
    "                keySplines=\"0.3, 0.61, 0.355, 1\"\n" +
    "                repeatCount=\"indefinite\" />\n" +
    "        </circle>\n" +
    `        <circle cx=\"${circle_x}\" cy=\"${circle_y}\" r=\"1\">\n` +
    "            <animate attributeName=\"r\"\n" +
    "                begin=\"-0.9s\" dur=\"1.8s\"\n" +
    "                values=\"1; 20\"\n" +
    "                calcMode=\"spline\"\n" +
    "                keyTimes=\"0; 1\"\n" +
    "                keySplines=\"0.165, 0.84, 0.44, 1\"\n" +
    "                repeatCount=\"indefinite\" />\n" +
    "            <animate attributeName=\"stroke-opacity\"\n" +
    "                begin=\"-0.9s\" dur=\"1.8s\"\n" +
    "                values=\"1; 0\"\n" +
    "                calcMode=\"spline\"\n" +
    "                keyTimes=\"0; 1\"\n" +
    "                keySplines=\"0.3, 0.61, 0.355, 1\"\n" +
    "                repeatCount=\"indefinite\" />\n" +
    "        </circle>\n" +
    "    </g>\n" +
    "</svg></div>");
}

function kioskToggleCollapsible(jqCollapsibleButton) {
  let coll = jqCollapsibleButton.parent().parent();
  if (coll && !coll.hasClass("kiosk-collapsible") && !coll.hasClass("kiosk-collapsible-v2")) {
    coll = coll.parent();
  }

  let child = coll.find(".kiosk-collapsible-clicker");

  if (!child.hasClass("kiosk-collapsible-clicker-collapsed")) {
    coll.trigger("collapse", [coll]);
  }
  else {
    coll.trigger("expand", [coll]);
  }

  child.toggleClass("kiosk-collapsible-clicker-collapsed");
  child = coll.find(".kiosk-collapsible-content");
  child.toggle("fast");
}

function initCollapsibles() {
  $(".kiosk-collapsible-clicker").off("click");
  $(".kiosk-collapsible-clicker").click((e) => {
    kioskToggleCollapsible($(e.currentTarget));
  });
}

function openOnlyCollapsible(parent_selector) {
  let only_button = undefined
  $(parent_selector + " .kiosk-collapsible-clicker").each((idx, el) => {
    if (only_button) {
      only_button = undefined
      return false
    }
    only_button = $(el)
  })
  if (only_button) kioskToggleCollapsible(only_button)
}

function openCollapsibleOnError(jqCollapsibleButton) {
  let coll = jqCollapsibleButton.parent().parent();
  if (kioskElementHasErrors(coll)) {
    kioskToggleCollapsible(jqCollapsibleButton);
  }
}

function openErroneousCollapsibles(jq_parent_element) {
  let elements = jq_parent_element.find(".kiosk-collapsible-clicker");
  elements.each((index, e) => {
    openCollapsibleOnError($(e));
  });
}

function kioskShowFooter(showit) {
  if (showit) {
    console.log("kioskShowFooter")
    $(".kiosk-modal-dialog-footer").show()
    console.log($(".kiosk-modal-dialog-footer").css("display"))
  } else {
    $(".kiosk-modal-dialog-footer").hide();
  }
}

function kioskShowButton(button, showit) {
  if (showit) {
    button.show();
  } else {
    button.hide();
  }
}

function kioskGetAjaxElement(jq_target, url, install_button_spinner, install_div_spinner, fn_done, delete_toasts=true) {
  //used only in fileimport
  if (!(jq_target) | !(url) | !(jq_target.attr("id"))) {
    if (fn_done) fn_done("invalid call to kioskGetAjaxElement", "error", null);

  } else {
    let target_id = jq_target.attr("id");
    if (install_button_spinner) {
      inject_button_loader(install_button_spinner);
    }
    if (install_div_spinner) {
      inject_loader_div(install_div_spinner);
    }

    if (delete_toasts) {
      kioskDeleteAllToasts();
    }

    $.ajax({
      type: "GET",
      url: url
    })
      .done((html) => {
        if (install_button_spinner)
          remove_button_loader(install_button_spinner);
        if (install_div_spinner) {
          remove_loader_div(install_div_spinner);
        }

        jq_target.html(html);
        jq_target = $("#" + target_id);
        if (fn_done)
          fn_done("", "success", null);

      })
      .fail((xhr, status, errorThrown) => {
        if (install_button_spinner)
          remove_button_loader(install_button_spinner);
        if (fn_done)
          fn_done(errorThrown, "error", xhr);
      });
  }
}

function kioskSendJsonData(jqBt, url, jsonData, onSuccess, onFailure) {
  //used only in editbugdialog.deleteBug
  inject_button_loader(jqBt);
  kioskDeleteAllToasts();
  $.ajax({
    type: "POST",
    dataType: "json",
    data: jsonData,
    contentType: "application/json",
    url: url,
  })
    .done((json_response) => {
      remove_button_loader(jqBt);
      console.log(json_response);
      if (json_response == "ok") {
        if (onSuccess) onSuccess();
      } else {
        if (onFailure) onFailure(json_response);
      }

    })
    .fail((xhr, status, errorThrown) => {
      remove_button_loader(jqBt);
      if (onFailure) onFailure(errorThrown);
    });

}

function kioskRetrieveAjaxPartial(jqBt, url, jsonData, jqTarget, onSuccess, onFailure) {
  //used only in dailyreview:
  // in dailyreview.html.changeDate and unitbuttons.html.onUnitClicked
  inject_button_loader(jqBt);
  kioskDeleteAllToasts();
  $.ajax({
    type: "POST",
    dataType: "html",
    data: JSON.stringify(jsonData),
    contentType: "application/json",
    url: url,
  })
    .done((html) => {
      remove_button_loader(jqBt);
      let jqHtml = $(html);
      if (jqHtml.attr("id") == jqTarget.attr("id")) {
        jqTarget.replaceWith(jqHtml);
      } else {
        if (onFailure) onFailure(null, null, html);
      }

    })
    .fail((xhr, status, errorThrown) => {
      remove_button_loader(jqBt);
      if (onFailure) onFailure(errorThrown);
    });

}

/**
 * Calls a command via ajax and just expects a json return.
 *
 * @param type: POST/GET
 * @param jqBt: null or a jquery reference to the button that will be replaced by a spinner
 * @param url: the url for the json call
 * @param jsonData: the jsonData to submit
 * @param onSuccess: the callback that will be called on success (and given the parameter json)
 * @param onFailure: the callback that will be called on error (gets the parameters errorThrown and json which both can be null)
 */
function kioskSendAjaxCommand(type, jqBt, url, jsonData, onSuccess, onFailure) {
  if (jqBt) inject_button_loader(jqBt, "#dddddd");
  kioskDeleteAllToasts();
  $.ajax({
    type: type,
    dataType: "json",
    data: JSON.stringify(jsonData),
    contentType: "application/json",
    url: url,
  })
    .done((json) => {
      if (jqBt) remove_button_loader(jqBt);
      if (json && ((json.result && json.result === "ok") || json.success)) {
        if (onSuccess) onSuccess(json);
      } else {
        if (onFailure) onFailure(null,  json);
      }

    })
    .fail((xhr, status, errorThrown) => {
      if (jqBt) remove_button_loader(jqBt);
      if (onFailure) onFailure(errorThrown, {});
    });

}

function kioskElementHasErrors(jq_element=null) {
  if (!jq_element) {
    return (
          ($(".kiosk-error").length > 0) |
          ($(".kiosk-general-form-error").length > 0)
    )
  }

  return (
          (jq_element.find("[class*='kiosk-error']").length > 0) |
          (jq_element.find("[class*='kiosk-general-form-error']").length > 0))
}

function kioskToastGeneralErrors(jq_element) {
  try {
    jq_element.find(".kiosk-general-form-error").each((i, e) => {
      kioskModalErrorToast($(e).text())
    });
  } catch { }
}

function kioskModalErrorToast(err_message, options = {}, target="#kiosk-modal-dialog-toasts") {

  let toast_options = Object.assign(options,
    {
      target: target,
      close: true,
      position: "top right",
      timeout: false,
      closeOnClick: true,
      message: err_message

    });

  iziToast.error(toast_options);

}

function kioskYesNoToast(err_message, onYes, onNo, options = {}, target ="") {

  let toast_options = Object.assign(options,
    {
      target: target,
      close: false,
      timeout: false,
      position: "center",
      closeOnClick: false,
      closeOnEscape: true,
      message: err_message,
      displayMode: 'replace',
      icon: "fas fa-question-circle",
      animateInside: false,
      maxWidth: '400px',
      backgroundColor: 'var(--col-bg-att)',
      transitionIn: '',
      transitionOut: '',
      buttons: [
        ['<button style="width: 8em; vertical-align: top">Yes</button>',
          (instance, toast) => {
            instance.hide({transitionOut: 'fadeOut'}, toast, 'button');
            if (onYes) onYes();
          }, false], // true to focus
        ['<button style="width: 8em; vertical-align: top">No!</button>',
          (instance, toast) => {
            instance.hide({transitionOut: 'fadeOut'}, toast, 'button');
            if (onNo) onNo();
          }, false]
      ],
    });

  iziToast.question(toast_options);

}

function kioskDisableButton(jqButton, disable) {
  jqButton.prop("disabled", disable);
}

function kioskActivateButton(jqButton, eventHandler) {
  let bt = jqButton;
  bt.off("click");

  if (eventHandler) {
    kioskShowButton(bt, true);
    bt.click(() => {
      eventHandler();
    });
  } else {
    kioskShowButton(bt, false);
  }
}

function modalDialogInitialized(jqForm) {
  let jqInit = jqForm.find("#page_initialized").first();
  if (jqInit) {
    if (jqInit.val() != "1") {
      jqInit.val("1");
      return false;
    } else {
      return true;
    }
  }

  return false;
}

/**
 *
 * @param idScope: tag within which the return key will be captured and linked to the buttons
 * @param idOkButton: id of the ok button
 * @param idCancelButton id of the cancel button
 */
function bindReturnKeyToButtons(idScope, idOkButton, idOtherButtons) {
  if (typeof(idOtherButtons) === "string") {
    idOtherButtons = [idOtherButtons]
  }
  console.log(idOtherButtons);
  $("#" + idScope).bind('keypress', function (e) {
    if (e.keyCode === 13 && !idOtherButtons.includes(e.target.id)) {
      console.log("Pressed Return at " + e.target.id);
      e.preventDefault();
      btOk = $("#" + idOkButton);
      if (!btOk.is(":disabled") && controlIsVisible(btOk))
        btOk.click();
      else
        console.log("Pressed return but " + idOkButton + " is disabled or hidden");
    }
  });
}

function controlIsVisible(jqControl) {
  return (jqControl.is(":visible") && !(jqControl.is(":hidden")));
}

function kioskInitAwesompleteComboBox(elementId, dataListId, buttonId="", awesomepleteWidth="",
                                      filter=true) {
  if (buttonId === "") buttonId = elementId + "-dropdown"
  let input = document.getElementById(elementId);
  let options = {list: dataListId, minChars: 0}

  if (!filter) options.filter = () => true;

  let combobox = new Awesomplete(input, options)

  combobox.tabSelect = true
  if (awesomepleteWidth) $(".awesomplete").css("width", awesomepleteWidth);
  $('#'+buttonId).click(function() {
    if (combobox.ul.childNodes.length === 0) {
      combobox.evaluate();
    }
    else if (combobox.ul.hasAttribute('hidden')) {
      combobox.open();
    }
    else {
      combobox.close();
    }
  });
}





//# sourceURL=basicmodaldialog.js