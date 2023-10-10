<!--
 * @Author: East
 * @Date: 2022-01-20 14:41:07
 * @LastEditTime: 2022-02-08 11:03:46
 * @LastEditors: Please set LastEditors
 * @Description: 手写 Promise
 * @FilePath: \forGreaterGood\javascript\coderwhy\20-手写Promise.md
-->

# 手写 Promise

## 一、手写

1. then 方法优化

   ```js
   const STATUS_PENDING = "pending";
   const STATUS_FULFILLED = "fulfilled";
   const STATUS_REJECTED = "rejected";

   class MyPromise {
     constructor(executor) {
       this.onFulfilledFns = [];
       this.onRejectedFns = [];
       this.status = STATUS_PENDING; //默认情况
       this.value = undefined;
       this.reason = undefined;

       const resolve = (value) => {
         if (this.status === STATUS_PENDING) {
           queueMicrotask(() => {
             if (this.status === STATUS_PENDING) {
               this.status = STATUS_FULFILLED;
               this.value = value;
               this.onFulfilledFns.forEach((fn) => {
                 fn(this.value);
               });
             }
           });
         }
       };

       const reject = (reason) => {
         if (this.status === STATUS_PENDING) {
           queueMicrotask(() => {
             if (this.status === STATUS_PENDING) {
               this.status = STATUS_REJECTED;
               this.reason = reason;
               this.onRejectedFns.forEach((fn) => {
                 fn(this.reason);
               });
             }
           });
         }
       };

       try {
         executor(resolve, reject);
       } catch (err) {
         reject(err);
       }
     }

     then(onFulfilled, onRejected) {
       /* 解决 setTimeout 内使用 Promise 的问题 */
       if (this.status === STATUS_FULFILLED && onFulfilled) {
         onFulfilled(this.value);
       }
       if (this.status === STATUS_REJECTED && onRejected) {
         onRejected(this.reason);
       }

       if (this.status === STATUS_PENDING) {
         this.onFulfilledFns.push(onFulfilled);
         this.onRejectedFns.push(onRejected);
       }
     }

     /* 解决链式调用问题 */
     then(onFulfilled, onRejected) {
       return new Promise((resolve, reject) => {
         /* 解决 setTimeout 内使用 Promise 的问题 */
         if (this.status === STATUS_FULFILLED && onFulfilled) {
           try {
             const value = onFulfilled(this.value);
             resolve(value);
           } catch (err) {
             reject(err);
           }
         }
         if (this.status === STATUS_REJECTED && onRejected) {
           try {
             const reason = onRejected(this.reason);
             resolve(reason);
           } catch (err) {
             reject(err);
           }
         }

         if (this.status === STATUS_PENDING) {
           this.onFulfilledFns.push(() => {
             try {
               const value = onFulfilled(this.value);
               resolve(value);
             } catch (err) {
               reject(err);
             }
           });
           this.onRejectedFns.push(() => {
             try {
               const reason = onRejected(this.reason);
               resolve(reason);
             } catch (err) {
               reject(err);
             }
           });
         }
       });
     }
   }

   /** 将重复代码抽取 */
   /* 1. 重复的代码 */
   try {
     const value = onFulfilled(this.value);
     resolve(value);
   } catch (err) {
     reject(err);
   }
   /* 2. 抽取的工具函数 */
   function execFunctionWithCatchError(execFn, value, resolve, reject) {
     try {
       const result = execFn(value);
       resolve(result);
     } catch (err) {
       reject(err);
     }
   }
   ```

   1. 解决同一 Promise 对象的多次调用 -> by 数组
   2. 解决延时调用 then 方法的问题 -> 根据状态判断是否即时调用
   3. 封装一个关于 try-catch 的工具函数 `execFunctionWithCatchError`

2. catch 方法实现

   ```js
   catch(onRejected) {
     return this.then(undefined, onRejected)
   }
   ```

   1. 接收 onRejected 回调函数
   2. 取巧 —— 直接使用 this.then

      1. 需要判断 `onFulfilled` 函数与 `onRejected` 函数是否存在
      2. `then` (不带 `onRejected`)方法后使用 `catch`，`catch` 无法正确捕捉异常

         - onRejected 回调函数默认执行`throw new Error` → 抛出异常会自动进入下一个 then 方法

           ```js
             then(onFulfilled, onRejected) {
               const defaultOnRejected = err => { throw err}
               onRejected = onRejected || defaultOnRejected
             }
           ```

3. finally 方法实现
   ```js
   finally(onFinally) {
     return this.then(() => {onFinally()}, () => {onFinally()})
   }
   ```
   1. 接收 onFinally 回调函数
   2. 不论如何，finally 都是会调用的
   3. 给 onFulfilled 回调函数一个默认值
      ```js
      const defaultOnFulfilled = (value) => {
        return value;
      };
      onFulfilled = onFulfilled || defaultOnFulfilled;
      ```
4. 类方法 —— resolve
   ```js
   static resolve(value) {
     return new Promise((resolve, reject) => resolve(value))
   }
   ```
5. 类方法 —— reject
   ```js
   static reject(reason) {
     return new Promise((resolve, reject) => reject(reason))
   }
   ```
6. 类方法 —— all

   ```js
   static all(promises) {
     return new Promise((resolve, reject) => {
       const values = []
       promises.forEach(promise => {
         promise.then(res => {
           value.push(res)
           if (values.length === promise.length) {
             resolve(values)
           }
         }, err => {
           reject(err)
         }
         )
       })
     })
   }
   ```

   1. 接收一个数组，数组元素为 Promise 对象(普通的值与 thenable 对象另外自行实现)
   2. 返回所有 onFulfilled 的结果 or 返回 onRejected 的结果

7. 类方法 —— allSettled
   ```js
   static allSettled(promises) {
     const results = []
     return new Promise(resolve => {
       promises.forEach(promise => {
         promise.then(res => {
           results.push({ status: STATUS_FULFILLED, value: res})
           if (results.length === promise.length) {
             resolve(results)
           }
         }, err => {
            results.push({ status: STATUS_REJECTED, value: err})
            if (results.length === promise.length) {
             resolve(results)
           }
         })
       })
     })
   }
   ```
   1. 接收参数：Promise 对象的数组
   2. 返回每一个 Promise 对象的状态与结果 `{ status: _____, value: ____ }`
8. 类方法 —— race：有一个 Promise 对象有了结果，即返回该结果
   ```js
   static race(promises) {
     return new Promise((resolve, reject) => {
       promises.forEach(promise => {
         promise.then(resolve, reject)
       })
     })
   }
   ```
9. 类方法 —— any
   ```js
   static any(promises) {
     const reasons = []
     return new Promise((resolve, reject) => {
       promises.forEach(promise => {
         promise.then(resolve, err => {
           reasons.push(err)
           if (reasons.length === promises.length) {
             reject(new AggregateError(reasons))
           }
         })
       })
     })
   }
   ```
   1. 必须等到一个成功的结果
   2. 如果所有都失败了，则返回所有的错误信息 `new AggregateError(reasons) --> err.errors`

## 二、总结

1. Promise 规范
2. Promise 类设计
   1. class
   2. function
3. 构造函数的规划
   1. constructor 的逻辑
4. then 方法的实现 —— 逻辑实现
5. ...后续就不重要了

## 三、补充

- Promise/A+ 规范是社区规范 [https://promisesaplus.com]
  - 在 ES6 之前，社区里有许多人自行实现了 Promise
