# Node.js

- requirements
  1. always code along
  2. solve coding challenges
  3. take notes
  4. take the entire course

## 一、Node 服务器和常见模块

### 1.1 Node 服务器开发

- Node.js 是什么
  - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
  - Node.js 基于 V8 引擎来执行代码，但也不仅仅只有 V8 引擎
    - 解析、渲染 HTML 和 CSS，支持浏览器操作，事件循环
    - 文件系统读写、网络 IO、压缩解压文件
- libuv
  - 使用 C 语言编写的库
  - 提供 事件循环、文件系统读写、网络 IO、线程池等

### 1.2 fs 模块-文件系统

> fs: file system

- Node 封装的文件系统：跨平台
- API
  - 提供三种操作方式
    1. 同步操作文件：代码会被阻塞，停止执行
    2. 异步回调函数操作文件：代码不会被阻塞，需要传入回调函数，当获取到结果时，回调函数被执行
    3. 异步 Promise 操作文件：代码不会被阻塞，通过 `fs.promises` 调用方法操作，返回一个 Promise，可以通过 then、catch 进行处理
  - 常用的 API
    - 读取文件
      ```js
      // node 中使用 commonjs 更多
      const fs = require('fs');
      // 1. 同步读取
      const res1 = fs.readFileSync('./abc.txt');
      console.log(res1);
      // 2. 异步读取：回调
      fs.readFile('./abc.txt', { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          console.log('文件读取错误：', err);
          return;
        }
        console.log('文件读取结果：', data);
      });
      // 3. 异步读取：Promise
      fs.promises
        .readFile('./abc.txt', { encoding: 'utf-8' })
        .then((res) => {
          console.log('文件读取结果：', res);
        })
        .catch((err) => {
          console.log('文件读取错误：', err);
        });
      ```
- 文件描述符 file descriptor

  - file descriptor 是什么？
    - 在常见的操作系统上，对每个进程，内核都维护着一张当前打开着的文件和资源的表格
    - 每个打开的文件都分配了一个称为文件描述符的简单的数字标识符
    - 在系统层，所有文件系统操作都使用这些文件描述符来标识和跟踪每个特定的文件
    - Windows 系统使用了一个虽然不同但概念上相似的机制来跟踪资源
  - 使用

    ```js
    const fs = require('fs');
    fs.open('./abc.txt', (err, fd) => {
      if (err) {
        console.log('打开文件错误：', err);
        return;
      }

      // 文件描述符
      console.log(fd);
      // 文件信息
      fs.fstat(fd, (err, stats) => {
        if (err) return;
        console.log(stats);

        // 手动关闭
        fs.close(fd);
      });
    });
    ```

- 文件写入
- 文件夹操作
  - 创建文件夹 `fs.mkdir('path', err => {})`
  - 读取文件夹 `fs.readdir('path', (err, files) => {})`
    - files 为字符串数组，仅为名称
    - 路径后增加一个参数 `{ withFileTypes: true }`
      - files 为对象数组
        - `{ name, [Symbol[type]]: 1/2 }`
          - 1: 文件夹
          - 2: 文件
        - 或者使用 `item.isDiretory(): boolean` 判断是否为文件夹
  - 重命名文件夹/文件
    ```js
    fs.rename('oldPath', 'newPath', (err) => {
      if (!err) console.log('重命名成功:', err); // null
      else console.log('重命名失败');
    });
    ```

### 1.3 event 模块-事件处理

#### 1.3.1 介绍

- Node 中的核心 API 都是基于异步事件驱动的
  - 在这个体系中，某些对象（发射器 Emitters）发出某一个事件
  - 可以监听这个事件（监听器 Listeners），并且传入回调函数，这个回调函数会在监听到事件时调用
- events 对象
  - emitter.on(eventName, listener): 监听事件，也可以使用 addListener
  - emitter.off(eventName, listener): 移除事件监听，也可以使用 removeListener
  - emitter.emit(eventName[, ...args]): 发出事件，可以携带参数

