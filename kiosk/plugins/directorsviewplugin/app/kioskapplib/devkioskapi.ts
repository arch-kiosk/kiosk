import {
    KioskApi,
    FetchException,
    API_STATE_ERROR,
    API_STATE_INITIALIZING,
    API_STATE_READY,
    API_STATE_UNINITIALZED,
} from "./kioskapi";

export class DevKioskApi extends KioskApi {
    token = "";
    lastErrorMessage = "";
    kioskRoutes: { [key: string]: string } = null
    status = API_STATE_UNINITIALZED;

    getKioskRoute(routeName: string) {
        if (!this.kioskRoutes) {
            console.log("devKioskApi: No kiosk routes registered. Please call registerRoute to register routes for the dev instance.")
            return ""
        }
        if (!(routeName in this.kioskRoutes)) {
            console.log(`devKioskApi: The kiosk route ${routeName} is not registered. Please call registerRoute to register this route explicitly for the dev instance.`)
            return ""
        }
        // return "/" + this.kioskRoutes[routeName]
        return "http://localhost:5000/" + this.kioskRoutes[routeName]
    }

    registerRoute(routeName: string, url: string) {
        if (!this.kioskRoutes) this.kioskRoutes = {}
        this.kioskRoutes[routeName] = url
    }

    getApiUrl(apiAddress = "") {

        // @ts-ignore
        let route = import.meta.env.VITE_DEV_API_URL;
        if (apiAddress) {
            return `${route}${this.apiRoot}v1/${apiAddress}`;
        } else {
            return route;
        }
    }

    getHeaders(mimetype:string)  {
        let headers = super.getHeaders(mimetype)
        // @ts-ignore
        headers.append("webapp-user-id",import.meta.env.VITE_DEV_API_USER);
        // @ts-ignore
        headers.append("webapp-user-pwd",import.meta.env.VITE_DEV_API_PWD);
        return headers
    }


    async initApi() {
        this.status = API_STATE_INITIALIZING;
        let headers = new Headers()
        console.log("meta:", import.meta)
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        // @ts-ignore
        headers.append("Origin", import.meta.env.VITE_DEV_API_URL);

        let address = this.getApiUrl("login");
        let response;
        try {
            response = await fetch(address, {
                headers: headers,
                body: JSON.stringify({
                    // @ts-ignore
                    userid: import.meta.env.VITE_DEV_API_USER,
                    // @ts-ignore
                    password: import.meta.env.VITE_DEV_API_PWD,
                }),
                method: "POST",
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
