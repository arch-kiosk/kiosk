//This is horrible. But I was not able to find a different way to have a few methods globally accessible that
// themselves need an import clause.
// And as per now: "import" cannot be used in a script that itself is not loaded as a module with global functions
//Huge refactoring needed one day that gets rid of all the global javascript -> Not in v1

import {ProdKioskApi} from "./kioskapplib/prodkioskapi.js";
import {getApiUrl, getKioskToken, fetchFromApi, FetchException} from "./kioskapputils.js"

window.FetchException = FetchException;

window.getKioskApiContext = async function() {
  let api = new ProdKioskApi();
  await api.initApi()
  return api
}

window.globalGetApiUrl = function(apiAddress) {
  return getApiUrl(apiAddress)
}

window.globalGetKioskToken = async function() {
  return getKioskToken()
}

window.globalFetchFromApi = async function(apiUrl, apiToken, apiMethod, fetchParams,
                                   apiVersion="v1", urlSearchParams="", mimetype="application/json") {
  return fetchFromApi(apiUrl, apiToken, apiMethod, fetchParams, apiVersion, urlSearchParams, mimetype)
}
