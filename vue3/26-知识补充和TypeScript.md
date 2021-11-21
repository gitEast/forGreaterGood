<!--
 * @Author: your name
 * @Date: 2021-11-21 16:11:25
 * @LastEditTime: 2021-11-21 19:21:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\26-知识补充和TypeScript.md
-->

# 知识补充 和 TypeScript

## 知识补充

### historyApiCallback

- 开发中一个非常常见的属性，主要作用：解决 SPA 页面在路由跳转之后，进行页面刷新时，返回 404 的错误
  1. 路径 --> dns 解析 --> ip 地址 --> nginx 服务器 → 静态资源文件夹 --> html/css/js 文件 --> js 代码 - 前端路由：redirect
  2. 路由跳转，刷新
  3. nginx 配置：try files，没有就返回 index.html
     ```shell
     location / {
       root /usr/local/docker/web/gzfsweb/;
       # vue 工程用的路由是 history 模式
       try_files $uri $uri/ /index.html;
       index index.html index.htm;
     }
     ```
  4. 前端再次渲染路由
- boolean：默认 false
  - true: 返回 index.html
- object 值时，可以配置 rewrites 属性

## TypeScript

### 邂逅 TypeScript

> 任何新技术的出现都是为了解决原有技术的某个痛点

- JavaScript 是一门优秀的编程语言
  - Atwood 定律：Any application that can be written in JavaScript, will eventually be written in JavaScript.
    - 正在一步步被应验
      1. Web 一直使用 JavaScript
      2. 移动端开发：借助 RN、Weex、Uniapp
      3. 小程序端
      4. 桌面端：借助 Electron
      5. 服务端：借助 Node 环境
- JavaScript 的痛点
  - 使用的 var 关键字关于**作用域**的问题
  - 数组类型并不是连续的内存空间
  - 没有类型检测机制 --> TypeScript
- 错误应该出现得越早越好
  - 能在**写代码时**发现的错误，就不要在编译时发现
  - 能在**编译期间**发现的错误，就不要在运行期间发现
  - 能在**开发阶段**发现的错误，就不要在测试期间发现
  - 能在**测试期间**发现的错误，就不要在**上线后**发现
- **JavaScript 无法在编译期间发现错误**

#### 认识 TypeScript

- 定义
  - Github: TypeScript is a superset of JavaScript that compiles to clean JavaScript.
  - 官网：TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
- 加强版 JavaScript
  - TypeScript 支持所有 JavaScript 所拥有的特性
  - 不仅增加类型约束，并且包括一些语法的扩展，比如枚举类型(Enum)、元组类型(Tuple)等
  - 实现新特性的同时，总是保持和 ES 标准同步甚至是领先
  - 最终会被编译成 JavaScript 代码，所以不需要担心兼容性问题，在编译时也不需要借助于 Babel 这样的工具
- 应用 TypeScript
  - vscode
  - Angular
  - Vue3
  - Ant-Design 库
  - 小程序开发支持 TypeScript
- TypeScript 编译环境
  - TypeScript --> JavaScript：需要搭建对应的环境
  - tsc：TypeScript compiler
  - babel：plugin/preset

### 学习 TypeScript

- `npm install typescript -g`
  - 自带 tsc
- 当加入 `export {}` 时，每个 .ts 文件都是一个模块
- 如何搭建 HMR 的 TypeScript 运行环境

  - webpack 搭建

    1. `npm init -y`
    2. `npm install webpack webpack-cli -D`
    3. 创建 webpack.config.js 文件
    4. package.json 中添加脚本 `"build": "webpack"`
    5. `npm install ts-loader typescript -D`，报错：没有 tsconfig.json 文件
    6. `tsc --init`
    7. 添加 ts 文件扩展名：`resolve: { extensions: [".ts", ".js"] }`
    8. `npm install webpack-dev-server -D`，package.json 中添加脚本 `"serve": "webpack serve"`
    9. `npm install html-webpack-plugin -D`

       ```js
       const htmlWebpackPlugin = require("html-webpack-plugin");

       plugins: [
        new htmlWebpackPlugin({
          template: "./index.html",
        }),
       ],
       ```

    10. 设置模式：`mode: "development",`

  - ts-node 库，安装后，使用 `ts-node xx.ts` 后，自动编译执行
    1. `npm install ts-node -g`
    2. ts-node 依赖其他的包，`npm install tslib @types/node -g`

- 变量声明
  - var/let/const 标识符: 数据类型 = 赋值;
  - 类型注解
- 使用 tslint
  - `npm install tslint -g`
  - `tslint --init`
- string 和 String 的区别
  - string：数据类型
  - String：包装类
- 直接赋值，没有类型注解 --> 类型推导(推断)
