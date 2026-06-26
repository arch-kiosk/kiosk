import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import copy from "rollup-plugin-copy";

// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, "env");
    return {
        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        },
        plugins: [
            createHtmlPlugin({
                inject: {
                    ...env,
                },
            }),
            copy({
                targets: [
                    {
                        src: "../../../static/styles/_constants.sass",
                        dest: "src/styles/",
                    },
                ],
                hook: "buildStart",
            }),
        ],
        // esbuild: {
        //     drop: command === "build" ? ["console", "debugger"] : [],
        // },
        resolve: {
            alias: {
                // Add alias to resolve the deep static paths
                "@static": "../../../static",
                "@styles": "../../../static/styles",
            },
        },
        build: {
            // commonjsOptions: {
            //   dynamicRequireTargets: "node_modules/"
            // },
            outDir: "../static/app",
            emptyOutDir: true,
            minify: true,
            lib: {
                entry: "src/app.ts",
                formats: ["es"],
            },
            rolldownOptions: {
                // "external": (id) => id.match(/kioskuicomponents/gmi)
                external: ["@arch-kiosk/kioskuicomponents"],
                compress:
                    command === "build"
                        ? {
                              drop: ["console", "debugger"],
                          }
                        : false,
            },
        },
        server: {
            hmr: false,
            fs: {
                strict: true,
                host: true,
                // allow: [searchForWorkspaceRoot(process.cwd()), "../../../static/scripts/kioskapplib"],
            },
        },
        publicDir: "/static",
    };
});