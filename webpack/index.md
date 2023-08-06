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

- webpack 打包的 bundle.js 文件包含
  1. 自己编写的代码
  2. 项目用到的第三方库
  3. webpack 为了支持运行时的模块化
     - 运行时代码
  - 缺点
    1. 不方便管理
    2. bundle.js 包非常大，影响首屏渲染速度

### 5.1 webpack 代码分离

> 以前学习的是从一个入口出发，生成依赖图，从而生成打包文件。

- 代码分离 Code Splitting
  - 目的：将代码分离到不同的 bundle 中，之后可以按需加载 or 并行加载这些文件
  - 优点：默认情况下，所有的 js 代码都在首页加载，会影响首页的加载速度 => 代码分离可以分出更小的 bundle，以及控制资源加载优先级，提供代码的加载性能
- webpack 常用的代码分离方法
  1. 入口起点：使用 entry 配置手动分离代码
  2. 防止重复：使用 Entry Dependencies or SplitChunksPlugin 去重和分离代码
  3. 动态导入：通过模块的内联函数调用来分离代码

#### 5.1.1 多入口依赖

- 即配置多个入口

  ```js
  module.exports = {
    entry: {
      index: './src/index.js',
      main: './src/main.js'
    },
    output: {
      path: path.resolve(__dirname, './build'),
      // placeholder
      filename: '[name]-bundle.js',
      clean: true
    }
  };
  ```

- 问题：不同的入口文件中有相同的依赖
  ```js
  module.exports = {
    entry: {
      index: {
        import: './src/index.js',
        dependOn: 'shared'
      },
      main: {
        import: './src/main.js',
        dependOn: 'shared'
      },
      shared: ['axios']
    },
    output: {
      path: path.resolve(__dirname, './build'),
      // placeholder
      filename: '[name]-bundle.js',
      clean: true
    }
  };
  ```

实际使用较少。

