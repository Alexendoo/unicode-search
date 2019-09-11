/* eslint-env node */

const path = require("path");

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
    entry: "./client/js/index.jsx",
    output: {
        path: path.resolve(__dirname, "client/dist"),
        webassemblyModuleFilename: "search.wasm",
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
                exclude: /node_modules|pkg/,
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
    mode: "development",
    devtool: "source-map",
};
