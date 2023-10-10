/*
 * @Author: your name
 * @Date: 2021-11-24 11:25:09
 * @LastEditTime: 2021-11-24 13:42:02
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\30-code\01_ts_module\webpack.config.js
 */
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname + './dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './inde.html'
    })
  ]
}
