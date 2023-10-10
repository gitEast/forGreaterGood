<!--
 * @Author: East
 * @Date: 2022-02-13 14:24:48
 * @LastEditTime: 2022-02-13 17:51:13
 * @LastEditors: Please set LastEditors
 * @Description: 生成器 + async + await + js线程
 * @FilePath: \forGreaterGood\javascript\coderwhy\22-生成器+async+await+js线程.md
-->

# 生成器 + async + await + js 线程

## 一、生成器(续)

### 1.1 生成器替代迭代器使用

> 生成器是特殊的迭代器，可以替代迭代器

1. 迭代数组

   ```js
   /** 迭代器写法 */
   function createArrayIterator(arr) {
     let index = 0;
     return {
       next: function () {
         if (index < arr.length) {
           return { done: false, value: arr[index++] };
         } else {
           return { done: true, value: undefined };
         }
       },
     };
   }
   const names = ["abc", "cba", "nba"];
   const namesIterator = createArrayIterator(names);
   console.log(namesIterator.next()); // { done: false, value: 'abc' }
   console.log(namesIterator.next()); // { done: false, value: 'cba' }
   console.log(namesIterator.next()); // { done: false, value: 'nba' }
   console.log(namesIterator.next()); // { done: true, value: undefined }

   /** 生成器 */
   function* createArrayIterator(arr) {
     // 方法一
     let index = 0;
     yield arr[index++];

     // 方法二
     for (const item of arr) {
       yield item;
     }

     // 方法三：方法二的语法糖
     yield* arr;
   }
   ```

   - `yield*` 后面跟的必须是可迭代对象

2. 迭代数字

   ```js
   /** 迭代器写法 */
   function createRangeIterator(start, end) {
     let index = start;
     return {
       next: function () {
         if (index < end) {
           return { done: false, value: i++ };
         } else {
           return { done: false, value: undefined };
         }
       },
     };
   }
   const rangeIterator = createRangeIterator(10, 20);
   rangeIterator.next();

   /** 生成器 */
   function* createRangeIterator(start, end) {
     let index = start;
     while (index < end) {
       yield index++;
     }
   }
   ```

### 1.2 异步代码的处理方案

```js
function requestData(url) {
  return new Promise((resolve, reject) => {
    // 模拟网络请求
    setTimeout(() => {
      // 拿到请求结果
      resolve(url);
    }, 2000);
  });
}

/* 新需求 */
// 1. url: why -> res: why
// 2. res + 'aaa' -> res: whyaaa
// 3. res + 'bbb' -> res whyaaabbb

// 第一种方案 --> 回调地狱
requestData("why")
  .then((res) => {
    console.log(res);
    requestData(res + "aaa")
      .then((res) => {
        console.log(res);
        requestData(res + "bbb")
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        consolelog(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });

// 第二种方案：Promise 中 then 的返回值来解决 --> 阅读性太差
requestData("why")
  .then((res) => {
    return requestData(res + "aaa");
  })
  .then((res) => {
    return requestData(res + "bbb");
  })
  .catch((err) => {
    console.log(err);
  });

// 第三种方案：Promise + generator
function* getData() {
  const res1 = yield requestData("why");
  const res2 = yield requestData(res1 + "aaa");
  const res3 = yield requestData(res2 + "bbb");
  console.log(res3);
}

const generator = getData();
generator.next().value.then((res) => {
  generator.next(res).value.then((res) => {
    generator.next(res).value.then((res) => {
      generator.next(res);
    });
  });
});
// 将上面的手动执行生成器函数改为自动执行
function execGenerator(genFn) {
  const generator = genFn();

  function exec(res) {
    const result = generator.next(res);
    if (result.done) {
      return result.value;
    }
    result.value.then((res) => {
      exec(res);
    });
  }

  exec();
}
execGenerator(getData);

// 第四种方案：async/await
async function getData() {
  const res1 = await requestData("why");
  const res2 = await requestData(res1 + "aaa");
  const res3 = await requestData(res2 + "bbb");
  console.log(res3);
}
```

- 自动执行生成器函数的 npm 包：co
  ```js
  const co = require("co");
  co(getData);
  ```
  - TJ: co/n/commander/express/koa

## 二、async 和 await

### 2.1 async function 异步函数

