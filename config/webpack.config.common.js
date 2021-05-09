const path = require("path");
const webpack = require("webpack");
const paths = require("./paths");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: path.resolve(paths.appPath, "src/index.js"),
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      constants: require.resolve("constants-browserify"),
      stream: false,
      assert: false,
    },
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            loader: "babel-loader",
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../",
                },
              },
              "css-loader",
            ],
          },
          {
            // 注意此处图片的配置，如果你想让webpack管理图片，需要在js里用require引入图片，如果不需要webpack管理则不用require
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: "file-loader",
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[chunkhash:8].css",
      chunkFilename: "[id].css",
    }),
  ],
};
