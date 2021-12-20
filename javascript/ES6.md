<!--
 * @Author: your name
 * @Date: 2021-10-23 16:59:44
 * @LastEditTime: 2021-10-24 10:16:12
 * @LastEditors: Please set LastEditors
 * @Description: ES6知识点
 * @FilePath: \知识点\ES6.md
-->

# ES6 知识点

## 字面量增强的写法

```js
var obj = {}; // 相当于 var obj = new Object()

var age = 18;
var address = "上海市";
var info = { age, address }; // property shorthand 属性的简写

var fns = {
  age,
  foo() {}, // method shorthand 方法的简写
};

var name = "111";
var bar = {
  age,
  foo() {},
  [name + "22"]: "数字", // computed property names 计算属性名
};
```

1. 属性的简写
2. 方法的简写
3. 计算属性名

## Destructuring 解构

- 数组的解构
  ```js
  var names = ["a", "b", "c"];
  var [item1, item2, item3] = names; // 对数组的解构
  var [, , itemz] = names; // itemz = 'c'
  var [itema, ...newNames] = names; // itema = 'a', newNames=['b', 'c']
  var [a, b, c, d = "aaa"] = names; // d本为undefined，被设了默认值'aaa'
  ```
- 对象的解构
  ```js
  var obj = {
    name: "why",
    age: 18,
    height: 1.88,
  };
  var { age, name, height } = obj; // 与顺序无关
  var { name: newName = "aaa" } = obj; // newName = 'why'
  ```

## let 与 const

- 使用 const 或 let 创建变量时，这些变量会被创建在包含它们的词法环境被实例化时，但是不可以访问，知道词法绑定被求值
- 与 window 的关系
  - es3 以前：GO = window
  - es6 之后(v8)：VE 实现为 variables\_:VariableMap，v8 不实现 window，window 由浏览器添加的全局对象，并保持 window 和 var 之间值的相等性
- 块级作用域
  - function 没有块级作用域 ---- 大部分浏览器为了兼容以前的代码
    - 如果该浏览器只支持 ES6，则 function 有块级作用域

## 模板字符串

## 函数

### 默认参数

```js
function foo(m, n) {
  console.log(m, n);
}

foo(); // undefined, undefined
```

1. ES5 以及之前 给参数默认值

   ```js
   function foo(m, n) {
     m = m || "aaa";
     n = n || "bbb";

     console.log(m, n);
   }
   foo(); // 'aaa' 'bbb'
   ```

   1. 写起来很麻烦，需要用到逻辑或
   2. 有 bug ---- 若传入 0 or ''，则会导致值变成默认值

2. ES6

   ```js
   function foo(m = "aaa", n = "bbb") {
     console.log(m, n);
   }
   foo();

   /** 转ES5 */
   ("use strict");

   function foo() {
     var m =
       arguments.length > 0 && arguments[0] !== undefined
         ? arguments[0]
         : "aaa";
     var n =
       arguments.length > 1 && arguments[1] !== undefined
         ? arguments[1]
         : "bbb";
     console.log(m, n);
   }

   foo();
   ```

### 剩余参数

### 箭头函数的补充

- 莫得显式原型 --> 无法使用 new 关键字调用
- 莫得 arguments

## 展开语法 -- 展开运算符

## Symbol

- 是函数
- ES6 中，对象的 key，可以是字符串，也可以是 Symbol
- Symbol 作为 key 时，遍历对象时无法获取
  - 使用 Object.getOwnPropertySymbols() 才能获取到
- Symbol 的方法
  - Symbol.for(value) ---- 可以获取到相同值的变量
  - Symbol.keyFor(\[symbol]) ---- 获取 Symbol 变量的变量值

## Set

- 在 ES6 之前，存储数据的解构主要有 数组 + 对象
- ES6 新增 Set + Map，以及它们的另外形式 WeakSet + WeakMap

