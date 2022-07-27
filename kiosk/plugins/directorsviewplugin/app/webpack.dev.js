const path = require("path");
const baseConfig = require('./webpack.base.js')
const webpack = require("webpack");
const {merge} = require('webpack-merge')
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = merge(baseConfig, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        https: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    output: {
        filename: "[name].js"
    },
    plugins: [
        new webpack.DefinePlugin({
            DEVELOPMENT: true
        }),
        new webpack.NormalModuleReplacementPlugin(
            /credentials\.ts/,
            './dev-credentials.ts'
        ),
        new HtmlWebPackPlugin(
            {
                template: './src/standalone-template.html'
            },
        )
    ],
    module: {
        rules: [
            {
                test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            },
            {
                test: /dev.css$/,
                use: [{loader: 'style-loader'}, {
                    loader: 'css-loader',
                    options: {
                        url: true,
                        import: false
                    }
                }],

            },
            {
                test: /\.css$/,
                use: [{loader: 'style-loader'}, {
                    loader: 'css-loader',
                    options: {
                        url: false,
                        import: false
                    }
                }],

            },
            {
                // test: /^(?!component).*\.sass$/,
                test: /^((?!component).)*\.sass$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                // test: /\$.*\.sass$/,
                test: /component.*.sass$/,
                use: [{
                    loader: 'lit-scss-loader',
                    options: {
                        // defaultSkip: true,
                        minify: true
                    },
                }, 'extract-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
})