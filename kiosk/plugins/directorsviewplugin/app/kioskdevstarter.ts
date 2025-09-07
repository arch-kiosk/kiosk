import { DevKioskApi } from "@arch-kiosk/kiosktsapplib";
import { KioskApp } from "@arch-kiosk/kiosktsapplib";

window.addEventListener("load", () => {
    console.log("let's start...");
    let api = new DevKioskApi(
        undefined,
        import.meta.env.VITE_DEV_API_URL,
        import.meta.env.VITE_DEV_API_USER,
        import.meta.env.VITE_DEV_API_PWD);
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
        });
});

function registerDevRoutes(api: DevKioskApi) {
    api.registerRoute("kioskfilemakerworkstation.workstation_actions", "kioskfilemakerworkstation/actions")
}