<!--
 * @Author: your name
 * @Date: 2022-01-15 20:36:00
 * @LastEditTime: 2022-01-17 17:44:34
 * @LastEditors: Please set LastEditors
 * @Description: Proxy + Reflect + Vue 的 响应式原理
 * @FilePath: \forGreaterGood\javascript\coderwhy\17-proxy+reflect+响应式原理.md
-->

# Proxy + Reflect + Vue 的 响应式原理

## 一、Proxy

### 1. 引入 -- 监听对象的操作

> 需求：有一个对象，我们希望监听到这个对象中的属性被获取的过程

- 从前的知识 ---- by Object.defineProperty(obj, key, { get/set })

  ```js
  const obj = {
    name: "why",
    age: 18,
  };

  Object.defineProperty(obj, "name", {
    get: function () {
      console.log("监听到obj对象的name属性被访问了");
    },
    set: function (value) {
      console.log("监听到obj对象的name属性被设置了");
    },
  });

  console.log(obj.name);
  obj.name = "code";

  /** 24-31行code优化 */
  Object.keys(obj).forEach((key) => {
    let value = obj[key];

    Object.defineProperty(obj, key, {
      get: function () {
        console.log(`监听到obj对象的${key}属性被访问了`);
        return value;
      },
      set: function (newValue) {
        console.log(`监听到obj对象的${key}属性被设置了`);
        value = newValue;
      },
    });
  });
  ```

  - 缺点
    1. Object.defineProperty()设计的初衷，不是为了去监听一个对象中所有属性的
       1. 设计该方法的初衷是为了定义普通的属性，但是后面我们**强行把它变成了数据属性描述符**
    2. 如果我们想监听更加丰富的操作，如新增属性、删除属性，那么该方法是无能为力的

### 2. Proxy

- 介绍
  - ES6 新增
  - 类
  - 用处：创建一个代理
    - 如果希望监听一个对象的相关操作，则可以先**创建一个代理对象(Proxy 对象)**
    - 之后对该对象的所有操作，都**通过代理对象来完成**，代理对象可以**监听**我们想要对原对象进行哪些操作
  - 优点：
    - 监听某个对象而不修改其内部结构
    - 对代理对象所作的操作，最终都会自动传递到原来的对象中
      - 可以**重写捕获器**
- 实际操作

  ```js
  const obj = {
    name: "why",
    age: 18,
  };

  const objProxy = new Proxy(obj, {}); // 参数：要代理的对象， 捕获器(不知道做什么操作，放个空值即可)

  console.log(objProxy.name); // 'why'
  console.log(objProxy.age); // 18

  objProxy.name = "code";
  objProxy.age = 30;

  console.log(objProxy.name); // 'code'
  console.log(objProxy.age); // 30
  ```

  - 捕获器使用

    ```js
    const obj = {
      name: "why",
      age: 18,
    };

    const objProxy = new Proxy(obj, {
      // 获取值时的捕获器
      get: function (target, key) { // 参数：target -- obj，key -- 属性
        console.log(`监听到对象的${key}属性被访问`, target);
        return target[key];
      },
      //设置值时的捕获器
      set: function (target, key, newValue) {
        console.log(`监听到对象的${key}属性被设置值`, target);
        target[key] = newValue;
      },
      // 监听 in 的捕获器
      has(target, key) {
        console.log(`监听到对象的${key}属性的in操作`, target);
        return key in target
      }
      // delete 捕获器
      deleteProperty(target, key) {}
    }); // 参数：要代理的对象， 捕获器

    objProxy.name = "code";
    objProxy.age = 30;

    console.log(objProxy.name); // 'code'
    console.log(objProxy.age); // 30

    console.log('name' in objProxy) // in 操作
    ```

    - 13 个捕获器
    - handler.apply ---- 函数调用操作 捕获器，参数：target, thisArg( -- this), argArray( -- 参数)
    - handler.constructor ---- new 操作符 捕获器，参数：target, argArray, newTarget

