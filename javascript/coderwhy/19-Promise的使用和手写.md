<!--
 * @Author: East
 * @Date: 2022-01-19 17:30:33
 * @LastEditTime: 2022-01-19 17:30:33
 * @LastEditors: Please set LastEditors
 * @Description: Promise 的使用和手写
 * @FilePath: \forGreaterGood\javascript\coderwhy\19-Promise的使用和手写.md
-->

# Promise 的使用和手写

## 一、使用

### 2.5 Promise 的对象方法

> 通过 Object.getOwnPropertyDescriptors(Promise.prototype)查看

1. then 方法

   1. Promise.prototype.then
   2. 同一个 Promise 对象可以被多次调用 then 方法 ---- 全都被调用

      ```js
      const promise = new Promise((resolve, reject) => {
        resolve("成功了");
      });

      promise.then((res) => {
        console.log("res1", res);
      });
      promise.then((res) => {
        console.log("res2", res);
      });
      promise.then((res) => {
        console.log("res3", res);
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

2. catch 方法

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
   4. 返回值 ---- 也是返回一个 Promise 对象，并且是 resolve 调用返回值

3. finally 方法 ---- ES9 新增

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

### Promise 的类方法

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

   1. 注意：无论传入什么值都是一样的，捕捉到的错误的参数永远都是传入的值

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
   Promise.race([p1, p2, p3]).then((res) => {
     console.log(res); // 333
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
   2. 如果全都是拒绝，则等到所有都拒绝之后，才执行 catch 方法，并自行 new 了一个 Error

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

## 手写 Promise

1. 结构的设计 ---- 符合一定的规范(减少沟通成本)

   ```js
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

           // // 使用定时器解决
           // setTimeout(() => {
           //   this.status = PROMISE_STATUS_FULFILLED;
           //   this.value = value;
           //   console.log("resolve被调用了");
           //   this.onFulfilled(this.value);
           // }, 0);

           // 延迟调用，比setTimeout好
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

2. then 方法优化

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
         queueMicrotask(() => {
           if (this.status === STATUS_PENDING) {
             this.status = STATUS_FULFILLED;
             this.value = value;
             this.onFulfilledFns.forEach((fn) => {
               fn(this.value);
             });
           }
         });
       };

       const reject = (reason) => {
         queueMicrotask(() => {
           if (this.status === STATUS_PENDING) {
             this.status = STATUS_REJECTED;
             this.reason = reason;
             this.onRejectedFns.forEach((fn) => {
               fn(this.reason);
             });
           }
         });
       };

       executor(resolve, reject);
     }

     then(onFulfilled, onRejected) {
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
   }

   const promise = new MyPromise((resolve, reject) => {
     resolve(111);
     reject(000);
   });

   promise.then(
     (res) => {
       console.log("res1:", res);
     },
     (err) => {
       console.log("err:", err);
     }
   );

   promise.then(
     (res) => {
       console.log("res2:", res);
     },
     (err) => {
       console.log("err2:", err);
     }
   );

   setTimeout(() => {
     promise.then(
       (res) => {
         console.log("res3:", res);
       },
       (err) => {
         console.log("err3:", err);
       }
     );
   }, 5000);
   ```

   1. 解决同一 Promise 对象的多次调用
   2. 解决延时调用 then 方法的问题
   3. 封装一个关于 try-catch 的工具函数

3. catch 方法实现
   1. 接收 onRejected 回调函数
   2. 取巧 —— 直接使用 this.then → 出现问题：造成链式调用
   3. onRejected 回调函数默认执行`throw new Error` → 抛出异常会自动进入下一个 then 方法
4. finally 方法实现
   1. 接收 onFinally 回调函数
   2. 不论如何，finally 都是会调用的
   3. 给 onFulfilled 回调函数一个默认值
5. 类方法 —— resolve
6. 类方法 —— reject
7. 类方法 —— all
   1. 接收一个数组，数组元素为 Promise 对象(普通的值与 thenable 对象另外自行实现)
   2. 返回所有 onFulfilled 的结果 or 返回 onRejected 的结果
8. 类方法 —— allSettled
   1. 接收参数：Promise 对象的数组
   2. 返回每一个 Promise 对象的状态与结果 `{ status: _____, value: ____ }`
9. 类方法 —— race：有一个 Promise 对象有了结果，即返回该结果
10. 类方法 —— any
11. 必须等到一个成功的结果
12. 如果所有都失败了，则返回所有的错误信息 `new AggreagateError(reasons) --> err.errors`

## 总结

1. Promise 规范
2. Promise 类设计
   1. class
   2. function
3. 构造函数的规划
   1. constructor 的逻辑
4. then 方法的实现 —— 逻辑实现
5. ...后续就不重要了

## 补充

- Promise/A+ 规范是社区规范 [https://promisesaplus.com]
  - 在 ES6 之前，社区里有许多人自行实现了 Promise

## 二、手写
