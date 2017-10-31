const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const rimraf = require("rimraf")
const webpack = require("webpack")

const dir = (...pathSegments) => path.resolve(__dirname, ...pathSegments)

rimraf.sync("./dist/*")

module.exports = {
  entry: "./src/ts/index/index.ts",

  output: {
    path: dir("dist"),
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

  // devtool: "source-map",

  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
}
