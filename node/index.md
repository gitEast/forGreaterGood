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

### 1.5 Buffer 的创建方式

### 1.6 Buffer 的源码解析
