/* eslint-env node */

const path = require("path");
const WorkerPlugin = require("worker-plugin");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
    entry: "./client/js/index.jsx",
    output: {
        path: path.resolve(__dirname, "client/dist"),
        filename: "[name].js",
        publicPath: "dist/",
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules|wasm/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"],
                        plugins: ["@babel/plugin-syntax-dynamic-import"],
                    },
                },
            },
        ],
    },
    plugins: [
        new WorkerPlugin({
            globalObject: false,
        }),
    ],
    mode: "development",
    devtool: "source-map",
};
