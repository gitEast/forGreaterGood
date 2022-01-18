<!--
 * @Author: East
 * @Date: 2022-01-18 11:26:30
 * @LastEditTime: 2022-01-18 16:16:47
 * @LastEditors: Please set LastEditors
 * @Description: 响应式原理(完整实现) + Promise(一)
 * @FilePath: \forGreaterGood\javascript\coderwhy\18-响应式原理(完整实现)+Promise(一).md
-->

# 响应式原理(完整实现) + Promise(一)

## 一、响应式原理(完整实现)

### 1.1 Proxy 完整实现

自动正确地收集依赖：

- 自动
- 正确：比如使用 `obj.name` 的函数该放到 `obj.name` 对应的 `Depend` 对象中

```js
class Depend {
  constructor() {
    this.reactives = [];
  }

  addDepend(reactiveFn) {
    this.reactives.push(reactiveFn);
  }

  notify() {
    this.reactives.forEach((fn) => {
      fn();
    });
  }
}

function bar() {
  console.log("无关函数");
  console.log("普通函数");
}

/** 使用Proxy监听属性变化 */
/* 观察需要响应的函数 */
let activeReactiveFn = null;
function watchFn(fn) {
  activeReactiveFn = fn;
  fn();
  activeReactiveFn = null;
}
/* 封装一个获取depend的函数 */
function getDepend(target, key) {
  let map = weakMap.get(target);
  // 在对象添加 [key] 属性时，此时 weakMap 中没有该属性对应的 map
  if (!map) {
    map = new Map();
    weakMap.set(target, map);
  }

  // 根据 key 获取 depend 对象
  let depend = map.get(key);
  if (!depend) {
    depend = new Depend();
    map.set(key, depend);
  }

  return depend;
}
/* 封装一个创建 Proxy 的函数 */
function reactive(obj) {
  return new Proxy(obj, {
    /** 如何自动收集依赖？
     * by [get]
     */
    get(target, key, receiver) {
      const depend = getDepend(target, key);
      depend.addDepend(activeReactiveFn);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      let result = Reflect.set(target, key, newValue, receiver);
      if (result) {
        const depend = getDepend(target, key);
        depend.notify();
      } else {
        console.log(`${key}属性设置失败`, target);
      }
    },
  });
}

// 管理obj对象和info对象
const weakMap = new WeakMap();

/** obj 对象 */
const objProxy = reactive({
  name: "why",
  age: 18,
});
watchFn(function foo() {
  console.log("hello, east");
  console.log(objProxy.name);
});
watchFn(function demo() {
  console.log("-------------------", objProxy.name);
});
watchFn(function () {
  console.log("----------age----------", objProxy.age);
});

/** info 对象 */
const infoProxy = reactive({
  address: "广州市",
});
watchFn(function () {
  console.log("-------info的address--------", infoProxy.address);
});

objProxy.name = "code";
objProxy.age = 20;
infoProxy.address = "北京市";
```

- 优化：

  1. 可能 watchFn 中传入的函数调用了 n 次相同的属性，该函数被重复添加

     ```js
     watchFn(() => {
       console.log(objProxy.name + "-----------------");
       console.log(objProxy.name + "++++++++");
     });

     // → 所以需要优化Depnd类的方法存储
     class Depend {
       constructor() {
         this.reactives = new Set();
       }

       addDepend(reactiveFn) {
         this.reactives.add(reactiveFn); // Set使用add方法
       }
     }
     ```

  2. `Proxy` 的 `get` 函数不应该关心使用的函数 `activeReactiveFn`

     ```js
     function createProxy(obj) {
       return new Proxy(obj, {
         get(target, key, receiver) {
           const depend = getDepend(target, key);
           depend.addDepend(); // 这里
           return Reflect.get(target, key, receiver);
         },
         set() {},
       });
     }
     /* 重构 Depend 类的 addDepend 方法 */
     class Depend {
       constructor() {
         this.reactives = new Set();
       }

       addDepend() {
         if (activeReactiveFn) {
           this.reactives.add(activeReactiveFn);
         }
       }
     }
     ```

### 1.2 Object.defineProperty 实现

```js
function reactive(obj) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        const depend = getDepend(obj, key);
        depend.addDepend();
        return value;
      },
      set(newValue) {
        value = newValue;
        const depend = getDepend(obj, key);
        depend.notify();
      },
    });
  });

  return obj;
}
```

## 二、Promise

> 新技术的出现，都是为了解决原有技术的某一个痛点

### 2.1 引入 -- 异步请求的处理方式

1. 问题存在：无法获取结果

   ```js
   function requestData(url) {
     /* 模拟网络请求 */
     setTimeout(() => {
       if (url === "coderwhy") {
         // 成功
       } else {
         // 失败
       }
     });
   }

   requestData("coderwhy");
   ```

   - 无论是真实请求还是 `setTimeout`，都无法得到结果
     - because of 异步

2. 通过 callback 解决

   ```js
   function requestData(url, successCallback, errorCallback) {
     // 模拟网络请求
     setTimeout(() => {
       if (url === "coderwhy") {
         // 成功
         successCallback("成功了");
       } else {
         // 失败
         errorCallback("失败了");
       }
     }, 3000);
   }

   requestData(
     "coderwhy",
     // 成功的回调
     function (msg) {
       console.log(msg);
     },
     // 失败的回调
     function (err) {
       throw new Error(err);
     }
   );
   ```

   1. 缺点
      1. 如果是自己封装的 requestData，那么需要在封装的时候设计好 callback 的名称，并且使用好(url、成功的回调、失败的回调顺序需要放对)
      2. 如果是别人封装的 or 第三方的库，沟通成本太高

## 使用 Promise

```js
const promise = new Promise((resolve, reject) => {
  resolve();
});

promise.then(() => {
  console.log("成功了");
});
promise.catch(() => {
  throw new Error("失败了");
});
```

1. 传入的函数被成为 executor
2. resolve：回调函数，成功时回调
3. reject：回调函数，失败时回调
4. then 方法会在 Promise 执行 resolve 函数时被回调
5. catch 方法会在 Promise 执行 reject 函数时被回调

- 解决案例问题

  ```js
  function requestData(url) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === "coderwhy") {
          // 成功
          resolve("成功了");
        } else {
          // 失败
          reject("失败了");
        }
      });
    });
  }

  requestData("coderwhy")
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      throw new Error(err);
    });

  // then可以传入两个回调函数
  requestData("coderwhy").then(
    (res) => {
      console.log(res);
    },
    (err) => {
      throw new Error(err);
    }
  );
  ```

### 状态

1. executor 时 → pending
2. resolve → fulfilled
3. reject → rejected

- 状态一旦确定，那么就被锁定，不可更改

### resolve 的参数

1. 普通的值 or 对象：pending → fulfilled
2. Promise 对象：pending → 由传入的 Promise 决定，即状态进行了移交
3. 实现 thenable 的对象：执行 then 方法，后续状态由 then 方法的执行决定

### Promise 的对象方法

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
