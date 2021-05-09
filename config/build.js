/**
 * 该脚本用于打包时清理build目录下的旧文件，然后复制公共资源到build目录下
 */
const fs = require("fs-extra");
const paths = require("./paths");

/**
 * 复制public目录下的资源到build目录
 */
function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
}

fs.emptyDirSync(paths.appBuild);
copyPublicFolder();
