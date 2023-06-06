function isHTMLResponse(jqXHR ) {
    return ( jqXHR.getResponseHeader('content-type').indexOf('text/html') >= 0 );
}

function isJSONResponse(jqXHR ) {
    return ( jqXHR.getResponseHeader('content-type').indexOf('text/json') >= 0 );
}

/**
 *
 * @param url - The server-api's url
 * @param ajaxData - (json)Data to send to the server
 * @param ajaxMethod - "POST" or "GET or some other HTTP Method. "" leads to "POST"
 * @param options - A dictionary. All of the jquery ajax options are allowed, and some additional options.
 * @param stateData - A dictionary. will be returned in onSuccess and onError. Allows to situate the receiver
 *                    after the async operation.
 *
 *___
 * ### These callbacks can be given in the options dictionary:
 *  onSuccess - a call back function with the signature (msg, textStatus, jqXHR,stateData)
 *  onError - a call back function with the signature (msg, textStatus, jqXHR, stateData)
 *
 * ___
 * ### The parameters of callbacks are like this:
 *         * msg is the original msg as it came back from the server,
 *         * textStatus the original textStatus field jquery.ajax provided and
 *         * jqXHR is the jquery XHR object.
 *         * stateData is simply the stateData that had been given to the initial call to kioskAjax.

 */
function kioskAjax(url, ajaxData, ajaxMethod, options = {}, stateData = {}) {

  if (!ajaxMethod)
    ajaxMethod = "POST";

  if (!options.hasOwnProperty("headers"))
    options.headers = {};

  options.headers["X-kiosk-request"] = "ajax";

  let ajaxOptions = {
    method: ajaxMethod,
    data: ajaxData,
    url: url
  };
  Object.assign(ajaxOptions, options);

  $.ajax(ajaxOptions)
    .done((msg, textStatus, jqXHR) => {
      let html_error = getKioskError(msg, jqXHR);
      if (html_error) {
        if (options.hasOwnProperty("onError")) {
          options.onError(html_error, msg, jqXHR, stateData);
        } else {
          console.log(html_error)
        }
      } else {
        if (options.hasOwnProperty("onSuccess")) {
          options.onSuccess(msg, textStatus, jqXHR, stateData);
        }
      }
    })
    .fail((xhr, status, errorThrown) => {
      let errStr = `An unexpected transmission error (${status}) occurred when fetching from (${url}): ` + errorThrown;
      if (options.hasOwnProperty("onError")) {
        options.onError(errStr, status, xhr, stateData);
      } else {
        console.log(errStr)
      }
    });
}

function getKioskError(msg, jqXHR) {
  let html_error = "";
  let kioskError = jqXHR.getResponseHeader("X-kiosk-error");
  switch (kioskError) {
    case "csrf error":
      html_error = "Your session timed out. Please log in again. (csrf error)";
      break;
    case "maintenance error":
      html_error = "The server is undergoing maintenance, currently. Please try again later.";
  }
  if (html_error) {
    if (msg.hasOwnProperty("html_error"))
      html_error = msg.html_error;
  }

  return html_error;
}

/**
 * loads a html partial from the server via Ajax. The partial can be the whole page as it would be
 * returned to a normal GET request. The function would find the partial in that response and update only
 * the partial without a page reload or any impact on the rest of the page.
 *
 * @param url - the server's url
 * @param ajaxData - this data is transported to the server
 * @param target - Either the HTML-Id of the tag that will be replaced by the response or a jquery object referring to
 *                 the html object that will be replaced. See also sourceId!
 * @param onSuccess - callback in case of success.
 * @param onError - callback in case of an error. But see onJSON!
 * @param stateData - this data will be returned as it is to onSuccess or onError.
 * @param ajaxOptions - a dict with options for the underlying jquery.ajax call.
 *
 * @param onJSON - This will be called if the response is json instead of html. If onJSON is not set,
 *          onError would be called instead.
 * @param sourceId - if given, this is the id that designates which of the tags in the server's response will replace.
 *                  if this is not given, target must be a string that defines both ids, that of source and destination.
 *                  In this case target is not allowed to be a jquery object.
 * @description
 * ___
 * ###callbacks
 * **onSuccess (target, textStatus, jqXHR, stateData)**
 * **onError (err_msg, textStatus, jqXHR, stateData)**
 * **onJSON (json, textStatus, jqXHR)**
 *
 *   * target: simply the target originally given.
 *   * textStatus: the jquery.ajax textStatus
 *   * jqXHR: the resulting jquery.ajax XHR object
 *   * stateData: the state data intially given to the call to kioskAjaxGetPartial
 *   * json: the json object.
 *
 */