#### 5.1.2 防止重复

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // async 默认情况; all 第三方包和动态导入都分包
      /**
      maxSize: 20000, // 当包大于指定的大小时，继续进行拆包(也有可能因为有整体不可拆分，所以大于该 size)
      */
      minSize: 100, // 将包拆分成不小于 minSize 的包。 默认值 20000
      // 自己对需要进行拆分的内容进行分包
      cacheGroups: {
        vendor: {
          test: /[/\\]node_modules[/\\]/,
          filename: '[name]_vendors.js'
        },
        utils: {
          test: /utils/,
          filename: '[name]_utils.js'
        }
      }
    }
  }
};
```

- production mode 情况下，有对包的注释进行单独提取
  ```js
  const TerserPlugin = require('terser-webpack-plugin');
  module.exports = {
    optimization: {
      // TerserPlugin: 让代码更加简洁
      minimizer: [
        // js 代码简化
        new TerserPlugin({
          extractComments: false // 默认为 true，提取注释
        })
        // css 简化
      ]
    }
  };
  ```
- chunkId 算法
  ```js
  module.exports = {
    optimization: {
      // development: named 默认
      // production: deterministic 默认 确定性
      chunkIds: 'named'
    }
  };
  ```
  - `natural`: 按照数字的顺序使用 id
  - `named`: development 下的默认值，一个可读的名称的 id
  - `deterministic`: 确定性的，在不同的编译中不变的短数字 id
    - webpack4 中没有这个值
      - 如果使用 `natural`，那么在一些编译发生变化时，就会有问题
    - 不变的话，可以不重新进行下载
  - 建议
    - 开发环境 `named`
    - 打包过程 `deterministic`

#### 5.1.3 动态导入

> Vue/React 的懒加载

- dynamic import 动态导入
  - webpack 提供两种方式
    1. ECMAScript 的 `import()` 函数
    2. webpack 遗留的 `require.ensure`，目前不推荐使用
- 打包文件命名规则(分包)

  ```js
  // 使用魔法注释 webpackChunkName 在 [name] 生效
  btn.onclick = function () {
    import(/* webpackChunkName: "math" */ './utils/math.js');
  };

  module.exports = {
    output: {
      chunkFhilename: '[name]_chunk.js'
    }
  };
  ```

#### 5.1.4 optimization.runtimeChunk 配置

- runtimeChunk
  - 配置 runtime 相关的代码是否抽取到一个单独的 chunk 中
    - runtime 相关的代码：指在运行环境中，对模块进行解析、加载模块信息相关的代码
      - 例如：component、bar 两个通过 import 函数相关的代码加载，就是通过 runtime 代码完成的
  - 抽离的优点
    - 有利于浏览器缓存的策略
      - if 修改了业务代码，那么 runtime 和 component、bar 的 chunk 是不需要重新加载的
  - value
    - `true/multiple`: 针对每个入口打包一个 runtime 文件
    - `single`: 一个
    - 对象：name 属性决定 runtimeChunk 的名称
  - 现在不常用

```js
module.exports = {
  runtimeChunk: {
    name: 'runtime'
  }
};
```

### 5.2 prefetch 和 preload

> webpack v4.6.0+ 增加了对预获取和预加载的支持。

- 声明 import 时，可以使用预获取和预加载两种内置指令
  - prefetch(预获取): 将来某些导航下可能需要的资源
  - preload(预加载): 当前导航下可能需要的资源
- preload 与 prefetch 的区别
  1. preload chunk 会在 parent chunk 加载时，以并行方式开始加载；prefetch chunk 会在 parent chunk 加载结束后开始加载。
  2. preload chunk 具有中等优先级，并立即开始下载；prefetch chunk 在浏览器闲置时下载。
  3. preload chunk 会在 parent chunk 中立即请求，用于当下时刻；prefetch chunk 会用于未来的某个时刻。

```js
btn.onclick = function () {
  import(
    /* webpackChunkName: "category" */
    /* webpackPrefetch: true */
    './router/category'
  ).then((res) => {});
};
```

### 5.3 CDN 加速服务器配置

- 自己的 CDN 配置
  ```js
  module.exports = {
    output: {
      publicPath: '[CDN 地址]/'
    }
  };
  ```
- 引入第三方库的 CDN 配置
  1. 打包时不再需要对第三方库进行打包
     ```js
     module.exports = {
       // 排除某些包不需要打包
       externals: {
         // value: 实际使用时框架名 import key from 'value'
         React: 'react',
         axios: 'axios'
       }
     };
     ```
  2. 在 html 模块中，需要自己加入对应的 CDN 服务器地址
     ```html
     <body>
       <script src="[CDN 地址第三方库]"></script>
     </body>
     ```

### 5.4 CSS 样式的单独提取

1. 处理 CSS 文件：`style-loader`, `css-loader`
   ```js
   module.exports = {
     module: {
       rules: [
         {
           test: /\.css/,
           use: ['style-loader', 'css-loader']
         }
       ]
     }
   };
   ```
2. 提取 CSS 文件: `mini-css-extract-plugin`

   ```js
   const MiniCssExtractPlugin = require('');

   module.exports = {
     rules: [
       {
         test: /\.css/,
         use: [
           // 'style-loader',  // 开发环境
           MiniCssExtractPlugin.loader, // 生产环境
           'css-loader'
         ]
       }
     ],
     plugins: [
       new MiniCssExtractPlugin({
         filename: 'css/[name]_[hash:6].css',
         chunkFilename: 'css/[name]_[hash:6]_chunk.css' // 动态导入的分包
       })
     ]
   };
   ```

   - 建议使用 `contenthash` or `chunkhash`

### 5.5 JS 和 CSS 代码压缩

- Terser
  - 一个 JavaScript 的解释 Parser、绞肉机 Mangler/压缩机 Compressor 的工具集
  - 作用：压缩、丑化代码，使 bundle 变得更小
  - 由 uglify-es fork 而来，并保留原来大部分 API 以及适配 uglify-es 和 uglify-js
  - webpack 中的配置(TerserPlugin)
    - extractComments: default true, 将注释抽取到一个单独的文件中
    - parallel: default true，使用多进程并发运行提升构建的速度
      - 并发运行默认的数量：`os.cups().length - 1`
      - 也可以自己设置个数
    - terserOptions: 设置 terser 相关配置
      - Compress options
        - arrows: class or object 中的函数，转换成箭头函数
        - arguments: 将函数中使用 arguments[index] 转成对应的形参名称
        - dead_code: 移除不可达的代码 tree shaking
        - ...
      - Mangle options
        - toplevel: default false，顶层作用域中的变量名称，进行丑化
        - keep_classnames： default false，是否保持依赖的类名称
        - keep_fnames：default false，是否保持原来的函数名称
        - ...
- CSS 压缩
  - `css-minimizer-webpack-plugin` 插件
    - 使用 cssnano 工具来优化、压缩 CSS

```js
module.exports = {
  mode: 'production',
  minimize: true, // production 模式下默认为 true；development 模式下 false
  minimizer: [
    // js 压缩插件
    new TerserPlugin({
      extractComments: false, // 第三方的注释不抽取到单独的文件
      terserOptions: {
        // 压缩相关配置项
        compress: {
          arguments: true,
          unused: true // 删除 dead_code
        },
        mangle: true, // 是否丑化
        toplevel: true // 顶层变量是否进行转换
      }
    }),
    new CSSMinimizerPlugin({})
  ]
};
```

### 5.6 Tree Shaking 的实现

#### 5.6.1 webpack 抽取

> 代码太多了，分不同情况抽取

- 不同的情况
  - 所有情况通用：`comm.config.js`
  - 生产环境：`prod.config.js`
  - 开发环境：`dev.config.js`
- package.json 脚本命令修改
  - 生产环境：`"build": "webpack --config ./config/comm.config.js --env production"`
  - 开发环境：`"build": "webpack --config ./config/comm.config.js --env development"`
- 合并插件 `webpack-merge`

```js
/** comm.config.js */
const { merge } = require('webpack-merge');

