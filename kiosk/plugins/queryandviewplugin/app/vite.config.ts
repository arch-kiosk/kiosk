import { defineConfig, searchForWorkspaceRoot, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import copy from 'rollup-plugin-copy'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "env");
  return {
  plugins: [
    createHtmlPlugin(),
    // copy({
    //   targets: [ { src: '../../kioskfilemakerworkstationplugin/static/kioskfilemakerworkstation.css',
    //     dest:'./kioskfilemakerworkstation/static'
    //   }, {
    //     src: '../../kioskfilemakerworkstationplugin/static/scripts',
    //     dest:'./kioskfilemakerworkstation/static'
    //   }],
    //   hook: 'buildStart'
    // }),
  ],
  build: {
    outDir: "../static/app",
    lib: {
      entry: 'src/app.ts',
      formats: ['es'],
    },
    // rollupOptions: {
    //   external: /^lit/,
    // },
  },
  server: {
    fs: {
      strict: true,
      host: true,
      allow: [searchForWorkspaceRoot(process.cwd()), "../../../static/scripts/kioskapplib"],
    },
  },
  html: {
    injectData: {
      ...env,
    },
  },

}})
