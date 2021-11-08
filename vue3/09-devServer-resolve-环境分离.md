<!--
 * @Author: East
 * @Date: 2021-11-08 16:41:44
 * @LastEditTime: 2021-11-08 17:30:47
 * @LastEditors: Please set LastEditors
 * @Description: devServer 本地服务器 + resolve + 环境分离
 * @FilePath: \forGreaterGood\vue3\09-devServer-resolve-环境分离.md
-->
# devServer 本地服务器 + resolve + 环境分离
## devServer 本地服务器
### why 搭建本地服务？
+ 开发代码 --> 运行
  - 两个操作
    1. `npm run build`：编译相关代码
    2. 通过 live server 或者直接通过浏览器，打开 index.html 代码，查看效果
  - 缺点：影响开发效率
  - 目标：当文件发生变化时，可以**自动地完成编译和展示**
+ in order to 完成自动编译，webpack 提供了三种方式
  - webpack watch mode
  - webpack-dev-server(常用)
  - webpack-dev-middleware

### webpack watch
+ watch 模式
  - 在该模式下，webpack 依赖图中的所有文件，只要有一个发生了更新，那么代码被重新编译
  - --> 不需要手动去运行 `npm run build` 指令
+ 开启的方式
  - 方式一：导出的配置中，添加 `watch: true`
  - 方式二：在启动的 webpack 命令中，添加 --watch 的标识
    * 会由 webpack-cli 处理成 方式一
+ 问题：实际上没有自动刷新浏览器的功能
  - 希望在不使用 live-server 的情况下，可以具备 live reloading(实施重新加载) 的功能

### webpack-dev-server
1. `npm install webpack-dev-server -D`
2. 修改配置文件 package.json 添加脚本 `"serve": "webpack serve"`，告诉
