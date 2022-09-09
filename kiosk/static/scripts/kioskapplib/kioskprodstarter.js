import {ProdKioskApi} from "./prodkioskapi.js";

window.addEventListener("load", () => {
    connectToApi()
});

function connectToApi() {
    setTimeout(() => {
        // check if the main kiosk scripts are present
        if (window.getRoutefor !== undefined) {
            let api = new ProdKioskApi();
            api.initApi()
                .catch((e) => {
                    console.log(`Exception when intializing: ${e}`);
                })
                .finally(() => {
                    let app = document.querySelector("#kiosk-app");
                    if (app !== undefined) {
                        app.apiContext = api;
                        console.log(app.apiContext);
                    } else {
                        console.log("there is no app.");
                    }
                });
        } else {
            connectToApi()
        }
    }, 200)
}
