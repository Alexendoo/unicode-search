const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: "./client/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        webassemblyModuleFilename: "search.wasm",
        filename: "index.js",
    },
    module: {
        rules: [
            {
                test: /\.(html|txt|bin)$/,
                loader: "file-loader",
                options: { name: "[name].[ext]" },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
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
        new WasmPackPlugin({
            crateDirectory: __dirname,

            extraArgs: "--out-dir client/pkg",
        }),
    ],
    mode: "development",
    devtool: "source-map",
};