#### 1.3.2 使用

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 监听
emitter.on('custom', (...args) => {
  console.log('监听到 custom 事件', args);
});
// 发射
setTimeout(() => {
  emitter.emit('custom');
}, 2000);
```

#### 1.3.3 其他方法

- `eventNames()`
- `getMaxListeners()`: 返回当前 EventEmitter 对象最大的监听器数量
  - `setMaxLsteners(num)`: 可以修改，默认为 10
- `listenerCount(eventName)`
- `listeners(eventName)`
- ...

### 1.4 认识二进制和 buffer

#### 1.4.1 二进制

1. 计算机中所有的内容最终都会使用 二进制 来标识
2. 常规前端开发都是在处理文本
   - what about 媒体文件(img, video, ...)？
     - 实际上我们处理的是图片的 url 地址，仍然是一串文本
     - 浏览器负责获取这个图片，最终渲染图片
3. 但服务器是处理二进制的
   - 服务器要处理的本地文件类型相对较多
     - 例 1：某一个保存文本的文件并不是使用 `utf-8` 进行编码的，而是使用 `GBK` ，那么我们必须读取到它们的二进制数据，再通过 `GBK` 转换成对应的文字
     - 例 2：需要读取的是一张图片数据（二进制），再通过某些手段对图片数据进行二次处理（裁剪、格式转换、旋转、添加滤镜），Node 中有一个 Sharp 的库，就是读取图片或者传入图片的 Buffer 对其进行再处理
     - 例 3：在 Node 中通过 TCP 建立长连接，TCP 传输的是字节流，我们需要将数据转成字节再进行传入，并且需要知道传输字节的大小（客户端需要根据大小来判断读取多少内容）

#### 1.4.2 Buffer 和二进制

- Node 为了方便开发者直接操作二进制的数据，提供了一个全局类 Buffer
  - 可以将 Buffer 看成是一个存储二进制的数组，这个数组的每一项，都可以存储 8 位二进制
- why 8 位？
  - 在计算机中，很少会直接操作一位二进制，因为一位二进制存储的数据非常有限
  - so 通常会把 8 位合在一起作为一个单元，这个单元被称为一个字节 byte
  - which means 1byte = 8bit, 1kb = 1024byte, 1M = 1024kb
  - 示例
    1. 很多编程语言中，int 类型是 4 个字节，long 类型是 8 个字节
    2. TCP 传输的是字节流，在写入和读取时都需要说明字节的个数
    3. RGB 的值分别都是 255，所以本质上也是用一个字节来存储的
- 存储方式
  - 八位 -> 两个十六进制字符

### 1.5 Buffer 的创建方式

```js
// 1. 不推荐的方式
const buf = new Buffer('hello');

// 2. 推荐的方式
const buf2 = Buffer.from('world'); // 一个字母一个字节

// 3. 字符串中包含中文
const buf3 = Buffer.from('你好啊'); // 一个中文需要三个字节(复杂的需要四个字节)

// 4. 手动指定 Buffer 创建过程的编码，默认使用 uft-8
const buf4 = Buffer.from('哈哈哈', 'uft16le'); // 两个字节表示一个中文
// 4.2 解码
console.log(buf4.toString('utf8')); // 解析错误，很有可能乱码

// 5. 更详细的创建方法：占据内存空间的大小
const buf5 = Buffer.alloc(8); // 8 个字节大小
buf5[0] = 100;
buf5[1] = 0x66;
console.log(buf.toString()); // df
```

### 1.6 Buffer 的源码解析

> Buffer 的创建过程 —— Node 的性能优化之一

1. 事实上创建 Buffer 时，并不会频繁地像操作系统申请内存，它会先默认申请一个 8 \* 1024 个字节大小的内存，即 8kb

   ```js
   Buffer.poolSize = 8 * 1024;
   let poolSize, poolOffset, allocPool;

   const encodingsMap = ObjectCreate(null);
   for (let i = 0; i < encodings.length; ++i) {
     encodingsMap[encoding[i]] = i;
   }

   function createPool() {
     poolSize = Buffer.poolSize;
     allocPool = createUnsafeBuffer(poolSize).buffer;
     markAsUntransferable(allocPool);
     poolOffset = 0;
   }
   createPool();
   ```

2. if 调用 `Buffer.from` 申请 Buffer(以字符串创建为例)

   1. from 方法

      ```js
      Buffer.from = function from(value, encodingOrOffset, length) {
        if (typeof value === 'string') {
          return fromString(value, encodingOrOffset);
        }

        // ... 其他代码
      };
      ```

   2. fromString 方法
      ```js
      function fromString(string, encoding) {
        let ops;
        if (typeof encoding !== 'string' || encoding.length === 0) {
          if (string.length === 0) return new FastBuffer();
          ops = encodingOps.uft8;
          encoding = undefined;
        } else {
          ops = getEncodingOps(encoding);
          if (ops === undefined) throw new ERR_UNKNOWN_ENCODING(encoding);
          if (string.length === 0) return new FastBuffer();
        }
        return fromStringFast(string, ops);
      }
      ```
   3. fromStringFast 方法
      1. 判断剩余长度是否足够填充这个字符串
      2. if 不够，通过 `createPool` 创建新的空间
      3. if 足够，直接使用，但之后要进行 `poolOffset` 的偏移变化

## 二、Web 服务器开发、文件上传

### 2.1 Stream 的读写操作

#### 2.1.1 认识 Stream

- Stream 定义
  - 连续字节的一种表现形式和抽象概念
  - 流应该是可读的、可写的
- Why need Stream?
  - 直接读写文件的方式(`readFile`, `writeFile`) 虽然简单，但无法控制一些细节的操作
    - 细节操作
      - 例：从什么位置开始读，读到什么位置，一次性读取多少个字节
    - 读到某个位置后，暂停读取，某个时刻恢复继续读取
    - 这个文件非常大，比如一个视频文件，一次性全部读取并不合适
- 基于流实现的对象
  - http 模块的 Request 和 Response 对象
- 所有的流都是 EventEmitter 的实例
- Node.js 中有四种基本流类型
  - Writable: 可以向其写入数据
    - `fs.createWriteStream()`
  - Readable: 可以从中读取数据
    - `fs.createReadStream()`
  - Duplex: 同时为 Readable 和 Writable
    - `net.Socket`
  - Transform: Duplex 可以在写入和读取数据时修改 or 转换数据
    - `zlib.createDeflate()`

#### 2.1.2 Readable

```js
// 1. 通过流读取文件
const readStream = fs.createReadStream('./aaa.txt', {
  start: 8,
  end: 20,
  highWaterMark: 3 // 每次读取 [highWaterMark] 个字节就回调，默认 64kb
}); // [8, 20]