const devConfig = require('./dev.config');
const prodConfig = require('./prod.config');

const getCommonConfig = function (isProduction) {
  return {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProduction: MiniCssExtractPlugin.loader: 'style-loader',
          'css-loader'
        ]
      }
    ]
  };
};

module.exports = function (env) {
  console.log(env); // 根据命令不同，传入的值也不同 { production: true } / { development: true }
  const isProduction = env.production;
  const customConfig = isProduction ? prodConfig : devConfig;
  return merge(getCommonConfig(isProduction), customConfig);

  if (isProduction) {
    console.log('生产环境');
  } else {
    console.log('开发环境');
  }
};
```

```js
/** dev.config.js */
module.exports = {
  mode: 'development'
};
```

#### 5.6.2 Tree Shaking

- Tree Shaking
  - 术语，在计算机中表示消除 dead_code
  - 最早起源于 LISP，用于消除未调用的代码
    - 纯函数：无副作用，可以放心地消除 —— why 要求在进行函数式编程时，尽量使用纯函数的原因之一
  - 后来也被应用于其他语言: JavaScript, Dart
- JavaScript 中的 Tree Shaking
  - 打包工具 rollup 所做
  - 依赖于 ES Module 的静态语法分析
    - 不执行任何代码，即可明确知道模块的依赖关系
  - webpack
    - webpack2 正式内置了 ES6 模块，和检测未使用模块的能力
    - webpack4 正式扩展了这个能力，并且通过 package.json 的 sideEffects 属性作为标记 => 告知 webpack 在编译时，哪里的文件可以安全地删除掉
    - webpack5 中提供了对部分 CommonJS tree shaking 的支持
      - 相对 ES Module 而言没有那么好用
- webpack 实现 Tree Shaking
  - 方案一：useExports
    - 通过标记某些函数是否被使用，之后通过 Terser 来进行优化
    ```js
    module.exports = {
      mode: 'development',
      optimization: {
        usedExports: true // 导入模块时，分析模块中哪些函数有被使用、哪些没有被使用，并添加注释
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({...})
      ]
    };
    ```
  - 方案二：sideEffects
    - 跳过整个模块/文件，直接查看该文件是否有副作用
      ```json
      {
        "sideEffects": false
      }
      ```
      - 告知 webpack 可以安全地删除未用到的 exports
      ```json
      {
        "sideEffects": ["./src/utils/math.js", "*.css"]
      }
      ```
      - 一些希望保留的 exports
  - 建议：平时编写模块时，尽量编写纯模块
  - 最佳方案
    - optimization 中配置 usedExports 为 true
    - package.json 中配置 sideEffects，直接对模块进行优化
- webpack 对 CSS 的压缩

  - 插件：`purgecss-webpack-plugin`
    - 安装 glob 模块：`npm install glob -D`

  ```js
  const { PurgeCSSPlugin } = require('puegecss-webpack-plugin');
  const glob = require('glob');

  module.exports = {
    plugins: [
      new PurgeCSSPlugin({
        paths: glob.sync(`${path.resolve(__dirname, '../src')}/**/*`, {
          nodir: true
        })
      })
    ]
  };
  ```

### 5.7 Scope Hoisting 作用

> 作用域提升

- Scope Hoisting
  - 功能：对作用域及逆行提升，并且使 webpack 打包后的代码更小、运行更快
  - 从 webpack3 开始新增的功能
- 不同模式下
  - production 模式下默认开启
  - development 模式下默认关闭

```js
module.exports = {
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()]
};
```

### 5.8 HTTP 文件压缩传输

- HTTP 压缩
  - 一种内置在服务器和客户端之间的、以改进传输速度和带宽利用率的方式
  - 流程
    1. HTTP 数据在服务器发送前就已经被压缩(可在 webpack 中完成)
    2. 兼容的浏览器在向服务器发送请求时，会告知服务器自己支持哪些压缩格式
       ```
       GET /encrypted-area HTTP/1.1
       Host: www.example.com
       Accept-Encoding: gzip, deflate
       ```
    3. 服务器在浏览器支持的压缩格式下，直接返回对应的压缩后的文件，并在响应头中告知浏览器
       ```
       HTTP/1.1 200 OK
       Date: Tue, 27 Feb 2018 06:03:16 GMT
       Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT
       Accept-Rnages: bytes
       Connect-Length: 438
       Connection: close
       Content-Type: text/html; charset=UTF-8
       Content-Encoding: gzip
       ```
  - 压缩格式
    - compress
      - UNIX 的 “compress” 程序的方法
      - 历史性原因，不推荐大多数应用使用
    - deflate：基于 `deflate` 算法(定义于 RFC 1951) 的压缩，使用 zlib 数据格式封装
    - gzip
      - GNU zip 格式(定义于 RFC 1952)
      - 目前使用比较广泛的压缩算法
    - br
      - 一种新的开源压缩算法
      - 专为 HTTP 内容的编码而设计
- webpack 使用 gzip 压缩
  1. 安装插件 `compression-webpack-plugin`
  2. webpack 配置
     ```js
     const CompressionPlugin = require('compression-webpack-plugin');
     module.exports = {
       plugins: [
         // 对打包后的文件进行压缩
         new CompressionPlugin({
           test: /\.(js|css)$/,
           algorithm: 'gzip'
         })
       ]
     };
     ```

### 5.9 HTML 文件的压缩

```js
function getCommonConfig(isProduction) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        cache: true, // 改变时才生成新的文件
        minify: isProduction
          ? {
              removeComments: true, // 移除注释
              removeEmptyAttributes: true, // 移除空属性
              removeRedundantAttributes: true, // 移除默认属性
              collapseWhitespace: true, // 折叠空白字符
              minifyCSS: true, // 压缩内联的 CSS
              // 压缩 JS
              minifyJS: true: {
                mangle: {
                  toplevel: true
                }
              }
            }
          : false
      })
    ]
  };
}
```

### 5.10 webpack 打包分析

- 打包时间分析

  - speed-measure

    ```js
    const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

    const smp = new SpeedMeasurePlugin();

    module.exports = function (env) {
      // ...
      return smp.wrap(finalConfig);
    };
    ```

- 打包后的文件分析
  1. 官方工具
     ```json
     {
       "scripts": {
         "build": "webpack --config ./config/comm.config.js --env production --profile --json=stats.json"
       }
     }
     ```
     - 查看分析文件 stats.json
       1. https://github.com/webpack/analyse，下载代码并安装依赖
       2. 安装 grunt 工具，并执行命令 `grunt dev`
  2. 安装插件 `bundle-analyzer-webpack-plugin`
  3. plugins 中使用
     ```js
     module.exports = {
       plugins: [new BundleAnalyzerPlugin()]
     };
     ```

## 六、webpack 源码解析

1. 源码一般在 lib/packages 文件夹下
2. 手动引入 webpack 使用

   ```js
   /** build.js */
   const webpack = require('../lib/webpack');
   const config = require('./webpack.config');

   const compiler = webpack(config);

   compiler.run((err, stats) => {
     if (err) {
       console.log(err);
     } else {
       console.log(stats);
     }
   });
   ```

## 七、webpack 自定义 loader 和 plugin

### 7.1 自定义 loader

- 认识自定义 Loader
  - Loader
    - 本质：一个导出为函数的 JavaScript 模块
      - loader runner 库会调用这个函数，然后将上一个 loader 产生的结果 or 资源文件传入
    - 作用：对模块的源代码进行转换(处理)
    - 接收三个参数
      - content: 资源文件内容
      - map: sourcemap 相关的数据
      - meta: 一些元数据
      ```js
      module.exports = function (content, map, meta) {
        return content;
      };
      ```
  - 自定义 Loader
    - module 中 use 模块的格式与一般 loaders 相同，需要在 resolveLoader 中做配置
      ```js
      module.exports = {
        resolveLoader: {
          modules: ['node_modules', './custom-loaders']
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['custom_loader01', 'custom_loader02', 'custom_loader03']
            }
          ]
        }
      };
      ```
- Loader 的加载顺序
  - 顺序：从后往前，自下而上
  - pitch 函数
    ```js
    module.exports.pitch = function () {};
    ```
  - 真正的顺序
    1. 顺序执行 pitchLoader <- loaderIndex++
    2. 逆序执行 NormalLoader <- loaderIndex--
  - 修改对应的顺序 by enforce
    - 默认所有的 loader 都是 normal
    - 在行内设置 inline `import 'loader1!loader2!./test.js'`
    - 设置 pre 和 post by enforce
      ```js
      module.exports = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: 'custom_loader01',
              enforce: 'post' // 最后执行
            },
            {
              test: /\.js$/,
              use: 'custom_loader02',
              enforce: 'pre' // 最先执行
            },
            {
              test: /\.js$/,
              use: 'custom_loader03'
            }
          ]
        }
      };
      ```
    - 执行顺序
      - pitch: post -> inline -> normal -> pre
      - normal: pre -> normal -> inline -> post
- 同步和异步 Loader
  - 同步返回：`const callback = this.callback`
  - 异步：`const callback = this.async()`
- 获取以及校验参数

  - 传入参数格式
    ```js
    module.exports = {
      module: {
        rules: [
          {
            test: /\.js$/,
            use: [
              {
                loader: 'xxx',
                options: {
                  plugins: [],
                  presets: [],
                  name: 'east'
                }
              }
            ]
          }
        ]
      }
    };
    ```
  - 获取参数
    ```js
    module.exports = function (content) {
      const options = this.getOptions();
      console.log(options); // { plugins: [], presets: [], name: 'east' }
      return content;
    };
    ```
  - 校验参数 by schema-utils 官方库

    ```js
    const { validate } = require('schema-utils');

    const loaderSchema = require('./schema/loader_schema.json');

    module.exports = function (content) {
      const options = this.getOptions();
      console.log(options); // { plugins: [], presets: [], name: 'east' }

      // params: 校验规则, options
      validate(loaderSchema, options);

      return content;
    };
    ```

    ```json
    // 校验规则
    {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "请输入名称，并且是 string 类型"
        },
        "age": {
          "type": "number",
          "description": "请输入年龄，并且是 number 类型"
        }
      }
    }
    ```

- babel-loader 案例练习

  1. 安装 `@babel/core`
  2. 使用 `babel.transform(content, options, successCb)`

     - options

       ```js
       const moduleOptions = {
         // plugins: ['@babel/plugin-transform-arrow-functions'],
         presets: ['@babel/preset-env']
       };

       let options = this.getOptions();

       if (!Object.keys(options).length) {
         options = require('../babel.config');
       }
       ```

     - successCb: `(err, result) => {}`
       ```js
       const successCb = (err, result) => {
         if (err) callback(err);
         else callback(null, result.code); // babel 转换后的代码在 code 里
       };
       ```

- markdown-loader 案例练习

  ```js
  /** custom-md-loader */
  const { marked } = require('marked');

  module.exports = function (content) {
    const htmlContent = marked(content);
    const innerContent = '`' + htlmContent = '`'
    const moduleContent = `var code = ${innerContent}; export default code;`

    return moduleContent;
  };
  ```

  ```js
  /** main.js */
  import code from './learn.md';

  console.log(code);

  document.body.innerHTML = code;
  ```

  - 要求返回的结果必须是模块化的内容
  - 代码高亮 `highlight.js`

    ```js
    const hljs = require('highlight.js');

    marked.setOptions({
      highlight: function (code, lang) {
        return hljs.highlight(lang, code).value;
      }
    });
    ```

### 7.2 自定义 plugin

- tapable 的使用介绍
  - 与 webpack 的使用
    - webpack 中有两个非常重要的类：Compiler 和 Compilation
    - 通过注入插件的方式，来监听 webpack 的所有生命周期
      - 插件的注入需要 hook
      - 创建 Tapable 库中的各种 hook 实例
  - 提供的 Hook
    - 同步 sync
      - SyncHook
      - SyncBailHook
      - SyncWaterfallHook
      - SyncLoopHook
    - 异步 async
      - Parallel 并行: 不会等到上一个事件回调结束才执行下一次事件处理回调
        - AsyncParallelHook
        - AsyncParallelBailHook
      - Series 串行: 等待上一个异步事件完成
        - AsyncSeriesHook
        - AsyncSeriesBailHook
        - AsyncSeriesWaterfallHook
    - 其他分类
      - bail: 当有返回值时，会阻断后续事件继续执行
      - loop: 当返回值 = `true` 时，反复执行该事件；当返回值 = `undefined` or 不返回时，退出事件
      - waterfall: 当返回值 != `undefined` 时，将本次返回的结果作为下一次事件的第一个参数
        - 原本第一个会被修改
- tapable 的同步操作

  ```js
  /** 基本使用 */
  const { SyncHook } = require('tapable');

  class CustomCompiler {
    constructor() {
      this.hooks = {
        // 1. 创建 hook
        syncHook: new SyncHook(['name', age])
      };

      // 2. 用 hooks 监听事件(自定义 plugin)
      this.hooks.syncHook.tap('event1', (name, age) => {
        console.log('event1事件监听执行', name, age);
      });
      this.hooks.syncHook.tap('event2', (name, age) => {
        console.log('event2事件监听执行', name, age);
      });
    }
  }

  const compiler = new CustomCompiler();
  compiler.hooks.syncHook.call('east', 23);
  ```

- tapable 的异步操作

  ```js
  /** 串行 */
  const { AsyncSeriesHook } = require('tapable');

  class CustomCompiler {
    constructor() {
      this.hooks = {
        // 1. 创建 hook
        seriesHook: new AsyncSeriesHook(['name', age])
      };

      // 2. 用 hooks 监听事件(自定义 plugin)
      this.hooks.seriesHook.tapAsync('event1', (name, age, callback) => {
        console.log('event1事件监听执行', name, age);
        callback();
      });
      this.hooks.seriesHook.tapAsync('event2', (name, age, callback) => {
        console.log('event2事件监听执行', name, age);
        callback();
      });
    }
  }

  const compiler = new CustomCompiler();
  compiler.hooks.seriesHook.callAsync('east', 23, () => {
    console.log('所有事件执行完毕');
  });
  ```

- 自定义 Plugin 的流程
  1. 在 webpack 函数的 createCompiler 方法中，注册了所有的插件
  2. 在注册插件时，会调用插件函数 or 插件对象的 apply 方法
  3. 插件方法接收 compiler 对象，可以通过 compiler 对象来注册 hook 事件
  4. 某些插件也会传入一个 compilation 对象，用于监听 compilation 的 hook 事件
- 自定义 Plugin 的练习

  - 将静态文件自动上传服务器

    ```js
    const { NodeSSH } = require('node-ssh');

    class AutoUploadWebpackPlugin {
      constructor() {
        this.ssh = new NodeSSH();
      }

      apply(compiler) {
        compiler.hooks.afterEmit.tapAsync(
          'AutoUpload',
          async (compilation, callback) => {
            // 1. 获取输出文件夹路径
            const outputPath = compilation.outputOptions.path;

            // 2. 连接远程服务器 SSH by node-ssh 库
            await this.connectServer();

            // 3. 删除文件夹中原有内容
            const remotePath = '/root/test/';
            this.ssh.execCommand(`rm -rf ${remotePath}*`);

            // 4.将文件夹中资源上传至服务器中
            await this.uploadFiles(outputPath, remotePath);

            // 5. 关闭 ssh 连接
            this.ssh.dispose();

            // 完成所有操作后，调用 callback
            callback();
          }
        );
      }

      async connectServer() {
        await ssh.connect({
          host: 'host',
          username: 'root',
          password: 'xxxx'
        });
        console.log('服务器连接成功');
      }

      async uploadFiles(localPath, remotePath) {
        // params: localPath, remotePath
        const status = await this.ssh.putDirectory(localPath, remotePath, {
          recursive: true, // 递归上传
          concurrency: 10 // 并发上传
        });
        if (status) {
          console.log('文件上传成功');
        }
      }
    }

    module.exports = AutoUploadWebpackPlugin;
    module.exports.AutoUploadWebpackPlugin = AutoUploadWebpackPlugin;
    ```

## 八、自动化工具 gulp

A toolkit to automate & enhance your workflow.

### 8.1 gulp 和 webpack

- gulp
  - 核心理念：task runner
    - 可以定义自己的一系列任务，等待任务被执行
    - 基于文件 Stream 的构建流
    - 可以使用 gulp 的插件体系来完成某些任务
  - 相对于 webpack 的优缺点
    - 优点：相对于 webpack 思想更加的简单、易用，更适合编写一些自动化任务
    - 缺点：不支持模块化(大型项目不会使用 gulp 来构建)
- webpack
  - 核心理念：module bundler
    - 一个模块化的打包工具
    - 可以使用各种各样的 loader 来加载不同的模块
    - 可以使用插件在 webpack 打包的生命周期完成其他任务

### 8.2 编写 gulp 的任务

1. `npm install gulp -D`
2. 创建 `gulpfile.js`
3. 执行命令
   - 单个任务执行 `npx gulp [任务名]`

```js
/** gulpfile.js */
const gulp = require('gulp');