function kioskAjaxGetPartial(url, ajaxData, target, onSuccess, onError, stateData = {}, ajaxOptions = {},
                             onJSON = null, sourceId = "") {
  //used in administration.js.startBackup, bugsandfeaturesplugin.editbugdialog.html.saveDialog
  //and all the fileimport templates

  let kioskAjaxOptions = {};
  let targetIsString = typeof target === "string";
  if (!sourceId) {
    if (targetIsString) {
      sourceId = target;
    } else {
      throw "no sourceId given, so target has to be a string, which is not the case";
    }
  }

  Object.assign(kioskAjaxOptions, ajaxOptions);
  Object.assign(kioskAjaxOptions, {
      onSuccess: (data, textStatus, jqXHR) => {

        try {
          if (onJSON) {
            if (data.hasOwnProperty("success")) {
              onJSON(data, textStatus, jqXHR);
              return;
            }
          }
        } catch(e) {
          console.log(e);
        }
        let html = data;
        let dynHtml = $(html);
        let ajaxHtml = null;

        if (dynHtml.attr("id") === sourceId) {
          ajaxHtml = dynHtml
        } else {
          ajaxHtml = dynHtml.find("#" + sourceId);
        }
        if (ajaxHtml && ajaxHtml.length > 0) {
          if (targetIsString) {
            $(`#${target}`).replaceWith(ajaxHtml);
          } else {
            target.replaceWith(ajaxHtml);
          }
          onSuccess(target, textStatus, jqXHR, stateData);

        } else {
          onError("The data returned by the server could not be displayed. That really should not happen.",
            textStatus, jqXHR, stateData, html);
        }
      },
      onError: (errStr, status, xhr, stateData) => {
        onError(errStr, status, xhr, stateData);
      }
    }
  );

  kioskAjax(url, ajaxData, "POST", kioskAjaxOptions, stateData);

}

/**
 * sends a form's data via ajax and replaces that form with the server's response
 *   * clears all toasts first
 *   * injects a spinner where the button is (and restores that button later on)
 *   * the form has to be surrounded by an outer_div. The first form inside of that outer_div is the one that
 *     is going to be sent.
 *   * uses kioskAjaxGetPartial / kioskAjax, so general error handling applies.
 * __
 *
 * @param jq_bt_next - a jquery object that will be temporarily replaced by a spinner
 * @param jq_outer_div - the div around the form. This div will be replaced by the response
 * @param url - the server's url
 * @param on_eval - callback. Will be called after the server response has been processed and spinners are removed.
 * @param on_failure - callback. Will be called after the server response was negative or could not be processed.
 * @param state_data - this data will be transported through the async transaction. To figure out the call's context.
 *
 * @description
 * **callback** on_eval(form, stateData)
 *   * form is the first form in the replaced jq_outer_div.
 *   * stateData is the data that has originally been given to kioskSendAjaxForm
 *
 * @description
 * **callback** on_failure(xhr, status, errStr, stateData)
 *   * xhr is the jqXHR object of the underlying ajax call
 *   * status is the textStatus of the ajax call
 *   * errStr is the errorThrown of the ajax call
 *   * stateData is the data that has originally been given to kioskSendAjaxForm
 */
function kioskSendAjaxForm(jq_bt_next, jq_outer_div, url, on_eval, on_failure, state_data = {}) {

  let outer_div_id = jq_outer_div.attr("id");
  let form = jq_outer_div.find("form").first();

  inject_button_loader(jq_bt_next);
  kioskDeleteAllToasts();
  modaldialog_state_data = state_data;

  kioskAjaxGetPartial(url, form.serialize(), outer_div_id,
    (targetId, textStatus, jqXHR, stateData) => {
      remove_button_loader(jq_bt_next);
      jq_outer_div = $("#" + outer_div_id);
      form = jq_outer_div.find("form").first();
      openErroneousCollapsibles(form);
      if (kioskElementHasErrors(jq_outer_div)) {
        kioskToastGeneralErrors(jq_outer_div);
      }
      on_eval(form, stateData);
    },
    (errStr, status, xhr, stateData) => {
      remove_button_loader(jq_bt_next);
      on_failure(xhr, status, errStr, stateData);

    }, state_data);
}

//# sourceURL=kioskAjax.js