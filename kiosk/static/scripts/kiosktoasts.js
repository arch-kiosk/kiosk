/* kiosktoasts.js
   library with functions for displaying toasts in a kiosk application.

   needs iziToast.js

   Last updated LK 30.X.2018

 */

function kioskErrorToast(err_message, options = {}) {

    let toast_options = Object.assign(
        {
            close: true,
            position: "center",
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            timeout: false,
            closeOnClick: false,
            message: err_message,
            zindex: 99999

        }, options);

    iziToast.error(toast_options);

}

function kioskSuccessToast(message, options = {}) {

    let toast_options = Object.assign(
        {
            close: true,
            position: "center",
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            timeout: 5000,
            closeOnClick: false,
            message: message

        }, options);

    iziToast.success(toast_options);

}


function kioskDeleteAllToasts() {
    iziToast.destroy();
}