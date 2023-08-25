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

## 三、Express 框架

> Web 框架

### 3.1 Express 认识初体验

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

### 3.2 Express 中间件使用

#### 3.2.1 介绍

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

#### 3.2.2 应用中间件

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

#### 3.2.3 案例练习

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

#### 3.2.4 第三方中间件

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
         cb(null, Date.now() + '_' + file.originalname);
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

### 3.3 Express 请求和响应

#### 3.3.1 请求

- 传递参数
  1. post => json 数据
  2. post => x-www-form-urlencoded
  3. post => form-data 文件上传
  4. get => querystring
  5. get => params
     - `/users/111`

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

// 4. querystring -- express 默认解析
app.get('/login', (req, res, next) => {
  console.log(req.query); // { key: value }
});

// 5. params
app.get('/users/:id', (req, res, next) => {
  console.log(req.params); // { id: '111' } 字符串
});
```

#### 3.3.2 响应

```js
// 1. end()

// 2. json()
app.post('/login', (req, res, next) => {
  res.json({
    code: 0,
    message: '欢迎回来',
    list: []
  });
});

// 3. status()
```

### 3.4 Express 路由的使用

#### 3.4.1 基本使用

- 原因：
  1. 完整的 Web 服务器包含非常多的处理逻辑
  2. 一些处理逻辑其实是一个整体，应该放在一起
- express.Router
  - 一个 Router 实例拥有完整的中间件和路由系统
  - => 被称为迷你应用程序(mini-app)

```js
const express = require('express');

const userRouter = express.Router();
userRouter.get('/', (req, res, next) => {});
userRouter.post('/:id', (req, res, next) => {});

app.use('/users', userRouter);
```

#### 3.4.2 静态资源服务器

```js
const express = require('express');

const app = express();

app.use(express.static('./uploads'));
```

然后可以直接访问该文件夹下的文件

### 3.5 Express 的错误处理

1. next 函数 `next(-1001)`
2. 错误处理中间件

   ```js
   app.use((errCode, req, res, next) => {
     const code = errCode;
     let message = '未知的错误';

     switch (code) {
       case -1001:
         message = '没有输入用户名或密码';
         break;
       default:
         break;
     }

     res.json({
       code,
       message
     });
   });
   ```

### 3.6 Express 的源码解析

## 四、koa 框架

koa: next generation web framework for node.js.

- 介绍
  1. koa 旨在为 Web 应用程序和 API 提供更小、更丰富和更强大的能力
  2. 相对于 express 具有更强的异步处理能力
  3. koa 核心代码只有 1600+ 行，是一个更加轻量级的框架
  4. 可以根据需要安装和使用中间件

### 4.1 koa 的基本使用

1. 创建项目 `npm init -y`
2. 安装 koa `npm install koa`
3. 使用

   ```js
   const Koa = require('koa');

   const app = new Koa();

   // 注册中间件: 两个参数 ctx, next
   app.use((ctx, next) => {
     console.log('匹配到 koa 的中间件');
     ctx.res.end();
   });

   app.listen(6000, () => {
     console.log('koa 服务器启动成功');
   });
   ```

注意：传入的中间件必须是函数，且无法使用 `app.[method]()` 方法

- 路由：区分路径和方法

  - 使用中间件 `@koa/router`

  ```js
  const Koa = require('koa');
  const KoaRouter = require('@koa/router');

  const app = new Koa();

  // 1. 创建路由对象
  const userRouter = new KoaRouter({ prefix: '/users' });

  // 2. 在路由中注册中间件：path, method
  userRouter.get('/', (ctx, next) => {
    ctx.body = 'users list data...';
  });
  userRouter.get('/:id', (ctx, next) => {
    const id = ctx.params.id;
    ctx.body = '获取某个用户' + id;
  });
  userRouter.post('/', (ctx, next) => {});
  userRouter.delete('/:id', (ctx, next) => {});
  userRouter.patch('/:id', (ctx, next) => {});

  // 3. 让路由中的中间件生效
  app.use(userRouter.routes());
  app.use(userRouter.allowedMethods()); // 会返回结果 Methods not allowed

  app.listen(6000, () => {
    console.log('koa 服务器启动成功');
  });
  ```

### 4.2 koa 的参数解析

#### 4.2.1 ctx

- ctx 代表一次请求的上下文对象
  - 将 req 和 res 作为 ctx 的属性
    - 请求对象
      - ctx.request -- koa 封装的请求对象
      - ctx.req -- Node 封装的对象
    - 响应对象
      - ctx.response -- koa 封装的响应对象
      - ctx.res -- Node 封装的响应对象
- 参数解析方式

  ```js
  // 1. get: params
  userRouter.get('/:id', (ctx, next) => {
    const id = ctx.params.id;
    ctx.body = '获取某个用户' + id;
  });

  // 2. get: query
  userRouter.get('/:id', (ctx, next) => {
    const query = ctx.query;
    ctx.body = '获取某个用户' + JSON.stringify(query);
  });

  // 3. post: json 使用第三方库
  const bodyParser = require('koa-bodyparser');
  app.use(bodyParser());
  userRouter.post('/json', (ctx, next) => {
    console.log(ctx.request.body);
  });

  // 4. post: urlencoded 与 json 一样

  // 5. post: form-data
  const multer = require('@koa/multer');
  app.use(multer());
  ```

### 4.3 koa 响应和错误

#### 4.3.1 响应

```js
// 1. String 类型
ctx.body = 'user list data...';

// 2. Buffer
ctx.body = Buffer.from('你好啊，李银河');

// 3. Stream
const readStream = fs.createReadStream('./uploads/111.png');
ctx.type = 'image/jpeg';
ctx.body = readStream;

// 4. 数据 array / object => 使用最多
ctx.body = {
  code: 0,
  data: []
};

// 5. null => http status code: 204 no content
ctx.body = null;

// 主动设置状态码
ctx.status = 201; // 一般为创建
```

#### 4.3.2 错误处理

```js
userRouter.get('/', (ctx, next) => {
  // 1. 方法一
  ctx.body = {
    code: -1003,
    message: '未授权的 token，请检测你的 token'
  };

  // 方法二：在其他地方统一处理, ctx.app 是一个 EventEmitter
  ctx.app.emit('error'， -1003)
});

app.on('error', (code, ctx) => {
  let message = ''
  switch(code) {
    case -1001:
      message = '账号或密码错误'
      break;
    default:
        break
  }

  ctx.body = {
    code, message
  }
})
```

### 4.4 koa 静态服务器

1. 安装 `npm install koa-static`
2. 使用

   ```js
   const static = require('koa-static');

   app.use(static('./build'));
   ```

### 4.5 koa 源码解析

### 4.6 和 express 对比

1. 架构设计
   - express: 完整而强大，内置了非常多好用的功能
   - koa: 简洁而自由，只包含最核心的功能 => 并不会对我们使用其他中间件进行任何的限制
2. 中间件执行机制 especially 异步操作
   - express
     - 同步：先 `next()`，再往下
     - 异步：`next()` 返回 void，`async await` 毫无意义
       - 必须在最后一个中间件中响应数据
   - koa
     - 同步：先 `next()`，再往下
     - 异步：if 下一个中间件是一个异步函数，则默认不会等到中间件的结果，就会执行下一步操作
       - 解决办法：`async()` 与 `await next()`
       - because: `next()` 返回值为 `Promise`
3. koa 洋葱模型
   1. 中间件处理代码的过程
   2. Response 返回 body 执行

## 五、使用 MySQL

> 查询到的结果，默认数组格式

### 5.1 MySQL 查询对象

- 将查询到的数据调整为对象格式
  1. 单表查询不需要
  2. 多表查询需要 (一对一)
     - why?
     - 示例
       ```sql
       SELECT products.id as id, products.title as title, products.price as price,
         JSON_OBJECT('id', brands.id, 'name', brands.name, 'website', brands.website, 'rank', brands.worldRand) as brand
       FROM products LEFT JOIN  brands on products.brand_id = brands.id WHERE price > 3000;
       ```

### 5.2 MySQL 查询数组

- 多对多
- 示例
  ```sql
  SELECT
    stuid as id, stu.name as name, stu.age as age,
    JSON_ARRAYAGG(JSON_OBJECT('id', cs.id, 'name', cs.name, 'price', cs.price)) as courses
  FROM students stu
  LEFT JOIN students_select_courses ssc ON stu.id = ssc.student_id
  LEFT JOIN courses cs ON ssc.course_id = cs.id WHERE cs.id IS NOT NULL
  GROUP BY stu.id;
  ```

### 5.3 mysql2 库介绍使用

1. 安装 `npm install mysql2`
2. 使用

   ```js
   const mysql = require('mysql2');

   // 1. 和数据库建立连接
   const connection = mysql.createConnection({
     hose: 'localhost',
     port: 3306,
     database: 'music_db',
     user: root,
     password: 'xxxxxx'
   });

   // 2. 执行操作语句
   const statement = 'SELECT * FROM `students`;';
   connection.query(statement, (err, values, fields) => {
     if (err) {
       console.log('查询失败：', err);
       return;
     }
   });
   ```

### 5.4 mysql2 预处理语句

- Prepared Statement
  - 优点
    1. 提高性能
       1. 将创建的语句模块发送给 MySQL，然后 MySQL 编译(解析、优化、转换) 语句模块，并且存储它但不执行
       2. 在真正给 ? 提供实际的参数才会执行
       3. 即使多次执行，也只会编译一次，所以性能更高
    2. 防止 SQL 注入
       - 之后传入的值不会像模块引擎那样编译，那么一些 SQL 注入的内容就不会被执行
       - 示例
         ```sql
         SELECT * FROM users WHERE name = 'admin' and password = 'xxx' or 1 = 1;
         ```

```js
const mysql = require('mysql2');

