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
