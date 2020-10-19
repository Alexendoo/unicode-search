/* eslint-env node */

const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssPlugin = require("mini-css-extract-plugin");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
    entry: {
        search: "./client/js/search.js",
    },
    output: {
        filename: "[name].js",
        assetModuleFilename: "[name][ext]",
        path: path.join(__dirname, "server/static"),
        publicPath: "/static/",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                use: [CssPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new CssPlugin({
            filename: "[name].css",
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        chunkIds: "named",
    },
    devtool: "source-map",
    mode: "production",
};
