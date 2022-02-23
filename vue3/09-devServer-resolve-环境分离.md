<!--
 * @Author: East
 * @Date: 2021-11-08 16:41:44
 * @LastEditTime: 2022-02-23 15:40:56
 * @LastEditors: Please set LastEditors
 * @Description: devServer 本地服务器 + resolve + 环境分离
 * @FilePath: \forGreaterGood\vue3\09-devServer-resolve-环境分离.md
-->

# devServer 本地服务器 + resolve + 环境分离

## devServer 本地服务器

### why 搭建本地服务？

- 开发代码 --> 运行
  - 两个操作
    1. `npm run build`：编译相关代码
    2. 通过 live server 或者直接通过浏览器，打开 index.html 代码，查看效果
  - 缺点：影响开发效率
  - 目标：当文件发生变化时，可以**自动地完成编译和展示**
- in order to 完成自动编译，webpack 提供了三种方式
  - webpack watch mode
  - webpack-dev-server(常用)
  - webpack-dev-middleware

### webpack watch

- watch 模式
  - 在该模式下，webpack 依赖图中的所有文件，只要有一个发生了更新，那么代码被重新编译
  - --> 不需要手动去运行 `npm run build` 指令
- 开启的方式
  - 方式一：导出的配置中，添加 `watch: true`
  - 方式二：在启动的 webpack 命令中，添加 --watch 的标识
    - 会由 webpack-cli 处理成 方式一
- 问题：实际上没有自动刷新浏览器的功能
  - 希望在不使用 live-server 的情况下，可以具备 live reloading(实施重新加载) 的功能

### webpack-dev-server

1. `npm install webpack-dev-server -D`
2. 修改配置文件 package.json 添加脚本 `"serve": "webpack serve"` -- 通过 webpack-cli 解析的
3. webpack-dev-server 在编译之后不会写入到任何输出文件，而是将 bundle 文件保留在**内存**中
   - 使用了 memfs 库
4. webpack.config.js 配置
   ```js
   module.exports = {
     ...,
     devServer: {
       contentBase: './public'
     },
     ...
   }
   ```

- build 文件夹下没有文件
  - 打包后的资源没有做文件的输出，而是先放在内存里，再通过 express 服务器来访问这些静态资源，浏览器访问也是从内存访问
  - why 不输出？
    - 如果不输出的话，需要文件读取到内存，express 再从内存读取，提高了开发效率
  - 用到了一个叫 memfs 库(memory-fs 是 webpack 自己写的，已经不用了)

#### devServer 的配置信息

```js
module.exports = {
  ...,
  devServer: {
    contentBase: './public',
    hot: true,
    host: 0.0.0.0,
    port: 8000,
    open: true,
    compress: true,
    proxy: {
      '/api': {
        target: "http://localhost:8888", // api 的请求路径
        pathRewrite: { '^/api': '' },
        secure: false, // 默认 true
        changeOrigin: true, // 网络请求默认会带上原本的源，需要切换(某些服务器可能会校验 header)
      }
    }
  },
  ...
}
```

1. contentBase：如果静态资源没有从 webpack 中加载到，那就会从这里加载
   - 开发阶段使用
   - 生产阶段还是要使用：CopyWebpackPlugin
2. hot：模块热替换 HMR(Hot Module Replacement)
   - 在应用程序运行过程中，替换、添加、删除模块，而**无需重新刷新整个页面**
     - 刷新整个页面，性能消耗过大
   - 如何提高开发速度
     - 不重新加载整个页面，这样可以保留某些应用程序的状态不丢失
     - 只更新需要变化的内容，节省开发的时间
     - 修改了 css、js 源代码，会立即在浏览器更新，相当于直接在浏览器的 devtools 中直接修改样式
   - 如何使用 HMR
     - 默认情况下， webpack-dev-server 已经支持 HMR，只需开启即可
     - 在不开启的情况下，修改源代码之后，整个页面会自动刷新，使用的是 live reloading
   - webpack 的导出配置中需要加上 `target: "web"`，否则可能会出错
   - 热模块替换真正开启
     ```js
     /** main.js -- 入口文件 */
     import "./js/elemengt.js";
     if (module.hot) {
       module.hot.accept("./js/element.js", () => {
         console.log("element 模块发生更新了");
       });
     }
     ```
     - 在开发中，如果要手动写入 module.hot.accept 也太麻烦了
       - 实际上，vue-loader 自己已经实现了热模块替换
   - HMR 的原理 ![原理图](.\imgs\09_HMR_原理.png)
     - webpack-dev-server 会创建两个服务：提供静态资源的服务(express) 和 Socket 服务(net.Socket)
       - express server 负责直接提供静态资源的服务(打包后的资源直接被浏览器请求和解析)
     - HMR Socket Server 是一个 socket 的长连接
       - 长连接的好处是建立连接后双方可以通信(服务端直接发送文件到客户端)
       - 当服务器监听到对应的模块发生变化时，会生成两个文件 .json(manifest 文件)和 .js(update chunk) 文件
       - 通过长连接，可以直接将这两个文件**主动**发送给客户端(浏览器)
       - 浏览器拿到两个新的文件后，通过 HMR runtime 机制，加载这两个文件，并且针对修改的模块进行更新
