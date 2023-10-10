<!--
 * @Author: East
 * @Date: 2022-01-19 17:30:33
 * @LastEditTime: 2022-01-20 14:40:05
 * @LastEditors: Please set LastEditors
 * @Description: Promise 的使用和手写
 * @FilePath: \forGreaterGood\javascript\coderwhy\19-Promise的使用和手写.md
-->

# Promise 的使用和手写

## 一、使用

### 1.1 Promise 的对象方法

> 通过 Object.getOwnPropertyDescriptors(Promise.prototype)查看

```js
/* 简单模拟 then 方法 */
class Moni {
  constructor(executor) {
    const resolve = () => {
      this.callback();
    };
    const reject = () => {};

    executor(resolve, reject);
  }

  then(callback) {
    this.callback = callback;
  }
}
```

1. then 方法

   1. Promise.prototype.then
   2. 同一个 Promise 对象可以被多次调用 then 方法 ---- 全都被调用

      ```js
      const promise = new Promise((resolve, reject) => {
        resolve("成功了");
      });

      promise.then((res) => {
        console.log("res1:", res); // 'res1: 成功了'
      });
      promise.then((res) => {
        console.log("res2:", res); // 'res2: 成功了'
      });
      promise.then((res) => {
        console.log("res3:", res); // 'res3: 成功了'
      });
      ```

   3. then 方法传入的回调函数可以有返回值 ---- Promise 可以**链式调用**的原因

      1. 返回的是一个普通的值 ---- 这个值会被作为一个新的 Promise 的 resolve 的值

         ```js
         promise.then((res) => {
           return { name: "why" };
         });

         // 实际上内部在做的，如下
         promise.then((res) => {
           return new Promise((resolve, reject) => {
             resolve({ name: "why" });
           });
         });

         // 所以输出结果
         promise
           .then((res) => {
             return { name: "why" };
           })
           .then((res) => {
             console.log(res); // { name: 'why' }
             return "aaa";
           })
           .then((res) => {
             console.log(res); // 'aaa'
           })
           .then((res) => {
             console.log(res); // undefined
           });
         ```

      2. 如果返回的是一个 Promise 对象

         ```js
         promise.then((res) => {
           return new Promise((resolve, reject) => {
             setTimeout(() => {
               resolve({ name: "why" });
             }, 3000);
           });
         });

         // 所以
         promise
           .then((res) => {
             return new Promise((resolve, reject) => {
               setTimeout(() => {
                 resolve({ name: "why" });
               }, 3000);
             });
           })
           .then((res) => {
             console.log(res); // 等待三秒打印 { name: "why" }
           });
         ```

      3. 如果返回的是一个实现了 thenable 的对象

         ```js
         promise.then((res) => {
           return {
             then(resolve, reject) {
               resolve(222);
             },
           };
         });

         // 所以
         promise
           .then((res) => {
             return {
               then(resolve, reject) {
                 resolve(222);
               },
             };
           })
           .then((res) => {
             console.log(res); // 222
           });
         ```

