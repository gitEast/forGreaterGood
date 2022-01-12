<!--
 * @Author: East
 * @Date: 2022-01-12 13:57:15
 * @LastEditTime: 2022-01-12 16:55:54
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

```js

```
