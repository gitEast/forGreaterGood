# webpack

## 一、跨域

### 1.1 什么是跨域？

- 同源策略
  - 目的：重要的安全策略，用于限制一个 origin 的文档 or 它加载的脚本如何能与另一个源的资源进行交互
    - => 帮助阻隔恶意文档，减少可能被攻击的媒介
  - 原理：if 两个 URL 的 protocal、port(如果有指定)和 host 都相同的话，则这两个 URL 同源
  - 这个方案也被称为 “协议/主机/端口元组” or 直接 “元组”
- 跨域的产生与前端分离的发展有很大的关系
  - 早期服务端渲染的时候，没有跨域问题
  - 随着前后端的分离，前端开发的代码和服务器开发的 API 接口分离，甚至部署在不同的服务器上

### 1.2 解决方法

1. 部署到同一个源 by koa-static 库

   ```js
   const Koa = require('koa');
   const static = require('koa-static');

   const app = new Koa();

   app.use(static('./client/index.html'));
   ```

2. CORS，即跨域资源共享
3. node 代理服务器(webpack 中)
4. Nginx 反向代理

### 1.3 CORS

- CORS, Cross-Origin Resource Sharing 跨域资源共享
  - 基于 http header 的机制
  - 允许服务器标示除了它自己以外的其他源，使得浏览器允许这些 origin 访问加载自己的资源
- 分类
  - 简单请求
    - 两个条件
      1. 请求方法是 HEAD, GET, POST 三种之一
      2. HTTP 的头部信息不超过以下几种字段
         - Accept
         - Accept-Language
         - Content-Language
         - Last-Event-ID
         - Content-Type：只限于三个值 application/x-www-form-urlencoded, multipart/form-data, text/plain
    - 开启 CORS
      ```js
      ctx.set('Access-Control-Allow-Origin', '*'); // 允许所有源
      ctx.set('Access-Control-Allow-Origin', 'http:localhost:8000'); // 允许所有源
      ```
  - 非简单请求
    ```js
    ctx.set('Access-Control-Allow-Origin', '*'); // 允许所有源
    ctx.set(
      'Access-Control-Allow-Headers',
      'Accept,Accept-Encoding,Accept-Language,Connection,Content-Length,Content-Type,Host,Origin,Referer,User-Agent'
    );
    ctx.set('Access-Control-Allow-Credentials', true); // 允许携带 Cookie
    ctx.set(
      'Access-Control-Allow-Methods',
      'PUT, POST, GET, PATCH, DELETE, OPTIONS'
    );
    if (ctx.method === 'OPTIONS') {
      ctx.status = 204;
    } else {
      await next();
    }
    next();
    ```

### 1.4 Node 代理服务器

> 前端配置最多的一种方案
> 以 express 为例

```js
const express = require('express');
const { createProxyMiddle } = require('http-proxy-middleware');

const app = express();

appp.use(express.static('../client'));

app.use(
  '/api',
  createProxyMiddle({
    target: 'http://localhost:8000',
    pathRewrite: {
      '^/api': ''
    }
  })
);
```

### 1.5 Nginx 反向代理

```shell
./nginx -s reload # git bash 重启 nginx

```

### 1.6 总结

- 开发阶段配置 proxy (node 代理服务器)
- 发布阶段配置 nginx

## 二、模块化原理和 source-map

Webpack is a static module bundler for modern JavaScript applications.

- bundler: 打包工具
- static: 最终可以将代码打包成静态资源，部署到静态服务器
- module: webpack 默认支持各种模块化开发，ES Module、CommonJS、AMD 等
- modern: 正是因为现代前端开发面临各种各样的问题，才催生了 webpack 的出现和发展

### 2.1 webpack 配置回顾

1. `npm install webpack webpack-cli -D`
2. 注意使用的导入方式，node 相关使用 CommonJS，浏览器相关使用 ES Module
3. 书写测试代码 `src/main.js`
4. `webpack.config.js` 配置

   ```js
   const path = require('path');

   module.exports = {
     entry: './src/main.js',
     output: {
       path: path.resolve(__dirname, './build'),
       filename: 'bundle.js'
     }
   };
   ```

5. `npx webpack`: 使用项目下载的 webpack 而非全局

### 2.2 webpack 的 mode

```js
module.exports = {
  mode: 'development',
  ...
}
```

- Mode 配置选项
  - 作用：告知 webpack 使用相应模式的内置优化
  - value
    - `none` | `development` | `production`(default)
    - 区别
      - `none`: 不使用任何默认优化选项
      - `development`
        1. 将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development`
        2. 为 模块和 chunk 启用有效的名称
      - `production`
        1. 将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production`
        2. 为 模块和 chunk 启用确定性的混淆名称

