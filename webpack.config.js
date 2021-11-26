/* eslint-env node */

const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssPlugin = require("mini-css-extract-plugin");

/**
 * @type {import("webpack").Configuration}
 */
const config = {
    output: {
        filename: "[name].js",
        assetModuleFilename: "[name][ext]",
        path: path.join(__dirname, "dist"),
    },
    devServer: {
        compress: true,
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
            {
                test: /\.html$/,
                type: "asset/resource",
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
    performance: {
        hints: false,
    },
    devtool: "source-map",
    mode: "production",
};

module.exports = config;
