// This exists only because webpack totally sucks. After hours of looking for a solution I gave up.
// I cannot make webpack import global types from a .d.ts file. It always results in "can't resolve ... "
// And by god I am not the only one: https://stackoverflow.com/questions/62483612/typescript-module-not-found-cant-resolve
// There are so many different discussions from so many angles. Webpack is a heap of crap.
//
// This is the solution:
// Every single global kiosk function needs to be declared here, then wrapped in a _-wrapper and that
// wrapper is exported under the name of the original javascript function name. The latter is necessary because
// exporting a declaration doesn't work either (and I assume again because of webpack). It always exports some
// strange empty object.
// Then the kiosk function can just be imported in a module under its real name.

declare function kioskErrorToast(err_message: string, options?: {}): any

declare function kioskSuccessToast(message: string, options?: {}): any

declare function deleteAllToasts(): any

declare function kioskOpenModalDialog(href: string, paramAjaxOptions: {}): void

declare function kioskStartWhenReady(func: any, fail_func: any, wait_cycles: number, _first_call: boolean): void

declare function kioskYesNoToast(err_message: string, onYes: CallableFunction, onNo: CallableFunction, options?: {}, target?: string): void


function _KioskErrorToast(err_message: string, options?: {}) {
    kioskErrorToast(err_message, options)
}

function _KioskSuccessToast(message: string, options?: {}) {
    kioskErrorToast(message, options)
}

function _kioskYesNoToast(err_message: string, onYes: CallableFunction, onNo: CallableFunction, options: {} = {}, target: string = ""): void {
    kioskYesNoToast(err_message, onYes, onNo, options, target)
}

function _deleteAllToasts(): any {
    deleteAllToasts()
}

function _kioskOpenModalDialog(href: string, paramAjaxOptions: {}): void {
    kioskOpenModalDialog(href, paramAjaxOptions)
}

function _kioskStartWhenReady(func: any, fail_func: any, wait_cycles: number = 5, _first_call: boolean = true) {
    kioskStartWhenReady(func, fail_func, wait_cycles, _first_call)
}

export {_KioskErrorToast as kioskErrorToast}
export {_KioskSuccessToast as kioskSuccessToast}
export {_kioskYesNoToast as kioskYesNoToast}
export {_deleteAllToasts as deleteAllToasts}
export {_kioskOpenModalDialog as kioskOpenModalDialog}
export {_kioskStartWhenReady as kioskStartWhenReady}
