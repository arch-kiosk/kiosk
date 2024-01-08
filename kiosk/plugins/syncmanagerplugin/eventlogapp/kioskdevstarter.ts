import { DevKioskApi } from "./kioskapplib/devkioskapi";
import { KioskApp } from "./kioskapplib/kioskapp";

window.addEventListener("load", () => {
    console.log("let's start...");
    let api = new DevKioskApi();
    registerDevRoutes(api)
    api.initApi()
        .catch((e) => {
            console.log(`Exception when initializing: ${e}`);
        })
        .finally(() => {
            let app: KioskApp = document.querySelector("#kiosk-app");
            if (app !== undefined) {
                app.apiContext = api;
                console.log(app.apiContext);
            } else {
                console.log("there is no app.");
            }
            //Todo: Needs an es6 implementation used for the fetch api
            // $.ajaxSetup({
            //     beforeSend: function (xhr)
            //     {
            //         // @ts-ignore
            //         xhr.setRequestHeader("webapp-user-id",import.meta.env.VITE_DEV_API_USER);
            //         // @ts-ignore
            //         xhr.setRequestHeader("webapp-user-pwd",import.meta.env.VITE_DEV_API_PWD);
            //     }
            // });

        });
});

function registerDevRoutes(api: DevKioskApi) {
    api.registerRoute("kioskfilemakerworkstation.workstation_actions", "kioskfilemakerworkstation/actions")
}