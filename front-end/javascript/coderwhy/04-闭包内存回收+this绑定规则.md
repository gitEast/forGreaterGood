<!--
 * @Author: East
 * @Date: 2021-12-30 09:53:39
 * @LastEditTime: 2022-01-01 15:10:39
 * @LastEditors: Please set LastEditors
 * @Description: 闭包内存回收 + this 的四个绑定规则
 * @FilePath: \forGreaterGood\javascript\04-闭包内存回收+this绑定规则.md
-->

# 闭包内存回收 + this 的四个绑定规则

## 一、闭包内存回收

### 闭包内存泄露案例

```js
function createFnArray() {
  var arr = new Array(1024 * 1024).fill(1);
  /** 计算大小
   * 1. 整数 4 byte
   * 2. 4 byte * 1024 * 1024 = ?
   * 3. 4 kb * 1024 = 4 M
   */

  return function () {
    console.log(arr.length);
  };
}

var arrayFns = [];
for (var i = 0; i < 100; i++) {
  arrayFns.push(createFnArray());
}

setTimeout(() => {
  arrayFns = null;
}, 2000);
```

- 内存查看
  - devtools -> Performance -> Memory √ -> Start profilling ...(第二个按钮)

### v8 引擎具体实现

v8 引擎对闭包的上级作用域中，用不到的属性，会销毁

- v8 的性能比较好，因为做了许多细节的优化

## 二、JS 函数的 this 指向

### why need this?

- 常见编程语言中，几乎都有 this (Objective-C 中使用的是 self)
- 但 js 中的 this 和常见的面向对象语言中的 this 不太一样
  1. 常见面向对象编程语言(C++, Java, Swift)中，this 通常只会出现在类似的方法中
  2. 即需要有一个类，在类的方法中，this 代表的是当前调用对象
  3. 但 js 中的 this 更为灵活，无论是它出现的位置还是它代表的含义
- this 的作用
  1. 从某些角度来说，开发中如果没有 this，很多问题也是有解决方案的
     ```js
     var obj = {
       name: "east",
       eating: function () {
         console.log(`${obj.name} 在吃东西。`);
       },
       running: function () {
         console.log(`${obj.name} 在跑步。`);
       },
       studying: function () {
         console.log(`${obj.name} 在学习。`);
       },
     };
     ```
     - 弊端：但没有 this，会使得代码的编写非常不方便
       - what if obj 的名字改变了
       - 有别的类似于 obj 的对象(应该可以复用，但没有复用的办法)

### this 在全局作用域指向什么

1. 在大多数情况下，this 都是出现在函数中
2. 在全局作用域下
   - 浏览器：window(globalObject)
   - Node 环境：{}
     1. node 中会把一个文件当作一个模块，加载 -> 编译 -> 放到一个函数 -> 执行这个函数 call
     2. .call({})

### this 的使用

1. 但是，开发中很少直接在全局作用域下去使用 this，通常都是在**函数中使用**
   ```js
   函数调用栈: {
     一个函数被调用: {
       执行上下文: {
         VO: AO,
         scopeChain: 作用域链,
         this: 动态绑定
       },
       要执行的代码: { ...code }
     },
     另一个函数: { ... }
   }
   ```
   1. 所有函数在被调用时，都会创建一个执行上下文
   2. 这个执行上下文中记录着函数的调用栈、AO 对象等
   3. this 也是其中的一条记录
2. 同一个函数的 this 的不同

   ```js
   function foo() {
     console.log(this);
   }

   // 1. 直接调用
   foo();

   // 2. 创建一个对象，对象中的函数指向 foo
   var obj = {
     name: "east",
     foo: foo,
   };
   obj.foo();

   // 3. apply 调用
   foo.apply("abc");
   ```

   1. this 指向什么，跟函数所处的位置没有关系
   2. 跟函数**被调用的方式**有关系
   3. 即，**运行时绑定**

### this 的绑定规则

#### 1. 默认绑定

<u>**独立函数调用**</u>

1. 案例一

   ```js
   function foo1() {
     console.log(this)
   }

   function foo2() {
     console.log(this)\
     foo1()
   }

   function foo3() {
     console.log(this)
     foo2()
   }

   foo3() // window, window, window
   ```

2. 案例二

   ```js
   var obj = {
     name: "east",
     foo: function () {
       console.log(this);
     },
   };

   var bar = obj.foo;
   bar(); // window
   ```

3. 案例三

   ```js
   function foo() {
     console.log(this);
   }
   var obj = {
     name: "east",
     foo: foo,
   };

   var bar = obj.foo;
   bar(); // window
   ```

4. 案例四

   ```js
   function foo() {
     return function () {
       console.log(this);
     };
   }

   var fn = foo();
   fn(); // window
   ```

#### 2. 隐式绑定

<u>**通过某个对象进行调用**，即在它的调用位置中，是通过某个对象发起的函数调用</u>

1. 案例一

   ```js
   function foo() {
     return function () {
       console.log(this);
     };
   }

   var fn = foo();
   fn(); // window
   var obj = {
     name: "east",
     bar: fn,
   };
   obj.bar(); // obj 对象
   ```

2. 案例二

   ```js
   var obj = {
     name: "east",
     eating: function () {
       console.log(`${this.name} 在吃东西。`);
     },
     running: function () {
       console.log(`${this.name} 在跑步。`);
     },
     studying: function () {
       console.log(`${this.name} 在学习。`);
     },
   };

   obj.eating();
   obj.running();
   ```

3. 案例三

   ```js
   var obj1 = {
     name: "obj1",
     foo: function () {
       console.log(this);
     },
   };

   var obj2 = {
     name: "obj2",
     bar: obj1.foo,
   };

   obj2.bar(); // obj2 对象
   ```

#### 3. 显式绑定

- 隐式绑定有一个前提条件
  1. 必须在调用的对象内部有一个对函数的引用(比如一个属性)
  2. 如果没有这样的引用，在进行调用时，会报找不到该函数的错误
  3. 正是通过这个引用，间接地将 this 绑定到了这个对象上
- 如果不希望在**对象内部**包含这个函数的引用，同时又希望在这个对象上进行强制调用，该怎么做？
  1. js 所有的函数都可以使用 call 和 apply 方法(与 prototype 有关)
  2. 这两个函数的第一个参数都要求是一个对象，这个对象就是给 this 准备的
  3. 在调用这个函数时，会将 this 绑定到这个传入的对象上
- call 和 apply 的区别

  ```js
  function sum(num1, num2) {
    console.log(num1 + num2, this);
  }

  sum.call("call", 20, 30, 40);
  sum.apply("apply", [20, 30, 40]);
  ```

- 不同的显式绑定三：bind

  ```js
  function foo() {
    console.log(this);
  }

  var newFoo = foo.bind("aaa");
  newFoo(); // String("aaa")
  ```

#### 4. new 绑定

- js 中的函数可以当作一个类的构造函数来使用，即使用 new 关键字
- 使用 new 关键字来调用函数时，会执行如下的操作：
  1. 创建一个全新的对象
  2. 这个新对象会被执行 prototype 连接
  3. 这个新对象会绑定到函数调用的 this 上(this 绑定在这个步骤完成)
  4. 如果函数没有返回其他对象，表达式会返回这个新对象
