const path = require("path");
const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  output: {
    path: paths.appBuild,
    filename: "static/js/bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, //inject all js at the bottom of the body
      template: paths.appHtml, //source file
    }),
  ],
  devServer: {
    contentBase: paths.appPublic,
    historyApiFallback: false,
    inline: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        pathRewrite: { "^/api": "" },
      },
    },
  },
};
