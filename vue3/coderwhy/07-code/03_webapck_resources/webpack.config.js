/*
 * @Author: east
 * @Date: 2021-11-07 13:42:27
 * @LastEditTime: 2021-11-07 18:40:42
 * @LastEditors: Please set LastEditors
 * @Description: webpack 的配置文件，node 环境下
 * @FilePath: \01_basic_webpack\webpack.config.js
 */
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js",
    publicPath: "/build/",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       publicPath: "./build",
      //     },
      //   },
      // },
      /** 进行命名规范 */
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       publicPath: "./build",
      //       name: "img/[name]_[hash:6].[ext]",
      //     },
      //   },
      // },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: {
      //     loader: "url-loader",
      //     options: {
      //       publicPath: "./build",
      //       name: "img/[name]_[hash:6].[ext]",
      //       limit: 100 * 1024,
      //     },
      //   },
      // },
      /** 资源模块类型 */
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
        generator: {
          filename: "img/[name]_[hash:6][ext]",
          // publicPath: "./build",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024,
          },
        },
      },
      /** 字体文件 */
      // {
      //   test: /\.(eot|ttf|woff2?)$/,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       // publicPath: "./build",
      //       name: "font/[name]_[hash:6].[ext]",
      //     },
      //   },
      // },
      { test: /\.(eot|ttf|woff2?)$/, type: "asset/resource" },
    ],
  },
};