## 二、Reflect

> Proxy 用于代理，经常和 Reflect 一起出现

- 是一个对象，字面意思 -- 反射
- 作用
  - 提供了许多操作 JavaScript 对象的方法
    - Object.getPropertyOf → Reflect.getPropertyOf
    - Object.defineProperty → Reflect.defineProperty
- 原因
  - 在早期的 ECMA 规范中没有考虑到这种对**对象本身**的操作如何设计会更加规范，所以将这些 API 放到了 Object 上
  - 但是 **Object 作为一个构造函数，这些操作放到它身上实际上并不合适**
  - 另外，一些类似于 in、delete 的操作符，让 js 看起来会有一些奇怪(其他语言并没有这些操作符)
  - 所以在 ES6 中新增了 Reflect，让我们把这些操作都集中到了 Reflect 对象上
- 方法(API)
  - 13 种，与 Proxy 一一对应
- 使用

  ```js
  const obj = {
    name: "why",
    age: 18,
  };

  const objProxy = new Proxy(obj, {
    // 参数：target -- obj，key -- 属性
    get: function (target, key) {
      console.log(`监听到对象的${key}属性被访问`, target);
      // return target[key];
      return Reflect.get(target, key);
    },
    set: function (target, key, newValue) {
      console.log(`监听到对象的${key}属性被设置值`, target);
      // target[key] = newValue;
      Reflect.set(target, key, newValue);
    },
  }); // 参数：要代理的对象， 捕获器
  ```

  1. <span style="color: red">Reflect.set()会返回一个布尔值，设置成功返回 true，否则返回 false</span>

### Receiver 参数的作用

1. 引入案例

   ```js
   const obj = {
     _name: "why",
     get name() {
       return this._name;
     },
     set name(newValue) {
       this._name = newValue;
     },
   };

   obj.name = "code";
   console.log(obj.name);

   /* 改为 Proxy 拦截 */
   const objProxy = new Proxy(obj, {
     get(target, key) {
       return Reflect.get(target, key);
     },
     set(target, key, newValue) {
       Reflect.set(target, key, newValue);
     },
   });
   objProxy.name = "code";
   console.log(objProxy.name);
   ```

   - 访问过程：
     1. 进入 `objProxy` 的 `get` 中，返回 `Reflect.get(target, 'name')`
     2. 访问 `obj` 的 `get name`，返回 `obj._name`

2. 问题出现：绕了一圈，还是 `obj._name` 在调用

   ```js
   const obj = {
     _name: "why",
     get name() {
       return this._name;
     },
     set name(newValue) {
       this._name = newValue;
     },
   };

   const objProxy = new Proxy(obj, {
     get(target, key) {
       console.log("get----------------key---------", key);
       return Reflect.get(target, key);
     },
     set(target, key, newValue) {
       console.log("set++++++++++key+++++++++++", key);
       let result = Reflect.set(target, key, newValue);
       if (result) {
         console.log("成功设置set------------");
       }
     },
   });

   objProxy.name = "code";
   console.log(objProxy.name);
   ```

3. 解决办法：receiver 是创建出来的代理对象

   ```js
   const obj = {
     _name: "why",
     get name() {
       return this._name;
     },
     set name(newValue) {
       this._name = newValue;
     },
   };

   const objProxy = new Proxy(obj, {
     get(target, key, receiver) {
       console.log("get----------------key---------", key);
       return Reflect.get(target, key, receiver);
     },
     set(target, key, newValue, receiver) {
       console.log("set++++++++++key+++++++++++", key);
       let result = Reflect.set(target, key, newValue, receiver);
       if (result) {
         console.log("成功设置set------------");
       }
     },
   });

   objProxy.name = "code";
   console.log(objProxy.name);
   ```

   1. Reflect.get 方法的第三个参数，是绑定的 this
   2. Reflect.set 方法的第四个参数，是绑定的 this
   3. 其他方法没有 receiver

