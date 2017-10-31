const path = require("path")
const webpack = require("webpack")
const rimraf = require("rimraf")

const resolve = (...pathSegments) => path.resolve(__dirname, ...pathSegments)

rimraf.sync("./dist/*")

module.exports = {
  entry: { main: "./src/ts/index/index", worker: "./src/ts/worker/worker" },

  output: {
    path: resolve("dist"),
    filename: "[name].[chunkhash].js",
  },

  resolve: {
    extensions: [".ts", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: { transpileOnly: true },
      },
    ],
  },

  devtool: "source-map",

  plugins: [],
}
