import {ProdKioskApi} from "./prodkioskapi.js";

window.connectPopupToApi = function connectPopupToApi(tagid) {
    setTimeout(() => {
        // check if the main kiosk scripts are present
        if (window.getRoutefor !== undefined) {
            console.log("kioskprodstarter: about to be initializing...")
            let api = new ProdKioskApi();
            api.initApi()
                .catch((e) => {
                    console.log(`Exception when initializing in Kiosk Production starter: `, e);
                })
                .finally(() => {
                    let app = document.querySelector(tagid);
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
