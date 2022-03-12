<!--
 * @Author: east
 * @Date: 2021-11-06 20:26:52
 * @LastEditTime: 2022-02-23 14:43:26
 * @LastEditors: Please set LastEditors
 * @Description: webpack 基础打包 and css 打包
 * @FilePath: \vue3\06-webpack基础打包.md
-->

# webpack 基础打包 和 css 打包

## webpack

### 认识 webpack

> vue-cli 基于 webpack

- 前端的开发越来越复杂
  - 需要使用**模块化的方式**来开发
  - 使用一些**高级的特性**来加快开发效率或安全性 -- es6+、ts、sass、less...
  - 实时监听文件变化，并且反映到浏览器上 -- **热更新**
  - 将代码进行**压缩、合并以及其他相关的优化**
- 但实际上不一定需要考虑这些问题
  1. 前端开发通常直接使用三大框架来开发：Angular、React、Vue
  2. 三大框架的创建过程借助于**脚手架(CLI)**
  3. Vue-CLI、create-react-app、Angular-CLI 都是基于 webpack 的
- **webpack is a static module bundler for modern JavaScript applications.** ![webpack 官方的图片](imgs\06_webpack.png)
  - bundler：打包工具
  - static：将代码打包成最终的静态资源(部署到静态服务器)
  - module：默认支持各种模块化开发
  - modern：现代前端面临各种各样的问题

### webpack 的使用

#### 安装 webpack

- webpack 的安装分为 webpack、webpack-cli
  - `npm install webpack webpack-cli -g`
  - webpack、webpack-cli 的关系
    1. 执行 webpack 命令，会执行 node_modules 下的.bin 目录
    2. webpack 在执行时是依赖 webpack-cli 的，如果没有安装就会报错
    3. 而在 webpack-cli 中代码执行时，才是真正利用 webpack 进行编译和打包的过程
    4. 所以在安装 webpack 时，需要同时安装 webpack-cli (第三方的脚手架实际上没有使用 webpack-cli，而是类似于自己的 vue-service-cli 的东西)

#### 简单使用

```js
/** src/js/math.js */
export function sum(num1, num2) {
  return num1 + num2;
}

/** src/js/format.js */
const priceFormat = function () {
  return "$99.88";
};
module.exports = {
  priceFormat,
};

/** src/index.js */
import { sum } from "./js/math.js";
const { priceFormat } = require("./js/format.js");

console.log(sum(20, 30));
console.log(priceFormat());
```

`git bash: webpack`

```html
<script src="./dist/main.js" type="module"></script>
```

- 优点：
  1. 压缩了体积
  2. 浏览器能够运行代码
- 问题：
  1. 使用了全局的 webpack --> 会对项目有影响，比如升级导致的不兼容问题
- 实际开发：项目中有自己的 webpack，即局部安装

  ```shell
  npm init -y
  npm install webpack webpack-cli --save-dev
  npx webpack
  ```

  1. 只在开发中使用，所以是开发时依赖，使用 `--save-dev` or `-D`
  2. 可以在脚本中添加 `"build": "webpack"`，脚本中不需要加上 npx --> `npm run build`
  3. 默认入口：/src/index.js --> 设置入口 `[shell] --entry ./src/index.js`
  4. 实际上会有一个配置文件 webpack.config.js

     ```js
     const path = require("path");

     module.exports = {
       entry: "./src/index.js",
       output: {
         path: path.resolve(__dirname, "./build"), // 要求绝对路径
         filename: "bundle.js",
       },
     };
     ```

  5. 再次安装会有缓存

#### webpack 的依赖图

> webpack 到底是如何对项目进行打包的呢？

1. webpack 在处理应用程序时，会根据命令 or 配置文件找到入口文件
2. 从入口开始生成一个依赖关系图，这个依赖关系图会包含应用程序中所需的所有模块
3. 然后遍历图结构，打包一个个模块(根据文件的不同会使用不同的 loader 来解析)

#### 打包 css

1. `npm install`，会有缓存，所以速度很快
2. webpack 默认情况下不支持 css，需要专门的 loader，`npm install css-loader -D` ---- webpack 本身是一个生态
3. 使用 css-loader

   1. 内联形式 `import "css-loader!../css/style.css";`
   2. webpack.config.js 中配置
   3. 但是 css 没有生效，因为 css-loader 只解析 .css 文件，并不会把解析之后的 css 插入到页面中
   4. 需要 style-loader 完成插入 style 的操作 `npm install style-loader -D`
   5. loader 加载顺序：下 → 上 or 右 → 左

      ```js
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
      ```

#### loader 的配置方式

> module.rules 允许配置多个 loader

- rules 属性对应的值是一个数组：[Rule]
- 数组中存放的是一个个的 Rule，Rule 是一个对象，对象中可以设置多个属性
  - test 属性：用于对 resource(资源)进行匹配的，通常会设置成正则表达式
  - use 属性：对应的值是一个数组 [ UseEntry1, UseEntry2 ]
    - UseEntry 是一个对象，内有多个属性
      - loader：必须有一个 loader 属性，对应的是字符串
      - options：可选，字符串 or 对象，值会被传入 loader
      - query：目前改用 options 替代
    - 如果不用 UseEntry 而是传入一个字符串，则为 loader 属性的简写方式
  - loader 属性：use 属性中 loader 的简写

#### 打包 less

1. 项目内(与 webpack 无关)：`npm install less -D`，`npx lessc 源文件 目标文件`
2. less-loader：`npm install less-loader -D`
3. loader 的配置

#### PostCSS 工具

> PostCSS 是一个通过 JavaScript 来转换样式的工具

- 使用 PostCSS
  1. 查找 PostCSS 在构建工具中的扩展，比如 webpack 中的 postcss-loader
  2. 选择可以添加的需要的 PostCSS 相关的插件
- 命令行使用
  - `npm install postcss postcss-cli -D`
