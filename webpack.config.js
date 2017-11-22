const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
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

const extractCSS = new ExtractTextPlugin("style.css")
const extractHTML = new ExtractTextPlugin("index.html")

const mainThread = {
  ...base,

  target: "web",

  entry: "./src/ts/ui",

  module: {
    rules: [
      ...base.module.rules,
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: "css-loader",
        }),
      },
      {
        test: /\.html$/,
        use: extractHTML.extract({
          use: {
            loader: "html-loader",
            options: {
              minimize: true,
              conservativeCollapse: false,
            },
          },
        }),
      },
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: dir("src/ts/tsconfig.json"),
    }),
    extractCSS,
    extractHTML,
  ],
}

const worker = {
  ...base,

  target: "webworker",

  entry: {
    worker: "./src/ts/worker",
  },

  output: {
    ...base.output,
    chunkFilename: "worker.[id].js",
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: dir("src/ts/worker/tsconfig.json"),
    }),
  ],
}

module.exports = [mainThread, worker]
