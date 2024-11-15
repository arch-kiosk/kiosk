import { defineConfig, searchForWorkspaceRoot, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import copy from "rollup-plugin-copy";

// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, "env");
    return {
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
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
                      //No console.logs in the distribution
                      drop: ["console", "debugger"],
                  }
                : {},
        build: {
            outDir: "../static/app",
            lib: {
                entry: "src/app.ts",
                formats: ["es"],
            },
            // rollupOptions: {
            //   external: [/^@vaadin/],
            // },
        },
        server: {
            fs: {
                strict: true,
                host: true,
                allow: [searchForWorkspaceRoot(process.cwd()), "../../../static/scripts/kioskapplib"],
            },
        },
        publicDir: "/static"
    };
});