2. catch 方法 -- 异常处理方法

   ```js
   const promise = new Promise((resolve, reject) => {
     reject("rejected status");
   });

   promise.then(undefined, (err) => {
     console.log("err:", err); // 'err: rejected status'
   });
   ```

   1. 当 executor 抛出异常时，也是会调用错误捕捉的回调函数(reject)

      ```js
      // 抛出异常写法
      const promise = new Promise((resolve, reject) => {
        throw new Error("rejected status");
      });

      promise.then(undefined, (err) => {
        console.log("err:", err); // 'err: Error: rejected status ...' 拿到了真实的Error对象
      });
      ```

   2. 通过 catch 方法来传入错误(拒绝)捕获的回调函数 ---- 实际上是上面写法的语法糖

      ```js
      const promise = new Promise((resolve, reject) => {
        throw new Error("rejected status");
      });

      promise.catch((err) => {
        console.log("err:", err);
      });
      ```

      1. 但是不符合 promise/a+ 规范
      2. 改进 ---- catch 方法很特殊，可以重复使用

         ```js
         const promise = new Promise((resolve, reject) => {
           throw new Error("rejected status");
         });

         promise
           .then((res) => {
             console.log(res);
           })
           .catch((err) => {
             console.log("err:", err); // 'err: Error: rejected status ...' 拿到了真实的Error对象
           });

         // catch方法的混用
         promise
           .then((res) => {
             return new Promise((resolve, reject) => {
               reject("then rejected status");
             });
           })
           .catch((err) => {
             console.log("err:", err); // 'err: Error: then rejected status ...'
           });
         promise
           .then((res) => {
             throw new Error("throw a error");
           })
           .catch((err) => {
             console.log("err:", err); // 'err: Error: throw a error'
           });
         ```

   3. 拒绝捕获的问题
      ```js
      const promise = new Promise((resolve, reject) => {
        reject();
      });
      promise.then((res) => {});
      promise.catch((err) => {}); // 会报错
      ```
      1. then 与 catch 是两次独立的捕获，不会相互影响
      2. 对于 then 方法而言，没有做拒绝的处理 ---- 解决办法：使用上面的方法
   4. 返回值 ---- 也是返回一个 Promise 对象，并且是 **resolve 调用返回值**

3. finally 方法 ---- ES9 新增，可用于做清除操作

   ```js
   const promise = new Promise((resolve, reject) => {
     resolve("fulfilled status");
   });

   promise
     .then((res) => {
       console.log(res);
     })
     .catch((err) => {
       console.log(err);
     })
     .finally(() => {
       console.log("最终一定会被执行");
     });
   ```

   1. 无论状态为 fulfilled 还是 reject，都会执行
   2. 无参数

### 1.2 Promise 的类方法

> 指可以通过类名直接调用的方法

1. resolve 方法 ---- 将一个值转化为 Promise 对象

   ```js
   const promise = Promise.resolve({ name: "why" });

   // 相当于
   const promise = new Promise((resolve, reject) => {
     resolve({ name: "why" });
   });
   ```

2. reject 方法

   ```js
   const promise = Promise.reject({ name: "why" });

   // 相当于
   const promise = new Promise((resolve, reject) => {
     reject({ name: "why" });
   });
   ```

   1. 注意：无论传入什么值都是一样的，捕捉到的错误的参数永远都是 `executor` 中 `reject()` 传入的值

      ```js
      const promise = Promise.reject({
        then(resolve, reject) {
          resolve({ name: "why" });
        },
      });

      promise
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("error:", err); // error: { then: [Function: then] }
        });
      ```

3. all 方法

   ```js
   const p1 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(111);
     }, 1000);
   });
   const p2 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(222);
     }, 2000);
   });
   const p3 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(333);
     }, 3000);
   });

   // 需求：所有的Promise对象都变成fulfilled时，再拿到结果
   // 会把 'aaa' 转成 Promise
   Promise.all([p1, p2, p3, "aaa"]).then((res) => {
     console.log(res); // [111, 222, 333, 'aaa']，结果顺序按照数组中的顺序
   });
   ```

   1. 如果有任意一个变成了 rejected，则中断

      ```js
      const p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(111);
        }, 1000);
      });
      const p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(222);
        }, 2000);
      });
      const p3 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(333);
        }, 3000);
      });

      // 中断 reject
      Promise.all([p1, p2, p3, "aaa"])
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("err:", err); // 'err: 222'
        });
      ```

4. allSettled 方法 ---- ES11 方法：所有 Promise 对象都敲定了，才返回结果

   ```js
   const p1 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(111);
     }, 1000);
   });
   const p2 = new Promise((resolve, reject) => {
     setTimeout(() => {
       reject(222);
     }, 2000);
   });
   const p3 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(333);
     }, 3000);
   });

   // 中断 reject
   Promise.allSettled([p1, p2, p3, "aaa"]).then((res) => {
     console.log(res);
   });
   // 打印的结果
   [
     { status: "fulfilled", value: 111 },
     { status: "rejected", reason: 222 },
     { status: "fulfilled", value: 333 },
     { status: "fulfilled", value: "aaa" },
   ];
   ```

