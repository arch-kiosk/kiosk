// const WebpackPwaManifest = require("webpack-pwa-manifest");
// const WorkboxPlugin = require("workbox-webpack-plugin");

const webpack = require("webpack");
const path = require("path");
module.exports = {
    entry: {
        main: "./src/index.js"
    },
    plugins: [
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
            {
                test: /\.html$/,
                exclude: [path.resolve(__dirname, 'reroute.html')],
                use: ['html-loader']
            },
            {
                test: /favicon.ico$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "favicon.ico",
                        outputPath: "."
                    }
                }
            },
            {
                test: /\.svg|png|jpg|gif$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "assets"
                    }
                }
            },
            // {
            //     test: /manifest.webmanifest$/,
            //     use: {
            //         loader: "file-loader",
            //         options: {
            //             name: "manifest.webmanifest",
            //             outputPath: "/"
            //         }
            //     }
            // },
        ]
    },
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        }
    }
}