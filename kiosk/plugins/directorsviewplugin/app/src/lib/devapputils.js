/* You need a secure.js in this directory that exports the kiosk api credentials
   to use during development. It needs to look like this:

    if (typeof DEVELOPMENT !== 'undefined' && DEVELOPMENT) {
        user_id = 'your kiosk user id'
        user_pwd = 'your password'
    } else {
        user_id = ''
        user_pwd = ''
    }

*/

import "./secure.js"

class FetchException {
    constructor(msg, response=null) {
        this.msg = msg
        this.response=response
    }
}

export function devGetApiUrl(apiAddress = "") {
    let route = "http://localhost:5000/api"
    if (apiAddress) {
        return `${route}/v1/${apiAddress}`;
    } else {
        return route;
    }
}

export async function devGetKioskToken() {
    let headers = new Headers()
    console.log("getting kiosk token")
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin', 'http://locahost:5000');

    let address = devGetApiUrl('login');
    let response
    try {
        console.log({"userid": user_id, "password": user_pwd})
        response = await fetch(address, {
            headers: headers,
            body: JSON.stringify({"userid": user_id, "password": user_pwd}),
            method: "POST"
        });
    } catch (e) {
        // console.log(`throwing FetchException after caught ${e}`)
        throw new FetchException(e, null)
    }
    if (response.ok) {
        let data = await response.json();
        return data["token"];
    } else {
        // console.log(`throwing FetchException ${response.statusText}`)
        throw new FetchException(response.statusText, response)
    }
}

