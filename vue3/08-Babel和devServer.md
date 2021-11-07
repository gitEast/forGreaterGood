<!--
 * @Author: your name
 * @Date: 2021-11-07 20:14:45
 * @LastEditTime: 2021-11-07 20:48:35
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\08-Babel和devServer.md
-->

# Babel 和 devServer

## Babel

### 介绍 babel

- why need babel?
  - es6+
  - ts
  - react
    - jsx 代码需要通过 babel 转成普通的 js 代码
- babel 是一个工具链
  - 主要用于旧浏览器或者环境中将 ES6+ 代码转换为向后兼容版本的 js 代码
    - 包括语法转换、源代码转换

### 使用 babel

[官网](https://babeljs.io)

#### babel 命令行使用

- 本身可以作为一个独立的工具，不和 webpack 等构建工具配置来单独使用
- 需要安装的库
  - @babel/core：babel 的核心代码，必须安装
  - @babel/cli：可以让 babel 在命令行使用

1. `npm install @babel/core @babel/cli -D`
2. ES6+ 的代码

   ```js
   const msg = "hello";
   const names = ["a", "b", "c"];

   names.forEach((item) => console.log(item));
   ```

3. `npx babel demo.js --out-dir dist` --> 仍然是 ES6 的语法，没有转换
   - 需要转换什么，就要用专门的插件
4. 用了箭头函数 --> 使用箭头函数插件 `npm install @babel/plugin-transform-arrow-functions -D`
5. `npx babel demo.js --out-file test.js --plugins=@babel/plugin-transform-arrow-functions`
6. 常量定义 const `npm install @babel/plugin-transform-block-scoping -D` --> `npx babel demo.js --out-file test.js --plugins=@babel/plugin-transform-arrow-functions,@babel/plugin-transform-block-scoping`
7. ...要吐了

##### babel 的预设 preset

1. `npm install @babel/preset-env -D`
2. `npx babel demo.js --out-file test.js --presets=@babel/preset-env`

### Babel 的底层原理

> babel 是如何将一段代码(es6、ts、react)转成另外一段代码(es5)？

- 这是**编译器**的工作，可以将 babel 看成是一个编译器
- babel 也拥有编译器的工作流程
  - 解析阶段 Parsing
  - 转换阶段 Transformation
  - 生成阶段 Code Generation

## devServer
