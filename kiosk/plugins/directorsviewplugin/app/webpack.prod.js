const path = require("path");
const baseConfig = require('./webpack.base.js')
const devMode = process.env.NODE_ENV !== 'production';
const {merge} = require('webpack-merge')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = merge(baseConfig, {
    mode: "production",
    output: {
        filename: "directorsview-app.js",
        path: path.resolve(__dirname, "..\\static\\app")
    },
    plugins: [
        new webpack.DefinePlugin({
            DEVELOPMENT: false
        }),
        new webpack.NormalModuleReplacementPlugin(
            /lib\/const\.js/,
            './lib/production-const.js'
        ),
        new HtmlWebPackPlugin(
          {
              template: './src/directorsview_template.html',
              filename: '..\\..\\templates\\directorsview.html'
          },
        ),
        new CleanWebpackPlugin(), new MiniCssExtractPlugin({
        filename: '[name]-[hash].css',
    })],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /^((?!component).)*\.sass$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
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
    optimization: {
        minimize: true,
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`
            new CssMinimizerPlugin(),
        ],
    },
})