### 2.3 webpack 模块化原理

### 2.4 认识 source-map

```js
module.exports = {
  mode: 'production',
  devtool: 'source-map'
};
```

- source-map
  - 目的：调试打包前后不一致的代码
  - 原理：从已转换的代码，映射到原始的源文件，使浏览器可以重构原始源，并在调试器中显示重建的原始源
- 使用
  1. 根据源文件，生成 source-map 文件
     - webpack 在打包时，可以通过配置自动生成 source-map
  2. 在转换后的代码的最后，添加一个注释，它指向 source-map
     ```js
     //# sourceMappingURL=common.bundle.js.map
     ```
  3. 浏览器会根据注释，查找相应的 source-map，并根据 source-map 还原代码，方便进行调试
     - Chrome 中需要打开 source-map

### 2.5 source-map 解析

### 2.6 source-map 常见值

- devtool 的值
  - false
  - `none`: `production` 模式下的默认值
  - `eval`: `development` 模式下的默认值
    - 还原大致代码
    - 构建速度快
  - `source-map`: `production` 和 `development` 模式下都可以设置
    - 一般在 `production` 模式下设置
- 开发和测试阶段推荐选择：`source-map` or `cheap-module-source-map`

## 三、Babel

- Babel 是一个工具链
  - 作用：旧浏览器 or 环境中将 ES6 代码转换为向后兼容版本的 JavaScript
  - 功能：语法转换、源代码转换、Polyfil 实现目标环境缺少的功能等

### 3.1 Babel 命令行执行

- Babel 本身可以作为一个独立工具使用
- 使用
  1. 下载 `npm install @babel/core @babel/cli -D`
  2. `npx babel ./src --out-dir ./build`
     - 需要配合插件使用
- 预设 preset
  1. `npm install @babel/preset-env -D`
  2. 命令行使用预设 `npx babel ./src --out-dir ./build --presets=@babel/present-env`

```shell
npm install babel-loader -D
```