// 1. 和数据库建立连接
const connection = mysql.createConnection({
  hose: 'localhost',
  port: 3306,
  database: 'music_db',
  user: root,
  password: 'xxxxxx'
});

// 2. 预处理语句
const statement = 'SELECT * FROM `products` WHERE price > ? AND score > ?;';
connection.execute(statement, [1000, 8], (err, values) => {
  console.log(values);
});

// 3. 结束连接
connection.destroy();
```

### 5.5 mysql2 连接池使用

- Connection Pools
  - 如果有多个请求，但该连接正在被占用

```js
const mysql = require('mysql2');

// 1. 创建连接池
const connectionPool = mysql.createPool({
  hose: 'localhost',
  port: 3306,
  database: 'music_db',
  user: root,
  password: 'xxxxxx',
  connectionLimit: 5
});

// 2. 预处理语句
const statement = 'SELECT * FROM `products` WHERE price > ? AND score > ?;';
connectionPool.execute(statement, [1000, 8], (err, values) => {
  console.log(values);
});

// 3. 结束连接
connectionPool.destroy();
```

### 5.6 mysql2 的 Promise

```js
const mysql = require('mysql2');

// 1. 创建连接池
const connectionPool = mysql.createPool({
  hose: 'localhost',
  port: 3306,
  database: 'music_db',
  user: root,
  password: 'xxxxxx',
  connectionLimit: 5
});

// 2. 预处理语句
const statement = 'SELECT * FROM `products` WHERE price > ? AND score > ?;';
connectionPool
  .promise()
  .execute(statement, [1000, 8])
  .then((res) => {
    console.log(res); // [values, fields]
  })
  .catch((err) => {
    console.log(res);
  });

// 3. 结束连接
connectionPool.destroy();
```

## 六、项目实战

### 6.1 项目介绍和搭建

#### 6.1.1 功能接口说明

- 完整的项目接口包括
  - 面向用户的业务接口
  - 面向企业或者内部的后台管理接口
- 完成的功能
  1. 用户管理系统
  2. 内容管理系统
  3. 内容评论管理
  4. 内容标签管理
  5. 文件管理系统
  6. 其他功能都是相似的...

#### 6.1.2 项目搭建

1. 创建 coderhub 文件夹
2. 创建项目依赖 `npm init -y`
3. 增加 start 脚本
   - package.json: `"start": "node ./src/main.js"`
   - bash: `npm run start`
4. 选择 koa 作为开发框架 `npm install koa @koa/router koa-bodyparser`
5. 配置端口

   - `src/config/server.js`: 配置文件

     ```js
     const SERVER_PORT = 8000;
     ```

     - 或者放在 `root/.env` 文件中 `SERVER_PORT = 8000`

       - 使用 dotenv 库管理 .env 文件

         ```js
         /* src/config/server.js */
         const dotenv = require('dotenv');

         dotenv.config();

         module.exports = { SERVER_PORT } = process.env;

         /* main.js */
         const { SERVER_PORT } = require('.config/server');

         app.listen(SERVER_PORT, () => {
           console.log('服务器启动成功');
         });
         ```

6. 目录结构划分
   - 按照功能模块划分
     - router 文件夹
       - `user.router.js`
   - `main.js`
     1. 导入 app
     2. 启动 app
   - 按照业务模块

#### 6.1.3 自动化引入路由

```js
/* router/index.js */
const fs = require('fs');

function registerRoutes(app) {
  // 1. 读取当前文件夹下所有文件
  // fs.fs.readdirSync
  // 2. 遍历所有文件，使用 routes 和 allowedMethods 方法
  // file.endsWidth('.router.js')
}
```

### 6.2 注册接口的逻辑

- 代码逻辑
  1. 获取用户传递过来的信息 const user = ctx.request.body
  2. 判断逻辑
     1. 是否已存在该用户名
     2. 数据格式校验
  3. 将 user 信息存储到数据库中
  4. 查看存储的结果，告知前端是否创建成功
- 代码拆分(分层架构)

  1. `router/user.router.js`: 路由与执行函数 `userController.cteate` 的映射
  2. `controller/user.controller.js`
     1. 接收参数
     2. 验证
        1. 验证用户名和密码是否为空
        2. 判断 name 是否已存在 `userService.findUserByName(name)`
        - 验证代码过多，可以抽取到中间件函数中 `verifyUser`
          - `src/middleware/user.middleware.js`
     3. 向数据库表创建用户 `userService.create(user)`
     4. 返回响应
  3. `service/user.service.js`

     1. 获取用户 user
     2. 拼接 statement
     3. 执行 sql 语句

     - 连接数据库的操作在 `src/app/database.js`

       ```js
       // 获取连接是否成功
       connectionPool.getConnection((err, connection) => {
         if (err) {
           console.log('获取连接失败：', err);
           return;
         }

         // 尝试和数据库建立一下连接
         connection.connect((err) => {
           if (err) {
             console.log('和数据库交互失败：', err);
           } else {
             console.log('数据库连接成功，可以进行操作');
           }
         });
       });
       const connection = connectionPool.promise();
       ```

  - 错误信息封装

    ```js
    /* src/utils/handle-error.js */
    app.on('error', (error, ctx) => {
      let code = 0;
      let message = '';

      switch (error) {
        case 'name_or_password_is_required':
          code = -1001;
          message = '用户名或密码不能为空';
          break;
      }

      ctx.body = { code, message };
    });
    ```

    - 错误字符串使用常量 `src/config/error_constants.js`

  - 用户密码

    - 使用明文 => 危险操作
    - 加密(继续使用中间件)

      ```js
      /* src/utils/md5-password */
      const crypto = require('crypto');

      function md5password(password) {
        const md5 = crypto.createHash('md5');

        const md5pwd = md5.update(password).digest('hex');

        return md5pwd;
      }
      ```

### 6.3 登录用户的凭证

#### 6.3.1 登录凭证的介绍

- why need 登录凭证?
  - http 是一个无状态协议(示例)
    - 对于服务器而言，http 的每次请求都是单独的请求，和之前的请求没有关系
- 方案

  1. cookie

     - 类型为 “小型文本文件”，某些网站为了辨别用户身份而存储在用户本地终端(Client Side)上的数据
     - 浏览器会在特定的情况下，自动携带 cookie 来发送请求
       - 客户端
     - 按存储位置区分

       - 内存 Cookie：浏览器关闭时，Cookie 就会消失
       - 硬盘 Cookie：有一个过期时间，用户手动清理 or 时间到期，才会消失
       - 默认为 内存 Cookie，设置了过期时间才是 硬盘 Cookie

       ```js
       // 内存 cookie
       document.cookie = 'name=east;';
       document.cookie = 'age=23;';

       // 硬盘 cookie
       document.cookie = 'name=east;max-age=30;'; // 秒数
       ```

     - 作用域
       - Domin: 指定哪些主机可以接受 cookie
         - if 不指定，默认 origin
         - if 指定 Domain，则包含子域名
           - 示例：设置 Domain=mozilla.org，则子域名 developer.mozilla.org 也有 cookie
       - path: 指定主机下哪些路径可以接受 cookie

     ```js
     userRouter.get('/login', (ctx, next) => {
       ctx.cookies.set('slogen', '12345', {
         maxAge: 60 * 1000 // 毫秒
       });
       ctx.body = '登录成功';
     });

     userRouter.get('/list', (ctx, next) => {
       const slogen = ctx.cookies.get('slogen');
       if (slogen === '123456') {
         ctx.body = '登录成功';
       } else {
         ctx.body = '请登录';
       }
     });
     ```

  2. session

     - 基于 cookie，但比 cookie 更安全

     ```js
     const KoaSession = require('koa-session');

     const session = KoaSession(
       {
         key: 'sessionid',
         signed: true,
         maxAge: 60 * 60 * 1000,
         httpOnly: true // 只允许服务器，不允许其他 js 等
       },
       app
     );
     // 加盐
     app.keys = ['aaa', 'bbb', 'ccc'];
     app.use(session);

     userRouter.get('/login', (ctx, next) => {
       ctx.session.slogan = '123456';
       ctx.body = '登录成功';
     });

     userRouter.get('/list', (ctx, next) => {
       const slogen = ctx.session.slogan;
       if (slogen === '123456') {
         ctx.body = '登录成功';
       } else {
         ctx.body = '请登录';
       }
     });
     ```

  3. token 也叫令牌
     1. 在验证了用户账号和密码正确的情况下，给用户颁发一个令牌
     2. 这个令牌作为后续用户访问一些接口 or 资源的凭证
     3. 服务器根据这个凭证来判断用户是否有权限访问
     - 使用步骤
       1. 生成 token：登录时，颁发 token
       2. 验证 token：访问某些资源 or 接口时，验证 token

- cookie 和 session 的缺点
  1. cookie 会被附加到每个 http 请求中，无形中增加了流量(某些请求不需要)
  2. cookie 明文传递，存在安全性问题
  3. cookie 的大小限制是 4kb，对于复杂的需求来说是不够的
  4. 对于浏览器外的其他客户端(比如 iOS、Android)，必须手动地设置 cookie 和 session
  5. 对于分布式系统和服务器集群中，如何保证其它系统也可以正确地解析 session？

#### 6.3.2 JWT 实现 token

- JWT 生成的 token 由三部分组成
  - header
    - alg: 采用的加密算法，默认是 HMAX SHA256(HS256)，采用同一个密钥进行加密和解密
      - 对称加密
    - typ: JWT，固定值，通常都写成 JWT 即可
    - 会通过 base64Url 算法进行编码
  - payload
    - 携带的数据，比如用户的 id 和 name
    - 默认携带 iat(issued at)，令牌的签发时间
    - 可以设置过期时间 exp(expiration time)
    - 会通过 base64Url 算法进行编码
  - signature
    - 设置一个 secretKey，通过将前两个的结果合并后进行 HMACSHA256 的算法
    - HMACSHA256(base64Url(header)+'.'+baseUrl(payload), secretKey);
    - 但是如果 secretKey 暴露是一件非常危险的事情，因为之后就可以模拟颁发 token，也可以解密 token

#### 6.3.3 代码实现

```shell
npm install jsonwebtoken
```

```js
const jwt = require('jsonwebtoken');