// 2. 监听读取到的数据
readStream.on('data', (data) => {
  console.log(data);
  console.log(data.toString());

  readStream.pause(); // 暂停

  setTimeout(() => {
    readStream.resume(); // 重启
  }, 2000);
});

// 3. 其他事件监听
readStream.on('open', (fd) => {
  console.log('通过流将文件打开');
  console.log('文件描述符:', fd);
});
readStream.on('end', () => {
  console.log('已经读取到 end 位置');
});
readStream.on('close', () => {
  console.log('文件读取结束，并且被关闭');
});
```

#### 2.1.2 Writable

```js
const fs = require('fs');

// 一次性写入
fs.writeFile(
  './bbb.txt',
  'hello world',
  {
    encoding: 'utf-8',
    flag: 'a+'
  },
  (err) => {
    console.log('写入文件结果:', err);
  }
);

// 1. 通过流写入数据
const writeStream = fs.createWriteStream('./ccc.txt', {
  flags: 'r+', // 'a+' 在 mac OS 上没有问题，Windows 上有兼容性问题，需改为 'r+'
  start: 5
});

// 2. 写入
writeStream.write('kobe byrant', (err) => {
  console.log('写入完成');
});

// 3. 需要手动关闭
writeStream.close();

// 4. end 方法：操作一 将最后的内容写入到文件；操作二 关闭文件
writeStream.end('哈哈哈');
```

#### 2.1.3 pipe 管道

```js
const fs = require('fs');

const readStream = fs.createReadStream('./aaa.txt');
const writeStream = fs.createWriteStream('./aaa_copy.txt');

// 在可读流和可写流之间建立一个管道
readStream.pipe(writeStream);
```

### 2.2 http 模块 web 服务

- 开源的 Web 服务器
  - Nginx
  - Apache(静态)
  - Apache Tomcat
  - Node.js

#### 2.2.1 基本使用

- 步骤
  1. 创建一个 http 对应的服务器
  2. 开启对应的服务器，并且告知需要监听的端口

```js
const http = require('http');

const server = http.createServer((request, response) => {
  response.end('hello world');
});

