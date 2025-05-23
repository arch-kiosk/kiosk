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
        ],
        esbuild:
            command == "build"
                ? {
                      // No console.logs in the distribution
                      // drop: ["console", "debugger"],
                  }
                : {},
        build: {
            // commonjsOptions: {
            //   dynamicRequireTargets: "node_modules/"
            // },
            watch: {
                exclude: ['node_modules/**', "/__uno.css"]
            },
            outDir: "../static/app",
            lib: {
                entry: "src/app.ts",
                formats: ["es"],
            },
            // rollupOptions: {
            //
            //   external: /^lit/,
            // },
        },
        server: {
            hmr: false,
            fs: {
                strict: true,
                host: true,
                allow: [searchForWorkspaceRoot(process.cwd()), "../../../static/scripts/kioskapplib"],
            },
        },
        publicDir: "/static",
    };
});
