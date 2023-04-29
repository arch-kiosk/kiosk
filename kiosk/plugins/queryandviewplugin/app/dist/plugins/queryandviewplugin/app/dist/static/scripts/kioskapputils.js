export function getApiUrl(apiAddress) {
    if (apiAddress) {
        return `${getRoutefor("api")}/v1/${apiAddress}`;
    }
    else {
        return getRoutefor("api");
    }
}
export async function getKioskToken() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let address = getApiUrl('login');
    let response = await fetch(address, { headers: headers, method: "GET" });
    let data = await response.json();
    return data["token"];
}
export class FetchException {
    constructor(msg, response = null) {
        this.msg = msg;
        this.response = response;
    }
}
export async function fetchFromApi(apiUrl, apiToken, apiMethod, fetchParams, apiVersion = "v1", urlSearchParams = "", mimetype = "application/json") {
    let headers = new Headers();
    headers.append('Content-Type', mimetype);
    headers.append('Accept', mimetype);
    headers.append("Authorization", `Bearer ${apiToken}`);
    // headers.append('Origin', 'http://locahost:5000');
    // console.log(headers.get("Authorization"))
    // console.log(headers.get("Content-Type"))
    let address = `${apiUrl}/${apiVersion}/${apiMethod}`;
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
export async function fetchSomething(address, apiToken) {
    let headers = new Headers();
    headers.append('Content-Type', "text/html");
    headers.append('Accept', "text/html");
    headers.append("Authorization", `Bearer ${apiToken}`);
    headers.append('Origin', 'http://locahost:5000');
    // console.log(headers.get("Authorization"))
    // console.log(headers.get("Content-Type"))
    let init = {
        method: "POST",
        caller: "workstationlist.fetchWorkstations"
    };
    init["headers"] = headers;
    let response;
    try {
        response = await fetch(address, init);
    }
    catch (err) {
        console.log(`caught ${err} in fetchFromApi after fetch`);
        throw new FetchException(err);
    }
    if (response.ok) {
        return await response.text();
    }
    else {
        console.log(`caught ${response.status} in fetchFromApi`);
        throw new FetchException(response.statusText, response);
    }
}
export async function fetchBlobFromApi(apiUrl, apiToken, apiMethod, fetchParams, apiVersion = "v1", urlSearchParams = "") {
    let headers = new Headers();
    // headers.append('Content-Type', mimetype);
    // headers.append('Accept', mimetype);
    headers.append("Authorization", `Bearer ${apiToken}`);
    // headers.append('Origin', 'http://locahost:5000');
    let address = `${apiUrl}/${apiVersion}/${apiMethod}`;
    let init = { ...fetchParams };
    init["headers"] = headers;
    if (urlSearchParams) {
        address += "?" + urlSearchParams;
    }
    let response = await fetch(address, init);
    if (response.ok) {
        return await response.blob();
    }
    else {
        throw response;
    }
}
export function appGetKioskRoute(endpoint) {
    return getRoutefor(endpoint);
}
//# sourceMappingURL=kioskapputils.js.map
//# sourceMappingURL=kioskapputils.js.map