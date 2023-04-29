export const API_STATE_UNINITIALZED = 0;
export const API_STATE_INITIALIZING = 1;
export const API_STATE_READY = 2;
export const API_STATE_ERROR = 3;
export class KioskApiError extends Error {
    constructor(message) {
        super(message);
        this.name = "KioskApiError";
    }
}
export class FetchException {
    constructor(msg, response = null) {
        this.msg = msg;
        this.response = response;
    }
}
//abstract
export class KioskApi {
    constructor(apiRoot = "/") {
        this.token = "";
        this.apiRoot = "/";
        this.lastErrorMessage = "";
        this.status = API_STATE_UNINITIALZED;
        if (!apiRoot.startsWith("/"))
            apiRoot = "/" + apiRoot;
        if (!apiRoot.endsWith("/"))
            apiRoot = apiRoot + "/";
        this.apiRoot = apiRoot;
        console.log("The apiRoot is " + this.apiRoot);
    }
    //abstract method
    getKioskRoute(route_name) {
        throw "KioskApi.getKioskRoute is not implemented";
    }
    getApiUrl(apiAddress = "") {
        //abstract method
        throw "KioskApi.getApiUrl is abstract and must not be called";
    }
    getHeaders(mimetype) {
        let headers = new Headers();
        headers.append("Content-Type", mimetype);
        headers.append("Accept", mimetype);
        headers.append("Authorization", `Bearer ${this.token}`);
        return headers;
    }
    async initApi() {
        //abstract method
        throw "KioskApi.initApi is abstract and must not be called";
    }
    async fetchFromApi(apiRoot, apiMethod, fetchParams, apiVersion = "v1", urlSearchParams = "", mimetype = "application/json") {
        if (!this.token) {
            throw new KioskApiError("No api-token when calling fetchFromApi");
        }
        let headers = this.getHeaders(mimetype);
        let address = `${this.getApiUrl()}/${apiRoot ? apiRoot + '/' : ''}${apiVersion}/${apiMethod}`;
        if ("caller" in fetchParams)
            console.log(`${fetchParams.caller} fetching from ${address}`);
        else
            console.log("fetching from " + address);
        let init = { ...fetchParams };
        init["headers"] = headers;
        if (urlSearchParams) {
            address += "?" + urlSearchParams;
        }
        let response;
        try {
            console.log("fetching " + address);
            response = await fetch(address, init);
        }
        catch (err) {
            console.log(`caught ${err} in fetchFromApi after fetch`);
            throw new FetchException(err);
        }
        if (response.ok) {
            return await response.json();
        }
        else {
            console.log(`caught ${response.status} in fetchFromApi`);
            throw new FetchException(response.statusText, response);
        }
    }
}
//# sourceMappingURL=kioskapi.js.map