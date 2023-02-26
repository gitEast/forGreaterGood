<!--
 * @Author: East
 * @Date: 2022-02-09 17:08:07
 * @LastEditTime: 2022-02-10 13:54:47
 * @LastEditors: Please set LastEditors
 * @Description: React 准备
 * @FilePath: \react\02-react入门.md
-->

# React 准备

## 一、官网

- [英文官网](https://reactjs.org/) https://reactjs.org/
- [中文官网](https://react.docschina.org/) https://react.docschina.org/

## 二、React 的基本使用

### 2.1 使用前提

- 三个基本文件
  - react.development.js -- react 核心库
  - react-dom.development.js -- react 扩展库，支持 react 操作 dom
  - babel.min.js -- 将 jsx 语法解析成 js 语法
- 顺序：先 react.development.js ，后 react-dom.development.js
  - 核心就位，周边才能配合工作
- `script` 标签的类型必须是 `type="text/babel"`

### 2.2 简单实用

- hello_react.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <!-- 移动端适配 -->
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <script
        src="https://unpkg.com/react@17/umd/react.development.js"
        crossorigin
      ></script>
      <script
        src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
        crossorigin
      ></script>
      <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    </head>
    <body>
      <div id="test"></div>

      <script type="text/babel">
        // 1. 创建虚拟 DOM
        const VDOM = <h1>Hello, React</h1>;
        // 2. 渲染虚拟 DOM 到页面，.render(虚拟 DOM, 容器)
        ReactDOM.render(VDOM, document.getElementById("test"));
      </script>
    </body>
  </html>
  ```

  - `ReactDOM.render(虚拟 DOM, 容器)` 是覆盖操作
    - 追加需要通过组件的方式

- React 创建虚拟 DOM 方法
  1. jsx
     ```js
     const VDOM = <h1 id="title">Hello, React</h1>;
     ReactDOM.render(VDOM, document.getElementById("test"));
     ```
     - js 写法的语法糖
  2. 纯 JavaScript
     ```js
     const VDOM = React.createElement("h1", { id: "title" }, "Hello, React");
     ReactDOM.render(VDOM, document.getElementById("test"));
     ```
- 虚拟 DOM
  - 本质是 Object 类型的对象（一般对象）
  - 虚拟 DOM 比较“轻”，真实 DOM 比较“重”
    - 因为：虚拟 DOM 在 React 内部使用(够用就行)，无需真实 DOM 上那么多属性
  - 虚拟 DOM 最终会被 React 转化为真实 DOM，呈现在页面上

## 三、React JSX

> react 定义的一种类似于 XML 的 JS 扩展语法：JS + XML

### 1. XML

- 早期用于存储和传输数据
  ```xml
  <student>
    <name>Tom</name>
    <age>19</age>
  </student>
  ```
  - 缺点：存储的结构比内容还多
- 后来改用 JSON
  ```json
  "{"name":"Tom", "age": 19}"
  ```

### 2. jsx 语法规则

1. 定义虚拟 DOM，不写引号 `const VDOM = <h1>AAA</h1>`，可以有 `()`
2. 标签中混入 **JS 表达式**，要用 {}

   ```js
   const myId = "east";
   const myName = "DongFeng";

   const VDOM = <h1 id={myId}>{myName}</h1>;
   ```

3. 样式的类名指定使用 `className`，因为 class 是 ES6 的定义类关键字
4. 内联样式，要用 style={{key:value}} 的形式写

   ```js
   const VDOM = <h1 style={{ color: "orange", fontSize: "29px" }}>AAA</h1>;
   ```

5. 只有一个根标签
6. 标签必须闭合
7. 标签首字母
   - 若小写字母开头，即在 HTML 中寻找同名标签，若无，则报错
   - 若大写字母开头，react 就去渲染对应的组件，若组件没有定义，则报错

### 3. 数组遍历小练习

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- 移动端适配 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script
      src="https://unpkg.com/react@17/umd/react.development.js"
      crossorigin
    ></script>
    <script
      src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
      crossorigin
    ></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  </head>
  <body>
    <div id="test"></div>

    <script type="text/babel">
      // 模拟一些数据
      const data = ["Angular", "React", "Vue"];

      // 1. 创建虚拟 DOM
      const VDOM = (
        <div>
          <h1>前端js框架列表</h1>
          <ul>
            {data.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
          </ul>
        </div>
      );
      // 2. 渲染虚拟 DOM 到页面，.render(虚拟 DOM, 容器)
      ReactDOM.render(VDOM, document.getElementById("test"));
    </script>
  </body>
</html>
```

- 补充：js 语句（代码）与 js 表达式
  - js 表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方
    - a
    - a + b
    - fn(param)
    - arr.map()
    - fn() {}
  - js 语句（代码）：控制代码走向
    - if ... else ...
    - for (...) {...}
    - switch (...) {...}

## 四、模块与组件、模块化与组件化的理解

### 1. 模块

1. 向外提供特定功能的 js 程序，一般就是一个 js 文件（模块）
2. 为什么要拆成模块：随着业务逻辑增加，代码越来越 [多 + 复杂]
3. 作用：复用 js，简化 js 的编写，提高 js 运行效率

### 2. 组件

1. 定于：用于实现**局部功能**效果的**代码和资源的集合**
2. why：一个界面的功能更复杂
3. 作用：复用编码，简化项目编码，提高运行效率

### 3. 模块化

> 应用的 js 以模块来编写

#### 4. 组件化

> 应用以多组件的方式实现
