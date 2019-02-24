const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: "./client/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    module: {
        rules: [{ test: /\.(txt|bin)$/, use: "file-loader" }],
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new WasmPackPlugin({
            crateDirectory: __dirname,

            extraArgs: "--dev --out-dir target/wpkg",
        }),
    ],
    mode: "development",
    devtool: "source-map",
};
