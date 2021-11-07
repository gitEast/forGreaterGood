/*
 * @Author: your name
 * @Date: 2021-11-07 13:42:27
 * @LastEditTime: 2021-11-07 15:05:35
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
  module: {
    rules: [
      /** 1. 写法一：写法二的语法糖 */
      // {
      //   test: /\.css$/, // 正则表达式
      //   loader: "css-loader",
      // },
      /** 2. 写法二 */
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      /** 3. 写法三：完整写法 */
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: "css-loader",
      //       options: {},
      //     },
      //   ],
      // },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
};
