import {
    KioskApi,
    FetchException,
    API_STATE_ERROR,
    API_STATE_INITIALIZING,
    API_STATE_READY,
    API_STATE_UNINITIALZED,
} from "./kioskapi.js";

export class ProdKioskApi extends KioskApi {
    // token = "";
    // lastErrorMessage = "";

    // status = API_STATE_UNINITIALZED;

    getKioskRoute(route_name) {
        return window.getRoutefor(route_name);

    }

    getApiUrl(apiAddress = "") {
        if (apiAddress) {
            return `${window.getRoutefor("api")}/v1/${apiAddress}`;
        } else {
            return window.getRoutefor("api");
        }
    }

    async initApi() {
        this.status = API_STATE_INITIALIZING;
        let headers = new Headers();
        console.log("meta:", import.meta)
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Origin", this.getApiUrl());

        let address = this.getApiUrl("login");
        console.log("address: " + address)
        let response;
        try {
            response = await fetch(address, {
                headers: headers,
                method: "GET",
            });
        } catch (e) {
            // console.log(`throwing FetchException after caught ${e}`)
            this.status = API_STATE_ERROR;
            this.lastErrorMessage = e.message;
            throw new FetchException(e, null);
        }
        if (response.ok) {
            let data = await response.json();
            this.token = data["token"];
            this.status = API_STATE_READY;
        } else {
            // console.log(`throwing FetchException ${response.statusText}`)
            this.status = API_STATE_ERROR;
            this.lastErrorMessage = response.statusText;
            throw new FetchException(response.statusText, response);
        }
    }
}
