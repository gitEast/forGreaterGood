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
      LEFT JOIN comment c WHERE comment.moment_id = m.id
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
