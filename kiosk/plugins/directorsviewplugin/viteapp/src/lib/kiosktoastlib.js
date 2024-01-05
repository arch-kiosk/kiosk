/* kiosktoastlib.js

   library with functions for displaying toasts in a kiosk application.
   Uses the functions exported by either kiosktoast.js or devKioskToast.js globally.

   Last updated LK 30.X.2018

 */

export function errorToast(err_message, options = {}) {
    return kioskErrorToast(err_message, options);
}

export function successToast(message, options = {}) {
    return kioskSuccessToast(message, options);
}

export function deleteAllToasts() {
    kioskDeleteAllToasts();
}