const secretKey = 'abcde';

// 1. 颁发 token
const payload = { id: 111, name: 'east' };
const token = jwt.sign(payload, secretKey, {
  expiresIn: 60 // 单位 s
});

// 2. 验证 token
const authorization = ctx.headers.authorization;
const token = authorization.replace('Bearer ', '');
try {
  const result = jwt.verify(token, secretKey);
} catch (error) {
  console.log(error);
  ctx.body = {
    code: -1010,
    message: 'token 过期 or 无效的 token'
  };
}
```

#### 6.3.4 非对称加密

```shell
$ openssl
genrsa -out private.key 1024 # 生成私钥 1024 字节长度
rsa -in private.key -pubout -out public.key # 根据私钥生成公钥
# 至少 2048 bytes
```

```js
const fs = require('fs');

const privateKey = fs.readFileSync('./keys/private.key');
const publickey = fs.readFileSync('./key/public.key');

// 1. 颁发 token
const payload = { id: 111, name: 'east' };
const token = jwt.sign(payload, privateKey, {
  expiresIn: 60, // 单位 s
  algorithm: 'RS256'
});

// 2. 验证 token
const authorization = ctx.headers.authorization;
const token = authorization.replace('Bearer ', '');
try {
  const result = jwt.verify(token, publickey, { algorithms: ['RS256'] });
} catch (error) {
  console.log(error);
  ctx.body = {
    code: -1010,
    message: 'token 过期 or 无效的 token'
  };
}
```

#### 6.3.5 登录逻辑

- 登录逻辑
  1.  判断用户名和密码是否为空
  2.  该用户是否在数据库中存在
  3.  密码是否正确
  4.  颁发 token
- 代码划分

  1. `src/router/login.router.js`: 登录相关逻辑
  2. `src/middleware/login.middleware.js`: 验证信息
     - `verifyLogin`
       - `NAME_IS_NOT_EXISTS`
       - `PASSWORD_IS_INCORRECT`
  3. `src/controller/login.controller.js`: 颁发签名

     - 将 密钥对 放进 `src/config/keys` 中
     - 读取密钥：`config/secret.js`
     - 注意路径问题

       ```js
       const path = require('path');

       const PRIVATE_KEY = fs.readFileSync(
         path.resolve(__dirname, './keys/private.key')
       );
       ```

### 6.4 发表动态和评论

#### 6.4.1 动态

1. 创建动态表
   ```sql
   CREATE TABLE IF NOT EXISTS `moment`(
    id INT PRIMARY KEY AUTO_INCREMENT,
    content VARCHAR(1000) NOT NULL,
    user_id INT NOT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id)
   );
   ```
2. 创建动态接口
   1. 认证身份 user_id
   2. 存储动态至动态表
3. 删改都需要权限
   1. `permission.middleware.js` - `verifyMomentPermission` 验证 moment 权限
   2. 数据表查询操作 `PermissionService.checkMoment(momentId, userId)`
   3. `OPERATION_IS_NOT_ALLOWED`
4. 调整 verifyPermission 函数以适配验证所有权限 -- 接口和表名严格对应
   1. 获取登录用户的 id
   2. 获取资源的 key: `Object.keys(ctx.params)`
      - keyName
      - resourceName
      - resourceId

#### 6.4.2 评论

> 对动态进行评论

1. 创建数据表
   ```sql
   CREATE TABLE IF NOT EXISTS `comment`(
    id INT PRIMARY KEY AUTO_INCREMENT,
    content VARCHAR(1000) NOT NULL,
    moment_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_id INT DEFAULT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    FOREIGN KEY(moment_id) REFERENCES moment(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE ON UPDATE CASCADE
   );
   ```
   - comment_id: 用于楼中楼
2. 创建评论 create
3. 回复评论 reply
4. 查询动态

   1. 查询多个动态时，显示评论的个数

      ```sql
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'createTime', u.createAt, 'updateTime', u.updateAt) user,
        (SELECT COUNT(*) FROM comment WHERE comment.moment_id = m.id) commentCount
      FROM moment m
      LEFT JOIN user u ON u.id = m.user_id
      LIMIT 10 OFFSET 0;

      SELECT COUNT(*) FROM comment WHERE moment_id = 2; -- 查询总数
      ```

   2. 查询单个动态时，显示评论的列表

      ```sql
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'createTime', u.createAt, 'updateTime', u.updateAt) user,
        (SELECT COUNT(*) FROM comment WHERE comment.moment_id = m.id) commentCount,
        (JSON_ARRAYAGG(JSON_OBJECT(
          'id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt, 'updateTime', c.updateAt,
          'user', JSON_OBJECT('id', cu.id, 'name', cu.name)
        ))) comments
      FROM moment m
      LEFT JOIN user u ON u.id = m.user_id
      LEFT JOIN comment c ON comment.moment_id = m.id
      LEFT JOIN user cu ON cu.id = c.user_id
      WHERE m.id = 2
      GROUP BY m.id;
      ```

### 6.5 动态的标签接口

1. 创建标签表
   ```sql
   CREATE TABLE IF NOT EXISTS `label`(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(10) NOT NULL UNIQUE,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```
2. 多对多关系 => 建立关系表
   ```sql
   CREATE TABLE IF NOT EXISTS `moment_label`(
    moment_id INT NOT NULL,
    label_id INT NOT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(moment_id, label_id),
    FOREIGN KEY (moment_id) REFERENCES moment(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (label_id) REFERENCES label(id) ON DELETE CASCADE ON UPDATE CASCADE
   )
   ```
3. 添加关系 post `moment/:momentId/labels`
   1. 是否登录
   2. 是否有操作该动态的权限
   3. 额外中间件 -- 验证选中的 label 是否已经存在于 label 表中
      - if 存在 => 直接使用
      - if not => 将该 label 添加到 label 表
   4. 将动态和 labels 的关系添加到关系表中
4. 查询动态列表时，拿到标签个数
5. 查询动态详情时，拿到标签数组
   - 错误查询
     ```sql
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'createTime', u.createAt, 'updateTime', u.updateAt) user,
        (SELECT COUNT(*) FROM comment WHERE comment.moment_id = m.id) commentCount,
        (JSON_ARRAYAGG(JSON_OBJECT(
          'id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt, 'updateTime', c.updateAt,
          'user', JSON_OBJECT('id', cu.id, 'name', cu.name)
        ))) comments,
        (JSON_ARRAYAGG(JSON_OBJECT(
          'id', l.id, 'name'm l.name
        ))) labels
      FROM moment m
      LEFT JOIN user u ON u.id = m.user_id
      LEFT JOIN comment c WHERE comment.moment_id = m.id
      LEFT JOIN user cu ON cu.id = c.user_id
      LEFT JOIN moment_label ml ON ml.moment_id = m.id
      LEFT JOIN label l ON ml.label_id = l.id
      WHERE m.id = 2
      GROUP BY m.id;
     ```
   - 正确查询：采用子查询
     ```sql
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'createTime', u.createAt, 'updateTime', u.updateAt) user,
        (SELECT COUNT(*) FROM comment WHERE comment.moment_id = m.id) commentCount,
        (
          SELECT
            (JSON_ARRAYAGG(JSON_OBJECT(
              'id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt, 'updateTime', c.updateAt,
              'user', JSON_OBJECT('id', cu.id, 'name', cu.name)
            )))
          FROM comment c
          LEFT JOIN user cu ON c.user_id = cu.id
          WHERE c.moment_id = m.id
        ) comments
        (JSON_ARRAYAGG(JSON_OBJECT(
          'id', l.id, 'name'm l.name
        ))) labels
      FROM moment m
      LEFT JOIN user cu ON cu.id = c.user_id
      LEFT JOIN moment_label ml ON ml.moment_id = m.id
      LEFT JOIN label l ON ml.label_id = l.id
      WHERE m.id = 2
      GROUP BY m.id;
     ```

### 6.6 图片上传和存储

#### 6.6.1 上传图像

1. 所有上传接口都放在 `file.router.js` 中
   ```js
   fileRouter.post('/avatar', (ctx, next) => {});
   ```
2. 安装 `multer`, `@koa/multer` 库
3. 头像信息表
   ```sql
   CREATE TABLE IF NOT EXISTS `avatar`(
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL UNIQUE,
    mimetype VARCHAR(30),
    size INT,
    user_id INT,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
   );
   ```

#### 6.6.2 获取头像

```js
userRouter.get('/avatar/:userId', showAvatarImage);

