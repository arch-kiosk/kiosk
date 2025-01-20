'use strict';

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
    token = "";
    apiRoot = "/";
    lastErrorMessage = "";

    status = API_STATE_UNINITIALZED;

    constructor(apiRoot = "/") {
        if (!apiRoot.startsWith("/")) apiRoot = "/" + apiRoot;
        if (!apiRoot.endsWith("/")) apiRoot = apiRoot + "/";
        this.apiRoot = apiRoot;
        console.log("The apiRoot is " + this.apiRoot);
    }

    //abstract method
    getKioskRoute(route_name) {
        throw "KioskApi.getKioskRoute is abstract and must not be called";
    }

    getApiUrl(apiAddress = "") {
        //abstract method
        throw "KioskApi.getApiUrl is abstract and must not be called";
    }

    async initApi() {
        //abstract method
        throw "KioskApi.initApi is abstract and must not be called";
    }

    getHeaders(mimetype) {
        let headers = new Headers();
        headers.append("Content-Type", mimetype);
        headers.append("Accept", mimetype);
        headers.append("Authorization", `Bearer ${this.token}`);
        return headers
    }

    async fetchFromApi(
        apiRoot,
        apiMethod,
        fetchParams,
        apiVersion = "v1",
        urlSearchParams = "",
        mimetype = "application/json",
    ) {
        if (!this.token) {
            throw new KioskApiError("No api-token when calling fetchFromApi");
        }
        let headers = this.getHeaders(mimetype)
        let apiURL = this.getApiUrl()
        console.log("apiURL is" + apiURL)

        if (!apiURL.endsWith("/")) {
            apiURL += '/'
        }
        let address = `${apiURL}${apiRoot?apiRoot + '/':''}${apiVersion}/${apiMethod}`;

        if ("caller" in fetchParams)
            console.log(`${fetchParams.caller} fetching from ${address}`);
        else console.log("fetching from " + address);
        let init = { ...fetchParams };
        init["headers"] = headers;
        if (urlSearchParams) {
            address += "?" + new URLSearchParams(urlSearchParams);
        }
        let response;
        try {
            console.log("fetching " + address);
            response = await fetch(address, init);
        } catch (err) {
            console.log(`caught ${err} in fetchFromApi after fetch`);
            throw new FetchException(err);
        }
        if (response.ok) {
            return await response.json();
        } else {
            const json_response = await response.json();
            console.log(`caught ${response.status} in fetchFromApi`, json_response);
            if (json_response && 'result_msg' in json_response) {
                throw new FetchException(json_response.result_msg, response);
            } else {
                throw new FetchException(response.statusText, response);
            }
        }
    }

/**
     * returns the fetch address and the fetch parameters to be used with fetch.
     * the result is an object consisting of an attribute url - the address - and init - the
     * init parameter for fetch. init["headers"] has the headers for the fetch.
     * @param apiRoot
     * @param apiMethod
     * @param fetchParams
     * @param apiVersion
     * @param urlSearchParams
     * @param mimetype
     */
    getFetchURL(
        apiRoot,
        apiMethod,
        fetchParams,
        apiVersion = "v1",
        urlSearchParams = null,
        mimetype = "application/json",
    ) {
        if (!this.token) {
            throw new KioskApiError("No api-token when calling getFetchURL ");
        }
        let headers = this.getHeaders(mimetype);
        let apiURL = this.getApiUrl();

        if (!apiURL.endsWith("/")) {
            apiURL += "/";
        }
        let address = `${apiURL}${apiRoot ? apiRoot + "/" : ""}${apiVersion}/${apiMethod}`;

        if (urlSearchParams) {
            address += "?" + new URLSearchParams(urlSearchParams);
        }
        let init = { ...fetchParams };
        init["headers"] = headers;
        return {
            url: address,
            init: init
        }
    }

    /**
     * fetches a Blob from the API
     * @param apiRoot
     * @param apiMethod
     * @param fetchParams
     * @param apiVersion
     * @param urlSearchParams
     * @param mimetype
     */
    async fetchBlobFromApi(
        apiRoot,
        apiMethod,
        fetchParams,
        apiVersion = "v1",
        urlSearchParams= null,
        mimetype = "application/json",
    ) {
        if (!this.token) {
            throw new KioskApiError("No api-token when calling fetchBlobFromApi");
        }
        let headers = this.getHeaders(mimetype)
        let apiURL = this.getApiUrl()
        console.log("apiURL is" + apiURL)

        if (!apiURL.endsWith("/")) {
            apiURL += '/'
        }
        let address = `${apiURL}${apiRoot?apiRoot + '/':''}${apiVersion}/${apiMethod}`;

        if ("caller" in fetchParams)
            console.log(`${fetchParams.caller} fetching from ${address}`);
        else console.log("fetching from " + address);
        let init = { ...fetchParams };
        init["headers"] = headers;
        if (urlSearchParams) {
            address += "?" + new URLSearchParams(urlSearchParams);
        }
        let response;
        try {
            console.log("fetching " + address);
            response = await fetch(address, init);
        } catch (err) {
            console.log(`caught ${err} in fetchBlobFromApi after fetch`);
            throw new FetchException(err);
        }
        if (response.ok) {
            return await response.blob();
        } else {
            const json_response = await response.json();
            console.log(`caught ${response.status} in fetchBlobFromApi`);
            if (json_response && 'result_msg' in json_response) {
                throw new FetchException(json_response.result_msg, response);
            } else {
                throw new FetchException(response.statusText, response);
            }
        }
    }
}