server.listen(8000, () => {
  console.log('服务器已经开启成功了');
});
```

- `htt.createServer()`
  - 返回 服务器对象
    ```js
    function createServer(opts, requestListener) {
      return new Server(opts, requestListener);
    }
    ```
- `(request, response) => {}`
  - request -- 可读流
    - url
    - method
    - headers
    - 请求携带的数据
  - response -- 可写流
- `.listen(port, host, successCallback)`
  - port -- 要求 1025 ~ 65535
    - 1024 及以下：特殊服务
    - 65535 以上：端口最多用 2 个字节(256 \* 256)表示，超标了
    - 可以不传，系统会默认分配
  - host
    - `localhost`
      - 本质上是一个域名，通常被解析为 `127.0.0.1`
    - `127.0.0.1`
      - 回环地址(Loop Back Address)，主机自己发出去的包，直接被自己接收
        - 正常的数据包：应用层 -> 传输层 -> 网络层 -> 数据链路层 -> 物理层
        - 回环地址：直接在网络层被获取，不经过数据链路层与物理层
      - 监听 127.0.0.1 时，在同一个网段下的主机，通过 ip 地址是不能访问的
    - `0.0.0.0`
  - 成功开启才会回调该函数
- 可以在一个文件里创建多个服务器

#### 2.2.2 补充

1. 测试工具 -- postman
   - Why not browser?
     - 浏览器会发送两次请求，第一次是正常请求，第二次请求 favicon.icon 图标 => 容易干扰
     - 只能测试 get 请求
   - postman
     - 可以测试各种类型的请求
2. nodemon
   - 类似于热更新
   - `nodemon xxx.js`

### 2.3 request 请求对象

```js
const http = require('http');

const server = http.createServer((request, response) => {
  url.method; // 'POST' | 'GET'
  url.headers;

  /* url */
  const url = req.url;
  // 1. url 的区分
  if (url === '/login') {
    response.end('登录成功');
  } else if (url === '/products') {
  } else if (url === '/main') {
  }
});

server.listen(8000, () => {
  console.log('服务器已经成功开启');
});
```

1. 区分不同 url
2. 区分不同 method
3. 处理请求参数

   1. query 类型

      ```js
      const url = require('url');
      const qs = require('querystring'); // 建议使用 URLSearchParams

      // url: http://localhost:8000/home/list?offset=100&size=20
      const urlString = request.url;
      const urlInfo = url.parse(urlString);
      console.log(urlInfo.query, urlInfo.pathname); // offset=100&size=20, /home/list
      const queryInfo = qs.parse(urlInfo.query); // { offset: '100', size: '20' }
      ```

   2. body 类型

      ```js
      // url: http://localhost:8000/login
      // body: { name: 'east', password: '123456' }
      let isLogin = false;

      request.on('data', (dataString) => {
        const loginInfo = JSON.parse(dataString);
        if (loginInfo.name === 'east' && loginInfo.password = '123456') {
          isLogin = true
        } else {
          isLogin = false
        }
      });

      request.on('end', () => {
        if (isLogin) {
          response.end('登录成功，欢迎回来')
        } else {
          response.end('账号或密码错误，请重新输入')
        }
      })
      ```

4. headers
   1. content-type
      - application/x-www-form-urlencoded: 表示数据被编码成以 `&` 分割的键值对，同时以 `=` 分割 key 和 value
      - application/json: 表示是一个 json 类型
      - text/plain: 文本类型
      - application/xml: xml 类型
      - multipart/form-data: 上传文件
   2. content-length
      - calculated when request is sent
   3. keep-alive
      - http 是基于 TCP 协议的，但通常在进行一次请求和响应后会立刻中断
      - 在 http1.0 中，if want to 继续保持连接
        1. 浏览器需要在请求头中添加 `connection: keep-alive`
        2. 服务器要在响应头中添加 `connection: keep-alive`
        3. 当客户端再次请求时，就会使用同一个连接，直至一方中断连接
      - 在 http1.1 中，所有连接默认都是 `connection: keep-alive`
        - Node 中默认 5s
   4. accept-encoding: 告知服务器客户端支持的文件压缩格式
      - 例如：js 文件可以使用 gzip 编码，对应 `.gz` 文件
   5. accept: 告知服务器客户端可接受的文件格式类型
   6. user-agent: 客户端相关信息
   7. authorization: token

### 2.4 response 响应对象

- 正常写出流必须调用 `close()` 方法
- response 不需要调用 `close()`，但一定要调用 `end()`
  - 否则，if 不设置超时时间，客户端会一直等待
- Http Status Code (Http 状态码)
  - 200 -- OK
  - 201 -- Created POST 请求，创建新的资源
  - 301 -- Moved Permanetly 请求资源的 url 已经修改，响应中会给出新的 url
  - 400 -- Bad Request 客户端的错误，服务器无法或者不进行处理
  - 401 -- Unauthorized 未授权的错误，必须携带请求的身份信息
  - 403 -- Forbidden 客户端没有权限访问，被拒接
  - 404 -- Not Found 服务器找不到请求的资源
  - 500 -- Internal Server Error 服务器遇到了不知道如何处理的情况
  - 503 -- Service Unavailable 服务器不可用，可能处于维护 or 重载状态，暂时无法访问
  ```js
  response.statusCode = 403;
  response.writeHead(401);
  ```
- 设置数据类型及编码格式

  ```js
  response.setHeader('Content-Type', 'application/json;charset=uft8;');

  // response.end('明朝有意抱琴来');
  response.end('{ "message": "明朝有意抱琴来" }');

  response.writeHead(200, {
    'Content-Type': 'application/json;charset=uft8;'
  });
  ```

### 2.5 axios 在 node 中使用

#### 2.5.1 介绍 axios

- 在浏览器中
  - XHR: XMLHttpRequest
  - fetch
- 在 Node 中
  - http 模块

#### 2.5.2 使用

1. 创建项目 `npm init -y`
2. 安装 `npm install axios`
3. http 模块使用

   ```js
   const http = require('http');

   // 1. 使用 http 模块发送 get 请求
   http.get('http://localhost:8000', (res) => {
     // res 为可读流
     res.on('data', (data) => {
       console.log(data); // 字节
       console.log(data.toString()); // 文字
     });
   });

   // 2. 使用 http 模块发送 post 请求
   const request = http.request(
     {
       method: 'POST',
       hostname: 'localhost',
       port: 8000
     },
     (res) => {
       res.on('data', (data) => {});
     }
   );
   request.end(); // 必须调用 end 方法，表示写入内容完成
   ```

4. axios 库使用

   ```js
   const axios = require('axios');

   axios.get('http://localhost:8000').then((res) => {
     console.log(res.data); // 具体内容
   });
   ```

### 2.6 文件上传的细节分析

```js
// 1. 创建 server 服务器
const server = http.createServer((req, res) => {
  req.setEncoding('binary');

  // 分隔符
  const boundary = req.headers['content-type']
    .split('; ')[1]
    .replace('boundary=', '');

  // 2. 客户端传递的数据是表单数据(请求体)
  let formData = '';
  req.on('data', (data) => {
    formData += data;
  });

  req.on('end', () => {
    const imgType = 'image/jpeg';
    const imageTypePosition = formData.indexOf(imgType) + imgType.length;
    const imageData = formData
      .substring(imageTypePosition)
      .replace(/^\s\s*/, '')
      .subtring(0, imageData.indexOf(`--${boundary}--`));
    fs.writeFile('./bar.png', imageData, 'binary', () => {
      console.log('文件存储成功');
      res.end('文件上传成功');
    });
  });
});