## Reflect 中的 constructor 作用

```js
function Student(name, age) {
  this.name = name;
  this.age = age;
}

function Teacher() {}

const stu = new Student();
console.log(stu); // 类型为Student

/**
 * 要求：通过Student类创建实例，但该实例的类型是Teacher
 */
const student = Reflect.constructor(Student, ["why", age], Teacher);
console.log(student); // Teacher { name: 'why', age: 18 }
```

## 响应式

```js
let m = 100;

// 要自动重新执行的代码
console.log(m);
console.log(m * 2);
console.log(m ** 2);

m = 200;
```

> 例：m 有一个初始化的值，有一段代码使用了这个值，那么当 m 有一个新值时，这段代码可以**自动重新执行**

### vue3

```js
/** 对象的响应式 */
const obj = {
  name: "why",
  age: 18,
};

function foo() {
  const newName = obj.name;
  console.log("hello, east");
  console.log(obj.name);
}

function bar() {
  console.log("无关函数");
  console.log("普通函数");
}

obj.name = "code";
```

1. 一般会封装一个 需要响应式的函数 的函数

   ```js
   // 封装的函数
   const reactiveFns = [];
   function watchFn(fn) {
     reactiveFns.push(fn);
   }

   const obj = {
     name: "why",
     age: 18,
   };

   watchFn(function foo() {
     const newName = obj.name;
     console.log("hello, east");
     console.log(obj.name);
   });

   watchFn(function demo() {
     console.log("-------------------", obj.name);
   });

   function bar() {
     console.log("无关函数");
     console.log("普通函数");
   }

   obj.name = "code";
   // 手动完成响应式的自动执行代码
   reactiveFns.forEach((fn) => {
     fn();
   });
   ```

   1. 缺点
      1. 依赖收集放在了数组(reactives)中，现在只收集 name，后期有了不同的属性，不方便管理

2. 使用类收集依赖

   ```js
   // 封装的类
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

   const obj = {
     name: "why",
     age: 18,
   };

   const depend = new Depend();

   function watchFn(fn) {
     depend.addDepend(fn);
   }

   watchFn(function foo() {
     const newName = obj.name;
     console.log("hello, east");
     console.log(obj.name);
   });

   watchFn(function demo() {
     console.log("-------------------", obj.name);
   });

   function bar() {
     console.log("无关函数");
     console.log("普通函数");
   }

   obj.name = "code";
   depend.notify();
   ```

   1. 优点
      1. 一个属性对应一个类，便于管理
      2. 在类中封装 notify 方法，自动

