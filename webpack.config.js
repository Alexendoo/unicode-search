/* eslint-env node */

const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const WorkerPlugin = require("worker-plugin");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
    entry: {
        search: "./client/js/search.js",
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.join(__dirname, "server/static"),
        publicPath: "/static/",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: ["@babel/plugin-syntax-dynamic-import"],
                        },
                    },
                    // https://github.com/webpack/webpack/issues/6719
                    require.resolve("@open-wc/webpack-import-meta-loader"),
                ],
            },
            {
                test: /\.(txt|bin|wasm)$/,
                type: "javascript/auto",
                loader: "file-loader",
                options: {
                    name: "[name].[contenthash].[ext]",
                    esModule: false,
                },
            },
            {
                test: /\.css$/,
                use: [CssPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new CssPlugin({
            filename: "[contenthash].css",
        }),
        new WorkerPlugin({
            globalObject: "self",
        }),
        new CleanWebpackPlugin(),
        new ManifestPlugin(),
    ],
    devtool: "source-map",
    mode: "development",
};
