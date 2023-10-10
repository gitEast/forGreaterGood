<!--
 * @Author: East
 * @Date: 2022-01-03 13:47:46
 * @LastEditTime: 2022-01-03 16:37:29
 * @LastEditors: Please set LastEditors
 * @Description: with + eval + 严格模式 + 面向对象
 * @FilePath: \forGreaterGood\javascript\08-with+eval+严格模式+面向对象.md
-->

# 额外知识补充 + 面向对象

## 一、额外知识补充

### 1. with

with 可以形成自己的作用域

```js
var obj = {
  name: "east",
  age: 22,
  msg: "obj",
};

function foo() {
  var msg = "foo";
  with (obj) {
    console.log(name); // 'east'
    console.log(msg); // 'obj'
  }
}
```

_目前已经不推荐用 `with` 了_

- 会产生混淆错误和兼容性问题

### 2. eval

- 可以将传入的字符串当作 JavaScript 代码来运行
- 不建议在开发中使用 eval：
  1. `eval` 代码的可读性非常差(代码的可读性是高质量代码的重要原则)
  2. `eval` 是一个字符串，那么有可能在执行的过程中被可以篡改，可能会造成被攻击的风险
  3. `eval` 的执行必须经过 js 解释器，不能被 js 引擎优化

### 3. 严格模式

- ES5 标准中，提出了<span style="color: red;">严格模式(Strict Mode)</span>的概念
  - 一种具有**限制性**的 js 模式，从而使代码隐式地脱离了“懒散模式(sloppy mode)”
  - 支持严格模式的浏览器在检测到代码中有严格模式时，会以更加严格的方式对代码进行**检测和执行**
- 使用
  - 在文件顶部加上 `"use strict";`
- 严格模式对正常的 js 语义进行了一些限制

  - 通过<span style="color: red;">抛出错误</span>来消除一些原有的<span style="color: red;">“静默(silent)错误”</span>

    ```js
    123.name = 'abc'

    var obj = {}
    Object.defineProperty(obj, "name", {
      writable: false
    })
    obj.name = '123'
    ```

  - 严格模式让 js 引擎在执行代码时可以进行更多的优化(不需要对一些特殊的语法进行处理)
  - 禁用了在 ECMAScript 未来版本中可能会定义的一些语法

- 严格模式的开启：支持粒度化的迁移
  1. 在 js 文件中开启
  2. 对某一个函数开启
- 严格模式的限制

  1. 禁止意外创建全局变量 --> 要求定义 message
     ```js
     function () {
       message = 'hello' // message 为全局变量
     }
     ```
  2. 不允许函数有相同的参数名称
     ```js
     function foo(x, y, x) {
       console.log(x, y, x);
     }
     foo(10, 20, 30); // 30, 20, 30
     ```
  3. 静默错误
     ```js
     true.name = "east";
     NaN = 123;
     ```
  4. 不允许使用原先的八进制格式

     ```js
     var num = 0123;

     var num1 = 0o123; // 新写法
     ```

  5. 不允许使用 `with` 语句
  6. `eval` 不会向上引用变量了

     ```js
     var jsString = "var msg = 'hello world'; console.log(msg)";
     eval(jsString);

     console.log(msg); // 本来可以打印，开启严格模式后不能打印了会报未定义
     ```

  7. 严格模式下，this 的指向
     - 自执行函数(默认绑定)的 this 指向 `undefined`
     - setTimeout(fn) 中 fn 的 this 指向 `window`

## 二、面向对象

### 引入

1. 面向对象是现实的抽象方式
   - 对象是 js 中一个非常重要的概念，它可以将<span style="color: blue;">多个相关联的数据封装</span>到一起，更好的描述一个事物
   - 用对象来描述事物，更有利于我们将现实的事物，抽离成代码中某个<span style="color: blue;">数据结构</span>
2. js 的面向对象
   1. js 的对象被设计成一组**属性的无序集合**，像是一个哈希表，由 key 和 value 组成
   2. key 是一个标识符名称；value 可以是任意类型，也可以是其他对象或函数类型
   3. 如果 value 是一个函数，那么我们可以称之为是对象的方法

### 操作

1. 创建方式
   - `var obj = new Object()`
   - `var obj = {}`: 字面量方式
2. 获取属性：`obj.name`
3. 给属性赋值：`obj.name = 'east'`
4. 删除属性：`delete obj.name`
5. 限制属性 --- by **`Object.defineProperty`**

   ```js
   var obj = {
     name: "east",
     age: 22,
   };
   Object.defineProperty(obj, "height", {
     value: 1.88,
   });
   ```

### 属性描述符 `Object.defineProperty`

- `Object.defineProperty` 属性描述符有两种类型
  - 数据属性描述符(Data Properties Descriptor)
  - 存取属性描述符(Accessor Properties Descriptor)
    |属性描述符| configurable|enumerable|value|writable|get|set|
    |---|---|---|---|---|---|---|
    |数据属性描述符|可以|可以|可以|可以|不可以|不可以|
    |存取属性描述符|可以|可以|不可以|不可以|可以|可以|
- 描述符详解
  1. configurable
     - 直接在对象上定义某个属性时，该属性的 `[[configurable]]` 为 `true`
     - 通过属性描述符定义某个属性时，该属性的 `[[configurable]]` 为 `false`
       - 不可删除
       - 不可重新设为 `true`
     - 默认 `false`
  2. enumerable
  3. writable
  4. value
     - 默认 `undefined`
  5. get
     ```js
     var obj = {
       name: "east",
       age: 22,
       _address: "北京市",
     };
     Object.defineProperty(obj, "address", {
       configurable: true,
       enumerable: true,
       get: function () {
         return this._address;
       },
       set: function (newVal) {
         this._address = newVal;
       },
     });
     ```
  6. set
     - 见 `[[get]]`
- 使用存取属性描述符的情况
  1. 隐藏某一个私有属性，不希望直接被外界使用和赋值
  2. 如果希望截获某一个属性访问和设置值的过程
