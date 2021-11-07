/*
 * @Author: your name
 * @Date: 2021-11-07 13:42:27
 * @LastEditTime: 2021-11-07 13:46:12
 * @LastEditors: Please set LastEditors
 * @Description: webpack 的配置文件，node 环境下
 * @FilePath: \01_basic_webpack\webpack.config.js
 */
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./build"), // 要求绝对路径
    filename: "bundle.js",
  },
};
