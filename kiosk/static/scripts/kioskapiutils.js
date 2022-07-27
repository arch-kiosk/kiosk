//This is horrible. I can't see a way around duplicating this code from 'kioskapputils.js' because
//import cannot be mixed with global functions
//Huge refactoring needed one day that gets rid of all the global javascript -> Not in v1

function globalGetApiUrl(apiAddress) {
  if (apiAddress) {
    return `${getRoutefor("api")}/v1/${apiAddress}`;
  } else {
    return getRoutefor("api");
  }
}

async function globalGetKioskToken() {
  let headers = new Headers()
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  let address = globalGetApiUrl('login');
  let response = await fetch(address, {headers: headers, method: "GET"});
  let data = await response.json();
  return data["token"];
}

class FetchException {
    constructor(msg, response=null) {
      this.msg = msg
      this.response=response
    }
}

async function globalFetchFromApi(apiUrl, apiToken, apiMethod, fetchParams,
                                   apiVersion="v1", urlSearchParams="", mimetype="application/json") {
  let headers = new Headers()
  headers.append('Content-Type', mimetype);
  headers.append('Accept', mimetype);
  headers.append("Authorization", `Bearer ${apiToken}`)
  // headers.append('Origin', 'http://locahost:5000');
  // console.log(headers.get("Authorization"))
  // console.log(headers.get("Content-Type"))
  let address = `${apiUrl}/${apiVersion}/${apiMethod}`;
  if ("caller" in fetchParams)
    console.log(`${fetchParams.caller} fetching from ${address}`)
  else
    console.log("fetching from " + address)
  let init = {...fetchParams}
  init["headers"] = headers
  if (urlSearchParams) {
    address += "?" + urlSearchParams
  }
  let response
  try {
    console.log("fetching " + address)
    response = await fetch(address, init);
  } catch(err) {
    console.log(`caught ${err} in fetchFromApi after fetch`)
    throw new FetchException(err)
  }
  if (response.ok) {
    return await response.json();
  } else {
    console.log(`caught ${response.status} in fetchFromApi`)
    throw new FetchException(response.statusText, response)
  }
}
