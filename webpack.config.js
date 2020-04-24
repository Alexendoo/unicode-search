/* eslint-env node */

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const CssPlugin = require("mini-css-extract-plugin");
const WorkerPlugin = require("worker-plugin");

function page(filename) {
    return new HtmlPlugin({
        template: `./src/pages/${filename}.jsx`,
        filename,
        inject: false,
    });
}

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
    entry: {
        search: "./src/js/search.jsx",
    },
    output: {
        filename: "static/[name].[contenthash].js",
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
                test: /\.(txt|bin|wasm)$/,
                type: "javascript/auto",
                loader: "file-loader",
                options: {
                    name: "static/[name].[contenthash].[ext]",
                },
            },
            {
                test: /\.css$/,
                use: [CssPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        page("index.html"),
        page("search.html"),
        new CssPlugin({
            filename: "static/[contenthash].css",
        }),
        new WorkerPlugin({
            globalObject: "self",
        }),
        new CleanWebpackPlugin(),
    ],
    devtool: "source-map",
    devServer: {
        overlay: true,
        before(app) {
            app.get(/^\/(?:search|chars)$/, (req, res) => {
                res.redirect(`${req.url}.html`);
            });
        },
    },
};
