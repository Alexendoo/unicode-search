const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: "./client/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    module: {
        rules: [
            {
                test: /\.(html|txt|bin)$/,
                loader: "file-loader",
                options: { name: "[name].[ext]" },
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
