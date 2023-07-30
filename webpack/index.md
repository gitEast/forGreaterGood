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
