import { defineConfig, searchForWorkspaceRoot, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import copy from "rollup-plugin-copy";

// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, "env");
    return {
        plugins: [
            createHtmlPlugin({
                inject: {
                    ...env,
                },

            }),
            copy({
                targets: [
                    {
                        src: '../../../static/styles/_constants.sass',
                        dest: 'src/styles/'
                    }
                ],
                hook: 'buildStart'
            })
        ],
        esbuild:
            command == "build"
                ? {
                      // No console.logs in the distribution
                      drop: ["console", "debugger"],
                  }
                : {},
        resolve: {
            alias: {
                // Add alias to resolve the deep static paths
                "@static": "../../../static",
                "@styles": "../../../static/styles"
            }
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
            rollupOptions: {
                // "external": (id) => id.match(/kioskuicomponents/gmi)
                "external": ["@arch-kiosk/kioskuicomponents"]
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