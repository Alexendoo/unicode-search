/* eslint-env node */

const HtmlPlugin = require("html-webpack-plugin");
const CssPlugin = require("mini-css-extract-plugin");
const WorkerPlugin = require("worker-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
    entry: "./src/js/index.jsx",
    output: {
        filename: "[name].[contenthash].js",
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-react"],
                            plugins: ["@babel/plugin-syntax-dynamic-import"],
                        },
                    },
                    // https://github.com/webpack/webpack/issues/6719
                    require.resolve("@open-wc/webpack-import-meta-loader"),
                ],
            },
            {
                test: /intermediate\/.*\.js$/,
            },
            {
                test: /\.(txt|bin|wasm)$/,
                type: "javascript/auto",
                loader: "file-loader",
                options: {
                    name: "[name].[contenthash].[ext]",
                },
            },
            {
                test: /\.css$/,
                use: [CssPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlPlugin({
            template: "src/index.ejs",
            inject: false,
        }),
        new CssPlugin({
            filename: "[name].[contenthash].css",
        }),
        new WorkerPlugin({
            globalObject: "self",
        }),
        new CleanWebpackPlugin(),
    ],
    devtool: "source-map",
    devServer: {
        overlay: true,
        historyApiFallback: true,
    },
};