1. 类似于数组，但**元素不能重复**
2. 使用与方法
   1. `const set = new Set()`
   2. add
   3. `set.delete(item)`
   4. `set.has(item)`
   5. `set.clear()`
   6. 遍历
      1. forEach
      2. for 循环， for-of 遍历

## WeakSet

- 与 Set 类似的结构
- 与 Set 不同点
  - WeakSet 中只能存放**对象**类型，而不能存放基本数据类型
  - WeakSet 对对象的引用是弱引用(weak reference)
    - 强引用(strong reference) ---- 不会被 GC 回收
    - 弱引用 ---- 不妨碍 GC 的回收
- 使用方法
  - 创建 ---- `const weakSet = new WeakSet()`
  - 新增元素
    ```js
    let obj = {
      name: "why",
    };
    const weakSet = new WeakSet();
    weakSet.add(obj);
    obj = null; // GC可以回收{ name: 'why' }
    ```
  - delete
  - has
  - 没有 clear 方法
  - 无法遍历
- 应用场景

  ```js
  /** 场景 */
  class Person {
    running() {
      console.log("running");
    }
  }

  const p = new Person();
  p.running();
  p.running.call({ name: "why" });

  /** 如果不允许194行代码的出现，只允许Person实例调用running方法 */
  const personSet = new WeakSet();
  class Person {
    constructor() {
      personSet.add(this);
    }
    running() {
      if (personSet.has(this)) {
        throw new Error("不能通过非构造方法创建出来的对象调用running方法");
      }
      console.log("running");
    }
  }

  const p = new Person();
  p.running();
  p.running.call({ name: "why" }); // 报错
  ```

## Map

- 存储映射关系，key-value
  - 与对象的区别
    - 对象：key 必须是字符串(ES6 之后可以用 Symbol)
    - Map：可以使用任何类型作为 key，如对象
- 使用

  - 新增元素

    ```js
    const obj1 = { name: "why" };
    const obj2 = { name: "code" };

    const map = new Map();

    map.set(obj1, "aaa");
    map.set(obj2, "bbb");
    map.set(1, "ccc");
    ```

  - 放入数组
    ```js
    const map = new Map([
      [obj1, "aaa"],
      [obj2, "bbb"],
      [1, "ccc"],
    ]);
    ```
  - `let length = map.size`
  - get ---- 获取 value
  - has
  - delete
  - clear
  - 遍历
    - forEach ---- item 对应的是 value，(item, key)
    - for-of ---- item 为数组格式，`[key, value]`

## WeakMap

- 与 Map 类似，也是键值对形式存在
- 与 Map 不同
  - WeakMap 的 key 只能是对象
  - 弱引用
- 使用方法
  - get
  - set
  - 莫得 size 属性
  - has
  - delete
  - 无法遍历
  - 无法打印 ---- `{<item unknown>}`
- 应用场景 ---- vue3 响应式原理

  ```js
  const obj1 = {
    name: "why",
    age: 18,
  };
  function obj1NameFn1() {
    console.log("obj1NameFn1被执行");
  }
  function obj1NameFn2() {
    console.log("obj1NameFn2被执行");
  }
  function obj1AgeFn1() {
    console.log("obj1AgeFn1被执行");
  }
  function obj1AgeFn2() {
    console.log("obj1AgeFn2被执行");
  }

  const obj2 = {
    name: "code",
    height: 1.88,
    address: "广州市",
  };
  function obj2NameFn1() {
    console.log("obj2NameFn1被执行");
  }
  function obj2NameFn2() {
    console.log("obj2NameFn2被执行");
  }

  // 开始关联数据
  const weakMap = new WeakMap();
  const map = new Map();
  map.set(name, [obj1NameFn1, obj1NameFn2]);
  map.set(age, [obj1AgeFn1, obj1AgeFn2]);
  weakMap.set(obj1, map);

  const map2 = new Map()
  map2.set(name, [obj2NameFn1, obj2NameFn2])
  weakMap.set(obj2, map2)
  ```
