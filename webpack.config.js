const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const webpack = require("webpack")

const dir = (...pathSegments) => path.resolve(__dirname, ...pathSegments)

const base = {
  output: {
    path: dir("dist"),
    filename: "[name].js",
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
}

const web = {
  ...base,

  target: "web",

  entry: "./src/ts/index/index.ts",

  module: {
    rules: [
      ...base.module.rules,
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader",
        }),
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
          {
            loader: "extract-loader",
          },
          {
            loader: "html-loader",
            options: {
              minimize: true,
              conservativeCollapse: false,
            },
          },
        ],
      },
    ],
  },

  plugins: [new ExtractTextPlugin("style.css")],
}

const worker = {
  ...base,

  target: "webworker",

  entry: {
    worker: "./src/ts/worker/worker.ts",
  },

  output: {
    ...base.output,
    chunkFilename: "worker.[id].js",
  },
}

module.exports = [web, worker]
