const CSSExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const rimraf = require("rimraf")

const dir = (...pathSegments) => path.resolve(__dirname, ...pathSegments)

rimraf.sync("./dist/*")

/** @type {import('webpack').Configuration} */
const base = {
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
}

/** @type {import('webpack').Configuration} */
const main = {
  ...base,

  entry: {
    main: "./src/ts/index/index.ts",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject: false,
      minify: {
        collapseWhitespace: true,
      },
    }),
    new CSSExtractPlugin({
      filename: "style.css",
    }),
  ],
}

/** @type {import('webpack').Configuration} */
const worker = {
  ...base,

  entry: {
    worker: "./src/ts/worker/worker.ts",
  },

  target: "webworker",
}

module.exports = [main, worker]
