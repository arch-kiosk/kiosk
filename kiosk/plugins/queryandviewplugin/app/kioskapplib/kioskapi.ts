export const API_STATE_UNINITIALZED = 0;
export const API_STATE_INITIALIZING = 1;
export const API_STATE_READY = 2;
export const API_STATE_ERROR = 3;

export class KioskApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "KioskApiError";
    }
}

export class FetchException extends Error{
    msg: string
    response: any
    constructor(msg: string, response:any = null) {
        super();
        this.msg = msg;
        this.response = response;
    }
}

interface FetchParams extends RequestInit {
    caller?: string
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
    getKioskRoute(route_name: string): string {
        throw "KioskApi.getKioskRoute is not implemented";
    }

    getApiUrl(apiAddress = ""):string {
        //abstract method
        throw "KioskApi.getApiUrl is abstract and must not be called";
    }

    getHeaders(mimetype: string) {
        let headers = new Headers();
        headers.append("Content-Type", mimetype);
        headers.append("Accept", mimetype);
        headers.append("Authorization", `Bearer ${this.token}`);
        return headers
    }

    async initApi() {
        //abstract method
        throw "KioskApi.initApi is abstract and must not be called";
    }

    /**
     * fetches JSON from the API
     * @param apiRoot
     * @param apiMethod
     * @param fetchParams
     * @param apiVersion
     * @param urlSearchParams
     * @param mimetype
     */
    async fetchFromApi(
        apiRoot:string,
        apiMethod: string,
        fetchParams: FetchParams,
        apiVersion = "v1",
        urlSearchParams: URLSearchParams | null = null,
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
            console.log(`caught ${response.status} in fetchFromApi`);
            if (json_response && 'result_msg' in json_response) {
                throw new FetchException(json_response.result_msg, response);
            } else {
                throw new FetchException(response.statusText, response);
            }
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
        apiRoot:string,
        apiMethod: string,
        fetchParams: FetchParams,
        apiVersion = "v1",
        urlSearchParams: URLSearchParams | null = null,
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