server.listen(8000, () => {
  console.log('服务器开启成功');
});
```

1. 字符表示难以理解，以二进制方式显示 `req.setEncoding('binary')`
2. 表单数据中存在多种问题，如果上传一张图片，获取的数据不仅仅只是图片数据
   1. 有分隔符 `boundary` -- 需要截取
   2. 有表单数据格式
   3. 也有可能数据太多，一次 `data` 读取不完 -- 需要拼接
3. 写入图片文件

实际开发中会使用插件

## 二、Express 框架

> Web 框架

### 2.1 Express 认识初体验

- 基于原生的一些封装
  - 例如 http 模块
    1. URL 判断、Method 判断、参数处理、逻辑代码处理等，都需要自行处理和封装
    2. 所有的内容都放在一起，会非常混乱
- express 与 koa
  - 都是 TJ 主导开发，都很流行
  - express 先出现，稍有些笨重
  - koa 更为先进
- express 的核心 -- 中间件
  - 可以通过一些实用工具和中间件来扩展自己的功能
- 基本使用

  1. 脚手架安装

     ```shell
     # 安装脚手架
     npm install -g express-generator
     # 创建项目
     express express-demo
     # 安装依赖
     npm install
     # 启动项目
     node bin/www
     ```

  2. 从零搭建

     1. `npm init -y`
     2. `npm install express`
     3. index.js

        ```js
        const express = require('express');

        // 1. 创建 express 的服务器
        const app = express();

        // 2. 客户端访问 URL
        app.post('/login', (req, res) => {
          res.end('登录成功，欢迎回来');
        });
        app.get('/home', (req, res) => {
          res.end('首页的轮播图/推荐数据列表');
        });

        // last. 启动服务器，并且监听端口
        app.listen(9000, () => {
          console.log('express 服务器启动成功');
        });
        ```

### 2.2 Express 中间件使用

#### 2.2.1 介绍

- Express 是一个路由和中间件的 Web 框架，本身功能非常少
  - Express 应用程序本质上是一系列中间件函数的调用
- 中间件

  - 本质：传递给 express 的一个回调函数
  - 接收三个参数
    - 请求对象 request
    - 响应对象 response
    - next 函数(在 express 中定义的用于执行下一个中间件的函数)
  - 执行的任务

    1. 执行任何代码：打印、查询数据、判断逻辑
    2. 更改 request 和 response
    3. 结束响应周期
       1. `res.end()`
       2. `res.json({ message: '登录成功，欢迎回来', code: 0})`
    4. 执行下一个可以匹配的中间件（一个方法示例）

       ```js
       app.post('/login', (req, res, next) => {
         next();
       });

       app.use((req, res, next) => {
         console.log('second middleware exec...');
       });
       ```

#### 2.2.2 应用中间件

- 普通方法 `.use()`
  1. 无论是什么请求方式，都可以匹配上
  2. 第一个被匹配到的中间件一定会执行
  3. 后续匹配上的中间件是否会执行，取决于前一个中间件是否执行 `next()` 函数
- `path` 匹配中间件
  ```js
  app.use('/home', (req, res, next) => {});
  ```
- `path` 和 `method` 匹配中间件
  ```js
  app.get('/home', (req, res, next) => {});
  app.post('/login', (req, res, next) => {});
  ```
- 注册多个中间件
  ```js
  app.get(
    '/home',
    (req, res, next) => {
      console.log('中间件 1');
      next();
    },
    (req, res, next) => {
      console.log('中间件 2');
      next();
    },
    (req, res, next) => {
      console.log('中间件 3');
    },
    (req, res, next) => {
      console.log('中间件 4');
    }
  );
  ```
  - 一般用于多个逻辑

#### 2.2.3 案例练习

```js
const express = require('express');
const app = express();

