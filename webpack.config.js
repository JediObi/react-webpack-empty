const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./config/webpack.config.common");
const devConfig = require("./config/webpack.config.dev");
const prodConfig = require("./config/webpack.config.prod");

module.exports = (env) => {
  switch (env) {
    case "dev":
      return merge(commonConfig, devConfig);
    case "prod":
      return merge(commonConfig, prodConfig);
    default:
      throw new Error("没有对应的webpack配置文件");
  }
};