3. host
   - localhost(默认值)
     - 本质上一个域名，通常情况下会被解析为 127.0.0.1
     - 127.0.0.1：回环地址(Loop Back Address)，自己主机发出去的包，直接被自己接收
       - 正常数据库包：应用层 -> 传输层 -> 网络层 -> 数据链路层 -> 物理层
       - 回环地址：在网络层就被获取到了
   - 0.0.0.0
     - 监听 IPv4 上所有的地址，再根据端口找到不同的应用程序
4. port
   - 默认是 8080
5. open：是否自动打开浏览器，默认为 false
6. compress：gzip 压缩，默认 false
   - html 默认不压缩
   - js 有压缩，响应头中 `Content-Encode: gzip`
7. proxy：开发中常用的配置选项
   - 目的：用于解决跨域访问的问题
   - 原理：
     1. 比如 api 的请求是 http://localhost:8888，但本地启动服务器的域名是 http://localhost:8000，此时发送网络请求会出现跨域错误
     2. 可以将请求先发送到一个代理服务器，代理服务器和 API 服务器没有跨域问题，就可以解决跨域问题了

## resolve 模块解析

```js
/** webpack.config.js */
module.exports = {
  resolve: {
    modules: ["node_modules"], // 默认值
    extensions: [".wasm", ".js", ".json", ".mjs"], // 默认值
    mainFiles: ["index"], // 默认值，且一般不配置
    alias: {
      "@": path.resolve(__dirname, "./src"),
      js: path.resolve(__dirname, "./src/js"),
    },
  },
};
```

- 用于设置模块如何被解析
  - 在开发中我们会有各种各样的模块依赖，这些模块可能来自于自己编写的代码，也可能来自于第三方库
  - resolve 可以帮助 webpack 从每个 require/import 语句中，找到需要引入到合适的模块代码
  - webpack 使用 enhanced-resolve 来解析文件路径
- 解析三种路径
  - 绝对路径
  - 相对路径
  - 模块路径
- 确定是文件还是文件夹
  - 如果是一个文件
    - 如果文件具有扩展名，则直接打包文件
    - 否则，将使用 resolve.extensions 选项作为文件扩展名解析
  - 如果是一个文件夹
    - 会在文件中根据 resolve.mainFiles 配置选项中指定的文件顺序查找
    - 再根据 resolve.extensions 来解析扩展名

## 分离开发环境和生产环境

1. 新建根目录下 config 文件
2. 新建三个文件，webpack.dev.config.js, webpack.prod.config.js, webpack.comm.config.js
3. 将所有东西先放进 webpack.comm.config.js
4. 将不同的东西分别放进 webpack.dev.config.js 和 webpack.prod.config.js
5. `npm install webpack-merge -D`
6. 在 webpack.dev.config.js 中，**路径需要修改**：有的要改有的不用改

   ```js
   const { merge } = require('webpack-merge')

   const commonConfig = require('./webpack.comm.config.js')

   module.exports = merge(commonConfig, { [webpack.dev.config.js 中本身的配置] })
   ```

7. 修改脚本命令，加载不同文件
   ```json
   "scripts": {
     "build": "webpack --config ./config/webpack.prod.config.js",
     "serve": "webpack --config ./config/webpack.dev.config.js"
   }
   ```
8. `npm run build`
