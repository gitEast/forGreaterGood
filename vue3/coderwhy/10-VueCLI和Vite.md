<!--
 * @Author: East
 * @Date: 2021-11-09 20:55:59
 * @LastEditTime: 2021-11-10 11:03:11
 * @LastEditors: Please set LastEditors
 * @Description: VueCLI 和 Vite
 * @FilePath: \forGreaterGood\vue3\10-VueCLI和Vite.md
-->

# Vue CLI 和 Vite

## Vue CLI

> 在真实项目中，我们不可能每一个项目都从头来完成所有的 webpack 配置，通常使用脚手架来创建一个项目

### 介绍

- 全称：Command-Line Interface，命令行界面
- 通过 CLI 选择项目的配置和创建项目
- Vue CLI 已经内置了 webpack 相关的配置

### 安装与使用

- Vue CLI 是一个工具，所以需要安装
  - 全局安装 --> 在任何时候都可以通过 vue 的命令来创建项目
- 安装：`npm install @vue/cli -g`
- 升级：`npm update @vue/cli -g`
- 创建：`vue create [项目名称]`

## Vite

### 认识 Vite
+ 除 webpack 外其他构建工具
  - rollup
  - parcel
  - gulp
  - vite
+ 官方定位：下一代前端开发与构建工具
+ 如何定义下一代开发与构建工具？
  1. 在实际开发中，编写的代码往往是不能被浏览器直接识别的，如 es6、ts、vue 文件等
  2. 所以必须通过构建工具来对代码进行转换、编译
  3. 但是随着项目越来越大，需要处理的 JavaScript 呈指数级增长，模块越来越多
  4. 构建工具需要很长的时间才能开启服务器，HMR 也需要几秒钟才能在浏览器反映出来
  5. 所以也有这样的说法：天下苦 webpack 久矣
+ vite 是一种新型前端构建工具，能够显著提升前端开发体验

### vite 的构造
+ 主要有两部分组成
  - 一个开发服务器：基于原生 ES 模块提供了丰富的内建功能，HMR 的速度非常快
  - 一套构建指令：使用 rollup 打开代码，并且是预配置的，可以输出生产环境的优化过的静态资源
+ 问题
  - vite 不够稳定
  - 整个社区插件等支持也不够完善
  - 实际应用不够
+ 原生浏览器的弊端 -- 支持 es module
  - 不识别 .ts、.vue 等文件
  - 依赖过多文件时，会发送大量网络请求

### vite 的使用
1. 安装 vite：`npm install vite -D`
2. 使用：`npx vite`
   + 默认支持 .js、.css、.ts 文件
   + 不支持 .less 文件
3. `npm install less -D`：即可支持 less
4. 浏览器前缀步骤
   1. `npm install postcss -D`
   2. `npm install postcss-preset-env -D`
   3. 配置 postcss.config.js 文件
5. 支持 vue
   1. `npm install vue@next -D`
   2. vue 文件的支持
      + vue3 单文件：@vitejs/plugin-vue
      + vue3 jsx：@vitejs/plugin-vue-jsx
      + vue2：underfin/vite-plugin-vue2
   3. `npm install @vitejs/plugin-vue -D`
   4. vite.config.js 配置 -- 插件需要配置
      ```js
      module.exports = {
        plugins: [
          vue()
        ]
      }
      ```
6. 打包项目：`npx vite build`
7. 在浏览器中测试打包后的效果：`npx vite preview`
  

### vite 的原理
1. 建立一个本地的服务器
   + vite1：koa
   + vite2：Connect 库
2. 请求时直接请求了 .ts 和 .less 文件
3. vite 工具转换了 .ts 和 .less 文件 --> es6 js 代码
4. 会对 node_modules 中用到的模块进行预打包

#### ESBuild 解析
+ 特点
  - 超快的构建速度，而且不需要缓存
  - 支持 ES6 和 CommonJS 的模块化
  - 支持 ES6 的 tree shaking
  - 支持 Go、JavaScript 的 API
    - ESBuild 是使用 Go 实现的
  - 支持 TypeScript、JSX 等语法编译
  - 支持 SourceMap
  - 支持代码压缩
  - 支持扩展其他插件
+ 构建速度
  - 只能说 ESBuild yyds
+ 问题：部分语法不支持
+ 速度为什么快？
  + ESBuild 使用 Go 语言编写，可以直接转换成机器代码，而无需经过字节码
  + ESBuild 可以充分利用 CPU 的多内核，尽可能让它们饱和运行
  + ESBuild 的所有内容都是从零编写的，没有使用第三方包，从一开始就考虑各种性能问题

### vite 脚手架
1. `npm install @vitejs/create-app -g`
2. `create-app [项目名称]` -- 已过时
3. `npm init vite`：该命令应该在想要创建项目的地方输入，会自动创建新项目文件夹

## 补充

- 为什么通过 @vue/cli 创建项目用的是 `vue create [项目名称]` 而不是 `@vue/cli create`？
  - 安装 @vue/cli 之后，配置了 package.json 文件，.bin 配置选项中写了 `bin: { 'why': 'bin/xxxx.js' }`，敲 why，实际执行的是 bin/xxx.js 文件
