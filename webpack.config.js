const CSSExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const rimraf = require("rimraf")

const dir = (...pathSegments) => path.resolve(__dirname, ...pathSegments)

rimraf.sync("./dist/*")

/** @type {import('webpack').Configuration} */
const conf = {
  entry: "./src/ts/index/index.ts",

  mode: "development",

  output: {
    path: dir("dist"),
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
      {
        test: /\.css$/,
        use: [CSSExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  // devtool: "source-map",

  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      minify: {
        collapseWhitespace: true,
      },
    }),
    new CSSExtractPlugin(),
  ],
}

module.exports = conf
