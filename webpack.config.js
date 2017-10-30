const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: { main: "./src/ts/index/index", worker: "./src/ts/worker/worker" },

  output: {
    path: path.resolve(__dirname, "dist"),
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