app.post('/login', (req, res, next) => {
  let isLogin = false;

  req.on('data', (data) => {
    const dataInfo = JSON.parse(data.toString());
    isLogin = dataInfo.username === 'east' && dataInfo.password === '123456';
  });

  req.on('end', () => {
    if (isLogin) res.end('登录成功，欢迎回来');
    else res.end('登录失败，请检测账号与密码是否正确');
  });
});

app.post('/register', (req, res, next) => {
  res.end('注册成功，开始你的旅程');
});

app.listen(8000);
```

- 优化：重复的解析 req 携带参数问题

  ```js
  app.use((req, res, next) => {
    if (req.headers['content-type'] === 'appplication/json') {
      req.on('data', (data) => {
        const dataInfo = JSON.parse(data.toString());
        req.body = dataInfo;
      });

      req.on('end', () => {
        next();
      });
    } else next();
  });
  ```

  - express 提供了功能一样的中间件 `app.use(express.json())`

#### 2.2.4 不同参数类型解析

```js
// 1. json
app.use(express.json());

// 2. x-www-form-urlencoded
// app.use(express.urlencoded()) // 使用 node 内置 querystring 模块解析，该模块已经不推荐使用
app.use(express.urlencoded({ extended: true })); // 使用默认安装的第三方库解析

// 3. form-data
const formdata = multer();
app.post('/login', formdata.any(), (req, res, next) => {
  console.log(req.body);
});
```

#### 2.2.5 第三方中间件

1. morgan: 记录请求日志

   1. 安装`npm install morgan`
   2. 使用

      ```js
      const morgan = require('morgan');
      const fs = require('fs');

      const writeStream = fs.createWriteStream('./logs/access.log');
      app.use(morgan('combined', { stream: writeStream }));
      ```

2. multer: 文件上传

   ```js
   const multer = require('multer');

   const upload = multer({
     // dest: './uploads' // 文件夹下
     storage: multer.diskStorage({
       destination(req, file, cb) {
         cb(null, './uploads');
       },
       filename(req, file, cb) {
         cb(null, Date.not() + '_' + file.originalname);
       }
     })
   });

   // 1. 单文件上传
   app.post('/avatar', upload.single('avatar'), (req, res, next) => {
     console.log(req.file); // 文件信息对象
     res.end('文件上传成功');
   });

   // 2. 多文件上传
   app.post('/photos', upload.array('photos'), (req, res, next) => {
     console.log(req.files); // 文件信息对象
     res.end('文件上传成功');
   });
   ```

### 2.3 Express 请求和响应

### 2.4 Express 路由的使用

### 2.5 Express 的错误处理

### 2.6 Express 的源码解析