```js
/** webpack.config.js */
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
    clean: true // 重新打包时，将之前打包的文件夹删除(新版本 webpack 新增功能)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // loader: 'babel-loader'
        use: {
          loader: 'babel-loader',
          options: {
            // plugins: ['@babel/plugin-transform-arrow-functions']
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

### 3.2 Babel 的底层原理

- 编译器
  - 将源代码转换成目标代码 —— 编译器的工作
  - 工作流程
    - 解析阶段 Parsing
      1. 词法分析 Lexical Analysis => 生成 tokens
      2. 语法分析 Syntactic Analysis (分析是否关键字)
    - 转换阶段 Transformation
      1. 根据 tokens 转换成 AST(抽象语法树)
      2. 通过 plugins 生成新的 抽象语法树
    - 生成阶段 Code Generation
  - [一个小型编译器源码](https://github.com/jamiebuilds/the-super-tiny-compiler)

### 3.3 浏览器兼容性配置

- 代码要不要进行转换取决于要适配的浏览器
- browserslist
  - 在不同的前端工具之间，共享目标浏览器和 Node.js 版本的配置
    - 使用 caniuse-lite 的工具查询 caniuse 网站的数据 (**市场占有率**)
  - 编写规则
    - `defaults`: 默认 `> 0.5%, last 2 versions, Firefox ESR, not dead`
    - `current node`: 指定 Node 版本
    - `iOS 7`: 直接使用 iOS 浏览器版本 7
    - 语法规则
      - `or` or 换行：`||`
      - `and`: `&&`
      - `not`: `!`
  - 命令行
    ```shell
    npx browserslist // 查询所有
    npx browserslist "> 0.5%, last 2 versions, Firefox ESR, not dead" # 带查询条件
    ```
  - 配置方案
    1. 在 package.json 中配置
    2. `.browserslistrc` 文件中配置
       - if 在 `webpack.config.js` 的 presets 中做配置，会覆盖 `.browserslistrc`
         ```js
         module.exports = {
           module: {
             rules: [
               {
                 test: '',
                 use: {
                   loader: 'babel-loader',
                   options: {
                     presets: [
                       [
                         '@babel/preset-env',
                         {
                           targets: '>5%'
                         }
                       ]
                     ]
                   }
                 }
               }
             ]
           }
         };
         ```

### 3.4 Babel 的配置文件

- `babel.config.js`
  ```js
  module.exports = {
    presets: [['@babel/preset-env']]
  };
  ```
  - babel7 后更推荐这种做法
  - 可以直接作用于 Monorepos 项目的子包
- `.babelrc.json`

### 3.5 Babel 和 Polyfill

1. `npm install core-js regenerator-runtime`
2. `babel.config.js`
   ```js
   module.exports = {
     presets: [
       [
         '@babel/preset-env',
         {
           corejs: 3,
           /**
            * useBuiltIns 的值
            *  1. false => 不配置 polyfill，不需要设置 corejs;
            *  2. 'usage' => 根据代码 polyfill
            *  3. 'entry' => 根据入口引入，处理第三方包，并且需要在自己的代码中引入 `import 'core-js/stable' 和 `import 'regenerator-runtime/runtime'
            */
           useBuiltIns: 'usage'
         }
       ]
     ]
   };
   ```

### 3.6 React 和 TS 解析

#### 3.6.1 jsx 解析

1. 案例代码

   ```js
   /** src/index.js */
   import React from 'react'
   import ReactDom from 'react-dom/client'

   import App from './react/App.js'

   const root ReactDom.createRoot()
   ```

2. `ReactDom.createRoot()` 需要容器 `root/index.html`
   - `html-webpack-plugin` 插件
     ```js
     module.exports = {
       plugins: [
         new HtmlWebpackPlugin({
           template: './index.html'
         })
       ]
     };
     ```
3. babel 需要处理 .jsx 文件 `test: /\.jsx?$/`
   - 具体如何处理
     1. 逐一安装、配置对应的插件
     2. 使用预设 `@babel/preset-react`
4. resolve 配置文件后缀
   ```js
   module.exports = {
     resolve: {
       extensions: ['.jsx']
     }
   };
   ```

#### 3.6.2 TS 解析

- `ts-loader`
  1. 使用 `ts-loader` 进行解析
  2. `ts-loader` 要求有一个 `tsconfig.json` 文件: `tsc --init`
- 开发中一般不使用 `ts-loader`，而是使用 Babel
  - 原因：ts 代码也可能需要进行 polyfill
- 使用 `babel-loader`
  - 预设 `@babel/preset-typescript`
  - 缺点：不会进行类型检测
- 实际开发
  - tsc 用于类型校验
    ```json
    {
      "scripts": {
        "ts-check": "tsc --noEmit",
        "ts-check-watch": "tsc --noEmit -watch"
      }
    }
    ```
  - babel 用于转换

## 四、Webpack 开发服务器配置

- Why 需要搭建本地服务器？
  - 为了运行开发的代码，需要两个操作
    1. `npm run build`，编译相关代码
    2. 通过 live server or 直接通过浏览器代码，打开 index.html，查看效果
  - => 影响开发效率
  - 希望：当文件发生变化时，可以自动地完成编译和展示
- webpack 提供的方式
  - webpack watch mode
  - webpack-dev-server (常用)
    1. `npm install webapck-dev-server -D`
    2. 增加脚本 `"serve": "webpack serve"`
    - 高效的原因：在编译之后不会写入到任何输出文件，而是将 bundle 文件保留在内存中 by memfs 库
  - webpack-dev-middleware

### 4.1 本地服务器 server

### 4.2 server 的静态资源

```js
module.exports = {
  devServer: {
    static: ['public'] // 默认 public
  }
};
```

```html
<body>
  <script src="./abc.js"></script>
</body>
```

### 4.3 server 的其他配置

- host: 主机地址
- port
- open: boolean, 是否自动打开浏览器
- compress: boolean, 是否压缩 js 代码

### 4.4 server 的 proxy 代理

```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    }
  }
};
```

### 4.5 changeOrigin 作用

用于修改请求中的 header.host 属性

### 4.6 historyApiFallback

- 作用：解决 SPA 页面在路由跳转之后，进行页面刷新时，返回 404 的错误
- 值：
  - boolean
    - false: default
    - true: 在刷新后返回 404 错误时，会自动返回 index.html 的内容
  - object: 可以配置 rewrites 属性
    - 可以配置 from 来匹配路径，决定跳转到哪一个页面
- 基于 connect-history-api-fallback 库实现的

## 五、webpack 性能优化方案

- 常见面试题
  - 可以配置哪些属性来进行 webpack 性能优化？
  - 前端有哪些常见的性能优化？
    - 其中一个方面 webpack
- 性能优化方案的分类：

  - 打包后的结果：上线时的性能优化 -- 一般侧重这个，对线上的产品影响更大
    - 分包处理
    - 减小包体积
    - CDN 服务器
    - ...
  - 优化打包速度：开发 or 构建时优化打包速度
    - exclude
    - cache-loader
    - ...

- 大多数情况下，webpack 都做好了该有的性能优化
  - 例：配置 mode 为 production or development 时，默认 webpack 的配置信息
  - => 也可以针对性地进行自己的项目优化

### 5.1 代码分离