5. race 方法 ---- 竞技 / 竞赛

   ```js
   const p1 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(111);
     }, 3000);
   });
   const p2 = new Promise((resolve, reject) => {
     setTimeout(() => {
       reject(222);
     }, 2000);
   });
   const p3 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(333);
     }, 1000);
   });

   // 中断 reject
   Promise.race([p1, p2, p3])
     .then((res) => {
       console.log(res); // 333
     })
     .catch((err) => {
       console.log("err:", err);
     });
   ```

   1. 只要有一个 Promise 对象变成 fulfilled 状态，那么就结束
   2. 如果第一个结果为 rejected，那么进入 catch，也结束

6. any 方法 ---- ES12

   ```js
   const p1 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(111);
     }, 3000);
   });
   const p2 = new Promise((resolve, reject) => {
     setTimeout(() => {
       reject(222);
     }, 500);
   });
   const p3 = new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(333);
     }, 1000);
   });

   // 中断 reject
   Promise.any([p1, p2, p3]).then((res) => {
     console.log(res); // 333
   });
   ```

   1. 至少等到一个 fulfilled
   2. 如果全都是拒绝，则**等到所有都拒绝之后，才执行 catch 方法，并自行 new 了一个 Error**

      ```js
      const p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(111);
        }, 3000);
      });
      const p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(222);
        }, 500);
      });
      const p3 = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(333);
        }, 1000);
      });

      // 中断 reject
      Promise.any([p1, p2, p3])
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("error:", err.errors); // error: [111, 222, 333]
        });
      ```

## 二、手写 Promise

> 需要符合 [Promises/A+](https://promisesaplus.com) 规范

1. 结构的设计 ---- 符合一定的规范(减少沟通成本)

   ```js
   /* 状态 */
   const PROMISE_STATUS_PENDING = "pending";
   const PROMISE_STATUS_FULFILLED = "fulfilled";
   const PROMISE_STATUS_REJECTED = "rejected";
   class HYPromise {
     constructor(executor) {
       this.status = PROMISE_STATUS_PENDING;
       this.value = undefined;
       this.reason = undefined;

       const resolve = (value) => {
         if (this.status === PROMISE_STATUS_PENDING) {
           // this.status = PROMISE_STATUS_FULFILLED;
           // this.value = value;
           // console.log("resolve被调用了");

           /** 调用then传进来的回调函数 */
           // 会报错，this.onFulfilled不是一个方法，因为按顺序，then方法还没执行，this.onFulfilled还没绑定上去
           // this.onFulfilled()

           /* 使用定时器解决 */
           // setTimeout(() => {
           //   this.status = PROMISE_STATUS_FULFILLED;
           //   this.value = value;
           //   console.log("resolve被调用了");
           //   this.onFulfilled(this.value);
           // }, 0);

           /* 延迟调用，比setTimeout好 */
           this.status = PROMISE_STATUS_FULFILLED;
           queueMicrotask(() => {
             this.value = value;
             console.log("resolve被调用了");
             this.onFulfilled(this.value);
           });
         }
       };

       const reject = (reason) => {
         if (this.status === PROMISE_STATUS_PENDING) {
           this.status = PROMISE_STATUS_REJECTED;
           queueMicrotask(() => {
             this.value = value;
             console.log("resolve被调用了");
             this.onRejected(this.reason);
           });
         }
       };
       executor(resolve, reject);
     }

     then(onFulfilled, onRejected) {
       this.onFulfilled = onFulfilled;
       this.onRejected = onRejected;
     }
   }

   const promise = new HYPromise((resolve, reject) => {
     console.log("executor函数被直接调用了");
     console.log("------------------pending-----------------");
     resolve(111);
   });
   promise.then((res) => {
     console.log(res);
   });
   ```

   1. 缺点
      1. 同一个 Promise 对象不支持调用多次
      2. 不支持链式调用
