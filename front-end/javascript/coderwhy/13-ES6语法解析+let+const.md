<!--
 * @Author: East
 * @Date: 2022-01-12 13:57:15
 * @LastEditTime: 2022-01-13 09:16:39
 * @LastEditors: Please set LastEditors
 * @Description: ES6 语法解析 + let + const
 * @FilePath: \forGreaterGood\javascript\13-ES6语法解析+let+const.md
-->

# ES6 语法解析 + let + const

## 一、继承内置类

- 创建一个类，如果没有写继承，默认继承 `Object` 类
- 创建一个类，继承自内置类

  ```js
  class MyArray extends Array {
    constructor() {}

    firstItem() {
      return this[0];
    }

    lastItem() {
      return this[this.length - 1];
    }
  }
  var arr = MyArray(1, 2, 3);
  console.log(arr.firstItem());
  console.log(arr.lastItem());
  ```

## 二、类的混入 Mixin

> 并不是说真的有 mixin 的关键字，而是通过技巧实现混入

- why 需要技巧实现 mixin？
  - js 只支持**单继承**
- 实现

  ```js
  class Person {}

  function mixinRunner(BaseClass) {
    class NewClass extends BaseClass {
      running() {
        console.log("running");
      }
    }

    return NewClass;
  }

  class Student extends Person {}

  var NewStudent = mixinRunner(Student);
  var ns = new NewStudent();
  ns.running();
  ```

## 三、多态

> 面向对象三大特性：封装、继承、多态。有把 抽象 也认为是面向对象一大特性。

### 1. 定义

- 维基百科
  - polymorphism：为不同数据类型的实体提供统一的接口，或使用一个单一的符号来表示多个不同的类型
- coderwhy：不同的数据类型进行同一个操作，表现出不同的行为，就是多态的体现

### 2. 传统意义上的多态

```ts
class Shape {
  getArea() {}
}

class Rectangle extends Shape {
  getArea() {
    return 100;
  }
}

class Circle extends Shape {
  getArea() {
    return 200;
  }
}

var r = new Rectangle();
var c = new Circle();

function calcArea(shape: Shape) {
  console.log(shape.getArea());
}

calcArea(r);
calcArea(c);
```

- 要求
  1. 必须有继承(多态的前提)
  2. 必须重写母类的方法
  3. 必须有母类的引用指向女类

### 3. js 面向对象多态

```js
function calcArea(foo) {
  console.log(foo.getArea());
}

var obj1 = {
  name: "why",
  getArea: function () {
    return 100;
  },
};

class Person {
  getArea() {
    return 1000;
  }
}
var p = new Person();

calcArea(obj1);
calcArea(p);
```

## 四、ES6 知识点讲解

### 1. 字面量增强的写法

Enhanced Object Literals 增强对象字面量

```js
var name = "why";
var age = 18;

var obj = {
  // 1. property shorthand (属性的简写)
  name,
  age,

  foo: function () {},
  foo1() {}, // 2. method shorthand (方法的简写)
  foo2: () => {}, // 这个方法不同，绑定上层作用域的 this

  // 3. computed property name (计算属性名)
  [name + 123]: "hehehe",
};
```

### 2. Destructuring 解构

- 数组的解构
  ```js
  var names = ["a", "b", "c"];
  var [item1, item2, item3] = names; // 对数组的解构
  var [, , itemz] = names; // itemz = 'c'
  var [itema, ...newNames] = names; // itema = 'a', newNames=['b', 'c'] -- 与 function (...args) {} 相似
  var [a, b, c, d = "aaa"] = names; // d本为undefined，被设了默认值'aaa'
  ```
- 对象的解构
  ```js
  var obj = {
    name: "why",
    age: 18,
    height: 1.88,
  };
  var { age, name, height } = obj; // 与顺序无关，有 key 就是了不起
  var { name: newName = "aaa" } = obj; // newName = 'why' --- 改名
  ```

### 3. let 与 const

- let

  - 从直观上来看，`let` 和 `var` 没有太大的区别
  - 不可重复定义变量名

- const

  - 常量(or 衡量)，赋完值后不可修改
  - 不过都叫变量声明 constant variable
  - 本质上值不可修改
    - 如果保存的是一个内存地址，引用对象内部可以更改
  - 不可重复定义变量名

- let-const 的作用域提升

  ```js
  /** var 的作用于提升 */
  console.log(foo);
  var foo = "foo";

  /** let 与 const
   * 没有作用域提升：有争议的一句话
   */
  console.log(bar);
  let bar = "bar";
  ```

  - 使用 const 或 let 创建变量时，这些变量会被创建在包含它们的词法环境被实例化时，但是**不可以访问**，直到被赋值
    - 词法环境在执行上下文中

* 与 window 的关系
  ```js
  var foo = "foo"; // 被添加到 window 中，作为 window 的属性
  ```
  - es3 以前：GO = window
    - Every execution context has associated with it a variable object. Variables and functions declared inthe source text are added as properties of the variable object. For function code, parameters are added as properties of the variable object.
  - es6 之后(v8)：VE 实现为 variables\_:VariableMap，v8 不实现 window，window 由浏览器添加的全局对象，并保持 window 和 var 之间值的相等性 --> 相等是为了兼容早期代码
    - Every execution context has an associated VariableEnvironment. Variables and functions declared in ECMAScript code evaluated in an execution context are added as bindings in that VariableEnvironment's Environment Record. For function code, parameters are also added as bindings to that Environment Record.

### 4. 块级作用域

```js
/** 块代码 block code */
/* ES5 */
// 1. 形同虚设
{
  var foo = "foo";
}
console.log(foo);
// 2. 全局作用域
// 3. 函数作用域
function bar() {
  var baz = "baz";
}
console.log(baz);

/* ES6 */
// 1. 块级作用域对 var 不起作用
// 2. let/const/function/class 声明的类型是有效的
// 3. 不同浏览器对 function 有不同实现
{
  function demo() {
    console.log("demo");
  }
}
demo(); // 为了兼容以前的代码，function 没有作用域
// 4. if/switch/for 语句的代码也是块级作用域
```

- function 没有块级作用域 ---- 大部分浏览器为了兼容以前的代码
  - 如果该浏览器**只支持 ES6**，则 **function 有块级作用域**