3. 自动监听对象的变化 ---- 监听对象的属性变化 Proxy(vue3) / Object.defineProperty(vue2)

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

   const obj = {
     name: "why",
     age: 18,
   };

   const depend = new Depend();

   function watchFn(fn) {
     depend.addDepend(fn);
   }

   watchFn(function foo() {
     const newName = obj.name;
     console.log("hello, east");
     console.log(obj.name);
   });

   watchFn(function demo() {
     console.log("-------------------", obj.name);
   });

   function bar() {
     console.log("无关函数");
     console.log("普通函数");
   }

   // 使用Proxy监听属性变化
   const objProxy = new Proxy(obj, {
     get(target, key, receiver) {},
     set(target, key, newValue, receiver) {
       let result = Reflect.set(target, key, newValue, receiver);
       if (result) {
         depend.notify();
       } else {
         console.log(`${key}属性设置失败`, target);
       }
     },
   });

   objProxy.name = "code";
   ```

4. 依赖收集的管理：一个对象有多个属性 + 有多个对象

   1. 我写的

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

      function watchFn(depend, fn) {
        depend.addDepend(fn);
      }

      const obj = {
        name: "why",
        age: 18,
      };

      const nameDepend = new Depend();
      watchFn(nameDepend, function foo() {
        const newName = obj.name;
        console.log("hello, east");
        console.log(obj.name);
      });
      watchFn(nameDepend, function demo() {
        console.log("-------------------", obj.name);
      });

      const ageDepend = new Depend();
      watchFn(ageDepend, function () {
        console.log("----------age----------", obj.age);
      });

      function bar() {
        console.log("无关函数");
        console.log("普通函数");
      }

      /** obj对象 */
      const objMap = new Map();
      objMap.set("name", nameDepend);
      objMap.set("age", ageDepend);

      /** info对象 */
      const info = {
        address: "广州市",
      };
      const addressDepend = new Depend();
      watchFn(addressDepend, function () {
        console.log("-------info的address--------", info.address);
      });
      const infoMap = new Map();
      infoMap.set("address", addressDepend);

      // 管理obj对象和info对象
      const weakMap = new WeakMap();
      weakMap.set(obj, objMap);
      weakMap.set(info, infoMap);

      // 使用Proxy监听属性变化
      function createProxy(obj) {
        return new Proxy(obj, {
          get(target, key, receiver) {},
          set(target, key, newValue, receiver) {
            let result = Reflect.set(target, key, newValue, receiver);
            if (result) {
              const map = weakMap.get(target);
              const depend = map.get(key);
              depend.notify();
            } else {
              console.log(`${key}属性设置失败`, target);
            }
          },
        });
      }
      const objProxy = createProxy(obj);
      const infoProxy = createProxy(info);

      objProxy.name = "code";
      objProxy.age = 20;
      infoProxy.address = "北京市";
      ```

   2. coderwhy 封装的

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
      // 观察需要响应的函数
      let activeReactiveFn = null;
      function watchFn(fn) {
        activeReactiveFn = fn;
        fn();
        activeReactiveFn = null;
      }
      // 封装一个获取depend的函数
      function getDepend(target, key) {
        let map = weakMap.get(target);
        // 在对象添加[key]属性时，此时weakMap中没有该属性对应的map
        if (!map) {
          map = new Map();
          weakMap.set(target, map);
        }

        // 根据key获取depend对象
        let depend = map.get(key);
        if (!depend) {
          depend = new Depend();
          map.set(key, depend);
        }

        return depend;
      }
      function createProxy(obj) {
        return new Proxy(obj, {
          get(target, key, receiver) {
            const depend = getDepend(target, key);
            depend.addDepend(activeReactiveFn);
            return Reflect.get(target, key, receiver);
          },
          set(target, key, newValue, receiver) {
            let result = Reflect.set(target, key, newValue, receiver);
            if (result) {
              // const map = weakMap.get(target);
              const depend = getDepend(target, key);
              depend.notify();
            } else {
              console.log(`${key}属性设置失败`, target);
            }
          },
        });
      }

      const obj = {
        name: "why",
        age: 18,
      };
      watchFn(function foo() {
        console.log("hello, east");
        console.log(obj.name);
      });
      watchFn(function demo() {
        console.log("-------------------", obj.name);
      });
      watchFn(function () {
        console.log("----------age----------", obj.age);
      });

      /** info对象 */
      const info = {
        address: "广州市",
      };
      watchFn(function () {
        console.log("-------info的address--------", info.address);
      });

      // 管理obj对象和info对象
      const weakMap = new WeakMap();

      const objProxy = createProxy(obj);
      const infoProxy = createProxy(info);

      objProxy.name = "code";
      objProxy.age = 20;
      infoProxy.address = "北京市";
      ```

5. 优化

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

### Vue2

```js
function reactive(obj) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    Obejct.defineProperty(obj, key, {
      get(target, key, receiver) {
        const depend = getDepend(target, key);
        depend.addDepend(activeReactiveFn);
        return value;
      },
      set(target, key, newValue, receiver) {
        value = newValue;
        const depend = getDepend(target, key);
        depend.notify();
      },
    });
  });

  return obj;
}
```

## 三、Vue 的响应式原理
