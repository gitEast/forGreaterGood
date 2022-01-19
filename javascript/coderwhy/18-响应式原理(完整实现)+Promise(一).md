<!--
 * @Author: East
 * @Date: 2022-01-18 11:26:30
 * @LastEditTime: 2022-01-19 17:31:18
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

### 2.2 使用 Promise

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

1. 传入的函数被称呼为 executor
   - 传入就立即执行
2. resolve：回调函数，成功时回调
3. reject：回调函数，失败时回调
4. then 方法会在 Promise 执行 resolve 函数时被回调
   - then 方法其实可以传两个参数
     - 成功回调
     - 失败回调
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

### 2.3 状态

1. executor 时 → pending
2. resolve → fulfilled
3. reject → rejected

- 状态一旦确定，那么就被锁定，**不可更改**

### 2.4 resolve 的参数

1. 普通的值 or 对象：pending → fulfilled
2. Promise 对象：pending → 由传入的 Promise 决定，即**状态进行了移交**
3. 实现 thenable 的对象：执行 then 方法，后续状态由 then 方法的执行决定
   ```js
   const obj = {
     then: function (resolve, reject) {
       resolve();
       // or reject()
     },
   };
   ```