const foo = (cb) => {
  console.log('第一个任务');
  cb();
};

// 早期编写任务的方式(gulp4.x 之前)
gulp.task('foo2', (cb) => {
  console.log('第二个任务');
  cb();
});

module.exports = {
  foo
};
```

- gulp 任务
  - 每个 gulp 任务都是一个 异步的 JavaScript 函数
    - 此函数可以接收一个 callback 作为参数，调用 callback 函数，任务结束
    - or 返回一个 stream、promise、event emitter、child process 或 observable 类型的函数
  - 任务可以是 public or private 类型的
    - 公开任务 public tasks: 从 gulpfile 中被导出，可以通过 gulp 命令直接调用
    - 私有任务 private tasks: 被设计为在内部使用，通常作为 `series()` or `parallel()` 组合的组成部分
  - 默认任务
    ```js
    module.exports.default = function (cb) {
      console.log('默认任务执行');
      cb();
    };
    ```
    - shell 命令：`npx gulp`

### 8.3 gulp 的任务组合

```js
const { series, parallel } = require('gulp');

const foo1 = function () {};
const foo2 = function () {};
const foo3 = function () {};

const seriesFoo = series(foo1, foo2, foo3);
const parallelFoo = parallel(foo1, foo2, foo3);

module.exports = {
  seriesFoo,
  parallelFoo
};
```

### 8.4 gulp 的文件操作

```js
const { src, dest } = require('gulp');

const copyFile = () => {
  // 1.读取文件 2.写入文件
  // return src('./src/main.js').pipe(desc('./dist'));
  // src 下所有文件
  return src('./src/**/*.js').pipe(desc('./dist'));
};

module.exports = {
  copyFile
};
```

```js
/** 压缩代码 */
const { src, dest, watch } = require('gulp');
const babel = require('gulp-babel');

const jsTask = () => {
  return src('./src/**/*,js')
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(desc('./dist'));
};

watch('./src/**/.js', jsTask);
```

### 8.5 gulp 的案例演练

- 功能包括
  - 打包 html <- `gulp-htmlmin`
  - 打包 js <- `gulp-babel` + `gulp-terser`
  - 打包 less <- `gulp-less`
  - html 资源注入 <- `gulp-inject`
  - 开启本地服务 <- `brwoser-sync`
  - 创建打包任务
  - 创建开发任务

### 8.6 gulp 开发和构建