- 和普通函数相同的地方

  ```js
  async function foo() {
    console.log("foo start...");

    console.log(1);
    console.log(2);
    console.log(3);

    console.log("foo end...");
  }
  console.log("script start...");
  foo();
  console.log("script end...");
  ```

  1. 默认的运行顺序相同

- 不同的地方

  1. 异步函数的返回值一定是一个 **`Promise`**

     ```js
     async function foo() {
       console.log("foo start...");

       console.log("中间代码");

       console.log("foo end...");

       return {
         then: (resolve, reject) => {
           resolve("hahaha");
         },
       };
     }
     const promise = foo();
     promise.then((res) => {
       console.log(res); // 'hahaha'
     });
     ```

  2. 异常处理

     ```js
     async function foo() {
       console.log("foo start...");

       console.log("中间代码");

       throw new Error("error message");

       console.log("foo end...");
     }

     foo();
     console.log("后续还有代码");

     /* result: */
     // "foo start..."
     // "中间代码"
     // "后续还有代码"
     // 具体报错信息
     ```

     - 异常会作为异步函数返回的 `Promise` 的 `reject` 值

### 2.2 async 中使用 await 关键字

注意：`await` 关键字只能用在 async function 中

```js
function requestData(url) {
  return new Promise((resolve, reject) => {
    // 模拟网络请求
    setTimeout(() => {
      // 拿到请求结果
      resolve(url);
    }, 2000);
  });
}

async function foo() {
  const res = await requestData("why");
  console.log(res); // 'why'
}

foo();
```

- 如果 reject 了

  ```js
  function requestData(url) {
    return new Promise((resolve, reject) => {
      // 模拟网络请求
      setTimeout(() => {
        // 拿到请求结果
        reject(url);
      }, 2000);
    });
  }

  async function foo() {
    const res = await requestData("why");
    console.log(res); // 'why'
  }

  foo().catch((err) => {
    console.log(err);
  });
  ```

## 三、js 线程

### 3.1 进程和线程

进程和线程是操作系统中的两个概念：

- 进程(process)：计算机**已经运行的程序**，是**操作系统管理程序**的一种方式
- 线程(thread)：操作系统能够运行**运算调度的最小单位**，通常情况下**它被包含在进程**中

coderwhy 的解释：

- 进程：我们可以认为，启动**一个应用程序**，就会默认**启动一个进程(也可能是多个进程)**
- 线程：每**一个进程**中，都会启动**至少一个线程**来执行程序中的代码，这个县城被称为**主线程**
- 所以我们也可以说进程是线程的**容器**

### 3.2 操作系统的工作方式

操作系统是如何做到同时让多个进程(边听歌，边写代码，边查阅资料)同时工作呢？

1. 这是因为 **CPU 的运算速度非常快**，它可以**快速地在多个进程之间迅速地切换**
2. 当**进程中的线程**获取到**时间片**时，就可以**快速执行我们编写代码**
3. 对于用户来说，**是感受不到这种快速的切换**的

可以在 Mac 的活动监视器 或 Windows 的资源管理器中查看

### 3.3 浏览器中的 JavaScript 线程

我们经常会说 JavaScript 是**单线程**的，那么 JavaScript 的线程应该有自己的容器进程：**<span style="color:red">浏览器 或 Node</span>**

- 浏览器是一个进程吗？它里面只有一个线程吗？
  - 目前**多数的浏览器都是多进程**的，当我们打开一个 tab 页面时就会开启一个新的进程，这是为了**防止一个页面卡死而造成所有页面无法响应**，整个浏览器需要强制退出的情况
  - 每个进程中又有很多的线程，其中包括执行 JavaScript 代码的线程
- **<span style="color:red">JavaScript 的代码执行是在一个单独的线程中执行的</span>**
  - 这就意味着 JavaScript 的代码，**在同一时刻只能做一件事**
  - 如果这件事是**非常耗时**的，就意味着当前的线程就会被**阻塞**
- 所以真正耗时的操作，实际上不是由 JavaScript 线程执行的
  - 浏览器的每个进程是多线程的，那么**其他线程可以来完成这个耗时的操作**
  - 比如网络请求、定时器，我们只需要在特定的时候执行应该有的回调即可
    - 如何知道是“特定的时候”？ -- by 事件队列
