/*
 * @Author: East
 * @Date: 2022-01-23 15:19:07
 * @LastEditTime: 2022-01-23 17:21:16
 * @LastEditors: Please set LastEditors
 * @Description: 手写 Promise
 * @FilePath: \forGreaterGood\javascript\coderwhy\20-code\promise.js
 */
/* 1. 三种状态 */
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

// 工具函数
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const res = execFn(value)
    resolve(res)
  } catch(err) {
    reject(err)
  }
}

/** Promise 类 */
class EastPromise {

  /* 2. 构造函数 */
  constructor(executor) {
    // 2.1 变量声明
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    /* 当同一个 Promise 对象被多次调用 then 方法时，单个 onFulfilled 已经不能满足需求，onRejected 同理 */
    // this.onFulfilled = null
    // this.onRejected = null
    this.onFulfilledFns = []
    this.onRejectedFns = []


    // 2.2 之后执行的函数
    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if (this.status === PROMISE_STATUS_PENDING) {
            this.status = PROMISE_STATUS_FULFILLED
            this.value = value
            this.onFulfilledFns.forEach(fn => {
              fn(this.value)
            })
          }
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if (this.status === PROMISE_STATUS_PENDING) {
            this.status = PROMISE_STATUS_REJECTED
            this.reason = reason
            this.onRejectedFns.forEach(fn => {
              fn(this.reason)
            })
          }
        })
      }
    }

    // 2.3 即时执行函数 - Promise 传入的函数
    executor(resolve, reject)
  }

  /* 3. then 方法 */
  then(onFulfilled, onRejected) {
    // 3.3 支持 then 方法的链式调用
    return new Promise((resolve, reject) => {
      // 3.1 正常的、普通的调用
      // this.onFulfilled = onFulfilled
      // this.onRejected = onRejected
      /* 满足同一个 Promise 的多个 then 方法调用 */
      this.onFulfilledFns.push((value) => {
        execFunctionWithCatchError(onFulfilled, value, resolve, reject)
      })
      this.onRejectedFns.push((reason) => {
        execFunctionWithCatchError(onRejected, reason, resolve, reject)
      })

      // 3.2 将 then 方法包在 setTimeout 方法内
      if (this.status === PROMISE_STATUS_FULFILLED) {
        execFunctionWithCatchError(onFulfilled, value, resolve, reject)
      }
      if (this.status === PROMISE_STATUS_REJECTED) {
        execFunctionWithCatchError(onRejected, reason, resolve, reject)
      }
    })
  }

  /* 4. catch 方法 */
  catch(onRejected) {
    this.then(undefined, onRejected)
  }
}

const promise = new EastPromise((resolve, reject) => {
  resolve(111)
  reject(110)
})

promise.then(res => {
  console.log('res1:', res);
  throw Error('444')
  return 222
}, err => {
  console.log('err1:', err);
  return 220
}).catch(err => {
  console.log('err2:', err.message);
  return 333
}).then(res => {
  console.log('res3:', res);
})

