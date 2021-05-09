const path = require("path");
const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  output: {
    path: paths.appBuild,
    filename: "static/js/[name].[chunkhash:8].js",
    publicPath: "/demo",
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      filename: path.resolve(paths.appBuild, "index.html"),
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new OptimizeCssAssetsPlugin(),
  ],
};