fileService.queryAvaterWithUserId(userId) {}
```

#### 6.6.3 获取图像地址

1. 修改 user 表，添加头像地址字段 avatar_url
2. `userService.updateUserAvatar(avatarUrl, userId)`
3. 修改配置文件
   ```
   SERVER_HOST=http://localhost
   SERVER_PORT=8000
   ```

-- 忘记这个是干嘛的了，没做。

#### 6.7 后台管理系统部分接口

```sql
-- 创建角色表
CREATE TABLE IF NOT EXISTS role(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name Varchar(20) NOT NULL UNIQUE,
  intro VARCHAR(200),
  createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建菜单表
CREATE TABLE IF NOT EXISTS menu(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  type TINYINT(1),
  icon VARCHAR(20),
  parentId INT DEFAULT NULL,
  url VARCHAR(50) UNIQUE,
  permission VARCHAR(100) UNIQUE,
  sort INT DEFAULT 100,
  createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(parentId) REFERENCES menu(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 创建关系表
CREATE TABLE IF NOT EXISTS role_menu(
  roleId INT NOT NULL,
  menuId INT NOT NULL,
  createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (roleId, menuId),
  FOREIGN KEY (roleId) REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (menuId) REFERENCES menu(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 获取菜单树
SELECT
  rm.roleId, JSON_ARRAYAGG(rm.menuId) menuIds
FROM role_menu rm WHERE rm.roleId = 1 GROUP BY rm.roleId;
```

```js
/** 角色 */
class RoleService {
  async create(role) {
    const statement = `INSERT INTO role SET ?`;
    const [result] = await connection.query(statement, [role]);
  }

  async assignMenu(roleId, menuIds) {
    // 1. 为了操作方便，先删除之前的关系(更好的操作是，先查询排除，再新增新的)
    // 2. 插入新的值
  }

  async getRoleMenu(roleId) {}
}
```

## 七、Node 服务器端渲染 SSR

### 7.1 邂逅 SPA 和 SSR

- SPA
  - Single-Page Application，单页面应用
  - SPA 应用在客户端呈现(CSR: client-side render)
  - 默认只返回一个 空 HTML 页面
    ```html
    <body>
      <div id="app"></div>
    </body>
    ```
    - 内容通过 JavaScript 动态加载
  - 常见使用的库
    - React
    - AngularJS
    - Vue.js
  - 优缺点
    - 优点
      1. 只需加载一次，后续页面切换不需要重新加载 => 页面加载速度比传统 Web 应用程序更快
      2. 可以轻松地构建功能丰富的 Web 应用程序(by 框架)
    - 缺点
      1. SPA 应用默认只返回一个空 HTML 页面，不利于 SEO(search engine optimization)
      2. 首屏加载的资源过大时，一样会影响首屏的渲染
      3. 不利于构建复杂的项目，复杂的 Web 应用程序的大文件可能变得难以维护(?没碰到过这么大的)
- 爬虫工作流程
  1. 抓取
     - 从互联网上发现各类网页，并抓取内容
  2. 索引编制
     - 分析网页上的文本、图片和视频文件，并将信息存储在大型数据库(索引区)中
     - 会对内容类似的网页分类归组
     - 不符合规则的内容和网站会被清理
       - 禁止访问 or 需要权限等
  3. 呈现搜索结果
- 搜索引擎的优化 SEO
  - 语义性 HTML 标记
    - 标题用 `<h1>`，一个页面只有一个；副标题用 `<h2>` 至 `<h6>`
    - 不能过度使用 h 标签，多次使用不会增加 SEO
    - 段落用 `<p>`，列表用 `<ul>`，且 `<li>` 只放在 `<ul>` 中
    - ...
  - 每个页面需包含：标题 + 内部链接
    - 每个页面对应的 title，同一网站所有页面都有内链可以指向首页
  - 确保链接可供抓取(路径正确且使用 a 标签)
  - meta 标签优化：设置 description keywords 等
  - 文本标记和 img
    - 文本：加粗、斜体等
    - img 标签：alt 属性，图片加载失败，会爬取 alt 内容
  - robots.txt 文件：规定爬虫可访问网站上的哪些网址
    - 可在线生成
  - sitemap.xml 站点地图：在站点地图列出所有网页，确保爬虫不会漏掉某些网页
    - 可在线生成
- 静态站点生成 SSG
  - static site generate，是预先生成好的静态网站
    - 一般在构建阶段就确定了网站的内容
    - if 网站的内容需要更新，需要重新构建和部署
  - 常见的库和框架：Vue -> Nuxt; React -> Next.js
  - 优点
    1. 访问速度非常快，因为每个页面都是在构建阶段就已经提前生成好的
    2. 直接给浏览器返回静态的 HTML，也有利于 SEO
    3. 依然保留了 SPA 应用的特性：前端路由、响应式数据、虚拟 DOM 等
  - 缺点
    1. 页面都是静态的，不利于展示实时性的内容，实时性更适合 SSR
    2. if 内容更新，必须重新构建和部署
- 服务器端渲染 SSR
  - Server Side Render，在服务器端渲染页面，并将渲染好的 HTML 返回给浏览器呈现
    - 又称同构应用
  - 常见的库和框架：Vue -> Nuxt; React -> Next.js
  - 优缺点
    - 优点
      1. 更快的首屏渲染速度
         - 当用户访问首页时可立即返回静态页面内容，而无需等待浏览器加载完成整个应用程序
      2. 更好的 SEO
      3. 在 Hydration 之后依然可以保留 Web 应用程序的交互性
    - 缺点
      1. 需要对服务器进行更多的 API 调用，以及在服务器端渲染需要消耗更多的服务器资源，成本高
      2. 增加了一定的开发成本，需要关心哪些代码是运行在服务器端，哪些代码是运行在浏览器端
      3. SSR 配置站点的缓存通常会比 SPA 站点要复杂一些
  - 解决方案
    - 方案一：php, jsp... -- 正经人谁用这个哇
    - 方案二：从零搭建 SSR 项目(Node + Webpack + Vue/React)
    - 方案三：直接使用流行框架
      - React => Next.js
      - Vue
        - Vue3 => Nuxt3
        - Vue2 => Nuxt.js
      - Angular => angular Universal
  - 应用场景
    - SaaS 产品：电子邮件网站、在线游戏、客户关系管理系统 CMR、采购系统...
    - 门户网站、电子商务、零售网站
    - 单个页面、静态网页、文档类网站
    - ...

### 7.2 Node 服务搭建

1. 安装第三方库
   - `npm install express`
   - `npm install -D nodemon`
   - `npm install -D webpack webpack-cli webpack-node-externals`
2. 返回字符串
   ```js
   server.get('/', (req, res) => {
     res.send(
       `
        Hello Node Server.
      `
     );
   });
   ```
3. 打包 config/wp.config.js

   ```js
   const path = require('path');
   const nodeExternals = require('webpack-node-externals');

   module.exports = {
     target: 'node',
     mode: 'development',
     entry: './src/server/index.js', // 路径相对于 package.json
     output: {
       filename: 'server_bundle.js',
       path: path.resolve(__dirname, '../build/server')
     },
     resolve: {
       extensions: ['.js', '.json', '.wasm', '.jsx', '.vue']
     },
     externals: [nodeExternals()]
   };
   ```

   ```json
   {
     "scripts": {
       "build:server": "webpack --config ./config/wp.config.js --watch"
     }
   }
   ```

4. 继续安装第三方库: vue, vue-loader, @babel@core, babel-loader, @babel/preset-env, webpack-merge
5. src/app.js

   ```js
   import { createSSRApp } from 'vue';
   import App from './App.vue';

   export default function createApp() {
     let app = createSSRApp(App);
     return app;
   }
   ```

   - 避免跨请求状态的污染：通过函数返回 app 实例，可以保证每个请求都会返回一个新的 app 实例

6. src/server/index.js

   ```js
   import createApp from '../app';
   import { renderToString } from '@vue/server-render';

   server.get('/', async (req, res) => {
     const app = createApp();
     const appStringHtml = await renderToString(app);
     res.send(`
      <body>
        ${appStringHtml}
      </body>
     `);
   });
   ```

7. 增加 wp.config.js loader
   ```js
   const { VueLoaderPlugin } = require('vue-loader/dist/index');
   module.exports = {
     module: {
       rules: [
         {
           test: /\.js$/,
           loader: 'babel-loader',
           options: {
             presets: ['@babel/preset-env']
           }
         }
       ]
     },
     plugins: [new VueLoaderPlugin()]
   };
   ```
8. 服务端打包：`"build:server": "webpack --config ./config/server.config.js --watch"`
9. 书写普通 Vue 实例创建过程，并创建 `server.config.js`，添加客户端打包脚本 `build:client`
   - target -> `web`
   - entry -> `./src/client/index.js`
   - output.filename -> `client_bundle.js`
10. hydration

    1. 在 html 页面中加入 `client_bundle.js`
    2. 将 build 文件夹作为静态资源部署 `server.use(express.static('build'))`

    - 定义环境变量

      ```js
      const { DefinePlugin } = require('webpack');

      module.exports = {
        plugins: [
          new VueLoaderPlugin(),
          new DefinePlugin({
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false
          })
        ]
      };
      ```

- 跨请求状态污染
  - 在 SSR 环境下，App 应用模块通常只在服务器启动时初始化一次。
    - 同一个应用模块会在多个服务器请求之间复用
    - 单例状态对象也会在多个请求之间被复用
    - => 导致某个用户对共享的单例状态进行修改，那么这个状态可能会意外地泄露给另一个在请求的用户
  - 解决方案
    - 在每个请求中为整个应用创建一个全新的实例，包括后面的 router 和全局 store 等实例
    - 在创建 App or 路由 or Store 对象时都使用一个函数来创建，保证每个请求都会创建一个全新的实例
- 拆分 webpack config
  - `base.config.js`

### 7.3 Vue3 + SSR 搭建

#### 7.3.1 邂逅 Vue3 + SSR

- App 创建
  - createApp: 创建应用，直接挂载到页面上
  - createSSRApp: 创建应用，在激活模式下挂载应用
    - 服务端用 `@vue/server-renderer` 包中的 `renderToString` 来渲染

### 7.4 SSR + Hydration

### 7.5 Vue SSR + Router

1. `npm install vue-router`
2. 安装路由插件，并跳转路由
   - server: `createMemoryHistory` -> `await router.push(req.url || '/')`: 异步组件
     - `/` or `/about`
     - 跳转路由后，需要 `await router.isReady()` 等待路由加载完成
     - `server.get('/*', callback)`: 保证 `/` 和 `/about` 都能请求到页面
   - client: 也需要安装路由插件 `createWebHistory()`
     - 也需要等待 `router.isReady()` 再挂载应用程序

### 7.6 Vue SSR + Pinia

1. `npm i pinia`
2. pinia 在 hydration 的时候同步一份数据到 client

   - pinia -> json string -> window.\_\_xx -> hydration 时 json object -> pinia
     3, `src/store/home.js`

   ```js
   import { defineStore } from 'pinia';

   export const useHomeStore = defineStore('home', {
     state() {
       return {
         count: 100
       };
     },
     actions: {
       increment() {
         this.count++;
       },
       async fetchHomeData() {}
     }
   });
   ```

3. 在 app 中安装 pinia 插件

   ```js
   import { createPinia } from 'pinia';

   const pinia = createPinia();
   app.use(pinia);
   ```

4. 在页面中使用 pinia 的数据

   ```js
   import { storeToRefs } from 'pinia';
   import { useHomeStore } from '../store/home';

   const homeStore = useHomeStore();
   const { count } = storeToRefs(homeStore);
   ```

## 八、Nuxt3

### 8.1 邂逅 Nuxt3 与初体验

#### 8.1.1 邂逅

- 创建一个现代应用程序，所需的技术
  - 支持数据双向绑定和组件化 —— Vue.js
  - 处理客户端的导航 —— Vue-Router
  - 支持开发中热模块替换和生产环境代码打包 —— webpack 和 Vite
  - 兼容旧版浏览器，支持最新的 JavaScript 语法转译 ——esbuild
  - 应用程序支持开发环境服务器，也支持服务端渲染 or API 接口开发
  - Nuxt 使用 h3 来实现部署可移植性(h3: 一个极小的高性能 http 框架)
    - 支持在 Serverless、Workers 和 Node.js 环境中运行
      - Serverless: 无服务，其实指无需环境与配置
- Nuxt3 特点
  - Vue3 + Vite
  - 自动导包
    - 自动导入辅助函数、组合 API 和 Vue API，无需手动导入
    - 基于规范的目录结构，Nuxt 还可以对自己的组件、插件使用自动导入
  - 约定式路由(目录结构即路由)
    - 在 `pages/` 目录中创建的每个页面，都会根据目录结构和文件名来自动生成路由
  - 支持多种渲染模式: SSR, CSR, SSG, ...
  - 利于搜索引擎优化：服务器端渲染模式，不但可以提高首屏渲染速度，还利于 SEO
  - 服务器引擎
    - 开发环境: Rollup + Node.js
    - 生产环境: 使用 Nitro 将应用程序和服务器构建到一个通用 `.output` 目录中
      - Nitro 服务引擎提供了跨平台部署的支持，包括 Node, Deno, Serverless, Workers 等平台

#### 8.1.2 初体验

- 配置
  - Node.js >= 16.11
  - VS Code 插件: Volar, ESLint, Prettier

1. 新建项目
   - 方式一：`npx nuxi init hello-nuxt`
   - 方式二：`pnpm dlx nuxi init hello-nuxt`
   - 方式三：`npm install -g nuxi && nuxi init hello-nuxt`
   - if `ping raw.githubusercontent.com` 不通
     1. 配置 host，本地解析域名
        - Mac's host 配置路径: `/etc/hosts`
        - Win's host 配置路径: `c:/Windows/System32/drivers/etc/hosts`
     2. 在 host 文件中新增一行配置 `185.199.108.133 raw.githubusercontent.com`
     3. 重新 ping 域名，如果通了就可以用
2. `pnpm install --shamefully-hoist`: 创建一个扁平的 node_modules 目录结构
3. 设置环境变量

   - 方法一

     ```js
     /** nuxt.config.ts */
     export default defineNuxtConfig({
       runtimeConfig: {
         appKey: 'aabbcc',
         public: {
           baseURL: 'http://example.com'
         }
       }
     });

     /** 使用 */
     if (process.server) {
       console.log('运行在 server');
       console.log(runtimeConfig.appKey);
       console.log(runtimeConfig.public.baseURL);
     }

     // typeof window === 'object' 也可以
     if (process.client) {
       console.log('运行在 client');
       console.log(runtimeConfig.public.baseURL);
     }

     const runtimeConfig = useRuntimeConfig();
     ```

   - 方案二：会覆盖方案一

     ```env
     NUXT_APP_KEY = 'dddd'
     NUXT_PUBLIC_BASE_URL = 'http://localhost'

     PORT = 9090
     ```

4. 不同端运行代码

   ```js

   ```

### 8.2 Nuxt3 全局配置

- `nuxt.config.ts` 配置文件位于项目的根目录，可对 Nuxt 进行自定义配置
  - runtimeConfig: 运行时配置，即定义环境变量
    - .env 文件可以覆盖 (打入到 process.env)
  - appConfig: 应用程序配置
    - 可以另外在 `defineAppConfig` 中配置，且会覆盖 `defineConfig` 中的 `appConfig` 的配置
  - app
    - 给所有页面的 head 添加内容
    - 但优先使用 `useHead()` 内的配置
  - ssr: 指定应用渲染模式
  - router: 配置路由相关信息，比如在客户端渲染可以配置 hash 路由
  - alias: 路径的别名，默认已配置好
  - modules: 配置 Nuxt 扩展的模块，如 `@pinia/nuxt`, `@nuxt/image`

| Feature                   | runtimeConfig | app.config |
| ------------------------- | ------------- | ---------- |
| Client Side               | Hydrated      | Bundled    |
| Environment Variables     | √             | ×          |
| Reactvie                  | √             | √          |
| Type support              | √ partial     | √          |
| Configuration per Request | ×             | √          |
| Hot Module Replacement    | ×             | √          |
| Non primitive JS types    | ×             | √          |

### 8.3 Nuxt3 内置组件

- `<NuxtPage>`: 页面占位组件
  - 对 `<router-view>` 的封装
  - 需要显示位于 目录中的顶级 or 嵌套页面 `pages/`
- `<ClientOnly>`: 只会在客户端渲染
  - `fallback` 属性：默认 `<span>` 元素
  - `fallback-tag`: 设置元素类型
- `<NuxtLink>`: 页面导航组件
  - 是 `<router-link>` 和 `<a>` 的封装

### 8.4 Nuxt3 样式和资源

#### 8.4.1 样式

- 全局样式
  1. 在 `root/assets` 中编写全局样式，比如 `global.scss`
  2. 在 `nuxt.config` 中的 `css` 选项配置
  3. 执行 `npm i -D sass`
  - 手动导入
    - `@use './variables.scss' as vb;`: 起一个命名空间，防止同名变量覆盖
      - if `as *`，省略命名空间
  - 自动导入
    ```js
    export default defineNuxtConfig({
      vite: {
        css: {
          preprocessorOptions: {
            scss: {
              additionalData: '@use "@/assets/styles/variables.scss" as vb;'
            }
          }
        }
      }
    });
    ```
    - 不要忘了 `;`

#### 8.4.2 资源

- public 下资源访问
  ```html
  <img src="/user.png" />
  ```
- assets 下
  ```html
  <img src="~/assets/images/avatar.png" />
  ```

### 8.5 Nuxt3 页面、导航与路由

- 添加新页面
  ```shell
  $ npx nuxi add page find/index
  $ npx nuxi add page profile
  ```
- `<NuxtLink>`
  - 虽然可以用 `<a>` 替代，但不建议这么做，会刷新页面
  - 建议对外部链接加上 `external` 属性
- `navigateTo()`
  - 作用：编程导航
  - 但不利于 SEO
- `useRouter()`: `const router = useRouter()`
  - `back()`
  - `forward()`
  - `go()`
  - `push()`: 建议改用 `navigateTo()` 支持性更好
  - `replace()`: 同上
  - `beforeEach()`: 路由守卫钩子，
  - `afterEach()`
- 动态路由
  - 示例
    1. 创建动态路由文件 `pages/detail-[role]/[id].vue`
    2. 在 `[id].vue` 文件中
    ```ts
    const route = useRoute();
    const { role, id } = route.params;
    ```
  - 动态路由只能匹配当前路径，再往后会 404
    - 可以使用 `detail/[...slug].vue` 一直往后匹配
      - `slug` 非固定，按自己喜欢
      - `404.vue` 在 Nuxt3 中不再生效
  - 路由参数获取
    ```ts
    const route = useRoute();
    const { name, age } = route.params;
    ```
- 路由匹配注意事项
  - 优先级
    1. 预定义路由
       - 示例 `pages/detail/create.vue` -> `/detail/create`
    2. 动态路由
    3. 捕获所有路由

### 8.6 嵌套路由和中间件

- 嵌套路由
- 路由中间件 middleware

  - 分类

    - 匿名(内联)路由中间件
      ```ts
      definePageMeta({
        middleware: [
          // 只有两个参数
          function (to, from) {
            // if 返回 '' | null | undefined | 不返回，执行下一个中间件
            // else if 返回 navigateTo，直接导航到新页面
            // else if 抛出错误，报错
            return navigateTo('/detail02');
          },
          function (to, from) {}
        ]
      });
      ```
    - 命名路由中间件：命名规范 kebab-case

      ```ts
      /** root/middleware/home.ts */
      export default defineNuxtRouteMiddleware((to, from) => {
        console.log('home.ts 第二个中间件');
      });

      /** root/pages/detail.vue */
      definePageMeta({
        middleware: ['home']
      });
      ```

      - server side: 刷新浏览器时就执行
      - client side: 切换路由时才执行

    - 全局路由中间件
      - 命名为 `auth.global.ts`
      - 优先级最高

  - 路由验证 validate: 对路由参数进行验证

    ```ts
    definePageMeta({
      validate(route) {
        const isValid = /^\d+$/.test(route.params.id as string);
        if (isValid) return true;
        return {
          statusCode: 404, // 路由验证失败
          statusMessage: 'validate router error' // 中文会报错
        };
      }
    });
    ```

    - 若验证失败，进入 `root/error.vue`(自定义 404 页面)

      ```vue
      <template>
        <div>
          <h3>error: {{ error }}</h3>
          <button @click="goHome">Home</button>
        </div>
      </template>
      <script lang="ts">
      const props = defineProps({
        error: Object
      });

      function goHome() {
        clearError({ redirect: '/' });
      }
      </script>
      ```

### 8.7 Nuxt 自定义布局

- Layout 布局

  - 布局方式

    1. 默认布局

       ```vue
       <!-- root/layouts/default.vue -->
       <template>
         <div class="layout">
           <div class="header">Header</div>
           <!-- 页面内容 -->
           <slot></slot>
           <div class="footer">footer</div>
         </div>
       </template>

       <!-- 在 app.vue 中使用 -->
       <template>
         <!-- 布局 -->
         <NuxtLayout>
           <!-- 页面 -->
           <NutxPage></NutxPage>
         </NuxtLayout>
       </template>
       ```

    2. 自定义布局 Custom Layout

       ```vue
       <!-- root/layouts/custom-layout -->
       <template>
         <div class="custom-layout">
           <!-- 页面内容 -->
           <slot></slot>
         </div>
       </template>

       <!-- 在 app.vue 中使用 -->
       <template>
         <!-- 布局 -->
         <NuxtLayout>
           <!-- 页面 -->
           <NutxPage></NutxPage>
         </NuxtLayout>
       </template>

       <!-- 在 特殊页面比如 pages/login.vue 中 -->
       <template></template>
       <script lang="ts" setup>
       // 该页面重新定义使用的 layout
       definePageMeta({
         layout: 'custom-layout'
       });
       </script>
       ```

### 8.8 页面渲染模式

- 渲染
  - 浏览器和服务器都可以解析 JavaScript 代码，将 Vue.js 组件呈现为 HTML 元素
  - 分类
    - 客户端渲染模式
    - 服务器渲染模式
- Nuxt 支持多种渲染模式
  ```ts
  export default defineNuxtConfig({
    routeRules: {
      '/blog/**': { swr: true },
      '/articles/**': { static: true },
      '/admin/**': { ssr: false }
    }
  });
  ```
  - 客户端渲染模式 CSR: 只需将 ssr 设为 `false`
  - 服务器端渲染模式 SSR: ssr 设为 `true`
  - 混合渲染模式: SSR | CSR | SSG | SWR，需再 `routeRules` 根据每个路由动态配置渲染模式

### 8.9 Nuxt 3 插件开发

- 创建插件方式

  1. 使用 `useNuxtApp()` 中的 `provide(name, value)`

     - 提供了访问 Nuxt 共享运行时上下文的方法和属性: provide, hooks, callhook, vueApp

     ```ts
     const nuxtApp = useNuxtApp();
     nuxtApp.provide('formData', () => {
       return '1111';
     });
     nuxtApp.private('version', '1.0.0');

     console.log(nuxtApp.$formData());
     console.log(nuxtApp.$version);
     ```

  2. 在 plugins 目录中创建插件(推荐)
     - 顶级和子目录 index 文件写的插件会在创建 Vue 应用程序时自动加载和注册
     - `.server` or `.client` 后缀名插件，可区分服务器端 or 客户端，用时需区分环境
     ```ts
     export default defineNuxtPlugin((nuxtApp) => {
       return {
         provide: {
           formPrice(price: number) {
             return price.toFixed(2);
           }
         }
       };
     });
     ```

- 在 plugins 目录中创建插件步骤
  1. 在 plugins 目录下创建 `plugins/price.ts` 插件
  2. `defineNuxtPlugin` 函数创建插件，参数是一个回调函数
  3. 在组件中使用 `useNuxtApp()` 拿到插件中的方法
- 注意事项
  - 插件注册顺序可以通过在文件名前加一个数字来控制
    - 示例 `plugins/1.price.ts`

### 8.10 Lifecycle Hooks

### 8.11 获取数据、API 接口

- `useAsyncData(key, func)`
  - 刷新时，客户端不会发起请求，只有服务端发送请求
  - 页面切换时，客户端和服务端都会发送请求
  - 阻塞页面导航
- `useFetch(url, opts)`
  - `useAsyncData` 的简写
  - `opts`
    - `method: 'GET'` => `query: {}`
    - `method: 'POST'` => `body: {}`
    - `onRequest`: 拦截器
      - `({ request, options })`
    - `onRequestError`
      - `({ request, options, error })`
    - `onResponse`
      - `({ request, response, options })`
        `onResponseError`
      - `({ request, response, options, error })`
  - 刷新时，server 端发起网络请求，但 client 会在 hydration 后拿到响应数据
  - 阻塞页面导航
- `useLazyFetch(url, opts)`
  - `useFetch` 默认阻塞页面的导航，加上 `opts.lazy = true` 可解决
    - => `useLazyFetch`
  - 需要确保后续代码一定能拿到返回值，需要使用 `watch`
    ```ts
    watch(data, (newData) => {
      console.log(data);
    });
    ```
- `useLazyAsyncData(key, func)`
- 注意：这些函数只能在 `setup` or Lifecycle Hooks 中使用
- `useFetch` VS axios
  - `useFetch`: 底层调用 `$fetch`，该函数基于 `unjs/ohmyfetch` 库，并于原生的 Fetch API 有相同的 API
  - `unjs/ohmyfetch` 优点
    1. 在服务器端能够智能地处理 API 接口的直接调用
    2. 在客户端可以对后台提供的 API 接口正常地调用，也支持第三方接口调用
    3. 会自动解析响应和对数据进行字符串化
  - `useFetch` 支持智能的类型提示和推断 API 响应类型
  - 在 `setup` 中使用，刷新页面时会减去客户端重复发起的请求

### 8.12 useState 和 Pinia

#### 8.12.1 useState

```ts
/** root/composables/useCounter.ts */
export default function () {
  return useState('counter', () => 100);
}
```

- 注意事项：
  1. 只能在 setup 函数和 Lifecycle Hooks 中使用
  2. 不支持 classes, functions or symbols

#### 8.12.2 Pinia

```shell
$ npm install @pinia/nuxt --save
```

### 8.13 项目实战

- 集成 element-plus
  1. 安装依赖
     ```shell
     $ pnpm add element-plus --save
     $ pnpm add unplugin-element-plus --save-dev
     ```

## 九、Next

### 9.1 邂逅 React18 + SSR

- 创建应用

  - createRoot: 创建一个 Root，接着调用其 render 函数将 App 直接挂载到页面上
  - hydrateRoot: 创建水合 Root，在激活的模式下渲染 App

    - 服务端使用 ReactDOM.renderToString 来进行渲染

      ```ts
      import React from 'react';
      import RreactDOM from 'react-dom/client';
      import App from '../index.tsx';

      ReactDOM.hydrateRoot(document.getElementById('root'), <App />);
      ```

### 9.2 手动搭建 React SSR

#### 9.2.1 Node Server 搭建

```shell
$ npm i express
$ npm i -D nodemon
$ npm i -D webpack webpack-cli webpack-node-externals
```

1. 使用 express 创建服务
2. 对 `.get('/')` 返回模板
3. 对服务启动写一个脚本 `"dev"`
4. 对不同的终端进行不同的配置，并添加脚本 `build:server`
   - `server`
     - `target`
     - `mode`
     - `entry`
     - `output`
     - `module.rules`
     - `resolve`
     - `externals`

#### 9.2.2 React18 + SSR 搭建

```shell
$ npm i react react-dom
$ npm i -D babel-loader @babel/preset-react @babel/preset-env
```

- `@babel/preset-react`: 用于处理 jsx 语法

1. 创建 `src/app.jsx`，并填充内容
2. 将 `app.jsx` 转为 App String Html

   ```js
   import ReactDOM from 'react-dom/server';
   import App from '../app.jsx';

   const AppHtmlString = ReactDOM.readerToString(<App />);
   ```

### 9.2.3 React18 SSR + Hydration

1. 新建 `root/client/index.js`，作为客户端的入口
2. 激活 App，将内容挂载到页面上

   ```js
   import ReactDOM from 'react-dom/client';

   ReactDOM.hydrateRoot(document.getElementById('app'), <App />);
   ```

3. 新建 `root/config/client.config.js`
   - `target: "web"`
   - `entry`
   - 删去 `externals`
4. 增加脚本 `build:client`
5. 在 `server/index.js` 中使用

   ```js
   // 静态资源部署
   server.use(express.static('build'));

   res.send(`
     ...
     <script src="/client/client_bundle.js"></script>
     ...
   `);
   ```

6. 合并配置
   - 文件: `base.config.js`, `client.config.js`, `server.config.js`
   - by `const { merge } = require('webpack-merge')`

### 9.2.4 React18 SSR + Router

```shell
$ npm i react-router-dom # 默认自动安装 react-router
```

```js
/** src/router/index.js */
const routes = [
  {
    path: '/',
    element: <Home />
  }
];

/** src/app.jsx */
const App = function () {
  return (
    <div className="app">
      <div>
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>

      {useRoutes(routes)}
    </div>
  );
};

/** server/index.js */
import { StaticRouter } from 'react-router-dom/server';

server.get('/*', (req, res) => {
  const AppHtmlString = ReactDOM.renderToString(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );
});

/** client/index.js 同理 */
import { BrowserRouter } from 'react-router-dom';
```

### 9.6 React 18 + Redux

```shell
$ npm i react-redux @reduxjs/toolkit
$ npm i axios
```

```js
/** store/index.js */
import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './modules/home';

const store = configureStore({
  reducer: {
    home: homeReducer
  },
  devTools: true // 默认为 true
});

export default store;

/** store/modules/home.js */
import { createSlice } from '@reduxjs/toolkit';

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    counter: 1000
  },
  reducers: {
    increment(state, action) {
      // action: { type, payload }
      state.counter += payload;
    }
  }
});

// 同步 actions
export const { increment } = homeSlice.actions;
// 切片生成的 reducer
export default homeSlice.reducer;

/** src/client/index.js */
import {Provider} from 'react-redux'
import store from '../store/index'

ReactDOM.hydrateRoot(...,
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

/** src/server/index.js 同理 */

/** src/pages/home.jsx 使用 */
import {increment} from '../store/modules/home'

const Home = function() {
  const { counter } = useSelector(rootState => ({
    counter: rootState.home.counter
  }));

  const dispatch = useDispatch()
  function addCounter () {
    dispatch(increment(1))
  }
}
```

### 9.3 Next.js 初步使用

#### 9.3.1 邂逅 Next.js

- 支持
  1. 支持 CSR、SSR、SSG、ISR(Incremental Static Regeneration) 等渲染模式
  2. 提供创建 Web 应用程序的构建块
     - 用户界面、路由、数据获取、渲染模式、后端服务等
- 原则
  - 开箱即用
  - 无处不在的 JS
  - 所有函数用 JS 编写
  - 自动代码拆分和服务器渲染
  - 可配置数据获取
  - 预期请求和简化部署
- Next.13
  1. 带来一种新的路由模式，增加了 app 目录、页面布局、服务器组件和一组新的数据获取方法等
  2. 编译和压缩等由 Babel + Terser 换为 SWC(Speedy Web Compiler)，构建工具增加了 Turbopack
- 特点
  - 开箱即用，快速创建：集成各种技术栈
  - 约定式路由
  - 内置 CSS 模块和 Sass 支持
  - 全栈开发能力：支持编写后代代码
  - 多种渲染模式
  - 利于搜索引擎优化：支持使用服务器端渲染，同时也是一个很棒的静态站点生成器，利于 SEO 和首屏优化

#### 9.3.2 Next.js 初体验

1. 创建项目：项目名不支持大写
   ```shell
   $ npx create-next-app@latest --typescript # 推荐该方式
   $ yarn create npx-app --typescript
   $ pnpm create next-app -typescript
   $ npm i create-nextapp@lastest -g && create-next-app
   ```

- 目录结构
  - `tsconfig.json`: 编译的配置
  - `next.config.js`: 项目的配置文件
  - `.eslintrc.json`: eslint 规则
  - `public`: 资源
  - pages
    - index.tsx: 首页 即 Home
    - \_document.tsx: 文档配置
    - \_app.tsx: 应用程序入口
      - 扩展自定义的布局 Layout
      - 引入全局的样式文件
      - 引入 Redux 状态管理
      - 引入主题组件
      - 全局监听客户端路由的切换
    - api: 接口

#### 9.3.3 全局配置

- `ts.config.json` 的配置
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/assets/*": ["assets/*"],
        "@/components/*": ["components/*"],
        "@/styles/*": ["styles/*"],
        "@/pages/*": ["pages/*"]
      }
    }
  }
  ```
- 环境变量
  - 定义
    - `.env`: 所有环境下都生效的默认配置
    - `.env.development`
    - `.env.production`
    - `.env.local`: 始终覆盖其他文件的定义的默认值。所有环境生效，通常只需要一个 `.env.local` 文件，常用于存储敏感信息
  - 获取：不支持解构
    ```js
    process.env.xxx;
    ```
  - 注意：`.env.*.local` 应当添加至 `.gitignore` 中，因为需要被忽略
- Next.js 配置(next.config.ts)
  - reactStrictMode: 是否启用严格模式
  - env: 配置环境变量
    - 优先级：`next.config.ts` > `.env.local` > `.env`
  - basePath: 要在域名的子路径下部署 Next.js 应用程序，可使用该选项
  - images: 可配置图片 URL 的白名单等信息
  - swcMinify(default true): 用 Speedy Web Compiler 编译和压缩技术，而不是 Babel + Terser
  - ...

1. 新建 `components/hy-button/index.tsx`
   ```ts
   const HYButton = function () {
     return (
       <div>
         <h2>HY Button</h2>
       </div>
     );
   };
   ```
2. `pages/index.tsx` 中使用 HYButton
   ```tsx
   import HYButton from 'components/HYButton';
   ```
3. 环境变量编写

   ```
   NAME=localhost
   PORT=8888

   NEXT_PUBLIC_HOSTNAME=http://localhost:8888

   NEXT_PUBLIC_BASE_URL=http://$NAME:$PORT
   ```

   ```tsx
   export default function Home() {
     if (typeof window === 'object') {
       console.log('client');
       console.log(process.env.NEXT_PUBLIC_HOSTNAME);
     } else {
       console.log('server');
       console.log(process.env.NAME);
       console.log(process.env.PORT);
       console.log(process.env.NEXT_PUBLIC_HOSTNAME);
     }

     return (
       <>
         <h1>Home</h1>
       </>
     );
   }
   ```

   - by `dotenv` 库

#### 9.3.4 内置组件

- `<Head>`

  ```tsx
  /** pages/index.tsx */
  import Head from 'next/head';

  export default function Home() {
    return (
      <div>
        <Head>
          <title>我是 Title</title>
          <meta name="description" content="网易云音乐商城" />
          <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        </Head>
      </div>
    );
  }
  ```

- `<Script>`
- `<Link>`
- `<Image>`

  - 自动确定图片的宽高
  - 默认懒加载
  - 外部网站的图片需要在 `next.config.js` 中进行白名单配置

    ```js
    const nextConfig = {
      images: {
        remotePatterns: [
          {
            protocal: 'https',
            hostname: '**.music.126.net'
          }
        ]
      }
    };

    module.exports = nextConfig;
    ```

  - `width` 和 `height` 属性是 `number` 类型，不支持 `100%`
  - `priority`: 预加载
    - 大图且在首屏可见时才使用该属性

#### 9.3.5 样式和资源

- 样式
  - 全局样式
    - `[root]/styles/globals.css`
  - 局部样式
    - 默认支持 CSS Module: `xxx.module.scss`
  - if 使用 Sass，需要安装 `npm i sass -D`
    - `variables.scss` 使用
      1. `@use './variables.scss' as *`: 手动导入
      2. 导出
         ```scss
         :export {
           primaryColor: green;
         }
         ```
- 静态资源引用

  - `[root]/public` 文件夹下，直接 `"/xxx.png"` 即可
  - `[root]/assets` 文件夹下

    - `<Image>` 中

      ```tsx
      import UserImg from '../assets/images/user.png';

      export default function () {
        return (
          <div>
            <Image src={UserImg}></Image>
          </div>
        );
      }
      ```

    - 背景图片
      ```css
      .bg {
        width: 200px;
        height: 200px;
        background-image: url(~/assets/images/user.png);
      }
      ```

#### 9.3.6 页面和导航

- 页面

  - 页面文件

    ```tsx
    /** [root]/pages/category.tsx */
    import { memo, ReactElement } from 'react';
    import type { FC } from 'react';
    export interface IProps {
      children?: ReactElement;
    }

    const Category: FC<IProps> = function (props) {
      const { children } = props;

      return (
        <div className="category">
          <div>category</div>
        </div>
      );
    };

    export default memo(Category);
    Category.displayName = 'Category'; // 方便以后调试
    ```

- 导航

  - 组件导航 `<Link>`

    - 底层实现是 `<a>` 标签，但不建议直接使用 `<a>` 标签，因为会默认刷新浏览器

      ```tsx
      import Link from 'next/link';

      function App({ Component, pageProps }: AppProps) {
        return (
          <div>
            <div>
              <Link href="/">
                <button>home</button>
              </Link>
              <Link href="/category">
                <button>category</button>
              </Link>
            </div>
            {/* 页面内容 */}
            <Component {...pageProps} />
          </div>
        );
      }
      ```

    - 属性
      - `href`
      - `target`
      - `as`: 给路径起一个别名
      - `replace`

  - 编程导航 `useRouter`

    - 缺点：不利于 SEO
    - router 对象的方法

      - `push`
      - `replace`
      - `back`
      - `events.on(name, callback)`

        ```tsx
        // 一般写在 _app.tsx 文件中，监听每个页面
        useEffect(() => {
          const handleRouterChange = (url: string) => {
            console.log('routerChangeStart =>', url);
          };

          router.events.on('routerChangeStart', handleRouterChange); // url 为当前访问的路径

          return () => {
            router.events.off('routerChangeStart', handleRouterChange);
          };
        }, []);
        ```

#### 9.3.7 动态路由

- 写法
  - 文件名
    1. `pages/detail/[id].tsx` -> `/detail/:id`
    2. `pages/detail/[role]/[id].tsx` -> `/detail/:role/:id`
  - 文件内容
    ```tsx
    const router = useRouter();
    const { id } = router.query;
    ```
- 404 Page
  1. 捕获所有不匹配的路由
     - `[...slug].tsx`: if 在其他目录下的话，仅作用于该目录及其子目录(对当前路径不生效)
       - slug 不固定，换成 params 也一样，随意
  2. `404.tsx`: 仅支持写在 `[root]/pages/` 下
- 路由匹配优先级
  1. 预定义路由
  2. 动态路由
  3. 捕获所有路由

### 9.4 中间件 和 匹配器

- middleware
  - 作用：拦截客户端发起的请求 —— API 请求、router 切换、资源加载、站点图片...
  - 使用步骤
    1. 创建 `[root]/middleware.ts` 文件
    2. 接收参数 `req: NextRequest` 和 `event: NextFetchEvent`
    3. 返回 NextResponse 对象用于重定向
       - 方法
         - `next`: 继续中间件链
         - `redirect`: 重定向到某个页面
         - `rewrite`: 重写 URL(如反向代理)
    4. if 无返回值，页面将按预期加载，与 `next()` 效果相同
- matcher
  ```ts
  export default config = {
    match: '/about/:path*', // 匹配以 /about/* 开头的路径
    match: ['/about/:path*', '/dashboard/:path*'], // 匹配这两个路径
    match: '/((?!api|_next/static|favicon.ico).*)' // 不匹配以 api, _next, static favicon.ico 开头的路径
  };
  ```
- 使用 middleware 和 matcher 实现路由拦截

  ```ts
  import { NextRequest, NextResponse } from 'next/server';

  export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if (!token && req.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    }

    // 重定向
    if (req.nextUrl.pathname.startWidth('/juanpi/api')) {
      return NextResponse.rewrite(
        new URL(req.nextUrl.pathname, 'http://codercba.com:9060')
      );
    }
    return NextResponse.next();
  }

  export const config = {
    // (?!_next) 匹配不包含 _next 路径
    matcher: '/((?!_next/static|api|favicon.ico).*)'
  };

  /** login.tsx 模拟登录 */
  import { setCookie } from 'cookies-next';

  const Login: FC<IProps> = function () {
    function login() {
      setCookie('token', 'abc', {
        maxAge: 100 // 以 s 为单位
      });
    }
  };
  ```

### 9.5 Layout 和 生命周期

- Layout

  - 布局组件 `<Layout>`
  - 嵌套布局 `<NestLayout>`

    - 实现嵌套路由

      ```tsx
      export interface IStaticProps {
        getLayout?: (page: ReactElement) => ReactElement;
      }

      const Profile: FC<IProps> & IStaticProps = function (props) {};

      Profile.getLayout = (page: ReactElement) => {
        return (
          <Layout>
            <NestLayout>{page}</NestLayout>
          </Layout>
        );
      };

      /** _app.tsx */
      type NextPageWithLayout = NextPage & {
        getLayout?: (page: ReactElement) => ReactElement;
      };

      type AppPropsWithLayout = Approps & {
        Component: NextPageWithLayout;
      };
      ```

- 生命周期

### 9.6 网络请求的封装

### 9.7 编写后端接口

### 9.8 页面渲染模式

- 预渲染
  - 步骤
    1. 预先为每个页面生成 HTML 文件，而不是由客户端 JavaScript 来完成
    2. 当浏览器加载一个页面时，页面依赖的 JS 代码将会执行，执行 JS 代码后会激活页面，使其具有交互性(hydration)
  - Next.js 具有两种形式的预渲染
    - 静态生成：HTML 在构建时生成，并在每次页面请求时重用
    - 服务器端渲染：在每次页面请求时，重新生成页面
  - 出于性能考虑，相对于服务器端渲染，更推荐使用静态生成
- SSG 静态生成
  - Static Site Generate，静态站点生成
  - 在生产环境中，打包时即生成页面对应的 HTML 文件，还可被 CDN 缓存
  - Next.js 可以静态生成带有数据 or 不带数据的页面
    - 不带数据
    - 带有数据
      - 页面内容取决于外部数据
        - 使用 Next.js 提供的 `getStaticProps` 函数
      - 页面 paths 取决于外部数据
        - 使用 Next.js 提供的 `getStaticPaths` 函数 + `getStaticProps`
- SSR 服务器端渲染

  ```tsx
  export interface IProps {
    children?: ReactElement;
    books?: any[];
  }

  const BooksSSR: FC<IProps> = memo(function (props) {
    const { children, books } = props;

    return <div></div>;
  });
  export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetchBooks(parseInt(context.query?.count));

    return {
      props: {
        books: res.data.books
      }
    };
  };
  ```

  - `getServerSideProps` 仅在服务端运行，从不在浏览器运行
    - 页面默认不会缓存

- ISR 增量静态再生
  - Incremental Static Regeneration
  ```tsx
  export async function getStaticProps(context: any) {
    const count = Math.floor(Math.random() * 10 + 1);
    const res = await fetchBooks(count);
    return {
      props: {
        books: res.data.books
      },
      revalidate: 5 // 每间隔 5 秒动态生成新的静态页面
    };
  }
  ```
- CSR 客户端渲染

  ```tsx
  const BooksCSR: FC<IProps> = memo(function (props) {
    const [books, setBooks] = useState([]);

    useEffect(() => {
      const count = Math.floor(Math.random() * 10 + 1);
      fetchBooks(count).then((res) => {
        setBooks(res.data.books);
      });
    });
  });
  ```

### 9.9 数据获取和 Redux

### 9.10 项目实战和部署

- 包括
  - 项目介绍
  - 项目实战
  - 集成 Redux Toolkit
  - 集成 Ant Design 5
  - 购买阿里云服务器
  - 项目打包和部署
- 项目依赖
  - 样式
    ```shell
    $ npm i normalize.css --save
    $ npm i sass --save
    $ npm i classnames --save
    ```
  - Redux and Toolkit
    ```shell
    $ npm i next-redux-wrapper --save
    $ npm i @reduxjs/toolkit react-redux --save
    ```
    - `next-redux-wrapper`
      1. 可以避免在访问浏览器端渲染页面时 store 重置
      2. 可以将服务器端 redux 存的数据同步到客户端上
      3. 提供了 `HYDRATE` 调度操作
         - 当用户访问动态路由 or 后端渲染的页面时，会执行 hydration 来保持两端数据状态一致
  - 网络请求
    ```shell
    $ npm i axios --save
    ```
  - AntDesign
    ```shell
    $ npm i antd --save
    $ npm i -D @types/antd
    ```
- Redux

  ```ts
  /* Hydrate 操作，保证服务器端与客户端数据一致 */
  export interface IHomeInitialState {
    counter: number;
  }

  const homeSlice = createSlice({
    name: 'home',
    initialState: {
      counter: 10
    } as IHomeInitialState,
    extraReducers: (builder) => {
      builder.addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.home
        };
      });
    }
  });

  /** store/index.ts */
  import { createWrapper } from 'next-redux-wrapper';

  const wrapper = createWrapper(() => store);
  export default wrapper;

  /** pages/index.tsx */
  export default function Home() {
    const { counter } = useSelector((rootState) => {
      return {
        counter: rootState.home.counter
      };
    });
  }
  ```
