// import "./app/attachment-view.ts"
import "./app.ts"
// import "./app/component-undefined-route.ts"
// import "./app/styles.sass"
// import "./assets/favicon.ico"
// import {registerRoutes} from "./app/routing.js";
import {Router} from "@vaadin/router";

// import "./sw.js"

// import "./manifest.webmanifest"

(() => {
    window.addEventListener("load", () => {
        // configureRouter();
        // console.log(window.location.toString());
        // if (!window.location.toString().startsWith("https://192.168"))
        //     addServiceWorker();
        //
        // _installSyncEvents();
    })
})();

//
// function configureRouter() {
//     let el = document.getElementById("app-container");
//     if (el === null) {
//         alert("undefined element app-container!");
//     } else {
//         registerRoutes(el);
//     }
// }
// async function addServiceWorker() {
//   try {
//     await(navigator.serviceWorker.register('./sw.js'));
//   }
//   catch(e) {
//       alert(e);
//       // alert(e);
//   }
// }
//
// function _installSyncEvents() {
//     // const appContainer = document.getElementsByTagName("hoarder-app")[0];
//     const appContainer = document.getElementById("app-container");
//     appContainer.addEventListener("sync-error", () => {
//         console.log("sync error");
//         const syncStatus = document.getElementById("sync-status");
//         syncStatus.innerText = "error synchronizing";
//         _heartbeat();
//     });
//     appContainer.addEventListener("sync-changed", () => {
//         console.log("sync changed");
//         _heartbeat();
//     });
//     appContainer.addEventListener("sync-started", () => {
//         console.log("sync started");
//         const syncStatus = document.getElementById("sync-status");
//         syncStatus.style.visibility = "visible"
//         syncStatus.innerText = "synchronizing...";
//         _heartbeat();
//     });
//
//     appContainer.addEventListener("sync-active", () => {
//         console.log("sync active");
//         const syncStatus = document.getElementById("sync-status");
//         syncStatus.style.visibility = "visible"
//         syncStatus.innerText = "sync active ...";
//         _heartbeat();
//     });
//
//     appContainer.addEventListener("sync-complete", () => {
//         console.log("sync complete");
//         const syncStatus = document.getElementById("sync-status");
//         syncStatus.style.visibility = "hidden"
//         syncStatus.innerText = "sync complete";
//         _heartbeat();
//     });
// }
//
// function _heartbeat() {
//     const headline = document.getElementById("animate");
//     headline.classList.remove("creepy");
//     void headline.offsetWidth;
//     headline.classList.add("creepy");
// }
//
//
