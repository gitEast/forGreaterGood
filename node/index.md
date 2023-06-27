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
