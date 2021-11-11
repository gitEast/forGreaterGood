<!--
 * @Author: East
 * @Date: 2021-11-11 16:42:12
 * @LastEditTime: 2021-11-11 18:06:22
 * @LastEditors: Please set LastEditors
 * @Description: Promise 手写的讲解
 * @FilePath: \forGreaterGood\output\promise\Promise.md
-->
# Promise 手写
> 我愿称之为 ES6 最佳改动

## 在 Promise 出现之前
Promise 规范出现在2015年，但在2015年之前，我们早已有了网络请求等异步操作，而想在这些异步操作之后进行一些操作，对于同步的 JavaScript 来说较为麻烦。
+ 比如我们要实现这样一个要求：在发送网络请求后，如果成功返回则输出结果，如果失败则提示出现错误(由于发送真实的网络请求不太可行，本次使用 setTimeout 模拟)
  ```js
  function httpRequest(url) {
    if (url === 'abc') {
      setTimeout(() => {
        // 成功
        successCallback('success')
      }, 2000)
    } else {
      setTimeout(() => {
        // 成功
        errorCallback('error')
      }, 2000)
    }
  }

  function successCallback(res) {
    console.log('res:', res)
  }

  function errorCallback(err) {
    console.log('err:', err)
  }

  // 发送网络请求
  httpRequest('abc') // 等待 2s 后，res: success
  httpRequest('bbb') // 等待 2s 后，err: error
  ```
  1. 需要自行封装或引入这个函数，而不论自行封装还是引入，都需要对函数名称和内部实现做出规范，规范可能在制定前不够完善，后期需要修改，引发一系列问题
  2. 不同的项目可能有不同的规范，每次新项目开发或者换个公司难道都要使用新的规范吗？
+ 因此 JavaScript 社区出现了 [Promise/A+](https://promisesaplus.com/) 规范，以统一野生 Promise 的封装与使用。

## Promise 基本实现(仅 then)
```js
// Promise 三种状态
const STATUS_PENDING = 'pending'
const STATUS_FULFILLED = 'fulfilled'
const STATUS_REJECTED = 'rejected'

class NewPromise {
  constructor(executor) {
    this.status = STATUS_PENDING
    this.onFulfilled = null
    this.onRejected = null

    const resolve = (value) => {
      if (this.status === STATUS_PENDING) {
        queueMicortask(() => {
          if (this.status === STATUS_PENDING) {
            this.status = STATUS_FULFILLED
            this.onFulfilled(value)
          }
        })
      }
    }
      
    const reject = (reason) => {
      if (this.status === STATUS_PENDING) {
        queueMicortask(() => {
          if (this.status === STATUS_PENDING) {
            this.status = STATUS_REJECTED
            this.onRejected(value)
          }
        })
      }
    }

    executor(resolve, reject)
  }

  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }
}
```
